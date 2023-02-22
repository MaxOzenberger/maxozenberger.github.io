import { React, Immutable, DataSourceComponent } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { Label, Radio } from 'jimu-ui';
import { DynamicUrlType } from '../../config';
import { ExpressionInput, ExpressionInputType } from 'jimu-ui/advanced/expression-builder';
import defaultMessages from '../translations/default';
import { MainDataAndViewSelector, DataViewPriority } from 'jimu-ui/advanced/data-source-selector';
const expressionInputTypes = Immutable([ExpressionInputType.Attribute, ExpressionInputType.Expression]);
export default class DynamicUrlSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.getRenderContent = (ds) => {
            const supportExpression = true;
            const supportAttachment = ds && ds.supportAttachment();
            const supportSymbol = ds && ds.supportSymbol();
            if (ds) {
                if ((!supportAttachment && this.props.dynamicUrlType === DynamicUrlType.Attachment) || (!supportSymbol && this.props.dynamicUrlType === DynamicUrlType.Symbol)) {
                    this.props.onTypeNoSupportChange && this.props.onTypeNoSupportChange();
                }
                if (!supportSymbol && !supportAttachment) {
                    return this.getExpressionSettingWithoutRadio();
                }
                else {
                    return (React.createElement("div", { className: 'w-100' },
                        supportExpression && this.getExpressionSettingWithRadio(),
                        supportAttachment && React.createElement("div", { className: 'w-100 d-flex justify-content-end mt-3', "data-testid": 'dynamicurl-attachment' },
                            React.createElement("div", { className: 'w-100' },
                                React.createElement(SettingRow, { flow: 'wrap' },
                                    React.createElement("div", { className: 'd-flex justify-content-between w-100' },
                                        React.createElement("div", { className: 'align-items-center d-flex' },
                                            React.createElement(Label, { className: 'd-flex align-items-center m-0' },
                                                React.createElement(Radio, { style: { cursor: 'pointer' }, onChange: () => this.props.onDynamicUrlTypeChanged(DynamicUrlType.Attachment), checked: this.props.dynamicUrlType === DynamicUrlType.Attachment }),
                                                React.createElement("div", { className: 'ml-2' }, this.props.intl.formatMessage({ id: 'imageAttachment', defaultMessage: defaultMessages.imageAttachment }))))),
                                    this.props.dynamicUrlType === DynamicUrlType.Attachment && React.createElement("div", { className: 'd-flex w-100 justify-content-end mt-3' },
                                        React.createElement(MainDataAndViewSelector, { hideMainDataSourceSelect: true, widgetId: this.props.widgetId, useDataSources: this.props.useDataSources, selectedUseDataSource: this.props.useDataSourceForMainDataAndViewSelector, onChange: this.props.onSelectedUseDsChangeForAttachment, isSelectedFromRepeatedDataSourceContext: this.props.isSelectedFromRepeatedDataSourceContext, usePopulatedDataView: true, useSelectionDataView: true, defaultDataViewPriority: DataViewPriority.First }))))),
                        supportSymbol && React.createElement("div", { className: 'w-100 d-flex justify-content-end mt-3' },
                            React.createElement("div", { className: 'w-100' },
                                React.createElement(SettingRow, { flow: 'wrap' },
                                    React.createElement("div", { className: 'd-flex justify-content-between w-100' },
                                        React.createElement("div", { className: 'align-items-center d-flex' },
                                            React.createElement(Label, { className: 'd-flex align-items-center m-0' },
                                                React.createElement(Radio, { style: { cursor: 'pointer' }, onChange: () => this.props.onDynamicUrlTypeChanged(DynamicUrlType.Symbol), checked: this.props.dynamicUrlType === DynamicUrlType.Symbol }),
                                                React.createElement("div", { className: 'ml-2' }, this.props.intl.formatMessage({ id: 'imageSymbol', defaultMessage: defaultMessages.imageSymbol }))))),
                                    this.props.dynamicUrlType === DynamicUrlType.Symbol && React.createElement("div", { className: 'd-flex w-100 justify-content-end mt-3' },
                                        React.createElement(MainDataAndViewSelector, { hideMainDataSourceSelect: true, widgetId: this.props.widgetId, useDataSources: this.props.useDataSources, selectedUseDataSource: this.props.useDataSourceForMainDataAndViewSelector, isSelectedFromRepeatedDataSourceContext: this.props.isSelectedFromRepeatedDataSourceContext, onChange: this.props.onSelectedUseDsChangeForSymbol, usePopulatedDataView: true, useSelectionDataView: true, defaultDataViewPriority: DataViewPriority.First })))))));
                }
            }
            else {
                return this.getExpressionSettingWithoutRadio();
            }
        };
        this.getExpressionSettingWithRadio = () => {
            // const useDataSources = this.props.useDataSources || [];
            // const dataSourceIds: ImmutableArray<string> = useDataSources[0] ? Immutable([useDataSources[0].dataSourceId]) : Immutable([]);
            return (React.createElement("div", { className: 'w-100 d-flex justify-content-end' },
                React.createElement("div", { className: 'w-100' },
                    React.createElement("div", { className: 'd-flex w-100 align-items-center' },
                        React.createElement(Label, { className: 'd-flex align-items-center m-0' },
                            React.createElement(Radio, { style: { cursor: 'pointer' }, onChange: () => this.props.onDynamicUrlTypeChanged(DynamicUrlType.Expression), checked: (this.props.dynamicUrlType === DynamicUrlType.Expression) || !this.props.dynamicUrlType, "data-testid": 'dynamicurl-expression' }),
                            React.createElement("div", { className: 'ml-2' }, "URL"))),
                    (this.props.srcExpression || this.props.dynamicUrlType === DynamicUrlType.Expression || !this.props.dynamicUrlType) &&
                        React.createElement("div", { className: 'd-flex w-100 justify-content-end mt-3' },
                            React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onSrcExpChange, openExpPopup: this.props.openSrcPopup, expression: this.props.srcExpression, isExpPopupOpen: this.props.isSrcPopupOpen, closeExpPopup: this.props.closeSrcPopup, types: expressionInputTypes, widgetId: this.props.widgetId })))));
        };
        this.getExpressionSettingWithoutRadio = () => {
            // const useDataSources = this.props.useDataSources || [];
            // const dataSourceIds: ImmutableArray<string> = useDataSources[0] ? Immutable([useDataSources[0].dataSourceId]) : Immutable([]);
            return (React.createElement("div", { className: 'w-100 d-flex justify-content-end' },
                React.createElement("div", { className: 'w-100' },
                    React.createElement("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        React.createElement("label", { className: 'm-0' }, "URL")),
                    this.props.srcExpression ||
                        (this.props.dynamicUrlType === DynamicUrlType.Expression || !this.props.dynamicUrlType)
                        ? React.createElement("div", { className: 'mt-2', style: { width: '100%', position: 'relative' } },
                            React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onSrcExpChange, openExpPopup: this.props.openSrcPopup, expression: this.props.srcExpression, isExpPopupOpen: this.props.isSrcPopupOpen, closeExpPopup: this.props.closeSrcPopup, types: expressionInputTypes, widgetId: this.props.widgetId }))
                        : React.createElement("div", { className: 'mt-2', style: { width: '100%', position: 'relative' } },
                            React.createElement("div", { className: 'w-100 h-100', style: { position: 'absolute', opacity: 0.5, backgroundColor: 'gray', zIndex: 100 } }),
                            React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onSrcExpChange, openExpPopup: this.props.openSrcPopup, expression: this.props.srcExpression, isExpPopupOpen: this.props.isSrcPopupOpen, closeExpPopup: this.props.closeSrcPopup, types: expressionInputTypes, widgetId: this.props.widgetId })))));
        };
    }
    render() {
        let useDataSource = null;
        if (this.props.useDataSources) {
            for (let i = 0; i < this.props.useDataSources.length; i++) {
                useDataSource = this.props.useDataSources[0];
            }
        }
        return (React.createElement(SettingRow, { flow: 'wrap' },
            useDataSource && React.createElement(DataSourceComponent, { useDataSource: useDataSource }, (ds) => {
                return this.getRenderContent(ds);
            }),
            !useDataSource && this.getExpressionSettingWithoutRadio()));
    }
}
//# sourceMappingURL=dynamicurl-setting.js.map