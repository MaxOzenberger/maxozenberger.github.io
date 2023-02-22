const convertRecordsToInlineData = (records, query) => {
    var _a;
    const result = [];
    const x = (_a = query === null || query === void 0 ? void 0 : query.outFields) === null || _a === void 0 ? void 0 : _a[0];
    records === null || records === void 0 ? void 0 : records.forEach((record) => {
        const data = record.getData();
        // Null category value will affect the calculation of value axis range,
        // and it will not be displayed on the chart by default, so we filter it out. #7607
        const item = Object.assign({}, data);
        if (x && item[x] == null)
            return;
        result.push(item);
    });
    return result;
};
export default convertRecordsToInlineData;
//# sourceMappingURL=scatter.js.map