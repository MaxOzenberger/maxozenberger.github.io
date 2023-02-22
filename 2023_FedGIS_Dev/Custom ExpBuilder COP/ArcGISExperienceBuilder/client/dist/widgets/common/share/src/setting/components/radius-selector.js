/** @jsx jsx */
import { React, jsx, css, polished } from 'jimu-core';
import { IconRadius } from '../../config';
export class RadiusSelector extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._getBorderRadius4Setting = (radius) => {
            let r;
            if (IconRadius.Rad00 === radius) {
                r = 0;
            }
            else if (IconRadius.Rad20 === radius) {
                r = '4px';
            }
            else if (IconRadius.Rad50 === radius) {
                r = '50%';
            }
            return r;
        };
        this._isActive = () => {
            if (this.props.radius === this.props.btnRad) {
                return 'active';
            }
            else {
                return '';
            }
        };
    }
    getStyle(theme) {
        const white = theme ? theme.colors.white : '';
        const cyan500 = theme ? theme.colors.info : '';
        const gray900 = theme ? theme.colors.secondary : '';
        return css `
      background-color: ${white};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${polished.rem(28)};
      height: ${polished.rem(28)};
      margin: 2px;
      &.active{
        outline: 2px ${cyan500} solid;
      }
      .inner {
        width: 66%;
        height: 66%;
        border: 1px ${gray900} solid;
        border-radius: 2px;
        /*&.circle {
          border-radius: 50%;
        }*/
      }
    `;
    }
    render() {
        const borderRadius = this._getBorderRadius4Setting(this.props.radius);
        return (jsx("div", { css: this.getStyle(this.props.theme), onClick: this.props.onClick, title: 'border radius: ' + borderRadius, className: 'choose-shape ' + this._isActive() },
            jsx("div", { className: 'inner', style: { borderRadius: borderRadius } })));
    }
}
//# sourceMappingURL=radius-selector.js.map