/** @jsx jsx */
import { React, jsx, Immutable, DataSourceManager, defaultMessages as defaultMsgsCore, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput, TextArea, Button, Switch, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder';
import defaultMessages from './translations/default';
import { getStyleForFI } from './style';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
export default class FilterItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.dsManager = window && window.jimuConfig && window.jimuConfig.isBuilder
            ? DataSourceManager.getInstance()
            : DataSourceManager.getInstance();
        this.supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
        this.showSqlExprPopup = () => {
            this.setState({ isSqlExprShow: true });
        };
        this.toggleSqlExprPopup = () => {
            this.setState({ isSqlExprShow: !this.state.isSqlExprShow });
        };
        this.nameChange = (event) => {
            const value = event.target.value;
            this.setState({ itemLabel: value });
        };
        this.nameAccept = (value) => {
            value = value === null || value === void 0 ? void 0 : value.trim();
            value = value === '' ? this.props.name : value;
            if (value !== this.state.itemLabel) {
                this.setState({ itemLabel: value });
            }
            this.props.optionChange('name', value);
        };
        this.autoApplyChange = () => {
            this.props.optionChange('autoApplyWhenWidgetOpen', !this.props.autoApplyWhenWidgetOpen);
        };
        this.collapseChange = () => {
            this.props.optionChange('collapseFilterExprs', !this.props.collapseFilterExprs);
        };
        this.i18nMessage = (id, messages) => {
            messages = messages || defaultMessages;
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
        };
        this.state = {
            isSqlExprShow: false,
            itemLabel: this.props.name || ''
        };
    }
    componentDidUpdate(preProps, preState) {
        if (this.props.name !== preProps.name) {
            this.setState({ itemLabel: this.props.name || '' });
        }
    }
    render() {
        const { useDataSource, dataSource, sqlExprObj } = this.props;
        const isDisabled = !dataSource;
        return (jsx("div", { className: 'w-100 h-100', css: getStyleForFI(this.props.theme) },
            jsx("div", { className: 'w-100 h-100 filter-item-panel' },
                jsx("div", { className: 'setting-container' },
                    jsx(SettingSection, { title: this.i18nMessage('data'), className: "pt-0" },
                        jsx(SettingRow, null,
                            jsx(DataSourceSelector, { types: this.supportedDsTypes, disableRemove: () => true, useDataSources: useDataSource && dataSource ? Immutable([useDataSource]) : Immutable([]), mustUseDataSource: true, onChange: this.props.dataSourceChange, closeDataSourceListOnChange: true }))),
                    jsx(SettingSection, { title: this.i18nMessage('label', jimuUIMessages) },
                        jsx(SettingRow, null,
                            jsx(TextInput, { size: 'sm', type: 'text', className: 'w-100', value: this.state.itemLabel, onChange: this.nameChange, onAcceptValue: this.nameAccept, "aria-label": this.i18nMessage('label', jimuUIMessages) }))),
                    jsx(SettingSection, null,
                        jsx(SettingRow, { role: 'group', label: this.props.intl.formatMessage({ id: 'icon', defaultMessage: defaultMsgsCore.icon }), "aria-label": this.props.intl.formatMessage({ id: 'icon', defaultMessage: defaultMsgsCore.icon }) },
                            jsx(IconPicker, { icon: this.props.icon ? this.props.icon : null, onChange: (icon) => this.props.optionChange('icon', icon), configurableOption: 'none', setButtonUseColor: false }))),
                    jsx(SettingSection, { title: this.i18nMessage('sqlExpr'), role: 'group', "aria-label": this.i18nMessage('sqlExpr') },
                        jsx(SettingRow, { label: this.i18nMessage('sqlExprDesc'), flow: 'wrap' }),
                        jsx("div", { id: 'sql-expr-desc', className: 'sr-only' }, this.i18nMessage('sqlExprDesc')),
                        jsx(SettingRow, null,
                            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                jsx(Button, { className: 'w-100 text-dark set-link-btn', type: isDisabled ? 'secondary' : 'primary', disabled: isDisabled, onClick: this.showSqlExprPopup, title: this.i18nMessage('builderName', jimuUIMessages), "aria-describedby": 'sql-expr-desc' },
                                    jsx("div", { className: 'w-100 px-2 text-truncate' }, this.i18nMessage('builderName', jimuUIMessages))))),
                        jsx(SettingRow, null,
                            jsx(TextArea, { height: 80, className: 'w-100', spellCheck: false, placeholder: this.i18nMessage('setExprTips'), value: (sqlExprObj && sqlExprObj.displaySQL) ? sqlExprObj.displaySQL : '', onClick: e => e.currentTarget.select(), readOnly: true }))),
                    jsx(SettingSection, { role: 'grpup', className: 'border-0', title: this.i18nMessage('options'), "aria-label": this.i18nMessage('options') },
                        jsx(SettingRow, { label: this.i18nMessage('autoApplyWhenWidgetOpen') },
                            jsx(Switch, { checked: !!this.props.autoApplyWhenWidgetOpen, onChange: this.autoApplyChange, "aria-label": this.i18nMessage('autoApplyWhenWidgetOpen') })),
                        jsx(SettingRow, { label: this.i18nMessage('collapseFilterExprs') },
                            jsx(Switch, { checked: !!this.props.collapseFilterExprs, onChange: this.collapseChange, "aria-label": this.i18nMessage('collapseFilterExprs') }))),
                    !isDisabled &&
                        jsx(SqlExpressionBuilderPopup, { dataSource: dataSource, isOpen: this.state.isSqlExprShow, toggle: this.toggleSqlExprPopup, expression: sqlExprObj, onChange: this.props.onSqlExprBuilderChange })))));
    }
}
//# sourceMappingURL=filter-item.js.map