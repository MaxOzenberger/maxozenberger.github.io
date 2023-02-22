import { Immutable } from 'jimu-core';
import { utils as jimuUtils } from 'jimu-ui';
import { getSeriesType, WebChartTypes, WebChartCurrentVersion, RESTSimpleLineSymbolStyle } from 'jimu-ui/advanced/chart';
import { DefaultBgColor, getLineSymbol, DefaultGridColor, getChartText, DefaultTitleSize, DefaultTitleColor, DefaultFooterSize, DefaultFooterColor, getDefaultPieChartSeries, getDefaultScatterPlotChartSeries, getDefaultHistogramSeries, getDefaultLegend, getDefaultBarChartSeries, getDefaultLineChartSeries, getDefaultAxes, isXYChart } from '../../../../utils/default';
const completeVersion = (webChart) => {
    if (!webChart.version) {
        webChart = webChart.set('version', WebChartCurrentVersion);
    }
    return webChart;
};
const completeBackgroundColor = (webChart) => {
    let background = webChart.background || DefaultBgColor;
    background = jimuUtils.convertJsAPISymbolColorToStringColor(background);
    webChart = webChart.set('background', background);
    return webChart;
};
const DefaultGrid = getLineSymbol(0, DefaultGridColor, RESTSimpleLineSymbolStyle.Dash);
const completeAxes = (webChart) => {
    if (!isXYChart(webChart === null || webChart === void 0 ? void 0 : webChart.series)) {
        return webChart;
    }
    const seriesType = getSeriesType(webChart.series);
    let axes = webChart.axes || Immutable(getDefaultAxes(seriesType));
    axes = webChart.axes.map((axis) => {
        return axis.grid == null ? axis.set('grid', DefaultGrid) : axis;
    });
    webChart = webChart.set('axes', axes);
    return webChart;
};
const completeSeries = (webChart) => {
    var _a;
    if (webChart.series) {
        return webChart;
    }
    const seriesType = (_a = getSeriesType(webChart.series)) !== null && _a !== void 0 ? _a : WebChartTypes.BarSeries;
    let series = null;
    switch (seriesType) {
        case WebChartTypes.BarSeries:
            series = getDefaultBarChartSeries();
            break;
        case WebChartTypes.LineSeries:
            series = getDefaultLineChartSeries();
            break;
        case WebChartTypes.PieSeries:
            series = getDefaultPieChartSeries();
            break;
        case WebChartTypes.ScatterSeries:
            series = getDefaultScatterPlotChartSeries();
            break;
        case WebChartTypes.HistogramSeries:
            series = getDefaultHistogramSeries();
        default:
            break;
    }
    webChart = webChart.set('series', [series]);
    return webChart;
};
const completeTitle = (webChart) => {
    if (webChart.title == null) {
        const title = getChartText('', true, DefaultTitleSize, DefaultTitleColor);
        webChart = webChart.set('title', title);
    }
    return webChart;
};
const completeFooter = (webChart) => {
    if (webChart.footer == null) {
        const footer = getChartText('', true, DefaultFooterSize, DefaultFooterColor);
        webChart = webChart.set('footer', footer);
    }
    return webChart;
};
const completeLegend = (webChart) => {
    if (webChart.legend == null) {
        const legend = getDefaultLegend(false);
        webChart = webChart.set('legend', legend);
    }
    return webChart;
};
/**
 * Completing the chart configuration.
 * @param propWebChart
 * @returns {IWebChart}
 */
const completeChart = (propWebChart) => {
    let webChart = Immutable(propWebChart);
    webChart = completeVersion(webChart);
    webChart = completeBackgroundColor(webChart);
    webChart = completeSeries(webChart);
    webChart = completeAxes(webChart);
    webChart = completeTitle(webChart);
    webChart = completeFooter(webChart);
    webChart = completeLegend(webChart);
    return webChart;
};
export default completeChart;
//# sourceMappingURL=complete-chart.js.map