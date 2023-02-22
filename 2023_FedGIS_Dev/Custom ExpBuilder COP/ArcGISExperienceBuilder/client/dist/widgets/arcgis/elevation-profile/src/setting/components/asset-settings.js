/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, getAppStore, Immutable, urlUtils, DataSourceManager, AllDataSourceTypes } from 'jimu-core';
import { ArcGISDataSourceTypes } from 'jimu-arcgis';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { SidePopper, SettingRow } from 'jimu-ui/advanced/setting-components';
import { Button, Switch, Icon, Label, Select, Option, Tooltip, AlertPopup, NumericInput, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { unitOptions, getConfigIcon, defaultAssetSettings } from '../constants';
import { getSidePanelStyle, getAdvanceSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import AssetSettingPopper from './asset-settings-popper';
import SidepopperBackArrow from './sidepopper-back-arrow';
import { defaultSelectedUnits, getRandomHexColor } from '../../common/utils';
const { epConfigIcon } = getConfigIcon();
export default class AssetSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
        this.selectedLayerDataSource = null;
        this.layerSidePopperTrigger = React.createRef();
        this.backRef = React.createRef();
        this.allSelectedLayers = [];
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.componentDidMount = () => {
            var _a, _b, _c, _d;
            if (((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layers) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                //empty the layer list
                this.setState({
                    selectedLayers: []
                });
            }
            else {
                (_d = (_c = this.props.config) === null || _c === void 0 ? void 0 : _c.layers) === null || _d === void 0 ? void 0 : _d.forEach((layer) => {
                    this.getLayerListProperty(layer.layerId);
                    //display updated layers list in config
                    this.setState({
                        selectedLayers: this.allSelectedLayers
                    });
                });
            }
        };
        this.componentDidUpdate = (prevProps) => {
        };
        this.getLayerListProperty = (layerId) => {
            const dsObj = DataSourceManager.getInstance().getDataSource(layerId);
            if (dsObj) {
                const label = dsObj.getLabel();
                const layerObj = {
                    label: label,
                    layer: dsObj
                };
                this.allSelectedLayers.push(layerObj);
            }
        };
        this.getDsRootIdsByWidgetId = () => {
            var _a, _b;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = appConfig;
            const rootIds = [];
            const ds = widgetJson.dataSources[this.props.activeDataSource];
            if ((ds === null || ds === void 0 ? void 0 : ds.type) === ArcGISDataSourceTypes.WebMap || (ds === null || ds === void 0 ? void 0 : ds.type) === ArcGISDataSourceTypes.WebScene) { // is root ds
                rootIds.push(this.props.activeDataSource);
            }
            return rootIds.length > 0 ? Immutable(rootIds) : undefined;
        };
        // save currentSelectedDs to array
        this.dataSourceChangeSave = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            //if layer is already selected then show the alert message and do not add the layer in the list again
            let isLayerAlreadySelected = false;
            // eslint-disable-next-line
            this.allSelectedLayers.some((data) => {
                if (data.layer.id === useDataSources[0].dataSourceId) {
                    isLayerAlreadySelected = true;
                    this.setState({
                        isAlertMsgPopupOpen: true
                    });
                    return true;
                }
            });
            //display updated layers list in config
            if (!isLayerAlreadySelected) {
                useDataSources.forEach((data, index) => {
                    this.getLayerListProperty(data.dataSourceId);
                });
                this.setState({
                    selectedLayers: this.allSelectedLayers
                }, () => {
                    setTimeout(() => {
                        this.layerSidePopperTrigger.current.focus();
                    }, 50);
                });
                //update the layers config of newly added layers with its default config
                this.updateLayersConfig = this.getLayersDefaultSettings(this.allSelectedLayers);
                const finalLayerUpdate = [...this.props.config.layers, this.updateLayersConfig[0]];
                this.props.onAssetSettingsUpdated('assetSettings', this.props.activeDataSource, null, null, finalLayerUpdate, true);
            }
        };
        this.getLayersDefaultSettings = (selectedData) => {
            let newLayerDefaultConfig = [];
            //if no layer is configured then configure the default settings to the selected Ds
            if (this.props.config.layers.length === 0) {
                selectedData.forEach((layerdata, index) => {
                    newLayerDefaultConfig = this.getAssetDefaultConfigOnAdd(layerdata.layer);
                });
            }
            else {
                //configure newly added Ds settings and append to the existing configured settings
                selectedData.forEach((newData) => {
                    if (!this.isLayerAlreadyConfigured(newData.layer.id)) {
                        newLayerDefaultConfig = this.getAssetDefaultConfigOnAdd(newData.layer);
                    }
                });
            }
            return newLayerDefaultConfig;
        };
        this.isLayerAlreadyConfigured = (layerId) => {
            let isConfigured = false;
            this.props.config.layers.forEach((configData) => {
                if (layerId === configData.layerId) {
                    isConfigured = true;
                    return true;
                }
            });
            return isConfigured;
        };
        /**
         *
        On click of layer in the list, opens the individual layer config in the same sidepopper
        */
        this.showLayerData = (item, index) => {
            this.setState({
                showLayerDataItemPanel: true,
                layerName: item.label
            }, () => {
                var _a;
                (_a = this.backRef.current) === null || _a === void 0 ? void 0 : _a.backRefFocus();
            });
            this.selectedLayerDataSource = {
                dataSourceId: item.layer.dataSourceJson.id,
                rootDataSourceId: item.layer.parentDataSource.id,
                layer: item.layer
            };
            //get the saved config of selected layer
            this.selectedLayerConfig = this.getSelectedLayerConfig(item.layer.id);
            this.hasSupportForZValue = item.layer.layerDefinition.hasZ;
        };
        this.getSelectedLayerConfig = (layerId) => {
            let layerConfig;
            this.props.config.layers.forEach((layerDetails) => {
                if (layerId === layerDetails.layerId) {
                    layerConfig = layerDetails;
                }
            });
            return layerConfig;
        };
        /**
        *@param index Remove layer data individual item
        */
        this.removeLayerDataItem = (evt, index, layerid) => {
            var _a, _b;
            evt.stopPropagation();
            //display updated layers list in config
            const layersList = this.state.selectedLayers;
            layersList.splice(index, 1);
            this.allSelectedLayers = layersList;
            this.setState({
                selectedLayers: this.allSelectedLayers
            }, () => {
                this.layerSidePopperTrigger.current.focus();
            });
            //update the layers config after removing the layers
            (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layers) === null || _b === void 0 ? void 0 : _b.forEach((layer, index) => {
                if (layer.layerId === layerid) {
                    const layersArr = this.props.config.layers;
                    const configLayers = layersArr.asMutable({ deep: true });
                    configLayers.splice(index, 1);
                    this.updateLayersConfig = configLayers;
                    this.props.onAssetSettingsUpdated('assetSettings', this.props.activeDataSource, null, null, this.updateLayersConfig, true);
                }
            });
        };
        /**
         *Create layers list with layers name and delete button to remove the layers
        */
        this.createLayerElement = (item, index) => {
            const _datasourceOptions = (jsx("div", { ref: this.layerSidePopperTrigger, "aria-label": item.label, tabIndex: 0, key: index + Date.now(), className: 'layer-data-item align-items-center' },
                jsx("div", { className: 'layer-data-item-name flex-grow-1', title: item.label }, item.label),
                jsx(Button, { role: 'button', title: this.nls('deleteLayer'), "aria-label": this.nls('deleteLayer'), size: 'sm', type: 'tertiary', icon: true, className: 'p-0', key: index + Date.now(), onClick: (e) => { this.removeLayerDataItem(e, index, item.layer.id); }, onKeyDown: e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            this.removeLayerDataItem(e, index, item.layer.id);
                        }
                    } },
                    jsx(Icon, { icon: epConfigIcon.iconClose, size: 12 }))));
            return _datasourceOptions;
        };
        this.getLayerIndex = (layerId) => {
            let layerIndex = -1;
            this.props.config.layers.forEach((layerDetails, index) => {
                if (layerId === layerDetails.layerId) {
                    layerIndex = index;
                }
            });
            return layerIndex;
        };
        this.updateConfig = (objectKey, subProperty, value) => {
            const traversalObj = {
                parentKey: objectKey,
                childKey: subProperty,
                value: value
            };
            const layerIndex = this.getLayerIndex(this.selectedLayerConfig.layerId);
            this.props.onAssetSettingsUpdated('assetSettings', this.props.activeDataSource, layerIndex, traversalObj, null, false);
        };
        /**
        *On click of back button close the layer settings panel and come back to the datasource settings panel
        */
        this.backForwardPanel = () => {
            this.setState({
                showLayerDataItemPanel: false
            }, () => {
                this.layerSidePopperTrigger.current.focus();
            });
        };
        this.closePanel = () => {
            this.setState({
                showLayerDataItemPanel: false
            }, () => {
                this.layerSidePopperTrigger.current.focus();
            });
            this.index = 0;
        };
        this.onIntersectionBufferChange = (evt) => {
            this.props.onAssetBufferSettingsUpdated('enabled', evt.currentTarget.checked);
        };
        this.onBufferDistanceChange = (value) => {
            if (value === null) {
                return;
            }
            this.setState({
                bufferDistanceInput: value
            }, () => {
                this.props.onAssetBufferSettingsUpdated('bufferDistance', this.state.bufferDistanceInput);
            });
        };
        this.onBufferUnitsChange = (evt) => {
            this.setState({
                bufferUnit: evt.target.value
            }, () => {
                this.props.onAssetBufferSettingsUpdated('bufferUnits', this.state.bufferUnit);
            });
        };
        this.disableSelection = (useDataSources) => {
            return false;
        };
        /**
        *Hide the Alert message popup
        */
        this.hideMessage = () => {
            this.setState({
                isAlertMsgPopupOpen: false
            });
        };
        this.index = 0;
        this.updateLayersConfig = this.props.config.layers;
        this.state = {
            selectedLayers: [],
            showLayerDataItemPanel: false,
            layerName: null,
            bufferDistanceInput: this.props.config.assetIntersectionBuffer.bufferDistance,
            bufferUnit: this.props.config.assetIntersectionBuffer.bufferUnits,
            isAlertMsgPopupOpen: false
        };
    }
    getAssetDefaultConfigOnAdd(layer) {
        const defaultUnit = defaultSelectedUnits(this.props.activeDsConfig, this.props.portalSelf);
        const geometryType = 'esriGeometryPolyline';
        const defaultConfig = [];
        //get config of only newly added profile or asset layers
        if (layer && layer.layerDefinition && layer.layerDefinition.geometryType &&
            layer.layerDefinition.geometryType === geometryType) {
            let defaultElevationType = 'no elevation';
            //if layer having elevation info then set default elevation type as z
            if (layer.layerDefinition.hasZ) {
                defaultElevationType = 'z';
            }
            const defaultAssetSettingsObj = Object.assign({}, defaultAssetSettings);
            defaultAssetSettingsObj.style.bulletColor = getRandomHexColor();
            defaultAssetSettingsObj.elevationSettings.unit = defaultUnit[0];
            defaultAssetSettingsObj.elevationSettings.oneFieldLabel = this.nls('oneFieldLabel');
            defaultAssetSettingsObj.elevationSettings.twoFieldLabel = this.nls('twoFieldLabel');
            defaultAssetSettingsObj.layerId = layer.id;
            defaultAssetSettingsObj.elevationSettings.type = defaultElevationType;
            defaultConfig.push(Immutable(defaultAssetSettingsObj));
        }
        return defaultConfig;
    }
    render() {
        var _a;
        const ds = DataSourceManager.getInstance().getDataSource(this.props.activeDataSource);
        const childDs = ds === null || ds === void 0 ? void 0 : ds.getChildDataSources();
        const dsRootIdsArr = [];
        childDs.forEach((layer) => {
            var _a;
            //display only the point layers in data source selector depending on its geometry type
            if (layer.type === 'GROUP_LAYER') {
                const subLayers = layer.getChildDataSources();
                if (subLayers) {
                    subLayers.forEach(subLayer => {
                        var _a;
                        if (((_a = subLayer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) === 'esriGeometryPoint') {
                            dsRootIdsArr.push(subLayer.id);
                        }
                    });
                }
            }
            else {
                if (((_a = layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) === 'esriGeometryPoint') {
                    dsRootIdsArr.push(layer.id);
                }
            }
        });
        const dsRootIds = this.getDsRootIdsByWidgetId();
        //dsObject parameters used to pass to the ds selector
        const dsSelectorSource = {
            fromRootDsIds: dsRootIds,
            fromDsIds: Immutable(dsRootIdsArr)
        };
        return jsx("div", { css: getAdvanceSettingsStyle(this.props.theme), style: { height: '100%', width: '100%', marginTop: 5 } },
            jsx(SettingRow, null,
                jsx(Label, { tabIndex: 0, "aria-label": this.nls('intersectingLayersLabel'), className: 'w-100 d-flex' },
                    jsx("div", { className: 'flex-grow-1 text-break color-label' }, this.nls('intersectingLayersLabel'))),
                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('intersectingLayersTooltip'), title: this.nls('intersectingLayersTooltip'), showArrow: true, placement: 'top' },
                    jsx("div", { className: 'ml-2 d-inline color-label ep-tooltip' },
                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
            jsx(SettingRow, null,
                jsx(DataSourceSelector, { className: 'ep-data-source-selector', types: this.supportedDsTypes, buttonLabel: this.nls('selectableButton'), fromRootDsIds: dsSelectorSource.fromRootDsIds, fromDsIds: dsSelectorSource.fromDsIds, mustUseDataSource: true, onChange: this.dataSourceChangeSave, disableDataView: true, enableToSelectOutputDsFromSelf: false, closeDataSourceListOnChange: true, hideTypeDropdown: false, hideAddDataButton: true, disableRemove: () => true, disableSelection: this.disableSelection, widgetId: this.props.widgetId, hideDataView: true })),
            jsx(SettingRow, { className: this.state.selectedLayers.length > 0 ? '' : 'hidden' },
                jsx(List, { className: 'ep-layers-list', itemsJson: Array.from(this.state.selectedLayers).map((options, index) => ({
                        itemStateDetailContent: options,
                        itemKey: `${index}`
                    })), dndEnabled: false, isItemFocused: () => {
                        return false;
                    }, onClickItemBody: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const currentItemJson = itemJsons[0];
                        const listItemJsons = itemJsons[1];
                        this.showLayerData(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
                    }, overrideItemBlockInfo: () => {
                        return {
                            name: TreeItemActionType.RenderOverrideItem,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemBody,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemMainLine
                                        }]
                                }]
                        };
                    }, renderOverrideItemMainLine: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const currentItemJson = itemJsons[0];
                        const listItemJsons = itemJsons[1];
                        return this.createLayerElement(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
                    } })),
            jsx(SettingRow, null,
                jsx(Label, { tabIndex: 0, "aria-label": this.nls('intersectionSettingsLabel'), className: 'w-100 d-flex' },
                    jsx("div", { className: 'flex-grow-1 text-break color-label' }, this.nls('intersectionSettingsLabel'))),
                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('intersectionSettingsTooltip'), title: this.nls('intersectionSettingsTooltip'), showArrow: true, placement: 'top' },
                    jsx("div", { className: 'ml-2 d-inline color-label ep-tooltip' },
                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
            jsx(SettingRow, { label: this.nls('useBuffer') },
                jsx(Switch, { role: 'switch', "aria-label": this.nls('useBuffer'), title: this.nls('useBuffer'), checked: this.props.config.assetIntersectionBuffer.enabled, "aria-expanded": this.props.config.assetIntersectionBuffer.enabled, onChange: this.onIntersectionBufferChange })),
            this.props.config.assetIntersectionBuffer.enabled &&
                jsx("div", { className: 'pt-2 pb-2', "aria-expanded": this.props.config.assetIntersectionBuffer.enabled },
                    jsx(SettingRow, null,
                        jsx(NumericInput, { style: { width: 112 }, "aria-label": this.state.bufferUnit, size: 'sm', defaultValue: this.state.bufferDistanceInput, min: 0, showHandlers: false, onChange: this.onBufferDistanceChange }),
                        jsx(Select, { menuRole: 'menu', "aria-label": this.state.bufferUnit, style: { width: 121 }, className: 'pl-2', size: 'sm', name: 'bufferUnits', value: this.state.bufferUnit, onChange: this.onBufferUnitsChange }, unitOptions.map((option, index) => {
                            return jsx(Option, { role: 'option', "aria-label": option.value, key: index, value: option.value }, this.nls(option.value));
                        })))),
            jsx(SidePopper, { isOpen: this.state.showLayerDataItemPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, position: 'right', toggle: this.closePanel, trigger: (_a = this.layerSidePopperTrigger) === null || _a === void 0 ? void 0 : _a.current },
                jsx("div", { className: 'bg-light-300 border-color-gray-400', css: getSidePanelStyle(this.props.theme) },
                    jsx(SidepopperBackArrow, { theme: this.props.theme, intl: this.props.intl, title: this.state.layerName, ref: this.backRef, onBack: this.backForwardPanel, onClose: this.closePanel },
                        jsx("div", { className: 'setting-container' },
                            jsx(AssetSettingPopper, { config: this.selectedLayerConfig, hasSupportForZValue: this.hasSupportForZValue, selectedLayerDataSource: this.selectedLayerDataSource, availableStatsForDisplay: this.props.allAvailableStatistics, intl: this.props.intl, theme: this.props.theme, updateAssetSettings: this.updateConfig.bind(this) }))))),
            this.state.isAlertMsgPopupOpen &&
                jsx(AlertPopup, { "aria-expanded": this.state.isAlertMsgPopupOpen, hideCancel: true, isOpen: this.state.isAlertMsgPopupOpen && !urlUtils.getAppIdPageIdFromUrl().pageId, onClickOk: this.hideMessage.bind(this), onClickClose: this.hideMessage.bind(this), title: this.nls('alert') },
                    jsx("div", { className: 'p-2' }, this.nls('alreadySelectedLayerMsg'))));
    }
}
//# sourceMappingURL=asset-settings.js.map