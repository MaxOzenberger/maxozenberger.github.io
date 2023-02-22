var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isDefined, degToRad, radToDeg, geoCoordToRenderCoord } from '../../utils/utils';
import BaseFlyController from './base-fly-controller';
import { RotateDirection } from '../../../config';
import { EasingMode } from './common/animate/ease';
export default class RotatingFlyController extends BaseFlyController {
    constructor() {
        super(...arguments);
        this._updateCamearGlByTilt = (tilt, opts) => {
            if (!isDefined(this._cache.lookAtTargetGL.pos)) {
                return null;
            }
            // clip 1-89
            if (tilt < 1) {
                tilt = 1;
            }
            else if (tilt > 89) {
                tilt = 89;
            }
            // if (tilt) {
            // 1 basePoint in the upAxis
            // get radius len
            const cam2Target = this.vec3d.create();
            this.vec3.subtract(cam2Target, this._cache.cameraGL.pos, this._cache.lookAtTargetGL.pos);
            const radiusLen = this.vec3.length(cam2Target);
            // normalize lookAtTargetGL.upAxis direction
            const upDirNor = this.vec3d.create();
            this.vec3.normalize(upDirNor, this._cache.lookAtTargetGL.upAxis);
            // scale upAxis direction to radius len
            const radiusVec = this.vec3d.create();
            this.vec3.scale(radiusVec, upDirNor, radiusLen);
            // radius len in lookAtTarget's upAxis
            const basePoint = this.vec3d.create();
            this.vec3.add(basePoint, this._cache.lookAtTargetGL.pos, radiusVec);
            // 2 move basePoint depend on tilt
            const rotateAux = this.vec3d.create(); // glCamera.viewRight;
            this.vec3.cross(rotateAux, upDirNor, cam2Target);
            let wantedCamPos = this.vec3d.create();
            wantedCamPos = this.rotateBySceneMode(basePoint, rotateAux, tilt, this._cache.lookAtTargetGL.pos);
            const tiltMatrix = this.mat4d.create();
            this.mat4.rotate(tiltMatrix, tiltMatrix, (degToRad(tilt)), rotateAux);
            const newRay = this.vec3d.create();
            this.vec3.subtract(newRay, wantedCamPos, this._cache.lookAtTargetGL.pos);
            const wantedCamUp = this.vec3d.create();
            this.vec3.cross(wantedCamUp, newRay, rotateAux);
            this.vec3.normalize(wantedCamUp, wantedCamUp);
            // update
            this._cache.cameraGL.pos = wantedCamPos;
            this._cache.cameraGL.upDir = wantedCamUp;
            // update config, such as triggered by L3
            if (opts === null || opts === void 0 ? void 0 : opts.isUpdateCamearConfig) {
                const glCamera = new this.GLCamera(this._cache.cameraGL.pos, this._cache.lookAtTargetGL.pos, this._cache.cameraGL.upDir);
                this.cameraInfo = this.cameraUtils.internalToExternal(this.sceneView, glCamera);
                this.cameraInfo = this.cameraInfo.toJSON(); // jsonify
            }
        };
        this._computeCurrentTilt = () => {
            const cam2Target = this.vec3d.create();
            this.vec3.subtract(cam2Target, this._cache.cameraGL.pos, this._cache.lookAtTargetGL.pos);
            const upDirNor = this.vec3d.create();
            this.vec3.normalize(upDirNor, this._cache.lookAtTargetGL.upAxis);
            const angle = radToDeg(this.vec3.angle(cam2Target, upDirNor));
            // console.log("tilt angle==>"+angle.toFixed());
            // let intAngle = Math.round(angle);//precision
            // this.liveviewSetting.setTiltFactor(intAngle);
            return angle;
        };
        this._updateInitCamera = (point, opts) => {
            let mapPoint = point;
            // cache lookAt pos
            if (this._isDebug) {
                this.auxHelper.drawPoint(mapPoint);
            }
            mapPoint = this.queryGeometryElevInfo(mapPoint);
            this._cache.lookAtTargetGL.pos = geoCoordToRenderCoord([mapPoint.x, mapPoint.y, mapPoint.z], null, this.sceneView);
            this._cache.lookAtTargetGL.upAxis = this.vec3d.create();
            this._cache.lookAtTargetGL.baseAlt = mapPoint.z;
            this.sceneView.renderCoordsHelper.worldUpAtPosition(this._cache.lookAtTargetGL.pos, this._cache.lookAtTargetGL.upAxis);
            // if (isDefined(this.direction)) {
            //   this.direction = options.direction
            // }
            let camera;
            if (isDefined(this.cameraInfo)) {
                camera = this.Camera.fromJSON(this.cameraInfo);
            }
            else {
                camera = this.sceneView.camera.clone(); // for pick
            }
            const cameraFixedGL = this.cameraUtils.externalToInternal(this.sceneView, camera);
            this._cache.cameraGL.pos = cameraFixedGL.eye;
            this._cache.cameraGL.upDir = cameraFixedGL.up;
            // init&update camPos by liveviewSetting
            if (opts === null || opts === void 0 ? void 0 : opts.isUpdateTilt) {
                this._updateCamearGlByTilt(this._getTilt());
            }
            return mapPoint;
        };
        this.fly = (opts) => __awaiter(this, void 0, void 0, function* () {
            if (isDefined(opts === null || opts === void 0 ? void 0 : opts.speedFactor)) {
                this.liveviewSetting.setSpeedFactor(opts.speedFactor);
            }
            if (!this.isInited()) {
                // have not inited
                yield this.prepare();
                yield this.resume();
                return true;
            }
            else if (this.isEnableToFly()) {
                return yield this.resume(opts === null || opts === void 0 ? void 0 : opts.animate);
            }
            else {
                return yield Promise.reject('isEnableToFly() === false');
            }
            // this.watchUtils.whenOnce(this.state, 'flyState', () => {
            //   this.stopAnimat();
            // });
        });
        this.getApiCamera = () => {
            const glCamera = new this.GLCamera(this._cache.cameraGL.pos, this._cache.lookAtTargetGL.pos, this._cache.cameraGL.upDir); // camPos, lookAt, up
            const apiCamera = this.cameraUtils.internalToExternal(this.sceneView, glCamera);
            if (apiCamera.position.z < 0) { // up-on the ground
                apiCamera.position.z = 0;
            }
            return apiCamera;
        };
        this.resumeCamera = (animate) => __awaiter(this, void 0, void 0, function* () {
            const useAnimate = animate;
            try {
                yield this.sceneView.goTo(this.getApiCamera(), { animate: useAnimate, signal: this.abortSignalHandler.update() });
            }
            catch (error) {
                if (error.name === 'AbortError') {
                    console.log('sceneView.goTo() Aborted');
                    return false;
                }
                else {
                    //throw error
                    return false;
                }
            }
            return true;
        });
        this.getProgress = () => {
            return 0;
        };
    }
    /// /////////////////////////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////
    setIsLiveview(isPreview) {
        const _super = Object.create(null, {
            setIsLiveview: { get: () => super.setIsLiveview }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.setIsLiveview.call(this, isPreview);
            return yield this.setLiveviewSettingInfo(this.getLiveviewSettingInfo());
        });
    }
    setLiveviewSettingInfo(paramObj) {
        const _super = Object.create(null, {
            setLiveviewSettingInfo: { get: () => super.setLiveviewSettingInfo }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.setLiveviewSettingInfo.call(this, paramObj, () => __awaiter(this, void 0, void 0, function* () {
                if (isDefined(paramObj) && isDefined(paramObj.tilt) && isDefined(this._cache.lookAtTargetGL.pos)) {
                    if (paramObj.tilt >= 0) {
                        this._updateCamearGlByTilt(paramObj.tilt, { isUpdateCamearConfig: true });
                        try {
                            yield this.sceneView.goTo(this.getApiCamera(), { animate: false, signal: this.abortSignalHandler.update() });
                        }
                        catch (error) {
                            if (error.name === 'AbortError') {
                                console.log('sceneView.goTo() Aborted');
                                return false;
                            }
                            else {
                                //throw error
                                return false;
                            }
                        }
                        return true;
                        // this._getAndUpdateCurrentTilt();
                    }
                }
                return false;
            }));
        });
    }
    // getFlyTilt = () => {
    //   //this.liveviewSetting.setTiltFactor(this.computeFlyTilt());
    //   return this.liveviewSetting.getTiltFactor();
    // }
    // computeFlyTilt = () => {
    //   if (!this._cache.lookAtTargetGL.pos) {
    //     return
    //   }
    //   let cam2Target = this.vec3d.create();
    //   this.vec3.subtract(cam2Target, this._cache.cameraGL.pos, this._cache.lookAtTargetGL.pos);
    //   let angle = this.vec3.angle(this._cache.lookAtTargetGL.upAxis, cam2Target);
    //   angle = (90 - radToDeg(angle));
    //   //console.log('angle==>' + angle);
    //   return angle;
    // }
    // setFlyTilt = (tilt) => {
    //   let camera = this.sceneView.camera.clone();
    //   tilt = utils.clampTilt(tilt);
    //   let oldTileAngle = this.getFlyTilt();
    //   oldTileAngle = degToRad(oldTileAngle);
    //   let S = (camera.position.z - this._cache.lookAtTargetGL.baseAlt) / Math.tan(oldTileAngle);
    //   let h = S * Math.tan(degToRad(tilt)); //new cam pos.z
    //   return h;
    // }
    _getTilt() {
        let tilt = this.liveviewSetting.getTiltFactor(true);
        if (tilt === null || typeof tilt === 'undefined' || isNaN(tilt)) {
            // init tilt
            tilt = this._computeCurrentTilt();
            this.liveviewSetting.setTiltFactor(tilt);
        }
        return tilt;
    }
    getLiveviewSettingInfo() {
        return {
            tilt: this._getTilt(),
            altitude: null,
            speed: this.liveviewSetting.getSpeedFactor()
        };
    }
    /// /////////////////////////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////
    // init
    prepare(opts) {
        const _super = Object.create(null, {
            preparing: { get: () => super.preparing },
            prepared: { get: () => super.prepared }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const mapPoint = this.geometry;
            if (isDefined(opts)) {
                if (isDefined(opts.angleLimit)) {
                    this.optionsAngleLimit = opts.angleLimit;
                    this.angleLimitCounter = opts.angleLimit;
                }
                else if (isDefined(this.optionsAngleLimit)) {
                    // nothing to do, keep current this.optionsAngleLimit
                }
                else {
                    // this.optionsAngleLimit = null;//no limit
                }
                if (isDefined(opts.duration)) {
                    this.duration = opts.duration;
                }
            }
            _super.preparing.call(this);
            /* mapPoint = */ this._updateInitCamera(mapPoint, { isUpdateTilt: false });
            if (isDefined(this.duration)) {
                this.animate.init(EasingMode.Linear, 0, ((_a = this.optionsAngleLimit) !== null && _a !== void 0 ? _a : 360), this.duration);
            }
            else {
                this.animate.init(EasingMode.NONE, 0, 0, this.duration);
            }
            // goto init cam-pos
            // 1.fly to point without terrain-info
            try {
                yield this.sceneView.goTo(this.getApiCamera(), this.getPrepareGoToOptionsBeforeTerrainLoaded(opts));
            }
            catch (error) {
                if (error.name === 'AbortError') {
                    console.log('sceneView.goTo() Aborted');
                }
                else {
                    console.error(error);
                }
                return false;
            }
            if (opts === null || opts === void 0 ? void 0 : opts.waittingForTerrain) {
                // update camera when terrain loaded
                yield this.watchUtils.whenFalseOnce(this.sceneView.groundView, 'updating');
                this._updateInitCamera(this.geometry, { isUpdateTilt: true });
                // 2. fly to point with terrain-info
                try {
                    yield this.sceneView.goTo(this.getApiCamera(), this.getPrepareGoToOptionsAfterTerrainLoaded(opts));
                }
                catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('sceneView.goTo() Aborted');
                    }
                    return false;
                }
                yield this.watchUtils.whenFalseOnce(this.sceneView.groundView, 'updating');
            }
            // 3. ok, update fly-state
            yield _super.prepared.call(this);
            return true;
        });
    }
    _doFly() {
        const _super = Object.create(null, {
            _doFly: { get: () => super._doFly }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super._doFly.call(this);
            return yield this.updateAnimat((frameInfo) => {
                const interp = this.animate.easing(frameInfo.deltaTime, this.liveviewSetting.getMappingSpeedFactor());
                let rotateSpeed = interp.step;
                const progress = interp.progress;
                if (isDefined(this.direction) && this.direction === RotateDirection.CW) {
                    rotateSpeed = -rotateSpeed; // CCW default
                }
                if (this.isLiveviewMode) {
                    // stop there for setting
                }
                else {
                    if (this.optionsAngleLimit === null || isNaN(this.optionsAngleLimit)) {
                        this._rotateCam(rotateSpeed);
                    }
                    else {
                        if (progress >= 1) {
                            rotateSpeed = this.angleLimitCounter; // remaining angle
                            // this.optionsAngleLimit = 0;
                        }
                        const angle = Math.min(Math.abs(rotateSpeed), this.angleLimitCounter);
                        this.angleLimitCounter -= angle;
                        if (this.angleLimitCounter > 0) {
                            this._rotateCam(rotateSpeed);
                        }
                        else /* if (this.optionsAngleLimit <= 0) */ {
                            this.stop(); // resolve();//finish
                        }
                    }
                }
                if (this._isDebug) {
                    this.auxHelper.drawPointGL(this._cache.cameraGL.pos, 'red');
                }
                // 5. move camera
                const apiCamera = this.getApiCamera();
                this.sceneView.goTo(apiCamera, { animate: false /*, signal: this.abortSignalHandler.signal */ }).catch(function (error) {
                    if (error.name === 'AbortError') {
                        console.log('sceneView.goTo() Aborted');
                    }
                    else {
                        throw error;
                    }
                });
            });
            // })
            // this.watchUtils.whenOnce(this.sceneView, 'interacting', () => {
            //   this.stopAnimat();
            // });
        });
    }
    _rotateCam(rotateSpeed) {
        // update cam pos
        const rotateAux = this._cache.lookAtTargetGL.upAxis;
        let wantedCamPos = this.vec3d.create();
        wantedCamPos = this.rotateBySceneMode(this._cache.cameraGL.pos, rotateAux, rotateSpeed, this._cache.lookAtTargetGL.pos);
        this._cache.cameraGL.pos = wantedCamPos;
        // update UP dir
        const rotateMatrix = this.mat4d.create();
        this.mat4.rotate(rotateMatrix, rotateMatrix, (degToRad(rotateSpeed)), rotateAux);
        const wantedUpDir = this._cache.cameraGL.upDir;
        this.vec3.transformMat4(wantedUpDir, wantedUpDir, rotateMatrix);
        this.vec3.normalize(wantedUpDir, wantedUpDir);
        this._cache.cameraGL.upDir = wantedUpDir;
    }
    resume(animate) {
        const _super = Object.create(null, {
            resume: { get: () => super.resume }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.resume.call(this);
            return yield this._resume(this.resumeCamera(animate));
        });
    }
    clear() {
        const _super = Object.create(null, {
            clear: { get: () => super.clear }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.clear.call(this);
            this._cache.lookAtTargetGL.pos = null;
        });
    }
}
//# sourceMappingURL=rotating-fly-controller.js.map