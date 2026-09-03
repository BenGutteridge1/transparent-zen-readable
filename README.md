# Transparent Zen — readable glass fork

This is a drop-in `styles.json` for the Zen Internet extension. It keeps the
upstream transparent themes and appends two normal, independently toggleable
features to every site: **surface consistency** and **readability boost**.

**Surface consistency** catches components that individual site themes often
leave at their default opaque styling:

- headers, navigation, toolbars, tab lists, buttons, tabs, and form controls;
- hover, active, selected, pressed, expanded, and open states;
- cards, panels, tiles, widgets, banners, notices, alerts, and toasts;
- code blocks, tables, table headers, rows, and scrollbars;
- specialist checkbox, radio, and range controls without breaking their native
  behavior.

The boost is deliberately selective. It does not recolour every paragraph or
turn the page opaque. It:

- strengthens semantic secondary, muted, caption, metadata, and timestamp text;
- restores text that sites fade using `opacity`;
- improves placeholders and disabled controls;
- adds a subtle light/dark halo so text survives a changing wallpaper;
- gives menus, dialogs, listboxes, and tooltips a properly blurred glass scrim;
- respects explicit light/dark site themes, increased contrast, reduced
  transparency, and forced-colour preferences;
- adds a visible keyboard focus ring.

## Use it

The extension fetches a URL, so use the repository's public raw file:

`https://raw.githubusercontent.com/BenGutteridge1/transparent-zen-readable/main/styles.json`

1. Open Zen Internet and choose **Advanced Settings**.
2. Paste that address into **Custom Styles Repository**, then click **Set URL**.
3. Agree to clear the existing styles when prompted, then click **Refetch
   latest styles** in the extension popup.

You will now see **surface consistency** and **readability boost** in each site's
feature list. Either can be disabled for an individual site without losing its
upstream transparency theme.

The included GitHub Action checks upstream daily and commits a rebuilt
`styles.json` only when something changed. You can also rebuild locally with:

```sh
node build.mjs
node test.mjs
node audit.mjs
```

To build from a downloaded or edited upstream file instead:

```sh
node build.mjs /path/to/upstream-styles.json styles.json
```

## Tune the appearance

Shared values are at the top of `surface-consistency.css` and
`readability.css`. The most useful controls are:

- `--tzs-control`, `--tzs-panel`, `--tzs-hover`, and `--tzs-active` — component
  translucency and interaction states;
- `--tzs-strong` — fallback opacity for increased-contrast or
  reduced-transparency preferences;

- `--tzr-s` and `--tzr-m` — secondary and muted text strength;
- `--tzr-h` — resilience over detailed wallpapers;
- `--tzr-g` and `--tzr-gs` — normal and reduced-transparency glass opacity;
- the `blur(22px)` value — glass diffusion.

After changing the CSS, run the build and validation commands again.

## Coverage audit

`audit.mjs` checks every generated site rather than sampling a few themes. It
verifies coverage for navigation, ordinary controls, interaction states,
cards and panels, feedback surfaces, code blocks, tables, and readability. The
daily GitHub Action runs this audit after rebuilding from upstream.

No generic stylesheet can see inside cross-origin iframes or closed Shadow DOM,
and websites can introduce new component conventions at any time. Those are
the remaining cases that require a site-specific selector. For normal document
content, the shared layer prevents a missed upstream selector from leaving a
bright default button, input, card, toolbar, or table behind.

## Design notes

Transparent interfaces become unreliable when text and wallpaper are allowed
to meet directly. Blur alone does not guarantee contrast: bright or detailed
wallpaper can still sit behind grey text. This fork therefore uses three
layers of defence—stronger semantic colour, a small halo, and localized glass
only for floating surfaces.

For the calmest result, use a low-detail wallpaper with moderate luminance,
keep blur around 18–28 px, and avoid pushing every large content panel below
roughly 35–45% opacity. Transparency works best as depth, not as the absence of
all surfaces.

## Upstream and licence

The site themes come from
[sameerasw/my-internet](https://github.com/sameerasw/my-internet) and retain the
upstream MIT licence. `build.mjs`, `surface-consistency.css`,
`readability.css`, the audit, and the automation in this folder are an additive
compatibility layer.
