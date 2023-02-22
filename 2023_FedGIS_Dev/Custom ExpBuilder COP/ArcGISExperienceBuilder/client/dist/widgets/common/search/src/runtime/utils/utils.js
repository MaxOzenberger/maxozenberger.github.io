import { DataSourceManager } from 'jimu-core';
import { RECENT_SEARCHES_KEY, SearchServiceType, SearchResultView } from '../../config';
import { fetchGeocodeSuggestions, loadGecodeRecords, loadGeocodeOutputRecords } from './locator-service';
import { fetchLayerSuggestion, updateDsQueryParams, loadDsRecords } from './search-service';
/**
 * Get all suggestion
*/
export const getSuggestions = (searchText, serviceList, config) => {
    const suggestionPromiseList = [];
    for (const configId in serviceList) {
        const serviceItem = serviceList[configId];
        let suggestionPromise;
        if (serviceItem.searchServiceType === SearchServiceType.FeatureService) {
            suggestionPromise = fetchLayerSuggestion(searchText, config, serviceItem);
        }
        else {
            suggestionPromise = fetchGeocodeSuggestions(searchText, serviceItem);
        }
        suggestionPromiseList.push(suggestionPromise);
    }
    return Promise.all(suggestionPromiseList);
};
/**
 * Update all dataSource query params
*/
export const updateAllDsQueryParams = (option) => {
    const { serviceList, searchText, searchResultView, id } = option;
    const geocodeFetchPromiseList = [];
    for (const configId in serviceList) {
        const serviceItem = serviceList[configId];
        const { searchServiceType, resultMaxNumber } = serviceItem;
        if (searchServiceType === SearchServiceType.FeatureService) {
            //Update layer source query params
            updateDsQueryParams(serviceItem, id, searchText);
        }
        else if (searchServiceType === SearchServiceType.GeocodeService) {
            //Update geocode source query params
            const maxResultNumber = searchResultView === SearchResultView.ResultPanel ? resultMaxNumber : null;
            const loadGeocodeRecordPromise = loadGecodeRecords(searchText, maxResultNumber, serviceItem, searchResultView);
            geocodeFetchPromiseList.push(loadGeocodeRecordPromise);
        }
    }
    return Promise.all(geocodeFetchPromiseList);
};
export const loadAllDsRecord = (serviceList, resultMaxNumber, id, isPublishRecordCreateAction = false) => {
    const suggestionPromiseList = [];
    for (const configId in serviceList) {
        const serviceItem = serviceList[configId];
        let suggestionPromise;
        if (serviceItem.searchServiceType === SearchServiceType.FeatureService) {
            suggestionPromise = loadDsRecords(serviceItem, resultMaxNumber, id);
        }
        else {
            suggestionPromise = loadGeocodeOutputRecords(serviceItem, resultMaxNumber, id, isPublishRecordCreateAction);
        }
        suggestionPromiseList.push(suggestionPromise);
    }
    return Promise.all(suggestionPromiseList);
};
/**
 * Get datasource by datasourceId
*/
export const getDatasource = (dsId) => {
    if (!dsId)
        return null;
    const dsManager = DataSourceManager.getInstance();
    return dsManager.getDataSource(dsId);
};
/**
 * De-duplicate for object or Arrary
*/
export const uniqueJson = (jsonArr, key) => {
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
};
/**
 * Save the current search to localStorage after the text of search input changes
*/
export const setRecentSearches = (options) => {
    const { searchText, id, recentSearchesMaxNumber, isShowRecentSearches } = options;
    const recentSearchKey = `${id}_${RECENT_SEARCHES_KEY}`;
    if (!isShowRecentSearches || !searchText)
        return false;
    let recentSearches = getRecentSearches(id);
    if (!recentSearches.includes(searchText)) {
        recentSearches.unshift(searchText);
        recentSearches = recentSearches.splice(0, recentSearchesMaxNumber || 10);
        localStorage.setItem(recentSearchKey, escape(recentSearches.join('/@/')));
    }
};
/**
 * Get recent searches from localStorage
*/
export const getRecentSearches = (id) => {
    const recentSearchKey = `${id}_${RECENT_SEARCHES_KEY}`;
    let recentSearchInLocal = localStorage.getItem(recentSearchKey);
    if (recentSearchInLocal) {
        recentSearchInLocal = unescape(recentSearchInLocal);
    }
    const recentSearches = recentSearchInLocal ? recentSearchInLocal === null || recentSearchInLocal === void 0 ? void 0 : recentSearchInLocal.split('/@/') : [];
    return recentSearches;
};
/**
 * Delete recent suggestion by index
*/
export const deleteRecentSearches = (index, id) => {
    const recentSearchKey = `${id}_${RECENT_SEARCHES_KEY}`;
    if (!index && index !== 0)
        return false;
    const recentSearches = getRecentSearches(id);
    recentSearches.splice(index, 1);
    const localRecentSearches = (recentSearches === null || recentSearches === void 0 ? void 0 : recentSearches.length) > 0 ? escape(recentSearches.join('/@/')) : '';
    localStorage.setItem(recentSearchKey, localRecentSearches);
};
/**
 * Clear all current searches
*/
export const clearRecentSearches = (id) => {
    const recentSearchKey = `${id}_${RECENT_SEARCHES_KEY}`;
    localStorage.setItem(recentSearchKey, '');
};
/**
 * Get datasource config item form config by configId
*/
export const getDatasourceConfigItemByConfigId = (config, configId) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = config === null || config === void 0 ? void 0 : config.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a.datasourceConfig) === null || _b === void 0 ? void 0 : _b.filter(item => item.configId === configId)) === null || _c === void 0 ? void 0 : _c[0];
};
export const getJsonLength = (json) => {
    let length = 0;
    //eslint-disable-next-line
    for (const key in json) {
        length++;
    }
    return length;
};
/**
 * Check whether the suggestion is repeated
*/
export function checkIsSuggestionRepeat(searchSuggestion, suggestionRecord) {
    return searchSuggestion.filter(suggestion => {
        return suggestionRecord === (suggestion === null || suggestion === void 0 ? void 0 : suggestion.suggestion);
    }).length > 0;
}
/**
 * Init suggestion list item (Bold search text)
*/
export function getSuggestionItem(suggestion, searchText) {
    if (!searchText)
        return suggestion;
    const searchReg = new RegExp(`(${searchText})`, 'gi');
    const replaceReg = new RegExp(`(${searchText})`, 'gi');
    return suggestion.match(searchReg) ? suggestion.replace(replaceReg, '<strong >$1</strong>') : suggestion;
}
/**
 * Change datasource status
*/
export function changeDsStatus(ds, status) {
    ds.setStatus(status);
    ds.setCountStatus(status);
}
/**
 * Check is datasource created
*/
export function checkIsDsCreated(dsId) {
    if (!dsId)
        return false;
    return !!getDatasource(dsId);
}
export function getResultPopperOffset(isMultipleService) {
    return isMultipleService ? [-32, 3] : [0, 3];
}
//# sourceMappingURL=utils.js.map