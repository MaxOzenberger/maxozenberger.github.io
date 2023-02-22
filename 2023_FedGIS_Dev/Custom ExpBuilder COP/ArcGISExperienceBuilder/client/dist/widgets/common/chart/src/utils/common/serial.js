import { getFieldType } from '.';
import { CategoryType } from '../../config';
/**
 * Get category type from chart data source
 * @param query
 */
export const getCategoryType = (query) => {
    if ((query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) != null) {
        return CategoryType.ByGroup;
    }
    else if ((query === null || query === void 0 ? void 0 : query.outStatistics) != null) {
        return CategoryType.ByField;
    }
};
/**
 * Get category field from chart query.
 * @param query
 */
export const getCategoryField = (query) => {
    var _a;
    return (_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a[0];
};
/**
 * Get category field type from chart query.
 * @param query
 */
export const getCategoryFieldType = (query, dataSourceId) => {
    var _a;
    const categoryField = (_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a[0];
    const fieldType = getFieldType(categoryField, dataSourceId);
    return fieldType;
};
export const getSerialStackedType = (series) => {
    return (series === null || series === void 0 ? void 0 : series[0]).stackedType;
};
export const getSeriaLlineSmoothed = (series) => {
    return (series === null || series === void 0 ? void 0 : series[0]).lineSmoothed;
};
export const getSeriaLlineShowArea = (series) => {
    return (series === null || series === void 0 ? void 0 : series[0]).showArea;
};
export const getSerialSeriesRotated = (series) => {
    var _a, _b;
    return (_b = (_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.rotated) !== null && _b !== void 0 ? _b : false;
};
const OrderSeparator = ' ';
/**
 * Parse a query.orderByFields[i]
 * @param fieldOrder
 * normal: 'fieldname ASC'
 * with space in field: 'field name ASC'
 */
export const parseOrderByField = (fieldOrder) => {
    if (!fieldOrder || !fieldOrder.includes(OrderSeparator))
        return [];
    const lastIndex = fieldOrder.lastIndexOf(OrderSeparator);
    const index = fieldOrder.indexOf(OrderSeparator);
    if (lastIndex !== index) {
        const field = fieldOrder.substring(0, lastIndex);
        const order = fieldOrder.substring(lastIndex + 1);
        return [field, order];
    }
    else {
        return fieldOrder.split(' ');
    }
};
//Using these special symbols as `outStatisticName` will cause some service statistics to fail.
const SpecialSymbolRegexp = /\(|\)|\[|\]|\%/gm;
/**
 * Generate the `outStatisticName` for `query`, and it's always equal to `serie.y`
 * @param numericField
 * @param statisticType
 */
export const getOutStatisticName = (numericField, statisticType) => {
    if (numericField === null || numericField === void 0 ? void 0 : numericField.match(SpecialSymbolRegexp)) {
        numericField = numericField.replace(SpecialSymbolRegexp, '__');
    }
    return `${numericField}_${statisticType}`;
};
const translations = {
    sum: 'sumOf',
    avg: 'meanOf',
    min: 'minOf',
    max: 'maxOf',
    count: 'count',
    percentile_cont: 'medianOf'
};
/**
 * Normalize the label of statistic type.
 * @param field
 * @param statisticType
 * @param translate
 */
export const normalizeStatisticFieldLabel = (statisticType, field, translate) => {
    const normalized = translate(translations[statisticType], { field });
    return normalized;
};
//# sourceMappingURL=serial.js.map