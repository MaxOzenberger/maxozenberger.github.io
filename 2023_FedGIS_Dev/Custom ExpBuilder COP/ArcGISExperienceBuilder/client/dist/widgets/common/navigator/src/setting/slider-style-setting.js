/** @jsx jsx */
import { jsx, css } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { Tabs, Tab, hooks } from 'jimu-ui';
import { useTheme2 } from 'jimu-theme';
const state = 'default';
const style = css `
  .tab-title-item{
    width: 33%;
  }
`;
export const SliderStyleSetting = (props) => {
    var _a, _b, _c, _d;
    const appTheme = useTheme2();
    const { hideThumb, variant, onChange } = props;
    const translate = hooks.useTranslate();
    const trackBg = (_a = variant === null || variant === void 0 ? void 0 : variant.track) === null || _a === void 0 ? void 0 : _a.bg;
    const progress = (_b = variant === null || variant === void 0 ? void 0 : variant.progress) === null || _b === void 0 ? void 0 : _b[state];
    const thumb = (_c = variant === null || variant === void 0 ? void 0 : variant.thumb) === null || _c === void 0 ? void 0 : _c[state];
    return jsx(SettingRow, null,
        jsx(Tabs, { type: 'pills', className: "flex-grow-1 w-100 h-100", fill: true, css: style, defaultValue: 'active' },
            jsx(Tab, { id: "active", title: translate('active'), className: "tab-title-item" },
                jsx(SettingRow, { className: "mt-2", label: translate('color'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: progress.bg, onChange: (value) => onChange(['display', 'variant', 'progress', state, 'bg'], value) }))),
            !hideThumb && jsx(Tab, { id: "thumb", title: translate('thumb'), className: "tab-title-item" },
                jsx(SettingRow, { className: "mt-2", label: translate('fill'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: thumb === null || thumb === void 0 ? void 0 : thumb.bg, onChange: (value) => onChange(['display', 'variant', 'thumb', state, 'bg'], value) })),
                jsx(SettingRow, { label: translate('border'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: (_d = thumb === null || thumb === void 0 ? void 0 : thumb.border) === null || _d === void 0 ? void 0 : _d.color, onChange: (value) => onChange(['display', 'variant', 'thumb', state, 'border', 'color'], value) }))),
            jsx(Tab, { id: "inactive", title: translate('inactive'), className: "tab-title-item" },
                jsx(SettingRow, { className: "mt-2", label: translate('color'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: trackBg, onChange: (value) => onChange(['display', 'variant', 'track', 'bg'], value) })))));
};
//# sourceMappingURL=slider-style-setting.js.map