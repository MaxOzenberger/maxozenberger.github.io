/** @jsx jsx */
import { React, jsx, css, DataSourceComponent, dataSourceUtils, Immutable } from 'jimu-core';
import { hooks, TextInput, TextArea, Switch, Collapse, Button } from 'jimu-ui';
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder';
import { getJimuFieldNamesBySqlExpression } from 'jimu-ui/basic/sql-expression-runtime';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
export function AttributeFilterSetting(props) {
    var _a, _b, _c, _d;
    const { queryItem, onQueryItemChanged, onPropertyChanged } = props;
    const [popperVisible, setPopperVisible] = React.useState(false);
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    // fill the queryItem with default values
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const enabled = currentItem.useAttributeFilter;
    const dataSourceIdAvailable = ((_a = currentItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId) != null;
    const showPopper = React.useCallback(() => {
        setPopperVisible(true);
    }, [setPopperVisible]);
    const hidePopper = React.useCallback(() => {
        setPopperVisible(false);
    }, [setPopperVisible]);
    const handleLabelChanged = (prop, value, defaultValue) => {
        if (value === defaultValue) {
            onPropertyChanged(prop, null);
        }
        else {
            onPropertyChanged(prop, value);
        }
    };
    const handleSqlExpressionChanged = (sqlExprObj) => {
        var _a;
        const { dataSourceId, mainDataSourceId, dataViewId, rootDataSourceId } = queryItem.useDataSource;
        const queryParams = {};
        const nextSqlExprObj = ((_a = sqlExprObj === null || sqlExprObj === void 0 ? void 0 : sqlExprObj.parts) === null || _a === void 0 ? void 0 : _a.length) > 0 ? sqlExprObj : null;
        queryParams.where = (sqlExprObj === null || sqlExprObj === void 0 ? void 0 : sqlExprObj.sql) ? sqlExprObj : undefined;
        let newItem = queryItem.set('sqlExprObj', nextSqlExprObj);
        const fields = getJimuFieldNamesBySqlExpression(Immutable(nextSqlExprObj));
        const nextUseDataSource = {
            dataSourceId,
            mainDataSourceId,
            dataViewId,
            rootDataSourceId,
            fields
        };
        newItem = newItem.set('useDataSource', nextUseDataSource);
        onQueryItemChanged(newItem, true);
    };
    const titleCompoent = (jsx("div", { className: 'd-flex' },
        jsx("div", null, getI18nMessage('attributeFilter')),
        jsx("div", { className: 'ml-auto' },
            jsx(Switch, { "aria-label": getI18nMessage('attributeFilter'), checked: enabled, onChange: (e) => onPropertyChanged('useAttributeFilter', e.target.checked) }))));
    return (jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('attributeFilter'), title: titleCompoent },
        jsx(Collapse, { isOpen: enabled },
            jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('label') },
                jsx(TextInput, { "aria-label": getI18nMessage('label'), className: 'w-100', size: 'sm', defaultValue: (_b = currentItem.attributeFilterLabel) !== null && _b !== void 0 ? _b : getI18nMessage('attributeFilter'), onAcceptValue: (value) => handleLabelChanged('attributeFilterLabel', value, getI18nMessage('attributeFilter')) })),
            jsx(SettingRow, { flow: 'wrap', truncateLabel: true, label: getI18nMessage('addSQLExpressionsToYourQuery') },
                jsx(Button, { className: 'w-100 text-dark set-link-btn', type: dataSourceIdAvailable ? 'primary' : 'secondary', disabled: !dataSourceIdAvailable, onClick: showPopper }, getI18nMessage('builderName'))),
            jsx(SettingRow, null,
                jsx(TextArea, { css: css `
              flex: 1;
            `, height: 80, value: (_d = (_c = currentItem.sqlExprObj) === null || _c === void 0 ? void 0 : _c.displaySQL) !== null && _d !== void 0 ? _d : '', spellCheck: false, readOnly: true, onClick: (e) => e.currentTarget.select(), placeholder: getI18nMessage('pleaseAddYourSQLExpressionsFirst') })),
            jsx(SettingRow, { label: getI18nMessage('description'), flow: 'wrap' },
                jsx(TextArea, { "aria-label": getI18nMessage('description'), height: 80, defaultValue: currentItem.attributeFilterDesc, placeholder: getI18nMessage('describeTheFilter'), onAcceptValue: (value) => onPropertyChanged('attributeFilterDesc', value) }))),
        jsx(DataSourceComponent, { useDataSource: currentItem.useDataSource }, (ds) => {
            // check if timezone is changed
            if (currentItem.sqlExprObj) {
                const sqlResult = dataSourceUtils.getArcGISSQL(currentItem.sqlExprObj, ds);
                if (sqlResult.displaySQL !== currentItem.sqlExprObj.displaySQL) {
                    handleSqlExpressionChanged(Object.assign({}, currentItem.sqlExprObj, sqlResult));
                }
            }
            return (jsx(SqlExpressionBuilderPopup, { dataSource: ds, isOpen: popperVisible, toggle: hidePopper, expression: currentItem.sqlExprObj, onChange: (expr) => handleSqlExpressionChanged(expr) }));
        })));
}
//# sourceMappingURL=attribute-filter.js.map