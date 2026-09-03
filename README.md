# Transparent Zen — readable glass fork

This is a drop-in `styles.json` for the Zen Internet extension. It keeps the
upstream transparent themes and appends one normal, per-site feature:
**readability boost**.

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

You will now see **readability boost** in each site's feature list, so it can be
disabled for an individual site without losing transparency there.

The included GitHub Action checks upstream daily and commits a rebuilt
`styles.json` only when something changed. You can also rebuild locally with:

```sh
node build.mjs
node test.mjs
```

To build from a downloaded or edited upstream file instead:

```sh
node build.mjs /path/to/upstream-styles.json styles.json
```

## Tune the appearance

All shared values are at the top of `readability.css`. The most useful controls
are:

- `--tzr-s` and `--tzr-m` — secondary and muted text strength;
- `--tzr-h` — resilience over detailed wallpapers;
- `--tzr-g` and `--tzr-gs` — normal and reduced-transparency glass opacity;
- the `blur(22px)` value — glass diffusion.

After changing the CSS, run the build and validation commands again.

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
upstream MIT licence. `build.mjs`, `readability.css`, and the automation in this
folder are an additive compatibility layer.
