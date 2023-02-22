/** @jsx jsx */
import { React, css, jsx, polished } from 'jimu-core';
import { PointStyle } from '../../config';
import { TextInput, Slider } from 'jimu-ui';
const STEP = 1;
const MIN = 0;
const MAX = 100;
const AMOUNT = MAX / STEP - 1;
const MINRATIO = 3; //Minimum 3 times the width of the line
const MAXRATIO = 5; //Maximum to 3 times the width of the line
export class RangeInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getStyle = () => {
            var _a, _b;
            const { theme } = this.props;
            return css `
      .scale-con {
        & {
          width: 100%;
          top: ${polished.rem(-2)};
        }
        span {
          height: ${polished.rem(3)};
          width: 1px;
          background: ${(_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.light[800]};
        }
      }
      .range-number-inp {
        width: ${polished.rem(46)};
      }
    `;
        };
        this.getScale = () => {
            const scaleData = [];
            for (let i = 0; i < AMOUNT; i++) {
                scaleData.push(jsx("span", { className: 'position-absolute', key: i, style: { left: `${(i + 1) * STEP}%` } }));
            }
            return (jsx("div", { className: 'scale-con position-absolute left-0 right-0' }, scaleData));
        };
        this.onChange = (e) => {
            const val = e.target.value;
            if (!this.checkNumber(val) || val === this.preRangeValue)
                return false;
            if (Number(val) < 0 || Number(val) > 100)
                return false;
            const value = val / 100;
            const pointSize = value * (MAXRATIO - MINRATIO) + MINRATIO;
            this.setState({
                value: pointSize
            });
            this.preRangeValue = val;
            clearTimeout(this.updateConfigTimeout);
            this.updateConfigTimeout = setTimeout(() => {
                var _a;
                (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.onChange(pointSize);
            }, 100);
        };
        this.getRangeValue = () => {
            const { value } = this.props;
            const rangeValue = ((value - MINRATIO) * 100) / (MAXRATIO - MINRATIO);
            return rangeValue > 0 ? rangeValue : 0;
        };
        this.checkNumber = (value, minimum = 0) => {
            if ((value === null || value === void 0 ? void 0 : value.length) === 0)
                return true;
            if (isNaN(Number(value))) {
                return false;
            }
            else {
                const numberVal = Number(value);
                return Number.isInteger(numberVal) && numberVal >= minimum;
            }
        };
        this.state = {
            value: (props === null || props === void 0 ? void 0 : props.value) || 0
        };
    }
    componentWillUnmount() {
        clearTimeout(this.updateConfigTimeout);
    }
    render() {
        const { pointStyle, intl } = this.props;
        const rangeValue = this.getRangeValue();
        return (jsx("div", { className: 'range-input w-100 position-relative d-flex align-items-center', css: this.getStyle() },
            jsx("div", { className: 'flex-grow-1' },
                jsx(Slider, { title: intl('dividerSize'), disabled: pointStyle === PointStyle.None, value: rangeValue, min: MIN, max: MAX, step: STEP, "aria-valuemin": MIN, "aria-valuemax": MAX, "aria-valuenow": rangeValue, className: 'slider mr-2', onChange: this.onChange })),
            jsx(TextInput, { size: 'sm', className: 'ml-3 range-number-inp', value: rangeValue.toFixed(), onChange: this.onChange })));
    }
}
//# sourceMappingURL=range-input.js.map