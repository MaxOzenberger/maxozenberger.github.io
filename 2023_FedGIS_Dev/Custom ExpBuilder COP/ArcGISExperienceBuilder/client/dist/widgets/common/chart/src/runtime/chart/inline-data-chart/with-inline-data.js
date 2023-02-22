import { React, useIntl } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
import convertRecordsToInlineData from './convert-utils';
import { hooks, defaultMessages as jimuUiMessages } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { normalizePieSlices, normalizeSeriesName } from './utils';
import { ChartComponents } from '../components';
import { useSelection, getSeriesWithQuery } from '../utils';
const noDataOptions = {
    displayMessageWhenNoData: false
};
const DefaultDataSource = {
    type: 'inline'
};
const background = [0, 0, 0, 0];
function WithInlineDataChart(props) {
    var _a, _b;
    const { className, widgetId, webChart: propWebChart, chartLimits } = props;
    const { outputDataSource, records, recordsStatus } = useChartRuntimeState();
    const dispatch = useChartRuntimeDispatch();
    const id = widgetId + '-' + ((_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.id) !== null && _a !== void 0 ? _a : 'chart');
    const intl = useIntl();
    const translate = hooks.useTranslate(defaultMessages, jimuUiMessages);
    const webMapWebChartRef = React.useRef(null);
    let webChart = React.useMemo(() => propWebChart.without('dataSource').set('id', id).set('background', background), [id, propWebChart]);
    const type = getSeriesType(propWebChart.series);
    const query = (_b = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.dataSource) === null || _b === void 0 ? void 0 : _b.query;
    const propSeries = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series;
    const [inlineData, dataItems] = React.useMemo(() => convertRecordsToInlineData(type, records, query, propSeries, intl), [type, records, query, propSeries, intl]);
    const dataSource = React.useMemo(() => {
        var _a;
        return Object.assign(Object.assign({}, DefaultDataSource), { processed: (_a = inlineData === null || inlineData === void 0 ? void 0 : inlineData.processed) !== null && _a !== void 0 ? _a : true });
    }, [inlineData === null || inlineData === void 0 ? void 0 : inlineData.processed]);
    let series = React.useMemo(() => getSeriesWithQuery(propSeries, query), [propSeries, query]);
    series = React.useMemo(() => normalizePieSlices(series, query, dataItems), [dataItems, query, series]);
    series = React.useMemo(() => normalizeSeriesName(series, query, translate), [series, query, translate]);
    webChart = React.useMemo(() => webChart.set('series', series), [webChart, series]);
    const webMapWebChart = React.useMemo(() => {
        // Ensure that the chart is rendered after the data is loaded
        if (recordsStatus !== 'loaded') {
            return webMapWebChartRef.current;
        }
        else {
            webMapWebChartRef.current = webChart;
            return webChart;
        }
    }, [recordsStatus, webChart]);
    const hanldleCreated = React.useCallback((chart) => {
        dispatch({ type: 'SET_CHART', value: chart });
    }, [dispatch]);
    const [selectionData, handleSelectionChange] = useSelection(widgetId, outputDataSource, propSeries === null || propSeries === void 0 ? void 0 : propSeries.length);
    return (React.createElement(React.Fragment, null, webMapWebChart && React.createElement(ChartComponents, { ref: hanldleCreated, className: className, webMapWebChart: webMapWebChart, dataSource: dataSource, inlineData: inlineData, noDataOptions: noDataOptions, hideLoaderAnimation: true, chartLimits: chartLimits, selectionData: selectionData, arcgisChartsSelectionComplete: handleSelectionChange })));
}
export default WithInlineDataChart;
//# sourceMappingURL=with-inline-data.js.map