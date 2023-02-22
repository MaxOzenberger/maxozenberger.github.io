// for runtime & setting executive fly control
// (create, fly, stop....)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FlyItemMode } from '../../config';
import { ControllerMode } from './controllers/base-fly-controller';
import Routes from './route/routes';
import Record, { StoredGraphicsType } from './route/record/record';
import { isDefined, removeJimuMapIdForFly, getRecordConfigByIds } from '../utils/utils';
import TerrainLoadingHelper from './helpers/terrain-loading-helper';
export default class FlyManager {
    constructor(options) {
        this.findFirstUsedItem = () => {
            for (let i = 0, len = this.itemsList.length; i < len; i++) {
                const item = this.itemsList[i];
                if (item.config.isInUse) {
                    return item;
                }
            }
            return { config: null, routes: null };
        };
        this.findFirstRouteItem = () => {
            for (const item of this.itemsList) {
                if (item.config.isInUse && FlyItemMode.Route === item.config.name) {
                    return item;
                }
            }
            return { config: null, routes: null };
        };
        this._findItemIdx = (uuid) => {
            return this.itemsList.findIndex((item) => (item.config.uuid === uuid));
        };
        // items data
        this.getActiveItem = () => {
            return this.activedItem;
        };
        this.getActiveItemConfig = () => {
            var _a;
            return (_a = this.activedItem) === null || _a === void 0 ? void 0 : _a.config;
        };
        this.getFlyStyle = () => {
            var _a;
            return (_a = this.activedItem) === null || _a === void 0 ? void 0 : _a.config.name;
        };
        // getRecordFlyModeConfigByflyModeIdx = (flyModeIdx: number): RouteItemConfig => {
        //   const flyModeConfig = this.props.config.itemsList.asMutable({ deep: true });
        //   const recordsConfig = flyModeConfig[flyModeIdx] as RouteItemConfig;
        //   return recordsConfig
        // }
        this.getRouteByIdx = (ids) => {
            const item = this.getActiveItem();
            return item.routes;
        };
        this.getRouteConfigByIdx = (ids) => {
            var _a;
            const itemConfig = this.getActiveItemConfig();
            const route = (_a = itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.routes) === null || _a === void 0 ? void 0 : _a.find(route => (route.idx === ids.routeUuid));
            return route;
        };
        this.getRecordConfigByIds = (ids) => {
            const itemConfig = this.getActiveItemConfig();
            const route = itemConfig.routes;
            const record = getRecordConfigByIds(route, ids);
            return record;
        };
        this.getRecordByIds = (ids) => {
            var _a;
            const record = (_a = this.activedItem.routes) === null || _a === void 0 ? void 0 : _a.record;
            if (ids.recordUuid === (record === null || record === void 0 ? void 0 : record.getConfig().idx)) {
                return record;
            }
            else {
                return null;
            }
        };
        // Route
        this.isUesRouteFlyMode = () => {
            const itemConfig = this.getActiveItemConfig();
            return ((itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.name) === FlyItemMode.Route);
        };
        this.clear = () => {
            // let flyController = this.getController();
            // if (flyController) {
            //   if(FlyItemMode.RecordConfig !== flyController?.flyStyle) {
            //     flyController.clear();
            //   }
            // }
        };
        /// //////////////////////////////////////////////////////
        // group
        this.checkAndSwitchJimuMapBeforePlay = (ids) => __awaiter(this, void 0, void 0, function* () {
            const record = this.getRecordConfigByIds(ids);
            if (!isDefined(record)) {
                return { isCanPlay: false, hadSwitchedMap: false };
            }
            const isInGroup = this.isJimuMapViewInGroup(record.mapViewId);
            const isCurrentJimuMap = this.isCurrentJimuMap(record);
            if (isCurrentJimuMap) {
                return { isCanPlay: true, hadSwitchedMap: false };
            }
            else if (isInGroup) {
                if (!isCurrentJimuMap) {
                    this.onBeforeSwitchMap();
                    yield this.viewGroup.switchMap();
                    return { isCanPlay: true, hadSwitchedMap: true };
                }
                else {
                    return { isCanPlay: true, hadSwitchedMap: false };
                }
            }
            else {
                console.error('FlyManager.checkAndSwitchJimuMapBeforePlay: this RecordConfig can\'t fly in this JimuMap');
                return { isCanPlay: false, hadSwitchedMap: false }; // other's condition can't fly
            }
        });
        this.isRecordCanPlay = (record) => {
            const isInGroup = this.isJimuMapViewInGroup(record.mapViewId);
            const isCurrentJimuMap = this.isCurrentJimuMap(record);
            if (isCurrentJimuMap) {
                return true;
            }
            else if (isInGroup) {
                if (!isCurrentJimuMap) {
                    return true;
                }
                else {
                    return true;
                }
            }
            else {
                console.error('FlyManager.isRecordCanPlay: this RecordConfig can\'t fly in this JimuMap');
                return false; // other's condition can't fly
            }
        };
        this.isJimuMapViewInGroup = (jimuMapViewsId) => {
            var _a;
            let jimuMapId = jimuMapViewsId !== null && jimuMapViewsId !== void 0 ? jimuMapViewsId : this.jimuMapView.id;
            jimuMapId = removeJimuMapIdForFly(jimuMapId);
            const jimuMapViewKeysInGroup = Object.keys((_a = this.viewGroup) === null || _a === void 0 ? void 0 : _a.jimuMapViews);
            const found = jimuMapViewKeysInGroup.find(mapViewId => removeJimuMapIdForFly(mapViewId) === jimuMapId);
            // const view = this.viewGroup?.jimuMapViews[jimuMapId]
            if (isDefined(found)) {
                return true;
            }
            else {
                return false;
            }
        };
        this.isCurrentJimuMap = (record) => {
            var _a;
            return (record.mapViewId === removeJimuMapIdForFly((_a = this.jimuMapView) === null || _a === void 0 ? void 0 : _a.id));
        };
        this.getCurrentSceneView = () => {
            return this.sceneView;
        };
        this.stop();
        // TerrainLoadingHelper
        this.onTerrainLoaded = options.onTerrainLoaded;
        // callbacks
        this.onBeforeSwitchMap = options.onBeforeSwitchMap;
        this.drawOrUpdateGraphics = options.drawOrUpdateGraphics;
        this.highlightGraphics = options.highlightGraphics;
        this.onItemsUpdate = options.onItemsUpdate;
        this.isBuilderSettingFlag = options.isBuilderSettingFlag; // in setting mode, highlight timing is different
        this.updateViewGroup(options.viewGroup);
        this.updateJimuMapView(options.jimuMapView);
        this.uiLoadingCallbacks = options.uiLoadingCallbacks;
        this.flyStateCallbacks = options.flyStateCallbacks;
        this.updateItems(options.widgetConfig);
    }
    updateViewGroup(viewGroup) {
        // this.stop();
        this.viewGroup = viewGroup;
    }
    // TODO need to re setupFly()
    // updateViewGroup is faster then updateJimuMapView, in jimuMap
    updateJimuMapView(jimuMapView) {
        var _a;
        // this.stop();
        this.jimuMapView = jimuMapView;
        this.sceneView = (_a = this.jimuMapView) === null || _a === void 0 ? void 0 : _a.view; // 3d scene;
        const activedItem = this.getActiveItem();
        if (isDefined(activedItem === null || activedItem === void 0 ? void 0 : activedItem.routes)) {
            activedItem === null || activedItem === void 0 ? void 0 : activedItem.routes.handleUpdateJimuMapView(jimuMapView);
        }
        this.getTerrainLoadingHelper(this.sceneView, this.onTerrainLoaded);
    }
    updateItems(config) {
        this.itemsList = [];
        const list = config.itemsList.asMutable({ deep: true });
        for (const item of list) {
            if (item.isInUse) {
                this.itemsList.push({
                    config: item,
                    routes: null // empty array at first, when draw/pick/select then create routes
                });
            }
        }
        if (typeof this.onItemsUpdate === 'function') {
            this.onItemsUpdate(this.itemsList);
        }
    }
    destructor() {
        this.stop();
        // this.clearAll();
    }
    // items
    findItemByUuid(uuid) {
        var _a;
        let found = null;
        found = (_a = this.itemsList) === null || _a === void 0 ? void 0 : _a.find((item) => (item.config.uuid === uuid));
        return found;
    }
    // register
    registerItem(uuid) {
        const itemConfig = this.findItemByUuid(uuid);
        this.activedItem = itemConfig;
    }
    unRegisterItem() {
        var _a;
        if ((_a = this.activedItem) === null || _a === void 0 ? void 0 : _a.routes) {
            this.activedItem.routes.destructor();
        }
        this.activedItem = null;
    }
    getControllerTypeByItemData(itemConfig) {
        let type;
        if (itemConfig.name === FlyItemMode.Rotate) {
            type = ControllerMode.Rotate;
        }
        else if (itemConfig.name === FlyItemMode.Path) {
            type = (itemConfig).style;
        }
        return type;
    }
    // gen a Controller by draw/pick
    // timing: draw or pick a Graphic
    // 1. runtime interactive-panel.tsx :: handleGraphicsUpdateHanlder()
    // 2. setting action-panel.tsx :: addPointRecord()/addPathRecord()
    buildTemporaryRecordConfig(graphicsInfo, cameraInfo, jimuMapView) {
        const item = this.getActiveItemConfig();
        const flyStyle = this.getFlyStyle();
        let recordConfigType;
        if (flyStyle === FlyItemMode.Rotate) {
            recordConfigType = ControllerMode.Rotate;
        }
        else if (flyStyle === FlyItemMode.Path) {
            recordConfigType = this.getControllerTypeByItemData(item);
        }
        const recordConfig = {
            idx: null,
            type: recordConfigType,
            displayName: 'runtime',
            duration: null,
            startDelay: null,
            endDelay: null,
            angle: null,
            controllerConfig: {
                cameraInfo: cameraInfo,
                liveviewSettingState: null
            },
            direction: item.direction,
            storedGraphicsInfo: {
                type: StoredGraphicsType.RawData,
                rawData: graphicsInfo.getConfig()
            },
            mapViewId: jimuMapView.id
        };
        return recordConfig;
    }
    buildTemporaryRecord(recordConfig, sceneView, flyCallbacks, graphicsInfoRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpRecord = yield new Record().setup(recordConfig, sceneView, flyCallbacks);
            if (isDefined(graphicsInfoRef)) {
                tmpRecord.setGraphicsInfo(graphicsInfoRef); // tmpRecord.cachingGraphicsInfo = graphicsInfoRef;
            }
            return tmpRecord;
        });
    }
    prepareRoutePreview(ids, flyCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isUesRouteFlyMode()) {
                return false;
            }
            // await this.stop();
            const item = this.getActiveItem();
            yield this.setupFly(item.config, null, flyCallbacks !== null && flyCallbacks !== void 0 ? flyCallbacks : this.flyStateCallbacks);
            return yield this.prepare({ ids: { routeUuid: ids.routeUuid }, waittingForTerrain: false });
        });
    }
    previewSpecifiedRoute(settingSpeed, ids, flyCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isUesRouteFlyMode()) {
                return;
            }
            const item = this.getActiveItem();
            const updatedFlyCallbacks = flyCallbacks !== null && flyCallbacks !== void 0 ? flyCallbacks : this.flyStateCallbacks;
            if (!isDefined(item.routes)) {
                yield this.prepareRoutePreview(ids, updatedFlyCallbacks);
            }
            yield this.fly({ ids: ids, settingSpeed: settingSpeed, isPreviewSpecifiedRecord: false }, updatedFlyCallbacks);
        });
    }
    // record
    previewSpecifiedRecord(ids, flyCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isUesRouteFlyMode()) {
                return;
            }
            const { isCanPlay /*, hadSwitchedMap */ } = yield this.checkAndSwitchJimuMapBeforePlay(ids);
            if (!isCanPlay) {
                return;
            }
            const item = this.getActiveItem();
            yield this.setupFly(item.config, null, flyCallbacks);
            const prepared = yield this.prepare({ ids: ids, isBuilderSettingFlag: this.isBuilderSettingFlag });
            if (prepared) {
                yield this.fly({ ids: ids, settingSpeed: null, isPreviewSpecifiedRecord: true });
            }
        });
    }
    // setting L3 page
    setIsLiveviewSpecifiedRecord(ids, isOpen) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isUesRouteFlyMode()) {
                return;
            }
            const item = this.getActiveItem();
            if (!isDefined(item.routes)) {
                yield this.setupFly(item.config, null);
                yield this.prepare({ ids: ids, animate: false }); // no animate
            }
            yield this.setIsLiveview(isOpen, ids);
            if (isOpen) {
                const liveviewInfo = yield this.getLiveviewSettingInfo();
                this.onLiveviewParamChange(liveviewInfo, { isNeedHighlight: true });
            }
        });
    }
    // loading
    loadingForUI(uiLoadingCallbacks) {
        const callbacks = uiLoadingCallbacks !== null && uiLoadingCallbacks !== void 0 ? uiLoadingCallbacks : this.uiLoadingCallbacks;
        if (typeof callbacks.onLoading === 'function') {
            callbacks.onLoading();
        }
    }
    loadedForUI(uiLoadingCallbacks) {
        const callbacks = uiLoadingCallbacks !== null && uiLoadingCallbacks !== void 0 ? uiLoadingCallbacks : this.uiLoadingCallbacks;
        if (typeof callbacks.onLoaded === 'function') {
            callbacks.onLoaded();
        }
    }
    // fly life circle
    setupFly(itemConfig, recordConfig, flyCallbacks, record) {
        return __awaiter(this, void 0, void 0, function* () {
            const activedItem = this.getActiveItem();
            if (activedItem.routes) {
                activedItem.routes.destructor();
            }
            const flyStateCallbacks = flyCallbacks !== null && flyCallbacks !== void 0 ? flyCallbacks : this.flyStateCallbacks;
            activedItem.routes = yield new Routes().setup(itemConfig, recordConfig, this.jimuMapView, flyStateCallbacks, this.drawOrUpdateGraphics, this.highlightGraphics, this.checkAndSwitchJimuMapBeforePlay, this.getCurrentSceneView, record);
            return activedItem;
        });
    }
    prepare(prepareCmdOpts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            return yield ((_a = item.routes) === null || _a === void 0 ? void 0 : _a.prepare(prepareCmdOpts));
        });
    }
    fly(flyCmdOptions, flyCallbacks) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            if (flyCallbacks) {
                (_a = item.routes) === null || _a === void 0 ? void 0 : _a.handleUpdateFlyCallbacks(flyCallbacks);
            }
            yield ((_b = item.routes) === null || _b === void 0 ? void 0 : _b.fly(flyCmdOptions));
        });
    }
    pause() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            yield ((_a = item.routes) === null || _a === void 0 ? void 0 : _a.pause());
        });
    }
    stop(opts = { isUpdate: false }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            yield ((_a = item.routes) === null || _a === void 0 ? void 0 : _a.stop(opts.isUpdate));
        });
    }
    // life cycle
    getProgress() {
        // let flyController = this.getController();
        // if(FlyItemMode.RecordConfig !== flyController?.flyStyle) {
        //   return flyController.getProgress();
        // }
    }
    // 3. liveView
    // async
    getLiveviewSettingInfo() {
        const item = this.getActiveItem();
        if (!isDefined(item)) {
            return null;
        }
        return item.routes.getLiveviewSettingInfo();
    }
    // Duration
    getDefaultDuration() {
        var _a;
        const item = this.getActiveItem();
        if (!isDefined(item)) {
            return null;
        }
        return (_a = item.routes) === null || _a === void 0 ? void 0 : _a.getDefaultDuration();
    }
    setIsLiveview(isSetting, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            return yield item.routes.setIsLiveview(isSetting, ids);
        });
    }
    onLiveviewParamChange(settingParamObj, opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            yield ((_a = item.routes) === null || _a === void 0 ? void 0 : _a.setLiveviewSettingInfo(settingParamObj, opts));
        });
    }
    setSpeedFactor(val) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.getActiveItem();
            if (!isDefined(item)) {
                return null;
            }
            yield ((_a = item.routes) === null || _a === void 0 ? void 0 : _a.setSpeedFactor(val));
        });
    }
    // TerrainLoadingHelper
    getTerrainLoadingHelper(sceneView, onTerrainLoaded) {
        return __awaiter(this, void 0, void 0, function* () {
            this.terrainLoadingHelper = yield new TerrainLoadingHelper().setup({ sceneView: sceneView, onTerrainLoaded: onTerrainLoaded });
        });
    }
}
//# sourceMappingURL=fly-manager.js.map