import { React, ReactRedux, DataSourceStatus, DataSourceManager, DataSourceTypes } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
import { useSelection, getSeriesWithQuery } from '../utils';
import { hooks } from 'jimu-ui';
import createRecordsFromChartData, { getDataItems } from './convert-chart-data-to-records';
import { ChartComponents } from '../components';
const useDataSourceFeatureLayer = (dataSourceId) => {
    const cancelable = hooks.useCancelablePromiseMaker();
    const [layer, setLayer] = React.useState(null);
    const sourceStatus = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[dataSourceId]) === null || _b === void 0 ? void 0 : _b.instanceStatus; });
    React.useEffect(() => {
        if (sourceStatus !== DataSourceStatus.Created)
            return null;
        let dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId);
        if (!dataSource) {
            console.error(`No data source founded for id: ${dataSourceId}`);
            return;
        }
        if (dataSource.type === DataSourceTypes.SceneLayer) {
            dataSource = dataSource.getAssociatedDataSource();
        }
        cancelable(dataSource.createJSAPILayerByDataSource()).then((featureLayer) => {
            setLayer(featureLayer);
        });
    }, [cancelable, dataSourceId, sourceStatus]);
    return layer;
};
const background = [0, 0, 0, 0];
function WithFeatureLayerChart(props) {
    var _a, _b;
    const { className, widgetId, webChart: propWebChart, useDataSource, chartLimits } = props;
    const type = getSeriesType(propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series);
    const id = widgetId + '-' + ((_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.id) !== null && _a !== void 0 ? _a : 'chart');
    const dispatch = useChartRuntimeDispatch();
    const { outputDataSource } = useChartRuntimeState();
    const dataSourceId = useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId;
    const featureLayer = useDataSourceFeatureLayer(dataSourceId);
    const webMapWebChart = React.useMemo(() => {
        var _a;
        const query = (_a = propWebChart.dataSource) === null || _a === void 0 ? void 0 : _a.query;
        const series = getSeriesWithQuery(propWebChart.series, query);
        return propWebChart.without('dataSource').set('series', series).set('id', id).set('background', background);
    }, [id, propWebChart]);
    // const queryParams: SqlQueryParams = React.useMemo(() => {
    //   return (dataSource as QueriableDataSource)?.getCurrentQueryParams()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [dataSource, queryVersion])
    const hanldleCreated = React.useCallback((chart) => {
        dispatch({ type: 'SET_CHART', value: chart });
    }, [dispatch]);
    const handleDataProcessComplete = hooks.useEventCallback((e) => {
        const dataItems = getDataItems(type, e.detail);
        const records = createRecordsFromChartData(dataItems, outputDataSource);
        dispatch({ type: 'SET_RECORDS', value: records });
    });
    const [selectionData, handleSelectionChange] = useSelection(widgetId, outputDataSource, (_b = propWebChart.series) === null || _b === void 0 ? void 0 : _b.length);
    return (React.createElement(React.Fragment, null, featureLayer && React.createElement(ChartComponents, { className: className, webMapWebChart: webMapWebChart, featureLayer: featureLayer, chartLimits: chartLimits, ref: hanldleCreated, selectionData: selectionData, arcgisChartsSelectionComplete: handleSelectionChange, arcgisChartsDataProcessComplete: handleDataProcessComplete })));
}
export default WithFeatureLayerChart;
//# sourceMappingURL=with-feature-layer.js.map