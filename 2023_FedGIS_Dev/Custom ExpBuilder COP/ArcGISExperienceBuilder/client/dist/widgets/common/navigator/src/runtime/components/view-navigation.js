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
import { React, jsx, css, lodash } from 'jimu-core';
import { NavButtonGroup, PageNumber, Navigation, Slider } from 'jimu-ui';
import { getViewId, useAdvanceStyle } from '../utils';
/**
 * This is a composite component, which consists of four other components:
 * Navigation for `nav` type
 * Slider for `slider` type
 * NavButtonGroup for `NavButtonGroup` type
 * Pagination for `pagination` type
 */
// Define the magnification of slider type nav
const MAGNIFICATION = 100;
const style = css `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;
export const ViewNavigation = (props) => {
    const { data, progress = 0, type, navStyle, vertical, advanced, variant, onChange, activeView, standard } = props, others = __rest(props, ["data", "progress", "type", "navStyle", "vertical", "advanced", "variant", "onChange", "activeView", "standard"]);
    const { current, totalPage, showPageNumber, scrollable, disablePrevious, disableNext, previousText, previousIcon, nextText, nextIcon, showIcon, gap, alternateIcon, activedIcon, showText, showTitle, iconPosition, textAlign, hideThumb } = standard || {};
    const handleArrowChange = (previous) => {
        onChange === null || onChange === void 0 ? void 0 : onChange('navButtonGroup', previous);
    };
    const handleSliderChangeRef = React.useRef(() => 0);
    React.useEffect(() => {
        handleSliderChangeRef.current = lodash.throttle((evt) => {
            let value = +evt.target.value;
            value = Number((value / MAGNIFICATION).toFixed(2));
            onChange === null || onChange === void 0 ? void 0 : onChange('slider', value);
        }, 100);
        return () => {
            handleSliderChangeRef.current.cancel();
        };
    }, [onChange]);
    const handleSliderChange = (evt) => {
        var _a;
        (_a = evt.persist) === null || _a === void 0 ? void 0 : _a.call(evt);
        handleSliderChangeRef.current(evt);
    };
    const isActive = React.useCallback((item) => {
        return activeView === getViewId(item);
    }, [activeView]);
    //Generate component styles to override the default
    const advanceStyle = useAdvanceStyle(type, navStyle, advanced, variant, vertical, hideThumb);
    return jsx("div", Object.assign({ className: "navigation", css: [style, advanceStyle] }, others),
        type === 'nav' && jsx(Navigation, { vertical: vertical, isActive: isActive, scrollable: scrollable, data: data, gap: gap, type: navStyle, showIcon: showIcon, alternateIcon: alternateIcon, activedIcon: activedIcon, showText: showText, showTitle: showTitle || showText, isUseNativeTitle: true, iconPosition: iconPosition, textAlign: textAlign }),
        type === 'slider' && jsx(Slider, { className: "h-100", size: "sm", value: progress * MAGNIFICATION, hideThumb: hideThumb, onChange: handleSliderChange }),
        type === 'navButtonGroup' &&
            jsx(NavButtonGroup, { type: navStyle, previousText: previousText, previousIcon: previousIcon, nextText: nextText, nextIcon: nextIcon, vertical: vertical, disablePrevious: disablePrevious, disableNext: disableNext, onChange: handleArrowChange }, showPageNumber && jsx(PageNumber, { current: current, totalPage: totalPage })));
};
//# sourceMappingURL=view-navigation.js.map