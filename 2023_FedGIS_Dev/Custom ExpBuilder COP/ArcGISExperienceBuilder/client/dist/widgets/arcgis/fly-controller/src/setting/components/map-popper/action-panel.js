// 1.handle draw
// 2.build tmpRecord
// 3.draw back all graphics in Records
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
import { React, jsx, lodash, uuidv1 } from 'jimu-core';
import { RotateDirection, PathDirection, PathStyle } from '../../../config';
import { NewFeatureMode } from '../../setting';
import { ControllerMode } from '../../../common/fly-facade/controllers/base-fly-controller';
import { isDefined } from '../../../common/utils/utils';
import * as utils from '../../../common/utils/utils';
import nls from '../../translations/default';
// graphics
import GraphicInteractionManager, { DrawingMode, ShowItem } from '../../../common/components/graphic-interaction-manager';
export default class ActionPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this._isRecordsIdEqual = (propsRecords, prevPropsRecords) => {
            const propsRecordsIds = propsRecords.records.map((record) => {
                return record.idx;
            });
            const prevPropsRecordsIds = prevPropsRecords.records.map((record) => {
                return record.idx;
            });
            return lodash.isDeepEqual(propsRecordsIds, prevPropsRecordsIds);
        };
        // draw graphics back
        this._redrawAllRecordGraphics = (routeConfig) => {
            if (isDefined(this.graphicInteractionManagerRef)) {
                // console.log('_redrawAllRecordGraphics' + routeConfig);
                this.graphicInteractionManagerRef.removeAllGraphics();
                routeConfig.records.forEach((record) => {
                    // draw back graphics in this mapView
                    if (record.mapViewId === this.props.getPopperJimuMapId()) {
                        // TODO update 'graphicsInfo' into flyManager const graphicsInfo =
                        this.graphicInteractionManagerRef.drawOrUpdateGraphics(record /* record.state */);
                    }
                });
            }
        };
        this.handleGraphicsUpdate = (res) => __awaiter(this, void 0, void 0, function* () {
            let record;
            const uuid = uuidv1(); // set uuid
            const { graphicsInfo, cameraInfo, drawingMode } = res;
            const options = this.getDefaultOptions(drawingMode);
            if (res.drawingMode === DrawingMode.Point) {
                // 1.Point
                // const point = (graphics[0].geometry as __esri.Point)
                record = yield this.addPointRecord(uuid, options, graphicsInfo, cameraInfo);
            }
            else if (res.drawingMode === DrawingMode.Line) {
                // 2. Line
                // const line = graphics[0].geometry
                record = yield this.addPathRecord(uuid, options, graphicsInfo, cameraInfo);
            }
            this.props.onNewFeatureModeChange(NewFeatureMode.Empty);
            if (typeof this.props.onDrawFinish === 'function') {
                this.props.onDrawFinish(record);
            }
        });
        this.handleDrawCancel = () => {
            this.props.onNewFeatureModeChange(NewFeatureMode.Empty);
        };
        this.getDefaultOptions = (drawingMode) => {
            let options;
            switch (drawingMode) {
                case DrawingMode.Point: {
                    options = {
                        direction: RotateDirection.CCW
                    };
                    break;
                }
                case DrawingMode.Line: {
                    options = {
                        direction: PathDirection.Forward,
                        style: PathStyle.Smoothed
                    };
                    break;
                }
                default: {
                    console.error('action-panel::getDefaultOptions');
                }
            }
            return options;
        };
        this.addPointRecord = (uuid, options, graphicsInfo, cameraInfo) => __awaiter(this, void 0, void 0, function* () {
            const autoNamingTmpl = this.props.intl.formatMessage({ id: 'pointStyle', defaultMessage: nls.pointStyle });
            const name = utils.getIncreasedNameByConfig(this.props.activedRouteConfig.records, autoNamingTmpl);
            let rotateRecord = this.props.buildTemporaryRecordConfig(graphicsInfo, cameraInfo, this.props.jimuMapView);
            rotateRecord;
            rotateRecord = Object.assign(rotateRecord, {
                idx: uuid,
                type: ControllerMode.Rotate,
                displayName: name,
                duration: 10,
                startDelay: 0,
                endDelay: 0,
                angle: 360,
                // controllerConfig:
                direction: options.direction,
                mapViewId: this.props.getPopperJimuMapId()
            });
            return yield this.props.buildDefaultRecord(rotateRecord, graphicsInfo);
        });
        this.addPathRecord = (uuid, options, graphicsInfo, cameraInfo) => __awaiter(this, void 0, void 0, function* () {
            const autoNamingTmpl = this.props.intl.formatMessage({ id: 'pathStyle', defaultMessage: nls.pathStyle });
            const name = utils.getIncreasedNameByConfig(this.props.activedRouteConfig.records, autoNamingTmpl);
            let pathRecord = this.props.buildTemporaryRecordConfig(graphicsInfo, cameraInfo, this.props.jimuMapView);
            pathRecord;
            pathRecord = Object.assign(pathRecord, {
                idx: uuid,
                type: ControllerMode.Smoothed,
                displayName: name,
                // altitude: 100,
                duration: -1,
                startDelay: 0,
                endDelay: 0,
                direction: options.direction,
                mapViewId: this.props.getPopperJimuMapId()
            });
            return yield this.props.buildDefaultRecord(pathRecord, graphicsInfo);
        });
        // 2.2 picking
        this.handlePickHanlder = (res) => {
            this.handleGraphicsUpdate(res);
        };
        this.handleRefGraphicInteractionManager = (ref) => {
            this.graphicInteractionManagerRef = ref;
            if (ref !== null) {
                this.setState({ isLoaded: true });
            }
            else {
                this.setState({ isLoaded: false });
            }
            this._redrawAllRecordGraphics(this.props.activedRouteConfig); // init
            this.props.onRefGraphicInteractionManager(ref);
        };
        this.handleFocusedGraphicChanged = (graphic) => {
            // console.log("setting onFocusedGraphicChanged()" + graphic)
        };
        this.handleDrawingModeChanged = (drawingMode) => {
            // console.log("onDrawingModeChanged==> " + drawingMode);
            this.props.stopFly();
        };
        this.state = {
            isLoaded: false
        };
        this._init(this.props.jimuMapView);
    }
    _init(jimuMapView) {
        if (isDefined(jimuMapView)) {
            this.jimuMapView = jimuMapView;
            this._redrawAllRecordGraphics(this.props.activedRouteConfig); // init drawn
        }
    }
    // componentDidMount() {
    // this.props.onRef(this);
    // this._redrawAllRecordGraphics(this.props.activedRouteConfig);
    // }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b, _c;
        if (this.props.jimuMapView !== prevProps.jimuMapView) {
            this._init(this.props.jimuMapView);
        }
        // update NewFeatureMode from L2
        if ((this.props.newFeatureMode !== prevProps.newFeatureMode)) {
            if (this.props.newFeatureMode === NewFeatureMode.Point) {
                (_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.onRenderStateChange({ drawingMode: DrawingMode.Point });
            }
            else if (this.props.newFeatureMode === NewFeatureMode.Path) {
                (_b = this.graphicInteractionManagerRef) === null || _b === void 0 ? void 0 : _b.onRenderStateChange({ drawingMode: DrawingMode.Line });
            }
            else if (this.props.newFeatureMode === NewFeatureMode.Empty) {
                (_c = this.graphicInteractionManagerRef) === null || _c === void 0 ? void 0 : _c.onRenderStateChange({ drawingMode: DrawingMode.Null });
            }
        }
        // update draw all RecordConfig Graphics
        if (isDefined(this.props.jimuMapView) && !this._isRecordsIdEqual(this.props.activedRouteConfig, prevProps.activedRouteConfig)) {
            this._redrawAllRecordGraphics(this.props.activedRouteConfig);
        }
    }
    componentWillUnmount() {
        this.props.onRefGraphicInteractionManager(null);
    }
    render() {
        return (jsx("div", { className: 'd-flex align-items-center justify-content-center' }, isDefined(this.props.jimuMapView) &&
            jsx(GraphicInteractionManager, { onRef: this.handleRefGraphicInteractionManager, widgetId: this.props.specifiedJimuMapId, intl: this.props.intl, theme: this.props.theme, jimuMapView: this.props.jimuMapView, showItems: [ShowItem.Point, ShowItem.Line], isDisabled: this.props.isDisableDraw || !this.props.isTerrainLoaded, 
                //
                flyStyle: null, isPlaying: false, 
                //
                onFocusedGraphicChanged: this.handleFocusedGraphicChanged, onDrawingModeChanged: this.handleDrawingModeChanged, onDrawFinish: this.handleGraphicsUpdate, onDrawCancel: this.handleDrawCancel })));
    }
}
//# sourceMappingURL=action-panel.js.map