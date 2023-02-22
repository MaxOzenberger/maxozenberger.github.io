export default class AppConfigOperation {
    constructor() {
        this.id = 'query-app-config-operation';
    }
    afterWidgetCopied(copiedWidgetId, appConfig, widgetMap) {
        var _a;
        if (!widgetMap) { // no need to change widget linkage if it is not performed during a page copying
            return appConfig;
        }
        const widgetJson = appConfig.widgets[this.widgetId];
        const config = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.config;
        let newAppConfig = appConfig;
        (_a = config.queryItems) === null || _a === void 0 ? void 0 : _a.forEach((queryItem, index) => {
            var _a;
            if (((_a = queryItem.spatialMapWidgetIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const newWidgetIds = queryItem.spatialMapWidgetIds.map(wId => widgetMap[wId]);
                newAppConfig = appConfig.setIn(['widgets', copiedWidgetId, 'config', 'queryItems', index, 'spatialMapWidgetIds'], newWidgetIds);
            }
        });
        return newAppConfig;
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