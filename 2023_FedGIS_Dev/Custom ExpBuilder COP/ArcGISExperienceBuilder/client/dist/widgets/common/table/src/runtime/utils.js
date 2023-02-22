var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dataSourceUtils, css, ClauseOperator, ClauseLogic } from 'jimu-core';
function queryRecords(q, ds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ds)
            return yield Promise.resolve([]);
        return yield ds
            .query(q)
            .then((queryResult) => __awaiter(this, void 0, void 0, function* () { return yield queryRecordsResult(q, queryResult); }));
    });
}
function queryRecordsResult(q, queryResult) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.resolve((queryResult === null || queryResult === void 0 ? void 0 : queryResult.records) || []);
    });
}
function getSuggestionItem(suggestion, searchText) {
    if (!searchText)
        return suggestion;
    const replaceReg = new RegExp(`(${searchText})`, 'gi');
    return suggestion.replace(replaceReg, '<strong >$1</strong>');
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
        if (config.enableSearch && config.searchFields) {
            const SQL = (_a = getQuerySQL(searchText, config, datasource, true)) === null || _a === void 0 ? void 0 : _a.sql;
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
export function minusArray(array1, array2, key) {
    const keyField = key || 'jimuName';
    const lengthFlag = array1.length > array2.length;
    const arr1 = lengthFlag ? array1 : array2;
    const arr2 = lengthFlag ? array2 : array1;
    return arr1.filter(item => {
        const hasField = arr2.some(ele => {
            return (ele === null || ele === void 0 ? void 0 : ele[keyField]) === (item === null || item === void 0 ? void 0 : item[keyField]);
        });
        return !hasField;
    });
}
export function getQuerySQL(searchText, curLayer, datasource, fetchSuggestion = false) {
    const searchFields = curLayer.searchFields.split(',');
    const searchExact = fetchSuggestion ? false : curLayer.searchExact;
    const clauseOperator = searchExact ? ClauseOperator.StringOperatorIs : ClauseOperator.StringOperatorContains;
    if (curLayer.searchFields) {
        const clauses = searchFields.map(field => {
            return dataSourceUtils.createSQLClause(field, clauseOperator, searchText);
        });
        const sqlExpression = dataSourceUtils.createSQLExpression(ClauseLogic.Or, clauses);
        return dataSourceUtils.getArcGISSQL(sqlExpression, datasource);
    }
}
export function getGlobalTableTools(theme) {
    return css `
    .esri-button-menu__item .esri-button-menu__item-label{
      padding: 4px 15px !important;
    }
    .table-popup-search{
      .search-icon{
        z-index: 2;
      }
      .popup-search-input{
        border: 1px solid ${theme.colors.palette.light[400]};
        border-radius: 2px;
        .input-wrapper{
          height: 30px;
          border: none;
        }
      }
    }
    .table-action-option{
      width: 100%;
      display: inline-flex;
      flex-direction: row;
      .table-action-option-tab{
        margin: auto 8px;
      }
      .table-action-option-close{
        flex: 1;
        button{
          :hover {
            color: ${theme.colors.white};
          }
          float: right;
        }
      }
    }
    .esri-popover--open{
      z-index: 1005 !important;
      .esri-date-picker__calendar{
        background-color: ${theme.colors.white};
      }
    }
    .jimu-dropdown-menu{
      z-index: 1006 !important;
    }
  `;
}
//# sourceMappingURL=utils.js.map