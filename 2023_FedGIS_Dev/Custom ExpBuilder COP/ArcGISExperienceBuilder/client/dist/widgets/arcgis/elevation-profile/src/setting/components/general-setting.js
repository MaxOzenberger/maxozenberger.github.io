/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { Label, Switch, Tooltip, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { getGeneralSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import { getConfigIcon } from '../constants';
const { epConfigIcon } = getConfigIcon();
export default class GeneralSettings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        //Update the select/draw tool states
        //one of them can be active at a time
        this.componentDidUpdate = (prevProps) => {
            if (prevProps.config.isSelectToolActive !== this.props.config.isSelectToolActive) {
                this.setSelectTool(this.props.config.isSelectToolActive);
            }
            if (prevProps.config.isDrawToolActive !== this.props.config.isDrawToolActive) {
                this.setDrawTool(this.props.config.isDrawToolActive);
            }
        };
        this.setSelectTool = (selectTool) => {
            this.setState({
                selectToggleTool: selectTool
            }, () => {
                this.props.onGeneralSettingsUpdated('isDrawToolActive', this.state.drawToggleTool);
            });
        };
        this.setDrawTool = (drawTool) => {
            this.setState({
                drawToggleTool: drawTool
            }, () => {
                this.props.onGeneralSettingsUpdated('isSelectToolActive', this.state.selectToggleTool);
            });
        };
        this.selectToolStateChange = (evt) => {
            if (evt.target.checked) {
                this.setState({
                    drawToggleTool: false,
                    selectToggleTool: true
                }, () => {
                    this.props.onGeneralSettingsUpdated('isSelectToolActive', this.state.selectToggleTool);
                });
            }
            else {
                this.setState({
                    drawToggleTool: this.state.drawToggleTool,
                    selectToggleTool: false
                }, () => {
                    this.props.onGeneralSettingsUpdated('isSelectToolActive', this.state.selectToggleTool);
                });
            }
        };
        this.drawToolStateChange = (evt) => {
            if (evt.target.checked) {
                this.setState({
                    selectToggleTool: false,
                    drawToggleTool: true
                }, () => {
                    this.props.onGeneralSettingsUpdated('isDrawToolActive', this.state.drawToggleTool);
                });
            }
            else {
                this.setState({
                    drawToggleTool: false,
                    selectToggleTool: this.state.selectToggleTool
                }, () => {
                    this.props.onGeneralSettingsUpdated('isDrawToolActive', this.state.drawToggleTool);
                });
            }
        };
        this.onToggleAppearance = () => {
            this.setState({
                isAppearanceSettingsOpen: !this.state.isAppearanceSettingsOpen
            });
        };
        this.onShowGridChange = (evt) => {
            this.props.onGeneralSettingsUpdated('showGridAxis', evt.target.checked);
        };
        this.onShowAxisTitlesChange = (evt) => {
            this.props.onGeneralSettingsUpdated('showAxisTitles', evt.target.checked);
        };
        this.legendStateChange = (evt) => {
            this.props.onGeneralSettingsUpdated('showLegend', evt.target.checked);
        };
        this.state = {
            selectToggleTool: this.props.config.isSelectToolActive,
            drawToggleTool: this.props.config.isDrawToolActive,
            isAppearanceSettingsOpen: false
        };
    }
    render() {
        return jsx("div", { style: { height: '100%', width: '100%', marginTop: 5 }, css: getGeneralSettingsStyle(this.props.theme) },
            jsx(SettingRow, null,
                jsx(Label, { tabIndex: 0, "aria-label": this.nls('activateToolOnLoadLabel'), className: 'w-100 d-flex' },
                    jsx("div", { className: 'flex-grow-1 text-break' }, this.nls('activateToolOnLoadLabel'))),
                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('activateToolOnLoadTooltip'), title: this.nls('activateToolOnLoadTooltip'), showArrow: true, placement: 'top' },
                    jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
            this.props.currentDs !== 'default' &&
                jsx(SettingRow, { label: this.nls('selectTool') },
                    jsx(Switch, { role: 'switch', "aria-label": this.nls('selectTool'), title: this.nls('selectTool'), checked: this.state.selectToggleTool, onChange: this.selectToolStateChange })),
            jsx(SettingRow, { label: this.nls('drawTool') },
                jsx(Switch, { role: 'switch', "aria-label": this.nls('drawTool'), title: this.nls('drawTool'), checked: this.state.drawToggleTool, onChange: this.drawToolStateChange })),
            jsx(SettingRow, null,
                jsx(SettingCollapse, { label: this.nls('appearanceCollapsible'), isOpen: this.state.isAppearanceSettingsOpen, onRequestOpen: () => this.onToggleAppearance(), onRequestClose: () => this.onToggleAppearance() },
                    jsx("div", { style: { height: '100%', marginTop: 10 } },
                        jsx(SettingRow, { label: this.nls('showChartGridsLabel') },
                            jsx(Switch, { role: 'switch', "aria-label": this.nls('showChartGridsLabel'), title: this.nls('showChartGridsLabel'), checked: this.props.config.showGridAxis, onChange: this.onShowGridChange })),
                        jsx(SettingRow, { label: this.nls('showChartAxisTitlesLabel') },
                            jsx(Switch, { role: 'switch', "aria-label": this.nls('showChartAxisTitlesLabel'), title: this.nls('showChartAxisTitlesLabel'), checked: this.props.config.showAxisTitles, onChange: this.onShowAxisTitlesChange })),
                        jsx(SettingRow, { label: this.nls('showLegend') },
                            jsx(Switch, { role: 'switch', "aria-label": this.nls('showLegend'), title: this.nls('showLegend'), checked: this.props.config.showLegend, onChange: this.legendStateChange }))))));
    }
}
//# sourceMappingURL=general-setting.js.map