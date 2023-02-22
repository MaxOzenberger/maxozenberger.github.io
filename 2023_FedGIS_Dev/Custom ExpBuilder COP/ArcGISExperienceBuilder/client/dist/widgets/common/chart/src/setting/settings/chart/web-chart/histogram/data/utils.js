import { getFieldSchema, getFieldsSchema } from '../../../../../../utils/common';
import { Immutable } from 'jimu-core';
import { createDefaultSerie } from '../../common-sections/data';
export const createHistogramSeries = (x, propSeries, dataSourceId) => {
    var _a;
    const seriesProps = propSeries[0];
    const serie = createDefaultSerie(seriesProps, 0);
    serie.x = x;
    const name = ((_a = getFieldSchema(x, dataSourceId)) === null || _a === void 0 ? void 0 : _a.alias) || x;
    serie.name = name;
    serie.id = x;
    return Immutable([serie]);
};
export const createHistogramQuery = (x, orderByFields, pageSize) => {
    const outFields = [];
    if (x) {
        outFields[0] = x;
    }
    return Immutable({ outFields, orderByFields, pageSize });
};
export const getHistogramOrderFields = (dataSourceId) => {
    var _a;
    if (!dataSourceId)
        return Immutable([]);
    const fieldsSchema = getFieldsSchema(dataSourceId);
    const fields = (_a = Object.entries(fieldsSchema)) === null || _a === void 0 ? void 0 : _a.map(([field, schema]) => ({
        name: (schema === null || schema === void 0 ? void 0 : schema.alias) || field,
        value: field
    }));
    return Immutable(fields);
};
//# sourceMappingURL=utils.js.map