/**@jsx jsx */
import { jsx, css, Immutable } from 'jimu-core';
import { ColorsSelector } from './colors-selector';
import { applyPieSlicesColors } from '../utils';
import { ColorItem } from './color-item';
const defaultValue = Immutable([]);
const style = css `
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--dark-800);
  > .color-list {
    width: 100%;
    flex-grow: 1;
    overflow-y: auto;
  }
  > .footer {
    height: 43px;
    width: 100%;
    border-top: 1px solid #6a6a6a;
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }
`;
export const ByFieldColorList = (props) => {
    const { value: propValue = defaultValue, onChange, onColorsChange } = props;
    const handleChange = (index, slice) => {
        const slices = Immutable.set(propValue, index, slice);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    const handleColorsChange = (colors) => {
        onColorsChange === null || onColorsChange === void 0 ? void 0 : onColorsChange(colors);
        const slices = applyPieSlicesColors(propValue, colors);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    return (jsx("div", { className: 'color-match w-100', css: style },
        jsx("div", { className: 'color-list px-3' }, propValue.map((slice, index) => {
            return (jsx(ColorItem, { key: index, deletable: false, className: 'mb-2', value: slice, onChange: (val) => handleChange(index, val) }));
        })),
        jsx("div", { className: 'footer' },
            jsx("div", { className: 'px-3' },
                jsx(ColorsSelector, { className: 'my-2 w-100', onChange: handleColorsChange })))));
};
//# sourceMappingURL=by-field.js.map