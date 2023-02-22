var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { React, classNames, WidgetState, ReactRedux } from 'jimu-core';
import { ScrollList } from '../../common/scroll-list';
import { getListItemLength } from '../../common/utils';
import { BASE_LAYOUT_NAME, DROP_ZONE_PLACEHOLDER_WIDTH } from '../../../common/consts';
import { LayoutContext } from 'jimu-layouts/layout-runtime';
import { DrapZone } from './drop-zone';
import { LayoutItem } from './layout-item';
import { isLayoutItemAcceptedForController, useDeleteSyncWidgetFromLayout } from '../utils';
import { getBuilderThemeVariables } from 'jimu-theme';
import { getVisibleOrderFromLayout, useControlledWidgets, useWidgetChildLayoutJson } from '../../common/layout-utils';
export const LayoutList = React.forwardRef((props, ref) => {
    const { widgetId, draggable, itemStyle, vertical, className, space, dropZoneRef, onItemClick, onClick, scrollRef, markerEnabled = true } = props, others = __rest(props, ["widgetId", "draggable", "itemStyle", "vertical", "className", "space", "dropZoneRef", "onItemClick", "onClick", "scrollRef", "markerEnabled"]);
    const layouts = ReactRedux.useSelector((state) => { var _a, _b, _c; return (_c = (_b = (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[BASE_LAYOUT_NAME]; });
    const layout = useWidgetChildLayoutJson(widgetId, BASE_LAYOUT_NAME);
    const order = getVisibleOrderFromLayout(layout);
    const builderTheme = getBuilderThemeVariables();
    //Get all open state widgets in controller
    const widgets = useControlledWidgets(widgetId, BASE_LAYOUT_NAME);
    const openingWidgets = Object.keys(widgets).filter((widgetId) => widgets[widgetId].state === WidgetState.Opened);
    const itemLength = getListItemLength(itemStyle, space);
    const placeholderProps = {
        color: builderTheme === null || builderTheme === void 0 ? void 0 : builderTheme.colors.palette.primary[700],
        size: [itemLength, DROP_ZONE_PLACEHOLDER_WIDTH]
    };
    const removeSyncWidgetFromLayout = useDeleteSyncWidgetFromLayout(widgetId, BASE_LAYOUT_NAME);
    const createItem = (itemId, className) => {
        const layoutItem = layout.content[itemId];
        const widgetId = (layoutItem && layoutItem.widgetId) || '';
        const active = openingWidgets.includes(widgetId);
        return (React.createElement(LayoutItem, Object.assign({}, itemStyle, { key: itemId, className: classNames(`layout-${layout === null || layout === void 0 ? void 0 : layout.id}-item layout-item`, className), widgetid: widgetId, layoutId: layout.id, layoutItemId: itemId, draggable: draggable, markerEnabled: markerEnabled, layoutItem: layoutItem, active: active, removeWidget: removeSyncWidgetFromLayout, onClick: onItemClick })));
    };
    return (React.createElement(LayoutContext.Provider, { value: { isItemAccepted: isLayoutItemAcceptedForController } },
        React.createElement("div", { ref: ref, className: "layout controller-layout w-100 h-100", "data-layoutid": layout.id, onClick: onClick },
            React.createElement(DrapZone, { widgetId: widgetId, vertical: vertical, layout: layout, childClass: `layout-${layout.id}-item`, placeholder: placeholderProps, layouts: layouts }),
            React.createElement(ScrollList, Object.assign({}, others, { scrollRef: scrollRef, className: classNames(className, 'layout-item-list'), vertical: vertical, itemLength: itemLength, space: space, autoHideArrow: true, lists: order, autoScrollEnd: true, createItem: createItem })))));
});
//# sourceMappingURL=layout-list.js.map