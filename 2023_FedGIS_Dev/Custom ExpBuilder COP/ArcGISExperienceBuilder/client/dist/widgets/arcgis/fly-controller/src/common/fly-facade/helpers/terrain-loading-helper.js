var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// disable drawing before the layer gets loaded ,#6378
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class TerrainLoadingHelper {
    constructor() {
        this.sceneView = null;
    }
    // constructor
    setup(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/core/watchUtils'
            ]).then(modules => {
                [this.watchUtils] = modules;
                this.sceneView = opts.sceneView;
                this.onTerrainLoaded = opts.onTerrainLoaded;
                this.handleTerrainLoaded();
            });
            return this;
        });
    }
    handleTerrainLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            /* const p = */ yield Promise.race([this.getTerrainLoadedPromise(), this.getTimerPromise(10000)]);
            this.onTerrainLoaded();
        });
    }
    getTerrainLoadedPromise() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sceneView || !this.sceneView.groundView) {
                return false;
            }
            try {
                yield this.watchUtils.whenTrueOnce(this.sceneView.groundView, 'updating');
                yield this.watchUtils.whenFalseOnce(this.sceneView.groundView, 'updating');
            }
            catch (error) {
                return false;
            }
            return true;
        });
    }
    getTimerPromise(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(resolve => setTimeout(resolve, ms));
        });
    }
}
//# sourceMappingURL=terrain-loading-helper.js.map