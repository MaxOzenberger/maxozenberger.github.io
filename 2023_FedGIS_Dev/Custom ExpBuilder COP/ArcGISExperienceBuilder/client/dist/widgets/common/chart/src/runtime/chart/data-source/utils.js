import { getSeriesType, WebChartSortOrderKinds } from 'jimu-ui/advanced/chart';
import { ByFieldSeriesX, ByFieldSeriesY, MaxPieces, MaxSlices, ObjectIdField } from '../../../constants';
import { getFieldSchema } from '../../../utils/common';
import { parseOrderByField } from '../../../utils/common/serial';
import { isSerialSeries } from '../../../utils/default';
export const getSourceRecords = (records, dataSource, categoryField) => {
    const rs = records === null || records === void 0 ? void 0 : records.map((record, i) => {
        var _a;
        if (dataSource && record.dataSource !== dataSource) {
            const attributes = record.getData();
            // If `ObjectIdField` used as the category field, use its original value
            const objectid = categoryField === ObjectIdField ? ((_a = attributes[ObjectIdField]) !== null && _a !== void 0 ? _a : i) : i;
            const feature = { attributes: Object.assign(Object.assign({}, attributes), { [ObjectIdField]: objectid }) };
            return dataSource.buildRecord(feature);
        }
        else {
            return record;
        }
    });
    return rs;
};
/**
 * Get the limited records count.
 * @param series
 */
export const getRecordslimited = (series) => {
    const seriesLength = series === null || series === void 0 ? void 0 : series.length;
    if (!seriesLength)
        return MaxPieces;
    const type = getSeriesType(series);
    if (isSerialSeries(type)) {
        return MaxPieces / seriesLength;
    }
    else if (type === 'pieSeries') {
        return MaxSlices;
    }
};
/**
 * Convert to formatted data for `by-field` mode.
 * In order for the series to know which data is to used in the global chart array (through valueY), need to convert the data,
 * transforming data into web chart data for `ByField` mode.
 *
 * In case of non-aggregated type bar chart, we rename the category names by adding a suffix, in order
 * to avoid multiple identical values (they are switched back to their original value when displayed).
 */
export const convertByFieldRecords = (inputRecords, query, dataSource) => {
    var _a, _b, _c, _d;
    const inputRecord = inputRecords === null || inputRecords === void 0 ? void 0 : inputRecords[0];
    if (!inputRecord || !((_a = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _a === void 0 ? void 0 : _a.length))
        return;
    const orderByFields = query.orderByFields;
    const outStatistics = query.outStatistics;
    const numericFields = (_c = (_b = outStatistics === null || outStatistics === void 0 ? void 0 : outStatistics.map((statics) => statics.onStatisticField)) === null || _b === void 0 ? void 0 : _b.filter((field) => !!field)) === null || _c === void 0 ? void 0 : _c.asMutable();
    const x = ByFieldSeriesX;
    const y = ByFieldSeriesY;
    const data = (_d = numericFields === null || numericFields === void 0 ? void 0 : numericFields.map((field) => {
        var _a, _b;
        const value = inputRecord.getFieldValue(field);
        const item = {
            [x]: field,
            [y]: value !== null && value !== void 0 ? value : 0
        };
        const alias = (_b = (_a = getFieldSchema(field, dataSource.id)) === null || _a === void 0 ? void 0 : _a.alias) !== null && _b !== void 0 ? _b : field;
        if (alias !== field) {
            item[x] = alias;
            item[x + '_original'] = field;
        }
        return item;
    })) !== null && _d !== void 0 ? _d : [];
    sortWebChartData(data, orderByFields);
    const records = data === null || data === void 0 ? void 0 : data.map((item, i) => {
        const feature = { attributes: item };
        return dataSource.buildRecord(feature);
    });
    return records;
};
/**
 * Sorting an array WebChartDataItem following the orderByFields instructions.
 */
export function sortWebChartData(data, orderByFields, forceAscendingOrder = false) {
    if (data == null || orderByFields == null)
        return;
    data.sort((dataItemA, dataItemB) => {
        // Default sort decision = 0 (equal values)
        let sortDecision = 0;
        // Using all the fields from orderByFields to proceed to the comparison
        for (let idx = 0; idx < orderByFields.length; idx += 1) {
            //`orderByField` must has `ASC` or `DESC` in it, e.g. 'field ASC', 'field name DESC'
            const [field, sortOrder] = parseOrderByField(orderByFields[idx]);
            const descOrder = sortOrder === WebChartSortOrderKinds.Descending &&
                !forceAscendingOrder;
            /**
             * We set the sortDecision only if one of the values is greater than the other one.
             * Otherwise it continues to the next value in the `orderByFields` array.
             */
            const firstEntry = dataItemA[field];
            const secondEntry = dataItemB[field];
            // In case of string values, we perform a natural sort using the native `localeCompare`
            if (typeof firstEntry === 'string' && typeof secondEntry === 'string') {
                sortDecision = firstEntry.localeCompare(secondEntry, undefined, {
                    numeric: true
                });
                if (descOrder)
                    sortDecision *= -1;
            }
            else if (firstEntry === undefined || firstEntry === null) {
                sortDecision = !descOrder ? 1 : -1;
            }
            else if (secondEntry === undefined || secondEntry === null) {
                sortDecision = !descOrder ? -1 : 1;
            }
            else if (firstEntry > secondEntry) {
                sortDecision = !descOrder ? 1 : -1;
                break;
            }
            else if (firstEntry < secondEntry) {
                sortDecision = !descOrder ? -1 : 1;
                break;
            }
        }
        return sortDecision;
    });
}
//# sourceMappingURL=utils.js.map