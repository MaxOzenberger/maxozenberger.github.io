var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractDataAction, MutableStoreManager } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { handleFeature } from '../runtime/utils';
export default class PanTo extends AbstractDataAction {
    isSupported(dataSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { records } = dataSet;
            // @ts-expect-error
            return records.length > 0 && records.some(record => { var _a; return (_a = record.feature) === null || _a === void 0 ? void 0 : _a.geometry; });
        });
    }
    onExecute(dataSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { records } = dataSet;
            return loadArcGISJSAPIModules(['esri/Graphic']).then(modules => {
                let Graphic = null;
                [Graphic] = modules;
                const featureSet = {
                    features: records.map(record => { var _a; return (_a = handleFeature(record.feature, Graphic)) === null || _a === void 0 ? void 0 : _a.geometry; })
                };
                MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'panToActionValue.value', featureSet);
                return true;
            });
        });
    }
}
//# sourceMappingURL=pan-to.js.map