import { DataSourceComponent, Immutable, React, DataSourceStatus, DataSourceManager, dataSourceUtils } from 'jimu-core';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
/**
 * Check whether a data source instance is valid (whether the corresponding data source is deleted)
 * @param dataSource
 */
const isDataSourceValid = (dataSource) => {
    if (!dataSource)
        return false;
    const info = dataSource.getInfo();
    return info && Object.keys(info).length > 0;
};
const OutputSourceManager = (props) => {
    const { widgetId, dataSourceId } = props;
    const dispatch = useChartRuntimeDispatch();
    const { outputDataSource: dataSource, records } = useChartRuntimeState();
    React.useEffect(() => {
        if (!isDataSourceValid(dataSource) || !records)
            return;
        dataSource.setSourceRecords(records);
        dataSource.setStatus(DataSourceStatus.Unloaded);
        dataSource.setCountStatus(DataSourceStatus.Unloaded);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource, records]);
    const useDataSource = React.useMemo(() => {
        if (dataSourceId) {
            return Immutable({
                dataSourceId: dataSourceId,
                mainDataSourceId: dataSourceId
            });
        }
    }, [dataSourceId]);
    const handleSchemaChange = () => {
        if (!dataSource)
            return;
        syncOriginDsInfo(dataSource);
        if (dataSource.getStatus() !== DataSourceStatus.NotReady) {
            dataSource.setStatus(DataSourceStatus.NotReady);
            dataSource.setCountStatus(DataSourceStatus.NotReady);
        }
    };
    const handleCreated = (dataSource) => {
        syncOriginDsInfo(dataSource);
        dispatch({ type: 'SET_OUTPUT_DATA_SOURCE', value: dataSource });
    };
    const syncOriginDsInfo = (dataSource) => {
        var _a, _b, _c;
        const originDs = DataSourceManager.getInstance().getDataSource((_c = (_b = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.originDataSources) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.dataSourceId);
        if (!dataSource || !originDs) {
            console.error('Failed to sync origin data source info to chart output data source.');
            return;
        }
        dataSource.setPopupInfo(dataSourceUtils.getPopupInfoIntersection(originDs.getPopupInfo(), dataSource));
        dataSource.setLayerDefinition(dataSourceUtils.getLayerDefinitionIntersection(originDs.getLayerDefinition(), dataSource));
    };
    return React.createElement(DataSourceComponent, { widgetId: widgetId, useDataSource: useDataSource, onDataSourceCreated: handleCreated, onDataSourceSchemaChange: handleSchemaChange });
};
export default OutputSourceManager;
//# sourceMappingURL=output.js.map