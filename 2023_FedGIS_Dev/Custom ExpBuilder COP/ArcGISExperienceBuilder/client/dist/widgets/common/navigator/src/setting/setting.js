/** @jsx jsx */
/* eslint-disable prefer-const */
import { React, css, jsx, Immutable, polished } from 'jimu-core';
import { SettingSection, SettingRow, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import { ViewType } from '../config';
import { MultiSelect, Select, Radio, Label, Switch, TextInput, NumericInput, hooks, Tooltip, Button, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { getSectionLabel, useViewNavigationVariant, getViewNavigationVariant, getViewSelectItems, useContainerSections, useSectionViews } from './utils';
import { SliderStyleSetting } from './slider-style-setting';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
import { NavStyleSettingByState, NavIconPicker, InputUnit, TextAlignment } from 'jimu-ui/advanced/style-setting-components';
import defaultMessages from './translations/default';
import { useTheme2 } from 'jimu-theme';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
const useStyle = (theme) => {
    var _a;
    const dark600 = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette.dark[600];
    return React.useMemo(() => {
        return css `
        .jimu-multi-select {
          width: 100%;
          > .jimu-dropdown {
            width: 100%;
          }
          > .jimu-menu-item {
            width: 100%;
            height: ${polished.rem(26)};
          }
        }
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
        .list-guide-tip-button {
          svg {
            margin-top: ${polished.rem(-2)};
          }
        }
        .title-1 {
          > label {
            font-size: ${polished.rem(14)} !important;
            color: ${dark600} !important;
          }
        }
      `;
    }, [dark600]);
};
const Setting = (props) => {
    var _a, _b, _c;
    const appTheme = useTheme2();
    const translate = hooks.useTranslate(jimuiDefaultMessage, defaultMessages);
    const { config, id, onSettingChange, theme } = props;
    const data = (_a = config === null || config === void 0 ? void 0 : config.data) !== null && _a !== void 0 ? _a : Immutable({});
    const display = (_b = config === null || config === void 0 ? void 0 : config.display) !== null && _b !== void 0 ? _b : Immutable({});
    const { section, type: viewType, views: cfView } = data;
    const { vertical, type, navStyle, variant: cfVariant, advanced, standard } = display;
    const { showIcon, showText, showTitle, alternateIcon, activedIcon, previousText, previousIcon, nextText, nextIcon, hideThumb, step = 1, textAlign, gap } = standard || {};
    const variant = useViewNavigationVariant(type, navStyle, advanced, cfVariant);
    const background = (_c = variant === null || variant === void 0 ? void 0 : variant.root) === null || _c === void 0 ? void 0 : _c.bg;
    const sections = useContainerSections(id);
    const views = useSectionViews(section);
    const style = useStyle(theme);
    const [newPreviousText, setNewPreviousText] = React.useState(previousText);
    const [newNextText, setNewNextText] = React.useState(nextText);
    React.useEffect(() => {
        newPreviousText !== previousText && setNewPreviousText(previousText);
        newNextText !== nextText && setNewNextText(previousText);
        // eslint-disable-next-line
    }, [previousText, nextText]);
    const onSettingConfigChange = (key, value) => {
        onSettingChange({
            id,
            config: Array.isArray(key) ? config.setIn(key, value) : config.set(key, value)
        });
    };
    const renderSelectText = (values) => {
        const viewNumber = values ? values.length : 0;
        return translate('viewsSelected', { viewNumber });
    };
    const onViewsSelectClick = (_, __, vs) => {
        //sort views by section.views
        vs.sort((a, b) => {
            return (views === null || views === void 0 ? void 0 : views.indexOf(a)) - (views === null || views === void 0 ? void 0 : views.indexOf(b));
        });
        onSettingConfigChange(['data', 'views'], vs);
    };
    const onAdvancedChange = () => {
        const advanced = !(config === null || config === void 0 ? void 0 : config.display.advanced);
        let display = config.display.set('advanced', advanced);
        if (advanced) {
            const variant = getViewNavigationVariant(type, navStyle);
            display = display.set('variant', variant);
        }
        else {
            display = display.set('variant', undefined);
        }
        onSettingConfigChange('display', display);
    };
    const handleVariantItemChange = (state, key, value) => {
        onSettingConfigChange(['display', 'variant', 'item', state, key], value);
    };
    const handlePreviousTextChange = (e) => {
        const value = e.target.value;
        setNewPreviousText(value);
    };
    const handleNextTextChange = (e) => {
        const value = e.target.value;
        setNewNextText(value);
    };
    return jsx("div", { className: "widget-setting-navigator jimu-widget-setting", css: style },
        jsx(SettingSection, null,
            jsx(SettingRow, { flow: "wrap", label: translate('linkTo') },
                jsx(Select, { size: 'sm', value: section, onChange: e => onSettingConfigChange(['data', 'section'], e.target.value) }, sections.map((sid, index) => jsx("option", { key: index, value: sid }, getSectionLabel(sid))))),
            section && jsx(React.Fragment, null,
                type === 'nav' && jsx(SettingRow, { label: translate('views'), flow: "wrap" },
                    jsx("div", { className: "radio-container" },
                        jsx(Radio, { id: "view-type-auto", style: { cursor: 'pointer' }, name: "view-type", onChange: e => onSettingConfigChange(['data', 'type'], ViewType.Auto), checked: viewType === ViewType.Auto }),
                        jsx(Label, { style: { cursor: 'pointer' }, for: "view-type-auto", className: "ml-2" }, translate('auto'))),
                    jsx("div", { className: "radio-container" },
                        jsx(Radio, { id: "view-type-custom", style: { cursor: 'pointer' }, name: "view-type", onChange: e => onSettingConfigChange(['data', 'type'], ViewType.Custom), checked: viewType === ViewType.Custom }),
                        jsx(Label, { style: { cursor: 'pointer' }, for: "view-type-custom", className: "ml-2" }, translate('custom')))),
                viewType === ViewType.Custom && jsx(SettingRow, { flow: "wrap" },
                    jsx(MultiSelect, { values: cfView, items: getViewSelectItems(views), onClickItem: onViewsSelectClick, displayByValues: renderSelectText })),
                type !== 'slider' && jsx(SettingRow, { flow: "no-wrap", label: translate('direction') },
                    jsx(DirectionSelector, { vertical: vertical, onChange: (vertical) => onSettingConfigChange(['display', 'vertical'], vertical) })),
                type === 'nav' && jsx(SettingRow, { label: translate('space'), flow: "no-wrap" },
                    jsx(InputUnit, { size: 'sm', className: "w-50", value: gap, onChange: (value) => onSettingConfigChange(['display', 'standard', 'gap'], `${value.distance}${value.unit}`) })),
                type === 'nav' && jsx(SettingRow, { flow: "no-wrap", label: translate('alignment') },
                    jsx(TextAlignment, { textAlign: textAlign, onChange: (value) => onSettingConfigChange(['display', 'standard', 'textAlign'], value) })),
                (type === 'nav' && showIcon && !showText) && jsx(SettingRow, { flow: "no-wrap", label: translate('tooltip') },
                    jsx(Switch, { checked: showTitle, onChange: () => onSettingConfigChange(['display', 'standard', 'showTitle'], !showTitle) })),
                (type === 'nav' && showIcon) && jsx(React.Fragment, null,
                    jsx(SettingRow, { flow: "no-wrap", label: translate('symbol'), className: "title-1" }),
                    jsx(SettingRow, { flow: "no-wrap", label: translate('currentView') },
                        jsx(NavIconPicker, { configurableOption: 'none', hideRemove: true, size: 8, icon: activedIcon, onChange: (icon) => onSettingConfigChange(['display', 'standard', 'activedIcon'], icon) })),
                    jsx(SettingRow, { flow: "no-wrap", label: translate('others') },
                        jsx(NavIconPicker, { configurableOption: 'none', hideRemove: true, size: 8, icon: alternateIcon, onChange: (icon) => onSettingConfigChange(['display', 'standard', 'alternateIcon'], icon) }))),
                type === 'navButtonGroup' && jsx(SettingRow, { flow: "no-wrap", label: (jsx("div", null,
                        translate('step'),
                        jsx(Tooltip, { title: translate('stepTips'), showArrow: false, placement: 'bottom' },
                            jsx(Button, { className: 'list-guide-tip-button', type: 'tertiary', "aria-label": translate('stepTips') },
                                jsx(InfoOutlined, { size: 's' }))))) },
                    jsx(NumericInput, { size: "sm", value: step, style: { width: '27%' }, showHandlers: false, min: 0.1, max: 1, onAcceptValue: value => onSettingConfigChange(['display', 'standard', 'step'], +value) })),
                type === 'navButtonGroup' && jsx(React.Fragment, null,
                    jsx(SettingRow, { flow: "wrap", label: translate('previous'), className: "justify-content-between" },
                        jsx(TextInput, { size: "sm", style: { width: '61%' }, value: newPreviousText, onChange: handlePreviousTextChange, onAcceptValue: (value) => onSettingConfigChange(['display', 'standard', 'previousText'], value) }),
                        jsx(IconPicker, { configurableOption: 'none', icon: previousIcon, onChange: (icon) => onSettingConfigChange(['display', 'standard', 'previousIcon'], icon), setButtonUseColor: false })),
                    jsx(SettingRow, { flow: "wrap", label: translate('next'), className: "justify-content-between" },
                        jsx(TextInput, { size: "sm", style: { width: '61%' }, value: newNextText, onChange: handleNextTextChange, onAcceptValue: (value) => onSettingConfigChange(['display', 'standard', 'nextText'], value) }),
                        jsx(IconPicker, { configurableOption: 'none', icon: nextIcon, onChange: (icon) => onSettingConfigChange(['display', 'standard', 'nextIcon'], icon), setButtonUseColor: false }))),
                type === 'slider' && jsx(SettingRow, { label: translate('thumbHandle'), flow: "no-wrap" },
                    jsx(Switch, { checked: !hideThumb, onChange: () => onSettingConfigChange(['display', 'standard', 'hideThumb'], !hideThumb) })))),
        section && jsx(SettingSection, null,
            jsx(SettingRow, { flow: "no-wrap", label: translate('advance') },
                jsx(Switch, { checked: advanced, onChange: onAdvancedChange })),
            advanced && jsx(React.Fragment, null,
                jsx(SettingRow, { label: translate('background'), flow: "no-wrap" },
                    jsx(ThemeColorPicker, { specificTheme: appTheme, value: background, onChange: (value) => onSettingConfigChange(['display', 'variant', 'root', 'bg'], value) })),
                type === 'nav' && !showIcon && jsx(SettingRow, { label: translate('tabStyle'), flow: "no-wrap" }),
                type === 'navButtonGroup' && jsx(SettingRow, { label: translate('navBtnStyle'), flow: "no-wrap" }),
                type === 'nav' && jsx(NavStyleSettingByState, { variant: variant, onlyBorderColor: navStyle === 'underline', text: showText, icon: showIcon, onChange: handleVariantItemChange }),
                type === 'slider' && jsx(SliderStyleSetting, { hideThumb: hideThumb, variant: variant, onChange: onSettingConfigChange }),
                type === 'navButtonGroup' && jsx(NavStyleSettingByState, { variant: variant, states: ['default', 'hover', 'disabled'], onlyBorderColor: false, text: true, icon: false, iconInText: true, onChange: handleVariantItemChange }))));
};
export default Setting;
//# sourceMappingURL=setting.js.map