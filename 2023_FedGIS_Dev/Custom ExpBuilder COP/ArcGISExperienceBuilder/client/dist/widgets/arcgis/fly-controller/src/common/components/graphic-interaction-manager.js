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
import { React, jsx, css } from 'jimu-core';
import { Button } from 'jimu-ui';
import DrawLayersGroup from './helpers/draw-layers-group';
import DrawHelper from './helpers/draw-helper';
import PickHelper from './helpers/pick-helper';
import HighlightHelper from './helpers/highlight-helper';
import PopupHelper from './helpers/popup-helper';
import { FlyItemMode } from '../../config';
import SkeletonBtn from './loadings/skeleton-btn';
import { isDefined } from '../utils/utils';
import nls from '../../runtime/translations/default';
import { GraphicsInfo } from '../constraints';
// resources
import { PinEsriOutlined } from 'jimu-icons/outlined/gis/pin-esri';
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline';
import { ClearOutlined } from 'jimu-icons/outlined/editor/clear';
export var DrawingMode;
(function (DrawingMode) {
    DrawingMode["Null"] = "null";
    DrawingMode["Point"] = "point";
    DrawingMode["Line"] = "polyline";
})(DrawingMode || (DrawingMode = {})); // null means not in drawing
export var ShowItem;
(function (ShowItem) {
    ShowItem["Point"] = "point";
    ShowItem["Line"] = "polyline";
    ShowItem["Pick"] = "pick";
    ShowItem["Clear"] = "clear";
})(ShowItem || (ShowItem = {}));
export default class GraphicInteractionManager extends React.PureComponent {
    constructor(props) {
        super(props);
        // show items
        this._isInCludeShowItem = (item) => {
            return this.props.showItems.includes(item);
        };
        // 1. Draw
        this.handleDrawHelperCreated = (drawHelperRef) => {
            this.drawHelperRef = drawHelperRef;
            this.setState({ isDrawHelperLoaded: true });
            this.props.onRef(this);
        };
        this.handleDrawingModeChanged = (drawingMode) => {
            if (DrawingMode.Null !== drawingMode) {
                this.setState({ isPicking: false });
            }
            this.setState({ drawingMode: drawingMode });
            if (typeof this.props.onDrawingModeChanged === 'function') {
                this.props.onDrawingModeChanged(drawingMode);
            }
        };
        this.getDrawBtnContent = () => {
            const isShowPointBtn = this._isInCludeShowItem(ShowItem.Point);
            const isShowLineBtn = this._isInCludeShowItem(ShowItem.Line);
            const isDisable = this.props.isDisabled ? true : (this.props.isPlaying || !this.state.isDrawHelperLoaded);
            const pointTips = this.props.intl.formatMessage({ id: 'triggerDrawPoint', defaultMessage: nls.triggerDrawPoint });
            const lineTips = this.props.intl.formatMessage({ id: 'triggerDrawPath', defaultMessage: nls.triggerDrawPath });
            const flyStyle = this.props.flyStyle;
            return (jsx(React.Fragment, null,
                (isShowPointBtn && (flyStyle === FlyItemMode.Rotate || flyStyle === null)) &&
                    jsx(Button, { icon: true, active: DrawingMode.Point === this.state.drawingMode, className: 'oper-btns btns draw-btn', type: 'tertiary', css: this.getBtnStyleForBuilder(), onClick: () => this.onDrawBtnClick(DrawingMode.Point, { isTriggerCancel: true }), disabled: isDisable, title: pointTips },
                        jsx(PinEsriOutlined, null)),
                (isShowLineBtn && (flyStyle === FlyItemMode.Path || flyStyle === null)) &&
                    jsx(Button, { icon: true, active: DrawingMode.Line === this.state.drawingMode, className: 'oper-btns btns draw-btn', type: 'tertiary', css: this.getBtnStyleForBuilder(), onClick: () => this.onDrawBtnClick(DrawingMode.Line, { isTriggerCancel: true }), disabled: isDisable, title: lineTips },
                        jsx(PolylineOutlined, null))));
        };
        this.onDrawBtnClick = (mode, opts) => {
            var _a, _b;
            if (opts === null || opts === void 0 ? void 0 : opts.isTriggerCancel) { // for ,#6554
                (_a = this.drawHelperRef) === null || _a === void 0 ? void 0 : _a.cancelDrawing();
            }
            const stateMode = this.state.drawingMode;
            if ((mode !== stateMode) && (DrawingMode.Point === mode || DrawingMode.Line === mode)) {
                (_b = this.drawHelperRef) === null || _b === void 0 ? void 0 : _b.startDrawing(mode);
            }
        };
        this.handleDrawStart = () => {
            this.beforInteract();
        };
        this.handleDrawEnd = ( /* drawRes: DrawRes */) => {
        };
        this.handleDrawFinish = (drawRes) => {
            var _a;
            const _graphics = drawRes.graphicsInfo.getGraphics();
            if (this.state.selectedPickingGraphics !== null) {
                (_a = this.drawHelperRef) === null || _a === void 0 ? void 0 : _a.removePickedLineStartEndPoints(this.state.selectedPickingGraphics[0]);
            }
            this.props.onDrawFinish(drawRes, false);
            this.highlightGraphics(_graphics);
            this.focusGraphics(_graphics);
            // this.focusAndHighlightGraphic(drawRes.graphicsInfo.graphics);
            this.afterInteract();
        };
        this.handleDrawCancel = () => {
            this.afterInteract();
            if (typeof this.props.onDrawCancel === 'function') {
                this.props.onDrawCancel();
            }
        };
        // 2. Pick
        this.getPickBtnContent = () => {
            return (jsx(PickHelper, { jimuMapView: this.props.jimuMapView, intl: this.props.intl, isPlaying: this.props.isPlaying, 
                // draw
                isDrawHelperLoaded: this.state.isDrawHelperLoaded, drawingMode: this.state.drawingMode, 
                // pick
                isPicking: this.state.isPicking, onPicked: this.handlePicked, onPickingStateCahnged: this.handlePickingStateCahnged, 
                // hover
                onHoverPicking: this.handleHoverPicking, hoveredGraphic: this.state.hoveredGraphic }));
        };
        // pick-helper cb
        this.handleHoverPicking = (graphics) => {
            this.setState({ hoverPickingGraphics: graphics });
        };
        this.handlePickingStateCahnged = (isPicking) => {
            if (isPicking) {
                this.drawHelperRef.cancelDrawing();
            }
            else if (!isPicking) {
                this.setState({ hoverPickingGraphics: null }); // clear hoverPicking highlight
            }
            this.setState({ isPicking: isPicking });
        };
        this.handlePicked = (res) => {
            if (!this.validPickingByType(res)) {
                return;
            }
            this.clearAll();
            let mainGraphics = res.graphicsInfo.getGraphics();
            const pickedGraphic = mainGraphics[0];
            setTimeout(() => {
                if (pickedGraphic.geometry.type === 'polyline') {
                    const graphics = this.drawHelperRef.drawPickedLineStartEndPoints(pickedGraphic);
                    mainGraphics = [pickedGraphic, graphics[1], graphics[2]];
                }
                this.highlightGraphics(mainGraphics); // only highlight&focus mainGraphic
                this.focusGraphics(mainGraphics);
                this.props.onPickHanlder(res);
            }, 10);
        };
        this.validPickingByType = (res) => {
            let isValid = false;
            if (this.props.flyStyle === FlyItemMode.Rotate && (res.pickMode === 'point')) {
                isValid = true;
            }
            else if (this.props.flyStyle === FlyItemMode.Path && (res.pickMode === 'polyline')) {
                isValid = true;
            }
            return isValid;
        };
        // 3. highlight
        this.highlight = (graphics) => {
            if (graphics === null) {
                this.clearHighlightGraphics();
            }
            else {
                // this.focusAndHighlightGraphic(graphics);
                this.highlightGraphics(graphics);
                this.focusGraphics(graphics);
            }
        };
        this.clearHighlightGraphics = () => {
            this.setState({ selectedPickingGraphics: null });
            this.setState({ hoverPickingGraphics: null });
        };
        this.highlightGraphics = (graphics) => {
            this.setState({ selectedPickingGraphics: graphics });
            // this.props.onFocusedGraphicChanged(mainGraphic);
        };
        // 4. clear
        this.getClearBtnContent = () => {
            const clearTips = this.props.intl.formatMessage({ id: 'triggerClear', defaultMessage: nls.triggerClear });
            const isDisable = this.props.isPlaying || (this.props.focusedGraphic === null);
            return (jsx(Button, { icon: true, onClick: this.handleClearBtnClick, disabled: isDisable, title: clearTips, className: 'btns clear-btn', type: 'tertiary' },
                jsx(ClearOutlined, null)));
        };
        // 5. focus for panel
        this.focusGraphics = (graphics) => {
            this.props.onFocusedGraphicChanged(null);
            const mainGraphic = (graphics === null) ? null : graphics[0]; // main graphics
            this.props.onFocusedGraphicChanged(mainGraphic);
        };
        // 6. popup
        this.handlePopupHelperCreated = (ref) => {
            this.popupHelperRef = ref;
        };
        // cache Popup&Highlight state
        this.beforInteract = () => {
            var _a, _b;
            (_a = this.popupHelperRef) === null || _a === void 0 ? void 0 : _a.cacheMapPopupHightlightState();
            (_b = this.popupHelperRef) === null || _b === void 0 ? void 0 : _b.disablePopupAndHighlight(); // disable map default HighLight&Popup
        };
        // restore Popup&Highlight state
        this.afterInteract = () => {
            setTimeout(() => {
                this.restoreMapPopupHightlightState();
            }, 10);
        };
        this.restoreMapPopupHightlightState = () => {
            var _a;
            (_a = this.popupHelperRef) === null || _a === void 0 ? void 0 : _a.restoreMapPopupHightlightState();
        };
        this.handleClearBtnClick = () => {
            this.clearAll();
            this.focusGraphics(null);
            this.props.onClearBtnClick();
        };
        this.clearAll = () => {
            var _a, _b;
            // highlight
            this.highlight(null);
            // this.focusGraphics(null);
            (_a = this.popupHelperRef) === null || _a === void 0 ? void 0 : _a.restoreMapPopupHightlightState();
            // draw
            (_b = this.drawHelperRef) === null || _b === void 0 ? void 0 : _b.removeAll();
        };
        // 5. live view
        // for ref cb
        this.onRenderStateChange = (opts) => {
            if (typeof (opts === null || opts === void 0 ? void 0 : opts.drawingMode) !== 'undefined') {
                this.handleDrawingModeChanged(opts.drawingMode);
                this.onDrawBtnClick(opts.drawingMode, { isTriggerCancel: false });
            }
            //eslint-disable-next-line
            if (typeof (opts === null || opts === void 0 ? void 0 : opts.isPicking) !== 'undefined') {
            }
        };
        // draw Graphics into map, return GraphicsInfo
        // 1. onDrawGraphics
        // 2. updateLineByAltitude
        this.drawOrUpdateGraphics = (recordConfig) => {
            var _a;
            const cachedGraphics = recordConfig.storedGraphicsInfo.rawData;
            const mainGraphic = cachedGraphics.graphics[0]; // main graphics
            const isPicked = cachedGraphics.isPicked;
            const settingState = (_a = recordConfig.controllerConfig) === null || _a === void 0 ? void 0 : _a.liveviewSettingState;
            let drawnGraphics;
            if (!isPicked) {
                // draw
                drawnGraphics = this.drawHelperRef.createOrUpdateGraphic(mainGraphic, settingState, isPicked);
            }
            else {
                // pick
                const pickedGraphic = mainGraphic;
                // line need redraw, point just highlight
                if (pickedGraphic.geometry.type === 'polyline' || isDefined(pickedGraphic.geometry.paths)) {
                    // picked line
                    drawnGraphics = this.drawHelperRef.createOrUpdateGraphic(pickedGraphic, settingState, isPicked);
                }
                else {
                    // picked point
                    drawnGraphics = cachedGraphics.graphics;
                }
            }
            return new GraphicsInfo({ graphics: drawnGraphics, isPicked: isPicked });
        };
        this.removeGraphics = (graphics) => {
            var _a;
            (_a = this.drawHelperRef) === null || _a === void 0 ? void 0 : _a.removeGraphics(graphics);
        };
        this.removeAllGraphics = () => {
            var _a;
            (_a = this.drawLayersGroup) === null || _a === void 0 ? void 0 : _a.removeAllGraphics();
        };
        // test query
        this.query = ( /* dsId:string, objId:string */) => {
            return null; // await this.queryHelper._testQuery()
        };
        this.state = {
            apiLoaded: false,
            layersGroup: {
                layerRelativeToGround: null,
                layerOnTheGround: null
            },
            isDrawHelperLoaded: false,
            drawingMode: DrawingMode.Null,
            isPicking: false,
            hoveredGraphic: null,
            hoverPickingGraphics: null,
            selectedPickingGraphics: null
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.apiLoaded) {
                this.drawLayersGroup = yield new DrawLayersGroup().setup(this.props.jimuMapView, this.props.widgetId);
                this.setState({ apiLoaded: true });
                this.setState({ layersGroup: this.drawLayersGroup.layersGroup });
            }
        });
    }
    componentWillUnmount() {
        this.clearAll();
        if (this.drawLayersGroup) {
            this.drawLayersGroup = null;
        }
        this.props.onRef(null);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.jimuMapView !== prevProps.jimuMapView) {
            this.setState({ hoverPickingGraphics: null });
            this.setState({ selectedPickingGraphics: null });
            // highlights not clear after 10.2:
            // so 1.remove highlights, 2.async reset layers
            setTimeout(() => {
                var _a, _b;
                (_a = this.drawLayersGroup) === null || _a === void 0 ? void 0 : _a.resetJimuMapView(this.props.jimuMapView);
                (_b = this.drawLayersGroup) === null || _b === void 0 ? void 0 : _b.resetGraphicsLayers();
                if (this.state.apiLoaded) {
                    this.setState({ layersGroup: this.drawLayersGroup.layersGroup });
                }
            }, 20);
        }
    }
    render() {
        let content = null;
        content = (jsx("div", null,
            jsx(React.Fragment, null,
                (!this.state.apiLoaded || !this.state.isDrawHelperLoaded) &&
                    jsx(React.Fragment, null,
                        this._isInCludeShowItem(ShowItem.Point) && jsx(SkeletonBtn, { theme: this.props.theme, className: 'draw-btn' }),
                        this._isInCludeShowItem(ShowItem.Pick) && jsx(SkeletonBtn, { theme: this.props.theme, className: 'pick-btn' }),
                        this._isInCludeShowItem(ShowItem.Line) && jsx(SkeletonBtn, { theme: this.props.theme, className: 'clear-btn' })),
                (this.state.apiLoaded && this.state.isDrawHelperLoaded) &&
                    jsx(React.Fragment, null,
                        this.getDrawBtnContent(),
                        this._isInCludeShowItem(ShowItem.Pick) && this.getPickBtnContent(),
                        this._isInCludeShowItem(ShowItem.Clear) && this.getClearBtnContent()),
                jsx(DrawHelper, { jimuMapView: this.props.jimuMapView, onDrawHelperCreated: this.handleDrawHelperCreated, onDrawingModeChanged: this.handleDrawingModeChanged, onDrawStart: this.handleDrawStart, onDrawEnd: this.handleDrawEnd, onDrawFinish: this.handleDrawFinish, onDrawCancel: this.handleDrawCancel, 
                    //
                    layersGroup: this.state.layersGroup }),
                jsx(HighlightHelper, { jimuMapView: this.props.jimuMapView, flyStyle: this.props.flyStyle, hoverPickingGraphics: this.state.hoverPickingGraphics, selectedPickingGraphics: this.state.selectedPickingGraphics }),
                jsx(PopupHelper, { jimuMapView: this.props.jimuMapView, onPopupHelperCreated: this.handlePopupHelperCreated }))));
        return content;
    }
    getBtnStyleForBuilder() {
        var _a, _b, _c;
        const arcgisVars = (_a = this.props.theme) === null || _a === void 0 ? void 0 : _a.arcgis;
        const arcgisButtonVars = (_b = arcgisVars === null || arcgisVars === void 0 ? void 0 : arcgisVars.components) === null || _b === void 0 ? void 0 : _b.button;
        const { default: buttonDefaultVariant } = (_c = arcgisButtonVars === null || arcgisButtonVars === void 0 ? void 0 : arcgisButtonVars.variants) !== null && _c !== void 0 ? _c : {};
        const variables = buttonDefaultVariant === null || buttonDefaultVariant === void 0 ? void 0 : buttonDefaultVariant.active;
        return css `
      &.btns.active {
        color: ${variables.color} !important;
        background-color: ${variables.bg} !important;
        border-radius: ${variables.borderRadius} !important;
        box-shadow: ${variables.shadow} !important;
      }
    `;
    }
}
//# sourceMappingURL=graphic-interaction-manager.js.map