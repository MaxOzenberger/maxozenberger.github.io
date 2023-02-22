/** @jsx jsx */
import { React, jsx, Immutable, ExpressionPartType, expressionUtils, defaultMessages as jimuCoreMessages, LinkType, AllDataSourceTypes } from 'jimu-core';
import { builderAppSync } from 'jimu-for-builder';
import { SettingSection, SettingRow, LinkSelector } from 'jimu-ui/advanced/setting-components';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
import { TextInput, Select, Tabs, Tab, defaultMessages as jimuUIMessages, styleUtils, NormalLineType, DistanceUnits, FillType, utils as uiUtils, defaultMessages as jimuUiDefaultMessages } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { ExpressionInput, ExpressionInputType } from 'jimu-ui/advanced/expression-builder';
import { IconPosition } from '../config';
import { getStyle } from './style';
import AdvanceStyleSetting from './components/advance-style-setting';
import AdvanceCollapse from './components/advance-collapse';
import { getIconPropsFromTheme } from '../utils';
const expressionInputTypes = Immutable([ExpressionInputType.Static, ExpressionInputType.Attribute, ExpressionInputType.Statistics, ExpressionInputType.Expression]);
const supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
export default class Setting extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c, _d;
        super(props);
        this.onSettingLinkConfirm = (linkResult) => {
            let config;
            if (!linkResult) {
                return;
            }
            if (!linkResult.expression) {
                let mergedUseDataSources;
                if (this.getIsDataSourceUsed()) {
                    const textExpression = this.getTextExpression();
                    const tooltipExpression = this.getTipExpression();
                    mergedUseDataSources = this.mergeUseDataSources(textExpression, tooltipExpression, null, this.props.useDataSources);
                }
                else {
                    mergedUseDataSources = expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources);
                }
                config = {
                    id: this.props.id,
                    config: this.props.config.setIn(['functionConfig', 'linkParam'], linkResult),
                    useDataSources: mergedUseDataSources
                };
            }
            else {
                const textExpression = this.getTextExpression();
                const tooltipExpression = this.getTipExpression();
                const expression = linkResult.expression;
                const mergedUseDataSources = this.mergeUseDataSources(textExpression, tooltipExpression, expression, this.props.useDataSources);
                config = {
                    id: this.props.id,
                    config: this.props.config.setIn(['functionConfig', 'linkParam'], linkResult),
                    useDataSources: mergedUseDataSources
                };
            }
            this.props.onSettingChange(config);
        };
        this.onTextChange = () => {
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'text'], this.state.currentTextInput)
                    .setIn(['functionConfig', 'textExpression'], null),
                useDataSources: expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources)
            };
            this.props.onSettingChange(config);
        };
        this.onToolTipChange = () => {
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'toolTip'], this.state.currentTipInput)
                    .setIn(['functionConfig', 'toolTipExpression'], null),
                useDataSources: expressionUtils.getUseDataSourcesWithoutFields(this.props.useDataSources)
            };
            this.props.onSettingChange(config);
        };
        this.onTextExpChange = (expression) => {
            if (!expression) {
                return;
            }
            const tooltipExpression = this.getTipExpression();
            const linkSettingExpression = this.getLinkSettingExpression();
            const mergedUseDataSources = this.mergeUseDataSources(Immutable(expression), tooltipExpression, linkSettingExpression, this.props.useDataSources);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'textExpression'], expression).setIn(['functionConfig', 'text'], ''),
                useDataSources: mergedUseDataSources
            });
            this.setState({ isTextExpOpen: false });
        };
        this.onTipExpChange = (expression) => {
            if (!expression) {
                return;
            }
            const textExpression = this.getTextExpression();
            const linkSettingExpression = this.getLinkSettingExpression();
            const mergedUseDataSources = this.mergeUseDataSources(textExpression, Immutable(expression), linkSettingExpression, this.props.useDataSources);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'toolTipExpression'], expression).setIn(['functionConfig', 'toolTip'], ''),
                useDataSources: mergedUseDataSources
            });
            this.setState({ isTipExpOpen: false });
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            var _a, _b, _c, _d, _e, _f;
            let config = this.props.config;
            if (useDataSourcesEnabled) {
                config = config.setIn(['functionConfig', 'textExpression'], this.getTextExpression())
                    .setIn(['functionConfig', 'toolTipExpression'], this.getTipExpression());
                config = config.set('functionConfig', config.functionConfig.without('text').without('toolTip'));
                if (((_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.linkParam) === null || _c === void 0 ? void 0 : _c.linkType) === LinkType.WebAddress) {
                    config = config.setIn(['functionConfig', 'linkParam', 'expression'], this.getLinkSettingExpression());
                    config = config.setIn(['functionConfig', 'linkParam'], config.functionConfig.linkParam.without('value'));
                }
            }
            else {
                config = config.setIn(['functionConfig', 'text'], this.state.currentTextInput)
                    .setIn(['functionConfig', 'toolTip'], this.state.currentTipInput);
                config = config.set('functionConfig', config.functionConfig.without('textExpression').without('toolTipExpression'));
                if (((_f = (_e = (_d = this.props.config) === null || _d === void 0 ? void 0 : _d.functionConfig) === null || _e === void 0 ? void 0 : _e.linkParam) === null || _f === void 0 ? void 0 : _f.linkType) === LinkType.WebAddress) {
                    config = config.setIn(['functionConfig', 'linkParam', 'value'], '');
                    config = config.setIn(['functionConfig', 'linkParam'], config.functionConfig.linkParam.without('expression'));
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled,
                config
            });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: this.mergeUseDataSources(this.getTextExpression(), this.getTipExpression(), this.getLinkSettingExpression(), Immutable(useDataSources))
            });
        };
        this.getDefaultIconColor = (isRegular) => {
            const status = isRegular ? 'regular' : 'hover';
            return this.props.config.getIn(['styleConfig', 'customStyle', status, 'iconProps', 'color']) || this.props.theme2.colors.dark;
        };
        this.onIconResultChange = (result) => {
            let config;
            if (result) {
                config = this.props.config;
                const position = this.props.config.getIn(['functionConfig', 'icon', 'position']) || IconPosition.Left;
                const regularColor = this.getDefaultIconColor(true);
                const hoverColor = this.getDefaultIconColor(false);
                const regularSize = this.props.config.getIn(['styleConfig', 'customStyle', 'regular', 'iconProps', 'size']) || result.properties.size;
                const hoverSize = this.props.config.getIn(['styleConfig', 'customStyle', 'hover', 'iconProps', 'size']) || result.properties.size;
                config = config.setIn(['functionConfig', 'icon', 'data'], result.svg)
                    .setIn(['functionConfig', 'icon', 'position'], position)
                    .setIn(['styleConfig', 'customStyle', 'regular', 'iconProps', 'color'], regularColor)
                    .setIn(['styleConfig', 'customStyle', 'regular', 'iconProps', 'size'], regularSize)
                    .setIn(['styleConfig', 'customStyle', 'hover', 'iconProps', 'color'], hoverColor)
                    .setIn(['styleConfig', 'customStyle', 'hover', 'iconProps', 'size'], hoverSize);
            }
            else {
                config = this.props.config.set('functionConfig', this.props.config.functionConfig.without('icon'))
                    .setIn(['styleConfig', 'customStyle', 'regular'], this.props.config.getIn(['styleConfig', 'customStyle', 'regular'], Immutable({})).without('iconProps'))
                    .setIn(['styleConfig', 'customStyle', 'hover'], this.props.config.getIn(['styleConfig', 'customStyle', 'hover'], Immutable({})).without('iconProps'));
            }
            this.props.onSettingChange({
                id: this.props.id,
                config
            });
        };
        this.getWhetherHaveCustomStyle = (isRegular) => {
            const status = isRegular ? 'regular' : 'hover';
            let style = this.props.config.getIn(['styleConfig', 'customStyle', status]);
            if (style && style.iconProps) { // iconProps is not custom style, user can select icon before opening advanced style
                style = style.without('iconProps');
            }
            return !!(style && Object.keys(style).length > 0);
        };
        this.onRegularStyleChange = (style) => {
            let config = this.props.config.setIn(['styleConfig', 'customStyle', 'regular'], style);
            if (!this.getWhetherHaveCustomStyle(false)) {
                config = config.setIn(['styleConfig', 'customStyle', 'hover'], this.getThemeStyle(false));
            }
            if (config.getIn(['styleConfig', 'themeStyle'])) {
                config = config.set('styleConfig', config.styleConfig.without('themeStyle'));
            }
            this.props.onSettingChange({
                id: this.props.id,
                config
            });
        };
        this.onHoverStyleChange = (style) => {
            let config = this.props.config.setIn(['styleConfig', 'customStyle', 'hover'], style);
            if (!this.getWhetherHaveCustomStyle(true)) {
                config = config.setIn(['styleConfig', 'customStyle', 'regular'], this.getThemeStyle(true));
            }
            if (config.getIn(['styleConfig', 'themeStyle'])) {
                config = config.set('styleConfig', config.styleConfig.without('themeStyle'));
            }
            this.props.onSettingChange({
                id: this.props.id,
                config
            });
        };
        this.onIconPositionChange = e => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'icon', 'position'], e.target.value)
            });
        };
        this.onAdvanceTabSelect = id => {
            const isConfiguringHover = id === "HOVER" /* SettingTabs.hover */;
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'isConfiguringHover', value: isConfiguringHover });
        };
        this.mergeUseDataSources = (textExpression, tipExpression, linkSettingExpression, useDataSources) => {
            const textDss = expressionUtils.getUseDataSourceFromExpParts(textExpression && textExpression.parts, useDataSources);
            const tipDss = expressionUtils.getUseDataSourceFromExpParts(tipExpression && tipExpression.parts, useDataSources);
            const linkSettingDss = expressionUtils.getUseDataSourceFromExpParts(linkSettingExpression && linkSettingExpression.parts, useDataSources);
            return this.mergeUseDataSourcesByDss(textDss, tipDss, linkSettingDss, useDataSources);
        };
        this.mergeUseDataSourcesByDss = (textUseDss, tipUseDss, linkSettingUseDss, useDataSources) => {
            const useDataSourcesWithoutFields = expressionUtils.getUseDataSourcesWithoutFields(useDataSources);
            let mergedUseDss = expressionUtils.mergeUseDataSources(useDataSourcesWithoutFields, textUseDss);
            mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, tipUseDss);
            mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, linkSettingUseDss);
            return mergedUseDss;
        };
        this.getIsDataSourceUsed = () => {
            return !!this.props.useDataSourcesEnabled;
        };
        this.getTipExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression &&
                this.props.config.functionConfig.toolTipExpression;
            return expression || Immutable({ name: '', parts: [{ type: ExpressionPartType.String, exp: `"${this.state.currentTipInput}"` }] });
        };
        this.getTextExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.textExpression &&
                this.props.config.functionConfig.textExpression;
            return expression || Immutable({ name: '', parts: [{ type: ExpressionPartType.String, exp: `"${this.state.currentTextInput}"` }] });
        };
        this.getLinkSettingExpression = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam &&
                this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.expression;
            return expression ||
                (((_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.linkParam) === null || _c === void 0 ? void 0 : _c.linkType) === LinkType.WebAddress && ((_f = (_e = (_d = this.props.config) === null || _d === void 0 ? void 0 : _d.functionConfig) === null || _e === void 0 ? void 0 : _e.linkParam) === null || _f === void 0 ? void 0 : _f.value)
                    ? Immutable({ name: '', parts: [{ type: ExpressionPartType.String, exp: `"${(_j = (_h = (_g = this.props.config) === null || _g === void 0 ? void 0 : _g.functionConfig) === null || _h === void 0 ? void 0 : _h.linkParam) === null || _j === void 0 ? void 0 : _j.value}"` }] })
                    : null);
        };
        this.getThemeStyle = (isRegular) => {
            if (!this.props.config.getIn(['styleConfig', 'themeStyle'])) {
                return Immutable({});
            }
            const quickStyleType = this.props.config.getIn(['styleConfig', 'themeStyle', 'quickStyleType']);
            const status = isRegular ? 'default' : 'hover';
            const themeVars = this.props.theme2.getIn(['components', 'button', 'variants', quickStyleType, status]) || {};
            const themeSize = this.props.theme2.getIn(['components', 'button', 'sizes', 'default']) || {};
            const borderRadiusInPx = parseFloat(styleUtils.remToPixel(themeSize.borderRadius));
            const iconProps = {
                color: themeVars.color,
                size: parseFloat(styleUtils.remToPixel(themeSize.fontSize))
            };
            const style = {
                background: {
                    color: themeVars.bg,
                    fillType: FillType.FILL
                },
                border: {
                    type: NormalLineType.SOLID,
                    color: themeVars.border && themeVars.border.color,
                    width: uiUtils.stringOfLinearUnit({
                        distance: themeVars.border && typeof themeVars.border.width === 'string' ? parseFloat(styleUtils.remToPixel(themeVars.border.width)) : undefined,
                        unit: DistanceUnits.PIXEL
                    })
                },
                text: {
                    color: themeVars.color,
                    size: styleUtils.remToPixel(themeSize.fontSize)
                },
                borderRadius: {
                    unit: DistanceUnits.PIXEL,
                    number: [borderRadiusInPx, borderRadiusInPx, borderRadiusInPx, borderRadiusInPx]
                },
                iconProps
            };
            return Immutable(style);
        };
        this.openTextExpPopup = () => {
            this.setState({
                isTextExpOpen: true,
                isTipExpOpen: false
            });
        };
        this.openTipExpPopup = () => {
            this.setState({
                isTextExpOpen: false,
                isTipExpOpen: true
            });
        };
        this.closeTextExpPopup = () => {
            this.setState({
                isTextExpOpen: false,
                isTipExpOpen: false
            });
        };
        this.closeTipExpPopup = () => {
            this.setState({
                isTextExpOpen: false,
                isTipExpOpen: false
            });
        };
        this.showTextSetting = () => {
            return !!(!this.getIsDataSourceUsed()
                ? !!this.state.currentTextInput
                : !!(!this.props.config.getIn(['functionConfig', 'textExpression']) ||
                    (this.props.config.getIn(['functionConfig', 'textExpression']) &&
                        this.props.config.getIn(['functionConfig', 'textExpression', 'parts']) &&
                        (this.props.config.getIn(['functionConfig', 'textExpression', 'parts']).length > 1 || this.props.config.getIn(['functionConfig', 'textExpression', 'parts', '0', 'exp']) !== '""'))));
        };
        this.showIconSetting = () => {
            return !!this.props.config.getIn(['functionConfig', 'icon']);
        };
        this.toggleUseCustom = () => {
            let config = this.props.config;
            config = config.setIn(['styleConfig', 'useCustom'], !config.getIn(['styleConfig', 'useCustom']));
            if (config.getIn(['styleConfig', 'useCustom'])) {
                config = config.setIn(['styleConfig', 'customStyle', 'hover'], this.getThemeStyle(false));
                config = config.setIn(['styleConfig', 'customStyle', 'regular'], this.getThemeStyle(true));
                config = config.set('styleConfig', config.styleConfig.without('themeStyle'));
            }
            else {
                config = config.setIn(['styleConfig', 'themeStyle', 'quickStyleType'], 'default');
                config = config.setIn(['styleConfig', 'customStyle', 'regular'], { iconProps: getIconPropsFromTheme(true, 'default', this.props.theme2) });
                config = config.setIn(['styleConfig', 'customStyle', 'hover'], { iconProps: getIconPropsFromTheme(false, 'default', this.props.theme2) });
            }
            this.props.onSettingChange({
                id: this.props.id,
                config
            });
        };
        this.state = {
            isTextExpOpen: false,
            isTipExpOpen: false,
            currentTextInput: typeof ((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.text) === 'string'
                ? (_d = (_c = this.props.config) === null || _c === void 0 ? void 0 : _c.functionConfig) === null || _d === void 0 ? void 0 : _d.text
                : this.props.intl.formatMessage({ id: 'variableButton', defaultMessage: jimuUiDefaultMessages.variableButton }),
            currentTipInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip) || ''
        };
    }
    componentDidUpdate(prevProps) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (!this.getIsDataSourceUsed()) {
            if (((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.text) !== ((_d = (_c = prevProps.config) === null || _c === void 0 ? void 0 : _c.functionConfig) === null || _d === void 0 ? void 0 : _d.text)) {
                this.setState({
                    currentTextInput: typeof ((_f = (_e = this.props.config) === null || _e === void 0 ? void 0 : _e.functionConfig) === null || _f === void 0 ? void 0 : _f.text) === 'string'
                        ? (_h = (_g = this.props.config) === null || _g === void 0 ? void 0 : _g.functionConfig) === null || _h === void 0 ? void 0 : _h.text
                        : this.props.intl.formatMessage({ id: 'variableButton', defaultMessage: jimuUiDefaultMessages.variableButton })
                });
            }
            if (((_k = (_j = this.props.config) === null || _j === void 0 ? void 0 : _j.functionConfig) === null || _k === void 0 ? void 0 : _k.toolTip) !== ((_m = (_l = prevProps.config) === null || _l === void 0 ? void 0 : _l.functionConfig) === null || _m === void 0 ? void 0 : _m.toolTip)) {
                this.setState({
                    currentTipInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip) || ''
                });
            }
        }
    }
    componentWillUnmount() {
        builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'isConfiguringHover', value: false });
    }
    render() {
        var _a, _b;
        const icon = this.props.config.functionConfig.icon ? { svg: this.props.config.functionConfig.icon.data } : null;
        const customStyle = this.props.config.styleConfig && this.props.config.styleConfig.customStyle;
        const isTextSettingOpen = this.showTextSetting();
        const isIconSettingOpen = this.showIconSetting();
        const isPositionOpen = isTextSettingOpen && isIconSettingOpen;
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: "widget-setting-link jimu-widget" },
                jsx("div", null,
                    jsx(SettingSection, null,
                        jsx(SettingRow, null,
                            jsx("div", { className: "choose-ds w-100" },
                                jsx(DataSourceSelector, { types: supportedDsTypes, useDataSources: this.props.useDataSources, useDataSourcesEnabled: this.getIsDataSourceUsed(), onToggleUseDataEnabled: this.onToggleUseDataEnabled, onChange: this.onDataSourceChange, widgetId: this.props.id })))),
                    jsx(SettingSection, null,
                        jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'setLink', defaultMessage: jimuUIMessages.setLink }) },
                            jsx(LinkSelector, { onSettingConfirm: this.onSettingLinkConfirm, linkParam: this.props.config.functionConfig.linkParam, useDataSources: this.getIsDataSourceUsed() && this.props.useDataSources, widgetId: this.props.id })),
                        jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip }) }),
                        jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip }) }, this.getIsDataSourceUsed()
                            ? jsx("div", { className: "w-100" },
                                jsx(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.onTipExpChange, openExpPopup: this.openTipExpPopup, expression: this.getTipExpression(), isExpPopupOpen: this.state.isTipExpOpen, closeExpPopup: this.closeTipExpPopup, types: expressionInputTypes, widgetId: this.props.id, "aria-label": this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip }) }))
                            : jsx(TextInput, { className: "w-100", value: this.state.currentTipInput, size: 'sm', onChange: (event) => { this.setState({ currentTipInput: event.target.value }); }, onBlur: () => { this.onToolTipChange(); }, onKeyUp: () => { this.onToolTipChange(); }, "aria-label": this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: jimuUiDefaultMessages.tooltip }) })),
                        jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiDefaultMessages.text }) }),
                        jsx(SettingRow, { role: 'group', "aria-label": this.props.intl.formatMessage({ id: 'text', defaultMessage: jimuUiDefaultMessages.text }) }, this.getIsDataSourceUsed()
                            ? jsx("div", { className: "w-100" },
                                jsx(ExpressionInput, { useDataSources: this.props.useDataSources, onChange: this.onTextExpChange, openExpPopup: this.openTextExpPopup, expression: this.getTextExpression(), isExpPopupOpen: this.state.isTextExpOpen, closeExpPopup: this.closeTextExpPopup, types: expressionInputTypes, widgetId: this.props.id }))
                            : jsx(TextInput, { className: "w-100", value: this.state.currentTextInput, size: 'sm', onChange: (event) => { this.setState({ currentTextInput: event.target.value }); }, onBlur: () => { this.onTextChange(); }, onKeyUp: () => { this.onTextChange(); } })),
                        jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon }) },
                            jsx(IconPicker, { icon: icon, configurableOption: 'none', onChange: this.onIconResultChange, "aria-label": this.props.intl.formatMessage({ id: 'icon', defaultMessage: jimuCoreMessages.icon }), setButtonUseColor: false })),
                        isPositionOpen &&
                            jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'position', defaultMessage: jimuUIMessages.position }) },
                                jsx("div", null,
                                    jsx(Select, { onChange: this.onIconPositionChange, size: 'sm', value: this.props.config.functionConfig && this.props.config.functionConfig.icon && this.props.config.functionConfig.icon.position, "aria-label": this.props.intl.formatMessage({ id: 'position', defaultMessage: jimuUIMessages.position }) }, Object.keys(IconPosition).map(p => jsx("option", { value: IconPosition[p], key: p }, this.props.intl.formatMessage({ id: p.toLowerCase(), defaultMessage: jimuUIMessages[p.toLowerCase()] }))))))),
                    jsx(SettingSection, { className: 'px-14' },
                        jsx(AdvanceCollapse, { title: this.props.intl.formatMessage({ id: 'advance', defaultMessage: jimuUIMessages.advance }), isOpen: !!((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.styleConfig) === null || _b === void 0 ? void 0 : _b.useCustom), toggle: this.toggleUseCustom },
                            jsx(Tabs, { fill: true, type: 'pills', onChange: this.onAdvanceTabSelect, defaultValue: "REGULAR" /* SettingTabs.regular */ },
                                jsx(Tab, { className: 'tab-label', id: "REGULAR" /* SettingTabs.regular */, title: this.props.intl.formatMessage({ id: 'default', defaultMessage: jimuUIMessages.default }) },
                                    jsx(AdvanceStyleSetting, { intl: this.props.intl, appTheme: this.props.theme2, style: customStyle && customStyle.regular, themeStyle: this.getThemeStyle(true), onChange: this.onRegularStyleChange, isTextSettingOpen: isTextSettingOpen, isIconSettingOpen: isIconSettingOpen })),
                                jsx(Tab, { className: 'tab-label', id: "HOVER" /* SettingTabs.hover */, title: this.props.intl.formatMessage({ id: 'hover', defaultMessage: jimuUIMessages.hover }) },
                                    jsx(AdvanceStyleSetting, { intl: this.props.intl, appTheme: this.props.theme2, style: customStyle && customStyle.hover, themeStyle: this.getThemeStyle(false), onChange: this.onHoverStyleChange, isTextSettingOpen: isTextSettingOpen, isIconSettingOpen: isIconSettingOpen })))))))));
    }
}
//# sourceMappingURL=setting.js.map