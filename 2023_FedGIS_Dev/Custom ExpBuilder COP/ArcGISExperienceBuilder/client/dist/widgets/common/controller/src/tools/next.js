import { getAppStore, i18n, appActions } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import rightOutlined from 'jimu-icons/svg/outlined/directional/right.svg';
import leftOutlined from 'jimu-icons/svg/outlined/directional/left.svg';
export default class Next {
    constructor() {
        this.index = 2;
        this.id = 'controller-roll-list-next';
        this.classes = {};
    }
    visible(props) {
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        return !(widgetState === null || widgetState === void 0 ? void 0 : widgetState.hideArrow);
    }
    disabled(props) {
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        return widgetState === null || widgetState === void 0 ? void 0 : widgetState.disableNext;
    }
    getGroupId() {
        return 'controller-tools';
    }
    getTitle() {
        const intl = i18n.getIntl('_jimu');
        return intl ? intl.formatMessage({ id: 'next', defaultMessage: defaultMessages.next }) : 'Next';
    }
    getIcon() {
        var _a;
        const isRTL = (_a = getAppStore().getState().appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
        return !isRTL ? rightOutlined : leftOutlined;
    }
    onClick(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        if (widgetState === null || widgetState === void 0 ? void 0 : widgetState.onArrowClick) {
            widgetState.onArrowClick(false, false);
            let version = (_a = widgetState === null || widgetState === void 0 ? void 0 : widgetState.version) !== null && _a !== void 0 ? _a : 0;
            getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'version', ++version));
        }
    }
    getSettingPanel(props) {
        return null;
    }
}
//# sourceMappingURL=next.js.map