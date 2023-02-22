import { React, Immutable } from 'jimu-core';
import { TextInput, Radio } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
import { ExpressionInput, ExpressionInputType } from 'jimu-ui/advanced/expression-builder';
import { ImgSourceType, DynamicUrlType } from '../../config';
const expressionInputTypes = Immutable([ExpressionInputType.Static, ExpressionInputType.Attribute, ExpressionInputType.Statistics, ExpressionInputType.Expression]);
export default class ToolTipSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.getRenderContent = (label) => {
            if (this.props.useDataSourcesEnabled) {
                if (this.props.imgSourceType === ImgSourceType.ByDynamicUrl && (this.props.dynamicUrlType === DynamicUrlType.Attachment ||
                    this.props.dynamicUrlType === DynamicUrlType.Symbol)) {
                    if (this.props.dynamicUrlType === DynamicUrlType.Attachment) {
                        return (React.createElement("div", { className: 'w-100' },
                            React.createElement(SettingRow, { flow: 'wrap' },
                                React.createElement("div", { className: 'align-items-center d-flex' },
                                    React.createElement(Radio, { style: { cursor: 'pointer' }, onChange: () => this.props.onToolTipWithAttachmentNameChange(false), checked: !this.props.toolTipWithAttachmentName }),
                                    React.createElement("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.props.onToolTipWithAttachmentNameChange(false) }, this.props.intl.formatMessage({ id: 'imageCustom', defaultMessage: defaultMessages.imageCustom })))),
                            !this.props.toolTipWithAttachmentName && React.createElement(SettingRow, null,
                                React.createElement("div", { className: 'w-100 d-flex justify-content-end' },
                                    React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onToolTipExpChange, openExpPopup: this.props.openToolTipPopup, expression: this.props.toolTipExpression, isExpPopupOpen: this.props.isToolTipPopupOpen, closeExpPopup: this.props.closeToolTipPopup, types: expressionInputTypes, widgetId: this.props.widgetId }))),
                            React.createElement(SettingRow, null,
                                React.createElement("div", { className: 'align-items-center d-flex' },
                                    React.createElement(Radio, { style: { cursor: 'pointer' }, onChange: () => this.props.onToolTipWithAttachmentNameChange(true), checked: !!this.props.toolTipWithAttachmentName }),
                                    React.createElement("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.props.onToolTipWithAttachmentNameChange(true) }, this.props.intl.formatMessage({ id: 'imageAttachmentName', defaultMessage: defaultMessages.imageAttachmentName }))))));
                    }
                    if (this.props.dynamicUrlType === DynamicUrlType.Symbol) {
                        return (React.createElement("div", { style: { width: '100%', position: 'relative' }, role: 'group', "aria-label": label },
                            React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onToolTipExpChange, openExpPopup: this.props.openToolTipPopup, expression: this.props.toolTipExpression, isExpPopupOpen: this.props.isToolTipPopupOpen, closeExpPopup: this.props.closeToolTipPopup, types: expressionInputTypes, widgetId: this.props.widgetId })));
                    }
                }
                else {
                    return (React.createElement("div", { style: { width: '100%', position: 'relative' }, role: 'group', "aria-label": label },
                        React.createElement(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.props.onToolTipExpChange, openExpPopup: this.props.openToolTipPopup, expression: this.props.toolTipExpression, isExpPopupOpen: this.props.isToolTipPopupOpen, closeExpPopup: this.props.closeToolTipPopup, types: expressionInputTypes, widgetId: this.props.widgetId })));
                }
            }
            else {
                return (React.createElement("div", { style: { width: '100%', position: 'relative' } },
                    React.createElement(TextInput, { size: 'sm', style: { width: '100%' }, className: 'float-right', value: this.props.toolTipText, onChange: (event) => { this.props.onToolTipTextInputChange(event.target.value); }, onBlur: () => { this.props.toolTipConfigChange(); }, onKeyUp: () => { this.props.toolTipConfigChange(); }, "aria-label": label })));
            }
        };
    }
    render() {
        const label = this.props.intl.formatMessage({ id: 'toolTip', defaultMessage: defaultMessages.toolTip });
        return (React.createElement(SettingRow, { flow: 'wrap', label: label }, this.getRenderContent(label)));
    }
}
//# sourceMappingURL=tooltip-setting.js.map