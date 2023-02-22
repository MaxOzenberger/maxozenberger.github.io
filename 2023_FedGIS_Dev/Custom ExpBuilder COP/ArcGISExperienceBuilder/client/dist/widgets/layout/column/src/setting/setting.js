/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { Select, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { utils } from 'jimu-layouts/layout-runtime';
import { defaultConfig } from '../default-config';
import { Padding, InputUnit } from 'jimu-ui/advanced/style-setting-components';
import defaultMessages from './translations/default';
const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
const inputStyle = { width: 110 };
export default class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handleSpaceChange = (value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('space', value)
            });
            const appConfigAction = getAppConfigAction();
            this.getLayoutIds().forEach(layoutId => {
                appConfigAction.editLayoutSetting({ layoutId }, { space: value.distance });
            });
            appConfigAction.exec();
        };
        this.handlePaddingChange = (value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'padding'], value)
            });
            const appConfigAction = getAppConfigAction();
            this.getLayoutIds().forEach(layoutId => {
                appConfigAction.editLayoutSetting({ layoutId }, { padding: value });
            });
            appConfigAction.exec();
        };
        this.handleJustifyContentChange = (e) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'justifyContent'], e.target.value)
            });
            const appConfigAction = getAppConfigAction();
            this.getLayoutIds().forEach(layoutId => {
                appConfigAction.editLayoutSetting({ layoutId }, { justifyContent: e.target.value });
            });
            appConfigAction.exec();
        };
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({ id, defaultMessage: messages[id] });
        };
    }
    getLayoutIds() {
        const result = [];
        const { layouts } = this.props;
        if (layouts != null) {
            const layoutName = Object.keys(layouts)[0];
            const sizemodeLayouts = layouts[layoutName];
            Object.keys(sizemodeLayouts).forEach(sizemode => {
                result.push(sizemodeLayouts[sizemode]);
            });
        }
        return result;
    }
    getLayoutSetting() {
        var _a;
        const { layouts } = this.props;
        if (layouts != null) {
            const layoutName = Object.keys(layouts)[0];
            const sizemodeLayouts = layouts[layoutName];
            const layoutId = sizemodeLayouts[utils.getCurrentSizeMode()];
            const appConfigAction = getAppConfigAction();
            return (_a = appConfigAction.appConfig.layouts[layoutId]) === null || _a === void 0 ? void 0 : _a.setting;
        }
    }
    render() {
        var _a;
        const layoutSetting = this.getLayoutSetting();
        return (jsx("div", { className: 'flexbox-layout-setting' },
            jsx(SettingSection, { title: this.formatMessage('layout'), role: 'group', "aria-label": this.formatMessage('layout') },
                jsx(SettingRow, { label: this.formatMessage('verticalAlign') },
                    jsx(Select, { "aria-label": this.formatMessage('verticalAlign'), value: (_a = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.justifyContent) !== null && _a !== void 0 ? _a : 'flex-start', size: 'sm', onChange: this.handleJustifyContentChange, style: inputStyle },
                        jsx("option", { value: 'flex-start' }, this.formatMessage('start')),
                        jsx("option", { value: 'flex-end' }, this.formatMessage('end')),
                        jsx("option", { value: 'center' }, this.formatMessage('center')),
                        jsx("option", { value: 'space-around' }, this.formatMessage('spaceAround')),
                        jsx("option", { value: 'space-between' }, this.formatMessage('spaceBetween')),
                        jsx("option", { value: 'space-evenly' }, this.formatMessage('spaceEvenly')))),
                jsx(SettingRow, { label: this.formatMessage('gap') },
                    jsx(InputUnit, { "aria-label": this.formatMessage('gap'), value: { distance: (layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.space) >= 0 ? layoutSetting.space : defaultConfig.space, unit: undefined }, min: 0, onChange: this.handleSpaceChange, style: inputStyle })),
                jsx(SettingRow, { role: 'group', "aria-label": this.formatMessage('padding'), label: this.formatMessage('padding'), flow: 'wrap' },
                    jsx(Padding, { value: layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.padding, onChange: this.handlePaddingChange })))));
    }
}
//# sourceMappingURL=setting.js.map