/**
 * Get widget card node.
 * @param widgetId
 */
export const getWidgetCardNode = (widgetId) => {
    const node = document.querySelector(`.widget-controller .avatar-card[data-widgetid='${widgetId}']`);
    return node;
};
//# sourceMappingURL=utils.js.map