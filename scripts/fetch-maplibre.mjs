// Скачивает MapLibre GL JS в assets/vendor (без npm). Запуск: npm run map:fetch
// или: node scripts/fetch-maplibre.mjs [версия]
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const version = process.argv[2] || "5.6.0"; // при необходимости поменяйте на актуальную
const root = fileURLToPath(new URL("../", import.meta.url));
const dir = path.join(root, "assets", "vendor");
await mkdir(dir, { recursive: true });
for (const f of ["maplibre-gl.js", "maplibre-gl.css"]) {
  const url = `https://cdn.jsdelivr.net/npm/maplibre-gl@${version}/dist/${f}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  await writeFile(path.join(dir, f), Buffer.from(await res.arrayBuffer()));
  console.log("saved", f);
}
console.log(`MapLibre ${version} saved to assets/vendor. Now run: npm run prototype:sync`);
