// 0. Facade for fly styles (point, path, route)
// 1. endDelay & Dynamically generate Record
// 2. play RouteTasks
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FlyItemMode } from '../../../config';
import { ControllerMode } from '../controllers/base-fly-controller';
import Record from './record/record';
import * as utils from '../../utils/utils';
export default class Routes {
    constructor() {
        // Graphics
        this._redrawAllRecordGraphics = (ids) => {
            const route = utils.getRouteConfigByIdx(this.itemConfig.routes, ids);
            route === null || route === void 0 ? void 0 : route.records.forEach((recordConfig) => {
                if (recordConfig.mapViewId === this.jimuMapView.id || // 1.runtime
                    recordConfig.mapViewId === utils.removeJimuMapIdForFly(this.jimuMapView.id)) { // 2.setting
                    // TODO this redrawAll can be enhance
                    this.drawOrUpdateGraphics(recordConfig); // draw graphics back
                }
            });
        };
    }
    // constructor()
    setup(itemConfig, recordConfig, jimuMapView, flyCallbacks, drawOrUpdateGraphics, highlightGraphics, checkAndSwitchJimuMapBeforePlay, getCurrentSceneView, record) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.type = itemConfig.name;
            this.itemConfig = itemConfig;
            // refs
            this.flyStateCallbacks = flyCallbacks;
            this.jimuMapView = jimuMapView;
            this.record = record !== null && record !== void 0 ? record : null; // use record mode
            this.recordConfig = (_a = record === null || record === void 0 ? void 0 : record.getConfig()) !== null && _a !== void 0 ? _a : recordConfig;
            this.drawOrUpdateGraphics = drawOrUpdateGraphics;
            this.highlightGraphics = highlightGraphics;
            this.checkAndSwitchJimuMapBeforePlay = checkAndSwitchJimuMapBeforePlay;
            this.getCurrentSceneView = getCurrentSceneView;
            // just save config, create nothing
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path: {
                    this.itemConfig = itemConfig;
                    break;
                }
                case FlyItemMode.Route: {
                    this.itemConfig = this.itemConfig;
                    break;
                }
                default: {
                    console.error('error type:', this.type);
                }
            }
            this._resetPlayingInfo();
            return this;
        });
    }
    destructor() {
        var _a;
        this._resetPlayingInfo();
        (_a = this.record) === null || _a === void 0 ? void 0 : _a.destructor();
    }
    handleUpdateJimuMapView(jimuMapView) {
        var _a, _b;
        this.jimuMapView = jimuMapView;
        if ((_a = this.playingInfo.currentIds) === null || _a === void 0 ? void 0 : _a.ids) {
            this._redrawAllRecordGraphics((_b = this.playingInfo.currentIds) === null || _b === void 0 ? void 0 : _b.ids);
        }
    }
    handleUpdateFlyCallbacks(flyCallbacks) {
        this.flyStateCallbacks = flyCallbacks;
    }
    _getFlyRecordDynamically(ids, sceneView, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            this.itemConfig = this.itemConfig;
            const recordConfig = utils.getRecordConfigByIds((this.itemConfig).routes, ids);
            // buildDefaultRecordConfig
            const record = yield new Record().setup(recordConfig, sceneView, callbacks /* flyRecordConfig, sceneView, callbacks */);
            return record;
        });
    }
    _getLimitionParamForPrepare(record, prepareCmdOpts) {
        var _a;
        const limition = {};
        const type = record.getConfig().type;
        const duration = record.getConfig().duration;
        let angle;
        // const endDelay = record.getConfig().endDelay;
        if (type === ControllerMode.Rotate) {
            angle = record.getConfig().angle;
        }
        if (utils.isDefined(duration) && !isNaN(duration) && duration > 0) {
            Object.assign(limition, { duration: (duration * this._computeRouteTaskTimeScale() * 1000) });
        }
        if (utils.isDefined(angle)) {
            Object.assign(limition, { angleLimit: angle });
        }
        if (utils.isDefined(prepareCmdOpts)) {
            Object.assign(limition, { animate: prepareCmdOpts.animate });
            const _waittingForTerrain = (_a = prepareCmdOpts.waittingForTerrain) !== null && _a !== void 0 ? _a : true;
            Object.assign(limition, { waittingForTerrain: _waittingForTerrain });
        }
        return limition;
    }
    playSpecifiedRecord( /* flyCmdOptions: FlyCmdOptions */) {
        return __awaiter(this, void 0, void 0, function* () {
            // redraw
            const graphicsInfo = this.drawOrUpdateGraphics(this.record.getConfig());
            this.highlightGraphics(graphicsInfo.getGraphics());
            yield this.record.fly({ speedFactor: this.getSpeedFactor() });
        });
    }
    // endDelay to create, Dynamically generate RecordConfig,
    prepare(prepareCmdOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setSpeed(null); // reset speed
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path: {
                    // do not need to draw
                    const opts = this._getLimitionParamForPrepare(this.record, prepareCmdOpts);
                    return yield this.record.prepare(opts);
                }
                case FlyItemMode.Route: {
                    // // 1. draw all Graphics
                    // this._redrawAllRecordGraphics(prepareCmdOpts.ids)
                    // 2. prepare first one
                    const res = yield this.prepareSpecifiedRecord(prepareCmdOpts, this.flyStateCallbacks);
                    if (!res.isCanPlay || !res.prepareState) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                default: {
                    console.error('error type:', this.type);
                    return false;
                }
            }
        });
    }
    // life circle
    fly(flyCmdOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setSpeedFactor(flyCmdOptions.settingSpeed);
            // 1. rotate item ==> route(just one) ==> record.controller.fly()
            // 2. path item ==> route(just one) ==> record.controller.fly()
            // 3. route-record item ==> route(uuid) ==> record(uuid).controller.fly()
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path: {
                    yield this.record.fly({ speedFactor: this.getSpeedFactor() });
                    break;
                }
                case FlyItemMode.Route: {
                    // resume route fly
                    if (utils.isDefined((_a = this.playingInfo.currentIds) === null || _a === void 0 ? void 0 : _a.ids)) {
                        // console.log('==> resume route fly')
                        this.flyStateCallbacks.onFly();
                        yield this.playTask();
                        return;
                    }
                    // start a Route or RecordConfig
                    this.flyStateCallbacks.onFly();
                    if (!this._isPlayRoute(flyCmdOptions.ids) && (flyCmdOptions.isPreviewSpecifiedRecord)) {
                        yield this.playSpecifiedRecord( /* flyCmdOptions */);
                    }
                    else {
                        yield this.playRouteFly({ routeUuid: flyCmdOptions.ids.routeUuid }, 0); // play to end
                    }
                    break;
                }
                default: {
                    console.error('error type:', this.type);
                }
            }
        });
    }
    pause() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path:
                case FlyItemMode.Route: {
                    yield ((_a = this.record) === null || _a === void 0 ? void 0 : _a.pause());
                    break;
                }
                default: {
                    console.error('fly-route.pause error type:', this.type);
                }
            }
        });
    }
    stop(isUpdate = false) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path: {
                    yield ((_a = this.record) === null || _a === void 0 ? void 0 : _a.stop());
                    break;
                }
                case FlyItemMode.Route: {
                    if (isUpdate) {
                        return; // Triggered by update, continue to routeFly
                    }
                    yield this.pause();
                    this.interruptDelayWaiting();
                    this._onAllRecordsFinish();
                    yield ((_b = this.record) === null || _b === void 0 ? void 0 : _b.stop());
                    break;
                }
                default: {
                    console.error('fly-route.stop error type:', this.type);
                }
            }
        });
    }
    // speed
    setSpeedFactor(val) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path:
                case FlyItemMode.Route:
                default: {
                    return yield this._setSpeed(val);
                }
            }
        });
    }
    getSpeedFactor() {
        return this.speedFactor;
    }
    _setSpeed(speed) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (speed === null) {
                const defaultLiveviewSetting = utils.getInitLiveviewSetting();
                speed = defaultLiveviewSetting.speed;
            }
            this.speedFactor = speed;
            if (this.playingInfo.isWaiting) {
                this.interruptDelayWaiting();
                yield this.playTask();
            }
            else {
                (_a = this.record) === null || _a === void 0 ? void 0 : _a.setSpeedFactor(speed);
            }
        });
    }
    _computeRouteTaskTimeScale() {
        //          valFromUI   speedFactor
        //            0,        0.125x
        //            0.25,     0.25x
        //            0.375,    0.5x
        //            0.5 ,     1x
        //            0.59375,  1.5x
        //            0.625,    2x
        //            0.75,     4x
        //            1,        8x
        const speed = this.speedFactor;
        let timeScale = 1;
        switch (speed) {
            case 0: {
                timeScale = 1 / 0.125;
                break;
            }
            case 0.25: {
                timeScale = 1 / 0.25;
                break;
            }
            case 0.375: {
                timeScale = 1 / 0.5;
                break;
            }
            case 0.5: {
                timeScale = 1 / 1;
                break;
            }
            case 0.59375: {
                timeScale = 1 / 1.5;
                break;
            }
            case 0.625: {
                timeScale = 1 / 2;
                break;
            }
            case 0.75: {
                timeScale = 1 / 4;
                break;
            }
            case 1: {
                timeScale = 1 / 8;
                break;
            }
            default:
                timeScale = 1 / 1;
                break;
        }
        return timeScale;
    }
    // LiveView
    setIsLiveview(isSetting, ids) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path: {
                    return yield this.record.setIsLiveview(isSetting);
                }
                case FlyItemMode.Route: {
                    if (isSetting) {
                        const res = yield this.prepareSpecifiedRecord({ ids: ids }, this.flyStateCallbacks);
                        if (!res.isCanPlay || !res.prepareState) {
                            return false;
                        }
                        return yield ((_a = this.record) === null || _a === void 0 ? void 0 : _a.setIsLiveview(isSetting));
                    }
                    else {
                        return yield ((_b = this.record) === null || _b === void 0 ? void 0 : _b.setIsLiveview(isSetting)); // stop liveView
                    }
                }
                default: {
                    console.error('error type:', this.type);
                }
            }
        });
    }
    getLiveviewSettingInfo() {
        switch (this.type) {
            case FlyItemMode.Rotate:
            case FlyItemMode.Path: {
                return this.record.getLiveviewSettingInfo();
            }
            case FlyItemMode.Route: {
                return this.record.getLiveviewSettingInfo();
            }
            default: {
                console.error('error type:', this.type);
            }
        }
    }
    getDefaultDuration() {
        switch (this.type) {
            case FlyItemMode.Rotate:
            case FlyItemMode.Path:
            case FlyItemMode.Route: {
                return this.record.getDefaultDuration();
            }
            default: {
                console.error('error type:', this.type);
            }
        }
    }
    setLiveviewSettingInfo(settingParamObj, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case FlyItemMode.Rotate:
                case FlyItemMode.Path:
                case FlyItemMode.Route: {
                    yield ((_a = this.record) === null || _a === void 0 ? void 0 : _a.setLiveviewSettingInfo(settingParamObj));
                    // isUpdateLine
                    const isUpdateLine = (_b = opts === null || opts === void 0 ? void 0 : opts.isUpdateLine) !== null && _b !== void 0 ? _b : true;
                    if (isUpdateLine) {
                        this.record.setGraphicsInfo(this.drawOrUpdateGraphics(this.record.getConfig()));
                    }
                    // isHighlight
                    const graphicsInfo = this.record.getGraphicsInfo();
                    const isNeedHighlight = (utils.isDefined(opts === null || opts === void 0 ? void 0 : opts.isNeedHighlight) && opts.isNeedHighlight);
                    if (isNeedHighlight && utils.isDefined(graphicsInfo.getGraphics())) {
                        this.highlightGraphics(graphicsInfo.getGraphics());
                    }
                    break;
                }
                default: {
                    console.error('error type:', this.type);
                }
            }
        });
    }
    // getProgress() {
    //   let flyController = this.getController();
    //   if(FlyItemMode.RecordConfig !== flyController?.flyStyle) {
    //     return flyController.getProgress();
    //   }
    // }
    // clear = () => {
    //   flyController.clear();
    // }
    /// /////////////////////////////////////////////////
    _isPlayRoute(ids) {
        return utils.isDefined(ids.routeUuid) && !utils.isDefined(ids.recordUuid);
    }
    // specifiedRecord
    prepareSpecifiedRecord(prepareCmdOpts, flyCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            const flyIds = prepareCmdOpts.ids;
            if (this._isPlayRoute(prepareCmdOpts.ids)) { // preview whole route
                const record = utils.findRecordConfigByOrder(this.itemConfig.routes, prepareCmdOpts.ids, 0);
                flyIds.recordUuid = record === null || record === void 0 ? void 0 : record.idx;
            }
            const { isCanPlay /*, hadSwitchedMap */ } = yield this.checkAndSwitchJimuMapBeforePlay(prepareCmdOpts.ids);
            if (!isCanPlay) {
                console.error('FlyRoute.prepareSpecifiedRecord(): JimuMap is not matched');
                return {
                    isCanPlay: false,
                    prepareState: null
                };
            }
            // draw all Graphics (redraw may triggered after SwitchedMap)
            this._redrawAllRecordGraphics(prepareCmdOpts.ids);
            let callbacks = flyCallbacks;
            // overwrite Callback, e.g. clear highlight when record preview pause
            const needToOverwriteCallback = !!prepareCmdOpts.isBuilderSettingFlag;
            if (needToOverwriteCallback) {
                callbacks = {
                    onFly: () => {
                        flyCallbacks.onFly();
                    },
                    onFinish: () => {
                        this.highlightGraphics(null);
                        flyCallbacks.onFinish();
                    },
                    onPause: () => {
                        this.highlightGraphics(null);
                        flyCallbacks.onPause();
                    }
                };
            }
            this.record = yield this._getFlyRecordDynamically(prepareCmdOpts.ids, this.getCurrentSceneView(), callbacks);
            const opts = this._getLimitionParamForPrepare(this.record, prepareCmdOpts);
            const res = yield this.record.prepare(opts);
            return {
                isCanPlay: true,
                prepareState: res
            };
        });
    }
    /// /////////////////////////////////////////////////////////
    // Route Task
    /// /////////////////////////////////////////////////////////
    playRouteFly(ids, startRecordIdx) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = utils.getRouteConfigByIdx(this.itemConfig.routes, ids);
            const maxRecordLen = (route.records.length - startRecordIdx);
            const recordOrderId = startRecordIdx; // init id
            const record = utils.findRecordConfigByOrder(this.itemConfig.routes, ids, startRecordIdx); // maybe null if route is empty
            this.initTask({ routeUuid: route.idx, recordUuid: record === null || record === void 0 ? void 0 : record.idx }, recordOrderId, maxRecordLen);
            yield this.playTask({ init: true });
        });
    }
    initTask(ids, recordOrderId, maxRecordLen) {
        this._resetPlayingInfo();
        this.playingInfo.currentIds = {
            ids: ids,
            orderId: recordOrderId - 1 // +1 when playTask
        };
        this.playingInfo.maxRecordLen = maxRecordLen;
        this.playingInfo.isWaiting = false;
        this.playingInfo.continueDelay = 0;
        // handlers
        const sceneView = this.getCurrentSceneView();
        const handler1 = sceneView.on('drag', (event) => {
            if (!this.playingInfo.isWaiting) {
                return;
            }
            if (event.action === 'start') {
                // console.log('=======-------=========> drag')
                this.interruptDelayWaiting();
                this.flyStateCallbacks.onPause();
            }
            else {
                // event.stopPropagation();
            }
        });
        const handler2 = sceneView.on('mouse-wheel', (event) => {
            if (!this.playingInfo.isWaiting) {
                return;
            }
            // console.log('=======-------=========> mouse-wheel')
            this.interruptDelayWaiting();
            this.flyStateCallbacks.onPause();
        });
        this.playingInfo.eventHandlers.push(handler1);
        this.playingInfo.eventHandlers.push(handler2);
        this._nextPlayingInfo();
    }
    _nextPlayingInfo() {
        var _a;
        this.playingInfo.currentIds.orderId++;
        // console.log('==> playInfo orderId==>', this.playingInfo.currentIds.orderId)
        const tmpIds = {
            routeUuid: (_a = this.playingInfo.currentIds.ids) === null || _a === void 0 ? void 0 : _a.routeUuid,
            recordUuid: null
        };
        const record = utils.findRecordConfigByOrder(this.itemConfig.routes, tmpIds, this.playingInfo.currentIds.orderId);
        // update info
        this.playingInfo.currentIds.ids = {
            routeUuid: tmpIds.routeUuid,
            recordUuid: record === null || record === void 0 ? void 0 : record.idx // can't find record, e.g.: play to the end
        };
    }
    playTask(opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.playingInfo.isWaiting = false;
            if (this.playingInfo.currentIds.orderId >= this.playingInfo.maxRecordLen) {
                this._onAllRecordsFinish(); // Finish
                return;
            }
            const innerCallbacks = {
                onFinish: this._onOneRecordFinish.bind(this, {} /* this.playingInfo.currentFlyIds */),
                onPause: this._onPause.bind(this, {} /* this.playingInfo.currentFlyIds */)
            };
            const targetRecord = utils.findRecordConfigByOrder(this.itemConfig.routes, this.playingInfo.currentIds.ids, this.playingInfo.currentIds.orderId);
            if ((opts === null || opts === void 0 ? void 0 : opts.init) || (((_a = this.record) === null || _a === void 0 ? void 0 : _a.getConfig().idx) !== (targetRecord === null || targetRecord === void 0 ? void 0 : targetRecord.idx))) {
                const res = yield this.prepareSpecifiedRecord({ ids: this.playingInfo.currentIds.ids }, innerCallbacks);
                if (!res.isCanPlay) {
                    console.warn('playTask: skip a record');
                    innerCallbacks.onFinish(); // skip one record
                    return false;
                }
                if (!res.prepareState) {
                    innerCallbacks.onPause();
                    return false;
                }
            }
            const endDelay = this.record.getConfig().endDelay;
            if (utils.isDefined(endDelay)) {
                this.playingInfo.continueDelay = endDelay * this._computeRouteTaskTimeScale(); // keep endDelay time
            }
            else {
                this.playingInfo.continueDelay = 0;
            }
            yield this.record.fly({ speedFactor: this.getSpeedFactor() });
        });
    }
    _onOneRecordFinish( /* flyIds: FlyIds */) {
        return __awaiter(this, void 0, void 0, function* () {
            this._nextPlayingInfo();
            if (utils.isDefined(this.playingInfo.continueDelay)) {
                this.playingInfo.waittingPromise = this._abortWrapper(this.waitDelay(this.playingInfo.continueDelay));
                try {
                    yield this.playingInfo.waittingPromise;
                    // console.log('_onOneRecordFinish')
                    yield this.playTask();
                }
                catch (error) {
                    // console.log('==> interruptDelayWaiting')
                    // this.flyStateCallbacks.onPause();
                }
            }
            else {
                yield this.playTask();
            }
        });
    }
    // waitting for endDelay
    waitDelay(second) {
        return __awaiter(this, void 0, void 0, function* () {
            this.playingInfo.isWaiting = true;
            return yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({});
                }, second * 1000);
            });
        });
    }
    interruptDelayWaiting() {
        var _a;
        if (utils.isDefined((_a = this.playingInfo.waittingPromise) === null || _a === void 0 ? void 0 : _a.abort)) {
            this.playingInfo.waittingPromise.abort();
        }
        this.playingInfo.isWaiting = false;
        this.playingInfo.continueDelay = 0;
    }
    _abortWrapper(p1) {
        return __awaiter(this, void 0, void 0, function* () {
            let abort;
            const p2 = new Promise((resolve, reject) => (abort = reject));
            const p = Promise.race([p1, p2]);
            p.abort = abort;
            return p;
        });
    }
    _onPause( /* flyIds: FlyIds */) {
        var _a;
        // console.log('on Pause route')
        (_a = this.flyStateCallbacks) === null || _a === void 0 ? void 0 : _a.onPause();
    }
    _onAllRecordsFinish() {
        var _a;
        this._resetPlayingInfo();
        // console.log('routes Finish')
        (_a = this.flyStateCallbacks) === null || _a === void 0 ? void 0 : _a.onFinish();
    }
    _resetPlayingInfo() {
        var _a;
        // clean events
        if (utils.isDefined((_a = this.playingInfo) === null || _a === void 0 ? void 0 : _a.eventHandlers)) {
            this.playingInfo.eventHandlers.forEach((handler) => {
                handler.remove();
            });
            this.playingInfo.eventHandlers = null;
            this.playingInfo.eventHandlers = [];
        }
        this.playingInfo = {
            currentIds: {
                ids: null,
                orderId: 0
            },
            maxRecordLen: 0,
            // timeScale: 1,
            // speedFactor: defaultLiveviewSetting.speed,
            waittingPromise: null,
            isWaiting: false,
            continueDelay: 0,
            eventHandlers: []
        };
    }
}
//# sourceMappingURL=routes.js.map