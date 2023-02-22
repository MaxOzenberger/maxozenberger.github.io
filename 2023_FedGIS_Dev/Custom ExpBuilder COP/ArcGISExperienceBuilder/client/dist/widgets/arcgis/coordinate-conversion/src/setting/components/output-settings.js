/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, urlUtils, defaultMessages as jimuCoreDefaultMessages } from 'jimu-core';
import { SidePopper, SettingRow } from 'jimu-ui/advanced/setting-components';
import { Button, Icon } from 'jimu-ui';
import defaultMessages from '../translations/default';
import { getOutputSettingsStyle, getStyleForEditHeader } from '../lib/style';
import CoordinateTable from './coordinate-table';
import OutputSettingPopper from './output-settings-popper';
import AddPopper from '../components/add-popper';
const IconClose = require('jimu-ui/lib/icons/close-16.svg');
const IconAdd = require('../assets/add.svg');
export default class OutputSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.sidePopperTrigger = React.createRef();
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuCoreDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.componentDidUpdate = (prevProps) => {
        };
        this.onEditButtonClicked = () => {
            this.setState({
                showOutputSettingsPopper: !this.state.showOutputSettingsPopper
            });
        };
        this.closeOutputSettingPopper = () => {
            this.setState({
                showOutputSettingsPopper: false
            });
        };
        this.onSettingsUpdate = (outputSettings) => {
            this.setState({
                outputSettingsTable: outputSettings,
                newAddedConversions: outputSettings
            });
            this.props.onOutputSettingsUpdated('outputSettings', outputSettings);
        };
        this.onAddClick = () => {
            this.setState({
                isAddConversionPopupOpen: true
            });
        };
        this.addNewConversion = (formatName, label, currentPattern, addAtTheTop) => {
            const newFormatParams = {
                name: formatName,
                label: label,
                defaultPattern: currentPattern,
                currentPattern: currentPattern,
                enabled: true,
                isCustom: true
            };
            if (addAtTheTop) {
                this.setState({
                    newAddedConversions: [newFormatParams, ...this.state.newAddedConversions]
                }, () => {
                    this.setState({
                        outputSettingsTable: this.state.newAddedConversions
                    });
                    this.props.onOutputSettingsUpdated('outputSettings', this.state.newAddedConversions);
                });
            }
            else {
                this.setState({
                    newAddedConversions: [...this.state.newAddedConversions, newFormatParams]
                }, () => {
                    this.setState({
                        outputSettingsTable: this.state.newAddedConversions
                    });
                    this.props.onOutputSettingsUpdated('outputSettings', this.state.newAddedConversions);
                });
            }
        };
        this.onAddPopperClose = () => {
            this.setState({
                isAddConversionPopupOpen: false
            });
        };
        this.state = {
            newAddedConversions: this.props.config.length > 0 ? this.props.config : this.props.allSupportedFormats,
            isAddConversionPopupOpen: false,
            showOutputSettingsPopper: false,
            outputSettingsTable: null
        };
    }
    render() {
        var _a;
        return jsx("div", { css: getOutputSettingsStyle(this.props.theme), style: { height: '100%', width: '100%', marginTop: '5px' } },
            jsx(SettingRow, null,
                jsx("div", { title: this.nls('addNewLabels'), className: " d-flex align-items-center add-conversion", onClick: this.onAddClick.bind(this) },
                    jsx("div", { className: "add-conversion-icon-container d-flex align-items-center justify-content-center mr-2" },
                        jsx(Icon, { icon: IconAdd, size: 12 })),
                    jsx("div", { className: "text-truncate flex-grow-1" }, this.nls('addNewLabels')))),
            this.state.newAddedConversions &&
                jsx("div", { ref: this.sidePopperTrigger },
                    jsx(CoordinateTable, { allSupportedFormats: this.state.newAddedConversions, intl: this.props.intl, theme: this.props.theme, onEditClick: this.onEditButtonClicked.bind(this), onSettingsUpdate: this.onSettingsUpdate.bind(this) })),
            jsx(SidePopper, { isOpen: this.state.showOutputSettingsPopper && !urlUtils.getAppIdPageIdFromUrl().pageId, position: 'right', toggle: this.closeOutputSettingPopper.bind(this), trigger: (_a = this.sidePopperTrigger) === null || _a === void 0 ? void 0 : _a.current },
                jsx("div", { className: 'w-100 h-100', css: getStyleForEditHeader(this.props.theme) },
                    jsx("div", { className: 'w-100 h-100 layer-item-panel' },
                        jsx("div", { className: 'w-100 d-flex align-items-center justify-content-between setting-header setting-title pb-2' },
                            jsx("h5", { tabIndex: 0, title: this.nls('editOutputFormats'), className: 'text-truncate layer-item-label mt-2' }, this.nls('editOutputFormats')),
                            jsx(Button, { role: 'button', "aria-label": this.nls('close'), className: 'ml-2', icon: true, type: 'tertiary', size: 'sm', onClick: this.closeOutputSettingPopper.bind(this) },
                                jsx(Icon, { icon: IconClose, size: 16 }))),
                        jsx("div", { className: 'setting-container' },
                            jsx(OutputSettingPopper, { intl: this.props.intl, theme: this.props.theme, config: this.state.outputSettingsTable, onSettingsUpdate: this.onSettingsUpdate.bind(this) }))))),
            this.state.isAddConversionPopupOpen && this.props.allSupportedFormats && this.props.allSupportedFormats.length > 0 &&
                jsx(AddPopper, { supportedFormats: this.props.allSupportedFormats.filter((format) => { return format.name !== 'address'; }), theme: this.props.theme, intl: this.props.intl, isOpen: this.state.isAddConversionPopupOpen, onOkClick: this.addNewConversion.bind(this), onClose: this.onAddPopperClose.bind(this) }));
    }
}
//# sourceMappingURL=output-settings.js.map