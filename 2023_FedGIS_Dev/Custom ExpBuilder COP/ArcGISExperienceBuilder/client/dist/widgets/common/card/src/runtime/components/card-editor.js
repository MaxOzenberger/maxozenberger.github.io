/** @jsx jsx */
import { React, jsx, css, AppMode, LayoutItemType, appActions, Immutable, ReactRedux, AnimationContext, TransitionContainer, getNextAnimationId } from 'jimu-core';
import { styleUtils } from 'jimu-ui';
import { Status } from '../../config';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import Card from './card-base';
import { SyncOnOutlined } from 'jimu-icons/outlined/editor/sync-on';
import { SyncOffOutlined } from 'jimu-icons/outlined/editor/sync-off';
const statesPopperOffset = [0, 5];
const statesModifiers = [
    {
        name: 'flip',
        options: {
            boundary: document.body,
            fallbackPlacements: ['right-start', 'bottom-start', 'top-start', 'top-end']
        }
    }
];
const applyPopperModifiers = [
    {
        name: 'offset',
        options: {
            offset: [0, 10]
        }
    },
    {
        name: 'arrow',
        enabled: true
    }
];
export class _CardEditor extends Card {
    constructor(props) {
        super(props);
        this.lastResizeCall = null;
        this.handleCopyTo = (evt, status, selectedLayoutItem, linked) => {
            if (!selectedLayoutItem)
                return;
            const { layouts, builderSupportModules, browserSizeMode, builderStatus } = this.props;
            const action = builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            const appConfig = action.appConfig;
            const originLayoutId = searchUtils.findLayoutId(layouts[builderStatus], browserSizeMode, appConfig.mainSizeMode);
            const desLayoutId = searchUtils.findLayoutId(layouts[status], browserSizeMode, appConfig.mainSizeMode);
            if (linked) {
                const searchUtils = builderSupportModules.widgetModules.searchUtils;
                const layoutItem = searchUtils.getContainerLayoutItem(appConfig.layouts[desLayoutId], selectedLayoutItem.widgetId, LayoutItemType.Widget);
                !!layoutItem &&
                    action.removeLayoutItem({ layoutId: desLayoutId, layoutItemId: layoutItem.id }, false);
            }
            action.duplicateLayoutItem(originLayoutId, desLayoutId, selectedLayoutItem.id, false, linked);
            this.setState({
                widgetsUpdate: Symbol()
            });
            action.exec();
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
        };
        this.editStatus = (name, value) => {
            const { dispatch, widgetId } = this.props;
            dispatch(appActions.widgetStatePropChange(widgetId, name, value));
        };
        this.toggleStatus = (status) => {
            var _a;
            const { cardConfigs } = this.props;
            const isHoverEnable = (_a = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.HOVER) === null || _a === void 0 ? void 0 : _a.enable;
            const isHover = status === Status.Hover;
            let { previousIndex, currentIndex, hoverPlayId, regularPlayId } = this.state;
            if (isHoverEnable) {
                previousIndex = isHover ? 0 : 1;
                currentIndex = isHover ? 1 : 0;
                hoverPlayId = isHover ? getNextAnimationId() : null;
                regularPlayId = isHover ? null : getNextAnimationId();
            }
            this.setState({
                previousIndex: previousIndex,
                currentIndex: currentIndex,
                hoverPlayId: hoverPlayId,
                regularPlayId: regularPlayId
            });
        };
        this.handleBreakLink = evt => {
            const { layouts, builderSupportModules, browserSizeMode, selection, builderStatus, dispatch } = this.props;
            const action = builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            const appConfig = action.appConfig;
            const selectedLayoutItem = searchUtils.findLayoutItem(appConfig, selection);
            if (!selectedLayoutItem)
                return;
            const currentLayoutId = searchUtils.findLayoutId(layouts[builderStatus], browserSizeMode, appConfig.mainSizeMode);
            action.duplicateLayoutItem(currentLayoutId, currentLayoutId, selectedLayoutItem.id, true);
            action.removeLayoutItem({ layoutId: currentLayoutId, layoutItemId: selectedLayoutItem.id }, false);
            action.exec();
            if (selection.layoutId === currentLayoutId &&
                selection.layoutItemId === selectedLayoutItem.id) {
                dispatch(appActions.selectionChanged(null));
            }
            const content = action.appConfig.layouts[currentLayoutId].content;
            const newItemKey = Object.keys(content)[Object.keys(content).length - 1];
            if (newItemKey) {
                const newItem = content[newItemKey];
                dispatch(appActions.selectionChanged({
                    layoutId: currentLayoutId,
                    layoutItemId: newItem.id
                }));
            }
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
        };
        this.getCopyDropdownItems = (showBreak) => {
            const { cardConfigs, layouts, browserSizeMode, selection, builderStatus, builderSupportModules } = this.props;
            const action = builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            const appConfig = action.appConfig;
            const selectedLayoutItem = searchUtils.findLayoutItem(appConfig, selection);
            if (!selection || !selectedLayoutItem || !window.jimuConfig.isInBuilder) {
                return {
                    items: Immutable([]),
                    title: ''
                };
            }
            const items = [];
            let title = '';
            let linkedToRegular = true;
            let linkedToHover = true;
            const isWidgetInLayout = (layoutId, widgetId) => {
                const searchUtils = builderSupportModules.widgetModules.searchUtils;
                const widgets = searchUtils.getContentsInLayoutWithRecrusiveLayouts(appConfig, layoutId, LayoutItemType.Widget, browserSizeMode);
                return widgets.indexOf(widgetId) > -1;
            };
            const syncToHover = () => {
                if (cardConfigs[Status.Hover]) {
                    const layoutId = searchUtils.findLayoutId(layouts[Status.Hover], browserSizeMode, appConfig.mainSizeMode);
                    if (!isWidgetInLayout(layoutId, appConfig.layouts[selection.layoutId].content[selection.layoutItemId].widgetId)) {
                        linkedToHover = false;
                    }
                    items.push({
                        label: this.formatMessage('applyTo', {
                            status: this.formatMessage('hover').toLocaleLowerCase()
                        }),
                        event: evt => {
                            this.handleCopyTo(evt, Status.Hover, selectedLayoutItem, linkedToHover);
                        }
                    });
                }
            };
            const syncToRegular = () => {
                const layoutId = searchUtils.findLayoutId(layouts[Status.Regular], browserSizeMode, appConfig.mainSizeMode);
                if (!isWidgetInLayout(layoutId, appConfig.layouts[selection.layoutId].content[selection.layoutItemId]
                    .widgetId)) {
                    linkedToRegular = false;
                }
                items.push({
                    label: this.formatMessage('applyTo', {
                        status: this.formatMessage('default').toLocaleLowerCase()
                    }),
                    event: evt => {
                        this.handleCopyTo(evt, Status.Regular, selectedLayoutItem, linkedToRegular);
                    }
                });
            };
            if (builderStatus === Status.Regular) {
                syncToHover();
                title = this.formatMessage('linkedTo', {
                    where: this.formatMessage('hover').toLocaleLowerCase()
                });
            }
            else if (builderStatus === Status.Hover) {
                syncToRegular();
                title = this.formatMessage('linkedTo', {
                    where: this.formatMessage('default').toLocaleLowerCase()
                });
            }
            if (showBreak) {
                items.push({
                    label: this.formatMessage('isolate'),
                    event: this.handleBreakLink
                });
            }
            else {
                title = this.formatMessage('isolate');
            }
            return {
                items: Immutable(items),
                title: title
            };
        };
        this.getCardToolsStyle = (theme) => {
            return css `
      width: 100%;
      .btn {
        width: 100%;
      }
      .dropdown-toggle {
        justify-content: center;
      }
    `;
        };
        this.renderCardTools = () => {
            const isInBuilder = window.jimuConfig.isInBuilder;
            if (!isInBuilder)
                return;
            const { builderSupportModules, selectionIsCard, selectionIsInCard, appMode, hideCardTool, cardConfigs } = this.props;
            const { BuilderPopper, GLOBAL_RESIZING_CLASS_NAME, GLOBAL_H5_DRAGGING_CLASS_NAME, GLOBAL_DRAGGING_CLASS_NAME } = builderSupportModules.widgetModules;
            const isSelf = selectionIsCard;
            let showTools = true;
            if ((!selectionIsInCard && !isSelf) ||
                appMode === AppMode.Run ||
                hideCardTool) {
                showTools = false;
            }
            return (this.props.isEditing &&
                cardConfigs[Status.Hover].enable && (jsx(BuilderPopper, { placement: 'left-start', trapFocus: false, autoFocus: false, css: css `
            .${GLOBAL_DRAGGING_CLASS_NAME} &,
            .${GLOBAL_RESIZING_CLASS_NAME} &,
            .${GLOBAL_H5_DRAGGING_CLASS_NAME} & {
              &.popper {
                display: none;
              }
            }
          `, reference: this.layoutRef.current, offset: statesPopperOffset, modifiers: statesModifiers, open: showTools }, this.getCardMenuElement())));
        };
        this.getCardMenuElement = () => {
            const isInBuilder = window.jimuConfig.isInBuilder;
            if (!isInBuilder)
                return;
            const { selection, widgetId, builderSupportModules, browserSizeMode, builderStatus, selectionIsCard } = this.props;
            const action = builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            const appConfig = action.appConfig;
            const { searchUtils, BuilderDropDown, BuilderButton, withBuilderTheme } = builderSupportModules.widgetModules;
            const isSelf = selectionIsCard;
            const showBreak = !isSelf &&
                selection &&
                searchUtils &&
                searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(appConfig, selection, widgetId, browserSizeMode).length > 1;
            const { items: syncItems, title: syncTitle } = this.getCopyDropdownItems(showBreak);
            const showSync = syncItems && syncItems.length > 0;
            const CardMenu = withBuilderTheme(theme => {
                return (jsx("div", { className: 'status-group d-flex flex-column align-items-center p-2', css: this.getCardToolsStyle(theme) },
                    jsx(BuilderButton, { active: builderStatus === Status.Regular, onClick: evt => this.handleBuilderStatusChange(evt, Status.Regular) }, this.formatMessage('default')),
                    jsx(BuilderButton, { active: builderStatus === Status.Hover, className: 'mt-1', onClick: evt => this.handleBuilderStatusChange(evt, Status.Hover) }, this.formatMessage('hover')),
                    !isSelf && (showSync || showBreak) && (jsx(BuilderDropDown, { className: 'mt-1 w-100', toggleIsIcon: true, toggleTitle: syncTitle, toggleType: 'default', direction: 'left', toggleContent: theme => (showBreak ? jsx(SyncOnOutlined, { size: 16 }) : jsx(SyncOffOutlined, { size: 16 })), modifiers: applyPopperModifiers, items: syncItems }))));
            });
            return (jsx(CardMenu, null));
        };
        this.getEditorStyle = () => {
            return css `
      &.card-content {
        .fixed-layout {
          border: 0 !important;
        }
      }
    `;
        };
        this.renderCardEditor = () => {
            const { cardConfigs, LayoutEntry, layouts, browserSizeMode } = this.props;
            const { hoverPlayId, regularPlayId } = this.state;
            const regularLayout = layouts[Status.Regular];
            const hoverLayout = layouts[Status.Hover];
            const regularBgStyle = cardConfigs[Status.Regular].backgroundStyle.setIn(['boxShadow', 'color'], 'transparent');
            const hoverBgStyle = cardConfigs[Status.Hover].backgroundStyle.setIn(['boxShadow', 'color'], 'transparent');
            const transitionInfo = cardConfigs.transitionInfo;
            const editorContent = [];
            const regularMergedStyle = Object.assign({}, styleUtils.toCSSStyle(regularBgStyle || {}));
            const regularEditor = (jsx("div", { className: 'card-content d-flex surface-1', css: this.getEditorStyle(), ref: this.regularLayoutRef, key: Status.Regular },
                jsx("div", { className: 'w-100, h-100 animation-list', style: regularMergedStyle },
                    jsx(AnimationContext.Provider, { value: {
                            setting: (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) || null,
                            playId: regularPlayId,
                            oid: regularLayout[browserSizeMode]
                        } },
                        jsx(LayoutEntry, { className: 'h-100', isRepeat: true, layouts: regularLayout, isInWidget: true })))));
            editorContent.push(regularEditor);
            if (!cardConfigs[Status.Hover].enable) {
                return editorContent;
            }
            const hoverMergedStyle = Object.assign({}, styleUtils.toCSSStyle(hoverBgStyle || {}));
            const hoverEditor = (jsx("div", { className: 'card-content d-flex surface-1', css: this.getEditorStyle(), ref: this.hoverLayoutRef, key: Status.Hover },
                jsx("div", { className: 'w-100, h-100 animation-list', style: hoverMergedStyle },
                    jsx(AnimationContext.Provider, { value: {
                            setting: (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) || null,
                            playId: hoverPlayId,
                            oid: hoverLayout === null || hoverLayout === void 0 ? void 0 : hoverLayout[browserSizeMode]
                        } },
                        jsx(LayoutEntry, { className: 'h-100', isRepeat: true, layouts: hoverLayout, isInWidget: true })))));
            editorContent.push(hoverEditor);
            return editorContent;
        };
        this.getCardStyle = () => {
            var _a, _b, _c, _d;
            const { builderStatus, cardConfigs } = this.props;
            const status = cardConfigs[Status.Hover].enable
                ? builderStatus
                : Status.Regular;
            const style = {
                boxShadow: (_b = (_a = cardConfigs[status]) === null || _a === void 0 ? void 0 : _a.backgroundStyle) === null || _b === void 0 ? void 0 : _b.boxShadow,
                borderRadius: (_d = (_c = cardConfigs[status]) === null || _c === void 0 ? void 0 : _c.backgroundStyle) === null || _d === void 0 ? void 0 : _d.borderRadius
            };
            const cardShaowStyle = Object.assign({}, styleUtils.toCSSStyle(style));
            return cardShaowStyle;
        };
        this.state = {
            didMount: false,
            previousIndex: 1,
            currentIndex: 0,
            regularPlayId: null,
            hoverPlayId: null,
            widgetsUpdate: null
        };
        this.regularLayoutRef = React.createRef();
        this.hoverLayoutRef = React.createRef();
        this.layoutRef = React.createRef();
        this.isUpdateFirst = true;
    }
    componentDidMount() {
        this.setState({
            didMount: true
        });
    }
    componentDidUpdate(prveProps) {
        var _a, _b;
        const { cardConfigs, builderStatus } = this.props;
        const prveCardConfigs = prveProps.cardConfigs;
        const isPreviewIdChange = ((_a = prveCardConfigs === null || prveCardConfigs === void 0 ? void 0 : prveCardConfigs.transitionInfo) === null || _a === void 0 ? void 0 : _a.previewId) ===
            ((_b = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.transitionInfo) === null || _b === void 0 ? void 0 : _b.previewId);
        const isStatusChange = prveProps.builderStatus &&
            prveProps.builderStatus !== builderStatus &&
            !this.isUpdateFirst;
        const isHoverEnableChange = prveCardConfigs[Status.Hover].enable !== cardConfigs[Status.Hover].enable;
        if (!isPreviewIdChange || isStatusChange || isHoverEnableChange) {
            this.toggleStatus(builderStatus);
        }
        if (this.isUpdateFirst) {
            this.isUpdateFirst = false;
        }
    }
    handleBuilderStatusChange(evt, status) {
        var _a;
        // this.toggleStatus(status);
        this.editStatus('showCardSetting', status);
        this.editStatus('builderStatus', status);
        (_a = this === null || this === void 0 ? void 0 : this.props) === null || _a === void 0 ? void 0 : _a.selectSelf();
        evt.stopPropagation();
        evt.nativeEvent.stopImmediatePropagation();
    }
    render() {
        var _a, _b;
        const { cardConfigs, widgetId, isEditing, builderStatus, selectionIsCard, selectionIsInCard } = this.props;
        const { didMount, previousIndex, currentIndex } = this.state;
        const transitionInfo = cardConfigs.transitionInfo;
        const cardEditClass = `card-${widgetId}`;
        const usePreviewId = (selectionIsCard || selectionIsInCard) ? transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.previewId : null;
        const previewId = usePreviewId || null;
        return (jsx("div", { css: this.getStyle(builderStatus), style: this.getCardStyle(), className: cardEditClass },
            didMount && this.renderCardTools(),
            jsx("div", { className: 'w-100, h-100', ref: this.layoutRef },
                jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_a = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _a === void 0 ? void 0 : _a.type, direction: (_b = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _b === void 0 ? void 0 : _b.direction, playId: didMount ? previewId : null, withOneByOne: !!(transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) }, this.renderCardEditor())),
            !isEditing && jsx("div", { className: 'edit-mask position-absolute' })));
    }
}
export default ReactRedux.connect((state, props) => {
    var _a;
    const { appMode } = props;
    if (!window.jimuConfig.isInBuilder || appMode === AppMode.Run) {
        return {
            selection: undefined
        };
    }
    const selection = props.selectionIsInCard && ((_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.selection);
    return {
        selection
    };
})(_CardEditor);
//# sourceMappingURL=card-editor.js.map