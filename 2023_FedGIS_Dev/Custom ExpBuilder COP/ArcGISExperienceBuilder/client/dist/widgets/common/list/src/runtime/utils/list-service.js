var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageType, utils, dataSourceUtils, ClauseOperator, ClauseLogic, QueryScope } from 'jimu-core';
export function getQueryOptions(state, props, pageSize) {
    var _a, _b, _c;
    const options = {
        returnGeometry: true
    };
    const { config, stateProps, useDataSources } = props;
    const { sortOptionName, searchText, currentFilter, filterApplied, datasource } = state;
    const useDS = useDataSources && useDataSources[0];
    if (!datasource || !useDS)
        return null;
    if (!datasource.query) {
        // not queryiable data source, return
        return null;
    }
    // sort
    let sortOption;
    if (config.sortOpen && config.sorts) {
        sortOption = config.sorts.find((sort) => sort.ruleOptionName === sortOptionName);
        sortOption = sortOption || config.sorts[0];
        if (!((_b = (_a = sortOption === null || sortOption === void 0 ? void 0 : sortOption.rule) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.jimuFieldName)) {
            sortOption = undefined;
        }
        if (sortOption) {
            const orderBys = [];
            sortOption.rule.forEach(sortData => {
                if (sortData.jimuFieldName) {
                    orderBys.push(`${sortData.jimuFieldName} ${sortData.order}`);
                }
            });
            options.orderByFields = orderBys;
        }
    }
    // filter
    if (config.filterOpen &&
        filterApplied &&
        config.filter &&
        currentFilter &&
        currentFilter.sql) {
        options.where = (options.where || '1=1') + ' AND ';
        options.where += `(${currentFilter.sql})`;
    }
    // action
    if (stateProps) {
        const extentMsg = stateProps === null || stateProps === void 0 ? void 0 : stateProps[MessageType.ExtentChange];
        // action-filter
        if (extentMsg) {
            options.geometry = extentMsg.queryExtent;
            if (extentMsg.querySQL) {
                options.where = (options.where || '1=1') + ' AND ';
                options.where += `(${extentMsg.querySQL})`;
            }
        }
        const selectionMsg = stateProps[MessageType.DataRecordsSelectionChange];
        if (selectionMsg && selectionMsg.querySQL) {
            options.where = (options.where || '1=1') + ' AND ';
            options.where += `(${selectionMsg.querySQL})`;
        }
    }
    if (config.searchOpen && config.searchFields && searchText) {
        options.where = (options.where || '1=1') + ' AND ';
        const searchSQL = (_c = getSQL(searchText, config, datasource)) === null || _c === void 0 ? void 0 : _c.sql;
        options.where += searchSQL;
    }
    // paging
    if (pageSize > 0) {
        options.page = state.page;
        options.pageSize = pageSize;
    }
    // Compare if query changed except paging
    const newQuery = options;
    return newQuery;
}
export function fetchSuggestionRecords(searchText, config, datasource) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const searchFields = config.searchFields.split(',');
        const queryParams = {
            page: 1,
            pageSize: 10,
            outFields: searchFields,
            returnDistinctValues: true
        };
        if (config.searchOpen && config.searchFields) {
            const SQL = (_a = getSQL(searchText, config, datasource, true)) === null || _a === void 0 ? void 0 : _a.sql;
            queryParams.where = SQL;
        }
        const searchReg = new RegExp(`(${searchText})`, 'gi');
        return queryRecords(queryParams, datasource).then((records) => __awaiter(this, void 0, void 0, function* () {
            let searchSuggestion = [];
            searchFields.forEach(attrName => {
                records.forEach(el => {
                    var _a;
                    const suggestionItem = (_a = el === null || el === void 0 ? void 0 : el.feature) === null || _a === void 0 ? void 0 : _a.attributes[attrName];
                    if (suggestionItem &&
                        !searchSuggestion.includes(suggestionItem) &&
                        suggestionItem.match(searchReg)) {
                        const suggestion = {
                            suggestionHtml: getSuggestionItem(suggestionItem, searchText),
                            suggestion: suggestionItem
                        };
                        searchSuggestion.push(suggestion);
                    }
                });
            });
            searchSuggestion = uniqueJson(searchSuggestion, 'suggestion');
            return Promise.resolve(searchSuggestion);
        }));
    });
}
function uniqueJson(jsonArr, key) {
    const result = jsonArr[0] ? [jsonArr[0]] : [];
    for (let i = 1; i < jsonArr.length; i++) {
        const item = jsonArr[i];
        let repeat = false;
        for (let j = 0; j < result.length; j++) {
            if (item[key] === result[j][key]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            result.push(item);
        }
    }
    return result;
}
function getSQL(searchText, config, datasource, fetchSuggestion = false) {
    const searchFields = config.searchFields.split(',');
    const searchExact = fetchSuggestion ? false : config.searchExact;
    const clauseOperator = searchExact ? ClauseOperator.StringOperatorIs : ClauseOperator.StringOperatorContains;
    if (config.searchOpen && config.searchFields) {
        const clauses = searchFields.map(field => {
            return dataSourceUtils.createSQLClause(field, clauseOperator, searchText);
        });
        const sqlExpression = dataSourceUtils.createSQLExpression(ClauseLogic.Or, clauses);
        return dataSourceUtils.getArcGISSQL(sqlExpression, datasource);
    }
}
function getSuggestionItem(suggestion, searchText) {
    if (!searchText)
        return suggestion;
    const replaceReg = new RegExp(`(${searchText})`, 'gi');
    return suggestion.replace(replaceReg, '<strong >$1</strong>');
}
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
export function compareQueryOptionsExceptPaging(query1, query2, datasource) {
    // const isEqual = true;
    if (!datasource)
        return false;
    query1 = datasource.getRealQueryParams(query1, 'query');
    query2 = datasource.getRealQueryParams(query2, 'query');
    if (!query1 || !query2) {
        return false;
    }
    delete query1.page;
    delete query1.pageSize;
    delete query1.resultOffset;
    delete query1.resultRecordCount;
    delete query2.page;
    delete query2.pageSize;
    delete query2.resultOffset;
    delete query2.resultRecordCount;
    return utils.isDeepEqual(query1, query2);
}
//# sourceMappingURL=list-service.js.map