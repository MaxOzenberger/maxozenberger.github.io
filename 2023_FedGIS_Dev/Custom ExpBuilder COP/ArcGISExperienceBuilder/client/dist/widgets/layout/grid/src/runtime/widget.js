/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { GridLayoutViewer } from 'jimu-layouts/layout-runtime';
export default class Widget extends React.PureComponent {
    getStyle() {
        return css `
      overflow: hidden;
    `;
    }
    render() {
        const { layouts, builderSupportModules } = this.props;
        const LayoutComponent = !window.jimuConfig.isInBuilder
            ? GridLayoutViewer
            : builderSupportModules.widgetModules.GridLayoutBuilder;
        if (LayoutComponent == null) {
            return (jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, "No layout component!"));
        }
        const layoutName = Object.keys(layouts)[0];
        return (jsx("div", { className: 'widget-grid-layout w-100 h-100', css: this.getStyle() },
            jsx(LayoutComponent, { layouts: layouts[layoutName] })));
    }
}
//# sourceMappingURL=widget.js.map