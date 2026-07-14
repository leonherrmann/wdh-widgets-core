import { css } from "lit";

/**
 * WDH design tokens — the shared bold design language.
 *
 * Everything derives from HA theme variables so light/dark mode and custom
 * themes work out of the box. Widgets tint themselves via `--wdh-accent`.
 */
export const wdhTokens = css`
  :host {
    /* Accent — widgets override this from their config color */
    --wdh-accent: var(--primary-color);
    --wdh-on-accent: #fff;

    /* Surfaces & text from the active HA theme */
    --wdh-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
    --wdh-text: var(--primary-text-color);
    --wdh-text-secondary: var(--secondary-text-color);
    --wdh-divider: var(--divider-color);

    /* Shape & type — deliberately bold */
    --wdh-radius: var(--ha-card-border-radius, 24px);
    --wdh-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif));
    --wdh-weight-black: 800;
    --wdh-weight-bold: 700;
    --wdh-weight-medium: 500;
  }
`;

/** Base styles every WDH card wrapper shares. */
export const wdhCardBase = css`
  ha-card {
    height: 100%;
    overflow: hidden;
    position: relative;
    font-family: var(--wdh-font);
    color: var(--wdh-text);
    background: var(--wdh-card-bg);
    box-sizing: border-box;
  }
`;
