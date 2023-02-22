import { React, classNames } from 'jimu-core';
import { NumericInput } from 'jimu-ui';
export class MyNumericInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onTextInputChange = () => {
            this.props.onAcceptValue(this.state.value);
        };
        this.state = {
            value: props.value
        };
    }
    componentDidUpdate(preProps) {
        if (this.props.value !== preProps.value) {
            const { value } = this.props;
            this.setState({
                value: value
            });
        }
    }
    render() {
        const { min, max, className, style, disabled, title } = this.props;
        return (React.createElement(NumericInput, { className: classNames(className, 'my-input'), value: this.state.value, min: min, max: max, title: title, style: style, disabled: disabled, precision: 0, type: 'number', size: 'sm', onChange: value => {
                this.setState({ value: value });
            }, onAcceptValue: value => this.onTextInputChange() }));
    }
}
//# sourceMappingURL=my-input.js.map