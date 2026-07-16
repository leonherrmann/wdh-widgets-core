import { describe, expect, it } from "vitest";
import {
  areaOfEntity,
  entitiesForArea,
  findAllByDomain,
  findByDomain,
  findSensor,
} from "../src/registry.js";
import type { HomeAssistant } from "../src/types.js";

function mockHass(): HomeAssistant {
  return {
    states: {
      "sensor.living_temp": {
        entity_id: "sensor.living_temp",
        state: "21.3",
        attributes: { device_class: "temperature" },
        last_changed: "",
        last_updated: "",
      },
      "sensor.living_humidity": {
        entity_id: "sensor.living_humidity",
        state: "55",
        attributes: { device_class: "humidity" },
        last_changed: "",
        last_updated: "",
      },
      "sensor.living_battery": {
        entity_id: "sensor.living_battery",
        state: "88",
        attributes: { device_class: "battery" },
        last_changed: "",
        last_updated: "",
      },
      "climate.living": {
        entity_id: "climate.living",
        state: "heat",
        attributes: {},
        last_changed: "",
        last_updated: "",
      },
      "sensor.bedroom_temp": {
        entity_id: "sensor.bedroom_temp",
        state: "19.0",
        attributes: { device_class: "temperature" },
        last_changed: "",
        last_updated: "",
      },
    },
    entities: {
      // directly assigned to area
      "sensor.living_temp": { entity_id: "sensor.living_temp", area_id: "living" },
      // assigned via device
      "sensor.living_humidity": {
        entity_id: "sensor.living_humidity",
        device_id: "dev1",
      },
      // diagnostic entities must be ignored
      "sensor.living_battery": {
        entity_id: "sensor.living_battery",
        area_id: "living",
        entity_category: "diagnostic",
      },
      "climate.living": { entity_id: "climate.living", area_id: "living" },
      "sensor.bedroom_temp": {
        entity_id: "sensor.bedroom_temp",
        area_id: "bedroom",
      },
    },
    devices: {
      dev1: { id: "dev1", area_id: "living" },
    },
    areas: {
      living: { area_id: "living", name: "Living Room", icon: "mdi:sofa" },
      bedroom: { area_id: "bedroom", name: "Bedroom" },
    },
    locale: { language: "en" },
    language: "en",
    config: { unit_system: { temperature: "°C" } },
    callService: async () => undefined,
  };
}

describe("registry helpers", () => {
  const hass = mockHass();

  it("resolves area directly and via device", () => {
    expect(areaOfEntity(hass, "sensor.living_temp")).toBe("living");
    expect(areaOfEntity(hass, "sensor.living_humidity")).toBe("living");
    expect(areaOfEntity(hass, "sensor.unknown")).toBeUndefined();
  });

  it("lists primary entities of an area, excluding diagnostics", () => {
    const ids = entitiesForArea(hass, "living").map((e) => e.entity_id);
    expect(ids).toEqual([
      "climate.living",
      "sensor.living_humidity",
      "sensor.living_temp",
    ]);
  });

  it("finds sensors by device_class scoped to the area", () => {
    expect(findSensor(hass, "living", "temperature")).toBe("sensor.living_temp");
    expect(findSensor(hass, "living", "humidity")).toBe(
      "sensor.living_humidity"
    );
    expect(findSensor(hass, "bedroom", "humidity")).toBeUndefined();
  });

  it("finds entities by domain", () => {
    expect(findByDomain(hass, "living", "climate")).toBe("climate.living");
    expect(findByDomain(hass, "bedroom", "climate")).toBeUndefined();
  });

  it("finds all entities of a domain", () => {
    expect(findAllByDomain(hass, "living", "sensor")).toEqual([
      "sensor.living_humidity",
      "sensor.living_temp",
    ]);
    expect(findAllByDomain(hass, "bedroom", "climate")).toEqual([]);
  });
});
