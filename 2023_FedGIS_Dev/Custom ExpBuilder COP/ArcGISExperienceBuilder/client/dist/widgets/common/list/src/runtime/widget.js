var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { classNames, React, jsx, DataSourceStatus, AppMode, appActions, DataSourceComponent, MessageManager, DataRecordsSelectionChangeMessage, getAppStore, ReactResizeDetector, DataSourceManager, LayoutType, Immutable, lodash, LayoutItemType, appConfigUtils, utils, PageMode, CONSTANTS } from 'jimu-core';
import { WidgetPlaceholder, Button, Popper, DataActionDropDown, defaultMessages as jimuUIDefaultMessages, Alert, DistanceUnits, TextAlignValue } from 'jimu-ui';
import { SelectionModeType, Status, LIST_CARD_MIN_SIZE, PageStyle, DS_TOOL_H, LIST_TOOL_MIN_SIZE_NO_DATA_ACTION, LIST_TOOL_MIN_SIZE_DATA_ACTION, ListLayoutType, SCROLL_BAR_WIDTH } from '../config';
import { LayoutEntry, searchUtils, LayoutItemSizeModes } from 'jimu-layouts/layout-runtime';
import { getQueryOptions, fetchSuggestionRecords, compareQueryOptionsExceptPaging } from './utils/list-service';
import { getToolsPopperStyle, getSearchToolStyle, getStyle, listStyle, getTopToolStyle } from './styles/style';
import ListCardEditor from './components/list-card-editor';
import ListCardViewer from './components/list-card-viewer';
import defaultMessages from './translations/default';
import SearchBox from './components/search-box';
import { VariableSizeList as List, VariableSizeGrid as Grid } from 'react-window';
import { Fragment, forwardRef } from 'react';
import MyDropDown from './components/my-dropdown';
import FilterPicker from './components/filter-picker';
import { ListBottomTools } from './components/bottom-tools';
import { versionManager } from '../version-manager';
import * as listUtils from './utils/utils';
import { MenuOutlined } from 'jimu-icons/outlined/editor/menu';
import { SearchOutlined } from 'jimu-icons/outlined/editor/search';
import { ShowSelectionOutlined } from 'jimu-icons/outlined/editor/show-selection';
import { TrashCheckOutlined } from 'jimu-icons/outlined/editor/trash-check';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
const defaultRecordsItem = { fake: true };
const MESSAGES = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
const { SELECTION_DATA_VIEW_ID } = CONSTANTS;
export class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.isFirstLoad = true;
        this.isHasScrolled = false; /* Whether the List has scrolled */
        this.isHasRenderList = false;
        this.isHasPublishMessageAction = false;
        this.isSetlayout = false;
        this.resetTimeout = null;
        this.isHasInitCurrentCardSize = false;
        this.updateWidgetRectTimeout = undefined;
        this.checkIsRecordsChange = (records, preRecords) => {
            var _a;
            const recordsId = (records === null || records === void 0 ? void 0 : records.map(record => record === null || record === void 0 ? void 0 : record.getId())) || [];
            const preRecordsId = (preRecords === null || preRecords === void 0 ? void 0 : preRecords.map(record => record === null || record === void 0 ? void 0 : record.getId())) || [];
            if ((recordsId === null || recordsId === void 0 ? void 0 : recordsId.length) !== preRecordsId) {
                return true;
            }
            else {
                return ((_a = recordsId === null || recordsId === void 0 ? void 0 : recordsId.filter(id => !(preRecordsId === null || preRecordsId === void 0 ? void 0 : preRecordsId.includes(id)))) === null || _a === void 0 ? void 0 : _a.length) > 0;
            }
        };
        this.resetAfterIndices = () => {
            var _a, _b, _c, _d;
            ((_b = (_a = this.listRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.resetAfterIndices) && ((_d = (_c = this.listRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.resetAfterIndices({
                columnIndex: 0,
                rowIndex: 0,
                shouldForceUpdate: false
            }));
        };
        this.setListLayoutInWidgetState = () => {
            const { layoutId, layoutItemId, id, selectionIsSelf } = this.props;
            if (layoutId && id && layoutItemId && !this.isSetlayout && selectionIsSelf) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', {
                    layoutId,
                    layoutItemId
                }));
                this.isSetlayout = true;
            }
        };
        this.setListParentSizeInWidgetState = () => {
            const { browserSizeMode, id, parentSize, layoutId } = this.props;
            const appConfig = getAppStore().getState().appConfig;
            const viewportSize = utils.findViewportSize(appConfig, browserSizeMode);
            const selector = `div.layout[data-layoutid=${layoutId}]`;
            const parentElement = document.querySelector(selector);
            const newParentSize = {
                width: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientWidth) || viewportSize.width,
                height: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientHeight) || viewportSize.height
            };
            if (!parentSize || parentSize.height !== newParentSize.height || parentSize.width !== newParentSize.width) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'parentSize', newParentSize));
            }
        };
        this.getBodySize = () => {
            this.bodySize = {
                scrollWidth: document.documentElement.scrollWidth,
                scrollHeight: document.documentElement.scrollHeight,
                clientWidth: document.documentElement.clientWidth,
                clientHeight: document.documentElement.clientHeight
            };
        };
        this.updateListInBuilder = (preProps, preState) => {
            var _a;
            const { config } = this.props;
            if (!window.jimuConfig.isInBuilder) {
                return false;
            }
            const currentCardSize = listUtils.getCardSizeNumberInConfig(this.props, (_a = this.state) === null || _a === void 0 ? void 0 : _a.widgetRect);
            // listen layout properties change and then update list
            let hideCardTool = this.layoutPropertiesChange(preProps, preState);
            this.updateScrollContentSize(preProps.config);
            // listen paging type change
            this.pageTypeChange(preProps);
            // listen useDatasources change
            this.useDatasourcesChange(preProps);
            // listening listDiv size's change
            hideCardTool = this.listDivSizeChange(preProps, preState, currentCardSize, hideCardTool);
            if (hideCardTool) {
                this.updateCardToolPosition();
            }
            // listen sort change
            this.listSortChange(preProps);
            // listen filter change
            this.listFilterChange(preProps);
            const isSelectionModeChange = config.cardConfigs[Status.Selected].selectionMode !==
                preProps.config.cardConfigs[Status.Selected].selectionMode;
            if (isSelectionModeChange) {
                this.selectRecords([]);
            }
        };
        this.layoutPropertiesChange = (preProps, preState) => {
            var _a, _b;
            const { config, top, left } = this.props;
            let hideCardTool = false;
            if (!window.jimuConfig.isInBuilder) {
                return false;
            }
            let refreshList = false;
            // listen layout properties change and then update list
            const currentCardSize = listUtils.getCardSizeNumberInConfig(this.props, this.state.widgetRect);
            const oldCardSize = listUtils.getCardSizeNumberInConfig(preProps, preState === null || preState === void 0 ? void 0 : preState.widgetRect);
            this.updateScrollContentSize(preProps.config);
            const isWidgetPositionChange = top !== preProps.top || left !== preProps.left;
            const isListLayoutChange = (config === null || config === void 0 ? void 0 : config.layoutType) !== preProps.config.layoutType;
            const isEqualCardSizeByListLayout = !listUtils.isEqualCardSizeByListLayout(oldCardSize, currentCardSize, config.layoutType); // for change template
            if (isListLayoutChange ||
                isEqualCardSizeByListLayout ||
                isWidgetPositionChange) {
                hideCardTool = true;
                if (isEqualCardSizeByListLayout) {
                    const newState = {
                        currentCardSize
                    };
                    refreshList = true;
                    this.setState(newState, () => {
                        if (refreshList)
                            this.refreshList();
                    });
                }
                else if (isListLayoutChange) {
                    this.handleResizeCard(this.state.currentCardSize, true, false, false, true);
                }
            }
            if (!refreshList) {
                const isSpaceNotChange = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID
                    ? listUtils.isEqualNumber(config === null || config === void 0 ? void 0 : config.horizontalSpace, (_a = preProps.config) === null || _a === void 0 ? void 0 : _a.horizontalSpace) && listUtils.isEqualNumber(config === null || config === void 0 ? void 0 : config.verticalSpace, (_b = preProps.config) === null || _b === void 0 ? void 0 : _b.verticalSpace)
                    : listUtils.isEqualNumber(config.space, preProps.config.space);
                if (!isSpaceNotChange || config.layoutType !== preProps.config.layoutType) {
                    refreshList = true;
                    this.refreshList();
                }
            }
            return hideCardTool;
        };
        this.listDivSizeChange = (preProps, preState, currentCardSize, hideCardTool) => {
            var _a;
            const { config, isHeightAuto } = this.props;
            const { listDivSize } = this.state;
            const showBT = listUtils.showBottomTools(this.props, this.state);
            const oldShowBT = listUtils.showBottomTools(preProps, preState);
            const showDS = listUtils.showTopTools(this.props);
            const oldShowDS = listUtils.showTopTools(preProps);
            if (showBT !== oldShowBT || showDS !== oldShowDS) {
                if (!isHeightAuto) {
                    if (config.layoutType === ListLayoutType.Column) {
                        let cardH = ((_a = this.state.widgetRect) === null || _a === void 0 ? void 0 : _a.height) || (listDivSize === null || listDivSize === void 0 ? void 0 : listDivSize.clientHeight);
                        cardH -=
                            listUtils.getBottomToolH(this.paginatorDiv.current, showBT) +
                                (showDS ? 1 : 0) * DS_TOOL_H;
                        if (cardH < LIST_CARD_MIN_SIZE)
                            return;
                        const cardSize = {
                            height: cardH,
                            width: currentCardSize.width
                        };
                        this.handleResizeCard(cardSize, true, false, false, true);
                    }
                }
                else {
                    hideCardTool = true;
                }
            }
            return hideCardTool;
        };
        this.appModeChange = preProps => {
            const { appMode, selectionIsSelf, selectionStatus, builderStatus } = this.props;
            if (preProps.appMode !== appMode) {
                if (appMode === AppMode.Run) {
                    this.editBuilderAndSettingStatus(Status.Regular);
                }
                else {
                    if (selectionStatus !== builderStatus) {
                        // change status by toc
                        if (!selectionStatus) {
                            if (!selectionIsSelf) {
                                this.editBuilderAndSettingStatus(Status.Regular);
                            }
                        }
                        else {
                            this.editBuilderAndSettingStatus(selectionStatus);
                        }
                    }
                    this.setState({
                        showSelectionOnly: false,
                        searchText: undefined,
                        filterApplied: false,
                        hoverIndex: -1
                    }, () => {
                        this.scrollToIndex(0);
                    });
                }
            }
        };
        this.pageTypeChange = preProps => {
            const { pageStyle } = this.props.config;
            const oldPageStyle = preProps.config.pageStyle;
            if (pageStyle !== oldPageStyle) {
                this.setState({
                    page: 1
                });
            }
        };
        this.useDatasourcesChange = preProps => {
            const { useDataSources } = this.props;
            const oldUseDataSources = preProps.useDataSources;
            if (useDataSources && useDataSources[0]) {
                const oldUseDataSource = oldUseDataSources && oldUseDataSources[0];
                if (!oldUseDataSource ||
                    oldUseDataSource.dataSourceId !== useDataSources[0].dataSourceId) {
                    // reset querysStart
                    this.setState({
                        page: 1
                    });
                }
            }
            else {
                // remove ds maybe
                this.setState({
                    datasource: undefined
                });
            }
        };
        this.listSortChange = preProps => {
            const { config } = this.props;
            if (config.sortOpen) {
                const sorts = config.sorts;
                const oldSorts = preProps.config.sorts;
                if (sorts !== oldSorts) {
                    this.setState({
                        sortOptionName: undefined
                    });
                }
            }
        };
        this.listFilterChange = preProps => {
            const { config } = this.props;
            if (config.filterOpen) {
                const filter = config.filter;
                const oldFilter = preProps.config.filter;
                if (filter !== oldFilter) {
                    this.setState({
                        currentFilter: undefined,
                        filterApplied: false
                    });
                }
            }
        };
        this.setSelectionStatus = () => {
            const { id, selectionIsInSelf } = this.props;
            this.props.dispatch(appActions.widgetStatePropChange(id, 'selectionIsInSelf', selectionIsInSelf));
        };
        this.updateScrollContentSize = preConfig => {
            const { config } = this.props;
            const isSpaceNotChange = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID
                ? listUtils.isEqualNumber(config === null || config === void 0 ? void 0 : config.horizontalSpace, preConfig === null || preConfig === void 0 ? void 0 : preConfig.horizontalSpace) && listUtils.isEqualNumber(config === null || config === void 0 ? void 0 : config.verticalSpace, preConfig === null || preConfig === void 0 ? void 0 : preConfig.verticalSpace)
                : listUtils.isEqualNumber(config.space, preConfig.space);
            if (config.layoutType !== preConfig.layoutType || !isSpaceNotChange) {
                this.setScrollContentSize();
            }
        };
        this.scrollToSelectedItems = (datasource) => {
            var _a;
            const selectedRecordIds = datasource.getSelectedRecordIds();
            if (this.isMySelected) {
                this.isMySelected = false;
                this.lastSelectedRecordIds = selectedRecordIds || [];
                return;
            }
            const isSelectedRecordsChange = this.checkIsSelectRecordsChange(datasource);
            if (selectedRecordIds && selectedRecordIds.length > 0 && isSelectedRecordsChange) {
                if (isSelectedRecordsChange || this.needScroll) {
                    const newAddedSelectedRecordsId = this.getNewAddedSelectedRecordsId(datasource);
                    const neewScrollToSelectedRecordsId = (newAddedSelectedRecordsId === null || newAddedSelectedRecordsId === void 0 ? void 0 : newAddedSelectedRecordsId.length) > 0 ? newAddedSelectedRecordsId : selectedRecordIds;
                    let index = -1;
                    (_a = this === null || this === void 0 ? void 0 : this.records) === null || _a === void 0 ? void 0 : _a.find((record, i) => {
                        var _a;
                        if (!(record === null || record === void 0 ? void 0 : record.getId)) {
                            return false;
                        }
                        const recordId = (_a = record === null || record === void 0 ? void 0 : record.getId) === null || _a === void 0 ? void 0 : _a.call(record);
                        if (neewScrollToSelectedRecordsId === null || neewScrollToSelectedRecordsId === void 0 ? void 0 : neewScrollToSelectedRecordsId.includes(recordId)) {
                            index = i;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    if (index === -1) {
                        // Can't find it, need to search in all records again
                        const records = datasource.getRecords();
                        records &&
                            records.find((record, i) => {
                                var _a;
                                if (((_a = record.getId) === null || _a === void 0 ? void 0 : _a.call(record)) === selectedRecordIds[0]) {
                                    index = i;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                        if (index > -1) {
                            const newPage = Math.ceil((index + 1) / this.getPageSize());
                            this.needScroll = true;
                            this.setState({
                                page: newPage
                            });
                        }
                    }
                    else {
                        this.scrollToIndex(index);
                        this.needScroll = false;
                        this.lastSelectedRecordIds = selectedRecordIds || [];
                    }
                }
            }
        };
        this.checkIsSelectRecordsChange = (datasource) => {
            var _a;
            const selectedRecordIds = (datasource === null || datasource === void 0 ? void 0 : datasource.getSelectedRecordIds()) || [];
            const lastSelectedRecordIds = (this === null || this === void 0 ? void 0 : this.lastSelectedRecordIds) || [];
            if ((selectedRecordIds === null || selectedRecordIds === void 0 ? void 0 : selectedRecordIds.length) !== (lastSelectedRecordIds === null || lastSelectedRecordIds === void 0 ? void 0 : lastSelectedRecordIds.length)) {
                return true;
            }
            else {
                return ((_a = selectedRecordIds === null || selectedRecordIds === void 0 ? void 0 : selectedRecordIds.filter(id => !(lastSelectedRecordIds === null || lastSelectedRecordIds === void 0 ? void 0 : lastSelectedRecordIds.includes(id)))) === null || _a === void 0 ? void 0 : _a.length) > 0;
            }
        };
        this.getNewAddedSelectedRecordsId = (datasource) => {
            const lastSelectedRecordIds = this.lastSelectedRecordIds || [];
            const selectedRecordIds = datasource.getSelectedRecordIds() || [];
            const newAddedSelectedRecords = selectedRecordIds === null || selectedRecordIds === void 0 ? void 0 : selectedRecordIds.filter(id => {
                return !(lastSelectedRecordIds === null || lastSelectedRecordIds === void 0 ? void 0 : lastSelectedRecordIds.includes(id));
            });
            return newAddedSelectedRecords;
        };
        this.onDSCreated = (ds) => {
            this.setState({
                datasource: ds
            });
        };
        this.onResize = (width, height) => {
            const newWidgetRect = {
                width,
                height
            };
            const { config } = this.props;
            const { isResizingCard, currentCardSize } = this.state;
            if (isResizingCard) {
                return;
            }
            const showBottomTool = listUtils.showBottomTools(this.props, this.state);
            const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool);
            const showTopTool = listUtils.showTopTools(this.props);
            const listH = listUtils.getListHeight(newWidgetRect, bottomToolH, showTopTool);
            const oldCardSize = this.getOldCardSizeWhenResize(newWidgetRect);
            const newDefaultCardSize = config.layoutType === ListLayoutType.GRID ? listUtils.getCardSizeNumberInConfig(this.props, newWidgetRect) : currentCardSize;
            const cardSize = {
                width: newDefaultCardSize.width,
                height: newDefaultCardSize.height
            };
            let needRefreshList = !listUtils.isEqualNumber(currentCardSize === null || currentCardSize === void 0 ? void 0 : currentCardSize.width, newDefaultCardSize === null || newDefaultCardSize === void 0 ? void 0 : newDefaultCardSize.width) || !listUtils.isEqualNumber(currentCardSize === null || currentCardSize === void 0 ? void 0 : currentCardSize.height, newDefaultCardSize === null || newDefaultCardSize === void 0 ? void 0 : newDefaultCardSize.height);
            if (config.lockItemRatio && config.layoutType !== ListLayoutType.GRID) {
                const ratio = cardSize.width / cardSize.height;
                switch (config === null || config === void 0 ? void 0 : config.layoutType) {
                    case ListLayoutType.Column:
                        cardSize.height = listH;
                        cardSize.width = listH * ratio;
                        if (!listUtils.isEqualNumber(cardSize.width, oldCardSize.width)) {
                            needRefreshList = true;
                        }
                        break;
                    case ListLayoutType.Row:
                        cardSize.height = width / ratio;
                        cardSize.width = width;
                        if (!listUtils.isEqualNumber(cardSize.height, oldCardSize.height)) {
                            needRefreshList = true;
                        }
                        break;
                }
            }
            else {
                switch (config === null || config === void 0 ? void 0 : config.layoutType) {
                    case ListLayoutType.Column:
                        cardSize.height = listH;
                        break;
                    case ListLayoutType.Row:
                        cardSize.width = width;
                        break;
                }
            }
            const notResetCardSize = cardSize.width < LIST_CARD_MIN_SIZE || cardSize.height < LIST_CARD_MIN_SIZE || newWidgetRect.width === 0 || newWidgetRect.height === 0;
            if (notResetCardSize) {
                return;
            }
            this.setState({
                widgetRect: newWidgetRect,
                currentCardSize: cardSize
            }, () => {
                this.isHasInitCurrentCardSize = true;
                this.editListSizeInRunTime(newWidgetRect);
                if (needRefreshList) {
                    this.refreshList();
                }
            });
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = undefined;
            }
            if (config.lockItemRatio) {
                this.resizeTimeout = setTimeout(() => {
                    this.handleResizeCard(cardSize, true, false, false, true);
                }, 500);
            }
            this.updateCardToolPosition();
            this.setListDivSize();
        };
        this.getOldCardSizeWhenResize = (newWidgetRect) => {
            //When the width and height are percentages, the Onresize method will be automatically called once when the List is loaded. At this time, the current List size should be used to obtain the oldCardSize
            const { currentCardSize } = this.state;
            if (!this.isHasInitCurrentCardSize) {
                return listUtils.getCardSizeNumberInConfig(this.props, newWidgetRect);
            }
            else {
                return currentCardSize;
            }
        };
        this.updateCardToolPosition = () => {
            const { selectionIsSelf } = this.props;
            const { hideCardTool } = this.state;
            if (!selectionIsSelf || hideCardTool)
                return;
            this.setState({
                hideCardTool: true
            });
            if (this.updateCardToolTimeout) {
                clearTimeout(this.updateCardToolTimeout);
                this.updateCardToolTimeout = undefined;
            }
            this.updateCardToolTimeout = setTimeout(() => {
                this.setState({
                    hideCardTool: false
                });
            }, 500);
        };
        this.refreshList = (shouldForceUpdate = true) => {
            var _a, _b, _c, _d, _e;
            if (this.listRef.current) {
                if (((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layoutType) === ListLayoutType.GRID) {
                    //VariableSizeGrid caches offsets and measurements for each item for performance purposes.
                    //This method clears that cached data for all items after (and including) the specified indices. It should be called whenever an items size changes.
                    //https://react-window.vercel.app/#/api/VariableSizeGrid
                    this.resetAfterIndices();
                }
                else {
                    //VariableSizeList caches offsets and measurements for each index for performance purposes.
                    //This method clears that cached data for all items after (and including) the specified index. It should be called whenever a item's size changes.
                    ((_c = (_b = this.listRef) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.resetAfterIndex) && ((_e = (_d = this.listRef) === null || _d === void 0 ? void 0 : _d.current) === null || _e === void 0 ? void 0 : _e.resetAfterIndex(0, shouldForceUpdate));
                }
            }
        };
        this.isDsConfigured = () => {
            const { useDataSources } = this.props;
            return !!useDataSources && !!useDataSources[0];
        };
        this.selectRecords = (records) => {
            const { datasource } = this.state;
            if (datasource) {
                MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, records));
                if (records) {
                    this.isMySelected = true;
                    this.isHasPublishMessageAction = true;
                    datasource.selectRecordsByIds(records.map(record => record.getId()));
                    const outputDs = this.getOutputDs();
                    outputDs &&
                        outputDs.selectRecordsByIds(records.map(record => record.getId()));
                }
                else {
                    this.isHasPublishMessageAction = false;
                }
            }
        };
        this.formatMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: MESSAGES[id] }, values);
        };
        // call exec manuly
        this.editStatus = (name, value) => {
            const { dispatch, id } = this.props;
            dispatch(appActions.widgetStatePropChange(id, name, value));
        };
        this.editWidgetConfig = newConfig => {
            if (!window.jimuConfig.isInBuilder)
                return;
            const appConfigAction = this.props.builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            appConfigAction.editWidgetConfig(this.props.id, newConfig).exec();
        };
        this.scrollToIndex = (index, type = 'start') => {
            const { config } = this.props;
            if (this.listRef.current) {
                if ((config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID) {
                    const columnCount = this.getItemColumnCount();
                    const rowIndex = Math.floor(index / columnCount);
                    this.listRef.current.scrollToItem({
                        columnIndex: index - rowIndex * columnCount,
                        rowIndex: rowIndex,
                        align: type
                    });
                }
                else {
                    this.listRef.current.scrollToItem(index, type);
                }
            }
        };
        this.isEditing = () => {
            const { appMode, config, selectionIsSelf, selectionIsInSelf } = this.props;
            if (!window.jimuConfig.isInBuilder)
                return false;
            return ((selectionIsSelf || selectionIsInSelf) &&
                window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                config.isItemStyleConfirm);
        };
        this.handleItemChange = (itemRecord) => {
            const { config } = this.props;
            const { datasource } = this.state;
            if (!datasource || !itemRecord)
                return;
            let selectedRecords = datasource.getSelectedRecords() || [];
            if (config.cardConfigs[Status.Selected].selectionMode &&
                config.cardConfigs[Status.Selected].selectionMode !==
                    SelectionModeType.None) {
                const recordId = itemRecord === null || itemRecord === void 0 ? void 0 : itemRecord.getId();
                const record = selectedRecords.find(record => record.getId() === recordId);
                if (config.cardConfigs[Status.Selected].selectionMode ===
                    SelectionModeType.Single) {
                    if (record) {
                        this.selectRecords([]);
                        this.setState({ showSelectionOnly: false });
                    }
                    else {
                        this.selectRecords([itemRecord]);
                    }
                }
                else {
                    if (record) {
                        selectedRecords = selectedRecords.filter(record => record.getId() !== recordId);
                    }
                    else {
                        selectedRecords = [itemRecord].concat(selectedRecords);
                    }
                    this.selectRecords(selectedRecords);
                }
            }
        };
        this.handleListPointerDown = evt => {
            this.setState({
                forceShowMask: true
            });
            if (this.mouseClickTimeout) {
                clearTimeout(this.mouseClickTimeout);
                this.mouseClickTimeout = undefined;
            }
            this.mouseClickTimeout = setTimeout(() => {
                this.setState({
                    forceShowMask: false
                });
            }, 200);
        };
        this.handleScrollUp = e => {
            const scrollStep = this.getScrollStep();
            const listVisibleStartIndex = this.getListVisibleStartIndex();
            let toIndex = listVisibleStartIndex - scrollStep;
            if (toIndex < 0) {
                toIndex = 0;
            }
            this.scrollToIndex(toIndex, 'start');
        };
        this.handleScrollDown = e => {
            const scrollStep = this.getScrollStep();
            const { listVisibleStopIndex } = this;
            const listVisibleStartIndex = this.getListVisibleStartIndex();
            if (listVisibleStopIndex + scrollStep >= this.records.length - 1 &&
                this.records.length < this.getTotalCount()) {
                this.isSwitchPage = true;
                this.setState({
                    page: this.state.page + 1
                });
            }
            else {
                this.scrollToIndex(listVisibleStartIndex + scrollStep, 'start');
            }
        };
        this.getScrollStep = () => {
            const { scrollStep, layoutType } = this.props.config;
            const columnCount = this.getItemColumnCount();
            return layoutType === ListLayoutType.GRID ? scrollStep * columnCount : scrollStep;
        };
        this.handleSwitchPage = (pageNum) => {
            const totalPages = this.getTotalPage();
            if (pageNum < 1 || pageNum > totalPages)
                return;
            if (pageNum !== this.state.page) {
                this.isSwitchPage = true;
                this.lastQueryStart = this.state.page;
                this.setState({
                    page: pageNum
                });
            }
        };
        this.handleListMouseLeave = () => {
            if (this.isEditing())
                return;
            this.setState({
                hoverIndex: -1
            });
        };
        this.handleListMouseMove = (itemIndex) => {
            if (this.isEditing())
                return;
            if (itemIndex === this.state.hoverIndex)
                return;
            this.setState({
                hoverIndex: itemIndex
            });
        };
        this.lastScrollOffset = 0;
        this.handleListScroll = ({ scrollDirection, scrollOffset, scrollTop, scrollUpdateWasRequested }) => {
            var _a, _b;
            const { appMode, config } = this.props;
            const listDiv = this.listOutDivRef;
            const { datasource, scrollStatus } = this.state;
            this.lastScrollOffset = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? scrollTop : scrollOffset;
            if (!listDiv || ((_b = (_a = this.records) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1)
                return;
            if (config.pageStyle === PageStyle.Scroll &&
                this.queryStatus !== DataSourceStatus.Loading &&
                datasource &&
                (!window.jimuConfig.isInBuilder || appMode === AppMode.Run)) {
                this.isHasScrolled = true;
                if (listUtils.isScrollStart(listDiv, this.lastScrollOffset)) {
                    if (scrollStatus !== 'start') {
                        this.setState({
                            scrollStatus: 'start'
                        });
                    }
                }
                else {
                    if (scrollStatus !== 'mid') {
                        this.setState({
                            scrollStatus: 'mid'
                        });
                    }
                }
            }
        };
        this.getTotalPage = () => {
            const { totalCount } = this;
            const { config } = this.props;
            const total = totalCount;
            const totalPage = Math.floor(total / config.itemsPerPage);
            const mode = total % config.itemsPerPage;
            return mode === 0 ? totalPage : totalPage + 1;
        };
        this.getListVisibleStartIndex = () => {
            const { lastScrollOffset } = this;
            const { config } = this.props;
            const itemSize = this.itemSize(0);
            const base = (lastScrollOffset * 1.0) / itemSize;
            let index = Math.floor(base);
            const mo = (base - index) * itemSize;
            const space = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? config === null || config === void 0 ? void 0 : config.verticalSpace : config === null || config === void 0 ? void 0 : config.space;
            const columnCount = this.getItemColumnCount();
            index = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? index * columnCount : index;
            if (mo > itemSize - space) {
                index++;
            }
            return index;
        };
        this.handleSortOptionChange = (evt, item) => {
            this.setState({
                sortOptionName: item.label,
                page: 1
            }, () => {
                // this.selectRecords([])
            });
        };
        this.handleSearchTextChange = searchText => {
            if (searchText === '' || !searchText) {
                this.handleSearchSubmit(undefined);
            }
            this.setState({
                searchSuggestion: []
            });
            clearTimeout(this.suggestionsQueryTimeout);
            this.suggestionsQueryTimeout = setTimeout(() => {
                this.getSearchSuggestions(searchText);
            }, 200);
        };
        this.getSearchSuggestions = searchText => {
            const { config } = this.props;
            const { datasource } = this.state;
            if ((searchText === null || searchText === void 0 ? void 0 : searchText.length) < 3) {
                return false;
            }
            fetchSuggestionRecords(searchText, config, datasource).then(searchSuggestion => {
                this.setState({
                    searchSuggestion: searchSuggestion
                });
            });
        };
        this.handleSearchSubmit = (searchText, isEnter = false) => {
            const oldSearchText = this.state.searchText;
            if (oldSearchText === searchText && !isEnter) {
                return;
            }
            this.setState({
                searchText: searchText,
                page: 1
            }, () => {
                // this.selectRecords([])
            });
        };
        this.initNewCardSize = (newCardSize) => {
            const { config } = this.props;
            //If the original width and height are percentages, px will be converted to percentages during resize, and then set to config
            const { widgetRect } = this.state;
            let cardSize = Immutable(newCardSize);
            const cardSizeWidthUnit = listUtils.getCardSizeWidthUnitInConfig(this.props);
            if (cardSizeWidthUnit.width.unit === DistanceUnits.PERCENTAGE) {
                cardSize = cardSize.set('width', `${(newCardSize.width * 100) / (widgetRect.width + (config === null || config === void 0 ? void 0 : config.horizontalSpace) - SCROLL_BAR_WIDTH)}%`);
            }
            if (cardSizeWidthUnit.height.unit === DistanceUnits.PERCENTAGE) {
                cardSize = cardSize.set('height', `${newCardSize.height * 100 / widgetRect.height}%`);
            }
            return cardSize === null || cardSize === void 0 ? void 0 : cardSize.asMutable({ deep: true });
        };
        this.handleFilterChange = (sqlExprObj) => {
            this.setState({
                currentFilter: sqlExprObj,
                page: 1
            }, () => {
                // this.selectRecords([])
            });
        };
        this.handleFilterApplyChange = (applied) => {
            const alterState = {
                filterApplied: applied,
                queryStart: 0
            };
            if (!applied) {
                // alterState.currentFilter = undefined
            }
            this.setState(alterState, () => {
                // this.selectRecords([])
            });
        };
        this.handleShowSelectionClick = evt => {
            const { showSelectionOnly } = this.state;
            this.setState({ showSelectionOnly: !showSelectionOnly });
        };
        this.handleClearSelectionClick = () => {
            this.setState({ showSelectionOnly: false });
            this.selectRecords([]);
        };
        this.resetShowSelectionStatus = () => {
            const { showSelectionOnly } = this.state;
            if (showSelectionOnly) {
                this.setState({ showSelectionOnly: false });
            }
        };
        this._getCurrentPage = () => {
            return this.state.page;
        };
        this.getTotalCount = () => {
            const total = this.totalCount || 0;
            return total;
        };
        this.selectCard = () => {
            const { selectionIsInSelf } = this.props;
            if (selectionIsInSelf) {
                this.selectSelf();
            }
        };
        this.editBuilderAndSettingStatus = (status) => {
            this.editStatus('showCardSetting', status);
            this.editStatus('builderStatus', status);
        };
        this.editListSizeInRunTime = (widgetRect) => {
            const { id, dispatch } = this.props;
            dispatch(appActions.widgetStatePropChange(id, 'widgetRect', widgetRect));
        };
        this.getSortItems = () => {
            const { config } = this.props;
            const options = [];
            if (config.sorts) {
                config.sorts.forEach(sort => {
                    sort.rule &&
                        sort.rule.forEach(sortData => {
                            if (sortData && !!sortData.jimuFieldName) {
                                options.push({
                                    label: sort.ruleOptionName,
                                    event: this.handleSortOptionChange
                                });
                            }
                        });
                });
            }
            return Immutable(options);
        };
        this.renderListTopTools = (ds, queryStatus, selectRecords) => {
            const { widgetRect, isSearchBoxVisible, isOpenTopToolsPopper } = this.state;
            const listWidth = (widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.width) || 620;
            const isShowDataAction = listUtils.checkIsShowDataAction(this.props);
            const isShowListToolsOnly = listUtils.checkIsShowListToolsOnly(this.props);
            const dataName = this.formatMessage('listDataActionLabel', { layer: (ds === null || ds === void 0 ? void 0 : ds.getLabel()) || '' });
            const LIST_TOOL_MIN_SIZE = isShowDataAction ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION;
            return (jsx("div", { className: 'datasource-tools w-100', css: getTopToolStyle(this.props, isShowListToolsOnly) },
                jsx("div", { className: "d-flex align-items-center" },
                    jsx("div", { className: "flex-grow-1 tool-row" }, isShowListToolsOnly && jsx("div", null,
                        listWidth >= LIST_TOOL_MIN_SIZE && (jsx("div", { className: 'tool-row row1 d-flex align-items-center w-100 justify-content-between' },
                            this.renderSearchTools(ds, queryStatus),
                            (!isSearchBoxVisible || listWidth >= 360) &&
                                this.renderTopRightTools(ds, queryStatus))),
                        listWidth < LIST_TOOL_MIN_SIZE && (jsx("div", { className: 'float-right', ref: ref => (this.reference = ref) },
                            jsx(Button, { type: 'tertiary', icon: true, size: 'sm', className: 'tools-menu', title: this.formatMessage('guideStep9Title'), onClick: evt => {
                                    this.setState({ isOpenTopToolsPopper: !isOpenTopToolsPopper });
                                } },
                                jsx(MenuOutlined, { size: 16 })),
                            this.renderListTopToolsInPoper(ds, queryStatus))))),
                    (ds && isShowDataAction) && jsx("div", { className: classNames('list-data-action position-relative', { 'm-left': listWidth < LIST_TOOL_MIN_SIZE }), "data-testid": "data-action" },
                        jsx(DataActionDropDown, { type: 'tertiary', widgetId: this.props.id, dataSet: { dataSource: ds, records: selectRecords, name: dataName }, size: "sm" }))),
                window.jimuConfig.isInBuilder && this.isEditing() && (jsx("div", { className: 'editing-mask-ds-tool' }))));
        };
        this.renderListTopToolsInPoper = (ds, queryStatus) => {
            const { widgetRect, isSearchBoxVisible, isOpenTopToolsPopper } = this.state;
            const toolsDisabled = this.isEditing();
            const listWidth = (widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.width) || 620;
            const LIST_TOOL_MIN_SIZE = listUtils.checkIsShowDataAction(this.props) ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION;
            const isOpen = listWidth < LIST_TOOL_MIN_SIZE && isOpenTopToolsPopper && !toolsDisabled;
            return (jsx("div", null,
                jsx(Popper, { placement: 'bottom-start', reference: this.reference, offset: [-10, 0], open: isOpen, showArrow: true, toggle: e => {
                        this.setState({ isOpenTopToolsPopper: !isOpen });
                    } },
                    jsx("div", { className: 'tool-row row1 d-flex align-items-end justify-content-between', css: getToolsPopperStyle(this.props) },
                        this.renderSearchTools(ds, queryStatus),
                        !isSearchBoxVisible && this.renderTopRightTools(ds, queryStatus)))));
        };
        this.renderSearchTools = (ds, queryStatus) => {
            const toolsDisabled = this.isEditing() || !ds || queryStatus !== DataSourceStatus.Loaded;
            const { searchText, widgetRect, isSearchBoxVisible, showLoading } = this.state;
            const listWidth = (widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.width) || 620;
            const { theme, config, appMode } = this.props;
            const toolLineClassName = listWidth < 360 ? 'ds-tools-line-blue' : '';
            const placeholder = (config === null || config === void 0 ? void 0 : config.searchHint) || this.formatMessage('search');
            const isShowBackButton = listWidth < 360 && isSearchBoxVisible;
            return (jsx("div", { className: 'list-search-div flex-grow-1', css: getSearchToolStyle(this.props) }, listUtils.showSearch(this.props) && (jsx("div", { className: 'd-flex search-box-content' },
                (listWidth >= 360 || isSearchBoxVisible) && (jsx("div", { className: 'flex-grow-1 w-100' },
                    jsx(SearchBox, { theme: theme, placeholder: placeholder, searchText: searchText, onSearchTextChange: this.handleSearchTextChange, onSubmit: this.handleSearchSubmit, disabled: toolsDisabled, searchSuggestion: this.state.searchSuggestion, suggestionWidth: listWidth, showLoading: showLoading, formatMessage: this.formatMessage, isShowBackButton: isShowBackButton, toggleSearchBoxVisible: this.toggleSearchBoxVisible, className: 'list-search ', appMode: appMode }),
                    jsx("div", { className: classNames('ds-tools-line', toolLineClassName) }))),
                listWidth < 360 && !isSearchBoxVisible && (jsx(Button, { type: 'tertiary', icon: true, size: 'sm', onClick: evt => {
                        this.toggleSearchBoxVisible(true);
                    }, title: this.formatMessage('search') },
                    jsx(SearchOutlined, { size: 16, color: theme.colors.palette.light[800] })))))));
        };
        this.toggleSearchBoxVisible = (isVisible = false) => {
            const { widgetRect } = this.state;
            this.setState({
                isSearchBoxVisible: isVisible
            });
            const LIST_TOOL_MIN_SIZE = listUtils.checkIsShowDataAction(this.props) ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION;
            const listWidth = (widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.width) || 620;
            if (listWidth < LIST_TOOL_MIN_SIZE) {
                clearTimeout(this.showPopperTimeOut);
                this.showPopperTimeOut = setTimeout(() => {
                    this.setState({
                        isOpenTopToolsPopper: true
                    });
                });
            }
        };
        this.getPageSize = () => {
            const { widgetRect } = this.state;
            const { config } = this.props;
            const showBottomTool = listUtils.showBottomTools(this.props, this.state);
            const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool);
            const showTopTools = listUtils.showTopTools(this.props);
            const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools) || 1;
            const columnCount = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemColumnCount() : null;
            const recordSizePerPage = Math.max(listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount), 1);
            return recordSizePerPage;
        };
        this.renderTopRightTools = (ds, queryStatus) => {
            const { sortOptionName, showSelectionOnly, currentFilter, filterApplied } = this.state;
            const { config, theme, id, appMode } = this.props;
            const sortItems = this.getSortItems();
            const selectedRecords = ds && ds.getSelectedRecords();
            const hasSelection = selectedRecords && selectedRecords.length > 0;
            return (jsx("div", { className: 'd-flex align-items-center mr-1', ref: this.listTopRightToolsDiv },
                listUtils.showSort(this.props) && (jsx(Fragment, null,
                    jsx(MyDropDown, { theme: theme, items: sortItems, appMode: appMode, toggleType: 'tertiary', toggleArrow: true, toggleContent: theme => sortOptionName || (sortItems && sortItems[0].label), size: 'sm', caret: true, showActive: true, toggleTitle: this.formatMessage('listSort'), activeLabel: sortOptionName || (sortItems && sortItems[0].label) }))),
                listUtils.showFilter(this.props) && (jsx(FilterPicker, { filter: currentFilter || config.filter, filterInConfig: config.filter, appMode: appMode, applied: filterApplied, title: this.formatMessage('filter'), selectedDs: this.state.datasource, handleFilterChange: this.handleFilterChange, handleFilterApplyChange: this.handleFilterApplyChange, formatMessage: this.formatMessage, theme: theme, widgetId: id })),
                listUtils.showDisplaySelectedOnly(this.props) && (jsx(Button, { disabled: !hasSelection, type: 'tertiary', title: showSelectionOnly
                        ? this.formatMessage('showAll')
                        : this.formatMessage('showSelection'), icon: true, size: 'sm', onClick: this.handleShowSelectionClick }, showSelectionOnly ? jsx(MenuOutlined, { size: 16 }) : jsx(ShowSelectionOutlined, { size: 16 }))),
                listUtils.showClearSelected(this.props) && (jsx(Button, { disabled: !hasSelection, type: 'tertiary', title: this.formatMessage('clearSelection'), icon: true, size: 'sm', onClick: this.handleClearSelectionClick },
                    jsx(TrashCheckOutlined, { size: 16 })))));
        };
        this.renderList = (ds, dsInfo) => {
            const { widgetRect, isMount, currentCardSize } = this.state;
            const { config, isRTL } = this.props;
            const queryStatus = dsInfo === null || dsInfo === void 0 ? void 0 : dsInfo.status;
            this.queryStatus = queryStatus;
            this.isHasRenderList = true;
            if (!isMount) {
                return false;
            }
            //get total count
            if (queryStatus === DataSourceStatus.Unloaded) {
                ds = undefined;
            }
            this.getDsTotalCount(ds, queryStatus);
            //get loading status
            const showLoading = this.getLoadingStatus(ds, queryStatus);
            const interval = (ds === null || ds === void 0 ? void 0 : ds.getAutoRefreshInterval()) || 0;
            //toggle auto refresh loading status
            this.toggleAutoRefreshLoading(ds, showLoading);
            //get list tool`s show status
            const showBottomTool = listUtils.showBottomTools(this.props, this.state);
            const showTopTools = listUtils.showTopTools(this.props);
            //get list bottom tool`s height
            const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool);
            //get list size
            const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools) || 1;
            const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE;
            const overscanCount = this.getOverscanCount(listHeight);
            // get new records
            const selectRecords = this.getDsSelectRecords(ds);
            const records = this.getDsRecords(ds, showLoading, listHeight);
            this.isFirstLoad = false;
            // when record.length == 0, should reset show selection button status in list top tools
            if (records.length === 0) {
                // this.scrollToIndex(0, 'start');
                this.resetShowSelectionStatus();
            }
            this.getlistInnerElementType();
            const listStyles = this.getListStyle();
            return (jsx("div", { "data-testid": 'listContainer', className: 'list-container animation', css: listStyles },
                showTopTools && this.renderListTopTools(ds, queryStatus, selectRecords),
                ((config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID) &&
                    jsx(Grid, { className: classNames('widget-list-list', { 'hide-list': !records || (records === null || records === void 0 ? void 0 : records.length) === 0 }), ref: this.listRef, useIsScrolling: true, outerRef: this.setListOutDivRef, direction: isRTL ? 'rtl' : 'ltr', itemCount: this.records.length, overscanCount: overscanCount, itemKey: this.gridItemIndex, columnCount: this.getItemColumnCount(), columnWidth: index => this.columnWidth(index, currentCardSize.width, config === null || config === void 0 ? void 0 : config.horizontalSpace), rowCount: this.getItemRowCount(), rowHeight: index => this.rowHeight(index, currentCardSize.height, config === null || config === void 0 ? void 0 : config.verticalSpace), width: listWidth, height: listHeight, onItemsRendered: this.onItemsRendered, itemData: this.getItemsByRecords(this.records), innerElementType: this.innerElementType, onScroll: this.handleListScroll }, this.itemRender),
                ((config === null || config === void 0 ? void 0 : config.layoutType) !== ListLayoutType.GRID) && jsx(List, { className: classNames('widget-list-list', { 'hide-list': !records || (records === null || records === void 0 ? void 0 : records.length) === 0 }), ref: this.listRef, useIsScrolling: true, outerRef: this.setListOutDivRef, direction: isRTL ? 'rtl' : 'ltr', layout: config.layoutType === ListLayoutType.Column
                        ? 'horizontal'
                        : 'vertical', itemCount: this.records.length, overscanCount: overscanCount, itemKey: this.itemKey, width: listWidth, height: listHeight, onItemsRendered: this.onItemsRendered, itemData: this.getItemsByRecords(this.records), innerElementType: this.innerElementType, itemSize: this.itemSize, onScroll: this.handleListScroll }, this.itemRender),
                this.checkIsShowListMask(showLoading, records) && (jsx("div", { className: 'editing-mask-con' },
                    jsx("div", { className: 'editing-mask-list' }),
                    (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID && jsx("div", { className: 'editing-mask-list-grid' }))),
                showBottomTool && this.renderBottomTools(showLoading),
                this.renderEmptyElement(showLoading),
                queryStatus === DataSourceStatus.NotReady && this.renderNotReadyTips(ds),
                (showLoading || interval > 0) && this.renderLoading(showLoading, interval)));
        };
        this.renderEmptyElement = (showLoading) => {
            var _a;
            const isNoData = !this.records || this.records.length < 1;
            const noDataMessage = ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.noDataMessage) || this.formatMessage('noData');
            // const isShowClearActionButton = isNoData && this.isHasPublishMessageAction
            return (!showLoading && isNoData) && (jsx("div", { className: 'empty-con text-center' },
                jsx(WarningOutlined, { size: 16 }),
                jsx("div", { className: "discribtion" }, noDataMessage)));
        };
        this.clearMessageAction = () => {
            this.handleClearSelectionClick();
            MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, []));
        };
        this.renderLoading = (showLoading, interval) => {
            const { autoRefreshLoadingString } = this.state;
            const { config } = this.props;
            let isShowAutoRefresh = config === null || config === void 0 ? void 0 : config.isShowAutoRefresh;
            if (typeof (isShowAutoRefresh) !== 'boolean') {
                isShowAutoRefresh = true;
            }
            return (jsx("div", { className: classNames('position-absolute refresh-loading-con d-flex align-items-center', this.getRefreshLoadingClass()) },
                showLoading && jsx("div", { className: 'loading-con' }),
                (interval > 0 && isShowAutoRefresh) && (jsx("div", { className: 'flex-grow-1 auto-refresh-loading' }, autoRefreshLoadingString))));
        };
        this.renderNotReadyTips = (ds) => {
            var _a, _b, _c, _d, _e;
            const dataSourceLabel = ds === null || ds === void 0 ? void 0 : ds.getLabel();
            const outputDsWidgetId = appConfigUtils === null || appConfigUtils === void 0 ? void 0 : appConfigUtils.getWidgetIdByOutputDataSource((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.useDataSources) === null || _b === void 0 ? void 0 : _b[0]);
            const appConfig = (_c = getAppStore().getState()) === null || _c === void 0 ? void 0 : _c.appConfig;
            const widgetLabel = (_e = (_d = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _d === void 0 ? void 0 : _d[outputDsWidgetId]) === null || _e === void 0 ? void 0 : _e.label;
            return (jsx("div", { className: 'placeholder-alert-con' },
                jsx(Alert, { form: 'tooltip', size: 'small', type: 'warning', text: this.formatMessage('outputDataIsNotGenerated', { outputDsLabel: dataSourceLabel, sourceWidgetName: widgetLabel }) })));
        };
        this.renderBottomTools = (showLoading) => {
            const { scrollStatus, isScrollEnd } = this.state;
            const { config, isRTL } = this.props;
            return (jsx("div", { ref: this.paginatorDiv },
                jsx(ListBottomTools, { isRTL: isRTL, totalPage: this.getTotalPage(), currentPage: this._getCurrentPage(), isEditing: this.isEditing(), isScrollEnd: isScrollEnd, pageStyle: config.pageStyle, layoutType: config === null || config === void 0 ? void 0 : config.layoutType, scrollStatus: scrollStatus, handleScrollUp: this.handleScrollUp, handleScrollDown: this.handleScrollDown, handleSwitchPage: this.handleSwitchPage, formatMessage: this.formatMessage, showLoading: showLoading })));
        };
        this.getDsTotalCount = (ds, queryStatus) => {
            const count = ds === null || ds === void 0 ? void 0 : ds.count;
            this.queryStatus = queryStatus;
            // total count
            if (queryStatus === DataSourceStatus.Loaded && count !== null) {
                if (this.totalCount !== count) {
                    this.setPageTimeout = setTimeout(() => {
                        this.setState({
                            page: 1
                        });
                    }, 1);
                }
                this.totalCount = count;
            }
        };
        this.getLoadingStatus = (ds, queryStatus) => {
            const { LayoutEntry } = this.state;
            const { showLoading: mustLoading } = this.props;
            // loading
            let showLoading = false;
            if (mustLoading ||
                (window.jimuConfig.isInBuilder && !LayoutEntry) ||
                (ds && queryStatus === DataSourceStatus.Loading)) {
                showLoading = true;
            }
            return showLoading;
        };
        this.toggleAutoRefreshLoading = (ds, showLoading) => {
            const interval = (ds === null || ds === void 0 ? void 0 : ds.getAutoRefreshInterval()) || 0;
            this.resetAutoRefreshTimes(interval, showLoading);
            if (interval > 0) {
                this.setRefreshLoadingString(showLoading);
            }
        };
        this.setListOutDivRef = current => {
            if (!current)
                return;
            const bottomBoundaryId = `bottomBoundary${this.props.id}`;
            this.listOutDivRef = current;
            this.setListDivSize();
            const bottomBoundary = document.createElement('div');
            bottomBoundary.id = bottomBoundaryId;
            bottomBoundary.className = 'bottom-boundary';
            const listScrollContent = this.listOutDivRef.getElementsByTagName('div')[0];
            this.setScrollContentSize();
            listScrollContent.appendChild(bottomBoundary);
            listUtils.intersectionObserver(document.getElementById(bottomBoundaryId), this.listOutDivRef, this.intersectionObserverCallback);
        };
        this.getDsRecords = (ds, showLoading, listHeight) => {
            const { showSelectionOnly, widgetRect } = this.state;
            const { config, appMode } = this.props;
            const columnCount = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemColumnCount() : null;
            const recordSizePerPage = listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount);
            const defaultRecords = this.getDefaultRecords(recordSizePerPage);
            // get new records
            let records = defaultRecords;
            const selectRecords = this.getDsSelectRecords(ds);
            if (ds && config.isItemStyleConfirm) {
                const isSelectionView = (ds === null || ds === void 0 ? void 0 : ds.dataViewId) === SELECTION_DATA_VIEW_ID;
                if (isSelectionView) {
                    records =
                        (ds &&
                            (config.pageStyle === PageStyle.Scroll
                                ? ds.getRecordsByPage(1, recordSizePerPage * this.state.page)
                                : ds.getRecordsByPage(this.state.page, recordSizePerPage))) ||
                            [];
                }
                else {
                    records =
                        (ds &&
                            (config.pageStyle === PageStyle.Scroll
                                ? ds.getRecordsByPageWithSelection(1, recordSizePerPage * this.state.page)
                                : ds.getRecordsByPageWithSelection(this.state.page, recordSizePerPage))) ||
                            [];
                }
                if (showSelectionOnly) {
                    records = selectRecords;
                }
            }
            if (window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                !showLoading &&
                records.length < 1) {
                records = defaultRecords;
            }
            if (!showLoading || this.isFirstLoad) {
                // this.resetListAfterRecordChange(records)
                this.records = records;
            }
            return records;
        };
        this.resetGridListAfterRowIndex = (newRecords) => {
            var _a, _b, _c, _d, _e;
            if ((this === null || this === void 0 ? void 0 : this.records) && (((_a = this.records) === null || _a === void 0 ? void 0 : _a.length) !== (newRecords === null || newRecords === void 0 ? void 0 : newRecords.length))) {
                let preRowNumber = this.getItemRowCount() - 1;
                preRowNumber = preRowNumber > -1 ? preRowNumber : 0;
                ((_c = (_b = this.listRef) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.resetAfterIndices) && ((_e = (_d = this.listRef) === null || _d === void 0 ? void 0 : _d.current) === null || _e === void 0 ? void 0 : _e.resetAfterRowIndex(preRowNumber, true));
            }
        };
        this.resetListAfterRecordChange = (newRecords) => {
            var _a, _b, _c, _d, _e, _f;
            //When loading again, the same records are not necessarily the same index.
            //For example, when the extent of the map changes, the record of the list changes. The original first record may
            //change to the fifth of the new records, so all can only be reset. A list guarantees an update to the list size
            if ((this === null || this === void 0 ? void 0 : this.records) && (((_a = this.records) === null || _a === void 0 ? void 0 : _a.length) !== (newRecords === null || newRecords === void 0 ? void 0 : newRecords.length))) {
                if (this.listRef.current) {
                    if (((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.layoutType) === ListLayoutType.GRID) {
                        //VariableSizeGrid caches offsets and measurements for each item for performance purposes.
                        //This method clears that cached data for all items after (and including) the specified indices. It should be called whenever an items size changes.
                        //https://react-window.vercel.app/#/api/VariableSizeGrid
                        // this.resetGridListAfterRowIndex(newRecords)
                        ((_d = (_c = this.listRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.resetAfterIndices) && ((_f = (_e = this.listRef) === null || _e === void 0 ? void 0 : _e.current) === null || _f === void 0 ? void 0 : _f.resetAfterRowIndex(0, true));
                    }
                    else {
                        //VariableSizeList caches offsets and measurements for each index for performance purposes.
                        //This method clears that cached data for all items after (and including) the specified index. It should be called whenever a item's size changes.
                        // let restStartIndex = newRecords?.length - 1
                        // restStartIndex = restStartIndex < 0 ? 0 : restStartIndex
                        //
                        this.resetTimeout && clearTimeout(this.resetTimeout);
                        this.resetTimeout = setTimeout(() => {
                            var _a, _b, _c, _d;
                            ((_b = (_a = this.listRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.resetAfterIndex) && ((_d = (_c = this.listRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.resetAfterIndex(0, false));
                        }, 300);
                    }
                }
            }
        };
        this.getDefaultRecords = (pageSize = 3) => {
            pageSize = (pageSize && pageSize > 1) ? pageSize : 3;
            const defaultRecords = [];
            for (let i = 0; i < pageSize; i++) {
                defaultRecords.push(defaultRecordsItem);
            }
            return defaultRecords;
        };
        this.getDsSelectRecords = (ds) => {
            const { config } = this.props;
            // get select records
            let selectRecords;
            if (ds && config.isItemStyleConfirm) {
                selectRecords = ds.getSelectedRecords();
            }
            return selectRecords;
        };
        this.getlistInnerElementType = () => {
            const { config } = this.props;
            const space = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? config === null || config === void 0 ? void 0 : config.verticalSpace : config === null || config === void 0 ? void 0 : config.space;
            if (this.lastSpace !== space) {
                this.lastSpace = space;
                this.innerElementType = forwardRef((_a, ref) => {
                    var { style } = _a, rest = __rest(_a, ["style"]);
                    return (jsx("div", Object.assign({ ref: ref, style: Object.assign(Object.assign({}, style), { height: `${parseFloat(style.height) -
                                (config.layoutType === ListLayoutType.Column
                                    ? 0
                                    : space)}px`, width: `${parseFloat(style.width) -
                                (config.layoutType !== ListLayoutType.Column
                                    ? 0
                                    : space)}px` }) }, rest)));
                });
            }
        };
        this.getListStyle = () => {
            var _a, _b;
            const { toolsDivWidth, currentCardSize, widgetRect } = this.state;
            const { config, appMode, theme, isHeightAuto, isWidthAuto } = this.props;
            const showBottomTool = listUtils.showBottomTools(this.props, this.state);
            const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool);
            const showTopTools = listUtils.showTopTools(this.props);
            const listTemplateDefaultCardSize = listUtils.getCardSizeNumberInConfig(this.props, widgetRect);
            const listStyleOption = {
                pageStyle: config === null || config === void 0 ? void 0 : config.pageStyle,
                scrollBarOpen: config === null || config === void 0 ? void 0 : config.scrollBarOpen,
                direction: config === null || config === void 0 ? void 0 : config.direction,
                appMode: appMode,
                theme: theme,
                isHeightAuto: isHeightAuto,
                isWidthAuto: isWidthAuto,
                currentCardSize: currentCardSize,
                listTemplateDefaultCardSize: listTemplateDefaultCardSize,
                showTopTools: showTopTools,
                bottomToolH: bottomToolH,
                topRightToolW: toolsDivWidth,
                hasRecords: ((_b = (_a = this.records) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0,
                mexSize: this.getListMaxSize(),
                layoutType: config === null || config === void 0 ? void 0 : config.layoutType,
                listLeftPadding: this.getListContentLeftPadding()
            };
            return listStyle(listStyleOption);
        };
        this.checkIsShowListMask = (showLoading, records) => {
            const { isInBuilder } = window.jimuConfig;
            const isEditing = this.isEditing();
            const isNoData = !records || records.length < 1;
            const isDataLoadedAndHasData = !(!showLoading && isNoData);
            return isInBuilder && isEditing && isDataLoadedAndHasData;
        };
        this.getOverscanCount = (listHeight) => {
            const { widgetRect } = this.state;
            const { appMode, config } = this.props;
            const columnCount = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemColumnCount() : null;
            const recordSizePerPage = listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount);
            const overscanCount = window.jimuConfig.isInBuilder && appMode !== AppMode.Run
                ? 0
                : recordSizePerPage;
            return overscanCount;
        };
        this.setScrollContentSize = () => {
            var _a;
            if (!this.listOutDivRef)
                return;
            const { layoutType } = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config;
            const listScrollContent = this.listOutDivRef.getElementsByTagName('div')[0];
            if (layoutType === ListLayoutType.Column) {
                listScrollContent.style.height = '100%';
            }
            else {
                listScrollContent.style.width = '100%';
            }
        };
        this.intersectionObserverCallback = (isScrollEnd) => {
            var _a, _b;
            const { appMode, config } = this.props;
            const listDiv = this.listOutDivRef;
            const { datasource } = this.state;
            this.setState({
                isScrollEnd: isScrollEnd
            });
            if (!listDiv || ((_b = (_a = this.records) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1)
                return;
            if (config.pageStyle === PageStyle.Scroll &&
                this.queryStatus !== DataSourceStatus.Loading &&
                datasource &&
                (!window.jimuConfig.isInBuilder ||
                    (appMode === AppMode.Run && isScrollEnd)) &&
                this.isHasScrolled) {
                if (this.records.length < this.getTotalCount()) {
                    this.setState({
                        page: this.state.page + 1
                    });
                    this.isSwitchPage = true;
                }
                else {
                    if (isScrollEnd) {
                        this.setState({
                            scrollStatus: 'end'
                        });
                    }
                }
            }
        };
        this.setListDivSize = () => {
            var _a;
            const listDiv = this.listOutDivRef;
            const clientWidth = (listDiv === null || listDiv === void 0 ? void 0 : listDiv.clientWidth) || null;
            const clientHeight = (listDiv === null || listDiv === void 0 ? void 0 : listDiv.clientHeight) || null;
            const toolsDivWidth = ((_a = this.listTopRightToolsDiv.current) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
            const listDivBoundRect = (listDiv === null || listDiv === void 0 ? void 0 : listDiv.getBoundingClientRect()) || null;
            const listDivSize = {
                clientWidth: clientWidth,
                clientHeight: clientHeight
            };
            this.setState({
                listDivSize: listDivSize,
                toolsDivWidth: toolsDivWidth,
                listDivBoundRect: listDivBoundRect
            });
        };
        this.getContentLayout = () => {
            const { layoutId, browserSizeMode } = this.props;
            const appConfig = getAppStore().getState().appConfig;
            const contentWidgetId = searchUtils.getWidgetIdThatUseTheLayoutId(appConfig, layoutId);
            const contentLayoutsInfo = searchUtils.getContentLayoutInfosInOneSizeMode(appConfig, contentWidgetId, LayoutItemType.Widget, browserSizeMode);
            return contentLayoutsInfo;
        };
        this.getContentLayoutSetting = () => {
            var _a, _b, _c, _d, _e;
            const appConfig = getAppStore().getState().appConfig;
            const { layouts } = appConfig;
            const contentLayoutsInfo = this.getContentLayout();
            const contentLayoutId = (_a = contentLayoutsInfo === null || contentLayoutsInfo === void 0 ? void 0 : contentLayoutsInfo[0]) === null || _a === void 0 ? void 0 : _a.layoutId;
            const contentLayoutItemId = (_b = contentLayoutsInfo === null || contentLayoutsInfo === void 0 ? void 0 : contentLayoutsInfo[0]) === null || _b === void 0 ? void 0 : _b.layoutItemId;
            const setting = (_e = (_d = (_c = layouts === null || layouts === void 0 ? void 0 : layouts[contentLayoutId]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d[contentLayoutItemId]) === null || _e === void 0 ? void 0 : _e.setting;
            return setting;
        };
        this.getListMaxSize = () => {
            var _a, _b, _c, _d, _e;
            const { boundingBox, heightLayoutItemSizeModes, layoutId, appMode, pageMode } = this.props;
            const isListHeightCustom = heightLayoutItemSizeModes === LayoutItemSizeModes.Custom && (boundingBox === null || boundingBox === void 0 ? void 0 : boundingBox.height);
            const setting = this.getContentLayoutSetting();
            const isContentWidthAuto = ((_a = setting === null || setting === void 0 ? void 0 : setting.autoProps) === null || _a === void 0 ? void 0 : _a.width) === 'auto' || (setting === null || setting === void 0 ? void 0 : setting.widthMode) === 'auto';
            const isContentHeightAuto = ((_b = setting === null || setting === void 0 ? void 0 : setting.autoProps) === null || _b === void 0 ? void 0 : _b.height) === 'auto' || (setting === null || setting === void 0 ? void 0 : setting.heightMode) === 'auto' || !setting;
            // const isUse600 = (pageMode === PageMode.AutoScroll && (isContentHeightAuto || !setting?.autoProps?.width))
            const DESIGN_SIZE = (pageMode === PageMode.AutoScroll && isContentHeightAuto) ? 600 : this.bodySize.clientHeight;
            const bodyHeight = appMode === AppMode.Design ? DESIGN_SIZE : this.bodySize.clientHeight;
            const maxheight = isListHeightCustom ? boundingBox === null || boundingBox === void 0 ? void 0 : boundingBox.height : bodyHeight;
            const isListHeightCustomUnitPX = isListHeightCustom && !(((_c = boundingBox === null || boundingBox === void 0 ? void 0 : boundingBox.height) === null || _c === void 0 ? void 0 : _c.includes) && ((_d = boundingBox === null || boundingBox === void 0 ? void 0 : boundingBox.height) === null || _d === void 0 ? void 0 : _d.includes('%')));
            let maxSize = Immutable({
                maxWidth: this.bodySize.scrollWidth,
                maxHeight: maxheight
            });
            const appConfig = getAppStore().getState().appConfig;
            const { layouts } = appConfig;
            const type = (_e = layouts[layoutId]) === null || _e === void 0 ? void 0 : _e.type;
            if (type === LayoutType.ColumnLayout && isContentWidthAuto) {
                maxSize = maxSize.set('maxWidth', this.bodySize.clientWidth);
            }
            if (type === 'ROW' && isContentHeightAuto && !isListHeightCustomUnitPX) {
                const maxHeight = appMode === AppMode.Design ? DESIGN_SIZE : this.bodySize.clientHeight;
                maxSize = maxSize.set('maxHeight', maxHeight);
            }
            maxSize = maxSize.set('maxHeight', this.initElementSize(maxSize.maxHeight));
            maxSize = maxSize.set('maxWidth', this.initElementSize(maxSize.maxWidth));
            return maxSize;
        };
        this.initElementSize = (size) => {
            if (Number(size)) {
                return `${size}px`;
            }
            else if (typeof (size) === 'string') {
                if ((size === null || size === void 0 ? void 0 : size.includes('px')) || (size === null || size === void 0 ? void 0 : size.includes('rem'))) {
                    return size;
                }
                else if (size === null || size === void 0 ? void 0 : size.includes('%')) {
                    return '100%';
                }
            }
            else {
                return size;
            }
        };
        this.getRefreshLoadingClass = () => {
            const { config, appMode } = this.props;
            const { scrollBarOpen, layoutType } = config;
            const isEditor = window.jimuConfig.isInBuilder && appMode === AppMode.Design;
            if (!scrollBarOpen || isEditor) {
                return '';
            }
            if (layoutType === ListLayoutType.Column) {
                return 'horizon-loading';
            }
            else {
                return 'vertical-loading';
            }
        };
        this.resetAutoRefreshTimes = (interval, showLoading = false) => {
            clearTimeout(this.resetAutoRefreshTime);
            if (interval <= 0) {
                clearInterval(this.autoRefreshLoadingTime);
            }
            this.resetAutoRefreshTime = setTimeout(() => {
                if (showLoading && interval > 0) {
                    this.setState({
                        autoRefreshLoadingString: this.formatMessage('lastUpdateAFewTime')
                    });
                }
                this.setState({
                    showLoading: showLoading
                });
            }, 0);
        };
        this.setRefreshLoadingString = (showLoading = false) => {
            if (!showLoading) {
                return false;
            }
            let time = 0;
            clearInterval(this.autoRefreshLoadingTime);
            this.autoRefreshLoadingTime = setInterval(() => {
                time++;
                this.setState({
                    autoRefreshLoadingString: this.getLoadingString(time)
                });
            }, 60000);
        };
        this.getLoadingString = (time) => {
            let loadingString = this.formatMessage('lastUpdateAFewTime');
            if (time > 1 && time <= 2) {
                loadingString = this.formatMessage('lastUpdateAMinute');
            }
            else if (time > 2) {
                loadingString = this.formatMessage('lastUpdateTime', { updateTime: time });
            }
            return loadingString;
        };
        this.onItemsRendered = ({ overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex, visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex }) => {
            const { config } = this.props;
            // All index params are numbers.
            this.listVisibleStartIndex = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(visibleRowStartIndex, visibleColumnStartIndex) : visibleStartIndex;
            this.listVisibleStopIndex = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(visibleRowStopIndex, visibleColumnStopIndex) : visibleStopIndex;
            if (this.needRefreshListOnListRendered) {
                this.needRefreshListOnListRendered = false;
                this.refreshList();
            }
            if (this.isSwitchPage) {
                if (config.pageStyle === PageStyle.Scroll) {
                    if (this.records.length > this.listVisibleStopIndex + 1) {
                        this.isSwitchPage = false;
                        this.onItemsRenderedTimeout = setTimeout(() => {
                            this.handleScrollDown(null);
                        }, 500);
                    }
                }
                else {
                    this.isSwitchPage = false;
                }
            }
        };
        this.getItemIndexByRowAndColumnIndex = (rowIndex, columnIndex) => {
            const columnCount = this.getItemColumnCount();
            return rowIndex * columnCount + columnIndex;
        };
        this.itemSize = index => {
            const { config } = this.props;
            const { currentCardSize } = this.state;
            const isHorizon = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Column;
            const space = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? config === null || config === void 0 ? void 0 : config.verticalSpace : config === null || config === void 0 ? void 0 : config.space;
            const itemWidth = currentCardSize.width + space;
            const itemHeight = currentCardSize.height + space;
            const size = isHorizon ? itemWidth : itemHeight;
            return size;
        };
        this.columnWidth = (index, cardWidth, space = 0) => {
            return cardWidth + space;
        };
        this.rowHeight = (rowIndex, cardHeight, space = 0) => {
            return cardHeight + space;
        };
        this.getItemsByRecords = records => {
            const { config, selectionIsInSelf, selectionIsSelf, builderStatus, appMode, queryObject, useDataSources } = this.props;
            const { datasource, hoverIndex } = this.state;
            const selectedRecordIds = (!datasource || !config.isItemStyleConfirm
                ? []
                : datasource.getSelectedRecordIds()).map(v => v + '');
            return (records &&
                records.map((record, index) => {
                    const isEditor = index === 0 &&
                        window.jimuConfig.isInBuilder &&
                        appMode === AppMode.Design;
                    const editProps = isEditor
                        ? {
                            hideCardTool: this.state.hideCardTool,
                            selectionIsList: selectionIsSelf,
                            selectionIsInList: selectionIsInSelf,
                            isEditing: this.isEditing(),
                            builderStatus: builderStatus,
                            lockItemRatio: config.lockItemRatio,
                            changeIsResizingCard: this.changeIsResizingCard
                        }
                        : {
                            linkParam: config.linkParam,
                            queryObject: queryObject,
                            useDataSources
                        };
                    return Object.assign(Object.assign({ index, isHover: hoverIndex === index, record: config.isItemStyleConfirm ? record : undefined, active: !record.fake &&
                            config.isItemStyleConfirm &&
                            datasource &&
                            selectedRecordIds.includes(record.getId()) }, this.getOtherProps()), editProps);
                }));
        };
        this.getOtherProps = () => {
            var _a, _b;
            const { config, theme, id, appMode, builderSupportModules, layouts, browserSizeMode, dispatch, isRTL } = this.props;
            const { datasource } = this.state;
            const isWidthPercentage = ((_b = (_a = listUtils.getCardSizeWidthUnitInConfig(this.props)) === null || _a === void 0 ? void 0 : _a.width) === null || _b === void 0 ? void 0 : _b.unit) === DistanceUnits.PERCENTAGE;
            return {
                browserSizeMode: browserSizeMode,
                space: config.space,
                isRTL: isRTL,
                builderSupportModules: builderSupportModules,
                formatMessage: this.formatMessage,
                dispatch: dispatch,
                widgetId: id,
                interact: window.jimuConfig.isInBuilder &&
                    builderSupportModules.widgetModules.interact,
                selectCard: this.selectCard,
                handleResizeCard: this.handleResizeCard,
                appMode: appMode,
                onChange: this.handleItemChange,
                hoverLayoutOpen: config.cardConfigs[Status.Hover].enable,
                selectable: config.cardConfigs[Status.Selected].selectionMode !==
                    SelectionModeType.None,
                direction: config.direction,
                theme: theme,
                LayoutEntry: this.state.LayoutEntry,
                layouts: layouts,
                layoutType: config === null || config === void 0 ? void 0 : config.layoutType,
                keepAspectRatio: config === null || config === void 0 ? void 0 : config.keepAspectRatio,
                gridItemSizeRatio: config === null || config === void 0 ? void 0 : config.gridItemSizeRatio,
                cardConfigs: config.cardConfigs,
                datasourceId: datasource && datasource.id,
                updateCardToolPosition: this.updateCardToolPosition,
                isWidthPercentage: isWidthPercentage,
                horizontalSpace: config === null || config === void 0 ? void 0 : config.horizontalSpace
            };
        };
        this.itemRender = props => {
            var _a;
            const { appMode, config } = this.props;
            let style = props.style;
            const columnIndex = (props === null || props === void 0 ? void 0 : props.columnIndex) || 0;
            const rowIndex = (props === null || props === void 0 ? void 0 : props.rowIndex) || 0;
            const rowCount = this.getItemRowCount();
            const columnCount = this.getItemColumnCount();
            const index = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(rowIndex, columnIndex) : props.index;
            const items = props.data;
            const recordLength = ((_a = this.records) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const isLastItem = recordLength - 1 === index;
            let listItemStyle;
            switch (config === null || config === void 0 ? void 0 : config.layoutType) {
                case ListLayoutType.Column:
                    listItemStyle = {
                        width: `${parseFloat(style.width) - config.space}px`,
                        height: '100%'
                    };
                    break;
                case ListLayoutType.Row:
                    listItemStyle = {
                        width: '100%',
                        height: `${parseFloat(style.height) - config.space}px`
                    };
                    break;
                case ListLayoutType.GRID:
                    listItemStyle = {
                        height: `${parseFloat(style.height) - (config === null || config === void 0 ? void 0 : config.verticalSpace)}px`,
                        width: `${parseFloat(style === null || style === void 0 ? void 0 : style.width) - (config === null || config === void 0 ? void 0 : config.horizontalSpace)}px`
                    };
                    break;
            }
            //The size of list item content
            switch (config === null || config === void 0 ? void 0 : config.layoutType) {
                case ListLayoutType.Column:
                    style = Object.assign(Object.assign({}, style), { width: isLastItem ? `${parseFloat(style.width) - config.space}px` : `${parseFloat(style.width)}px` });
                    break;
                case ListLayoutType.Row:
                    style = Object.assign(Object.assign({}, style), { height: isLastItem ? `${parseFloat(style.height) - config.space}px` : `${parseFloat(style.height)}px` });
                    break;
                case ListLayoutType.GRID:
                    style = Object.assign(Object.assign({}, style), { height: rowCount === (rowIndex + 1) ? `${parseFloat(style.height) - (config === null || config === void 0 ? void 0 : config.verticalSpace)}px` : `${parseFloat(style.height)}px`, width: columnCount === (columnIndex + 1) ? `${parseFloat(style === null || style === void 0 ? void 0 : style.width) - (config === null || config === void 0 ? void 0 : config.horizontalSpace)}px` : `${parseFloat(style === null || style === void 0 ? void 0 : style.width)}px` });
                    break;
            }
            const isEditor = index === 0 && window.jimuConfig.isInBuilder && appMode === AppMode.Design;
            const ListCard = isEditor ? ListCardEditor : ListCardViewer;
            if ((items === null || items === void 0 ? void 0 : items.length) < index + 1)
                return null;
            return (jsx("div", { style: style },
                jsx(ListCard, Object.assign({ listStyle: listItemStyle, widgetId: this.props.id }, items[index], { handleListMouseMove: this.handleListMouseMove, handleListMouseLeave: this.handleListMouseLeave, itemIdex: index }))));
        };
        this.itemKey = index => {
            const item = this.records[index];
            return `${((item === null || item === void 0 ? void 0 : item.getId) && (item === null || item === void 0 ? void 0 : item.getId())) || index}`;
        };
        this.gridItemIndex = indexOption => {
            const { columnIndex, rowIndex } = indexOption;
            const index = this.getItemIndexByRowAndColumnIndex(rowIndex, columnIndex);
            const item = this.records[index];
            return `${((item === null || item === void 0 ? void 0 : item.getId) && (item === null || item === void 0 ? void 0 : item.getId())) || index + 100}`;
        };
        this.getItemColumnCount = () => {
            const { widgetRect, currentCardSize } = this.state;
            const { config } = this.props;
            let listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE;
            listWidth = listWidth - SCROLL_BAR_WIDTH;
            const cardWidth = currentCardSize.width + (config === null || config === void 0 ? void 0 : config.horizontalSpace);
            //The actual width of the last column is currentCardSize.width
            //'listWidth-4' is for the width of the scroll bar
            //The space in the last column should be removed
            return Math.floor((listWidth - currentCardSize.width) / cardWidth + 1) || 1;
            // return Math.floor((listWidth + config?.horizontalSpace) / (currentCardSize.width + config?.horizontalSpace)) || 1
        };
        this.getItemRowCount = () => {
            return Math.ceil(this.records.length / this.getItemColumnCount()) || 1;
        };
        this.getListContentLeftPadding = () => {
            const { widgetRect, currentCardSize } = this.state;
            const { config } = this.props;
            const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE;
            const rowWidth = this.getItemColumnCount() * (currentCardSize.width + (config === null || config === void 0 ? void 0 : config.horizontalSpace)) - (config === null || config === void 0 ? void 0 : config.horizontalSpace);
            let padding;
            switch (config === null || config === void 0 ? void 0 : config.gridAlignment) {
                case TextAlignValue.LEFT:
                    padding = 0;
                    break;
                case TextAlignValue.RIGHT:
                    padding = listWidth - rowWidth - SCROLL_BAR_WIDTH;
                    break;
                default:
                    padding = (listWidth - rowWidth - SCROLL_BAR_WIDTH) / 2;
                    break;
            }
            if ((config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID) {
                return padding > 0 ? padding : 0;
            }
            else {
                return 0;
            }
        };
        const { config } = props;
        this.paginatorDiv = React.createRef();
        this.listTopRightToolsDiv = React.createRef();
        const stateObj = {
            LayoutEntry: null,
            page: 1,
            sortOptionName: config.sorts && config.sorts[0] && config.sorts[0].ruleOptionName,
            currentCardSize: listUtils.getCardSizeNumberInConfig(props, listUtils.getDefaultMinListSize(props)),
            forceShowMask: false,
            widgetRect: listUtils.getDefaultMinListSize(props),
            showList: true,
            searchText: '',
            currentFilter: undefined,
            filterApplied: false,
            showSelectionOnly: false,
            hideCardTool: false,
            scrollStatus: 'start',
            datasource: undefined,
            hoverIndex: -1,
            isScrolling: false,
            isScrollSpeedOver: false,
            isResizingCard: false,
            searchSuggestion: [],
            isSearchBoxVisible: false,
            isOpenTopToolsPopper: false,
            latestUpdateTime: 0,
            showLoading: false,
            autoRefreshLoadingString: '',
            listDivSize: {
                clientWidth: null,
                clientHeight: null
            },
            toolsDivWidth: null,
            listDivBoundRect: null,
            isScrollEnd: false,
            isMount: false
        };
        this.selectSelf = this.selectSelf.bind(this);
        this.handleResizeCard = this.handleResizeCard.bind(this);
        this.listRef = React.createRef();
        if (window.jimuConfig.isInBuilder) {
            stateObj.LayoutEntry = this.props.builderSupportModules.LayoutEntry;
        }
        else {
            stateObj.LayoutEntry = LayoutEntry;
        }
        this.state = stateObj;
        this.onResize = this.onResize.bind(this);
        this.changeIsResizingCard = this.changeIsResizingCard.bind(this);
        this.setRefreshLoadingString = this.setRefreshLoadingString.bind(this);
        this.resetAutoRefreshTimes = this.resetAutoRefreshTimes.bind(this);
        this.debounceOnResize = lodash.debounce((width, height) => this.onResize(width, height), 200);
        this.debounceResetAfterIndices = lodash.debounce(() => this.resetAfterIndices(), 200);
    }
    componentDidMount() {
        this.setState({
            isMount: true
        });
        this.getBodySize();
        window.addEventListener('resize', this.getBodySize);
        // const {outputDataSources, useDataSources} = this.props
        // if(this.records != defaultRecords){
        //   listUtils.createOutputDs(this.records, outputDataSources?.[0], useDataSources?.[0]);
        // }
    }
    componentWillUnmount() {
        clearTimeout(this.resizeTimeout);
        clearTimeout(this.updateCardToolTimeout);
        clearTimeout(this.mouseClickTimeout);
        clearTimeout(this.suggestionsQueryTimeout);
        clearTimeout(this.showPopperTimeOut);
        clearTimeout(this.resetAutoRefreshTime);
        clearTimeout(this.setPageTimeout);
        clearTimeout(this.onItemsRenderedTimeout);
        clearInterval(this.autoRefreshLoadingTime);
    }
    componentDidUpdate(preProps, preState) {
        var _a;
        const { config, appMode } = this.props;
        const { datasource } = this.state;
        if (!window.jimuConfig.isInBuilder || appMode === AppMode.Run) {
            const isOpenSelectionMode = config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None;
            // Listen selected records change from outside
            if (datasource && isOpenSelectionMode) {
                this.scrollToSelectedItems(datasource);
            }
        }
        // updade list in builder
        this.updateListInBuilder(preProps, preState);
        // listen appMode change
        this.appModeChange(preProps);
        if ((preProps === null || preProps === void 0 ? void 0 : preProps.selectionIsInSelf) !== ((_a = this.props) === null || _a === void 0 ? void 0 : _a.selectionIsInSelf)) {
            this.setSelectionStatus();
        }
        this.setListLayoutInWidgetState();
        this.setListParentSizeInWidgetState();
        // update output ds
        // if(this.records != defaultRecords){
        //   listUtils.createOutputDs(this.records, outputDataSources?.[0], useDataSources?.[0]);
        // }
    }
    changeIsResizingCard(isResizingCard) {
        this.setState({
            isResizingCard: isResizingCard
        });
    }
    handleResizeCard(newCardSize, resizeEnd = false, isTop, isLeft, isReplace = false) {
        if (resizeEnd) {
            const cardSize = this.initNewCardSize(newCardSize);
            window.jimuConfig.isInBuilder &&
                this.props.builderSupportModules.widgetModules.handleResizeCard(this.props, cardSize, isTop, isLeft, resizeEnd, isReplace);
        }
        else {
            this.setState({
                currentCardSize: newCardSize
            }, () => {
                this.refreshList(false);
            });
        }
    }
    selectSelf() {
        window.jimuConfig.isInBuilder &&
            this.props.builderSupportModules.widgetModules.selectSelf(this.props);
    }
    getOutputDs() {
        const outputDsId = this.props.outputDataSources && this.props.outputDataSources[0];
        const useDs = this.props.useDataSources && this.props.useDataSources[0];
        if (!outputDsId || !useDs)
            return;
        const dsManager = DataSourceManager.getInstance();
        return dsManager.getDataSource(outputDsId);
    }
    render() {
        const { config, id, appMode, browserSizeMode, selectionIsInSelf, selectionIsSelf, useDataSources, builderStatus, layouts } = this.props;
        const appConfig = getAppStore().getState().appConfig;
        const { forceShowMask, datasource, widgetRect, page } = this.state;
        const isInBuilder = window.jimuConfig.isInBuilder;
        const classes = classNames('jimu-widget', 'widget-list', 'list-widget-' + id);
        if (!config.itemStyle) {
            return (jsx(WidgetPlaceholder, { widgetId: this.props.id, icon: require('./assets/icon.svg'), message: this.formatMessage('placeHolderTip') }));
        }
        const showBottomTool = listUtils.showBottomTools(this.props, this.state);
        const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool);
        const showTopTools = listUtils.showTopTools(this.props);
        const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools);
        const columnCount = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID ? this.getItemColumnCount() : null;
        const pageSize = listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount);
        this.pageSize = pageSize;
        const queryPageSize = pageSize;
        let query = getQueryOptions(this.state, this.props, queryPageSize);
        if (!compareQueryOptionsExceptPaging(query, this.lastQuery, datasource) && datasource) {
            const temp = query;
            if (page !== 1) {
                query = this.lastQuery;
                this.lastQuery = temp;
                this.setState({
                    page: 1
                });
            }
            else {
                this.lastQuery = temp;
            }
        }
        const currentLayout = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts[searchUtils.findLayoutId(layouts[builderStatus], browserSizeMode, appConfig.mainSizeMode)];
        const currentLayoutType = currentLayout && currentLayout.type;
        return (jsx("div", { className: classes, css: getStyle(this.props, this.isEditing(), showBottomTool), onPointerDown: evt => isInBuilder &&
                appMode !== AppMode.Run &&
                !selectionIsSelf &&
                !selectionIsInSelf &&
                this.handleListPointerDown(evt) },
            jsx("div", { className: 'widget-list d-flex' },
                this.isDsConfigured()
                    ? (jsx(DataSourceComponent, { query: datasource ? query : null, useDataSource: useDataSources && useDataSources[0], onDataSourceCreated: this.onDSCreated, widgetId: this.props.id, queryCount: true }, this.renderList))
                    : (this.renderList()),
                !this.isHasRenderList && (jsx("div", { className: 'list-loading-con w-100 h-100' },
                    jsx("div", { className: 'jimu-secondary-loading' })))),
            isInBuilder &&
                appMode !== AppMode.Run &&
                (forceShowMask ||
                    (!selectionIsInSelf && !selectionIsSelf) ||
                    (!config.isItemStyleConfirm && currentLayoutType)) && (jsx("div", { className: 'list-with-mask' })),
            jsx(ReactResizeDetector, { handleWidth: true, handleHeight: true, onResize: this.debounceOnResize })));
    }
}
Widget.versionManager = versionManager;
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const appConfig = state && state.appConfig;
    const { layouts, layoutId, layoutItemId, builderSupportModules, id } = props;
    const browserSizeMode = state && state.browserSizeMode;
    const builderStatus = (state &&
        state.widgetsState &&
        state.widgetsState[props.id] &&
        state.widgetsState[props.id].builderStatus) ||
        Status.Regular;
    let subLayoutType;
    if (appConfig) {
        const subLayout = appConfig &&
            state.appConfig.layouts &&
            state.appConfig.layouts[searchUtils.findLayoutId(layouts[builderStatus], browserSizeMode, appConfig.mainSizeMode)];
        subLayoutType = subLayout && subLayout.type;
    }
    const layout = (_a = appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId];
    const layoutSetting = (_c = (_b = layout === null || layout === void 0 ? void 0 : layout.content) === null || _b === void 0 ? void 0 : _b[layoutItemId]) === null || _c === void 0 ? void 0 : _c.setting;
    const isHeightAuto = ((_d = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _d === void 0 ? void 0 : _d.height) === LayoutItemSizeModes.Auto ||
        ((_e = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _e === void 0 ? void 0 : _e.height) === true;
    const isWidthAuto = ((_f = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _f === void 0 ? void 0 : _f.width) === LayoutItemSizeModes.Auto ||
        ((_g = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _g === void 0 ? void 0 : _g.width) === true;
    let widgetPosition;
    if (window.jimuConfig.isInBuilder) {
        const bbox = (_l = (_k = (_j = (_h = appConfig.layouts) === null || _h === void 0 ? void 0 : _h[layoutId]) === null || _j === void 0 ? void 0 : _j.content) === null || _k === void 0 ? void 0 : _k[layoutItemId]) === null || _l === void 0 ? void 0 : _l.bbox;
        widgetPosition = bbox && {
            left: bbox.left,
            top: bbox.top
        };
    }
    const selection = state && state.appRuntimeInfo && state.appRuntimeInfo.selection;
    const selectionIsInSelf = selection &&
        builderSupportModules &&
        builderSupportModules.widgetModules &&
        builderSupportModules.widgetModules.selectionInList(selection, id, appConfig, false);
    let selectionStatus;
    if (selectionIsInSelf) {
        selectionStatus = Object.keys(layouts).find(status => searchUtils.findLayoutId(layouts[status], browserSizeMode, appConfig.mainSizeMode) === selection.layoutId);
    }
    const selectionIsSelf = !!(selection &&
        selection.layoutId === layoutId &&
        selection.layoutItemId === layoutItemId);
    const currentPageId = (_m = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _m === void 0 ? void 0 : _m.currentPageId;
    const pageMode = (_q = (_p = (_o = state === null || state === void 0 ? void 0 : state.appConfig) === null || _o === void 0 ? void 0 : _o.pages) === null || _p === void 0 ? void 0 : _p[currentPageId]) === null || _q === void 0 ? void 0 : _q.mode;
    return {
        selectionIsSelf: selectionIsSelf,
        selectionIsInSelf: !!selectionIsInSelf,
        selectionStatus,
        appMode: (_r = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _r === void 0 ? void 0 : _r.appMode,
        browserSizeMode: state && state.browserSizeMode,
        builderStatus: (state &&
            state.widgetsState &&
            state.widgetsState[props.id] &&
            state.widgetsState[props.id].builderStatus) ||
            Status.Regular,
        showLoading: (_t = (_s = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _s === void 0 ? void 0 : _s[props.id]) === null || _t === void 0 ? void 0 : _t.showLoading,
        isRTL: state && state.appContext && state.appContext.isRTL,
        subLayoutType,
        left: widgetPosition && widgetPosition.left,
        top: widgetPosition && widgetPosition.top,
        isHeightAuto,
        isWidthAuto,
        queryObject: state.queryObject,
        boundingBox: (_v = (_u = layout === null || layout === void 0 ? void 0 : layout.content) === null || _u === void 0 ? void 0 : _u[layoutItemId]) === null || _v === void 0 ? void 0 : _v.bbox,
        heightLayoutItemSizeModes: (_w = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _w === void 0 ? void 0 : _w.height,
        parentSize: ((_x = state.widgetsState[props.id]) === null || _x === void 0 ? void 0 : _x.parentSize) || null,
        pageMode: pageMode
    };
};
export default Widget;
//# sourceMappingURL=widget.js.map