/** @jsx jsx */
import { React, classNames, css, jsx, AppMode, appActions, Immutable, polished } from 'jimu-core';
import { Direction, PointStyle } from '../config';
import { getStrokeStyle, getPointStyle, getDividerLineStyle } from '../common/template-style';
export class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.editWidgetConfig = newConfig => {
            if (!window.jimuConfig.isInBuilder)
                return;
            const appConfigAction = this.props.builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            appConfigAction.editWidgetConfig(this.props.id, newConfig).exec();
        };
        this.getStyle = () => {
            return css `
      & {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: ${polished.rem(6)};
      }
      .divider-con {
        height: 100%;
        width: 100%;
      }
    `;
        };
        this.getDividerLinePositionStyle = (config) => {
            const { direction, pointEnd, pointStart, strokeStyle } = config;
            const isHorizontal = direction === Direction.Horizontal;
            const pointStartStyle = pointStart.pointStyle;
            const pointStartSize = pointStart.pointSize * this.getSize(strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.size);
            const pointEndStyle = pointEnd.pointStyle;
            const pointEndSize = pointEnd.pointSize * this.getSize(strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.size);
            const isPointStartEnable = pointStartStyle !== PointStyle.None;
            const isPointEndEnable = pointEndStyle !== PointStyle.None;
            return getDividerLineStyle(isHorizontal, isPointStartEnable, isPointEndEnable, pointStartSize, pointEndSize);
        };
        this.getSize = (size) => {
            const sizeNumber = size.split('px')[0];
            return Number(sizeNumber);
        };
        this.getDividerLineStyle = config => {
            const { direction } = config;
            const { size, color, type } = config.strokeStyle;
            return getStrokeStyle(size, color, direction)[type];
        };
        this.getPointStyle = (config, isPointStart = true) => {
            const { pointEnd, pointStart, strokeStyle, direction } = config;
            const strokeSize = Number(this.getSize(strokeStyle.size));
            const size = `${isPointStart
                ? pointStart.pointSize * strokeSize
                : pointEnd.pointSize * strokeSize}px`;
            const color = strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.color;
            const style = isPointStart ? pointStart.pointStyle : pointEnd.pointStyle;
            const pointStyle = getPointStyle(size, color, direction, isPointStart);
            return pointStyle[style];
        };
        this.onQuickStyleChange = (newConfig) => {
            var _a;
            const id = this.props.id;
            const builderSupportModules = this.props.builderSupportModules;
            const getAppConfigAction = (_a = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.jimuForBuilderLib) === null || _a === void 0 ? void 0 : _a.getAppConfigAction;
            if (getAppConfigAction) {
                getAppConfigAction()
                    .editWidgetProperty(id, 'config', newConfig)
                    .exec();
                // this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'showQuickStyle', false));
            }
        };
        this.toggleQuickStyle = (isOpen = false) => {
            this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'showQuickStyle', isOpen));
        };
        this.getQuickStyleComponent = () => {
            var _a, _b, _c;
            const { config, showQuickStyle, active, theme, onInitDragHandler, onInitResizeHandler } = this.props;
            const { direction, themeStyle } = config;
            const { isMount } = this.state;
            const QuickStyle = (_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.builderSupportModules) === null || _b === void 0 ? void 0 : _b.widgetModules) === null || _c === void 0 ? void 0 : _c.QuickStyle;
            return (!QuickStyle && isMount)
                ? null
                : (jsx(QuickStyle, { direction: direction, isOpen: showQuickStyle && active, theme: theme, selectedType: themeStyle === null || themeStyle === void 0 ? void 0 : themeStyle.quickStyleType, onChange: this.onQuickStyleChange, reference: this === null || this === void 0 ? void 0 : this.domNode, getDividerLineStyle: this.getDividerLineStyle, getDividerLinePositionStyle: this.getDividerLinePositionStyle, closeQuickStyle: this.toggleQuickStyle, getPointStyle: this.getPointStyle, onInitDragHandler: onInitDragHandler, onInitResizeHandler: onInitResizeHandler }));
        };
        this.state = {
            isMount: false
        };
    }
    componentDidMount() {
        const { active, hasEverMount, id } = this.props;
        const isShowQuickStyle = window.jimuConfig.isInBuilder && active && !hasEverMount;
        if (isShowQuickStyle) {
            this.toggleQuickStyle(true);
        }
        if (!this.props.hasEverMount) {
            this.props.dispatch(appActions.widgetStatePropChange(id, 'hasEverMount', true));
        }
        this.setState({
            isMount: true
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if ((this.props.appMode !== prevProps.appMode &&
            this.props.appMode === AppMode.Run) ||
            this.props.active !== prevProps.active) {
            this.toggleQuickStyle();
        }
    }
    render() {
        const { config, id } = this.props;
        const { direction, pointEnd, pointStart } = config;
        const classes = classNames('jimu-widget', 'widget-divider', 'position-relative', 'divider-widget-' + id);
        const dividerLineClassName = direction === Direction.Horizontal ? 'horizontal' : 'vertical';
        const dividerLineStyle = this.getDividerLineStyle(config);
        const dividerLinePositionStyle = this.getDividerLinePositionStyle(config);
        const pointStartStyle = this.getPointStyle(config, true);
        const pointEndStyle = this.getPointStyle(config, false);
        const dividerLineClasses = classNames('divider-line', 'position-absolute', dividerLineClassName, `point-start-${pointStart.pointStyle}`, `point-end-${pointEnd.pointStyle}`);
        return (jsx("div", { className: classes, css: this.getStyle(), ref: node => (this.domNode = node) },
            jsx("div", { className: 'position-relative divider-con' },
                jsx("div", { className: 'point-con' },
                    pointStart.pointStyle !== PointStyle.None && (jsx("span", { "data-testid": 'divider-point-start', className: 'point-start position-absolute', css: pointStartStyle })),
                    pointEnd.pointStyle !== PointStyle.None && (jsx("span", { "data-testid": 'divider-point-end', className: 'point-end position-absolute', css: pointEndStyle }))),
                jsx("div", { "data-testid": 'divider-line', className: dividerLineClasses, css: [dividerLineStyle, dividerLinePositionStyle] }),
                window.jimuConfig.isInBuilder && this.getQuickStyleComponent())));
    }
}
Widget.mapExtraStateProps = (state, props) => {
    var _a;
    let selected = false;
    const selection = state.appRuntimeInfo.selection;
    if (selection && state.appConfig.layouts[selection.layoutId]) {
        const layoutItem = state.appConfig.layouts[selection.layoutId].content[selection.layoutItemId];
        selected = layoutItem && layoutItem.widgetId === props.id;
    }
    const isInBuilder = state.appContext.isInBuilder;
    const active = isInBuilder && selected;
    const widgetState = state.widgetsState[props.id] || Immutable({});
    const showQuickStyle = !!widgetState.showQuickStyle;
    return {
        appMode: selection ? (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.appMode : null,
        active,
        showQuickStyle,
        hasEverMount: widgetState.hasEverMount
    };
};
export default Widget;
//# sourceMappingURL=widget.js.map