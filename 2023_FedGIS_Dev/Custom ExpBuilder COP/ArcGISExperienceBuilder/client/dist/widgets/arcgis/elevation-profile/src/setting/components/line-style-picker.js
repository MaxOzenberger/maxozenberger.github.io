/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Select, Option, NumericInput, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { ColorPicker } from 'jimu-ui/basic/color-picker';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
export default class LineStylePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.lineTypeList = ['solid-line', 'dotted-line', 'dashed-line'];
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
        this.onLineColorChange = (color) => {
            this.setState({
                lineColor: color
            });
            this.props.onLineStyleChange(this.props.lineItem, 'lineColor', color);
        };
        this.onlineTypeChange = (evt) => {
            this.setState({
                lineType: evt.currentTarget.value
            });
            this.props.onLineStyleChange(this.props.lineItem, 'lineType', evt.currentTarget.value);
        };
        this.onLineThicknessChange = (value) => {
            if (value === null) {
                return;
            }
            this.setState({
                lineThickness: value
            });
            this.props.onLineStyleChange(this.props.lineItem, 'lineThickness', value);
        };
        this.state = {
            lineColor: Object.prototype.hasOwnProperty.call(this.props.config, 'lineColor') ? this.props.config.lineColor : '#049546',
            lineType: Object.prototype.hasOwnProperty.call(this.props.config, 'lineType') ? this.props.config.lineType : 'dashed-line',
            lineThickness: Object.prototype.hasOwnProperty.call(this.props.config, 'lineThickness') ? this.props.config.lineThickness : 2
        };
    }
    render() {
        return jsx("div", null,
            jsx(SettingRow, null,
                jsx(ColorPicker, { "aria-label": this.nls('lineColor'), className: 'mr-2', width: '54px', height: '26px', offset: [0, 0], placement: 'top', showArrow: true, color: this.state.lineColor ? this.state.lineColor : '#FFFFFF', onChange: this.onLineColorChange }),
                jsx(Select, { menuRole: 'menu', "aria-label": this.state.lineType, size: 'sm', name: 'linePicker', value: this.state.lineType, onChange: this.onlineTypeChange }, this.lineTypeList.map((item, index) => {
                    const iconComponent = require(`../assets/icons/${item}.svg`);
                    return jsx(Option, { role: 'option', "aria-label": item, key: index, value: item }, jsx(Icon, { width: 60, height: 12, icon: iconComponent }));
                })),
                jsx(NumericInput, { "aria-label": this.nls('lineThickness'), size: 'sm', className: 'ml-2', min: 1, max: 20, defaultValue: this.state.lineThickness, onChange: this.onLineThicknessChange })));
    }
}
//# sourceMappingURL=line-style-picker.js.map