import { React, ReactRedux, DataSourceStatus } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import Tools from '../tools';
import WithFeatureLayerChart from './with-feature-layer';
import { useChartRuntimeState } from '../../state';
import { getTemplateType } from '../../../utils/common';
import { ChartRoot, isWebChartValid, useWarningMessage } from '../components';
const useChartRendered = (dataSourceId, webChart) => {
    const status = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[dataSourceId]) === null || _b === void 0 ? void 0 : _b.status; });
    const valid = React.useMemo(() => isWebChartValid(webChart), [webChart]);
    const render = status !== DataSourceStatus.NotReady && valid;
    return { valid, render };
};
const WebFeatureLayerChart = (props) => {
    var _a;
    const { widgetId, tools: propTools, enableDataAction = true, webChart, chartLimits, useDataSource, defaultTemplateType } = props;
    const { recordsStatus } = useChartRuntimeState();
    const type = getSeriesType(webChart === null || webChart === void 0 ? void 0 : webChart.series);
    const showTools = (propTools === null || propTools === void 0 ? void 0 : propTools.cursorEnable) || !!(propTools === null || propTools === void 0 ? void 0 : propTools.filter) || enableDataAction;
    const { valid, render } = useChartRendered(useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId, webChart);
    const templateType = ((_a = getTemplateType(webChart === null || webChart === void 0 ? void 0 : webChart.series)) === null || _a === void 0 ? void 0 : _a[1]) || defaultTemplateType || 'column';
    const [messageType, message] = useWarningMessage(type, valid, useDataSource, recordsStatus);
    const tools = showTools
        ? (React.createElement(Tools, { type: type, tools: propTools, widgetId: widgetId, enableDataAction: enableDataAction }))
        : null;
    return (React.createElement(ChartRoot, { templateType: templateType, messageType: messageType, message: message, showLoading: recordsStatus === 'loading', background: webChart === null || webChart === void 0 ? void 0 : webChart.background, className: 'web-feature-layer-chart', showPlaceholder: !render, tools: tools },
        React.createElement(WithFeatureLayerChart, { className: 'web-chart', widgetId: widgetId, webChart: webChart, chartLimits: chartLimits, useDataSource: useDataSource })));
};
export default WebFeatureLayerChart;
//# sourceMappingURL=index.js.map