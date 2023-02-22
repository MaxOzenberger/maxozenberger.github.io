var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractDataAction, getAppStore, MutableStoreManager, utils, i18n } from 'jimu-core';
import { MapViewManager, SHOW_ON_MAP_DATA_ID_PREFIX, ShowOnMapDataType, zoomToUtils, featureUtils } from 'jimu-arcgis';
import defaultMessages from '../runtime/translations/default';
export default class ShowOnMap extends AbstractDataAction {
    constructor() {
        super(...arguments);
        this._viewManager = MapViewManager.getInstance();
    }
    isSupported(dataSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { records } = dataSet;
            // @ts-expect-error
            return records.length > 0 && records.some(record => { var _a; return (_a = record.feature) === null || _a === void 0 ? void 0 : _a.geometry; });
        });
    }
    onExecute(dataSet, actionConfig) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const activeViewId = this._getActiveViewId(this.widgetId, getAppStore().getState().jimuMapViewsInfo);
            const showOnMapDatas = ((_a = MutableStoreManager.getInstance().getStateValue([this.widgetId])) === null || _a === void 0 ? void 0 : _a.showOnMapDatas) || {};
            const intl = i18n.getIntl();
            const name = dataSet.name || intl.formatMessage({ id: 'showOnMapData', defaultMessage: defaultMessages.showOnMapData });
            // save action data
            const id = `${SHOW_ON_MAP_DATA_ID_PREFIX}dataAction_${utils.getUUID()}`;
            showOnMapDatas[id] = {
                mapWidgetId: this.widgetId,
                jimuMapViewId: activeViewId,
                dataSet,
                type: ShowOnMapDataType.DataAction,
                // use code to maintain compatibility here
                // for 'symbolOption', the difference between the values 'undefined' and 'null':
                //   undefined: app was created before online10.1 (inlcude 10.1), use default symbol;
                //   null: app was created or saved after online10.1, use default renderer of layer.
                symbolOption: (actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.isUseCustomSymbol) ? actionConfig.symbolOption : ((actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.isUseCustomSymbol) === false ? null : undefined),
                title: name
            };
            MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'showOnMapDatas', showOnMapDatas);
            const jimuMapView = this._viewManager.getJimuMapViewById(activeViewId);
            const featureSet = yield featureUtils.convertDataRecordSetToFeatureSet(dataSet);
            if (jimuMapView && ((_b = featureSet === null || featureSet === void 0 ? void 0 : featureSet.features) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                zoomToUtils.zoomTo(jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view, featureSet.features, null);
            }
            return yield Promise.resolve(true);
        });
    }
    _getActiveViewId(mapWidgetId, infos) {
        let activeViewId = Object.keys(infos || {}).find(viewId => infos[viewId].mapWidgetId === mapWidgetId && infos[viewId].isActive);
        // using a default map view as active map view if the widget hasn't been loaded.
        if (!activeViewId) {
            activeViewId = Object.keys(infos || {}).find(viewId => infos[viewId].mapWidgetId === mapWidgetId);
        }
        return activeViewId;
    }
}
//# sourceMappingURL=show-on-map.js.map