/** @jsx jsx */
import { React, jsx, injectIntl, css, classNames, polished } from 'jimu-core';
import { getBuilderThemeVariables } from 'jimu-theme';
import { Link } from 'jimu-ui';
import { QuickStylePopper } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
export class _QuickStyle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.THEMETYPES = [
            'default',
            'primary',
            'secondary',
            'tertiary',
            'danger',
            'link'
        ];
        this.translate = (id) => {
            const { intl } = this.props;
            return intl ? intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }) : '';
        };
        this.getStyle = (theme) => {
            return css `
      width: ${polished.rem(360)};
      background-color: ${theme.colors.palette.light[300]};
      color: ${theme.colors.dark};
      border: 1px solid ${theme.colors.palette.light[500]};
      box-shadow: 0 4px 20px 4px ${polished.rgba(theme.colors.white, 0.5)};
      .button-item{
        width: 100%;
        font-size: ${polished.rem(13)};
      }
      .quick-style-item-container{
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item{
        border: 2px solid transparent;
        &.quick-style-item-selected{
          border: 2px solid ${theme.colors.palette.primary[600]};
        }
        .quick-style-item-inner{
          background-color: ${theme.colors.palette.light[400]};
          cursor: pointer;
        }
      }
    `;
        };
        this.state = {};
    }
    render() {
        return (jsx(QuickStylePopper, { reference: this.props.reference, open: true, placement: "right-start", css: this.getStyle(getBuilderThemeVariables()), onClose: this.props.onClose, onInitDragHandler: this.props.onInitDragHandler, onInitResizeHandler: this.props.onInitResizeHandler, trapFocus: false, autoFocus: false },
            jsx("div", { className: "container-fluid mb-2" },
                jsx("div", { className: "row no-gutters" }, this.THEMETYPES.map((t, i) => jsx("div", { key: i, className: "col-4 quick-style-item-container" },
                    jsx("div", { className: classNames('quick-style-item', { 'quick-style-item-selected': this.props.selectedType === t }) },
                        jsx("div", { className: "quick-style-item-inner p-2", onClick: () => this.props.onChange(t) },
                            jsx(Link, { title: this.translate('_widgetLabel'), className: "d-inline-block button-item text-truncate", type: t }, this.translate('_widgetLabel'))))))))));
    }
}
export const QuickStyle = injectIntl(_QuickStyle);
//# sourceMappingURL=quick-style.js.map