/** @jsx jsx */
import { React, jsx, Immutable, defaultMessages as jimuCoreMessages } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { defaultMessages as jimuUiMessages } from 'jimu-ui';
import CommonStyleSetting from './components/common-style-setting';
import IconStyleSetting from './components/icon-style-setting';
import FontStyleSetting from './components/font-style-setting';
export default class AdvanceStyleSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onTextChange = (text) => {
            const mergedStyle = this.getStyleFromCustomAndTheme();
            const style = mergedStyle.set('text', text);
            this.props.onChange(style);
        };
        this.onIconChange = (iconProps) => {
            const mergedStyle = this.getStyleFromCustomAndTheme();
            const style = mergedStyle.set('iconProps', iconProps);
            this.props.onChange(style);
        };
        this.onCommonChange = (commonStyle) => {
            const mergedStyle = this.getStyleFromCustomAndTheme();
            const style = Object.assign(Object.assign({}, mergedStyle), commonStyle);
            this.props.onChange(Immutable(style));
        };
        this.getStyleFromCustomAndTheme = () => {
            const themeStyle = this.props.themeStyle || Immutable({});
            const customStyle = this.props.style || Immutable({});
            return themeStyle.merge(customStyle);
        };
    }
    render() {
        const style = this.getStyleFromCustomAndTheme();
        return (jsx("div", { className: "advance-style-setting mt-3" },
            this.props.isTextSettingOpen && jsx("div", { className: "mb-3" },
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiMessages.text }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiMessages.text }) },
                    jsx(FontStyleSetting, { appTheme: this.props.appTheme, text: style.text, onChange: this.onTextChange }))),
            this.props.isIconSettingOpen && jsx("div", { className: "mb-3" },
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon }) },
                    jsx(IconStyleSetting, { appTheme: this.props.appTheme, intl: this.props.intl, iconProps: style.iconProps, onChange: this.onIconChange }))),
            jsx("div", { className: "mb-3" },
                jsx(CommonStyleSetting, { intl: this.props.intl, style: style, onChange: this.onCommonChange }))));
    }
}
//# sourceMappingURL=index.js.map