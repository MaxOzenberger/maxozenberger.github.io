import { React, appConfigUtils, getAppStore, ReactRedux, defaultMessages as jimucoreDefaultMessages, DataSourceStatus, DataSourceManager } from 'jimu-core';
import { hooks, defaultMessages as jimuDefaultMessages } from 'jimu-ui';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { isSerialSeries } from '../../../utils/default';
import defaultMessages from '../../translations/default';
/**
 *  Get the warning message translation.
 * @param type
 * @param sourceStatus
 */
export const getWarningMessageTranslation = (type, sourceStatus) => {
    let translation = '';
    if (sourceStatus === 'exceed') {
        if (isSerialSeries(type)) {
            translation = 'datalimitedTip';
        }
        else if (type === 'pieSeries') {
            translation = 'pieDatalimitedTip';
        }
    }
    else if (sourceStatus === 'empty') {
        translation = 'dataEmptyTip';
    }
    else if (sourceStatus === 'error') {
        translation = 'widgetLoadError';
    }
    return translation;
};
/**
 * Get the warning message translation of not-ready data source.
 * @param useDataSource
 * @returns
 */
export const getNotReadyTranslation = (useDataSource, dataSource) => {
    if (!useDataSource || !dataSource)
        return null;
    const labels = getDataSourceLabels(useDataSource, dataSource);
    const translation = [
        'outputDataIsNotGenerated',
        {
            outputDsLabel: labels.dataSourceLabel,
            sourceWidgetName: labels.widgetLabel
        }
    ];
    return translation;
};
/**
 * Get the label of the widget that outputs the data source
 * @param useDataSource
 */
export const getWidgetLabelFromUseDataSource = (useDataSource) => {
    var _a, _b, _c;
    const widgetId = appConfigUtils.getWidgetIdByOutputDataSource(useDataSource);
    const widgetLabel = (_c = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appConfig.widgets) === null || _b === void 0 ? void 0 : _b[widgetId]) === null || _c === void 0 ? void 0 : _c.label;
    return widgetLabel;
};
/**
 * Get the label of the data source and the label of the widget that outputs the data source
 * @param useDataSource
 * @param dataSource
 * @returns
 */
export const getDataSourceLabels = (useDataSource, dataSource) => {
    const dataSourceLabel = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLabel();
    const widgetLabel = getWidgetLabelFromUseDataSource(useDataSource);
    return { dataSourceLabel, widgetLabel };
};
/**
 * Monitor and get the latest source records
 * @param dataSource
 */
export const useSourceRecords = (dataSource) => {
    const dataSourceId = dataSource === null || dataSource === void 0 ? void 0 : dataSource.id;
    const sourceVersion = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[dataSourceId]) === null || _b === void 0 ? void 0 : _b.sourceVersion; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useMemo(() => {
        var _a;
        const records = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSourceRecords()) !== null && _a !== void 0 ? _a : [];
        return { records, version: sourceVersion };
    }, [dataSource, sourceVersion]);
};
/**
 * Check whether the query in chart data source is valid.
 * @param dataSource
 */
export const isValidQuery = (type, query) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (isSerialSeries(type) || type === 'pieSeries') {
        if (query.outFields) {
            return !!(((_a = query === null || query === void 0 ? void 0 : query.outFields) === null || _a === void 0 ? void 0 : _a[0]) && ((_b = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b[0]));
        }
        else {
            if (query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) {
                return (!!((_c = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _c === void 0 ? void 0 : _c[0]) &&
                    !!((_e = (_d = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.onStatisticField));
            }
            else {
                return !!((_g = (_f = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.onStatisticField);
            }
        }
    }
    else if (type === 'scatterSeries') {
        return !!((_h = query === null || query === void 0 ? void 0 : query.outFields) === null || _h === void 0 ? void 0 : _h[1]);
    }
    else if (type === 'histogramSeries') {
        return !!((_j = query === null || query === void 0 ? void 0 : query.outFields) === null || _j === void 0 ? void 0 : _j[0]);
    }
};
/**
 * Check whether the chart data source is valid.
 * @param dataSource
 */
export const isValidIWebChartDataSource = (type, dataSource) => {
    return isValidQuery(type, dataSource === null || dataSource === void 0 ? void 0 : dataSource.query);
};
/**
 * Check whether the web chart config is valid.
 * @param webChart
 * @returns
 */
export const isWebChartValid = (webChart) => {
    const type = getSeriesType(webChart === null || webChart === void 0 ? void 0 : webChart.series);
    const sourceValid = isValidIWebChartDataSource(type, webChart === null || webChart === void 0 ? void 0 : webChart.dataSource);
    return sourceValid;
};
export const useWarningMessage = (chartType, webChartValid, useDataSource, recordsStatus) => {
    const [type, setType] = React.useState('tooltip');
    const [message, setMessage] = React.useState('');
    const originSourceStatus = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId]) === null || _b === void 0 ? void 0 : _b.status; });
    const instanceStatus = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId]) === null || _b === void 0 ? void 0 : _b.instanceStatus; });
    const translate = hooks.useTranslate(jimucoreDefaultMessages, jimuDefaultMessages, defaultMessages);
    React.useEffect(() => {
        setType(recordsStatus === 'exceed' ? 'basic' : 'tooltip');
        if (originSourceStatus === DataSourceStatus.NotReady &&
            instanceStatus === DataSourceStatus.Created) {
            const dataSource = DataSourceManager.getInstance().getDataSource(useDataSource.dataSourceId);
            const translation = getNotReadyTranslation(useDataSource, dataSource);
            if (translation) {
                const message = translate(...translation);
                setMessage(message);
            }
        }
        else {
            if (!webChartValid) {
                setMessage('');
            }
            else {
                const translation = getWarningMessageTranslation(chartType, recordsStatus);
                if (translation) {
                    const message = translate(translation);
                    setMessage(message);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        originSourceStatus,
        instanceStatus,
        chartType,
        webChartValid,
        recordsStatus
    ]);
    return [type, message];
};
//# sourceMappingURL=utils.js.map