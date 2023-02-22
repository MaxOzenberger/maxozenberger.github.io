var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, classNames, MessageManager, Immutable, observeStore, ReactResizeDetector, getAppStore, appActions, MutableStoreManager } from 'jimu-core';
import MapBase, { MapLoadStatus } from './mapbase';
import { MultiSourceMapContext } from './multisourcemap-context';
import { MapViewManager, JimuMapViewComponent, ShowOnMapDataType } from 'jimu-arcgis';
import MapFixedLayout from '../layout/map-fixed-layout';
import Layout from '../layout/layout';
import pcLayoutJsons from '../layout/pc-layout-json';
import mobileLayoutJsons from '../layout/mobile-layout-json';
const VisibleStyles = {
    firstMapVisible: [{
            zIndex: 6,
            opacity: 1
        }, {
            zIndex: 5,
            opacity: 0
        }],
    secondMapVisible: [{
            zIndex: 5,
            opacity: 0
        }, {
            zIndex: 6,
            opacity: 1
        }]
};
export default class MultiSourceMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mutableStatePropsMap = {};
        this.__unmount = false;
        this.onPageChange = (prePageId, currentPageId) => {
            // close active tool
            if (prePageId && currentPageId && prePageId !== currentPageId) {
                this.setState({
                    activeToolInfo: null
                });
            }
        };
        this.onResize = (width, height) => {
            // close active tool
            this.setState({
                activeToolInfo: null
            });
        };
        this.reInitWidgetInstance = (restoreData) => {
            this.state = restoreData;
            this.isReIniting = true;
        };
        this.changeInitialMapDataSourceID = (dataSourceId, callBack) => {
            if (this.props.baseWidgetProps.useDataSources && this.props.baseWidgetProps.useDataSources.length > 1) {
                const firstMapInstance = this.refs.firstMapInstance;
                const secondMapInstance = this.refs.secondMapInstance;
                if (!this.state.currentMapIndex) {
                    if (this.state.secondMapDsId && this.state.secondMapDsId === dataSourceId) {
                        this.startChangeInitialMapAnimation(callBack);
                        secondMapInstance.goHome(false);
                    }
                    else {
                        firstMapInstance.goHome(false);
                    }
                }
                else {
                    if (this.state.firstMapDsId && this.state.firstMapDsId === dataSourceId) {
                        this.startChangeInitialMapAnimation(callBack);
                        firstMapInstance.goHome(false);
                    }
                    else {
                        secondMapInstance.goHome(false);
                    }
                }
            }
        };
        this.startChangeInitialMapAnimation = (callBack) => {
            const tempState = Object.assign({}, this.state);
            const firstMapInstance = this.refs.firstMapInstance;
            const secondMapInstance = this.refs.secondMapInstance;
            if (!this.state.currentMapIndex) {
                tempState.currentMapIndex = 1;
                tempState.multiMapStyle = VisibleStyles.secondMapVisible;
                const viewPoint = firstMapInstance && firstMapInstance.getViewPoint && firstMapInstance.getViewPoint();
                if (viewPoint) {
                    secondMapInstance && secondMapInstance.setViewPoint && secondMapInstance.setViewPoint(viewPoint);
                }
                this.setState(tempState, () => { callBack(); });
            }
            else {
                tempState.currentMapIndex = 0;
                tempState.multiMapStyle = VisibleStyles.firstMapVisible;
                const viewPoint = secondMapInstance && secondMapInstance.getViewPoint && secondMapInstance.getViewPoint();
                if (viewPoint) {
                    firstMapInstance && firstMapInstance.setViewPoint && firstMapInstance.setViewPoint(viewPoint);
                }
                this.setState(tempState, () => { callBack(); });
            }
        };
        this.switchMap = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.props.baseWidgetProps.useDataSources || this.props.baseWidgetProps.useDataSources.length < 2) {
                return yield Promise.resolve();
            }
            const tempState = Object.assign({}, this.state);
            tempState.useAnimation = true;
            const firstMapInstance = this.refs.firstMapInstance;
            const secondMapInstance = this.refs.secondMapInstance;
            if (!this.state.currentMapIndex) {
                tempState.currentMapIndex = 1;
                tempState.multiMapStyle = VisibleStyles.secondMapVisible;
                const viewPoint = firstMapInstance && firstMapInstance.getViewPoint && firstMapInstance.getViewPoint();
                if (viewPoint) {
                    secondMapInstance && secondMapInstance.setViewPoint && secondMapInstance.setViewPoint(viewPoint);
                }
            }
            else {
                tempState.currentMapIndex = 0;
                tempState.multiMapStyle = VisibleStyles.firstMapVisible;
                const viewPoint = secondMapInstance && secondMapInstance.getViewPoint && secondMapInstance.getViewPoint();
                if (viewPoint) {
                    firstMapInstance && firstMapInstance.setViewPoint && firstMapInstance.setViewPoint(viewPoint);
                }
            }
            if (firstMapInstance && secondMapInstance) {
                const firstViewType = firstMapInstance.getViewType();
                const secondViewType = secondMapInstance.getViewType();
                if (firstViewType && secondViewType && (firstViewType !== secondViewType)) {
                    firstMapInstance.goToTilt(0);
                    secondMapInstance.goToTilt(0);
                    if (this.state.currentMapIndex) {
                        setTimeout(() => {
                            firstMapInstance.goToTilt(45);
                        }, 300);
                    }
                    else {
                        setTimeout(() => {
                            secondMapInstance.goToTilt(45);
                        }, 300);
                    }
                }
            }
            return new Promise((resolve, reject) => {
                this.setState(tempState, () => {
                    this.confirmJimuMapViewIsActive();
                    setTimeout(() => {
                        this.setState({
                            useAnimation: false
                        }, () => {
                            return resolve(null);
                        });
                    }, 500);
                });
            });
        });
        this.handleMutableStatePropsChanged = (dataSourceId, propKey, value) => {
            if (!this.mutableStatePropsMap[propKey]) {
                this.mutableStatePropsMap[propKey] = [dataSourceId];
            }
            else {
                if (!this.mutableStatePropsMap[propKey].includes(dataSourceId)) {
                    this.mutableStatePropsMap[propKey].push(dataSourceId);
                }
            }
            const multiMapDsIds = [];
            const firstMapInstance = this.refs.firstMapInstance;
            const secondMapInstance = this.refs.secondMapInstance;
            if (firstMapInstance && firstMapInstance.getViewType()) {
                multiMapDsIds.push(this.state.firstMapDsId);
            }
            if (secondMapInstance && secondMapInstance.getViewType()) {
                multiMapDsIds.push(this.state.secondMapDsId);
            }
            let isAllMatched = true;
            for (let i = 0; i < multiMapDsIds.length; i++) {
                if (!this.mutableStatePropsMap[propKey].includes(multiMapDsIds[i])) {
                    isAllMatched = false;
                    break;
                }
            }
            if (isAllMatched) {
                delete this.mutableStatePropsMap[propKey];
                MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, propKey, value);
            }
        };
        this.handleViewChanged = (shareViewPoint) => {
            if (shareViewPoint.viewpoint === null) {
                const firstMapInstance = this.refs.firstMapInstance;
                const secondMapInstance = this.refs.secondMapInstance;
                firstMapInstance && firstMapInstance.goHome(false);
                secondMapInstance && secondMapInstance.goHome(false);
                return;
            }
            const triggerMv = this.getJimuMapViewByDataSourceId(shareViewPoint.dataSourceId);
            if (triggerMv === null || triggerMv === void 0 ? void 0 : triggerMv.isActive) {
                if (this.state.firstMapDsId && this.state.firstMapDsId !== shareViewPoint.dataSourceId) {
                    const firstMapInstance = this.refs.firstMapInstance;
                    firstMapInstance && firstMapInstance.setViewPoint(shareViewPoint.viewpoint);
                }
                if (this.state.secondMapDsId && this.state.secondMapDsId !== shareViewPoint.dataSourceId) {
                    const secondMapInstance = this.refs.secondMapInstance;
                    secondMapInstance && secondMapInstance.setViewPoint(shareViewPoint.viewpoint);
                }
            }
        };
        this.handleExtentChanged = (dataSourceId, extentMessage) => {
            const currentVisibleDsId = this.getCurrentVisibleDsId();
            if (currentVisibleDsId === dataSourceId) {
                MessageManager.getInstance().publishMessage(extentMessage);
            }
        };
        this.handleMapLoaded = (dataSourceId, mapLoadStatus) => {
            this.forceUpdate();
        };
        this.handleJimuMapViewCreated = () => {
            if (this.__unmount) {
                return;
            }
            this.confirmJimuMapViewIsActive();
        };
        this.confirmJimuMapViewIsActive = () => {
            if (this.props.isDefaultMap) {
                const jimuMapView = this.getJimuMapViewByDataSourceId(null);
                if (jimuMapView) {
                    this.setActiveJimuMapView(jimuMapView, true);
                }
                return;
            }
            const allDatasourceIds = [];
            this.state.firstMapDsId && allDatasourceIds.push(this.state.firstMapDsId);
            this.state.secondMapDsId && allDatasourceIds.push(this.state.secondMapDsId);
            const currentDataSourceId = this.getCurrentVisibleDsId();
            for (let i = 0; i < allDatasourceIds.length; i++) {
                const jimuMapView = this.getJimuMapViewByDataSourceId(allDatasourceIds[i]);
                if (jimuMapView) {
                    if (allDatasourceIds[i] === currentDataSourceId) {
                        this.setActiveJimuMapView(jimuMapView, true);
                    }
                    else {
                        this.setActiveJimuMapView(jimuMapView, false);
                    }
                }
            }
        };
        this.isShowMapSwitchBtn = () => {
            const firstMapInstance = this.refs.firstMapInstance;
            const secondMapInstance = this.refs.secondMapInstance;
            if (firstMapInstance && secondMapInstance) {
                if (firstMapInstance.getMapLoadStatus() !== MapLoadStatus.Loading && secondMapInstance.getMapLoadStatus() !== MapLoadStatus.Loading) {
                    return true;
                }
            }
            else {
                return false;
            }
        };
        this.getCurrentVisibleDsId = () => {
            if (this.state.multiMapStyle[0].opacity === 1) {
                return this.state.firstMapDsId;
            }
            else {
                return this.state.secondMapDsId;
            }
        };
        this.handleViewGroupCreate = (viewGroup) => {
            if (this.props.onViewGroupCreate) {
                this.props.onViewGroupCreate(viewGroup);
            }
        };
        this.handleMobilePanelContentChange = (mobilePanelContent) => {
            this.setState({
                mobilePanelContent: mobilePanelContent
            });
        };
        this.handleActiveToolInfoChange = (activeToolInfo) => {
            this.setState({
                activeToolInfo: activeToolInfo
            });
        };
        // handleShowOnMapDataChange = (showOnMapDatasKey: string[]) => {
        //  this.setState({
        //    showOnMapDatasKey: showOnMapDatasKey
        //  })
        // }
        this.getLayoutConfig = () => {
            if (this.props.widthBreakpoint === 'xsmall') {
                return mobileLayoutJsons[0];
            }
            else {
                return this.props.baseWidgetProps.config.layoutIndex ? pcLayoutJsons[this.props.baseWidgetProps.config.layoutIndex] : pcLayoutJsons[0];
            }
        };
        this.isShowClearShowOnMapDataBtn = () => {
            var _a;
            const showOnMapDatas = (_a = this.props.baseWidgetProps.mutableStateProps) === null || _a === void 0 ? void 0 : _a.showOnMapDatas;
            return Object.entries(showOnMapDatas || {}).some(entry => {
                // There is no jimuMapViewId while generating the action data if the map widget hasn't been loaded in the another page/view,
                // use a default jimuMapViewId to show data.
                let jimuMapViewId = entry[1].jimuMapViewId;
                if (!jimuMapViewId && entry[1].mapWidgetId === this.props.baseWidgetProps.id) {
                    const jimuMapViewsInfo = getAppStore().getState().jimuMapViewsInfo;
                    jimuMapViewId = Object.keys(jimuMapViewsInfo || {}).find(viewId => jimuMapViewsInfo[viewId].mapWidgetId === this.props.baseWidgetProps.id);
                }
                return (jimuMapViewId === this.state.currentJimuMapViewId && entry[1].type === ShowOnMapDataType.DataAction);
            });
        };
        const restoreData = MutableStoreManager.getInstance().getStateValue([this.props.baseWidgetProps.id, 'restoreData',
            `${this.props.baseWidgetProps.id}-restoreData-multimap`]);
        if (restoreData) {
            const mobilePanelContainer = document.createElement('div');
            mobilePanelContainer.id = `${this.props.baseWidgetProps.id}-bottom-panel`;
            mobilePanelContainer.className = 'w-100 h-100';
            restoreData.mobilePanelContainer = mobilePanelContainer;
            this.reInitWidgetInstance(restoreData);
            MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, `restoreData.${this.props.baseWidgetProps.id}-restoreData-multimap`, null);
        }
        else {
            const mobilePanelContainer = document.createElement('div');
            mobilePanelContainer.id = `${this.props.baseWidgetProps.id}-bottom-panel`;
            mobilePanelContainer.className = 'w-100 h-100';
            this.state = {
                currentMapIndex: 0,
                multiMapStyle: VisibleStyles.firstMapVisible,
                firstMapDsId: null,
                secondMapDsId: null,
                useAnimation: false,
                useDataSources: null,
                currentJimuMapViewId: null,
                mobilePanelContent: null,
                mobilePanelContainer: mobilePanelContainer,
                activeToolInfo: null
                // showOnMapDatasKey: null
            };
        }
        this.mutableStatePropsMap = {};
        this.useMapWidgetIds = this.props.baseWidgetProps.id ? Immutable([this.props.baseWidgetProps.id]) : Immutable([]);
        observeStore(this.onPageChange, ['appRuntimeInfo', 'currentPageId']);
    }
    componentDidMount() {
        if (getAppStore().getState().mapWidgetsInfo) {
            if (!getAppStore().getState().mapWidgetsInfo[this.props.baseWidgetProps.id]) {
                getAppStore().dispatch(appActions.MapWidgetInfoAdded(this.props.baseWidgetProps.id, Immutable({ mapWidgetId: this.props.baseWidgetProps.id })));
            }
        }
        this.__unmount = false;
        if (this.isReIniting) {
            return;
        }
        if (this.props.baseWidgetProps.useDataSources) {
            const initialMapDataSourceID = this.props.baseWidgetProps.config.initialMapDataSourceID;
            if (!initialMapDataSourceID) {
                this.setState({
                    firstMapDsId: this.props.baseWidgetProps.useDataSources[0] && this.props.baseWidgetProps.useDataSources[0].dataSourceId,
                    secondMapDsId: this.props.baseWidgetProps.useDataSources[1] && this.props.baseWidgetProps.useDataSources[1].dataSourceId
                });
            }
            else {
                if (initialMapDataSourceID === (this.props.baseWidgetProps.useDataSources[0] && this.props.baseWidgetProps.useDataSources[0].dataSourceId)) {
                    this.setState({
                        firstMapDsId: this.props.baseWidgetProps.useDataSources[0] && this.props.baseWidgetProps.useDataSources[0].dataSourceId,
                        secondMapDsId: this.props.baseWidgetProps.useDataSources[1] && this.props.baseWidgetProps.useDataSources[1].dataSourceId
                    });
                }
                else if (initialMapDataSourceID === (this.props.baseWidgetProps.useDataSources[1] && this.props.baseWidgetProps.useDataSources[1].dataSourceId)) {
                    this.setState({
                        firstMapDsId: this.props.baseWidgetProps.useDataSources[1] && this.props.baseWidgetProps.useDataSources[1].dataSourceId,
                        secondMapDsId: this.props.baseWidgetProps.useDataSources[0] && this.props.baseWidgetProps.useDataSources[0].dataSourceId
                    });
                }
                else {
                    this.setState({
                        firstMapDsId: this.props.baseWidgetProps.useDataSources[0] && this.props.baseWidgetProps.useDataSources[0].dataSourceId,
                        secondMapDsId: this.props.baseWidgetProps.useDataSources[1] && this.props.baseWidgetProps.useDataSources[1].dataSourceId
                    });
                }
            }
        }
    }
    componentWillUnmount() {
        this.__unmount = true;
        const widgets = getAppStore().getState().appConfig.widgets;
        if (widgets[this.props.baseWidgetProps.id] && widgets[this.props.baseWidgetProps.id].useDataSources === this.props.baseWidgetProps.useDataSources) {
            const restoreData = {
                currentMapIndex: this.state.currentMapIndex,
                multiMapStyle: this.state.multiMapStyle,
                firstMapDsId: this.state.firstMapDsId,
                secondMapDsId: this.state.secondMapDsId,
                useAnimation: this.state.useAnimation,
                currentJimuMapViewId: this.state.currentJimuMapViewId
            };
            MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, `restoreData.${this.props.baseWidgetProps.id}-restoreData-multimap`, restoreData);
        }
        if (!widgets[this.props.baseWidgetProps.id]) {
            getAppStore().dispatch(appActions.MapWidgetInfoRemoved(this.props.baseWidgetProps.id));
        }
    }
    static getDerivedStateFromProps(newProps, prevState) {
        if (newProps.baseWidgetProps.useDataSources !== prevState.useDataSources) {
            const newState = MultiSourceMap.getChangedState(prevState.firstMapDsId, prevState.secondMapDsId, newProps.baseWidgetProps.useDataSources);
            return newState;
        }
        else {
            return null;
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.baseWidgetProps.stateProps && this.props.baseWidgetProps.stateProps.initialMapDataSourceID) {
            const initialMapDataSourceID = this.props.baseWidgetProps.stateProps.initialMapDataSourceID;
            if (this.state.firstMapDsId === initialMapDataSourceID) {
                const firstMapInstance = this.refs.firstMapInstance;
                if (firstMapInstance) {
                    firstMapInstance.goHome(false);
                }
            }
            if (this.state.secondMapDsId === initialMapDataSourceID) {
                const secondMapInstance = this.refs.secondMapInstance;
                if (secondMapInstance) {
                    secondMapInstance.goHome(false);
                }
            }
            this.props.baseWidgetProps.dispatch(appActions.widgetStatePropChange(this.props.baseWidgetProps.id, 'initialMapDataSourceID', null));
        }
        if (this.isReIniting) {
            this.isReIniting = false;
            return;
        }
        if (this.props.baseWidgetProps.config.initialMapDataSourceID !== prevProps.baseWidgetProps.config.initialMapDataSourceID) {
            this.changeInitialMapDataSourceID(this.props.baseWidgetProps.config.initialMapDataSourceID, this.confirmJimuMapViewIsActive);
        }
        if (this.props.baseWidgetProps.useDataSources !== prevProps.baseWidgetProps.useDataSources) {
            this.confirmJimuMapViewIsActive();
        }
    }
    getJimuMapViewByDataSourceId(dsId) {
        const jimuMapViewId = `${this.props.baseWidgetProps.id}-${dsId}`;
        const jimuMapView = MapViewManager.getInstance().getJimuMapViewById(jimuMapViewId);
        return jimuMapView;
    }
    setActiveJimuMapView(jimuMapView, isActive) {
        if (isActive) {
            jimuMapView.setIsActive(isActive);
            this.setState({
                currentJimuMapViewId: jimuMapView.id
            });
        }
        else {
            jimuMapView.setIsActive(isActive);
        }
    }
    render() {
        var _a;
        return (React.createElement(MultiSourceMapContext.Provider, { value: {
                mapWidgetId: this.props.baseWidgetProps.id,
                mapWidgetHeight: this.props.widgetHeight,
                isShowMapSwitchBtn: this.props.baseWidgetProps.useDataSources && this.props.baseWidgetProps.useDataSources.length > 1 && this.isShowMapSwitchBtn(),
                isShowClearShowOnMapDataBtn: this.isShowClearShowOnMapDataBtn(),
                dataSourceIds: [this.state.firstMapDsId, this.state.secondMapDsId],
                activeDataSourceId: this.getCurrentVisibleDsId(),
                switchMap: this.switchMap,
                fullScreenMap: this.props.fullScreenMap,
                isFullScreen: this.props.isFullScreen,
                mobilePanelContainer: this.state.mobilePanelContainer,
                onMobilePanelContentChange: this.handleMobilePanelContentChange,
                initialMapState: this.props.baseWidgetProps.config && this.props.baseWidgetProps.config.initialMapState,
                theme: this.props.baseWidgetProps.theme
            } },
            !this.props.isDefaultMap && React.createElement("div", { className: 'w-100 h-100 multi-map-container', style: { position: 'relative' } },
                React.createElement("div", { className: classNames('w-100 h-100 map1', {
                        'multisourcemap-item-appear': this.state.useAnimation && this.state.multiMapStyle[0].opacity,
                        'multisourcemap-item-disappear': this.state.useAnimation && !(this.state.multiMapStyle[0].opacity),
                        'multisourcemap-item-appear-noanimate': this.state.multiMapStyle[0].opacity,
                        'multisourcemap-item-disappear-noanimate': !(this.state.multiMapStyle[0].opacity)
                    }), style: { position: 'absolute', zIndex: this.state.multiMapStyle[0].zIndex } }, this.state.firstMapDsId && React.createElement(MapBase, { ref: 'firstMapInstance', onViewChanged: this.handleViewChanged, baseWidgetProps: this.props.baseWidgetProps, onMapLoaded: this.handleMapLoaded, onMutableStatePropsChanged: this.handleMutableStatePropsChanged, onExtentChanged: (dataSourceId, message) => { this.handleExtentChanged(dataSourceId, message); }, onJimuMapViewCreated: this.handleJimuMapViewCreated, 
                    // onShowOnMapDataChanged={this.handleShowOnMapDataChange}
                    startLoadModules: this.props.startLoadModules, dataSourceId: this.state.firstMapDsId, widthBreakpoint: this.props.widthBreakpoint, isMapInVisibleArea: this.props.isMapInVisibleArea })),
                React.createElement("div", { className: classNames('w-100 h-100 map2', {
                        'multisourcemap-item-appear': this.state.useAnimation && this.state.multiMapStyle[1].opacity,
                        'multisourcemap-item-disappear': this.state.useAnimation && !(this.state.multiMapStyle[1].opacity),
                        'multisourcemap-item-appear-noanimate': this.state.multiMapStyle[1].opacity,
                        'multisourcemap-item-disappear-noanimate': !(this.state.multiMapStyle[1].opacity)
                    }), style: { position: 'absolute', zIndex: this.state.multiMapStyle[1].zIndex } }, this.state.secondMapDsId && React.createElement(MapBase, { ref: 'secondMapInstance', onViewChanged: this.handleViewChanged, baseWidgetProps: this.props.baseWidgetProps, onMapLoaded: this.handleMapLoaded, onMutableStatePropsChanged: this.handleMutableStatePropsChanged, onExtentChanged: (dataSourceId, message) => { this.handleExtentChanged(dataSourceId, message); }, onJimuMapViewCreated: this.handleJimuMapViewCreated, 
                    // onShowOnMapDataChanged={this.handleShowOnMapDataChange}
                    startLoadModules: this.props.startLoadModules, dataSourceId: this.state.secondMapDsId, widthBreakpoint: this.props.widthBreakpoint, isMapInVisibleArea: this.props.isMapInVisibleArea }))),
            this.props.isDefaultMap && React.createElement("div", { className: 'w-100 h-100 default-map-container', style: { position: 'relative' } },
                React.createElement("div", { className: classNames('w-100 h-100 multisourcemap-item-appear-noanimate default-map'), style: { position: 'absolute', zIndex: 6 } },
                    React.createElement(MapBase, { ref: 'firstMapInstance', isDefaultMap: this.props.isDefaultMap, onViewChanged: this.handleViewChanged, baseWidgetProps: this.props.baseWidgetProps, onMapLoaded: this.handleMapLoaded, onMutableStatePropsChanged: this.handleMutableStatePropsChanged, dataSourceId: null, onExtentChanged: (dataSourceId, message) => { this.handleExtentChanged(dataSourceId, message); }, onJimuMapViewCreated: this.handleJimuMapViewCreated, 
                        // onShowOnMapDataChanged={this.handleShowOnMapDataChange}
                        startLoadModules: this.props.startLoadModules, widthBreakpoint: this.props.widthBreakpoint, isMapInVisibleArea: this.props.isMapInVisibleArea, defaultMapInfo: this.props.defaultMapInfo }))),
            this.state.currentJimuMapViewId && React.createElement(MapFixedLayout, { jimuMapView: MapViewManager.getInstance().getJimuMapViewById(this.state.currentJimuMapViewId), appMode: this.props.baseWidgetProps.appMode, layouts: this.props.baseWidgetProps.layouts, LayoutEntry: this.props.baseWidgetProps.builderSupportModules && this.props.baseWidgetProps.builderSupportModules.LayoutEntry, widgetManifestName: this.props.baseWidgetProps.manifest.name }),
            this.state.currentJimuMapViewId && MapViewManager.getInstance().getJimuMapViewById(this.state.currentJimuMapViewId) &&
                React.createElement(Layout, { mapWidgetId: this.props.baseWidgetProps.id, isMobile: this.props.widthBreakpoint === 'xsmall', jimuMapView: MapViewManager.getInstance().getJimuMapViewById(this.state.currentJimuMapViewId), appMode: this.props.baseWidgetProps.appMode, layouts: this.props.baseWidgetProps.layouts, intl: this.props.baseWidgetProps.intl, LayoutEntry: this.props.baseWidgetProps.builderSupportModules && this.props.baseWidgetProps.builderSupportModules.LayoutEntry, layoutConfig: this.getLayoutConfig(), toolConfig: this.props.baseWidgetProps.config.toolConfig ? this.props.baseWidgetProps.config.toolConfig : {}, activeToolInfo: this.state.activeToolInfo, onActiveToolInfoChange: this.handleActiveToolInfoChange, theme: this.props.baseWidgetProps.theme, widgetManifestName: this.props.baseWidgetProps.manifest.name, widgetHeight: this.props.widthBreakpoint === 'xsmall' ? null : this.props.widgetHeight }),
            React.createElement(JimuMapViewComponent, { useMapWidgetId: (_a = this.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onViewGroupCreate: this.handleViewGroupCreate }),
            React.createElement(ReactResizeDetector, { handleHeight: true, handleWidth: true, onResize: this.onResize })));
    }
}
MultiSourceMap.getChangedState = (firstMapDsId, secondMapDsId, useDataSources) => {
    const changedState = {};
    if (useDataSources && useDataSources[0]) {
        const newDataSourceArr = [];
        const repeatDataSourceArr = [];
        for (let i = 0; i < useDataSources.length; i++) {
            if (firstMapDsId !== useDataSources[i].dataSourceId) {
                newDataSourceArr.push(useDataSources[i].dataSourceId);
            }
            else {
                repeatDataSourceArr.push(useDataSources[i].dataSourceId);
            }
        }
        if (repeatDataSourceArr.length > 0) {
            changedState.firstMapDsId = firstMapDsId;
            changedState.secondMapDsId = newDataSourceArr[0];
        }
        else if (repeatDataSourceArr.length === 0) {
            if (newDataSourceArr.includes(secondMapDsId)) {
                newDataSourceArr.splice(newDataSourceArr.indexOf(secondMapDsId), 1);
                changedState.firstMapDsId = newDataSourceArr[0];
                changedState.secondMapDsId = secondMapDsId;
            }
            else {
                changedState.firstMapDsId = newDataSourceArr[0];
                changedState.secondMapDsId = newDataSourceArr[1];
            }
        }
    }
    else {
        changedState.firstMapDsId = null;
        changedState.secondMapDsId = null;
    }
    if (changedState.firstMapDsId !== firstMapDsId) {
        if (changedState.firstMapDsId) {
            changedState.multiMapStyle = VisibleStyles.firstMapVisible;
            changedState.currentMapIndex = 0;
        }
        else if (changedState.secondMapDsId) {
            changedState.multiMapStyle = VisibleStyles.secondMapVisible;
            changedState.currentMapIndex = 1;
        }
        else {
            changedState.multiMapStyle = VisibleStyles.firstMapVisible;
            changedState.currentMapIndex = 0;
        }
    }
    else {
        if (!changedState.secondMapDsId) {
            changedState.multiMapStyle = VisibleStyles.firstMapVisible;
            changedState.currentMapIndex = 0;
        }
        else if (changedState.secondMapDsId !== secondMapDsId) {
            changedState.multiMapStyle = VisibleStyles.secondMapVisible;
            changedState.currentMapIndex = 1;
        }
    }
    return changedState;
};
//# sourceMappingURL=multisourcemap.js.map