import { getFieldSchema } from '../../../../../../utils/common';
import { Immutable } from 'jimu-core';
import { createDefaultSerie } from '../../common-sections/data';
export const createScatterPlotSeries = ({ x, y, propSeries }, dataSourceId) => {
    var _a;
    const seriesProps = propSeries[0];
    const serie = createDefaultSerie(seriesProps, 0);
    serie.x = x;
    serie.y = y;
    const name = ((_a = getFieldSchema(y, dataSourceId)) === null || _a === void 0 ? void 0 : _a.alias) || y;
    serie.name = name;
    serie.id = y;
    return Immutable([serie]);
};
export const createScatterPlotQuery = ({ x, y }, orderByFields, pageSize) => {
    const outFields = [];
    if (x) {
        outFields[0] = x;
    }
    if (y) {
        outFields[1] = y;
    }
    return Immutable({ outFields, orderByFields, pageSize });
};
export const getScatterPlotOrderFields = (query, dataSourceId) => {
    const outFields = query === null || query === void 0 ? void 0 : query.outFields;
    if (!(outFields === null || outFields === void 0 ? void 0 : outFields.length))
        return Immutable([]);
    const fields = outFields === null || outFields === void 0 ? void 0 : outFields.map((outField) => {
        var _a;
        return ({
            name: ((_a = getFieldSchema(outField, dataSourceId)) === null || _a === void 0 ? void 0 : _a.alias) || outField,
            value: outField
        });
    });
    return fields;
};
//# sourceMappingURL=utils.js.map