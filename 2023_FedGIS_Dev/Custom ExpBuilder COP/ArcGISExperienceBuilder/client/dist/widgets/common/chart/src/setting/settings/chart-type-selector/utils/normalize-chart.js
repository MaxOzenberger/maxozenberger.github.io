import { getSeriesType } from 'jimu-ui/advanced/chart';
import { getOutStatisticName } from '../../../../utils/common/serial';
import { isSerialSeries, getFillSymbol, getDefaultSeriesFillColor } from '../../../../utils/default';
/**
 * Normalize the statistic type `percentile_cont`, inject `statisticParameters` into `outStatistics`.
 * @param query
 */
const normalizePercentileCont = (query) => {
    if (!(query === null || query === void 0 ? void 0 : query.outStatistics))
        return query;
    query.outStatistics = query.outStatistics.map((outStatistic) => {
        if (outStatistic.statisticType === 'percentile_cont') {
            return Object.assign(Object.assign({}, outStatistic), { statisticParameters: { value: 0.5 } });
        }
        else {
            return outStatistic;
        }
    });
    return query;
};
/**
 * Function merging multiple `outStatistics` properties.
 * @param uniqueQuery
 * @param series
 */
const mergeOutStatistics = (uniqueQuery, series) => {
    series.slice(1).forEach((serie) => {
        var _a, _b, _c;
        const outStatistics = ((_a = uniqueQuery.outStatistics) !== null && _a !== void 0 ? _a : []).concat(((_c = (_b = serie.query) === null || _b === void 0 ? void 0 : _b.outStatistics) !== null && _c !== void 0 ? _c : []));
        uniqueQuery = Object.assign(Object.assign({}, uniqueQuery), { outStatistics });
    });
    return normalizePercentileCont(uniqueQuery);
};
/**
 * Function building a unique query based on the chart series config.
 * Note: all queries have the same `groupByFieldsForStatistics`, so they can be combined into one query.
 */
