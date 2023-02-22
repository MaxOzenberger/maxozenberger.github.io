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
/** @jsx jsx */
import { jsx, css, polished, lodash, Immutable } from 'jimu-core';
import { NavQuickStyleItem, QuickStylePopper } from 'jimu-ui/advanced/setting-components';
import { generateDisplayKey } from './utils';
import { ViewNavigation } from './components/view-navigation';
const dummyNavData = Immutable([{ name: 'v1', value: 'p1,v1' }, { name: 'v2' }, { name: 'v3' }, { name: 'v4' }]);
const style = css `
  .body {
    display: flex;
    padding: ${polished.rem(10)} ${polished.rem(20)} ${polished.rem(20)} ${polished.rem(20)};
    width: ${polished.rem(260)};
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .quick-style-item:not(:last-of-type) {
      margin-bottom: 10px;
    }
  }
`;
export const NavQuickStyle = (props) => {
    const { templates, display, onChange, children } = props, others = __rest(props, ["templates", "display", "onChange", "children"]);
    return jsx(QuickStylePopper, Object.assign({}, others, { css: style, trapFocus: false, autoFocus: false }),
        jsx("div", { className: "body" }, templates.map((item, index) => {
            const template = Object.assign({}, item);
            const title = template.label;
            delete template.label;
            const navBtnStandard = item.type === 'navButtonGroup'
                ? {
                    current: 1,
                    totalPage: 4,
                    disablePrevious: true,
                    disableNext: false
                }
                : {};
            const navStandard = item.type === 'nav'
                ? {
                    scrollable: false
                }
                : {};
            const starndard = lodash.assign({}, template.standard, navBtnStandard, navStandard);
            return jsx(NavQuickStyleItem, { key: index, title: title, selected: (display === null || display === void 0 ? void 0 : display.advanced) ? false : generateDisplayKey(template) === generateDisplayKey(display), onClick: () => onChange(template) },
                jsx(ViewNavigation, { type: template.type, data: dummyNavData, navStyle: template.navStyle, activeView: "v1", standard: starndard }));
        })));
};
export default { NavQuickStyle };
//# sourceMappingURL=builder-support.js.map