import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { fireEvent } from "./events.js";
import type {
  BaseWidgetConfig,
  HaFormSchema,
  HomeAssistant,
  LovelaceCardEditor,
} from "./types.js";

/**
 * Base class for WDH widget visual editors.
 *
 * Subclasses provide an `ha-form` schema (via `schema()`) plus label/helper
 * text, and get the full HA visual editor experience — selectors, entity
 * pickers, area pickers — for free.
 */
export abstract class BaseEditor<C extends BaseWidgetConfig = BaseWidgetConfig>
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected config?: C;

  public setConfig(config: C): void {
    this.config = config;
  }

  /** The ha-form schema. Re-evaluated on every render, so it may depend on hass/config. */
  protected abstract schema(): HaFormSchema[];

  /**
   * Data shown in the form. Override to reflect config defaults in the UI
   * (e.g. a toggle that is on unless explicitly disabled).
   */
  protected editorData(): C {
    return this.config as C;
  }

  /** Label for a schema entry. Override with translations / friendly names. */
  protected computeLabel = (entry: HaFormSchema): string => entry.name;

  /** Optional helper text under a field (e.g. "Auto-detected: sensor.xyz"). */
  protected computeHelper = (_entry: HaFormSchema): string | undefined =>
    undefined;

  /** Hook to clean the config before it is emitted (drop empty strings etc.). */
  protected normalizeConfig(config: C): C {
    const cleaned = { ...config };
    for (const [key, value] of Object.entries(cleaned)) {
      if (value === "" || value === undefined || value === null) {
        delete cleaned[key];
      }
    }
    return cleaned;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.editorData()}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const config = this.normalizeConfig(ev.detail.value as C);
    fireEvent(this, "config-changed", { config });
  }
}
