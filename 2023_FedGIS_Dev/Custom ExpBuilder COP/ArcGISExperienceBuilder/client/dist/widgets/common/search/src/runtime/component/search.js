/** @jsx jsx */
import { React, css, ReactRedux, jsx, polished, Immutable, DataSourceStatus, lodash, AppMode, RecordSetChangeType, MessageManager, DataRecordsSelectionChangeMessage, DataSourceFilterChangeMessage } from 'jimu-core';
import { TextInput, Button, hooks, Link, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { SearchResultView, ArrangementStyle, SearchServiceType } from '../../config';
import { getSQL } from '../utils/search-service';
import { publishRecordCreatedMessageAction } from '../utils/locator-service';
import { getDatasource, setRecentSearches, getRecentSearches, clearRecentSearches, getJsonLength, changeDsStatus, checkIsDsCreated, getSuggestions, updateAllDsQueryParams, loadAllDsRecord } from '../utils/utils';
import SuggestionList from './suggestion-list';
import ResultList from './result-list';
import { SearchOutlined } from 'jimu-icons/outlined/editor/search';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import defaultMessage from '../translations/default';
import { useTheme } from 'jimu-theme';
const { useSelector } = ReactRedux;
const { useState, useEffect, useRef, useMemo } = React;
const SearchInput = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const theme = useTheme();
    const queryObject = useSelector((state) => state === null || state === void 0 ? void 0 : state.queryObject);
    const appMode = useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.appMode; });
    const debounceQuerySuggestionRef = useRef((searchText) => undefined);
    const linkRef = useRef(null);
    const suggestionFirstItem = useRef(null);
    const resultFirstItem = useRef(null);
    const searchValueRef = useRef(null);
    const preIsOpentResultPopperRef = useRef(false);
    const resultServiceListRef = useRef(null);
    const { config, className, reference, id, datasourceConfig, isShowSearchInput, isInCurrentView, isWidgetInCurrentPage, onShowSearchInputChange } = props;
    const { isShowRecentSearches, recentSearchesMaxNumber, linkParam, searchResultView, resultMaxNumber, arrangementStyle } = config;
    const [searchValue, setSearchValue] = useState(null);
    const [isShowLoading, setIsShowLoading] = useState(false);
    const [isOpenSuggestion, setIsOpenSuggestion] = useState(false);
    const [isRecentSearches, setIsRecentSearches] = useState(false);
    const [resultServiceList, setResultServiceList] = useState({});
    const [serviceList, setServiceList] = useState(null);
    const [searchSuggestion, setSearchSuggestion] = useState([]);
    const [isOpentResultPopper, setIsOpentResultPopper] = useState(false);
    const [isOpentResultListDefault, setIsOpentResultListDefault] = useState(false);
    const [isHasServiceSupportSuggest, setIsHasServiceSupportSuggest] = useState(false);
    //This dsId is just the id of the datasource where the record selected by the current search is located
    const [dsIdOfSelectedResultItem, setDsIdOfSelectedResultItem] = useState(null);
    const STYLE = css `
    .input-wrapper {
      height: 100% !important;
    }
    .loading-con {
      @keyframes loading {
        0% {transform: rotate(0deg); };
        100% {transform: rotate(360deg)};
      }
      width: ${polished.rem(16)};
      height: ${polished.rem(16)};
      min-width: ${polished.rem(16)};
      border: 2px solid ${(_c = (_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.secondary) === null || _c === void 0 ? void 0 : _c[300]};
      border-radius: 50%;
      border-top: 2px solid ${(_f = (_e = (_d = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.primary) === null || _f === void 0 ? void 0 : _f[500]};
      box-sizing: border-box;
      animation:loading 2s infinite linear;
      box-sizing: border-box;
    }
    .search-button {
      width: ${polished.rem(32)};
      border-radius: 0;
    }
    .search-input-con input{
      width: 100%;
    }
    .search-link-con {
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;
    useEffect(() => {
        initServiceList();
        // eslint-disable-next-line
    }, [datasourceConfig]);
    //After switching the page or view, judge whether to open the result panel according to the open situation of the previous result panel
    useEffect(() => {
        //If the search is in the page or the current view, judge whether to open the result panel according to the previous open state of the result panel
        if (preIsOpentResultPopperRef.current && isInCurrentView && isWidgetInCurrentPage) {
            setIsOpentResultListDefault(false);
            lodash.defer(() => {
                toggleResultPopper(true);
            });
        }
        else {
            setIsOpentResultListDefault(true);
        }
        //If Search widget is not in the current page or current view, close the result panel
        if (!isInCurrentView || !isWidgetInCurrentPage) {
            setIsOpentResultPopper(false);
        }
    }, [isInCurrentView, isWidgetInCurrentPage]);
    useEffect(() => {
        if (isOpentResultPopper && appMode === AppMode.Design) {
            setIsOpentResultPopper(false);
        }
        // eslint-disable-next-line
    }, [appMode]);
    useEffect(() => {
        /**
         * Check is has service support suggest
        */
        checkIsAllLocatorSupportSuggest(serviceList);
        debounceQuerySuggestionRef.current = lodash.debounce(querySuggestion, 400);
    }, [serviceList, config]);
    /**
    * Query suggestion
    */
    const querySuggestion = hooks.useEventCallback((starchText) => {
        const serviceSuggestion = getSuggestions(starchText, serviceList === null || serviceList === void 0 ? void 0 : serviceList.asMutable({ deep: true }), config);
        Promise.all([serviceSuggestion]).then(allSuggestion => {
            const suggestion = allSuggestion === null || allSuggestion === void 0 ? void 0 : allSuggestion[0];
            setIsShowLoading(false);
            if (suggestion) {
                setSearchSuggestion(suggestion);
            }
            searchValueRef.current && setIsOpenSuggestion(true);
        }).catch((error) => {
            setIsShowLoading(false);
        });
    });
    const checkIsAllLocatorSupportSuggest = (newServiceList) => {
        let hasServiceSupportSuggest = false;
        for (const key in newServiceList) {
            const serviceItem = newServiceList[key];
            if ((serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.searchServiceType) === SearchServiceType.FeatureService) {
                hasServiceSupportSuggest = true;
            }
            else {
                if (serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.isSupportSuggest) {
                    hasServiceSupportSuggest = true;
                }
            }
        }
        setIsHasServiceSupportSuggest(hasServiceSupportSuggest);
    };
    /**
     * Fire callback when the text of search input changes
    */
    const onChange = (e) => {
        var _a;
        const value = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        const isShowSuggestion = (value === null || value === void 0 ? void 0 : value.length) > 2;
        updateSearchValue(value);
        toggleResultPopper(false);
        if (!isShowSuggestion || !isHasServiceSupportSuggest) {
            setIsOpenSuggestion(false);
            if ((value === null || value === void 0 ? void 0 : value.length) === 0) {
                confirmSearch('', true);
            }
            return false;
        }
        !isShowLoading && setIsShowLoading(true);
        debounceQuerySuggestionRef.current(value);
    };
    const initResultServiceList = (newServiceList, initResultServiceListOption) => {
        const { configId, magicKey, isFromSuggestion } = initResultServiceListOption || {};
        let newResultServiceList = configId ? Immutable({}).setIn([configId], newServiceList[configId]) : Immutable(newServiceList);
        for (const configId in newResultServiceList) {
            magicKey && (newResultServiceList = newResultServiceList.setIn([configId, 'magicKey'], magicKey || null));
            isFromSuggestion && (newResultServiceList = newResultServiceList.setIn([configId, 'isFromSuggestion'], isFromSuggestion || null));
        }
        resultServiceListRef.current = newResultServiceList === null || newResultServiceList === void 0 ? void 0 : newResultServiceList.asMutable({ deep: true });
        setResultServiceList(newResultServiceList === null || newResultServiceList === void 0 ? void 0 : newResultServiceList.asMutable({ deep: true }));
    };
    /**
     * Fire callback when clear search input
    */
    const clearSearchValue = () => {
        updateSearchValue('');
        initOutputDsStatus();
        setIsShowLoading(false);
        toggleResultPopper(false);
        confirmSearch('', true);
    };
    /**
     * Set outputDs status to NotReady after clear search input
    */
    const initOutputDsStatus = hooks.useEventCallback(() => {
        var _a, _b;
        for (const configId in serviceList) {
            if (((_a = serviceList[configId]) === null || _a === void 0 ? void 0 : _a.searchServiceType) === SearchServiceType.GeocodeService) {
                const outputDsId = (_b = serviceList[configId]) === null || _b === void 0 ? void 0 : _b.outputDataSourceId;
                const outPutDs = getDatasource(outputDsId);
                outPutDs.selectRecordsByIds([]);
                changeDsStatus(outPutDs, DataSourceStatus.NotReady);
                publishRecordCreatedMessageAction(outputDsId, id, [], RecordSetChangeType.Remove);
            }
        }
    });
    /**
     * Fire callback when search input focus
    */
    const onSearchInputFocus = (e) => {
        var _a;
        const value = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        showRecentSearches(value);
        showUseCurrentLocation(value);
    };
    /**
     * Toggle result list popper
    */
    const toggleResultPopper = (isOpen) => {
        preIsOpentResultPopperRef.current = isOpen;
        if (!isOpen) {
            setIsOpentResultListDefault(true);
        }
        setIsOpentResultPopper(isOpen);
    };
    /**
     * Fire callback when search input key up
    */
    const onKeyUp = e => {
        var _a;
        if (!e || !e.target)
            return;
        const searchText = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        //Click suggestion to get the result, then click Enter again and no longer reload
        if (e.keyCode === 13 && checkIsReloadRecords()) {
            updateSearchValue(searchText);
            confirmSearch(searchText);
        }
        checkAndFocksPopper(e);
    };
    const checkIsReloadRecords = () => {
        let isReload = true;
        if (!resultServiceListRef.current)
            return isReload;
        const currentResultServiceList = resultServiceListRef.current;
        for (const configId in currentResultServiceList) {
            const serviceItem = currentResultServiceList[configId];
            isReload = !((serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.magicKey) || (serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.isFromSuggestion));
            if (!isReload)
                break;
        }
        return isReload;
    };
    /**
     * Fire callback when the suggestion list item is clicked.
    */
    const onSuggestionItemClick = (searchText, initResultServiceListOption) => {
        updateSearchValue(searchText, initResultServiceListOption);
        confirmSearch(searchText);
    };
    /**
     * Confirm search
    */
    const confirmSearch = (searchText, isClearSearch = false) => {
        if (isOpentResultPopper && !isClearSearch)
            return;
        updateRecentSearches(searchText);
        setIsOpenSuggestion(false);
        const updateParamsOption = {
            serviceList: resultServiceListRef.current,
            searchText: searchText,
            searchResultView: searchResultView,
            id: id
        };
        clearSelectRecordAndAction();
        updateAllDsQueryParams(updateParamsOption).then(status => {
            publishDataFilterAction();
            searchText && showResult(searchText);
        });
    };
    /**
     * Clear the selected records and message actions of current search before re-searching
    */
    const clearSelectRecordAndAction = () => {
        MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(id, []));
        if (dsIdOfSelectedResultItem) {
            const ds = getDatasource(dsIdOfSelectedResultItem);
            ds === null || ds === void 0 ? void 0 : ds.selectRecordsByIds([]);
        }
    };
    const handleDsIdOfSelectedResultItemChange = (dsId) => {
        setDsIdOfSelectedResultItem(dsId);
    };
    const publishDataFilterAction = () => {
        var _a;
        for (const configId in serviceList) {
            const service = serviceList[configId];
            let dsId;
            if ((service === null || service === void 0 ? void 0 : service.searchServiceType) === SearchServiceType.FeatureService) {
                dsId = (_a = service === null || service === void 0 ? void 0 : service.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId;
            }
            else if ((service === null || service === void 0 ? void 0 : service.searchServiceType) === SearchServiceType.GeocodeService) {
                dsId = service === null || service === void 0 ? void 0 : service.outputDataSourceId;
            }
            MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(id, dsId));
        }
    };
    const showResult = (searchText) => {
        //Show result
        if (searchResultView === SearchResultView.OtherWidgets) {
            publishRecordCreateAction();
            if (searchText) {
                if (checkIsHasSuggestion()) {
                    toOtherWidget();
                }
                else {
                    loadRecordAndCheckIsToOtherWidget();
                }
            }
        }
        else {
            showResultPanel();
        }
    };
    /**
    * Load records and check is has records before jump page, if not, show no result panel
    */
    const loadRecordAndCheckIsToOtherWidget = () => {
        const serviceRecords = loadAllDsRecord(resultServiceListRef.current, resultMaxNumber, id);
        Promise.all([serviceRecords]).then(res => {
            let allResponse = [];
            let allRecords = [];
            res === null || res === void 0 ? void 0 : res.forEach(resItem => {
                allResponse = allResponse.concat(resItem);
            });
            allResponse.forEach(dsResult => {
                const records = (dsResult === null || dsResult === void 0 ? void 0 : dsResult.records) || [];
                allRecords = allRecords.concat(records);
            });
            if ((allRecords === null || allRecords === void 0 ? void 0 : allRecords.length) > 0) {
                toOtherWidget();
            }
            else {
                showResultPanel();
            }
        });
    };
    const showResultPanel = () => {
        loadAllDsRecord(resultServiceListRef.current, resultMaxNumber, id, true);
        toggleResultPopper(true);
    };
    const checkIsHasSuggestion = () => {
        let suggestion = [];
        searchSuggestion.forEach(item => {
            suggestion = suggestion.concat(item === null || item === void 0 ? void 0 : item.suggestionItem);
        });
        return suggestion.length > 0;
    };
    /**
     * Update Recent searches
    */
    const updateRecentSearches = (searchText) => {
        //Save recent searchs
        const recentSearchsOption = {
            searchText: searchText,
            id: id,
            recentSearchesMaxNumber: recentSearchesMaxNumber,
            isShowRecentSearches: isShowRecentSearches
        };
        setRecentSearches(recentSearchsOption);
    };
    /**
     * Show result in other widget
    */
    const toOtherWidget = () => {
        var _a;
        if (!(linkRef === null || linkRef === void 0 ? void 0 : linkRef.current)) {
            return false;
        }
        (_a = linkRef === null || linkRef === void 0 ? void 0 : linkRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    /**
     * Load geocode records and publish records created message action
    */
    const publishRecordCreateAction = () => {
        const maxRecordNumber = searchResultView === SearchResultView.ResultPanel ? resultMaxNumber : null;
        const geocodeRecords = loadAllDsRecord(resultServiceListRef.current, maxRecordNumber, id, true);
        Promise.all([geocodeRecords]);
    };
    const getLinkToOption = (linkParam) => {
        let target;
        let linkTo;
        if (linkParam === null || linkParam === void 0 ? void 0 : linkParam.linkType) {
            target = linkParam === null || linkParam === void 0 ? void 0 : linkParam.openType;
            linkTo = {
                linkType: linkParam === null || linkParam === void 0 ? void 0 : linkParam.linkType
            };
            linkTo.value = linkParam === null || linkParam === void 0 ? void 0 : linkParam.value;
        }
        return {
            linkTo: linkTo,
            target: target
        };
    };
    const linkToOption = useMemo(() => getLinkToOption(linkParam), [linkParam]);
    /**
     * Clear Recent search
    */
    const clearRecentSearche = () => {
        clearRecentSearches(id);
        setSearchSuggestion([]);
        setIsOpenSuggestion(false);
        setIsRecentSearches(false);
    };
    /**
     * Fire callback when the text of search input changes
    */
    const updateSearchValue = (searchText, initResultServiceListOption) => {
        if (isRecentSearches) {
            setIsRecentSearches(false);
        }
        setSearchSuggestion([]);
        setSearchValue(searchText);
        searchValueRef.current = searchText;
        setQuerySQL(searchText, initResultServiceListOption);
    };
    const initServiceList = () => {
        var _a;
        let newServiceList = Immutable({});
        (_a = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a.forEach(configItem => {
            if (!(configItem === null || configItem === void 0 ? void 0 : configItem.enable))
                return false;
            const { configId } = configItem;
            let newDatasourceListItem;
            if ((configItem === null || configItem === void 0 ? void 0 : configItem.searchServiceType) === SearchServiceType.GeocodeService) {
                newDatasourceListItem = initGeocodeList(configItem);
            }
            else {
                newDatasourceListItem = initDatasourceList(configItem);
            }
            newServiceList = newServiceList.setIn([configId], newDatasourceListItem);
        });
        setServiceList(newServiceList);
    };
    /**
     * Init datasource list by enable config item
    */
    const initDatasourceList = hooks.useEventCallback((configItem) => {
        var _a;
        if (!(configItem === null || configItem === void 0 ? void 0 : configItem.enable) || (configItem === null || configItem === void 0 ? void 0 : configItem.searchServiceType) === SearchServiceType.GeocodeService)
            return false;
        const { configId, useDataSource, displayFields, searchFields, searchExact, hint, searchServiceType } = configItem;
        const datasourceListItem = ((_a = serviceList === null || serviceList === void 0 ? void 0 : serviceList[configId]) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })) || {};
        const updateItem = {
            useDataSource: useDataSource,
            displayFields: displayFields,
            searchFields: searchFields,
            searchExact: searchExact,
            maxSuggestions: config === null || config === void 0 ? void 0 : config.maxSuggestions,
            resultMaxNumber: resultMaxNumber,
            hint: hint,
            searchServiceType: searchServiceType,
            configId: configId
        };
        const newDatasourceListItem = Object.assign(datasourceListItem, updateItem);
        return newDatasourceListItem;
    });
    /**
     * Init geocode list by enable config item
    */
    const initGeocodeList = (configItem) => {
        var _a;
        if (!(configItem === null || configItem === void 0 ? void 0 : configItem.enable) || (configItem === null || configItem === void 0 ? void 0 : configItem.searchServiceType) === SearchServiceType.FeatureService)
            return false;
        const { configId, hint, geocodeURL, outputDataSourceId, label, searchServiceType, singleLineFieldName, displayFields, defaultAddressFieldName, addressFields, isSupportSuggest } = configItem;
        const datasourceListItem = ((_a = serviceList === null || serviceList === void 0 ? void 0 : serviceList[configId]) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })) || {};
        const updateItem = {
            hint: hint,
            geocodeURL: geocodeURL,
            outputDataSourceId: outputDataSourceId,
            icon: configItem === null || configItem === void 0 ? void 0 : configItem.icon,
            maxSuggestions: config === null || config === void 0 ? void 0 : config.maxSuggestions,
            resultMaxNumber: resultMaxNumber,
            label: label,
            searchServiceType: searchServiceType,
            configId: configId,
            singleLineFieldName: singleLineFieldName || '',
            displayFields: displayFields,
            defaultAddressFieldName: defaultAddressFieldName,
            addressFields: addressFields || [],
            isSupportSuggest: isSupportSuggest
        };
        const newDatasourceListItem = Object.assign(datasourceListItem, updateItem);
        return newDatasourceListItem;
    };
    /**
      * Set query SQL according to search text
    */
    const setQuerySQL = hooks.useEventCallback((searchText, initResultServiceListOption) => {
        var _a, _b, _c;
        let newServiceList = serviceList;
        for (const configId in serviceList) {
            const dsId = (_b = (_a = serviceList[configId]) === null || _a === void 0 ? void 0 : _a.useDataSource) === null || _b === void 0 ? void 0 : _b.dataSourceId;
            if (serviceList[configId].searchServiceType === SearchServiceType.GeocodeService || !checkIsDsCreated(dsId))
                continue;
            const ds = getDatasource(dsId);
            const searchFields = ((_c = serviceList[configId].searchFields) === null || _c === void 0 ? void 0 : _c.asMutable({ deep: true })) || [];
            const searchExact = serviceList[configId].searchExact || false;
            const SQL = getSQL(searchText, searchFields, ds, searchExact);
            const SuggestionSQL = getSQL(searchText, searchFields, ds, false);
            newServiceList = newServiceList.setIn([configId, 'SQL'], SQL).setIn([configId, 'SuggestionSQL'], SuggestionSQL);
        }
        setServiceList(newServiceList);
        initResultServiceList(newServiceList === null || newServiceList === void 0 ? void 0 : newServiceList.asMutable({ deep: true }), initResultServiceListOption);
    });
    /**
     * Check is show recent searches
    */
    const showRecentSearches = (searchText) => {
        if (!searchText && isShowRecentSearches) {
            const recentSearches = getRecentSearches(id);
            if ((recentSearches === null || recentSearches === void 0 ? void 0 : recentSearches.length) === 0)
                return false;
            const suggestionItem = recentSearches.map((searchValue) => {
                return {
                    suggestionHtml: searchValue,
                    suggestion: searchValue,
                    isRecentSearche: true
                };
            });
            setSearchSuggestion([{
                    suggestionItem: suggestionItem,
                    layer: null,
                    icon: null
                }]);
            setIsOpenSuggestion(true);
            setIsRecentSearches(true);
        }
        else {
            setSearchSuggestion([{
                    suggestionItem: [],
                    layer: null,
                    icon: null
                }]);
            setIsRecentSearches(false);
        }
    };
    const showUseCurrentLocation = (searchText) => {
        if (!searchText && (config === null || config === void 0 ? void 0 : config.isUseCurrentLoation) && !isOpenSuggestion) {
            setIsOpenSuggestion(true);
            if (!showRecentSearches) {
                setSearchSuggestion([{
                        suggestionItem: [],
                        layer: null,
                        icon: null
                    }]);
            }
        }
    };
    const suffix = () => {
        return (jsx("div", { className: 'd-flex align-items-center' },
            isShowLoading && jsx("div", { className: 'loading-con mr-1' }),
            (searchValue && (searchValue === null || searchValue === void 0 ? void 0 : searchValue.length) > 0) &&
                jsx(Button, { icon: true, type: 'tertiary', size: 'sm', onClick: clearSearchValue },
                    jsx(CloseOutlined, null))));
    };
    /**
     * Get placeholder of search input
    */
    const getPlaceholder = hooks.useEventCallback(() => {
        var _a, _b;
        let servicePlaceholder;
        const canUseDslength = getCanUseDslength();
        for (const configId in serviceList) {
            servicePlaceholder = ((_a = serviceList === null || serviceList === void 0 ? void 0 : serviceList[configId]) === null || _a === void 0 ? void 0 : _a.hint) && ((_b = serviceList === null || serviceList === void 0 ? void 0 : serviceList[configId]) === null || _b === void 0 ? void 0 : _b.hint);
        }
        const multipleSearchPlaceholder = (config === null || config === void 0 ? void 0 : config.hint) || nls('findAddressOrPlace');
        servicePlaceholder = servicePlaceholder || nls('findAddressOrPlace');
        return (canUseDslength !== 1) ? multipleSearchPlaceholder : servicePlaceholder;
    });
    const getCanUseDslength = hooks.useEventCallback(() => {
        return getJsonLength(serviceList);
    });
    const onSearchButtonClick = (searchValue) => {
        if (arrangementStyle === ArrangementStyle.Style2) {
            onShowSearchInputChange(!isShowSearchInput);
            setIsOpenSuggestion(false);
        }
        else {
            checkIsReloadRecords() && confirmSearch(searchValue);
        }
    };
    const isOpenSuggestionPopper = isOpenSuggestion && !isShowLoading && !isOpentResultPopper;
    const setSuggestionFirstItem = (ref) => {
        suggestionFirstItem.current = ref;
    };
    const setResultFirstItem = (ref) => {
        resultFirstItem.current = ref;
    };
    const checkAndFocksPopper = (e) => {
        var _a, _b;
        if (e.keyCode === 40 && suggestionFirstItem) {
            if (isOpenSuggestionPopper) {
                (_a = suggestionFirstItem === null || suggestionFirstItem === void 0 ? void 0 : suggestionFirstItem.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else if (isOpentResultPopper) {
                (_b = resultFirstItem === null || resultFirstItem === void 0 ? void 0 : resultFirstItem.current) === null || _b === void 0 ? void 0 : _b.focus();
            }
        }
    };
    const inputConKeyup = (e) => {
        checkAndFocksPopper(e);
    };
    const checkIsOpenSuggestionPopper = () => {
        if ((config === null || config === void 0 ? void 0 : config.maxSuggestions) > 0) {
            return isOpenSuggestionPopper && isHasServiceSupportSuggest;
        }
        else {
            const isShowCurrentLocationOrRecentSearch = (!searchValue && (config === null || config === void 0 ? void 0 : config.isUseCurrentLoation)) || isRecentSearches;
            return isOpenSuggestionPopper && isShowCurrentLocationOrRecentSearch;
        }
    };
    return (jsx("div", { className: `h-100 align-items-center position-relative d-flex flex-grow-1 ${className || ''}`, css: STYLE },
        jsx("div", { className: 'h-100 flex-grow-1 search-input-con' },
            jsx("div", { className: 'h-100 w-100', onKeyUp: inputConKeyup }, isShowSearchInput && jsx(TextInput, { value: searchValue || '', onChange: onChange, onFocus: onSearchInputFocus, onKeyUp: onKeyUp, className: 'h-100 w-100', suffix: suffix(), placeholder: getPlaceholder(), title: searchValue || getPlaceholder() })),
            jsx(SuggestionList, { serviceList: Immutable(resultServiceList), canUseOutoutDsLength: getCanUseDslength(), isOpen: checkIsOpenSuggestionPopper(), reference: reference, searchText: searchValue, searchSuggestion: searchSuggestion, toggel: () => { setIsOpenSuggestion(!isOpenSuggestion); }, onRecordItemClick: onSuggestionItemClick, isRecentSearches: isRecentSearches, clearSearches: clearRecentSearche, isShowCurrentLocation: config === null || config === void 0 ? void 0 : config.isUseCurrentLoation, setSuggestionFirstItem: setSuggestionFirstItem, config: config }),
            isOpentResultPopper && jsx(ResultList, { serviceList: Immutable(resultServiceList), config: config, reference: reference, searchText: searchValue, id: id, setResultFirstItem: setResultFirstItem, isOpentResultListDefault: isOpentResultListDefault, handleDsIdOfSelectedResultItemChange: handleDsIdOfSelectedResultItemChange })),
        jsx(Button, { className: 'search-button h-100', type: 'primary', icon: true, onClick: () => { onSearchButtonClick(searchValue); }, title: nls('SearchLabel') },
            jsx(SearchOutlined, null)),
        searchResultView === SearchResultView.OtherWidgets && jsx("div", { className: 'search-link-con' },
            jsx(Link, { ref: linkRef, to: linkToOption === null || linkToOption === void 0 ? void 0 : linkToOption.linkTo, target: linkToOption === null || linkToOption === void 0 ? void 0 : linkToOption.target, queryObject: queryObject }))));
};
export default SearchInput;
//# sourceMappingURL=search.js.map