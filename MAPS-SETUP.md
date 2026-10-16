# Map (MapLibre GL JS + OpenFreeMap)

Works out of the box: no API key, no billing, no npm dependencies.

- The library loads from `assets/vendor/` if present, otherwise from jsDelivr (pinned version, see `MAPLIBRE_VERSION` in `assets/app.js`).
- Optional self-hosting of the library: `npm run map:fetch && npm run prototype:sync`.
- Map styles: `MAP_STYLES` in `assets/app.js`. Check that the dark style URL opens; if not, use `.../styles/positron` for both.
- Pins and areas: `assets/areas.js`.

Attribution (OpenStreetMap / OpenMapTiles / OpenFreeMap) is rendered by the map itself — keep it visible.
The public OpenFreeMap service is provided as-is; for critical production, self-host it and change `MAP_STYLES`.
