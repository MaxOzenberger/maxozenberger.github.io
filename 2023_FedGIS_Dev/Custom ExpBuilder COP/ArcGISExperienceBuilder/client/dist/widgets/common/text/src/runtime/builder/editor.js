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
import { EditorPlaceholder } from './placeholder';
import { TextPlugins } from './plugins';
import { getInvalidDataSourceIds } from './utils';
const { useMemo, useCallback } = React;
export const usePlugin = (widgetId, useDataSources, enabled, onInitResizeHandler) => {
    return React.useMemo(() => {
        return ({ editor, selection, formats }) => {
            return jsx(TextPlugins, { editor: editor, selection: selection, formats: formats, widgetId: widgetId, useDataSources: useDataSources, enabled: enabled, onInitResizeHandler: onInitResizeHandler });
        };
    }, [enabled, onInitResizeHandler, useDataSources, widgetId]);
};
const INVALID_STYLE = css `
  opacity: 0.5;
  background: red;
  outline: 1px solid white;
`;
export const useInvalidStyle = (value, useDataSources) => {
    return useMemo(() => {
        // Find the invalid data source from the text
        // Because the text in config is not saved in real time,
        // so the update of invalid data source here may be delayed. [TODO]
        const dsids = getInvalidDataSourceIds(value, useDataSources);
        let expressionStyles;
        if (dsids != null && dsids.length > 0) {
            expressionStyles = dsids.map(dsid => {
                return css `
          exp[data-dsid*="${dsid}"] {
           ${INVALID_STYLE}
          }
        `;
            });
        }
        return css `${expressionStyles}`;
    }, [value, useDataSources]);
};
export const useEditorCycle = (onEditorCreate, onEditorDestory) => {
    return useCallback(editor => {
        return editor != null ? onEditorCreate === null || onEditorCreate === void 0 ? void 0 : onEditorCreate(editor) : onEditorDestory === null || onEditorDestory === void 0 ? void 0 : onEditorDestory();
    }, [onEditorCreate, onEditorDestory]);
};
export const Editor = (props) => {
    const { value, widgetId, useDataSources, onComplete, onCreate: onEditorCreate, onDestory: onEditorDestory, onInitResizeHandler, enabled } = props, others = __rest(props, ["value", "widgetId", "useDataSources", "onComplete", "onCreate", "onDestory", "onInitResizeHandler", "enabled"]);
    const [text, setText] = React.useState(value);
    const setEditor = useEditorCycle(onEditorCreate, onEditorDestory);
    const plugin = usePlugin(widgetId, useDataSources, enabled, onInitResizeHandler);
    const style = useInvalidStyle(text, useDataSources);
    return (jsx(EditorPlaceholder, Object.assign({ editorRef: setEditor, css: style, value: value, plugin: plugin, onChange: setText, onComplete: onComplete, enabled: enabled }, others)));
};
//# sourceMappingURL=editor.js.map