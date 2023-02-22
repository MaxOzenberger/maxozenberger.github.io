/** @jsx jsx */
import { React, jsx, css, lodash, loadArcGISJSAPIModules, Immutable } from 'jimu-core';
import { Button, hooks, Checkbox, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { PrintExtentType, MapFrameUnit as Unit } from '../../config';
import { getPreviewLayerId } from '../utils/utils';
import { px2meter } from '../../utils/unit-conversion';
import { checkIsMapOnly } from '../../utils/utils';
const { useState, useEffect, useRef } = React;
const PreviewExtent = (props) => {
    var _a, _b, _c, _d;
    const { jimuMapView, id, selectedTemplate, className } = props;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const GISAPIModules = useRef(null);
    const selectedTemplateRef = useRef(null);
    const debounceShowGraphicOnMapRef = useRef(null);
    const curExtentRef = useRef((_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.extent);
    const curScaleRef = useRef((_b = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _b === void 0 ? void 0 : _b.scale);
    const STYLE = css `

  `;
    const [previewExtent, setPreviewExtent] = useState(false);
    const [curExtent, setCurExtent] = useState((_c = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _c === void 0 ? void 0 : _c.extent);
    const [curScale, setCurScale] = useState((_d = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _d === void 0 ? void 0 : _d.scale);
    const handlePreviewExtent = () => {
        setPreviewExtent(!previewExtent);
        if (!previewExtent) {
            showGraphicOnMap();
        }
        else {
            removeAllGraphics();
        }
    };
    useEffect(() => {
        debounceShowGraphicOnMapRef.current = lodash.debounce(showGraphicOnMap, 400);
        loadArcGISJSAPIModules(['esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/geometry/Polygon', 'esri/geometry/Extent', 'esri/geometry/Point', 'esri/geometry/support/WKIDUnitConversion']).then(modules => {
            GISAPIModules.current = modules;
        });
        return removeAllGraphics;
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f;
        const isTemplateChange = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId) !== ((_a = selectedTemplateRef.current) === null || _a === void 0 ? void 0 : _a.templateId);
        const isMapPrintExtentChange = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType) !== ((_b = selectedTemplateRef.current) === null || _b === void 0 ? void 0 : _b.printExtentType);
        const isOutScaleChange = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.outScale) !== ((_c = selectedTemplateRef.current) === null || _c === void 0 ? void 0 : _c.outScale);
        const isDpiChange = ((_d = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _d === void 0 ? void 0 : _d.dpi) !== ((_f = (_e = selectedTemplateRef.current) === null || _e === void 0 ? void 0 : _e.exportOptions) === null || _f === void 0 ? void 0 : _f.dpi);
        const isMapSizeChange = checkIsMapSizeChange();
        selectedTemplateRef.current = selectedTemplate;
        if (previewExtent && (isTemplateChange || isMapPrintExtentChange || isOutScaleChange || isMapSizeChange || isDpiChange)) {
            debounceShowGraphicOnMapRef.current();
        }
        // eslint-disable-next-line
    }, [selectedTemplate]);
    useEffect(() => {
        if (previewExtent && curExtent) {
            debounceShowGraphicOnMapRef.current();
        }
        // eslint-disable-next-line
    }, [curExtent, curScale]);
    useEffect(() => {
        var _a, _b;
        if (jimuMapView) {
            viewWatcher();
            setCurExtent(Immutable(JSON.parse(JSON.stringify((_b = (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.extent) === null || _b === void 0 ? void 0 : _b.toJSON()))));
        }
        else {
            setCurExtent(null);
        }
        // eslint-disable-next-line
    }, [jimuMapView]);
    const checkIsMapSizeChange = () => {
        var _a, _b, _c, _d, _e, _f;
        const isMapOnly = checkIsMapOnly(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layout);
        if (!isMapOnly) {
            return false;
        }
        const isWidthChange = ((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _a === void 0 ? void 0 : _a.width) !== ((_c = (_b = selectedTemplateRef.current) === null || _b === void 0 ? void 0 : _b.exportOptions) === null || _c === void 0 ? void 0 : _c.width);
        const isHeightChange = ((_d = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _d === void 0 ? void 0 : _d.height) !== ((_f = (_e = selectedTemplateRef.current) === null || _e === void 0 ? void 0 : _e.exportOptions) === null || _f === void 0 ? void 0 : _f.height);
        return isWidthChange || isHeightChange;
    };
    const viewWatcher = () => {
        var _a, _b;
        (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.watch('extent', (newExtent) => {
            const newCurExtent = JSON.parse(JSON.stringify(newExtent.toJSON()));
            setCurExtent(Immutable(newCurExtent));
            curExtentRef.current = newExtent;
        });
        (_b = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _b === void 0 ? void 0 : _b.watch('scale', (newScale) => {
            setCurScale(newScale);
            curScaleRef.current = newScale;
        });
    };
    const showGraphicOnMap = () => {
        var _a;
        const graphicsLayer = getGraphicsLayer();
        const Graphic = GISAPIModules.current[1];
        const geomLayout = ((_a = selectedTemplateRef.current) === null || _a === void 0 ? void 0 : _a.printExtentType) === PrintExtentType.CurrentMapExtent ? getGeomLayoutByExtent() : getGeomLayoutByScale();
        const graLayout = new Graphic(geomLayout, {
            type: 'simple-fill',
            color: [0, 216, 237, 0.3],
            outline: {
                color: [0, 0, 0],
                width: '4px'
            }
        });
        graphicsLayer.graphics.removeAll();
        graphicsLayer.graphics.add(graLayout);
    };
    const getGeomLayoutByScale = () => {
        var _a, _b, _c, _d, _e;
        const { mapFrameSize, mapFrameUnit, layout } = (_a = selectedTemplateRef.current) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        const unitValue = getUnitValueForSR();
        const pageUnitToMeters = getUnitToMetersFactor(mapFrameUnit);
        const Polygon = GISAPIModules.current[2];
        const isMapOnly = checkIsMapOnly(layout);
        const centerPt = (_b = curExtentRef === null || curExtentRef === void 0 ? void 0 : curExtentRef.current) === null || _b === void 0 ? void 0 : _b.center;
        const scale = ((_c = selectedTemplateRef.current) === null || _c === void 0 ? void 0 : _c.printExtentType) === PrintExtentType.SetMapScale ? (_d = selectedTemplateRef.current) === null || _d === void 0 ? void 0 : _d.outScale : curScaleRef.current;
        const mapSizeInPrintResult = isMapOnly ? getPageSizeByExportMapSize() : { width: mapFrameSize[0], height: mapFrameSize[1] };
        const unitRatio = {
            x: isMapOnly ? 1 : pageUnitToMeters.x / (unitValue === null || unitValue === void 0 ? void 0 : unitValue.x),
            y: isMapOnly ? 1 : pageUnitToMeters.y / (unitValue === null || unitValue === void 0 ? void 0 : unitValue.y)
        };
        const mapDims = { x: mapSizeInPrintResult.width, y: mapSizeInPrintResult.height };
        // Calculate the boundaries for the print area
        // Convert the print page size to the size of the current map unit, and multiply it by the scale to get the width and height of the preview border
        const minX = (centerPt === null || centerPt === void 0 ? void 0 : centerPt.x) - (mapDims === null || mapDims === void 0 ? void 0 : mapDims.x) / 2 * scale * (unitRatio === null || unitRatio === void 0 ? void 0 : unitRatio.x);
        const minY = (centerPt === null || centerPt === void 0 ? void 0 : centerPt.y) - (mapDims === null || mapDims === void 0 ? void 0 : mapDims.y) / 2 * scale * (unitRatio === null || unitRatio === void 0 ? void 0 : unitRatio.y);
        const maxX = (centerPt === null || centerPt === void 0 ? void 0 : centerPt.x) + (mapDims === null || mapDims === void 0 ? void 0 : mapDims.x) / 2 * scale * (unitRatio === null || unitRatio === void 0 ? void 0 : unitRatio.x);
        const maxY = (centerPt === null || centerPt === void 0 ? void 0 : centerPt.y) + (mapDims === null || mapDims === void 0 ? void 0 : mapDims.y) / 2 * scale * (unitRatio === null || unitRatio === void 0 ? void 0 : unitRatio.y);
        // list the points in clockwise order (this is the paper)
        const ringLayoutPerim = [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]];
        const geomLayout = new Polygon({
            spatialReference: (_e = curExtentRef === null || curExtentRef === void 0 ? void 0 : curExtentRef.current) === null || _e === void 0 ? void 0 : _e.spatialReference
        });
        geomLayout.addRing(ringLayoutPerim);
        return geomLayout;
    };
    const getGeomLayoutByExtent = () => {
        var _a, _b, _c, _d, _e, _f;
        const Extent = GISAPIModules.current[3];
        const { mapFrameSize, layout, exportOptions } = (_a = selectedTemplateRef.current) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        const isMapOnly = checkIsMapOnly(layout);
        const Polygon = GISAPIModules.current[2];
        let extent = Immutable((_b = curExtentRef.current) === null || _b === void 0 ? void 0 : _b.toJSON());
        const mapAspectRatio = ((_c = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _c === void 0 ? void 0 : _c.width) / ((_d = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _d === void 0 ? void 0 : _d.height);
        const mapInPrintResultAspectRatio = isMapOnly ? (exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.width) / (exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.height) : mapFrameSize[0] / mapFrameSize[1];
        //When using the current map extent, we need to adjust the extent of the extent according to the aspect ratio to ensure that the preview frame is consistent with the print result.
        const height = (extent === null || extent === void 0 ? void 0 : extent.height) || ((_e = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _e === void 0 ? void 0 : _e.height);
        const width = (extent === null || extent === void 0 ? void 0 : extent.width) || ((_f = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _f === void 0 ? void 0 : _f.width);
        if (mapAspectRatio > mapInPrintResultAspectRatio) {
            const newMapHeight = width / mapInPrintResultAspectRatio;
            const newCoordinate = getNewCoordinate(false, newMapHeight / height);
            extent = extent.set('height', newMapHeight).set('ymin', newCoordinate === null || newCoordinate === void 0 ? void 0 : newCoordinate.mim).set('ymax', newCoordinate === null || newCoordinate === void 0 ? void 0 : newCoordinate.max);
        }
        else if (mapAspectRatio < mapInPrintResultAspectRatio) {
            const newMapWidth = height * mapInPrintResultAspectRatio;
            const newCoordinate = getNewCoordinate(true, newMapWidth / width);
            extent = extent.set('width', newMapWidth).set('xmin', newCoordinate === null || newCoordinate === void 0 ? void 0 : newCoordinate.mim).set('xmax', newCoordinate === null || newCoordinate === void 0 ? void 0 : newCoordinate.max);
        }
        const previewExtent = new Extent({
            xmax: extent === null || extent === void 0 ? void 0 : extent.xmax,
            xmin: extent === null || extent === void 0 ? void 0 : extent.xmin,
            ymax: extent === null || extent === void 0 ? void 0 : extent.ymax,
            ymin: extent === null || extent === void 0 ? void 0 : extent.ymin,
            zmax: extent === null || extent === void 0 ? void 0 : extent.zmax,
            zmin: extent === null || extent === void 0 ? void 0 : extent.zmin,
            spatialReference: extent === null || extent === void 0 ? void 0 : extent.spatialReference
        });
        return Polygon.fromExtent(previewExtent);
    };
    const getNewCoordinate = (isX, changeRatio) => {
        var _a, _b;
        const extent = (_a = curExtentRef.current) === null || _a === void 0 ? void 0 : _a.toJSON();
        const centerPt = (_b = curExtentRef === null || curExtentRef === void 0 ? void 0 : curExtentRef.current) === null || _b === void 0 ? void 0 : _b.center;
        const oldLength = isX ? ((extent === null || extent === void 0 ? void 0 : extent.xmax) - (extent === null || extent === void 0 ? void 0 : extent.xmin)) : ((extent === null || extent === void 0 ? void 0 : extent.ymax) - (extent === null || extent === void 0 ? void 0 : extent.ymin));
        const newLength = oldLength * changeRatio;
        const newMax = isX ? (centerPt === null || centerPt === void 0 ? void 0 : centerPt.x) + newLength / 2 : (centerPt === null || centerPt === void 0 ? void 0 : centerPt.y) + newLength / 2;
        const newMin = isX ? (centerPt === null || centerPt === void 0 ? void 0 : centerPt.x) - newLength / 2 : (centerPt === null || centerPt === void 0 ? void 0 : centerPt.y) - newLength / 2;
        return {
            max: newMax,
            mim: newMin
        };
    };
    const getPageSizeByExportMapSize = () => {
        var _a;
        //Convert the px size to the current map unit size
        const { exportOptions } = (_a = selectedTemplateRef.current) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        const unitValue = getUnitValueForSR();
        return {
            width: px2meter(exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.width, true, exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.dpi) * (unitValue === null || unitValue === void 0 ? void 0 : unitValue.x),
            height: px2meter(exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.height, false, exportOptions === null || exportOptions === void 0 ? void 0 : exportOptions.dpi) * (unitValue === null || unitValue === void 0 ? void 0 : unitValue.y)
        };
    };
    const getUnitToMetersFactor = (unit) => {
        switch (unit === null || unit === void 0 ? void 0 : unit.toUpperCase()) {
            case Unit.Centimeter:
                return { x: 0.01, y: 0.01 };
            case Unit.Inch:
                return { x: 0.0254, y: 0.0254 };
            case Unit.Millimeter:
                return { x: 0.001, y: 0.001 };
            case Unit.Point:
                return { x: 0.0254 * 1 / 72, y: 0.0254 * 1 / 72 };
            default:
                return { x: NaN, y: NaN };
        }
    };
    const getUnitValueForSR = () => {
        var _a;
        const lookup = GISAPIModules.current[5];
        let wkid;
        let wkt;
        const sr = (_a = curExtentRef === null || curExtentRef === void 0 ? void 0 : curExtentRef.current) === null || _a === void 0 ? void 0 : _a.spatialReference;
        if (sr) {
            wkid = sr.wkid;
            wkt = sr.wkt;
        }
        let unitValue = null;
        if (wkid) {
            unitValue = lookup.values[lookup[wkid]];
        }
        else if (wkt && (wkt.search(/^PROJCS/i) !== -1)) {
            const result = /UNIT\[([^\]]+)\]\]$/i.exec(wkt);
            if (result && result[1]) {
                unitValue = parseFloat(result[1].split(',')[1]);
            }
        }
        return { x: unitValue, y: unitValue };
    };
    const getGraphicsLayer = () => {
        var _a;
        let layer = null;
        const GraphicsLayer = GISAPIModules.current[0];
        const layerId = getPreviewLayerId(id, jimuMapView.id);
        if ((_a = jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) {
            layer = jimuMapView.view.map.findLayerById(layerId);
            if (!layer) {
                layer = new GraphicsLayer({
                    id: layerId,
                    title: layerId
                });
                jimuMapView.view.map.add(layer);
            }
        }
        return layer;
    };
    const removeAllGraphics = () => {
        const layerId = getPreviewLayerId(id, jimuMapView.id);
        const graphicsLayer = jimuMapView.view.map.findLayerById(layerId);
        graphicsLayer && graphicsLayer.graphics.removeAll();
    };
    return (jsx("div", { className: className, css: STYLE },
        jsx(Button, { title: nls('previewPrint'), className: 'd-flex w-100 align-items-center checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handlePreviewExtent },
            jsx(Checkbox, { title: nls('previewPrint'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: previewExtent }),
            jsx("div", { className: 'text-left ml-2 text-truncate' }, nls('previewPrint')))));
};
export default PreviewExtent;
//# sourceMappingURL=preview-extents.js.map