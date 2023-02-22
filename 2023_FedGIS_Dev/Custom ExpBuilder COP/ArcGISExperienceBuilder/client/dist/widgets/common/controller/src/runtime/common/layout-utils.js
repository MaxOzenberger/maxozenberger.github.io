import { React, ReactRedux, WidgetState, Immutable, getAppStore } from 'jimu-core';
import { searchUtils } from 'jimu-layouts/layout-runtime';
/**
 * Get all child widegts in the specified widegt(e.g. widget controller) by passing widegtId and widget layout name as params.
 *
 * Note: React custom hook
 * @param widgetId The id of a exb widget
 * @param layoutName  The layout name of a widget layout
 */
export const useControlledWidgets = (widgetId, layoutName) => {
    const widgetsRuntimeInfo = ReactRedux.useSelector((state) => state.widgetsRuntimeInfo);
    const layout = useWidgetChildLayoutJson(widgetId, layoutName);
    const widgetIds = getWidgetIdsFromLayout(layout);
    return React.useMemo(() => {
        const runtimeInfos = {};
        widgetIds.forEach((widgetId) => {
            var _a;
            const runtimeInfo = (_a = widgetsRuntimeInfo === null || widgetsRuntimeInfo === void 0 ? void 0 : widgetsRuntimeInfo[widgetId]) !== null && _a !== void 0 ? _a : {
                isClassLoaded: false,
                state: WidgetState.Closed
            };
            runtimeInfos[widgetId] = Immutable(runtimeInfo);
        });
        return Immutable(runtimeInfos);
    }, [widgetIds, widgetsRuntimeInfo]);
};
/**
 * Gets the child layout json in the specified widget.
 */
export const useWidgetChildLayoutJson = (widgetId, layoutName) => {
    const layout = ReactRedux.useSelector((state) => {
        var _a, _b, _c, _d;
        const layouts = (_c = (_b = (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[layoutName];
        const browserSizeMode = state.browserSizeMode;
        const mainSizeMode = state.appConfig.mainSizeMode;
        const layoutId = searchUtils.findLayoutId(layouts, browserSizeMode, mainSizeMode);
        const layout = (_d = state.appConfig.layouts) === null || _d === void 0 ? void 0 : _d[layoutId];
        return layout;
    });
    return layout;
};
/**
 * Get the child layout json in the specified widget.
 */
export const getWidgetChildLayoutJson = (widgetId, layoutName) => {
    var _a, _b, _c, _d;
    const appConfig = getAppStore().getState().appConfig;
    const browserSizeMode = getAppStore().getState().browserSizeMode;
    const layouts = (_c = (_b = (_a = appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[layoutName];
    const layoutId = searchUtils.findLayoutId(layouts, browserSizeMode, appConfig.mainSizeMode);
    const layout = (_d = appConfig.layouts) === null || _d === void 0 ? void 0 : _d[layoutId];
    return layout;
};
/**
 * Get the layout json in current size mode.
 */
export const getCurrentLayoutJson = (layouts) => {
    var _a;
    const state = getAppStore().getState();
    const layoutId = searchUtils.findLayoutId(layouts, state.browserSizeMode, state.appConfig.mainSizeMode);
    return (_a = state.appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId];
};
/**
 *  Get visible orders from `layout`
 * @param layout
 */
export const getVisibleOrderFromLayout = (layout) => {
    var _a, _b, _c;
    const order = (_c = (_b = (_a = layout === null || layout === void 0 ? void 0 : layout.order) === null || _a === void 0 ? void 0 : _a.asMutable) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [];
    let layoutItems = order.map(itemId => { var _a; return (_a = layout.content) === null || _a === void 0 ? void 0 : _a[itemId]; });
    layoutItems = layoutItems.filter(layoutItem => (layoutItem && layoutItem.id && layoutItem.widgetId && !layoutItem.isPending));
    return layoutItems.map(layoutItem => layoutItem.id);
};
/**
 *  Gets the child widgets in the widget layout.
 * @param layout
 */
export const getWidgetIdsFromLayout = (layout) => {
    const order = getVisibleOrderFromLayout(layout);
    return order.map(itemId => { var _a, _b; return (_b = (_a = layout.content) === null || _a === void 0 ? void 0 : _a[itemId]) === null || _b === void 0 ? void 0 : _b.widgetId; });
};
//# sourceMappingURL=layout-utils.js.map