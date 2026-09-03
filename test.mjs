import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  READABILITY_FEATURE_NAME,
  SURFACE_FEATURE_NAME,
} from "./config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const stylesPath = path.join(scriptDir, "styles.json");
const stylesText = await fs.readFile(stylesPath, "utf8");
const styles = JSON.parse(stylesText);
const sites = Object.entries(styles.website || {});

assert.ok(sites.length > 500, "Expected the full upstream site collection");
assert.equal(typeof styles.mapping, "object", "Expected upstream mappings");
assert.ok(
  Buffer.byteLength(stylesText) < 9_000_000,
  "Generated styles.json is too large for comfortable extension storage"
);

for (const [site, features] of sites) {
  const featureNames = Object.keys(features);
  assert.equal(
    featureNames.at(-1),
    READABILITY_FEATURE_NAME,
    `${site}: readability must be the final feature`
  );
  assert.equal(
    featureNames.at(-2),
    SURFACE_FEATURE_NAME,
    `${site}: surface consistency must precede readability`
  );
  const surface = features[SURFACE_FEATURE_NAME];
  const readable = features[READABILITY_FEATURE_NAME];
  assert.ok(surface.includes("--tzs-control"), `${site}: missing surface tokens`);
  assert.ok(readable.includes("--tzr-s"), `${site}: missing text tokens`);
  assert.ok(readable.includes("--tzr-i"), `${site}: missing icon tokens`);
  assert.ok(
    !readable.includes("--tzr-h") &&
      !/text-shadow:(?!none(?:!important)?[;}])/.test(readable),
    `${site}: readability must not add text halos`
  );
  assert.ok(
    surface.includes("!important") && readable.includes("!important"),
    `${site}: missing cascade protection`
  );
  assert.ok(
    !surface.includes("@-moz-document") &&
      !readable.includes("@-moz-document"),
    `${site}: invalid injected wrapper`
  );
  assert.equal(
    (surface.match(/{/g) || []).length,
    (surface.match(/}/g) || []).length,
    `${site}: unbalanced surface CSS`
  );
}

console.log(`Validated ${sites.length} enhanced site themes.`);
