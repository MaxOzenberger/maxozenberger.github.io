/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Select, Option, NumericInput, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { ColorPicker } from 'jimu-ui/basic/color-picker';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
export default class BulletStylePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.bulletShapeList = ['diamond', 'rectangle', 'circle', 'square'];
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
        this.onBulletColorChange = (color) => {
            this.setState({
                bulletColor: color
            });
            this.props.onBulletStyleChange(this.props.bullItem, 'bulletColor', color);
        };
        this.onBulletShapeChange = (evt) => {
            this.setState({
                bulletShape: evt.currentTarget.value
            });
            this.props.onBulletStyleChange(this.props.bullItem, 'bullet', evt.currentTarget.value);
        };
        this.onBulletSizeChange = (value) => {
            if (value === null) {
                return;
            }
            this.setState({
                bulletSize: value
            });
            this.props.onBulletStyleChange(this.props.bullItem, 'bulletSize', value);
        };
        this.state = {
            bulletColor: Object.prototype.hasOwnProperty.call(this.props.config, 'bulletColor') ? this.props.config.bulletColor : 'yellow',
            bulletShape: Object.prototype.hasOwnProperty.call(this.props.config, 'bullet') ? this.props.config.bullet : 'square',
            bulletSize: Object.prototype.hasOwnProperty.call(this.props.config, 'bulletSize') ? this.props.config.bulletSize : 20
        };
    }
    render() {
        return jsx("div", { className: 'pt-4 pb-3' },
            jsx(SettingRow, null,
                jsx(ColorPicker, { "aria-label": this.nls('bulletColor'), className: 'mr-2', width: '54px', height: '26px', offset: [0, 0], placement: 'top', showArrow: true, color: this.state.bulletColor ? this.state.bulletColor : '#FFFFFF', onChange: this.onBulletColorChange }),
                jsx(Select, { menuRole: 'menu', "aria-label": this.state.bulletShape, size: 'sm', name: 'symbolPicker', onChange: this.onBulletShapeChange, value: this.state.bulletShape }, this.bulletShapeList.map((item, index) => {
                    const iconComponent = require(`../assets/icons/${item}.svg`);
                    return jsx(Option, { role: 'option', "aria-label": item, key: index, value: item }, jsx(Icon, { width: 12, height: 12, icon: iconComponent }));
                })),
                jsx(NumericInput, { "aria-label": this.nls('bulletSize'), size: 'sm', className: 'ml-2', min: 0, defaultValue: this.state.bulletSize, onChange: this.onBulletSizeChange })));
    }
}
//# sourceMappingURL=bullet-style-picker.js.map