import { React } from 'jimu-core';
import { Select } from 'jimu-ui';
import { ColorPicker } from 'jimu-ui/basic/color-picker';
export var SelectorOptions;
(function (SelectorOptions) {
    SelectorOptions["DEFAULT"] = "default";
    SelectorOptions["CUSTOMIZE"] = "customize";
})(SelectorOptions || (SelectorOptions = {}));
export class DefaultOrColorpicker extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._isDefaultColor = (color) => {
            if (color === '' || SelectorOptions.DEFAULT === color) {
                return true;
            }
            else {
                return false;
            }
        };
        this.componentWillMount = () => {
            let c;
            if (this._isDefaultColor(this.props.color)) {
                c = '';
            }
            else {
                c = this.props.color;
            }
            this.setState({ color: c });
            const selectorVal = (c === '') ? SelectorOptions.DEFAULT : SelectorOptions.CUSTOMIZE;
            this.setState({ selectorVal: selectorVal });
        };
        this._isDefault = () => {
            return (this.state.color === '');
        };
        this.onSelectorChange = (e) => {
            let selectorVal = e.target.value;
            if (selectorVal === SelectorOptions.DEFAULT) {
                selectorVal = '';
            }
            this.setState({ selectorVal: selectorVal });
            if (this._isDefaultColor(selectorVal)) {
                this.onChange(selectorVal);
            }
            else {
                this.onChange(null); // color val
            }
        };
        this.onColorChange = (color) => {
            this.setState({ color: color });
            this.onChange(color);
        };
        this.onChange = (val) => {
            if (val !== null) {
                this.props.onColorChange(val);
            }
            else {
                this.props.onColorChange(this.state.color);
            }
        };
        this._getColorPickerDisplay = () => {
            if (this._isDefaultColor(this.state.selectorVal)) {
                return 'none';
            }
            else {
                return 'flex';
            }
        };
    }
    render() {
        return (React.createElement("div", { className: 'd-flex align-items-end flex-column' },
            React.createElement(Select, { value: this.state.selectorVal, onChange: this.onSelectorChange },
                React.createElement("option", { value: SelectorOptions.DEFAULT }, "Default"),
                React.createElement("option", { value: SelectorOptions.CUSTOMIZE }, "Customize")),
            React.createElement("div", { style: { display: this._getColorPickerDisplay() } },
                React.createElement(ColorPicker, { className: 'd-flex', color: this.state.color, onChange: this.onColorChange }))));
    }
}
//# sourceMappingURL=default-or-colorpicker.js.map