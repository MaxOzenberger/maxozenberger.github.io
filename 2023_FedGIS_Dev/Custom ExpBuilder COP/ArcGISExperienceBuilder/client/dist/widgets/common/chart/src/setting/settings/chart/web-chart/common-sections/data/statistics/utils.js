import { Immutable } from 'jimu-core';
import { WebChartStackedKinds } from 'jimu-ui/advanced/chart';
import { getDefaultBarChartSeries, getDefaultHistogramSeries, getDefaultLineChartSeries, getDefaultPieChartSeries, getDefaultScatterPlotChartSeries } from '../../../../../../../utils/default';
import { CategoryType } from '../../../../../../../config';
/**
 * Create a default series based on the series properties.
 * @param seriesProps
 * @param index
 */
export const createDefaultSerie = (seriesProps, index = 0) => {
    if (!seriesProps)
        return null;
    const { type = 'lineSeries', dataLabels } = seriesProps;
    let serie = null;
    if (type === 'barSeries') {
        const { fillSymbol, stackedType = WebChartStackedKinds.Side, rotated = false } = seriesProps;
        serie = getDefaultBarChartSeries(index);
        serie.stackedType = stackedType;
        serie.rotated = rotated;
        if (fillSymbol) {
            serie.fillSymbol = fillSymbol;
        }
    }
    else if (type === 'lineSeries') {
        const { stackedType = WebChartStackedKinds.Side, rotated = false, lineSmoothed = false, showArea = false, markerVisible = false, lineSymbol, markerSymbol } = seriesProps;
        serie = getDefaultLineChartSeries(index);
        serie.stackedType = stackedType;
        serie.rotated = rotated;
        serie.lineSmoothed = lineSmoothed;
        serie.showArea = showArea;
        serie.markerVisible = markerVisible;
        if (lineSymbol) {
            serie.lineSymbol = lineSymbol;
        }
        if (markerSymbol) {
            serie.markerSymbol = markerSymbol;
        }
    }
    else if (type === 'pieSeries') {
        const { innerRadius = 0, startAngle = 0, endAngle = 360 } = seriesProps;
        serie = getDefaultPieChartSeries();
        serie.innerRadius = innerRadius;
        serie.startAngle = startAngle;
        serie.endAngle = endAngle;
    }
    else if (type === 'scatterSeries') {
        const { markerSymbol, overlays } = seriesProps;
        serie = getDefaultScatterPlotChartSeries();
        if (markerSymbol) {
            serie.markerSymbol = markerSymbol;
        }
        if (overlays) {
            serie.overlays = overlays;
        }
    }
    else if (type === 'histogramSeries') {
        const { fillSymbol, binCount, overlays } = seriesProps;
        serie = getDefaultHistogramSeries();
        serie.binCount = binCount;
        if (overlays) {
            serie.overlays = overlays;
        }
        if (fillSymbol) {
            serie.fillSymbol = fillSymbol;
        }
    }
    if (dataLabels) {
        serie.dataLabels = dataLabels;
    }
    return serie;
};
/**
 * Get the used series by series id or index.
 * @param propSeries
 * @param id
 * @param index
 */
export const getUsedSeriesProps = (propSeries, id, index = 0) => {
    var _a;
    let serie = propSeries.find((propSerie) => propSerie.id === id);
    if (!serie) {
        const template = (_a = propSeries[index]) !== null && _a !== void 0 ? _a : propSeries[0];
        const { type, dataLabels } = template;
        const { stackedType, rotated } = template;
        const { lineSmoothed, showArea, markerVisible, markerSymbol } = template;
        const { innerRadius, startAngle, endAngle } = template;
        const seriesProps = Immutable({
            type,
            dataLabels,
            stackedType,
            rotated,
            lineSmoothed,
            showArea,
            markerVisible,
            markerSymbol,
            innerRadius,
            startAngle,
            endAngle
        });
        const defaultSerie = createDefaultSerie(seriesProps, index);
        serie = Immutable(defaultSerie);
    }
    return serie;
};
/**
 * Create the default by category type.
 * @param categoryType
 */
export const createDefaultQuery = (categoryType = CategoryType.ByGroup) => {
    if (categoryType === CategoryType.ByGroup) {
        return {
            groupByFieldsForStatistics: [],
            outStatistics: []
        };
    }
    else if (categoryType === CategoryType.ByField) {
        return {
            outStatistics: []
        };
    }
};
//# sourceMappingURL=utils.js.map