import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  READABILITY_FEATURE_NAME,
  SURFACE_FEATURE_NAME,
} from "./config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const styles = JSON.parse(
  await fs.readFile(path.join(scriptDir, "styles.json"), "utf8")
);
const sites = Object.entries(styles.website || {});
const injectedNames = new Set([
  READABILITY_FEATURE_NAME,
  SURFACE_FEATURE_NAME,
]);

const report = {
  sites: sites.length,
  upstream: {
    namedTransparency: 0,
    clearsBackground: 0,
    mentionsInteractiveControls: 0,
  },
  enhanced: {
    surfaceConsistency: 0,
    readability: 0,
    navigation: 0,
    controls: 0,
    stateStyles: 0,
    cardsAndPanels: 0,
    feedbackSurfaces: 0,
    tables: 0,
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

  const surface = features[SURFACE_FEATURE_NAME] || "";
  const readable = features[READABILITY_FEATURE_NAME] || "";
  const checks = {
    surfaceConsistency: surface.includes("--tzs-control"),
    readability: readable.includes("--tzr-s"),
    navigation: surface.includes('[role="navigation"]'),
    controls: /button.*input.*select.*textarea/s.test(surface),
    stateStyles:
      surface.includes(":hover") &&
      surface.includes(":active") &&
      surface.includes('[aria-selected="true"]'),
    cardsAndPanels:
      surface.includes('[class~="card"]') &&
      surface.includes('[class~="panel"]'),
    feedbackSurfaces:
      surface.includes('[role="alert"]') && surface.includes('[class~="toast"]'),
    tables: surface.includes('table:not([role="presentation"])'),
  };

  for (const [category, covered] of Object.entries(checks)) {
    if (covered) report.enhanced[category] += 1;
    else report.exceptions.push({ site, category });
  }
}

assert.equal(report.exceptions.length, 0, "Coverage exceptions were found");
for (const count of Object.values(report.enhanced)) {
  assert.equal(count, sites.length, "An enhanced coverage category is incomplete");
}

console.log(JSON.stringify(report, null, 2));
