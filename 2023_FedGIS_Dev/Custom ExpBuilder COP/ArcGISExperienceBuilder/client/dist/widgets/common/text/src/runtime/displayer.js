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
import { React, jsx, css, ExpressionResolverComponent, expressionUtils, polished } from 'jimu-core';
import { DownDoubleOutlined } from 'jimu-icons/outlined/directional/down-double';
import { useTheme } from 'jimu-theme';
import { RichTextDisplayer, Scrollable } from 'jimu-ui';
const { useState, useEffect, useRef } = React;
const LEAVEDELAY = 500;
const useStyle = (wrap, fadeLength, theme) => {
    var _a, _b, _c, _d, _e;
    const white = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.white;
    const light500 = (_e = (_d = (_c = (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.palette) === null || _c === void 0 ? void 0 : _c.light) === null || _d === void 0 ? void 0 : _d[500]) !== null && _e !== void 0 ? _e : '#444';
    return React.useMemo(() => {
        const nowrap = css `
      .rich-displayer {
        white-space: nowrap !important;
      }
   `;
        return css `
      width: 100%;
      height: 100%;
      position: relative;
      overflow-y: hidden;
      .rich-displayer {
        width: 100%;
        height: fit-content;
      }

      ${!wrap && nowrap};
      .text-fade {
        position: absolute;
        left: 0;
        height: ${fadeLength};
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        pointer-events: none;
        > .arrow {
          position: absolute;
          width: 16px;
          height: 16px;
          background: ${white};
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          &.arrow-bottom {
            bottom: 4px;
          }
        }
        &.text-fade-bottom {
          bottom: 0;
          background: linear-gradient(180deg, rgba(182, 182, 182, 0) 0%, ${polished.rgba(light500, 0.5)} 100%);
        }
      }

      .bounce {
        animation-name: bounce;
        animation-duration:0.6s;
        animation-iteration-count:infinite;
        animation-timing-function:linear;
      }

      @keyframes bounce {
        0% { 
          transform: translateY(0px) 
        }
        50% {
          transform: translateY(2px)
        }
        100%{
          transform: translateY(4px)
        }
      }
    `;
    }, [white, light500, fadeLength, wrap]);
};
const getFadeLength = (height) => {
    if (height <= 80) {
        return '0px';
    }
    else if (height <= 140) {
        return '24px';
    }
    else {
        return '15%';
    }
};
export function Displayer(props) {
    var _a;
    const { value: propValue = '', placeholder, repeatedDataSource, useDataSources, widgetId, wrap, tooltip: propTooltip } = props, others = __rest(props
    // In order to preserve the style, we added some zero-width-no-break-space(\ufeff) when editing, we need to remove them for runtime
    , ["value", "placeholder", "repeatedDataSource", "useDataSources", "widgetId", "wrap", "tooltip"]);
    // In order to preserve the style, we added some zero-width-no-break-space(\ufeff) when editing, we need to remove them for runtime
    const value = React.useMemo(() => propValue.replace(/\ufeff/g, ''), [propValue]);
    const theme = useTheme();
    const rootRef = useRef();
    const isTextTooltip = expressionUtils.isSingleStringExpression(propTooltip);
    const [tooltip, setTooltip] = useState('');
    const [fadeLength, setFadeLength] = React.useState('24px');
    const [bottoming, setBottoming] = React.useState(false);
    const [scrollable, setScrollable] = React.useState(false);
    const [version, setVersion] = React.useState(0);
    const [showFade, setShowFade] = React.useState(false);
    const style = useStyle(wrap, fadeLength, theme);
    const syncScrollState = React.useCallback((scrollableState) => {
        if (scrollableState == null)
            return;
        const { scrollable, bottoming } = scrollableState;
        setBottoming(bottoming);
        setScrollable(scrollable);
    }, []);
    useEffect(() => {
        if (propTooltip != null && isTextTooltip) {
            const tooltip = expressionUtils.getSingleStringExpressionText(propTooltip);
            setTooltip(tooltip);
        }
    }, [propTooltip, isTextTooltip]);
    const onTiptipResolved = (res) => {
        if (res === null || res === void 0 ? void 0 : res.isSuccessful) {
            setTooltip(res.value);
        }
    };
    const timeoutRef = useRef();
    const handleEnter = () => {
        var _a, _b;
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const fadeLength = getFadeLength((_b = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight) !== null && _b !== void 0 ? _b : 0);
        setShowFade(fadeLength !== '0px');
        setVersion(v => v + 1);
        setFadeLength(fadeLength);
    };
    const delayLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowFade(false);
            timeoutRef.current = null;
        }, LEAVEDELAY);
    };
    return (jsx("div", Object.assign({ css: style, title: tooltip, onMouseEnter: handleEnter, onMouseLeave: delayLeave, ref: rootRef }, others),
        jsx(Scrollable, { ref: syncScrollState, version: version },
            jsx(RichTextDisplayer, { widgetId: widgetId, repeatedDataSource: repeatedDataSource, useDataSources: useDataSources, value: value, placeholder: placeholder })),
        showFade && scrollable && !bottoming && jsx("div", { className: 'text-fade text-fade-bottom' },
            jsx("span", { className: 'arrow arrow-bottom rounded-circle mr-1' },
                jsx(DownDoubleOutlined, { className: 'bounce', color: (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.black }))),
        (!isTextTooltip && propTooltip) && jsx(ExpressionResolverComponent, { useDataSources: useDataSources, expression: propTooltip, widgetId: widgetId, onChange: onTiptipResolved })));
}
//# sourceMappingURL=displayer.js.map