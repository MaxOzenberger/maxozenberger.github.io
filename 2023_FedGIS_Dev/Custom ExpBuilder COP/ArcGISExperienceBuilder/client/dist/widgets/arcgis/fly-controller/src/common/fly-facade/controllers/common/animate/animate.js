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
import { Constraints } from '../../../../constraints';
import { Ease, EasingMode } from './ease';
export default class Animate {
    constructor() {
        // setBeginTime() {
        //   this.state.interp.beginTime = Date.now();
        // }
        // getBeginTime() {
        //   return this.state.interp.beginTime;
        // }
        // setSumTime(t) {
        //   this.state.interp.sumTime = t + this.state.interp.sumTime;
        //   return this.state.interp.sumTime;
        // }
        // getSumTime() {
        //   return this.state.interp.sumTime;
        // }
        // easing
        this.easing = (deltaTime, speedFactor) => {
            switch (this.state.mode) {
                case EasingMode.In: {
                    return this.easingIn(deltaTime, speedFactor);
                }
                case EasingMode.InOut: {
                    return this.easingInOut(deltaTime, speedFactor);
                }
                case EasingMode.Linear: {
                    return this.linear(deltaTime, speedFactor);
                }
                case EasingMode.NONE: {
                    return this.uniformSpeed(deltaTime, speedFactor);
                }
                default: {
                    break;
                }
            }
        };
        this.uniformSpeed = (deltaTime, speedFactor) => {
            this.updateCurrentDuration(deltaTime * speedFactor);
            const speed = this.getMovementByFrame(deltaTime) * speedFactor;
            this.state.progress = 0;
            return {
                interp: 0,
                step: speed,
                progress: this.state.progress
            };
        };
        // setTimeScale = (timeScale: number) => {
        //   this.state.interp.time.currentDuration *= timeScale;
        //   this.state.interp.time.duration *= timeScale;
        // }
        this.linear = (deltaTime, speedFactor) => {
            const sum = this.updateCurrentDuration(deltaTime * speedFactor);
            let val = 0;
            let step = 0;
            if (sum < this.state.interp.time.duration) {
                val = Ease.linear(sum, this.state.interp.value.start, this.state.interp.value.end, this.state.interp.time.duration);
                step = val - this.state.interp.cache.lastVal;
                this.state.interp.cache.lastVal = val;
                this.state.progress = val / this.state.interp.value.end;
            }
            else {
                this.state.progress = 1;
            }
            return {
                interp: val,
                step: step,
                progress: this.state.progress
            };
        };
        this.easingIn = (deltaTime, speedFactor) => {
            const sum = this.updateCurrentDuration(deltaTime * speedFactor);
            let val = 0;
            let step = 0;
            if (sum < this.state.interp.time.duration) {
                val = Ease.easeIn(sum, this.state.interp.value.start, this.state.interp.value.end, this.state.interp.time.duration);
                step = val - this.state.interp.cache.lastVal;
                this.state.interp.cache.lastVal = val;
                this.state.interp.cache.lastStep = step;
            }
            else {
                step = this.state.interp.cache.lastStep * speedFactor;
            }
            this.state.progress = -1;
            return {
                interp: val,
                step: step,
                progress: this.state.progress
            };
        };
        // TODO if timeScale changed, duration should change by the progress
        this.easingInOut = (deltaTime, speedFactor) => {
            const sum = this.updateCurrentDuration(deltaTime * speedFactor);
            let val = 0;
            let step = 0;
            if (sum < this.state.interp.time.duration) {
                val = Ease.easeInOut(sum, this.state.interp.value.start, this.state.interp.value.end, this.state.interp.time.duration);
                step = val - this.state.interp.cache.lastVal;
                this.state.interp.cache.lastVal = val;
                this.state.progress = val / this.state.interp.value.end;
            }
            else {
                this.state.progress = 1;
            }
            return {
                interp: val,
                step: step,
                progress: this.state.progress
            };
        };
        // setSpeedByLimittime (limit: number): void {
        //   let speed
        //   if (typeof limit === "undefined" || limit ===0 ) {
        //     speed = Constraints.SPEED.DEFAULT_SPEED
        //   } else {
        //     speed = this.state.amount / limit
        //   }
        //   this.setSpeed(speed)
        // }
        // speed
        this.getMovementByFrame = (deltaTime) => {
            const movementPerSecond = this.getSpeed(); // m/second
            const frameRate = 1000 / deltaTime;
            // if (frameRate > 60) {
            //   frameRate = 60;
            // }
            return movementPerSecond / frameRate;
        };
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/core/scheduling'
            ]).then(modules => {
                [this.scheduling] = modules;
            });
            this.state = {
                speed: Constraints.SPEED.DEFAULT_SPEED,
                mode: EasingMode.NONE,
                progress: 0,
                amount: -1,
                interp: {
                    time: {
                        begin: 0,
                        currentDuration: 0,
                        duration: 10 * 1000 // 10s
                    },
                    value: {
                        start: 0,
                        end: 0
                    },
                    cache: {
                        lastVal: 0,
                        lastStep: 0
                    }
                }
            };
            this.animatHandler = null;
            return this;
        });
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    init(mode, start, end, duration) {
        this.state.mode = mode;
        this.state.interp.value.start = start;
        this.state.interp.value.end = end;
        this.state.interp.time.duration = duration;
        // this.state.progress = 0;
    }
    reset() {
        this.state.interp.time.begin = 0;
        this.state.interp.time.currentDuration = 0;
        this.state.progress = 0;
    }
    // Duration
    computeDuration() {
        return this.state.amount / this.state.speed * 1000;
    }
    getDuration() {
        return this.state.interp.time.duration;
    }
    // amount
    setAmount(num) {
        this.state.amount = num;
        // console.log('amount=>' + this.state.amount);
        return this;
    }
    getAmount() {
        return this.state.amount;
    }
    // progress
    getProgress() {
        return this.state.progress;
    }
    progressForward() {
        this.state.progress += 0.0001;
        return this.state.progress;
    }
    progressBackward() {
        return this.state.progress - 0.0001;
        // return this.state.progress;
    }
    // interp
    // getInterDuration() {
    //   return this.state.interp.time.currentDuration;
    // }
    updateCurrentDuration(d) {
        this.state.interp.time.currentDuration = this.state.interp.time.currentDuration + d;
        if (isNaN(this.state.interp.time.currentDuration)) {
            this.state.interp.time.currentDuration = 0;
        }
        return this.state.interp.time.currentDuration;
    }
    // speed
    getSpeed() {
        return this.state.speed;
    }
    setSpeed(s) {
        this.state.speed = s;
    }
    // runtime fly
    update(fun) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.animatHandler !== null) {
                return;
            }
            this.animatHandler = this.scheduling.addFrameTask({
                // prepare: fun
                // render: fun
                update: (frameInfo) => { fun(frameInfo); }
            });
        });
    }
    stop() {
        if (this.animatHandler !== null) {
            this.animatHandler.pause();
            this.animatHandler.remove();
            this.animatHandler = null;
        }
    }
    // for setting without playing
    insertAnExtraFrame(fun) {
        var _a;
        (_a = this.scheduling) === null || _a === void 0 ? void 0 : _a.schedule((frameInfo) => {
            fun(frameInfo);
        });
    }
}
//# sourceMappingURL=animate.js.map