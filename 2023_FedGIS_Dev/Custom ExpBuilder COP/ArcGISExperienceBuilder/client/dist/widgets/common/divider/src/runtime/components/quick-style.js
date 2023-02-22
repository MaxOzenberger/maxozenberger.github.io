/** @jsx jsx */
import { React, jsx, injectIntl, css, classNames, polished, Immutable } from 'jimu-core';
import { getQuickStyleConfig } from './quick-style-config';
import { PointStyle } from '../../config';
import { QuickStylePopper } from 'jimu-ui/advanced/setting-components';
import { Button } from 'jimu-ui';
import { getBuilderThemeVariables } from 'jimu-theme';
import defaultMessages from '../translations/default';
export class _QuickStyle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getStyle = (theme) => {
            var _a, _b, _c, _d, _e, _f;
            const defaultTheme = getBuilderThemeVariables();
            return css `
      width: ${polished.rem(360)};
      z-index: 1001 !important;
      .quick-style-title {
        color: ${(_c = (_b = (_a = defaultTheme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.dark) === null || _c === void 0 ? void 0 : _c[600]};
        cursor: pointer;
        font-size: ${polished.rem(16)};
        div,
        svg {
          color: ${(_f = (_e = (_d = defaultTheme.colors) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.dark) === null || _f === void 0 ? void 0 : _f[600]};
        }
      }
      .button-item {
        width: 100%;
        font-size: ${polished.rem(13)};
      }
      button {
        border-radius: 0;
      }
      .quick-style-item-container {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item {
        border: 2px solid transparent;
        &.quick-style-item-selected {
          border: 2px solid ${theme.colors.palette.primary[700]};
        }
        .quick-style-item-inner {
          background-color: ${theme.colors.palette.light[200]};
          cursor: pointer;
        }
      }
    `;
        };
        this.nls = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }, values);
        };
        this.quickStyleComponent = () => {
            var _a, _b, _c, _d;
            const quickStyleComponent = [];
            const QuickStyleConfig = getQuickStyleConfig(this.props.theme);
            let index = 0;
            for (const key in QuickStyleConfig) {
                index += 1;
                const config = QuickStyleConfig[key];
                const { pointStart, pointEnd, themeStyle } = config;
                const dividerLineStyle = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.getDividerLineStyle(config);
                const dividerLinePositionStyle = (_b = this === null || this === void 0 ? void 0 : this.props) === null || _b === void 0 ? void 0 : _b.getDividerLinePositionStyle(config);
                const pointStartStyle = (_c = this === null || this === void 0 ? void 0 : this.props) === null || _c === void 0 ? void 0 : _c.getPointStyle(config, true);
                const pointEndStyle = (_d = this === null || this === void 0 ? void 0 : this.props) === null || _d === void 0 ? void 0 : _d.getPointStyle(config, false);
                const dividerLineClasses = classNames('divider-line', 'position-absolute', `point-start-${pointStart.pointStyle}`, `point-end-${pointEnd.pointStyle}`);
                const ele = (jsx("div", { key: key, className: 'col-6 quick-style-item-container' },
                    jsx("div", { className: classNames('quick-style-item', {
                            'quick-style-item-selected': this.props.selectedType === themeStyle.quickStyleType
                        }) },
                        jsx(Button, { className: 'quick-style-item-inner p-2 w-100', onClick: () => this.onConfirm(config), title: this.nls('quickStyleItem', { index: index }) },
                            jsx("div", { className: 'quick-style-item-inner p-2 position-relative' },
                                pointStart.pointStyle !== PointStyle.None && (jsx("span", { className: 'point-start position-absolute', css: pointStartStyle })),
                                jsx("div", { className: dividerLineClasses, css: [dividerLineStyle, dividerLinePositionStyle] }),
                                pointEnd.pointStyle !== PointStyle.None && (jsx("span", { className: 'point-end position-absolute', css: pointEndStyle })))))));
                quickStyleComponent.push(ele);
            }
            return quickStyleComponent;
        };
        this.onConfirm = config => {
            config.direction = this.props.direction;
            this.props.onChange(Immutable(config));
        };
        this.state = {};
    }
    render() {
        const { isOpen, theme, closeQuickStyle, onInitResizeHandler, onInitDragHandler } = this.props;
        return (jsx(QuickStylePopper, { reference: this.props.reference, open: isOpen, placement: 'right-start', css: this.getStyle(theme), trapFocus: false, autoFocus: false, onClose: () => {
                closeQuickStyle(false);
            }, onInitResizeHandler: onInitResizeHandler, onInitDragHandler: onInitDragHandler },
            jsx("div", { className: 'container-fluid mb-2' },
                jsx("div", { className: 'row no-gutters' }, this.quickStyleComponent()))));
    }
}
export const QuickStyle = injectIntl(_QuickStyle);
//# sourceMappingURL=quick-style.js.map