const buildGroupStatUniqueQuery = (series) => {
    var _a, _b, _c;
    if (!(series === null || series === void 0 ? void 0 : series.length))
        return null;
    let uniqueQuery = series[0].query;
    if ((_a = uniqueQuery.outStatistics) === null || _a === void 0 ? void 0 : _a.length) {
        if ((_b = uniqueQuery === null || uniqueQuery === void 0 ? void 0 : uniqueQuery.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b.length) {
            uniqueQuery = mergeOutStatistics(uniqueQuery, series);
        }
    }
    else {
        // For no-aggregation, set `outFields` to query.
        if ((_c = uniqueQuery === null || uniqueQuery === void 0 ? void 0 : uniqueQuery.groupByFieldsForStatistics) === null || _c === void 0 ? void 0 : _c.length) {
            const outFields = buildOutFieldsQuery(series);
            uniqueQuery = Object.assign(Object.assign({}, uniqueQuery), outFields);
        }
    }
    return uniqueQuery;
};
/**
 * Function merging `outFields` to a unique query based on the chart series config.
 */
const buildOutFieldsQuery = (series) => {
    const outFields = [];
    const x = series[0].x;
    const y = series[0].y;
    outFields.push(x);
    if (y) {
        outFields.push(y);
    }
    return { outFields };
};
const DefautSeriesFillColor = getDefaultSeriesFillColor();
/**
 * The color type `colorMatch` is not supported, fallback to `singleColor`.
 * @param series
 */
const normalizeSeriesColorType = (series) => {
    return series === null || series === void 0 ? void 0 : series.map((serie) => {
        let colorType = serie.colorType;
        if (colorType !== 'singleColor') {
            // console.warn(`Unsupported color type: ${colorType}, fallback to "singleColor"`)
            colorType = 'singleColor';
            const seriesType = getSeriesType([serie]);
            if (seriesType === 'scatterSeries') {
                serie = Object.assign(Object.assign({}, serie), { colorType });
            }
            else if (isSerialSeries(seriesType) || seriesType === 'pieSeries') {
                serie = Object.assign(Object.assign({}, serie), { colorType });
                if (serie.fillSymbol && !serie.fillSymbol.color) {
                    const defaultFillSymbol = getFillSymbol(DefautSeriesFillColor, 0);
                    const fillSymbol = Object.assign(Object.assign({}, (serie.fillSymbol)), defaultFillSymbol);
                    serie = Object.assign(Object.assign({}, serie), { fillSymbol });
                }
            }
        }
        return serie;
    });
};
/**
 * Ensure that the `outStatisticFieldName  is consistent with the `y` of the series.
 * @param series
 */
const normalizeGroupStateSeriesQuery = (series) => {
    return series.map((serie) => {
        var _a, _b, _c, _d, _e;
        const hasStatistics = (_b = (_a = serie.query) === null || _a === void 0 ? void 0 : _a.outStatistics) === null || _b === void 0 ? void 0 : _b.length;
        if (!hasStatistics)
            return serie;
        const y = serie.y;
        let query = serie.query;
        const outStatisticFieldName = (_d = (_c = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.outStatisticFieldName;
        const orderByFields = (_e = query === null || query === void 0 ? void 0 : query.orderByFields) === null || _e === void 0 ? void 0 : _e.map((orderByField) => {
            var _a, _b, _c;
            const field = (_a = orderByField.split(' ')) === null || _a === void 0 ? void 0 : _a[0];
            const order = (_c = (_b = orderByField.split(' ')) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 'ASC';
            if (field && field === outStatisticFieldName) {
                return `${y} ${order}`;
            }
            return orderByField;
        });
        const outStatistics = query === null || query === void 0 ? void 0 : query.outStatistics.map((outStatistic) => {
            return Object.assign(Object.assign({}, outStatistic), { outStatisticFieldName: y });
        });
        query = Object.assign(Object.assign({}, query), { orderByFields,
            outStatistics });
        serie = Object.assign(Object.assign({}, serie), { query });
        return serie;
    });
};
/**
 * Ensure that the `id` and `y` of the series are consistent with the `onStatisticField` of the `query`.
 * @param series
 */
const normalizeGroupStateSeriesY = (series) => {
    return series === null || series === void 0 ? void 0 : series.map((serie) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const hasStatistics = (_b = (_a = serie.query) === null || _a === void 0 ? void 0 : _a.outStatistics) === null || _b === void 0 ? void 0 : _b.length;
        if (!hasStatistics)
            return serie;
        const numericField = (_e = (_d = (_c = serie.query) === null || _c === void 0 ? void 0 : _c.outStatistics) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.onStatisticField;
        const statisticType = (_h = (_g = (_f = serie.query) === null || _f === void 0 ? void 0 : _f.outStatistics) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.statisticType;
        const id = serie.id;
        if (numericField && numericField !== id) {
            serie = Object.assign(Object.assign({}, serie), { id: numericField });
        }
        const y = getOutStatisticName(numericField, statisticType);
        if (y && y !== serie.y) {
            serie = Object.assign(Object.assign({}, serie), { y });
        }
        return serie;
    });
};
/**
 * Ensure that the `id` of the series are consistent with the `y` of the series for non-grouped statistics.
 * @param series
 */
const normalizeOutFieldsSeriesY = (series) => {
    return series === null || series === void 0 ? void 0 : series.map((serie) => {
        const numericField = serie.y;
        if (!numericField)
            return serie;
        const id = serie.id;
        if (numericField && numericField !== id) {
            serie = Object.assign(Object.assign({}, serie), { id: numericField });
        }
        if (numericField && numericField !== serie.y) {
            serie = Object.assign(Object.assign({}, serie), { y: numericField });
        }
        return serie;
    });
};
/**
 * Normalize the `series` from mapviewer to the chart widget.
 * @param series
 * @returns
 */
const normalizeSeries = (series) => {
    const seriesType = getSeriesType(series);
    let query = null;
    if (isSerialSeries(seriesType) || seriesType === 'pieSeries') {
        series = normalizeGroupStateSeriesY(series);
        series = normalizeGroupStateSeriesQuery(series);
        series = normalizeSeriesColorType(series);
        query = buildGroupStatUniqueQuery(series);
    }
    else if (seriesType === 'scatterSeries') {
        series = normalizeOutFieldsSeriesY(series);
        series = normalizeSeriesColorType(series);
        query = buildOutFieldsQuery(series);
    }
    series = series.map((serie) => {
        delete serie.query;
        return serie;
    });
    return [series, query];
};
/**
 * Normalize the webChart from mapviewer to the chart widget.
 * @param webChart
 * @returns {IWebChart}
 */
const normalizeChart = (webChart) => {
    const [series, query] = normalizeSeries(webChart.series);
    const dataSource = { query };
    return Object.assign(Object.assign({}, webChart), { series: series, dataSource });
};
export default normalizeChart;
//# sourceMappingURL=normalize-chart.js.map