import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FEATURE_NAME } from "./config.mjs";

const DEFAULT_SOURCE =
  "https://sameerasw.github.io/my-internet/styles.json";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const source = process.argv[2] || DEFAULT_SOURCE;
const output = path.resolve(process.argv[3] || path.join(scriptDir, "styles.json"));

async function readSource(value) {
  if (/^https?:\/\//i.test(value)) {
    const response = await fetch(value, {
      headers: { "cache-control": "no-cache" },
    });
    if (!response.ok) {
      throw new Error(`Could not download ${value} (${response.status})`);
    }
    return response.text();
  }
  return fs.readFile(path.resolve(value), "utf8");
}

function validateSource(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("The source must be a JSON object.");
  }
  if (!data.website || typeof data.website !== "object") {
    throw new TypeError('The source is missing its "website" object.');
  }
  if (!data.mapping || typeof data.mapping !== "object") {
    throw new TypeError('The source is missing its "mapping" object.');
  }
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{},;])\s*/g, "$1")
    .replace(/:\s+/g, ":")
    .replace(/;}/g, "}")
    .trim();
}

const [sourceText, readabilitySource] = await Promise.all([
  readSource(source),
  fs.readFile(path.join(scriptDir, "readability.css"), "utf8"),
]);
const styles = JSON.parse(sourceText);
validateSource(styles);
const readabilityCSS = minifyCSS(readabilitySource);

let siteCount = 0;
for (const [site, features] of Object.entries(styles.website)) {
  if (!features || typeof features !== "object" || Array.isArray(features)) {
    throw new TypeError(`Invalid feature object for ${site}`);
  }
  delete features[FEATURE_NAME];
  features[FEATURE_NAME] = readabilityCSS.trim();
  siteCount += 1;
}

await fs.writeFile(output, `${JSON.stringify(styles, null, 2)}\n`, "utf8");
console.log(`Wrote ${siteCount} enhanced site themes to ${output}`);
