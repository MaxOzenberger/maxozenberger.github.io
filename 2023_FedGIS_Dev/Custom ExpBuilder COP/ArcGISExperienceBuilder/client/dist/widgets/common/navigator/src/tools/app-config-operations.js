export default class AppConfigOperation {
    constructor() {
        this.id = 'query-app-config-operation';
    }
    afterWidgetCopied(copiedWidgetId, appConfig, widgetMap) {
        var _a, _b, _c, _d, _e, _f;
        if (!widgetMap) { // no need to change widget linkage if it is not performed during a page copying
            return appConfig;
        }
        const widgetJson = appConfig.widgets[this.widgetId];
        const config = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.config;
        const currentSectionId = widgetMap === null || widgetMap === void 0 ? void 0 : widgetMap[(_a = config === null || config === void 0 ? void 0 : config.data) === null || _a === void 0 ? void 0 : _a.section];
        const sourceWidgetSectionView = (_d = (_b = appConfig === null || appConfig === void 0 ? void 0 : appConfig.sections) === null || _b === void 0 ? void 0 : _b[(_c = config === null || config === void 0 ? void 0 : config.data) === null || _c === void 0 ? void 0 : _c.section]) === null || _d === void 0 ? void 0 : _d.views;
        const currentWidgetSectionView = (_f = (_e = appConfig === null || appConfig === void 0 ? void 0 : appConfig.sections) === null || _e === void 0 ? void 0 : _e[currentSectionId]) === null || _f === void 0 ? void 0 : _f.views;
        const displayViews = [];
        sourceWidgetSectionView === null || sourceWidgetSectionView === void 0 ? void 0 : sourceWidgetSectionView.forEach((view, index) => {
            var _a, _b;
            if ((_b = (_a = config === null || config === void 0 ? void 0 : config.data) === null || _a === void 0 ? void 0 : _a.views) === null || _b === void 0 ? void 0 : _b.includes(view)) {
                displayViews.push(currentWidgetSectionView[index]);
            }
        });
        const newAppConfig = appConfig.setIn(['widgets', copiedWidgetId, 'config', 'data', 'section'], currentSectionId)
            .setIn(['widgets', copiedWidgetId, 'config', 'data', 'views'], displayViews);
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