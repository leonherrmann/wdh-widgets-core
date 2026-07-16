import type {
  EntityRegistryDisplayEntry,
  HomeAssistant,
} from "./types.js";

/**
 * Area/device/entity registry helpers used for auto-detection.
 *
 * `hass.entities` / `hass.devices` / `hass.areas` are the display registries
 * the HA frontend keeps in sync over websocket; they are available to custom
 * cards without any extra subscriptions.
 */

/** Resolve the area an entity belongs to (directly or via its device). */
export function areaOfEntity(
  hass: HomeAssistant,
  entityId: string
): string | undefined {
  const entry = hass.entities[entityId];
  if (!entry) return undefined;
  if (entry.area_id) return entry.area_id;
  if (entry.device_id) return hass.devices[entry.device_id]?.area_id ?? undefined;
  return undefined;
}

/**
 * All primary (non-hidden, non-config/diagnostic) registry entities in an area,
 * sorted by entity_id for deterministic auto-detection.
 */
export function entitiesForArea(
  hass: HomeAssistant,
  areaId: string
): EntityRegistryDisplayEntry[] {
  return Object.values(hass.entities)
    .filter(
      (entry) =>
        !entry.hidden &&
        !entry.entity_category &&
        areaOfEntity(hass, entry.entity_id) === areaId
    )
    .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
}

/** First entity of a domain in an area, e.g. findByDomain(hass, "bad", "climate"). */
export function findByDomain(
  hass: HomeAssistant,
  areaId: string,
  domain: string
): string | undefined {
  return findAllByDomain(hass, areaId, domain)[0];
}

/** All entities of a domain in an area, e.g. every climate device of a room. */
export function findAllByDomain(
  hass: HomeAssistant,
  areaId: string,
  domain: string
): string[] {
  const prefix = `${domain}.`;
  return entitiesForArea(hass, areaId)
    .filter((entry) => entry.entity_id.startsWith(prefix))
    .map((entry) => entry.entity_id);
}

/** First sensor in an area with the given device_class (e.g. temperature, humidity). */
export function findSensor(
  hass: HomeAssistant,
  areaId: string,
  deviceClass: string
): string | undefined {
  return entitiesForArea(hass, areaId).find((entry) => {
    if (!entry.entity_id.startsWith("sensor.")) return false;
    const stateObj = hass.states[entry.entity_id];
    return stateObj?.attributes.device_class === deviceClass;
  })?.entity_id;
}

export function areaName(
  hass: HomeAssistant,
  areaId: string
): string | undefined {
  return hass.areas[areaId]?.name;
}

export function areaIcon(
  hass: HomeAssistant,
  areaId: string
): string | undefined {
  return hass.areas[areaId]?.icon ?? undefined;
}

/** All areas, sorted by name — handy for stub configs and editors. */
export function sortedAreas(hass: HomeAssistant) {
  return Object.values(hass.areas).sort((a, b) => a.name.localeCompare(b.name));
}
