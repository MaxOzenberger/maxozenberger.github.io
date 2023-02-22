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
export function getFeatureLayer(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield loadArcGISJSAPIModules([
            'esri/layers/FeatureLayer'
        ]).then(modules => {
            const [FeatureLayer] = modules;
            let featureLayer;
            if (dataSource.layer) {
                // return Promise.resolve(dataSource.layer);
                featureLayer = dataSource.layer;
            }
            else {
                if (dataSource.itemId) {
                    featureLayer = new FeatureLayer({
                        portalItem: {
                            id: dataSource.itemId,
                            portal: {
                                url: dataSource.portalUrl
                            }
                        }
                    });
                }
                else {
                    featureLayer = new FeatureLayer({
                        url: dataSource.url
                    });
                }
            }
            // Bug: js-api does not enter the when callback if there is no load method here.
            return featureLayer.load().then(() => __awaiter(this, void 0, void 0, function* () {
                return yield Promise.resolve(featureLayer);
            }));
            /*
            return new Promise((resovle, reject) => {
              featureLayer.when(() => {
                console.log("when");
                resovle(featureLayer);
              }, () => {
                reject();
                console.log("when error");
              })
            });
             */
        }).catch((e) => {
            console.warn(e);
            return null;
        });
    });
}
//# sourceMappingURL=utils.js.map