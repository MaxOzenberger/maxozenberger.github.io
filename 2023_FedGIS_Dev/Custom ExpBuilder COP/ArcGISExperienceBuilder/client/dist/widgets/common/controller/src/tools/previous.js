import { getAppStore, i18n, appActions } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import rightOutlined from 'jimu-icons/svg/outlined/directional/right.svg';
import leftOutlined from 'jimu-icons/svg/outlined/directional/left.svg';
export default class Previous {
    constructor() {
        this.index = 1;
        this.id = 'controller-roll-list-previous';
        this.classes = {};
    }
    visible(props) {
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        return !(widgetState === null || widgetState === void 0 ? void 0 : widgetState.hideArrow);
    }
    disabled(props) {
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        return widgetState === null || widgetState === void 0 ? void 0 : widgetState.disablePrevious;
    }
    getGroupId() {
        return 'controller-tools';
    }
    getTitle() {
        const intl = i18n.getIntl('_jimu');
        return intl ? intl.formatMessage({ id: 'previous', defaultMessage: defaultMessages.previous }) : 'Previous';
    }
    getIcon() {
        var _a;
        const isRTL = (_a = getAppStore().getState().appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
        return !isRTL ? leftOutlined : rightOutlined;
    }
    onClick(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetState = getAppStore().getState().widgetsState[props.layoutItem.widgetId];
        if (widgetState === null || widgetState === void 0 ? void 0 : widgetState.onArrowClick) {
            widgetState.onArrowClick(true, false);
            let version = (_a = widgetState === null || widgetState === void 0 ? void 0 : widgetState.version) !== null && _a !== void 0 ? _a : 0;
            getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'version', ++version));
        }
    }
    getSettingPanel(props) {
        return null;
    }
}
//# sourceMappingURL=previous.js.map