import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import type { BaseWidgetConfig, HomeAssistant, LovelaceCard } from "./types.js";

/**
 * Base class for all WDH widgets.
 *
 * Subclasses implement `render()` (Lit) and may override `validateConfig`,
 * `applyDefaults`, `getCardSize` and `getGridOptions`.
 */
export abstract class BaseWidget<C extends BaseWidgetConfig = BaseWidgetConfig>
  extends LitElement
  implements LovelaceCard
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected config?: C;

  /** Throw with a helpful message when the config is invalid. */
  protected validateConfig(_config: C): void {
    // default: everything goes
  }

  /** Merge defaults into the user config. */
  protected applyDefaults(config: C): C {
    return config;
  }

  public setConfig(config: C): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.validateConfig(config);
    this.config = this.applyDefaults({ ...config });
  }

  /** Height hint for the legacy masonry view (1 unit ≈ 50px). */
  public getCardSize(): number {
    return 3;
  }

  /**
   * Sizing for HA sections/grid views. Columns are 1/12 of the section width,
   * rows are 56px + gap.
   */
  public getGridOptions(): Record<string, number | string> {
    return {
      columns: 6,
      rows: 3,
      min_columns: 4,
      min_rows: 2,
    };
  }
}
