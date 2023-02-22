import { React, classNames } from 'jimu-core';
import { LayoutEntry } from 'jimu-layouts/layout-runtime';
import { styleUtils } from 'jimu-ui';
export class SidebarLayoutItem extends React.PureComponent {
    render() {
        const { style, className, innerLayouts, itemStyle } = this.props;
        // const layoutSetting = this.props.setting || {};
        return (React.createElement("div", { className: classNames('side d-flex', className), style: Object.assign(Object.assign(Object.assign({}, style), styleUtils.toCSSStyle(itemStyle)), { overflow: 'auto' }) },
            React.createElement(LayoutEntry, { className: 'border-0', layouts: innerLayouts, isInWidget: true, ignoreMinHeight: true })));
    }
}
//# sourceMappingURL=layout-item.js.map