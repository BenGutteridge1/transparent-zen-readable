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
const styles = JSON.parse(
  await fs.readFile(path.join(scriptDir, "styles.json"), "utf8")
);
const sites = Object.entries(styles.website || {});
const injectedNames = new Set([
  LEGACY_SURFACE_FEATURE_NAME,
  READABILITY_FEATURE_NAME,
  YOUTUBE_REFINEMENT_FEATURE_NAME,
]);

const report = {
  sites: sites.length,
  upstream: {
    namedTransparency: 0,
    clearsBackground: 0,
    mentionsInteractiveControls: 0,
  },
  enhanced: {
    readability: 0,
    nativeControlsPreserved: 0,
    nativeIconsPreserved: 0,
    nativeFocusPreserved: 0,
    siteDesignTokensPreserved: 0,
  },
  youtube: {
    scopedToYouTubeOnly: true,
    nativeOverflowMenus: false,
    clearerHomeFeed: false,
  },
  exceptions: [],
};

for (const [site, features] of sites) {
  const upstreamEntries = Object.entries(features).filter(
    ([name]) => !injectedNames.has(name)
  );
  const upstreamCSS = upstreamEntries.map(([, css]) => css).join("\n");
  if (upstreamEntries.some(([name]) => /transparency/i.test(name))) {
    report.upstream.namedTransparency += 1;
  }
  if (/background(?:-color)?\s*:\s*(?:transparent|none)/i.test(upstreamCSS)) {
    report.upstream.clearsBackground += 1;
  }
  if (/(?:button|\[role=["']?button|input|select|textarea)/i.test(upstreamCSS)) {
    report.upstream.mentionsInteractiveControls += 1;
  }

  const readable = features[READABILITY_FEATURE_NAME] || "";
  const youtube = features[YOUTUBE_REFINEMENT_FEATURE_NAME] || "";
  if (site === "youtube.com.css") {
    report.youtube.nativeOverflowMenus =
      youtube.includes("ytd-menu-renderer") &&
      youtube.includes("background-color:transparent!important");
    report.youtube.clearerHomeFeed =
      youtube.includes('ytd-browse[page-subtype="home"]') &&
      youtube.includes("backdrop-filter:none!important");
  } else if (youtube) {
    report.youtube.scopedToYouTubeOnly = false;
  }
  const checks = {
    readability: readable.includes("--tzr-s"),
    nativeControlsPreserved:
      !(LEGACY_SURFACE_FEATURE_NAME in features) &&
      !/(?:background(?:-color)?|border-color|box-shadow|backdrop-filter|outline)\s*:/.test(
        readable
      ),
    nativeIconsPreserved: !/(?:svg|icon|filter:|fill:|stroke:)/i.test(readable),
    nativeFocusPreserved: !readable.includes(":focus"),
    siteDesignTokensPreserved:
      !/(?:--yt-|--color-fg|--fgColor|--ds-|--muted-foreground)\s*:/.test(
        readable
      ),
  };

  for (const [category, covered] of Object.entries(checks)) {
    if (covered) report.enhanced[category] += 1;
    else report.exceptions.push({ site, category });
  }
}

assert.ok(
  Object.values(report.youtube).every(Boolean),
  "The YouTube refinement is incomplete or leaked into another site"
);

assert.equal(report.exceptions.length, 0, "Preservation exceptions were found");
for (const count of Object.values(report.enhanced)) {
  assert.equal(count, sites.length, "An enhanced preservation category is incomplete");
}

console.log(JSON.stringify(report, null, 2));
