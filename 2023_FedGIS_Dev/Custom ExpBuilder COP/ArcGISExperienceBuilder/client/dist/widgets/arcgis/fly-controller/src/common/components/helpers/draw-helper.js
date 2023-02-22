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
import { React, jsx } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
//import { Draw, DrawToolClass } from 'jimu-ui/advanced/map'
import { JimuDraw, JimuDrawCreationMode, DrawingElevationMode3D } from 'jimu-ui/advanced/map';
import { DrawingMode } from '../graphic-interaction-manager';
import { GraphicsInfo, DefaultSymbols } from '../../constraints';
import * as utils from '../../utils/utils';
// let PointType;
export default class DrawHelper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Graphic = null;
        this.Geometry = null;
        this.Point = null;
        this.handleDrawToolCreated = (jimuDrawToolsRef) => __awaiter(this, void 0, void 0, function* () {
            this.jimuDrawToolsRef = jimuDrawToolsRef;
            yield this.jimuDrawToolsRef.completeOperation();
            this.props.onDrawHelperCreated(this);
        });
        this.handleDrawToolsActived = (drawingMode) => {
            if (drawingMode !== null) {
                this._drawingModeChange(drawingMode);
            } // if null, will call onDrawCancel()
        };
        this.handleDrawCancel = () => {
            this._drawingModeChange(DrawingMode.Null);
            this.props.onDrawCancel();
        };
        this._drawingModeChange = (drawingMode) => {
            this.drawingMode = drawingMode;
            this.props.onDrawingModeChanged(drawingMode);
        };
        this.handleDrawStart = () => {
            if (typeof this.props.onDrawStart === 'function') {
                this.props.onDrawStart();
            }
        };
        // timeing: after draw, before edit
        this.handleDrawEnd = (graphic) => {
            // this._drawingModeChange(null);
        };
        // return jsObjects
        this.handleDrawFinish = ({ type, graphics }) => {
            var _a, _b, _c;
            if (type === 'deleted' || type === 'modified') {
                return; // continue the workflow
            }
            // clean drawinglayer
            (_a = this.jimuDrawToolsRef.sketch.layer) === null || _a === void 0 ? void 0 : _a.removeAll();
            if (type === 'aborted') {
                return this.handleDrawCancel(); // aborted editing (after drawn)
            }
            const initCameraInfo = (_c = (_b = this.sceneView) === null || _b === void 0 ? void 0 : _b.camera) === null || _c === void 0 ? void 0 : _c.clone().toJSON();
            const graphic = graphics && graphics[0];
            const graphicsInfo = new GraphicsInfo({ graphics: null, isPicked: false });
            if (this.drawingMode === DrawingMode.Point) {
                // for hittest buildings with elevations, such as bridges: #6433
                if (graphic.geometry.z) {
                    graphic.geometry.z = 0; // the point on the ground
                }
                graphicsInfo.setGraphics(this.doDrawPoint(graphic));
                this.props.onDrawFinish({ graphicsInfo: graphicsInfo, cameraInfo: initCameraInfo, drawingMode: this.drawingMode }); // just on the ground
                this._drawingModeChange(DrawingMode.Null);
            }
            if (this.drawingMode === DrawingMode.Line) {
                graphicsInfo.setGraphics(this.doDrawLine(graphic));
                this.props.onDrawFinish({ graphicsInfo: graphicsInfo, cameraInfo: initCameraInfo, drawingMode: this.drawingMode });
                this._drawingModeChange(DrawingMode.Null);
            }
        };
        this.getGraphicsByAttrId = (attrId) => {
            let res = [];
            const mainGraphic = this.props.layersGroup.layerOnTheGround.graphics.toArray().filter(graphics => (graphics.attributes.jimuDrawId === attrId));
            if (mainGraphic.length > 0) {
                // 1. clamp ground mode
                res.push(mainGraphic[0]);
                res = res.concat(this.props.layersGroup.layerRelativeToGround.graphics.toArray().filter(graphics => (graphics.attributes.jimuDrawId === attrId)));
                return res;
            }
            else {
                // 2. on the ground mode
                return this.props.layersGroup.layerRelativeToGround.graphics.toArray().filter(graphics => (graphics.attributes.jimuDrawId === attrId));
            }
        };
        // redraw because jsapi NOT support change geometry
        // (if the graphic has already been added to the map, this change is not reflected in the map)
        this._removeGraphicsByAttrId = (rawGraphic) => {
            let duplicatedGraphics = this.props.layersGroup.layerRelativeToGround.graphics.toArray().filter(graphics => (graphics.attributes.jimuDrawId === rawGraphic.attributes.jimuDrawId));
            if (duplicatedGraphics.length > 0) {
                this.props.layersGroup.layerRelativeToGround.removeMany(duplicatedGraphics);
            }
            duplicatedGraphics = this.props.layersGroup.layerOnTheGround.graphics.toArray().filter(graphics => (graphics.attributes.jimuDrawId === rawGraphic.attributes.jimuDrawId));
            if (duplicatedGraphics.length > 0) {
                this.props.layersGroup.layerOnTheGround.removeMany(duplicatedGraphics);
            }
        };
        this.setGeoZ = (graphic, alt) => {
            // let z = (graphic.geometry as _LineGeometry3DLike).z;
            // if (false === graphic.geometry.hasZ) {
            //   z = 0;
            // }
            graphic.geometry.z = alt; // z + alt;
        };
        // update for JimuDraw: 10.2
        this._updateIds = (graphic) => {
            var _a, _b;
            if ((typeof ((_a = graphic.attributes) === null || _a === void 0 ? void 0 : _a.id) !== 'undefined') && (typeof graphic.attributes.jimuDrawId === 'undefined')) { // records before 10.1
                graphic.attributes.jimuDrawId = (_b = graphic.attributes) === null || _b === void 0 ? void 0 : _b.id; // finally use jimuDrawId
            }
            return graphic;
        };
        // point
        this.doDrawPoint = (graphic) => {
            const copyedGraphic = graphic.clone();
            this._removeGraphicsByAttrId(graphic);
            this._updateIds(copyedGraphic);
            copyedGraphic.layer = this.props.layersGroup.layerRelativeToGround;
            this.props.layersGroup.layerRelativeToGround.addMany([copyedGraphic]);
            return [copyedGraphic];
        };
        // line
        this.doDrawLine = (graphic) => {
            const copyedLineGraphic = graphic.clone();
            this._removeGraphicsByAttrId(graphic);
            this._updateIds(copyedLineGraphic);
            // 1.line
            copyedLineGraphic.layer = this.props.layersGroup.layerOnTheGround;
            this.props.layersGroup.layerOnTheGround.addMany([copyedLineGraphic]);
            // 2.start/end point
            const startEndPoints = this.genStartEndPoint(copyedLineGraphic);
            this.props.layersGroup.layerRelativeToGround.addMany(startEndPoints);
            let res = [];
            res.push(copyedLineGraphic);
            res = res.concat(startEndPoints);
            return res;
        };
        this.genStartEndPoint = (graphic) => {
            const path = graphic.geometry.paths[0];
            const startPt = this.genExtraPoint(path[0], graphic, this.materials.startPtMarker);
            const endPt = this.genExtraPoint(path[path.length - 1], graphic, this.materials.endPtMarker);
            return [startPt, endPt];
        };
        this.genExtraPoint = (p, graphic, symbol) => {
            let pt = p;
            if (this.sceneView.viewingMode === 'local') {
                pt = new this.Point({ x: pt[0], y: pt[1], z: 0 /* pt[2] */, spatialReference: this.sceneView.spatialReference }); // z=0 means on the ground: #6433
            }
            else {
                // pt = utils._xyToLngLat(pt[0], pt[1]);
                pt = this.webMercatorUtils.xyToLngLat(pt[0], pt[1]);
                pt = new this.Point({ x: pt[0], y: pt[1], z: pt[2] });
                // pt = this.queryGeometryElevInfo(pt);
            }
            pt = new this.Graphic({
                geometry: pt,
                symbol: symbol,
                layer: this.props.layersGroup.layerRelativeToGround,
                attributes: {
                    jimuDrawId: graphic.attributes.jimuDrawId // same jimuDrawId as graphic
                }
            });
            return pt;
        };
        // updateLine altitude
        this.updateLineByAltitude = (graphic, alt) => {
            var _a;
            const isClampGroundMode = (alt === 0);
            const graphics = this.getGraphicsByAttrId(graphic.attributes.jimuDrawId);
            const lineGraphic = graphics[0].clone();
            const startPtGraphic = graphics[1].clone();
            const endPtGraphic = graphics[2].clone();
            // set layer prop
            // lineGraphic.layer = graphics[0].layer
            // startPtGraphic.layer = graphics[0].layer
            // endPtGraphic.layer = graphics[0].layer
            // 0. remove
            this._removeGraphicsByAttrId(lineGraphic);
            // 1. main line
            if (isClampGroundMode) {
                lineGraphic.layer = this.props.layersGroup.layerOnTheGround;
                this.props.layersGroup.layerOnTheGround.addMany([lineGraphic]);
            }
            else {
                lineGraphic.layer = this.props.layersGroup.layerRelativeToGround;
                const lineGeometry = lineGraphic.geometry;
                lineGeometry.hasZ = true;
                if (utils.isDefined((_a = lineGeometry.paths) === null || _a === void 0 ? void 0 : _a.length)) {
                    lineGeometry.paths.forEach((path) => {
                        path.forEach((data) => {
                            data[2] = alt; // for relative-to-ground mode
                            // p[2] = p[2] + alt;
                        });
                    });
                    // update wall, graphics-info.updateWallSymbolByAlt() ,#6159
                    this.props.layersGroup.layerRelativeToGround.addMany([lineGraphic]);
                }
            }
            // 2. start/end points
            startPtGraphic.layer = this.props.layersGroup.layerRelativeToGround;
            endPtGraphic.layer = this.props.layersGroup.layerRelativeToGround;
            this.setGeoZ(startPtGraphic, alt);
            this.setGeoZ(endPtGraphic, alt);
            this.props.layersGroup.layerRelativeToGround.addMany([startPtGraphic, endPtGraphic]);
            return [lineGraphic, startPtGraphic, endPtGraphic];
        };
        // for trigger
        this.startDrawing = (mode) => {
            var _a, _b, _c, _d;
            if (typeof ((_a = this.jimuDrawToolsRef) === null || _a === void 0 ? void 0 : _a.sketch.cancel) === 'function') {
                (_b = this.jimuDrawToolsRef) === null || _b === void 0 ? void 0 : _b.sketch.cancel();
            }
            if (DrawingMode.Point === mode) {
                this.jimuDrawToolsRef.sketch.viewModel.pointSymbol = this.defaultSymbols.getDefaultPointSymbol([54, 213, 22] /* { color: '#36D516', vOffset: 5 } */);
                (_c = this.jimuDrawToolsRef) === null || _c === void 0 ? void 0 : _c.sketch.create(mode);
            }
            if (DrawingMode.Line === mode) {
                this.jimuDrawToolsRef.sketch.viewModel.polylineSymbol = this.defaultSymbols.getDefaultLineSymbol([13, 137, 255]);
                (_d = this.jimuDrawToolsRef) === null || _d === void 0 ? void 0 : _d.sketch.create(mode);
            }
        };
        this.cancelDrawing = () => {
            var _a, _b, _c;
            this.handleDrawCancel();
            if (typeof ((_a = this.jimuDrawToolsRef) === null || _a === void 0 ? void 0 : _a.sketch.cancel) === 'function' && utils.isDefined((_b = this.jimuDrawToolsRef) === null || _b === void 0 ? void 0 : _b.sketch.viewModel)) {
                (_c = this.jimuDrawToolsRef) === null || _c === void 0 ? void 0 : _c.sketch.cancel();
            }
        };
        // for cb
        this.createOrUpdateGraphic = (graphic, settingState, isPicked) => {
            var _a, _b;
            if (!graphic.geometry.paths) {
                graphic.symbol = this.materials.startPtMarker.toJSON();
            }
            else {
                graphic.symbol = this.materials.lineSymbol.toJSON();
            }
            const _graphic = (typeof graphic.clone === 'function') ? graphic.clone() : this.Graphic.fromJSON(graphic);
            if (_graphic.geometry.type === 'point') {
                return this.doDrawPoint(_graphic); // only one point
            }
            else if (_graphic.geometry.type === 'polyline') {
                // line
                if (isPicked) {
                    if (((_a = _graphic.layer) === null || _a === void 0 ? void 0 : _a.id) !== this.props.layersGroup.layerRelativeToGround.id || ((_b = _graphic.layer) === null || _b === void 0 ? void 0 : _b.id) !== this.props.layersGroup.layerOnTheGround.id) { // for others elevationInfo
                        _graphic.geometry = utils.queryGeometryElevInfo(_graphic.geometry, this.sceneView);
                    }
                }
                let res = this.doDrawLine(_graphic);
                if (utils.isDefined(settingState === null || settingState === void 0 ? void 0 : settingState.fixAltitude) && !isNaN(settingState === null || settingState === void 0 ? void 0 : settingState.fixAltitude)) {
                    res = this.updateLineByAltitude(_graphic, settingState === null || settingState === void 0 ? void 0 : settingState.fixAltitude);
                }
                return res;
            }
        };
        this.removeGraphics = (graphics) => {
            if (utils.isDefined(graphics)) {
                this.props.layersGroup.layerRelativeToGround.removeMany(graphics);
                this.props.layersGroup.layerOnTheGround.removeMany(graphics);
            }
        };
        this.removeAll = () => {
            var _a, _b;
            // console.log('draw-tools removeAll()')
            (_a = this.props.layersGroup.layerRelativeToGround) === null || _a === void 0 ? void 0 : _a.removeAll();
            (_b = this.props.layersGroup.layerOnTheGround) === null || _b === void 0 ? void 0 : _b.removeAll();
        };
        // for picked line
        this.drawPickedLineStartEndPoints = (graphic) => {
            return this.doDrawLine(graphic);
        };
        this.removePickedLineStartEndPoints = (graphic) => {
            this._removeGraphicsByAttrId(graphic);
        };
        this.state = {
            apiLoaded: false
        };
        this.drawingMode = DrawingMode.Null;
    }
    componentDidMount() {
        var _a;
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules([
                'esri/Graphic',
                'esri/geometry/Geometry',
                'esri/geometry/Point',
                'esri/geometry/support/webMercatorUtils'
                // 'esri/symbols/support/jsonUtils'
            ]).then((modules) => __awaiter(this, void 0, void 0, function* () {
                [this.Graphic, this.Geometry, this.Point, this.webMercatorUtils] = modules;
                this.defaultSymbols = yield new DefaultSymbols().setup();
                this.materials = {
                    markerColor: [13, 137, 255],
                    markerSize: 10,
                    outlineColor: '[128, 128, 128, 0.8]',
                    startPtMarker: this.defaultSymbols.getDefaultPointSymbol([54, 213, 22] /* { color: [54,213,22], vOffset: 10 } */),
                    endPtMarker: this.defaultSymbols.getDefaultPointSymbol([255, 65, 89] /* { color: [255,65,89], vOffset: 10 } */),
                    lineColor: [13, 137, 255, 0.5],
                    lineSymbol: this.defaultSymbols.getDefaultLineSymbol([13, 137, 255])
                };
                this.setState({ apiLoaded: true });
            }));
        }
        this.sceneView = (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view; // 3d scene
    }
    componentDidUpdate(prevProps, prevState) {
        var _a;
        if (this.props.jimuMapView !== prevProps.jimuMapView) {
            this.removeAll();
            this.sceneView = (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view;
        }
    }
    render() {
        return this.state.apiLoaded && this.props.jimuMapView &&
            this.props.layersGroup.layerOnTheGround && this.props.layersGroup.layerRelativeToGround &&
            jsx("div", { style: { display: 'none' } },
                jsx(JimuDraw, { jimuMapView: this.props.jimuMapView, onJimuDrawCreated: this.handleDrawToolCreated, onToolsActived: this.handleDrawToolsActived, onDrawingStarted: this.handleDrawStart, onDrawingFinished: this.handleDrawEnd, onDrawingCanceled: this.handleDrawCancel, onDrawingUpdated: this.handleDrawFinish, 
                    // visibleElements
                    // layer={this.props.layersGroup.layerRelativeToGround}
                    drawingOptions: {
                        creationMode: JimuDrawCreationMode.Update,
                        updateOnGraphicClick: false,
                        defaultCreateOptions: { hasZ: true },
                        defaultUpdateOptions: { enableZ: false },
                        drawingElevationMode3D: DrawingElevationMode3D.RelativeToGround
                    }, 
                    //isActive={false}
                    disableSymbolSelector: true, 
                    // default symbols for API-4.21
                    defaultSymbols: {
                        pointSymbol: this.materials.startPtMarker,
                        polylineSymbol: this.materials.lineSymbol
                    } }));
    }
}
//# sourceMappingURL=draw-helper.js.map