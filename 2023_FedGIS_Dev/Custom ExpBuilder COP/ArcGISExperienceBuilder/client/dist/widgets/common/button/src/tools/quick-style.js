import { appActions, getAppStore, Immutable, i18n } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import BrushOutlined from 'jimu-icons/svg/outlined/editor/brush.svg';
export default class QuickStyle {
    constructor() {
        this.index = 2;
        this.id = 'button-quick-style';
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
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[widgetId] || Immutable({});
        return !!widgetState.showQuickStyle;
    }
    getIcon() {
        return BrushOutlined;
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