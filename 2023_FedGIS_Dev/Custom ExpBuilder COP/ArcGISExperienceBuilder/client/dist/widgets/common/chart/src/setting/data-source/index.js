import { DataSourceTypes, EsriFieldType, getAppStore, Immutable, JimuFieldType, StatisticType } from 'jimu-core';
import { ByFieldSeriesX, ByFieldSeriesXAlias, ByFieldSeriesY, ByFieldSeriesYAlias, HistogramCountField, HistogramCountFieldAlias, HistogramMaxValueField, HistogramMaxValueFieldAlias, HistogramMinValueField, HistogramMinValueFieldAlias, ObjectIdField } from '../../constants';
import { getFieldSchema } from '../../utils/common';
import { isSerialSeries } from '../../utils/default';
const ObjectIdSchema = {
    jimuName: ObjectIdField,
    alias: 'OBJECTID',
    type: JimuFieldType.Number,
    name: ObjectIdField
};
/**
 * Get the initial data source schema.
 * @param label
 */
const getInitSchema = (label = '') => {
    return {
        label,
        idField: ObjectIdField,
        fields: {
            [ObjectIdField]: ObjectIdSchema
        }
    };
};
/**
 * Get original fields from output ds schema (without objectid field)
 * @param schema
 */
const getSchemaOriginFields = (schema) => {
    var _a, _b;
    if (!(schema === null || schema === void 0 ? void 0 : schema.fields))
        return;
    const fields = (_b = (_a = Object.entries(schema.fields)) === null || _a === void 0 ? void 0 : _a.map(([fieldName, fieldSchema]) => {
        var _a;
        //The objectid field is required in the schema, but it may not be used.
        if (fieldName === ObjectIdField && fieldSchema.jimuName === ObjectIdField) {
            return null;
        }
        return (_a = fieldSchema.originFields) === null || _a === void 0 ? void 0 : _a[0];
    })) === null || _b === void 0 ? void 0 : _b.filter(field => !!field);
    return Array.from(new Set(fields));
};
const getJimuFieldSchema = (field, dataSourceId, jimuName) => {
    let schema = getFieldSchema(field, dataSourceId);
    jimuName = jimuName || field;
    schema = schema.set('jimuName', jimuName).set('name', jimuName);
    schema = schema.set('originFields', [field]);
    return schema;
};
const getCleanFieldSchema = (field, type, alias) => {
    const jimuName = field;
    const name = field;
    alias = alias !== null && alias !== void 0 ? alias : field;
    let esriType = EsriFieldType.String;
    let format = null;
    if (type === JimuFieldType.Number) {
        format = {
            digitSeparator: true,
            places: 3
        };
        esriType = EsriFieldType.Double;
    }
    const schema = { jimuName, type, esriType, name, alias, format };
    return schema;
};
const getHistogramFields = (schema, originField, dataSourceId) => {
    const fields = [{
            name: HistogramMinValueField,
            alias: HistogramMinValueFieldAlias
        }, {
            name: HistogramMaxValueField,
            alias: HistogramMaxValueFieldAlias
        }, {
            name: HistogramCountField,
            alias: HistogramCountFieldAlias
        }];
    fields.forEach(({ name, alias }) => {
        var _a, _b;
        const jimuName = name;
        const originFields = [originField];
        const type = JimuFieldType.Number;
        const esriType = name === HistogramCountField ? EsriFieldType.Integer : EsriFieldType.Double;
        const originFieldSchema = getFieldSchema(originField, dataSourceId);
        const digitSeparator = (_b = (_a = originFieldSchema === null || originFieldSchema === void 0 ? void 0 : originFieldSchema.format) === null || _a === void 0 ? void 0 : _a.digitSeparator) !== null && _b !== void 0 ? _b : true;
        const places = name === HistogramCountField ? 0 : 3;
        const format = Object.assign(Object.assign({}, originFieldSchema === null || originFieldSchema === void 0 ? void 0 : originFieldSchema.format), { digitSeparator, places });
        const fieldSchema = { jimuName, type, esriType, name, alias, originFields, format };
        schema = schema.set(name, fieldSchema);
    });
    return schema;
};
/**
 * Get schema for chart data soaurce.
 * @param datasource
 * @param dataSourceId
 */
