var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, DataSourceManager, ExtentChangeMessage, DataSourceComponent, portalUrlUtils, getAppStore, MutableStoreManager, dataSourceUtils } from 'jimu-core';
import { SceneQualityMode } from '../../config';
import { DataSourceTypes, loadArcGISJSAPIModules, MapViewManager, zoomToUtils } from 'jimu-arcgis';
import { defaultMessages, Icon } from 'jimu-ui';
import { createNewFeaturelayer, updateFeaturelayer, getMapBaseRestoreData, restoreMapBase, selectFeature, mapPanto, flashFeaturesByQuery, projectGeometries, filterFeaturesByQuery, processZoomToFeatures } from '../utils';
import { MultiSourceMapContext } from './multisourcemap-context';
const Exchange = require('../assets/icons/exchange.svg');
export var MapLoadStatus;
(function (MapLoadStatus) {
    MapLoadStatus["Loading"] = "LOADING";
    MapLoadStatus["Loadok"] = "LOADOK";
    MapLoadStatus["LoadError"] = "LOADERROR";
})(MapLoadStatus || (MapLoadStatus = {}));
export default class MapBase extends React.PureComponent {
    constructor(props) {
        super(props);
        this.highLightHandles = {};
        this.mapBaseViewEventHandles = {};
        this.dsManager = DataSourceManager.getInstance();
        this.onExtented = null;
        this.isFirstReceiveMessage = true;
        this.isRequestingMap = false;
        this.__unmount = false;
        this.startRenderMap = () => {
            loadArcGISJSAPIModules([
                'esri/geometry/Extent',
                'esri/Viewpoint'
            ]).then(modules => {
                [
                    this.Extent, this.Viewpoint
                ] = modules;
                if (this.__unmount) {
                    return;
                }
                this.setState({
                    isModulesLoaded: true
                });
            });
        };
        this.analysisMapView = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.mapView) {
                if (this.MapView) {
                    return yield this.initMapView();
                }
                else {
                    return yield loadArcGISJSAPIModules([
                        'esri/geometry/Geometry',
                        'esri/webmap/InitialViewProperties',
                        'esri/Basemap',
                        'esri/layers/TileLayer',
                        'esri/views/MapView',
                        'esri/WebMap',
                        'esri/portal/Portal',
                        'esri/portal/PortalItem',
                        'esri/Color'
                    ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                        [
                            this.Geometry, this.InitialViewProperties, this.Basemap, this.TileLayer, this.MapView, this.WebMap, this.Portal, this.PortalItem, this.Color
                        ] = modules;
                        return yield this.initMapView();
                    }));
                }
            }
            else {
                return yield Promise.resolve();
            }
        });
        this.analysisSceneView = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sceneView) {
                if (this.SceneView) {
                    return yield this.initSceneView();
                }
                else {
                    return yield loadArcGISJSAPIModules([
                        'esri/views/SceneView',
                        'esri/WebScene',
                        'esri/portal/Portal',
                        'esri/portal/PortalItem',
                        'esri/Color'
                    ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                        [
                            this.SceneView, this.WebScene, this.Portal, this.PortalItem, this.Color
                        ] = modules;
                        return yield this.initSceneView();
                    }));
                }
            }
            else {
                return yield Promise.resolve();
            }
        });
        this.generateViewPointFromInitialMapState = (initialMapState) => {
            if (initialMapState.viewType === '2d') {
                return new this.Viewpoint({
                    targetGeometry: this.Extent.fromJSON(initialMapState.extent),
                    rotation: initialMapState.rotation
                });
            }
            else {
                return this.Viewpoint.fromJSON(initialMapState.viewPoint);
            }
        };
        this.cloneMap = () => __awaiter(this, void 0, void 0, function* () {
            let map = null;
            const dataSourceJson = this.getDsJsonFromDsId(this.props.dataSourceId);
            let MapClass = null;
            if (dataSourceJson.type === DataSourceTypes.WebMap) {
                MapClass = this.WebMap;
            }
            if (dataSourceJson.type === DataSourceTypes.WebScene) {
                MapClass = this.WebScene;
            }
            if (dataSourceJson.portalUrl) {
                const portal = new this.Portal({
                    url: portalUrlUtils.getPlatformUrlByOrgUrl(dataSourceJson.portalUrl)
                });
                map = new MapClass({
                    portalItem: new this.PortalItem({
                        id: dataSourceJson.itemId,
                        portal: portal
                    })
                });
            }
            else {
                map = new MapClass({
                    portalItem: new this.PortalItem({
                        id: dataSourceJson.itemId
                    })
                });
            }
            if (dataSourceUtils.getWhetherUseProxy()) {
                return yield map.load().then(() => __awaiter(this, void 0, void 0, function* () {
                    return yield map.when(() => __awaiter(this, void 0, void 0, function* () {
                        const tables = map.tables ? map.tables.toArray() : [];
                        tables.forEach(table => {
                            const sourceUrl = dataSourceUtils.getUrlByLayer(table);
                            if (!sourceUrl) {
                                return;
                            }
                            const proxyUrl = dataSourceUtils.getDataSourceProxyUrl(sourceUrl);
                            if (proxyUrl) {
                                table.url = proxyUrl;
                            }
                        });
                        map.allLayers.toArray()
                            .forEach(layer => {
                            const sourceUrl = dataSourceUtils.getUrlByLayer(layer);
                            if (!sourceUrl) {
                                return;
                            }
                            const proxyUrl = dataSourceUtils.getDataSourceProxyUrl(sourceUrl);
                            if (proxyUrl) {
                                layer.url = proxyUrl;
                            }
                        });
                        return Promise.resolve(map);
                    }));
                }));
            }
            else {
                return Promise.resolve(map);
            }
        });
        this.getInitViewPointForDefaultWebMap = () => {
            const defaultExtent = this.props.defaultMapInfo && this.props.defaultMapInfo.defaultExtent;
            let tempViewPoint = null;
            if (this.props.baseWidgetProps.config.initialMapState && this.props.baseWidgetProps.config.initialMapState.viewPoint) {
                tempViewPoint = this.generateViewPointFromInitialMapState(this.props.baseWidgetProps.config.initialMapState);
            }
            else {
                tempViewPoint = new this.Viewpoint({
                    targetGeometry: new this.Extent({
                        xmin: defaultExtent && defaultExtent.xmin,
                        ymin: defaultExtent && defaultExtent.ymin,
                        xmax: defaultExtent && defaultExtent.xmax,
                        ymax: defaultExtent && defaultExtent.ymax,
                        spatialReference: { wkid: defaultExtent.spatialReference.wkid }
                    })
                });
            }
            return tempViewPoint;
        };
        this.getDefaultWebMap = () => {
            const defaultExtent = this.props.defaultMapInfo && this.props.defaultMapInfo.defaultExtent;
            let tempViewPoint = null;
            tempViewPoint = new this.Viewpoint({
                targetGeometry: new this.Extent({
                    xmin: defaultExtent && defaultExtent.xmin,
                    ymin: defaultExtent && defaultExtent.ymin,
                    xmax: defaultExtent && defaultExtent.xmax,
                    ymax: defaultExtent && defaultExtent.ymax,
                    spatialReference: { wkid: defaultExtent.spatialReference.wkid }
                })
            });
            const defaultWebmap = new this.WebMap({
                portalItem: {
                    id: this.props.defaultMapInfo.defaultMapId,
                    portal: {
                        url: this.props.baseWidgetProps.portalUrl
                    }
                },
                initialViewProperties: new this.InitialViewProperties({
                    spatialReference: defaultExtent && defaultExtent.spatialReference,
                    viewpoint: tempViewPoint
                })
            });
            return defaultWebmap;
        };
        this.initMapView = () => __awaiter(this, void 0, void 0, function* () {
            this.extentWatch = null;
            this.fatalErrorWatch = null;
            if (this.mapView && !this.isRequestingMap) {
                return yield Promise.resolve();
            }
            if (this.isRequestingMap) {
                return;
            }
            this.isRequestingMap = true;
            let mapViewOption;
            if (this.props.isDefaultMap) {
                const defaultMap = this.getDefaultWebMap();
                mapViewOption = {
                    map: defaultMap,
                    container: this.mapContainer,
                    viewpoint: this.getInitViewPointForDefaultWebMap(),
                    rotation: this.props.baseWidgetProps.config.initialMapState && this.props.baseWidgetProps.config.initialMapState.rotation
                };
            }
            else {
                const tempWebmap = yield this.cloneMap();
                if (this.props.baseWidgetProps.config.initialMapState) {
                    mapViewOption = {
                        map: tempWebmap,
                        container: this.mapContainer,
                        viewpoint: this.props.baseWidgetProps.config.initialMapState &&
                            this.generateViewPointFromInitialMapState(this.props.baseWidgetProps.config.initialMapState)
                    };
                }
                else {
                    mapViewOption = {
                        map: tempWebmap,
                        container: this.mapContainer
                    };
                }
                if (this.props.baseWidgetProps.config.selectionHighlightColor) {
                    mapViewOption.highlightOptions = {
                        color: this.props.baseWidgetProps.config.selectionHighlightColor,
                        haloColor: this.props.baseWidgetProps.config.selectionHighlightHaloColor
                    };
                }
            }
            if (!window.jimuConfig.isInBuilder) {
                if (this.props.baseWidgetProps.queryObject[this.props.baseWidgetProps.id]) {
                    const extentStr = this.props.baseWidgetProps.queryObject[this.props.baseWidgetProps.id].substr('extent='.length);
                    let extent;
                    try {
                        extent = new this.Extent(JSON.parse(extentStr));
                    }
                    catch (err) {
                        console.error('Bad extent URL parameter.');
                    }
                    if (extent) {
                        mapViewOption.extent = extent;
                    }
                }
            }
            if (this.mapView) {
                return yield Promise.resolve();
            }
            this.mapView = new this.MapView(mapViewOption);
            this.mapView.popup.spinnerEnabled = false;
            if (this.props.isDefaultMap || (this.mapDs && this.mapDs.id === this.props.dataSourceId)) {
                this.createJimuMapView();
            }
            this.mapView.when(() => {
                var _a, _b, _c;
                // after view is loaded, send extent change message
                this.setState({ mapLoadStatus: MapLoadStatus.Loadok }, () => {
                    this.props.onMapLoaded(this.props.dataSourceId, MapLoadStatus.Loadok);
                });
                if (!this.extentWatch) {
                    // Should listen extentChange event when all layers are loaded, otherwise the callback will be called
                    // several times while view loading.
                    const startWatchExtentChangePromise = Promise.allSettled(this.mapView.map.allLayers.map((layer) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.mapView.whenLayerView(layer);
                    }))).then(() => {
                        return true;
                    }).catch(() => {
                        return true;
                    });
                    startWatchExtentChangePromise.then(() => {
                        this.extentWatch = this.mapView.watch('extent', (extent) => {
                            if (!extent) {
                                return;
                            }
                            clearTimeout(this.onExtented);
                            this.onExtented = setTimeout(() => {
                                if (!extent) {
                                    return;
                                }
                                if (this.mapView.isReceiveExtentChange) {
                                    this.mapView.isReceiveExtentChange = false;
                                }
                                else {
                                    const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, extent);
                                    extentMessage.addRelatedWidgetId(this.props.baseWidgetProps.id);
                                    this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                                }
                            }, 200);
                        });
                    });
                }
                if (!this.fatalErrorWatch) {
                    this.fatalErrorWatch = this.mapView.watch('fatalError', (error) => {
                        if (error) {
                            if (!this.mapView.isInCaching) {
                                console.error('Fatal Error! View has lost its WebGL context. Attempting to recover...');
                                this.mapView.tryFatalErrorRecovery();
                            }
                            else {
                                this.setState({
                                    isMapCrashed: true
                                });
                            }
                        }
                    });
                }
                // If there is an extent is passed from extentMessage before, don't init extent here as this will publish
                // extentMessage and change other mapWidget's extent.
                if (!((_c = (_b = (_a = this.props.baseWidgetProps) === null || _a === void 0 ? void 0 : _a.mutableStateProps) === null || _b === void 0 ? void 0 : _b.zoomToFeatureActionValue) === null || _c === void 0 ? void 0 : _c.value)) {
                    this.goHome(false).then(() => {
                        const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, this.mapView.extent);
                        extentMessage.addRelatedWidgetId(this.props.baseWidgetProps.id);
                        this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                        this.props.onViewChanged && this.props.onViewChanged({ dataSourceId: this.props.dataSourceId, viewpoint: this.mapView.viewpoint.clone() });
                    });
                }
            });
            this.isRequestingMap = false;
            this.bindMapBaseViewEvent(this.mapView);
            return Promise.resolve();
        });
        this.initSceneView = () => __awaiter(this, void 0, void 0, function* () {
            this.extentWatch = null;
            this.fatalErrorWatch = null;
            if (this.sceneView && !this.isRequestingMap) {
                return yield Promise.resolve();
            }
            if (this.isRequestingMap) {
                return;
            }
            this.isRequestingMap = true;
            const tempWebScene = yield this.cloneMap();
            const mapViewOption = {
                map: tempWebScene,
                container: this.mapContainer,
                popup: {
                    defaultPopupTemplateEnabled: true
                }
            };
            if (this.props.baseWidgetProps.config.initialMapState) {
                mapViewOption.viewpoint = this.props.baseWidgetProps.config.initialMapState &&
                    this.generateViewPointFromInitialMapState(this.props.baseWidgetProps.config.initialMapState);
            }
            if (this.props.baseWidgetProps.config.selectionHighlightColor) {
                mapViewOption.highlightOptions = {
                    color: new this.Color(this.props.baseWidgetProps.config.selectionHighlightColor),
                    haloColor: new this.Color(this.props.baseWidgetProps.config.selectionHighlightHaloColor)
                };
            }
            const sceneQualityMode = this.props.baseWidgetProps.config.sceneQualityMode;
            if (sceneQualityMode && sceneQualityMode !== SceneQualityMode.auto) {
                mapViewOption.qualityProfile = sceneQualityMode;
            }
            else {
                // use 'low' as default value
                mapViewOption.qualityProfile = SceneQualityMode.low;
            }
            if (this.sceneView) {
                return yield Promise.resolve();
            }
            this.sceneView = new this.SceneView(mapViewOption);
            this.sceneView.popup.spinnerEnabled = false;
            if (this.mapDs && this.mapDs.id === this.props.dataSourceId) {
                this.createJimuMapView();
            }
            this.sceneView.when(() => {
                var _a, _b, _c;
                // after view is loaded, send extent change message
                this.setState({ mapLoadStatus: MapLoadStatus.Loadok }, () => {
                    this.props.onMapLoaded(this.props.dataSourceId, MapLoadStatus.Loadok);
                });
                if (!this.extentWatch) {
                    // Should listen extentChange event when all layers are loaded, otherwise the callback will be called
                    // several times while view loading.
                    const startWatchExtentChangePromise = Promise.allSettled(this.sceneView.map.allLayers.map((layer) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.sceneView.whenLayerView(layer);
                    }))).then(() => {
                        return true;
                    }).catch(() => {
                        return true;
                    });
                    startWatchExtentChangePromise.then(() => {
                        this.extentWatch = this.sceneView.watch('extent', (extent) => {
                            if (!extent) {
                                return;
                            }
                            clearTimeout(this.onExtented);
                            this.onExtented = setTimeout(() => {
                                if (!extent) {
                                    return;
                                }
                                if (this.sceneView.isReceiveExtentChange) {
                                    this.sceneView.isReceiveExtentChange = false;
                                }
                                else {
                                    const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, extent);
                                    extentMessage.addRelatedWidgetId(this.props.baseWidgetProps.id);
                                    this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                                }
                            }, 100);
                        });
                    });
                }
                if (!this.fatalErrorWatch) {
                    this.fatalErrorWatch = this.sceneView.watch('fatalError', (error) => {
                        if (error) {
                            if (!this.sceneView.isInCaching) {
                                this.sceneView.tryFatalErrorRecovery();
                                console.error('Fatal Error! View has lost its WebGL context. Attempting to recover...');
                            }
                            else {
                                this.setState({
                                    isMapCrashed: true
                                });
                            }
                        }
                    });
                }
                // If there is an extent is passed from extentMessage before, don't init extent here as this will publish
                // extentMessage and change other mapWidget's extent.
                if (!((_c = (_b = (_a = this.props.baseWidgetProps) === null || _a === void 0 ? void 0 : _a.mutableStateProps) === null || _b === void 0 ? void 0 : _b.zoomToFeatureActionValue) === null || _c === void 0 ? void 0 : _c.value)) {
                    this.goHome(false).then(() => {
                        const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, this.sceneView.extent);
                        extentMessage.addRelatedWidgetId(this.props.baseWidgetProps.id);
                        this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                        this.props.onViewChanged && this.props.onViewChanged({ dataSourceId: this.props.dataSourceId, viewpoint: this.sceneView.viewpoint.clone() });
                    });
                }
            });
            this.isRequestingMap = false;
            this.bindMapBaseViewEvent(this.sceneView);
            return Promise.resolve();
        });
        this.updateMapView = (config, preConfig) => {
            var _a;
            const jimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
            let jimuMapView = null;
            if (jimuMapViewId) {
                jimuMapView = MapViewManager.getInstance().getJimuMapViewById(jimuMapViewId);
            }
            if (!jimuMapView || !this.mapView) {
                return;
            }
            // update popup options
            if (config.disablePopUp) {
                (_a = this.mapView.popup) === null || _a === void 0 ? void 0 : _a.close();
                this.mapView.popup && (this.mapView.popup.autoOpenEnabled = false);
            }
            else {
                this.mapView.popup && (this.mapView.popup.autoOpenEnabled = true);
            }
            if ((config.selectionHighlightColor && config.selectionHighlightColor !== (preConfig === null || preConfig === void 0 ? void 0 : preConfig.selectionHighlightColor)) ||
                (config.selectionHighlightHaloColor && config.selectionHighlightHaloColor !== (preConfig === null || preConfig === void 0 ? void 0 : preConfig.selectionHighlightHaloColor))) {
                const highlightOptions = Object.assign(Object.assign({}, this.mapView.highlightOptions), { color: new this.Color(config.selectionHighlightColor), haloColor: new this.Color(config.selectionHighlightHaloColor) });
                this.mapView.highlightOptions = highlightOptions;
            }
            if (!this.mapView.ui) {
                return;
            }
            this.mapView.ui.components = [];
        };
        this.updateSceneView = (config, preConfig) => {
            var _a;
            const jimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
            let jimuMapView = null;
            if (jimuMapViewId) {
                jimuMapView = MapViewManager.getInstance().getJimuMapViewById(jimuMapViewId);
            }
            if (!jimuMapView || !this.sceneView) {
                return;
            }
            // update popup option
            if (config.disablePopUp) {
                (_a = this.sceneView.popup) === null || _a === void 0 ? void 0 : _a.close();
                this.sceneView.popup && (this.sceneView.popup.autoOpenEnabled = false);
            }
            else {
                this.sceneView.popup && (this.sceneView.popup.autoOpenEnabled = true);
            }
            if ((config.selectionHighlightColor && config.selectionHighlightColor !== (preConfig === null || preConfig === void 0 ? void 0 : preConfig.selectionHighlightColor)) ||
                (config.selectionHighlightHaloColor && config.selectionHighlightHaloColor !== (preConfig === null || preConfig === void 0 ? void 0 : preConfig.selectionHighlightHaloColor))) {
                const highlightOptions = Object.assign(Object.assign({}, this.sceneView.highlightOptions), { color: new this.Color(config.selectionHighlightColor), haloColor: new this.Color(config.selectionHighlightHaloColor) });
                this.sceneView.highlightOptions = highlightOptions;
            }
            const sceneQualityMode = config.sceneQualityMode;
            if (sceneQualityMode && sceneQualityMode !== this.sceneView.qualityProfile) {
                this.sceneView.qualityProfile = sceneQualityMode;
            }
            if (!this.sceneView.ui) {
                return;
            }
            this.sceneView.ui.components = [];
        };
        this.bindMapBaseViewEvent = (mapBaseView) => {
            if (mapBaseView) {
                if (this.mapBaseViewEventHandles['mouse-wheel']) {
                    this.mapBaseViewEventHandles['mouse-wheel'].remove();
                    this.mapBaseViewEventHandles['mouse-wheel'] = null;
                }
                this.mapBaseViewEventHandles['mouse-wheel'] = mapBaseView.on('mouse-wheel', (e) => {
                    if (this.props.baseWidgetProps.config.disableScroll) {
                        e.stopPropagation();
                        this.handleDisableWheel();
                        return;
                    }
                    this.props.onViewChanged && this.props.onViewChanged({ dataSourceId: this.props.dataSourceId, viewpoint: mapBaseView.viewpoint.clone() });
                });
                if (this.mapBaseViewEventHandles.drag) {
                    this.mapBaseViewEventHandles.drag.remove();
                    this.mapBaseViewEventHandles.drag = null;
                }
                this.mapBaseViewEventHandles.drag = mapBaseView.on('drag', () => {
                    this.props.onViewChanged && this.props.onViewChanged({ dataSourceId: this.props.dataSourceId, viewpoint: mapBaseView.viewpoint.clone() });
                });
                if (this.mapBaseViewEventHandles.click) {
                    this.mapBaseViewEventHandles.click.remove();
                    this.mapBaseViewEventHandles.click = null;
                }
                this.mapBaseViewEventHandles.click = mapBaseView.on('click', () => {
                    for (const key in this.highLightHandles) {
                        this.highLightHandles[key].remove();
                    }
                });
            }
        };
        // onShowOnMapDataChanged = (showOnMapDatasKey) => {
        //  this.setState({
        //    showOnMapDatasKey: showOnMapDatasKey
        //  })
        // }
        this.createJimuMapView = () => {
            MapViewManager.getInstance().createJimuMapView({
                mapWidgetId: this.props.baseWidgetProps.id,
                dataSourceId: this.props.dataSourceId,
                view: this.mapView || this.sceneView,
                isEnablePopup: this.props.baseWidgetProps.config && !this.props.baseWidgetProps.config.disablePopUp,
                mapViewManager: MapViewManager.getInstance()
            });
            const mapBaseView = this.mapView || this.sceneView;
            if (mapBaseView) {
                mapBaseView.when(() => {
                    const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                    const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(tempJimuMapViewId);
                    if (tempJimuMapView) {
                        if (tempJimuMapView.view) {
                            tempJimuMapView.whenJimuMapViewLoaded().then(() => {
                                if (!tempJimuMapView.view) {
                                    MapViewManager.getInstance().destroyJimuMapView(tempJimuMapViewId);
                                    return;
                                }
                                this.props.onJimuMapViewCreated();
                                this.setState({
                                    mapBaseJimuMapView: tempJimuMapView
                                });
                            });
                        }
                        else {
                            MapViewManager.getInstance().destroyJimuMapView(tempJimuMapViewId);
                        }
                    }
                });
            }
            else {
                const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                MapViewManager.getInstance().destroyJimuMapView(tempJimuMapViewId);
            }
        };
        this.onDataSourceCreated = (dataSource) => {
            this.mapDs = dataSource;
            if (this.mapDs.id === this.props.dataSourceId && (this.mapView || this.sceneView)) {
                this.createJimuMapView();
            }
            this.setState({
                isMapCrashed: false
            });
        };
        this.onCreateDataSourceFailed = (err) => {
            console.warn(err);
            this.mapDs = null;
            this.setState({
                mapLoadStatus: MapLoadStatus.LoadError,
                isMapCrashed: false
            }, () => {
                this.props.onMapLoaded(this.props.dataSourceId, MapLoadStatus.LoadError);
                this.createJimuMapView();
            });
        };
        this.setViewPoint = (viewPoint) => {
            if (!viewPoint || !this.getDsJsonFromDsId(this.props.dataSourceId)) {
                return;
            }
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebMap) {
                if (this.mapView) {
                    this.mapView.viewpoint = viewPoint;
                }
            }
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebScene) {
                if (this.sceneView) {
                    this.sceneView.viewpoint = viewPoint;
                }
            }
        };
        this.getMapLoadStatus = () => {
            return this.state.mapLoadStatus;
        };
        this.getViewPoint = () => {
            if (!this.getDsJsonFromDsId(this.props.dataSourceId)) {
                return null;
            }
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebMap) {
                return this.mapView && this.mapView.viewpoint ? this.mapView.viewpoint.clone() : null;
            }
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebScene) {
                if (this.sceneView && this.sceneView.viewpoint) {
                    // For scene, the first extent (after scene loaded) is not correct. So we use go to camera to get correct extent
                    this.sceneView.goTo(this.sceneView.viewpoint.camera, {
                        animate: false
                    });
                    return this.sceneView.viewpoint.clone();
                }
                else {
                    return null;
                }
            }
        };
        this.getViewType = () => {
            return this.getDsJsonFromDsId(this.props.dataSourceId).type;
        };
        this.goToTilt = (tilt) => {
            this.sceneView && this.sceneView.goTo({
                tilt: tilt
            });
        };
        this.goHome = (useAmination) => __awaiter(this, void 0, void 0, function* () {
            if (!this.getDsJsonFromDsId(this.props.dataSourceId)) {
                return yield Promise.resolve();
            }
            const initViewPoint = this.getMapBaseInitViewPoint();
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebMap) {
                if (this.mapView) {
                    return this.mapView.goTo(initViewPoint, {
                        animate: useAmination
                    });
                }
            }
            if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebScene) {
                if (this.sceneView) {
                    return this.sceneView.goTo(initViewPoint, {
                        animate: useAmination
                    });
                }
            }
            return yield Promise.resolve();
        });
        this.getMapBaseInitViewPoint = () => {
            var _a, _b, _c, _d, _e, _f;
            if (this.props.isDefaultMap) {
                return this.getInitViewPointForDefaultWebMap();
            }
            else {
                if (this.props.baseWidgetProps.config.initialMapState) {
                    return this.generateViewPointFromInitialMapState(this.props.baseWidgetProps.config.initialMapState);
                }
                else {
                    if (this.mapView) {
                        return (_c = (_b = (_a = this.mapView.map) === null || _a === void 0 ? void 0 : _a.initialViewProperties) === null || _b === void 0 ? void 0 : _b.viewpoint) === null || _c === void 0 ? void 0 : _c.clone();
                    }
                    if (this.sceneView) {
                        return (_f = (_e = (_d = this.sceneView.map) === null || _d === void 0 ? void 0 : _d.initialViewProperties) === null || _e === void 0 ? void 0 : _e.viewpoint) === null || _f === void 0 ? void 0 : _f.clone();
                    }
                }
            }
        };
        this.getDsJsonFromDsId = (dataSourceId) => {
            const dsJson = getAppStore().getState().appConfig.dataSources[dataSourceId];
            return dsJson || {};
        };
        this.queryExtentFromQueryParams = (mapBaseView, dataSourceId, useDataSources) => {
            const dataSource = this.dsManager.getDataSource(dataSourceId);
            const queryParams = dataSource.getCurrentQueryParams();
            const useDefaultExtentOfCurrentView = !useDataSources.some(useDataSource => {
                const dataSource = this.dsManager.getDataSource(useDataSource.dataSourceId);
                const queryParams = dataSource.getRuntimeQueryParams();
                // use default extent if all merged SQLs on data source is remvoved.
                const hasQueryWhere = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.where) && queryParams.where !== '1=1';
                if (hasQueryWhere) {
                    return true;
                }
                else {
                    return false;
                }
            });
            let layerObjectPromise;
            if (dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) {
                layerObjectPromise = Promise.resolve(dataSource.layer);
            }
            else {
                layerObjectPromise = dataSource.createJSAPILayerByDataSource().then((layerObject) => Promise.resolve(layerObject));
            }
            return loadArcGISJSAPIModules([
                'esri/rest/support/Query',
                'esri/Graphic',
                'esri/geometry/Point'
            ]).then(modules => {
                const [Query, Graphic, Point] = modules;
                const query = new Query();
                query.where = queryParams === null || queryParams === void 0 ? void 0 : queryParams.where;
                return layerObjectPromise.then(layerObject => {
                    if (useDefaultExtentOfCurrentView) {
                        const initViewPoint = this.getMapBaseInitViewPoint();
                        return {
                            viewpoint: initViewPoint,
                            useDefaultExtentOfCurrentView: true,
                            singlePointGraphic: null,
                            count: 2,
                            layer: layerObject
                        };
                    }
                    return layerObject.queryExtent(query).then(result => {
                        var _a;
                        const extentCenter = (_a = result === null || result === void 0 ? void 0 : result.extent) === null || _a === void 0 ? void 0 : _a.center;
                        const extent = result === null || result === void 0 ? void 0 : result.extent;
                        let singlePointGraphic;
                        if ((result === null || result === void 0 ? void 0 : result.count) === 1 && (layerObject.geometryType === 'point') && extentCenter) {
                            const point = new Point({
                                x: extentCenter.x,
                                y: extentCenter.y,
                                spatialReference: extent.spatialReference
                            });
                            singlePointGraphic = new Graphic({ geometry: point });
                        }
                        return {
                            extent: extent,
                            singlePointGraphic: singlePointGraphic,
                            count: result === null || result === void 0 ? void 0 : result.count,
                            layer: layerObject
                        };
                    });
                });
            });
        };
        /**
         * handle data/action.
         */
        this.handleDataAction = (mutableStateProps, jimuMapView) => {
            // handle show data on map action
            if (mutableStateProps.showOnMapDatas) {
                jimuMapView.drawDataOnMap(mutableStateProps.showOnMapDatas);
            }
        };
        /**
         * handle message/action.
         */
        this.handleAction = (mutableStateProps, mapBaseView) => {
            var _a, _b;
            if (mutableStateProps.zoomToFeatureActionValue) {
                if (mutableStateProps.zoomToFeatureActionValue.relatedWidgets &&
                    mutableStateProps.zoomToFeatureActionValue.relatedWidgets.includes(this.props.baseWidgetProps.id)) {
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'zoomToFeatureActionValue', null);
                }
                else {
                    const tempMapBaseView = mapBaseView;
                    const relatedWidgets = mutableStateProps.zoomToFeatureActionValue.relatedWidgets
                        ? mutableStateProps.zoomToFeatureActionValue.relatedWidgets
                        : [];
                    const zoomToFeatureValue = mutableStateProps.zoomToFeatureActionValue.value;
                    let layer = null;
                    if (zoomToFeatureValue.layerId) {
                        layer = tempMapBaseView.map.layers.find(layer => layer.id === zoomToFeatureValue.layerId);
                    }
                    if (zoomToFeatureValue.type === 'zoom-to-extent') {
                        tempMapBaseView.isReceiveExtentChange = true;
                        zoomToUtils.zoomTo(tempMapBaseView, zoomToFeatureValue.features[0], zoomToFeatureValue.zoomToOption).then(() => {
                            relatedWidgets.push(this.props.baseWidgetProps.id);
                            const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, tempMapBaseView.extent);
                            extentMessage.setRelatedWidgetIds(relatedWidgets);
                            this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                        }, () => {
                            tempMapBaseView.isReceiveExtentChange = false;
                        });
                    }
                    else if (zoomToFeatureValue.type === 'zoom-to-query-params') {
                        this.queryExtentFromQueryParams(mapBaseView, zoomToFeatureValue.dataSourceId, zoomToFeatureValue.useDataSources).then((result) => {
                            let target;
                            if (result.count === 0) {
                                return;
                            }
                            else if (result.count === 1 && (result === null || result === void 0 ? void 0 : result.singlePointGraphic)) {
                                target = {
                                    graphics: [result === null || result === void 0 ? void 0 : result.singlePointGraphic],
                                    layer: result === null || result === void 0 ? void 0 : result.layer
                                };
                            }
                            else {
                                target = {
                                    extent: result === null || result === void 0 ? void 0 : result.extent,
                                    layer: result === null || result === void 0 ? void 0 : result.layer
                                };
                            }
                            // Because of 'zoomToUtils' does not support 'viewpoint', temporary code for using default viewpoint of sceneView.
                            if (result.useDefaultExtentOfCurrentView) {
                                tempMapBaseView.goTo(result.viewpoint);
                            }
                            else {
                                zoomToUtils.zoomTo(tempMapBaseView, target, zoomToFeatureValue.zoomToOption);
                            }
                        });
                    }
                    else {
                        let target = null;
                        if (layer) {
                            target = {
                                layer: layer,
                                graphics: zoomToFeatureValue.features
                            };
                        }
                        else {
                            target = zoomToFeatureValue.features;
                        }
                        processZoomToFeatures(tempMapBaseView, target.layer, (target && target.graphics) ? target.graphics : target).then(graphics => {
                            if (layer) {
                                target.graphics = graphics;
                            }
                            else {
                                target = graphics;
                            }
                            tempMapBaseView.isReceiveExtentChange = true;
                            zoomToUtils.zoomTo(tempMapBaseView, target, zoomToFeatureValue.zoomToOption).then(() => {
                                relatedWidgets.push(this.props.baseWidgetProps.id);
                                const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, tempMapBaseView.extent);
                                extentMessage.setRelatedWidgetIds(relatedWidgets);
                                this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                            }, () => {
                                tempMapBaseView.isReceiveExtentChange = false;
                            });
                        });
                    }
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'zoomToFeatureActionValue', null);
                }
            }
            if (mutableStateProps.panToActionValue) {
                if (mutableStateProps.panToActionValue.relatedWidgets &&
                    mutableStateProps.panToActionValue.relatedWidgets.includes(this.props.baseWidgetProps.id)) {
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'panToActionValue', null);
                }
                else if (((_b = (_a = mutableStateProps.panToActionValue) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.type) === 'pan-to-query-params') {
                    const panToValue = mutableStateProps.panToActionValue.value;
                    const relatedWidgets = mutableStateProps.panToActionValue.relatedWidgets
                        ? mutableStateProps.panToActionValue.relatedWidgets
                        : [];
                    this.queryExtentFromQueryParams(mapBaseView, panToValue.dataSourceId, panToValue.useDataSources).then((result) => {
                        var _a, _b, _c;
                        // Because of 'panToGeometry' method does not support 'viewpoint', temporary code for using default viewpoint of sceneView.
                        if (result.useDefaultExtentOfCurrentView) {
                            const targetGeometry = ((_b = (_a = result === null || result === void 0 ? void 0 : result.viewpoint) === null || _a === void 0 ? void 0 : _a.camera) === null || _b === void 0 ? void 0 : _b.position) || ((_c = result === null || result === void 0 ? void 0 : result.viewpoint) === null || _c === void 0 ? void 0 : _c.targetGeometry);
                            this.panToGeometry([targetGeometry], mapBaseView, relatedWidgets);
                        }
                        else {
                            this.panToGeometry([result === null || result === void 0 ? void 0 : result.extent], mapBaseView, relatedWidgets);
                        }
                    });
                }
                else {
                    const panToValue = mutableStateProps.panToActionValue.value;
                    const relatedWidgets = mutableStateProps.panToActionValue.relatedWidgets
                        ? mutableStateProps.panToActionValue.relatedWidgets
                        : [];
                    this.panToGeometry(panToValue.features, mapBaseView, relatedWidgets);
                }
                mapBaseView.isReceiveExtentChange = true;
                this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'panToActionValue', null);
            }
            if (mutableStateProps.newFeatureSetActionValue && !mutableStateProps.newFeatureSetActionValue.promise) {
                const createNewFeaturelayerPromise = createNewFeaturelayer(mapBaseView, mutableStateProps.newFeatureSetActionValue.value);
                if (createNewFeaturelayerPromise) {
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'newFeatureSetActionValue.promise', createNewFeaturelayerPromise);
                    createNewFeaturelayerPromise.then(() => {
                        this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'newFeatureSetActionValue', null);
                    });
                }
                else {
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'newFeatureSetActionValue', null);
                }
            }
            if (mutableStateProps.changedFeatureSetActionValue) {
                updateFeaturelayer(mapBaseView, mutableStateProps.changedFeatureSetActionValue);
                this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'changedFeatureSetActionValue', null);
            }
            if (mutableStateProps.selectFeatureActionValue) {
                mapBaseView.popup.close();
                for (const key in this.highLightHandles) {
                    this.highLightHandles[key].remove();
                }
                const selectFeatureHandle = selectFeature(mapBaseView, mutableStateProps.selectFeatureActionValue);
                if (selectFeatureHandle) {
                    this.highLightHandles[selectFeatureHandle.layerId] = selectFeatureHandle.handle;
                }
                setTimeout(() => {
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'selectFeatureActionValue', null);
                }, 500);
            }
            const mutableStatePropsKeys = Object.keys(mutableStateProps);
            mutableStatePropsKeys.some(actionKey => {
                var _a;
                const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(tempJimuMapViewId);
                // handle flash action
                if (actionKey.indexOf('flashActionValue-') === 0 && mutableStateProps[actionKey]) {
                    mutableStateProps[actionKey].querySQL && flashFeaturesByQuery(tempJimuMapView, mutableStateProps[actionKey].layerDataSourceId, mutableStateProps[actionKey].querySQL);
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, actionKey, null);
                }
                // handle filter action
                if (actionKey.indexOf('filterActionValue-') === 0 && mutableStateProps[actionKey]) {
                    ((_a = mutableStateProps[actionKey].querySQL) === null || _a === void 0 ? void 0 : _a.length) >= 0 && filterFeaturesByQuery(tempJimuMapView, mutableStateProps[actionKey].layerDataSourceId, mutableStateProps[actionKey].querySQL);
                    this.props.onMutableStatePropsChanged(this.props.dataSourceId, actionKey, null);
                }
                return false;
            });
        };
        this.panToGeometry = (geometrys, mapBaseView, relatedWidgets) => {
            //const tempMapBaseView = mapBaseView as any
            projectGeometries(geometrys, mapBaseView.spatialReference).then((geometries) => {
                mapPanto(mapBaseView, geometries).then(() => {
                    mapBaseView.isReceiveExtentChange = true;
                    relatedWidgets.push(this.props.baseWidgetProps.id);
                    const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, mapBaseView.extent);
                    extentMessage.setRelatedWidgetIds(relatedWidgets);
                    this.props.onExtentChanged(this.props.dataSourceId, extentMessage);
                }, () => {
                    mapBaseView.isReceiveExtentChange = true;
                });
            });
        };
        this.formatMessage = (id) => {
            return this.props.baseWidgetProps.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] });
        };
        this.handleDisableWheel = () => {
            this.widgetContainer.style.pointerEvents = 'none';
            setTimeout(() => {
                this.widgetContainer.style.pointerEvents = 'auto';
            }, 50);
        };
        this.getMapSwitchForErrorMap = () => {
            return (React.createElement(MultiSourceMapContext.Consumer, null, ({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap }) => (React.createElement("div", { className: 'mapswitch-container', style: {
                    display: isShowMapSwitchBtn ? 'block' : 'none',
                    marginBottom: this.props.widthBreakpoint === 'xsmall' ? 10 : 0
                } },
                React.createElement("div", { onClick: (e) => { e.preventDefault(); switchMap(); }, className: 'w-100 h-100 esri-widget--button' },
                    React.createElement(Icon, { icon: Exchange, width: 16, height: 16, className: 'mapswitch-icon' }))))));
        };
        this.recoverMap = () => {
            if (this.mapView) {
                this.mapView.tryFatalErrorRecovery();
                this.setState({
                    isMapCrashed: false
                });
            }
            if (this.sceneView) {
                this.sceneView.tryFatalErrorRecovery();
                this.setState({
                    isMapCrashed: false
                });
            }
        };
        const restoreData = MutableStoreManager.getInstance().getStateValue([this.props.baseWidgetProps.id, 'restoreData',
            `${this.props.baseWidgetProps.id}-restoreData-${this.props.dataSourceId}`]);
        if (restoreData) {
            restoreMapBase(this, restoreData);
            MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, `restoreData.${this.props.baseWidgetProps.id}-restoreData-${this.props.dataSourceId}`, null);
            this.bindMapBaseViewEvent(this.mapView || this.sceneView);
            if (this.mapView) {
                this.mapView.isInCaching = false;
                this.mapView.tryFatalErrorRecovery();
            }
            if (this.sceneView) {
                this.sceneView.isInCaching = false;
                this.sceneView.tryFatalErrorRecovery();
            }
        }
        else {
            this.state = {
                mapLoadStatus: MapLoadStatus.Loading,
                widthBreakpoint: null,
                mapBaseJimuMapView: null,
                dataSourceId: null,
                widgetHeight: null,
                isMapCrashed: false
            };
        }
    }
    componentDidMount() {
        this.__unmount = false;
        if (this.widgetContainer.getElementsByClassName('widget-map').length === 0) {
            if (!this.mapContainer) {
                this.mapContainer = document && document.createElement('div');
                this.mapContainer.className = 'w-100 h-100 widget-map mapview-container';
            }
            this.widgetContainer.appendChild(this.mapContainer);
        }
        if (this.props.startLoadModules && !this.state.isModulesLoaded) {
            this.startRenderMap();
            return;
        }
        if (!this.props.dataSourceId && !this.props.isDefaultMap) {
            return;
        }
        if (!this.getDsJsonFromDsId(this.props.dataSourceId) && !this.props.isDefaultMap) {
            return;
        }
        if (this.props.isDefaultMap) {
            // init and update map
            this.analysisMapView().then(() => {
                this.updateMapView(this.props.baseWidgetProps.config);
            });
            return;
        }
        if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebMap) {
            // init and update map
            this.analysisMapView().then(() => {
                this.updateMapView(this.props.baseWidgetProps.config);
            });
        }
        if (this.getDsJsonFromDsId(this.props.dataSourceId).type === DataSourceTypes.WebScene) {
            // init and update map
            this.analysisSceneView().then(() => {
                this.updateSceneView(this.props.baseWidgetProps.config);
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (!this.state.isModulesLoaded) {
            return;
        }
        if (prevProps.isMapInVisibleArea !== this.props.isMapInVisibleArea && (this.props.baseWidgetProps.useDataSources && this.props.baseWidgetProps.useDataSources.length === 2)) {
            if (this.props.isMapInVisibleArea) {
                if (this.mapView) {
                    this.mapView.isInCaching = false;
                    this.mapView.tryFatalErrorRecovery();
                }
                if (this.sceneView) {
                    this.sceneView.isInCaching = false;
                    this.sceneView.tryFatalErrorRecovery();
                }
            }
            if (!this.props.isMapInVisibleArea) {
                if (this.mapView) {
                    this.mapView.isInCaching = true;
                }
                if (this.sceneView) {
                    this.sceneView.isInCaching = true;
                }
            }
        }
        const curDsId = this.props.dataSourceId;
        const prevDsId = prevProps.dataSourceId;
        const curDsItemId = this.getDsJsonFromDsId(curDsId).itemId;
        const preDsItemId = this.getDsJsonFromDsId(prevDsId).itemId;
        if (curDsId !== prevDsId || curDsItemId !== preDsItemId) {
            this.mapView = null;
            this.sceneView = null;
            this.isRequestingMap = false;
            this.mapDs = null;
            const prevJimuMapViewId = this.getDsJsonFromDsId(prevDsId) && `${this.props.baseWidgetProps.id}-${prevDsId}`;
            if (prevJimuMapViewId) {
                MapViewManager.getInstance().destroyJimuMapView(prevJimuMapViewId);
            }
            if (this.state.mapLoadStatus === MapLoadStatus.LoadError && !this.getDsJsonFromDsId(curDsId)) {
                return;
            }
            this.setState({
                mapLoadStatus: MapLoadStatus.Loading
            });
        }
        if (this.props.isDefaultMap) {
            this.sceneView = null;
            this.isRequestingMap = false;
            this.analysisMapView().then(() => {
                this.updateMapView(this.props.baseWidgetProps.config);
                if (!this.mapView || !this.props.baseWidgetProps.mutableStateProps) {
                    return;
                }
                if (this.props.baseWidgetProps.mutableStateProps) {
                    const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                    const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(tempJimuMapViewId);
                    if (tempJimuMapView) {
                        tempJimuMapView.whenJimuMapViewLoaded().then(() => {
                            setTimeout(() => {
                                this.handleAction(this.props.baseWidgetProps.mutableStateProps, this.mapView);
                                this.handleDataAction(this.props.baseWidgetProps.mutableStateProps, tempJimuMapView);
                                this.isFirstReceiveMessage = false;
                            }, this.isFirstReceiveMessage ? 500 : 0);
                        });
                    }
                }
            });
        }
        if (!this.getDsJsonFromDsId(curDsId)) {
            return;
        }
        if (this.getDsJsonFromDsId(curDsId).type === DataSourceTypes.WebMap) {
            this.sceneView = null;
            this.isRequestingMap = false;
            this.analysisMapView().then(() => {
                var _a;
                this.updateMapView(this.props.baseWidgetProps.config, (_a = prevProps.baseWidgetProps) === null || _a === void 0 ? void 0 : _a.config);
                if (!this.mapView || !this.props.baseWidgetProps.mutableStateProps) {
                    return;
                }
                if (this.props.baseWidgetProps.mutableStateProps) {
                    const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                    const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(tempJimuMapViewId);
                    if (tempJimuMapView) {
                        tempJimuMapView.whenJimuMapViewLoaded().then(() => {
                            setTimeout(() => {
                                this.handleAction(this.props.baseWidgetProps.mutableStateProps, this.mapView);
                                this.handleDataAction(this.props.baseWidgetProps.mutableStateProps, tempJimuMapView);
                                this.isFirstReceiveMessage = false;
                            }, this.isFirstReceiveMessage ? 500 : 0);
                        });
                    }
                }
            });
        }
        if (this.getDsJsonFromDsId(curDsId).type === DataSourceTypes.WebScene) {
            this.mapView = null;
            this.isRequestingMap = false;
            this.analysisSceneView().then(() => {
                var _a;
                this.updateSceneView(this.props.baseWidgetProps.config, (_a = prevProps.baseWidgetProps) === null || _a === void 0 ? void 0 : _a.config);
                if (!this.sceneView || !this.props.baseWidgetProps.mutableStateProps) {
                    return;
                }
                if (this.props.baseWidgetProps.mutableStateProps) {
                    const tempJimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
                    const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(tempJimuMapViewId);
                    if (tempJimuMapView) {
                        tempJimuMapView.whenJimuMapViewLoaded().then(() => {
                            setTimeout(() => {
                                this.handleAction(this.props.baseWidgetProps.mutableStateProps, this.sceneView);
                                this.handleDataAction(this.props.baseWidgetProps.mutableStateProps, tempJimuMapView);
                                this.isFirstReceiveMessage = false;
                            }, this.isFirstReceiveMessage ? 500 : 0);
                        });
                    }
                }
            });
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.dataSourceId !== prevState.dataSourceId) {
            return {
                dataSourceId: nextProps.dataSourceId,
                mapLoadStatus: MapLoadStatus.Loading
            };
        }
        else {
            return null;
        }
    }
    componentWillUnmount() {
        this.__unmount = true;
        const widgets = getAppStore().getState().appConfig.widgets;
        if (widgets[this.props.baseWidgetProps.id] && widgets[this.props.baseWidgetProps.id].useDataSources === this.props.baseWidgetProps.useDataSources &&
            this.state.mapLoadStatus !== MapLoadStatus.Loading) {
            const restoreData = getMapBaseRestoreData(this);
            if (this.mapView) {
                this.mapView.isInCaching = true;
            }
            if (this.sceneView) {
                this.sceneView.isInCaching = true;
            }
            MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, `restoreData.${this.props.baseWidgetProps.id}-restoreData-${this.props.dataSourceId}`, restoreData);
        }
        else {
            this.props.onViewChanged && this.props.onViewChanged({ dataSourceId: this.props.dataSourceId, viewpoint: null });
            const jimuMapViewId = `${this.props.baseWidgetProps.id}-${this.props.dataSourceId}`;
            MapViewManager.getInstance().destroyJimuMapView(jimuMapViewId);
            if (this.mapView && !this.mapView.destroyed) {
                this.mapView.container = null;
                this.mapView = null;
            }
            if (this.sceneView && !this.sceneView.destroyed) {
                this.sceneView.container = null;
                this.sceneView = null;
            }
            this.highLightHandles = {};
            this.extentWatch = null;
            this.fatalErrorWatch = null;
            this.mapDs = null;
            this.isRequestingMap = false;
        }
    }
    render() {
        let useDataSource = null;
        if (this.props.baseWidgetProps.useDataSources) {
            for (let i = 0; i < this.props.baseWidgetProps.useDataSources.length; i++) {
                if (this.props.baseWidgetProps.useDataSources[i].dataSourceId === this.props.dataSourceId) {
                    useDataSource = this.props.baseWidgetProps.useDataSources[i];
                }
            }
        }
        return (React.createElement("div", { className: 'w-100 h-100 map-base', style: { position: 'relative' }, ref: ref => { this.widgetContainer = ref; } },
            (this.state.mapLoadStatus === MapLoadStatus.Loading) &&
                React.createElement("div", { className: 'w-100 h-100 widget-map-background' },
                    React.createElement("div", { style: { position: 'absolute', left: '50%', top: '50%' }, className: 'jimu-secondary-loading' })),
            (this.state.mapLoadStatus === MapLoadStatus.LoadError) &&
                React.createElement("div", { className: 'w-100 h-100 widget-map-background' },
                    this.getMapSwitchForErrorMap(),
                    React.createElement("div", { className: 'w-100 h-100 d-flex justify-content-center align-items-center' }, this.formatMessage('mapFailure'))),
            !this.props.isDefaultMap && React.createElement("div", { style: { position: 'absolute', display: 'none' } },
                React.createElement(DataSourceComponent, { useDataSource: useDataSource, onDataSourceCreated: this.onDataSourceCreated, onCreateDataSourceFailed: this.onCreateDataSourceFailed }))));
    }
}
//# sourceMappingURL=mapbase.js.map