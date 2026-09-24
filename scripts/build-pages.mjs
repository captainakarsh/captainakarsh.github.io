// Builds the static GitHub Pages copy of the site into ./out.
// GitHub Pages can't run API routes, so src/app/api is moved aside for the
// build (and always restored); the exported site calls the Vercel API instead.
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";

const API_DIR = "src/app/api";
const PARKED = ".api-parked";

if (existsSync(PARKED)) {
  console.error(`${PARKED} exists from an interrupted build — move it back to ${API_DIR} first.`);
  process.exit(1);
}

rmSync(".next", { recursive: true, force: true });
renameSync(API_DIR, PARKED);
let status = 1;
try {
  status =
    spawnSync("npx", ["next", "build"], {
      stdio: "inherit",
      env: { ...process.env, STATIC_EXPORT: "true" },
    }).status ?? 1;
} finally {
  renameSync(PARKED, API_DIR);
}
if (status === 0) {
  writeFileSync("out/.nojekyll", "");
  // The gh-pages branch holds only built files; stop Vercel from trying to build it.
  writeFileSync("out/vercel.json", JSON.stringify({ git: { deploymentEnabled: false } }, null, 2) + "\n");
}
process.exit(status);
