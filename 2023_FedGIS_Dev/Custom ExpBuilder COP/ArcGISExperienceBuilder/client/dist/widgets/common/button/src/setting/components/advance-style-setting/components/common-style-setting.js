/** @jsx jsx */
import { React, Immutable, jsx } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { defaultMessages as jimuUIMessages } from 'jimu-ui';
import { BoxShadowSetting, BorderSetting, BorderRadiusSetting, BackgroundSetting } from 'jimu-ui/advanced/style-setting-components';
export default class CommonStyleSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onBackgroundStyleChange = bg => {
            var _a, _b;
            let background = Immutable((_b = (_a = this.props.style) === null || _a === void 0 ? void 0 : _a.background) !== null && _b !== void 0 ? _b : {});
            for (const key in bg) {
                switch (key) {
                    case 'fillType':
                        if (background.fillType !== bg[key]) {
                            background = background.set('fillType', bg[key]);
                        }
                        break;
                    case 'color':
                        background = background.set('color', bg[key]);
                        break;
                    case 'image':
                        background = background.set('image', bg[key]);
                        break;
                }
            }
            this.props.onChange(this.getStyleSettings().set('background', background));
        };
        this.updateBorder = bd => {
            this.props.onChange(this.getStyleSettings().set('border', bd));
        };
        this.updateRadius = radius => {
            this.props.onChange(this.getStyleSettings().set('borderRadius', radius));
        };
        this.updateShadow = shadow => {
            this.props.onChange(this.getStyleSettings().set('boxShadow', shadow));
        };
    }
    getStyleSettings() {
        return this.props.style ? Immutable(this.props.style) : Immutable({});
    }
    render() {
        const style = this.props.style || Immutable({});
        return (jsx("div", { className: "common-style-setting" },
            jsx("div", { className: "mb-3" },
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'background', defaultMessage: jimuUIMessages.background }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'background', defaultMessage: jimuUIMessages.background }) },
                    jsx(BackgroundSetting, { background: style.background, onChange: this.onBackgroundStyleChange }))),
            jsx("div", { className: "mb-3" },
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'border', defaultMessage: jimuUIMessages.border }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'border', defaultMessage: jimuUIMessages.border }) },
                    jsx(BorderSetting, { value: style.border, onChange: this.updateBorder })),
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'borderRadius', defaultMessage: jimuUIMessages.borderRadius }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'borderRadius', defaultMessage: jimuUIMessages.borderRadius }) },
                    jsx(BorderRadiusSetting, { value: style.borderRadius, onChange: this.updateRadius }))),
            jsx("div", { className: "mb-3" },
                jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'shadow', defaultMessage: jimuUIMessages.shadow }) }),
                jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'shadow', defaultMessage: jimuUIMessages.shadow }) },
                    jsx(BoxShadowSetting, { value: style.boxShadow, onChange: this.updateShadow })))));
    }
}
//# sourceMappingURL=common-style-setting.js.map