# Transparent Zen — readable glass fork

This is a drop-in `styles.json` for the Zen Internet extension. It preserves
the upstream site's precise transparency rules and appends one deliberately
text-only feature to every site: **readability boost**.

The boost:

- strengthens semantic secondary, muted, caption, metadata, and timestamp text;
- restores supporting text that sites fade using `opacity`;
- improves placeholder legibility;
- uses adaptive light/dark colours without halos or text shadows;
- leaves buttons, inputs, icons, focus states, navigation, cards, menus, player
  controls, and every other surface under the original site's control;
- does not replace YouTube, GitHub, Atlassian, or other design-system variables.

An earlier shared **surface consistency** feature tried to style generic
`button`, `input`, navigation, card, and state selectors. That approach could
override refined site-specific controls, creating grey search boxes and
flattening button or icon presentation. It has been retired and is removed
from every generated site. The original upstream CSS now remains authoritative
for all surfaces and controls.

## Use it

The extension fetches a URL, so use the repository's public raw file:

`https://raw.githubusercontent.com/BenGutteridge1/transparent-zen-readable/main/styles.json`

1. Open Zen Internet and choose **Advanced Settings**.
2. Paste that address into **Custom Styles Repository**, then click **Set URL**.
3. Agree to clear the existing styles when prompted, then click **Refetch
   latest styles** in the extension popup.

You will see **readability boost** in each site's feature list. It can be
disabled for an individual site without losing the upstream transparency
theme.

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

## Tune the text

The shared values at the top of `readability.css` are:

- `--tzr-s` — secondary text strength;
- `--tzr-m` — muted and placeholder text strength.

After changing them, run the build and validation commands again.

## Preservation audit

`audit.mjs` checks all 663 generated sites rather than sampling a few themes.
It verifies that the readability layer does not inject generic surface rules,
touch icons, replace site design tokens, or override native focus styling. The
daily GitHub Action runs this audit after every upstream rebuild.

No generic stylesheet can reliably infer the purpose or native visual language
of every control on every website. Site-specific selectors from the upstream
project are therefore the safe place for transparency changes to buttons,
search fields, menus, media controls, and other interactive components.

## Design notes

Transparent interfaces become unreliable when text and wallpaper meet
directly. Blur alone does not guarantee contrast, so this fork strengthens only
recognisable supporting text. It deliberately avoids text shadows and global
surface styling. Icons and interactive controls retain each website's original
colouring and behaviour.

For the calmest result, use a low-detail wallpaper with moderate luminance.
Transparency works best as depth, not as the absence of all surfaces.

## Upstream and licence

The site themes come from
[sameerasw/my-internet](https://github.com/sameerasw/my-internet) and retain the
upstream MIT licence. `build.mjs`, `readability.css`, the preservation audit,
and the automation in this folder form the additive text-readability layer.
