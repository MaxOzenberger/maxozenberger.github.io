import { getSeriesType } from 'jimu-ui/advanced/chart';
import { CategoryType } from '../../../config';
import { ByFieldSeriesX } from '../../../constants';
import { getCategoryType, normalizeStatisticFieldLabel } from '../../../utils/common/serial';
import { isSerialSeries } from '../../../utils/default';
export const normalizeSeriesName = (propsSeries, query, translate) => {
    var _a, _b;
    const type = getSeriesType(propsSeries);
    const statisticType = (_b = (_a = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.statisticType;
    const categoryType = getCategoryType(query);
    let series = propsSeries;
    if (categoryType === CategoryType.ByField)
        return series;
    if (!statisticType)
        return series;
    if (isSerialSeries(type) || type === 'pieSeries') {
        series = propsSeries.map(serie => {
            const alias = serie.name;
            const name = normalizeStatisticFieldLabel(statisticType, alias, translate);
            return serie.set('name', name);
        });
    }
    return series;
};
/**
 * Slice is the original value of the field, which needs to be mapped to the formatted value of the field (the data of the chart rendered)
 * @param propsSeries
 * @param query
 * @param dataItems
 */
export const normalizePieSlices = (propsSeries, query, dataItems) => {
    var _a, _b, _c;
    const type = getSeriesType(propsSeries);
    if (type !== 'pieSeries')
        return propsSeries;
    const propSlices = (_a = propsSeries === null || propsSeries === void 0 ? void 0 : propsSeries[0]) === null || _a === void 0 ? void 0 : _a.slices;
    if (!propSlices)
        return propsSeries;
    const categoryType = getCategoryType(query);
    const x = categoryType === CategoryType.ByField ? ByFieldSeriesX : (_b = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b[0];
    const originalx = x + '_original';
    const slices = (_c = propSlices === null || propSlices === void 0 ? void 0 : propSlices.map((slice) => {
        const sliceId = slice.sliceId;
        const matchItem = dataItems === null || dataItems === void 0 ? void 0 : dataItems.find(item => {
            const xValue = (item[originalx] || item[x]);
            if (xValue == null)
                return false;
            return sliceId === xValue || sliceId === (xValue + '');
        });
        if (matchItem) {
            return slice.set('sliceId', matchItem[x]);
        }
        return null;
    })) === null || _c === void 0 ? void 0 : _c.filter(slice => !!slice);
    const series = propsSeries.map(serie => serie.set('slices', slices));
    return series;
};
//# sourceMappingURL=utils.js.map