/** @jsx jsx */
import { css, jsx, polished, Immutable, ReactRedux } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { SettingSection, SettingRow, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import { defaultMessages as jimuLayoutMessages, searchUtils } from 'jimu-layouts/layout-runtime';
import { DisplayType } from '../config';
import { Switch, Radio, Select, Label, defaultMessages as jimuUiDefaultMessages, MultiSelect, hooks, DistanceUnits } from 'jimu-ui';
import defaultMessages from './translations/default';
import { Shapes, ShapeType } from './shapes';
import { InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { BASE_LAYOUT_NAME } from '../common/consts';
import { SettingAdvanced } from './setting-advanced';
import { LabelTooltip } from './label-tooltip';
import { useTheme2 } from 'jimu-theme';
const DEFAULT_COLOR = '#080808';
const DEFAULT_OPEN_START = 'none';
const style = css `
    font-size: 13px;
    font-weight: lighter;
    .setting-row-item {
      width: 100%;
      display: flex;
      margin-top: 0.5rem;
      > span.jimu-radio {
        flex-shrink: 0;
        margin-top: 0.1rem;
      }
      > label {
        margin-bottom: 0;
      }
    }
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
  `;
const getWidgetIdsFromLayout = (layout) => {
    var _a, _b, _c;
    const order = (_c = (_b = (_a = layout === null || layout === void 0 ? void 0 : layout.order) === null || _a === void 0 ? void 0 : _a.asMutable) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [];
    let layoutItems = order.map(itemId => { var _a; return (_a = layout.content) === null || _a === void 0 ? void 0 : _a[itemId]; });
    layoutItems = layoutItems.filter(layoutItem => (layoutItem && layoutItem.id && layoutItem.widgetId && !layoutItem.isPending));
    const layoutItem = layoutItems.map(layoutItem => layoutItem.id);
    return layoutItem.map(itemId => { var _a, _b; return (_b = (_a = layout.content) === null || _a === void 0 ? void 0 : _a[itemId]) === null || _b === void 0 ? void 0 : _b.widgetId; });
};
const useControlledWidgets = (id, layoutName) => {
    const layout = ReactRedux.useSelector((state) => {
        var _a, _b, _c, _d;
        state = state.appStateInBuilder;
        const layouts = (_c = (_b = (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[layoutName];
        const browserSizeMode = state.browserSizeMode;
        const mainSizeMode = state.appConfig.mainSizeMode;
        const layoutId = searchUtils.findLayoutId(layouts, browserSizeMode, mainSizeMode);
        const layout = (_d = state.appConfig.layouts) === null || _d === void 0 ? void 0 : _d[layoutId];
        return layout;
    });
    const controlledWidgets = getWidgetIdsFromLayout(layout);
    const widgets = ReactRedux.useSelector((state) => state.appStateInBuilder.appConfig.widgets);
    const imControlledWidgets = Immutable(controlledWidgets || []);
    return imControlledWidgets.map((widgetId) => {
        var _a;
        return ({
            label: (_a = widgets[widgetId]) === null || _a === void 0 ? void 0 : _a.label,
            value: widgetId
        });
    });
};
const getButtonVariant = (theme, config) => {
    var _a, _b, _c, _d, _e;
    const type = ((_b = (_a = config === null || config === void 0 ? void 0 : config.appearance) === null || _a === void 0 ? void 0 : _a.card.avatar) === null || _b === void 0 ? void 0 : _b.type) || 'primary';
    let variant = (_e = (_d = (_c = theme === null || theme === void 0 ? void 0 : theme.components) === null || _c === void 0 ? void 0 : _c.button) === null || _d === void 0 ? void 0 : _d.variants) === null || _e === void 0 ? void 0 : _e[type];
    variant = variant.setIn(['default', 'color'], DEFAULT_COLOR);
    variant = variant.setIn(['active', 'color'], DEFAULT_COLOR);
    return variant;
};
const Setting = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const { id, config, onSettingChange } = props;
    const onlyOpenOne = (_a = config === null || config === void 0 ? void 0 : config.behavior) === null || _a === void 0 ? void 0 : _a.onlyOpenOne;
    const displayType = (_b = config === null || config === void 0 ? void 0 : config.behavior) === null || _b === void 0 ? void 0 : _b.displayType;
    const vertical = (_c = config === null || config === void 0 ? void 0 : config.behavior) === null || _c === void 0 ? void 0 : _c.vertical;
    const openStarts = (_d = config === null || config === void 0 ? void 0 : config.behavior) === null || _d === void 0 ? void 0 : _d.openStarts;
    const space = (_e = config === null || config === void 0 ? void 0 : config.appearance) === null || _e === void 0 ? void 0 : _e.space;
    const advanced = (_f = config === null || config === void 0 ? void 0 : config.appearance) === null || _f === void 0 ? void 0 : _f.advanced;
    const showLabel = (_g = config === null || config === void 0 ? void 0 : config.appearance.card) === null || _g === void 0 ? void 0 : _g.showLabel;
    const showTooltip = (_j = (_h = config === null || config === void 0 ? void 0 : config.appearance.card) === null || _h === void 0 ? void 0 : _h.showTooltip) !== null && _j !== void 0 ? _j : true;
    const labelGrowth = (_l = (_k = config === null || config === void 0 ? void 0 : config.appearance.card) === null || _k === void 0 ? void 0 : _k.labelGrowth) !== null && _l !== void 0 ? _l : 0;
    const size = (_o = (_m = config === null || config === void 0 ? void 0 : config.appearance.card) === null || _m === void 0 ? void 0 : _m.avatar) === null || _o === void 0 ? void 0 : _o.size;
    const shape = (_q = (_p = config === null || config === void 0 ? void 0 : config.appearance.card) === null || _p === void 0 ? void 0 : _p.avatar) === null || _q === void 0 ? void 0 : _q.shape;
    const openStart = (_r = openStarts === null || openStarts === void 0 ? void 0 : openStarts[0]) !== null && _r !== void 0 ? _r : DEFAULT_OPEN_START;
    const iconInterval = vertical ? space : labelGrowth;
    const appTheme = useTheme2();
    const controlledWidgets = useControlledWidgets(id, BASE_LAYOUT_NAME);
    const translate = hooks.useTranslate(jimuUiDefaultMessages, jimuLayoutMessages, defaultMessages);
    const variant = advanced ? (_s = config === null || config === void 0 ? void 0 : config.appearance) === null || _s === void 0 ? void 0 : _s.card.variant : getButtonVariant(appTheme, config);
    const onSettingConfigChange = (key, value) => {
        let newConfig = null;
        if (Array.isArray(key)) {
            newConfig = config.setIn(key, value);
        }
        else {
            newConfig = config.set(key, value);
        }
        onSettingChange({
            id: id,
            config: newConfig
        });
    };
    const handleOpenTypeChange = (e, key, value) => {
        const checked = e.currentTarget.checked;
        if (!checked) {
            return;
        }
        let newConfig = null;
        if (key === 'onlyOpenOne') {
            newConfig = config.setIn(['behavior', 'openStarts'], Immutable([])).setIn(['behavior', key], value);
        }
        else if (key === 'displayType') {
            value = value ? DisplayType.Stack : DisplayType.SideBySide;
            newConfig = config.setIn(['behavior', key], value);
        }
        onSettingChange({
            id,
            config: newConfig
        });
    };
    const handleOpenStartMultipleClick = (_, value, selectedValues) => {
        const values = onlyOpenOne ? (selectedValues.length ? [value] : []) : selectedValues;
        onSettingConfigChange(['behavior', 'openStarts'], values);
    };
    const handleOpenStartSingleChange = (evt) => {
        const value = evt.target.value;
        let openStarts = [];
        if (value !== DEFAULT_OPEN_START) {
            openStarts = [value];
        }
        onSettingConfigChange(['behavior', 'openStarts'], openStarts);
    };
    const renderMultiSelectText = (values) => {
        if (onlyOpenOne && values.length) {
            const widget = controlledWidgets.find(w => w.value === values[0]);
            return widget === null || widget === void 0 ? void 0 : widget.label;
        }
        else {
            const widgetNumber = (values === null || values === void 0 ? void 0 : values.length) || 0;
            return translate('widgetsSelected', { widgetNumber });
        }
    };
    const handleIconIntervalChanged = (value) => {
        value = +value;
        if (isNaN(value)) {
            value = 0;
        }
        let newConfig = config;
        if (newConfig.behavior.vertical) {
            newConfig = newConfig.setIn(['appearance', 'space'], value).setIn(['appearance', 'card', 'labelGrowth'], 0);
        }
        else {
            newConfig = newConfig.setIn(['appearance', 'card', 'labelGrowth'], value).setIn(['appearance', 'space'], 0);
        }
        onSettingChange({
            id,
            config: newConfig
        });
    };
    const handleAdvancedToggle = () => {
        var _a;
        const advanced = !((_a = config === null || config === void 0 ? void 0 : config.appearance) === null || _a === void 0 ? void 0 : _a.advanced);
        let newConfig = config.setIn(['appearance', 'advanced'], advanced);
        if (advanced) {
            const variant = getButtonVariant(appTheme, config);
            newConfig = newConfig.setIn(['appearance', 'card', 'variant'], variant);
        }
        else {
            newConfig = newConfig.setIn(['appearance', 'card', 'variant'], undefined);
        }
        onSettingChange({
            id,
            config: newConfig
        });
    };
    const handleDirectionChange = (vertical) => {
        const newConfig = config.setIn(['behavior', 'vertical'], vertical).setIn(['appearance', 'card', 'labelGrowth'], 0).setIn(['appearance', 'space'], 0);
        onSettingChange({
            id,
            config: newConfig
        });
        getAppConfigAction().exchangeWidthAndHeight().exec();
    };
    const handleAdvancedChange = (state, key, value) => {
        onSettingConfigChange(['appearance', 'card', 'variant', state, key], value);
    };
    return (jsx("div", { className: 'widget-setting-controller jimu-widget-setting', css: style },
        jsx(SettingSection, null,
            jsx(SettingRow, { flow: 'no-wrap', label: translate('direction') },
                jsx(DirectionSelector, { "aria-label": translate('direction'), size: 'sm', vertical: vertical, onChange: handleDirectionChange }))),
        jsx(SettingSection, { title: translate('behavior'), role: 'group', "aria-label": translate('behavior') },
            jsx(SettingRow, { flow: 'wrap', label: translate('openWidget') },
                jsx("div", { role: 'radiogroup', className: 'setting-row-item', "aria-label": translate('openWidget') },
                    jsx(Radio, { id: 'only-open-one', style: { cursor: 'pointer' }, name: 'only-open-one', onChange: (e) => handleOpenTypeChange(e, 'onlyOpenOne', true), checked: onlyOpenOne }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'only-open-one', className: 'ml-2' }, translate('single'))),
                jsx("div", { className: 'setting-row-item' },
                    jsx(Radio, { id: 'open-multiple', style: { cursor: 'pointer' }, name: 'only-open-one', onChange: (e) => handleOpenTypeChange(e, 'onlyOpenOne', false), checked: !onlyOpenOne }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'open-multiple', className: 'ml-2' }, translate('multiple')))),
            jsx(SettingRow, { flow: 'wrap', label: translate('openStart') },
                !onlyOpenOne && (jsx(MultiSelect, { size: 'sm', "a11y-description": translate('openStart'), values: openStarts, items: controlledWidgets, onClickItem: handleOpenStartMultipleClick, displayByValues: renderMultiSelectText })),
                onlyOpenOne && (jsx(Select, { "a11y-description": translate('openStart'), value: openStart, size: 'sm', onChange: handleOpenStartSingleChange, className: 'w-100' },
                    jsx("option", { value: DEFAULT_OPEN_START }, translate('none')), controlledWidgets === null || controlledWidgets === void 0 ? void 0 :
                    controlledWidgets.map((item) => {
                        return (jsx("option", { key: item.value, value: item.value }, item.label));
                    })))),
            !onlyOpenOne && (jsx(SettingRow, { flow: 'wrap', label: translate('displayType') },
                jsx("div", { role: 'radiogroup', className: 'setting-row-item', "aria-label": translate('displayType') },
                    jsx(Radio, { id: 'display-stack', style: { cursor: 'pointer' }, name: 'display-type', onChange: (e) => handleOpenTypeChange(e, 'displayType', true), checked: displayType === DisplayType.Stack }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'display-stack', className: 'ml-2' }, translate('stack'))),
                jsx("div", { className: 'setting-row-item' },
                    jsx(Radio, { id: 'display-side-by-side', style: { cursor: 'pointer' }, name: 'display-type', onChange: (e) => handleOpenTypeChange(e, 'displayType', false), checked: displayType === DisplayType.SideBySide }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'display-side-by-side', className: 'ml-2' }, translate('sideBySide')))))),
        jsx(SettingSection, { role: 'group', "aria-label": translate('appearance'), title: jsx(LabelTooltip, { label: translate('appearance'), tooltip: translate('appearanceTip') }) },
            jsx(SettingRow, { flow: 'wrap', label: translate('iconStyle') },
                jsx("div", { role: 'group', className: 'd-flex', "aria-label": translate('iconStyle') },
                    jsx(Shapes, { type: ShapeType.Circle, title: translate('circle', true), className: 'mr-2', active: shape === 'circle', onClick: () => onSettingConfigChange(['appearance', 'card', 'avatar', 'shape'], 'circle') }),
                    jsx(Shapes, { type: ShapeType.Rectangle, title: translate('rectangle'), active: shape === 'rectangle', onClick: () => onSettingConfigChange(['appearance', 'card', 'avatar', 'shape'], 'rectangle') }))),
            jsx(SettingRow, { label: translate('showIconLabel') },
                jsx(Switch, { checked: showLabel, "aria-label": translate('showIconLabel'), onChange: (evt) => onSettingConfigChange(['appearance', 'card', 'showLabel'], evt.target.checked) })),
            jsx(SettingRow, { label: translate('tooltip') },
                jsx(Switch, { checked: showTooltip, "aria-label": translate('tooltip'), onChange: (evt) => onSettingConfigChange(['appearance', 'card', 'showTooltip'], evt.target.checked) })),
            jsx(SettingRow, { flow: 'no-wrap', label: translate('iconSizeOverride') },
                jsx(Select, { size: 'sm', "aria-label": translate('iconSizeOverride'), value: size, onChange: (e) => onSettingConfigChange(['appearance', 'card', 'avatar', 'size'], e.target.value), className: 'w-50' },
                    jsx("option", { value: 'sm' }, translate('small')),
                    jsx("option", { value: 'default' }, translate('medium')),
                    jsx("option", { value: 'lg' }, translate('large')))),
            jsx(SettingRow, { flow: 'no-wrap', label: translate('iconInterval') },
                jsx(InputUnit, { className: 'w-50', min: 0, max: 999, description: translate('iconInterval'), value: { distance: iconInterval, unit: DistanceUnits.PIXEL }, onChange: ({ distance }) => handleIconIntervalChanged(distance) }))),
        jsx(SettingSection, null,
            jsx(SettingRow, { flow: 'no-wrap', label: translate('advance') },
                jsx(Switch, { "aria-label": translate('advance'), checked: advanced, onChange: handleAdvancedToggle })),
            advanced && (jsx(SettingAdvanced, { variant: variant, onChange: handleAdvancedChange })))));
};
export default Setting;
//# sourceMappingURL=setting.js.map