// default symbol mechanism for config storage optimization ,#6174
// if use default symbols, set Graphic.symbols = null
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
export default class DefaultSymbols {
    constructor() {
        this.symbolJsonUtils = null;
        this.getDefaultPointSymbol = (color) => {
            const pt = this.symbolJsonUtils.fromJSON({
                type: 'PointSymbol3D',
                symbolLayers: [{
                        type: 'Icon',
                        material: { color: color },
                        size: 12,
                        outline: { color: [255, 255, 255], size: 0.75 }
                    }],
                verticalOffset: {
                    screenLength: 5,
                    minWorldLength: 5,
                    maxWorldLength: 10
                },
                callout: {
                    type: 'line',
                    color: [255, 255, 255],
                    size: 2,
                    border: { color: [50, 50, 50] }
                }
            });
            return pt;
        };
        this.getDefaultLineSymbol = (color) => {
            const line = this.symbolJsonUtils.fromJSON({
                type: 'LineSymbol3D',
                symbolLayers: [{
                        type: 'Line',
                        material: {
                            color: color,
                            transparency: 50
                        },
                        join: 'round',
                        cap: 'round',
                        size: 2.25
                    }]
            });
            return line;
        };
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadArcGISJSAPIModules([
                'esri/symbols/support/jsonUtils'
            ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                [this.symbolJsonUtils] = modules;
            }));
            return this;
        });
    }
}
//# sourceMappingURL=default-symbols.js.map