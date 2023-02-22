import { React, Immutable, ReactRedux, getAppStore, AllDataSourceTypes } from 'jimu-core';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import { Switch, defaultMessages as jimuUiMessage, hooks, richTextUtils, TextArea } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { RichFormatPlugin } from './editor-plugins/rich-formats';
import { RichFormatClearPlugin } from './editor-plugins/rich-formats-clear';
import defaultMessages from './translations/default';
import { ExpressionInput, ExpressionInputType } from 'jimu-ui/advanced/expression-builder';
import { replacePlaceholderTextContent } from '../utils';
const SUPPORTED_TYPES = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
const defaultExpressionInputTypes = Immutable([ExpressionInputType.Static, ExpressionInputType.Attribute, ExpressionInputType.Statistics, ExpressionInputType.Expression]);
const DefaultUseDataSources = Immutable([]);
const Setting = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { id, intl, config, useDataSources, useDataSourcesEnabled, onSettingChange } = props;
    const placeholderEditable = ((_b = (_a = getAppStore().getState().appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appInfo) === null || _b === void 0 ? void 0 : _b.type) === 'Web Experience Template';
    const wrap = (_d = (_c = config === null || config === void 0 ? void 0 : config.style) === null || _c === void 0 ? void 0 : _c.wrap) !== null && _d !== void 0 ? _d : true;
    const text = config === null || config === void 0 ? void 0 : config.text;
    const placeholder = config === null || config === void 0 ? void 0 : config.placeholder;
    const placeholderText = React.useMemo(() => { var _a; return (_a = richTextUtils.getHTMLTextContent(placeholder)) !== null && _a !== void 0 ? _a : ''; }, [placeholder]);
    const tooltip = config === null || config === void 0 ? void 0 : config.tooltip;
    const appStateInBuilder = ReactRedux.useSelector((state) => state.appStateInBuilder);
    const mutableStateVersion = (_f = (_e = appStateInBuilder === null || appStateInBuilder === void 0 ? void 0 : appStateInBuilder.widgetsMutableStateVersion) === null || _e === void 0 ? void 0 : _e[id]) === null || _f === void 0 ? void 0 : _f.editor;
    const isInlineEditing = (_h = (_g = appStateInBuilder === null || appStateInBuilder === void 0 ? void 0 : appStateInBuilder.widgetsRuntimeInfo) === null || _g === void 0 ? void 0 : _g[id]) === null || _h === void 0 ? void 0 : _h.isInlineEditing;
    const hasDataSource = useDataSourcesEnabled && (useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0;
    const [editor, setEditor] = React.useState(null);
    const [openTip, setOpenTip] = React.useState(false);
    React.useEffect(() => {
        var _a;
        const mutableStoreManager = window._appWindow._mutableStoreManager;
        const editor = (_a = mutableStoreManager === null || mutableStoreManager === void 0 ? void 0 : mutableStoreManager.getStateValue([id, 'editor'])) !== null && _a !== void 0 ? _a : null;
        setEditor(editor);
    }, [mutableStateVersion, id]);
    const translate = hooks.useTranslate(defaultMessages, jimuUiMessage);
    const handleDataSourceChange = (useDataSources) => {
        if (useDataSources == null) {
            return;
        }
        onSettingChange({
            id,
            useDataSources: useDataSources
        });
    };
    const toggleUseDataEnabled = () => {
        onSettingChange({ id, useDataSourcesEnabled: !useDataSourcesEnabled });
    };
    const toggleWrap = () => {
        onSettingChange({
            id,
            config: config.setIn(['style', 'wrap'], !wrap)
        });
    };
    const handleTooltipChange = (expression) => {
        if (expression == null) {
            return;
        }
        onSettingChange({
            id,
            config: config.set('tooltip', expression)
        });
        setOpenTip(false);
    };
    const handlePlaceholderTextChange = (text) => {
        text = text.replace(/\n/mg, '');
        const newPlaceholder = replacePlaceholderTextContent(placeholder, text);
        onSettingChange({
            id,
            config: config.set('placeholder', newPlaceholder)
        });
    };
    const handleTextChange = (value) => {
        const onlyPlaceholder = richTextUtils.isBlankRichText(text) && !!placeholder;
        const key = !isInlineEditing && onlyPlaceholder ? 'placeholder' : 'text';
        onSettingChange({
            id,
            config: config.set(key, value)
        });
    };
    const expInputFroms = hasDataSource ? defaultExpressionInputTypes : Immutable([ExpressionInputType.Static]);
    return (React.createElement("div", { className: 'widget-setting-text jimu-widget-setting' },
        React.createElement(SettingSection, null,
            React.createElement(SettingRow, null,
                React.createElement(DataSourceSelector, { isMultiple: true, types: SUPPORTED_TYPES, useDataSources: useDataSources, useDataSourcesEnabled: useDataSourcesEnabled, onToggleUseDataEnabled: toggleUseDataEnabled, onChange: handleDataSourceChange, widgetId: id }))),
        React.createElement(SettingSection, null,
            React.createElement(SettingRow, { flow: 'no-wrap', label: translate('wrap') },
                React.createElement(Switch, { checked: wrap, onChange: toggleWrap, "aria-label": translate('wrap') })),
            React.createElement(SettingRow, { label: translate('tooltip') }),
            React.createElement(SettingRow, null,
                React.createElement("div", { className: 'w-100' },
                    React.createElement(ExpressionInput, { "aria-label": translate('tooltip'), autoHide: true, useDataSources: hasDataSource ? useDataSources : DefaultUseDataSources, onChange: handleTooltipChange, openExpPopup: () => setOpenTip(true), expression: typeof tooltip === 'object' ? tooltip : null, isExpPopupOpen: openTip, closeExpPopup: () => setOpenTip(false), types: expInputFroms, widgetId: id }))),
            placeholderEditable && React.createElement(SettingRow, { flow: 'wrap', label: translate('placeholder') },
                React.createElement(TextArea, { "aria-label": translate('placeholder'), defaultValue: placeholderText, onAcceptValue: handlePlaceholderTextChange }))),
        editor != null && React.createElement(SettingSection, null,
            React.createElement(SettingRow, { flow: 'no-wrap', label: intl.formatMessage({ id: 'textFormat', defaultMessage: jimuUiMessage.textFormat }) },
                React.createElement(RichFormatClearPlugin, { quillEnabled: isInlineEditing, editor: editor, onChange: handleTextChange })),
            React.createElement(SettingRow, null,
                React.createElement(RichFormatPlugin, { quillEnabled: isInlineEditing, editor: editor, useDataSources: useDataSources, widgetId: id, onChange: handleTextChange })))));
};
export default Setting;
//# sourceMappingURL=setting.js.map