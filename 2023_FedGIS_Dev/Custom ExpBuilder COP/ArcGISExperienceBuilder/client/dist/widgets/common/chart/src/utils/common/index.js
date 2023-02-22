import { DataSourceManager } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { getSeriaLlineShowArea, getSeriaLlineSmoothed, getSerialSeriesRotated } from './serial';
const cacheObjectIdField = {};
/**
 * get objectid
 * @param dataSourceId
 */
export const getObjectIdField = (dataSourceId) => {
    if (cacheObjectIdField[dataSourceId] != null)
        return cacheObjectIdField[dataSourceId];
    const ds = DataSourceManager.getInstance().getDataSource(dataSourceId);
    if (ds == null) {
        console.error(`Invalid data source id: ${dataSourceId}`);
        return;
    }
    const objectId = ds.getIdField();
    cacheObjectIdField[dataSourceId] = objectId;
    return objectId;
};
const cacheFieldSchema = {};
/**
 * Get the schema of a single field
 * @param jimuFieldName
 * @param dataSourceId
 */
export const getFieldSchema = (jimuFieldName, dataSourceId) => {
    var _a;
    if (cacheFieldSchema[jimuFieldName] != null)
        return cacheFieldSchema[jimuFieldName];
    const ds = DataSourceManager.getInstance().getDataSource(dataSourceId);
    const dsSchema = ds === null || ds === void 0 ? void 0 : ds.getSchema();
    const fieldSchema = (_a = dsSchema === null || dsSchema === void 0 ? void 0 : dsSchema.fields) === null || _a === void 0 ? void 0 : _a[jimuFieldName];
    cacheFieldSchema[jimuFieldName] = fieldSchema;
    return fieldSchema;
};
const cacheFieldsSchema = {};
/**
 * Get all the field schema in a data source
 * @param dataSourceId
 */
export const getFieldsSchema = (dataSourceId) => {
    if (cacheFieldsSchema[dataSourceId] != null)
        return cacheFieldsSchema[dataSourceId];
    const ds = DataSourceManager.getInstance().getDataSource(dataSourceId);
    const dsSchema = ds === null || ds === void 0 ? void 0 : ds.getSchema();
    const fieldsSchema = dsSchema === null || dsSchema === void 0 ? void 0 : dsSchema.fields;
    cacheFieldsSchema[dataSourceId] = fieldsSchema;
    return fieldsSchema;
};
/**
 * Get the field type.
 * @param jimuFieldName
 * @param dataSourceId
 */
export const getFieldType = (jimuFieldName, dataSourceId) => {
    const fieldSchema = getFieldSchema(jimuFieldName, dataSourceId);
    return fieldSchema === null || fieldSchema === void 0 ? void 0 : fieldSchema.type;
};
/**
 * Get the template type of the current series.
 * @param series
 * @param fallbackType
 */
export const getTemplateType = (series) => {
    var _a, _b;
    const seriesType = (_a = getSeriesType(series)) !== null && _a !== void 0 ? _a : 'barSeries';
    const serie = series === null || series === void 0 ? void 0 : series[0];
    let type;
    let subType;
    if (!serie)
        return [];
    if (seriesType === 'barSeries') {
        const stackedType = serie.stackedType;
        const rotated = getSerialSeriesRotated(series);
        const suffix = rotated ? 'bar' : 'column';
        const prefix = stackedType === 'sideBySide' ? '' : stackedType;
        type = suffix;
        subType = (prefix ? `${prefix}-${suffix}` : suffix);
    }
    else if (seriesType === 'lineSeries') {
        const showArea = getSeriaLlineShowArea(series);
        const lineSmoothed = getSeriaLlineSmoothed(series);
        const suffix = showArea ? 'area' : 'line';
        let prefix = '';
        if (lineSmoothed) {
            prefix = 'smooth';
        }
        type = suffix;
        subType = (prefix ? `${prefix}-${suffix}` : suffix);
    }
    else if (seriesType === 'pieSeries') {
        type = 'pie';
        const innerRadius = (_b = serie === null || serie === void 0 ? void 0 : serie.innerRadius) !== null && _b !== void 0 ? _b : 0;
        subType = innerRadius > 0 ? 'donut' : 'pie';
    }
    else if (seriesType === 'scatterSeries') {
        type = 'scatter';
        subType = 'scatter';
    }
    else if (seriesType === 'histogramSeries') {
        type = 'histogram';
        subType = 'histogram';
    }
    return [type, subType];
};
/**
 * Capitalize the first letter of a string.
 * @param str
 * @returns {string}
 */
export const capitalizeString = (str) => {
    if (typeof str === 'string') {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return null;
};
//# sourceMappingURL=index.js.map