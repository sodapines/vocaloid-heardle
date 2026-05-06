const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const jsonPath = path.join(rootDir, "data", "songs.json");
const jsPath = path.join(rootDir, "data", "songs.js");
const startDateKey = process.argv[2] || "2026-05-07";
const seed = Number(process.argv[3] || startDateKey.replaceAll("-", ""));

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function stableShuffle(items, seedValue) {
  const shuffled = [...items];
  let state = seedValue >>> 0;

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

const songs = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const lockedSongs = songs.filter((song) => song.date && song.date < startDateKey);
const shuffleSongs = songs.filter((song) => !song.date || song.date >= startDateKey);
const shuffledSongs = stableShuffle(shuffleSongs, seed);
const startDate = new Date(`${startDateKey}T00:00:00Z`);

shuffledSongs.forEach((song, index) => {
  song.date = toDateKey(addDays(startDate, index));
});

const nextSongs = [...lockedSongs, ...shuffledSongs];

fs.writeFileSync(jsonPath, `${JSON.stringify(nextSongs, null, 2)}\n`);
fs.writeFileSync(jsPath, `window.VOCALOID_HEARDLE_SONGS = ${JSON.stringify(nextSongs, null, 2)};\n`);

const preview = nextSongs
  .filter((song) => song.date >= startDateKey)
  .sort((first, second) => first.date.localeCompare(second.date))
  .slice(0, 14)
  .map((song) => ({
    date: song.date,
    vocadbId: song.vocadbId,
    title: song.title,
    artist: song.suggestionArtistString || song.artistString || song.artist,
  }));

console.log(JSON.stringify({
  startDate: startDateKey,
  seed,
  lockedCount: lockedSongs.length,
  shuffledCount: shuffledSongs.length,
  preview,
}, null, 2));
