import { React, DataSourceManager, DataSourceTypes } from 'jimu-core';
/**
 * Check if the data source supports `percentile` statistics.
 * @param dataSourceId
 */
export const usePercentileStatisticsSupport = (dataSourceId) => {
    const supportPercentile = React.useMemo(() => {
        var _a, _b, _c;
        if (!dataSourceId)
            return false;
        let dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId);
        if (!dataSource)
            return false;
        if (dataSource.type === DataSourceTypes.SceneLayer) {
            dataSource = dataSource.getAssociatedDataSource();
        }
        const capabilities = (_b = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getCapabilities) === null || _a === void 0 ? void 0 : _a.call(dataSource)) === null || _b === void 0 ? void 0 : _b.getQueryCapabilities();
        return (_c = capabilities === null || capabilities === void 0 ? void 0 : capabilities.supportsPercentileStatistics) !== null && _c !== void 0 ? _c : false;
    }, [dataSourceId]);
    return supportPercentile;
};
//# sourceMappingURL=utils.js.map