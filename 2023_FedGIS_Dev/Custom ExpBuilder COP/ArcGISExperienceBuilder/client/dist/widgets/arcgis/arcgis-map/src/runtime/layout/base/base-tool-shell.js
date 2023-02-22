/** @jsx jsx */
import { jsx, classNames } from 'jimu-core';
import { UIComponent } from './ui-component';
import ToolModules from '../tool-modules';
export default class BaseToolShell extends UIComponent {
    render() {
        const ToolClass = ToolModules[this.props.toolName];
        if (ToolClass) {
            return (jsx("div", { className: classNames(this.props.className, 'exbmap-ui exbmap-ui-tool-shell divitem', this.props.layoutConfig.elements[this.props.toolName].className, {
                    'exbmap-ui-hidden-element': this.props.isHidden,
                    'mb-0 mr-0': this.props.isLastElement,
                    'rounded-pill': ['Compass'].includes(this.props.toolName)
                }), style: this.props.layoutConfig.elements[this.props.toolName].style },
                jsx(ToolClass, { mapWidgetId: this.props.mapWidgetId, ref: 'baseToolInstance', toolJson: this.props.layoutConfig.elements[this.props.toolName], toolName: this.props.toolName, isMobile: this.props.isMobile, jimuMapView: this.props.jimuMapView, activeToolInfo: this.props.activeToolInfo, onActiveToolInfoChange: this.props.onActiveToolInfoChange, intl: this.props.intl, theme: this.props.theme })));
        }
        else {
            if (this.props.isMobile) {
                return jsx("span", null);
            }
            else {
                return null;
            }
        }
    }
}
//# sourceMappingURL=base-tool-shell.js.map