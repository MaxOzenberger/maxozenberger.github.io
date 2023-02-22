import { appActions, getAppStore, Immutable, i18n } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
export default class TextTool {
    constructor() {
        this.index = 0;
        this.id = 'navigator-quick-style';
    }
    visible(props) {
        return true;
    }
    getGroupId() {
        return null;
    }
    getTitle() {
        const intl = i18n.getIntl('_jimu');
        return intl ? intl.formatMessage({ id: 'quickStyle', defaultMessage: defaultMessages.quickStyle }) : 'Quick style';
    }
    checked(props) {
        var _a, _b;
        const widgetId = props.layoutItem.widgetId;
        return !!((_b = (_a = getAppStore().getState().widgetsState) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.showQuickStyle);
    }
    getIcon() {
        return require('jimu-ui/lib/icons/design.svg');
    }
    onClick(props) {
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[widgetId] || Immutable({});
        const showQuickStyle = !widgetState.showQuickStyle;
        getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showQuickStyle', showQuickStyle));
    }
    getSettingPanel() {
        return null;
    }
}
//# sourceMappingURL=quick-style.js.map