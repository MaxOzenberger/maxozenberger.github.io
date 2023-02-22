import { React, MutableStoreManager, injectIntl, ReactRedux } from 'jimu-core';
import { withTheme } from 'jimu-theme';
import { isClassComponent } from './test-utils';
/**
 * Wrap a widget for unit testing.
 * The recommended way is to wrap the widget one time, then change props in test cases
 * @param WidgetClass
 * @param props The props here can be considered as default props for a bunch of test cases.
 * @returns
 */
export function wrapWidget(WidgetClass, props) {
    class _WidgetWrapper extends React.PureComponent {
        render() {
            if (isClassComponent(WidgetClass)) {
                const ClassComponent = WidgetClass;
                return React.createElement(ClassComponent, Object.assign({ ref: this.props.widgetRef }, props, this.props));
            }
            else {
                return React.createElement(WidgetClass, Object.assign({}, props, this.props));
            }
        }
    }
    _WidgetWrapper.displayName = 'WidgetWrapper()';
    const WidgetWrapper = React.forwardRef((props, ref) => React.createElement(_WidgetWrapper, Object.assign({ widgetRef: ref }, props)));
    const mapStateToProps = (state, ownProps) => {
        var _a, _b;
        const widgetId = ownProps.widgetId;
        const widgetJson = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.widgets) === null || _b === void 0 ? void 0 : _b[widgetId];
        if (!widgetJson) {
            return Object.assign({}, WidgetClass.mapExtraStateProps ? WidgetClass.mapExtraStateProps(state, ownProps) : {}, ownProps);
        }
        const runtimeInfo = state.widgetsRuntimeInfo[widgetId];
        const props = Object.assign({
            portalUrl: state.portalUrl,
            portalSelf: state.portalSelf,
            user: state.user,
            token: state.token,
            locale: state.appContext.locale,
            appI18nMessages: state.appI18nMessages
        }, ownProps);
        if (state.widgetsState[widgetId]) {
            props.stateProps = state.widgetsState[widgetId];
        }
        if (state.widgetsMutableStateVersion[widgetId]) {
            props.mutableStatePropsVersion = state.widgetsMutableStateVersion[widgetId];
            props.mutableStateProps = MutableStoreManager.getInstance().getStateValue([widgetId]);
        }
        if (state.widgetsPreloadProps && state.widgetsPreloadProps[widgetId]) {
            Object.assign(props, state.widgetsPreloadProps[widgetId]);
        }
        const allOwnProps = Object.assign({}, widgetJson, runtimeInfo, props);
        return Object.assign({}, WidgetClass.mapExtraStateProps ? WidgetClass.mapExtraStateProps(state, allOwnProps) : {}, allOwnProps);
    };
    const ConnecteWidgetComponent = ReactRedux.connect(mapStateToProps)(WidgetWrapper);
    const IntlInjectedComponent = injectIntl(ConnecteWidgetComponent);
    const multiTheme = window.jimuConfig.isBuilder || window.jimuConfig.isBuilder;
    const ThemedWidgetWrapper = withTheme(IntlInjectedComponent, multiTheme);
    return ThemedWidgetWrapper;
}
//# sourceMappingURL=widget-wrapper.js.map