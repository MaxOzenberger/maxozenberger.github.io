import { React, DataSourceComponent } from 'jimu-core';
import { hooks } from 'jimu-ui';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
const OriginDataSourceManager = (props) => {
    const { widgetId, useDataSource, onQueryRequired } = props;
    const { queryVersion, dataSource, filter } = useChartRuntimeState();
    const dataSourceRef = hooks.useRefValue(dataSource);
    const dispatch = useChartRuntimeDispatch();
    //When the filter is modified, update it to the data source
    React.useEffect(() => {
        var _a;
        if (dataSourceRef.current) {
            dataSourceRef.current.updateQueryParams({ where: (_a = filter === null || filter === void 0 ? void 0 : filter.sql) !== null && _a !== void 0 ? _a : '1=1' }, widgetId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
    const handleCreated = (dataSouce) => {
        dispatch({ type: 'SET_DATA_SOURCE', value: dataSouce });
    };
    const handleQueryRequired = () => {
        dispatch({ type: 'SET_QUERY_VERSION', value: queryVersion + 1 });
        onQueryRequired === null || onQueryRequired === void 0 ? void 0 : onQueryRequired();
    };
    return React.createElement(DataSourceComponent, { widgetId: widgetId, useDataSource: useDataSource, onDataSourceCreated: handleCreated, onQueryRequired: handleQueryRequired });
};
export default OriginDataSourceManager;
//# sourceMappingURL=original.js.map