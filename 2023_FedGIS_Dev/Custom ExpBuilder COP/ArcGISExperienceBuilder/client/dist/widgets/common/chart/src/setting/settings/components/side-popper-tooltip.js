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
import { SidePopper } from 'jimu-ui/advanced/setting-components';
import { LabelTooltip } from './label-tooltip';
export const SidePopperTooltip = (props) => {
    const { className, title, tooltip } = props, others = __rest(props, ["className", "title", "tooltip"]);
    const Title = React.useMemo(() => {
        if (tooltip) {
            return React.createElement(LabelTooltip, { label: title, tooltip: tooltip, showArrow: true });
        }
        else {
            return title;
        }
    }, [title, tooltip]);
    return (React.createElement(SidePopper, Object.assign({ className: classNames('side-popper-info', className), title: Title }, others)));
};
//# sourceMappingURL=side-popper-tooltip.js.map