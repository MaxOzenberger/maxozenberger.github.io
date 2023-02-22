import { getAppStore, i18n, appActions } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import PlusOutlined from 'jimu-icons/svg/outlined/editor/plus.svg';
export default class AddWidget {
    constructor() {
        this.index = 3;
        this.id = 'conttroller-add-widget1';
        this.name = 'conttroller-add-widget2';
        this.classes = {};
    }
    getGroupId() {
        return 'controller-tools';
    }
    getTitle() {
        const intl = i18n.getIntl('_jimu');
        return intl ? intl.formatMessage({ id: 'addWidget', defaultMessage: defaultMessages.previous }) : 'Add widget';
    }
    getIcon() {
        return PlusOutlined;
    }
    checked(props) {
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[widgetId];
        const showWidgetsPanel = !!(widgetState === null || widgetState === void 0 ? void 0 : widgetState.showWidgetsPanel);
        return showWidgetsPanel;
    }
    onClick(props) {
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[widgetId];
        const showWidgetsPanel = !(widgetState === null || widgetState === void 0 ? void 0 : widgetState.showWidgetsPanel);
        getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showWidgetsPanel', showWidgetsPanel));
    }
    getSettingPanel(props) {
        return null;
    }
}
//# sourceMappingURL=add-widget.js.map