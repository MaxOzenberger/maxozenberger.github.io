import { React, injectIntl, ReactRedux } from 'jimu-core';
import { withTheme } from 'jimu-theme';
import { isClassComponent } from './test-utils';
/**
 * Wrap a widget setting for unit testing.
 * The recommended way is to wrap the widget setting one time, then change props in test cases
 * @param WidgetSettingClass
 * @param props The props here can be considered as default props for a bunch of test cases.
 * @returns
 */
export function wrapWidgetSetting(WidgetSettingClass, props) {
    class _WidgetSettingWrapper extends React.PureComponent {
        render() {
            if (isClassComponent(WidgetSettingClass)) {
                const ClassComponent = WidgetSettingClass;
                return React.createElement(ClassComponent, Object.assign({ ref: this.props.widgetRef }, props, this.props));
            }
            else {
                return React.createElement(WidgetSettingClass, Object.assign({}, props, this.props));
            }
        }
    }
    _WidgetSettingWrapper.displayName = 'WidgetSettingWrapper()';
    const WidgetSettingWrapper = React.forwardRef((props, ref) => React.createElement(_WidgetSettingWrapper, Object.assign({ widgetRef: ref }, props)));
    const mapStateToProps = (state, ownProps) => {
        var _a, _b, _c;
        const widgetId = ownProps.widgetId;
        const widgetJson = (_c = (_b = (_a = state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.widgets) === null || _c === void 0 ? void 0 : _c[widgetId];
        if (!widgetJson) {
            return Object.assign({}, WidgetSettingClass.mapExtraStateProps ? WidgetSettingClass.mapExtraStateProps(state, ownProps) : {}, ownProps);
        }
        const props = Object.assign({
            portalUrl: state.portalUrl,
            portalSelf: state.portalSelf,
            user: state.user,
            token: state.token,
            locale: state.appContext.locale,
            appI18nMessages: state.appI18nMessages
        }, ownProps);
        const allOwnProps = Object.assign({}, widgetJson, props);
        return Object.assign({}, WidgetSettingClass.mapExtraStateProps ? WidgetSettingClass.mapExtraStateProps(state, allOwnProps) : {}, allOwnProps);
    };
    const ConnecteWidgetSettingComponent = ReactRedux.connect(mapStateToProps)(WidgetSettingWrapper);
    const IntlInjectedComponent = injectIntl(ConnecteWidgetSettingComponent);
    const ThemedWidgetSettingWrapper = withTheme(IntlInjectedComponent, true);
    return ThemedWidgetSettingWrapper;
}
//# sourceMappingURL=widget-setting-wrapper.js.map