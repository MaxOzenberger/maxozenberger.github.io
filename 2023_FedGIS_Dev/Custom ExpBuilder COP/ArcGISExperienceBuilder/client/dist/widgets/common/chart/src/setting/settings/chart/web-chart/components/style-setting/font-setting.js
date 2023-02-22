import { React, Immutable, classNames } from 'jimu-core';
import { defaultMessages, hooks } from 'jimu-ui';
import { FontFamily } from 'jimu-ui/advanced/rich-text-editor';
import { InputUnit, FontStyle } from 'jimu-ui/advanced/style-setting-components';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getFont } from '../../../../../../utils/default';
const FontStyleTypes = ['bold', 'italic', 'underline'];
export const FontSetting = (props) => {
    var _a;
    const translate = hooks.useTranslate(defaultMessages);
    const { className, value: propValue = Immutable(getFont()), onChange } = props;
    const family = propValue.family;
    const size = `${(_a = propValue.size) !== null && _a !== void 0 ? _a : 14}px`;
    const bold = (propValue === null || propValue === void 0 ? void 0 : propValue.weight) === 'bold';
    const italic = (propValue === null || propValue === void 0 ? void 0 : propValue.style) === 'italic';
    const underline = (propValue === null || propValue === void 0 ? void 0 : propValue.decoration) === 'underline';
    const handleChange = (key, value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set(key, value));
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
        handleChange(key, value);
    };
    return (React.createElement("div", { className: classNames(className, 'font-setting w-100') },
        React.createElement(SettingRow, { flow: 'no-wrap', label: translate('font') },
            React.createElement(FontFamily, { className: 'w-50', font: family, onChange: value => handleChange('family', value) })),
        React.createElement(SettingRow, { flow: 'no-wrap', label: translate('fontSize') },
            React.createElement(InputUnit, { className: 'w-50', value: size, onChange: value => handleChange('size', value.distance) })),
        React.createElement(SettingRow, { flow: 'no-wrap', label: translate('fontStyle') },
            React.createElement(FontStyle, { onChange: handleFontStyleChange, types: FontStyleTypes, bold: bold, italic: italic, underline: underline }))));
};
//# sourceMappingURL=font-setting.js.map