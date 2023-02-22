import { DataSourceManager } from 'jimu-core';
export function getAllLayersFromDataSource(dataSource) {
    var _a;
    const dsManager = DataSourceManager.getInstance();
    const dataSources = (_a = dsManager === null || dsManager === void 0 ? void 0 : dsManager.getDataSource(dataSource)) === null || _a === void 0 ? void 0 : _a.getChildDataSources();
    const allLayerSources = [];
    dataSources === null || dataSources === void 0 ? void 0 : dataSources.forEach((layer) => {
        if (layer.type === 'GROUP_LAYER') {
            const subLayers = layer.getChildDataSources();
            if (subLayers) {
                subLayers.forEach(subLayer => {
                    allLayerSources.push(subLayer);
                });
            }
        }
        else {
            allLayerSources.push(layer);
        }
    });
    return allLayerSources;
}
export function defaultSelectedUnits(activeDsConfig, portalSelf) {
    //get the configured units
    let configuredElevationUnit = activeDsConfig === null || activeDsConfig === void 0 ? void 0 : activeDsConfig.profileChartSettings.elevationUnit;
    let configuredLinearUnit = activeDsConfig === null || activeDsConfig === void 0 ? void 0 : activeDsConfig.profileChartSettings.linearUnit;
    //if configured units are empty set the units based on portal units
    if (!(activeDsConfig === null || activeDsConfig === void 0 ? void 0 : activeDsConfig.profileChartSettings.elevationUnit)) {
        if ((portalSelf === null || portalSelf === void 0 ? void 0 : portalSelf.units) === 'english') {
            configuredElevationUnit = 'feet';
        }
        else {
            configuredElevationUnit = 'meters';
        }
    }
    if (!(activeDsConfig === null || activeDsConfig === void 0 ? void 0 : activeDsConfig.profileChartSettings.linearUnit)) {
        if ((portalSelf === null || portalSelf === void 0 ? void 0 : portalSelf.units) === 'english') {
            configuredLinearUnit = 'miles';
        }
        else {
            configuredLinearUnit = 'kilometers';
        }
    }
    return [configuredElevationUnit, configuredLinearUnit];
}
export function getRandomHexColor() {
    const randomHexColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return '#' + randomHexColor;
}
//# sourceMappingURL=utils.js.map