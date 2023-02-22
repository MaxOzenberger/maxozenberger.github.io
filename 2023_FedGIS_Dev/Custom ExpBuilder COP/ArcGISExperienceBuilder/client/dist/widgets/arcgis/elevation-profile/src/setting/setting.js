/** @jsx jsx */
import { React, jsx, DataSourceManager, urlUtils, defaultMessages as jimuCoreDefaultMessages, getAppStore, Immutable } from 'jimu-core';
import { Icon, Switch, Tooltip, Button, Alert, Label, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { MapWidgetSelector, SettingSection, SettingRow, SettingCollapse, SidePopper } from 'jimu-ui/advanced/setting-components';
import { BaseWidgetSetting } from 'jimu-for-builder';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { MapViewManager } from 'jimu-arcgis';
import defaultMessages from './translations/default';
import { getStyle, getStyleForLI } from './lib/style';
import { defaultConfiguration, defaultProfileSettings, epStatistics, defaultElevationLayer, getConfigIcon } from './constants';
import ProfileSetting from './components/profile-settings';
import ProfileChartSettings from './components/profile-chart-settings';
import GeneralSettings from './components/general-setting';
import { getAllLayersFromDataSource, defaultSelectedUnits, getRandomHexColor } from '../common/utils';
const { epConfigIcon } = getConfigIcon();
export default class Setting extends BaseWidgetSetting {
    constructor(props) {
        var _a;
        super(props);
        this.mvManager = MapViewManager.getInstance();
        this.dataSourceOptions = [];
        this.groundData = [];
        this._mapLoadedTimer = null;
        this._mapViewGroupLoad = null;
        this.sidePopperTrigger = React.createRef();
        this.sidePopperDsHeader = React.createRef();
        this.dsRef = React.createRef();
        this.profileSettingsRef = React.createRef();
        this.componentDidMount = () => {
            var _a, _b;
            //Compare the saved data with current map view data sources
            //and filter out the data sources which are not available in the map view
            //this will make sure to remove the data sources which are not available in the map view
            //populate configured data sources for map
            let isNoneMapSelected;
            if (this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0) {
                const useMapWidget = (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0];
                const appConfig = getAppStore().getState().appStateInBuilder.appConfig;
                const mapWidgetAvailable = (_b = appConfig.widgets) === null || _b === void 0 ? void 0 : _b[useMapWidget];
                if (!mapWidgetAvailable) {
                    this.resetConfig();
                    isNoneMapSelected = true;
                }
                else {
                    isNoneMapSelected = false;
                    this.createStatistics();
                    this.getAvailableDataSources(this.props.useMapWidgetIds);
                }
            }
            else { //display the warning message to select the webmap or webscene
                isNoneMapSelected = true;
            }
            this.updateConfigForMapWidget(isNoneMapSelected);
        };
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.updateConfigForMapWidget = (isMapWidgetAvailable) => {
            setTimeout(() => {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('useMapWidget', !isMapWidgetAvailable)
                });
            }, 50);
            this.setState({
                mapWidgetExists: !isMapWidgetAvailable,
                isNoMapSelected: isMapWidgetAvailable
            });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.resetConfig();
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
            let isNoneMapSelected;
            if (useMapWidgetIds.length > 0) {
                isNoneMapSelected = false;
                this.createStatistics();
                this.getAvailableDataSources(useMapWidgetIds);
            }
            else { //display the warning message to select the webmap or webscene
                isNoneMapSelected = true;
            }
            this.updateConfigForMapWidget(isNoneMapSelected);
        };
        this.createStatistics = () => {
            const avalaibleStatistics = epStatistics;
            const allAvailableStats = [];
            //all available statistics present in JS API widget
            avalaibleStatistics.forEach((stat) => {
                const supportedStats = {
                    name: stat.value,
                    label: this.nls(stat.value),
                    enabled: true
                };
                allAvailableStats.push(supportedStats);
            });
            allAvailableStats.sort((a, b) => a.label.localeCompare(b.label));
            this.setState({
                availableStats: allAvailableStats
            });
        };
        this.resetConfig = () => {
            //Reset config parameters
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('configInfo', {})
            });
        };
        this.getConfigForSelectedDs = (activeDataSource) => {
            if (!Object.prototype.hasOwnProperty.call(this.props.config.configInfo, activeDataSource)) {
                const config = defaultConfiguration;
                //If config is open for the first time then create the default config
                config.profileChartSettings.isCustomElevationLayer = this.state.isUseCustomElevationLayer;
                //If no ground elevation layer available in webmap/webscene then set as custom elevation layer
                let elevationLayerURL = defaultElevationLayer;
                if (!this.state.isUseCustomElevationLayer) {
                    elevationLayerURL = this.state.useElevationLayer;
                }
                config.profileChartSettings.elevationLayerURL = elevationLayerURL;
                config.profileChartSettings.selectedStatistics = this.state.availableStats;
                if (this.state.activeDataSource !== 'default') {
                    config.profileSettings.layers = this.populateDefaultSettings(activeDataSource);
                }
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['configInfo', activeDataSource], config)
                });
            }
        };
        this.populateDefaultSettings = (activeDataSource) => {
            const geometryType = 'esriGeometryPolyline';
            const defaultConfig = [];
            const allLayerSources = getAllLayersFromDataSource(activeDataSource);
            const defaultUnits = defaultSelectedUnits(this.props.config.configInfo[activeDataSource], this.props.portalSelf);
            //If the config is opened for first time then create the default config
            allLayerSources === null || allLayerSources === void 0 ? void 0 : allLayerSources.forEach((layer) => {
                var _a, _b, _c;
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
                    const layerObject = Object.assign({}, defaultProfileSettingsObj);
                    layerObject.layerId = layer.id;
                    layerObject.elevationSettings.type = defaultElevationType;
                    layerObject.elevationSettings.unit = defaultUnits[0];
                    layerObject.distanceSettings.unit = defaultUnits[1];
                    layerObject.style.lineColor = getRandomHexColor();
                    defaultConfig.push(Immutable(layerObject));
                }
            });
            return defaultConfig;
        };
        this.getDataSourceLabel = (dataSourceId) => {
            if (!dataSourceId) {
                return '';
            }
            const dsObj = DataSourceManager.getInstance().getDataSource(dataSourceId);
            const label = dsObj.getLabel();
            return label || dataSourceId;
        };
        this.updateConfigAsPerNewWebMap = () => {
            var _a, _b;
            const dataSourcesToMatch = [];
            if (this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0) {
                const getMapViewGroup = this.getMapViewGroupInstance(this.props.useMapWidgetIds[0]);
                const updatedMapViewGroups = getMapViewGroup[0];
                const mapWidgetInstance = getMapViewGroup[1];
                let config = this.props.config.configInfo.asMutable({ deep: true });
                if (updatedMapViewGroups && updatedMapViewGroups.jimuMapViews) {
                    for (const id in updatedMapViewGroups.jimuMapViews) {
                        if (updatedMapViewGroups.jimuMapViews[id].dataSourceId) {
                            dataSourcesToMatch.push(updatedMapViewGroups.jimuMapViews[id].dataSourceId);
                        }
                        else {
                            dataSourcesToMatch.push('default');
                        }
                    }
                }
                //Remove unwanted data from config
                //Apply specific condition to avoid deletion of config if there are two webmaps/webscene but they are not fully loaded
                if (((_b = (_a = mapWidgetInstance === null || mapWidgetInstance === void 0 ? void 0 : mapWidgetInstance.props) === null || _a === void 0 ? void 0 : _a.useDataSources) === null || _b === void 0 ? void 0 : _b.length) !== 2) {
                    for (const dsId in config) {
                        if (dsId !== 'useMapWidgetIds' && dsId !== 'activeDataSource' &&
                            !dataSourcesToMatch.includes(dsId)) {
                            delete config[dsId];
                        }
                        else {
                            config = this.updateLayersFromConfig(dsId, config);
                        }
                    }
                }
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('configInfo', Immutable(config))
                });
            }
        };
        this.updateLayersFromConfig = (activeDataSource, config) => {
            var _a, _b, _c, _d;
            const pointLayerIds = [];
            const lineLayerIds = [];
            const assetSettingsLayerIds = [];
            const profileSettingsLayerIds = [];
            const dataSource = getAllLayersFromDataSource(activeDataSource);
            dataSource === null || dataSource === void 0 ? void 0 : dataSource.forEach((layer) => {
                if (layer && layer.layerDefinition && layer.layerDefinition.geometryType) {
                    if (layer.layerDefinition.geometryType === 'esriGeometryPoint') {
                        pointLayerIds.push(layer.id);
                    }
                    else if (layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                        lineLayerIds.push(layer.id);
                    }
                }
            });
            //Loop through all profile settings configuration
            //Any layer which does not falls in the point or line layer arrays
            //are not present in the webmap/webscene
            //delete those layers from the configuration
            (_b = (_a = this.props.config.configInfo[activeDataSource].profileSettings) === null || _a === void 0 ? void 0 : _a.layers) === null || _b === void 0 ? void 0 : _b.forEach((layerDetails, index) => {
                if (!lineLayerIds.includes(layerDetails.layerId)) {
                    config[activeDataSource].profileSettings.layers.splice(index, 1);
                }
                else {
                    profileSettingsLayerIds.push(layerDetails.layerId);
                }
            });
            (_d = (_c = this.props.config.configInfo[activeDataSource].assetSettings) === null || _c === void 0 ? void 0 : _c.layers) === null || _d === void 0 ? void 0 : _d.forEach((layerDetails, index) => {
                if (!pointLayerIds.includes(layerDetails.layerId)) {
                    config[activeDataSource].assetSettings.layers.splice(index, 1);
                }
                else {
                    assetSettingsLayerIds.push(layerDetails.layerId);
                }
            });
            return config;
        };
        /**
         * Get updated map view group and map widget instance if user clicks on widget without fully loading the webmap/webscene
        */
        this.getMapViewGroupInstance = (useMapWidgetIds) => {
            var _a, _b, _c, _d, _e;
            const mapViewGroups = this.mvManager.getJimuMapViewGroup(useMapWidgetIds);
            let updatedMapViewGroups = mapViewGroups;
            let mapWidgetInstance = updatedMapViewGroups === null || updatedMapViewGroups === void 0 ? void 0 : updatedMapViewGroups.mapWidgetInstance;
            if (this._mapViewGroupLoad) {
                clearInterval(this._mapViewGroupLoad);
            }
            if (mapViewGroups) {
                const jimuMapViewsFirst = mapViewGroups.mapWidgetId + '-' + ((_b = (_a = mapWidgetInstance.props.useDataSources) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.dataSourceId);
                const jimuMapViewsSecond = mapViewGroups.mapWidgetId + '-' + ((_d = (_c = mapWidgetInstance.props.useDataSources) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.dataSourceId);
                //Create data sources on the basis of active webmap/webscene
                if (((_e = mapWidgetInstance.props.useDataSources) === null || _e === void 0 ? void 0 : _e.length) === 2) {
                    if (Object.prototype.hasOwnProperty.call(mapViewGroups.jimuMapViews, jimuMapViewsFirst) &&
                        Object.prototype.hasOwnProperty.call(mapViewGroups.jimuMapViews, jimuMapViewsSecond)) {
                        updatedMapViewGroups = mapViewGroups;
                        mapWidgetInstance = updatedMapViewGroups.mapWidgetInstance;
                    }
                    else {
                        this._mapViewGroupLoad = setTimeout(() => {
                            this.getAvailableDataSources(this.props.useMapWidgetIds);
                        }, 50);
                    }
                }
            }
            return [updatedMapViewGroups, mapWidgetInstance];
        };
        this.getAvailableDataSources = (useMapWidgetIds) => {
            var _a, _b;
            let elevationLayer = '';
            this.dataSourceOptions = [];
            this.groundData = [];
            this.dataSourceOptions.push({
                label: this.nls('defaultWebMap'),
                value: 'default'
            });
            if (this._mapViewGroupLoad) {
                clearInterval(this._mapViewGroupLoad);
            }
            const getMapViewGroup = this.getMapViewGroupInstance(useMapWidgetIds);
            const updatedMapViewGroups = getMapViewGroup[0];
            if (updatedMapViewGroups && updatedMapViewGroups.jimuMapViews) {
                if (this._mapLoadedTimer) {
                    clearInterval(this._mapLoadedTimer);
                }
                for (const id in updatedMapViewGroups.jimuMapViews) {
                    if (updatedMapViewGroups.jimuMapViews[id].dataSourceId) {
                        const availableGroundLayers = updatedMapViewGroups.jimuMapViews[id].view.map.ground.layers;
                        let isGroundLayer = false;
                        if (availableGroundLayers.length > 0) {
                            isGroundLayer = true;
                        }
                        if (availableGroundLayers.length > 0) { // Use map ground elevation layer
                            const groundLayer = updatedMapViewGroups.jimuMapViews[id].view.map.ground.layers;
                            elevationLayer = (_a = groundLayer === null || groundLayer === void 0 ? void 0 : groundLayer.items[0]) === null || _a === void 0 ? void 0 : _a.url;
                        }
                        this.groundData.push({
                            dataSourceId: updatedMapViewGroups.jimuMapViews[id].dataSourceId,
                            isGroundElevationLayerExists: isGroundLayer,
                            groundElevationLayerUrl: elevationLayer
                        });
                        setTimeout(() => {
                            this.setState({
                                useElevationLayer: elevationLayer,
                                isUseCustomElevationLayer: !isGroundLayer
                            }, () => {
                                this.getConfigForSelectedDs(updatedMapViewGroups.jimuMapViews[id].dataSourceId);
                            });
                        }, 50);
                        if (updatedMapViewGroups.jimuMapViews[id].isActive || updatedMapViewGroups.jimuMapViews[id].isActive === undefined) {
                            setTimeout(() => {
                                this.props.onSettingChange({
                                    id: this.props.id,
                                    config: this.props.config.set('activeDataSource', updatedMapViewGroups.jimuMapViews[id].dataSourceId)
                                });
                            }, 50);
                            this.setState({
                                activeDataSource: updatedMapViewGroups.jimuMapViews[id].dataSourceId
                            });
                        }
                        this.dataSourceOptions.push({
                            label: this.getDataSourceLabel(updatedMapViewGroups.jimuMapViews[id].dataSourceId),
                            value: updatedMapViewGroups.jimuMapViews[id].dataSourceId
                        });
                    }
                }
                //if datasource option contains default and other datasources
                //remove the default data source from an array
                if (this.dataSourceOptions.length > 1) {
                    this.dataSourceOptions.forEach((option, index) => {
                        if (option.label === this.nls('defaultWebMap')) {
                            this.dataSourceOptions.splice(index, 1);
                        }
                    });
                }
                else { //Set active data source name as default
                    if (updatedMapViewGroups && updatedMapViewGroups.jimuMapViews) {
                        for (const id in updatedMapViewGroups.jimuMapViews) {
                            let isGroundLayer = false;
                            if (updatedMapViewGroups.jimuMapViews[id].view.map.ground.layers.length > 0) {
                                const groundLayer = updatedMapViewGroups.jimuMapViews[id].view.map.ground.layers;
                                elevationLayer = (_b = groundLayer === null || groundLayer === void 0 ? void 0 : groundLayer.items[0]) === null || _b === void 0 ? void 0 : _b.url;
                                isGroundLayer = true;
                            }
                            setTimeout(() => {
                                this.props.onSettingChange({
                                    id: this.props.id,
                                    config: this.props.config.set('activeDataSource', 'default')
                                });
                            }, 50);
                            this.groundData.push({
                                dataSourceId: 'default',
                                isGroundElevationLayerExists: isGroundLayer,
                                groundElevationLayerUrl: elevationLayer
                            });
                            this.setState({
                                activeDataSource: 'default',
                                useElevationLayer: elevationLayer,
                                isUseCustomElevationLayer: !isGroundLayer
                            }, () => {
                                this.getConfigForSelectedDs(this.state.activeDataSource);
                            });
                        }
                    }
                }
                this.setState({
                    dataSources: this.dataSourceOptions
                });
                this.updateConfigAsPerNewWebMap();
            }
            else {
                this._mapLoadedTimer = setTimeout(() => {
                    this.getAvailableDataSources(useMapWidgetIds);
                }, 50);
            }
        };
        this.updateAssetOrProfileLayersSettings = (configKey, dataSource, layerIndex, dataObj, data, isLayerAddOrRemove) => {
            let settingsObj, currentItem, configItems;
            //If layer added or removed from the layer list then update the config
            if (isLayerAddOrRemove && layerIndex === null) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['configInfo', dataSource, configKey, 'layers'], Immutable(data))
                });
            }
            else if (layerIndex !== null) {
                //If layer index is specified, update the configuration for specified index
                currentItem = this.props.config.configInfo[dataSource][configKey].layers[layerIndex].asMutable({ deep: true });
                if (dataObj.childKey) {
                    currentItem[dataObj.parentKey][dataObj.childKey] = dataObj.value;
                }
                else {
                    currentItem[dataObj.parentKey] = dataObj.value;
                }
                configItems = this.props.config.configInfo[dataSource][configKey].layers.asMutable({ deep: true });
                configItems.splice(layerIndex, 1, currentItem);
                settingsObj = Immutable(configItems);
                //update the settings by removing duplicates layers
                const updatedSettingObj = settingsObj.filter((ele, ind) => ind === settingsObj.findIndex(elem => elem.layerId === ele.layerId));
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['configInfo', dataSource, configKey, 'layers'], updatedSettingObj)
                });
            }
        };
        /**
        Show data source settings in sidepopper
        */
        this.showDsPanel = (item, index) => {
            if (index === this.index) {
                this.setState({
                    showDataItemPanel: !this.state.showDataItemPanel
                }, () => {
                    setTimeout(() => {
                        this.sidePopperDsHeader.current.focus();
                    }, 1000);
                });
                this.maintainStatesOnDsClick(item);
            }
            else {
                this.setState({
                    showDataItemPanel: true
                }, () => {
                    setTimeout(() => {
                        this.sidePopperDsHeader.current.focus();
                    }, 1000);
                });
                this.maintainStatesOnDsClick(item);
                this.index = index;
            }
            this.getConfigForSelectedDs(item.value);
        };
        this.maintainStatesOnDsClick = (item) => {
            this.setState({
                dataSourceName: item.label,
                activeDataSource: item.value,
                isProfileChartSettingsOpen: false,
                isProfileSettingsOpen: false,
                isAssetSettingsOpen: false
            });
        };
        /**
        * Create label elements in the individual data source list items
        */
        this.createDsElement = (item, index) => {
            const _datasourceOptions = (jsx("div", { ref: this.dsRef, tabIndex: 0, "aria-label": item.label, key: index, className: 'data-item align-items-center' },
                jsx("div", { className: 'data-item-name', title: item.label }, item.label)));
            return _datasourceOptions;
        };
        /**
        *Close Data source sidepopper
        */
        this.onCloseDataItemPanel = () => {
            this.setState({
                showDataItemPanel: false
            }, () => {
                var _a, _b;
                (_b = (_a = this.dsRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
            });
            this.index = 0;
        };
        this.onToggleProfileChartSettings = () => {
            this.setState({
                isProfileChartSettingsOpen: !this.state.isProfileChartSettingsOpen
            });
        };
        this.advancedOptionseChange = (evt) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['configInfo', this.state.activeDataSource, 'advanceOptions'], evt.target.checked)
            });
            setTimeout(() => {
                var _a, _b;
                (_b = (_a = this.profileSettingsRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
            }, 50);
        };
        this.onToggleProfileSettings = () => {
            this.setState({
                isProfileSettingsOpen: !this.state.isProfileSettingsOpen
            });
        };
        this.onToggleAssetSettings = () => {
            this.setState({
                isAssetSettingsOpen: !this.state.isAssetSettingsOpen
            });
        };
        this.updateAssetsBufferSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['configInfo', this.state.activeDataSource, 'assetSettings', 'assetIntersectionBuffer', property], value)
            });
        };
        this.updateProfileChartSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['configInfo', this.state.activeDataSource, 'profileChartSettings', property], value)
            });
        };
        this.updateGeneralSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['generalSettings', property], value)
            });
        };
        this.index = 0;
        this.state = {
            dataSources: [],
            showDataItemPanel: false,
            dataSourceName: '',
            isProfileChartSettingsOpen: false,
            activeDataSource: this.props.config.activeDataSource ? this.props.config.activeDataSource : null,
            useElevationLayer: '',
            isUseCustomElevationLayer: false,
            availableStats: [],
            isProfileSettingsOpen: false,
            isAssetSettingsOpen: false,
            isNoMapSelected: true,
            mapWidgetExists: true
        };
        this.isRTL = false;
        const appState = getAppStore().getState();
        this.isRTL = (_a = appState === null || appState === void 0 ? void 0 : appState.appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
    }
    render() {
        var _a, _b, _c, _d;
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-elevation-profile' },
                jsx(SettingSection, { className: 'map-selector-section', title: this.nls('sourceLabel') },
                    jsx(SettingRow, null,
                        jsx(Label, { tabIndex: 0, "aria-label": this.nls('selectMapWidgetLabel'), title: this.nls('selectMapWidgetLabel'), className: 'w-100 d-flex' },
                            jsx("div", { className: 'text-truncate flex-grow-1 setting-text-level-3' }, this.nls('selectMapWidgetLabel')))),
                    jsx(SettingRow, null,
                        jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected.bind(this), useMapWidgetIds: this.props.useMapWidgetIds })),
                    this.state.isNoMapSelected &&
                        jsx(SettingRow, null,
                            jsx(Alert, { tabIndex: 0, className: 'warningMsg', onClose: function noRefCheck() { }, open: this.state.isNoMapSelected, text: this.nls('warningMsgToSelectMap'), type: 'warning' }))),
                this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0 && this.state.mapWidgetExists &&
                    jsx("div", null,
                        jsx(SettingSection, null,
                            jsx(SettingRow, null,
                                jsx(Label, { tabIndex: 0, "aria-label": this.nls('dataConfigLabel'), title: this.nls('dataConfigLabel'), className: 'w-100 d-flex', style: { maxWidth: '88%' } },
                                    jsx("div", { className: 'text-truncate flex-grow-1 color-label setting-text-level-1' }, this.nls('dataConfigLabel'))),
                                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('dataConfigTooltip'), title: this.nls('dataConfigTooltip'), showArrow: true, placement: 'top' },
                                    jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                            jsx(SettingRow, null,
                                jsx(List, { itemsJson: Array.from(this.state.dataSources).map((options, index) => ({
                                        itemStateDetailContent: options,
                                        itemKey: `${index}`
                                    })), dndEnabled: false, isItemFocused: (actionData, refComponent) => {
                                        const { itemJsons: [currentItemJson] } = refComponent.props;
                                        return this.state.showDataItemPanel && this.index + '' === currentItemJson.itemKey;
                                    }, onClickItemBody: (actionData, refComponent) => {
                                        const { itemJsons } = refComponent.props;
                                        const currentItemJson = itemJsons[0];
                                        const listItemJsons = itemJsons[1];
                                        this.showDsPanel(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
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
                                        return this.createDsElement(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
                                    } })),
                            this.state.activeDataSource === 'default' &&
                                jsx(SettingRow, null,
                                    jsx(Alert, { tabIndex: 0, className: 'warningMsg', onClose: function noRefCheck() { }, open: this.state.activeDataSource === 'default', text: this.nls('warningMsgIfDefaultDs'), type: 'warning' }))),
                        this.state.activeDataSource &&
                            jsx(SettingSection, { title: jsx("div", { className: 'w-100 d-flex justify-content-between align-items-center sub-header' },
                                    jsx("div", { className: 'title d-flex ep-section-title w-100', title: this.nls('generalSettingsLabel') },
                                        jsx("div", { tabIndex: 0, "aria-label": this.nls('generalSettingsLabel'), className: 'text-truncate' }, this.nls('generalSettingsLabel')))) },
                                jsx(SettingRow, { flow: 'wrap' },
                                    jsx(GeneralSettings, { intl: this.props.intl, theme: this.props.theme, currentDs: this.state.activeDataSource, config: this.props.config.generalSettings, onGeneralSettingsUpdated: this.updateGeneralSettings })))),
                jsx(SidePopper, { isOpen: this.state.showDataItemPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, position: 'right', toggle: this.onCloseDataItemPanel, trigger: (_a = this.sidePopperTrigger) === null || _a === void 0 ? void 0 : _a.current },
                    jsx("div", { className: 'w-100 h-100', css: getStyleForLI(this.props.theme) },
                        jsx("div", { className: 'w-100 h-100 layer-item-panel' },
                            jsx("div", { tabIndex: 0, ref: this.sidePopperDsHeader, className: 'w-100 d-flex align-items-center justify-content-between setting-header setting-title' },
                                jsx("h5", { title: this.state.dataSourceName, className: 'text-truncate layer-item-label mt-2' }, this.state.dataSourceName),
                                jsx(Button, { role: 'button', "aria-label": this.nls('close'), title: this.nls('close'), className: 'ml-2', icon: true, type: 'tertiary', size: 'sm', onClick: this.onCloseDataItemPanel.bind(this) },
                                    jsx(Icon, { icon: epConfigIcon.iconClose, size: 16 }))),
                            this.state.activeDataSource && this.props.config.configInfo[this.state.activeDataSource] &&
                                jsx("div", { className: 'setting-container' },
                                    jsx(SettingSection, null,
                                        jsx(SettingCollapse, { label: this.nls('profileChart'), isOpen: this.state.isProfileChartSettingsOpen, onRequestOpen: () => this.onToggleProfileChartSettings(), onRequestClose: () => this.onToggleProfileChartSettings() },
                                            jsx(SettingRow, { flow: 'wrap' },
                                                jsx(ProfileChartSettings, { intl: this.props.intl, theme: this.props.theme, currentDs: this.state.activeDataSource, config: this.props.config.configInfo[this.state.activeDataSource].profileChartSettings, portalSelf: this.props.portalSelf, groundLayerInfo: this.groundData, isRTL: this.isRTL, onProfileChartSettingsUpdated: this.updateProfileChartSettings })))),
                                    this.state.activeDataSource !== 'default' &&
                                        jsx(SettingSection, { title: jsx("div", { className: 'w-100 d-flex justify-content-between align-items-center sub-header' },
                                                jsx("div", { className: 'title d-flex ep-section-title' },
                                                    jsx("div", { tabIndex: 0, "aria-label": this.nls('advanceOptions'), title: this.nls('advanceOptions'), className: 'text-truncate' }, this.nls('advanceOptions'))),
                                                jsx(Switch, { role: 'switch', "aria-label": this.nls('advanceOptions'), title: this.nls('advanceOptions'), checked: (_b = this.props.config.configInfo[this.state.activeDataSource]) === null || _b === void 0 ? void 0 : _b.advanceOptions, "aria-expanded": (_c = this.props.config.configInfo[this.state.activeDataSource]) === null || _c === void 0 ? void 0 : _c.advanceOptions, onChange: this.advancedOptionseChange })) }, ((_d = this.props.config.configInfo[this.state.activeDataSource]) === null || _d === void 0 ? void 0 : _d.advanceOptions) &&
                                            jsx("div", { style: { height: '100%' } },
                                                jsx("div", { ref: this.profileSettingsRef, tabIndex: 0 },
                                                    jsx(SettingRow, { className: !this.state.isProfileSettingsOpen ? 'pb-3 ep-divider-hide' : 'pb-3' },
                                                        jsx(SettingCollapse, { label: this.nls('profileSettingsLabel'), isOpen: this.state.isProfileSettingsOpen, onRequestOpen: () => this.onToggleProfileSettings(), onRequestClose: () => this.onToggleProfileSettings() },
                                                            jsx(SettingRow, { flow: 'wrap' },
                                                                jsx(ProfileSetting, { widgetId: this.props.widgetId, isOpen: this.state.isProfileSettingsOpen, intl: this.props.intl, theme: this.props.theme, portalSelf: this.props.portalSelf, activeDsConfig: this.props.config.configInfo[this.state.activeDataSource], config: this.props.config.configInfo[this.state.activeDataSource].profileSettings, allAvailableStatistics: this.state.availableStats, onProfileSettingsUpdated: this.updateAssetOrProfileLayersSettings, activeDataSource: this.state.activeDataSource, mapWidgetId: this.props.useMapWidgetIds[0] }))))))))))))));
    }
}
//# sourceMappingURL=setting.js.map