/** @jsx jsx */
import { jsx, Immutable, css } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { getFillSymbol } from '../../../../../../utils/default';
import { LineSymbolSetting } from './line-symbol-setting';
import { useTheme2 } from 'jimu-theme';
const cssStyle = css `
  display: flex;
  width: 100%;
  > .divid-line {
    height: 25px;
    width: 2px;
  }
  > .line-symbol-setting {
    width: 80%;
    > .item.style-setting--line-style-selector {
    width: 42%;
    }
    > .item.style-setting--input-unit {
      width: 33%;
    }
  }
`;
const defaultFillSymbol = Immutable(getFillSymbol());
export const FillSymbolSetting = (props) => {
    const { presetFillColors, value: propValue = defaultFillSymbol, defaultFillColor, defaultLineColor, onChange } = props;
    const appTheme = useTheme2();
    const color = propValue === null || propValue === void 0 ? void 0 : propValue.color;
    const outline = propValue === null || propValue === void 0 ? void 0 : propValue.outline;
    const handleChange = (key, value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set(key, value));
    };
    const handleFillColorChange = (value) => {
        value = value || defaultFillColor;
        handleChange('color', value);
    };
    return (jsx("div", { className: 'fill-symbol-setting', css: cssStyle },
        jsx(ThemeColorPicker, { presetColors: presetFillColors, specificTheme: appTheme, className: 'item flex-shrink-0', onChange: handleFillColorChange, value: color }),
        jsx("div", { className: 'divid-line bg-secondary ml-2 mr-2' }),
        jsx(LineSymbolSetting, { outlineColorPicker: true, defaultColor: defaultLineColor, value: outline, onChange: value => handleChange('outline', value) })));
};
//# sourceMappingURL=fill-symbol-setting.js.map