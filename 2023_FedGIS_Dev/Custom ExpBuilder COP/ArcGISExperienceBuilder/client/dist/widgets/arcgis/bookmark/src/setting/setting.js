/** @jsx jsx */
import { classNames, Immutable, React, jsx, LayoutType, defaultMessages as jimuCoreMessages, getNextAnimationId } from 'jimu-core';
import { defaultMessages as jimuLayoutsDefaultMessages } from 'jimu-layouts/layout-runtime';
import { getAppConfigAction, templateUtils, builderAppSync } from 'jimu-for-builder';
import { MapWidgetSelector, SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { MarkPopper } from './components/mark-popper';
import { Checkbox, Icon, Button, defaultMessages as jimuUIDefaultMessages, TextInput, TextArea, NumericInput, ButtonGroup, Select, Slider, ImageFillMode, Tabs, Tab, Tooltip, Switch, ConfirmDialog } from 'jimu-ui';
import { TemplateType, DirectionType, PageStyle, DisplayType, Status, ImgSourceType } from '../config';
import defaultMessages from './translations/default';
import { ImageSelector } from 'jimu-ui/advanced/resource-selector';
import { Fragment } from 'react';
import { TransitionSetting } from 'jimu-ui/advanced/style-setting-components';
import { getStyle, getNextButtonStyle } from './style';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { ArrowRightOutlined } from 'jimu-icons/outlined/directional/arrow-right';
import { ArrowDownOutlined } from 'jimu-icons/outlined/directional/arrow-down';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { WidgetMapOutlined } from 'jimu-icons/outlined/brand/widget-map';
const prefix = 'jimu-widget-';
const defaultConfig = require('../../config.json');
const directions = [
    { icon: 'right', value: DirectionType.Horizon },
    { icon: 'down', value: DirectionType.Vertical }
];
const originAllStyles = {
    CUSTOM1: require('./template/mark-styleCustom1.json'),
    CUSTOM2: require('./template/mark-styleCustom2.json')
};
let AllStyles;
function initStyles(widgetId) {
    if (AllStyles) {
        return AllStyles;
    }
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
    AllStyles = {};
    Object.keys(originAllStyles).forEach(style => {
        AllStyles[style] = templateUtils.processForTemplate(originAllStyles[style], widgetId, messages);
    });
}
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.markPopper = null;
        this.getIsScrollAndWidthOfTemplateCon = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const templateConHeight = ((_b = (_a = this.templatesContainer) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.clientHeight) || 0;
            const templateConWidth = ((_d = (_c = this.templatesContainer) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.clientWidth) || 260;
            const templateConParentHeight = ((_h = (_g = (_f = (_e = this.templatesContainer) === null || _e === void 0 ? void 0 : _e.current) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.clientHeight) || 0;
            const isStartButtonAbsolute = templateConParentHeight < templateConHeight;
            this.setState({
                isTemplateContainScroll: isStartButtonAbsolute,
                templateConWidth: templateConWidth
            });
        };
        this.onPropertyChange = (name, value) => {
            const { config } = this.props;
            if (value === config[name]) {
                return;
            }
            const newConfig = config.set(name, value);
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
        };
        this.onMultiplePropertyChange = (changeArr) => {
            const { config } = this.props;
            let newConfig = config;
            changeArr.forEach(item => {
                if (item.value === config[item.name])
                    return;
                newConfig = newConfig.set(item.name, item.value);
            });
            const alterProps = {
                id: this.props.id,
                config: newConfig
            };
            this.props.onSettingChange(alterProps);
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
        this.onTemplateTypeChanged = (style, updatedAppConfig = undefined) => {
            const { id } = this.props;
            let { appConfig } = this.props;
            if (updatedAppConfig) {
                appConfig = updatedAppConfig;
            }
            if (style === TemplateType.Custom1 || style === TemplateType.Custom2) {
                const styleTemplate = AllStyles[style];
                templateUtils.updateWidgetByTemplate(appConfig, styleTemplate, id, styleTemplate.widgetId, {}, defaultMessages).then(newAppConfig => {
                    this._onItemStyleChange(newAppConfig, style);
                });
            }
            else {
                this._onItemStyleChange(appConfig, style);
            }
        };
        this.handleFormChange = (evt) => {
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
        this.handleCheckboxChange = (evt) => {
            const target = evt.currentTarget;
            if (!target)
                return;
            this.onPropertyChange(target.dataset.field, target.checked);
        };
        this.handleAutoInterval = (valueInt) => {
            this.onPropertyChange('autoInterval', valueInt);
        };
        this.onSwitchChanged = (checked, name) => {
            this.onPropertyChange(name, checked);
        };
        this._onItemStyleChange = (newAppConfig, style) => {
            const { id, config: oldConfig, layoutInfo } = this.props;
            const { tempLayoutType } = this.state;
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            const tempWidgetSize = {
                CARD: { width: 516, height: 210 },
                LIST: { width: 300, height: 360 },
                SLIDE1: { width: 320, height: 380 },
                SLIDE2: { width: 320, height: 380 },
                SLIDE3: { width: 320, height: 380 },
                GALLERY: { width: 680, height: 230 },
                CUSTOM1: { width: 320, height: 380 },
                CUSTOM2: { width: 320, height: 380 }
            };
            let config = Immutable(defaultConfig);
            const wJson = newAppConfig.widgets[id];
            let newBookmarks;
            let nextAppConfig = newAppConfig;
            if (customType.includes(style)) {
                let newOriginLayoutId = newAppConfig.widgets[id].layouts[Status.Regular][newAppConfig.mainSizeMode];
                newBookmarks = oldConfig.bookmarks.map(item => {
                    const { newLayoutId, eachAppConfig } = this.duplicateLayoutsEach(newOriginLayoutId, id, `Bookmark-${item.id}`, `Bookmark-${item.id}-label`, tempLayoutType, nextAppConfig);
                    nextAppConfig = eachAppConfig;
                    newOriginLayoutId = newLayoutId;
                    item = item.set('layoutName', `Bookmark-${item.id}`).set('layoutId', newLayoutId);
                    return item;
                });
            }
            if (customType.includes(oldConfig.templateType) && !customType.includes(style)) {
                newBookmarks = newAppConfig.widgets[id].config.bookmarks;
            }
            config = config.set('templateType', style).set('bookmarks', newBookmarks || oldConfig.bookmarks).set('isTemplateConfirm', false);
            config = config.set('isInitialed', true);
            const appConfigAction = getAppConfigAction(nextAppConfig);
            const layoutType = this.getLayoutType();
            if (layoutType === LayoutType.FixedLayout) {
                appConfigAction.editLayoutItemSize(layoutInfo, tempWidgetSize[style].width, tempWidgetSize[style].height);
            }
            appConfigAction.editWidgetProperty(wJson.id, 'config', config).exec();
        };
        this.getLayoutType = () => {
            var _a, _b;
            const { layoutInfo, appConfig } = this.props;
            const layoutId = layoutInfo.layoutId;
            const layoutType = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.type;
            return layoutType;
        };
        this.duplicateLayoutsEach = (originLayoutId, widgetId, layoutName, layoutLabel, layoutType, newAppConfig) => {
            let { appConfig } = this.props;
            if (newAppConfig)
                appConfig = newAppConfig;
            const appConfigAction = getAppConfigAction(appConfig);
            const newLayoutId = appConfigAction.createEmptyLayoutForWidgetOnCurrentSizeMode(widgetId, layoutName, layoutLabel, layoutType);
            appConfigAction.duplicateLayoutItems(originLayoutId, newLayoutId, true);
            return { newLayoutId, eachAppConfig: appConfigAction.appConfig };
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreMessages, jimuLayoutsDefaultMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.handleTemplateTypeImageClick = evt => {
            const style = evt.currentTarget.dataset.value;
            const { id, config, appConfig } = this.props;
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            if (config.templateType === style)
                return;
            if (customType.includes(config.templateType)) { // origin type is advanced
                let nextAppConfig = appConfig;
                const newBookmarks = config.bookmarks.map(item => {
                    const { layoutName } = item;
                    const appConfigAction = getAppConfigAction(nextAppConfig);
                    const newAction = appConfigAction.removeLayoutFromWidget(id, layoutName);
                    nextAppConfig = newAction.appConfig;
                    return item.set('layoutId', '').set('layoutName', '');
                });
                const newConfig = config.set('bookmarks', newBookmarks).set('templateType', style);
                const appConfigAction = getAppConfigAction(nextAppConfig);
                appConfigAction.removeLayoutFromWidget(id, 'REGULAR');
                appConfigAction.editWidgetProperty(id, 'config', newConfig).exec();
                this.onTemplateTypeChanged(style, appConfigAction.appConfig);
            }
            else { // origin type is simple
                this.onTemplateTypeChanged(style);
            }
        };
        this.handleTemplateConfirmClick = evt => {
            this.onPropertyChange('isTemplateConfirm', true);
        };
        this.handleResetTemplateClick = () => {
            const { config } = this.props;
            if (config.templateType === TemplateType.Custom1 || config.templateType === TemplateType.Custom2) {
                this.setState({ changeCustomConfirmOpen: true });
            }
            else {
                this.onPropertyChange('isTemplateConfirm', false);
            }
            this.updateNextButtonPosition();
        };
        this.handleChangeOk = () => {
            this.onPropertyChange('isTemplateConfirm', false);
            this.updateNextButtonPosition();
            this.setState({ changeCustomConfirmOpen: false });
        };
        this.handleChangeClose = () => {
            this.setState({ changeCustomConfirmOpen: false });
        };
        this.handleMapChangeOk = () => {
            var _a;
            this.onPropertyChange('bookmarks', []);
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: this.toBeChnagedMapWidgetIds
            });
            this.setState({ confirmMapChangeOpen: false });
            (_a = this.markPopper) === null || _a === void 0 ? void 0 : _a.handleCloseOk();
        };
        this.handleMapChangeClose = () => {
            const { useMapWidgetIds } = this.props;
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: []
            });
            this.setState({ confirmMapChangeOpen: false }, () => {
                this.props.onSettingChange({
                    id: this.props.id,
                    useMapWidgetIds: useMapWidgetIds.asMutable()
                });
            });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.toBeChnagedMapWidgetIds = useMapWidgetIds;
            const { useMapWidgetIds: originMapWidgetIds } = this.props;
            if (!originMapWidgetIds || (originMapWidgetIds && originMapWidgetIds.length === 0)) {
                this.handleMapChangeOk();
                return;
            }
            // eslint-disable-next-line
            if (originMapWidgetIds && originMapWidgetIds[0] === useMapWidgetIds[0]) {
            }
            else {
                this.setState({ confirmMapChangeOpen: true });
                // if(!config.runtimeUuid) {
                //   const runtimeUuid = utils.getLocalStorageAppKey();
                //   this.onMultiplePropertyChange([{name: 'runtimeUuid', value: runtimeUuid}, {name: 'bookmarks', value: []}]);
                // } else {
                //   this.onPropertyChange('bookmarks', []);
                // }
                // this.props.onSettingChange({
                //   id: this.props.id,
                //   useMapWidgetIds: useMapWidgetIds
                // });
            }
        };
        this.showBookmarkConfiger = (ref) => {
            this.markPopper = ref;
        };
        this.onBookmarkUpdated = (updateBookmark) => {
            const { config } = this.props;
            const oriBookmarks = config.bookmarks;
            const fixIndex = oriBookmarks.findIndex(x => x.id === updateBookmark.id);
            const newBookmark = oriBookmarks.map((item, index) => {
                if (fixIndex === index) {
                    return updateBookmark;
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.addNewBookmark = (bookmark) => {
            const { config } = this.props;
            this.setState({ activeId: bookmark.id });
            this.onPropertyChange('bookmarks', config.bookmarks.concat(bookmark));
        };
        this.onBookmarkNameChange = (id, newText) => {
            const { bookmarkLabel } = this.state;
            const newBookmarkLabel = {};
            for (const bmId in bookmarkLabel) {
                newBookmarkLabel[bmId] = bookmarkLabel[bmId];
                if ((id === null || id === void 0 ? void 0 : id.toString()) === (bmId === null || bmId === void 0 ? void 0 : bmId.toString()))
                    newBookmarkLabel[bmId] = newText;
            }
            this.setState({ bookmarkLabel: newBookmarkLabel });
        };
        this.onBookmarkNameBlur = (id, newText) => {
            const { bookmarkLabel: newBookmarkLabel } = this.state;
            const { config } = this.props;
            const oriBookmarks = config.bookmarks;
            const fixIndex = oriBookmarks.findIndex(x => x.id === id);
            let value = newText === null || newText === void 0 ? void 0 : newText.trim();
            value = value === '' ? config.bookmarks[fixIndex].name : value;
            if (value !== newBookmarkLabel[id]) {
                newBookmarkLabel[id] = value;
                this.setState({ bookmarkLabel: newBookmarkLabel });
            }
            const newBookmark = oriBookmarks.map((item, index) => {
                if (fixIndex === index) {
                    return item.set('name', value);
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.onBookmarkTextChange = (id, newText, key) => {
            const { config } = this.props;
            const oriBookmarks = config.bookmarks;
            const fixIndex = oriBookmarks.findIndex(x => x.id === id);
            const newBookmark = oriBookmarks.map((item, index) => {
                if (fixIndex === index) {
                    return item.set(key, newText);
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.handleKeydown = (e, ref) => {
            if (e.key === 'Enter') {
                ref.current.blur();
            }
        };
        this.handleSelect = (id, bookmark) => {
            const { activeId } = this.state;
            const dialogStatus = this.markPopper.getDialogStatus();
            if (!dialogStatus && activeId === id) {
                this.setState({ activeId: 0 });
                return;
            }
            this.setState({ activeId: id });
            this.markPopper.handleEditWhenOpen(bookmark);
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'activeBookmarkId', value: id });
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'settingChangeBookmark', value: true });
        };
        this.handleEditBookmark = (bookmark, evt) => {
            if (evt)
                evt.stopPropagation();
            this.setState({ activeId: bookmark.id });
            this.markPopper.handleNewOrEdit(bookmark, true);
        };
        this.handleDelete = (bookmark, evt) => {
            if (evt)
                evt.stopPropagation();
            const { id } = bookmark;
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            const { activeId } = this.state;
            const { id: widgetId, appConfig } = this.props;
            let { config } = this.props;
            const oriBookmarks = config.bookmarks;
            const index = oriBookmarks.findIndex(x => x.id === id);
            if (index === -1)
                return;
            const newBookmark = oriBookmarks.asMutable({ deep: true });
            const dialogStatus = this.markPopper.getDialogStatus();
            let newEditActiveBookmark;
            if (activeId === newBookmark[index].id) {
                if (index !== 0) {
                    newEditActiveBookmark = newBookmark[index - 1];
                }
                else { // delete the first one
                    if (newBookmark.length > 1) {
                        newEditActiveBookmark = newBookmark[index + 1];
                    }
                    else { // delete the only one
                        this.markPopper.handleClickClose(true);
                        newEditActiveBookmark = undefined;
                        builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'lastFlag', value: true });
                    }
                }
                newEditActiveBookmark && dialogStatus && this.handleEditBookmark(Immutable(newEditActiveBookmark));
            }
            if (customType.includes(config.templateType)) {
                // delete bookmark layouts and bookmark
                const { layoutName } = newBookmark[index];
                const appConfigAction = getAppConfigAction(appConfig);
                appConfigAction.removeLayoutFromWidget(widgetId, layoutName);
                newBookmark.splice(index, 1);
                if (activeId === 0 && newBookmark.length >= 1) {
                    newEditActiveBookmark = newBookmark[0];
                }
                const newImmutableArray = Immutable(newBookmark);
                config = config.set('bookmarks', newImmutableArray);
                appConfigAction.editWidgetProperty(widgetId, 'config', config).exec();
            }
            else {
                // only delete bookmark
                newBookmark.splice(index, 1);
                if (activeId === 0 && newBookmark.length >= 1) {
                    newEditActiveBookmark = newBookmark[0];
                }
                const newImmutableArray = Immutable(newBookmark);
                this.onPropertyChange('bookmarks', newImmutableArray);
            }
            const newActiveId = (newEditActiveBookmark && newEditActiveBookmark.id) || activeId;
            this.setState({
                activeId: newActiveId
            });
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'activeBookmarkId', value: newActiveId });
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'settingChangeBookmark', value: true });
        };
        this.onTabSelect = (imgSourceType) => {
            const { activeId } = this.state;
            const { config } = this.props;
            const oriBookmark = config.bookmarks;
            const fixIndex = oriBookmark.findIndex(x => x.id === activeId);
            const newBookmark = oriBookmark.map((item, index) => {
                if (fixIndex === index) {
                    return item.set('imgSourceType', ImgSourceType[imgSourceType]);
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.onResourceChange = (imageParam) => {
            const { activeId } = this.state;
            const { config } = this.props;
            const oriBookmark = config.bookmarks;
            const fixIndex = oriBookmark.findIndex(x => x.id === activeId);
            const newBookmark = oriBookmark.map((item, index) => {
                if (fixIndex === index) {
                    return item.set('imgParam', imageParam);
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.handleImageFillModeChange = (evt) => {
            var _a;
            const { activeId } = this.state;
            const { config } = this.props;
            const mode = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            const oriBookmark = config.bookmarks;
            const fixIndex = oriBookmark.findIndex(x => x.id === activeId);
            const newBookmark = oriBookmark.map((item, index) => {
                if (fixIndex === index) {
                    return item.set('imagePosition', mode);
                }
                return item;
            });
            this.onPropertyChange('bookmarks', newBookmark);
        };
        this.handleShowSimpleClick = () => {
            const { showSimple } = this.state;
            this.setState({ showSimple: !showSimple });
        };
        this.handleShowAdvanceClick = () => {
            const { showAdvance } = this.state;
            this.setState({ showAdvance: !showAdvance });
        };
        this.handleShowArrangementClick = () => {
            const { showArrangement } = this.state;
            this.setState({ showArrangement: !showArrangement });
        };
        this.handlePageStyleChange = (evt) => {
            var _a;
            const value = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            this.onPropertyChange('pageStyle', value);
        };
        this.handleDisplayTypeChange = (evt) => {
            var _a;
            const value = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            this.onPropertyChange('displayType', value);
        };
        this.onTransitionTypeChange = (type) => {
            this.onPropertyChange('transition', type);
        };
        this.onTransitionDirectionChange = (dir) => {
            this.onPropertyChange('transitionDirection', dir);
        };
        this.getPageStyleOptions = () => {
            return [
                jsx("option", { key: PageStyle.Scroll, value: PageStyle.Scroll }, this.formatMessage('scroll')),
                jsx("option", { key: PageStyle.Paging, value: PageStyle.Paging }, this.formatMessage('paging'))
            ];
        };
        this.handleDirectionClick = (evt) => {
            const direction = evt.currentTarget.dataset.value;
            this.onPropertyChange('direction', direction);
        };
        this.handleSpaceChange = (valueFloat) => {
            this.onPropertyChange('space', valueFloat);
        };
        this.handleItemSizeChange = (value, isVertical) => {
            isVertical ? this.onPropertyChange('itemHeight', value) : this.onPropertyChange('itemWidth', value);
        };
        this.duplicateNewLayouts = (originLayoutId, widgetId, layoutName, layoutLabel, layoutType, newAppConfig) => {
            let { appConfig } = this.props;
            if (newAppConfig)
                appConfig = newAppConfig;
            const appConfigAction = getAppConfigAction(appConfig);
            const newLayoutId = appConfigAction.createEmptyLayoutForWidgetOnCurrentSizeMode(widgetId, layoutName, layoutLabel, layoutType);
            appConfigAction.duplicateLayoutItems(originLayoutId, newLayoutId, true);
            appConfigAction.exec();
            return newLayoutId;
        };
        this.updateNextButtonPosition = () => {
            clearTimeout(this.updatePositionTimeout);
            this.updatePositionTimeout = setTimeout(() => {
                this.getIsScrollAndWidthOfTemplateCon();
            }, 500);
        };
        this.renderTemplate = () => {
            const { config, theme } = this.props;
            const { showSimple, showAdvance, isTemplateContainScroll, templateConWidth } = this.state;
            const nextBtnClass = isTemplateContainScroll
                ? 'position-absolute position-absolute-con'
                : 'position-relative-con';
            const simpleTemplateTip = (jsx("div", { className: 'w-100 d-flex' },
                jsx("div", { className: 'text-truncate p-1' }, this.formatMessage('simple')),
                jsx(Tooltip, { title: this.formatMessage('simpleTemplateTip'), showArrow: true, placement: 'left' },
                    jsx("span", { className: 'mt-1 ml-2' },
                        jsx(InfoOutlined, null)))));
            const advancedTemplateTip = (jsx("div", { className: 'w-100 d-flex' },
                jsx("div", { className: 'text-truncate p-1' }, this.formatMessage('advance')),
                jsx(Tooltip, { title: this.formatMessage('advancedTemplateTip'), showArrow: true, placement: 'left' },
                    jsx("span", { className: 'mt-1 ml-2' },
                        jsx(InfoOutlined, null)))));
            return (jsx("div", { ref: this.templatesContainer },
                jsx(SettingSection, { title: this.formatMessage('chooseTemplateTip') },
                    jsx(SettingCollapse, { label: simpleTemplateTip, isOpen: showSimple, onRequestOpen: this.handleShowSimpleClick, onRequestClose: this.handleShowSimpleClick, role: 'group', "aria-label": this.formatMessage('simple') },
                        jsx("div", { className: 'template-group w-100 mt-1' },
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": TemplateType.Card, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('typeCard') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Card && 'active'}`, icon: require('./assets/tradition_card.svg') })),
                                jsx(Button, { "data-value": TemplateType.List, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('typeList') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.List && 'active'}`, icon: require('./assets/tradition_list.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": TemplateType.Gallery, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('typeGallery') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-gallery ${config.templateType === TemplateType.Gallery && 'active'}`, icon: require('./assets/presentation_gallery_h.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": TemplateType.Slide1, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('slideOne') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Slide1 && 'active'}`, icon: require('./assets/presentation_slide1.svg') })),
                                jsx(Button, { "data-value": TemplateType.Slide2, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('slideTwo') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Slide2 && 'active'}`, icon: require('./assets/presentation_slide2.svg') }))),
                            jsx("div", { className: 'vertical-space' }),
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": TemplateType.Slide3, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('slideThree') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Slide3 && 'active'}`, icon: require('./assets/presentation_slide3.svg') }))))),
                    jsx(SettingCollapse, { label: advancedTemplateTip, isOpen: showAdvance, onRequestOpen: this.handleShowAdvanceClick, onRequestClose: this.handleShowAdvanceClick, role: 'group', "aria-label": this.formatMessage('advance'), className: 'mt-2 mb-2' },
                        jsx("div", { className: 'template-group w-100 mt-1' },
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx(Button, { "data-value": TemplateType.Custom1, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('customOne') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Custom1 && 'active'}`, icon: require('./assets/custom_template1.svg') })),
                                jsx(Button, { "data-value": TemplateType.Custom2, onClick: this.handleTemplateTypeImageClick, type: 'tertiary', title: this.formatMessage('customTwo') },
                                    jsx(Icon, { autoFlip: true, className: `template-img template-img-h ${config.templateType === TemplateType.Custom2 && 'active'}`, icon: require('./assets/custom_template2.svg') }))),
                            jsx("div", { className: "vertical-space" }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'next-con w-100', css: getNextButtonStyle(theme, templateConWidth) },
                            jsx("div", { className: nextBtnClass },
                                jsx(Button, { type: 'primary', className: 'w-100', onClick: this.handleTemplateConfirmClick }, this.formatMessage('start'))))))));
        };
        this.onTransitionSettingChange = (transition) => {
            const transitionInfo = this.props.config.transitionInfo.asMutable({ deep: true });
            transitionInfo.transition = transition;
            this.onConfigChange(['transitionInfo'], Immutable(transitionInfo));
        };
        this.previewTransitionAndOnebyOne = () => {
            this.onConfigChange(['transitionInfo', 'previewId'], getNextAnimationId());
        };
        this.renderArrangementSetting = () => {
            const { config } = this.props;
            const { transitionInfo } = config;
            const { showArrangement } = this.state;
            const isVertical = config.direction === DirectionType.Vertical;
            return (jsx(SettingRow, null,
                jsx(SettingCollapse, { label: this.formatMessage('arrangement'), isOpen: showArrangement, onRequestOpen: this.handleShowArrangementClick, onRequestClose: this.handleShowArrangementClick, role: 'group', "aria-label": this.formatMessage('arrangement') },
                    jsx(SettingRow, { className: 'mt-2', label: this.formatMessage('pagingStyle'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('pagingStyle') },
                        jsx(Select, { value: config.pageStyle, onChange: this.handlePageStyleChange, size: 'sm' }, this.getPageStyleOptions())),
                    config.pageStyle !== PageStyle.Scroll &&
                        jsx(Fragment, null,
                            jsx(SettingRow, null,
                                jsx("div", { className: 'd-flex w-100' },
                                    jsx(Checkbox, { "data-field": 'initBookmark', onClick: this.handleCheckboxChange, checked: config.initBookmark }),
                                    jsx("div", { className: 'text-truncate ml-2', title: this.formatMessage('initBookmark') }, this.formatMessage('initBookmark')),
                                    jsx(Tooltip, { title: this.formatMessage('initBookmarkTips'), showArrow: true, placement: 'left' },
                                        jsx("span", { className: 'inline-block ml-2 tips-pos' },
                                            jsx(InfoOutlined, null))))),
                            jsx(SettingRow, null,
                                jsx("div", { className: 'd-flex justify-content-between w-100' },
                                    jsx("label", { className: 'w-75 text-truncate d-inline-block font-dark-600' }, this.formatMessage('playEnable')),
                                    jsx(Switch, { className: 'can-x-switch', checked: (config && config.autoPlayAllow) || false, "data-key": 'autoRefresh', onChange: evt => { this.onSwitchChanged(evt.target.checked, 'autoPlayAllow'); } }))),
                            config.autoPlayAllow &&
                                jsx(Fragment, null,
                                    jsx(SettingRow, { flow: 'wrap', label: `${this.formatMessage('autoInterval')} (${this.formatMessage('second')})`, role: 'group', "aria-label": `${this.formatMessage('autoInterval')} (${this.formatMessage('second')})` },
                                        jsx(NumericInput, { style: { width: '100%' }, value: config.autoInterval || 3, min: 2, max: 60, onChange: this.handleAutoInterval })),
                                    jsx(SettingRow, null,
                                        jsx("div", { className: 'd-flex w-100' },
                                            jsx(Checkbox, { "data-field": 'autoLoopAllow', onClick: this.handleCheckboxChange, checked: config.autoLoopAllow }),
                                            jsx("div", { className: 'text-truncate ml-2' }, this.formatMessage('autoLoopAllow')))))),
                    config.pageStyle !== PageStyle.Paging &&
                        jsx(SettingRow, { label: this.formatMessage('direction'), role: 'group', "aria-label": this.formatMessage('direction') },
                            jsx(ButtonGroup, { size: 'sm' }, directions.map((data, i) => {
                                return (jsx(Button, { key: i, icon: true, active: config.direction === data.value, "data-value": data.value, onClick: this.handleDirectionClick }, data.icon === 'right' ? jsx(ArrowRightOutlined, { size: 's' }) : jsx(ArrowDownOutlined, { size: 's' })));
                            }))),
                    config.pageStyle === PageStyle.Paging &&
                        jsx(SettingRow, { label: this.formatMessage('transition'), flow: 'wrap', role: 'group', "aria-label": this.formatMessage('transition') },
                            jsx(TransitionSetting, { transition: transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition, onTransitionChange: this.onTransitionSettingChange, onPreviewAsAWhoneClicked: this.previewTransitionAndOnebyOne, formatMessage: this.formatMessage, showOneByOne: false })),
                    config.pageStyle === PageStyle.Scroll &&
                        jsx(Fragment, null,
                            jsx(SettingRow, { flow: 'wrap', role: 'group', label: `${isVertical ? this.formatMessage('itemHeight') : this.formatMessage('itemWidth')}(px)`, "aria-label": `${isVertical ? this.formatMessage('itemHeight') : this.formatMessage('itemWidth')}(px)` },
                                jsx(NumericInput, { style: { width: '100%' }, value: (isVertical ? config.itemHeight : config.itemWidth) || 240, onChange: (value) => this.handleItemSizeChange(value, isVertical) })),
                            jsx(SettingRow, { flow: 'wrap', role: 'group', label: (isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)', "aria-label": (isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)' },
                                jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                    jsx(Slider, { style: { width: '60%' }, "data-field": 'space', onChange: this.handleFormChange, value: config.space, title: '0-50', size: 'sm', min: 0, max: 50 }),
                                    jsx(NumericInput, { style: { width: '25%' }, value: config.space, min: 0, max: 50, title: '0-50', onChange: this.handleSpaceChange })))))));
        };
        this.renderDataSetting = () => {
            var _a;
            const { id, theme, useDataSources, useMapWidgetIds, config } = this.props;
            const { activeId, tempLayoutType, bookmarkLabel } = this.state;
            const activeBookmark = config.bookmarks.find(x => x.id === activeId);
            const activeImgName = (_a = activeBookmark === null || activeBookmark === void 0 ? void 0 : activeBookmark.imgParam) === null || _a === void 0 ? void 0 : _a.originalName;
            const activeName = (activeBookmark && activeBookmark.name) ? activeBookmark.name : '---';
            const slideType = [TemplateType.Slide1, TemplateType.Slide2, TemplateType.Slide3];
            const runtimeType = [TemplateType.Slide1, TemplateType.Slide2, TemplateType.Slide3, TemplateType.Custom1, TemplateType.Custom2];
            const noImgType = [TemplateType.List, TemplateType.Custom1, TemplateType.Custom2];
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            return (jsx("div", { className: 'bookmark-setting' },
                jsx(SettingSection, null,
                    jsx(SettingRow, { flow: 'wrap' },
                        jsx("div", { className: 'w-100 overflow-hidden' },
                            jsx(Button, { type: 'tertiary', className: 'resetting-template jimu-outline-inside', onClick: this.handleResetTemplateClick, title: this.formatMessage('resettingTheTemplate') }, this.formatMessage('resettingTheTemplate')),
                            customType.includes(config.templateType) &&
                                jsx(Fragment, null,
                                    this.formatMessage('customBookmarkDesign'),
                                    jsx(Tooltip, { title: this.formatMessage('customTips'), showArrow: true, placement: 'left' },
                                        jsx("span", { className: 'inline-block ml-2' },
                                            jsx(InfoOutlined, null)))))),
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('selectMapWidget'), "aria-label": this.formatMessage('selectMapWidget'), role: 'group' },
                        jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: useMapWidgetIds })),
                    this.props.useMapWidgetIds && this.props.useMapWidgetIds.length === 1 &&
                        jsx(SettingRow, null,
                            jsx(MarkPopper, { id: id, theme: theme, title: `${this.formatMessage('setBookmarkView')}: ${activeName}`, buttonLabel: this.formatMessage('addBookmark'), useDataSources: useDataSources, useMapWidgetIds: useMapWidgetIds, jimuMapConfig: config, onBookmarkUpdated: this.onBookmarkUpdated, onShowBookmarkConfiger: (ref) => this.showBookmarkConfiger(ref), maxBookmarkId: this.getArrayMaxId(config.bookmarks), activeBookmarkId: activeId, onAddNewBookmark: this.addNewBookmark, formatMessage: this.formatMessage, duplicateNewLayouts: this.duplicateNewLayouts, tempLayoutType: tempLayoutType, isUseWidgetSize: true })),
                    config.bookmarks && config.bookmarks.length !== 0 &&
                        jsx(SettingRow, null,
                            jsx("div", { className: 'w-100' }, config.bookmarks.map((item, index) => {
                                const titleTextInput = React.createRef();
                                return (jsx(Fragment, { key: index },
                                    jsx("div", { className: `${activeId === item.id ? 'active-mark' : ''} setting-bookmark-list`, onClick: () => this.handleSelect(item.id, item) },
                                        jsx(TextInput, { className: 'header-title-input h5 bookmark-edit-input', ref: titleTextInput, title: bookmarkLabel[item.id] || item.name, defaultValue: bookmarkLabel[item.id] || item.name, onChange: evt => this.onBookmarkNameChange(item.id, evt.target.value), onBlur: evt => this.onBookmarkNameBlur(item.id, evt.target.value), onClick: evt => evt.stopPropagation(), onKeyDown: (e) => this.handleKeydown(e, titleTextInput) }),
                                        jsx("span", { className: 'float-right bookmark-edit-btn' },
                                            jsx(Button, { title: this.formatMessage('changeBookmarkView'), onClick: (evt) => this.handleEditBookmark(item, evt), type: 'tertiary', icon: true },
                                                jsx(WidgetMapOutlined, { size: 's' })),
                                            jsx(Button, { title: this.formatMessage('deleteOption'), onClick: (evt) => this.handleDelete(item, evt), type: 'tertiary', icon: true },
                                                jsx(CloseOutlined, { size: 's' })))),
                                    ((!noImgType.includes(config.templateType)) && activeId === item.id) &&
                                        jsx("div", { className: 'active-mark-content' },
                                            jsx(SettingRow, { label: this.formatMessage('imageSource'), className: 'mb-2', "aria-label": this.formatMessage('imageSource'), role: 'group' }),
                                            jsx(Tabs, { fill: true, type: 'pills', onChange: this.onTabSelect, value: item.imgSourceType === ImgSourceType.Custom ? 'Custom' : 'Snapshot' },
                                                jsx(Tab, { id: 'Snapshot', title: this.formatMessage('imageSnapshot') },
                                                    jsx("div", { className: 'mt-2' })),
                                                jsx(Tab, { id: 'Custom', title: this.formatMessage('custom') },
                                                    jsx("div", { className: 'mt-2' },
                                                        jsx(SettingRow, null,
                                                            jsx("div", { className: 'w-100 d-flex align-items-center mb-1 mt-1' },
                                                                jsx("div", { style: { minWidth: '60px' } },
                                                                    jsx(ImageSelector, { buttonClassName: 'text-dark d-flex justify-content-center btn-browse', widgetId: this.props.id, buttonLabel: this.formatMessage('setAnImage'), buttonSize: 'sm', onChange: this.onResourceChange, imageParam: item.imgParam })),
                                                                jsx("div", { style: { width: '70px' }, className: 'uploadFileName ml-2 text-truncate', title: activeImgName || this.formatMessage('none') }, activeImgName || this.formatMessage('none'))))))),
                                            jsx(SettingRow, { label: this.formatMessage('imagePosition'), className: 'mt-2', truncateLabel: true, "aria-label": this.formatMessage('imagePosition'), role: 'group' },
                                                jsx("div", { style: { width: '40%' } },
                                                    jsx(Select, { size: 'sm', value: item.imagePosition, onChange: this.handleImageFillModeChange },
                                                        jsx("option", { key: 0, value: ImageFillMode.Fill }, this.formatMessage('fill')),
                                                        jsx("option", { key: 1, value: ImageFillMode.Fit }, this.formatMessage('fit'))))),
                                            (slideType.includes(config.templateType)) &&
                                                jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('description'), className: 'mb-2', role: 'group', "aria-label": this.formatMessage('description') },
                                                    jsx(TextArea, { className: 'w-100', title: item.description, value: item.description || '', onChange: evt => this.onBookmarkTextChange(item.id, evt.target.value, 'description'), spellCheck: false })))));
                            })))),
                jsx(SettingSection, null,
                    jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('drawingDisplay'), "aria-label": this.formatMessage('drawingDisplay'), role: 'group' },
                        jsx(Select, { value: config.displayType, onChange: this.handleDisplayTypeChange, size: 'sm' },
                            jsx("option", { key: 'all', value: DisplayType.All, title: this.formatMessage('displayAll') },
                                jsx("div", { className: 'text-truncate' }, this.formatMessage('displayAll'))),
                            jsx("option", { key: 'selected', value: DisplayType.Selected, title: this.formatMessage('displaySelected') },
                                jsx("div", { className: 'text-truncate' }, this.formatMessage('displaySelected'))))),
                    config.templateType === TemplateType.Gallery &&
                        jsx(Fragment, null,
                            jsx(SettingRow, { label: this.formatMessage('galleryDirection'), role: 'group', "aria-label": this.formatMessage('galleryDirection') },
                                jsx(ButtonGroup, { size: 'sm' }, directions.map((data, i) => {
                                    return (jsx(Button, { key: i, icon: true, active: config.direction === data.value, "data-value": data.value, onClick: this.handleDirectionClick }, data.icon === 'right' ? jsx(ArrowRightOutlined, { autoFlip: true, size: 's' }) : jsx(ArrowDownOutlined, { autoFlip: true, size: 's' })));
                                })))),
                    (!runtimeType.includes(config.templateType)) &&
                        jsx(SettingRow, null,
                            jsx("div", { className: 'd-flex w-100' },
                                jsx(Checkbox, { "data-field": 'runtimeAddAllow', onClick: this.handleCheckboxChange, checked: config.runtimeAddAllow }),
                                jsx("div", { className: 'text-truncate ml-2', title: this.formatMessage('runtimeAddAllow') }, this.formatMessage('runtimeAddAllow')))),
                    (!customType.includes(config.templateType)) &&
                        jsx(SettingRow, null,
                            jsx("div", { className: 'd-flex w-100' },
                                jsx(Checkbox, { "data-field": 'displayFromWeb', onClick: this.handleCheckboxChange, checked: config.displayFromWeb }),
                                jsx("div", { className: 'text-truncate ml-2', title: this.formatMessage('displayFromWeb') }, this.formatMessage('displayFromWeb')))),
                    (runtimeType.includes(config.templateType)) && this.renderArrangementSetting())));
        };
        initStyles(props.id);
        const initBookmarkLabel = {};
        props.config.bookmarks.forEach(item => {
            initBookmarkLabel[item.id] = item.name;
        });
        this.state = {
            activeId: 0,
            showSimple: true,
            showAdvance: true,
            showArrangement: false,
            tempLayoutType: LayoutType.FixedLayout,
            changeCustomConfirmOpen: false,
            confirmMapChangeOpen: false,
            isTemplateContainScroll: false,
            templateConWidth: 260,
            bookmarkLabel: initBookmarkLabel
        };
        this.simpleTipRef = React.createRef();
        this.customTipRef = React.createRef();
        this.templatesContainer = React.createRef();
        this.toBeChnagedMapWidgetIds = [];
    }
    componentDidMount() {
        this.getIsScrollAndWidthOfTemplateCon();
        window.addEventListener('resize', this.updateNextButtonPosition);
    }
    componentDidUpdate(prevProps) {
        var _a;
        const { activeId } = this.state;
        const { settingPanelChange, activeBookmarkId = 0 } = this.props;
        if (this.props.activeBookmarkId !== prevProps.activeBookmarkId) {
            if (activeBookmarkId !== activeId) {
                this.setState({ activeId: activeBookmarkId });
            }
        }
        if (settingPanelChange !== prevProps.settingPanelChange) {
            (_a = this.markPopper) === null || _a === void 0 ? void 0 : _a.handleCloseOk();
        }
        if (settingPanelChange === 'content' && prevProps.settingPanelChange !== 'content') {
            this.updateNextButtonPosition();
        }
    }
    componentWillUnmount() {
        clearTimeout(this.updatePositionTimeout);
    }
    getArrayMaxId(arr) {
        const numbers = arr.map(p => p.id);
        return numbers.length > 0 ? Math.max.apply(null, numbers) : 0;
    }
    render() {
        const { config, theme } = this.props;
        const { changeCustomConfirmOpen, confirmMapChangeOpen } = this.state;
        return (jsx(Fragment, null,
            jsx("div", { className: classNames(`${prefix}bookmark-setting`, `${prefix}setting`), css: getStyle(theme) }, config.isTemplateConfirm ? this.renderDataSetting() : this.renderTemplate()),
            changeCustomConfirmOpen &&
                jsx(ConfirmDialog, { level: 'warning', title: this.formatMessage('changeConfirmTitle'), hasNotShowAgainOption: false, content: this.formatMessage('changeRemind'), onConfirm: this.handleChangeOk, onClose: this.handleChangeClose }),
            confirmMapChangeOpen &&
                jsx(ConfirmDialog, { level: 'info', title: this.formatMessage('bookmarkConfirmTitle'), hasNotShowAgainOption: false, content: this.formatMessage('switchRemind'), onConfirm: this.handleMapChangeOk, onClose: this.handleMapChangeClose })));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f;
    return {
        appConfig: state && state.appStateInBuilder && state.appStateInBuilder.appConfig,
        browserSizeMode: state && state.appStateInBuilder && state.appStateInBuilder.browserSizeMode,
        activeBookmarkId: state && ((_b = (_a = state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.widgetsState[props.id]) === null || _b === void 0 ? void 0 : _b.activeBookmarkId),
        layoutInfo: state && ((_d = (_c = state.appStateInBuilder) === null || _c === void 0 ? void 0 : _c.widgetsState[props.id]) === null || _d === void 0 ? void 0 : _d.layoutInfo),
        settingPanelChange: (_f = (_e = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _e === void 0 ? void 0 : _e[props.id]) === null || _f === void 0 ? void 0 : _f.settingPanelChange
    };
};
//# sourceMappingURL=setting.js.map