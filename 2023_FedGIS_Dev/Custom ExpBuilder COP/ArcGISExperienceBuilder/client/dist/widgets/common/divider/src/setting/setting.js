/** @jsx jsx */
import { React, classNames, css, jsx, polished } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { SettingSection, SettingRow, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import { InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { defaultMessages as jimuUIDefaultMessages, DistanceUnits } from 'jimu-ui';
import { Direction, LineStyle, PointStyle, QuickStyleType } from '../config';
import defaultMessages from './translations/default';
import { RangeInput } from './components/range-input';
import { PointStyleSelector } from './components/point-select';
import { LineStyleSelector } from './components/line-select';
const prefix = 'jimu-widget-';
export default class Setting extends React.PureComponent {
    constructor(props) {
        var _a, _b;
        super(props);
        this.hasSetLineSize = false;
        this.units = [DistanceUnits.PIXEL];
        this.getStyle = (theme) => {
            var _a, _b;
            return css `
      .padding-top-0 {
        padding-top: 0;
      }
      .unit-width {
        width: ${polished.rem(60)};
        min-width: ${polished.rem(60)};
      }
      .start-end-point .jimu-widget-setting--section-header h6 {
        font-size: ${polished.rem(13)};
        color: ${(_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.dark[400]};
      }
      .divider-setting-label-con {
        .jimu-widget-setting--row-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    `;
        };
        this.onSettingChange = (key, value) => {
            let config = this.props.config;
            if (Array.isArray(key)) {
                config = config.setIn(key, value);
            }
            else {
                config = config.set(key, value);
            }
            if (config.themeStyle.quickStyleType !== QuickStyleType.None) {
                config = config.setIn(['themeStyle', 'quickStyleType'], QuickStyleType.None);
            }
            this.props.onSettingChange({
                id: this.props.id,
                config
            });
        };
        this.onRadioChange = (e, key, value) => {
            const checked = e.currentTarget.checked;
            if (!checked) {
                return;
            }
            this.onSettingChange(key, value);
            getAppConfigAction()
                .exchangeWidthAndHeight()
                .exec();
        };
        this.onDirectionChange = (vertical) => {
            const newDirection = vertical ? Direction.Vertical : Direction.Horizontal;
            const { direction } = this.props.config;
            if (newDirection === direction) {
                return false;
            }
            this.onSettingChange('direction', newDirection);
            getAppConfigAction()
                .exchangeWidthAndHeight()
                .exec();
        };
        this.translate = (id, jimu, values) => {
            const message = jimu ? jimuUIDefaultMessages : defaultMessages;
            return this.props.intl.formatMessage({ id: id, defaultMessage: message[id] }, values);
        };
        this.onDividerLineStyleChange = (key, value) => {
            this.onSettingChange(['dividerStyle', key], value);
        };
        this.onLineStyleChange = (value) => {
            var _a, _b, _c, _d, _e;
            const { config, id } = this.props;
            if (value === ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.strokeStyle) === null || _c === void 0 ? void 0 : _c.type)) {
                return false;
            }
            let newConfig = config.setIn(['strokeStyle', 'type'], value);
            const isThickLine = value === LineStyle.Style7 || value === LineStyle.Style8 || value === LineStyle.Style9 || value === LineStyle.Style10;
            const lineSize = (_e = (_d = config === null || config === void 0 ? void 0 : config.strokeStyle) === null || _d === void 0 ? void 0 : _d.size) === null || _e === void 0 ? void 0 : _e.split('px')[0];
            if (!this.hasSetLineSize) {
                if (isThickLine && Number(lineSize) < 8) {
                    newConfig = newConfig.setIn(['strokeStyle', 'size'], '8px');
                }
                if (!isThickLine && Number(lineSize) > 2) {
                    newConfig = newConfig.setIn(['strokeStyle', 'size'], '2px');
                }
            }
            this.props.onSettingChange({
                id: id,
                config: newConfig
            });
        };
        this.onStrokeSizeChange = (value) => {
            var _a, _b, _c;
            const size = `${value.distance}${value.unit}`;
            if (size === ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.strokeStyle) === null || _c === void 0 ? void 0 : _c.size) || value.distance < 1) {
                return false;
            }
            this.onSettingChange(['strokeStyle', 'size'], size);
            this.hasSetLineSize = true;
        };
        this.onStrokeSizeAccepct = (value) => {
            var _a, _b, _c;
            const size = `${value.distance}${value.unit}`;
            if (size === ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.strokeStyle) === null || _c === void 0 ? void 0 : _c.size) || value.distance < 1) {
                return false;
            }
            this.onSettingChange(['strokeStyle', 'size'], size);
            this.hasSetLineSize = true;
        };
        this.onColorChange = (value) => {
            var _a, _b, _c;
            if (value === ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.strokeStyle) === null || _c === void 0 ? void 0 : _c.color)) {
                return false;
            }
            this.onSettingChange(['strokeStyle', 'color'], value);
        };
        this.onPointStyleChange = (key, value) => {
            var _a, _b;
            const prePointStyle = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config[key]) === null || _b === void 0 ? void 0 : _b.pointStyle;
            if (value === prePointStyle)
                return false;
            this.onSettingChange([key, 'pointStyle'], value);
        };
        this.onPointSizeChange = (key, value) => {
            var _a, _b;
            const prePointStyle = (_b = (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.config[key]) === null || _b === void 0 ? void 0 : _b.pointSize;
            if (value === prePointStyle)
                return false;
            this.onSettingChange([key, 'pointSize'], value);
        };
        this.state = {
            isLinkSettingShown: false,
            isAdvance: false,
            strokeSize: (_b = (_a = props === null || props === void 0 ? void 0 : props.config) === null || _a === void 0 ? void 0 : _a.strokeStyle) === null || _b === void 0 ? void 0 : _b.size
        };
    }
    render() {
        const { config, theme, theme2, intl } = this.props;
        const { direction, strokeStyle, pointEnd, pointStart } = config;
        return (jsx("div", { className: classNames(`${prefix}card-setting`, `${prefix}setting`), css: this.getStyle(this.props.theme) },
            jsx(SettingSection, null,
                jsx(SettingRow, { role: 'group', label: this.translate('direction', true), "aria-label": this.translate('direction', true) },
                    jsx(DirectionSelector, { vertical: direction === Direction.Vertical, onChange: this.onDirectionChange, "aria-pressed": true }))),
            jsx(SettingSection, { title: this.translate('style', true), className: 'border-bottom-0' },
                jsx(SettingRow, { role: 'group', label: this.translate('color'), "aria-label": this.translate('color') },
                    jsx(ThemeColorPicker, { value: strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.color, specificTheme: theme2, onChange: this.onColorChange })),
                jsx(SettingRow, { role: 'group', className: 'divider-setting-label-con', label: this.translate('stroke'), "aria-label": this.translate('stroke') },
                    jsx(LineStyleSelector, { intl: intl, value: (strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.type) || null, onChange: this.onLineStyleChange, className: 'mr-2 f-grow-1' }),
                    jsx("div", { className: 'unit-width' },
                        jsx(InputUnit, { units: this.units, value: strokeStyle === null || strokeStyle === void 0 ? void 0 : strokeStyle.size, onChange: this.onStrokeSizeChange, className: 'item' })))),
            jsx(SettingSection, { className: 'pt-0 start-end-point' },
                jsx(SettingRow, { role: 'group', className: 'divider-setting-label-con', label: this.translate('startpoints'), "aria-label": this.translate('startpoints') },
                    jsx("div", { className: 'd-flex align-items-center' },
                        jsx(PointStyleSelector, { intl: intl, value: pointStart === null || pointStart === void 0 ? void 0 : pointStart.pointStyle, isPointStart: true, onChange: (value) => {
                                this.onPointStyleChange('pointStart', value);
                            } }))),
                (pointStart === null || pointStart === void 0 ? void 0 : pointStart.pointStyle) !== PointStyle.None && jsx(SettingRow, { className: 'divider-setting-label-con', role: 'group', "aria-label": this.translate('startpoints') },
                    jsx(RangeInput, { theme: theme, pointStyle: pointStart === null || pointStart === void 0 ? void 0 : pointStart.pointStyle, value: pointStart === null || pointStart === void 0 ? void 0 : pointStart.pointSize, intl: this.translate, onChange: value => {
                            this.onPointSizeChange('pointStart', value);
                        } })),
                jsx(SettingRow, { role: 'group', label: this.translate('endpoints'), className: 'divider-setting-label-con', "aria-label": this.translate('endpoints') },
                    jsx("div", { className: 'd-flex align-items-center' },
                        jsx(PointStyleSelector, { intl: intl, value: pointEnd === null || pointEnd === void 0 ? void 0 : pointEnd.pointStyle, isPointStart: false, onChange: (value) => {
                                this.onPointStyleChange('pointEnd', value);
                            } }))),
                (pointEnd === null || pointEnd === void 0 ? void 0 : pointEnd.pointStyle) !== PointStyle.None && jsx(SettingRow, { className: 'divider-setting-label-con', role: 'group', "aria-label": this.translate('endpoints') },
                    jsx(RangeInput, { theme: theme, pointStyle: pointEnd === null || pointEnd === void 0 ? void 0 : pointEnd.pointStyle, value: pointEnd === null || pointEnd === void 0 ? void 0 : pointEnd.pointSize, intl: this.translate, onChange: value => {
                            this.onPointSizeChange('pointEnd', value);
                        } })))));
    }
}
//# sourceMappingURL=setting.js.map