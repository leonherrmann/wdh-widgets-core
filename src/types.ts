/**
 * Minimal typed surface of the Home Assistant frontend that WDH widgets rely on.
 * Kept deliberately small; extend only when a widget actually needs a field.
 */

export interface HassEntityAttributes {
  friendly_name?: string;
  icon?: string;
  device_class?: string;
  state_class?: string;
  unit_of_measurement?: string;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  icon?: string | null;
  picture?: string | null;
}

export interface DeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string | null;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  device_id?: string;
  area_id?: string;
  hidden?: boolean;
  /** "config" | "diagnostic" — set for non-primary entities */
  entity_category?: string;
  display_precision?: number;
}

export interface HassLocale {
  language: string;
  number_format?: string;
  time_format?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
  locale: HassLocale;
  language: string;
  themes?: { darkMode?: boolean };
  config: {
    unit_system: { temperature: string };
  };
  formatEntityState?(stateObj: HassEntity): string;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ): Promise<unknown>;
}

/** Base shape every WDH widget config extends. */
export interface BaseWidgetConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: BaseWidgetConfig): void;
  getCardSize?(): number | Promise<number>;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: BaseWidgetConfig): void;
}

/**
 * Subset of the ha-form schema format. `selector` entries are passed through
 * to HA's selector UI untouched, so any selector HA supports can be used.
 */
export interface HaFormSchema {
  name: string;
  selector?: Record<string, unknown>;
  type?: string;
  title?: string;
  iconPath?: string;
  flatten?: boolean;
  required?: boolean;
  default?: unknown;
  schema?: HaFormSchema[];
  column_min_width?: string;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
