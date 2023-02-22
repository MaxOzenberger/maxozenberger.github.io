import { appActions, getAppStore, Immutable, i18n } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import dataOutlined from 'jimu-icons/svg/outlined/data/data.svg';
const isExpressionEnabled = (props) => {
    var _a, _b, _c;
    const widgetId = props.layoutItem.widgetId;
    const widgetJson = (_b = (_a = getAppStore().getState().appConfig) === null || _a === void 0 ? void 0 : _a.widgets) === null || _b === void 0 ? void 0 : _b[widgetId];
    const expressionEnabled = ((widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSources) != null && ((_c = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSources) === null || _c === void 0 ? void 0 : _c.length) > 0) && (widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSourcesEnabled);
    return expressionEnabled;
};
export default class TextTool {
    constructor() {
        this.index = 1;
        this.id = 'text-expression';
    }
    disabled(props) {
        const disabled = !isExpressionEnabled(props);
        return disabled;
    }
    getGroupId() {
        return null;
    }
    getTitle(props) {
        const expressionEnabled = isExpressionEnabled(props);
        const translation = expressionEnabled ? 'dynamicContent' : 'dynamicContentTip';
        const intl = i18n.getIntl('_jimu');
        if (!intl)
            return translation;
        return intl.formatMessage({ id: translation, defaultMessage: defaultMessages[translation] });
    }
    checked(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetState = (_a = getAppStore().getState().widgetsState[widgetId]) !== null && _a !== void 0 ? _a : Immutable({});
        return !!widgetState.showExpression;
    }
    getIcon() {
        return dataOutlined;
    }
    onClick(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetState = (_a = getAppStore().getState().widgetsState[widgetId]) !== null && _a !== void 0 ? _a : Immutable({});
        const showExpression = !widgetState.showExpression;
        if (showExpression) {
            if (!getAppStore().getState().widgetsRuntimeInfo[widgetId].isInlineEditing) {
                getAppStore().dispatch(appActions.setWidgetIsInlineEditingState(widgetId, true));
            }
        }
        getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showExpression', showExpression));
    }
    getSettingPanel() {
        return null;
    }
}
//# sourceMappingURL=expression.js.map