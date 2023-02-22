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
import { React } from 'jimu-core';
import { hooks, richTextUtils } from 'jimu-ui';
import { RichTextEditor, Delta, richTextEditorUtils } from 'jimu-ui/advanced/rich-text-editor';
import { replacePlaceholderTextContent } from '../../utils';
import { shouldShowPlaceholder, getDefaultValue, sanitizeHTML } from './utils';
const { useEffect, useRef, useState, useMemo } = React;
const useRefValues = (enabled, value, placeholder, onChange, onComplete) => {
    const ref = useRef({ enabled, value, placeholder, onChange, onComplete });
    useEffect(() => {
        ref.current = { enabled, value, placeholder, onChange, onComplete };
    }, [enabled, value, placeholder, onChange, onComplete]);
    return ref;
};
const modules = {
    toolbar: false,
    // Automatically convert address strings to anchor tags
    autoformat: {
        link: {
            trigger: /[\s]/,
            find: /https?:\/\/[\S]+|(www\.[\S]+)/gi,
            transform: function (value, noProtocol) {
                return noProtocol ? 'http://' + value : value;
            },
            format: 'link'
        }
    },
    // Remove images from content when pasting
    clipboard: {
        matchers: [['img', () => new Delta()]]
    }
};
// Selectors that match all content
const pasteMatcherSelector = '*';
// Identifies the trailing newline character in a string
const BreakLineReg = /(?!^\n$)[\n]/mg;
// Remove the trailing newline character on the pasted content
const pasteMatcherCallback = (_, delta) => {
    delta.forEach((op) => {
        if (typeof op.insert === 'string') {
            op.insert = op.insert.replace(BreakLineReg, ' ');
        }
    });
    return delta;
};
// Add a hook to the editor for pasted content
const addPasteMatcher = (editor) => {
    editor.clipboard.addMatcher(pasteMatcherSelector, pasteMatcherCallback);
};
// Remove the hook for pasted content for the editor
const removePasteMatcher = (editor) => {
    const matchers = editor.clipboard.matchers;
    let index = -1;
    matchers.some(([selector, callback], idx) => {
        if (selector === pasteMatcherSelector && callback === pasteMatcherCallback) {
            index = idx;
            return true;
        }
        else {
            return false;
        }
    });
    if (index > -1) {
        editor.clipboard.matchers.splice(index, 1);
        return true;
    }
};
/**
 * Sanitize and paste html to editor
 * @param html
 * @param editor
 */
const pasteContent = (editor, html) => {
    if (editor == null)
        return;
    // To fix issue #3092, add a hook that will remove all line break tag when pasting, this hook will affect this method
    // so remove the hook before pasting and restore it after pasting
    const hasPasteMatch = removePasteMatcher(editor);
    // Make sure the contents are sanitized before pasting
    html = sanitizeHTML(html);
    const delta = editor.clipboard.convert(html);
    editor.setContents(delta, 'silent');
    richTextEditorUtils.setEditorCursorEnd(editor, 'silent');
    if (hasPasteMatch) {
        addPasteMatcher(editor);
    }
};
export const EditorPlaceholder = (props) => {
    const { editorRef: editorRefProp, value: valueProp, placeholder: placeholderProp, enabled, onChange, onComplete } = props, others = __rest(props, ["editorRef", "value", "placeholder", "enabled", "onChange", "onComplete"]);
    const [editorRef, handleEditor] = hooks.useForwardRef(editorRefProp);
    const [value, setValue] = useState(valueProp);
    const [placeholder, setPlacehodler] = useState(placeholderProp);
    const refValues = useRefValues(enabled, value, placeholder, onChange, onComplete);
    // Only update defaultValue when the component mounted
    // eslint-disable-next-line
    const defaultValue = useMemo(() => getDefaultValue(enabled, value, placeholder), []);
    // When the content of the editor changes, the latest value is saved to the state
    const handleChange = hooks.useEventCallback((html, _, source) => {
        if (source === 'silent')
            return;
        // placeholder is editing
        if (shouldShowPlaceholder(value, placeholder, enabled)) {
            setPlacehodler(html);
        }
        else {
            // Otherwise, value is editing
            setValue(html);
            onChange === null || onChange === void 0 ? void 0 : onChange(html);
        }
    });
    hooks.useUpdateEffect(() => {
        setPlacehodler(placeholderProp);
        if (shouldShowPlaceholder(value, placeholderProp)) {
            const editor = editorRef.current;
            pasteContent(editor, placeholderProp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeholderProp]);
    hooks.useUpdateEffect(() => {
        const { value, placeholder, onComplete } = refValues.current;
        const editor = editorRef.current;
        if (!enabled) {
            // when enabled from true to false, try to show placeholder in editor
            if (shouldShowPlaceholder(value, placeholder)) {
                pasteContent(editor, placeholder);
            }
            onComplete === null || onComplete === void 0 ? void 0 : onComplete(value, placeholder);
        }
        else {
            const editor = editorRef.current;
            // when enabled from false to true, try to show the placeholder without textContent in editor
            if (shouldShowPlaceholder(value, placeholder)) {
                // Replace the textContent with a `zero width no-break space`(\uFEFF) for the placeholder to ensure the formats of placeholder can be inherited
                const value = replacePlaceholderTextContent(placeholder, richTextUtils.BLANK_CHARATER);
                pasteContent(editor, value);
                editor.focus();
            }
        }
    }, [enabled]);
    // Listen to paste events and process pasted content
    useEffect(() => {
        const editor = editorRef.current;
        if (editor != null) {
            addPasteMatcher(editor);
        }
    }, [editorRef]);
    // When unMounted, `onComplete` is triggered to return the modified `value` and `placeholder`
    hooks.useUnmount(() => {
        const { value, placeholder, onComplete } = refValues.current;
        onComplete === null || onComplete === void 0 ? void 0 : onComplete(value, placeholder);
    });
    return (React.createElement(RichTextEditor, Object.assign({ autoFocus: true, enabled: enabled, editorRef: handleEditor, onChange: handleChange, defaultValue: defaultValue, modules: modules }, others)));
};
//# sourceMappingURL=placeholder.js.map