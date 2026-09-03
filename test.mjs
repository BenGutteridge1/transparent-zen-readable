import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FEATURE_NAME } from "./config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const stylesPath = path.join(scriptDir, "styles.json");
const stylesText = await fs.readFile(stylesPath, "utf8");
const styles = JSON.parse(stylesText);
const sites = Object.entries(styles.website || {});

assert.ok(sites.length > 500, "Expected the full upstream site collection");
assert.equal(typeof styles.mapping, "object", "Expected upstream mappings");
assert.ok(
  Buffer.byteLength(stylesText) < 5_000_000,
  "Generated styles.json is too large for comfortable extension storage"
);

for (const [site, features] of sites) {
  const featureNames = Object.keys(features);
  assert.equal(
    featureNames.at(-1),
    FEATURE_NAME,
    `${site}: readability must be the final feature`
  );
  const css = features[FEATURE_NAME];
  assert.ok(css.includes("--tzr-s"), `${site}: missing tokens`);
  assert.ok(css.includes("!important"), `${site}: missing cascade protection`);
  assert.ok(!css.includes("@-moz-document"), `${site}: invalid injected wrapper`);
}

console.log(`Validated ${sites.length} enhanced site themes.`);
