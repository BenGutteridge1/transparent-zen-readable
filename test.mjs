import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEGACY_SURFACE_FEATURE_NAME,
  READABILITY_FEATURE_NAME,
  YOUTUBE_REFINEMENT_FEATURE_NAME,
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
  assert.ok(
    !(LEGACY_SURFACE_FEATURE_NAME in features),
    `${site}: legacy global surface overrides must not be injected`
  );
  if (site === "youtube.com.css") {
    assert.equal(
      featureNames.at(-2),
      YOUTUBE_REFINEMENT_FEATURE_NAME,
      `${site}: YouTube refinement must precede readability`
    );
    const youtube = features[YOUTUBE_REFINEMENT_FEATURE_NAME];
    assert.ok(
      youtube.includes("ytd-menu-renderer") &&
        youtube.includes('ytd-browse[page-subtype="home"]') &&
        youtube.includes("backdrop-filter:none!important"),
      `${site}: incomplete YouTube overflow-menu or home-frost correction`
    );
  } else {
    assert.ok(
      !(YOUTUBE_REFINEMENT_FEATURE_NAME in features),
      `${site}: YouTube-only refinement leaked into another site`
    );
  }

  const readable = features[READABILITY_FEATURE_NAME];
  assert.ok(
    readable.includes("--tzr-s") && readable.includes("--tzr-m"),
    `${site}: missing text tokens`
  );
  assert.ok(
    readable.includes(':not(:where(button,[role="button"]'),
    `${site}: interactive descendants are not protected`
  );
  assert.ok(
    !readable.includes("--tzr-h") &&
      !/text-shadow:(?!none(?:!important)?[;}])/.test(readable),
    `${site}: readability must not add text halos`
  );
  assert.ok(
    !/(?:--yt-|--color-fg|--fgColor|--ds-|--muted-foreground)\s*:/.test(
      readable
    ),
    `${site}: readability must not replace site design tokens`
  );
  assert.ok(
    !/(?:svg|icon|filter:|fill:|stroke:)/i.test(readable),
    `${site}: readability must not alter icon styling`
  );
  assert.ok(
    !/(?:background(?:-color)?|border-color|box-shadow|backdrop-filter|outline)\s*:/.test(
      readable
    ),
    `${site}: readability must not alter controls or surfaces`
  );
  assert.ok(
    !readable.includes(":focus"),
    `${site}: readability must preserve native focus styling`
  );
  assert.ok(readable.includes("!important"), `${site}: missing cascade protection`);
  assert.ok(
    !readable.includes("@-moz-document"),
    `${site}: invalid injected wrapper`
  );
  assert.equal(
    (readable.match(/{/g) || []).length,
    (readable.match(/}/g) || []).length,
    `${site}: unbalanced readability CSS`
  );
}

console.log(`Validated ${sites.length} text-only enhanced site themes.`);
