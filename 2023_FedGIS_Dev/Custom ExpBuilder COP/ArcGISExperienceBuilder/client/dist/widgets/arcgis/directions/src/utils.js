import { dataSourceUtils } from 'jimu-core';
export function getStopOutputDsId(widgetId) {
    return `${widgetId}_output_stop`;
}
export function getDirectionPointOutputDsId(widgetId) {
    return `${widgetId}_output_direction_point`;
}
export function getDirectionLineOutputDsId(widgetId) {
    return `${widgetId}_output_direction_line`;
}
export function getRouteOutputDsId(widgetId) {
    return `${widgetId}_output_route`;
}
export function convertJSAPIFieldsToJimuFields(fields) {
    if (!fields) {
        return null;
    }
    const jimuFields = {};
    fields.forEach(r => {
        jimuFields[r.name] = dataSourceUtils.convertFieldToJimuField(r, null);
    });
    return jimuFields;
}
//# sourceMappingURL=utils.js.map