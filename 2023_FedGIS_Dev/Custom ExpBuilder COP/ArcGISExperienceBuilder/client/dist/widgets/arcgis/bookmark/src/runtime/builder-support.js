import { getAppStore, BrowserSizeMode } from 'jimu-core';
import { searchUtils } from 'jimu-layouts/layout-runtime';
const widgetModules = {
    selectionInBookmark: (layoutInfo, id, appConfig, useCurrentSizeMode = true) => {
        if (!layoutInfo || !layoutInfo.layoutItemId || !layoutInfo.layoutId) {
            return false;
        }
        let layoutItems;
        if (useCurrentSizeMode) {
            layoutItems = searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(appConfig, layoutInfo, id, getAppStore().getState().browserSizeMode);
        }
        else {
            layoutItems = [];
            layoutItems.push(...searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(appConfig, layoutInfo, id, BrowserSizeMode.Large));
            layoutItems.push(...searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(appConfig, layoutInfo, id, BrowserSizeMode.Medium));
            layoutItems.push(...searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(appConfig, layoutInfo, id, BrowserSizeMode.Small));
        }
        return layoutItems.length > 0;
    }
};
export default widgetModules;
//# sourceMappingURL=builder-support.js.map