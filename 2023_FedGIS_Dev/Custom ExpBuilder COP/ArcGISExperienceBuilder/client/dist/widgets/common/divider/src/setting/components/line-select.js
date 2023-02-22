/** @jsx jsx */
import { React, css, jsx, classNames, polished } from 'jimu-core';
import { Select, Option } from 'jimu-ui';
import defaultMessages from '../translations/default';
import { LineStyle, Direction } from '../../config';
import { getStrokeStyle } from '../../common/template-style';
export class LineStyleSelector extends React.PureComponent {
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
            const styleData = [];
            const strokeStyle = getStrokeStyle('2px', '#fff', Direction.Horizontal, true);
            for (const key in strokeStyle) {
                styleData.push({
                    style: strokeStyle[key],
                    value: key
                });
            }
            return styleData;
        };
        this.getStyle = () => {
            return css `
      & {
        width: ${polished.rem(84)};
      }
    `;
        };
        this.lineTitle = {
            Style0: this.nls('strokeSolid'),
            Style1: this.nls('strokeDashed'),
            Style2: this.nls('strokeDotted'),
            Style3: this.nls('strokeDashdotted'),
            Style6: this.nls('strokeLongDashed'),
            Style7: this.nls('strokeDouble'),
            Style8: this.nls('strokeThinThick'),
            Style9: this.nls('strokeThickThin'),
            Style10: this.nls('strokeTriple')
        };
    }
    _onLineStyleChange(e) {
        const value = e.target.value;
        this.props.onChange(value);
    }
    render() {
        const { value, className, style } = this.props;
        const commonOptionCss = css `
      width: 100%;
      margin: 6px 0;
    `;
        return (jsx("div", { className: classNames(className, 'style-setting--line-style-selector'), style: style, css: this.getStyle() },
            jsx(Select, { size: 'sm', name: 'lineType', value: value, title: this.lineTitle[value], onChange: this._onLineStyleChange.bind(this), "aria-label": this.lineTitle[value] }, this.getLineStyles().map((ls, index) => (jsx(Option, { "aria-label": ls.value, tabIndex: index, role: 'option', key: index, value: ls.value, title: this.lineTitle[ls.value] },
                jsx("div", { css: [ls.style, commonOptionCss] })))))));
    }
}
LineStyleSelector.defaultProps = {
    value: LineStyle.Style0,
    onChange: () => { }
};
//# sourceMappingURL=line-select.js.map