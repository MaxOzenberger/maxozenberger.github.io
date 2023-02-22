/** @jsx jsx */
import { React, css, jsx, classNames, polished } from 'jimu-core';
import { Select, Option } from 'jimu-ui';
import defaultMessages from '../translations/default';
import { PointStyle, Direction } from '../../config';
import { getPointStyle, getDividerLineStyle } from '../../common/template-style';
export class PointStyleSelector extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nls = (id) => {
            return this.props.intl
                ? this.props.intl.formatMessage({
                    id: id,
                    defaultMessage: defaultMessages[id]
                })
                : id;
        };
        this.getLineStyles = () => {
            const { isPointStart } = this.props;
            const styleData = [];
            const pointStyle = getPointStyle('11px', '#fff', Direction.Horizontal, isPointStart);
            for (const key in pointStyle) {
                const style = pointStyle[key];
                const point = key === PointStyle.None
                    ? { value: key }
                    : { style: style, value: key };
                styleData.push(point);
            }
            return styleData;
        };
        this.getStyle = () => {
            return css `
      & {
        width: ${polished.rem(84)};
      }
      & > div {
        width: 100%;
      }
    `;
        };
        this.getOptionStyle = () => {
            return css `
      & {
        display: block;
        width: 100%;
      }
      &.divider-line-con {
        margin: ${polished.rem(8)} 0 ${polished.rem(8)} ${polished.rem(2)};
        height: ${polished.rem(2)};
      }
      .points {
        /* left: 0;
        top: 50%;
        transform: translateY(-50%); */
      }
    `;
        };
        this.getSelectStyle = () => {
            return css `
      .dropdown-menu--inner {
        width: ${polished.rem(94)};
      }
      & {
        width: ${polished.rem(94)};
      }
    `;
        };
        this.getDividerLineStyle = () => {
            const { isPointStart } = this.props;
            return getDividerLineStyle(true, isPointStart, !isPointStart, 11, 11);
        };
        this.pointTitle = {
            None: this.nls('nonePoint'),
            Point0: this.nls('pointCircle'),
            Point1: this.nls('pointCross'),
            Point2: this.nls('pointLine'),
            Point3: this.nls('pointSquare'),
            Point4: this.nls('pointDiamond'),
            Point5: this.nls('pointInverted'),
            Point6: this.nls('pointArrow'),
            Point7: this.nls('pointOpenArrow'),
            Point8: this.nls('pointInvertedArrow')
        };
    }
    _onLineStyleChange(e) {
        const value = e.target.value;
        this.props.onChange(value);
    }
    render() {
        const { value, className, style, isPointStart } = this.props;
        const dividerLineClass = isPointStart ? 'point-start-' : 'point-end-';
        return (jsx("div", { className: classNames(className, 'style-setting--line-style-selector'), style: style, css: this.getStyle() },
            jsx(Select, { size: 'sm', name: 'lineType', value: value, title: this.pointTitle[value], onChange: this._onLineStyleChange.bind(this), css: this.getSelectStyle(), "aria-label": this.pointTitle[value] }, this.getLineStyles().map((ls, index) => (jsx(Option, { "aria-label": ls.value, role: 'option', tabIndex: index, key: index, value: ls.value, title: this.pointTitle[ls.value], description: this.pointTitle[ls.value] },
                jsx("div", { className: 'w-100 pl-1 pr-1' },
                    ls.value === PointStyle.None && (jsx("div", { className: 'position-relative', css: this.getOptionStyle() },
                        jsx("span", null, this.nls('nonePoint')))),
                    ls.value !== PointStyle.None && (jsx("div", { className: 'position-relative divider-line-con', css: this.getOptionStyle() },
                        jsx("div", { className: classNames('position-absolute divider-line', `${dividerLineClass}${ls.value}`), css: this.getDividerLineStyle(), style: { border: '1px solid #fff' } }),
                        jsx("span", { className: 'position-absolute points', css: ls.style }))))))))));
    }
}
PointStyleSelector.defaultProps = {
    value: PointStyle.None,
    onChange: () => { }
};
//# sourceMappingURL=point-select.js.map