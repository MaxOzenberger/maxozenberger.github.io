/** @jsx jsx */
import { jsx } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { Tabs, Tab, hooks, defaultMessages as jimuUiDefaultMessages } from 'jimu-ui';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import defaultMessages from './translations/default';
import { useTheme2 } from 'jimu-theme';
import { FontSetting } from './font-setting';
const BoxStates = ['default', 'active', 'hover'];
export const SettingAdvanced = (props) => {
    const { variant, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuUiDefaultMessages);
    const theme = useTheme2();
    return (jsx(SettingRow, { className: "sw-controller__advanced-setting", flow: "wrap" },
        jsx(Tabs, { type: 'pills', className: "flex-grow-1 w-100 h-100", fill: true, defaultValue: BoxStates[0] }, BoxStates.map((state, x) => {
            const themeBoxStyles = variant === null || variant === void 0 ? void 0 : variant[state];
            return (jsx(Tab, { key: x, id: state, className: "tab-title-item", title: translate(state === 'active' ? 'selected' : state) },
                jsx(SettingRow, { className: "mt-3", label: translate('textFormatOverride'), flow: "no-wrap" },
                    jsx(FontSetting, { "aria-label": translate('textFormatOverride'), bold: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.bold, italic: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.italic, underline: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.underline, strike: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.strike, color: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.color, onChange: (key, value) => onChange(state, key, value) })),
                jsx(SettingRow, { className: "mt-2", label: translate('iconBackgroundOverride'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { "aria-label": translate('iconBackgroundOverride'), specificTheme: theme, value: themeBoxStyles === null || themeBoxStyles === void 0 ? void 0 : themeBoxStyles.bg, onChange: (value) => onChange(state, 'bg', value) }))));
        }))));
};
//# sourceMappingURL=setting-advanced.js.map