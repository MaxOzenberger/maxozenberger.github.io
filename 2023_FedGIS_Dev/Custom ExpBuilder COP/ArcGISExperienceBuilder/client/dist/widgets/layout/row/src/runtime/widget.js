var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import defaultMessages from './translations/default';
import { WidgetPlaceholder } from 'jimu-ui';
import { RowLayoutViewer } from 'jimu-layouts/layout-runtime';
/* eslint-disable @typescript-eslint/no-var-requires */
const IconImage = require('./assets/icon.svg');
export default class Widget extends React.PureComponent {
    render() {
        // otherProps may come from Flow Layout
        const _a = this.props, { layouts, id, intl, builderSupportModules } = _a, otherProps = __rest(_a, ["layouts", "id", "intl", "builderSupportModules"]);
        const LayoutComponent = !window.jimuConfig.isInBuilder
            ? RowLayoutViewer
            : builderSupportModules.widgetModules.RowLayoutBuilder;
        if (LayoutComponent == null) {
            return (jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, "No layout component!"));
        }
        const layoutName = Object.keys(layouts)[0];
        return (jsx("div", { className: 'widget-row-layout d-flex justify-content-center d-flex w-100', css: css `height: 100%;` },
            jsx(LayoutComponent, Object.assign({ layouts: layouts[layoutName], widgetId: id }, otherProps),
                jsx(WidgetPlaceholder, { icon: IconImage, widgetId: id, style: {
                        border: 'none',
                        pointerEvents: 'none'
                    }, message: intl.formatMessage({ id: 'tips', defaultMessage: defaultMessages.tips }) }))));
    }
}
//# sourceMappingURL=widget.js.map