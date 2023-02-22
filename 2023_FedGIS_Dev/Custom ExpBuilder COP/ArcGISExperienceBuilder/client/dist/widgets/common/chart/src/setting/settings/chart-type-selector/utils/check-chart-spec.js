import { JimuFieldType } from 'jimu-core';
import { getSeriesType, WebChartCurrentVersion } from 'jimu-ui/advanced/chart';
import { getFieldType } from '../../../../utils/common';
import { isSerialSeries } from '../../../../utils/default';
const composeCheckFn = (...fns) => {
    return (...args) => {
        let status = { valid: true, error: '' };
        fns.some(fn => {
            status = fn(...args);
            return !status.valid;
        });
        return status;
    };
};
/**
 * Check if the version of `WebMapWebChart` is supported.
 * Note: The chart stored in webmap has the version, but there is no version on the chart of layer, so don't check it first.
 * @param WebMapWebChart
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkVersion = (WebMapWebChart) => {
    let valid = true;
    let error = '';
    valid = WebMapWebChart.version === WebChartCurrentVersion;
    if (!valid) {
        error = `Unsupported versions: ${WebMapWebChart.version}.`;
    }
    return { valid, error };
};
/**
 * Check whether it is a supported series type.
 * @param series
 */
const checkSeriesType = (series) => {
    let valid = true;
    let error = '';
    const seriesType = getSeriesType(series);
    if (!seriesType) {
        valid = false;
        error = 'Invalid series type';
    }
    else {
        const isSerial = isSerialSeries(seriesType);
        valid = isSerial || seriesType === 'scatterSeries' ||
            seriesType === 'pieSeries';
        if (!valid) {
            error = `Unsupported type: ${seriesType}.`;
        }
    }
    return { valid, error };
};
/**
 * Check whether there are unsupported query properties in the series.
 * @param series
 */
const checkSeriesQuery = (series) => {
    var _a, _b, _c;
    let valid = true;
    let error = '';
    const seriesType = getSeriesType(series);
    if (isSerialSeries(seriesType) || seriesType === 'pieSeries') {
        const query = series[0].query;
        const noAggregation = ((_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a.length) && !((_b = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _b === void 0 ? void 0 : _b.length);
        if (noAggregation) {
            valid = false;
            error = 'No aggregation is not supported now.';
        }
        else {
            const statisticType = (_c = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _c === void 0 ? void 0 : _c[0].statisticType;
            if (statisticType === 'percentile_cont') {
                valid = false;
                error = `Unsupported statistic type: ${statisticType}.`;
            }
        }
    }
    return { valid, error };
};
/**
 * Check whether there are `date` related properties.
 * @param series
 */
const checkSeriesField = (series, dataSourceId) => {
    var _a;
    let valid = true;
    let error = '';
    const field = (_a = series[0]) === null || _a === void 0 ? void 0 : _a.x;
    const isDateField = getFieldType(field, dataSourceId) === JimuFieldType.Date;
    if (isDateField) {
        valid = false;
        error = 'Date field is not supported.';
    }
    return { valid, error };
};
/**
 * Check whether `split-by` is set.
 * @param series
 */
const checkSeriesWhere = (series) => {
    var _a;
    let valid = true;
    let error = '';
    const where = (_a = series[0].query) === null || _a === void 0 ? void 0 : _a.where;
    const splited = where && where !== '1=1' && where.includes('=');
    if (splited) {
        valid = false;
        error = `Check that there is where in the series: ${where}, split by field is not supported now`;
    }
    return { valid, error };
};
/**
 * Check color type, `colorMatch` is not supported.
 * @param series
 */
const checkSeriesColorType = (series) => {
    let valid = true;
    let warning = '';
    const colorType = series[0].colorType;
    if (colorType !== 'singleColor') {
        valid = true;
        warning = `Unsupported color type: ${colorType}, will fallback to "singleColor"`;
    }
    return { valid, warning };
};
/**
 * Check if the `WebMapWebChart` is supported.
 * @param WebMapWebChart
 * @returns {SpecValidationStatus}
 */
const checkChartSpec = (WebMapWebChart, dataSourceId) => {
    return composeCheckFn(checkSeriesType, checkSeriesField, checkSeriesWhere, checkSeriesQuery, checkSeriesColorType)(WebMapWebChart.series, dataSourceId);
};
export default checkChartSpec;
//# sourceMappingURL=check-chart-spec.js.map