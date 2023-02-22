/** @jsx jsx */
import { React, ReactRedux } from 'jimu-core';
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime';
import { QueryWidgetContext } from './widget-context';
export function useAutoHeight() {
    const layoutInfo = React.useContext(QueryWidgetContext);
    let layoutId;
    let layoutItemId;
    if (layoutInfo.includes(':')) {
        const r = layoutInfo.split(':');
        layoutId = r[0];
        layoutItemId = r[1];
    }
    const isAuto = ReactRedux.useSelector((state) => {
        var _a, _b, _c, _d;
        const layoutItem = (_b = (_a = state.appConfig.layouts[layoutId]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b[layoutItemId];
        return ((_d = (_c = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.setting) === null || _c === void 0 ? void 0 : _c.autoProps) === null || _d === void 0 ? void 0 : _d.height) === LayoutItemSizeModes.Auto;
    });
    return isAuto;
}
//# sourceMappingURL=useAutoHeight.js.map