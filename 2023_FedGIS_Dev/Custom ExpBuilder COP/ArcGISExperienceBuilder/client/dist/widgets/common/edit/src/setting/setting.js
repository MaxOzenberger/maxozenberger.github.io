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
import { React, Immutable, jsx, css, urlUtils, DataSourceManager, polished, getAppStore, SupportedLayerServiceTypes } from 'jimu-core';
import { defaultMessages as jimuUIDefaultMessages, Button, Alert, TextArea, Radio, Label, ConfirmDialog, Switch } from 'jimu-ui';
import LayerConfig from './layer-config';
import { SettingSection, SettingRow, SidePopper, MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { builderAppSync } from 'jimu-for-builder';
import { EditModeType, LayerHonorModeType } from '../config';
import defaultMessages from './translations/default';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import LayerConfigDataSource from './layer-config-ds';
import { ImportOutlined } from 'jimu-icons/outlined/editor/import';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { Fragment } from 'react';
import { getMapAllLayers } from '../common-builder-support';
import { INVISIBLE_FIELD } from './setting-const';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg');
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.sidePopperTrigger = React.createRef();
        this.updateDsHash = (layersConfig) => {
            this.dsHash = {};
            let index = 0;
            layersConfig.forEach(item => {
                this.dsHash[index] = item.useDataSource;
                index++;
            });
        };
        this.getNewConfigId = (dsId) => {
            var _a;
            const index = ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layersConfig.length) > 0
                ? this.getArrayMaxId(this.props.config.layersConfig)
                : 0;
            return `${dsId}-${index + 1}`;
        };
        // save currentSelectedDs to array
        this.dataSourceChangeSave = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            const { config } = this.props;
            const geometryMode = config.editMode === EditModeType.Geometry;
            const currentIMUseDs = Immutable(useDataSources[0]);
            this.dsManager
                .createDataSourceByUseDataSource(currentIMUseDs)
                .then(currentDs => {
                var _a, _b, _c;
                // Init capabilities
                const layerDefinition = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getLayerDefinition();
                const capabilities = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities;
                const isTable = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.type) === SupportedLayerServiceTypes.Table;
                const isTableEditable = ((!geometryMode && isTable) || geometryMode);
                const create = this.getDsCap(capabilities, 'create') && isTableEditable;
                const update = this.getDsCap(capabilities, 'update');
                const deletable = this.getDsCap(capabilities, 'delete');
                // Fields operation
                const allFields = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getSchema();
                let allFieldsDetails = (allFields === null || allFields === void 0 ? void 0 : allFields.fields) ? Object.values(allFields === null || allFields === void 0 ? void 0 : allFields.fields) : [];
                // Filter uneditable field TODO
                const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
                // According to the API, these five items do not displayed in the Editor by default
                allFieldsDetails = allFieldsDetails.filter(item => !INVISIBLE_FIELD.includes(item.name));
                // Popup Setting is initially selected by default if the map has popup setting
                const popupSetting = (_b = (_a = currentDs === null || currentDs === void 0 ? void 0 : currentDs.layer) === null || _a === void 0 ? void 0 : _a.formTemplate) === null || _b === void 0 ? void 0 : _b.elements;
                if (popupSetting) {
                    const popupFieldNames = [];
                    popupSetting.forEach(ele => {
                        var _a;
                        const popupEle = ele;
                        if (((_a = popupEle === null || popupEle === void 0 ? void 0 : popupEle.elements) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            popupEle === null || popupEle === void 0 ? void 0 : popupEle.elements.forEach(subEle => {
                                if (subEle.fieldName)
                                    popupFieldNames.push(subEle.fieldName);
                            });
                        }
                        else {
                            if (popupEle.fieldName)
                                popupFieldNames.push(popupEle.fieldName);
                        }
                    });
                    allFieldsDetails = allFieldsDetails.filter(item => popupFieldNames.includes(item.name));
                }
                // If there are too many columns, only the first 50 columns will be displayed by default
                if ((allFieldsDetails === null || allFieldsDetails === void 0 ? void 0 : allFieldsDetails.length) > 50) {
                    allFieldsDetails = allFieldsDetails.slice(0, 50);
                }
                // Field editing is enabled by default
                const initGroupedFields = allFieldsDetails.map(item => {
                    const orgField = fieldsConfig.find(field => field.name === item.jimuName);
                    const defaultAuthority = orgField === null || orgField === void 0 ? void 0 : orgField.editable;
                    return Object.assign(Object.assign({}, item), { editAuthority: defaultAuthority, subDescription: (item === null || item === void 0 ? void 0 : item.description) || '', editable: defaultAuthority });
                });
                const isFromMap = !!((_c = currentDs.getRootDataSource()) === null || _c === void 0 ? void 0 : _c.map);
                const layerItem = {
                    id: currentDs.id,
                    name: currentDs.getLabel(),
                    layerId: currentDs === null || currentDs === void 0 ? void 0 : currentDs.jimuChildId,
                    useDataSource: currentIMUseDs,
                    addRecords: create,
                    deleteRecords: deletable,
                    updateGeometries: update,
                    featureSnapping: false,
                    showFields: allFieldsDetails,
                    groupedFields: initGroupedFields,
                    layerHonorMode: isFromMap ? LayerHonorModeType.Webmap : LayerHonorModeType.Custom
                };
                const currentLayer = this.props.config.layersConfig[this.index];
                let layerItems;
                if (currentLayer) {
                    // update config, reset other opts for current config
                    const _conf = this.props.config.layersConfig.asMutable({ deep: true });
                    _conf.splice(this.index, 1, layerItem);
                    layerItems = Immutable(_conf);
                }
                else {
                    // add new config
                    layerItems = this.props.config.layersConfig.concat([
                        Immutable(layerItem)
                    ]);
                }
                // update dsHash
                this.dsHash[this.index] = currentIMUseDs;
                this.updateDsHash(layerItems);
                const config = {
                    id: this.props.id,
                    config: this.props.config.set('layersConfig', layerItems),
                    useDataSources: this.getUseDataSourcesByDsHash()
                };
                this.props.onSettingChange(config);
            }).catch(err => {
                console.error(err);
            });
        };
        this.importAllLayersConfigSave = (useDataSources) => __awaiter(this, void 0, void 0, function* () {
            if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) === 0)
                return;
            const loopAddConfigs = () => __awaiter(this, void 0, void 0, function* () {
                let layerItems = this.props.config.layersConfig;
                const promises = [];
                useDataSources.forEach(useDataSource => {
                    promises.push(this.dsManager.createDataSourceByUseDataSource(Immutable(useDataSource)));
                });
                const results = yield Promise.all(promises);
                useDataSources.forEach((useDataSource, index) => {
                    var _a, _b, _c, _d;
                    const currentDs = results[index];
                    if ((_a = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.isHidden)
                        return;
                    const currentIMUseDs = Immutable(useDataSource);
                    const layerDefinition = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getLayerDefinition();
                    const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
                    const allFields = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getSchema();
                    let allFieldsDetails = (allFields === null || allFields === void 0 ? void 0 : allFields.fields) ? Object.values(allFields === null || allFields === void 0 ? void 0 : allFields.fields) : [];
                    // According to the API, these five items do not displayed in the Editor by default
                    allFieldsDetails = allFieldsDetails.filter(item => !INVISIBLE_FIELD.includes(item.jimuName));
                    // Popup Setting is initially selected by default if the map has popup setting
                    const popupSetting = (_c = (_b = currentDs === null || currentDs === void 0 ? void 0 : currentDs.layer) === null || _b === void 0 ? void 0 : _b.formTemplate) === null || _c === void 0 ? void 0 : _c.elements;
                    if (popupSetting) {
                        const popupFieldNames = [];
                        popupSetting.forEach(ele => {
                            var _a;
                            const popupEle = ele;
                            if (((_a = popupEle === null || popupEle === void 0 ? void 0 : popupEle.elements) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                popupEle === null || popupEle === void 0 ? void 0 : popupEle.elements.forEach(subEle => {
                                    if (subEle.fieldName)
                                        popupFieldNames.push(subEle.fieldName);
                                });
                            }
                            else {
                                if (popupEle.fieldName)
                                    popupFieldNames.push(popupEle.fieldName);
                            }
                        });
                        allFieldsDetails = allFieldsDetails.filter(item => popupFieldNames.includes(item.name));
                    }
                    // If there are too many columns, only the first 50 columns will be displayed by default
                    if ((allFieldsDetails === null || allFieldsDetails === void 0 ? void 0 : allFieldsDetails.length) > 50) {
                        allFieldsDetails = allFieldsDetails.slice(0, 50);
                    }
                    // Field editing is enabled by default
                    const initGroupedFields = allFieldsDetails.map(item => {
                        const orgField = fieldsConfig.find(field => field.name === item.jimuName);
                        const defaultAuthority = orgField === null || orgField === void 0 ? void 0 : orgField.editable;
                        return Object.assign(Object.assign({}, item), { editAuthority: defaultAuthority, subDescription: (item === null || item === void 0 ? void 0 : item.description) || '', editable: defaultAuthority });
                    });
                    // init capabilities
                    const capabilities = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities;
                    const create = this.getDsCap(capabilities, 'create');
                    const update = this.getDsCap(capabilities, 'update');
                    const deletable = this.getDsCap(capabilities, 'delete');
                    const operRights = create || update || deletable;
                    if (operRights) { // Any operation permission can be added
                        const isFromMap = !!((_d = currentDs.getRootDataSource()) === null || _d === void 0 ? void 0 : _d.map);
                        const layerItem = {
                            id: currentDs.id,
                            name: currentDs.getLabel(),
                            layerId: currentDs === null || currentDs === void 0 ? void 0 : currentDs.jimuChildId,
                            useDataSource: currentIMUseDs,
                            addRecords: create,
                            deleteRecords: deletable,
                            updateGeometries: update,
                            featureSnapping: false,
                            showFields: allFieldsDetails,
                            groupedFields: initGroupedFields,
                            layerHonorMode: isFromMap ? LayerHonorModeType.Webmap : LayerHonorModeType.Custom
                        };
                        layerItems = layerItems.concat([
                            Immutable(layerItem)
                        ]);
                        // update dsHash
                        this.dsHash[this.index] = currentIMUseDs;
                    }
                    if (useDataSources.length === index + 1 && layerItems.length === 0) {
                        this.setState({ noEditLayer: true }, () => {
                            setTimeout(() => {
                                this.setState({ noEditLayer: false });
                            }, 3000);
                        });
                    }
                });
                return layerItems;
            });
            const layerItems = yield loopAddConfigs();
            this.updateDsHash(layerItems.asMutable({ deep: true }));
            const updateConfig = {
                id: this.props.id,
                config: this.props.config.set('layersConfig', layerItems),
                useDataSources: this.getUseDataSourcesByDsHash()
            };
            this.props.onSettingChange(updateConfig);
        });
        this.getDsCap = (capabilities, capType) => {
            if (capabilities) {
                return Array.isArray(capabilities)
                    ? capabilities === null || capabilities === void 0 ? void 0 : capabilities.join().toLowerCase().includes(capType)
                    : capabilities === null || capabilities === void 0 ? void 0 : capabilities.toLowerCase().includes(capType);
            }
            else {
                return false;
            }
        };
        this.onFilterDs = (dsJson) => {
            var _a;
            if (!(dsJson === null || dsJson === void 0 ? void 0 : dsJson.url) || (dsJson === null || dsJson === void 0 ? void 0 : dsJson.isOutputFromWidget))
                return true;
            const { useMapWidgetIds, config } = this.props;
            const { layersConfig, editMode } = config;
            const alreadySelectIds = layersConfig.map(item => item.id);
            const getOperRights = (dsId) => {
                const dataSource = this.dsManager.getDataSource(dsId);
                const layerDefinition = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLayerDefinition();
                const capabilities = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities;
                const create = this.getDsCap(capabilities, 'create');
                const editing = this.getDsCap(capabilities, 'editing');
                const deletable = this.getDsCap(capabilities, 'delete');
                return create || editing || deletable;
            };
            let hideDsFlag = false;
            if (editMode === EditModeType.Geometry) {
                const useMapWidget = useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0];
                if (!useMapWidget)
                    return true;
                const appConfig = getAppStore().getState().appStateInBuilder.appConfig;
                const mapUseDataSources = (_a = appConfig.widgets[useMapWidget]) === null || _a === void 0 ? void 0 : _a.useDataSources;
                const mapUseDataSourcesIds = mapUseDataSources.map(item => item.dataSourceId);
                const thisDsId = dsJson.id.split('-')[0];
                // Use map useDataSources to filter map and alreadySelectIds to filter selected
                hideDsFlag = !mapUseDataSourcesIds.includes(thisDsId) || (mapUseDataSourcesIds.includes(thisDsId) && alreadySelectIds.includes(dsJson.id));
            }
            else {
                hideDsFlag = alreadySelectIds.includes(dsJson.id);
            }
            // Filter out data that does not have any operation rights
            if (!getOperRights(dsJson.id))
                hideDsFlag = true;
            return hideDsFlag;
        };
        this.onCloseLayerPanel = () => {
            this.setState({ showLayerPanel: false });
            this.index = 0;
        };
        this.getUniqueValues = (array1 = [], array2 = []) => {
            const array = array1.concat(array2);
            const res = array.filter(function (item, index, array) {
                return array.indexOf(item) === index;
            });
            return res;
        };
        this.getUseDataSourcesByDsHash = () => {
            const dsHash = {};
            Object.keys(this.dsHash).forEach(index => {
                const dsId = this.dsHash[index].dataSourceId;
                let ds;
                if (!dsHash[dsId]) {
                    ds = this.dsHash[index];
                }
                else {
                    ds = Immutable({
                        dataSourceId: this.dsHash[index].dataSourceId,
                        mainDataSourceId: this.dsHash[index].mainDataSourceId,
                        dataViewId: this.dsHash[index].dataViewId,
                        rootDataSourceId: this.dsHash[index].rootDataSourceId,
                        fields: this.getUniqueValues(dsHash[dsId].fields, this.dsHash[index].fields)
                    });
                }
                dsHash[dsId] = ds;
            });
            // get new array from hash
            const dsArray = [];
            Object.keys(dsHash).forEach(dsId => {
                dsArray.push(dsHash[dsId]);
            });
            return dsArray;
        };
        this.removeLayer = (index) => {
            if (this.index === index) {
                this.onCloseLayerPanel();
            }
            // del current filter item
            const _layer = this.props.config.layersConfig.asMutable({ deep: true });
            _layer.splice(index, 1);
            const fis = this.props.config.set('layersConfig', _layer);
            // update dsHash
            delete this.dsHash[index];
            this.updateDsHash(_layer);
            const config = {
                id: this.props.id,
                config: fis,
                useDataSources: this.getUseDataSourcesByDsHash()
            };
            this.props.onSettingChange(config);
            if (this.index > index) {
                this.index--;
            }
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: this.props.id,
                propKey: 'removeLayerFlag',
                value: true
            });
        };
        this.optionChangeSave = (prop, value) => {
            const currentLayer = this.props.config.layersConfig[this.index];
            if (currentLayer) {
                const orgConfig = this.props.config;
                const newConfig = orgConfig.setIn(['layersConfig', this.index.toString()], Object.assign(Object.assign({}, currentLayer), { [prop]: value }));
                const config = {
                    id: this.props.id,
                    config: newConfig
                };
                this.props.onSettingChange(config);
            }
        };
        this.multiOptionsChangeSave = (updateOptions) => {
            const currentLayer = this.props.config.layersConfig[this.index];
            if (currentLayer) {
                const orgConfig = this.props.config;
                const newConfig = orgConfig.setIn(['layersConfig', this.index.toString()], Object.assign(Object.assign({}, currentLayer), updateOptions));
                const config = {
                    id: this.props.id,
                    config: newConfig
                };
                this.props.onSettingChange(config);
            }
        };
        this.getStyle = (theme) => {
            return css `
      .widget-setting-edit {
        .layerlist-tools{
          .layerlist-tools-item{
            display: flex;
            margin-bottom: 8px;
          }
        }

        .filter-item {
          display: flex;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.25rem;
          line-height: 23px;
          cursor: pointer;
          background-color: ${theme.colors.secondary};

          .filter-item-icon {
            width: 14px;
            margin-right: 0.5rem;
          }
          .filter-item-name {
            word-wrap: break-word;
          }
        }

        .edit-tips{
          font-style: italic;
          font-size: 12px;
          color: ${theme.colors.palette.dark[500]};
        }
        .filter-item-active {
          border-left: 2px solid ${theme.colors.palette.primary[600]};
        }
        .capability-header{
          margin-bottom: 12px;
        }
        .capability-item{
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .empty-placeholder {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: calc(100% - 255px);
          overflow: hidden;
          .empty-placeholder-inner {
            padding: 0px 20px;
            flex-direction: column;
            align-items: center;
            display: flex;

            .empty-placeholder-text {
              color: ${theme.colors.palette.dark[500]};
              font-size: ${polished.rem(14)};
              margin-top: 16px;
              text-align: center;
            }
            .empty-placeholder-icon {
              color: ${theme.colors.palette.dark[200]};
            }
          }
        }

        .layer-tips {
          font-style: italic;
          font-size: 12px;
          color: ${theme.colors.palette.dark[500]};
          margin-top: 5px;
          .no-layer-tips {
            width: calc(100% - 20px);
            margin: 0 4px;
            color: ${theme.colors.danger}
          }
        }

        .setting-ui-unit-tree, .setting-ui-unit-list {
          width: 100%;
          .tree-item {
            justify-content: space-between;
            align-items: center;
            font-size: ${polished.rem(13)};
            &.tree-item_level-1 {
            }
            .jimu-checkbox {
              margin-right: .5rem;
            }
          }
        }
        .setting-ui-unit-list-new {
          padding-top: ${polished.rem(8)};
        }
      }
    `;
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
            this.onPropertyChange('layersConfig', []);
        };
        this.onShowLayerPanel = (index) => {
            const { showLayerPanel } = this.state;
            if (index === this.index) {
                this.setState({ showLayerPanel: !showLayerPanel });
            }
            else {
                this.setState({
                    showLayerPanel: true,
                    refreshPanel: !this.state.refreshPanel
                });
                this.index = index;
            }
        };
        this.onItemUpdated = (parentItemJson, currentIndex) => {
            const { id, config } = this.props;
            const newLayerConfigs = parentItemJson.map(item => {
                return item.itemStateDetailContent;
            });
            const newConfig = {
                id,
                config: config.set('layersConfig', newLayerConfigs)
            };
            this.updateDsHash(newLayerConfigs);
            this.onShowLayerPanel(currentIndex);
            this.props.onSettingChange(newConfig);
        };
        this.onCreateDataSourceCreatedOrFailed = (dataSourceId, dataSource) => {
            // The next state depends on the current state. Can't use this.state since it's not updated in in a cycle
            this.setState((state) => {
                const newDataSources = Object.assign({}, state.dataSources);
                newDataSources[dataSourceId] = dataSource;
                return { dataSources: newDataSources };
            });
        };
        this.isDataSourceAccessible = (dataSourceId) => {
            var _a;
            const dataSourceIsInProps = ((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.filter(useDs => dataSourceId === useDs.dataSourceId).length) > 0;
            return this.state.dataSources[dataSourceId] !== null && dataSourceIsInProps;
        };
        this.importAll = () => {
            const { useMapWidgetIds, config } = this.props;
            const { layersConfig } = config;
            const useMapWidget = useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0];
            const allLayers = getMapAllLayers(useMapWidget);
            const useDataSources = [];
            allLayers.forEach(layer => {
                var _a, _b;
                const haveUrl = (_a = layer === null || layer === void 0 ? void 0 : layer.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.url;
                if (haveUrl && layersConfig.findIndex(config => config.id === layer.id) === -1) {
                    useDataSources.push({
                        dataSourceId: layer.id,
                        mainDataSourceId: layer.id,
                        dataViewId: layer.dataViewId,
                        rootDataSourceId: (_b = layer.getRootDataSource()) === null || _b === void 0 ? void 0 : _b.id
                    });
                }
            });
            if (useDataSources.length > 0) {
                this.importAllLayersConfigSave(useDataSources);
            }
            else if (layersConfig.length === 0 && useDataSources.length === 0) {
                this.setState({ noEditLayer: true }, () => {
                    setTimeout(() => {
                        this.setState({ noEditLayer: false });
                    }, 3000);
                });
            }
        };
        this.onEditModeChange = (value) => {
            this.toBeChangedMode = value;
            const { config } = this.props;
            const { editMode, layersConfig } = config;
            // no layer config, switching mode directly
            if (layersConfig.length === 0) {
                this.onPropertyChange('editMode', this.toBeChangedMode);
                this.setState({ showLayerPanel: false });
                return;
            }
            if (value !== editMode) {
                this.setState({ changeModeConfirmOpen: true });
            }
        };
        this.handleChangeModeOk = () => {
            const changeArray = [
                { name: 'editMode', value: this.toBeChangedMode },
                { name: 'layersConfig', value: [] }
            ];
            this.onMultiplePropertyChange(changeArray);
            this.setState({ changeModeConfirmOpen: false, showLayerPanel: false });
        };
        this.handleChangeModeClose = () => {
            this.setState({ changeModeConfirmOpen: false });
        };
        this.onPropertyChange = (name, value) => {
            const { config } = this.props;
            if (value === config[name]) {
                return;
            }
            const newConfig = config.set(name, value);
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
        };
        this.onMultiplePropertyChange = (changeArr) => {
            const { config } = this.props;
            let newConfig = config;
            changeArr.forEach(item => {
                if (item.value === config[item.name])
                    return;
                newConfig = newConfig.set(item.name, item.value);
            });
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
        };
        this.index = 0;
        this.dsManager = DataSourceManager.getInstance();
        this.updateDsHash(this.props.config.layersConfig
            ? this.props.config.layersConfig
            : []);
        this.state = {
            showLayerPanel: false,
            refreshPanel: false,
            dataSources: {},
            changeModeConfirmOpen: false,
            noEditLayer: false
        };
    }
    getArrayMaxId(layersConfigs) {
        const numbers = layersConfigs.map(layersConfig => {
            return layersConfig.id.split('-').reverse()[0];
        });
        return numbers.length > 0 ? Math.max.apply(null, numbers) : 0;
    }
    render() {
        var _a, _b, _c, _d;
        const { showLayerPanel, changeModeConfirmOpen, noEditLayer } = this.state;
        const { theme, config, useMapWidgetIds } = this.props;
        const { layersConfig, editMode, selfSnapping, featureSnapping } = config;
        const isAttrMode = editMode === EditModeType.Attribute;
        const isGeoMode = editMode === EditModeType.Geometry;
        const newEditString = isAttrMode ? this.formatMessage('newEdit') : this.formatMessage('newEditGeo');
        const modeString = isAttrMode ? this.formatMessage('editableSource') : this.formatMessage('editableLayer');
        const itemsLength = layersConfig.length;
        const appConfig = getAppStore().getState().appStateInBuilder.appConfig;
        const useMapWidget = useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0];
        const btnDisabled = isGeoMode && ((!useMapWidgetIds || (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) === 0) || !((_a = appConfig.widgets) === null || _a === void 0 ? void 0 : _a[useMapWidget]));
        const advancedActionMap = {
            isItemFocused: (actionData, refComponent) => {
                const { itemJsons: [currentItemJson, parentArray] } = refComponent.props;
                return showLayerPanel && parentArray.indexOf(currentItemJson) === this.index;
            },
            overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
                return {
                    name: TreeItemActionType.RenderOverrideItem,
                    children: [{
                            name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemBody,
                                            children: [{
                                                    name: TreeItemActionType.RenderOverrideItemMainLine,
                                                    children: [{
                                                            name: TreeItemActionType.RenderOverrideItemDragHandle
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemIcon,
                                                            autoCollapsed: true
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemTitle
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemDetailToggle
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemCommands
                                                        }]
                                                }]
                                        }]
                                }]
                        }]
                };
            }
        };
        return (jsx("div", { css: this.getStyle(theme), className: 'h-100' },
            jsx("div", { className: 'jimu-widget-setting widget-setting-edit h-100' }, (_b = this.props.useDataSources) === null || _b === void 0 ? void 0 :
                _b.map((useDs, index) => {
                    return (jsx(LayerConfigDataSource, { key: index, useDataSource: useDs, onCreateDataSourceCreatedOrFailed: this.onCreateDataSourceCreatedOrFailed }));
                }),
                jsx(SettingSection, { className: `p-0 m-0 ${itemsLength > 0 ? '' : 'border-0'}`, role: 'group' },
                    jsx("div", { ref: this.sidePopperTrigger },
                        jsx(SettingSection, { className: 'border-0' },
                            jsx("div", { role: 'radiogroup', className: 'mb-3' },
                                jsx(Label, { className: 'd-flex align-items-center' },
                                    jsx(Radio, { style: { cursor: 'pointer' }, name: 'editModeType', className: 'mr-2', checked: isAttrMode, onChange: () => this.onEditModeChange(EditModeType.Attribute) }),
                                    this.formatMessage('attrMode')),
                                jsx(Label, { className: 'd-flex align-items-center' },
                                    jsx(Radio, { style: { cursor: 'pointer' }, name: 'editModeType', className: 'mr-2', checked: isGeoMode, onChange: () => this.onEditModeChange(EditModeType.Geometry) }),
                                    this.formatMessage('geoMode'))),
                            isGeoMode &&
                                jsx(Fragment, null,
                                    jsx(SettingRow, { label: this.formatMessage('selectMap') }),
                                    jsx(SettingRow, null,
                                        jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: useMapWidgetIds }),
                                        jsx(Button, { icon: true, size: 'sm', type: 'default', onClick: this.importAll, className: 'ml-1', title: this.formatMessage('importAll'), "aria-label": this.formatMessage('importAll') },
                                            jsx(ImportOutlined, null))),
                                    noEditLayer &&
                                        jsx("div", { className: 'text-break layer-tips d-flex align-items-center' },
                                            jsx(Fragment, null,
                                                jsx(WarningOutlined, { color: theme.colors.danger }),
                                                jsx("div", { className: 'no-layer-tips' }, this.formatMessage('noLayerTips'))))),
                            jsx(SettingRow, null,
                                jsx(Button, { className: 'w-100 text-dark set-link-btn', type: 'primary', onClick: () => {
                                        this.onShowLayerPanel(itemsLength);
                                    }, disabled: btnDisabled, title: newEditString, "aria-label": newEditString, "aria-describedby": 'edit-blank-msg' },
                                    jsx("div", { className: 'w-100 px-2 text-truncate' },
                                        jsx(PlusOutlined, { className: 'mr-1 mb-1' }),
                                        newEditString))),
                            jsx(SettingRow, null,
                                jsx("div", { className: 'text-break edit-tips' }, isGeoMode ? this.formatMessage('newMapEditTips') : this.formatMessage('newEditTips')))),
                        jsx(SettingSection, { className: 'pt-0 border-0' },
                            jsx("div", { className: 'setting-ui-unit-list' },
                                !!itemsLength &&
                                    jsx(List, Object.assign({ className: 'setting-ui-unit-list-exsiting', itemsJson: Array.from(config.layersConfig).map((item, index) => ({
                                            itemStateDetailContent: item,
                                            itemKey: `${index}`,
                                            itemStateTitle: item.name,
                                            itemStateCommands: [
                                                {
                                                    label: this.formatMessage('remove'),
                                                    iconProps: () => ({ icon: IconClose, size: 12 }),
                                                    action: () => {
                                                        this.removeLayer(index);
                                                    }
                                                }
                                            ]
                                        })), dndEnabled: true, renderOverrideItemDetailToggle: (actionData, refComponent) => {
                                            var _a, _b;
                                            const { itemJsons } = refComponent.props;
                                            const [currentItemJson] = itemJsons;
                                            const dsId = (_b = (_a = currentItemJson === null || currentItemJson === void 0 ? void 0 : currentItemJson.itemStateDetailContent) === null || _a === void 0 ? void 0 : _a.useDataSource) === null || _b === void 0 ? void 0 : _b.dataSourceId;
                                            const accessible = this.isDataSourceAccessible(dsId);
                                            return !accessible
                                                ? jsx(Alert, { buttonType: 'tertiary', form: 'tooltip', size: 'small', type: 'error', text: this.formatMessage('dataSourceCreateError') })
                                                : '';
                                        }, onUpdateItem: (actionData, refComponent) => {
                                            const { itemJsons } = refComponent.props;
                                            const [currentItemJson, parentItemJson] = itemJsons;
                                            this.onItemUpdated(parentItemJson, +currentItemJson.itemKey);
                                        }, onClickItemBody: (actionData, refComponent) => {
                                            const { itemJsons: [currentItemJson] } = refComponent.props;
                                            this.onShowLayerPanel(+currentItemJson.itemKey);
                                        } }, advancedActionMap)),
                                itemsLength === this.index && showLayerPanel &&
                                    jsx(List, Object.assign({ className: 'setting-ui-unit-list-new', itemsJson: [{
                                                name: '......'
                                            }].map((item, x) => ({
                                            itemStateDetailContent: item,
                                            itemKey: `${this.index}`,
                                            itemStateTitle: item.name,
                                            itemStateCommands: []
                                        })), dndEnabled: false, renderOverrideItemDetailToggle: () => '' }, advancedActionMap, { isItemFocused: () => true })))),
                        isGeoMode &&
                            jsx(SettingSection, { title: this.formatMessage('snappingSettings') },
                                jsx(SettingRow, { label: this.formatMessage('selfSnapping') },
                                    jsx(Switch, { className: 'can-x-switch', checked: selfSnapping, "data-key": 'selfSnapping', onChange: evt => this.onPropertyChange('selfSnapping', evt.target.checked), "aria-label": this.formatMessage('selfSnapping') })),
                                jsx(SettingRow, { label: this.formatMessage('featureSnapping') },
                                    jsx(Switch, { className: 'can-x-switch', checked: featureSnapping, "data-key": 'featureSnapping', onChange: evt => this.onPropertyChange('featureSnapping', evt.target.checked), "aria-label": this.formatMessage('featureSnapping') }))))),
                itemsLength === 0 && !showLayerPanel &&
                    jsx("div", { className: 'empty-placeholder w-100' },
                        jsx("div", { className: 'empty-placeholder-inner' },
                            jsx("div", { className: 'empty-placeholder-icon' },
                                jsx(ClickOutlined, { size: 48 })),
                            jsx("div", { className: 'empty-placeholder-text', id: 'edit-blank-msg', dangerouslySetInnerHTML: {
                                    __html: this.formatMessage('editBlankStatus', {
                                        EditString: newEditString,
                                        ModeString: modeString
                                    })
                                } }))),
                itemsLength > 0 && isAttrMode && (jsx(SettingSection, { title: this.formatMessage('iconGroup_general') },
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('description') },
                        jsx(TextArea, { className: 'w-100', height: 90, placeholder: this.formatMessage('editFieldDescription'), defaultValue: (_c = config.description) !== null && _c !== void 0 ? _c : '', onBlur: evt => this.onPropertyChange('description', evt.target.value) })),
                    isAttrMode &&
                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('noDataMessage') },
                            jsx(TextArea, { className: 'w-100', height: 75, placeholder: this.formatMessage('noDeataMessageDefaultText'), defaultValue: config.noDataMessage, onBlur: evt => this.onPropertyChange('noDataMessage', evt.target.value) })))),
                jsx(SidePopper, { isOpen: showLayerPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, position: 'right', toggle: this.onCloseLayerPanel, trigger: (_d = this.sidePopperTrigger) === null || _d === void 0 ? void 0 : _d.current },
                    jsx(LayerConfig, Object.assign({}, config.layersConfig.asMutable({ deep: true })[this.index], { intl: this.props.intl, theme: theme, editorConfig: this.props.config, dataSourceChange: this.dataSourceChangeSave, filterDs: this.onFilterDs, optionChange: this.optionChangeSave, multiOptionsChange: this.multiOptionsChangeSave, onClose: this.onCloseLayerPanel }))),
                changeModeConfirmOpen &&
                    jsx(ConfirmDialog, { level: 'warning', title: this.formatMessage('changeModeConfirmTitle'), hasNotShowAgainOption: false, content: this.formatMessage('changeModeConfirmTips'), onConfirm: this.handleChangeModeOk, onClose: this.handleChangeModeClose }))));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b;
    return {
        activeTabId: state && ((_b = (_a = state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.widgetsState[props.id]) === null || _b === void 0 ? void 0 : _b.activeTabId)
    };
};
//# sourceMappingURL=setting.js.map