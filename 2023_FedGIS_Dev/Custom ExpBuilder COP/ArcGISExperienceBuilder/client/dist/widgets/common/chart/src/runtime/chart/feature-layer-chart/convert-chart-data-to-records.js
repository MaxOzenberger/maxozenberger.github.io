import { isSerialSeries } from '../../../utils/default';
import { ObjectIdField } from '../../../constants';
const createRecordsFromChartData = (data = [], dataSource) => {
    const records = data === null || data === void 0 ? void 0 : data.map((item, i) => {
        const feature = { attributes: null };
        const data = Object.assign({}, item);
        data[ObjectIdField] = i;
        feature.attributes = data;
        return dataSource.buildRecord(feature);
    });
    return records;
};
export const getDataItems = (type, detail) => {
    let items = [];
    if (isSerialSeries(type)) {
        items = detail === null || detail === void 0 ? void 0 : detail.dataItems;
    }
    else if (type === 'pieSeries') {
        items = detail;
    }
    else if (type === 'scatterSeries') {
        items = detail === null || detail === void 0 ? void 0 : detail.data;
    }
    else if (type === 'histogramSeries') {
        items = detail === null || detail === void 0 ? void 0 : detail.bins;
    }
    return items;
};
export default createRecordsFromChartData;
//# sourceMappingURL=convert-chart-data-to-records.js.map