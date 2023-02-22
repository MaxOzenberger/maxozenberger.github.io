/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { GridLayoutSetting } from 'jimu-layouts/layout-builder';
export default class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({ id });
        };
    }
    render() {
        const layoutName = Object.keys(this.props.layouts)[0];
        const layouts = this.props.layouts[layoutName];
        return jsx(GridLayoutSetting, { layouts: layouts, appTheme: this.props.theme2, formatMessage: this.formatMessage });
    }
}
//# sourceMappingURL=setting.js.map