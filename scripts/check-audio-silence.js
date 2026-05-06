const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const songsPath = path.join(rootDir, "data", "songs.json");
const textReportPath = path.join(rootDir, "data", "audio-silence-report.txt");
const jsonReportPath = path.join(rootDir, "data", "audio-silence-report.json");
const sampleRate = Number(process.env.SILENCE_SAMPLE_RATE || 16000);
const windowMs = Number(process.env.SILENCE_WINDOW_MS || 50);
const thresholdDb = Number(process.env.SILENCE_THRESHOLD_DB || -45);
const clipStages = (process.env.SILENCE_CLIP_STAGES || "1,2,4,7,11,16")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Boolean);
const maxSeconds = Math.max(...clipStages);
const concurrency = Number(process.env.SILENCE_CONCURRENCY || 4);
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";

function sampleToDb(value) {
  if (value <= 0) {
    return -Infinity;
  }

  return 20 * Math.log10(value / 32768);
}

function rmsToDb(sumSquares, sampleCount) {
  if (sampleCount <= 0) {
    return -Infinity;
  }

  return sampleToDb(Math.sqrt(sumSquares / sampleCount));
}

function decodeFirstSeconds(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-t",
      String(maxSeconds),
      "-i",
      input,
      "-vn",
      "-ac",
      "1",
      "-ar",
      String(sampleRate),
      "-f",
      "s16le",
      "pipe:1",
    ]);
    const stdout = [];
    const stderr = [];

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(Buffer.concat(stderr).toString("utf8").trim() || `ffmpeg exited with ${code}`));
        return;
      }

      resolve(Buffer.concat(stdout));
    });
  });
}

function analyzePcm(buffer) {
  const totalSamples = Math.floor(buffer.length / 2);
  const samplesPerWindow = Math.max(1, Math.floor((sampleRate * windowMs) / 1000));
  const stageStats = new Map(clipStages.map((stage) => [stage, { peak: 0, sumSquares: 0, count: 0 }]));
  let firstAudibleSecond = null;

  for (let startSample = 0; startSample < totalSamples; startSample += samplesPerWindow) {
    const endSample = Math.min(startSample + samplesPerWindow, totalSamples);
    let peak = 0;
    let sumSquares = 0;

    for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
      const sample = buffer.readInt16LE(sampleIndex * 2);
      const absolute = Math.abs(sample);
      peak = Math.max(peak, absolute);
      sumSquares += sample * sample;
    }

    const count = endSample - startSample;
    const windowDb = rmsToDb(sumSquares, count);
    const windowStartSecond = startSample / sampleRate;

    if (firstAudibleSecond === null && windowDb >= thresholdDb) {
      firstAudibleSecond = Number(windowStartSecond.toFixed(3));
    }

    for (const [stage, stats] of stageStats) {
      if (windowStartSecond < stage) {
        stats.peak = Math.max(stats.peak, peak);
        stats.sumSquares += sumSquares;
        stats.count += count;
      }
    }
  }

  const stages = Object.fromEntries(
    [...stageStats.entries()].map(([stage, stats]) => {
      const rmsDb = rmsToDb(stats.sumSquares, stats.count);

      return [
        `${stage}s`,
        {
          audible: rmsDb >= thresholdDb,
          rmsDb: Number.isFinite(rmsDb) ? Number(rmsDb.toFixed(2)) : null,
          peakDb: stats.peak > 0 ? Number(sampleToDb(stats.peak).toFixed(2)) : null,
        },
      ];
    }),
  );

  return {
    firstAudibleSecond,
    stages,
  };
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function run() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function getSilentByStage(results) {
  return Object.fromEntries(
    clipStages.map((stage) => [
      `${stage}s`,
      results.filter((result) => result.ok && !result.stages[`${stage}s`].audible),
    ]),
  );
}

function formatTextReport(report) {
  const lines = [
    "VOCALOID Heardle Audio Silence Report",
    `Checked at: ${report.checkedAt}`,
    `Threshold: ${report.thresholdDb} dB RMS over ${report.windowMs}ms windows`,
    `Songs checked: ${report.checkedCount}`,
    `Decode errors: ${report.errorCount}`,
    "",
    "Songs with no audible audio by clip length",
  ];

  for (const stage of clipStages) {
    const key = `${stage}s`;
    const songs = report.silentByStage[key];
    lines.push("", `${key}: ${songs.length}`);

    if (songs.length === 0) {
      lines.push("  none");
      continue;
    }

    for (const song of songs) {
      lines.push(`  ${song.vocadbId} - ${song.title} (${song.artist}) first audible: ${song.firstAudibleSecond ?? "none by " + maxSeconds + "s"}`);
    }
  }

  if (report.errors.length > 0) {
    lines.push("", "Decode errors");
    for (const error of report.errors) {
      lines.push(`  ${error.vocadbId} - ${error.title}: ${error.error}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const songs = JSON.parse(await fs.readFile(songsPath, "utf8"));
  const playableSongs = songs.filter((song) => song.audioClip);

  console.log(`Checking ${playableSongs.length} songs with ${ffmpegPath}...`);
  console.log(`Threshold: ${thresholdDb} dB, stages: ${clipStages.join(", ")}s`);

  const results = await mapWithConcurrency(playableSongs, concurrency, async (song, index) => {
    if ((index + 1) % 25 === 0 || index === playableSongs.length - 1) {
      console.log(`  ${index + 1}/${playableSongs.length}`);
    }

    try {
      const pcm = await decodeFirstSeconds(song.audioClip);
      const analysis = analyzePcm(pcm);

      return {
        ok: true,
        vocadbId: song.vocadbId,
        title: song.title,
        artist: song.suggestionArtistString || song.artistString || song.artist,
        audioClip: song.audioClip,
        ...analysis,
      };
    } catch (error) {
      return {
        ok: false,
        vocadbId: song.vocadbId,
        title: song.title,
        artist: song.suggestionArtistString || song.artistString || song.artist,
        audioClip: song.audioClip,
        error: error.message,
      };
    }
  });

  const okResults = results.filter((result) => result.ok);
  const errors = results.filter((result) => !result.ok);
  const report = {
    checkedAt: new Date().toISOString(),
    ffmpegPath,
    thresholdDb,
    windowMs,
    sampleRate,
    clipStages,
    checkedCount: results.length,
    okCount: okResults.length,
    errorCount: errors.length,
    silentByStage: getSilentByStage(okResults),
    errors,
    results,
  };

  await fs.writeFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(textReportPath, formatTextReport(report));

  console.log(`Wrote ${path.relative(rootDir, textReportPath)}`);
  console.log(`Wrote ${path.relative(rootDir, jsonReportPath)}`);
}

main().catch((error) => {
  console.error("");
  console.error(error.message);
  console.error("");
  console.error("This script requires ffmpeg. Install ffmpeg or set FFMPEG_PATH to the ffmpeg executable.");
  process.exitCode = 1;
});
