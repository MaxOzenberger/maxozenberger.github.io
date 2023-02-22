/** @jsx jsx */
import { classNames, Immutable, React, css, jsx, polished, BrowserSizeMode, DataSourceComponent, getAppStore, JimuFieldType, expressionUtils, appActions, LayoutType, lodash, utils as jimuUtils, AllDataSourceTypes } from 'jimu-core';
import { getAppConfigAction, builderAppSync, templateUtils } from 'jimu-for-builder';
import { searchUtils, LayoutItemSizeModes, defaultMessages as jimuLayoutsDefaultMessages } from 'jimu-layouts/layout-runtime';
import { SettingSection, SettingRow, SortSetting, LinkSelector, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { BackgroundSetting, BorderSetting, BorderRadiusSetting, SizeEditor, InputRatio, TextAlignment } from 'jimu-ui/advanced/style-setting-components';
import { Slider, Select, Switch, Checkbox, Icon, Button, MultiSelect, defaultMessages as jimuUIDefaultMessages, Tooltip, TextInput, DistanceUnits, TextAlignValue, utils as uiUtils } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { PageStyle, ItemStyle, DirectionType, SelectionModeType, Status, LIST_CARD_MIN_SIZE, ListLayout, SettingCollapseType, ListLayoutType, DEFAULT_CARD_SIZE, DEFAULT_SPACE, SCROLL_BAR_WIDTH } from '../config';
import { setLayoutAuto } from './utils/utils';
import defaultMessages from './translations/default';
import LayoutSetting from './components/switch-layout';
import { Fragment } from 'react';
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder';
import { handleResizeCard } from '../common-builder-support';
import { getJimuFieldNamesBySqlExpression } from 'jimu-ui/basic/sql-expression-runtime';
import { MyNumericInput } from './components/my-input';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { DesktopOutlined } from 'jimu-icons/outlined/application/desktop';
import { TabletOutlined } from 'jimu-icons/outlined/application/tablet';
import { MobileOutlined } from 'jimu-icons/outlined/application/mobile';
import { RightOutlined } from 'jimu-icons/outlined/directional/right';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import { LockOutlined } from 'jimu-icons/outlined/editor/lock';
import { UnlockOutlined } from 'jimu-icons/outlined/editor/unlock';
const prefix = 'jimu-widget-';
const originAllStyles = {
    STYLE0: require('./template/card-style0.json'),
    STYLE1: require('./template/card-style1.json'),
    STYLE2: require('./template/card-style2.json'),
    STYLE3: require('./template/card-style3.json'),
    STYLE4: require('./template/card-style4.json'),
    STYLE5: require('./template/card-style5.json'),
    STYLE6: require('./template/card-style6.json'),
    STYLE7: require('./template/card-style7.json'),
    STYLE8: require('./template/card-style8.json'),
    STYLE9: require('./template/card-style9.json')
};
let AllStyles;
const MESSAGES = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuLayoutsDefaultMessages);
function initStyles(widgetId) {
    if (AllStyles) {
        return AllStyles;
    }
    AllStyles = {};
    Object.keys(originAllStyles).forEach(style => {
        AllStyles[style] = templateUtils.processForTemplate(originAllStyles[style], widgetId, MESSAGES);
    });
}
const DSSelectorTypes = Immutable([
    AllDataSourceTypes.FeatureLayer,
    AllDataSourceTypes.SceneLayer
]);
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.lastHoverLayout = {
            layout: [],
            widgets: {}
        };
        this.lastSelectedLayout = {
            layout: [],
            widgets: {}
        };
        this.onPropertyChange = (name, value) => {
            const { config } = this.props;
            if (value === config[name]) {
                return;
            }
            if (name === 'sorts' || name === 'filter' || name === 'searchFields') {
                this.needUpdateFields = true;
            }
            const newConfig = config.set(name, value);
            this.onConfigChange(newConfig);
        };
        this.changeUsedFields = () => {
            const { useDataSources } = this.props;
            if (useDataSources && useDataSources[0]) {
                const useDS = useDataSources[0].asMutable({ deep: true });
                useDS.fields = this.getAllFields();
                const alterProps = {
                    id: this.props.id,
                    useDataSources: [useDS]
                };
                this.props.onSettingChange(alterProps);
            }
        };
        this.onConfigChange = newConfig => {
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
        };
        this.onBackgroundStyleChange = (status, key, value) => {
            let { config } = this.props;
            config = config.setIn(['cardConfigs', status, 'backgroundStyle', key], value);
            this.onConfigChange(config);
        };
        this.onSelectionModeChange = evt => {
            const value = evt.target.value;
            this.changeSelectionMode(value);
        };
        this.changeSelectionMode = (value) => {
            const { id, layouts, browserSizeMode, appConfig } = this.props;
            let { config } = this.props;
            const selectionMode = config.cardConfigs[Status.Selected].selectionMode;
            const listLayout = config.cardConfigs[Status.Selected].listLayout || ListLayout.CUSTOM;
            if (selectionMode === value) {
                return;
            }
            let action = getAppConfigAction();
            config = config.setIn(['cardConfigs', Status.Selected, 'selectionMode'], value);
            if (selectionMode !== SelectionModeType.None && value === SelectionModeType.None) {
                if (listLayout === ListLayout.CUSTOM) {
                    // remove selected layout
                    const desLayoutId = searchUtils.findLayoutId(layouts[Status.Selected], browserSizeMode, appConfig.mainSizeMode);
                    action = action.resetLayout(desLayoutId, true);
                }
                action.editWidgetConfig(id, config).exec();
                this.changeBuilderStatus(Status.Regular);
            }
            else if (selectionMode === SelectionModeType.None && value !== SelectionModeType.None) {
                this.setLayoutAuto(Status.Selected, config);
                this.changeBuilderStatus(Status.Selected);
            }
            else if (selectionMode !== SelectionModeType.None && value !== SelectionModeType.None) {
                action.editWidgetConfig(id, config).exec();
            }
        };
        this.onSelectionSwitch = evt => {
            const selected = evt.target.checked;
            if (selected) {
                this.changeSelectionMode(SelectionModeType.Single);
            }
            else {
                this.changeSelectionMode(SelectionModeType.None);
            }
        };
        this.onHoverLayoutOpenChange = evt => {
            var _a, _b;
            const { config, id, layouts, browserSizeMode, appConfig } = this.props;
            const listLayout = ((_b = (_a = config === null || config === void 0 ? void 0 : config.cardConfigs) === null || _a === void 0 ? void 0 : _a[Status.Hover]) === null || _b === void 0 ? void 0 : _b.listLayout) || ListLayout.CUSTOM;
            const value = evt.target.checked;
            if (config.cardConfigs[Status.Hover].enable === value)
                return;
            let action = getAppConfigAction();
            let newConfig = config.setIn(['cardConfigs', Status.Hover, 'enable'], value);
            newConfig = newConfig.setIn(['cardConfigs', Status.Hover, 'listLayout'], ListLayout.AUTO);
            if (config.cardConfigs[Status.Hover].enable && !value) {
                if (listLayout === ListLayout.CUSTOM) {
                    // remove hover layout
                    const desLayoutId = searchUtils.findLayoutId(layouts[Status.Hover], browserSizeMode, appConfig.mainSizeMode);
                    action = action.resetLayout(desLayoutId, true);
                }
                this.changeBuilderStatus(Status.Regular);
                action.editWidgetConfig(id, newConfig).exec();
            }
            else if (!config.cardConfigs[Status.Hover].enable && value) {
                this.setLayoutAuto(Status.Hover, newConfig);
                this.changeBuilderStatus(Status.Hover);
            }
        };
        this.setLayoutAuto = (status, newConfig) => {
            const { layouts, browserSizeMode, appConfig, id } = this.props;
            const regularLayoutId = searchUtils.findLayoutId(layouts[Status.Regular], browserSizeMode, appConfig.mainSizeMode);
            const desLayoutId = searchUtils.findLayoutId(layouts[status], browserSizeMode, appConfig.mainSizeMode);
            const option = {
                layout: ListLayout.AUTO,
                config: newConfig,
                widgetId: id,
                appConfig: appConfig,
                status: status,
                regularLayoutId: regularLayoutId,
                desLayoutId: desLayoutId
            };
            setLayoutAuto(option);
        };
        this.onOpenCardSetting = evt => {
            const status = evt.currentTarget.dataset.value;
            this.changeCardSettingAndBuilderStatus(status);
        };
        // Export list template, use it in a single fullscreen page
        this.onExportClick = evt => {
            const { appConfig, layouts, id, browserSizeMode } = this.props;
            const currentPageId = getAppStore().getState().appStateInBuilder
                .appRuntimeInfo.currentPageId;
            const pageJson = appConfig.pages[currentPageId === 'default' ? 'home' : currentPageId];
            const widgets = Immutable(appConfig.widgets.without(id)).set('widget_x', appConfig.widgets[id]);
            const pageTemplates = [
                {
                    widgetId: id,
                    config: {
                        layouts: appConfig.layouts.without(pageJson.layout[browserSizeMode], layouts[Status.Selected][browserSizeMode], layouts[Status.Hover][browserSizeMode]),
                        widgets: widgets,
                        views: appConfig.views,
                        sections: appConfig.sections
                    }
                }
            ];
            const template0 = pageTemplates[0];
            template0.config.layouts &&
                Object.keys(template0.config.layouts).forEach(layoutId => {
                    let layoutJson = template0.config.layouts[layoutId].without('id');
                    layoutJson.content &&
                        Object.keys(layoutJson.content).forEach(lEId => {
                            const lEJson = layoutJson.content[lEId]
                                .without('id', 'parentId', 'layoutId')
                                .setIn(['setting', 'lockParent'], true);
                            layoutJson = layoutJson.setIn(['content', lEId], lEJson);
                        });
                    template0.config.layouts = template0.config.layouts.set(layoutId, layoutJson);
                });
            template0.config.widgets &&
                Object.keys(template0.config.widgets).forEach((wId, index) => {
                    const wJson = template0.config.widgets[wId];
                    template0.config.widgets = template0.config.widgets.set(wId, wJson.without('context', 'icon', 'label', 'manifest', '_originManifest', 'version', 'id', 'useDataSourcesEnabled', 'useDataSources'));
                });
            template0.config.sections &&
                Object.keys(template0.config.sections).forEach((sId, index) => {
                    const sJson = template0.config.sections[sId];
                    template0.config.sections = template0.config.sections.set(sId, sJson.without('id', 'label'));
                });
            template0.config.views &&
                Object.keys(template0.config.views).forEach((vId, index) => {
                    const vJson = template0.config.views[vId];
                    template0.config.views = template0.config.views.set(vId, vJson.without('id', 'label'));
                });
            console.log(JSON.stringify(pageTemplates[0]));
            // const wJson = appConfig.widgets[this.props.id];
            // let embedLayoutJson = appConfig.layouts[wJson.layouts[Status.Regular].LARGE]
            // const template = {
            //   cardSize: config.cardSize,
            //   cardSpace: config.space,
            //   layout: [],
            //   widgets: {}
            // }
            // Object.keys(embedLayoutJson).forEach((key) => {
            //   if(key === 'id' || key === 'ROOT_ID')return;
            //   let layoutEle = embedLayoutJson[key];
            //   if (layoutEle.type === LayoutItemType.Widget && layoutEle.widgetId){
            //     template.widgets[layoutEle.widgetId] = appConfig.widgets[layoutEle.widgetId].without('context', 'icon', 'label', 'manifest', '_originManifest', 'version', 'useDataSources');
            //     template.layout.push(layoutEle);
            //   }
            // });
            // console.log(JSON.stringify(template));
        };
        this.onCardSettingReturnBackClick = evt => {
            const { showCardSetting } = this.props;
            this.changeCardSettingAndBuilderStatus(Status.Regular);
            setTimeout(() => {
                var _a;
                if (showCardSetting === Status.Hover) {
                    this.toHoverSettingButtonRef.focus();
                }
                if (showCardSetting === Status.Selected) {
                    (_a = this.toSelectedSettingButtonRef) === null || _a === void 0 ? void 0 : _a.focus();
                }
            }, 100);
        };
        this.showSqlExprPopup = () => {
            this.setState({ isSqlExprShow: true });
        };
        this.toggleSqlExprPopup = () => {
            const { isSqlExprShow } = this.state;
            this.setState({ isSqlExprShow: !isSqlExprShow });
        };
        this.onSqlExprBuilderChange = (sqlExprObj) => {
            this.onPropertyChange('filter', sqlExprObj);
        };
        this.changeCardSettingAndBuilderStatus = (status) => {
            const { id, config } = this.props;
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: id,
                propKey: 'showCardSetting',
                value: status
            });
            if (status === Status.Regular ||
                (status === Status.Hover && config.cardConfigs[Status.Hover].enable) ||
                (status === Status.Selected &&
                    config.cardConfigs[Status.Selected].selectionMode !==
                        SelectionModeType.None)) {
                this.changeBuilderStatus(status);
            }
        };
        this.switchLoading = (show) => {
            const { id } = this.props;
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: id,
                propKey: 'showLoading',
                value: show
            });
        };
        this.changeBuilderStatus = (status) => {
            const { id } = this.props;
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: id,
                propKey: 'builderStatus',
                value: status
            });
        };
        this.onItemStyleChanged = (style, isCheckEmptyTemplate = false, updatedAppConfig = undefined) => {
            // if(this.props.appMode === AppMode.Run) return;
            this.switchLoading(true);
            const { id } = this.props;
            let { appConfig } = this.props;
            if (updatedAppConfig) {
                appConfig = updatedAppConfig;
            }
            let styleTemp = AllStyles[style];
            if (isCheckEmptyTemplate) {
                styleTemp = this.getEmptyTemplate(style);
            }
            templateUtils
                .updateWidgetByTemplate(appConfig, styleTemp, id, styleTemp.widgetId, {}, defaultMessages)
                .then(newAppConfig => {
                this._onItemStyleChange(newAppConfig, style, isCheckEmptyTemplate);
                this.switchLoading(false);
            });
        };
        this.getEmptyTemplate = (style) => {
            var _a, _b;
            const styleTemp = AllStyles[style];
            const layouts = ((_a = styleTemp === null || styleTemp === void 0 ? void 0 : styleTemp.config) === null || _a === void 0 ? void 0 : _a.layouts) || {};
            const widgets = ((_b = styleTemp === null || styleTemp === void 0 ? void 0 : styleTemp.config) === null || _b === void 0 ? void 0 : _b.widgets) || {};
            let newStyle = Immutable(AllStyles[style]);
            let newLayouts = Immutable(layouts);
            for (const layoutId in layouts) {
                newLayouts = newLayouts.setIn([layoutId, 'content'], {});
                newLayouts = newLayouts.setIn([layoutId, 'order'], []);
            }
            newStyle = newStyle.setIn(['config', 'layouts'], newLayouts);
            newStyle = newStyle.setIn(['config', 'widgets'], {
                widget_x: widgets === null || widgets === void 0 ? void 0 : widgets.widget_x
            });
            return newStyle === null || newStyle === void 0 ? void 0 : newStyle.asMutable({ deep: true });
        };
        this.getCardSizeUnit = (props) => {
            props = props || this.props;
            const { config, builderStatus, browserSizeMode } = props;
            let cardConfigs = config.cardConfigs[builderStatus];
            if (!cardConfigs || !cardConfigs.cardSize) {
                cardConfigs = config.cardConfigs[Status.Regular];
            }
            let cardSize = cardConfigs.cardSize[browserSizeMode];
            if (!cardSize) {
                cardSize = cardConfigs.cardSize[Object.keys(cardConfigs.cardSize)[0]];
            }
            return {
                width: uiUtils.toLinearUnit(cardSize.width),
                height: uiUtils.toLinearUnit(cardSize.height)
            };
        };
        this.handleFormChange = evt => {
            const target = evt.currentTarget;
            if (!target)
                return;
            const field = target.dataset.field;
            const type = target.type;
            let value;
            switch (type) {
                case 'checkbox':
                    value = target.checked;
                    break;
                case 'select':
                    value = target.value;
                    break;
                case 'range':
                    value = parseFloat(target.value);
                    break;
                case 'number':
                    const numbertype = target.dataset.numbertype;
                    const parseNumber = numbertype === 'float' ? parseFloat : parseInt;
                    const minValue = !!target.min && parseNumber(target.min);
                    const maxValue = !!target.max && parseNumber(target.max);
                    value = evt.target.value;
                    if (!value || value === '')
                        return;
                    value = parseNumber(evt.target.value);
                    if (!!minValue && value < minValue) {
                        value = minValue;
                    }
                    if (!!maxValue && value > maxValue) {
                        value = maxValue;
                    }
                    break;
                default:
                    value = target.value;
                    break;
            }
            this.onPropertyChange(field, value);
        };
        this.handleCheckboxChange = (dataField) => {
            var _a;
            if (!dataField)
                return false;
            const currentCheckboxValue = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a[dataField];
            this.onPropertyChange(dataField, !currentCheckboxValue);
        };
        this.handleItemsPerPageChange = value => {
            if (!value || value === '') {
                value = '1';
            }
            let valueInt = parseInt(value);
            if (valueInt < 0)
                valueInt = 1;
            this.onPropertyChange('itemsPerPage', valueInt);
        };
        this.handleScrollStepChange = (valueInt) => {
            if (valueInt < 0)
                valueInt = 1;
            this.onPropertyChange('scrollStep', valueInt);
        };
        this.handleSpaceChange = (valueFloat) => {
            this.onPropertyChange('space', valueFloat);
        };
        this.handleHorizontalSpaceChange = (valueFloat) => {
            this.onPropertyChange('horizontalSpace', valueFloat);
        };
        this.handleVerticalSpaceChange = (valueFloat) => {
            this.onPropertyChange('verticalSpace', valueFloat);
        };
        this.handleItemSizeChange = (valueInt) => {
            const { config } = this.props;
            const isHorizon = config.direction === DirectionType.Horizon || (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Column;
            const oldCardSize = this.getCardSizeUnit(this.props);
            const ratio = oldCardSize.width.distance / oldCardSize.height.distance;
            const newCardSize = this.getCardSize();
            valueInt = valueInt < LIST_CARD_MIN_SIZE ? LIST_CARD_MIN_SIZE : valueInt;
            if (isHorizon) {
                newCardSize.width = `${valueInt}px`;
                if (config.lockItemRatio) {
                    newCardSize.height = `${valueInt / ratio}px`;
                }
            }
            else {
                newCardSize.height = `${valueInt}px`;
                if (config.lockItemRatio) {
                    newCardSize.width = `${valueInt * ratio}px`;
                }
            }
            handleResizeCard(this.props, newCardSize, config).exec();
        };
        this.getCardSize = () => {
            const oldCardSize = this.getCardSizeUnit(this.props);
            return {
                width: uiUtils.stringOfLinearUnit(oldCardSize.width),
                height: uiUtils.stringOfLinearUnit(oldCardSize.height)
            };
        };
        this.onSettingSortChange = (sortData, index) => {
            this.onPropertyChange('sorts', sortData);
        };
        this._onItemStyleChange = (appConfig, style, isCheckEmptyTemplate = false) => {
            const { id, config: oldConfig } = this.props;
            const appConfigAction = getAppConfigAction(appConfig);
            const wJson = appConfig.widgets[id];
            const template = AllStyles[style];
            const templateWidgetJson = template.config.widgets[template.widgetId];
            wJson.layouts &&
                Object.keys(wJson.layouts).forEach(name => {
                    wJson.layouts[name] &&
                        Object.keys(wJson.layouts[name]).forEach(device => {
                            var _a, _b, _c, _d;
                            if (((_b = (_a = templateWidgetJson === null || templateWidgetJson === void 0 ? void 0 : templateWidgetJson.layouts) === null || _a === void 0 ? void 0 : _a[name]) === null || _b === void 0 ? void 0 : _b[device]) ||
                                !(templateWidgetJson === null || templateWidgetJson === void 0 ? void 0 : templateWidgetJson.layouts)) {
                                return;
                            }
                            const config = wJson.config;
                            // Judge if layout is empty
                            let sizeLayouts = templateWidgetJson.layouts[name];
                            if (!sizeLayouts) {
                                const layoutKeys = Object.keys(templateWidgetJson.layouts);
                                sizeLayouts = wJson.layouts[layoutKeys[layoutKeys.length - 1]];
                            }
                            else {
                                sizeLayouts = wJson.layouts[name];
                            }
                            const length = Object.keys(sizeLayouts).length;
                            let embedLayoutJson;
                            for (const key in sizeLayouts) {
                                if (key === BrowserSizeMode.Large) {
                                    embedLayoutJson = appConfig.layouts[sizeLayouts[key]];
                                }
                            }
                            if (!embedLayoutJson) {
                                embedLayoutJson =
                                    appConfig.layouts[sizeLayouts[Object.keys(sizeLayouts)[length - 1]]];
                            }
                            if (!(embedLayoutJson === null || embedLayoutJson === void 0 ? void 0 : embedLayoutJson.content)) {
                                return;
                            }
                            const desLayoutId = wJson.layouts[name][device];
                            appConfigAction.editLayoutType({ layoutId: desLayoutId }, embedLayoutJson.type);
                            if (name === Status.Hover) {
                                if ((_c = config[Status.Hover]) === null || _c === void 0 ? void 0 : _c.enable) {
                                    appConfigAction.duplicateLayoutItems(embedLayoutJson.id, desLayoutId, false);
                                }
                            }
                            else if (name === Status.Selected) {
                                if ((_d = config[Status.Selected]) === null || _d === void 0 ? void 0 : _d.enable) {
                                    appConfigAction.duplicateLayoutItems(embedLayoutJson.id, desLayoutId, false);
                                }
                            }
                            else {
                                appConfigAction.duplicateLayoutItems(embedLayoutJson.id, desLayoutId, false);
                            }
                        });
                });
            // process inherit properties
            if (wJson.useDataSources && wJson.useDataSources.length > 0) {
                appConfigAction.copyUseDataSourceToAllChildWidgets(wJson.set('useDataSources', null), wJson);
            }
            this.editListLayoutSize(appConfigAction, style);
            const config = wJson.config
                .set('itemStyle', style)
                .set('isItemStyleConfirm', false)
                .set('isInitialed', true)
                .set('isCheckEmptyTemplate', isCheckEmptyTemplate);
            appConfigAction
                .editWidgetProperty(wJson.id, 'config', config)
                .exec(!oldConfig.isInitialed);
            // selectSelf(this.props);
        };
        this.editListLayoutSize = (appConfigAction, style) => {
            var _a;
            const { layoutInfo, appConfig } = this.props;
            const templateSize = this.getTemplateSize();
            const listSize = templateSize[style];
            const layoutType = this.getLayoutType();
            if (layoutType === LayoutType.FixedLayout) {
                const { layoutId, layoutItemId } = layoutInfo;
                const layout = appConfig.layouts[layoutId];
                const layoutItem = (_a = layout === null || layout === void 0 ? void 0 : layout.content) === null || _a === void 0 ? void 0 : _a[layoutItemId];
                const bbox = layoutItem.bbox.set('width', `${listSize.width}%`).set('height', `${listSize.height}%`);
                appConfigAction
                    .editLayoutItemBBox(layoutInfo, bbox)
                    .exec();
            }
        };
        this.getTemplateSize = () => {
            const { parentSize } = this.props;
            const columnRowTemplateWidth = 620;
            const columnRowTemplateHeight = 275;
            const parentWidth = (parentSize === null || parentSize === void 0 ? void 0 : parentSize.width) || 1280;
            const parentHeight = (parentSize === null || parentSize === void 0 ? void 0 : parentSize.height) || 800;
            const templateWidth = this.checkTemplateDefaultSize((columnRowTemplateWidth * 100) / parentWidth);
            const templateHeight = this.checkTemplateDefaultSize((columnRowTemplateHeight * 100) / parentHeight);
            const templateSize = {
                STYLE0: { width: templateWidth, height: templateHeight },
                STYLE1: { width: templateWidth, height: templateHeight },
                STYLE2: { width: templateWidth, height: templateHeight },
                STYLE3: { width: templateWidth, height: templateHeight },
                STYLE4: { width: templateWidth, height: templateHeight },
                STYLE5: { width: templateWidth, height: templateHeight },
                STYLE6: { width: templateWidth, height: templateHeight },
                STYLE7: { width: templateWidth, height: templateHeight },
                STYLE8: { width: this.checkTemplateDefaultSize(65400 / parentWidth), height: this.checkTemplateDefaultSize(33500 / parentHeight) },
                STYLE9: { width: this.checkTemplateDefaultSize(50000 / parentWidth), height: this.checkTemplateDefaultSize(50000 / parentHeight) }
            };
            return templateSize;
        };
        this.checkTemplateDefaultSize = (size) => {
            if (size > 100) {
                return 100;
            }
            else {
                return size;
            }
        };
        this.getLayoutType = () => {
            var _a, _b;
            const { layoutInfo, appConfig } = this.props;
            const layoutId = layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.layoutId;
            const layoutType = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.type;
            return layoutType;
        };
        this.setDatasource = (ds) => {
            this.setState({
                datasource: ds
            }, () => {
                const isShowAutoRefresh = this.checkIsDsAutoRefreshSettingOpen(ds);
                this.isPreDataSourceRefreshOpen = isShowAutoRefresh;
                this.initIsShowAutoRefresh(ds);
            });
        };
        this.initIsShowAutoRefresh = (ds) => {
            const { config } = this.props;
            if (typeof (config === null || config === void 0 ? void 0 : config.isShowAutoRefresh) !== 'boolean') {
                const isShowAutoRefresh = this.checkIsDsAutoRefreshSettingOpen(ds);
                const newConfig = config.set('isShowAutoRefresh', isShowAutoRefresh);
                this.onConfigChange(newConfig);
            }
        };
        this.getSelectModeOptions = () => {
            return [
                jsx("option", { key: SelectionModeType.Single, value: SelectionModeType.Single }, this.formatMessage('single')),
                jsx("option", { key: SelectionModeType.Multiple, value: SelectionModeType.Multiple }, this.formatMessage('multiple'))
            ];
        };
        this.getSearchingFields = (isSearch) => {
            const { datasource } = this.state;
            if (datasource) {
                const scheme = datasource.getSchema();
                if (scheme && scheme.fields) {
                    const res = [];
                    Object.keys(scheme.fields).forEach(fieldKey => {
                        const field = scheme.fields[fieldKey];
                        if (isSearch) {
                            if (field.type === JimuFieldType.String) {
                                res.push({
                                    value: fieldKey,
                                    label: scheme.fields[fieldKey].alias || scheme.fields[fieldKey].name
                                });
                            }
                        }
                        else {
                            res.push({
                                value: fieldKey,
                                label: scheme.fields[fieldKey].alias || scheme.fields[fieldKey].name
                            });
                        }
                    });
                    return res;
                }
            }
            return [];
        };
        this.getPageStyleOptions = () => {
            return [
                jsx("option", { key: PageStyle.Scroll, value: PageStyle.Scroll }, this.formatMessage('scroll')),
                jsx("option", { key: PageStyle.MultiPage, value: PageStyle.MultiPage }, this.formatMessage('multiPage'))
            ];
        };
        this.onDsCreate = ds => {
            this.setDatasource(ds);
        };
        this.onDataSourceInfoChange = (info) => {
            if (!info || !this.state.datasource) {
                return;
            }
            const { config } = this.props;
            const isDsAutoRefreshSettingOpen = this.checkIsDsAutoRefreshSettingOpen(this.state.datasource);
            if (isDsAutoRefreshSettingOpen && !this.isPreDataSourceRefreshOpen) {
                const newConfig = config.set('isShowAutoRefresh', isDsAutoRefreshSettingOpen);
                this.onConfigChange(newConfig);
            }
            this.isPreDataSourceRefreshOpen = isDsAutoRefreshSettingOpen;
        };
        this.getStyle = (theme) => {
            var _a;
            return css `
      &.jimu-widget-list-setting {
        .no-bottom-border {
          border-bottom: 0;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .list-layout-select-con {
          box-sizing: border-box;
          button, button:hover, button.active {
            background: ${(_a = theme.colors) === null || _a === void 0 ? void 0 : _a.palette.light[200]};
          }
          button {
            padding: ${polished.rem(4)};
            border-width: ${polished.rem(2)};
            border-color: transparent;
          }
        }
        .list-guide-tip-button svg{
          margin-top: ${polished.rem(-4)};
        }
        .style-setting--base-unit-input {
          .dropdown-button {
            border: none;
          }
        }
        .clear-padding {
          padding-left: 0;
          padding-right: 0;
        }
        .card-setting-con {
          padding-top: 0;
        }
        .clear-border {
          border: none;
        }
        .clear-padding-bottom {
          padding-bottom: 0;
        }
        .sort-container {
          margin-top: 12px;
          .sort-multi-select {
            width: 100%;
          }
        }
        .lock-item-ratio-label {
          margin-left: ${polished.rem(8)};
        }
        .search-container {
          margin-top: 12px;
          .search-multi-select {
            width: 100%;
          }
        }
        .lock-item-ratio {
          margin-top: ${polished.rem(3)};
        }

        .resetting-template {
          cursor: pointer;
          color: ${theme.colors.palette.primary[700]};
          vertical-align: middle;
          padding: 0;
          margin: 0;
          font-size: ${polished.rem(12)};
        }
        .resetting-template:hover {
          cursor: pointer;
          color: ${theme.colors.palette.primary[800]};
        }
        .setting-next {
          width: auto;
          max-width: 50%;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: end;
          font-size: ${polished.rem(13)};
          padding: 0;
          &:focus {
            outline: ${polished.rem(2)} solid ${theme.colors.palette.primary[700]};
            outline-offset: ${polished.rem(2)};
          }
          svg {
            margin: 0;
          }
        }
        .card-setting-return {
          cursor: pointer;
          font-size: ${polished.rem(14)};
          padding: 0;
        }

        .search-placeholder {
          & {
            background: ${theme.colors.palette.light[200]};
            color: ${theme.colors.black};
            border: none;
            outline: none;
            box-sizing: border-box;
            border-radius: 2px;
            font-size: ${polished.rem(14)};
          }
          &:focus {
            border: 1px solid ${theme.colors.palette.primary[700]};
          }
        }
        .style-group {
          button {
            padding: 0;
          }
          .template-icon-margin-r {
            margin-right: ${polished.rem(10)};
          }
          .style-img {
            cursor: pointer;
            width: 100%;
            height: 70px;
            border: 1px solid ${theme.colors.palette.light[500]};
            background-color: ${theme.colors.white};
            margin-right: 0;
            &.active {
              border: 2px solid ${theme.colors.primary};
            }
            &.style-img-h {
              width: 109px;
              height: 109px;
            }
            &.low {
              height: 48px;
            }
            &.empty {
              height: 40px;
              line-height: 40px;
              color: ${theme.colors.palette.dark[200]};
            }
          }
        }
        .vertical-space {
          height: 10px;
        }
        .list-size-edit {
          width: ${polished.rem(120)};
        }
        .datasource-placeholder {
          & {
            color: ${theme.colors.palette.dark[200]};
          }
          p {
            color: ${theme.colors.palette.dark[500]};
            font-size: ${polished.rem(14)};
            margin: ${polished.rem(16)} auto 0;
            line-height: ${polished.rem(19)};
            width: ${polished.rem(228)};
          }
        }
      }
    `;
        };
        this.getAllFields = () => {
            var _a, _b, _c, _d;
            const { config, useDataSources } = this.props;
            const useDS = useDataSources && useDataSources[0];
            if (!useDS)
                return [];
            const usedFields = {};
            if (config.sortOpen && config.sorts) {
                config.sorts.forEach(sort => {
                    sort.rule.forEach(sortData => {
                        sortData.jimuFieldName && (usedFields[sortData.jimuFieldName] = 0);
                    });
                });
            }
            // if (useDS.query && useDS.query.orderBy && useDS.query.orderBy.length > 0) {
            //   useDS.query.orderBy.forEach(sortData => {
            //     sortData.jimuFieldName && (usedFields[sortData.jimuFieldName] = 0);
            //   })
            // }
            // if (useDS.query && useDS.query.where) {
            //   (getJimuFieldNamesBySqlExpression(useDS.query.where) || []).forEach(field => usedFields[field] = 0)
            // }
            if (config.filter) {
                ;
                (getJimuFieldNamesBySqlExpression(config.filter) || []).forEach(field => (usedFields[field] = 0));
            }
            if (config.searchOpen && config.searchFields) {
                ;
                (config.searchFields.split(',') || []).forEach(field => (usedFields[field] = 0));
            }
            if ((_a = config === null || config === void 0 ? void 0 : config.linkParam) === null || _a === void 0 ? void 0 : _a.expression) {
                const linkSettingDss = expressionUtils.getUseDataSourceFromExpParts((_b = config.linkParam.expression) === null || _b === void 0 ? void 0 : _b.parts, this.props.useDataSources);
                (_d = (_c = linkSettingDss === null || linkSettingDss === void 0 ? void 0 : linkSettingDss[0]) === null || _c === void 0 ? void 0 : _c.fields) === null || _d === void 0 ? void 0 : _d.forEach(field => (usedFields[field] = 0));
            }
            return (usedFields && Object.keys(usedFields)) || [];
        };
        this.formatMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: MESSAGES[id] }, values);
        };
        this.getWhetherDsInUseDataSources = (ds, useDataSources) => {
            if (!ds || !useDataSources) {
                return false;
            }
            return useDataSources.some(u => u.dataSourceId === ds.dataSourceId);
        };
        this.getOutputDataSourceJson = (useDataSources) => {
            // outputDataSourceJson should bind widget instance, such as MapviewDataSource
            const dsJson = {
                id: `${this.props.id}-output`,
                label: this.formatMessage('outputDsLabel', { label: this.props.label }),
                type: AllDataSourceTypes.FeatureLayer,
                originDataSources: useDataSources
            };
            return dsJson;
        };
        this.onFilterChange = (sqlExprObj, dsId) => {
            const { useDataSources } = this.props;
            if (!useDataSources ||
                !useDataSources[0] ||
                useDataSources[0].dataSourceId !== dsId) {
                return;
            }
            this.needUpdateFields = true;
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [
                    useDataSources[0]
                        .setIn(['query', 'where'], sqlExprObj)
                        .asMutable({ deep: true })
                ]
            });
        };
        this.onSettingLinkConfirm = (linkResult) => {
            let { config } = this.props;
            if (!linkResult) {
                return;
            }
            config = config.set('linkParam', linkResult);
            if (linkResult.expression) {
                this.needUpdateFields = true;
            }
            this.onConfigChange(config);
        };
        this.onDSSelectorSortChange = (sortData, dsId) => {
            const { useDataSources } = this.props;
            if (!useDataSources ||
                !useDataSources[0] ||
                useDataSources[0].dataSourceId !== dsId) {
                return;
            }
            this.needUpdateFields = true;
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [
                    useDataSources[0]
                        .setIn(['query', 'orderBy'], sortData)
                        .asMutable({ deep: true })
                ]
            });
        };
        this.onDataChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.onDataSelect(useDataSources[0]);
            }
            else {
                this.onDataRemove(this.props.useDataSources[0].asMutable({ deep: true }));
            }
        };
        this.onDataSelect = (currentSelectedDs) => {
            const widgets = this.props.appConfig && this.props.appConfig.widgets;
            const widgetJson = widgets[this.props.id];
            const udpateWidgetJson = { id: this.props.id };
            const appConfigAction = getAppConfigAction();
            let useDataSources;
            let singleUsedDs;
            if (this.getWhetherDsInUseDataSources(currentSelectedDs, widgetJson.useDataSources)) {
                useDataSources = widgetJson.useDataSources.asMutable({ deep: true });
            }
            else {
                singleUsedDs = currentSelectedDs;
                useDataSources = [singleUsedDs];
                udpateWidgetJson.config = widgetJson.config
                    .set('searchFields', null)
                    .set('filters', null)
                    .set('sorts', null);
            }
            // Instead of function onSettingChange, use action to change widget json, which can avoid conflict.
            // Because editing widget json in builder needs pub-sub and pub-sub is async.
            udpateWidgetJson.useDataSources = useDataSources;
            appConfigAction.editWidget(udpateWidgetJson).exec();
            // outputdatasource
            // const outputDataSourceJson = this.getOutputDataSourceJson(useDataSources)
            // if (outputDataSourceJson) {
            //   const outputDataSources = [outputDataSourceJson]
            //   appConfigAction.editWidget(udpateWidgetJson, outputDataSources).exec();
            // } else {
            //   appConfigAction.editWidget(udpateWidgetJson).exec();
            // }
            this.needUpdateFields = true;
        };
        this.onDataRemove = (currentRemovedDs) => {
            const widgets = this.props.appConfig && this.props.appConfig.widgets;
            const widgetJson = widgets[this.props.id];
            const updateWidgetJson = { id: this.props.id };
            const appConfigAction = getAppConfigAction();
            const useDataSources = widgetJson.useDataSources.filter(usedDs => usedDs.dataSourceId !== currentRemovedDs.dataSourceId);
            // Instead of function onSettingChange, use action to change widget json, which can avoid conflict.
            // Because editing widget json in builder needs pub-sub and pub-sub is async.
            updateWidgetJson.config = widgetJson.config
                .set('sqlExprObj', null)
                .set('searchFields', null)
                .set('filters', null)
                .set('sortFields', null);
            updateWidgetJson.useDataSources = useDataSources;
            appConfigAction.editWidget(updateWidgetJson, []).exec();
            this.needUpdateFields = true;
        };
        this.handleItemStyleConfirmClick = evt => {
            this.onPropertyChange('isItemStyleConfirm', true);
        };
        this.handleResetItemstyleClick = evt => {
            this.onPropertyChange('isItemStyleConfirm', false);
            this.updateStartButtonPosition();
        };
        this.handleItemStyleImageClick = evt => {
            const style = evt.currentTarget.dataset.value;
            const { config } = this.props;
            if (config.itemStyle === style)
                return;
            this.onItemStyleChanged(style, config === null || config === void 0 ? void 0 : config.isCheckEmptyTemplate);
        };
        this.handleCheckEmptyTemplateChange = () => {
            const { config, appConfig, id } = this.props;
            const newIsCheckEmptyTemplate = !(config === null || config === void 0 ? void 0 : config.isCheckEmptyTemplate);
            const newConfig = config.set('isCheckEmptyTemplate', newIsCheckEmptyTemplate);
            const newAppConfig = appConfig.setIn(['widgets', id, 'config'], newConfig);
            this.onItemStyleChanged(config.itemStyle, newIsCheckEmptyTemplate, newAppConfig);
        };
        this.openSettingCollapse = (settingCollapse) => {
            this.setState({
                settingCollapse: settingCollapse
            });
        };
        this.closeSettingCollapse = () => {
            this.setState({
                settingCollapse: SettingCollapseType.None
            });
        };
        this.handlePageStyleChange = evt => {
            var _a;
            const value = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            this.onPropertyChange('pageStyle', value);
        };
        this.handleChooseSearchingFieldsChange = (evt, value, values) => {
            this.onPropertyChange('searchFields', values.join(','));
        };
        this.displaySelectedFields = values => {
            return this.formatMessage('numSelected', {
                number: values.length
            });
        };
        this.onSearchPlaceholderChange = (e) => {
            var _a, _b;
            const searctHint = e.target.value;
            const preSearctHint = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.searchHint;
            if (preSearctHint === searctHint)
                return;
            this.onPropertyChange('searchHint', searctHint);
        };
        this.getIsScrollAndWidthOfTemplateCon = () => {
            var _a, _b, _c, _d, _e;
            const templateConHeight = ((_a = this.templatesContain) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0;
            const templateConWidth = ((_b = this.templatesContain) === null || _b === void 0 ? void 0 : _b.clientWidth) || 0;
            const templateConParentHeight = ((_e = (_d = (_c = this.templatesContain) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.clientHeight) || 0;
            const isStartButtonAbsolute = templateConParentHeight < templateConHeight;
            this.setState({
                isTemplateContainScroll: isStartButtonAbsolute,
                templateConWidth: templateConWidth
            });
        };
        this.updateStartButtonPosition = () => {
            clearTimeout(this.updatePositionTimeout);
            this.updatePositionTimeout = setTimeout(() => {
                this.getIsScrollAndWidthOfTemplateCon();
            }, 500);
        };
        this.setTemplatesContain = (ref) => {
            const preTemplatesContain = this.templatesContain;
            if (ref) {
                this.templatesContain = ref;
            }
            if (!preTemplatesContain) {
                this.getIsScrollAndWidthOfTemplateCon();
            }
        };
        this.checkIsDsAutoRefreshSettingOpen = (datasource) => {
            if (!datasource)
                return false;
            const interval = (datasource === null || datasource === void 0 ? void 0 : datasource.getAutoRefreshInterval()) || 0;
            return interval > 0;
        };
        this.onNoDataMessageChange = (value) => {
            this.onPropertyChange('noDataMessage', value);
        };
        this.renderTemplate = () => {
            const { config } = this.props;
            const { isTemplateContainScroll } = this.state;
            const startButtonClass = isTemplateContainScroll
                ? 'position-absolute position-absolute-con'
                : 'position-relative-con';
            return (jsx("div", { ref: ref => { this.setTemplatesContain(ref); } },
                jsx(SettingSection, { title: this.formatMessage('chooseTemplateTip') },
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('layoutRow') },
                        jsx("div", { className: 'style-group w-100' },
                            jsx(Button, { "data-value": ItemStyle.Style5, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { autoFlip: true, className: `style-img ${config.itemStyle === ItemStyle.Style5 &&
                                        'active'}`, icon: require('./assets/style6.png') })),
                            jsx("div", { className: 'vertical-space' }),
                            jsx(Button, { "data-value": ItemStyle.Style4, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { autoFlip: true, className: `style-img ${config.itemStyle === ItemStyle.Style4 &&
                                        'active'}`, icon: require('./assets/style5.png') })),
                            jsx("div", { className: 'vertical-space' }),
                            jsx(Button, { "data-value": ItemStyle.Style6, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'w-100' },
                                jsx(Icon, { autoFlip: true, className: `style-img low ${config.itemStyle ===
                                        ItemStyle.Style6 && 'active'}`, icon: require('./assets/style7.png') })))),
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('layoutColumn') },
                        jsx("div", { className: 'style-group w-100 style-img d-flex justify-content-between w-100' },
                            jsx(Button, { "data-value": ItemStyle.Style0, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'template-icon-margin-r' },
                                jsx(Icon, { className: `style-img style-img-h ${config.itemStyle ===
                                        ItemStyle.Style0 && 'active'}`, icon: require('./assets/style1.png') })),
                            jsx(Button, { "data-value": ItemStyle.Style1, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { className: `style-img style-img-h ${config.itemStyle ===
                                        ItemStyle.Style1 && 'active'}`, icon: require('./assets/style2.png') }))),
                        jsx("div", { className: 'vertical-space w-100' }),
                        jsx("div", { className: 'style-group w-100 d-flex justify-content-between w-100' },
                            jsx(Button, { "data-value": ItemStyle.Style2, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'template-icon-margin-r' },
                                jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                        ItemStyle.Style2 && 'active'}`, icon: require('./assets/style3.png') })),
                            jsx(Button, { "data-value": ItemStyle.Style3, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                        ItemStyle.Style3 && 'active'}`, icon: require('./assets/style4.png') })))),
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('layoutGrid') },
                        jsx("div", { className: 'style-group w-100' },
                            jsx(Button, { "data-value": ItemStyle.Style8, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'w-100' },
                                jsx(Icon, { autoFlip: true, className: `style-img ${config.itemStyle === ItemStyle.Style8 &&
                                        'active'}`, icon: require('./assets/style8.png') })),
                            jsx("div", { className: 'vertical-space' })),
                        jsx("div", { className: 'vertical-space' }),
                        jsx("div", { className: 'style-group w-100 d-flex justify-content-between w-100' },
                            jsx(Button, { "data-value": ItemStyle.Style9, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'template-icon-margin-r' },
                                jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                        ItemStyle.Style9 && 'active'}`, icon: require('./assets/style9.png') })))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'style-group w-100' },
                            jsx("div", { title: this.formatMessage('emptyTemplateCheckboxString'), "aria-label": this.formatMessage('emptyTemplateCheckboxString'), className: 'd-flex w-100 cursor-pointer', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { this.handleCheckEmptyTemplateChange(); } },
                                jsx(Checkbox, { title: this.formatMessage('emptyTemplateCheckboxString'), className: 'lock-item-ratio', "data-field": 'isCheckEmptyTemplate', checked: (config === null || config === void 0 ? void 0 : config.isCheckEmptyTemplate) || false, "aria-label": this.formatMessage('emptyTemplateCheckboxString') }),
                                jsx("div", { className: 'lock-item-ratio-label text-left' }, this.formatMessage('emptyTemplateCheckboxString'))))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'start-con w-100', css: this.getStartButtonStyle() },
                            jsx("div", { className: startButtonClass },
                                jsx(Button, { className: "w-100", type: 'primary', onClick: this.handleItemStyleConfirmClick }, this.formatMessage('start'))))))));
        };
        this.getStartButtonStyle = () => {
            const { theme } = this.props;
            const { templateConWidth } = this.state;
            return css `
      &.start-con {
        & {
          height: ${polished.rem(64)};
          margin-top: ${polished.rem(-16)};
        }
        .position-absolute-con, .position-relative-con {
          margin-left: ${polished.rem(-16)};
        }
        div{
          padding: ${polished.rem(16)};
          background: ${theme.colors.palette.light[300]};
          left: 1rem;
          bottom: 0;
          width: ${templateConWidth ? `${templateConWidth}px` : '100%'}
        }
      }
    `;
        };
        this.renderDataSetting = () => {
            var _a;
            const { datasource } = this.state;
            const { useDataSources, selectionIsInSelf, config } = this.props;
            return (jsx(SettingSection, { className: classNames(!this.state.datasource ? 'no-bottom-border' : '') },
                jsx(SettingRow, { flow: 'wrap' },
                    jsx("div", { className: 'w-100 overflow-hidden align-middle' },
                        jsx(Button, { type: 'tertiary', className: 'resetting-template align-middle', onClick: this.handleResetItemstyleClick, title: this.formatMessage('resettingTheTemplate') }, this.formatMessage('resettingTheTemplate')),
                        jsx("span", { className: 'align-middle' }, this.formatMessage('customListDesign')),
                        jsx(Tooltip, { title: this.formatMessage('listUseGuide'), showArrow: true, placement: 'left' },
                            jsx(Button, { className: 'list-guide-tip-button', type: 'tertiary', "aria-label": this.formatMessage('listUseGuide') },
                                jsx(InfoOutlined, { size: 12 }))))),
                jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('data'), "aria-label": this.formatMessage('data') }, !selectionIsInSelf && (jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: useDataSources, mustUseDataSource: true, onChange: this.onDataChange, widgetId: this.props.id, "aria-describedby": 'list-empty-tip' }))),
                ((_a = this.state) === null || _a === void 0 ? void 0 : _a.datasource) && jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('noDataMessage'), "aria-label": this.formatMessage('noDataMessage') },
                    jsx(TextInput, { size: 'sm', className: 'w-100', placeholder: this.formatMessage('noData'), defaultValue: (config === null || config === void 0 ? void 0 : config.noDataMessage) || '', onAcceptValue: this.onNoDataMessageChange })),
                this.checkIsDsAutoRefreshSettingOpen(datasource) && jsx(SettingRow, { label: this.formatMessage('lastUpdateText'), role: 'group', "aria-label": this.formatMessage('lastUpdateText') },
                    jsx(Switch, { checked: config.isShowAutoRefresh, "data-field": 'isShowAutoRefresh', onChange: this.handleFormChange, title: this.formatMessage('lastUpdateText') }))));
        };
        this.handleLayoutChange = (layoutType) => {
            var _a, _b, _c, _d, _e, _f;
            const { config, browserSizeMode, widgetRect } = this.props;
            let newConfig = config.set('layoutType', layoutType).set('horizontalSpace', DEFAULT_SPACE).set('verticalSpace', DEFAULT_SPACE);
            const cardSize = this.getCardSizeUnit(this.props);
            let newCardSize;
            if (layoutType === ListLayoutType.GRID) {
                newCardSize = {
                    width: '25%',
                    height: `${DEFAULT_CARD_SIZE}px`
                };
            }
            else {
                newCardSize = {
                    width: ((_a = cardSize === null || cardSize === void 0 ? void 0 : cardSize.width) === null || _a === void 0 ? void 0 : _a.unit) === DistanceUnits.PERCENTAGE ? `${widgetRect.width * ((_b = cardSize === null || cardSize === void 0 ? void 0 : cardSize.width) === null || _b === void 0 ? void 0 : _b.distance) / 100}px` : `${(_c = cardSize === null || cardSize === void 0 ? void 0 : cardSize.width) === null || _c === void 0 ? void 0 : _c.distance}px`,
                    height: ((_d = cardSize === null || cardSize === void 0 ? void 0 : cardSize.height) === null || _d === void 0 ? void 0 : _d.unit) === DistanceUnits.PERCENTAGE ? `${widgetRect.height * ((_e = cardSize === null || cardSize === void 0 ? void 0 : cardSize.height) === null || _e === void 0 ? void 0 : _e.distance) / 100}px` : `${(_f = cardSize === null || cardSize === void 0 ? void 0 : cardSize.height) === null || _f === void 0 ? void 0 : _f.distance}px`
                };
            }
            newConfig = newConfig.setIn(['cardConfigs', Status.Regular, 'cardSize', browserSizeMode], newCardSize).setIn(['cardConfigs', Status.Hover, 'cardSize', browserSizeMode], newCardSize).setIn(['cardConfigs', Status.Selected, 'cardSize', browserSizeMode], newCardSize);
            this.onConfigChange(newConfig);
        };
        this.handleKeepAspectRatioChange = () => {
            var _a, _b, _c, _d;
            const { config } = this.props;
            const cardSize = this.getCardSizeUnit(this.props);
            const widthPx = this.getCardPxWidthFormCardSize();
            const gridItemSizeRatio = cardSize.height.distance / widthPx;
            let newConfig = config.set('keepAspectRatio', !((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.keepAspectRatio));
            if (!((_d = (_c = this.props) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.keepAspectRatio)) {
                newConfig = newConfig.set('gridItemSizeRatio', gridItemSizeRatio);
            }
            this.onConfigChange(newConfig);
        };
        this.handleGridItemSizeRatioChange = (value) => {
            const ratio = Number(value === null || value === void 0 ? void 0 : value.split(':')[1]) / Number(value === null || value === void 0 ? void 0 : value.split(':')[0]);
            const { config } = this.props;
            const oldCardSize = this.getCardSizeInGridByRatio(ratio);
            const newCardSize = {
                width: uiUtils.stringOfLinearUnit(oldCardSize.width),
                height: uiUtils.stringOfLinearUnit(oldCardSize.height)
            };
            handleResizeCard(this.props, newCardSize, config.set('gridItemSizeRatio', ratio)).exec();
        };
        this.getCardSizeInGridByRatio = (ratio) => {
            const oldCardSize = this.getCardSizeUnit(this.props);
            const pxWidth = this.getCardPxWidthFormCardSize();
            oldCardSize.height.distance = ratio * pxWidth;
            return oldCardSize;
        };
        this.getCardPxWidthFormCardSize = () => {
            const { config } = this.props;
            const cardSize = this.getCardSizeUnit(this.props);
            if (cardSize.width.unit === DistanceUnits.PERCENTAGE) {
                const listContentWidth = this.getListActualContentPxWidth();
                //The space in the last column should be removed
                return cardSize.width.distance * listContentWidth / 100 - (config === null || config === void 0 ? void 0 : config.horizontalSpace);
            }
            else {
                return cardSize.width.distance;
            }
        };
        this.handleGridItemSizeChange = (valueInt, isHeight = false) => {
            const { config, widgetRect } = this.props;
            const oldCardSizeUnit = this.getCardSizeUnit(this.props);
            const oldSize = isHeight ? oldCardSizeUnit === null || oldCardSizeUnit === void 0 ? void 0 : oldCardSizeUnit.height : oldCardSizeUnit === null || oldCardSizeUnit === void 0 ? void 0 : oldCardSizeUnit.width;
            const listConSize = isHeight ? widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.height : this.getListActualContentPxWidth();
            const newCardSize = this.getCardSize();
            let minSize = LIST_CARD_MIN_SIZE;
            if ((valueInt === null || valueInt === void 0 ? void 0 : valueInt.unit) === DistanceUnits.PERCENTAGE) {
                minSize = isHeight ? (LIST_CARD_MIN_SIZE * 100) / listConSize : ((LIST_CARD_MIN_SIZE + (config === null || config === void 0 ? void 0 : config.horizontalSpace)) * 100) / listConSize;
            }
            const isDistanceUnitsChange = this.checkIsDistanceUnitsChange(valueInt, isHeight);
            if (isDistanceUnitsChange && !isHeight) {
                if (valueInt.unit === DistanceUnits.PIXEL) {
                    valueInt.distance = oldSize.distance * listConSize / 100 - (config === null || config === void 0 ? void 0 : config.horizontalSpace);
                }
                if (valueInt.unit === DistanceUnits.PERCENTAGE) {
                    valueInt.distance = ((oldSize.distance + (config === null || config === void 0 ? void 0 : config.horizontalSpace)) * 100) / listConSize;
                }
            }
            const value = valueInt.distance < minSize ? minSize : valueInt.distance;
            valueInt.distance = value;
            if (isHeight) {
                newCardSize.height = uiUtils.stringOfLinearUnit(valueInt);
            }
            else {
                newCardSize.width = uiUtils.stringOfLinearUnit(valueInt);
                const widthPx = (valueInt === null || valueInt === void 0 ? void 0 : valueInt.unit) === DistanceUnits.PERCENTAGE ? (value * listConSize / 100) : value;
                if (config === null || config === void 0 ? void 0 : config.keepAspectRatio) {
                    const height = widthPx * (config === null || config === void 0 ? void 0 : config.gridItemSizeRatio);
                    newCardSize.height = `${height}px`;
                }
            }
            handleResizeCard(this.props, newCardSize, config).exec();
        };
        this.getListActualContentPxWidth = () => {
            const { config, widgetRect } = this.props;
            return ((widgetRect === null || widgetRect === void 0 ? void 0 : widgetRect.width) + (config === null || config === void 0 ? void 0 : config.horizontalSpace) - SCROLL_BAR_WIDTH) || 0;
        };
        this.checkIsDistanceUnitsChange = (valueInt, isHeight) => {
            const oldCardSizeUnit = this.getCardSizeUnit(this.props);
            const size = isHeight ? oldCardSizeUnit === null || oldCardSizeUnit === void 0 ? void 0 : oldCardSizeUnit.height : oldCardSizeUnit === null || oldCardSizeUnit === void 0 ? void 0 : oldCardSizeUnit.width;
            if (valueInt.unit === size.unit) {
                return false;
            }
            else if (!size.unit && valueInt.unit === DistanceUnits.PIXEL) {
                return false;
            }
            else {
                return true;
            }
        };
        this.renderArrangementSetting = () => {
            const { config } = this.props;
            const { settingCollapse } = this.state;
            return (jsx(SettingSection, null,
                jsx(SettingCollapse, { label: this.formatMessage('arrangement'), isOpen: settingCollapse === SettingCollapseType.Arrangement, onRequestOpen: () => { this.openSettingCollapse(SettingCollapseType.Arrangement); }, onRequestClose: this.closeSettingCollapse, "aria-label": this.formatMessage('arrangement') },
                    jsx(SettingRow, { className: "mt-2", flow: 'wrap', label: this.formatMessage('layout'), role: 'group', "aria-label": this.formatMessage('layout') },
                        jsx("div", { className: 'd-flex align-items-center w-100 list-layout-select-con' },
                            jsx(Button, { icon: true, title: this.formatMessage('layoutRow'), "aria-label": this.formatMessage('layoutRow'), active: (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Row, onClick: () => { this.handleLayoutChange(ListLayoutType.Row); }, className: 'flex-sm-grow-1', size: 'lg' },
                                jsx(Icon, { className: 'style-img w-100 h-100', icon: require('./assets/row.png') })),
                            jsx(Button, { icon: true, title: this.formatMessage('layoutColumn'), "aria-label": this.formatMessage('layoutColumn'), active: (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Column, onClick: () => { this.handleLayoutChange(ListLayoutType.Column); }, className: 'ml-2 flex-sm-grow-1', size: 'lg' },
                                jsx(Icon, { className: 'style-img w-100 h-100', icon: require('./assets/column.png') })),
                            jsx(Button, { icon: true, title: this.formatMessage('layoutGrid'), "aria-label": this.formatMessage('layoutGrid'), active: (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID, onClick: () => { this.handleLayoutChange(ListLayoutType.GRID); }, className: 'ml-2 flex-sm-grow-1', size: 'lg' },
                                jsx(Icon, { className: 'style-img w-100 h-100', icon: require('./assets/grid.png') })))),
                    (config === null || config === void 0 ? void 0 : config.layoutType) !== ListLayoutType.GRID ? this.renderRowColumnLayoutSetting() : this.renderGridLayoutSetting(),
                    jsx(SettingRow, { label: this.formatMessage('pagingStyle'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('pagingStyle') },
                        jsx(Select, { style: { width: '100%' }, value: config.pageStyle, onChange: this.handlePageStyleChange, size: 'sm' }, this.getPageStyleOptions())),
                    config.pageStyle === PageStyle.Scroll && (jsx(SettingRow, { label: this.formatMessage('scrollBar'), "aria-label": this.formatMessage('scrollBar') },
                        jsx("div", { className: 'd-flex' },
                            jsx(Switch, { checked: config.scrollBarOpen, "data-field": 'scrollBarOpen', onChange: this.handleFormChange, title: this.formatMessage('scrollBar') })))),
                    config.pageStyle === PageStyle.Scroll && (jsx(SettingRow, { label: this.formatMessage('navigator'), "aria-label": this.formatMessage('navigator') },
                        jsx("div", { className: 'd-flex' },
                            jsx(Switch, { checked: config.navigatorOpen, "data-field": 'navigatorOpen', onChange: this.handleFormChange, title: this.formatMessage('navigator') })))),
                    config.pageStyle === PageStyle.Scroll && config.navigatorOpen && (jsx(SettingRow, { label: this.formatMessage('listStep'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('listStep') },
                        jsx(MyNumericInput, { value: config.scrollStep, style: { width: '100%' }, min: 1, onAcceptValue: this.handleScrollStepChange }))),
                    config.pageStyle === PageStyle.MultiPage && (jsx(SettingRow, { label: this.formatMessage('itemPerPage'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('itemPerPage') },
                        jsx(MyNumericInput, { value: config.itemsPerPage, style: { width: '100%' }, min: 1, onAcceptValue: this.handleItemsPerPageChange }))))));
        };
        this.handleAlignmentChange = (alignment) => {
            this.onPropertyChange('gridAlignment', alignment);
        };
        this.renderGridLayoutSetting = () => {
            const { config } = this.props;
            const cardSize = this.getCardSizeUnit(this.props);
            const availableUnits = [DistanceUnits.PIXEL, DistanceUnits.PERCENTAGE];
            const heightAvailableUnits = [DistanceUnits.PIXEL];
            const inputStyle = { width: '7.5rem' };
            return (jsx("div", { className: 'mt-3' },
                jsx(SettingRow, { label: this.getItemSizeLabel(), flow: 'wrap' }),
                jsx(SettingRow, { label: this.formatMessage('width') },
                    jsx("div", { className: 'list-size-edit' },
                        jsx(SizeEditor, { disableModeSelect: true, label: 'W', mode: LayoutItemSizeModes.Custom, value: cardSize === null || cardSize === void 0 ? void 0 : cardSize.width, availableUnits: availableUnits, onChange: value => { this.handleGridItemSizeChange(value); } }))),
                jsx("div", { className: 'ml-3 d-flex', css: css `
            .icon {
              cursor: pointer;
              width: 12px;
            }
          ` },
                    jsx(Tooltip, { title: this.formatMessage('listKeepAspectRatio'), placement: 'bottom' },
                        jsx("div", { className: 'icon', onClick: this.handleKeepAspectRatioChange }, (config === null || config === void 0 ? void 0 : config.keepAspectRatio) ? jsx(LockOutlined, { size: 's' }) : jsx(UnlockOutlined, { size: 's' })))),
                jsx(SettingRow, { label: this.formatMessage('height') },
                    jsx("div", { className: 'list-size-edit' },
                        jsx(SizeEditor, { label: 'H', disableModeSelect: true, mode: LayoutItemSizeModes.Custom, value: cardSize === null || cardSize === void 0 ? void 0 : cardSize.height, availableUnits: heightAvailableUnits, onChange: value => { this.handleGridItemSizeChange(value, true); }, disabled: config === null || config === void 0 ? void 0 : config.keepAspectRatio }))),
                (config === null || config === void 0 ? void 0 : config.keepAspectRatio) &&
                    jsx(SettingRow, { label: this.formatMessage('sizeAspectRatio') },
                        jsx(InputRatio, { style: inputStyle, value: config.gridItemSizeRatio, onChange: this.debounceGridItemSizeRatioChange })),
                jsx(SettingRow, { label: this.formatMessage('alignment') },
                    jsx(TextAlignment, { textAlign: (config === null || config === void 0 ? void 0 : config.gridAlignment) || TextAlignValue.CENTER, onChange: this.handleAlignmentChange })),
                jsx(SettingRow, { flow: 'wrap', label: `${this.formatMessage('horizontalSpacing')} (px)`, role: 'group', "aria-label": `${this.formatMessage('horizontalSpacing')} (px)` },
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx(Slider, { style: { width: '60%' }, "data-field": 'horizontalSpace', onChange: this.handleFormChange, value: config === null || config === void 0 ? void 0 : config.horizontalSpace, title: '0-50', size: 'sm', min: 0, max: 50 }),
                        jsx(MyNumericInput, { style: { width: '25%' }, value: config === null || config === void 0 ? void 0 : config.horizontalSpace, min: 0, max: 50, title: '0-50', onAcceptValue: this.handleHorizontalSpaceChange }))),
                jsx(SettingRow, { flow: 'wrap', label: `${this.formatMessage('verticalSpacing')} (px)`, role: 'group', "aria-label": `${this.formatMessage('verticalSpacing')} (px)` },
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx(Slider, { style: { width: '60%' }, "data-field": 'verticalSpace', onChange: this.handleFormChange, value: config === null || config === void 0 ? void 0 : config.verticalSpace, title: '0-50', size: 'sm', min: 0, max: 50 }),
                        jsx(MyNumericInput, { style: { width: '25%' }, value: config.verticalSpace, min: 0, max: 50, title: '0-50', onAcceptValue: this.handleVerticalSpaceChange })))));
        };
        this.renderRowColumnLayoutSetting = () => {
            const { config } = this.props;
            const cardSize = this.getCardSizeUnit(this.props);
            const isVertical = (config === null || config === void 0 ? void 0 : config.layoutType) ? (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Row : config.direction === DirectionType.Vertical;
            return (jsx("div", { className: 'mt-3' },
                jsx(SettingRow, { flow: 'wrap', label: this.getItemSizeLabel(), role: 'group', "aria-label": (isVertical ? this.formatMessage('itemHeight') : this.formatMessage('itemWidth')) + ' (px)' },
                    jsx(MyNumericInput, { style: { width: '100%' }, value: parseFloat((isVertical ? cardSize.height.distance : cardSize.width.distance).toFixed(0)), min: LIST_CARD_MIN_SIZE, disabled: config.lockItemRatio, onAcceptValue: this.handleItemSizeChange })),
                jsx(SettingRow, { label: '' },
                    jsx("div", { title: this.formatMessage('lockItemRatio'), className: 'd-flex w-100 align-items-center cursor-pointer', "aria-label": this.formatMessage('lockItemRatio'), style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { this.handleCheckboxChange('lockItemRatio'); } },
                        jsx(Checkbox, { className: 'lock-item-ratio', "data-field": 'lockItemRatio', checked: config.lockItemRatio, "aria-label": this.formatMessage('lockItemRatio') }),
                        jsx("div", { className: 'lock-item-ratio-label text-left' }, this.formatMessage('lockItemRatio')))),
                jsx(SettingRow, { flow: 'wrap', label: (isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)', role: 'group', "aria-label": (isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)' },
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx(Slider, { style: { width: '60%' }, "data-field": 'space', onChange: this.handleFormChange, value: config.space, title: '0-50', size: 'sm', min: 0, max: 50 }),
                        jsx(MyNumericInput, { style: { width: '25%' }, value: config.space, min: 0, max: 50, title: '0-50', onAcceptValue: this.handleSpaceChange })))));
        };
        this.getItemSizeLabel = () => {
            const { config } = this.props;
            const isVertical = (config === null || config === void 0 ? void 0 : config.layoutType) ? (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.Row : config.direction === DirectionType.Vertical;
            const isGrid = (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID;
            let labelString;
            if (isGrid) {
                labelString = this.formatMessage('gridItemSize');
            }
            else {
                labelString = isVertical ? `${this.formatMessage('itemHeight')} (px)` : `${this.formatMessage('itemWidth')} (px)`;
            }
            return jsx("div", { className: 'd-flex' },
                jsx("div", { className: 'flex-grow-1' }, labelString),
                this.getBrowserIcons(12));
        };
        this.getBrowserIcons = (iconSize) => {
            const { showCardSetting, browserSizeMode, layouts } = this.props;
            const currentLayout = layouts[showCardSetting];
            const autoMedium = !currentLayout[BrowserSizeMode.Medium];
            const autoMobile = !currentLayout[BrowserSizeMode.Small];
            const isDesktop = this.props.browserSizeMode === BrowserSizeMode.Large || !currentLayout[browserSizeMode];
            const isPad = (this.props.browserSizeMode === BrowserSizeMode.Large && autoMedium) ||
                this.props.browserSizeMode === BrowserSizeMode.Medium ||
                (this.props.browserSizeMode === BrowserSizeMode.Small && autoMedium && autoMobile);
            const isMobile = (this.props.browserSizeMode === BrowserSizeMode.Large && autoMobile) ||
                (this.props.browserSizeMode === BrowserSizeMode.Medium && autoMedium && autoMobile) ||
                this.props.browserSizeMode === BrowserSizeMode.Small;
            const color = this.props.theme.colors.palette.dark[200];
            const desktopLabel = this.formatMessage('applyToLargeScreen');
            const padLabel = this.formatMessage('applyToMediumScreen');
            const mobileLabel = this.formatMessage('applyToSmallScreen');
            return (jsx("div", { className: 'd-flex justify-content-between align-items-center' },
                isDesktop && jsx(DesktopOutlined, { size: iconSize, color: color, title: desktopLabel, "aria-label": desktopLabel }),
                isPad && jsx(TabletOutlined, { size: iconSize, color: color, className: isDesktop ? 'ml-1' : '', title: padLabel, "aria-label": padLabel }),
                isMobile && jsx(MobileOutlined, { size: iconSize, color: color, className: isDesktop || isPad ? 'ml-1' : '', title: mobileLabel, "aria-label": mobileLabel })));
        };
        this.renderStatsSetting = () => {
            const { config } = this.props;
            const { settingCollapse } = this.state;
            return (jsx(SettingSection, null,
                jsx(SettingCollapse, { label: this.formatMessage('states'), isOpen: settingCollapse === SettingCollapseType.States, onRequestOpen: () => { this.openSettingCollapse(SettingCollapseType.States); }, onRequestClose: this.closeSettingCollapse, "aria-label": this.formatMessage('states') },
                    jsx(SettingRow, { className: "mt-2" },
                        jsx(LinkSelector, { onSettingConfirm: this.onSettingLinkConfirm, linkParam: config.linkParam, useDataSources: this.props.useDataSources, widgetId: this.props.id })),
                    this.rednerBgSetting(),
                    jsx(SettingRow, { label: this.formatMessage('hover'), role: 'group', "aria-label": this.formatMessage('hover') },
                        jsx(Button, { className: 'setting-next d-flex text-break', "data-value": Status.Hover, onClick: this.onOpenCardSetting, type: 'tertiary', title: this.getToHoverSettingText(), size: 'sm', ref: ref => { this.toHoverSettingButtonRef = ref; } },
                            jsx("div", null, this.getToHoverSettingText()),
                            jsx(RightOutlined, { autoFlip: true, style: { flex: 'none' }, size: 12 }))),
                    jsx(SettingRow, { label: this.formatMessage('selected'), role: 'group', "aria-label": this.formatMessage('selected') },
                        jsx(Button, { className: 'setting-next d-flex text-break', "data-value": Status.Selected, onClick: this.onOpenCardSetting, type: 'tertiary', title: this.getToSelectedSettingText(), size: 'sm', ref: ref => { this.toSelectedSettingButtonRef = ref; } },
                            jsx("div", null, this.getToSelectedSettingText()),
                            jsx(RightOutlined, { autoFlip: true, style: { flex: 'none' }, size: 12 }))))));
        };
        this.getToHoverSettingText = () => {
            const { config } = this.props;
            return config.cardConfigs[Status.Hover].enable ? this.formatMessage('on') : this.formatMessage('off');
        };
        this.getToSelectedSettingText = () => {
            const { config } = this.props;
            return config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None ? this.formatMessage('on') : this.formatMessage('off');
        };
        this.renderToolSetting = () => {
            const { config, useDataSources } = this.props;
            const { settingCollapse } = this.state;
            const searchHint = config === null || config === void 0 ? void 0 : config.searchHint;
            const buttonProps = { showDynamicTitle: true };
            return (jsx(SettingSection, null,
                jsx(SettingCollapse, { label: this.formatMessage('tools'), isOpen: settingCollapse === SettingCollapseType.Tools, onRequestOpen: () => { this.openSettingCollapse(SettingCollapseType.Tools); }, onRequestClose: this.closeSettingCollapse },
                    jsx(SettingRow, { className: "mt-2", label: this.formatMessage('search'), "aria-label": this.formatMessage('search') },
                        jsx("div", { className: 'd-flex' },
                            jsx(Switch, { checked: config.searchOpen, "data-field": 'searchOpen', onChange: this.handleFormChange, title: this.formatMessage('search') }))),
                    config.searchOpen && (jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('chooseSearchingFields'), role: 'group', "aria-label": this.formatMessage('chooseSearchingFields') },
                        jsx("div", { className: 'd-flex w-100 search-container', style: { zIndex: 3 } },
                            jsx(MultiSelect, { items: Immutable(this.getSearchingFields(true)), values: config.searchFields &&
                                    Immutable(config.searchFields.split(',')), className: 'search-multi-select', fluid: true, size: 'sm', placeholder: this.formatMessage('listSelectSearchFields'), onClickItem: this.handleChooseSearchingFieldsChange, displayByValues: this.displaySelectedFields, buttonProps: buttonProps })),
                        jsx("div", { title: this.formatMessage('exactMatch'), "aria-label": this.formatMessage('exactMatch'), className: 'd-flex align-items-center cursor-pointer', style: { marginTop: '10px', paddingLeft: 0, paddingRight: 0 }, onClick: () => { this.handleCheckboxChange('searchExact'); } },
                            jsx(Checkbox, { "data-field": 'searchExact', checked: config.searchExact, "aria-label": this.formatMessage('exactMatch') }),
                            jsx("div", { className: 'text-truncate lock-item-ratio-label' }, this.formatMessage('exactMatch'))))),
                    config.searchOpen && (jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('searctHint'), role: 'group', "aria-label": this.formatMessage('searctHint') },
                        jsx(TextInput, { size: 'sm', className: 'search-placeholder w-100', placeholder: this.formatMessage('search'), value: searchHint || '', onChange: this.onSearchPlaceholderChange }))),
                    jsx(SettingRow, { label: this.formatMessage('sort'), "aria-label": this.formatMessage('sort') },
                        jsx("div", { className: 'd-flex' },
                            jsx(Switch, { checked: config.sortOpen, "data-field": 'sortOpen', onChange: this.handleFormChange, title: this.formatMessage('sort') }))),
                    config.sortOpen && (jsx(SettingRow, { flow: 'wrap' },
                        jsx(SortSetting, { onChange: this.onSettingSortChange, useDataSource: useDataSources && useDataSources[0], value: config.sorts || Immutable([]) }))),
                    jsx(SettingRow, { label: this.formatMessage('filter'), "aria-label": this.formatMessage('filter') },
                        jsx("div", { className: 'd-flex' },
                            jsx(Switch, { checked: config.filterOpen, "data-field": 'filterOpen', onChange: this.handleFormChange, title: this.formatMessage('filter') }))),
                    config.filterOpen && (jsx(Fragment, null,
                        jsx(SettingRow, null,
                            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                jsx(Button, { className: 'w-100 text-dark set-link-btn', color: !this.state.datasource ? 'secondary' : 'primary', disabled: !this.state.datasource, onClick: this.showSqlExprPopup, title: this.formatMessage('setFilters') }, this.formatMessage('setFilters')))),
                        jsx(SettingRow, { flow: 'wrap' },
                            jsx(SqlExpressionBuilderPopup, { dataSource: this.state.datasource, isOpen: this.state.isSqlExprShow, toggle: this.toggleSqlExprPopup, expression: config.filter, onChange: this.onSqlExprBuilderChange })))),
                    config.cardConfigs[Status.Selected].selectionMode !==
                        SelectionModeType.None && (jsx(Fragment, null,
                        jsx(SettingRow, { label: this.formatMessage('showSelection'), "aria-label": this.formatMessage('showSelection') },
                            jsx(Switch, { checked: config.showSelectedOnlyOpen, "data-field": 'showSelectedOnlyOpen', onChange: this.handleFormChange, title: this.formatMessage('showSelection') })),
                        jsx(SettingRow, { label: this.formatMessage('clearSelection'), "aria-label": this.formatMessage('clearSelection') },
                            jsx(Switch, { checked: config.showClearSelected, "data-field": 'showClearSelected', onChange: this.handleFormChange, title: this.formatMessage('clearSelection') })))))));
        };
        this.renderRegularSetting = () => {
            const { datasource } = this.state;
            return (jsx("div", { className: 'list-list-setting h-100 d-flex flex-column' },
                this.renderDataSetting(),
                this.renderDatasourcePlaceholder(),
                datasource && (jsx(Fragment, null,
                    this.renderArrangementSetting(),
                    this.renderStatsSetting(),
                    this.renderToolSetting()))));
        };
        this.renderDatasourcePlaceholder = () => {
            const { datasource } = this.state;
            const dsSelectString = this.formatMessage('setDataSource');
            return !datasource
                ? (jsx("div", { className: 'w-100 text-center datasource-placeholder flex-grow-1 d-flex flex-column justify-content-center align-items-center' },
                    jsx("div", { className: "w-100" },
                        jsx(ClickOutlined, { size: 48 }),
                        jsx("p", { className: 'text-Secondary', id: 'list-empty-tip' }, this.formatMessage('listBlankStatus', {
                            ButtonString: dsSelectString
                        })))))
                : null;
        };
        this.renderListCardSetting = () => {
            var _a;
            const statusIntl = {};
            statusIntl[Status.Hover] = this.formatMessage('hover');
            statusIntl[Status.Selected] = this.formatMessage('selected');
            statusIntl[Status.Regular] = this.formatMessage('regular');
            const { showCardSetting, config, id, browserSizeMode, layouts, appConfig, onSettingChange } = this.props;
            return (jsx("div", { className: 'list-card-setting' },
                jsx(SettingSection, null,
                    jsx(SettingRow, { label: jsx(Button, { className: 'd-flex text-truncate align-items-center card-setting-return', onClick: this.onCardSettingReturnBackClick, type: 'tertiary', size: 'sm', title: this.formatMessage('back') },
                            jsx(ArrowLeftOutlined, { className: 'mr-1', autoFlip: true }),
                            statusIntl[showCardSetting]) }),
                    jsx(SettingRow, { label: this.formatMessage('enableStatus', {
                            status: statusIntl[showCardSetting].toLocaleLowerCase()
                        }), "aria-label": this.formatMessage('enableStatus', { status: statusIntl[showCardSetting].toLocaleLowerCase() }) },
                        jsx(Switch, { checked: showCardSetting === Status.Hover
                                ? config.cardConfigs[Status.Hover].enable
                                : config.cardConfigs[Status.Selected].selectionMode !==
                                    SelectionModeType.None, onChange: showCardSetting === Status.Hover
                                ? this.onHoverLayoutOpenChange
                                : this.onSelectionSwitch, title: this.formatMessage('enableStatus', { status: statusIntl[showCardSetting].toLocaleLowerCase() }) }))),
                ((showCardSetting === Status.Selected &&
                    config.cardConfigs[Status.Selected].selectionMode !==
                        SelectionModeType.None) ||
                    (showCardSetting === Status.Hover &&
                        config.cardConfigs[Status.Hover].enable)) && (jsx(SettingSection, { className: 'card-setting-con' },
                    showCardSetting === Status.Selected && (jsx(SettingSection, { className: 'clear-padding' },
                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('selectMode'), role: 'group', "aria-label": this.formatMessage('selectMode') },
                            jsx(Select, { value: config.cardConfigs[Status.Selected].selectionMode, onChange: this.onSelectionModeChange }, this.getSelectModeOptions())))),
                    this.rednerBgSetting(false),
                    jsx(SettingSection, { className: 'clear-padding' },
                        jsx(LayoutSetting, { id: id, onSettingChange: onSettingChange, listLayout: (_a = config.cardConfigs[showCardSetting]) === null || _a === void 0 ? void 0 : _a.listLayout, status: showCardSetting, browserSizeMode: browserSizeMode, mainSizeMode: appConfig.mainSizeMode, layouts: layouts, config: config, appConfig: appConfig }))))));
        };
        initStyles(props.id);
        this.state = {
            datasource: null,
            isTextExpPopupOpen: false,
            currentTextInput: '',
            isTipExpPopupOpen: false,
            isSqlExprShow: false,
            isTemplateContainScroll: false,
            templateConWidth: 0,
            settingCollapse: SettingCollapseType.None
        };
        this.listUseTipRef = React.createRef();
        this.debounceGridItemSizeRatioChange = lodash.debounce((value) => this.handleGridItemSizeRatioChange(value), 200);
    }
    componentDidMount() {
        const { config, id, useDataSourcesEnabled } = this.props;
        let { appConfig } = this.props;
        if (!config.isInitialed) {
            if (!useDataSourcesEnabled) {
                appConfig = getAppConfigAction().editWidget(appConfig.widgets[id].set('useDataSourcesEnabled', true)).appConfig;
            }
            this.onItemStyleChanged(config.itemStyle, config === null || config === void 0 ? void 0 : config.isCheckEmptyTemplate, appConfig);
        }
        window.addEventListener('resize', this.updateStartButtonPosition);
    }
    componentWillUnmount() {
        const { dispatch, id } = this.props;
        dispatch(appActions.widgetStatePropChange(id, 'settingPanelChange', null));
        clearTimeout(this.updatePositionTimeout);
    }
    componentDidUpdate(preProps) {
        var _a, _b;
        const { useDataSources, config, settingPanelChange } = this.props;
        // if fields will change in componentDidUpdate
        let fieldsWillChange = false;
        if (useDataSources !== preProps.useDataSources) {
            const old = (_a = preProps.useDataSources) === null || _a === void 0 ? void 0 : _a[0];
            const now = (_b = this.props.useDataSources) === null || _b === void 0 ? void 0 : _b[0];
            if (!now || !old || (old === null || old === void 0 ? void 0 : old.dataSourceId) !== (now === null || now === void 0 ? void 0 : now.dataSourceId)) {
                this.onConfigChange(config
                    .set('sorts', undefined)
                    .set('searchFields', undefined)
                    .set('filter', undefined));
                fieldsWillChange = true;
                if (!this.needUpdateFields) {
                    this.needUpdateFields = true;
                }
                if (old && !now) {
                    // remove from ds manager
                    this.setDatasource(undefined);
                }
            }
            if (!useDataSources ||
                useDataSources.length < 1 ||
                !preProps.useDataSources ||
                preProps.useDataSources.length < 1 ||
                preProps.useDataSources[0].dataSourceId !==
                    useDataSources[0].dataSourceId) {
                this.onConfigChange(config
                    .set('sorts', undefined)
                    .set('searchFields', undefined)
                    .set('filter', undefined));
                fieldsWillChange = true;
                if (!this.needUpdateFields) {
                    this.needUpdateFields = true;
                }
            }
        }
        if (this.needUpdateFields && !fieldsWillChange) {
            this.needUpdateFields = false;
            this.changeUsedFields();
        }
        if (preProps.settingPanelChange !== 'content' && settingPanelChange === 'content') {
            this.updateStartButtonPosition();
        }
    }
    getIndexForPickerData(value, data) {
        let index = -1;
        data.some((d, i) => {
            if (value === d.value) {
                index = i;
                return true;
            }
            else {
                return false;
            }
        });
        return index;
    }
    rednerBgSetting(isClearBorder = true) {
        const { config, showCardSetting } = this.props;
        return (jsx(Fragment, null,
            jsx(SettingSection, { className: `clear-padding ${isClearBorder && 'clear-border clear-padding-bottom'}` },
                jsx(SettingRow, { label: this.formatMessage('background'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('background') },
                    jsx(BackgroundSetting, { background: config.cardConfigs[showCardSetting].backgroundStyle.background, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'background', value) }))),
            jsx(SettingSection, { className: `clear-padding ${isClearBorder && 'clear-border'}` },
                jsx(SettingRow, { label: this.formatMessage('border'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('border') },
                    jsx(BorderSetting, { value: config.cardConfigs[showCardSetting].backgroundStyle.border, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'border', value) })),
                jsx(SettingRow, { label: this.formatMessage('borderRadius'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('borderRadius') },
                    jsx(BorderRadiusSetting, { value: config.cardConfigs[showCardSetting].backgroundStyle.borderRadius, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'borderRadius', value) })))));
    }
    render() {
        const { config, showCardSetting, selectionIsInSelf } = this.props;
        return (jsx("div", { className: classNames(`${prefix}list-setting`, `${prefix}setting`), css: this.getStyle(this.props.theme) }, !selectionIsInSelf && jsx("div", { className: 'h-100' },
            !config.isItemStyleConfirm
                ? (this.renderTemplate())
                : (jsx(Fragment, null,
                    showCardSetting === Status.Regular && this.renderRegularSetting(),
                    showCardSetting !== Status.Regular && this.renderListCardSetting())),
            this.props.useDataSources &&
                this.props.useDataSources[0] &&
                this.props.useDataSources[0] && (jsx("div", { className: 'waiting-for-database' },
                jsx(DataSourceComponent, { useDataSource: this.props.useDataSources[0], onDataSourceCreated: this.onDsCreate, onDataSourceInfoChange: this.onDataSourceInfoChange }))))));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { id } = props;
    return {
        appConfig: state && state.appStateInBuilder && state.appStateInBuilder.appConfig,
        appMode: state &&
            state.appStateInBuilder &&
            state.appStateInBuilder.appRuntimeInfo &&
            state.appStateInBuilder.appRuntimeInfo.appMode,
        browserSizeMode: state &&
            state.appStateInBuilder &&
            state.appStateInBuilder.browserSizeMode,
        showCardSetting: (state &&
            state.appStateInBuilder &&
            state.appStateInBuilder.widgetsState &&
            state.appStateInBuilder.widgetsState[id] &&
            state.appStateInBuilder.widgetsState[id].showCardSetting) ||
            Status.Regular,
        selectionIsInSelf: (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.widgetsState[id]) === null || _b === void 0 ? void 0 : _b.selectionIsInSelf,
        settingPanelChange: (_d = (_c = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _c === void 0 ? void 0 : _c[props.id]) === null || _d === void 0 ? void 0 : _d.settingPanelChange,
        layoutInfo: (_f = (_e = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _e === void 0 ? void 0 : _e.widgetsState[id]) === null || _f === void 0 ? void 0 : _f.layoutInfo,
        widgetRect: (_h = (_g = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _g === void 0 ? void 0 : _g.widgetsState[id]) === null || _h === void 0 ? void 0 : _h.widgetRect,
        parentSize: (_k = (_j = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _j === void 0 ? void 0 : _j.widgetsState[id]) === null || _k === void 0 ? void 0 : _k.parentSize,
        viewportSize: jimuUtils.findViewportSize((_l = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _l === void 0 ? void 0 : _l.appConfig, (_m = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _m === void 0 ? void 0 : _m.browserSizeMode)
    };
};
//# sourceMappingURL=setting.js.map