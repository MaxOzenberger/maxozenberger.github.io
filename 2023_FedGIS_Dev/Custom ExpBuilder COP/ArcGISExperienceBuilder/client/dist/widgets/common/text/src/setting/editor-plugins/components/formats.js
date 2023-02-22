/** @jsx jsx */
import { jsx, css, classNames, polished, LinkType } from 'jimu-core';
import { FontFamily, Indent, Size, LinkSetting, ListValue, FormatType, RichTextFormatKeys } from 'jimu-ui/advanced/rich-text-editor';
import { Button, NumericInput, ButtonGroup, hooks } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { Effects } from './effects';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { FontStyle, TextAlignment } from 'jimu-ui/advanced/style-setting-components';
import { TextDotsOutlined } from 'jimu-icons/outlined/editor/text-dots';
import { TextNumberOutlined } from 'jimu-icons/outlined/editor/text-number';
import uppercaseOutlined from 'jimu-icons/svg/outlined/editor/uppercase.svg';
import colorFillFilled from 'jimu-icons/svg/filled/editor/color-fill.svg';
import { useTheme2 } from 'jimu-theme';
const DEFAULTLETTERSIZE = '0px';
const DEFAULLINESTACE = 1.5;
const style = css `
  > * {
    user-select: none;
  }
  .jimu-widget-setting--row {
    margin-top: ${polished.rem(12)};
  }
`;
export const RichFormatsPanel = (props) => {
    var _a, _b;
    const appTheme = useTheme2();
    const { formats = {}, onChange, className, style: propStyle, useDataSources, widgetId, disableIndent, disableLink } = props;
    const translate = hooks.useTranslate();
    const handleListChange = (value) => {
        const list = formats.list === value ? false : value;
        onChange === null || onChange === void 0 ? void 0 : onChange(RichTextFormatKeys.List, list, FormatType.BLOCK);
    };
    const handleLinespaceChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(RichTextFormatKeys.Linespace, value, FormatType.BLOCK);
    };
    const handleFontStyleChange = (key, value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(key, value, FormatType.INLINE);
    };
    const handleLinkChange = (key, value, type) => {
        var _a;
        const link = ((_a = value === null || value === void 0 ? void 0 : value.link) === null || _a === void 0 ? void 0 : _a.linkType) === LinkType.None ? false : value;
        onChange === null || onChange === void 0 ? void 0 : onChange(key, link, type);
    };
    return (jsx("div", { css: style, style: propStyle, className: classNames(className, 'format-panel') },
        jsx(SettingRow, null,
            jsx("div", { className: 'd-flex align-items-center justify-content-between w-100' },
                jsx(FontFamily, { "aria-label": translate('variableFontFamilyBase'), style: { width: '61%' }, font: formats.font, onChange: (v) => onChange(RichTextFormatKeys.Font, v, FormatType.INLINE) }),
                jsx(Size, { "aria-label": translate('fontSize'), style: { width: '35%' }, value: formats.size, onChange: (v) => onChange(RichTextFormatKeys.Size, v, FormatType.INLINE) }))),
        jsx(SettingRow, null,
            jsx("div", { className: 'd-flex align-items-center justify-content-between w-100' },
                jsx(FontStyle, { "aria-label": translate('fontStyle'), bold: formats[RichTextFormatKeys.Bold], italic: formats[RichTextFormatKeys.Italic], underline: formats[RichTextFormatKeys.Underline], strike: formats[RichTextFormatKeys.Strike], onChange: handleFontStyleChange }),
                jsx("div", { className: 'd-flex align-items-center justify-content-between', style: { width: '50%' } },
                    jsx(ThemeColorPicker, { icon: colorFillFilled, type: 'with-icon', "aria-label": translate('highlight'), title: translate('highlight'), specificTheme: appTheme, value: formats.background, onChange: (v) => onChange(RichTextFormatKeys.Background, v, FormatType.INLINE) }),
                    jsx(ThemeColorPicker, { icon: uppercaseOutlined, type: 'with-icon', title: translate('fontColor'), "aria-label": translate('fontColor'), specificTheme: appTheme, value: formats.color, onChange: (v) => onChange(RichTextFormatKeys.Color, v, FormatType.INLINE) }),
                    jsx(LinkSetting, { widgetId: widgetId, style: { width: 42 }, value: formats.link, disabled: disableLink, active: !!formats[RichTextFormatKeys.Link], useDataSources: useDataSources, onChange: handleLinkChange })))),
        jsx(SettingRow, null,
            jsx("div", { className: 'd-flex align-items-center justify-content-between w-100' },
                jsx(TextAlignment, { "aria-label": translate('textAlign'), autoFlip: true, textAlign: formats.align, showJustify: true, onChange: (value) => onChange(RichTextFormatKeys.Align, value, FormatType.BLOCK) }),
                jsx(ButtonGroup, { "aria-label": translate('ordered') },
                    jsx(Button, { title: translate('bullet'), active: formats.list === ListValue.BULLET, "aria-pressed": formats.list === ListValue.BULLET, icon: true, size: 'sm', onClick: () => handleListChange(ListValue.BULLET) },
                        jsx(TextDotsOutlined, null)),
                    jsx(Button, { title: translate('numbering'), active: formats.list === ListValue.ORDERED, "aria-pressed": formats.list === ListValue.ORDERED, icon: true, size: 'sm', onClick: () => handleListChange(ListValue.ORDERED) },
                        jsx(TextNumberOutlined, null))),
                jsx(Indent, { disabled: disableIndent, value: formats.indent, onClick: (value) => onChange(RichTextFormatKeys.Indent, value, FormatType.BLOCK) }))),
        jsx(SettingRow, { flow: 'no-wrap', label: translate('characterSpacing') },
            jsx(Size, { style: { width: '35%' }, "aria-label": translate('characterSpacing'), value: (_a = formats.letterspace) !== null && _a !== void 0 ? _a : DEFAULTLETTERSIZE, onChange: (v) => onChange(RichTextFormatKeys.Letterspace, v, FormatType.INLINE) })),
        jsx(SettingRow, { flow: 'no-wrap', label: translate('lineSpacing') },
            jsx(NumericInput, { style: { width: '35%' }, size: 'sm', "aria-label": translate('lineSpacing'), value: (_b = formats.linespace) !== null && _b !== void 0 ? _b : DEFAULLINESTACE, showHandlers: false, onAcceptValue: handleLinespaceChange })),
        jsx(SettingRow, { flow: 'wrap', label: translate('characterEffect') },
            jsx(Effects, { value: formats.textshadow, onChange: (v) => onChange(RichTextFormatKeys.Textshadow, v, FormatType.INLINE) }))));
};
//# sourceMappingURL=formats.js.map