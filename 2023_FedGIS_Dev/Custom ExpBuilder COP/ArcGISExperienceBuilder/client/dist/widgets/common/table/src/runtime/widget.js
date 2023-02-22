var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, classNames, DataSourceComponent, Immutable, appActions, lodash, MessageManager, DataRecordsSelectionChangeMessage, ReactResizeDetector, getAppStore, CONSTANTS, DataSourceStatus, dataSourceUtils, MutableStoreManager, DataSourceManager, appConfigUtils, WidgetState, privilegeUtils, AppMode, esri, cancelablePromise, AllDataSourceTypes } from 'jimu-core';
import { Global } from 'jimu-theme';
import { SelectionModeType, TableArrangeType } from '../config';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import defaultMessages from './translations/default';
import { WidgetPlaceholder, defaultMessages as jimuUIDefaultMessages, Button, TextInput, Tabs, Tab, Select, AdvancedSelect, Popper, DataActionDropDown, Alert, Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'jimu-ui';
import { versionManager } from '../version-manager';
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime';
import { getStyle, getSuggestionStyle } from './style';
import { fetchSuggestionRecords, minusArray, getGlobalTableTools, getQuerySQL } from './utils';
import { SearchOutlined } from 'jimu-icons/outlined/editor/search';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { MenuOutlined } from 'jimu-icons/outlined/editor/menu';
import { TrashCheckOutlined } from 'jimu-icons/outlined/editor/trash-check';
import { RefreshOutlined } from 'jimu-icons/outlined/editor/refresh';
import { ListVisibleOutlined } from 'jimu-icons/outlined/editor/list-visible';
import { ShowSelectionOutlined } from 'jimu-icons/outlined/editor/show-selection';
import { MoreHorizontalOutlined } from 'jimu-icons/outlined/application/more-horizontal';
import { Fragment } from 'react';
// import warningIcon from 'jimu-icons/svg/outlined/suggested/warning.svg'
const { BREAK_POINTS, SELECTION_DATA_VIEW_ID, DATA_VIEW_ID_FOR_NO_SELECTION } = CONSTANTS;
const tablePlaceholderIcon = require('./assets/icons/placeholder-table.svg');
const SEARCH_TOOL_MIN_SIZE = 300;
const notLoad = [DataSourceStatus.NotReady, DataSourceStatus.LoadError];
const Sanitizer = esri.Sanitizer;
const sanitizer = new Sanitizer();
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.promises = [];
        this.FeatureTable = null;
        this.FeatureLayer = null;
        this.TableTemplate = null;
        this.getFieldsFromDatasource = () => {
            var _a;
            const { config } = this.props;
            const { layersConfig } = config;
            const { activeTabId } = this.state;
            const daLayersConfig = this.getDataActionTable();
            const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
            const curLayer = allLayersConfig
                .find(item => item.id === activeTabId);
            // allFields need recalculate(chart output ds)
            const selectedDs = this.dsManager.getDataSource((_a = curLayer.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId);
            const allFieldsSchema = selectedDs === null || selectedDs === void 0 ? void 0 : selectedDs.getSchema();
            const allFields = (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) : [];
            const defaultInvisible = [
                'CreationDate',
                'Creator',
                'EditDate',
                'Editor',
                'GlobalID'
            ];
            let tableFields = allFields.filter(item => !defaultInvisible.includes(item.jimuName));
            // If there are too many columns, only the first 50 columns will be displayed by default
            if ((tableFields === null || tableFields === void 0 ? void 0 : tableFields.length) > 50) {
                tableFields = tableFields.slice(0, 50);
            }
            return { allFields, tableFields };
        };
        this.onToolStyleChange = (width, height) => {
            width < BREAK_POINTS[0]
                ? this.setState({ mobileFlag: true })
                : this.setState({ mobileFlag: false });
            width < SEARCH_TOOL_MIN_SIZE
                ? this.setState({ searchToolFlag: true })
                : this.setState({ searchToolFlag: false });
        };
        this.onDataSourceCreated = (dataSource) => {
            this.setState({ dataSource });
            const isSelectionView = (dataSource === null || dataSource === void 0 ? void 0 : dataSource.dataViewId) === SELECTION_DATA_VIEW_ID;
            // The first time you switch a TAB and the target TAB is using dataView, the ds changes after the update
            const isDataView = (dataSource === null || dataSource === void 0 ? void 0 : dataSource.dataViewId) && (dataSource === null || dataSource === void 0 ? void 0 : dataSource.dataViewId) !== 'output' && !isSelectionView;
            const hasNoSelectionView = !!dataSource.getMainDataSource().getDataView(DATA_VIEW_ID_FOR_NO_SELECTION);
            const dsChangeCreateTable = !this.updatingTable && ((isSelectionView && hasNoSelectionView) || isDataView);
            if (dsChangeCreateTable) {
                this.updatingTable = true;
                this.destoryTable().then(() => {
                    this.createTable(dataSource);
                });
            }
        };
        this.updateGeometryAndSql = (dataSource) => {
            var _a;
            if (!((_a = this.table) === null || _a === void 0 ? void 0 : _a.layer))
                return;
            const dsParam = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getCurrentQueryParams();
            const orgExpression = this.table.layer.definitionExpression;
            if (orgExpression !== (dsParam === null || dsParam === void 0 ? void 0 : dsParam.where)) {
                this.table.layer.definitionExpression = dsParam === null || dsParam === void 0 ? void 0 : dsParam.where;
            }
            dataSourceUtils.changeJimuFeatureLayerQueryToJSAPILayerQuery(dataSource, Immutable(dsParam)).then(res => {
                var _a, _b;
                if (!(res === null || res === void 0 ? void 0 : res.geometry))
                    return;
                const newGeometry = res.geometry;
                const newGeometryJson = newGeometry === null || newGeometry === void 0 ? void 0 : newGeometry.toJSON();
                const orgGeometryJson = (_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.filterGeometry) === null || _b === void 0 ? void 0 : _b.toJSON();
                if (!lodash.isDeepEqual(orgGeometryJson, newGeometryJson)) {
                    this.table.filterGeometry = newGeometry;
                }
            });
            setTimeout(() => {
                this.asyncSelectedRebuild(dataSource);
            }, 500);
        };
        this.onDataSourceInfoChange = (info, preInfo) => {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!info) {
                this.destoryTable().then(() => {
                    this.setState({ emptyTable: true });
                });
                return;
            }
            this.dataSourceChange = true;
            if ((info === null || info === void 0 ? void 0 : info.status) === DataSourceStatus.Loaded && (preInfo === null || preInfo === void 0 ? void 0 : preInfo.status) === DataSourceStatus.Loaded) {
                this.dataSourceChange = false;
            }
            let { dataSource } = this.state;
            const { selectQueryFlag, activeTabId, selfDsChange } = this.state;
            const { config } = this.props;
            const { layersConfig } = config;
            // config info
            const daLayersConfig = this.getDataActionTable();
            const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
            const curLayer = allLayersConfig
                .find(item => item.id === activeTabId);
            const useDS = curLayer === null || curLayer === void 0 ? void 0 : curLayer.useDataSource;
            // If other widgets load data, status will be loaded at the first time
            // This time state.dataSource is undefined
            if ((!dataSource && useDS) || ((dataSource === null || dataSource === void 0 ? void 0 : dataSource.id) !== (useDS === null || useDS === void 0 ? void 0 : useDS.dataSourceId))) {
                dataSource = this.dsManager.getDataSource(useDS === null || useDS === void 0 ? void 0 : useDS.dataSourceId);
                if (!dataSource) {
                    this.setState({ emptyTable: true });
                    return;
                }
            }
            else if (!dataSource && !useDS) {
                return;
            }
            if (!(info === null || info === void 0 ? void 0 : info.status) || (info === null || info === void 0 ? void 0 : info.status) === DataSourceStatus.NotReady) {
                this.destoryTable().then(() => {
                    this.setState({
                        notReady: true,
                        emptyTable: true
                    });
                });
                return;
            }
            else {
                this.setState({
                    notReady: false,
                    emptyTable: false
                });
            }
            // loading status
            const showLoading = this.getLoadingStatus(dataSource, info === null || info === void 0 ? void 0 : info.status);
            const interval = (dataSource === null || dataSource === void 0 ? void 0 : dataSource.getAutoRefreshInterval()) || 0;
            // toggle auto refresh loading status
            this.toggleAutoRefreshLoading(dataSource, showLoading, interval);
            this.setState({
                showLoading,
                interval
            });
            // widgetQuery change (update geometry and sql)
            const dsParam = dataSource && dataSource.getCurrentQueryParams();
            const widgetQueryChange = !curLayer.dataActionObject && (info === null || info === void 0 ? void 0 : info.widgetQueries) !== (preInfo === null || preInfo === void 0 ? void 0 : preInfo.widgetQueries);
            if (widgetQueryChange) {
                this.updateGeometryAndSql(dataSource);
            }
            // time extent change
            const time = dsParam === null || dsParam === void 0 ? void 0 : dsParam.time;
            if (time) {
                const apiTime = dataSourceUtils.changeJimuTimeToJSAPITimeExtent(time);
                const tableLayer = (_a = this.table) === null || _a === void 0 ? void 0 : _a.layer;
                const orgTimeExtent = tableLayer === null || tableLayer === void 0 ? void 0 : tableLayer.timeExtent;
                // time not change
                const timeNotChnage = (time === null || time === void 0 ? void 0 : time[0]) === ((_b = orgTimeExtent === null || orgTimeExtent === void 0 ? void 0 : orgTimeExtent.start) === null || _b === void 0 ? void 0 : _b.getTime()) && (time === null || time === void 0 ? void 0 : time[1]) === ((_c = orgTimeExtent === null || orgTimeExtent === void 0 ? void 0 : orgTimeExtent.end) === null || _c === void 0 ? void 0 : _c.getTime());
                if (!timeNotChnage && tableLayer)
                    tableLayer.timeExtent = apiTime;
            }
            // shielding info change
            const preSelectedIds = preInfo === null || preInfo === void 0 ? void 0 : preInfo.selectedIds;
            const newSelectedIds = info === null || info === void 0 ? void 0 : info.selectedIds;
            const preSourceVersion = preInfo === null || preInfo === void 0 ? void 0 : preInfo.sourceVersion;
            const newSourceVersion = info === null || info === void 0 ? void 0 : info.sourceVersion;
            const newVersion = info === null || info === void 0 ? void 0 : info.gdbVersion;
            const preVersion = preInfo === null || preInfo === void 0 ? void 0 : preInfo.gdbVersion;
            const infoStatusNotChange = ((_d = curLayer === null || curLayer === void 0 ? void 0 : curLayer.useDataSource) === null || _d === void 0 ? void 0 : _d.dataSourceId) === (dataSource === null || dataSource === void 0 ? void 0 : dataSource.id) &&
                (preInfo === null || preInfo === void 0 ? void 0 : preInfo.status) === (info === null || info === void 0 ? void 0 : info.status) &&
                (preInfo === null || preInfo === void 0 ? void 0 : preInfo.instanceStatus) === (info === null || info === void 0 ? void 0 : info.instanceStatus) &&
                (info === null || info === void 0 ? void 0 : info.widgetQueries) === (preInfo === null || preInfo === void 0 ? void 0 : preInfo.widgetQueries) &&
                preSelectedIds === newSelectedIds &&
                // If the version change is caused by the table's own modifications, do not renrender
                (preSourceVersion === newSourceVersion || newSourceVersion === this.tableSourceVersion + 1) &&
                newVersion === preVersion;
            if (notLoad.includes(info === null || info === void 0 ? void 0 : info.status) ||
                this.updatingTable ||
                infoStatusNotChange) {
                return;
            }
            // data-action
            this.setState({ selectRecords: dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSelectedRecords() });
            // version manager
            if (preVersion && newVersion && newVersion !== preVersion && this.table) {
                this.updatingTable = true;
                this.destoryTable().then(() => {
                    this.createTable(dataSource, true);
                });
                return;
            }
            // ds ready create table and selected features change
            const tabChange = ((_e = curLayer === null || curLayer === void 0 ? void 0 : curLayer.useDataSource) === null || _e === void 0 ? void 0 : _e.dataSourceId) !== (dataSource === null || dataSource === void 0 ? void 0 : dataSource.id);
            const outputReapply = (!(preInfo === null || preInfo === void 0 ? void 0 : preInfo.status) || notLoad.includes(preInfo === null || preInfo === void 0 ? void 0 : preInfo.status)) && info && !notLoad.includes(info === null || info === void 0 ? void 0 : info.status) && (info === null || info === void 0 ? void 0 : info.instanceStatus) !== DataSourceStatus.NotCreated;
            const selectedChange = preSelectedIds !== newSelectedIds && ((preSelectedIds === null || preSelectedIds === void 0 ? void 0 : preSelectedIds.length) !== 0 || (newSelectedIds === null || newSelectedIds === void 0 ? void 0 : newSelectedIds.length) !== 0);
            const infoNotChange = (info === null || info === void 0 ? void 0 : info.status) === (preInfo === null || preInfo === void 0 ? void 0 : preInfo.status) && (info === null || info === void 0 ? void 0 : info.instanceStatus) === (preInfo === null || preInfo === void 0 ? void 0 : preInfo.instanceStatus);
            const isOutputDs = (_f = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getDataSourceJson()) === null || _f === void 0 ? void 0 : _f.isOutputFromWidget;
            const dsCreated = !curLayer.dataActionObject && (info === null || info === void 0 ? void 0 : info.status) === DataSourceStatus.Unloaded && (info === null || info === void 0 ? void 0 : info.instanceStatus) === DataSourceStatus.Created &&
                !selectedChange && !infoNotChange && !isOutputDs;
            const sourceVerChange = preSourceVersion !== newSourceVersion;
            if (outputReapply || tabChange || dsCreated || sourceVerChange) {
                if (curLayer === null || curLayer === void 0 ? void 0 : curLayer.dataActionObject)
                    return;
                if (!this.dataActionCanLoad)
                    return;
                this.updatingTable = true;
                this.destoryTable().then(() => {
                    this.createTable(dataSource);
                });
                return;
            }
            // async click selected
            // Action table does not need to be selected synchronously
            if (!curLayer.dataActionObject && preSelectedIds !== newSelectedIds) {
                if (selectQueryFlag) {
                    this.asyncSelectedWhenSelection(newSelectedIds || Immutable([]));
                    setTimeout(() => {
                        this.asyncSelectedRebuild(dataSource);
                    }, 500);
                }
                else {
                    if (selfDsChange) {
                        this.setState({ selfDsChange: false });
                    }
                    else {
                        setTimeout(() => {
                            this.asyncSelectedRebuild(dataSource);
                        }, 500);
                    }
                }
            }
            // update table (exclude view in table)
            if (!curLayer.dataActionObject && ((_g = this.table) === null || _g === void 0 ? void 0 : _g.layer) && preSelectedIds === newSelectedIds) {
                this.table.layer.definitionExpression = dsParam.where;
            }
        };
        this.onQueryRequired = (queryRequiredInfo) => {
            var _a;
            const { dataSource } = this.state;
            const dataSourceId = dataSource === null || dataSource === void 0 ? void 0 : dataSource.id;
            const needRefresh = (_a = queryRequiredInfo === null || queryRequiredInfo === void 0 ? void 0 : queryRequiredInfo[dataSourceId]) === null || _a === void 0 ? void 0 : _a.needRefresh;
            if (needRefresh) {
                this.updatingTable = true;
                this.destoryTable().then(() => {
                    this.createTable(dataSource);
                });
            }
        };
        this.getLayerObjectIdField = () => {
            var _a, _b, _c;
            const { dataSource } = this.state;
            const objectIdField = ((_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.layer) === null || _b === void 0 ? void 0 : _b.objectIdField) ||
                ((_c = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _c === void 0 ? void 0 : _c.objectIdField) ||
                'OBJECTID';
            return objectIdField;
        };
        this.asyncSelectedWhenSelection = (newSelectedIds) => {
            const { dataSource } = this.state;
            const objectIdField = this.getLayerObjectIdField();
            const curQuery = dataSource && dataSource.getCurrentQueryParams();
            let legal = true;
            newSelectedIds.forEach(id => {
                if (!id)
                    legal = false;
            });
            const selectedQuery = (newSelectedIds.length > 0 && legal)
                ? `${objectIdField} IN (${newSelectedIds
                    .map(id => {
                    return id;
                })
                    .join()})`
                : curQuery.where;
            if (this.table && this.table.layer) {
                this.table.clearSelectionFilter();
                this.table.layer.definitionExpression = selectedQuery;
            }
        };
        this.getFeatureLayer = (dataSource, dataRecords) => {
            var _a, _b, _c, _d;
            const ds = dataSource;
            const notToLoad = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.isDataInDataSourceInstance;
            let featureLayer;
            if ((dataRecords === null || dataRecords === void 0 ? void 0 : dataRecords.length) > 0) {
                return dataSourceUtils.createFeatureLayerByRecords(ds, dataRecords);
            }
            else {
                const curQuery = dataSource && dataSource.getCurrentQueryParams();
                if (notToLoad) {
                    const q = { returnGeometry: true };
                    /**
                     * Current data source is selection view and selection view is empty indicate that widget is actually using no_selection now.
                     */
                    const usingNoSelectionView = ds.dataViewId === CONSTANTS.SELECTION_DATA_VIEW_ID && (!ds.sourceRecords || ds.sourceRecords.length === 0);
                    /**
                     * If widget is using no_selection view, should use pageSize of the no_selection view to load records.
                     */
                    if (usingNoSelectionView) {
                        const noSelectionView = ds.getMainDataSource().getDataView(CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION);
                        if (noSelectionView) {
                            q.pageSize = (_d = (_c = (_b = ds.getMainDataSource().getDataSourceJson()) === null || _b === void 0 ? void 0 : _b.dataViews) === null || _c === void 0 ? void 0 : _c[CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION]) === null || _d === void 0 ? void 0 : _d.pageSize;
                        }
                    }
                    // chart output and selected features need load
                    return ds.query(q).then(({ records }) => __awaiter(this, void 0, void 0, function* () {
                        const dataRecords = yield Promise.resolve(records);
                        return dataSourceUtils.createFeatureLayerByRecords(ds, dataRecords);
                    }));
                }
                // Adjust the order, because ds.layer is a reference type that changes the original data
                // csv upload type ds: only have layer, but not itemId and url
                if (!this.FeatureLayer)
                    return Promise.resolve(featureLayer);
                if (ds.itemId) {
                    const layerId = parseInt(ds.layerId);
                    const layerConfig = {
                        portalItem: {
                            id: ds.itemId,
                            portal: {
                                url: ds.portalUrl
                            }
                        },
                        definitionExpression: curQuery.where,
                        layerId: layerId || undefined
                    };
                    if (ds.url)
                        layerConfig.url = ds.url;
                    featureLayer = new this.FeatureLayer(layerConfig);
                }
                else if (ds.url) {
                    featureLayer = new this.FeatureLayer({
                        definitionExpression: curQuery.where,
                        url: ds.url
                    });
                }
                else if (ds.layer) {
                    return ds.query({ returnGeometry: true }).then(({ records }) => __awaiter(this, void 0, void 0, function* () {
                        const dataRecords = yield Promise.resolve(records);
                        return dataSourceUtils.createFeatureLayerByRecords(ds, dataRecords);
                    }));
                }
                else {
                    return Promise.resolve(featureLayer);
                }
            }
            if (notToLoad) { // output ds (dynamic layer, load will rise bug)
                return Promise.resolve(featureLayer);
            }
            else { // need load to get layer.capabilities
                return featureLayer.load().then(() => __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.resolve(featureLayer);
                }));
            }
        };
        this.getFieldEditable = (layerDefinition, jimuName) => {
            const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
            const orgField = fieldsConfig.find(config => config.name === jimuName);
            const fieldEditable = orgField ? orgField === null || orgField === void 0 ? void 0 : orgField.editable : true;
            return fieldEditable;
        };
        this.dsAsyncSelectTable = (dataSource, selectedItems, rowClick, versionChangeClear) => {
            const { id } = this.props;
            const tableInstance = this.table;
            const objectIdField = this.getLayerObjectIdField();
            const selectedQuery = selectedItems && selectedItems.length > 0
                ? `${objectIdField} IN (${selectedItems
                    .map(item => {
                    if (item.dataSource) {
                        return item.getId();
                    }
                    else {
                        return item;
                    }
                })
                    .join()})`
                : '1=2';
            if (versionChangeClear)
                dataSource.clearSelection();
            dataSource
                .query({
                where: selectedQuery,
                returnGeometry: true
            })
                .then(result => {
                const records = result === null || result === void 0 ? void 0 : result.records;
                if (records) {
                    MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(id, result.records));
                    tableInstance.layer.queryFeatureCount().then(count => {
                        count === 0 ? this.setState({ emptyData: true }) : this.setState({ emptyData: false });
                    });
                    if (records.length > 0) {
                        dataSource.selectRecordsByIds(records.map(record => record.getId()), records);
                    }
                    else {
                        dataSource.clearSelection();
                    }
                    if (!rowClick) {
                        setTimeout(() => {
                            this.asyncSelectedRebuild(dataSource);
                        }, 500);
                    }
                }
            });
        };
        this.isDataSourceAccessible = (dataSourceId, isDataAction) => {
            var _a;
            const hasInstance = this.dsManager.getDataSource(dataSourceId);
            const dataSourceIsInProps = isDataAction ? hasInstance : (((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.filter(useDs => dataSourceId === useDs.dataSourceId).length) > 0);
            return dataSourceIsInProps;
        };
        this.createTable = (newDataSource, versionChange) => {
            var _a, _b, _c, _d;
            const { config, id } = this.props;
            const { layersConfig } = config;
            const { activeTabId, tableShowColumns, selectQueryFlag } = this.state;
            let { dataSource } = this.state;
            if (newDataSource)
                dataSource = newDataSource;
            if (!dataSource || notLoad.includes((_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getInfo()) === null || _a === void 0 ? void 0 : _a.status)) {
                this.updatingTable = false;
                return;
            }
            const layerDefinition = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLayerDefinition();
            // ds judgment
            if ((dataSource === null || dataSource === void 0 ? void 0 : dataSource.dataViewId) === SELECTION_DATA_VIEW_ID) {
                if (!((_b = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getDataSourceJson()) === null || _b === void 0 ? void 0 : _b.isDataInDataSourceInstance) ||
                    (dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSourceRecords().length) === 0) {
                    this.setState({ emptyTable: true });
                    this.dataSourceChange = false;
                    this.dataActionCanLoad = true;
                    this.updatingTable = false;
                    return;
                }
                else {
                    this.setState({ emptyTable: false });
                }
            }
            // data-action Table
            const daLayersConfig = this.getDataActionTable();
            const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
            const curLayer = allLayersConfig
                .find(item => item.id === activeTabId);
            if (!curLayer) {
                this.updatingTable = false;
                return;
            }
            // Determine whether the ds has change to curLayer's ds
            const curDsId = (_c = curLayer === null || curLayer === void 0 ? void 0 : curLayer.useDataSource) === null || _c === void 0 ? void 0 : _c.dataSourceId;
            const isCurDs = curDsId === (dataSource === null || dataSource === void 0 ? void 0 : dataSource.id);
            if (!isCurDs) {
                this.updatingTable = false;
                return;
            }
            const dsId = (_d = curLayer.useDataSource) === null || _d === void 0 ? void 0 : _d.dataSourceId;
            const dataActionObject = curLayer.dataActionObject;
            // Check whether ds is available
            if (!this.isDataSourceAccessible(dsId, dataActionObject)) {
                this.setState({ emptyTable: true });
                this.dataSourceChange = false;
                this.dataActionCanLoad = true;
                this.updatingTable = false;
                return;
            }
            let container;
            if (document.getElementsByClassName(`table-container-${id}`).length === 0) {
                container = document && document.createElement('div');
                container.className = `table-container-${id}`;
                this.refs.tableContainer &&
                    this.refs.tableContainer.appendChild(container);
            }
            else {
                container = document.getElementsByClassName(`table-container-${id}`)[0];
            }
            const { allFields } = this.getFieldsFromDatasource();
            const curColumns = tableShowColumns ? tableShowColumns.map(col => { return { jimuName: col.value }; }) : curLayer.tableFields.filter(item => item.visible);
            const invisibleColumns = minusArray(allFields, curColumns).map(item => {
                return item.jimuName;
            });
            const dataRecords = this.dataActionTableRecords[curLayer.id];
            if (dataActionObject) {
                if (dsId) {
                    dataSource = this.dsManager.getDataSource(dsId);
                }
            }
            const getPrivilege = () => {
                return privilegeUtils.checkExbAccess(privilegeUtils.CheckTarget.Experience).then(exbAccess => {
                    var _a;
                    return curLayer.enableEdit && ((_a = exbAccess === null || exbAccess === void 0 ? void 0 : exbAccess.capabilities) === null || _a === void 0 ? void 0 : _a.canEditFeature);
                });
            };
            const getLayerAndNewTable = () => {
                const newId = this.currentRequestId + 1;
                this.currentRequestId++;
                const isSceneLayer = (dataSource === null || dataSource === void 0 ? void 0 : dataSource.type) === AllDataSourceTypes.SceneLayer;
                const dataSourceUsed = isSceneLayer ? dataSource.getAssociatedDataSource() : dataSource;
                if (dataSourceUsed) {
                    const tablePromise = cancelablePromise.cancelable(this.getFeatureLayer(dataSourceUsed, dataRecords).then((layer) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        if (newId !== this.currentRequestId || !layer || !this.FeatureTable || !this.refs.currentEl) {
                            this.updatingTable = false;
                            return;
                        }
                        let featureLayer;
                        if (layer.layer) {
                            featureLayer = layer.layer;
                        }
                        else {
                            featureLayer = layer;
                        }
                        // fetch to confirm whether it's a public source
                        const accessible = yield this.getDsAccessibleInfo(layer === null || layer === void 0 ? void 0 : layer.url);
                        // use exb privilege instead of api's supportsUpdateByOthers
                        const privilegeEditable = yield getPrivilege();
                        // if it's not public, use 'privilegeEditable'
                        const editable = curLayer.enableEdit && (accessible || privilegeEditable);
                        // fieldConfigs: Priority needs to be considered for 'editable'
                        const allFieldsSchema = dataSourceUsed === null || dataSourceUsed === void 0 ? void 0 : dataSourceUsed.getSchema();
                        // sort fields
                        const queryParams = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getCurrentQueryParams();
                        const sortFieldsArray = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.orderByFields) || [];
                        const sortFields = {};
                        sortFieldsArray.forEach((item, index) => {
                            var _a;
                            const fieldSort = item.split(' ');
                            sortFields[fieldSort[0]] = { direction: (_a = fieldSort[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase(), initialSortPriority: index };
                        });
                        const tableTemplate = new this.TableTemplate({
                            columnTemplates: curLayer.tableFields.map(item => {
                                var _a;
                                const newItem = (_a = allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) === null || _a === void 0 ? void 0 : _a[item.jimuName];
                                return Object.assign(Object.assign(Object.assign({ fieldName: item.jimuName, label: newItem === null || newItem === void 0 ? void 0 : newItem.alias }, (editable ? { editable: this.getFieldEditable(layerDefinition, item.jimuName) && (item === null || item === void 0 ? void 0 : item.editAuthority) } : {})), { visible: invisibleColumns.indexOf(item.jimuName) < 0 }), (sortFields[item.jimuName] ? sortFields[item.jimuName] : {}));
                            })
                        });
                        // when unselect all fields, do not render table
                        if (((_a = tableTemplate === null || tableTemplate === void 0 ? void 0 : tableTemplate.columnTemplates) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                            this.dataSourceChange = false;
                            this.dataActionCanLoad = true;
                            this.updatingTable = false;
                            this.setState({ emptyTable: false });
                            return;
                        }
                        if (editable) {
                            // eslint-disable-next-line
                            const that = this;
                            featureLayer.on('edits', function (event) {
                                var _a, _b, _c;
                                const { addedFeatures, updatedFeatures, deletedFeatures } = event;
                                // There are no add and delete for now
                                const adds = addedFeatures && addedFeatures.length > 0;
                                const updates = updatedFeatures && updatedFeatures.length > 0;
                                const deletes = deletedFeatures && deletedFeatures.length > 0;
                                if (adds || updates || deletes) {
                                    const updateFeature = (_b = (_a = event === null || event === void 0 ? void 0 : event.edits) === null || _a === void 0 ? void 0 : _a.updateFeatures) === null || _b === void 0 ? void 0 : _b[0];
                                    if (updateFeature) {
                                        const record = dataSource.buildRecord(updateFeature);
                                        const dsInfo = dataSource.getInfo();
                                        that.tableSourceVersion = (_c = dsInfo === null || dsInfo === void 0 ? void 0 : dsInfo.sourceVersion) !== null && _c !== void 0 ? _c : 0;
                                        dataSource.afterUpdateRecord(record);
                                    }
                                }
                            });
                        }
                        const dsGdbVersion = dataSource.getGDBVersion();
                        if (dsGdbVersion)
                            featureLayer.gdbVersion = dsGdbVersion;
                        const timeExtent = queryParams === null || queryParams === void 0 ? void 0 : queryParams.time;
                        if (timeExtent) {
                            const apiTime = dataSourceUtils.changeJimuTimeToJSAPITimeExtent(timeExtent);
                            featureLayer.timeExtent = apiTime;
                        }
                        this.table = new this.FeatureTable({
                            layer: featureLayer,
                            container: container,
                            visibleElements: {
                                header: true,
                                menu: true,
                                menuItems: {
                                    clearSelection: false,
                                    refreshData: false,
                                    toggleColumns: false
                                }
                            },
                            menuConfig: {},
                            tableTemplate,
                            multiSortEnabled: true,
                            attachmentsEnabled: curLayer.enableAttachements,
                            editingEnabled: editable
                        });
                        // async selected
                        // versionChange need reselect
                        if (versionChange) {
                            const versionChangeReselect = () => {
                                const selectedItems = dataSource.getSelectedRecords();
                                this.dsAsyncSelectTable(dataSource, selectedItems, false, true);
                            };
                            versionChangeReselect();
                        }
                        else {
                            // Action table does not need to be selected synchronously
                            if (!dataActionObject) {
                                setTimeout(() => {
                                    if (selectQueryFlag)
                                        this.asyncSelectedWhenSelection(Immutable(dataSource.getSelectedRecordIds() || []));
                                    setTimeout(() => {
                                        this.asyncSelectedRebuild(dataSource);
                                    }, 500);
                                }, 500);
                            }
                        }
                        const tableInstance = this.table;
                        tableInstance.grid.visibleElements.selectionColumn = false;
                        if (curLayer.enableSelect) {
                            const rowClickFn = ({ context, native }) => {
                                var _a, _b, _c, _d;
                                // edit mode cancel row-click
                                const clickEditTag = ((_b = (_a = native === null || native === void 0 ? void 0 : native.path) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.nodeName) || ((_d = (_c = native === null || native === void 0 ? void 0 : native.path) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.tagName);
                                if (clickEditTag === 'INPUT' || clickEditTag === 'SELECT')
                                    return;
                                // Delay click function
                                clearTimeout(this.timerFn);
                                this.timerFn = setTimeout(() => {
                                    var _a, _b;
                                    this.setState({ selfDsChange: true });
                                    const feature = context.item.feature;
                                    if (curLayer.selectMode === SelectionModeType.Single) {
                                        this.table.clearSelection();
                                    }
                                    context.selected
                                        ? this.table.deselectRows(feature)
                                        : this.table.selectRows(feature);
                                    const selectedIds = (_b = (_a = tableInstance.grid) === null || _a === void 0 ? void 0 : _a.highlightIds) === null || _b === void 0 ? void 0 : _b.toArray();
                                    if ((selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.length) === 0) {
                                        this.table.clearSelectionFilter();
                                        this.resetTableExpression();
                                        this.setState({ selectQueryFlag: false });
                                    }
                                    this.dsAsyncSelectTable(dataSource, selectedIds, true);
                                }, 200);
                            };
                            tableInstance.grid.on('row-click', rowClickFn);
                        }
                        // dblclick cancel click event
                        (_b = tableInstance === null || tableInstance === void 0 ? void 0 : tableInstance.domNode) === null || _b === void 0 ? void 0 : _b.addEventListener('dblclick', eve => {
                            clearTimeout(this.timerFn);
                        });
                        if (!dataRecords)
                            this.updateGeometryAndSql(dataSource);
                        this.dataSourceChange = false;
                        this.dataActionCanLoad = true;
                        this.updatingTable = false;
                        this.setState({ emptyTable: false });
                    })));
                    // cancel previous promise
                    if (this.promises.length !== 0) {
                        this.promises.forEach(p => p.cancel());
                    }
                    this.promises.push(tablePromise);
                }
            };
            getLayerAndNewTable();
        };
        this.asyncSelectedRebuild = (dataSource) => {
            var _a, _b;
            const selectedRecordIds = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSelectedRecordIds();
            ((_a = this.table) === null || _a === void 0 ? void 0 : _a.clearSelection) && this.table.clearSelection();
            // Synchronize new selection (the record of selectedRecords has different structure)
            // layer/url ds: the featuresArray's structure is not match the 'deselectRows', use primary id
            if ((selectedRecordIds === null || selectedRecordIds === void 0 ? void 0 : selectedRecordIds.length) > 0) {
                const featuresArray = [];
                selectedRecordIds.forEach(recordId => {
                    if (recordId)
                        featuresArray.push(parseInt(recordId));
                });
                ((_b = this.table) === null || _b === void 0 ? void 0 : _b.selectRows) && this.table.selectRows(featuresArray);
            }
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.onTagClick = (dataSourceId) => {
            const { id } = this.props;
            this.setState({
                activeTabId: dataSourceId,
                selectQueryFlag: false,
                tableShowColumns: undefined
            });
            this.props.dispatch(appActions.widgetStatePropChange(id, 'activeTabId', dataSourceId));
        };
        this.handleTagChange = evt => {
            var _a;
            const dataSourceId = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            const { id } = this.props;
            this.setState({
                activeTabId: dataSourceId,
                selectQueryFlag: false
            });
            this.props.dispatch(appActions.widgetStatePropChange(id, 'activeTabId', dataSourceId));
        };
        this.onShowSelection = () => {
            const { selectQueryFlag } = this.state;
            if (selectQueryFlag) {
                this.table.clearSelectionFilter();
                this.resetTableExpression();
            }
            else {
                this.table.filterBySelection();
            }
            this.setState({ selectQueryFlag: !selectQueryFlag });
        };
        this.resetTableExpression = () => {
            var _a;
            const { dataSource } = this.state;
            if ((_a = this.table) === null || _a === void 0 ? void 0 : _a.layer) {
                const curQuery = dataSource && dataSource.getCurrentQueryParams();
                this.table.layer.definitionExpression = curQuery.where;
            }
        };
        this.resetTable = () => {
            const { id } = this.props;
            const { selectQueryFlag, dataSource } = this.state;
            if (selectQueryFlag) {
                // reset sql
                this.resetTableExpression();
                this.setState({
                    selectQueryFlag: false,
                    selfDsChange: true
                });
            }
            this.setState({ searchText: '' });
            this.table && this.table.clearSelection();
            this.table && this.table.clearSelectionFilter();
            dataSource.clearSelection();
            dataSource.updateQueryParams({ where: '1=1' }, id);
            MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(id, []));
        };
        this.onSelectionClear = () => {
            this.resetTable();
        };
        this.onTableRefresh = () => {
            const { dataSource } = this.state;
            this.table && this.table.refresh();
            setTimeout(() => {
                this.asyncSelectedRebuild(dataSource);
            }, 0);
        };
        this.popupShowHideCols = () => {
            const advancedElement = this.refs.advancedSelect.getElementsByTagName('button')[0];
            advancedElement && advancedElement.click();
        };
        // TODO: use getArcGISSQL to update
        this.getQueryOptions = (curLayer) => {
            var _a;
            let options = '1=1';
            const { useDataSources } = this.props;
            const { searchText, dataSource } = this.state;
            const useDS = useDataSources && useDataSources[0];
            if (!dataSource || !useDS)
                return null;
            // not queryiable data source, return
            if (!(dataSource).query) {
                return null;
            }
            if (searchText && curLayer.enableSearch && curLayer.searchFields) {
                options = (options || '1=1') + ' AND ';
                const searchSQL = (_a = getQuerySQL(searchText, curLayer, dataSource)) === null || _a === void 0 ? void 0 : _a.sql;
                options += searchSQL;
            }
            return { where: options };
        };
        this.handleChange = (searchText) => {
            if (!searchText) {
                this.setState({ searchText, isShowSuggestion: false, searchSuggestion: [] }, () => {
                    this.handleSubmit();
                });
            }
            else {
                this.setState({ searchText, isShowSuggestion: (searchText === null || searchText === void 0 ? void 0 : searchText.length) > 2 }, () => {
                    clearTimeout(this.suggestionsQueryTimeout);
                    this.suggestionsQueryTimeout = setTimeout(() => {
                        this.getSearchSuggestions(searchText);
                    }, 200);
                });
            }
        };
        this.getSearchSuggestions = (searchText) => {
            var _a;
            const { config } = this.props;
            const { dataSource, activeTabId } = this.state;
            if ((searchText === null || searchText === void 0 ? void 0 : searchText.length) < 3) {
                return false;
            }
            const curLayer = (_a = config.layersConfig) === null || _a === void 0 ? void 0 : _a.find(item => item.id === activeTabId);
            fetchSuggestionRecords(searchText, curLayer, dataSource).then(searchSuggestion => {
                this.setState({ searchSuggestion });
            });
        };
        this.handleSubmit = () => {
            const { dataSource } = this.state;
            const { id } = this.props;
            const curLayer = this.props.config.layersConfig.find(item => item.id === this.state.activeTabId);
            const tableQuery = this.getQueryOptions(curLayer);
            dataSource.updateQueryParams(tableQuery, id);
        };
        this.onKeyUp = evt => {
            if (!evt || !evt.target)
                return;
            if (evt.key === 'Enter') {
                this.setState({
                    isShowSuggestion: false
                }, () => {
                    this.handleSubmit();
                });
            }
        };
        this.getTextInputPrefixElement = () => {
            const { theme } = this.props;
            return (jsx(Button, { type: 'tertiary', icon: true, size: 'sm', onClick: evt => {
                    this.setState({
                        isShowSuggestion: false
                    }, () => {
                        this.handleSubmit();
                    });
                }, className: 'search-icon' },
                jsx(SearchOutlined, { color: theme.colors.palette.light[800] })));
        };
        this.renderSearchTools = (hint) => {
            const { searchText, searchToolFlag, isOpenSearchPopper } = this.state;
            const { theme } = this.props;
            return (jsx("div", { className: 'table-search-div' }, searchToolFlag
                ? (jsx("div", { className: 'float-right', ref: ref => (this.refs.searchPopup = ref) },
                    jsx(Button, { type: 'tertiary', icon: true, size: 'sm', className: 'tools-menu', title: this.formatMessage('search'), onClick: evt => {
                            this.setState({ isOpenSearchPopper: !isOpenSearchPopper });
                        } },
                        jsx(SearchOutlined, null)),
                    jsx(Popper, { placement: 'right-start', reference: this.refs.searchPopup, offset: [-10, -30], open: isOpenSearchPopper, showArrow: false, toggle: e => {
                            this.setState({ isOpenSearchPopper: !isOpenSearchPopper });
                        } },
                        jsx("div", { className: 'd-flex align-items-center table-popup-search m-2' },
                            jsx(Button, { type: 'tertiary', icon: true, size: 'sm', onClick: evt => {
                                    this.setState({ isOpenSearchPopper: false });
                                }, className: 'search-back mr-1' },
                                jsx(ArrowLeftOutlined, { color: theme.colors.palette.dark[800] })),
                            jsx(TextInput, { className: 'popup-search-input', placeholder: hint || this.formatMessage('search'), onChange: e => this.handleChange(e.target.value), value: searchText || '', onKeyDown: e => this.onKeyUp(e), prefix: this.getTextInputPrefixElement(), allowClear: true, title: hint || this.formatMessage('search') })))))
                : (jsx("div", { className: 'd-flex align-items-center table-search' },
                    jsx(TextInput, { className: 'search-input', placeholder: hint || this.formatMessage('search'), onChange: e => this.handleChange(e.target.value), value: searchText || '', onKeyDown: e => this.onKeyUp(e), prefix: this.getTextInputPrefixElement(), allowClear: true, title: hint || this.formatMessage('search') })))));
        };
        this.getInitFields = () => {
            const { activeTabId } = this.state;
            const { config } = this.props;
            const { layersConfig } = config;
            // data-action Table
            const daLayersConfig = this.getDataActionTable();
            const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
            const curLayer = allLayersConfig.find(item => item.id === activeTabId);
            const { tableFields } = curLayer;
            const initSelectTableFields = [];
            for (const item of tableFields) {
                if (item.visible)
                    initSelectTableFields.push({ value: item.name, label: item.alias });
            }
            return initSelectTableFields;
        };
        this.onValueChangeFromRuntime = (valuePairs) => {
            if (!valuePairs)
                valuePairs = [];
            const { tableShowColumns } = this.state;
            const initTableFields = this.getInitFields();
            const tableColumns = tableShowColumns || initTableFields;
            const selectFlag = valuePairs.length > tableColumns.length;
            minusArray(tableColumns, valuePairs, 'value').forEach(item => {
                selectFlag
                    ? this.table.showColumn(item.value)
                    : this.table.hideColumn(item.value);
            });
            this.setState({ tableShowColumns: valuePairs });
        };
        this.getDataActionTable = () => {
            const { viewInTableObj } = this.props;
            const dataActionTableArray = [];
            for (const key in viewInTableObj) {
                const tableObj = viewInTableObj[key];
                this.dataActionTableRecords[key] = tableObj.records;
                dataActionTableArray.push(Object.assign({}, tableObj.daLayerItem));
            }
            return dataActionTableArray;
        };
        this.onCloseTab = (tabId, evt) => {
            const { id, viewInTableObj } = this.props;
            if (evt)
                evt.stopPropagation();
            this.removeConfig = true;
            this.setState({ tableShowColumns: undefined });
            const newViewInTableObj = viewInTableObj;
            delete newViewInTableObj[tabId];
            delete this.dataActionTableRecords[tabId];
            MutableStoreManager.getInstance().updateStateValue(id, 'viewInTableObj', newViewInTableObj);
        };
        this.getLoadingStatus = (ds, queryStatus) => {
            const { stateShowLoading: mustLoading } = this.props;
            // loading
            let showLoading = false;
            if (mustLoading ||
                window.jimuConfig.isInBuilder ||
                (ds && queryStatus === DataSourceStatus.Loading)) {
                showLoading = true;
            }
            return showLoading;
        };
        this.setRefreshLoadingString = (showLoading = false) => {
            if (!showLoading)
                return false;
            let time = 0;
            // eslint-disable-next-line
            const _this = this;
            clearInterval(this.autoRefreshLoadingTime);
            this.autoRefreshLoadingTime = setInterval(() => {
                time++;
                _this.setState({
                    autoRefreshLoadingString: _this.getLoadingString(time)
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
        this.toggleAutoRefreshLoading = (ds, showLoading, interval) => {
            this.resetAutoRefreshTimes(interval, showLoading);
            if (interval > 0)
                this.setRefreshLoadingString(showLoading);
        };
        this.resetAutoRefreshTimes = (interval, showLoading = false) => {
            // eslint-disable-next-line
            const _this = this;
            clearTimeout(this.resetAutoRefreshTime);
            if (interval <= 0)
                clearInterval(this.autoRefreshLoadingTime);
            this.resetAutoRefreshTime = setTimeout(() => {
                if (showLoading && interval > 0) {
                    _this.setState({
                        autoRefreshLoadingString: _this.formatMessage('lastUpdateAFewTime')
                    });
                }
                _this.setState({
                    showLoading: showLoading
                });
            }, 0);
        };
        this.renderLoading = (showLoading, interval) => {
            const { autoRefreshLoadingString } = this.state;
            return (jsx("div", { className: 'position-absolute refresh-loading-con d-flex align-items-center' },
                showLoading && jsx("div", { className: 'loading-con' }),
                interval > 0 && (jsx("div", { className: 'flex-grow-1 auto-refresh-loading' }, autoRefreshLoadingString))));
        };
        this.onSuggestionConfirm = suggestion => {
            this.setState({
                searchText: suggestion,
                isShowSuggestion: false
            }, () => {
                this.handleSubmit();
            });
        };
        this.clearMessageAction = () => {
            MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, []));
            this.setState({ emptyData: false });
        };
        this.state = {
            apiLoaded: false,
            dataSource: undefined,
            activeTabId: undefined,
            downloadOpen: false,
            searchText: '',
            selectQueryFlag: false,
            mobileFlag: false,
            searchToolFlag: false,
            tableShowColumns: undefined,
            isOpenSearchPopper: false,
            emptyTable: false,
            emptyData: false,
            selectRecords: [],
            notReady: false,
            selfDsChange: false,
            advancedTableField: [],
            showLoading: false,
            interval: 0,
            autoRefreshLoadingString: '',
            isShowSuggestion: false,
            searchSuggestion: []
        };
        this.dataSourceChange = false;
        this.dataActionCanLoad = true;
        this.dataActionTableRecords = {};
        this.updatingTable = false;
        this.removeConfig = false;
        this.currentRequestId = 0;
        this.timerFn = null;
        this.tableSourceVersion = undefined;
        this.debounceOnResize = lodash.debounce((width, height) => this.onToolStyleChange(width, height), 200);
        this.dsManager = DataSourceManager.getInstance();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        var _a;
        const { config } = nextProps;
        const { layersConfig } = config;
        const { activeTabId } = prevState;
        // data-action Table
        const daLayersConfig = new Widget(nextProps).getDataActionTable();
        const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
        if ((!activeTabId || allLayersConfig.findIndex(x => x.id === activeTabId) < 0) && allLayersConfig.length > 0) {
            const curConfig = allLayersConfig.find(item => { var _a; return item.id === ((_a = allLayersConfig[0]) === null || _a === void 0 ? void 0 : _a.id); });
            const newAdvancedTableField = curConfig && curConfig.tableFields.map(item => {
                return { value: item.name, label: item.alias };
            });
            return {
                activeTabId: (_a = allLayersConfig[0]) === null || _a === void 0 ? void 0 : _a.id,
                advancedTableField: newAdvancedTableField
            };
        }
        return null;
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules([
                'esri/widgets/FeatureTable',
                'esri/layers/FeatureLayer',
                'esri/widgets/FeatureTable/support/TableTemplate'
            ]).then(modules => {
                ;
                [this.FeatureTable, this.FeatureLayer, this.TableTemplate] = modules;
                this.setState({
                    apiLoaded: true
                });
                this.destoryTable().then(() => {
                    this.createTable();
                });
            });
        }
    }
    componentWillUnmount() {
        const { id } = this.props;
        this.promises.forEach(p => p.cancel());
        this.destoryTable();
        clearTimeout(this.suggestionsQueryTimeout);
        clearInterval(this.autoRefreshLoadingTime);
        MutableStoreManager.getInstance().updateStateValue(id, 'viewInTableObj', {});
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const { activeTabId, dataSource, advancedTableField } = this.state;
        const { id, config, currentPageId, state, belongToDataSourceInfos, appMode } = this.props;
        const { layersConfig } = config;
        const daLayersConfig = this.getDataActionTable();
        const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
        const removeLayerFlag = ((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.stateProps) === null || _b === void 0 ? void 0 : _b.removeLayerFlag) || false;
        const dataActionActiveObj = (_d = (_c = this.props) === null || _c === void 0 ? void 0 : _c.stateProps) === null || _d === void 0 ? void 0 : _d.dataActionActiveObj;
        const newActiveTabId = (dataActionActiveObj === null || dataActionActiveObj === void 0 ? void 0 : dataActionActiveObj.dataActionTable) ? dataActionActiveObj === null || dataActionActiveObj === void 0 ? void 0 : dataActionActiveObj.activeTabId : activeTabId;
        const optionChangeSuggestion = ((_f = (_e = this.props) === null || _e === void 0 ? void 0 : _e.stateProps) === null || _f === void 0 ? void 0 : _f.optionChangeSuggestion) || false;
        if (optionChangeSuggestion) {
            this.setState({ isShowSuggestion: false });
            this.props.dispatch(appActions.widgetStatePropChange(id, 'optionChangeSuggestion', false));
        }
        if (removeLayerFlag) {
            const popover = document.getElementsByClassName('esri-popover esri-popover--open');
            if (popover && popover.length > 0)
                popover[0].remove();
            this.props.dispatch(appActions.widgetStatePropChange(id, 'removeLayerFlag', false));
        }
        // close table menu
        const controllerClose = state === WidgetState.Closed;
        const pageClose = prevProps.currentPageId !== currentPageId;
        const liveClose = prevProps.appMode === AppMode.Run && appMode === AppMode.Design;
        if ((controllerClose || pageClose || liveClose) && this.table) {
            this.table.menu.open = false;
            this.setState({ searchText: '', isShowSuggestion: false });
        }
        const prevCurConfig = prevProps.config.layersConfig.concat(daLayersConfig).find(item => item.id === prevState.activeTabId);
        const newCurConfig = allLayersConfig.find(item => item.id === newActiveTabId);
        if (this.removeConfig) {
            this.removeConfig = false;
            if (!newCurConfig)
                return;
        }
        else {
            if (!prevCurConfig || !newCurConfig)
                return;
        }
        // search close
        const orgSearchOn = (prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig.enableSearch) && (prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig.searchFields);
        const newSearchOn = (newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.enableSearch) && (newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.searchFields);
        if (orgSearchOn && !newSearchOn) {
            dataSource.updateQueryParams({ where: '1=1' }, id);
        }
        // table advanced selector
        const newAdvancedTableField = (_g = newCurConfig.tableFields) === null || _g === void 0 ? void 0 : _g.map(item => {
            return { value: item.name, label: item.alias };
        });
        if (!lodash.isDeepEqual(newAdvancedTableField, advancedTableField) || newActiveTabId !== prevState.activeTabId) {
            this.setState({
                advancedTableField: newAdvancedTableField
            });
        }
        const optionKeys = [
            'enableAttachements',
            'enableEdit',
            'allowCsv',
            'enableSelect',
            'selectMode',
            'tableFields'
        ];
        let optionChangeFlag = false;
        for (const item of optionKeys) {
            const changeFlag = item !== 'tableFields' ? ((prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig[item]) !== (newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig[item])) : !lodash.isDeepEqual(prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig[item], newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig[item]);
            if (changeFlag) {
                optionChangeFlag = true;
                break;
            }
        }
        if (optionChangeFlag) {
            this.setState({ searchText: '', isShowSuggestion: false });
        }
        // belongToDataSource info change (update geometry and sql)
        const preDsId = (_h = prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig.useDataSource) === null || _h === void 0 ? void 0 : _h.dataSourceId;
        const curDsId = (_j = newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.useDataSource) === null || _j === void 0 ? void 0 : _j.dataSourceId;
        const preBelongToWidgetQuery = (_l = (_k = prevProps === null || prevProps === void 0 ? void 0 : prevProps.belongToDataSourceInfos) === null || _k === void 0 ? void 0 : _k[preDsId]) === null || _l === void 0 ? void 0 : _l.widgetQueries;
        const curBelongToWidgetQuery = (_m = belongToDataSourceInfos === null || belongToDataSourceInfos === void 0 ? void 0 : belongToDataSourceInfos[curDsId]) === null || _m === void 0 ? void 0 : _m.widgetQueries;
        const preBelongToSourceVersion = (_p = (_o = prevProps === null || prevProps === void 0 ? void 0 : prevProps.belongToDataSourceInfos) === null || _o === void 0 ? void 0 : _o[preDsId]) === null || _p === void 0 ? void 0 : _p.sourceVersion;
        const curBelongToSourceVersion = (_q = belongToDataSourceInfos === null || belongToDataSourceInfos === void 0 ? void 0 : belongToDataSourceInfos[curDsId]) === null || _q === void 0 ? void 0 : _q.sourceVersion;
        const curBelongToDsStatus = (_r = belongToDataSourceInfos === null || belongToDataSourceInfos === void 0 ? void 0 : belongToDataSourceInfos[curDsId]) === null || _r === void 0 ? void 0 : _r.status;
        // changes are only caused by belongtoDataSource
        if (!newCurConfig.dataActionObject && preDsId === curDsId && preBelongToWidgetQuery !== curBelongToWidgetQuery) {
            this.updateGeometryAndSql(dataSource);
        }
        const needUpdateTable = () => {
            const dsReady = !notLoad.includes(curBelongToDsStatus);
            // const tabChange = dsReady && newCurConfig?.useDataSource?.dataSourceId === dataSource?.id && prevCurConfig?.id !== newCurConfig?.id
            const tabChange = (prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig.id) !== (newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.id);
            const tableOptionChange = (prevCurConfig === null || prevCurConfig === void 0 ? void 0 : prevCurConfig.id) === (newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.id) && optionChangeFlag;
            const belongToSourceVersionChange = dataSource && curBelongToSourceVersion && preBelongToSourceVersion !== curBelongToSourceVersion && !(newCurConfig === null || newCurConfig === void 0 ? void 0 : newCurConfig.dataActionObject);
            return dsReady && (tabChange || tableOptionChange || belongToSourceVersionChange);
        };
        if ((dataActionActiveObj === null || dataActionActiveObj === void 0 ? void 0 : dataActionActiveObj.dataActionTable) && this.dataActionCanLoad && !this.updatingTable) {
            this.dataActionCanLoad = false;
            this.props.dispatch(appActions.widgetStatePropChange(id, 'dataActionActiveObj', { activeTabId: newActiveTabId, dataActionTable: false }));
            this.updatingTable = true;
            this.setState({
                activeTabId: newActiveTabId,
                searchText: '',
                tableShowColumns: undefined
            }, () => {
                this.destoryTable().then(() => {
                    this.createTable();
                });
            });
            return;
        }
        if (needUpdateTable()) {
            this.updatingTable = true;
            this.setState({
                searchText: '',
                tableShowColumns: undefined,
                selectQueryFlag: false
            }, () => {
                // reset ds query
                dataSource === null || dataSource === void 0 ? void 0 : dataSource.updateQueryParams({ where: '1=1' }, id);
                this.destoryTable().then(() => {
                    this.createTable();
                });
            });
        }
    }
    getDsAccessibleInfo(url) {
        if (!url)
            return Promise.resolve(false);
        return fetch(`${url}?f=pjson`).then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); })).then(info => {
            if (Object.keys(info).includes('error')) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    destoryTable() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.table) {
                this.table.menu.open = false;
                !this.table.destroyed && this.table.destroy();
            }
            return yield Promise.resolve();
        });
    }
    render() {
        var _a, _b, _c, _d;
        const { activeTabId, dataSource, selectQueryFlag, tableShowColumns, mobileFlag, emptyTable, selectRecords, notReady, advancedTableField, showLoading, interval, isShowSuggestion, searchSuggestion } = this.state;
        const { config, id, theme, enableDataAction, isHeightAuto, isWidthAuto } = this.props;
        const { layersConfig, arrangeType } = config;
        // data-action Table
        const daLayersConfig = this.getDataActionTable();
        const allLayersConfig = layersConfig.asMutable({ deep: true }).concat(daLayersConfig);
        let useDataSource;
        const curLayer = allLayersConfig.find(item => item.id === activeTabId);
        if (allLayersConfig.length > 0) {
            useDataSource = curLayer
                ? curLayer.useDataSource
                : allLayersConfig[0].useDataSource;
        }
        const classes = classNames('jimu-widget', 'widget-table', 'surface-1', 'table-widget-' + id);
        if (!useDataSource) {
            return (jsx(WidgetPlaceholder, { widgetId: id, iconSize: 'large', style: { position: 'absolute', left: 0, top: 0 }, icon: tablePlaceholderIcon, "data-testid": 'tablePlaceholder' }));
        }
        const horizontalTag = arrangeType === TableArrangeType.Tabs;
        const initSelectTableFields = this.getInitFields();
        const dataSourceLabel = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLabel();
        const outputDsWidgetId = appConfigUtils.getWidgetIdByOutputDataSource(useDataSource);
        const appConfig = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appConfig;
        const widgetLabel = (_c = (_b = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _b === void 0 ? void 0 : _b[outputDsWidgetId]) === null || _c === void 0 ? void 0 : _c.label;
        const dataName = this.formatMessage('tableDataActionLabel', { layer: dataSourceLabel || '' });
        const hasSelected = ((_d = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSelectedRecords()) === null || _d === void 0 ? void 0 : _d.length) > 0;
        const partProps = { id, enableDataAction, isHeightAuto, isWidthAuto };
        const searchOn = (curLayer === null || curLayer === void 0 ? void 0 : curLayer.enableSearch) && (curLayer === null || curLayer === void 0 ? void 0 : curLayer.searchFields);
        const dataActionFields = curLayer === null || curLayer === void 0 ? void 0 : curLayer.tableFields.map(item => item.jimuName);
        return (jsx("div", { className: classes, css: getStyle(theme, mobileFlag, partProps), ref: el => (this.refs.currentEl = el) },
            jsx("div", { className: 'table-indent' },
                jsx("div", { className: `d-flex ${horizontalTag ? 'horizontal-tag-list' : 'dropdown-tag-list'}` }, horizontalTag
                    ? (jsx(Tabs, { type: 'underline', onChange: this.onTagClick, className: 'tab-flex', value: activeTabId, onClose: this.onCloseTab, scrollable: true }, allLayersConfig.map(item => {
                        const isDataAction = !!item.dataActionObject;
                        return (jsx(Tab, { key: item.id, id: item.id, title: item.name, className: 'text-truncate tag-size', closeable: isDataAction },
                            jsx("div", { className: 'mt-2' })));
                    })))
                    : (jsx(Select, { size: 'sm', value: activeTabId, onChange: this.handleTagChange, className: 'top-drop' }, allLayersConfig.map(item => {
                        return (jsx("option", { key: item.id, value: item.id, title: item.name },
                            jsx("div", { className: 'table-action-option' },
                                jsx("div", { className: 'table-action-option-tab', title: item.name }, item.name),
                                item.dataActionObject &&
                                    jsx("div", { className: 'table-action-option-close' },
                                        jsx(Button, { size: 'sm', icon: true, type: 'tertiary', onClick: (evt) => this.onCloseTab(item.id, evt) },
                                            jsx(CloseOutlined, { size: 's' }))))));
                    })))),
                jsx("div", { className: `${arrangeType === TableArrangeType.Tabs
                        ? 'horizontal-render-con'
                        : 'dropdown-render-con'}` },
                    searchOn && this.renderSearchTools(curLayer === null || curLayer === void 0 ? void 0 : curLayer.searchHint),
                    searchOn &&
                        jsx("div", { ref: 'suggestPopup', style: { position: 'relative', top: 25 } },
                            jsx(Popper, { css: getSuggestionStyle(), placement: 'bottom-start', reference: this.refs.suggestPopup, offset: [0, 8], open: isShowSuggestion, trapFocus: false, autoFocus: false, toggle: e => {
                                    this.setState({ isShowSuggestion: !isShowSuggestion });
                                } }, searchSuggestion.map((suggestion, index) => {
                                const suggestionHtml = sanitizer.sanitize(suggestion.suggestionHtml);
                                return (jsx(Button, { key: index, type: 'secondary', size: 'sm', onClick: () => this.onSuggestionConfirm(suggestion.suggestion), dangerouslySetInnerHTML: { __html: suggestionHtml } }));
                            }))),
                    mobileFlag &&
                        jsx(Dropdown, { size: 'sm', className: 'd-inline-flex dropdown-list' },
                            jsx(DropdownButton, { arrow: false, icon: true, size: 'sm', title: this.formatMessage('options') },
                                jsx(MoreHorizontalOutlined, null)),
                            jsx(DropdownMenu, null,
                                curLayer.enableSelect &&
                                    jsx(Fragment, null,
                                        jsx(DropdownItem, { key: 'showSelection', onClick: this.onShowSelection, disabled: emptyTable || !hasSelected },
                                            selectQueryFlag ? jsx(MenuOutlined, { className: 'mr-1' }) : jsx(ShowSelectionOutlined, { className: 'mr-1', autoFlip: true }),
                                            selectQueryFlag
                                                ? this.formatMessage('showAll')
                                                : this.formatMessage('showSelection')),
                                        jsx(DropdownItem, { key: 'clearSelection', onClick: this.onSelectionClear, disabled: emptyTable || !hasSelected },
                                            jsx(TrashCheckOutlined, { className: 'mr-1' }),
                                            this.formatMessage('clearSelection'))),
                                curLayer.enableRefresh &&
                                    jsx(DropdownItem, { key: 'refresh', onClick: this.onTableRefresh, disabled: emptyTable },
                                        jsx(RefreshOutlined, { className: 'mr-1' }),
                                        this.formatMessage('refresh')),
                                jsx(DropdownItem, { key: 'showHideCols', onClick: this.popupShowHideCols, disabled: emptyTable },
                                    jsx(ListVisibleOutlined, { className: 'mr-1' }),
                                    this.formatMessage('showHideCols')))),
                    dataSource && mobileFlag && selectRecords && enableDataAction && !emptyTable &&
                        jsx("div", { className: 'horizontal-action-dropdown' },
                            jsx(DataActionDropDown, { widgetId: id, dataSet: { dataSource: dataSource, records: selectRecords, fields: dataActionFields, name: dataName } })),
                    jsx("div", { className: 'top-button-list' },
                        curLayer.enableSelect && (jsx("div", { className: 'top-button ml-2' },
                            jsx(Button, { size: 'sm', onClick: this.onShowSelection, icon: true, title: selectQueryFlag
                                    ? this.formatMessage('showAll')
                                    : this.formatMessage('showSelection'), disabled: emptyTable || !hasSelected }, selectQueryFlag ? jsx(MenuOutlined, null) : jsx(ShowSelectionOutlined, { autoFlip: true })))),
                        curLayer.enableSelect && (jsx("div", { className: 'top-button ml-2' },
                            jsx(Button, { size: 'sm', onClick: this.onSelectionClear, icon: true, title: this.formatMessage('clearSelection'), disabled: emptyTable || !hasSelected },
                                jsx(TrashCheckOutlined, null)))),
                        curLayer.enableRefresh && (jsx("div", { className: 'top-button ml-2' },
                            jsx(Button, { size: 'sm', onClick: this.onTableRefresh, icon: true, title: this.formatMessage('refresh'), disabled: emptyTable },
                                jsx(RefreshOutlined, null)))),
                        jsx("div", { className: 'top-button ml-2' },
                            jsx(Button, { size: 'sm', onClick: this.popupShowHideCols, icon: true, title: this.formatMessage('showHideCols'), disabled: emptyTable },
                                jsx(ListVisibleOutlined, null))),
                        dataSource && !mobileFlag && selectRecords && enableDataAction && !emptyTable &&
                            jsx(React.Fragment, null,
                                jsx("span", { className: 'tool-dividing-line' }),
                                jsx("div", { className: 'top-button data-action-btn' },
                                    jsx(DataActionDropDown, { widgetId: id, dataSet: { dataSource: dataSource, records: selectRecords, fields: dataActionFields, name: dataName } })))),
                    dataSource && (jsx("div", { ref: 'advancedSelect', className: 'adv-select-con' },
                        jsx(AdvancedSelect, { fluid: true, staticValues: advancedTableField, sortValuesByLabel: false, isMultiple: true, selectedValues: tableShowColumns || initSelectTableFields, isEmptyOptionHidden: false, onChange: this.onValueChangeFromRuntime }))),
                    emptyTable &&
                        jsx("div", { className: 'placeholder-table-con' },
                            jsx(WidgetPlaceholder, { icon: require('./assets/icon.svg'), message: this.formatMessage('noData') }),
                            notReady &&
                                jsx("div", { className: 'placeholder-alert-con' },
                                    jsx(Alert, { form: 'tooltip', size: 'small', type: 'warning', text: this.formatMessage('outputDataIsNotGenerated', { outputDsLabel: dataSourceLabel, sourceWidgetName: widgetLabel }) }))),
                    jsx("div", { ref: 'tableContainer', className: 'table-con' }),
                    (showLoading || interval > 0) && this.renderLoading(showLoading, interval),
                    jsx("div", { className: 'ds-container' },
                        jsx(DataSourceComponent, { widgetId: id, useDataSource: Immutable(useDataSource), onDataSourceCreated: this.onDataSourceCreated, onDataSourceInfoChange: this.onDataSourceInfoChange, onQueryRequired: this.onQueryRequired })),
                    jsx(Global, { styles: getGlobalTableTools(theme) }),
                    jsx(ReactResizeDetector, { handleWidth: true, handleHeight: true, onResize: this.debounceOnResize })))));
    }
}
Widget.versionManager = versionManager;
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { layoutId, layoutItemId, id } = props;
    const currentWidget = (_b = (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.widgets) === null || _b === void 0 ? void 0 : _b[id];
    const enableDataAction = currentWidget === null || currentWidget === void 0 ? void 0 : currentWidget.enableDataAction;
    const dsIds = (_c = currentWidget === null || currentWidget === void 0 ? void 0 : currentWidget.useDataSources) === null || _c === void 0 ? void 0 : _c.map(dsJson => {
        return dsJson.dataSourceId;
    });
    const dataInstance = DataSourceManager.getInstance();
    const belongToDataSourceInfos = {};
    dsIds === null || dsIds === void 0 ? void 0 : dsIds.forEach(dsId => {
        var _a, _b;
        const belongToDs = (_a = dataInstance.getDataSource(dsId)) === null || _a === void 0 ? void 0 : _a.belongToDataSource;
        belongToDataSourceInfos[dsId] = (_b = state === null || state === void 0 ? void 0 : state.dataSourcesInfo) === null || _b === void 0 ? void 0 : _b[belongToDs === null || belongToDs === void 0 ? void 0 : belongToDs.id];
    });
    const appConfig = state && state.appConfig;
    const layout = (_d = appConfig.layouts) === null || _d === void 0 ? void 0 : _d[layoutId];
    const layoutSetting = (_f = (_e = layout === null || layout === void 0 ? void 0 : layout.content) === null || _e === void 0 ? void 0 : _e[layoutItemId]) === null || _f === void 0 ? void 0 : _f.setting;
    const isHeightAuto = ((_g = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _g === void 0 ? void 0 : _g.height) === LayoutItemSizeModes.Auto ||
        ((_h = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _h === void 0 ? void 0 : _h.height) === true;
    const isWidthAuto = ((_j = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _j === void 0 ? void 0 : _j.width) === LayoutItemSizeModes.Auto ||
        ((_k = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _k === void 0 ? void 0 : _k.width) === true;
    return {
        appMode: (_l = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _l === void 0 ? void 0 : _l.appMode,
        isRTL: (_m = state === null || state === void 0 ? void 0 : state.appContext) === null || _m === void 0 ? void 0 : _m.isRTL,
        stateShowLoading: (_p = (_o = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _o === void 0 ? void 0 : _o[props.id]) === null || _p === void 0 ? void 0 : _p.showLoading,
        currentPageId: (_q = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _q === void 0 ? void 0 : _q.currentPageId,
        viewInTableObj: (_r = props === null || props === void 0 ? void 0 : props.mutableStateProps) === null || _r === void 0 ? void 0 : _r.viewInTableObj,
        enableDataAction: enableDataAction === undefined ? true : enableDataAction,
        belongToDataSourceInfos,
        isHeightAuto,
        isWidthAuto
    };
};
//# sourceMappingURL=widget.js.map