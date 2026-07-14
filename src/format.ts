import type { HassEntity, HomeAssistant } from "./types.js";

/** Format a number respecting the user's HA locale. */
export function formatNumber(
  hass: HomeAssistant | undefined,
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const language = hass?.locale?.language ?? hass?.language ?? "en";
  try {
    return new Intl.NumberFormat(language, options).format(value);
  } catch {
    return new Intl.NumberFormat("en", options).format(value);
  }
}

/**
 * Numeric state of an entity rounded to the registry display precision
 * (or `fallbackDigits`). Returns undefined for missing/unavailable states.
 */
export function numericState(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  fallbackDigits = 1
): { value: number; formatted: string; stateObj: HassEntity } | undefined {
  if (!hass || !entityId) return undefined;
  const stateObj = hass.states[entityId];
  if (!stateObj) return undefined;
  const value = Number(stateObj.state);
  if (!Number.isFinite(value)) return undefined;
  const digits =
    hass.entities?.[entityId]?.display_precision ?? fallbackDigits;
  return {
    value,
    formatted: formatNumber(hass, value, {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }),
    stateObj,
  };
}
