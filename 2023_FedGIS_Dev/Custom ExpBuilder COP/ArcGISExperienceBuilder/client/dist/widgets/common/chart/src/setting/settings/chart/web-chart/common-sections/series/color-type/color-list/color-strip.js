/**@jsx jsx */
import { jsx, css, classNames } from 'jimu-core';
const style = css `
  display: flex;
  width: 100%;
  > .color-item {
    width: 30px;
    height: 16px;
  }
`;
export const ColorStrip = (props) => {
    const { className, colors, onChange } = props;
    return (jsx("div", { css: style, className: classNames('color-strip', className), onClick: () => onChange === null || onChange === void 0 ? void 0 : onChange(colors) }, colors.map((color, index) => {
        return jsx("div", { className: 'color-item', key: index, style: { backgroundColor: color } });
    })));
};
//# sourceMappingURL=color-strip.js.map