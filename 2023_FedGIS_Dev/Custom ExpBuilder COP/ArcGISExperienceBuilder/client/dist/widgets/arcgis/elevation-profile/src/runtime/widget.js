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
import { React, BaseWidget, jsx, classNames, getAppStore, WidgetState, AppMode } from 'jimu-core';
import { WidgetPlaceholder, Card, CardBody, Button, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { ButtonTriggerType } from '../config';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { getStyle } from './lib/style';
import ResultPane from './components/results-pane';
import defaultMessages from './translations/default';
import { getRuntimeIcon, epStatistics, defaultElevationLayer } from './constants';
import { getAllLayersFromDataSource, defaultSelectedUnits } from '../common/utils';
import SketchViewModel from 'esri/widgets/Sketch/SketchViewModel';
import Graphic from 'esri/Graphic';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Extent from 'esri/geometry/Extent';
import Query from 'esri/rest/support/Query';
import geometryEngine from 'esri/geometry/geometryEngine';
import ElevationProfileViewModel from 'esri/widgets/ElevationProfile/ElevationProfileViewModel';
import watchUtils from 'esri/core/watchUtils';
import ElevationLayer from 'esri/layers/ElevationLayer';
import jsonUtils from 'esri/symbols/support/jsonUtils';
import Polyline from 'esri/geometry/Polyline';
import SpatialReference from 'esri/geometry/SpatialReference';
import unitUtils from 'esri/core/unitUtils';
import Color from 'esri/Color';
const { epIcon } = getRuntimeIcon();
const defaultPointSymbol = {
    style: 'esriSMSCircle',
    color: [0, 0, 128, 128],
    name: 'Circle',
    outline: {
        color: [0, 0, 128, 255],
        width: 1
    },
    type: 'esriSMS',
    size: 18
};
export default class Widget extends BaseWidget {
    constructor(props) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(props);
        this._chartDataTimer = null;
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
        this.createDrawingLayers = () => {
            //create new graphicsLayer to draw lines
            this.drawingLayer = new GraphicsLayer({
                listMode: 'hide',
                effect: 'bloom(0.8, 1px, 0)'
            });
            //create new graphicsLayer to show next possible selections
            this.nextPossibleSelectionLayer = new GraphicsLayer({
                listMode: 'hide',
                effect: 'bloom(0.8, 0px, 1%)'
            });
        };
        this.componentDidMount = () => {
            this.setState({
                chartColorRender: this.state.groundColor,
                noFeaturesError: false,
                viewModelErrorState: false
            });
        };
        this.activeViewChangeHandler = (jmv) => {
            var _a, _b;
            if (!(jmv && jmv.view)) {
                this.setState({
                    initialStage: false,
                    resultStage: false
                });
                return;
            }
            this.mapView = jmv;
            if (this.state.jimuMapView) {
                // we have a 'previous' map where we added the widget
                // (ex: case where two Maps in single Experience page and user is switching
                // between them in the dropdown) - we must destroy the old widget in this case.
                // destroy the sketch view modal if it was still not destroyed
                // this will resolve the cross origin issue with react
                if (this.state.currentSketchVM && !this.state.currentSketchVM.destroyed) {
                    this.state.currentSketchVM.destroy();
                }
                //Once the data source is changed, clear the chart and map graphics and set widget to initial stage
                this.clearAll();
                this.setState({
                    initialStage: true,
                    resultStage: false,
                    drawModeActive: (_a = this.props.config.generalSettings) === null || _a === void 0 ? void 0 : _a.isDrawToolActive,
                    selectModeActive: (_b = this.props.config.generalSettings) === null || _b === void 0 ? void 0 : _b.isSelectToolActive
                });
                //destroy prev drawing layers and create new for changed mapview
                this.destroyDrawingLayers();
                this.createDrawingLayers();
            }
            if (jmv) {
                this.setState({
                    jimuMapView: jmv
                }, () => {
                    //If no configuration found for selected data source
                    //create and use the default configuration
                    //this will allow user to use the widget with basic draw tool
                    if (jmv.dataSourceId === null) {
                        this.setState({
                            currentDatasource: 'default'
                        }, () => {
                            this.activeCurrentDs = this.state.currentDatasource;
                            //set default Units
                            this.selectedUnit = defaultSelectedUnits(this.props.config.configInfo[this.state.currentDatasource], this.props.portalSelf);
                        });
                    }
                    else if (this.state.jimuMapView.dataSourceId !== this.props.config.activeDataSource || !this.props.config.configInfo[this.props.config.activeDataSource]) {
                        this.setState({
                            currentDatasource: this.state.jimuMapView.dataSourceId
                        });
                        this.checkLineLayerAvailableInDsAndConfig(this.state.jimuMapView.dataSourceId);
                    }
                    else if (this.props.config.activeDataSource &&
                        this.props.config.configInfo[this.props.config.activeDataSource]) {
                        let configDs = this.props.config.activeDataSource;
                        if (this.state.jimuMapView && this.state.jimuMapView.dataSourceId) {
                            if (Object.prototype.hasOwnProperty.call(this.props.config.configInfo, this.state.jimuMapView.dataSourceId)) {
                                configDs = this.state.jimuMapView.dataSourceId;
                            }
                            else {
                                configDs = 'default';
                            }
                            this.setState({
                                currentDatasource: configDs
                            }, () => {
                                this.activeCurrentDs = this.state.currentDatasource;
                                if (this.state.currentDatasource !== 'default') {
                                    this.checkLineLayerAvailableInDsAndConfig(this.state.currentDatasource);
                                }
                                this.setConfigForDatasources();
                            });
                        }
                    }
                    setTimeout(() => {
                        const elevationInfo = {
                            mode: this.state.jimuMapView.view.type === '3d' ? 'relative-to-ground' : 'on-the-ground',
                            offset: null
                        };
                        this.drawingLayer.set('elevationInfo', elevationInfo);
                        this.nextPossibleSelectionLayer.set('elevationInfo', elevationInfo);
                        this.state.jimuMapView.view.map.addMany([this.nextPossibleSelectionLayer, this.drawingLayer]);
                        this.createApiWidget(jmv);
                        this.createEpViewModel(jmv);
                        //check the widget state whether open/close in live view
                        const widgetState = getAppStore().getState().widgetsRuntimeInfo[this.props.id].state;
                        if (widgetState === WidgetState.Opened || !widgetState) {
                            this.loadSelectDrawToolOnLoad(this.activeCurrentDs);
                        }
                    }, 100);
                });
            }
        };
        this.loadSelectDrawToolOnLoad = (activeCurrentDs) => {
            //on widget load activate draw/select tool if it is enabled in config
            if (activeCurrentDs === 'default') {
                if (this.state.drawModeActive) {
                    this.manageActiveDrawSelect();
                }
            }
            else if (this.state.drawModeActive || this.state.selectModeActive) {
                if (this.state.lineLayersNotFound && this.state.selectModeActive) {
                    return;
                }
                this.manageActiveDrawSelect();
            }
            else {
                this.setState({
                    resultStage: false,
                    initialStage: true
                });
            }
        };
        this.manageActiveDrawSelect = () => {
            this.setState({
                resultStage: true,
                initialStage: false
            }, () => {
                this.clearAll();
                this._displayDefaultCursor();
                this.activateDrawOrSelectTool();
            });
        };
        this.checkLineLayerAvailableInDsAndConfig = (activeDs) => {
            var _a, _b;
            const allLayerSources = getAllLayersFromDataSource(activeDs);
            let noLineLayerFound = true;
            allLayerSources === null || allLayerSources === void 0 ? void 0 : allLayerSources.forEach((layer) => {
                if (layer && layer.layerDefinition && layer.layerDefinition.geometryType &&
                    layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                    noLineLayerFound = false;
                }
            });
            if (((_a = this.props.config.configInfo[activeDs]) === null || _a === void 0 ? void 0 : _a.advanceOptions) &&
                ((_b = this.props.config.configInfo[activeDs]) === null || _b === void 0 ? void 0 : _b.profileSettings.layers.length) === 0) {
                noLineLayerFound = true;
            }
            this.setState({
                lineLayersNotFound: noLineLayerFound
            });
        };
        this.setConfigForDatasources = () => {
            var _a, _b, _c, _d, _e;
            const configActiveDs = this.props.config.configInfo[this.state.currentDatasource];
            this.setState({
                groundColor: configActiveDs ? (_a = configActiveDs.profileChartSettings) === null || _a === void 0 ? void 0 : _a.groundColor : this.defaultConfig.profileChartSettings.groundColor,
                graphicsHighlightColor: configActiveDs ? (_b = configActiveDs.profileChartSettings) === null || _b === void 0 ? void 0 : _b.graphicsHighlightColor : this.defaultConfig.profileChartSettings.graphicsHighlightColor,
                chartColorRender: configActiveDs ? (_c = configActiveDs.profileChartSettings) === null || _c === void 0 ? void 0 : _c.groundColor : this.defaultConfig.profileChartSettings.groundColor,
                customElevationLayer: configActiveDs ? (_d = configActiveDs.profileChartSettings) === null || _d === void 0 ? void 0 : _d.isCustomElevationLayer : this.defaultConfig.profileChartSettings.isCustomElevationLayer,
                elevationLayer: configActiveDs ? (_e = configActiveDs.profileChartSettings) === null || _e === void 0 ? void 0 : _e.elevationLayerURL : this.defaultConfig.profileChartSettings.elevationLayerURL,
                selectedLinearUnit: configActiveDs ? this.selectedUnit[1] : this.defaultConfig.profileChartSettings.linearUnit,
                selectedElevationUnit: configActiveDs ? this.selectedUnit[0] : this.defaultConfig.profileChartSettings.elevationUnit
            });
        };
        this.createDefaultConfigForDataSource = () => {
            var _a, _b;
            let elevationUnit, linearUnit;
            //Fetch and set the default units based on portal settings
            if (((_a = this.props.portalSelf) === null || _a === void 0 ? void 0 : _a.units) === 'english') {
                elevationUnit = 'feet';
            }
            else {
                elevationUnit = 'meters';
            }
            if (((_b = this.props.portalSelf) === null || _b === void 0 ? void 0 : _b.units) === 'english') {
                linearUnit = 'miles';
            }
            else {
                linearUnit = 'kilometers';
            }
            //Populate the default settings
            return {
                profileChartSettings: {
                    isCustomElevationLayer: true,
                    elevationLayerURL: defaultElevationLayer,
                    linearUnit: linearUnit,
                    elevationUnit: elevationUnit,
                    displayStatistics: true,
                    selectedStatistics: epStatistics,
                    groundColor: '#b54900',
                    graphicsHighlightColor: '#b54900'
                }
            };
        };
        this.createApiWidget = (jmv) => {
            var _a, _b;
            // Create a new instance of sketchViewModel
            const sketchVM = new SketchViewModel({
                view: jmv ? jmv.view : null,
                layer: new GraphicsLayer(),
                updateOnGraphicClick: false,
                defaultCreateOptions: {
                    mode: 'click',
                    hasZ: ((_a = jmv === null || jmv === void 0 ? void 0 : jmv.view) === null || _a === void 0 ? void 0 : _a.type) === '3d'
                },
                polylineSymbol: {
                    type: 'simple-line',
                    color: this.state.graphicsHighlightColor,
                    width: 5
                },
                pointSymbol: jsonUtils.fromJSON(defaultPointSymbol),
                defaultUpdateOptions: {
                    toggleToolOnClick: false
                }
            });
            sketchVM.on('create', event => {
                if (event.state === 'start') {
                    const polylineSymbol = {
                        type: 'simple-line',
                        color: this.state.graphicsHighlightColor,
                        width: 5
                    };
                    this.state.currentSketchVM.set('polylineSymbol', polylineSymbol);
                }
                else if (event.state === 'complete') {
                    this.setState({
                        noFeaturesError: false
                    });
                    if (this.state.selectModeActive) {
                        this.setState({
                            loadingIndicator: true
                        });
                        jmv.selectFeaturesByGraphic(event.graphic, 'intersects').then((featuresByLayer) => {
                            this.setState({
                                loadingIndicator: false
                            });
                            this.queryForNewSelection(featuresByLayer);
                        });
                    }
                }
            });
            this.setState({
                currentSketchVM: sketchVM
            });
            (_b = jmv === null || jmv === void 0 ? void 0 : jmv.view) === null || _b === void 0 ? void 0 : _b.on('click', (event) => {
                const filterLayer = this.nextPossibleSelectionLayer;
                if (this.state.addToSelectionTool) {
                    //stopPropagation so that info window is not shown
                    event.stopPropagation();
                    jmv.view.hitTest(event).then((response) => {
                        // check if a feature is returned from the next possible selection layer
                        // do something with the result graphic
                        if (response && response.results) {
                            const graphicResults = response.results.filter(r => r.type === 'graphic');
                            const results = graphicResults.filter((result) => {
                                return result.graphic.layer === filterLayer &&
                                    result.graphic.geometry.type === 'polyline';
                            });
                            if (results && results.length > 0) {
                                //clear profile chart
                                this.clearChart();
                                this.newFeatureSelection = false;
                                //to remove the extra selection form map view, done by system while showing info-window of selected features
                                this.mapView.clearSelectedFeatures();
                                this.selectFeatureForProfiling(results[0].graphic);
                            }
                        }
                    });
                }
            });
        };
        this.createEpViewModel = (jmv) => {
            const profiles = [];
            if (!this.state.customElevationLayer) {
                profiles.push({
                    type: 'ground',
                    color: this.state.groundColor
                });
            }
            else {
                profiles.push({
                    // displays elevation values from a custom source
                    type: 'query',
                    source: new ElevationLayer({
                        url: this.state.elevationLayer
                    }),
                    color: this.state.groundColor
                });
            }
            //Create new instance of ElevationProfileViewModel
            this._defaultViewModel = new ElevationProfileViewModel({
                view: jmv ? jmv.view : null,
                profiles: profiles
            });
            //if view model having some error in its error state while drawing/selecting to generate the profile
            watchUtils.watch(this._defaultViewModel, 'errorState', (result) => {
                const error = this.getErrorMsgState(result);
                if ((error === null || error === void 0 ? void 0 : error.length) === 0 || !error) {
                    return;
                }
                this.setState({
                    viewModelErrorState: error[0],
                    profileErrorMsg: error[1]
                });
            });
            watchUtils.watch(this._defaultViewModel, 'chartData', (result) => {
                if (!result) {
                    return;
                }
                if (this._chartDataTimer) {
                    clearTimeout(this._chartDataTimer);
                }
                this._chartDataTimer = setTimeout(() => {
                    if (this._defaultViewModel.state === 'created') {
                        this.setState({
                            drawingOrSelectingComplete: true
                        });
                    }
                    if (this.state.drawModeActive || this.state.selectModeActive) {
                        this.setState({
                            viewModelErrorState: false,
                            startChartRendering: true,
                            profileResult: result
                        });
                    }
                }, 200);
            });
        };
        /**
        * The current error state of the widget, which allows it to display different
        * error messages while drawing/selecting on webmap/webscene
        *
        * @ignore
        */
        this.getErrorMsgState = (errorMsg) => {
            switch (errorMsg) {
                case "too-complex" /* ElevationProfileErrorState.TooComplex */:
                    return [true, this.nls('tooComplexError')];
                case "invalid-geometry" /* ElevationProfileErrorState.InvalidGeometry */:
                    return [true, this.nls('invalidGeometryError')];
                case "invalid-elevation-info" /* ElevationProfileErrorState.InvalidElevationInfo */:
                    return [true, this.nls('invalidElevationInfoError')];
                case "unknown-error" /* ElevationProfileErrorState.UnknownError */:
                    return [true, this.nls('unknownError')];
                case "no-visible-profiles" /* ElevationProfileErrorState.NoVisibleProfiles */:
                    return [true, this.nls('noProfileError')];
                case "refined-but-no-chart-data" /* ElevationProfileErrorState.RefinedButNoChartData */:
                    return [true, this.nls('noProfileError')];
                case "none" /* ElevationProfileErrorState.None */:
                    return [];
            }
        };
        this.componentDidUpdate = (prevProps) => {
            var _a, _b;
            if (this.props.appMode !== prevProps.appMode && this.props.appMode === AppMode.Run) {
                if (this.state.addToSelectionTool) {
                    this._displayAddToSelectionCursor();
                }
            }
            else if (this.props.appMode !== prevProps.appMode && this.props.appMode === AppMode.Design) {
                this._displayDefaultCursor();
            }
            if (!this.mapView) {
                return;
            }
            //if map or active datasource configuration is changed, update SketchVM and map instance
            if (prevProps.useMapWidgetIds !== this.props.useMapWidgetIds ||
                prevProps.config.activeDataSource !== this.props.config.activeDataSource) {
                if (this.props.config.configInfo[this.props.config.activeDataSource]) {
                    this.setState({
                        currentDatasource: this.props.config.activeDataSource
                    }, () => {
                        this.checkLineLayerAvailableInDsAndConfig(this.state.currentDatasource);
                        this.setState({
                            customElevationLayer: this.props.config.configInfo[this.state.currentDatasource].profileChartSettings.isCustomElevationLayer,
                            elevationLayer: this.props.config.configInfo[this.state.currentDatasource].profileChartSettings.elevationLayerURL
                        });
                    });
                }
            }
            if (prevProps.state !== this.props.state && (!this.state.profileResult && (this.state.drawModeActive || this.state.selectModeActive))) {
                //check widget the state open/close in live view
                const widgetState = getAppStore().getState().widgetsRuntimeInfo[this.props.id].state;
                if (widgetState === WidgetState.Opened || !widgetState) {
                    this.loadSelectDrawToolOnLoad(this.activeCurrentDs);
                }
            }
            const currentConfig = (_a = this.props.config.configInfo) === null || _a === void 0 ? void 0 : _a[this.state.currentDatasource];
            const prevConfig = (_b = prevProps.config.configInfo) === null || _b === void 0 ? void 0 : _b[this.state.currentDatasource];
            if (Object.prototype.hasOwnProperty.call(this.props.config.configInfo, this.state.currentDatasource)) {
                this.checkLineLayerAvailableInDsAndConfig(this.state.currentDatasource);
                this.setConfigForDatasources();
            }
            //profile chart settings
            if ((prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.groundColor) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.groundColor) ||
                (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.graphicsHighlightColor) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.graphicsHighlightColor)) {
                this.setState({
                    groundColor: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.groundColor,
                    graphicsHighlightColor: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.graphicsHighlightColor
                }, () => {
                    this.setState({
                        chartColorRender: this.state.groundColor
                    });
                    if (this.drawingLayer && this.drawingLayer.graphics.length > 0) {
                        const polylineSymbol = {
                            type: 'simple-line',
                            color: this.state.graphicsHighlightColor,
                            width: 5
                        };
                        const graphics = this.drawingLayer.graphics;
                        const individualGraphicItems = graphics.items;
                        individualGraphicItems.forEach((graphic) => {
                            graphic.symbol = polylineSymbol;
                        });
                    }
                    if (this._defaultViewModel && this.state.groundColor) {
                        this._defaultViewModel.profiles.getItemAt(0).color.setColor(this.state.groundColor);
                    }
                });
            }
            if ((prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.elevationUnit) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.elevationUnit) ||
                (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.linearUnit) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.linearUnit)) {
                this.setState({
                    selectedLinearUnit: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.linearUnit,
                    selectedElevationUnit: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.elevationUnit
                });
            }
            //clear all the graphics and chart when elevation layer changed in live view
            if ((prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.elevationLayerURL) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.elevationLayerURL) ||
                (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileChartSettings.isCustomElevationLayer) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.isCustomElevationLayer)) {
                if (currentConfig && prevConfig) {
                    this.setState({
                        elevationLayer: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileChartSettings.elevationLayerURL
                    }, () => {
                        if (!this.state.initialStage) {
                            this.activateToolForNewProfile();
                        }
                        this.createEpViewModel(this.mapView);
                    });
                }
            }
            //check if profile layers config are updated in live view mode
            if (this.didProfileLayersSettingsChanged(prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.profileSettings.layers, currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileSettings.layers) ||
                (prevConfig === null || prevConfig === void 0 ? void 0 : prevConfig.advanceOptions) !== (currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.advanceOptions)) {
                this.setState({
                    profileLineLayers: currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.profileSettings.layers
                }, () => {
                    let noLineConfigured = false;
                    if ((currentConfig === null || currentConfig === void 0 ? void 0 : currentConfig.advanceOptions) && this.state.profileLineLayers.length === 0) {
                        this.onBackClick();
                        noLineConfigured = true;
                    }
                    this.setState({
                        lineLayersNotFound: noLineConfigured
                    });
                });
            }
        };
        this.didProfileLayersSettingsChanged = (prevProfileLayers, currentProfileLayers) => {
            let profileSettingsChanged = false;
            if ((prevProfileLayers === null || prevProfileLayers === void 0 ? void 0 : prevProfileLayers.length) !== (currentProfileLayers === null || currentProfileLayers === void 0 ? void 0 : currentProfileLayers.length)) {
                profileSettingsChanged = true;
            }
            return profileSettingsChanged;
        };
        this.componentWillUnmount = () => {
            if (this._defaultViewModel) {
                this._defaultViewModel.clear();
            }
            //remove previously drawn graphics
            this.destroyDrawingLayers();
            //this will reset the cursor to default
            this._displayDefaultCursor();
        };
        this.queryForNewSelection = (featuresByLayer) => {
            let newSelectedFeature = null;
            if (featuresByLayer.length > 0) {
                featuresByLayer.forEach(features => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    if (features.length > 0) {
                        const dsLayerId = this.getDSLayerID(features[0].layer.id);
                        //In current release we will be dealing with only first feature out of multiple features from multiple layers
                        //TODO: In future we may have to provide the features list and allow user to select one feature
                        if (features[0].geometry.type === 'polyline' && this.selectableLayersAtRuntime.includes(dsLayerId)) {
                            //In 3d, update the elevation info of drawing and nextPossibleSelectionLayer according to the first selected feature
                            if (this.state.jimuMapView.view.type === '3d' && ((_b = (_a = features[0]) === null || _a === void 0 ? void 0 : _a.layer) === null || _b === void 0 ? void 0 : _b.elevationInfo)) {
                                const elevationInfo = (_d = (_c = features[0]) === null || _c === void 0 ? void 0 : _c.layer) === null || _d === void 0 ? void 0 : _d.elevationInfo;
                                this.drawingLayer.set('elevationInfo', elevationInfo);
                                this.nextPossibleSelectionLayer.set('elevationInfo', elevationInfo);
                            }
                            this.newFeatureSelection = true;
                            this.setState({
                                noGraphicAfterFirstSelection: true
                            });
                            newSelectedFeature = new Graphic({
                                geometry: (_e = features[0]) === null || _e === void 0 ? void 0 : _e.geometry,
                                attributes: ((_f = features[0]) === null || _f === void 0 ? void 0 : _f.attributes) ? (_g = features[0]) === null || _g === void 0 ? void 0 : _g.attributes : {}
                            });
                            newSelectedFeature.attributes.esriCTFeatureLayerId = dsLayerId;
                            //to remove the extra selection form map view, done by system while showing info-window of selected features
                            this.mapView.clearSelectedFeatures();
                            return true;
                        }
                    }
                });
            }
            //clear the graphics added by drawing tool
            if (this.drawingLayer) {
                this.drawingLayer.removeAll();
            }
            if (newSelectedFeature) {
                this.setState({
                    drawModeActive: false,
                    noFeaturesError: false,
                    viewModelErrorState: false
                });
                this.selectFeatureForProfiling(newSelectedFeature);
            }
            else {
                //reactivate sketch view model to select another point
                if (this.state.selectModeActive) {
                    this.state.currentSketchVM.create('point');
                }
                //show error in widget panel
                this.setState({
                    noFeaturesError: true
                });
            }
        };
        /**
         *
         * If layer is invisible by scale-dependent visibility, layer definitions and filters then user will unable to select the feature
        */
        this.considerLayerVisibility = (featureLayer) => {
            const layersVisibility = featureLayer.visible &&
                ((featureLayer.minScale >= this.mapView.view.scale && featureLayer.maxScale <= this.mapView.view.scale) ||
                    (featureLayer.minScale === 0 && featureLayer.maxScale <= this.mapView.view.scale) ||
                    (featureLayer.maxScale === 0 && featureLayer.minScale >= this.mapView.view.scale) ||
                    (featureLayer.minScale === 0 && featureLayer.maxScale === 0));
            return layersVisibility;
        };
        this.getDSLayerID = (layerId) => {
            var _a, _b;
            let dsLayerId = '';
            if ((_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.jimuMapView) === null || _b === void 0 ? void 0 : _b.dataSourceId) {
                const dataSource = getAllLayersFromDataSource(this.state.jimuMapView.dataSourceId);
                dataSource === null || dataSource === void 0 ? void 0 : dataSource.forEach((ds) => {
                    if (ds.jimuChildId === layerId) {
                        dsLayerId = ds.id;
                        return true;
                    }
                });
            }
            return dsLayerId;
        };
        this.queryForIndividualLayers = (dsId, geometry) => {
            var _a, _b, _c;
            const defArr = [];
            const dataSource = getAllLayersFromDataSource(dsId);
            //use all the layers for selecting if advanceoptions is turned OFF and if it is ON but no line layers
            // are configured
            const layersArray = this.mapView.view.map.layers.toArray();
            let isLayerVisible = true;
            if (!((_a = this.props.config.configInfo[this.state.currentDatasource]) === null || _a === void 0 ? void 0 : _a.advanceOptions)) {
                dataSource === null || dataSource === void 0 ? void 0 : dataSource.forEach((layer) => {
                    //selectable layers at runtime
                    this.selectableLayersAtRuntime.forEach((selectableLayerId) => {
                        if (selectableLayerId === layer.id) {
                            layersArray.forEach((viewLayers) => {
                                var _a;
                                const layersArray = viewLayers;
                                if (layersArray.type === 'group') {
                                    const grpLayer = layersArray.layers.toArray();
                                    grpLayer.forEach((grpLayers) => {
                                        var _a;
                                        isLayerVisible = this.considerLayerVisibility(grpLayers);
                                        if ((grpLayers.id === layer.jimuChildId) && isLayerVisible) {
                                            if (((_a = layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) && layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                                                defArr.push(this.queryIndividualLayer(grpLayers, layer, geometry));
                                            }
                                        }
                                    });
                                }
                                else if (layersArray.type === 'feature') {
                                    isLayerVisible = this.considerLayerVisibility(layersArray);
                                    if ((viewLayers.id === layer.jimuChildId) && isLayerVisible) {
                                        if (((_a = layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.geometryType) && layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                                            defArr.push(this.queryIndividualLayer(viewLayers, layer, geometry));
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            }
            else { //use configured line layers of selection
                if (((_b = this.props.config.configInfo[this.state.currentDatasource]) === null || _b === void 0 ? void 0 : _b.profileSettings.layers.length) > 0) {
                    const layersCurrentConfig = (_c = this.props.config.configInfo[this.state.currentDatasource]) === null || _c === void 0 ? void 0 : _c.profileSettings.layers;
                    dataSource === null || dataSource === void 0 ? void 0 : dataSource.forEach((layer) => {
                        //selectable layers at runtime
                        this.selectableLayersAtRuntime.forEach((selectableLayerId) => {
                            if (selectableLayerId === layer.id) {
                                layersArray.forEach((viewLayers) => {
                                    const layersArray = viewLayers;
                                    if (layersArray.type === 'group') {
                                        const grpLayer = layersArray.layers.toArray();
                                        grpLayer.forEach((grpLayers) => {
                                            isLayerVisible = this.considerLayerVisibility(grpLayers);
                                            if ((grpLayers.id === layer.jimuChildId) && isLayerVisible) {
                                                layersCurrentConfig.forEach((currentSetting) => {
                                                    if ((currentSetting.layerId === layer.id)) {
                                                        defArr.push(this.queryIndividualLayer(grpLayers, layer, geometry));
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else if (layersArray.type === 'feature') {
                                        isLayerVisible = this.considerLayerVisibility(layersArray);
                                        if ((viewLayers.id === layer.jimuChildId) && isLayerVisible) {
                                            layersCurrentConfig.forEach((currentSetting) => {
                                                if ((currentSetting.layerId === layer.id)) {
                                                    defArr.push(this.queryIndividualLayer(viewLayers, layer, geometry));
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            }
            return defArr;
        };
        this.queryIndividualLayer = (viewLayers, layer, selectedGeometry) => __awaiter(this, void 0, void 0, function* () {
            let getLayer = null;
            getLayer = this.mapView.view.map.findLayerById(viewLayers.id);
            const metersPerVSRForLayer = this.getMetersForVerticalSR(getLayer);
            const queryString = this.filterExistingFeatures(layer);
            const layerDefinition = viewLayers.definitionExpression;
            const currentDateTime = Date.now(); // To dirty the query string so that data will be fetched from server
            let lineLayerQuery = null;
            lineLayerQuery = new Query();
            lineLayerQuery.geometry = selectedGeometry;
            lineLayerQuery.returnGeometry = true;
            lineLayerQuery.returnZ = true;
            lineLayerQuery.outSpatialReference = this.state.jimuMapView.view.spatialReference;
            lineLayerQuery.outFields = ['*'];
            if (queryString) {
                if (layerDefinition) {
                    lineLayerQuery.where = queryString + ' AND ' + layerDefinition + ' AND ' + currentDateTime + '=' + currentDateTime;
                }
                else {
                    lineLayerQuery.where = queryString + ' AND ' + currentDateTime + '=' + currentDateTime;
                }
            }
            else if (layerDefinition) {
                lineLayerQuery.where = layerDefinition + ' AND ' + currentDateTime + '=' + currentDateTime;
            }
            else {
                lineLayerQuery.where = currentDateTime + '=' + currentDateTime;
            }
            let result = [];
            try {
                yield getLayer.queryFeatures(lineLayerQuery).then((results) => {
                    if (results.features.length > 0) {
                        results.features.forEach((feature) => {
                            // Z value after queryFeatures are returned in SR of the map, only if layer don't have vertical SR
                            // so in case when we have vertical SR for layer, convert the z values in map sr unit
                            // multiply the value with metersPerSRForLayer will convert z value in meters
                            // after that divide the value by metersPerSRForMap will give the value in mapSR unit
                            if (metersPerVSRForLayer) {
                                const metersPerSRForMap = unitUtils.getMetersPerUnitForSR(new SpatialReference(this.mapView.view.spatialReference.toJSON()));
                                const eachGeometry = feature.geometry;
                                if (eachGeometry.paths.length > 0) {
                                    eachGeometry.paths.forEach((eachPath) => {
                                        if (eachPath.length > 0) {
                                            eachPath.forEach((eachPoint) => {
                                                if (eachPoint.length > 1) {
                                                    eachPoint[2] = (eachPoint[2] * metersPerVSRForLayer) / metersPerSRForMap;
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            feature.attributes.esriCTFeatureLayerId = layer.dataSourceJson.id;
                        });
                    }
                    result = results.features;
                }, (err) => {
                    console.log(err);
                });
            }
            catch (e) {
                result = [];
            }
            return result;
        });
        this.getMetersForVerticalSR = (layer) => {
            var _a, _b, _c, _d;
            let metersPerSR = 1;
            //get Units from VCS of layers source SR
            if ((_b = (_a = layer.sourceJSON) === null || _a === void 0 ? void 0 : _a.sourceSpatialReference) === null || _b === void 0 ? void 0 : _b.vcsWkid) {
                metersPerSR = unitUtils.getMetersPerVerticalUnitForSR(new SpatialReference({ wkid: layer.sourceJSON.sourceSpatialReference.vcsWkid }));
            }
            else if ((_d = (_c = layer.sourceJSON) === null || _c === void 0 ? void 0 : _c.sourceSpatialReference) === null || _d === void 0 ? void 0 : _d.vcsWkt) {
                metersPerSR = unitUtils.getMetersPerVerticalUnitForSR(new SpatialReference({ wkid: layer.sourceJSON.sourceSpatialReference.vcsWkt }));
            }
            else {
                metersPerSR = null;
            }
            return metersPerSR;
        };
        this.filterExistingFeatures = (layer) => {
            let oIdQueryString = '';
            const oIdField = layer.layer.objectIdField;
            //Get the collection of graphics from the respective layer
            const layerFeatureGraphics = this.drawingLayer.graphics.filter((graphic) => {
                if (graphic.attributes && Object.prototype.hasOwnProperty.call(graphic.attributes, 'esriCTFeatureLayerId') &&
                    graphic.attributes.esriCTFeatureLayerId === layer.dataSourceJson.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            layerFeatureGraphics.forEach((graphic, index) => {
                if (Object.prototype.hasOwnProperty.call(graphic.attributes, 'esriCTFeatureLayerId') &&
                    graphic.attributes.esriCTFeatureLayerId === layer.dataSourceJson.id) {
                    if (index === layerFeatureGraphics.length - 1) {
                        oIdQueryString += oIdField + ' <> ' +
                            graphic.attributes[oIdField];
                    }
                    else {
                        oIdQueryString += oIdField + ' <> ' +
                            graphic.attributes[oIdField] + ' and ';
                    }
                }
            });
            return oIdQueryString;
        };
        this.selectFeatureForProfiling = (feature) => {
            let addAtFirst = false;
            let reverse = false;
            const graphicsLength = this.drawingLayer.graphics.length;
            //if any features is already added then check the new selected one should be added as the first or last in the layer
            if (graphicsLength > 0) {
                const firstGeometry = this.drawingLayer.graphics.getItemAt(0).geometry;
                const lastGeometry = this.drawingLayer.graphics.getItemAt(graphicsLength - 1).geometry;
                const oldStartPoint = firstGeometry.getPoint(0, 0);
                const oldEndPoint = lastGeometry.getPoint(0, lastGeometry.paths[0].length - 1);
                const newStartPoint = feature.geometry.getPoint(0, 0);
                const newEndPoint = feature.geometry.getPoint(0, feature.geometry.paths[0].length - 1);
                //Old Start is same as new Start
                if (geometryEngine.intersects(newStartPoint, oldStartPoint)) {
                    addAtFirst = true;
                    reverse = true;
                    //Old Start is same as new End
                }
                else if (geometryEngine.intersects(newEndPoint, oldStartPoint)) {
                    addAtFirst = true;
                    reverse = false;
                    // Old End is same as new End
                }
                else if (geometryEngine.intersects(newEndPoint, oldEndPoint)) {
                    addAtFirst = false;
                    reverse = true;
                    // Old End is same as new Start
                }
                else if (geometryEngine.intersects(newStartPoint, oldEndPoint)) {
                    addAtFirst = false;
                    reverse = false;
                }
            }
            const color = new Color(this.state.graphicsHighlightColor);
            const rgbaColor = color.toRgba();
            // rgbaColor[3] = 0.5
            const polylineSymbol = {
                type: 'simple-line',
                color: rgbaColor,
                width: 5
            };
            const polylineGeometry = feature.geometry;
            //flip the polyline geometry direction to get proper sequence
            if (reverse) {
                const flippedPaths = [];
                for (let j = polylineGeometry.paths.length - 1; j >= 0; j--) {
                    const arr1 = [];
                    for (let i = polylineGeometry.paths[j].length - 1; i >= 0; i--) {
                        arr1.push(polylineGeometry.paths[j][i]);
                    }
                    flippedPaths.push(arr1);
                }
                polylineGeometry.paths = flippedPaths;
            }
            //create new graphic with the newly selected geometry
            const polylineGraphic = new Graphic({
                geometry: polylineGeometry,
                attributes: feature.attributes,
                symbol: polylineSymbol
            });
            //On selecting new feature render the chart
            if (!this.state.addToSelectionTool) {
                this._activateAddToSelectionTool();
                this._defaultViewModel.input = polylineGraphic;
            }
            if (addAtFirst) {
                this.drawingLayer.graphics.add(polylineGraphic, 0);
            }
            else {
                this.drawingLayer.graphics.add(polylineGraphic);
            }
            //remove previous possible selection and highlight the new nextPossible selection
            this.nextPossibleSelectionLayer.removeAll();
            setTimeout(() => {
                //render chart dynamically on select lines
                this.renderChartOnSelect();
                this.highlightNextPossibleSelection();
            }, 200);
        };
        //If selected feature have multiple paths then the distance calculations was getting impacted
        //Whenever new feature is selected create its data into on single path and then add in to drawing layer
        this.createSinglePathPolyline = (polylineGeometry) => {
            const singlePath = [];
            polylineGeometry.paths.forEach((eachPath) => {
                eachPath.forEach((eachPoint) => singlePath.push(eachPoint));
            });
            // create new merged polyline feature to generate ground profile
            const newPolyLine = new Polyline({
                hasZ: polylineGeometry.hasZ,
                spatialReference: polylineGeometry.spatialReference.toJSON()
            });
            newPolyLine.addPath(singlePath);
            return newPolyLine;
        };
        this.renderChartOnSelect = () => {
            if (this.state.addToSelectionTool) {
                let graphic;
                //If selected line features length is more than one then merge them and create one single polyline for generating profile
                //Make union of the selected features by merging points in each path of each feature in to a single path and create only one graphic with one path
                if (this.drawingLayer.graphics.length > 1) {
                    // create new merged polyline feature to generate ground profile
                    const newPolyLine = new Polyline({
                        spatialReference: this.drawingLayer.graphics.getItemAt(0).geometry.spatialReference.toJSON()
                    });
                    let singlePath = [];
                    //get geometries of all selected/drawn features and merge to create single polyline with only one path
                    //If any line have multiple path keep them as it is, dont merge multiple paths of single line, it will corrupt the geometry
                    this.drawingLayer.graphics.forEach((eachFeature) => {
                        const eachGeometry = eachFeature.geometry;
                        //if geometry have multiple paths then add those paths into new polyline directly
                        //else add points in single path array
                        if (eachGeometry.paths.length > 1) {
                            eachGeometry.paths.forEach((eachPath) => {
                                if (singlePath.length > 0) {
                                    eachPath.forEach((eachPoint) => singlePath.push(eachPoint));
                                    newPolyLine.addPath(singlePath);
                                    singlePath = [];
                                }
                                else {
                                    newPolyLine.addPath(eachPath);
                                }
                            });
                        }
                        else {
                            const newLinesPathLength = newPolyLine.paths.length;
                            if (newLinesPathLength > 0) {
                                eachGeometry.paths.forEach((eachPath) => {
                                    eachPath.forEach((eachPoint) => newPolyLine.paths[newLinesPathLength - 1].push(eachPoint));
                                });
                            }
                            else {
                                eachGeometry.paths.forEach((eachPath) => {
                                    eachPath.forEach((eachPoint) => singlePath.push(eachPoint));
                                });
                            }
                        }
                    });
                    if (singlePath.length > 0) {
                        newPolyLine.addPath(singlePath);
                    }
                    graphic = new Graphic({
                        geometry: newPolyLine
                    });
                }
                else if (this.drawingLayer.graphics.length === 1) {
                    graphic = this.drawingLayer.graphics.getItemAt(0);
                }
                this._defaultViewModel.input = graphic;
            }
        };
        this.highlightNextPossibleSelection = () => {
            let firstPoint, lastPoint, firstGeometry, lastGeometry;
            const graphicsLength = this.drawingLayer.graphics.length;
            if (graphicsLength > 0) {
                firstGeometry = this.drawingLayer.graphics.getItemAt(0).geometry;
                firstPoint = firstGeometry.getPoint(0, 0);
                let lastIdx = firstGeometry.paths[0].length - 1;
                lastPoint = firstGeometry.getPoint(0, lastIdx);
                //if more than one graphics then use last point of the last graphics
                if (graphicsLength > 1) {
                    lastGeometry = this.drawingLayer.graphics.getItemAt(graphicsLength - 1).geometry;
                    lastIdx = lastGeometry.paths[0].length - 1;
                    lastPoint = lastGeometry.getPoint(0, lastIdx);
                }
            }
            const fg = new Graphic({
                geometry: firstPoint
            });
            this.nextPossibleSelectionLayer.graphics.add(fg);
            const lg = new Graphic({
                geometry: lastPoint
            });
            this.nextPossibleSelectionLayer.graphics.add(lg);
            this.queryForNextPossibleSelection([firstPoint, lastPoint]);
        };
        this.queryForNextPossibleSelection = (endPointsGeometry) => {
            let defArrResult = [];
            endPointsGeometry.forEach((point) => {
                defArrResult = defArrResult.concat(this.queryForIndividualLayers(this.state.jimuMapView.dataSourceId, this.pointToExtent(point)));
            });
            this.setState({
                loadingIndicator: true
            });
            Promise.all(defArrResult).then((results) => {
                this.setState({
                    loadingIndicator: false
                });
                const nextSelectableFeatures = [];
                //Merge all the arrays into a single array
                const combinedResults = results.flat();
                if ((combinedResults === null || combinedResults === void 0 ? void 0 : combinedResults.length) > 0) {
                    combinedResults.forEach((feature) => {
                        var _a, _b, _c, _d, _e;
                        if (((_b = (_a = feature === null || feature === void 0 ? void 0 : feature.geometry) === null || _a === void 0 ? void 0 : _a.paths) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            const firstPoint = feature.geometry.getPoint(0, 0);
                            const lastIdx = feature.geometry.paths[feature.geometry.paths.length - 1].length - 1;
                            const lastPoint = feature.geometry.getPoint(0, lastIdx);
                            //need to check returned geometries end point is intersecting with one of the endpoint of already selected line
                            //since the intersection query will return the lines intersecting in between to the endpoints.
                            if ((firstPoint && geometryEngine.intersects(endPointsGeometry[0], firstPoint)) ||
                                (lastPoint && geometryEngine.intersects(endPointsGeometry[0], lastPoint)) ||
                                (firstPoint && geometryEngine.intersects(endPointsGeometry[1], firstPoint)) ||
                                (lastPoint && geometryEngine.intersects(endPointsGeometry[1], lastPoint))) {
                                const polylineSymbol = {
                                    type: 'simple-line',
                                    color: [252, 252, 3, 0.8],
                                    style: 'short-dot',
                                    width: ((_e = (_d = (_c = this.state) === null || _c === void 0 ? void 0 : _c.jimuMapView) === null || _d === void 0 ? void 0 : _d.view) === null || _e === void 0 ? void 0 : _e.type) === '3d' ? 7 : 4
                                };
                                const polylineGraphic = new Graphic({
                                    geometry: feature.geometry,
                                    attributes: feature.attributes,
                                    symbol: polylineSymbol
                                });
                                nextSelectableFeatures.push(polylineGraphic);
                            }
                        }
                    });
                    if (nextSelectableFeatures && nextSelectableFeatures.length > 0) {
                        this.nextPossibleSelectionLayer.graphics.addMany(nextSelectableFeatures);
                    }
                }
                setTimeout(() => {
                    this.updateStateCanAddToSelection();
                }, 200);
            }, (err) => {
                console.log(err);
                this.updateStateCanAddToSelection();
            });
        };
        this.updateStateCanAddToSelection = () => {
            //based on possible next selection show or hide the addToSelection tool
            const results = this.nextPossibleSelectionLayer.graphics.filter((graphic) => {
                return graphic.geometry.type === 'polyline';
            });
            let newState = false;
            if (results.length > 0) {
                newState = true;
            }
            else {
                if (this.newFeatureSelection) {
                    this.setState({
                        noGraphicAfterFirstSelection: true
                    });
                }
                else {
                    this.setState({
                        noGraphicAfterFirstSelection: false
                    });
                }
            }
            if (!newState) {
                this._deActivateAddToSelectionTool();
            }
        };
        this._activateAddToSelectionTool = () => {
            var _a;
            if (!this.state.addToSelectionTool) {
                this.setState({
                    addToSelectionTool: true,
                    drawingOrSelectingComplete: false
                });
            }
            if (this.state.jimuMapView && this.state.jimuMapView.view) {
                this.state.jimuMapView.view.popup.autoOpenEnabled = false;
            }
            this._displayAddToSelectionCursor();
            (_a = this.nextPossibleSelectionLayer) === null || _a === void 0 ? void 0 : _a.set('visible', true);
        };
        this._deActivateAddToSelectionTool = () => {
            var _a;
            if (this.state.addToSelectionTool) {
                this.setState({
                    addToSelectionTool: false,
                    drawingOrSelectingComplete: true
                });
            }
            if (this.state.jimuMapView && this.state.jimuMapView.view) {
                this.state.jimuMapView.view.popup.autoOpenEnabled = true;
            }
            this._displayDefaultCursor();
            (_a = this.nextPossibleSelectionLayer) === null || _a === void 0 ? void 0 : _a.set('visible', false);
        };
        this._displayAddToSelectionCursor = () => {
            if (this.state.jimuMapView && this.state.jimuMapView.view) {
                if (this.state.jimuMapView.view && this.state.jimuMapView.view.container &&
                    this.state.jimuMapView.view.container.style.cursor !== null) {
                    this.state.jimuMapView.view.container.style.cursor = 'copy';
                }
            }
        };
        this.activateDrawOrSelectTool = () => {
            //Check for a valid sketch modal and then do the further processing
            if (this.state.currentSketchVM) {
                //Cancel sketchVM if newSelection or drawTool is active
                if (this.state.drawModeActive || this.state.selectModeActive) {
                    this.state.currentSketchVM.cancel();
                }
                this.setState({
                    drawingOrSelectingComplete: false,
                    startChartRendering: false,
                    viewModelErrorState: false
                }, () => {
                    //Activate draw tool
                    if (this.state.drawModeActive) {
                        if (this._defaultViewModel) {
                            this._defaultViewModel.start({ mode: 'sketch' });
                        }
                    }
                    //Activate select tool
                    if (this.state.selectModeActive) {
                        this.state.currentSketchVM.create('point');
                    }
                });
            }
        };
        this.destroyDrawingLayers = () => {
            if (this.drawingLayer) {
                this.drawingLayer.removeAll();
                this.drawingLayer.destroy();
            }
            if (this.nextPossibleSelectionLayer) {
                this.nextPossibleSelectionLayer.removeAll();
                this.nextPossibleSelectionLayer.destroy();
            }
            this.hideChartPosition();
        };
        this._displayDefaultCursor = () => {
            if (this.state.jimuMapView && this.state.jimuMapView.view) {
                if (this.state.jimuMapView.view && this.state.jimuMapView.view.container &&
                    this.state.jimuMapView.view.container.style.cursor !== null) {
                    this.state.jimuMapView.view.container.style.cursor = null;
                }
            }
        };
        this.pointToExtent = (point, pixelTolerance = 5) => {
            //calculate map coords represented per pixel
            const viewExtentWidth = this.state.jimuMapView.view.extent.get('width');
            const viewWidth = this.state.jimuMapView.view.get('width');
            const pixelWidth = viewExtentWidth / viewWidth;
            //calculate map coords for tolerance in pixel
            const toleranceInMapCoords = pixelTolerance * pixelWidth;
            //calculate & return computed extent
            const areaExtent = {
                xmin: (point.x - toleranceInMapCoords),
                ymin: (point.y - toleranceInMapCoords),
                xmax: (point.x + toleranceInMapCoords),
                ymax: (point.y + toleranceInMapCoords),
                spatialReference: this.state.jimuMapView.view.spatialReference
            };
            return new Extent(areaExtent);
        };
        this.selectableLayersAvailableAtRuntime = (layers) => {
            this.selectableLayersAtRuntime = layers;
        };
        this.onSelectButtonClicked = () => {
            this.setState({
                initialStage: false,
                resultStage: true,
                selectModeActive: true,
                drawModeActive: false
            }, () => {
                this.activateDrawOrSelectTool();
            });
        };
        this.onDrawButtonClicked = () => {
            this.setState({
                initialStage: false,
                resultStage: true,
                selectModeActive: false,
                drawModeActive: true
            }, () => {
                this.activateDrawOrSelectTool();
            });
        };
        this.onBackClick = () => {
            this.clearAll();
            this.setState({
                initialStage: true,
                startChartRendering: false,
                drawingOrSelectingComplete: false,
                resultStage: false,
                drawModeActive: false,
                selectModeActive: false
            });
        };
        this.clearAll = () => {
            var _a;
            if (this.state.drawModeActive || this.state.selectModeActive) {
                (_a = this.state.currentSketchVM) === null || _a === void 0 ? void 0 : _a.cancel();
            }
            this._deActivateAddToSelectionTool();
            this.clearGraphics();
            this.clearChart();
            if (this._defaultViewModel) {
                this._defaultViewModel.clear();
            }
        };
        this.clearGraphics = () => {
            //remove drawn, chartPosition, selected and nextPossible selection graphics layer
            if (this.drawingLayer) {
                this.drawingLayer.removeAll();
            }
            if (this.nextPossibleSelectionLayer) {
                this.nextPossibleSelectionLayer.removeAll();
            }
            this.hideChartPosition();
        };
        this.clearChart = () => {
            //clear profile result, which will result in clearing the chart
            this.setState({
                profileResult: null,
                noFeaturesError: false
            });
        };
        this.activateToolForNewProfile = () => {
            //Clear all the previous chart and graphics and create New Profile
            this.clearAll();
            this.setState({
                initialStage: false,
                resultStage: true
            }, () => {
                this.activateDrawOrSelectTool();
            });
        };
        this.onDoneButtonCLicked = () => {
            let enableNewProfileOption = false;
            this._defaultViewModel.stop();
            if (this._defaultViewModel.state === 'created' || this._defaultViewModel.state === 'selected') {
                enableNewProfileOption = true;
            }
            if (enableNewProfileOption) {
                this.stopFurtherSelectingLines();
            }
            else {
                this.activateDrawOrSelectTool();
            }
            return enableNewProfileOption;
        };
        this.stopFurtherSelectingLines = () => {
            this._deActivateAddToSelectionTool();
            if (this.nextPossibleSelectionLayer) {
                this.nextPossibleSelectionLayer.removeAll();
            }
        };
        this.highlightChartPosition = (x) => {
            if (this._defaultViewModel) {
                this._defaultViewModel.hoveredChartPosition = x;
            }
        };
        this.hideChartPosition = () => {
            if (this._defaultViewModel) {
                this._defaultViewModel.hoveredChartPosition = null;
            }
        };
        this.renderFrontLandingPage = () => {
            var _a, _b;
            return (jsx("div", { tabIndex: -1, className: 'h-100 w-100 d-flex align-items-center mainSection' },
                jsx("div", { tabIndex: -1, className: 'adjust-cards' },
                    jsx(Card, { tabIndex: 0, "aria-label": this.nls('selectLinesDesc'), button: true, "data-testid": 'selectButton', className: classNames('front-cards mt-3 mb-3 shadow', this.state.currentDatasource === 'default' || this.state.lineLayersNotFound ? 'hidden' : 'front-section'), onClick: this.onSelectButtonClicked, onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                this.onSelectButtonClicked();
                            }
                        } },
                        jsx(CardBody, { className: 'w-100 h-100 p-3' },
                            jsx("h5", { className: 'text-truncate', style: { textAlign: 'center' } }, this.nls('selectLinesLabel')),
                            jsx("p", { title: this.nls('selectLinesDesc'), className: 'm-3 userGuideInfo' }, this.nls('selectLinesDesc')),
                            jsx("div", { style: { textAlign: 'center' } },
                                jsx(Button, { role: 'button', "aria-label": this.nls('selectButtonLabel'), title: this.nls('selectButtonLabel'), size: 'default', type: 'secondary', className: 'text-break' }, ((_a = this.props.config.generalSettings) === null || _a === void 0 ? void 0 : _a.buttonStyle) === ButtonTriggerType.IconText &&
                                    jsx(React.Fragment, null,
                                        jsx(Icon, { size: '12', icon: epIcon.selectIcon }),
                                        this.nls('selectButtonLabel')))))),
                    jsx(Card, { tabIndex: 0, "aria-label": this.nls('drawProfileDesc'), button: true, "data-testid": 'drawButton', className: classNames('front-cards front-section mt-3 mb-3 shadow', this.state.currentDatasource === 'default' || this.state.lineLayersNotFound ? 'h-100 ' : ''), onClick: this.onDrawButtonClicked, onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                this.onDrawButtonClicked();
                            }
                        } },
                        jsx(CardBody, { className: 'w-100 h-100 p-3' },
                            jsx("h5", { className: 'text-truncate', style: { textAlign: 'center' } }, this.nls('drawProfileLabel')),
                            jsx("p", { title: this.nls('drawProfileDesc'), className: 'm-3 userGuideInfo' }, this.nls('drawProfileDesc')),
                            jsx("div", { style: { textAlign: 'center' } },
                                jsx(Button, { role: 'button', "aria-label": this.nls('drawButtonLabel'), title: this.nls('drawButtonLabel'), size: 'default', type: 'secondary', className: 'text-break' }, ((_b = this.props.config.generalSettings) === null || _b === void 0 ? void 0 : _b.buttonStyle) === ButtonTriggerType.IconText &&
                                    jsx(React.Fragment, null,
                                        jsx(Icon, { size: '12', icon: epIcon.drawIcon }),
                                        this.nls('drawButtonLabel')))))))));
        };
        this.resetToDefault = () => {
            var _a;
            if (this.state.drawModeActive || this.state.selectModeActive) {
                (_a = this.state.currentSketchVM) === null || _a === void 0 ? void 0 : _a.cancel();
            }
            if (this._defaultViewModel) {
                this._defaultViewModel.clear();
            }
            this.clearGraphics();
            this._displayDefaultCursor();
        };
        this.defaultConfig = this.createDefaultConfigForDataSource();
        this.newFeatureSelection = false;
        //create all graphic layers for drawing, highlighting etc.
        this.createDrawingLayers();
        this.activeCurrentDs = 'default';
        this.selectableLayersAtRuntime = [];
        this.selectedUnit = defaultSelectedUnits(this.props.config.configInfo[this.props.config.activeDataSource], this.props.portalSelf);
        this.state = {
            initialStage: true,
            resultStage: false,
            selectModeActive: (_a = this.props.config.generalSettings) === null || _a === void 0 ? void 0 : _a.isSelectToolActive,
            addToSelectionTool: false,
            drawModeActive: (_b = this.props.config.generalSettings) === null || _b === void 0 ? void 0 : _b.isDrawToolActive,
            drawingOrSelectingComplete: false,
            currentDatasource: this.props.config.activeDataSource,
            currentSketchVM: null,
            jimuMapView: null,
            startChartRendering: false,
            groundColor: (_d = (_c = this.props.config.configInfo[this.props.config.activeDataSource]) === null || _c === void 0 ? void 0 : _c.profileChartSettings) === null || _d === void 0 ? void 0 : _d.groundColor,
            graphicsHighlightColor: (_f = (_e = this.props.config.configInfo[this.props.config.activeDataSource]) === null || _e === void 0 ? void 0 : _e.profileChartSettings) === null || _f === void 0 ? void 0 : _f.graphicsHighlightColor,
            chartColorRender: '',
            customElevationLayer: (_h = (_g = this.props.config.configInfo[this.props.config.activeDataSource]) === null || _g === void 0 ? void 0 : _g.profileChartSettings) === null || _h === void 0 ? void 0 : _h.isCustomElevationLayer,
            elevationLayer: (_k = (_j = this.props.config.configInfo[this.props.config.activeDataSource]) === null || _j === void 0 ? void 0 : _j.profileChartSettings) === null || _k === void 0 ? void 0 : _k.elevationLayerURL,
            profileResult: null,
            selectedLinearUnit: this.selectedUnit[1],
            selectedElevationUnit: this.selectedUnit[0],
            noFeaturesError: false,
            profileLineLayers: [],
            lineLayersNotFound: !(((_l = this.props.config.configInfo[this.props.config.activeDataSource]) === null || _l === void 0 ? void 0 : _l.advanceOptions) &&
                this.props.config.configInfo[this.props.config.activeDataSource].profileSettings.layers.length !== 0),
            viewModelErrorState: false,
            profileErrorMsg: '',
            noGraphicAfterFirstSelection: false,
            loadingIndicator: false
        };
    }
    render() {
        const frontPage = this.renderFrontLandingPage();
        let jmc;
        const useMapWidget = this.props.useMapWidgetIds &&
            this.props.useMapWidgetIds[0];
        // If the user has selected a map, include JimuMapViewComponent.
        if (this.props.config.useMapWidget) {
            if (Object.prototype.hasOwnProperty.call(this.props, 'useMapWidgetIds') &&
                this.props.useMapWidgetIds &&
                this.props.useMapWidgetIds.length === 1) {
                jmc = jsx(JimuMapViewComponent, { useMapWidgetId: this.props.useMapWidgetIds[0], onActiveViewChange: this.activeViewChangeHandler.bind(this) });
            }
        }
        //If map widget is not available or deleted then widget should revert to placeholder instantly
        if (!useMapWidget) {
            this.resetToDefault();
            return (jsx(WidgetPlaceholder, { icon: epIcon.elevationIcon, widgetId: this.props.id, "data-testid": 'widgetPlaceholder', message: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: this.nls('_widgetLabel') }) }));
        }
        return (jsx("div", { css: getStyle(this.props.theme), className: 'jimu-widget' },
            jsx("div", { className: 'widget-elevation-profile' },
                jmc,
                this.state.initialStage &&
                    frontPage,
                this.state.resultStage &&
                    jsx(ResultPane, { theme: this.props.theme, intl: this.props.intl, widgetId: this.props.id, portalSelf: this.props.portalSelf, displayLoadingIndicator: this.state.loadingIndicator, activeDataSource: this.state.currentDatasource, commonDsGeneralSettings: this.props.config.generalSettings, defaultConfig: this.defaultConfig, activeDatasourceConfig: this.props.config.configInfo[this.state.currentDatasource], profileResult: this.state.profileResult, selectMode: this.state.selectModeActive, drawMode: this.state.drawModeActive, drawingOrSelectingComplete: this.state.drawingOrSelectingComplete, isNewSegmentsForSelection: this.state.addToSelectionTool, noGraphicAfterFirstSelection: this.state.noGraphicAfterFirstSelection, chartRender: this.state.startChartRendering, chartColorRender: this.state.chartColorRender, noFeaturesFoundError: this.state.noFeaturesError, onNavBack: this.onBackClick, doneClick: this.onDoneButtonCLicked, activateDrawSelectToolForNewProfile: this.activateToolForNewProfile, selectabelLayersRuntime: this.selectableLayersAvailableAtRuntime, chartPosition: this.highlightChartPosition, hideChartPosition: this.hideChartPosition, drawingLayer: this.drawingLayer, jimuMapview: this.state.jimuMapView, viewModelErrorState: this.state.viewModelErrorState, profileErrorMsg: this.state.profileErrorMsg }))));
    }
}
Widget.mapExtraStateProps = (state) => {
    var _a;
    return {
        appMode: (_a = state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.appMode
    };
};
//# sourceMappingURL=widget.js.map