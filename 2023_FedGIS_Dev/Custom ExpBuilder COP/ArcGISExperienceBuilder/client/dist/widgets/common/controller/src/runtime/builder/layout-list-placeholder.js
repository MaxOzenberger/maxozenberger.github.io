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
import { classNames, React } from 'jimu-core';
import { styled } from 'jimu-theme';
import { ListPlaceholder } from '../common';
import { LayoutList } from './layout/layout-list';
const Root = styled.div `
  position: relative;
  width: 100%;
  height: 100%;
  .list-placeholder {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
`;
export const LayoutListPlaceholder = React.forwardRef((props, ref) => {
    var _a;
    const { showPlaceholder, itemStyle, space: propSpace, vertical } = props, others = __rest(props, ["showPlaceholder", "itemStyle", "space", "vertical"]);
    const space = vertical ? propSpace : itemStyle.labelGrowth;
    return React.createElement(Root, null,
        showPlaceholder && React.createElement(ListPlaceholder, { size: (_a = itemStyle.avatar) === null || _a === void 0 ? void 0 : _a.size, space: space, vertical: vertical }),
        React.createElement(LayoutList, Object.assign({ className: classNames({ invisible: showPlaceholder }), ref: ref, itemStyle: itemStyle, space: propSpace, vertical: vertical }, others)));
});
//# sourceMappingURL=layout-list-placeholder.js.map