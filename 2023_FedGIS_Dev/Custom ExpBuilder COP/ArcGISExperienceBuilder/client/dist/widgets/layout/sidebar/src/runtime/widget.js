/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { SidebarLayout } from '../layout/runtime/layout';
import { versionManager } from '../version-manager';
export default class Widget extends React.PureComponent {
    render() {
        const { layouts, theme, builderSupportModules } = this.props;
        const LayoutComponent = !window.jimuConfig.isInBuilder
            ? SidebarLayout
            : builderSupportModules.widgetModules.SidebarLayoutBuilder;
        if (LayoutComponent == null) {
            return (jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, "No layout component!"));
        }
        return (jsx("div", { className: 'widget-sidebar-layout d-flex w-100 h-100' },
            jsx(LayoutComponent, { theme: theme, widgetId: this.props.id, direction: this.props.config.direction, firstLayouts: layouts.FIRST, secondLayouts: layouts.SECOND, config: this.props.config, sidebarVisible: this.props.sidebarVisible })));
    }
}
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c;
    return {
        sidebarVisible: (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _a === void 0 ? void 0 : _a[props.id]) === null || _b === void 0 ? void 0 : _b.collapse) !== null && _c !== void 0 ? _c : true
    };
};
Widget.versionManager = versionManager;
//# sourceMappingURL=widget.js.map