/** @jsx jsx */
import { React, classNames, css, jsx, BrowserSizeMode, appConfigUtils, getAppStore, polished, Immutable, LayoutType, appActions, getNextAnimationId } from 'jimu-core';
import { getAppConfigAction, builderAppSync, templateUtils } from 'jimu-for-builder';
import { searchUtils, defaultMessages as jimuLayoutsDefaultMessages } from 'jimu-layouts/layout-runtime';
import { SettingSection, SettingRow, LinkSelector, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { BackgroundSetting, BorderSetting, BoxShadowSetting, BorderRadiusSetting, TransitionSetting } from 'jimu-ui/advanced/style-setting-components';
import { Switch, Icon, Button, defaultMessages as jimuUIDefaultMessages, Tooltip } from 'jimu-ui';
import { ItemStyle, Status, defaultTransitionInfo } from '../config';
import defaultMessages from './translations/default';
import { Fragment } from 'react';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
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
    STYLE9: require('./template/card-style9.json'),
    STYLE10: require('./template/card-style10.json')
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
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onPropertyChange = (name, value) => {
            const { config } = this.props;
            if (value === config[name]) {
                return;
            }
            this.onConfigChange(name, value);
        };
        this.onConfigChange = (key, value) => {
            const { config } = this.props;
            const newConfig = config.setIn(key, value);
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
        };
        this.onBackgroundStyleChange = (status, key, value) => {
            this.onConfigChange([status, 'backgroundStyle', key], value);
        };
        this.onExportClick = evt => {
            const { appConfig, layouts, id, browserSizeMode } = this.props;
            const currentPageId = getAppStore().getState().appStateInBuilder
                .appRuntimeInfo.currentPageId;
            const pageJson = appConfig.pages[currentPageId === 'default' ? 'home' : currentPageId];
            const pageTemplates = [
                {
                    widgetId: id,
                    config: {
                        layouts: appConfig.layouts.without(pageJson.layout[browserSizeMode], layouts[Status.Hover][browserSizeMode]),
                        widgets: appConfig.widgets.without(id),
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
        };
        this.changeBuilderStatus = (status) => {
            const { id } = this.props;
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: id,
                propKey: 'builderStatus',
                value: status
            });
        };
        this.onItemStyleChanged = (style, updatedAppConfig = undefined) => {
            // if(this.props.appMode === AppMode.Run) return;
            const { id } = this.props;
            let { appConfig } = this.props;
            if (updatedAppConfig) {
                appConfig = updatedAppConfig;
            }
            const styleTemp = AllStyles[style];
            templateUtils
                .updateWidgetByTemplate(appConfig, styleTemp, id, styleTemp.widgetId, {}, defaultMessages)
                .then(newAppConfig => {
                this._onItemStyleChange(newAppConfig, style);
            });
        };
        this.getUniqueIds = (appConfig, type, size) => {
            const ids = [];
            for (let i = 0; i < size; i++) {
                const id = appConfigUtils.getUniqueId(appConfig, type);
                ids.push(id);
                appConfig = appConfig.setIn([type + 's', id], { id: id });
            }
            return ids;
        };
        this.getUniqueLabels = (appConfig, type, size) => {
            const labels = [];
            for (let i = 0; i < size; i++) {
                const id = appConfigUtils.getUniqueId(appConfig, type);
                const label = appConfigUtils.getUniqueLabel(appConfig, type, type);
                labels.push(label);
                appConfig = appConfig.setIn([type + 's', id], {
                    id: id,
                    label: label
                });
            }
            return labels;
        };
        this._onItemStyleChange = (appConfig, style) => {
            const { id, config: oldConfig } = this.props;
            const appConfigAction = getAppConfigAction(appConfig);
            const wJson = appConfig.widgets[id];
            const template = AllStyles[style];
            const templateWidgetJson = template.config.widgets[template.widgetId];
            wJson.layouts &&
                Object.keys(wJson.layouts).forEach(name => {
                    wJson.layouts[name] &&
                        Object.keys(wJson.layouts[name]).forEach(device => {
                            var _a, _b;
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
                                if (config[Status.Hover].enable) {
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
            this.editLayoutItemSize(appConfigAction, style);
            const config = wJson.config
                .set('itemStyle', style)
                .set('isItemStyleConfirm', false)
                .set('isInitialed', true);
            appConfigAction
                .editWidgetProperty(wJson.id, 'config', config)
                .exec(!oldConfig.isInitialed);
        };
        this.getStyle = (theme) => {
            return css `
      &{
        .resetting-template {
          cursor: pointer;
          color: ${theme.colors.palette.primary[700]};
          vertical-align: middle;
          padding: 0;
        }
        .resetting-template:hover {
          cursor: pointer;
          color: ${theme.colors.palette.primary[800]};
        }
        .card-setting-return {
          cursor: pointer;
        }
        .setting-next {
          width: auto;
          max-width: 50%;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: end;
          font-size: ${polished.rem(13)};
        }
        .style-group {
          button {
            padding: 0;
          }
          &.advance-style-group {
            padding-bottom: ${polished.rem(4)};
          }
          button {
            flex: 1;
            flex-grow: 1;
          }
          .style-margin-r {
            margin-right: ${polished.rem(6)};
          }
          .style-img {
            cursor: pointer;
            width: 100%;
            height: 70px;
            margin: 0;
            border: 1px solid transparent;
            background-color: ${theme.colors.white};
            &.active {
              border: 2px solid ${theme.colors.primary};
            }
            &.style-img-h {
              width: 100%;
              height: auto;
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
          .vertical-space {
            height: 10px;
          }
        }
        .use-tips {
          bottom: 0;
          background:${theme.colors.palette.light[300]};
          z-index: 100;
        }
        .tips-text {
          color: ${theme.colors.palette.dark[400]};
        }
        .tips-opacity-0 {
          opacity: 0;
        }
        .template-type {
          margin-bottom: ${polished.rem(2)};
        }
        .template-classic {
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${theme.colors.palette.dark[400]};
          vertical-align: middle;
        }
        .tooltip-icon-con {
          color: ${theme.colors.palette.dark[600]};
        }
      }
    `;
        };
        this.formatMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: MESSAGES[id] }, values);
        };
        this.onSettingLinkConfirm = (linkResult) => {
            if (!linkResult) {
                return;
            }
            this.onConfigChange(['linkParam'], linkResult);
        };
        this.handleItemStyleConfirmClick = evt => {
            this.onPropertyChange(['isItemStyleConfirm'], true);
            this.handleShowRegularClick();
        };
        this.handleResetItemstyleClick = evt => {
            this.onPropertyChange(['isItemStyleConfirm'], false);
            this.changeBuilderStatus(Status.Regular);
            this.updateStartButtonPosition();
        };
        this.handleItemStyleImageClick = evt => {
            const style = evt.currentTarget.dataset.value;
            const { config } = this.props;
            if (config.itemStyle === style)
                return;
            this.onItemStyleChanged(style);
        };
        this.editLayoutItemSize = (appConfigAction, style) => {
            var _a, _b;
            const { layoutInfo, appConfig } = this.props;
            const cardSize = (_a = this.getTemplateSize()) === null || _a === void 0 ? void 0 : _a[style];
            const layoutType = this.getLayoutType();
            if (layoutType === LayoutType.FixedLayout) {
                const { layoutId, layoutItemId } = layoutInfo;
                const layout = appConfig.layouts[layoutId];
                const layoutItem = (_b = layout === null || layout === void 0 ? void 0 : layout.content) === null || _b === void 0 ? void 0 : _b[layoutItemId];
                const bbox = layoutItem.bbox.set('width', `${cardSize.width}%`).set('height', `${cardSize.height}%`);
                appConfigAction
                    .editLayoutItemBBox(layoutInfo, bbox)
                    .exec();
            }
        };
        this.getTemplateSize = () => {
            const { parentSize } = this.props;
            const cardWidth1 = 300;
            const cardWidth2 = 540;
            const viewportWidth = (parentSize === null || parentSize === void 0 ? void 0 : parentSize.width) || 1280;
            const viewportHeight = (parentSize === null || parentSize === void 0 ? void 0 : parentSize.height) || 800;
            const templateWidth1 = this.checkTemplateDefaultSize((cardWidth1 * 100) / viewportWidth);
            const templateHeight2 = this.checkTemplateDefaultSize((cardWidth2 * 100) / viewportWidth);
            const templateSize = {
                STYLE0: { width: templateWidth1, height: this.checkTemplateDefaultSize((340 * 100) / viewportHeight) },
                STYLE1: { width: templateWidth1, height: this.checkTemplateDefaultSize((405 * 100) / viewportHeight) },
                STYLE2: { width: templateWidth1, height: this.checkTemplateDefaultSize((391 * 100) / viewportHeight) },
                STYLE3: { width: templateWidth1, height: this.checkTemplateDefaultSize((344 * 100) / viewportHeight) },
                STYLE4: { width: templateWidth1, height: this.checkTemplateDefaultSize((368 * 100) / viewportHeight) },
                STYLE5: { width: templateWidth1, height: this.checkTemplateDefaultSize((407 * 100) / viewportHeight) },
                STYLE6: { width: templateWidth1, height: this.checkTemplateDefaultSize((300 * 100) / viewportHeight) },
                STYLE7: { width: templateWidth1, height: this.checkTemplateDefaultSize((300 * 100) / viewportHeight) },
                STYLE8: { width: templateHeight2, height: this.checkTemplateDefaultSize((200 * 100) / viewportHeight) },
                STYLE9: { width: templateHeight2, height: this.checkTemplateDefaultSize((200 * 100) / viewportHeight) },
                STYLE10: { width: templateWidth1, height: this.checkTemplateDefaultSize((391 * 100) / viewportHeight) }
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
        this.onHoverLayoutOpenChange = evt => {
            const { config, id, layouts, browserSizeMode, appConfig } = this.props;
            const value = evt.target.checked;
            if (config[Status.Hover].enable === value)
                return;
            let action = getAppConfigAction();
            if (config[Status.Hover].enable && !value) {
                // remove hover layout
                const desLayoutId = searchUtils.findLayoutId(layouts[Status.Hover], browserSizeMode, appConfig.mainSizeMode);
                action = action.resetLayout(desLayoutId, true);
                this.changeBuilderStatus(Status.Regular);
            }
            else if (!config[Status.Hover].enable && value) {
                const oriLayoutId = searchUtils.findLayoutId(layouts[Status.Regular], browserSizeMode, appConfig.mainSizeMode);
                const desLayoutId = searchUtils.findLayoutId(layouts[Status.Hover], browserSizeMode, appConfig.mainSizeMode);
                action = action.duplicateLayoutItems(oriLayoutId, desLayoutId, false);
                this.changeBuilderStatus(Status.Hover);
            }
            const newConfig = config.setIn([Status.Hover, 'enable'], value);
            action.editWidgetConfig(id, newConfig).exec();
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
        this.renderTemplate = () => {
            const { config } = this.props;
            const { isTemplateContainScroll } = this.state;
            const startButtonClass = isTemplateContainScroll
                ? 'position-absolute position-absolute-con'
                : 'position-relative-con';
            return (jsx("div", { ref: ref => { this.setTemplatesContain(ref); } },
                jsx(SettingSection, { title: this.formatMessage('chooseTemplateTip'), className: 'test' },
                    jsx(SettingRow, { role: 'group', "aria-label": this.formatMessage('classic') },
                        jsx("div", { className: 'style-group w-100' },
                            jsx("div", { className: 'template-type mb-3' },
                                jsx("span", { className: 'template-classic' }, this.formatMessage('classic')),
                                jsx(Tooltip, { title: this.formatMessage('classicTips'), placement: 'left' },
                                    jsx("span", { className: 'inline-block ml-2 tooltip-icon-con' },
                                        jsx(InfoOutlined, { autoFlip: true })))),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": ItemStyle.Style1, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'style-margin-r' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style1 && 'active'}`, icon: require('./assets/style2.svg') })),
                                jsx(Button, { "data-value": ItemStyle.Style3, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style3 && 'active'}`, icon: require('./assets/style4.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": ItemStyle.Style7, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'style-margin-r' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style7 && 'active'}`, icon: require('./assets/style8.svg') })),
                                jsx("div", { className: 'flex-grow-1' })),
                            jsx("div", { className: 'vertical-space' }),
                            jsx(Button, { "data-value": ItemStyle.Style8, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { autoFlip: true, className: `style-img ${config.itemStyle ===
                                        ItemStyle.Style8 && 'active'}`, icon: require('./assets/style9.svg') })),
                            jsx("div", { className: 'vertical-space' }),
                            jsx(Button, { "data-value": ItemStyle.Style9, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                jsx(Icon, { autoFlip: true, className: `style-img ${config.itemStyle ===
                                        ItemStyle.Style9 && 'active'}`, icon: require('./assets/style10.svg') })))),
                    jsx(SettingRow, { role: 'group', "aria-label": this.formatMessage('classicHover') },
                        jsx("div", { className: 'style-group advance-style-group w-100' },
                            jsx("div", { className: 'template-type mb-3' },
                                jsx("span", { className: 'template-classic' }, this.formatMessage('classicHover')),
                                jsx(Tooltip, { title: this.formatMessage('classicHoverTips'), placement: 'left' },
                                    jsx("span", { className: 'inline-block ml-2 tooltip-icon-con' },
                                        jsx(InfoOutlined, { autoFlip: true })))),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": ItemStyle.Style0, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'style-margin-r' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style0 && 'active'}`, icon: require('./assets/style1.svg') })),
                                jsx(Button, { "data-value": ItemStyle.Style2, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style2 && 'active'}`, icon: require('./assets/style3.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": ItemStyle.Style4, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'style-margin-r' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style4 && 'active'}`, icon: require('./assets/style5.svg') })),
                                jsx(Button, { "data-value": ItemStyle.Style5, onClick: this.handleItemStyleImageClick, type: 'tertiary' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style5 && 'active'}`, icon: require('./assets/style6.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": ItemStyle.Style6, onClick: this.handleItemStyleImageClick, type: 'tertiary', className: 'style-margin-r' },
                                    jsx(Icon, { autoFlip: true, className: `style-img style-img-h ${config.itemStyle ===
                                            ItemStyle.Style6 && 'active'}`, icon: require('./assets/style7.svg') })),
                                jsx("div", { className: 'flex-grow-1' })),
                            jsx("div", { className: 'vertical-space' }),
                            jsx(Button, { "data-value": ItemStyle.Style10, type: 'tertiary', className: `style-img empty  text-center  pr-1 pl-1 text-truncate ${config.itemStyle ===
                                    ItemStyle.Style10 && 'active'}`, onClick: this.handleItemStyleImageClick, title: this.formatMessage('emptyTemplate') }, this.formatMessage('emptyTemplate')))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'start-con w-100', css: this.getStartButtonStyle() },
                            jsx("div", { className: startButtonClass },
                                jsx(Button, { className: "w-100", type: 'primary', title: this.formatMessage('start'), onClick: this.handleItemStyleConfirmClick }, this.formatMessage('start'))))))));
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
        this.editStatus = (status) => {
            const { id } = this.props;
            builderAppSync.publishChangeWidgetStatePropToApp({
                widgetId: id,
                propKey: 'showCardSetting',
                value: status
            });
            this.changeBuilderStatus(status);
        };
        this.handleShowRegularClick = () => {
            const { showRegular } = this.state;
            if (!showRegular) {
                this.setState({
                    showHover: false
                });
                this.editStatus(Status.Regular);
            }
            this.setState({
                showRegular: !showRegular
            });
        };
        this.handleShowHoverClick = () => {
            const { showHover } = this.state;
            if (!showHover) {
                this.setState({
                    showRegular: false
                });
                this.editStatus(Status.Hover);
            }
            this.setState({
                showHover: !showHover
            });
        };
        this.renderCardSetting = () => {
            const { selectionIsInSelf } = this.props;
            const statusIntl = {};
            statusIntl[Status.Hover] = this.formatMessage('hoverCard');
            statusIntl[Status.Regular] = this.formatMessage('default');
            return (jsx("div", { className: 'card-setting' },
                jsx(SettingSection, null,
                    jsx(SettingRow, { flow: 'wrap' },
                        jsx("div", { className: 'w-100' },
                            jsx(Button, { className: 'resetting-template', type: 'tertiary', onClick: this.handleResetItemstyleClick }, this.formatMessage('chooseOtherTemplateTip')),
                            jsx(Tooltip, { title: this.formatMessage('useTips'), showArrow: true, placement: 'left' },
                                jsx(Button, { className: 'tooltip-icon-con', type: 'tertiary' },
                                    jsx(InfoOutlined, { autoFlip: true }))))),
                    !selectionIsInSelf && jsx(SettingRow, null,
                        jsx(LinkSelector, { onSettingConfirm: this.onSettingLinkConfirm, linkParam: this.props.config.linkParam, useDataSources: this.props.useDataSources }))),
                !selectionIsInSelf && this.renderRegularSetting(),
                !selectionIsInSelf && this.renderHoverSetting()));
        };
        this.renderRegularSetting = () => {
            const { showRegular } = this.state;
            return (jsx(SettingSection, { role: 'group', "aria-label": this.formatMessage('default') },
                jsx(SettingCollapse, { label: this.formatMessage('default'), isOpen: showRegular, role: 'group', "aria-label": this.formatMessage('default'), onRequestOpen: this.handleShowRegularClick, onRequestClose: this.handleShowRegularClick },
                    jsx(SettingRow, null),
                    jsx(SettingRow, { flow: 'wrap' }, this.rednerBgSetting(Status.Regular)))));
        };
        this.renderHoverSetting = () => {
            var _a;
            const { config } = this.props;
            const { showHover } = this.state;
            const transitionInfo = ((_a = config === null || config === void 0 ? void 0 : config.transitionInfo) === null || _a === void 0 ? void 0 : _a.transition)
                ? config.transitionInfo
                : defaultTransitionInfo;
            return (jsx(SettingSection, { role: 'group', "aria-label": this.formatMessage('hoverCard') },
                jsx(SettingCollapse, { label: this.formatMessage('hoverCard'), isOpen: showHover, onRequestOpen: this.handleShowHoverClick, onRequestClose: this.handleShowHoverClick },
                    jsx(SettingRow, null),
                    jsx(SettingRow, { label: this.formatMessage('enableHover') },
                        jsx(Switch, { checked: config[Status.Hover].enable, onChange: this.onHoverLayoutOpenChange, title: this.formatMessage('enableHover') })),
                    config[Status.Hover].enable && (jsx(Fragment, null,
                        this.rednerBgSetting(Status.Hover),
                        jsx(SettingRow, { label: this.formatMessage('cardTransition'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('cardTransition') },
                            jsx(TransitionSetting, { transition: transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition, oneByOneEffect: transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect, onOneByOneChange: this.onSectionOneByOneEffectSettingChange, onTransitionChange: this.onTransitionSettingChange, onPreviewTransitionClicked: this.previewTransition, onPreviewOneByOneClicked: this.previewOneByOneInSection, onPreviewAsAWhoneClicked: this.previewTransitionAndOnebyOne, formatMessage: this.formatMessage, transitionLabel: this.formatMessage('cardWidgetState') })))))));
        };
        this.onSectionOneByOneEffectSettingChange = (animationSetting) => {
            var _a, _b;
            let transitionInfo = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.transitionInfo;
            transitionInfo = ((transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) || (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect))
                ? transitionInfo.asMutable({ deep: true })
                : defaultTransitionInfo;
            transitionInfo.oneByOneEffect = animationSetting;
            transitionInfo.previewId = getNextAnimationId();
            this.onConfigChange(['transitionInfo'], Immutable(transitionInfo));
        };
        this.onTransitionSettingChange = (transition) => {
            var _a, _b;
            let transitionInfo = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.transitionInfo;
            transitionInfo = ((transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) || (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect))
                ? transitionInfo.asMutable({ deep: true })
                : defaultTransitionInfo;
            transitionInfo.transition = transition;
            transitionInfo.previewId = getNextAnimationId();
            this.onConfigChange(['transitionInfo'], Immutable(transitionInfo));
        };
        this.previewTransition = () => {
            this.onConfigChange(['transitionInfo', 'previewId'], getNextAnimationId());
        };
        this.previewOneByOneInSection = () => {
            this.onConfigChange(['transitionInfo', 'previewId'], getNextAnimationId());
        };
        this.previewTransitionAndOnebyOne = () => {
            this.onConfigChange(['transitionInfo', 'previewId'], getNextAnimationId());
        };
        initStyles(props.id);
        this.state = {
            isAdvance: false,
            showRegular: false,
            showHover: false,
            isTemplateContainScroll: false,
            templateConWidth: 0
        };
    }
    componentDidMount() {
        this.getIsScrollAndWidthOfTemplateCon();
        window.addEventListener('resize', this.updateStartButtonPosition);
    }
    componentDidUpdate(preProps) {
        const { config, id, layoutInfo, settingPanelChange } = this.props;
        let { appConfig } = this.props;
        if (!config.isInitialed && layoutInfo) {
            appConfig = getAppConfigAction().editWidget(appConfig === null || appConfig === void 0 ? void 0 : appConfig.asMutable({ deep: true }).widgets[id]).appConfig;
            this.onItemStyleChanged(config.itemStyle, appConfig);
        }
        if (preProps.settingPanelChange !== 'content' && settingPanelChange === 'content') {
            this.updateStartButtonPosition();
        }
    }
    componentWillUnmount() {
        const { dispatch, id } = this.props;
        dispatch(appActions.widgetStatePropChange(id, 'settingPanelChange', null));
        clearTimeout(this.updatePositionTimeout);
    }
    rednerBgSetting(showCardSetting) {
        const { config } = this.props;
        return (jsx(Fragment, null,
            jsx(SettingRow, { className: 'w-100', label: this.formatMessage('background'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('background') },
                jsx(BackgroundSetting, { background: config[showCardSetting].backgroundStyle.background, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'background', value) })),
            jsx(SettingRow, { label: this.formatMessage('border'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('border') },
                jsx(BorderSetting, { value: config[showCardSetting].backgroundStyle.border, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'border', value) })),
            jsx(SettingRow, { label: this.formatMessage('borderRadius'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('borderRadius') },
                jsx(BorderRadiusSetting, { value: config[showCardSetting].backgroundStyle.borderRadius, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'borderRadius', value) })),
            jsx(SettingRow, { label: this.formatMessage('boxShadow'), flow: 'wrap' },
                jsx(BoxShadowSetting, { value: config[showCardSetting].backgroundStyle.boxShadow, onChange: value => this.onBackgroundStyleChange(showCardSetting, 'boxShadow', value) }))));
    }
    render() {
        const { config } = this.props;
        return (jsx("div", { className: classNames(`${prefix}card-setting`, `${prefix}setting`), css: this.getStyle(this.props.theme) }, !config.isItemStyleConfirm
            ? (this.renderTemplate())
            : (jsx(Fragment, null, this.renderCardSetting()))));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { id } = props;
    return {
        appConfig: (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig,
        appMode: (_c = (_b = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appRuntimeInfo) === null || _c === void 0 ? void 0 : _c.appMode,
        browserSizeMode: (_d = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _d === void 0 ? void 0 : _d.browserSizeMode,
        showCardSetting: (((_e = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _e === void 0 ? void 0 : _e.widgetsState[id]) &&
            ((_f = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _f === void 0 ? void 0 : _f.widgetsState[id].showCardSetting)) ||
            Status.Regular,
        layoutInfo: (_h = (_g = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _g === void 0 ? void 0 : _g.widgetsState[id]) === null || _h === void 0 ? void 0 : _h.layoutInfo,
        settingPanelChange: (_k = (_j = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _j === void 0 ? void 0 : _j[props.id]) === null || _k === void 0 ? void 0 : _k.settingPanelChange,
        selectionIsInSelf: (_m = (_l = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _l === void 0 ? void 0 : _l.widgetsState[id]) === null || _m === void 0 ? void 0 : _m.selectionIsInSelf,
        parentSize: (_p = (_o = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _o === void 0 ? void 0 : _o.widgetsState[id]) === null || _p === void 0 ? void 0 : _p.parentSize
    };
};
//# sourceMappingURL=setting.js.map