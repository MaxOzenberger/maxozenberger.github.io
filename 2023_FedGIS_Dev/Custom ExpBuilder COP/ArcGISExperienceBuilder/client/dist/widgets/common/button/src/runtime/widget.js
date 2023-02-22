/** @jsx jsx */
import { React, LinkType, ExpressionPartType, ExpressionResolverErrorCode, appActions, classNames, jsx, ExpressionResolverComponent, Immutable, AppMode, css, getAppStore } from 'jimu-core';
import { styleUtils, Link, Icon, DistanceUnits, defaultMessages as jimuUiDefaultMessages } from 'jimu-ui';
import { IconPosition } from '../config';
import { getStyle } from './style';
import { versionManager } from '../version-manager';
import { getIconPropsFromTheme } from '../utils';
var RepeatType;
(function (RepeatType) {
    RepeatType[RepeatType["None"] = 0] = "None";
    RepeatType[RepeatType["Main"] = 1] = "Main";
    RepeatType[RepeatType["Sub"] = 2] = "Sub";
})(RepeatType || (RepeatType = {}));
export default class Widget extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c, _d, _e;
        super(props);
        this.repeat = 0;
        this.getTextFromProps = () => {
            var _a, _b, _c, _d;
            return typeof ((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.text) === 'string'
                ? (_d = (_c = this.props.config) === null || _c === void 0 ? void 0 : _c.functionConfig) === null || _d === void 0 ? void 0 : _d.text
                : this.props.intl.formatMessage({ id: 'variableButton', defaultMessage: jimuUiDefaultMessages.variableButton });
        };
        this.setRepeatType = () => {
            const repeatedDataSource = this.props.repeatedDataSource;
            let repeat;
            if (!repeatedDataSource) {
                repeat = RepeatType.None;
            }
            else {
                if (repeatedDataSource.recordIndex === 0) {
                    repeat = RepeatType.Main;
                }
                else {
                    repeat = RepeatType.Sub;
                }
            }
            this.repeat = repeat;
        };
        this.getTipExpression = () => {
            var _a, _b;
            return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression &&
                this.props.config.functionConfig.toolTipExpression) ||
                Immutable({
                    name: '',
                    parts: [{ type: ExpressionPartType.String, exp: `"${((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.toolTip) || ''}"` }]
                });
        };
        this.getTextExpression = () => {
            var _a, _b;
            return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.textExpression &&
                this.props.config.functionConfig.textExpression) ||
                Immutable({
                    name: '',
                    parts: [{ type: ExpressionPartType.String, exp: `"${((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.text) || this.getTextFromProps()}"` }]
                });
        };
        this.getUrlExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam &&
                this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.expression;
            return expression || null;
        };
        this.onTextExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ text: result.value });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.textExpression && this.state.textExpression.name;
                }
                this.setState({ text: res });
            }
        };
        this.onTipExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ toolTip: result.value });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.tipExpression && this.state.tipExpression.name;
                }
                this.setState({ toolTip: res });
            }
        };
        this.onUrlExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ url: result.value });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.urlExpression && this.state.urlExpression.name;
                }
                this.setState({ url: res });
            }
        };
        this.showQuickStylePanel = () => {
            if (!window.jimuConfig.isInBuilder) {
                return false;
            }
            const repeat = this.repeat;
            const { active } = this.props;
            return this.props.showQuickStyle && active && repeat !== RepeatType.Sub;
        };
        this.getWhetherUseQuickStyle = (config) => {
            return !!(config && config.styleConfig && config.styleConfig.themeStyle && config.styleConfig.themeStyle.quickStyleType);
        };
        this.getIconStyle = (regularIconProps, hoverIconProps) => {
            const r = regularIconProps || {};
            const h = hoverIconProps || {};
            return css `
      & img, & svg{
        color: ${r.color};
        fill: ${r.color};
        width: ${r.size}${DistanceUnits.PIXEL};
        height: ${r.size}${DistanceUnits.PIXEL};
      }
      &:hover{
        img, svg{
          color: ${h.color};
          fill: ${h.color};
          width: ${h.size}${DistanceUnits.PIXEL};
          height: ${h.size}${DistanceUnits.PIXEL};
        }
      }
    `;
        };
        this.removeUndefinedStyle = (style) => {
            if (!style) {
                return style;
            }
            const removedUndefinedStyle = {};
            Object.keys(style).forEach(styleName => {
                if ((typeof style[styleName] === 'string' && style[styleName].indexOf('undefined') < 0) ||
                    typeof style[styleName] === 'number') {
                    removedUndefinedStyle[styleName] = style[styleName];
                }
            });
            return removedUndefinedStyle;
        };
        this.getLinkComponent = () => {
            const config = this.props.config;
            const linkParam = config.functionConfig.linkParam;
            const text = this.state.text;
            const toolTip = this.state.toolTip;
            let customStyle;
            let iconStyle;
            if (config.styleConfig && config.styleConfig.customStyle) {
                const regular = config.styleConfig.customStyle.regular;
                const hover = config.styleConfig.customStyle.hover;
                if (config.styleConfig.useCustom) {
                    const style = styleUtils.toCSSStyle(regular && regular.without('iconProps').asMutable({ deep: true }));
                    const hoverStyle = styleUtils.toCSSStyle(hover && hover.without('iconProps').asMutable({ deep: true }));
                    if (this.props.active && this.props.appMode !== AppMode.Run) {
                        const widgetState = getAppStore().getState().widgetsState[this.props.id] || Immutable({});
                        customStyle = {
                            style: widgetState.isConfiguringHover
                                ? Object.assign(Object.assign({}, this.removeUndefinedStyle(style)), this.removeUndefinedStyle(hoverStyle)) : style,
                            hoverStyle
                        };
                        iconStyle = this.getIconStyle(widgetState.isConfiguringHover ? Object.assign(Object.assign({}, regular === null || regular === void 0 ? void 0 : regular.iconProps), hover === null || hover === void 0 ? void 0 : hover.iconProps) : regular === null || regular === void 0 ? void 0 : regular.iconProps, hover === null || hover === void 0 ? void 0 : hover.iconProps);
                    }
                    else {
                        customStyle = {
                            style,
                            hoverStyle
                        };
                        iconStyle = this.getIconStyle(regular && regular.iconProps, hover && hover.iconProps);
                    }
                }
            }
            const useQuickStyle = this.getWhetherUseQuickStyle(config);
            const themeStyle = useQuickStyle
                ? {
                    type: config.styleConfig.themeStyle.quickStyleType
                }
                : {
                    type: 'default'
                };
            const basicClassNames = 'widget-button-link text-truncate w-100 h-100 p-0 d-flex align-items-center justify-content-center';
            let queryObject;
            let target;
            let linkTo;
            if (linkParam && linkParam.linkType) {
                target = linkParam.openType;
                linkTo = {
                    linkType: linkParam.linkType
                };
                if (linkParam.linkType === LinkType.WebAddress) {
                    linkTo.value = this.state.url;
                }
                else {
                    linkTo.value = linkParam.value;
                    queryObject = this.props.queryObject;
                }
            }
            const icon = config.functionConfig.icon;
            const isRTL = this.props.isRTL;
            const leftIcon = icon && (!icon.position || icon.position === IconPosition.Left) && jsx(Icon, { icon: icon.data, className: classNames({ 'mr-2 ml-0': !!text && !isRTL, 'ml-2 mr-0': !!text && isRTL, 'mx-0': !text }) });
            const rightIcon = icon && icon.position && icon.position === IconPosition.Right && jsx(Icon, { icon: icon.data, className: classNames({ 'ml-2 mr-0': !!text && !isRTL, 'mr-2 ml-0': !!text && isRTL, 'mx-0': !text }) });
            return jsx(Link, Object.assign({ to: linkTo, target: target, queryObject: queryObject, title: toolTip, className: basicClassNames, role: (linkTo === null || linkTo === void 0 ? void 0 : linkTo.value) && linkTo.linkType !== LinkType.Dialog ? 'link' : 'button', customStyle: customStyle }, themeStyle, { css: iconStyle }),
                jsx("span", { className: "text-truncate widget-button-text" },
                    isRTL ? rightIcon : leftIcon,
                    text,
                    isRTL ? leftIcon : rightIcon));
        };
        this.onQuickStyleChange = (t) => {
            let { config } = this.props;
            const id = this.props.id;
            const builderSupportModules = this.props.builderSupportModules;
            const getAppConfigAction = builderSupportModules && builderSupportModules.jimuForBuilderLib.getAppConfigAction;
            if (getAppConfigAction) {
                config = config.setIn(['styleConfig', 'useCustom'], false);
                config = config.setIn(['styleConfig', 'themeStyle', 'quickStyleType'], t);
                config = config.setIn(['styleConfig', 'customStyle', 'regular'], { iconProps: getIconPropsFromTheme(true, t, this.props.theme) });
                config = config.setIn(['styleConfig', 'customStyle', 'hover'], { iconProps: getIconPropsFromTheme(false, t, this.props.theme) });
                getAppConfigAction().editWidgetProperty(id, 'config', config).exec();
            }
        };
        this.onClick = e => {
            (e).exbEventType = 'linkClick';
        };
        this.onQuickStyleClose = () => this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'showQuickStyle', false));
        this.getQuickStyleComponent = () => {
            var _a, _b, _c, _d, _e;
            const QuickStyle = this.props.builderSupportModules && this.props.builderSupportModules.widgetModules && this.props.builderSupportModules.widgetModules.QuickStyle;
            return !QuickStyle
                ? null
                : jsx(QuickStyle, { onChange: this.onQuickStyleChange, reference: this.domNode && this.domNode.current, onClose: this.onQuickStyleClose, selectedType: !((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.styleConfig) === null || _b === void 0 ? void 0 : _b.useCustom) && ((_e = (_d = (_c = this.props.config) === null || _c === void 0 ? void 0 : _c.styleConfig) === null || _d === void 0 ? void 0 : _d.themeStyle) === null || _e === void 0 ? void 0 : _e.quickStyleType), onInitDragHandler: this.props.onInitDragHandler, onInitResizeHandler: this.props.onInitResizeHandler });
        };
        this.state = {
            text: this.getTextFromProps(),
            toolTip: ((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.toolTip) || '',
            url: ((_e = (_d = (_c = this.props.config) === null || _c === void 0 ? void 0 : _c.functionConfig) === null || _d === void 0 ? void 0 : _d.linkParam) === null || _e === void 0 ? void 0 : _e.value) || '',
            textExpression: this.props.useDataSourcesEnabled && this.getTextExpression(),
            tipExpression: this.props.useDataSourcesEnabled && this.getTipExpression(),
            urlExpression: this.props.useDataSourcesEnabled && this.getUrlExpression(),
            mouted: false
        };
        this.domNode = React.createRef();
    }
    componentDidMount() {
        /**
         * All these changes are for quick style panel. If not in builder, no need to do them.
         */
        if (window.jimuConfig.isInBuilder) {
            this.setRepeatType();
            const isNewlyAdded = this.props.active && !this.props.hasEverMount;
            if (isNewlyAdded) {
                this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'showQuickStyle', true));
            }
            if (!this.props.hasEverMount) {
                this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'hasEverMount', true));
            }
            /**
             * After widget is mounted, need to rerender quick style panel since its reference is updated.
             */
            this.setState({ mouted: true });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.props.useDataSourcesEnabled &&
            (this.props.config !== prevProps.config || prevProps.useDataSourcesEnabled)) {
            this.setState({
                text: this.getTextFromProps(),
                toolTip: this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip,
                url: this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.value
            });
        }
        if (this.props.useDataSourcesEnabled &&
            (this.props.config !== prevProps.config || !prevProps.useDataSourcesEnabled)) {
            this.setState({
                textExpression: this.getTextExpression(),
                tipExpression: this.getTipExpression(),
                urlExpression: this.getUrlExpression()
            });
        }
        if (window.jimuConfig.isInBuilder &&
            ((this.props.appMode !== prevProps.appMode && this.props.appMode === AppMode.Run) ||
                (!this.props.active && prevProps.active))) {
            this.props.dispatch(appActions.widgetStatePropChange(this.props.id, 'showQuickStyle', false));
        }
    }
    render() {
        const isDataSourceUsed = this.props.useDataSourcesEnabled;
        const showQuickStylePanel = this.showQuickStylePanel();
        const LinkComponent = this.getLinkComponent();
        const QuickStyleComponent = this.getQuickStyleComponent();
        return (jsx("div", { className: "jimu-widget widget-button w-100 h-100", css: getStyle(this.props.theme), ref: this.domNode, onClick: this.onClick, onTouchEnd: this.onClick },
            LinkComponent,
            showQuickStylePanel && QuickStyleComponent,
            jsx("div", { style: { display: 'none' } }, isDataSourceUsed &&
                jsx("div", null,
                    jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.state.textExpression, onChange: this.onTextExpResolveChange, widgetId: this.props.id }),
                    jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.state.tipExpression, onChange: this.onTipExpResolveChange, widgetId: this.props.id }),
                    jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.state.urlExpression, onChange: this.onUrlExpResolveChange, widgetId: this.props.id })))));
    }
}
Widget.mapExtraStateProps = (state, ownProps) => {
    let selected = false;
    const selection = state.appRuntimeInfo.selection;
    if (selection && state.appConfig.layouts[selection.layoutId]) {
        const layoutItem = state.appConfig.layouts[selection.layoutId].content[selection.layoutItemId];
        selected = layoutItem && layoutItem.widgetId === ownProps.id;
    }
    const isInBuilder = state.appContext.isInBuilder;
    const active = isInBuilder && selected;
    const widgetState = state.widgetsState[ownProps.id] || Immutable({});
    const showQuickStyle = !!widgetState.showQuickStyle;
    return {
        active,
        showQuickStyle,
        appMode: active ? state.appRuntimeInfo.appMode : null,
        queryObject: state.queryObject,
        hasEverMount: widgetState.hasEverMount,
        isRTL: state.appContext.isRTL
    };
};
Widget.versionManager = versionManager;
//# sourceMappingURL=widget.js.map