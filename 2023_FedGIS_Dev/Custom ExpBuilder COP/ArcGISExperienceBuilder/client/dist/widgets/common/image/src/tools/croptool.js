import { getAppStore, appActions, i18n, MutableStoreManager } from 'jimu-core';
import { ImageFillMode } from 'jimu-ui';
import defaultMessage from '../../src/runtime/translations/default';
import CutOutlined from 'jimu-icons/svg/outlined/editor/cut.svg';
export default class CropTool {
    constructor() {
        this.index = 1;
        this.id = 'image-croptool';
        this.classes = {};
        this.isEmptySource = (config) => {
            if ((!config.functionConfig.imageParam || !config.functionConfig.imageParam.url) && !config.functionConfig.srcExpression) {
                return true;
            }
            else {
                return false;
            }
        };
    }
    getGroupId() {
        return null;
    }
    getTitle() {
        const widgetId = this.widgetId;
        const intl = i18n.getIntl(widgetId);
        return intl ? intl.formatMessage({ id: 'imageCrop', defaultMessage: defaultMessage.imageCrop }) : 'Crop';
    }
    getIcon() {
        return CutOutlined;
    }
    onClick(props) {
        const widgetInfo = getAppStore().getState().appConfig.widgets[props.layoutItem.widgetId];
        const clientRect = {
            bottom: props.clientRect.bottom,
            height: props.clientRect.height,
            left: window.scrollX + props.clientRect.left,
            right: props.clientRect.right,
            top: window.scrollY + props.clientRect.top,
            width: props.clientRect.width
        };
        MutableStoreManager.getInstance().updateStateValue(props.layoutItem.widgetId, 'clientRect', clientRect);
        if (widgetInfo) {
            const widgetConfig = widgetInfo.config;
            if (widgetConfig.functionConfig.imageParam && widgetConfig.functionConfig.imageParam.url) {
                getAppStore().dispatch(appActions.setWidgetIsInlineEditingState(props.layoutItem.widgetId, true));
            }
        }
    }
    visible(props) {
        const widgetInfo = getAppStore().getState().appConfig.widgets[props.layoutItem.widgetId];
        if (widgetInfo) {
            const widgetConfig = widgetInfo.config;
            if (this.isEmptySource(widgetConfig)) {
                return false;
            }
            if (widgetConfig.functionConfig.srcExpression) {
                // the dynamic src from expression can't support crop
                return false;
            }
            else if (widgetConfig.functionConfig.imageParam && (widgetConfig.functionConfig.imageFillMode === ImageFillMode.Fit)) {
                return false;
            }
            else {
                // the static src can support crop
                return true;
            }
        }
        else {
            return false;
        }
    }
    getSettingPanel(props) {
        return null;
    }
}
//# sourceMappingURL=croptool.js.map