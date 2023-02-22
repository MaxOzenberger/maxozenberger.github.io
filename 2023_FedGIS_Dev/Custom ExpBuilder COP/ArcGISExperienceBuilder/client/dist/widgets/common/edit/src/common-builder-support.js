import { getAppStore, DataSourceTypes, DataSourceManager } from 'jimu-core';
export function getMapAllLayers(useMapWidgetId) {
    var _a, _b, _c, _d, _e;
    let allLayers = [];
    if (!useMapWidgetId)
        return allLayers;
    const isBuilder = (_a = window === null || window === void 0 ? void 0 : window.jimuConfig) === null || _a === void 0 ? void 0 : _a.isBuilder;
    const appConfig = isBuilder ? (_c = (_b = getAppStore().getState()) === null || _b === void 0 ? void 0 : _b.appStateInBuilder) === null || _c === void 0 ? void 0 : _c.appConfig : (_d = getAppStore().getState()) === null || _d === void 0 ? void 0 : _d.appConfig;
    if (!appConfig)
        return allLayers;
    const mapUseDataSources = (_e = appConfig.widgets[useMapWidgetId]) === null || _e === void 0 ? void 0 : _e.useDataSources;
    if (typeof mapUseDataSources !== 'undefined') {
        const mapUseDataSourcesIds = mapUseDataSources.map(item => item.dataSourceId);
        mapUseDataSourcesIds.forEach(dsId => {
            const currentDs = DataSourceManager.getInstance().getDataSource(dsId);
            const layers = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getDataSourcesByType(DataSourceTypes.FeatureLayer);
            if (layers) {
                allLayers = allLayers.concat(layers);
            }
        });
    }
    return allLayers;
}
//# sourceMappingURL=common-builder-support.js.map