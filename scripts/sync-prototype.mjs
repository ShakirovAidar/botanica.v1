import { copyFile, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
for (const file of ["index.html", "legacy.html"])
  await copyFile(
    path.join(root, "index.html"),
    path.join(root, "public", file),
  );
await cp(path.join(root, "assets"), path.join(root, "public/assets"), {
  recursive: true,
});
console.log("Prototype HTML and local assets synced to public/.");
