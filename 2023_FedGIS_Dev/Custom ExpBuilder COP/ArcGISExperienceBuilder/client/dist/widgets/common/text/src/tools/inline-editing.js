import { getAppStore, appActions, i18n } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import editOutlined from 'jimu-icons/svg/outlined/editor/edit.svg';
export default class TextTool {
    constructor() {
        this.index = 0;
        this.id = 'inline-editing';
    }
    getGroupId() {
        return null;
    }
    getTitle() {
        const intl = i18n.getIntl('_jimu');
        return intl != null ? intl.formatMessage({ id: 'edit', defaultMessage: defaultMessages.edit }) : 'Edit';
    }
    getIcon() {
        return editOutlined;
    }
    checked(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetsRuntimeInfo = getAppStore().getState().widgetsRuntimeInfo;
        const checked = (_a = widgetsRuntimeInfo[widgetId]) === null || _a === void 0 ? void 0 : _a.isInlineEditing;
        return !!checked;
    }
    onClick(props) {
        var _a;
        const widgetId = props.layoutItem.widgetId;
        const widgetsRuntimeInfo = getAppStore().getState().widgetsRuntimeInfo;
        const isInlineEditing = (_a = widgetsRuntimeInfo[widgetId]) === null || _a === void 0 ? void 0 : _a.isInlineEditing;
        getAppStore().dispatch(appActions.setWidgetIsInlineEditingState(widgetId, !isInlineEditing));
        if (isInlineEditing) {
            getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showExpression', false));
        }
    }
    getSettingPanel() {
        return null;
    }
}
//# sourceMappingURL=inline-editing.js.map