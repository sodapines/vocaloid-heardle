const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const jsonPath = path.join(rootDir, "data", "songs.json");
const jsPath = path.join(rootDir, "data", "songs.js");

const artistAliases = new Map(
  Object.entries({
    THREE: ["THREEE", "Surii", "surii", "すりぃ"],
    THREEE: ["THREE", "Surii", "surii", "すりぃ"],
    Surii: ["THREE", "THREEE", "surii", "すりぃ"],
    "すりぃ": ["THREE", "THREEE", "Surii", "surii"],
  }),
);

function unique(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const cleaned = cleanName(value);
    const key = cleaned.toLowerCase();

    if (cleaned && !seen.has(key)) {
      seen.add(key);
      result.push(cleaned);
    }
  }

  return result;
}

function cleanName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

function splitNames(value) {
  return cleanName(value)
    .split(/\s*,\s*/)
    .map(cleanName)
    .filter(Boolean);
}

function removeParenthetical(value) {
  return cleanName(value).replace(/\s*\([^)]*\)/g, "").trim();
}

function cleanSingerName(value) {
  return removeParenthetical(value)
    .replace(/\b(Append|V[1-9](?:X)?|English|Japanese|Chinese|Korean|AI|SV|Old)\b/gi, "")
    .replace(/\b(Original|Dark|Soft|Solid|Sweet|Light|Vivid|Power|Warm|Whisper|Straight|Natural|Native|Adult|Young|Spicy|Sugar|Unknown|Hard)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getProducerAndSingerParts(artistString = "") {
  const parts = artistString.split(/\s+feat\.\s+/i);

  return {
    producerPart: parts[0] || "",
    singerPart: parts.slice(1).join(" feat. "),
  };
}

function buildMetadata(song) {
  const artistString = song.artistString || song.artist || "";
  const { producerPart, singerPart } = getProducerAndSingerParts(artistString);
  const producerNames = unique(splitNames(producerPart || song.artist));
  const singerNames = unique(
    splitNames(singerPart)
      .map(cleanSingerName),
  );
  const searchableSingerNames = unique(splitNames(singerPart).flatMap((name) => [removeParenthetical(name), cleanSingerName(name)]));
  const aliasNames = unique(
    [...producerNames, song.artist]
      .flatMap((name) => [name, ...(artistAliases.get(name) || [])]),
  );
  const displayParts = [
    producerNames.join(", "),
    singerNames.length ? `feat. ${singerNames.join(", ")}` : "",
  ].filter(Boolean);

  return {
    producerNames,
    singerNames,
    displayArtist: displayParts.join(" "),
    suggestionArtistString: displayParts.join(" "),
    artistSearchNames: unique([
      song.artist,
      artistString,
      ...producerNames,
      ...singerNames,
      ...searchableSingerNames,
      ...aliasNames,
    ]),
  };
}

async function main() {
  const songs = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const enrichedSongs = songs.map((song) => ({
    ...song,
    ...buildMetadata(song),
  }));

  await fs.writeFile(jsonPath, `${JSON.stringify(enrichedSongs, null, 2)}\n`);
  await fs.writeFile(jsPath, `window.VOCALOID_HEARDLE_SONGS = ${JSON.stringify(enrichedSongs, null, 2)};\n`);

  console.log(`Enriched ${enrichedSongs.length} songs with display/search metadata.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