const getDataSourceSchema = (query, dataSourceId, seriesType) => {
    let fields = Immutable({
        [ObjectIdField]: ObjectIdSchema
    });
    const groupByFieldsForStatistics = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics;
    const outFields = query === null || query === void 0 ? void 0 : query.outFields;
    const outStatistics = query === null || query === void 0 ? void 0 : query.outStatistics;
    if (seriesType === 'histogramSeries') {
        if (outFields === null || outFields === void 0 ? void 0 : outFields[0]) {
            fields = getHistogramFields(fields, outFields[0], dataSourceId);
        }
    }
    else if (isSerialSeries(seriesType) || seriesType === 'pieSeries') {
        if (groupByFieldsForStatistics && outFields) { //by feature
            groupByFieldsForStatistics.concat(outFields).forEach((outField) => {
                const schema = getJimuFieldSchema(outField, dataSourceId);
                fields = fields.set(outField, schema);
            });
        }
        else if (groupByFieldsForStatistics && outStatistics) {
            const categoryField = groupByFieldsForStatistics[0];
            if (categoryField) {
                const schema = getJimuFieldSchema(categoryField, dataSourceId);
                fields = fields.set(categoryField, schema);
            }
            outStatistics.forEach((statistic) => {
                var _a;
                const originField = statistic.onStatisticField;
                if (originField) {
                    const jimuName = statistic.outStatisticFieldName;
                    let schema = getJimuFieldSchema(originField, dataSourceId, jimuName);
                    schema = schema.set('alias', jimuName);
                    const statisticType = statistic.statisticType;
                    // defining formats for the schema of output data source https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/issues/8902
                    let format = schema.format;
                    if (statisticType === StatisticType.Count) {
                        format = format || Immutable({});
                        format = format.set('places', 0);
                    }
                    else if (statisticType === StatisticType.Avg) {
                        if (typeof ((_a = schema.format) === null || _a === void 0 ? void 0 : _a.places) === 'undefined') {
                            format = format || Immutable({});
                            format = format.set('places', 3);
                        }
                    }
                    if (format) {
                        schema = schema.set('format', format);
                    }
                    fields = fields.set(jimuName, schema);
                }
            });
        }
        else if (!groupByFieldsForStatistics && outStatistics) {
            const xField = ByFieldSeriesX;
            const yField = ByFieldSeriesY;
            const xFieldSchema = getCleanFieldSchema(xField, JimuFieldType.String, ByFieldSeriesXAlias);
            const yFieldSchema = getCleanFieldSchema(yField, JimuFieldType.Number, ByFieldSeriesYAlias);
            fields = fields.set(xField, xFieldSchema);
            fields = fields.set(yField, yFieldSchema);
        }
    }
    else if (seriesType === 'scatterSeries') {
        if (outFields) {
            outFields.forEach((outField) => {
                const schema = getJimuFieldSchema(outField, dataSourceId);
                fields = fields.set(outField, schema);
            });
        }
    }
    const schema = {
        idField: ObjectIdSchema.jimuName,
        fields: fields.asMutable({ deep: true })
    };
    return schema;
};
/**
 * Set the fields from output data source to useDataSources.
 * @param useDataSources
 * @param outputDataSource
 */
const getUseDataSources = (useDataSources, outputDataSource) => {
    const schema = outputDataSource.schema;
    const fields = getSchemaOriginFields(schema);
    const withFields = Immutable.setIn(useDataSources, ['0', 'fields'], fields).asMutable({ deep: true });
    return withFields;
};
/**
 * Set the schema from chart data source to output data source.
 * @param chartDataSource
 * @param dataSourceId
 * @param outputDataSourceId
 */
const getOutputDataSource = (query, dataSourceId, outputDataSourceId, seriesType) => {
    var _a, _b, _c;
    if (!outputDataSourceId)
        return null;
    let outputDataSource = (_c = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig.dataSources) === null || _c === void 0 ? void 0 : _c[outputDataSourceId];
    if (!outputDataSource) {
        console.error(`The output data source of ${outputDataSourceId} does not exist`);
        return null;
    }
    const schema = getDataSourceSchema(query, dataSourceId, seriesType);
    outputDataSource = outputDataSource.set('schema', schema);
    return outputDataSource.asMutable({ deep: true });
};
/**
 * Create the initial output data source.
 * @param originalId
 * @param label
 * @param useDataSource
 */
export const createInitOutputDataSource = (id, label, useDataSource) => {
    const schema = getInitSchema(label);
    const outputDsJson = {
        id,
        type: DataSourceTypes.FeatureLayer,
        label,
        originDataSources: [useDataSource],
        isOutputFromWidget: true,
        isDataInDataSourceInstance: true,
        schema
    };
    return outputDsJson;
};
/**
 * Update the the `useDataSources  and `outputDataSource` by the new query configurated.
 * @param propUseDataSources
 * @param outputDataSourceId
 * @param query
 */
export const updateDataSources = (propUseDataSources, outputDataSourceId, query, seriesType) => {
    var _a, _b;
    const dataSourceId = (_b = (_a = propUseDataSources === null || propUseDataSources === void 0 ? void 0 : propUseDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId) !== null && _b !== void 0 ? _b : '';
    const outputDataSource = getOutputDataSource(query, dataSourceId, outputDataSourceId, seriesType);
    const useDataSources = getUseDataSources(propUseDataSources, outputDataSource);
    return [useDataSources, outputDataSource];
};
//# sourceMappingURL=index.js.map