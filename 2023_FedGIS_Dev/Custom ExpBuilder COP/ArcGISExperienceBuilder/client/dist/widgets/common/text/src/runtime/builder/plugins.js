import { React, appActions, getAppStore, ReactRedux } from 'jimu-core';
import { Bubble, Expression } from 'jimu-ui/advanced/rich-text-editor';
import { defaultMessages, hooks } from 'jimu-ui';
export const TextPlugins = (props) => {
    const { editor, formats, selection, useDataSources, widgetId, enabled, onInitResizeHandler } = props;
    const showExpression = ReactRedux.useSelector((state) => { var _a; return (_a = state.widgetsState[widgetId]) === null || _a === void 0 ? void 0 : _a.showExpression; });
    const translate = hooks.useTranslate(defaultMessages);
    //When version1 changes, `Bubble` will be hidden
    const [version1, setVersion1] = React.useState(0);
    //When version2 changes, `Expression` will be repositioned
    const [version2, setVersion2] = React.useState(0);
    const expressNodeRef = React.useRef(null);
    React.useEffect(() => {
        onInitResizeHandler === null || onInitResizeHandler === void 0 ? void 0 : onInitResizeHandler(() => {
            var _a;
            setVersion1(v => v + 1);
            (_a = expressNodeRef.current) === null || _a === void 0 ? void 0 : _a.classList.add('d-none');
        }, null, () => {
            var _a;
            setVersion2(v => v + 1);
            (_a = expressNodeRef.current) === null || _a === void 0 ? void 0 : _a.classList.remove('d-none');
        });
    }, [onInitResizeHandler]);
    const headerProps = React.useMemo(() => ({
        title: translate('dynamicContent'),
        onClose: () => getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showExpression', false))
    }), [widgetId, translate]);
    hooks.useUpdateEffect(() => {
        setVersion1(v => v + 1);
    }, [enabled]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Bubble, { editor: editor, formats: formats, selection: selection, source: 'user', version: version1 }),
        React.createElement(Expression, { ref: expressNodeRef, version: version2, source: 'user', editor: editor, formats: formats, selection: selection, open: showExpression, useDataSources: useDataSources, header: headerProps, widgetId: widgetId })));
};
//# sourceMappingURL=plugins.js.map