// support line clamp ground mode (two layer switching) ,#6247
// Relative-to-ground mode: the appearance of the line/point depends on the height set
// On-the-ground mode: line clamp to ground
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// use draw-helper.tsx to draw graphics-info.ts
// 1. startPoint/endPoint Only use Relative-to-ground mode mode
// 2. mode of the line depends on the height setting (altitude is 0 means On-the-ground mode)
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export var LayersMode;
(function (LayersMode) {
    LayersMode["RelativeToGround"] = "relative-to-ground";
    LayersMode["OnTheGround"] = "on-the-ground";
})(LayersMode || (LayersMode = {}));
export default class DrawLayersGroup {
    constructor() {
        this.widgetId = '';
        this.jimuMapView = null;
        this.GraphicsLayer = null;
        this.removeAllGraphics = () => {
            var _a, _b;
            (_a = this.layersGroup.layerOnTheGround) === null || _a === void 0 ? void 0 : _a.removeAll();
            (_b = this.layersGroup.layerRelativeToGround) === null || _b === void 0 ? void 0 : _b.removeAll();
        };
    }
    // constructor
    setup(jimuMapView, widgetId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/layers/GraphicsLayer'
            ]).then(modules => {
                [this.GraphicsLayer] = modules;
                this.widgetId = widgetId;
                this.resetJimuMapView(jimuMapView);
                this.layersGroup = {
                    layerRelativeToGround: null,
                    layerOnTheGround: null
                };
                this.resetGraphicsLayers();
            });
            return this;
        });
    }
    resetJimuMapView(jimuMapView) {
        var _a, _b, _c, _d;
        if (this.jimuMapView) {
            (_a = this.jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map.remove((_b = this.layersGroup) === null || _b === void 0 ? void 0 : _b.layerRelativeToGround);
            (_c = this.jimuMapView.view) === null || _c === void 0 ? void 0 : _c.map.remove((_d = this.layersGroup) === null || _d === void 0 ? void 0 : _d.layerOnTheGround);
        }
        this.jimuMapView = jimuMapView;
        return this;
    }
    resetGraphicsLayers() {
        this._getGraphicsLayer(LayersMode.RelativeToGround);
        this._getGraphicsLayer(LayersMode.OnTheGround);
        return this;
    }
    _getGraphicsLayer(mode) {
        var _a;
        let layer = null;
        const layerId = mode + '-draw-layer-' + this.widgetId + '-' + this.jimuMapView.id;
        if ((_a = this.jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) {
            layer = this.jimuMapView.view.map.findLayerById(layerId);
            if (!layer) {
                layer = new this.GraphicsLayer({
                    id: layerId,
                    listMode: 'hide',
                    title: layerId,
                    // on-the-ground mode: line clamp to ground
                    // relative-to-ground mode: point.z=0 is on the ground
                    elevationInfo: { mode: mode }
                });
                this.jimuMapView.view.map.add(layer);
            }
        }
        if (mode === LayersMode.RelativeToGround) {
            this.layersGroup.layerRelativeToGround = layer;
        }
        else if (mode === LayersMode.OnTheGround) {
            this.layersGroup.layerOnTheGround = layer;
        }
    }
}
//# sourceMappingURL=draw-layers-group.js.map