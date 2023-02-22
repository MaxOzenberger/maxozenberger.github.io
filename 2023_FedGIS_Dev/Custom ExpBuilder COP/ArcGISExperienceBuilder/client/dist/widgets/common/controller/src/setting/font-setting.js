import { React } from 'jimu-core';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { FontStyle } from 'jimu-ui/advanced/style-setting-components';
import { useTheme2 } from 'jimu-theme';
export const FontSetting = (props) => {
    const { bold, italic, underline, strike, color, onChange } = props;
    const theme = useTheme2();
    return (React.createElement("div", { className: 'font-setting d-flex align-items-center', role: 'group', "aria-label": props['aria-label'] },
        React.createElement(FontStyle, { bold: bold, italic: italic, underline: underline, strike: strike, onChange: onChange }),
        React.createElement(ThemeColorPicker, { specificTheme: theme, value: color, onChange: (value) => onChange('color', value) })));
};
//# sourceMappingURL=font-setting.js.map