/** @jsx jsx */
import { React, jsx, css, classNames } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { getTheme2 } from 'jimu-theme';
import { BorderSetting, BackgroundSetting, InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { Switch, Select, DistanceUnits, Icon, Button, NumericInput, Collapse, utils as uiUtils } from 'jimu-ui';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { SidebarType, CollapseSides } from '../config';
import { PREDEFINED_TOGGLE_STYLE } from './toggle-button-config';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
import { DownFilled } from 'jimu-icons/filled/directional/down';
import { DownDoubleOutlined } from 'jimu-icons/outlined/directional/down-double';
const availableUnits = [DistanceUnits.PIXEL];
const STYLE_NAMES = ['default', 'rect'];
const iconTop = require('./assets/sidebar-top.svg');
const iconBottom = require('./assets/sidebar-bottom.svg');
const iconLeft = require('./assets/sidebar-left.svg');
const iconRight = require('./assets/sidebar-right.svg');
const inputStyle = { width: '7.5rem' };
function findToggleBtnStyle(direction, side) {
    if (direction === SidebarType.Horizontal) {
        return side === CollapseSides.First ? PREDEFINED_TOGGLE_STYLE.left : PREDEFINED_TOGGLE_STYLE.right;
    }
    return side === CollapseSides.First ? PREDEFINED_TOGGLE_STYLE.top : PREDEFINED_TOGGLE_STYLE.bottom;
}
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.dockHorizontalLeft = () => {
            const { config } = this.props;
            const direction = config.direction || SidebarType.Horizontal;
            const side = config.collapseSide || CollapseSides.First;
            if (direction !== SidebarType.Horizontal || side !== CollapseSides.First) {
                this.updateDockside(SidebarType.Horizontal, CollapseSides.First);
            }
        };
        this.dockHorizontalRight = () => {
            const { config } = this.props;
            const direction = config.direction || SidebarType.Horizontal;
            const side = config.collapseSide || CollapseSides.First;
            if (direction !== SidebarType.Horizontal || side !== CollapseSides.Second) {
                this.updateDockside(SidebarType.Horizontal, CollapseSides.Second);
            }
        };
        this.dockVerticalTop = () => {
            const { config } = this.props;
            const direction = config.direction || SidebarType.Horizontal;
            const side = config.collapseSide || CollapseSides.First;
            if (direction !== SidebarType.Vertical || side !== CollapseSides.First) {
                this.updateDockside(SidebarType.Vertical, CollapseSides.First);
            }
        };
        this.dockVerticalBottom = () => {
            const { config } = this.props;
            const direction = config.direction || SidebarType.Horizontal;
            const side = config.collapseSide || CollapseSides.First;
            if (direction !== SidebarType.Vertical || side !== CollapseSides.Second) {
                this.updateDockside(SidebarType.Vertical, CollapseSides.Second);
            }
        };
        this.updateDefaultState = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.set('defaultState', +e.target.value)
            });
        };
        this.updateOverlay = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.set('overlay', e.target.checked)
            });
        };
        this.updateResizable = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.set('resizable', e.target.checked)
            });
        };
        this.updateSize = (value) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.set('size', `${value.distance}${value.unit}`)
            });
        };
        this.updateControllerPos = (e) => {
            this.updateToggleBtn('position', e.target.value);
        };
        this.updateControllerOffsetX = (value) => {
            this.updateToggleBtn('offsetX', value);
        };
        this.updateControllerOffsetY = (value) => {
            this.updateToggleBtn('offsetY', value);
        };
        this.updateControllerWidth = (value) => {
            this.updateToggleBtn('width', value);
        };
        this.updateControllerHeight = (value) => {
            this.updateToggleBtn('height', value);
        };
        this.updateControllerIconSize = (value) => {
            this.updateToggleBtn('iconSize', value);
        };
        this.updateFirstPanelBg = (bg) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['firstPanelStyle', 'background'], bg)
            });
        };
        this.updateSecondPanelBg = (bg) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['secondPanelStyle', 'background'], bg)
            });
        };
        this.updateToggleBtnBg = (bg) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config
                    .setIn(['toggleBtn', 'color', 'normal', 'bg', 'color'], bg)
                    .setIn(['toggleBtn', 'color', 'normal', 'bg', 'useTheme'], false)
            });
        };
        this.updateToggleBtnHoverBg = (bg) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config
                    .setIn(['toggleBtn', 'color', 'hover', 'bg', 'color'], bg)
                    .setIn(['toggleBtn', 'color', 'hover', 'bg', 'useTheme'], false)
            });
        };
        this.updateToggleBtnBorder = (borderStyle) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['toggleBtn', 'border'], borderStyle)
            });
        };
        this.updateToggleBtnIcon = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['toggleBtn', 'iconSource'], +e.target.value)
            });
        };
        this.updateToggleBtnIconColor = (color) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['toggleBtn', 'color', 'normal', 'icon', 'color'], color)
            });
        };
        this.updateDividerStyle = (borderStyle) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['divider', 'lineStyle'], borderStyle)
            });
        };
        this.updateDividerVisible = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['divider', 'visible'], e.target.checked)
            });
        };
        this.updateToggleBtnVisible = (e) => {
            this.props.onSettingChange({
                id: this.props.widgetId,
                config: this.props.config.setIn(['toggleBtn', 'visible'], e.target.checked)
            });
        };
        this.useDefaultToggleStyle = () => {
            const { config } = this.props;
            if (config.toggleBtn.template !== STYLE_NAMES[0]) {
                const toggleStyle = findToggleBtnStyle(config.direction, config.collapseSide)[STYLE_NAMES[0]];
                let newConfig = this.updateToggleBtnStyles(toggleStyle);
                newConfig = newConfig.setIn(['toggleBtn', 'template'], STYLE_NAMES[0]);
                this.props.onSettingChange({
                    id: this.props.widgetId,
                    config: newConfig
                });
            }
        };
        this.useRectToggleStyle = () => {
            const { config } = this.props;
            if (config.toggleBtn.template !== STYLE_NAMES[1]) {
                const toggleStyle = findToggleBtnStyle(config.direction, config.collapseSide)[STYLE_NAMES[1]];
                let newConfig = this.updateToggleBtnStyles(toggleStyle);
                newConfig = newConfig.setIn(['toggleBtn', 'template'], STYLE_NAMES[1]);
                this.props.onSettingChange({
                    id: this.props.widgetId,
                    config: newConfig
                });
            }
        };
        this.selectedToggleBtnStyle = 'default';
    }
    updateDockside(direction, side) {
        const { config } = this.props;
        const toggleBtnTemplate = config.toggleBtn.template || STYLE_NAMES[0];
        const toggleStyle = findToggleBtnStyle(direction, side)[toggleBtnTemplate];
        let newConfig = this.updateToggleBtnStyles(toggleStyle);
        newConfig = newConfig.set('direction', direction).set('collapseSide', side);
        this.props.onSettingChange({
            id: this.props.widgetId,
            config: newConfig
        });
    }
    updateToggleBtnStyles(style) {
        const { config } = this.props;
        let newConfig = config;
        [
            'offsetX',
            'offsetY',
            'position',
            'width',
            'height',
            'icon',
            'expandStyle',
            'collapseStyle'
        ].forEach((prop) => {
            newConfig = newConfig.setIn(['toggleBtn', prop], style[prop]);
        });
        return newConfig;
    }
    updateToggleBtn(prop, value) {
        this.props.onSettingChange({
            id: this.props.widgetId,
            config: this.props.config.setIn(['toggleBtn', prop], value)
        });
    }
    getStyle() {
        return css `
      .toggle-btn-style {
        background: var(--light-200);
        width: 108px;
        height: 30px;
        cursor: pointer;

        &.selected {
          outline: 2px solid var(--primary-600);
        }
      }
    `;
    }
    getDocksideStyle() {
        return css `
      .dock-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 30px;
        cursor: pointer;
        background: var(--light-200);
        border: none;

        &.selected {
          outline: 2px solid var(--primary-600);
        }
        &:hover {
          background: var(--light-200);
        }
      }
    `;
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const { config, formatMessage } = this.props;
        const appTheme = getTheme2();
        const toggleBtnTemplate = config.toggleBtn.template || STYLE_NAMES[0];
        const direction = config.direction || SidebarType.Horizontal;
        const side = config.collapseSide || CollapseSides.First;
        const isHorizontal = direction === SidebarType.Horizontal;
        return (jsx("div", { className: 'hsidebar-layout-setting', css: this.getStyle() },
            jsx(SettingSection, { title: formatMessage('panel'), role: 'group', "aria-label": formatMessage('panel') },
                jsx(SettingRow, { label: formatMessage('dockSide'), flow: 'wrap' },
                    jsx("div", { className: 'd-flex justify-content-between w-100', css: this.getDocksideStyle() },
                        jsx(Button, { className: classNames('dock-btn', { selected: isHorizontal && side === CollapseSides.First }), onClick: this.dockHorizontalLeft, "aria-label": formatMessage('left'), "aria-pressed": isHorizontal && side === CollapseSides.First, icon: true },
                            jsx(Icon, { icon: iconLeft, width: 30, height: 18, currentColor: false, autoFlip: true })),
                        jsx(Button, { className: classNames('dock-btn', { selected: isHorizontal && side === CollapseSides.Second }), onClick: this.dockHorizontalRight, "aria-label": formatMessage('right'), "aria-pressed": isHorizontal && side === CollapseSides.Second, icon: true },
                            jsx(Icon, { icon: iconRight, width: 30, height: 18, currentColor: false, autoFlip: true })),
                        jsx(Button, { className: classNames('dock-btn', { selected: !isHorizontal && side === CollapseSides.First }), onClick: this.dockVerticalTop, "aria-label": formatMessage('top'), "aria-pressed": !isHorizontal && side === CollapseSides.First, icon: true },
                            jsx(Icon, { icon: iconTop, width: 22, height: 20, currentColor: false })),
                        jsx(Button, { className: classNames('dock-btn', { selected: !isHorizontal && side === CollapseSides.Second }), onClick: this.dockVerticalBottom, "aria-label": formatMessage('bottom'), "aria-pressed": !isHorizontal && side === CollapseSides.Second, icon: true },
                            jsx(Icon, { icon: iconBottom, width: 22, height: 20, currentColor: false })))),
                jsx(SettingRow, { label: formatMessage('size') },
                    jsx(InputUnit, { "aria-label": formatMessage('size'), units: availableUnits, value: uiUtils.stringOfLinearUnit(config.size), style: inputStyle, onChange: this.updateSize })),
                jsx(SettingRow, { label: formatMessage('overlay') },
                    jsx(Switch, { "aria-label": formatMessage('overlay'), checked: config.overlay, onChange: this.updateOverlay })),
                jsx(SettingRow, { label: formatMessage('resizable') },
                    jsx(Switch, { "aria-label": formatMessage('resizable'), checked: config.resizable, onChange: this.updateResizable })),
                jsx(SettingRow, { label: formatMessage('defaultState') },
                    jsx(Select, { "aria-label": formatMessage('defaultState'), size: 'sm', value: config.defaultState, onChange: this.updateDefaultState, style: inputStyle },
                        jsx("option", { value: '1' }, formatMessage('expanded')),
                        jsx("option", { value: '0' }, formatMessage('collapsed'))))),
            jsx(SettingSection, { title: jsx("div", { className: 'd-flex' },
                    jsx("div", null, formatMessage('toggleBtn')),
                    jsx("div", { className: 'ml-auto' },
                        jsx(Switch, { "aria-label": formatMessage('toggleBtn'), checked: config.toggleBtn.visible, onChange: this.updateToggleBtnVisible }))) },
                jsx(Collapse, { isOpen: config.toggleBtn.visible },
                    jsx(SettingRow, { label: formatMessage('style'), flow: 'wrap' },
                        jsx("div", { className: 'd-flex w-100 justify-content-between' },
                            jsx(Button, { className: classNames('border-0 toggle-btn-style d-flex justify-content-center align-items-center', {
                                    selected: toggleBtnTemplate === STYLE_NAMES[0]
                                }), "aria-pressed": toggleBtnTemplate === STYLE_NAMES[0], onClick: this.useDefaultToggleStyle },
                                jsx("div", { css: css `
                      width: 60px;
                      height: 15px;
                      background: var(--light-800);
                      border-radius: 100px 100px 0 0;
                    `, className: 'd-flex justify-content-center align-items-center' })),
                            jsx(Button, { className: classNames('border-0 toggle-btn-style d-flex justify-content-center align-items-center ml-1', {
                                    selected: toggleBtnTemplate === STYLE_NAMES[1]
                                }), "aria-pressed": toggleBtnTemplate === STYLE_NAMES[1], onClick: this.useRectToggleStyle },
                                jsx("div", { css: css `
                      width: 40px;
                      height: 15px;
                      background: var(--light-800);
                      border-radius: 4px 4px 0 0;
                    `, className: 'toggle-btn d-flex justify-content-center align-items-center' })))),
                    jsx(SettingRow, { label: formatMessage('icon'), flow: 'wrap' },
                        jsx("div", { className: 'd-flex justify-content-between align-items-center' },
                            jsx(ThemeColorPicker, { title: formatMessage('iconBackground'), "aria-label": formatMessage('iconBackground'), specificTheme: appTheme, onChange: this.updateToggleBtnIconColor, value: (_d = (_c = (_b = (_a = config.toggleBtn.color) === null || _a === void 0 ? void 0 : _a.normal) === null || _b === void 0 ? void 0 : _b.icon) === null || _c === void 0 ? void 0 : _c.color) !== null && _d !== void 0 ? _d : appTheme.colors.black }),
                            jsx(Select, { "aria-label": formatMessage('type'), size: 'sm', css: css `width: 30%`, value: (_e = config.toggleBtn.iconSource) !== null && _e !== void 0 ? _e : 0, onChange: this.updateToggleBtnIcon },
                                jsx("option", { value: '0' },
                                    jsx(DownOutlined, { size: 's' })),
                                jsx("option", { value: '1' },
                                    jsx(DownDoubleOutlined, { size: 's' })),
                                jsx("option", { value: '2' },
                                    jsx(DownFilled, { size: 's' }))),
                            jsx(NumericInput, { "aria-label": formatMessage('iconSize'), size: 'sm', css: css `width: 40%`, value: config.toggleBtn.iconSize, onChange: this.updateControllerIconSize }))),
                    jsx(SettingRow, { label: formatMessage('background'), flow: 'wrap' },
                        jsx("div", { className: 'w-100' },
                            jsx("div", { className: 'd-flex align-items-center justify-content-between mt-1' },
                                jsx("span", { className: 'setting-text-level-3' }, formatMessage('default')),
                                jsx(ThemeColorPicker, { title: formatMessage('background'), "aria-label": formatMessage('background'), specificTheme: appTheme, onChange: this.updateToggleBtnBg, value: (_j = (_h = (_g = (_f = config.toggleBtn.color) === null || _f === void 0 ? void 0 : _f.normal) === null || _g === void 0 ? void 0 : _g.bg) === null || _h === void 0 ? void 0 : _h.color) !== null && _j !== void 0 ? _j : appTheme.colors.light })),
                            jsx("div", { className: 'd-flex align-items-center justify-content-between mt-2' },
                                jsx("span", { className: 'setting-text-level-3' }, formatMessage('hover')),
                                jsx(ThemeColorPicker, { title: formatMessage('background'), "aria-label": formatMessage('background'), specificTheme: appTheme, onChange: this.updateToggleBtnHoverBg, value: (_o = (_m = (_l = (_k = config.toggleBtn.color) === null || _k === void 0 ? void 0 : _k.hover) === null || _l === void 0 ? void 0 : _l.bg) === null || _m === void 0 ? void 0 : _m.color) !== null && _o !== void 0 ? _o : appTheme.colors.light })))),
                    jsx(SettingRow, { label: formatMessage('border'), flow: 'wrap' },
                        jsx(BorderSetting, { value: config.toggleBtn.border, onChange: this.updateToggleBtnBorder })),
                    jsx(SettingRow, { label: formatMessage('width') },
                        jsx(NumericInput, { "aria-label": formatMessage('width'), size: 'sm', style: inputStyle, value: config.toggleBtn.width, onChange: this.updateControllerWidth })),
                    jsx(SettingRow, { label: formatMessage('height') },
                        jsx(NumericInput, { "aria-label": formatMessage('height'), size: 'sm', style: inputStyle, value: config.toggleBtn.height, onChange: this.updateControllerHeight })),
                    jsx(SettingRow, { label: formatMessage('position') },
                        jsx(Select, { "aria-label": formatMessage('position'), size: 'sm', value: config.toggleBtn.position, onChange: this.updateControllerPos, style: inputStyle },
                            jsx("option", { value: 'START' }, isHorizontal ? formatMessage('T') : formatMessage('L')),
                            jsx("option", { value: 'CENTER' }, formatMessage('center')),
                            jsx("option", { value: 'END' }, isHorizontal ? formatMessage('B') : formatMessage('R')))),
                    jsx(SettingRow, { label: formatMessage('offsetX') },
                        jsx(NumericInput, { "aria-label": formatMessage('offsetX'), size: 'sm', style: inputStyle, value: config.toggleBtn.offsetX, onChange: this.updateControllerOffsetX })),
                    jsx(SettingRow, { label: formatMessage('offsetY') },
                        jsx(NumericInput, { "aria-label": formatMessage('offsetY'), size: 'sm', style: inputStyle, value: config.toggleBtn.offsetY, onChange: this.updateControllerOffsetY })))),
            jsx(SettingSection, { title: jsx("div", { className: 'd-flex' },
                    jsx("div", null, formatMessage('divider')),
                    jsx("div", { className: 'ml-auto' },
                        jsx(Switch, { "aria-label": formatMessage('divider'), checked: config.divider.visible, onChange: this.updateDividerVisible }))) },
                jsx(Collapse, { isOpen: config.divider.visible },
                    jsx(SettingRow, { label: formatMessage('style'), flow: 'wrap' },
                        jsx(BorderSetting, { value: config.divider.lineStyle, onChange: this.updateDividerStyle })))),
            jsx(SettingSection, { title: isHorizontal ? formatMessage('leftPanel') : formatMessage('topPanel') },
                jsx(SettingRow, null,
                    jsx(BackgroundSetting, { background: (_p = config.firstPanelStyle) === null || _p === void 0 ? void 0 : _p.background, onChange: this.updateFirstPanelBg }))),
            jsx(SettingSection, { title: isHorizontal ? formatMessage('rightPanel') : formatMessage('bottomPanel') },
                jsx(SettingRow, null,
                    jsx(BackgroundSetting, { background: (_q = config.secondPanelStyle) === null || _q === void 0 ? void 0 : _q.background, onChange: this.updateSecondPanelBg })))));
    }
}
//# sourceMappingURL=layout-setting.js.map