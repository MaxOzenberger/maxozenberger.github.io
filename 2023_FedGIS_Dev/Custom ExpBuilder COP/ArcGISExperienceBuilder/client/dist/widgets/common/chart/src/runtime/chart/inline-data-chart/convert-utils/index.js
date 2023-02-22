import convertRecordsToInlineDataForSerial from './serial';
import convertRecordsToInlineDataForPie from './pie';
import convertRecordsToInlineDataForScatter from './scatter';
import convertRecordsToInlineDataForHistogram from './histogram';
import { isSerialSeries } from '../../../../utils/default';
/**
 * In order for the series to know which data is to used for which series,
 * we should replace the default statistic field name by its value as defined in the series(serie.y)
 */
const convertRecordsToInlineData = (type, records, query, series, intl) => {
    var _a, _b, _c, _d;
    let rawData = null;
    let inputData = null;
    let processed = true;
    if (isSerialSeries(type)) {
        rawData = (_a = convertRecordsToInlineDataForSerial(records, query, intl)) !== null && _a !== void 0 ? _a : [];
        inputData = { dataItems: rawData };
    }
    else if (type === 'pieSeries') {
        rawData = (_b = convertRecordsToInlineDataForPie(records, query, intl)) !== null && _b !== void 0 ? _b : [];
        inputData = rawData;
    }
    else if (type === 'scatterSeries') {
        rawData = (_c = convertRecordsToInlineDataForScatter(records, query)) !== null && _c !== void 0 ? _c : [];
        inputData = { data: rawData };
        processed = false;
    }
    else if (type === 'histogramSeries') {
        const data = convertRecordsToInlineDataForHistogram(records, series);
        rawData = (_d = data === null || data === void 0 ? void 0 : data.bins) !== null && _d !== void 0 ? _d : [];
        inputData = data;
    }
    return [{ inputData, processed }, rawData];
};
export default convertRecordsToInlineData;
//# sourceMappingURL=index.js.map