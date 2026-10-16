# Google Maps key

1. Open https://console.cloud.google.com, create or choose a project, and attach billing (Google gives a monthly free allowance; check current limits in the console).
2. APIs & Services → Library → enable **Maps JavaScript API**.
3. APIs & Services → Credentials → Create credentials → API key.
4. Restrict the key: *Application restrictions* → Websites (HTTP referrers), add your domain(s), e.g. `https://your-domain.com/*`; *API restrictions* → Maps JavaScript API only.
5. Paste the key into `assets/areas.js`: `window.BOTANICA_CONFIG = { googleMapsApiKey: "..." }`.
6. Run `npm run prototype:sync`.

Without a key the map area shows a notice; area chips, project cards and "Open in Maps" links still work.
