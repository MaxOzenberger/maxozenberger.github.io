import { WidgetType, LayoutItemType, getAppStore } from 'jimu-core';
import { utils } from 'jimu-layouts/layout-runtime';
import { getAppConfigAction } from 'jimu-for-builder';
import { addItemToLayout } from 'jimu-layouts/layout-builder';
import { getCurrentLayoutJson } from '../common/layout-utils';
export const isLayoutItemAcceptedForController = (item) => {
    var _a, _b;
    const itemType = item === null || item === void 0 ? void 0 : item.itemType;
    const type = (_a = item === null || item === void 0 ? void 0 : item.manifest) === null || _a === void 0 ? void 0 : _a.widgetType;
    const name = (_b = item === null || item === void 0 ? void 0 : item.manifest) === null || _b === void 0 ? void 0 : _b.name;
    return itemType !== LayoutItemType.Section && type !== WidgetType.Layout && name !== 'controller' && !utils.isWidgetPlaceholder(utils.getAppConfig(), item);
};
export const calInsertPositionForColumn = (boundingRect, itemRect, childRects) => {
    const centerY = itemRect.top + itemRect.height / 2;
    let result, refId;
    let found = false;
    childRects.some((rect, i) => {
        const rectY = rect.top + rect.height / 2;
        if (rectY > centerY) {
            if (i === 0) { // insert before the first item
                result = rect.top / 2;
            }
            else { // insert between this and previous one
                const previousItem = childRects[i - 1];
                result = (rect.top + previousItem.top + previousItem.height) / 2;
            }
            found = true;
            refId = rect.id;
        }
        return found;
    });
    if (!found) { // insert after the last one
        const lastItem = childRects[childRects.length - 1];
        result = (lastItem.top + lastItem.height + boundingRect.height) / 2;
    }
    return {
        insertY: result,
        refId
    };
};
export const calInsertPositionForRow = (boundingRect, itemRect, childRects) => {
    const centerX = itemRect.left + itemRect.width / 2;
    let result, refId;
    let found = false;
    childRects.some((rect, i) => {
        const rectX = rect.left + rect.width / 2;
        if (rectX > centerX) {
            if (i === 0) { // insert before the first item
                result = rect.left / 2;
            }
            else { // insert between this and previous one
                const previousItem = childRects[i - 1];
                result = (rect.left + previousItem.left + previousItem.width) / 2;
            }
            found = true;
            refId = rect.id;
        }
        return found;
    });
    if (!found) { // insert after the last one
        const lastItem = childRects[childRects.length - 1];
        result = (lastItem.left + lastItem.width + boundingRect.width) / 2;
    }
    return {
        insertX: result,
        refId
    };
};
export const insertWidgetToLayout = (layout, itemProps, containerRect, itemRect, insertIndex, callback) => {
    const layoutInfo = {
        layoutId: layout.id
    };
    let appConfigAction = getAppConfigAction();
    addItemToLayout(appConfigAction.appConfig, itemProps, layoutInfo, containerRect, itemRect, insertIndex || 0)
        .then((result) => {
        appConfigAction = getAppConfigAction(result.updatedAppConfig);
        callback === null || callback === void 0 ? void 0 : callback(appConfigAction);
        appConfigAction.exec();
    });
};
export const syncWidgetsToOtherSizeMode = (appConfigAction, widgetId, layoutName) => {
    var _a, _b, _c;
    const layouts = (_c = (_b = (_a = getAppStore().getState().appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[layoutName];
    const layout = getCurrentLayoutJson(layouts);
    const sizeMode = getAppStore().getState().browserSizeMode;
    Object.keys(layouts).forEach(sm => {
        if (sizeMode !== sm) {
            appConfigAction.copyLayoutContent(layout.id, layouts[sm]);
        }
    });
};
export const useInsertSyncWidgetToLayout = (controllerId, layoutName) => {
    const callback = (appConfigAction) => syncWidgetsToOtherSizeMode(appConfigAction, controllerId, layoutName);
    return (layout, item, container, itemRect, index) => {
        return insertWidgetToLayout(layout, item, container, itemRect, index, callback);
    };
};
export const useDeleteSyncWidgetFromLayout = (controllerId, layoutName) => {
    return (widgetId) => {
        const appConfigAction = getAppConfigAction();
        appConfigAction.removeWidget(widgetId);
        syncWidgetsToOtherSizeMode(appConfigAction, controllerId, layoutName);
        appConfigAction.exec();
    };
};
//# sourceMappingURL=utils.js.map