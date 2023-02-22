/** @jsx jsx */
import { Immutable, classNames, css, jsx } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { getCircleMarkerSymbol } from '../../../../../../utils/default';
import { LineSymbolSetting } from './line-symbol-setting';
import { Slider } from 'jimu-ui';
import { useTheme2 } from 'jimu-theme';
const cssStyle = css `
  .divid-line {
    height: 25px;
    width: 2px;
  }
  .jimu-slider {
    flex-shrink: 1;
  }
`;
export const MarkSymbolSetting = (props) => {
    var _a;
    const { className, presetFillColors, presetLineColors, value: propValue = Immutable(getCircleMarkerSymbol()), defaultFillColor, defaultLineColor, onChange } = props;
    const appTheme = useTheme2();
    const color = propValue === null || propValue === void 0 ? void 0 : propValue.color;
    const size = (_a = propValue.size) !== null && _a !== void 0 ? _a : 0;
    const outline = propValue === null || propValue === void 0 ? void 0 : propValue.outline;
    const handleChange = (key, value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set(key, value));
    };
    const handleFillColorChange = (value) => {
        value = value || defaultFillColor;
        handleChange('color', value);
    };
    const handleSizeChange = (event) => {
        const value = parseInt(event.target.value) || 0;
        handleChange('size', value);
    };
    return (jsx("div", { className: classNames('marker-symbol-setting', className), css: cssStyle },
        jsx("div", { className: 'd-flex justify-content-between align-items-center' },
            jsx(ThemeColorPicker, { presetColors: presetFillColors, specificTheme: appTheme, className: 'item flex-shrink-0', onChange: handleFillColorChange, value: color }),
            jsx("div", { className: 'divid-line bg-secondary ml-2 mr-2' }),
            jsx(Slider, { min: 0, step: 1, max: 25, style: { width: '80%' }, value: size, onChange: handleSizeChange })),
        jsx(LineSymbolSetting, { className: 'mt-2', presetColors: presetLineColors, outlineColorPicker: true, defaultColor: defaultLineColor, value: outline, onChange: value => handleChange('outline', value) })));
};
//# sourceMappingURL=marker-symbol-setting.js.map