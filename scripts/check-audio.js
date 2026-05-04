const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const songsPath = path.join(rootDir, "data", "songs.json");
const reportPath = path.join(rootDir, "data", "audio-audit-report.json");
const songs = JSON.parse(fs.readFileSync(songsPath, "utf8"));
const timeoutMs = 8000;
const concurrency = 12;

async function checkUrl(song) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(song.audioClip, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return {
      vocadbId: song.vocadbId,
      title: song.title,
      audioClip: song.audioClip,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      contentLength: response.headers.get("content-length") || "",
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      vocadbId: song.vocadbId,
      title: song.title,
      audioClip: song.audioClip,
      ok: false,
      error: error.name === "AbortError" ? "Timeout" : error.message,
    };
  }
}

async function main() {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < songs.length) {
      const song = songs[index];
      index += 1;
      results.push(await checkUrl(song));
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  results.sort((first, second) => Number(first.vocadbId) - Number(second.vocadbId));

  const report = {
    checkedAt: new Date().toISOString(),
    checkedCount: results.length,
    okCount: results.filter((result) => result.ok).length,
    problemCount: results.filter((result) => !result.ok).length,
    problems: results.filter((result) => !result.ok),
    suspicious: results.filter((result) => {
      if (!result.ok) {
        return false;
      }

      const length = Number(result.contentLength || 0);
      return length > 0 && length < 100000;
    }),
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
