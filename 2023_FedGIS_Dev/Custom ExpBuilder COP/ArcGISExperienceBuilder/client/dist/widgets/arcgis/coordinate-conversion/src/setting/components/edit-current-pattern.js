/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { Button, TextInput, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
const IconReset = require('jimu-ui/lib/icons/reset-outlined-16.svg');
const IconClose = require('jimu-ui/lib/icons/close-12.svg');
export default class EditCurrentPattern extends React.PureComponent {
    constructor(props) {
        super(props);
        this.items = [];
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
        this.onCurrentPatternChange = (e) => {
            const value = e.target.value;
            //since this will trigger config change, only process if value is changed.
            if (this.state.currentPattern === value) {
                return;
            }
            this.setState({
                currentPattern: value
            });
        };
        this.onCurrentPatternAcceptValue = (currentPattern) => {
            this.props.onPatternUpdate(this.props.index, this.props.config.name, currentPattern);
        };
        this.onResetButtonClick = (evt) => {
            this.setState({
                currentPattern: this.props.config.defaultPattern
            }, () => {
                this.props.onPatternUpdate(this.props.index, this.props.config.name, this.state.currentPattern);
            });
        };
        this.onDeleteButtonClick = (evt) => {
            this.props.onDelete(this.props.index);
        };
        this.state = {
            currentPattern: this.props.config.currentPattern
        };
    }
    render() {
        var _a, _b, _c;
        //don't render Address options in output settings popper
        if (((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.name) === 'address') {
            return null;
        }
        return jsx(SettingRow, { flow: 'wrap', label: this.props.config.label },
            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                jsx(TextInput, { role: 'textbox', "aria-label": this.props.config.label, size: 'sm', value: this.state.currentPattern, onAcceptValue: this.onCurrentPatternAcceptValue, onChange: this.onCurrentPatternChange }),
                !((_c = this.props.config) === null || _c === void 0 ? void 0 : _c.isCustom) &&
                    jsx(Button, { "aria-label": this.nls('resetFormat'), title: this.nls('resetFormat'), className: 'ml-2', icon: true, type: 'tertiary', size: 'sm', onClick: this.onResetButtonClick.bind(this) },
                        jsx(Icon, { icon: IconReset, size: 14 })),
                this.props.config.isCustom &&
                    jsx(Button, { "aria-label": this.nls('deleteLabel'), title: this.nls('deleteLabel'), className: 'ml-2', icon: true, type: 'tertiary', size: 'sm', onClick: this.onDeleteButtonClick.bind(this) },
                        jsx(Icon, { icon: IconClose, size: 14 }))));
    }
}
//# sourceMappingURL=edit-current-pattern.js.map