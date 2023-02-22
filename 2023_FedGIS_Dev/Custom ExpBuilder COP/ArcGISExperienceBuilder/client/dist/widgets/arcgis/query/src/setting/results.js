/** @jsx jsx */
import { React, jsx, css, Immutable } from 'jimu-core';
import { hooks, TextInput, TextArea, Select, Button, Popper, Checkbox, getFallbackPlacementsModifier } from 'jimu-ui';
import { Sort } from 'jimu-ui/advanced/sql-expression-builder';
import { SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { ExpressionBuilderType, ExpressionBuilder } from 'jimu-ui/advanced/expression-builder';
import defaultMessages from './translations/default';
import { FieldsType } from '../config';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { ResultsFieldSetting } from './results-field';
import { DataOutlined } from 'jimu-icons/outlined/data/data';
const MODIFIERS = [
    {
        name: 'preventOverflow',
        options: {
            altAxis: true
        }
    },
    getFallbackPlacementsModifier(['left-start', 'left-end'], true)
];
export function ResultsSetting(props) {
    var _a, _b;
    const { widgetId, queryItem, onQueryItemChanged, onPropertyChanged } = props;
    const [showContent, setShowContent] = React.useState(false);
    const [showExpressionBuilder, setShowExpressionBuilder] = React.useState(false);
    const expressionBuilderRef = React.useRef();
    const editorRef = React.useRef();
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    const [expression, setExpression] = React.useState(queryItem.resultTitleExpression);
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const show = React.useCallback(() => {
        setShowContent(true);
    }, [setShowContent]);
    const hide = React.useCallback(() => {
        setShowContent(false);
    }, [setShowContent]);
    const toggleExpressionBuilder = React.useCallback(() => {
        var _a;
        if (!showExpressionBuilder && editorRef.current) {
            (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        setShowExpressionBuilder(!showExpressionBuilder);
    }, [showExpressionBuilder]);
    const handleLabelChanged = (prop, value, defaultValue) => {
        if (value === defaultValue) {
            onPropertyChanged(prop, null);
        }
        else {
            onPropertyChanged(prop, value);
        }
    };
    const onQueryParamChange = (sortData) => {
        const { dataSourceId, mainDataSourceId, dataViewId, rootDataSourceId } = queryItem.useDataSource;
        const nextUseDataSource = {
            dataSourceId,
            mainDataSourceId,
            dataViewId,
            rootDataSourceId,
            fields: queryItem.useDataSource.fields
        };
        let newItem = queryItem.set('sortOptions', sortData);
        newItem = newItem.set('useDataSource', nextUseDataSource);
        onQueryItemChanged(newItem, true);
    };
    const handleTextChange = hooks.useEventCallback((e) => {
        setExpression(e.target.value);
    });
    const handleTextAccepted = hooks.useEventCallback((value) => {
        onPropertyChanged('resultTitleExpression', value, true);
    });
    const handleExpressionChange = hooks.useEventCallback((exp) => {
        var _a;
        if (exp.parts.length > 0) {
            if (expression != null) {
                setExpression(`${expression} {${exp.parts[0].jimuFieldName}}`);
            }
            else {
                setExpression(`{${exp.parts[0].jimuFieldName}}`);
            }
            (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    });
    return (jsx(SettingCollapse, { role: 'group', "aria-label": getI18nMessage('results'), label: getI18nMessage('results'), className: 'p-3', isOpen: showContent, onRequestOpen: show, onRequestClose: hide },
        jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('label') },
            jsx(TextInput, { "aria-label": getI18nMessage('label'), className: 'w-100', size: 'sm', value: (_a = currentItem.resultsLabel) !== null && _a !== void 0 ? _a : getI18nMessage('results'), onChange: (e) => handleLabelChanged('resultsLabel', e.target.value, getI18nMessage('results')) })),
        jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('chooseMode') },
            jsx(Select, { "aria-label": getI18nMessage('chooseMode'), className: 'w-100', size: 'sm', value: currentItem.resultFieldsType, onChange: (e) => {
                    onPropertyChanged('resultFieldsType', e.target.value, true);
                } },
                jsx("option", { value: FieldsType.PopupSetting }, getI18nMessage('field_PopupSetting')),
                jsx("option", { value: FieldsType.SelectAttributes }, getI18nMessage('field_SelectAttributes')))),
        jsx(SettingRow, null,
            jsx("label", null,
                jsx(Checkbox, { className: 'mr-2', checked: (_b = currentItem.resultExpandByDefault) !== null && _b !== void 0 ? _b : false, onChange: (_, checked) => onPropertyChanged('resultExpandByDefault', checked) }),
                jsx("span", null, getI18nMessage('expandByDefault')))),
        currentItem.resultFieldsType === FieldsType.SelectAttributes && (jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('configTitle') },
            jsx(TextArea, { "aria-label": getI18nMessage('configTitle'), className: 'mt-2 w-100', css: css `
              background-color: var(--light-200);
              z-index: 1;
            `, height: 80, onChange: handleTextChange, onAcceptValue: handleTextAccepted, spellCheck: false, value: expression, ref: editorRef }),
            jsx("div", { className: 'w-100', css: css `height: 32px; background-color: var(--light-200);` },
                jsx(Button, { "aria-label": getI18nMessage('configTitle'), ref: expressionBuilderRef, onClick: toggleExpressionBuilder, type: 'tertiary', icon: true },
                    jsx(DataOutlined, { size: 's' }))),
            jsx(Popper, { open: showExpressionBuilder, disableResize: true, placement: 'left-start', reference: expressionBuilderRef.current, modifiers: MODIFIERS, showArrow: true, toggle: toggleExpressionBuilder, trapFocus: false, autoFocus: false },
                jsx("div", { css: css `
              width: 240px;
              height: 360px;
              .component-main-data-and-view {
                display: none;
              }
              .field-list {
                height: calc(100% - 60px) !important;
              }
            ` },
                    jsx(ExpressionBuilder, { widgetId: widgetId, types: Immutable([ExpressionBuilderType.Attribute]), useDataSources: Immutable([queryItem.useDataSource]), expression: null, onChange: handleExpressionChange }))))),
        currentItem.resultFieldsType === FieldsType.SelectAttributes && (jsx(ResultsFieldSetting, { useDataSource: queryItem.useDataSource, label: getI18nMessage('configFields'), selectedFields: queryItem.resultDisplayFields, onFieldsChanged: (fields) => onPropertyChanged('resultDisplayFields', fields, true) })),
        jsx(SettingRow, { role: 'group', "aria-label": getI18nMessage('sortRecords'), flow: 'wrap', label: getI18nMessage('sortRecords'), css: css `.no-sort-remind {margin-top: 0 !important;}` },
            jsx(Sort, { onChange: (sortData) => onQueryParamChange(sortData), value: Immutable(currentItem.sortOptions), useDataSource: currentItem.useDataSource }))));
}
//# sourceMappingURL=results.js.map