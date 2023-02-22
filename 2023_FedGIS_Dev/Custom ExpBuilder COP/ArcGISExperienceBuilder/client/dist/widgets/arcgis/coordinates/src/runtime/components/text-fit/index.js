/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { getStyles } from './styles';
const { useEffect, useRef } = React;
export const TextAutoFit = React.memo((props) => {
    var _a, _b;
    const { text, className, widgetRect, domChange } = props;
    const outterContainerDom = useRef(null);
    const textDom = useRef(null);
    useEffect(() => {
        updateText();
    }, [text, widgetRect, (_a = outterContainerDom.current) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = outterContainerDom.current) === null || _b === void 0 ? void 0 : _b.clientHeight, domChange]);
    const updateText = () => {
        var _a, _b, _c, _d;
        const outterWidth = (_a = outterContainerDom.current) === null || _a === void 0 ? void 0 : _a.clientWidth;
        const outterHeight = (_b = outterContainerDom.current) === null || _b === void 0 ? void 0 : _b.clientHeight;
        const textWidth = (_c = textDom.current) === null || _c === void 0 ? void 0 : _c.clientWidth;
        const textHeight = (_d = textDom.current) === null || _d === void 0 ? void 0 : _d.clientHeight;
        if (!outterWidth || !textWidth || !outterHeight || !textHeight)
            return;
        if (textWidth !== outterWidth || textHeight !== outterHeight) {
            const widthRate = outterWidth / textWidth;
            const heightRate = outterHeight / textHeight;
            textDom.current.style.transform = `scale(${Math.min(widthRate, heightRate)})`;
        }
        else {
            textDom.current.style.transform = 'none';
        }
    };
    return jsx("div", { ref: outterContainerDom, css: getStyles(), className: className },
        jsx("div", { className: 'text', ref: textDom }, text));
});
//# sourceMappingURL=index.js.map