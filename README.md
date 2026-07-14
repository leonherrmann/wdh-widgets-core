# wdh-widgets-core

Shared core library for the **WDH Widgets** collection — modern, bold dashboard
widgets (Lovelace cards) for Home Assistant.

This package is not a card itself. It provides the foundation every WDH widget
is built on:

| Module | Purpose |
| --- | --- |
| `BaseWidget` | Lit base class: `hass` property, config lifecycle, masonry + sections-grid sizing |
| `BaseEditor` | Schema-driven visual editor base on top of `ha-form` — widgets get HA's native selectors for free |
| `registry` | Area/device/entity registry helpers for **auto-detection** (e.g. "first temperature sensor in this area") |
| `styles` | WDH design tokens: bold typography, radii, theme-variable-driven light/dark support |
| `color` | Maps HA `ui_color` palette names to theme CSS variables |
| `format` | Locale-aware number/state formatting with registry display precision |
| `register` | `registerWidget()` — custom element definition + card picker announcement |

## Usage in a widget

```ts
import { BaseWidget, registerWidget, findSensor } from "@wdh/widgets-core";
```

Widgets depend on this repo as a git dependency and bundle it into their single
dist file at build time:

```json
"dependencies": {
  "@wdh/widgets-core": "github:OWNER/wdh-widgets-core#v2026.7.0"
}
```

The `prepare` script compiles TypeScript on install, so no npm publishing is
needed.

## Versioning

CalVer: `<year>.<month>.<patch>` (e.g. `2026.7.0`).

```sh
npm run release   # bumps version, commits, tags vX.Y.Z
git push && git push --tags
```

## Development

```sh
npm install
npm test          # vitest
npm run build     # tsc → dist/
```

## Widgets built on this core

- [wdh-room-summary-card](https://github.com/OWNER/wdh-room-summary-card) — room temperature, humidity and climate at a glance

## License

MIT
