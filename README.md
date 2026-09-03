# Transparent Zen V2 — Aggressive Readability

V2 is intentionally more aggressive than V1.

The original Transparent Zen project uses site-specific CSS and then generates
the large `styles.json` database. The repository specifically asks contributors
to respect automatic day/night theming and says the generated JSON is rebuilt
from the website CSS files.

V2 therefore works best as a **global readability overlay** applied after the
site's transparency CSS.

## What V2 changes

1. **Primary text**
   - light: near-black
   - dark: near-white

2. **Secondary/muted text**
   - light: dark grey
   - dark: light grey

3. **Text shadow**
   - adds a tiny opposite-luminance halo so text remains readable over photos,
     gradients and wallpapers.

4. **Micro-backplates**
   - adds an extremely subtle translucent surface behind paragraphs,
     headings, captions and descriptions.
   - This is the biggest improvement when a wallpaper has the same luminance as
     the text.

5. **Forms and placeholders**
   - explicitly strengthened.

6. **Media**
   - images, SVGs, video, canvas and icon-only elements are excluded.

7. **Automatic theme detection**
   - uses `color-scheme` + `light-dark()`, with a
     `prefers-color-scheme` fallback.

## Trade-off

This is deliberately more opinionated. Some websites use coloured text as part
of their UI, and V2 can flatten some of that colour hierarchy. If that happens,
add a site-specific exception rather than weakening the global layer.

## Installing/testing

Try `v2-global.css` first in whatever user CSS mechanism you use with Zen.
If it looks good, use the builder to create a complete generated JSON.

```bash
node build-v2.mjs
```

The builder downloads the current upstream `styles.json`, preserves its website
entries, and adds a `readability-v2` feature to every transparency-enabled
website.

## Suggested tuning

More contrast:

```css
--tz-fg-light: #101216;
--tz-fg-dark: #ffffff;
--tz-secondary-light: #252a32;
--tz-secondary-dark: #e9edf5;
```

Less intrusive:

```css
--tz-fg-light: #242830;
--tz-fg-dark: #e8ebf1;
--tz-secondary-light: #3f4650;
--tz-secondary-dark: #cbd1dc;
```
