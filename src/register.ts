import { WDH_CORE_VERSION } from "./version.js";

export interface WidgetRegistration {
  /** Custom element tag + card type, e.g. "wdh-room-summary-card" */
  type: string;
  /** Human readable name shown in the card picker */
  name: string;
  description: string;
  /** Widget version (the widget repo's own CalVer) */
  version: string;
  element: CustomElementConstructor;
  editor?: CustomElementConstructor;
  documentationURL?: string;
}

/**
 * Define the card (and its editor) as custom elements and announce it to
 * Home Assistant's card picker.
 */
export function registerWidget(reg: WidgetRegistration): void {
  if (!customElements.get(reg.type)) {
    customElements.define(reg.type, reg.element);
  }
  const editorType = `${reg.type}-editor`;
  if (reg.editor && !customElements.get(editorType)) {
    customElements.define(editorType, reg.editor);
  }

  window.customCards = window.customCards ?? [];
  if (!window.customCards.some((card) => card.type === reg.type)) {
    window.customCards.push({
      type: reg.type,
      name: reg.name,
      description: reg.description,
      preview: true,
      documentationURL: reg.documentationURL,
    });
  }

  // eslint-disable-next-line no-console
  console.info(
    `%c WDH %c ${reg.name} ${reg.version} (core ${WDH_CORE_VERSION}) `,
    "background:#111;color:#fff;font-weight:800;border-radius:4px 0 0 4px;padding:2px 6px",
    "background:#03a9f4;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px"
  );
}
