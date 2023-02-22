/** @jsx jsx */
import { React, jsx, css, classNames } from 'jimu-core';
import { LayoutEntry } from 'jimu-layouts/layout-builder';
import { styleUtils } from 'jimu-ui';
export class SidebarLayoutItem extends React.PureComponent {
    render() {
        const { style, className, innerLayouts, itemStyle, collapsed } = this.props;
        // const layoutSetting = this.props.setting || {};
        return (jsx("div", { className: classNames('side d-flex', className), style: Object.assign(Object.assign(Object.assign({}, style), styleUtils.toCSSStyle(itemStyle)), { overflow: 'auto' }), css: css `
          .exb-drop-area {
            pointer-events: ${collapsed ? 'none !important' : 'inherit'}
          }
        ` },
            jsx(LayoutEntry, { className: 'border-0', layouts: innerLayouts, isInWidget: true, ignoreMinHeight: true })));
    }
}
//# sourceMappingURL=layout-item.js.map