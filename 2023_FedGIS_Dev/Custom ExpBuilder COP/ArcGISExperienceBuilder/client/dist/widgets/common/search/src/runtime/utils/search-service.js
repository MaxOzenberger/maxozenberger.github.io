var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { i18n, dataSourceUtils, ClauseLogic, ClauseOperator, Immutable, DataSourceStatus, QueryScope, JimuFieldType } from 'jimu-core';
import { getDatasource, uniqueJson, checkIsSuggestionRepeat, getSuggestionItem, checkIsDsCreated } from './utils';
export function fetchLayerSuggestion(searchText, config, serviceListItem) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const datasourceConfig = (config === null || config === void 0 ? void 0 : config.datasourceConfig) || [];
        if (!checkIsDsCreated((_a = serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId)) {
            return Promise.resolve({});
        }
        const searchFields = (serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.searchFields) || [];
        const datasourceConfigItem = (_b = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.filter(item => (item === null || item === void 0 ? void 0 : item.configId) === serviceListItem.configId)) === null || _b === void 0 ? void 0 : _b[0];
        return fetchSuggestionRecords(searchText, serviceListItem, datasourceConfigItem, searchFields, config === null || config === void 0 ? void 0 : config.maxSuggestions);
    });
}
/**
 * Query suggestion
*/
export function fetchSuggestionRecords(searchText, datasourceListItem, dsConfigItem, searchFields, maxSuggestions) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { label, icon, configId } = dsConfigItem;
        const useDatasourceId = (_a = datasourceListItem === null || datasourceListItem === void 0 ? void 0 : datasourceListItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId;
        const datasource = getDatasource(useDatasourceId);
        const SQL = datasourceListItem === null || datasourceListItem === void 0 ? void 0 : datasourceListItem.SuggestionSQL;
        const options = {
            outFields: searchFields.map(field => field.name),
            returnDistinctValues: true,
            returnGeometry: false,
            orderByFields: null
        };
        if ((SQL === null || SQL === void 0 ? void 0 : SQL.sql) || typeof (SQL === null || SQL === void 0 ? void 0 : SQL.sql) === 'string') {
            options.where = SQL === null || SQL === void 0 ? void 0 : SQL.sql;
        }
        const searchReg = new RegExp(`(${searchText})`, 'gi');
        return queryRecords(options, datasource).then((records) => __awaiter(this, void 0, void 0, function* () {
            let searchSuggestion = [];
            searchFields.forEach(field => {
                records.forEach(record => {
                    const intl = i18n.getIntl();
                    const suggestionRecord = record.getFormattedFieldValue(field === null || field === void 0 ? void 0 : field.name, intl);
                    if (suggestionRecord && !checkIsSuggestionRepeat(searchSuggestion, suggestionRecord) && suggestionRecord.match(searchReg)) {
                        const layerSuggestion = {
                            suggestionHtml: getSuggestionItem(suggestionRecord, searchText),
                            suggestion: suggestionRecord,
                            configId: configId,
                            isFromSuggestion: true
                        };
                        searchSuggestion.push(layerSuggestion);
                    }
                });
            });
            searchSuggestion = uniqueJson(searchSuggestion, 'suggestion');
            const newSearchSuggestion = searchSuggestion.splice(0, maxSuggestions);
            const suggestion = {
                suggestionItem: newSearchSuggestion,
                layer: label,
                icon: icon
            };
            return Promise.resolve(suggestion);
        })).catch((error) => {
            return Promise.resolve({
                suggestionItem: [],
                layer: null,
                icon: null
            });
        });
    });
}
/**
 * Get query SQL
*/
export function getSQL(searchText, searchFields, datasource, searchExact) {
    if (searchFields) {
        const clauses = [];
        searchFields.forEach(field => {
            let newSearchText = searchText;
            const codedValues = datasource === null || datasource === void 0 ? void 0 : datasource.getFieldCodedValueList(field === null || field === void 0 ? void 0 : field.name);
            if (codedValues) {
                codedValues === null || codedValues === void 0 ? void 0 : codedValues.forEach(item => {
                    if (newSearchText === (item === null || item === void 0 ? void 0 : item.label)) {
                        newSearchText = item === null || item === void 0 ? void 0 : item.value;
                    }
                });
            }
            if (field.type === JimuFieldType.Number && !Number(newSearchText))
                return false;
            const clauseOperator = getClauseOperator(field.type, searchExact);
            const searchValue = field.type === JimuFieldType.Number ? Number(newSearchText) : newSearchText;
            const clause = dataSourceUtils.createSQLClause(field === null || field === void 0 ? void 0 : field.name, clauseOperator, searchValue);
            clauses.push(clause);
        });
        const sqlExpression = dataSourceUtils.createSQLExpression(ClauseLogic.Or, clauses);
        const SQL = dataSourceUtils.getArcGISSQL(sqlExpression, datasource);
        return SQL;
    }
}
/**
 * Update datasource params
*/
export function updateDsQueryParams(serviceListItem, id, searchText) {
    var _a;
    const useDataSourceId = (_a = serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    const useDataSource = getDatasource(useDataSourceId);
    const SQL = serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.SQL;
    const where = !searchText ? '1=1' : ((SQL === null || SQL === void 0 ? void 0 : SQL.sql) || '1=0');
    const query = Immutable({
        outFields: ['*'],
        where: where,
        returnGeometry: true
    });
    //Update datasource query params
    useDataSource && useDataSource.updateQueryParams(query, id);
}
/**
 * Load records by outputDatasources
*/
export const loadDsRecords = (serviceListItem, resultMaxNumber, id) => {
    var _a, _b;
    const dsId = (_a = serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    if (!checkIsDsCreated(dsId))
        return Promise.resolve({});
    const ds = getDatasource(dsId);
    const query = {
        where: ((_b = serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.SQL) === null || _b === void 0 ? void 0 : _b.sql) || '1=0',
        pageSize: resultMaxNumber,
        page: 1,
        returnGeometry: true
    };
    return ds === null || ds === void 0 ? void 0 : ds.load(query, { widgetId: id }).then(records => {
        return Promise.resolve({
            records: records,
            configId: serviceListItem.configId,
            dsId: dsId,
            isGeocodeRecords: false
        });
    });
};
function getClauseOperator(fieldType, searchExact) {
    let clauseOperator;
    if (fieldType === JimuFieldType.Number) {
        clauseOperator = ClauseOperator.NumberOperatorIs;
    }
    else if (fieldType === JimuFieldType.String) {
        clauseOperator = searchExact ? ClauseOperator.StringOperatorIs : ClauseOperator.StringOperatorContains;
    }
    return clauseOperator;
}
/**
 * Query record by datasource
*/
function queryRecords(q, ds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ds)
            return yield Promise.resolve([]);
        return yield ds
            .query(q, { scope: QueryScope.InRuntimeView })
            .then((queryResult) => __awaiter(this, void 0, void 0, function* () { return yield queryRecordsResult(q, queryResult); }));
    });
}
function queryRecordsResult(q, queryResult) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.resolve((queryResult === null || queryResult === void 0 ? void 0 : queryResult.records) || []);
    });
}
export function executeCountQuery(widgetId, outputDS, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        outputDS.setCountStatus(DataSourceStatus.Unloaded);
        return outputDS.loadCount(queryParams, { widgetId, refresh: true });
    });
}
export function initOutputDatasource(config) {
    var _a;
    (_a = config === null || config === void 0 ? void 0 : config.datasourceConfig) === null || _a === void 0 ? void 0 : _a.forEach(datasourceConfigItem => {
        const outputDs = datasourceConfigItem === null || datasourceConfigItem === void 0 ? void 0 : datasourceConfigItem.outputDataSourceId;
        const outputDatasource = getDatasource(outputDs);
        outputDatasource && outputDatasource.setCountStatus(DataSourceStatus.Loaded);
    });
}
//# sourceMappingURL=search-service.js.map