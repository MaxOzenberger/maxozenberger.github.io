var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageManager, DataRecordSetChangeMessage, RecordSetChangeType, dataSourceUtils } from 'jimu-core';
import { SpatialRelation, FieldsType, mapJSAPIUnitToDsUnit, mapJSAPISpatialRelToDsSpatialRel } from '../config';
function combineFields(resultDisplayFields, resultTitleExpression, idField) {
    const fields = new Set();
    resultDisplayFields === null || resultDisplayFields === void 0 ? void 0 : resultDisplayFields.forEach(item => fields.add(item));
    if (resultTitleExpression) {
        const templates = resultTitleExpression.match(/\{\w*\}/g);
        if ((templates === null || templates === void 0 ? void 0 : templates.length) > 0) {
            templates.forEach(item => fields.add(item.substring(1, item.length - 1)));
        }
    }
    if (idField) {
        fields.add(idField);
    }
    return Array.from(fields);
}
export function getPopupTemplate(outputDS, queryItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const { resultFieldsType, resultDisplayFields, resultTitleExpression = '' } = queryItem;
        const currentOriginDs = outputDS.getOriginDataSources()[0];
        const popupInfo = currentOriginDs.getPopupInfo();
        if (resultFieldsType === FieldsType.SelectAttributes) {
            let fields = resultDisplayFields;
            if (resultDisplayFields == null) {
                // return all fields by default
                const allFieldsSchema = outputDS.getSchema();
                fields = (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema.fields).map(field => field.jimuName) : [];
            }
            if (popupInfo) {
                const fieldInfos = [];
                fields.forEach(field => {
                    const fieldInfo = popupInfo.fieldInfos.find(fieldInfo => fieldInfo.fieldName === field);
                    if (fieldInfo) {
                        fieldInfo.visible = true;
                        fieldInfos.push(fieldInfo);
                    }
                    else {
                        fieldInfos.push({
                            fieldName: field,
                            label: field
                        });
                    }
                });
                return {
                    fieldInfos,
                    content: [{
                            type: 'fields'
                        }],
                    title: resultTitleExpression
                };
            }
            return {
                fieldInfos: fields.map(field => ({
                    fieldName: field,
                    label: field
                })),
                content: [{
                        type: 'fields'
                    }],
                title: resultTitleExpression
            };
        }
        else {
            // the source layer will provide popup info
            return null;
        }
    });
}
export function generateQueryParams(outputDS, sqlExpr, spatialFilter, queryItem, page, pageSize) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const currentQueryDsJson = outputDS.getDataSourceJson();
        const currentOriginDs = outputDS.getOriginDataSources()[0];
        const isLocalDs = currentQueryDsJson === null || currentQueryDsJson === void 0 ? void 0 : currentQueryDsJson.isDataInDataSourceInstance;
        if (isLocalDs) {
            outputDS.setSourceRecords(currentOriginDs.getSourceRecords());
        }
        const { useAttributeFilter, useSpatialFilter, sortOptions, resultFieldsType, resultDisplayFields, resultTitleExpression } = queryItem;
        let outputFields = resultDisplayFields;
        if (resultDisplayFields == null) {
            // return all fields by default
            const allFieldsSchema = outputDS.getSchema();
            outputFields = (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema.fields).map(field => field.jimuName) : [];
        }
        const mergedQueryParams = outputDS.mergeQueryParams((_a = currentOriginDs.getCurrentQueryParams()) !== null && _a !== void 0 ? _a : {}, {
            where: (useAttributeFilter && (sqlExpr === null || sqlExpr === void 0 ? void 0 : sqlExpr.sql)) ? sqlExpr.sql : '1=1'
        });
        // compose query params for query
        const queryParams = Object.assign({ 
            // url: ds.url,
            returnGeometry: true, page,
            pageSize }, mergedQueryParams);
        if (useSpatialFilter && (spatialFilter === null || spatialFilter === void 0 ? void 0 : spatialFilter.geometry)) {
            const { geometry, relation = SpatialRelation.Intersect, buffer } = spatialFilter;
            const spatialQueryParams = {
                geometryType: dataSourceUtils.changeJSAPIGeometryTypeToRestAPIGeometryType(geometry.type),
                geometry: geometry.toJSON(),
                spatialRel: mapJSAPISpatialRelToDsSpatialRel[relation],
                distance: buffer === null || buffer === void 0 ? void 0 : buffer.distance,
                units: (buffer === null || buffer === void 0 ? void 0 : buffer.unit) ? mapJSAPIUnitToDsUnit[buffer.unit] : undefined
            };
            Object.assign(queryParams, spatialQueryParams);
        }
        if ((sortOptions === null || sortOptions === void 0 ? void 0 : sortOptions.length) > 0) {
            Object.assign(queryParams, {
                orderByFields: sortOptions.map(item => `${item.jimuFieldName} ${item.order}`)
            });
        }
        if (resultFieldsType === FieldsType.SelectAttributes) {
            const fields = combineFields(outputFields, resultTitleExpression, outputDS.getIdField());
            Object.assign(queryParams, {
                outFields: fields
            });
        }
        else {
            // use popup setting
            const popupInfo = currentOriginDs.getPopupInfo();
            // popupInfo may have expressions in its fieldInfos
            const fieldNames = Object.values((_b = currentOriginDs.getSchema().fields) !== null && _b !== void 0 ? _b : {}).map(f => f.name);
            const validFieldInfos = (_c = popupInfo === null || popupInfo === void 0 ? void 0 : popupInfo.fieldInfos) === null || _c === void 0 ? void 0 : _c.filter(fieldInfo => fieldNames.includes(fieldInfo.fieldName));
            Object.assign(queryParams, {
                outFields: validFieldInfos === null || validFieldInfos === void 0 ? void 0 : validFieldInfos.map(fieldInfo => fieldInfo.fieldName)
            });
        }
        return queryParams;
    });
}
export function executeCountQuery(widgetId, outputDS, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        return outputDS.loadCount(queryParams, { widgetId, refresh: true });
    });
}
export function executeQuery(widgetId, queryItem, outputDS, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const popupInfo = outputDS.getPopupInfo();
        const layerDefinition = outputDS.getLayerDefinition();
        const getDefaultFieldInfos = () => {
            var _a;
            return [
                { fieldName: (_a = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.objectIdField) !== null && _a !== void 0 ? _a : 'objectid', label: 'OBJECTID', tooltip: '', visible: true }
            ];
        };
        const fieldInfos = ((fieldInfos) => (fieldInfos.length ? fieldInfos : getDefaultFieldInfos()))(((popupInfo === null || popupInfo === void 0 ? void 0 : popupInfo.fieldInfos) || []).filter((i) => i.visible));
        // const fields = outputDS.getSchema()?.fields
        // let selectedFieldNames
        // if (queryItem.resultFieldsType === FieldsType.SelectAttributes) {
        //   selectedFieldNames = [].concat(queryItem.resultDisplayFields, queryItem.resultTitleFields)
        // } else {
        //   selectedFieldNames = fieldInfos.map((fieldInfo) => fieldInfo.fieldName)
        // }
        // const selectedFieldJimuNames = fields
        //   ? Object.keys(fields).filter((jimuName) => selectedFieldNames.includes(fields[jimuName].name))
        //   : []
        // outputDS.setSelectedFields(selectedFieldJimuNames)
        const records = yield outputDS.load(queryParams, { widgetId });
        const originDs = outputDS.getOriginDataSources()[0];
        const layerObject = yield getLayerObject(originDs);
        records.forEach((record) => {
            const feature = record.feature;
            feature.sourceLayer = layerObject.associatedLayer || layerObject;
            feature.layer = feature.sourceLayer;
        });
        const queryResult = {
            records,
            fields: fieldInfos.map((fieldInfo) => fieldInfo.fieldName)
        };
        // publish message
        const dataRecordSetChangeMessage = new DataRecordSetChangeMessage(widgetId, outputDS.id, RecordSetChangeType.Update, {
            records: queryResult.records,
            fields: queryResult.fields,
            dataSource: outputDS
        });
        MessageManager.getInstance().publishMessage(dataRecordSetChangeMessage);
        return queryResult;
    });
}
function getLayerObject(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataSource.layer) {
            yield dataSource.layer.load();
            return dataSource.layer;
        }
        else {
            const layerObject = yield dataSource.createJSAPILayerByDataSource();
            yield layerObject.load();
            return layerObject;
        }
    });
}
//# sourceMappingURL=query-utils.js.map