# Transparent Zen — Readability Edition

The upstream `my-internet` styles make websites transparent, but grey/secondary
text can become hard to see over a changing frosted background.

This version keeps the existing site-specific transparency rules and adds a
second **readability** feature:

- light mode → darker muted text
- dark mode → lighter muted text
- subtle adaptive text shadow over arbitrary backgrounds
- more readable placeholders and disabled controls
- SVG/images/video/canvas/icon-only elements are left alone
- uses `color-scheme: light dark` + `light-dark()` for automatic theme choice

## Files

`contrast.css` — standalone layer for testing via `userContent.css`.

`build-styles.mjs` — downloads the current upstream `styles.json` and injects
the readability feature into every site that has a transparency feature.

`styles-overlay-example.json` — tiny example showing the expected JSON shape.

## Build the complete database

Requires Node.js with `fetch` support:

```bash
node build-styles.mjs
```

The generated `styles.json` is intentionally built from the latest upstream
copy, because the upstream generated database is large and changes frequently.

## Tuning

The main light/dark values are:

```css
--tz-readable-light: #3b3f46;
--tz-readable-dark: #d9dde5;
```

For stronger contrast use roughly `#252930` / `#f0f2f6`.

For a softer look use roughly `#555b65` / `#c5cad4`.
