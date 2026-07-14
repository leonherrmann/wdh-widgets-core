/**
 * HA theme color palette (the same set the built-in tile card's ui_color
 * selector offers). Each name maps to a `--<name>-color` CSS variable that
 * automatically adapts to light/dark themes.
 */
const HA_COLOR_PALETTE = new Set([
  "primary",
  "accent",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "light-grey",
  "grey",
  "dark-grey",
  "blue-grey",
  "black",
  "white",
]);

/**
 * Resolve a config color to a CSS color value.
 * Palette names ("orange") become theme variables, anything else
 * (hex, rgb(), css names) is passed through as-is.
 */
export function accentColorCss(
  color: string | undefined,
  fallback = "var(--primary-color)"
): string {
  if (!color) return fallback;
  if (HA_COLOR_PALETTE.has(color)) return `var(--${color}-color)`;
  return color;
}

/**
 * Resolve a CSS color expression (including var() references) to the
 * computed rgb() string in the context of `host`.
 */
export function resolveCssColor(host: HTMLElement, color: string): string {
  const probe = document.createElement("div");
  probe.style.color = color;
  probe.style.display = "none";
  (host.shadowRoot ?? host).appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

/**
 * Black or white, whichever is readable on the given background color
 * (an rgb()/rgba() string as returned by resolveCssColor).
 */
export function readableTextColor(rgbColor: string): string {
  const match = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(rgbColor);
  if (!match) return "#fff";
  const [r, g, b] = match.slice(1, 4).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? "rgba(0, 0, 0, 0.87)" : "#fff";
}
