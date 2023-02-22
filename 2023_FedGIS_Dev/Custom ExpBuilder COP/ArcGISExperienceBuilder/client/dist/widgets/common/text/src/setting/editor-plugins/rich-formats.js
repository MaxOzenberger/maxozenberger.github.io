var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { React, jsx, css, lodash } from 'jimu-core';
import { RichFormatsPanel } from './components/formats';
import { richTextEditorUtils, useEditorSelectionFormats } from 'jimu-ui/advanced/rich-text-editor';
import { useTheme2 } from 'jimu-theme';
const style = css `
  > * {
    user-select: none;
  }
`;
export const RichFormatPlugin = (props) => {
    const { quillEnabled, editor, onChange } = props, others = __rest(props, ["quillEnabled", "editor", "onChange"]);
    const [_formats, selection] = useEditorSelectionFormats(editor, true);
    const appTheme = useTheme2();
    const formats = React.useMemo(() => {
        var _a;
        let formats = richTextEditorUtils.mixinThemeTextFormats(appTheme, _formats);
        if (((_a = formats === null || formats === void 0 ? void 0 : formats.link) === null || _a === void 0 ? void 0 : _a.link) != null) {
            formats = lodash.assign({}, formats, { link: formats.link.link });
        }
        return formats;
    }, [_formats, appTheme]);
    const handleChange = (key, value, type) => {
        const source = quillEnabled ? 'user' : 'api';
        const formatParams = {
            type,
            key,
            value,
            selection,
            enabled: quillEnabled,
            source
        };
        richTextEditorUtils.formatText(editor, formatParams);
        onChange === null || onChange === void 0 ? void 0 : onChange(editor === null || editor === void 0 ? void 0 : editor.root.innerHTML);
    };
    return (jsx(RichFormatsPanel, Object.assign({ css: style, disableLink: !(selection === null || selection === void 0 ? void 0 : selection.length), disableIndent: !quillEnabled, formats: formats }, others, { onChange: handleChange })));
};
//# sourceMappingURL=rich-formats.js.map