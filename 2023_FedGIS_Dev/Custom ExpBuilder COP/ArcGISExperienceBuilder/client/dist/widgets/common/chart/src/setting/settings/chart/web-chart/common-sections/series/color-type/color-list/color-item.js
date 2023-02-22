/**@jsx jsx */
import { jsx, css, classNames, Immutable } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { convertStripColors } from '../utils';
import { Button, Label } from 'jimu-ui';
import { getTheme2 } from 'jimu-theme';
import { SeriesColors } from '../../../../../../../../utils/default';
import { MinusCircleOutlined } from 'jimu-icons/outlined/editor/minus-circle';
const presetSeriesColors = convertStripColors(SeriesColors);
const style = css `
  display: flex;
  width: 100%;
  justify-content: space-between;
  label {
    width: 88%;
    flex-grow: 1;
    display: inline-flex;
    justify-content: space-between;
    .label {
      max-width: 70%;
    }
  }
`;
const defaultValue = Immutable({});
export const ColorItem = (props) => {
    var _a, _b;
    const { className, value: propValue = defaultValue, onChange, deletable, onDelete } = props;
    const label = (_a = propValue.label) !== null && _a !== void 0 ? _a : propValue.sliceId;
    const color = (_b = propValue.fillSymbol) === null || _b === void 0 ? void 0 : _b.color;
    const appTheme = getTheme2();
    const handleColorChange = (color) => {
        const value = propValue.setIn(['fillSymbol', 'color'], color);
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    const handleDeleteClick = () => {
        onDelete === null || onDelete === void 0 ? void 0 : onDelete(propValue.sliceId);
    };
    return (jsx("div", { css: style, className: classNames('color-item', className) },
        jsx(Label, { check: true },
            jsx("span", { className: 'label text-truncate', title: label }, label),
            jsx(ThemeColorPicker, { disableReset: true, disableAlpha: !deletable, specificTheme: appTheme, presetColors: presetSeriesColors, value: color, onChange: handleColorChange })),
        deletable && jsx(Button, { type: 'tertiary', icon: true, size: 'sm', onClick: handleDeleteClick },
            jsx(MinusCircleOutlined, { size: 'm' }))));
};
//# sourceMappingURL=color-item.js.map