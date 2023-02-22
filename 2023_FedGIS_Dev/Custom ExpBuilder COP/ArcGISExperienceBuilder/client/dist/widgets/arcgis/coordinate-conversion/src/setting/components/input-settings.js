/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, defaultMessages as jimuUIDefaultMessages } from 'jimu-core';
import { Icon, TextInput, Button, Select, Option } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getInputSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
const iconReset = require('jimu-ui/lib/icons/reset-outlined-16.svg');
export default class InputSetting extends React.PureComponent {
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
        this.componentDidMount = () => {
        };
        this.onDefaultCoordsChange = (evt) => {
            this.setState({
                defaultCoords: evt.target.value
            }, () => {
                this.resetToDefaultPattern(this.state.defaultCoords);
            });
        };
        this.onFormatChange = (event) => {
            if (event && event.target) {
                const value = event.target.value;
                this.setState({
                    defFormat: value
                });
            }
        };
        this.onFormatAcceptValue = () => {
            this.updateInputSettingsInConfig();
        };
        this.onResetButtonClick = () => {
            const selectedValue = this.state.defaultCoords;
            this.resetToDefaultPattern(selectedValue);
        };
        this.resetToDefaultPattern = (selectedValue) => {
            const selectedItem = this.props.allSupportedFormats.find(i => i.name === selectedValue);
            if (selectedItem) {
                this.setState({
                    defFormat: selectedItem.defaultPattern
                }, () => {
                    this.updateInputSettingsInConfig();
                });
            }
        };
        this.updateInputSettingsInConfig = () => {
            this.props.onInputSettingsUpdated('inputSettings', {
                defaultCoordinate: this.state.defaultCoords,
                format: this.state.defFormat
            });
        };
        if (this.props.config) {
            this.state = {
                defaultCoords: this.props.config.defaultCoordinate,
                defFormat: this.props.config.format
            };
        }
    }
    render() {
        return jsx("div", { style: { height: '100%', marginTop: '5px' } },
            jsx("div", { css: getInputSettingsStyle(this.props.theme) },
                jsx(SettingRow, { label: this.nls('defaultCoordinate'), flow: 'wrap' },
                    jsx(Select, { "aria-label": this.nls('defaultCoordinate'), name: 'defaultCoords', size: 'sm', value: this.state.defaultCoords, onChange: this.onDefaultCoordsChange }, this.props.allSupportedFormats.map((option, index) => {
                        return jsx(Option, { role: 'option', tabIndex: 0, "aria-label": option.label, key: index, value: option.name }, option.label);
                    }))),
                jsx(SettingRow, { label: this.nls('coordinateFormat'), flow: 'wrap', className: this.state.defaultCoords === 'address' ? 'hidden' : '' },
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx(TextInput, { role: 'textbox', "aria-label": this.nls('coordinateFormat'), className: 'formatLabel', size: 'sm', value: this.state.defFormat, onAcceptValue: this.onFormatAcceptValue, onChange: this.onFormatChange }),
                        jsx(Button, { title: this.nls('resetFormat'), className: 'ml-2', icon: true, type: 'tertiary', size: 'sm', onClick: this.onResetButtonClick.bind(this) },
                            jsx(Icon, { icon: iconReset, size: 14 }))))));
    }
}
//# sourceMappingURL=input-settings.js.map