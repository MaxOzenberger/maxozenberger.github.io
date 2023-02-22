import { React } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { InlineDataSourceManager, FeatureLayerDataSourceManager } from './data-source';
import WebInlineDataChart from './inline-data-chart';
import WebFeatureLayerChart from './feature-layer-chart';
const ChartLimits = {
    maxBarUniqueSeriesCountTotal: 1000,
    maxBarTwoSeriesCountTotal: 1000,
    maxBarThreePlusSeriesCountTotal: 1000,
    maxPieChartSliceCountTotal: 300
};
const Chart = (props) => {
    const { outputDataSourceId, useDataSource, tools, webChart, widgetId, defaultTemplateType, enableDataAction } = props;
    const seriesType = getSeriesType(webChart === null || webChart === void 0 ? void 0 : webChart.series);
    const useInlineData = seriesType !== 'histogramSeries';
    return (React.createElement(React.Fragment, null,
        useInlineData && (React.createElement(React.Fragment, null,
            React.createElement(InlineDataSourceManager, { widgetId: widgetId, webChart: webChart, outputDataSourceId: outputDataSourceId, useDataSource: useDataSource }),
            React.createElement(WebInlineDataChart, { widgetId: widgetId, tools: tools, webChart: webChart, chartLimits: ChartLimits, useDataSource: useDataSource, enableDataAction: enableDataAction, defaultTemplateType: defaultTemplateType }))),
        !useInlineData && (React.createElement(React.Fragment, null,
            React.createElement(FeatureLayerDataSourceManager, { widgetId: widgetId, webChart: webChart, outputDataSourceId: outputDataSourceId, useDataSource: useDataSource }),
            React.createElement(WebFeatureLayerChart, { widgetId: widgetId, tools: tools, webChart: webChart, chartLimits: ChartLimits, useDataSource: useDataSource, enableDataAction: enableDataAction, defaultTemplateType: defaultTemplateType })))));
};
export default Chart;
//# sourceMappingURL=index.js.map