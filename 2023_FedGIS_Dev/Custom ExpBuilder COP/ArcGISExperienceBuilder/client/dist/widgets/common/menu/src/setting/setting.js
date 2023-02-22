/** @jsx jsx */
/* eslint-disable prefer-const */
import { React, css, jsx, Immutable } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { MenuType } from '../config';
import { Select, Radio, Label, Switch, hooks, TextAlignValue, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
import { InputUnit, NavStyleSettingByState, TextAlignment } from 'jimu-ui/advanced/style-setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { useMenuNavigationVariant, getMenuNavigationVariant } from './utils';
import defaultMessage from './translations/default';
import { useTheme2 } from 'jimu-theme';
const defaultIcon = {
    svg: 
    // eslint-disable-next-line max-len
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="css-1i7frhi jimu-icon"><path d="M2 1a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4zm0 7a1 1 0 100 2h12a1 1 0 100-2H2zm0-1h12a2 2 0 010 4H2a2 2 0 010-4z" fill="currentColor" fill-rule="nonzero"></path></svg>',
    properties: {
        color: 'var(--dark-800)',
        size: 20,
        inlineSvg: true
    }
};
const getPaperFromTheme = (theme) => {
    var _a;
    return (_a = theme === null || theme === void 0 ? void 0 : theme.components) === null || _a === void 0 ? void 0 : _a.paper;
};
const style = css `
  .radio-container {
    display: flex;
    width: 100%;
    margin-top: 0.5rem;
    > span.jimu-radio {
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    > label {
      margin-bottom: 0;
    }
  }
`;
const Setting = (props) => {
    var _a, _b, _c;
    const translate = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const appTheme = useTheme2();
    const { config: _config, id, onSettingChange } = props;
    const { vertical, type, menuStyle, variant: cfVariant, advanced, standard } = _config;
    const { anchor, textAlign, icon, submenuMode, gap, showIcon } = standard || {};
    const variant = useMenuNavigationVariant('nav', menuStyle, advanced, cfVariant);
    const paper = advanced ? _config === null || _config === void 0 ? void 0 : _config.paper : getPaperFromTheme(appTheme);
    const menuType = type === 'drawer'
        ? MenuType.Icon
        : vertical
            ? MenuType.Vertical
            : MenuType.Horizontal;
    const generateNavTypes = () => {
        return [
            { label: translate('default'), value: 'default' },
            { label: translate('underline'), value: 'underline' },
            { label: translate('pills'), value: 'pills' }
        ];
    };
    const onSettingConfigChange = (key, value) => {
        onSettingChange({
            id,
            config: Array.isArray(key)
                ? _config.setIn(key, value)
                : _config.set(key, value)
        });
    };
    const onAdvancedChange = () => {
        const advanced = !(_config === null || _config === void 0 ? void 0 : _config.advanced);
        let config = _config.set('advanced', advanced);
        if (advanced) {
            const variant = getMenuNavigationVariant('nav', menuStyle);
            const paper = getPaperFromTheme(appTheme);
            config = config.set('variant', variant).set('paper', paper);
        }
        else {
            config = config.without('variant').without('paper');
        }
        onSettingChange({ id, config });
    };
    const onTypeChange = (evt) => {
        const menuType = evt.target.value;
        const type = menuType === MenuType.Icon ? 'drawer' : 'nav';
        const anchor = menuType === MenuType.Icon ? 'left' : '';
        const vertical = menuType !== MenuType.Horizontal;
        const submenuMode = !vertical ? 'dropdown' : 'foldable';
        const icon = menuType === MenuType.Icon ? Immutable(defaultIcon) : null;
        const standard = {
            icon,
            anchor,
            submenuMode,
            textAlign: TextAlignValue.CENTER,
            gap: '0px'
        };
        const config = _config
            .set('type', type)
            .set('menuStyle', 'default')
            .set('standard', standard)
            .set('advanced', false)
            .without('variant')
            .without('paper')
            .set('vertical', vertical);
        onSettingChange({ id, config });
    };
    const onNavTypeRadioChange = (e, value) => {
        const checked = e.currentTarget.checked;
        if (!checked) {
            return;
        }
        let config = _config
            .set('menuStyle', value)
            .set('advanced', false)
            .set('variant', null);
        onSettingChange({ id, config });
    };
    const handleVariantItemChange = (state, key, value) => {
        onSettingConfigChange(['variant', 'item', state, key], value);
    };
    return (jsx("div", { css: style, className: 'widget-setting-menu jimu-widget-setting' },
        jsx(SettingSection, null,
            jsx(SettingRow, { label: translate('type') },
                jsx(Select, { size: 'sm', value: menuType, onChange: onTypeChange, style: { width: '50%' } },
                    jsx("option", { value: MenuType.Icon }, translate('icon')),
                    jsx("option", { value: MenuType.Vertical }, translate('vertical')),
                    jsx("option", { value: MenuType.Horizontal }, translate('horizontal')))),
            type === 'drawer' && (jsx(SettingRow, { label: translate('location'), flow: 'no-wrap' },
                jsx(Select, { size: 'sm', style: { width: '50%' }, value: anchor, onChange: evt => onSettingConfigChange(['standard', 'anchor'], evt.target.value) },
                    jsx("option", { value: 'left' }, translate('left')),
                    jsx("option", { value: 'right' }, translate('right'))))),
            vertical && (jsx(SettingRow, { label: translate('subMenuExpandMode'), flow: 'wrap' },
                jsx(Select, { size: 'sm', value: submenuMode, onChange: evt => onSettingConfigChange(['standard', 'submenuMode'], evt.target.value) },
                    jsx("option", { value: 'foldable' }, translate('foldable')),
                    jsx("option", { value: 'static' }, translate('expand'))))),
            type === 'drawer' && (jsx(React.Fragment, null,
                jsx(SettingRow, { label: translate('icon'), flow: 'no-wrap' },
                    jsx(IconPicker, { hideRemove: true, icon: icon, previewOptions: { color: true, size: false }, onChange: icon => onSettingConfigChange(['standard', 'icon'], icon), setButtonUseColor: false })),
                jsx(SettingRow, { label: translate('iconSize'), flow: 'no-wrap' },
                    jsx(InputUnit, { size: 'sm', className: "w-50", value: `${(_b = (_a = icon === null || icon === void 0 ? void 0 : icon.properties) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0}px`, onChange: (value) => onSettingConfigChange(['standard', 'icon', 'properties', 'size'], value.distance) }))))),
        jsx(SettingSection, { title: translate('appearance') },
            jsx(SettingRow, { label: translate('style'), flow: 'wrap' }, generateNavTypes().map((item, index) => (jsx("div", { className: 'radio-container', key: index },
                jsx(Radio, { id: 'nav-style-type' + index, style: { cursor: 'pointer' }, name: 'style-type', onChange: e => onNavTypeRadioChange(e, item.value), checked: menuStyle === item.value }),
                jsx(Label, { style: { cursor: 'pointer' }, for: 'nav-style-type' + index, className: 'ml-2 text-break' }, item.label))))),
            jsx(SettingRow, { label: translate('space'), flow: 'no-wrap' },
                jsx(InputUnit, { size: 'sm', className: 'w-50', value: gap, onChange: value => onSettingConfigChange(['standard', 'gap'], `${value.distance}${value.unit}`) })),
            jsx(SettingRow, { flow: 'no-wrap', label: translate('alignment') },
                jsx(TextAlignment, { textAlign: textAlign, onChange: value => onSettingConfigChange(['standard', 'textAlign'], value) })),
            jsx(SettingRow, { flow: 'no-wrap', label: translate('showIcon') },
                jsx(Switch, { checked: showIcon, onChange: (_, value) => onSettingConfigChange(['standard', 'showIcon'], value) }))),
        jsx(SettingSection, null,
            jsx(SettingRow, { flow: 'no-wrap', label: translate('advance') },
                jsx(Switch, { checked: advanced, onChange: onAdvancedChange })),
            advanced && (jsx(React.Fragment, null,
                type !== 'drawer' && (jsx(SettingRow, { label: translate('background'), flow: 'no-wrap' },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: (_c = variant === null || variant === void 0 ? void 0 : variant.root) === null || _c === void 0 ? void 0 : _c.bg, onChange: value => onSettingConfigChange(['variant', 'root', 'bg'], value) }))),
                type === 'drawer' && (jsx(SettingRow, { label: translate('background'), flow: 'no-wrap' },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: paper === null || paper === void 0 ? void 0 : paper.bg, onChange: value => onSettingConfigChange(['paper', 'bg'], value) }))),
                jsx(NavStyleSettingByState, { variant: variant, onlyBorderColor: menuStyle === 'underline', text: true, icon: false, iconInText: showIcon, onChange: handleVariantItemChange }))))));
};
export default Setting;
//# sourceMappingURL=setting.js.map