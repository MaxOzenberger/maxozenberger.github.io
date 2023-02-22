/** @jsx jsx */
import { jsx } from 'jimu-core';
import { BaseTool } from '../../layout/base/base-tool';
import { defaultMessages } from 'jimu-ui';
import { SelectPCTool } from './select-pc';
import { SelectMobileTool } from './select-mobile';
export default class Select extends BaseTool {
    constructor(props) {
        super(props);
        this.toolName = 'Select';
        this.state = {};
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'SelectLabel', defaultMessage: defaultMessages.SelectLabel });
    }
    getIcon() {
        return {
            icon: require('../../assets/icons/select-tool/select-rectangle.svg')
        };
    }
    getExpandPanel() {
        if (this.props.isMobile) {
            return (jsx(SelectMobileTool, { isActive: this.toolName === (this.props.activeToolInfo && this.props.activeToolInfo.activeToolName), activeToolInfo: this.props.activeToolInfo, toolName: this.toolName, onActiveToolInfoChange: this.props.onActiveToolInfoChange, _onIconClick: () => { this._onIconClick(); }, theme: this.props.theme, intl: this.props.intl, jimuMapView: this.props.jimuMapView }));
        }
        else {
            return jsx(SelectPCTool, { theme: this.props.theme, intl: this.props.intl, jimuMapView: this.props.jimuMapView });
        }
    }
}
//# sourceMappingURL=index.js.map