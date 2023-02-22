import { React } from 'jimu-core';
import { FlyItemMode } from '../../../config';
import * as utils from '../../utils/utils';
export default class HighlightHelper extends React.PureComponent {
    constructor(props) {
        super(props);
        this._resetHightlightCache = () => {
            this.highlightCache = {
                hover: {
                    graphic: null,
                    hanlder: null
                },
                selected: {
                    graphics: null,
                    hanlder: null
                }
            };
        };
        // hover select
        this.removeHoverHightlightCache = () => {
            if (utils.isDefined(this.highlightCache.hover.hanlder)) {
                this.highlightCache.hover.hanlder.remove();
            }
            this.highlightCache.hover.graphic = null;
            this.highlightCache.hover.hanlder = null;
        };
        this.cacheHoverHightlight = (hanlder, graphic) => {
            this.highlightCache.hover.graphic = graphic;
            this.highlightCache.hover.hanlder = hanlder;
        };
        // click select
        this.removeSelectedHightlightCache = () => {
            if (utils.isDefined(this.highlightCache.selected.hanlder)) {
                this.highlightCache.selected.hanlder.remove();
            }
            this.highlightCache.selected.graphics = null;
            this.highlightCache.selected.hanlder = null;
        };
        this.cacheSelectedHightlight = (hanlder, graphics) => {
            this.highlightCache.selected.graphics = graphics;
            this.highlightCache.selected.hanlder = hanlder;
        };
        this.highlightGraphicsByHover = (graphics) => {
            var _a, _b;
            const graphic = utils.isDefined(graphics) ? graphics[0] : null;
            if (graphic === null) {
                return;
            }
            const type = (_a = graphic === null || graphic === void 0 ? void 0 : graphic.geometry) === null || _a === void 0 ? void 0 : _a.type;
            if ((type === 'polyline' && (this.props.flyStyle === FlyItemMode.Path)) ||
                (type === 'point' && (this.props.flyStyle === FlyItemMode.Rotate))) {
                (_b = this.props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view.whenLayerView(graphic.layer).then((layerView) => {
                    const _layerView = layerView;
                    this.cacheHoverHightlight(_layerView.highlight(graphic), graphic);
                });
            }
        };
        this.highlightGraphicsBySelect = (graphics) => {
            var _a;
            const graphic = utils.isDefined(graphics) ? graphics[0] : null;
            if (graphic === null) {
                return;
            }
            (_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view.whenLayerView(graphic.layer).then((layerView) => {
                const _layerView = layerView;
                const hanlder = _layerView.highlight(graphic);
                this.cacheSelectedHightlight(hanlder, graphics);
            });
        };
        this.clear = () => {
            this.removeHoverHightlightCache();
            this.removeSelectedHightlightCache();
        };
        this._resetHightlightCache();
    }
    componentDidUpdate(prevProps) {
        if (this.props.hoverPickingGraphics !== prevProps.hoverPickingGraphics) {
            this.removeHoverHightlightCache();
            this.highlightGraphicsByHover(this.props.hoverPickingGraphics);
        }
        if (this.props.selectedPickingGraphics !== prevProps.selectedPickingGraphics) {
            this.removeSelectedHightlightCache();
            this.highlightGraphicsBySelect(this.props.selectedPickingGraphics);
        }
    }
    componentWillUnmount() {
        this.clear();
        this._resetHightlightCache();
    }
    render() {
        return null;
    }
}
//# sourceMappingURL=highlight-helper.js.map