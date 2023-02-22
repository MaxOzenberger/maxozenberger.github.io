/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { WidgetPlaceholder } from 'jimu-ui';
import { ColumnLayoutViewer } from 'jimu-layouts/layout-runtime';
import defaultMessages from './translations/default';
/* eslint-disable @typescript-eslint/no-var-requires */
const IconImage = require('./assets/icon.svg');
export default class Widget extends React.PureComponent {
    getStyle() {
        return css `
      & > div.column-layout {
        height: 100%;
        overflow: hidden;
        display: flex;

        & > .trail-container {
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
        }
      }
    `;
    }
    render() {
        const { layouts, id, intl, builderSupportModules } = this.props;
        const LayoutComponent = !window.jimuConfig.isInBuilder
            ? ColumnLayoutViewer
            : builderSupportModules.widgetModules.ColumnLayoutBuilder;
        if (LayoutComponent == null) {
            return (jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, "No layout component!"));
        }
        const layoutName = Object.keys(layouts)[0];
        return (jsx("div", { className: 'widget-column-layout w-100 h-100', css: this.getStyle(), style: { overflow: 'auto' } },
            jsx(LayoutComponent, { layouts: layouts[layoutName] },
                jsx(WidgetPlaceholder, { icon: IconImage, widgetId: id, style: {
                        border: 'none',
                        height: '100%',
                        pointerEvents: 'none',
                        position: 'absolute'
                    }, message: intl.formatMessage({ id: 'tips', defaultMessage: defaultMessages.tips }) }))));
    }
}
//# sourceMappingURL=widget.js.map