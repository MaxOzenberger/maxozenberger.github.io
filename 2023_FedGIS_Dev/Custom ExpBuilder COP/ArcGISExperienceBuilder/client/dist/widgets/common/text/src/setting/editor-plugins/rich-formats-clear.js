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
import { React, jsx, css } from 'jimu-core';
import { richTextEditorUtils, RichTextFormatKeys, FormatType, useEditorSelectionFormats } from 'jimu-ui/advanced/rich-text-editor';
import { Button, hooks } from 'jimu-ui';
import { ClearFormatOutlined } from 'jimu-icons/outlined/editor/clear-format';
const style = css `
  > * {
    user-select: none;
  }
`;
const getAllSelection = (editor) => {
    let length = editor.getLength();
    length = length > 0 ? length - 1 : length;
    return { index: 0, length };
};
export const RichFormatClearPlugin = (props) => {
    const { quillEnabled, editor, onChange } = props, others = __rest(props, ["quillEnabled", "editor", "onChange"]);
    const [, _selection] = useEditorSelectionFormats(editor, true);
    const translate = hooks.useTranslate();
    const selection = React.useMemo(() => {
        if (!quillEnabled)
            return getAllSelection(editor);
        return _selection;
    }, [quillEnabled, _selection, editor]);
    const handleClick = () => {
        const source = quillEnabled ? 'user' : 'api';
        const formatValue = {
            type: FormatType.INLINE,
            key: RichTextFormatKeys.Clear,
            value: null,
            selection,
            source
        };
        richTextEditorUtils.formatText(editor, formatValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(editor === null || editor === void 0 ? void 0 : editor.root.innerHTML);
    };
    return (jsx(Button, Object.assign({ css: style }, others, { icon: true, type: 'tertiary', size: 'sm', onClick: handleClick, title: translate('clearAllFormats'), "aria-label": translate('clearAllFormats') }),
        jsx(ClearFormatOutlined, null)));
};
//# sourceMappingURL=rich-formats-clear.js.map