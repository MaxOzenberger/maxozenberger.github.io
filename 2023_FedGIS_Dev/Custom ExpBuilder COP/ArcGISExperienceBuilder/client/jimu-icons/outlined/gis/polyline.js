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
import { React, classNames } from 'jimu-core';
import src from '../../svg/outlined/gis/polyline.svg';
export const PolylineOutlined = (props) => {
    const SVG = window.SVG;
    const { className } = props, others = __rest(props, ["className"]);
    const classes = classNames('jimu-icon jimu-icon-component', className);
    if (!SVG)
        return React.createElement("svg", Object.assign({ className: classes }, others));
    return React.createElement(SVG, Object.assign({ className: classes, src: src }, others));
};
//# sourceMappingURL=polyline.js.map