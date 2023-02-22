/** @jsx jsx */
import { css, polished, jsx, Immutable, classNames } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { LineStyleSelector, InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { getLineSymbol } from '../../../../../../utils/default';
import { useTheme2 } from 'jimu-theme';
const cssStyle = css `
  display: flex;
  justify-content: space-between;
  width: 100%;
  > .item {
    flex: 0 1 auto;
  }
  > .item.style-setting--line-style-selector {
    width: 45%;
  }
  > .item.style-setting--input-unit {
    width: 30%;
  }
  .jimu-builder--color {
    height: ${polished.rem(26)};
  }
`;
export const LineSymbolSetting = (props) => {
    const { className, presetColors, value: propValue = Immutable(getLineSymbol()), outlineColorPicker = false, defaultColor, onChange, onPropsChange } = props;
    const appTheme = useTheme2();
    const color = propValue.color;
    const style = propValue.style;
    const width = `${propValue.width}px`;
    const handleChange = (key, value) => {
        if (key === 'color') {
            value = value || defaultColor;
        }
        if (key === 'width' && value !== 0 && !value)
            return;
        onPropsChange === null || onPropsChange === void 0 ? void 0 : onPropsChange(key, value);
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set(key, value));
    };
    return (jsx("div", { className: classNames('line-symbol-setting', className), css: cssStyle },
        jsx(ThemeColorPicker, { presetColors: presetColors, outline: outlineColorPicker, specificTheme: appTheme, className: 'item', onChange: value => handleChange('color', value), value: color }),
        jsx(LineStyleSelector, { className: 'item', type: 'symbol', value: style, onChange: value => handleChange('style', value) }),
        jsx(InputUnit, { className: 'item', value: width, onChange: value => handleChange('width', value.distance) })));
};
//# sourceMappingURL=line-symbol-setting.js.map