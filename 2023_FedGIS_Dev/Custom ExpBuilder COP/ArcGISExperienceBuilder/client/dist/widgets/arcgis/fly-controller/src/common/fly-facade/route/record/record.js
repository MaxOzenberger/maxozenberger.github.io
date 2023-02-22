// record = config + controller
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 0. static buildDefaultRecordConfig config
// 1. gen Record object
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { ControllerMode } from '../../controllers/base-fly-controller';
import ControllerFactory from '../../controllers/controller-factory';
import { isDefined } from '../../../utils/utils';
// StoredGraphics
export var StoredGraphicsType;
(function (StoredGraphicsType) {
    StoredGraphicsType["RawData"] = "rawData";
    StoredGraphicsType["DsInfo"] = "dsInfo"; // for picking bigData geo: e.g. line with too many poits
})(StoredGraphicsType || (StoredGraphicsType = {}));
export default class Record {
    constructor() {
        this.Geometry = null;
        this.Graphic = null;
    }
    // constructor()
    setup(recordConfig, sceneView, flyCallbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/geometry',
                'esri/Graphic'
            ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                [this.Geometry, this.Graphic] = modules;
                this.recordConfig = recordConfig;
                // runtime
                this.sceneView = sceneView;
                this.flyCallbacks = flyCallbacks;
                this.controller = null;
                const type = this.recordConfig.type;
                switch (type) {
                    case ControllerMode.Rotate:
                    case ControllerMode.RealPath:
                    case ControllerMode.Smoothed: {
                        // RawData//9.2 support rawData only
                        let geo;
                        if (((_a = recordConfig.storedGraphicsInfo) === null || _a === void 0 ? void 0 : _a.type) === StoredGraphicsType.RawData) {
                            const graphics = recordConfig.storedGraphicsInfo.rawData.graphics;
                            geo = this.Graphic.fromJSON(graphics[0]).geometry;
                        }
                        const controllerInitParams = {
                            id: recordConfig.idx,
                            type: recordConfig.type,
                            geometry: geo,
                            direction: recordConfig.direction,
                            config: {
                                cameraInfo: (_b = recordConfig.controllerConfig) === null || _b === void 0 ? void 0 : _b.cameraInfo,
                                liveviewSettingState: (_c = recordConfig.controllerConfig) === null || _c === void 0 ? void 0 : _c.liveviewSettingState
                            },
                            sceneView: sceneView,
                            flyCallbacks: flyCallbacks
                        };
                        this.controller = yield ControllerFactory.make(controllerInitParams);
                        break;
                    }
                    default: {
                        console.error('error type: ', type);
                    }
                }
            }));
            return this;
        });
    }
    destructor() {
        var _a;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.destructor();
        this.controller = null;
        this.recordConfig = null;
    }
    // setConfig(controllerConfig: ControllerConfig): void {
    //   this.cameraInfo = controllerConfig.cameraInfo
    //   this.liveviewSetting.setState(controllerConfig.liveviewSettingState)
    // }
    getConfig() {
        var _a;
        // update controller config
        this.recordConfig.controllerConfig = this.controller.getConfig();
        // update line duration
        if ((isNaN(this.recordConfig.duration) || this.recordConfig.duration < 0) && // have not set
            (((_a = this.controller) === null || _a === void 0 ? void 0 : _a.animate.state.amount) >= 0)) { // has be calculated
            this.recordConfig.duration = this.controller.animate.getDuration() / 1000;
        }
        // update GraphicsInfo
        if (this.cachingGraphicsInfo) {
            this.recordConfig.storedGraphicsInfo.rawData = this.cachingGraphicsInfo.getConfig();
        }
        return this.recordConfig;
    }
    // controller's life circle
    prepare(opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (isDefined(opts) && !isDefined(opts.animate)) {
                Object.assign(opts, { animate: true }); // default is true
            }
            return yield ((_a = this.controller) === null || _a === void 0 ? void 0 : _a.prepare(opts));
        });
    }
    fly(opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!isDefined(opts.animate)) {
                Object.assign(opts, { animate: true }); // default is true
            }
            yield ((_a = this.controller) === null || _a === void 0 ? void 0 : _a.fly(opts));
        });
    }
    pause() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = this.controller) === null || _a === void 0 ? void 0 : _a.pause());
        });
    }
    stop() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.controller) === null || _a === void 0 ? void 0 : _a.stop());
        });
    }
    // graphics
    setGraphicsInfo(graphicsInfo) {
        this.cachingGraphicsInfo = graphicsInfo;
    }
    getGraphicsInfo() {
        return this.cachingGraphicsInfo; // this.controller?.getCachedGraphics()
    }
    // liveview
    setSpeedFactor(val) {
        var _a;
        return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.liveviewSetting.setSpeedFactor(val);
    }
    setIsLiveview(isSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.controller.setIsLiveview(isSetting);
        });
    }
    setLiveviewSettingInfo(settingParamObj) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.recordConfig.liveviewSettingState.fixAltitude = settingParamObj.altitude
            // this.recordConfig.liveviewSettingState.fixTilt =settingParamObj.tilt
            return yield this.controller.setLiveviewSettingInfo(settingParamObj);
        });
    }
    getLiveviewSettingInfo() {
        var _a;
        return (_a = this.controller) === null || _a === void 0 ? void 0 : _a.getLiveviewSettingInfo();
    }
    getDefaultDuration() {
        return this.controller.getDefaultDuration();
    }
}
//# sourceMappingURL=record.js.map