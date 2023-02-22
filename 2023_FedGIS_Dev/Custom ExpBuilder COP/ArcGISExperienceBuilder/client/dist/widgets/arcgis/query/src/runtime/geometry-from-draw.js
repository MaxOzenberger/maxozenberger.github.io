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
import { React, jsx, css, lodash, loadArcGISJSAPIModule, utils } from 'jimu-core';
import { JimuMapViewComponent, loadArcGISJSAPIModules } from 'jimu-arcgis';
import { hooks } from 'jimu-ui';
import { InteractiveDraw } from './interactive-draw-tool';
import { BufferInput } from './buffer-input';
import defaultMessage from './translations/default';
import { QueryTaskContext } from './query-task-context';
export function GeometryFromDraw(props) {
    const { onGeometryChange, createToolTypes, mapWidgetIds, enableBuffer, bufferDistance, bufferUnit, onBufferChange } = props;
    const [jimuMapView, setJimuMapView] = React.useState(null);
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const queryTaskContext = React.useContext(QueryTaskContext);
    const resetSymbolRef = React.useRef(queryTaskContext.resetSymbol);
    const getLayerFunRef = React.useRef(null);
    const geometryEngineRef = React.useRef(null);
    const geometryServiceRef = React.useRef(null);
    const geometryRef = React.useRef(null);
    const bufferDistanceRef = React.useRef(bufferDistance);
    const bufferUnitRef = React.useRef(bufferUnit);
    const bufferedGraphicRef = React.useRef(null);
    hooks.useEffectOnce(() => {
        if (enableBuffer) {
            // Parent component query-task-spatial-form will reset buffer parameter when filter type changes,
            // so defer the init buffer option in order not to be override by its parent.
            lodash.defer(() => {
                onBufferChange(bufferDistance, bufferUnit);
            });
        }
        loadArcGISJSAPIModules([
            'esri/Graphic'
        ]).then((modules) => {
            const Graphic = modules[0];
            bufferedGraphicRef.current = new Graphic({
                symbol: {
                    type: 'simple-fill',
                    color: [51, 51, 204, 0.5],
                    style: 'solid',
                    outline: {
                        color: [51, 51, 204, 0.8],
                        width: 1
                    }
                }
            });
        });
    });
    const applyBufferEffect = React.useCallback(() => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!geometryRef.current || !enableBuffer || bufferDistanceRef.current === 0) {
            return;
        }
        const geometry = geometryRef.current;
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#buffer
        if (((_a = geometry.spatialReference) === null || _a === void 0 ? void 0 : _a.isGeographic) && !geometry.spatialReference.isWGS84) {
            const serviceUrl = utils.getGeometryService();
            if (!geometryServiceRef.current) {
                const modules = yield loadArcGISJSAPIModules([
                    'esri/rest/geometryService',
                    'esri/rest/support/BufferParameters'
                ]);
                geometryServiceRef.current = {
                    geometryService: modules[0],
                    bufferParameters: modules[1]
                };
            }
            const { geometryService, bufferParameters: BufferParameters } = geometryServiceRef.current;
            const polygons = yield geometryService.buffer(serviceUrl, new BufferParameters({
                distances: [bufferDistanceRef.current],
                unit: lodash.kebabCase(bufferUnitRef.current),
                geodesic: true,
                bufferSpatialReference: geometry.spatialReference,
                outSpatialReference: geometry.spatialReference,
                geometries: [geometry]
            }));
            bufferedGraphicRef.current.geometry = polygons[0];
        }
        else {
            if (!geometryEngineRef.current) {
                geometryEngineRef.current = yield loadArcGISJSAPIModule('esri/geometry/geometryEngine');
            }
            if (((_b = geometry.spatialReference) === null || _b === void 0 ? void 0 : _b.isWGS84) || ((_c = geometry.spatialReference) === null || _c === void 0 ? void 0 : _c.isWebMercator)) {
                bufferedGraphicRef.current.geometry = geometryEngineRef.current.geodesicBuffer(geometry, bufferDistanceRef.current, lodash.kebabCase(bufferUnitRef.current));
            }
            else {
                bufferedGraphicRef.current.geometry = geometryEngineRef.current.buffer(geometry, bufferDistanceRef.current, lodash.kebabCase(bufferUnitRef.current));
            }
        }
    }), [enableBuffer]);
    React.useEffect(() => {
        if (queryTaskContext.resetSymbol && queryTaskContext.resetSymbol !== resetSymbolRef.current) {
            resetSymbolRef.current = queryTaskContext.resetSymbol;
            getLayerFunRef.current && getLayerFunRef.current().removeAll();
            onGeometryChange(null);
        }
    }, [queryTaskContext.resetSymbol, onGeometryChange]);
    const handleJimuMapViewChanged = React.useCallback((jimuMapView) => {
        // clear drawing graphics before switching map view
        const layer = getLayerFunRef.current && getLayerFunRef.current();
        if (layer) {
            layer.removeAll();
            onGeometryChange(null);
        }
        setJimuMapView((jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) != null ? jimuMapView : null);
    }, [onGeometryChange]);
    const handleBufferChange = React.useCallback((distance, unit) => {
        bufferDistanceRef.current = distance;
        bufferUnitRef.current = unit;
        applyBufferEffect();
        onBufferChange(distance, unit);
    }, [onBufferChange, applyBufferEffect]);
    const handleDrawEnd = React.useCallback((graphic, getLayerFun, clearAfterApply) => {
        getLayerFunRef.current = getLayerFun;
        const layer = getLayerFunRef.current && getLayerFunRef.current();
        geometryRef.current = graphic === null || graphic === void 0 ? void 0 : graphic.geometry;
        layer === null || layer === void 0 ? void 0 : layer.add(bufferedGraphicRef.current);
        applyBufferEffect();
        onGeometryChange(graphic === null || graphic === void 0 ? void 0 : graphic.geometry, layer, graphic, clearAfterApply);
    }, [onGeometryChange, applyBufferEffect]);
    return (jsx(React.Fragment, null, mapWidgetIds === null || mapWidgetIds === void 0 ? void 0 :
        mapWidgetIds.map((mapWidgetId, x) => (jsx(JimuMapViewComponent, { key: x, useMapWidgetId: mapWidgetId, onActiveViewChange: handleJimuMapViewChanged }))),
        (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) && (jsx(React.Fragment, null,
            jsx(InteractiveDraw, { jimuMapView: jimuMapView, toolTypes: createToolTypes, onDrawEnd: handleDrawEnd }),
            enableBuffer && (jsx("div", { role: 'group', "aria-label": getI18nMessage('bufferDistance'), css: css `margin-top: 0.75rem;` },
                jsx("div", { className: 'text-truncate' }, getI18nMessage('bufferDistance')),
                jsx("div", { className: 'd-flex mt-1' },
                    jsx(BufferInput, { distance: bufferDistance, unit: bufferUnit, onBufferChange: handleBufferChange }))))))));
}
//# sourceMappingURL=geometry-from-draw.js.map