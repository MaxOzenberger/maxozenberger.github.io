import { processInlineHistogramRawData } from 'jimu-ui/advanced/chart';
const getInlineHistogramData = (records, series) => {
    const rawData = records === null || records === void 0 ? void 0 : records.map((record) => record.getData());
    const transformed = processInlineHistogramRawData(rawData, series[0]);
    let statistic = null;
    let bins = [];
    if (transformed.valid) {
        const data = transformed.data;
        bins = data.bins;
        const { mean, stddev, median, min, max } = data;
        statistic = { mean, stddev, median, min, max };
    }
    return { statistic, bins };
};
const convertRecordsToInlineData = (records, series) => {
    const { statistic, bins } = getInlineHistogramData(records, series);
    if (!(bins === null || bins === void 0 ? void 0 : bins.length))
        return;
    const data = Object.assign(Object.assign({}, statistic), { bins });
    return data;
};
export default convertRecordsToInlineData;
//# sourceMappingURL=histogram.js.map