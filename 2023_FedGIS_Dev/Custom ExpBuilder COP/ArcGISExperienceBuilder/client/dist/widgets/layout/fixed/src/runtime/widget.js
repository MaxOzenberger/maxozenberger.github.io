/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { LayoutEntry } from 'jimu-layouts/layout-runtime';
import defaultMessages from './translations/default';
import { WidgetPlaceholder } from 'jimu-ui';
/* eslint-disable @typescript-eslint/no-var-requires */
const IconImage = require('./assets/icon.svg');
export default class Widget extends React.PureComponent {
    render() {
        const { layouts, id, intl, builderSupportModules } = this.props;
        const LayoutComponent = !window.jimuConfig.isInBuilder
            ? LayoutEntry
            : builderSupportModules.widgetModules.LayoutBuilder;
        if (LayoutComponent == null) {
            return (jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, "No layout component!"));
        }
        const layoutName = Object.keys(layouts)[0];
        return (jsx("div", { className: 'widget-fixed-layout d-flex w-100 h-100' },
            jsx(LayoutComponent, { layouts: layouts[layoutName], isInWidget: true, style: {
                    overflow: 'auto',
                    minHeight: 'none'
                } },
                jsx(WidgetPlaceholder, { icon: IconImage, widgetId: id, style: {
                        border: 'none'
                    }, message: intl.formatMessage({ id: 'tips', defaultMessage: defaultMessages.tips }) }))));
    }
}
//# sourceMappingURL=widget.js.map