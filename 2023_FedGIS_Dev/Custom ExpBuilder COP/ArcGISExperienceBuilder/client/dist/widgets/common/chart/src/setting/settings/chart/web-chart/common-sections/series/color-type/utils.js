import { React, Immutable, QueryScope } from 'jimu-core';
import { getFillSymbol } from '../../../../../../../utils/default';
export const convertStripColors = (colors) => {
    return colors.map((color) => ({
        label: color,
        value: color,
        color: color
    }));
};
export const applyPieSlicesColors = (propSlices, colors) => {
    if (!colors)
        return;
    const slices = propSlices === null || propSlices === void 0 ? void 0 : propSlices.map((slice, index) => {
        const color = getNextColor(colors, index);
        slice = slice.setIn(['fillSymbol', 'color'], color);
        return slice;
    });
    return slices;
};
export const applyPieSlicesOutline = (propSlices, outline) => {
    if (!outline)
        return;
    const slices = propSlices === null || propSlices === void 0 ? void 0 : propSlices.map((slice) => {
        slice = slice.setIn(['fillSymbol', 'outline'], outline);
        return slice;
    });
    return slices;
};
export const getNextColor = (colors, index = 0) => {
    if (!(colors === null || colors === void 0 ? void 0 : colors.length))
        return;
    const idx = index % colors.length;
    const color = colors[idx];
    return color;
};
export const getPieSlice = (index, colors, value, outline) => {
    const fillColor = getNextColor(colors, index);
    const fillSymbol = getFillSymbol(fillColor, 0);
    if (outline) {
        fillSymbol.outline = outline;
    }
    return { sliceId: value, fillSymbol };
};
export const getByFieldPieSlices = (numericFields, colors, outline) => {
    const slices = numericFields.filter(field => !!field).map((field, index) => {
        const slice = getPieSlice(index, colors, field, outline);
        return slice;
    });
    return slices;
};
const defaultPieSlices = Immutable([]);
export const useLoadingPieSlices = (dataSource, query, propSlices = defaultPieSlices, colors, numberLimit = 50) => {
    var _a, _b;
    const recordNumberRef = React.useRef(0);
    const numberPerLoadRef = React.useRef(0);
    const [loading, setLoading] = React.useState(false);
    const categoryField = (_b = (_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
    const loadSlices = (count, outline) => {
        const exceed = propSlices.length >= numberLimit;
        if (exceed)
            return Promise.resolve({ value: propSlices, loadout: false, exceed: true });
        setLoading(true);
        return dataSource.query(query, { scope: QueryScope.InConfigView }).then((result) => {
            const records = result.records;
            let slices = propSlices;
            records.some((record) => {
                recordNumberRef.current++;
                const value = record.getFieldValue(categoryField);
                if (value == null)
                    return false;
                const existed = !!slices.find(slice => slice.sliceId === value);
                if (existed)
                    return false;
                const slice = getPieSlice(numberPerLoadRef.current, colors, value, outline);
                slices = slices.concat(slice);
                numberPerLoadRef.current++;
                return numberPerLoadRef.current >= count;
            });
            const loadout = recordNumberRef.current >= records.length;
            const exceed = Object.keys(slices).length >= numberLimit;
            recordNumberRef.current = 0;
            numberPerLoadRef.current = 0;
            setLoading(false);
            return { value: slices, loadout, exceed };
        }, (error) => {
            console.error(error);
            setLoading(false);
            return undefined;
        });
    };
    return [loadSlices, loading];
};
//# sourceMappingURL=utils.js.map