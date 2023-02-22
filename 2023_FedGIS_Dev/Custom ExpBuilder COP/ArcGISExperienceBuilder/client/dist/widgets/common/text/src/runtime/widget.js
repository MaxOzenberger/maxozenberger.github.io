/** @jsx jsx */
import { React, jsx, classNames, css, appActions, AppMode, Immutable, ReactRedux, expressionUtils, MutableStoreManager, getAppStore } from 'jimu-core';
import { Displayer } from './displayer';
import defaultMessages from './translations/default';
import { hooks, richTextUtils } from 'jimu-ui';
var RepeatType;
(function (RepeatType) {
    RepeatType[RepeatType["None"] = 0] = "None";
    RepeatType[RepeatType["Main"] = 1] = "Main";
    RepeatType[RepeatType["Sub"] = 2] = "Sub";
})(RepeatType || (RepeatType = {}));
const translate = (id, intl) => {
    return intl !== null ? intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }) : '';
};
const translatePlaceholder = (placeholder, intl) => {
    if (placeholder === defaultMessages.defaultPlaceholder) {
        placeholder = translate('defaultPlaceholder', intl);
    }
    return placeholder;
};
const style = css `
  /* Ensure that the cursor can be displayed when automatic width of layout */
  min-width: 12px;
`;
const Widget = (props) => {
    var _a, _b, _c;
    const { builderSupportModules, id, intl, useDataSources: propUseDataSources, repeatedDataSource, useDataSourcesEnabled, isInlineEditing, config, onInitResizeHandler } = props;
    const dispatch = ReactRedux.useDispatch();
    const { current: isInBuilder } = React.useRef(getAppStore().getState().appContext.isInBuilder);
    // Check whether the widget is selected in builder
    const selected = hooks.useWidgetSelected(id);
    const selectedRef = hooks.useRefValue(selected);
    const appMode = ReactRedux.useSelector((state) => state.appRuntimeInfo.appMode);
    const getAppConfigAction = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.jimuForBuilderLib.getAppConfigAction;
    const RichEditor = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.widgetModules.Editor;
    const builderUtils = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.widgetModules.builderUtils;
    const wrap = (_b = (_a = config === null || config === void 0 ? void 0 : config.style) === null || _a === void 0 ? void 0 : _a.wrap) !== null && _b !== void 0 ? _b : true;
    const text = config === null || config === void 0 ? void 0 : config.text;
    const tooltip = config === null || config === void 0 ? void 0 : config.tooltip;
    const placeholder = translatePlaceholder(config === null || config === void 0 ? void 0 : config.placeholder, intl);
    const useDataSources = useDataSourcesEnabled ? propUseDataSources : undefined;
    const useDataSourcesLength = (_c = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) !== null && _c !== void 0 ? _c : 0;
    const [repeat, setRepeat] = React.useState(RepeatType.Sub);
    // The expressions in rich-text
    const [expressions, setExpressions] = React.useState(null);
    // Check whether the text is in the list widget according to the repeatedDataSource
    //  If there is no repeatedDataSource, it is not in the list widget => RepeatType.None
    //  If repeatedDataSource.recordIndex is 0, means that it is the edited one in the list widget => RepeatType.Main
    //  If repeatedDataSource.recordIndex is not 0, means that it is the widget in the list that only displays text => RepeatType.Sub
    React.useEffect(() => {
        let repeat;
        if (repeatedDataSource == null) {
            repeat = RepeatType.None;
        }
        else {
            if (repeatedDataSource.recordIndex === 0) {
                repeat = RepeatType.Main;
            }
            else {
                repeat = RepeatType.Sub;
            }
        }
        setRepeat(repeat);
    }, [repeatedDataSource]);
    // When appMode changed, set `isInlineEditing` to false
    React.useEffect(() => {
        if (!selectedRef.current) {
            return;
        }
        if (appMode === AppMode.Run) {
            dispatch(appActions.setWidgetIsInlineEditingState(id, false));
        }
    }, [selectedRef, appMode, dispatch, id]);
    // When `isInlineEditing` changed, set `showExpression` to false
    hooks.useUpdateEffect(() => {
        if (!isInBuilder) {
            return;
        }
        if (!isInlineEditing) {
            dispatch(appActions.widgetStatePropChange(id, 'showExpression', false));
        }
    }, [isInlineEditing, dispatch, id]);
    /**
     * Determine whether it can be edited:
     * 1: When the widget is selected and not only used to display the text in the list(RepeatType.Sub), create the rich text editor for the setting panel to use
     * 2: Show rich text editor when `isInlineEditing`
     */
    const editingAbility = appMode === AppMode.Design && repeat !== RepeatType.Sub;
    const createEditor = editingAbility && selected;
    const editable = editingAbility && isInlineEditing;
    // Send `editor` instance to setting through `widgetMutableStatePropChange`
    const onEditorCreate = (editor) => {
        MutableStoreManager.getInstance().updateStateValue(id, 'editor', editor);
    };
    const onEditorDestory = () => {
        MutableStoreManager.getInstance().updateStateValue(id, 'editor', null);
    };
    const unMountingRef = React.useRef(false);
    React.useEffect(() => {
        return () => {
            unMountingRef.current = true;
        };
    }, []);
    hooks.useUpdateEffect(() => {
        let expressions = richTextUtils.getAllExpressions(text);
        expressions = expressions != null ? expressions : Immutable({});
        expressions = expressions.merge((tooltip != null ? { tooltip } : {}));
        setExpressions(expressions);
    }, [text, tooltip, useDataSourcesLength]);
    // Save text and placeholder to config
    const onEditorComplete = (value, placeholder) => {
        if (unMountingRef.current)
            return;
        if (!isInBuilder)
            return;
        getAppConfigAction().editWidget({ id, config: config.set('text', value).set('placeholder', placeholder) }).exec();
    };
    const handleExpressionChange = hooks.useEventCallback(() => {
        if (unMountingRef.current)
            return;
        if (!isInBuilder)
            return;
        const parts = builderUtils.getExpressionParts(expressions);
        const udsWithFields = expressionUtils.getUseDataSourceFromExpParts(parts, useDataSources);
        getAppConfigAction().editWidget({
            id,
            useDataSources: udsWithFields
        }).exec();
    });
    // When `expressions` changed, put the fields in `useDataSources`
    hooks.useUpdateEffect(() => {
        handleExpressionChange();
    }, [expressions, handleExpressionChange]);
    return (jsx("div", { "data-testid": 'text-widget', css: style, className: classNames('widget-text jimu-widget p-1') },
        createEditor && jsx(RichEditor, { className: classNames({ 'd-none': !editable }), widgetId: id, nowrap: !wrap, onInitResizeHandler: onInitResizeHandler, useDataSources: useDataSources, enabled: !!isInlineEditing, onCreate: onEditorCreate, onDestory: onEditorDestory, onComplete: onEditorComplete, placeholder: placeholder, preserveWhitespace: true, value: text }),
        jsx(Displayer, { className: classNames({ 'd-none': editable }), value: text, tooltip: tooltip, wrap: wrap, placeholder: placeholder, useDataSources: useDataSources, widgetId: id, repeatedDataSource: repeatedDataSource })));
};
export default Widget;
//# sourceMappingURL=widget.js.map