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
import { React, jsx, css, lodash, dateUtils } from 'jimu-core';
import { interact } from 'jimu-core/dnd';
import { Tooltip } from 'jimu-ui';
import { DATE_PATTERN, TIME_PATTERN } from '../../utils/utils';
import { bindResizeHandler, getLineInfo } from './utils';
const MODIFIERS = [{
        name: 'offset',
        options: {
            offset: [0, 10]
        }
    }];
const InputRange = function (props) {
    const { width, isRTL, shadowHeight, extent, intl, onChange } = props, others = __rest(props, ["width", "isRTL", "shadowHeight", "extent", "intl", "onChange"]);
    const { startValue, endValue } = others;
    const [range, setRange] = React.useState([startValue, endValue]);
    const [interactable, setIteractable] = React.useState(null);
    const resizeRef = React.useRef(null);
    const startRef = React.useRef(null);
    const endRef = React.useRef(null);
    React.useEffect(() => {
        const debounceFunc = lodash.debounce(() => {
            if (interactable) {
                interactable.unset();
            }
            if (resizeRef.current) {
                setIteractable(bindResizeHandler(interact, resizeRef.current, range[0], range[1], extent, width, setRange, onChange));
            }
        }, 50);
        debounceFunc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extent]);
    React.useEffect(() => {
        setRange([startValue, endValue]);
    }, [startValue, endValue]);
    const lineInfo = React.useMemo(() => {
        return getLineInfo(width, extent, range[0], range[1]);
    }, [width, extent, range]);
    const startLabel = React.useMemo(() => {
        return dateUtils.formatDateLocally(range[0], intl, DATE_PATTERN, TIME_PATTERN);
    }, [intl, range]);
    const endLabel = React.useMemo(() => {
        return dateUtils.formatDateLocally(range[1], intl, DATE_PATTERN, TIME_PATTERN);
    }, [intl, range]);
    return (jsx(React.Fragment, null,
        jsx("span", { className: 'range-shadow', css: css `
          left: ${isRTL ? 'unset' : lineInfo.marginLeft};
          right: ${isRTL ? lineInfo.marginLeft : 'unset'};
          width: ${lineInfo.width};
          height: ${shadowHeight + 'px'};
        ` }),
        jsx("div", { className: 'layer-line extent-line', style: { width: width } },
            jsx("div", { className: 'resize-handlers', ref: el => (resizeRef.current = el), style: lineInfo },
                jsx(Tooltip, { placement: 'bottom', modifiers: MODIFIERS, title: startLabel },
                    jsx("button", { className: 'resize-handler resize-left', ref: ref => { startRef.current = ref; } })),
                jsx(Tooltip, { placement: 'bottom', modifiers: MODIFIERS, title: endLabel },
                    jsx("button", { className: 'resize-handler resize-right', ref: ref => { endRef.current = ref; } }))))));
};
export default InputRange;
//# sourceMappingURL=input-range.js.map