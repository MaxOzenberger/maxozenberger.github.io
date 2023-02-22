import { React, Immutable, classNames } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { getTextSymbol } from '../../../../../../utils/default';
import { FontFamily } from 'jimu-ui/advanced/rich-text-editor';
import { FontStyle, InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { getTheme2 } from 'jimu-theme';
export const TextSymbolSetting = (props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const appTheme = getTheme2();
    const { className, value: propValue = Immutable(getTextSymbol()), defaultColor, onChange, onColorChange, onFontChange } = props;
    const family = (_a = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _a === void 0 ? void 0 : _a.family;
    const size = ((_b = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _b === void 0 ? void 0 : _b.size) != null ? `${(_c = propValue === null || propValue === void 0 ? void 0 : propValue.font.size) !== null && _c !== void 0 ? _c : 14}px` : '';
    const bold = ((_d = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _d === void 0 ? void 0 : _d.weight) === 'bold';
    const italic = ((_e = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _e === void 0 ? void 0 : _e.style) === 'italic';
    const underline = ((_f = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _f === void 0 ? void 0 : _f.decoration) === 'underline';
    const strike = ((_g = propValue === null || propValue === void 0 ? void 0 : propValue.font) === null || _g === void 0 ? void 0 : _g.decoration) === 'line-through';
    const color = propValue === null || propValue === void 0 ? void 0 : propValue.color;
    const handleColorChange = (color) => {
        color = color || defaultColor;
        onColorChange === null || onColorChange === void 0 ? void 0 : onColorChange(color);
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set('color', color));
    };
    const handleFontStyleChange = (_key, selected) => {
        let key = '';
        let value;
        if (_key === 'bold') {
            key = 'weight';
            value = selected ? 'bold' : 'normal';
        }
        if (_key === 'italic') {
            key = 'style';
            value = selected ? 'italic' : 'normal';
        }
        if (_key === 'underline') {
            key = 'decoration';
            value = selected ? 'underline' : 'none';
        }
        if (_key === 'strike') {
            key = 'decoration';
            value = selected ? 'line-through' : 'none';
        }
        onFontChange === null || onFontChange === void 0 ? void 0 : onFontChange(key, value);
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['font', key], value));
    };
    const handleFontChange = (family) => {
        onFontChange === null || onFontChange === void 0 ? void 0 : onFontChange('family', family);
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['font', 'family'], family));
    };
    const handleFontSizeChange = (value) => {
        if (value.distance == null)
            return;
        onFontChange === null || onFontChange === void 0 ? void 0 : onFontChange('size', value.distance);
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['font', 'size'], value.distance));
    };
    return (React.createElement("div", { className: classNames('text-symbol-setting w-100', className) },
        React.createElement(FontFamily, { className: 'w-100', font: family, onChange: handleFontChange }),
        React.createElement("div", { className: 'd-flex justify-content-between mt-2' },
            React.createElement(FontStyle, { style: { width: '45%' }, onChange: handleFontStyleChange, bold: bold, italic: italic, underline: underline, strike: strike }),
            React.createElement(ThemeColorPicker, { style: { width: '11%' }, specificTheme: appTheme, value: color, onChange: handleColorChange }),
            React.createElement(InputUnit, { style: { width: '35%' }, value: size, onChange: handleFontSizeChange }))));
};
//# sourceMappingURL=text-symbol-setting.js.map