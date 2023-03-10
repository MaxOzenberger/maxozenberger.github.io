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
import { getUrlOfUseUtility } from '../../utils/utils';
export const print = (option) => __awaiter(void 0, void 0, void 0, function* () {
    const { mapView, printTemplateProperties, useUtility } = option;
    return getUrlOfUseUtility(useUtility).then(printServiceUrl => {
        return loadArcGISJSAPIModules(['esri/rest/support/PrintParameters', 'esri/rest/support/PrintTemplate', 'esri/rest/print', 'esri/geometry/SpatialReference']).then(modules => {
            var _a;
            const [PrintParameters, PrintTemplate, print, SpatialReference] = modules;
            const template = new PrintTemplate(printTemplateProperties);
            const newMapView = initHasZOfGrpahicInMap(mapView);
            const printParameter = {
                view: newMapView,
                template: template
            };
            if (printTemplateProperties.wkid !== ((_a = mapView === null || mapView === void 0 ? void 0 : mapView.spatialReference) === null || _a === void 0 ? void 0 : _a.wkid)) {
                printParameter.outSpatialReference = new SpatialReference({ wkid: printTemplateProperties.wkid });
            }
            const params = new PrintParameters(printParameter);
            return print.execute(printServiceUrl, params).then((printResult) => {
                return Promise.resolve(printResult);
            }).catch((printError) => {
                return Promise.reject(printError);
            });
        });
    });
});
/**
 * Set the 'hasZ' of the layer and graphic generated by the Draw widget to 'false'
*/
function initHasZOfGrpahicInMap(mapView) {
    var _a, _b;
    mapView.layerViews.items = (_b = (_a = mapView === null || mapView === void 0 ? void 0 : mapView.layerViews) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.map(views => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_b = (_a = views === null || views === void 0 ? void 0 : views.layer) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.includes('jimu-draw-layer-')) || ((_d = (_c = views === null || views === void 0 ? void 0 : views.layer) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.includes('bookmark-layer-'))) {
            views.graphicsView.graphics.items = (_g = (_f = (_e = views === null || views === void 0 ? void 0 : views.graphicsView) === null || _e === void 0 ? void 0 : _e.graphics) === null || _f === void 0 ? void 0 : _f.items) === null || _g === void 0 ? void 0 : _g.map(graphic => {
                var _a;
                if ((_a = graphic === null || graphic === void 0 ? void 0 : graphic.attributes) === null || _a === void 0 ? void 0 : _a.jimuDrawId) {
                    graphic.geometry.hasZ = false;
                    return graphic;
                }
                else {
                    return graphic;
                }
            });
            return views;
        }
        else {
            return views;
        }
    });
    return mapView;
}
export function getPrintTemplateInfo(useUtility) {
    return __awaiter(this, void 0, void 0, function* () {
        return getUrlOfUseUtility(useUtility).then(printServiceUrl => {
        });
    });
}
//# sourceMappingURL=print-service.js.map