var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import AuxHelper from '../helpers/aux-lines-helper';
import Animate from './common/animate/animate';
import AbortSignalHandler from './common/animate/abort-signal-handler';
import LiveviewSetting from './common/liveview-setting';
import * as utils from '../../utils/utils';
export var ControllerMode;
(function (ControllerMode) {
    // ViewSnapshot = 'VIEW',
    ControllerMode["Rotate"] = "ROTATE";
    ControllerMode["Smoothed"] = "CURVED";
    ControllerMode["RealPath"] = "LINE";
})(ControllerMode || (ControllerMode = {}));
export var FlyState;
(function (FlyState) {
    // init
    FlyState[FlyState["INITED"] = -1] = "INITED";
    // before fly
    FlyState[FlyState["PREPARING"] = 0] = "PREPARING";
    FlyState[FlyState["PREPARED"] = 1] = "PREPARED";
    // flying
    // READY = 'ready',
    FlyState[FlyState["RUNNING"] = 2] = "RUNNING";
    // PAUSED = 'paused',
    // INTERRUPTED = 'interrupted',
    // RESUME = 'resume',
    // stop
    FlyState[FlyState["STOPPED"] = 3] = "STOPPED";
    // continue to slow down
    // DAMPING
})(FlyState || (FlyState = {}));
// export interface HitTestRes {
//   z: number
//   dis: number
// }
export default class BaseFlyController {
    constructor() {
        this.Camera = null;
        this._resume = (fun) => __awaiter(this, void 0, void 0, function* () {
            // try {
            yield this.preparing();
            // goBack to pause point, then go on flying
            const isContinue = yield fun;
            if (!isContinue) {
                return false;
            }
            yield this.prepared();
            // if (this.state._debugTime) {
            //   this._debugTimeStart();
            // }
            this._doFly();
            return true;
            // } catch (error) {
            //   console.log('rejected:', error)
            //   throw error
            // }
        });
        // debug fly time
        // _debugTimeStart() {
        //   this.state._debug.startTime = new Date().getTime();
        // }
        // _debugTimeEnd() {
        //   this.state._debug.endTime = new Date().getTime();
        // }
        // _debugDeltaTime(): number {
        //   if (this.state._debug.endTime > 0 && this.state._debug.startTime > 0) {
        //     let delta = this.state._debug.endTime - this.state._debug.startTime;
        //     console.log('debug_DeltaTime__' + delta / 1000 + '_s');
        //     alert('debug_DeltaTime__' + delta / 1000 + '_s');
        //     return delta;
        //   } else {
        //     return -1;
        //   }
        // }
        // rotate
        // 3D: scene mode / local mode
        this.rotateBySceneMode = (cameraPosGL, upVec, rotateSpeed, offsetGL) => {
            const tmpPos = this.vec3d.fromValues(cameraPosGL[0], cameraPosGL[1], cameraPosGL[2]);
            const offsetToOrigin = this.vec3d.create();
            if (utils.isDefined(offsetGL)) {
                this.vec3.negate(offsetToOrigin, offsetGL); // origin - offsetGL
                this.vec3.add(tmpPos, tmpPos, offsetToOrigin);
            }
            const rMatrix = this.mat4d.create();
            this.mat4.rotate(rMatrix, rMatrix, utils.degToRad(rotateSpeed), upVec);
            this.vec3.transformMat4(tmpPos, tmpPos, rMatrix);
            if (utils.isDefined(offsetGL)) {
                this.vec3.subtract(tmpPos, tmpPos, offsetToOrigin);
            }
            return tmpPos;
        };
        // Elev
        this.queryGeometryElevInfo = (geometry) => {
            var _a;
            if (utils.isDefined((_a = this.sceneView.groundView) === null || _a === void 0 ? void 0 : _a.elevationSampler)) {
                return this.sceneView.groundView.elevationSampler.queryElevation(geometry);
            }
            else if (geometry.hasZ) {
                return geometry;
            }
        };
        // getIncreaseSetp = () => {
        //   let step = this.sceneView.scale / 2000;
        //   return step;
        // }
        // hit-test
        // getHitTestInfo = (graphic) => {
        //   //'polyline' === graphic.geometry.type
        //   let paths = graphic.geometry.paths[0];
        //   let point = paths[0];
        //   this._getPointHitTestRes(point[0], point[1], this.sceneView).then((res: HitTestRes) => {
        //     this.setting.initCamPos.fixHeight = 100;//res.z;
        //     this.setting.initCamPos.fixDistance = 100;//res.dis;
        //   })
        // }
        // //Altitude
        // _getPointHitTestRes = (x, y, sceneView) => {
        //   const promise = new Promise((resolve, reject) => {
        //     let initPos = new this.Point({
        //       x: x,
        //       y: y,
        //       //z:
        //       type: 'point',
        //       spatialReference: sceneView.spatialReference
        //     });
        //     let screenPoint = sceneView.toScreen(initPos);
        //     //let tilt = sceneView.camera.tilt;
        //     sceneView.hitTest(screenPoint, { exclude: [sceneView.graphics] }).then((hitTestResult) => {
        //       let lastHit = utils.getHitPointOnTheGround(hitTestResult);
        //       let dis = Math.cos(utils.degToRad(90 - sceneView.camera.tilt)) * lastHit.distance;
        //       return resolve({
        //         z: lastHit.mapPoint.z,
        //         dis: dis
        //       });
        //     });
        //   });
        //   return promise;
        // }
        this._coordsToGeoArray = (coords) => {
            const geos = [];
            let g;
            for (let i = 0, len = coords.length; i < len; i++) {
                g = this.vec3d.fromValues(coords[i].x, coords[i].y, coords[i].z);
                geos.push(g);
            }
            return geos;
        };
        // GoToOptions
        this.getPrepareGoToOptionsBeforeTerrainLoaded = (opts) => {
            const goToParam = {
                animate: true,
                maxDuration: 4000,
                easing: 'out-expo',
                signal: this.abortSignalHandler.update()
            };
            if (opts && !opts.animate) {
                goToParam.animate = false;
                delete goToParam.maxDuration;
                delete goToParam.easing;
            }
            return goToParam;
        };
        this.getPrepareGoToOptionsAfterTerrainLoaded = (opts) => {
            const goToParam = {
                animate: true,
                maxDuration: 1000,
                easing: 'out-expo',
                signal: this.abortSignalHandler.update()
            };
            if (opts && !opts.animate) {
                goToParam.animate = false;
                delete goToParam.maxDuration;
                delete goToParam.easing;
            }
            return goToParam;
        };
    }
    setup(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/core/libs/gl-matrix-2/vec3f64',
                'esri/core/libs/gl-matrix-2/mat4f64',
                'esri/core/libs/gl-matrix-2/vec3',
                'esri/core/libs/gl-matrix-2/mat4',
                'esri/core/libs/gl-matrix-2/quatf64',
                'esri/core/libs/gl-matrix-2/quat',
                'esri/views/3d/externalRenderers',
                'esri/views/3d/support/cameraUtils',
                'esri/views/3d/webgl-engine/lib/Camera',
                'esri/geometry/Point',
                'esri/views/3d/support/mathUtils',
                'esri/core/watchUtils',
                'esri/Camera'
            ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                [
                    this.libVec3f64, this.libMat4f64, this.libVec3, this.libMat4, this.libQuatf64, this.libQuat,
                    this.externalRenderers, this.cameraUtils, this.GLCamera,
                    this.Point, this.esriMathUtils, this.watchUtils, this.Camera
                ] = modules;
                this.vec3 = this.libVec3.vec3;
                this.vec3d = this.libVec3f64.vec3f64;
                this.mat4 = this.libMat4.mat4;
                this.mat4d = this.libMat4f64.mat4f64;
                this.quat = this.libQuat.quat;
                this.quatd = this.libQuatf64.quatf64;
                this.GLCamera = this.GLCamera.Camera; // update for 4.24 API upgrade
                yield this.clear();
                const { id, type, geometry, direction, config, sceneView, flyCallbacks } = param;
                this.id = id;
                this.type = type;
                this.geometry = geometry;
                this.direction = direction;
                this.cameraInfo = config.cameraInfo;
                if (utils.isDefined(config.liveviewSettingState)) {
                    this.liveviewSetting.setState(config.liveviewSettingState);
                }
                this.sceneView = sceneView;
                this.flyCallbacks = flyCallbacks;
                // debug
                this._isDebug = false;
                if (this._isDebug) {
                    this.auxHelper = new AuxHelper({ sceneView: this.sceneView });
                }
                this.DEBUG = {
                    planTime: 0,
                    startTime: 0,
                    endTime: 0
                };
                // events
                // this.sceneView.on('key-down', ((event) => {
                //   if (FlyState.RUNNING === this.flyState) {
                //     let keyPressed = event.key;
                //     if (keyPressed.slice(0, 5) === 'Arrow') {
                //       event.stopPropagation(); // prevents panning with the arrow keys
                //     }
                //   }
                // }));
                // this.sceneView.on('drag', ((event) => {
                //   if (FlyState.RUNNING === this.flyState) {
                //     if ('start' === event.action) {
                //       this.pause();
                //     } else {
                //       event.stopPropagation(); //update===event.action
                //     }
                //   } else if (FlyState.PAUSED === this.flyState) {
                //     if ('end' === event.action) {
                //       //event.stopPropagation();
                //     }
                //   }
                // }));
                // this._cache.mouse = {};
                this.eventHandlers.push(this.sceneView.on('drag', (event) => {
                    /// ///////////////////////////////////////////////////////////////////////////
                    // test map mouse move
                    //       let dx=0, dy=0;
                    //       event.stopPropagation();//to stop map pan
                    //       if ('start' === event.action) {
                    //         this._cache.mouse.x = event.x;
                    //         this._cache.mouse.y = event.y;
                    //       }
                    //       if('update' === event.action ) {
                    //         let dx = event.x - this._cache.mouse.x;
                    //         let dy = event.y - this._cache.mouse.y;
                    //         console.log('delta.xy==> ' + dx + '  _  ' + dy);//mouse moved
                    //         this._cache.mouse.x = event.x;
                    //         this._cache.mouse.y = event.y;
                    //       }
                    // //
                    // let speed = 1;
                    // freefly
                    // let newCam = this.sceneView.camera.clone();
                    // newCam.tilt = newCam.tilt - dy*speed;
                    // newCam.heading  = newCam.heading - dx*speed;
                    // this.sceneView.camera = newCam;
                    // just look at groud
                    // let newCam = this.sceneView.camera.clone();
                    // let tilt = newCam.tilt - dy*speed,
                    //   heading = newCam.heading - dx*speed;
                    // this.sceneView.goTo({
                    //               tilt:tilt,
                    //               heading: heading
                    //             } , { animate: false })
                    /*
              //trackball
                    //let r = 0;//eye - lookAt
                    let _camera = this.sceneView.state.camera;
                    let eyeDir = _camera.viewForward;//_camera.eye - _camera.center
                    // let tmpVec = this.vec3d.create();
                    // this.vec3.subtract(tmpVec, _camera.eye, _camera.center);
                    // let vecNor = this.vec3d.create();
                    // this.vec3.normalize(vecNor, tmpVec);
                    let upDir = _camera.viewUp;
                    let sideDir = _camera.viewRight;
            
                    // let up = this.vec3d.create();
                    // this.vec3.scale(up, upDir, dy);
                    // let side = this.vec3d.create();
                    // this.vec3.scale(side, sideDir, dx);
                    // let move = this.vec3d.create();
                    // this.vec3.add(move, up, side);
            
                    // let axis = this.vec3d.create();
                    // this.vec3.cross(axis, move, eyeDir);
            
                    // let axisNor = this.vec3d.create();
                    // this.vec3.normalize(axisNor, axis);
            
                    // let quat = this.quatd.create();
                    // this.quat.setAxisAngle(quat, axisNor, 1/60);
            
                    // //eye pos
                    // let newEye = this.vec3d.create();
                    // this.vec3.set(newEye, _camera.eye[0], _camera.eye[1], _camera.eye[2]);
                    // let newEyePos = this.vec3d.create();
                    // this.vec3.transformQuat(newEyePos, newEye, quat);
            
                    // //up dir
                    // let newUp = this.vec3d.create();
                    // this.vec3.set(newUp, _camera.up[0], _camera.up[1], _camera.up[2]);
                    // let newUpDir = this.vec3d.create();
                    // this.vec3.transformQuat(newUpDir, newUp, quat);
            
                    // let glCamera = new this.GLCamera(newEyePos, _camera.center, newUpDir); //camPos, lookAt, up
                    // let apiCamera = this.cameraUtils.internalToExternal(this.sceneView, glCamera);
                    // this.sceneView.camera = apiCamera
            
                    dx = dx;
                    dy = dy;
            
                    let yMatrix = this.mat4d.create();
                    let xMatrix = this.mat4d.create();
                    let moveMatrix = this.mat4d.create();
            
                    let newEyePos = this.vec3d.create();
                    let newUpDir = this.vec3d.create();
                    let newUpDirNor = this.vec3d.create();
            
                    //let yAxis = this.vec3d.create();
                    let subPos = this.vec3d.create();
                    //let tmpUp = this.vec3d.create();
            
                    if (dy != 0) {
                      if (_camera.center) {
                        this.vec3.subtract(subPos, _camera.eye, _camera.center);
                      }
                      this.mat4.rotate(yMatrix, yMatrix, utils.degToRad(dy), sideDir);
            
                      let tmp = this.vec3d.create();
                      this.vec3.transformMat4(tmp, subPos, yMatrix);
            
                      this.vec3.add(newEyePos, tmp, _camera.center);
            
                      this.vec3.transformMat4(newUpDir, _camera.up, yMatrix);
                      this.vec3.normalize(newUpDirNor, newUpDir);
                    }
                    // if (dx != 0) {
                    //   this.mat4.rotate(xMatrix, xMatrix, utils.degToRad(dx), upDir);
                    // }
            
                    if (dy != 0 ) {//|| dx != 0
                      // this.vec3.transformMat4(newEyePos, tmpPos, yMatrix);
                      // this.vec3.add(tmpPos, tmpPos, _camera.center);
            
                      // this.vec3.transformMat4(newUpDir, _camera.up, yMatrix);
                      // this.vec3.normalize(newUpDirNor, newUpDir);
            
                      // this.mat4.multiply(moveMatrix, yMatrix, xMatrix);
                      // this.vec3.transformMat4(newEyePos, _camera.eye, moveMatrix);
                      // this.vec3.transformMat4(newUpDir, _camera.up, moveMatrix);
                      // this.vec3.normalize(newUpDirNor, newUpDir);
            
                      let glCamera = new this.GLCamera(newEyePos, _camera.center, newUpDirNor); //camPos, lookAt, up
                      let apiCamera = this.cameraUtils.internalToExternal(this.sceneView, glCamera);
                      //this.sceneView.camera = apiCamera
                      this.sceneView.goTo(apiCamera, { animate: false });
                    }
              */
                    /// ///////////////////////////////////////////////////////////////////////////
                    if (this.flyState <= FlyState.RUNNING /* || FlyState.PREPARING === this.flyState */) { // in flying
                        if (event.action === 'start') {
                            this.pause();
                        }
                        else {
                            // event.stopPropagation();
                        }
                    }
                }));
                this.eventHandlers.push(this.sceneView.on('mouse-wheel', (event) => {
                    if (this.flyState <= FlyState.RUNNING /* || FlyState.PREPARING === this.flyState */) {
                        this.pause();
                    }
                }));
                // return Promise.resolve(this);
            }));
            return this;
        });
    }
    destructor() {
        this.onStop();
        this.clear();
    }
    // states check
    isInited() {
        return (this.flyState >= FlyState.INITED);
    }
    isEnableToFly() {
        const state = this.flyState;
        if (state === FlyState.PREPARED || state === FlyState.STOPPED || state === FlyState.PREPARING) {
            return true;
        }
        else {
            return false; //, RUNNING,
        }
    }
    isEnableToPause() {
        const state = this.flyState;
        if (state >= FlyState.PREPARING) { // flying | going to init pos
            return true;
        }
        else {
            return false;
        }
    }
    // fly lifecycle
    init( /* opts: InitOptions */) {
        this.flyState = FlyState.INITED;
        this.animate.reset();
    }
    preparing() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.flyState = FlyState.PREPARING;
            if (typeof ((_a = this.flyCallbacks) === null || _a === void 0 ? void 0 : _a.onPreparing) === 'function') {
                this.flyCallbacks.onPreparing();
            }
        });
    }
    prepared() {
        return __awaiter(this, void 0, void 0, function* () {
            this.flyState = FlyState.PREPARED;
            return setTimeout(() => { }, 50);
        });
    }
    _doFly() {
        if (!this.isLiveviewMode) {
            this.onStart();
        }
    }
    // config
    setConfig(controllerConfig) {
        this.cameraInfo = controllerConfig.cameraInfo;
        this.liveviewSetting.setState(controllerConfig.liveviewSettingState);
    }
    getConfig() {
        return {
            cameraInfo: this.cameraInfo,
            liveviewSettingState: this.liveviewSetting.getState()
        };
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isEnableToPause()) {
                return false; // await Promise.resolve()
            }
            // console.log('async pause () -------')
            this.stopAnimat();
            this.onPause();
            return true;
        });
    }
    resume(animate) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.flyState = FlyState.RESUME;
        });
    }
    stop() {
        // if (this.state?._debugTime) {
        //   this._debugTimeEnd();
        //   this._debugDeltaTime();
        // }
        this.stopAnimat();
        // this.clear();
        this.onStop();
    }
    clear() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            // clean events
            if (utils.isDefined(this.eventHandlers)) {
                this.eventHandlers.forEach((handler) => {
                    handler.remove();
                });
            }
            this.eventHandlers = null;
            this.eventHandlers = [];
            if (this.abortSignalHandler) {
                this.abortSignalHandler.abort();
            }
            this.abortSignalHandler = null;
            this.abortSignalHandler = new AbortSignalHandler();
            if (this._isDebug) {
                (_a = this.auxHelper) === null || _a === void 0 ? void 0 : _a.clearAll();
            }
            if (utils.isDefined((_b = this._cache) === null || _b === void 0 ? void 0 : _b.paths)) {
                (_c = this._cache) === null || _c === void 0 ? void 0 : _c.paths.destructor();
            }
            this.id = null;
            this.type = null;
            this.geometry = null;
            this.direction = null;
            this.cameraInfo = null;
            this.sceneView = null;
            this.flyCallbacks = null;
            // elements
            // param: ControllerState;
            // flyStyle: FlyItemMode;
            this.auxHelper = null;
            // animate
            (_d = this.animate) === null || _d === void 0 ? void 0 : _d.stop();
            this.animate = null;
            this.animate = yield new Animate().setup();
            // liveviewSetting
            this.liveviewSetting = null;
            this.liveviewSetting = new LiveviewSetting();
            // state
            this.flyState = null;
            this.isLiveviewMode = false;
            this.shownProgress = 0;
            // animatState?: AnimateState
            // 2 cache
            this._cache = {
                // path
                paths: null,
                // cache
                cachedGeo: null,
                // graphics?: GraphicsInfo// drawing on map//(__esri.Graphic)[], [0] is main graphic
                cameraGL: {
                    pos: null,
                    upDir: null
                },
                lookAtTargetGL: {
                    pos: null,
                    upAxis: null,
                    baseAlt: null
                }
            };
            this._isDebug = false;
            this.DEBUG = {
                planTime: null,
                startTime: null,
                endTime: null
            };
        });
    }
    // animate
    updateAnimat(fun) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.onStart();
            return yield this.animate.update((frameInfo) => { fun(frameInfo); });
        });
    }
    stopAnimat() {
        this.animate.stop();
        this.updateProgressBar();
        // this.flyState = FlyState.STOPPED;
    }
    // liveview setting
    setIsLiveview(isPreview) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLiveviewMode = isPreview;
            if (isPreview) {
                return yield this.fly({ animate: false });
            }
            else {
                return yield this.pause();
            }
        });
    }
    setLiveviewSettingInfo(settingParamObj, updateFun) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils.isDefined(settingParamObj)) { /* false===this.isLiveviewMode */
                return false;
            }
            let shouldSet = false;
            const altitude = settingParamObj.altitude;
            if (typeof altitude !== 'undefined') {
                shouldSet = true;
                this.liveviewSetting.setAltitudeFactor(altitude);
            }
            const tilt = settingParamObj.tilt;
            if (typeof tilt !== 'undefined') {
                shouldSet = true;
                this.liveviewSetting.setTiltFactor(tilt);
            }
            if (shouldSet && utils.isDefined(this.animate) && this.isLiveviewMode) {
                this.animate.insertAnExtraFrame((frameInfo) => __awaiter(this, void 0, void 0, function* () {
                    yield updateFun(frameInfo);
                }));
            }
            return true;
        });
    }
    // get default duration time
    getDefaultDuration() {
        if (this.flyState >= FlyState.PREPARED) {
            return this.animate.getDuration();
        }
        else {
            return null;
        }
    }
    // events
    onStart() {
        var _a;
        this.flyState = FlyState.RUNNING;
        if (this._isDebug) {
            this.DEBUG.planTime = this.animate.state.interp.time.duration;
            this.DEBUG.startTime = new Date().getTime();
        }
        // getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'flyStart', t));
        if (typeof ((_a = this.flyCallbacks) === null || _a === void 0 ? void 0 : _a.onFly) === 'function') {
            this.flyCallbacks.onFly();
        }
    }
    onPause() {
        var _a;
        this.abortSignalHandler.abort();
        this.flyState = FlyState.STOPPED; // FlyState.PAUSED; //only STOPPED rightnow
        if (typeof ((_a = this.flyCallbacks) === null || _a === void 0 ? void 0 : _a.onPause) === 'function') {
            this.flyCallbacks.onPause();
        }
    }
    onStop() {
        var _a;
        this.abortSignalHandler.abort();
        this.flyState = FlyState.STOPPED;
        if (this._isDebug) {
            this.DEBUG.endTime = new Date().getTime();
            const constTime = (this.DEBUG.endTime - this.DEBUG.startTime) / 1000;
            const panlTime = (this.DEBUG.planTime) / 1000;
            console.log('DEBUG 1.fly sum time ==> ' + constTime.toFixed(2) + ' s');
            console.log('DEBUG 2.plan time ==> ' + panlTime.toFixed(2) + ' s');
            const mistake = ((constTime - panlTime) / panlTime) * 100;
            console.log('DEBUG 3.mistake ==> ' + mistake.toFixed(5) + ' %');
            // alert('DEBUG: mistake ==> ' + mistake.toFixed(5) + ' % (panlTime: ' + panlTime+' constTime: '+constTime+')');
        }
        // getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'flyStop', t));
        if (typeof ((_a = this.flyCallbacks) === null || _a === void 0 ? void 0 : _a.onFinish) === 'function') {
            this.flyCallbacks.onFinish();
        }
    }
    updateProgressBar() {
        var _a, _b;
        if (typeof ((_a = this.flyCallbacks) === null || _a === void 0 ? void 0 : _a.onUpdateProgress) === 'function') {
            // frequency reduction
            const p = Math.ceil(this.getProgress() * 100);
            let isUpdate = false;
            if (p <= 1 || p >= 99) {
                isUpdate = true;
            }
            else if (Math.abs(p - this.shownProgress) >= 1) {
                isUpdate = true;
            }
            if (isUpdate) {
                this.shownProgress = p;
            }
            if (isUpdate) {
                (_b = this.flyCallbacks) === null || _b === void 0 ? void 0 : _b.onUpdateProgress(this.shownProgress);
            }
        }
    }
    concatGeoPaths(geo) {
        let paths = [];
        for (let i = 0; i < geo.paths.length; i++) {
            paths = paths.concat(geo.paths[i]);
        }
        return paths;
    }
    // Simplification
    geoCoordToRenderCoord(cachedGeo) {
        const glGeos = [];
        for (let i = 0, l = cachedGeo.length; i < l; i++) {
            let p = cachedGeo[i];
            p = utils.geoCoordToRenderCoord([p[0], p[1], p[2]], null, this.sceneView);
            glGeos.push(p);
        }
        return glGeos;
    }
}
//# sourceMappingURL=base-fly-controller.js.map