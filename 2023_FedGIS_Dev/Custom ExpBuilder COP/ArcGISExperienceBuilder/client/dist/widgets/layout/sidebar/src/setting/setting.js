/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import SidebarLayoutSetting from './layout-setting';
import { defaultConfig } from '../config';
import defaultMessages from './translations/default';
export default class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({ id, defaultMessage: defaultMessages[id] });
        };
    }
    render() {
        const { config, id, onSettingChange } = this.props;
        return (jsx(SidebarLayoutSetting, { widgetId: id, config: config || defaultConfig, formatMessage: this.formatMessage, onSettingChange: onSettingChange }));
    }
}
//# sourceMappingURL=setting.js.map