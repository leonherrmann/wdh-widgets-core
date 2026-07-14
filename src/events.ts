/** Fire a DOM event the way the HA frontend expects (bubbling, composed). */
export function fireEvent<T>(
  node: HTMLElement | Window,
  type: string,
  detail?: T
): void {
  node.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: false,
    })
  );
}

/** Open the more-info dialog for an entity. */
export function showMoreInfo(node: HTMLElement, entityId: string): void {
  fireEvent(node, "hass-more-info", { entityId });
}
