/** @jsx jsx */
import { React, jsx, Immutable } from 'jimu-core';
import { TextStyle } from 'jimu-ui/advanced/style-setting-components';
export default class FontStyleSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.changeText = (k, v) => {
            const text = this.props.text ? this.props.text.set(k, v) : Immutable({ [k]: v });
            this.props.onChange(text);
        };
    }
    render() {
        return jsx(TextStyle, Object.assign({}, this.props.text, { onChange: this.changeText }));
    }
}
//# sourceMappingURL=font-style-setting.js.map