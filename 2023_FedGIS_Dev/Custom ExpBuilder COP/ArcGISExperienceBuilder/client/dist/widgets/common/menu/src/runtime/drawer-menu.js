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
import { React, jsx, ReactRedux } from 'jimu-core';
import { Button, Icon, Drawer, Navigation, PanelHeader, hooks } from 'jimu-ui';
import { useDrawerAdvanceStyle, useNavAdvanceStyle, useNavigationStyle } from './utils';
export const DrawerMenu = (props) => {
    var _a, _b;
    const [open, setOpen] = React.useState(false);
    const { icon, anchor, advanced, type, variant, paper, vertical } = props, others = __rest(props, ["icon", "anchor", "advanced", "type", "variant", "paper", "vertical"]);
    const toggle = () => setOpen(open => !open);
    const drawerStyle = useDrawerAdvanceStyle(advanced, variant, paper);
    const navStyle = useNavAdvanceStyle(advanced, type, variant, true);
    const isInSmallDevice = hooks.useCheckSmallBrowserSzieMode();
    const navigationStyle = useNavigationStyle(isInSmallDevice);
    const currentPageId = ReactRedux.useSelector((state) => state.appRuntimeInfo.currentPageId);
    React.useEffect(() => {
        setOpen(false);
    }, [currentPageId]);
    return (jsx(React.Fragment, null,
        jsx("div", { className: 'button-container w-100 h-100 d-flex align-items-center justify-content-center' },
            jsx(Button, { icon: true, type: 'tertiary', onClick: toggle },
                jsx(Icon, { className: 'caret-icon', icon: icon === null || icon === void 0 ? void 0 : icon.svg, color: (_a = icon === null || icon === void 0 ? void 0 : icon.properties) === null || _a === void 0 ? void 0 : _a.color, size: (_b = icon === null || icon === void 0 ? void 0 : icon.properties) === null || _b === void 0 ? void 0 : _b.size }))),
        jsx(Drawer, { anchor: anchor, open: open, toggle: toggle, autoFlip: false, css: drawerStyle },
            jsx(PanelHeader, { className: 'header', title: '', onClose: toggle }),
            jsx(Navigation, Object.assign({ className: isInSmallDevice ? 'w-100' : 'menu-navigation', vertical: vertical, css: [navigationStyle, navStyle], type: type, showTitle: true, isUseNativeTitle: true, right: true }, others)))));
};
//# sourceMappingURL=drawer-menu.js.map