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
import { React, jsx, css } from 'jimu-core';
import { Navigation } from 'jimu-ui';
import { DrawerMenu } from './drawer-menu';
import { useAvtivePage, useNavigationData, useAnchor, useNavAdvanceStyle } from './utils';
const { useMemo } = React;
const useStyle = (vertical) => {
    return useMemo(() => {
        return css `
      width: 100%;
      height: 100%;
      .nav-item {
        &.nav-link {
          width: ${vertical ? '100%' : 'unset'};
          height: ${!vertical ? '100%' : 'unset'};
        }
      }
    `;
    }, [vertical]);
};
export const MenuNavigation = (props) => {
    const { type, menuStyle, vertical, standard, advanced, paper, variant } = props;
    const data = useNavigationData();
    const isActive = useAvtivePage();
    const { icon, anchor: _anchor } = standard, others = __rest(standard, ["icon", "anchor"]);
    const anchor = useAnchor(_anchor);
    const style = useStyle(vertical);
    const navStyle = useNavAdvanceStyle(advanced, menuStyle, variant, vertical);
    return (jsx("div", { className: 'menu-navigation', css: [style, navStyle] },
        type === 'nav' && (jsx(Navigation, Object.assign({ data: data, vertical: vertical, isActive: isActive, showTitle: true, isUseNativeTitle: true, scrollable: true, right: true }, others, { type: menuStyle }))),
        type === 'drawer' && (jsx(DrawerMenu, Object.assign({ data: data, advanced: advanced, variant: variant, paper: paper, type: menuStyle, vertical: vertical, isActive: isActive, scrollable: false, icon: icon, anchor: anchor }, others)))));
};
//# sourceMappingURL=menu-navigation.js.map