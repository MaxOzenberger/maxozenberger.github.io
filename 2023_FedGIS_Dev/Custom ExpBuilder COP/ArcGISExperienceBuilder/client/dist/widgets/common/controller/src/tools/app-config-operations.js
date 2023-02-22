export default class AppConfigOperation {
    constructor() {
        this.id = 'controller-app-config-operation';
    }
    afterWidgetCopied(copiedWidgetId, appConfig, widgetMap) {
        var _a, _b, _c;
        const widgetJson = appConfig.widgets[this.widgetId];
        const copiedWidgetJson = appConfig.widgets[copiedWidgetId];
        const config = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.config;
        if (!((_a = config === null || config === void 0 ? void 0 : config.behavior) === null || _a === void 0 ? void 0 : _a.openStarts) || ((_c = (_b = config === null || config === void 0 ? void 0 : config.behavior) === null || _b === void 0 ? void 0 : _b.openStarts) === null || _c === void 0 ? void 0 : _c.length) <= 0) {
            return appConfig;
        }
        const useWidgetIds = config.behavior.openStarts;
        const newUseWidgetIds = [];
        if (widgetMap) {
            useWidgetIds.forEach(wId => {
                // widgetMap[wId] is the linked widget id after copying
                newUseWidgetIds.push(widgetMap[wId]);
            });
        }
        else {
            useWidgetIds.forEach(wId => {
                // use large mode only here. all size mode should keep sync
                const oldLayoutJson = appConfig.layouts[widgetJson.layouts.controller.LARGE];
                const newLayoutJson = appConfig.layouts[copiedWidgetJson.layouts.controller.LARGE];
                oldLayoutJson === null || oldLayoutJson === void 0 ? void 0 : oldLayoutJson.order.forEach((itemId, i) => {
                    if (oldLayoutJson.content[itemId].widgetId === wId) {
                        const newWId = newLayoutJson.content[newLayoutJson.order[i]].widgetId;
                        newUseWidgetIds.push(newWId);
                    }
                });
            });
        }
        return appConfig.setIn(['widgets', copiedWidgetId, 'config', 'behavior', 'openStarts'], newUseWidgetIds);
    }
    /**
     * Do some cleanup operations before current widget is removed.
     * @returns The updated appConfig
     */
    widgetWillRemove(appConfig) {
        return appConfig;
    }
}
//# sourceMappingURL=app-config-operations.js.map