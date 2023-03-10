import { getAppStore, React, BrowserSizeMode } from 'jimu-core';
import { interact } from 'jimu-core/dnd';
import { ButtonGroup, Button, Popper } from 'jimu-ui';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import { getAppConfigAction } from 'jimu-for-builder';
import { GLOBAL_DRAGGING_CLASS_NAME, GLOBAL_RESIZING_CLASS_NAME, GLOBAL_H5_DRAGGING_CLASS_NAME } from 'jimu-layouts/layout-builder';
import MyDropDown from './components/my-dropdown';
import { withBuilderStyles, withBuilderTheme } from 'jimu-theme';
const widgetModules = {
    ButtonGroup: ButtonGroup,
    interact: interact,
    searchUtils: searchUtils,
    getAppConfigAction: getAppConfigAction,
    GLOBAL_DRAGGING_CLASS_NAME: GLOBAL_DRAGGING_CLASS_NAME,
    GLOBAL_RESIZING_CLASS_NAME: GLOBAL_RESIZING_CLASS_NAME,
    GLOBAL_H5_DRAGGING_CLASS_NAME: GLOBAL_H5_DRAGGING_CLASS_NAME,
    withBuilderStyle: withBuilderStyles,
    withBuilderTheme: withBuilderTheme,
    BuilderDropDown: withBuilderTheme((props) => {
        return React.createElement(MyDropDown, Object.assign({}, props, { withBuilderStyle: withBuilderStyles }));
    }),
    BuilderPopper: withBuilderTheme(Popper),
    BuilderButton: withBuilderTheme(Button),
    selectionIsSelf: (layoutInfo, id, appConfig) => {
        if (!layoutInfo || !layoutInfo.layoutItemId || !layoutInfo.layoutId) {
            return false;
        }
        const layoutItem = searchUtils.findLayoutItem(appConfig, layoutInfo);
        if (layoutItem && layoutItem.widgetId && layoutItem.widgetId === id) {
            return true;
        }
        return false;
    },
    selectionInCard: (layoutInfo, id, appConfig, useCurrentSizeMode = true) => {
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