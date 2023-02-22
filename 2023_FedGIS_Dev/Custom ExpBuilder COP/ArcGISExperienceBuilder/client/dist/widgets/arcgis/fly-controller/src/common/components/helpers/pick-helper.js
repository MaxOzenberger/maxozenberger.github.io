/** @jsx jsx */
import { React, jsx, utils as jimuUtils } from 'jimu-core';
import * as utils from '../../utils/utils';
import { Button } from 'jimu-ui';
import { GraphicsInfo } from '../../constraints';
import nls from '../../../runtime/translations/default';
// resources
import { SelectClickOutlined } from 'jimu-icons/outlined/editor/select-click';
export default class PickHelper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onPickBtnClick = () => {
            this.props.onPickingStateCahnged(!this.props.isPicking);
        };
        // insert attributes.jimuDrawId like jimuDraw
        this.insertAttrId = (graphic) => {
            if (utils.isDefined(graphic)) {
                if (!utils.isDefined(graphic.attributes)) {
                    graphic.attributes = {};
                }
                if (utils.isDefined(graphic.attributes.id) && !utils.isDefined(graphic.attributes.jimuDrawId)) {
                    graphic.attributes.jimuDrawId = graphic.attributes.id; // for 10.1 update: have attributes.id & no attributes.jimuDrawId
                }
                else if (!utils.isDefined(graphic.attributes.jimuDrawId)) {
                    graphic.attributes.jimuDrawId = jimuUtils.getUUID();
                }
            }
            return graphic;
        };
        // events
        this.pointerMoveHandler = (event) => {
            var _a;
            if (this.props.isPicking) {
                (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view.hitTest(event).then((response) => {
                    const graphicResults = response.results.filter(r => r.type === 'graphic');
                    if ((graphicResults === null || graphicResults === void 0 ? void 0 : graphicResults.length) > 0) {
                        const graphic = graphicResults[0].graphic;
                        this.props.onHoverPicking([graphic]);
                    }
                });
            }
        };
        this.pointerClickHandler = (event) => {
            var _a;
            if (this.props.isPicking) {
                (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view.hitTest(event).then((res) => this.clickGraphicsByPick(res, event));
            }
        };
        this.clickGraphicsByPick = (response, event) => {
            var _a, _b;
            this.props.onPickingStateCahnged(false); // stop hover picking
            const initCameraInfo = ((_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view).camera.clone().toJSON();
            const results = response.results;
            if ((results === null || results === void 0 ? void 0 : results.length) > 0) {
                event.stopPropagation();
                const graphicResults = results.filter(r => r.type === 'graphic');
                let graphic = graphicResults[0].graphic;
                graphic = this.insertAttrId(graphic);
                const geometry = graphic.geometry;
                if (!geometry) {
                    return;
                }
                if (geometry.type === 'polyline') {
                    // if (jimuUtils.isTouchDevice()) {
                    this.pickAndClickLine(graphic, initCameraInfo); // mobile
                    // } else if (utils.isPolylineEquals((geometry as __esri.Polyline), (this.props.hoveredGraphic?.geometry as __esri.Polyline))) {
                    //  this.pickAndClickLine(graphic, initCameraInfo)// desktop
                    // }
                }
                else if (geometry.type === 'point') {
                    // const lastHit = utils.getHitPointOnTheGround(response);
                    let hitPointWithZ;
                    if (!geometry.hasZ) {
                        hitPointWithZ = utils.queryGeometryElevInfo(geometry, (_b = this.props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view);
                    }
                    // if (jimuUtils.isTouchDevice()) {
                    this.pickAndClickPoint(graphic, initCameraInfo, hitPointWithZ); // mobile
                    // } else if ((geometry as __esri.Point).equals(this.props.hoveredGraphic?.geometry as __esri.Point)) {
                    //  this.pickAndClickPoint(graphic, initCameraInfo, hitPointWithZ)// desktop
                    // }
                }
            }
        };
        this.pickAndClickPoint = (graphic, cameraInfo, hitPointWithZ) => {
            const graphicsInfo = new GraphicsInfo({ graphics: [graphic], isPicked: true });
            this.props.onPicked({ graphicsInfo: graphicsInfo, cameraInfo: cameraInfo, hitPointWithZ: hitPointWithZ, pickMode: 'point' });
        };
        this.pickAndClickLine = (graphic, cameraInfo) => {
            const graphicsInfo = new GraphicsInfo({ graphics: [graphic], isPicked: true });
            this.props.onPicked({ graphicsInfo: graphicsInfo, cameraInfo: cameraInfo, hitPointWithZ: null, pickMode: 'polyline' });
        };
        this.state = {
            isPicking: false
        };
        // events
        this._clearEvents();
        this._resetEvents();
    }
    componentWillUnmount() {
        this._clearEvents();
    }
    _clearEvents() {
        if (utils.isDefined(this.pointerMoveEvent)) {
            this.pointerMoveEvent.remove();
            this.pointerMoveEvent = null;
        }
        if (utils.isDefined(this.pointerDownEvent)) {
            this.pointerDownEvent.remove();
            this.pointerDownEvent = null;
        }
    }
    _resetEvents() {
        var _a, _b;
        this.pointerMoveEvent = (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view.on('pointer-move', this.pointerMoveHandler);
        this.pointerDownEvent = (_b = this.props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view.on('pointer-down', this.pointerClickHandler);
    }
    componentDidUpdate(prevProps /*, prevState: States */) {
        if (this.props.jimuMapView !== prevProps.jimuMapView) {
            this._clearEvents();
            this._resetEvents();
        }
    }
    render() {
        const isDisable = (!this.props.isDrawHelperLoaded) || this.props.isPlaying; // || (DrawingMode.Null !== this.props.drawingMode);
        const pickTips = this.props.intl.formatMessage({ id: 'triggerSelectFeature', defaultMessage: nls.triggerSelectFeature });
        return (jsx(Button, { icon: true, onClick: (evt) => this.onPickBtnClick(), active: this.props.isPicking, disabled: isDisable, title: pickTips, className: 'btns pick-btn', type: 'tertiary' },
            jsx(SelectClickOutlined, null)));
    }
}
//# sourceMappingURL=pick-helper.js.map