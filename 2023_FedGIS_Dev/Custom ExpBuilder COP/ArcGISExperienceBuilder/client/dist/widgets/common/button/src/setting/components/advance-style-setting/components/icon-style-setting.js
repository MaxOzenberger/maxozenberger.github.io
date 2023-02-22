/** @jsx jsx */
import { React, jsx, Immutable } from 'jimu-core';
import { DistanceUnits } from 'jimu-ui';
import { InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
export default class IconStyleSetting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.units = [DistanceUnits.PIXEL];
        this.onSizeChange = (size) => {
            this.changeIcon('size', size.distance);
        };
        this.onColorChange = (color) => {
            this.changeIcon('color', color);
        };
        this.changeIcon = (k, v) => {
            const properties = this.props.iconProps ? this.props.iconProps.set(k, v) : Immutable({ [k]: v });
            this.props.onChange(properties);
        };
    }
    render() {
        const properties = this.props.iconProps || {};
        return (jsx("div", { className: "w-100 d-flex justify-content-between icon-size-font-style-setting" },
            jsx("div", null,
                jsx(InputUnit, { units: this.units, value: { distance: properties.size, unit: DistanceUnits.PIXEL }, onChange: this.onSizeChange })),
            jsx("div", null,
                jsx(ThemeColorPicker, { specificTheme: this.props.appTheme, value: properties.color, onChange: this.onColorChange }))));
    }
}
//# sourceMappingURL=icon-style-setting.js.map