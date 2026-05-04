const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const csvPath = process.argv[2] || "C:/Users/phung/Downloads/VocaDB IDs + YT URLs - Sheet1.csv";
const idListPath = path.join(rootDir, "data", "song-ids.txt");
const songsJsonPath = path.join(rootDir, "data", "songs.json");
const songsJsPath = path.join(rootDir, "data", "songs.js");
const reportPath = path.join(rootDir, "data", "audit-report.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (quoted) {
      if (character === "\"" && nextCharacter === "\"") {
        value += "\"";
        index += 1;
      } else if (character === "\"") {
        quoted = false;
      } else {
        value += character;
      }
      continue;
    }

    if (character === "\"") {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function readCsvRecords(filePath) {
  const rows = parseCsv(fs.readFileSync(filePath, "utf8")).filter((row) => row.some(Boolean));
  const headers = rows[0];

  return rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])),
  );
}

function getDuplicateEntries(items, getKey) {
  const grouped = new Map();

  items.forEach((item, index) => {
    const key = getKey(item);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push({ item, index });
  });

  return [...grouped.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([key, entries]) => ({ key, entries }));
}

function getSongIdFromLine(line) {
  const match = line.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function toIdLine(id) {
  return `${id}`;
}

function stableShuffle(items, seed) {
  const shuffled = [...items];
  let state = seed >>> 0;

  function random() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  }

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

const csvRecords = readCsvRecords(csvPath);
const csvIds = csvRecords.map((record) => Number(record.vocadb_id)).filter(Boolean);
const csvIdSet = new Set(csvIds);
const rawIdLines = fs
  .readFileSync(idListPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));
const idEntries = rawIdLines.map((line) => ({ line, id: getSongIdFromLine(line) })).filter((entry) => entry.id);
const songs = JSON.parse(fs.readFileSync(songsJsonPath, "utf8"));
const originalSongsById = new Map();
const duplicateSongIds = [];

songs.forEach((song, index) => {
  if (originalSongsById.has(Number(song.vocadbId))) {
    duplicateSongIds.push({ id: Number(song.vocadbId), duplicateIndex: index });
    return;
  }

  originalSongsById.set(Number(song.vocadbId), song);
});

const uniqueIds = [];
const seenIds = new Set();
const duplicateIdEntries = [];

idEntries.forEach((entry, index) => {
  if (seenIds.has(entry.id)) {
    duplicateIdEntries.push({ id: entry.id, duplicateLine: index + 1 });
    return;
  }

  seenIds.add(entry.id);
  uniqueIds.push(entry.id);
});

const missingFromCsv = uniqueIds.filter((id) => !csvIdSet.has(id));
const csvMissingFromIdList = csvIds.filter((id) => !seenIds.has(id));
const csvDuplicateIds = getDuplicateEntries(csvIds, (id) => id).map(({ key, entries }) => ({
  id: Number(key),
  rows: entries.map((entry) => entry.index + 2),
}));
const statusCounts = csvRecords.reduce((counts, record) => {
  const status = record.status || "";
  counts[status] = (counts[status] || 0) + 1;
  return counts;
}, {});

const uniqueSongs = uniqueIds
  .map((id) => originalSongsById.get(id))
  .filter(Boolean);
const lockedSongs = uniqueSongs.filter((song) => song.date && song.date < "2026-05-05");
const futureSongs = uniqueSongs.filter((song) => !song.date || song.date >= "2026-05-05");
const shuffledFutureSongs = stableShuffle(futureSongs, 20260505);
const startDate = new Date("2026-05-05T00:00:00Z");

shuffledFutureSongs.forEach((song, index) => {
  song.date = getDateKey(addDays(startDate, index));
});

const cleanedSongs = [...lockedSongs, ...shuffledFutureSongs];

fs.writeFileSync(idListPath, `${uniqueIds.map(toIdLine).join("\n")}\n`);
fs.writeFileSync(songsJsonPath, `${JSON.stringify(cleanedSongs, null, 2)}\n`);
fs.writeFileSync(songsJsPath, `window.VOCALOID_HEARDLE_SONGS = ${JSON.stringify(cleanedSongs, null, 2)};\n`);

const report = {
  csvPath,
  before: {
    idListCount: idEntries.length,
    songCount: songs.length,
    csvIdCount: csvIds.length,
    csvUniqueIdCount: csvIdSet.size,
  },
  after: {
    idListCount: uniqueIds.length,
    songCount: cleanedSongs.length,
  },
  duplicateIdEntries,
  duplicateSongIds,
  csvDuplicateIds,
  missingFromCsv,
  csvMissingFromIdList,
  csvStatusCounts: statusCounts,
  may5Preview: cleanedSongs
    .filter((song) => song.date >= "2026-05-05")
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(0, 12)
    .map((song) => ({
      date: song.date,
      vocadbId: song.vocadbId,
      title: song.title,
      artist: song.artist,
    })),
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
