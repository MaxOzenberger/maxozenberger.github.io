/**
 * Convert to formatted and coloring data for `by-group` mode.
 * @param records
 * @param x
 * @param intl
 */
export const convertGroupData = (records, query, intl) => {
    var _a;
    const result = [];
    const x = (_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a[0];
    records === null || records === void 0 ? void 0 : records.forEach((record) => {
        const data = record.getData();
        // Null category value will affect the calculation of value axis range,
        // and it will not be displayed on the chart by default, so we filter it out. #7607
        let item = Object.assign({}, data);
        if (x && item[x] == null)
            return;
        //Now only formatted the value of x
        item = formatFieldValue(item, record, x, intl);
        result.push(item);
    });
    return result;
};
/**
 * Format the specific field value by its record.
 * @param item
 * @param record
 * @param field
 */
export const formatFieldValue = (item, record, field, intl) => {
    const xValue = record.getFieldValue(field);
    const xFormattedValue = record.getFormattedFieldValue(field, intl);
    if (xFormattedValue !== xValue) {
        item[field] = xFormattedValue;
        item[field + '_original'] = xValue;
    }
    return item;
};
//# sourceMappingURL=common.js.map