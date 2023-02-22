var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, css, DataSourceManager, DataSourceStatus, dataSourceUtils, UtilityManager, getAppStore } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { hooks, defaultMessages as jimuUIMessages, WidgetPlaceholder } from 'jimu-ui';
import Directions from 'esri/widgets/Directions';
import FeatureLayer from 'esri/layers/FeatureLayer';
import { DefaultJSAPISearchProperties } from '../constants';
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId } from '../utils';
import defaultMessages from './translations/default';
import WidgetIcon from '../../icon.svg';
const { useEffect, useState, useRef, useCallback, useMemo } = React;
const Widget = (props) => {
    var _a;
    const { config, id } = props;
    const { searchConfig, routeConfig } = config;
    const useMapWidgetId = (_a = props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0];
    const [jimuMapView, setJimuMapView] = useState(null);
    const containerRef = useRef(null);
    const directionsRef = useRef(null);
    const watchLastRouteRef = useRef(null);
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const defaultSearchHint = useMemo(() => translate('findAddressOrPlace'), [translate]);
    const onActiveMapViewChange = useCallback(activeView => {
        setJimuMapView(activeView);
    }, []);
    const isReadyToRenderDirections = useCallback(() => {
        var _a, _b, _c;
        if (useMapWidgetId && (routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility) && ((_b = (_a = searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.dataConfig) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.useUtility)) {
            const utilities = (_c = getAppStore().getState().appConfig) === null || _c === void 0 ? void 0 : _c.utilities;
            return !!(utilities && utilities[routeConfig.useUtility.utilityId] && utilities[searchConfig.dataConfig[0].useUtility.utilityId]);
        }
        else {
            return false;
        }
    }, [useMapWidgetId, routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility, searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.dataConfig]);
    useEffect(() => {
        if (isReadyToRenderDirections() && (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) && containerRef.current) {
            updateDirectionsWidget();
        }
        else {
            destroyDirectionsWidget();
        }
        function updateDirectionsWidget() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                destroyDirectionsWidget();
                const routeServiceUrl = yield getUrlOfUseUtility(routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility);
                const searchProperties = yield convertSearchConfigToJSAPISearchProperties(searchConfig, defaultSearchHint);
                /**
                 * If can not get url of used utility, won't update directions.
                 */
                if (!routeServiceUrl || !((_b = (_a = searchProperties === null || searchProperties === void 0 ? void 0 : searchProperties.sources) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url)) {
                    return;
                }
                const c = document.createElement('div');
                c.className = 'directions-container';
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(c);
                directionsRef.current = new Directions({
                    id,
                    container: c,
                    view: jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view,
                    routeServiceUrl: routeServiceUrl,
                    searchProperties: searchProperties
                });
                // Set route parameters to get needed data from route service.
                directionsRef.current.viewModel.routeParameters.returnRoutes = true;
                directionsRef.current.viewModel.routeParameters.returnDirections = true;
                directionsRef.current.viewModel.routeParameters.returnStops = true;
                setOutputDssNotReady(id);
                watchLastRoute();
            });
        }
        function watchLastRoute() {
            watchLastRouteRef.current = directionsRef.current.watch('lastRoute', () => {
                if (directionsRef.current.lastRoute) { // If there is route result, change status of output data sources to unloaded.
                    setOutputDssUnloadedAndSetLayer(id, directionsRef.current.lastRoute);
                }
                else { // If there isn't route result, change status of output data sources to not_ready.
                    setOutputDssNotReady(id);
                }
            });
        }
        function destroyDirectionsWidget() {
            var _a, _b, _c;
            // If do not have map, destroy will throw error.
            if ((_b = (_a = directionsRef.current) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.map) {
                directionsRef.current.destroy();
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            try {
                // Remove save as popper.
                const saveAsPopper = (_c = document.querySelector('calcite-panel.esri-save-layer')) === null || _c === void 0 ? void 0 : _c.parentElement;
                if (saveAsPopper && saveAsPopper.tagName.toUpperCase() === 'CALCITE-POPOVER') {
                    document.body.removeChild(saveAsPopper);
                }
            }
            catch (e) { }
        }
        return () => {
            var _a;
            (_a = watchLastRouteRef.current) === null || _a === void 0 ? void 0 : _a.remove();
            destroyDirectionsWidget();
        };
    }, [id, jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view, searchConfig, routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility, defaultSearchHint, isReadyToRenderDirections]);
    return (jsx("div", { className: 'widget-directions jimu-widget' },
        isReadyToRenderDirections()
            ? jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetId, onActiveViewChange: onActiveMapViewChange })
            : jsx(WidgetPlaceholder, { widgetId: id, icon: WidgetIcon, message: translate('_widgetLabel') }),
        jsx("div", { ref: containerRef, css: style })));
};
export default Widget;
const style = css `
  width: 100% !important;
  height: 100% !important;
  .directions-container{
    width: 100% !important;
    height: 100% !important;
    .esri-search{
      .esri-search__container{
        .esri-search__sources-button{
          z-index: 0;
          border-top: none;
          border-right: solid 1px var(--light-300);
          border-bottom: none;
          border-left: none;
          margin-right: 1px;
        }
        .esri-search__input-container{
          margin: auto;
          .esri-search__clear-button{
            z-index: 0;
            right: 4px;
          }
        }
      }
    }
    .esri-directions__panel-content{
      padding: 0 0 20px 0;
    }
  }
`;
function convertSearchConfigToJSAPISearchProperties(searchConfig, defaultHint) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const properties = Object.assign({}, DefaultJSAPISearchProperties);
        const hint = ((_a = searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.generalConfig) === null || _a === void 0 ? void 0 : _a.hint) || defaultHint;
        if (hint) {
            properties.allPlaceholder = hint;
        }
        if (typeof ((_b = searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.suggestionConfig) === null || _b === void 0 ? void 0 : _b.maxSuggestions) === 'number') {
            properties.maxSuggestions = searchConfig.suggestionConfig.maxSuggestions;
        }
        if (typeof ((_c = searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.suggestionConfig) === null || _c === void 0 ? void 0 : _c.isUseCurrentLoation) === 'boolean') {
            properties.locationEnabled = searchConfig.suggestionConfig.isUseCurrentLoation;
        }
        if (Array.isArray(searchConfig === null || searchConfig === void 0 ? void 0 : searchConfig.dataConfig)) {
            const sourcesPromise = searchConfig.dataConfig.map((c) => __awaiter(this, void 0, void 0, function* () {
                const geocodeURL = yield getUrlOfUseUtility(c.useUtility);
                const sources = {
                    url: geocodeURL,
                    name: c.label,
                    placeholder: c.hint || defaultHint
                };
                return Promise.resolve(sources);
            }));
            yield Promise.all(sourcesPromise).then(sources => {
                properties.sources = sources;
            });
        }
        return Promise.resolve(properties);
    });
}
function getUrlOfUseUtility(useUtility) {
    if (!useUtility) {
        return Promise.resolve(null);
    }
    return UtilityManager.getInstance().getUrlOfUseUtility(useUtility).catch(e => null);
}
function setOutputDssNotReady(widgetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stopOutputDs = yield DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId));
            const routeOutputDs = yield DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId));
            const directionPointOutputDs = yield DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId));
            const directionLineOutputDs = yield DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId));
            setDsNotReady(stopOutputDs);
            setDsNotReady(routeOutputDs);
            setDsNotReady(directionPointOutputDs);
            setDsNotReady(directionLineOutputDs);
        }
        catch (e) {
            console.log('Failed to create directions output data sources. ', e);
        }
    });
}
function setOutputDssUnloadedAndSetLayer(widgetId, result) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stopOutputDs = yield DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId));
            const routeOutputDs = yield DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId));
            const directionPointOutputDs = yield DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId));
            const directionLineOutputDs = yield DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId));
            createJSAPILayerForDs(stopOutputDs, 'point', convertToJSAPIGraphic((_a = result.stops) === null || _a === void 0 ? void 0 : _a.toArray()));
            createJSAPILayerForDs(routeOutputDs, 'polyline', convertToJSAPIGraphic(result.routeInfo ? [result.routeInfo] : []));
            createJSAPILayerForDs(directionPointOutputDs, 'point', convertToJSAPIGraphic((_b = result.directionPoints) === null || _b === void 0 ? void 0 : _b.toArray()));
            createJSAPILayerForDs(directionLineOutputDs, 'polyline', convertToJSAPIGraphic((_c = result.directionLines) === null || _c === void 0 ? void 0 : _c.toArray()));
            setDsUnloaded(stopOutputDs);
            setDsUnloaded(routeOutputDs);
            setDsUnloaded(directionPointOutputDs);
            setDsUnloaded(directionLineOutputDs);
        }
        catch (e) {
            console.log('Failed to create directions output data sources. ', e);
        }
    });
}
function setDsNotReady(ds) {
    if (ds) {
        ds.setStatus(DataSourceStatus.NotReady);
        ds.setCountStatus(DataSourceStatus.NotReady);
    }
}
function setDsUnloaded(ds) {
    if (ds) {
        ds.setStatus(DataSourceStatus.Unloaded);
        ds.setCountStatus(DataSourceStatus.Unloaded);
    }
}
function createJSAPILayerForDs(ds, geoType, source) {
    if (!ds) {
        return;
    }
    const idField = ds.getSchema().fields[ds.getIdField()];
    ds.layer = new FeatureLayer({
        id: ds.id,
        fields: dataSourceUtils.changeJimuFieldsToJSAPIFields(ds.getSchema().fields, idField),
        objectIdField: idField === null || idField === void 0 ? void 0 : idField.name,
        geometryType: geoType,
        source: source
    });
    ds.addSourceVersion();
}
function convertToJSAPIGraphic(res) {
    if (!res) {
        return [];
    }
    return res.map((r) => r === null || r === void 0 ? void 0 : r.toGraphic()).filter(g => !!g);
}
//# sourceMappingURL=widget.js.map