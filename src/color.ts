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
