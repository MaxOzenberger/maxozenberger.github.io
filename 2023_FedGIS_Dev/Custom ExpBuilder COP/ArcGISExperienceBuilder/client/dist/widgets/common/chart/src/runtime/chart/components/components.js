var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { React } from 'jimu-core';
import { BarChart, getSeriesType, Histogram, LineChart, PieChart, ScatterPlot } from 'jimu-ui/advanced/chart';
export const ChartComponents = React.forwardRef((props, ref) => {
    var _a;
    const { noDataOptions, tooltipFormatter, dataLabelFormatter, enableResponsiveFeatures = false, autoDisposeChart = true, queueChartCreation = true, useAnimatedCharts = false, hideLicenceWatermark = true, ignoreSmoothRenderingLimit = false, legendValueLabelFormatter, setTimeBinningInfoWhenNotProvided } = props, others = __rest(props, ["noDataOptions", "tooltipFormatter", "dataLabelFormatter", "enableResponsiveFeatures", "autoDisposeChart", "queueChartCreation", "useAnimatedCharts", "hideLicenceWatermark", "ignoreSmoothRenderingLimit", "legendValueLabelFormatter", "setTimeBinningInfoWhenNotProvided"]);
    const seriesType = getSeriesType((_a = props.webMapWebChart) === null || _a === void 0 ? void 0 : _a.series);
    const globalOptions = {
        autoDisposeChart,
        enableResponsiveFeatures,
        queueChartCreation,
        useAnimatedCharts,
        hideLicenceWatermark
    };
    return (React.createElement(React.Fragment, null,
        seriesType === 'barSeries' && (React.createElement(BarChart, Object.assign({ ref: ref }, others, { dataLabelFormatter: dataLabelFormatter, tooltipFormatter: tooltipFormatter, noDataOptions: noDataOptions }, globalOptions))),
        seriesType === 'lineSeries' && (React.createElement(LineChart, Object.assign({ ref: ref }, others, { dataLabelFormatter: dataLabelFormatter, tooltipFormatter: tooltipFormatter, ignoreSmoothRenderingLimit: ignoreSmoothRenderingLimit, setTimeBinningInfoWhenNotProvided: setTimeBinningInfoWhenNotProvided, noDataOptions: noDataOptions }, globalOptions))),
        seriesType === 'pieSeries' && (React.createElement(PieChart, Object.assign({ ref: ref }, others, { dataLabelFormatter: dataLabelFormatter, tooltipFormatter: tooltipFormatter, legendValueLabelFormatter: legendValueLabelFormatter, noDataOptions: noDataOptions }, globalOptions))),
        seriesType === 'scatterSeries' && (React.createElement(ScatterPlot, Object.assign({ ref: ref }, others, { dataLabelFormatter: dataLabelFormatter, tooltipFormatter: tooltipFormatter, ignoreSmoothRenderingLimit: ignoreSmoothRenderingLimit, noDataOptions: noDataOptions }, globalOptions))),
        seriesType === 'histogramSeries' && (React.createElement(Histogram, Object.assign({ ref: ref }, others, { dataLabelFormatter: dataLabelFormatter, tooltipFormatter: tooltipFormatter }, globalOptions)))));
});
//# sourceMappingURL=components.js.map