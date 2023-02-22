/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, getAppStore, urlUtils, Immutable, DataSourceManager, AllDataSourceTypes } from 'jimu-core';
import { ArcGISDataSourceTypes, MapViewManager } from 'jimu-arcgis';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { SidePopper, SettingRow } from 'jimu-ui/advanced/setting-components';
import { Button, Icon, Tooltip, AlertPopup, Label, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { getSidePanelStyle, getAdvanceSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import ProfileSettingPopper from './profile-settings-popper';
import SidepopperBackArrow from './sidepopper-back-arrow';
import { defaultSelectedUnits, getRandomHexColor } from '../../common/utils';
import { getConfigIcon, defaultProfileSettings } from '../constants';
const { epConfigIcon } = getConfigIcon();
export default class ProfileSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
        this.mvManager = MapViewManager.getInstance();
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
            var _a;
            if ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layers) {
                this.props.config.layers.forEach((layer, index) => {
                    this.getLayerListProperty(layer.layerId);
                });
                //display updated layers list in config
                this.setState({
                    selectedLayers: this.allSelectedLayers
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
            //display updated layers list  in config
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
                this.props.onProfileSettingsUpdated('profileSettings', this.props.activeDataSource, null, null, finalLayerUpdate, true);
            }
        };
        this.getLayersDefaultSettings = (selectedData) => {
            let newLayerDefaultConfig = [];
            //if no layer is configured then configure the default settings to the selected Ds
            if (this.props.config.layers.length === 0) {
                selectedData.forEach((layerdata, index) => {
                    newLayerDefaultConfig = this.getProfileDefaultConfigOnAdd(layerdata.layer);
                });
            }
            else {
                //configure newly added Ds settings and append to the existing configured settings
                selectedData.forEach((newData) => {
                    if (!this.isLayerAlreadyConfigured(newData.layer.id)) {
                        newLayerDefaultConfig = this.getProfileDefaultConfigOnAdd(newData.layer);
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
            var _a, _b, _c, _d;
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
            //check the availability of vertical unit parameter in case of z value
            this.hasSupportForZValue = item.layer.layerDefinition.hasZ;
            const individualLayerData = this.mapView.view.map.findLayerById(item.layer.jimuChildId);
            const mapLayer = individualLayerData;
            this.hasVerticalUnitParam = ((_b = (_a = mapLayer === null || mapLayer === void 0 ? void 0 : mapLayer.sourceJSON) === null || _a === void 0 ? void 0 : _a.sourceSpatialReference) === null || _b === void 0 ? void 0 : _b.vcsWkid) || ((_d = (_c = mapLayer.sourceJSON) === null || _c === void 0 ? void 0 : _c.sourceSpatialReference) === null || _d === void 0 ? void 0 : _d.vcsWkt);
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
        *@param index Remove individual layer item
        */
        this.removeLayerDataItem = (evt, index, layerid) => {
            var _a, _b;
            evt.stopPropagation();
            //display updated layers list  in config
            const layersList = this.state.selectedLayers;
            layersList.splice(index, 1);
            this.allSelectedLayers = layersList;
            this.setState({
                selectedLayers: this.allSelectedLayers
            }, () => {
                this.layerSidePopperTrigger.current.focus();
            });
            //update the layers config after removing of layers
            (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.layers) === null || _b === void 0 ? void 0 : _b.forEach((layer, index) => {
                if (layer.layerId === layerid) {
                    const layersArr = this.props.config.layers;
                    const configLayers = layersArr.asMutable({ deep: true });
                    configLayers.splice(index, 1);
                    this.updateLayersConfig = configLayers;
                    this.props.onProfileSettingsUpdated('profileSettings', this.props.activeDataSource, null, null, this.updateLayersConfig, true);
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
        /**
         Update the config of individual layer if there is any changes in settings
        */
        this.updateConfig = (objectKey, subProperty, value) => {
            const traversalObj = {
                parentKey: objectKey,
                childKey: subProperty,
                value: value
            };
            const layerIndex = this.getLayerIndex(this.selectedLayerConfig.layerId);
            this.props.onProfileSettingsUpdated('profileSettings', this.props.activeDataSource, layerIndex, traversalObj, null, false);
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
        this.disableSelection = (useDataSources) => {
            return false;
        };
        /**
         * Hide the Alert message popup
         */
        this.hideMessage = () => {
            this.setState({
                isAlertMsgPopupOpen: false
            });
        };
        this.index = 0;
        this.updateLayersConfig = this.props.config.layers;
        const mapViewGroup = this.mvManager.jimuMapViewGroups[this.props.mapWidgetId];
        for (const id in mapViewGroup.jimuMapViews) {
            if (mapViewGroup.jimuMapViews[id].dataSourceId === this.props.activeDataSource) {
                this.mapView = mapViewGroup.jimuMapViews[id];
            }
        }
        this.state = {
            selectedLayers: [],
            showLayerDataItemPanel: false,
            layerName: null,
            isAlertMsgPopupOpen: false
        };
    }
    getProfileDefaultConfigOnAdd(layer) {
        var _a, _b, _c;
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
            const defaultProfileSettingsObj = Object.assign({}, defaultProfileSettings);
            //if shape length field available in the layer use it as default distance field
            if (((_a = layer === null || layer === void 0 ? void 0 : layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.hasGeometryProperties) &&
                ((_c = (_b = layer === null || layer === void 0 ? void 0 : layer.layerDefinition) === null || _b === void 0 ? void 0 : _b.geometryProperties) === null || _c === void 0 ? void 0 : _c.shapeLengthFieldName)) {
                defaultProfileSettingsObj.distanceSettings.field = layer.layerDefinition.geometryProperties.shapeLengthFieldName;
            }
            else {
                defaultProfileSettingsObj.distanceSettings.field = '';
            }
            defaultProfileSettingsObj.style.lineColor = getRandomHexColor();
            defaultProfileSettingsObj.elevationSettings.unit = defaultUnit[0];
            defaultProfileSettingsObj.distanceSettings.unit = defaultUnit[1];
            defaultProfileSettingsObj.layerId = layer.id;
            defaultProfileSettingsObj.elevationSettings.type = defaultElevationType;
            defaultConfig.push(Immutable(defaultProfileSettingsObj));
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
            //display only the line layers in data source selector depending on its geometry type
            if (layer.type === 'GROUP_LAYER') {
                const subLayers = layer.getChildDataSources();
                if (subLayers) {
                    subLayers.forEach(subLayer => {
                        var _a;
                        if (((_a = subLayer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) === 'esriGeometryPolyline') {
                            dsRootIdsArr.push(subLayer.id);
                        }
                    });
                }
            }
            else {
                if (((_a = layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) === 'esriGeometryPolyline') {
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
                jsx(Label, { tabIndex: 0, "aria-label": this.nls('selectableLayersLabel'), className: 'w-100 d-flex' },
                    jsx("div", { className: 'flex-grow-1 text-break color-label' }, this.nls('selectableLayersLabel'))),
                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('selectableLayersTooltip'), title: this.nls('selectableLayersTooltip'), showArrow: true, placement: 'top' },
                    jsx("div", { className: 'ml-2 d-inline color-label ep-tooltip' },
                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
            jsx(SettingRow, null,
                jsx(DataSourceSelector, { className: 'ep-data-source-selector', types: this.supportedDsTypes, buttonLabel: this.nls('selectableButton'), fromRootDsIds: dsSelectorSource.fromRootDsIds, fromDsIds: dsSelectorSource.fromDsIds, mustUseDataSource: true, onChange: this.dataSourceChangeSave, disableDataView: true, enableToSelectOutputDsFromSelf: false, closeDataSourceListOnChange: true, hideTypeDropdown: false, disableAddData: true, disableRemove: () => true, disableSelection: this.disableSelection, widgetId: this.props.widgetId, hideDataView: true })),
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
            jsx(SidePopper, { isOpen: this.state.showLayerDataItemPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, position: 'right', toggle: this.closePanel, trigger: (_a = this.layerSidePopperTrigger) === null || _a === void 0 ? void 0 : _a.current },
                jsx("div", { className: 'bg-light-300 border-color-gray-400', css: getSidePanelStyle(this.props.theme) },
                    jsx(SidepopperBackArrow, { theme: this.props.theme, intl: this.props.intl, title: this.state.layerName, ref: this.backRef, onBack: this.backForwardPanel, onClose: this.closePanel },
                        jsx("div", { className: 'setting-container' },
                            jsx(ProfileSettingPopper, { activeDs: this.props.activeDataSource, activeDatasourceConfig: this.props.activeDsConfig, config: this.selectedLayerConfig, hasVerticalUnit: this.hasVerticalUnitParam, hasSupportForZValue: this.hasSupportForZValue, selectedLayerDataSource: this.selectedLayerDataSource, availableStatsForDisplay: this.props.allAvailableStatistics, intl: this.props.intl, theme: this.props.theme, updateProfileSettings: this.updateConfig.bind(this) }))))),
            this.state.isAlertMsgPopupOpen &&
                jsx(AlertPopup, { "aria-expanded": this.state.isAlertMsgPopupOpen, hideCancel: true, isOpen: this.state.isAlertMsgPopupOpen && !urlUtils.getAppIdPageIdFromUrl().pageId, onClickOk: this.hideMessage.bind(this), onClickClose: this.hideMessage.bind(this), title: this.nls('alert') },
                    jsx("div", { className: 'p-2' }, this.nls('alreadySelectedLayerMsg'))));
    }
}
//# sourceMappingURL=profile-settings.js.map