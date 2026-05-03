# VOCALOID Heardle

A fan-made VOCALOID Heardle-style guessing game.

The site is fully static and can be hosted on GitHub Pages. Song metadata is stored in `data/songs.js`, and audio is loaded from Cloudflare R2 at `https://audio.sodapines.dev`.

## Project structure

- `index.html` - page markup
- `styles.css` - visual design
- `app.js` - game logic
- `data/songs.js` - generated song metadata used by the browser
- `data/song-ids.txt` - VocaDB song IDs used for regeneration
- `scripts/generate-songs.js` - refreshes metadata from VocaDB

## Refresh song metadata

```sh
node scripts/generate-songs.js https://audio.sodapines.dev
```

Local audio files should not be committed. The live app expects audio files to be available from the R2 domain as `https://audio.sodapines.dev/{vocadbId}.mp3`.
