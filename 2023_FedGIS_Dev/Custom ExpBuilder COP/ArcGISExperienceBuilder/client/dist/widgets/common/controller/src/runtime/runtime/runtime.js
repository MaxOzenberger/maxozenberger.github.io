import { React, ReactRedux, LayoutItemType, ContainerType, getAppStore, appActions, WidgetState } from 'jimu-core';
import { hooks } from 'jimu-ui';
import { getListItemLength } from '../common/utils';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import { MobileWidgetLuncher } from './mobile-widget-luncher';
import { SingleWidgetsLuncher } from './single-widget-luncher';
import { MultipleWidgetsLuncher } from './multiple-widgets-luncher';
import { ScrollList } from '../common/scroll-list';
import { WidgetAvatarCard } from '../common';
import { BASE_LAYOUT_NAME, DEFAULT_PANEL_SIZE, DEFAULT_PANEL_SPACE, DEFAULT_WIDGET_START_POSITION } from '../../common/consts';
import { getWidgetCardNode } from './utils';
import { useControlledWidgets } from '../common/layout-utils';
//If current widget place in map widget, the id of map widget will be passed to the mobile panel
const useContainerMapId = (id) => {
    return ReactRedux.useSelector((state) => {
        var _a;
        const appConfig = state.appConfig;
        const browserSizeMode = state.browserSizeMode;
        const containerId = searchUtils.getParentWidgetIdOfContent(appConfig, id, LayoutItemType.Widget, browserSizeMode);
        const container = appConfig.widgets[containerId];
        return ((_a = container === null || container === void 0 ? void 0 : container.manifest) === null || _a === void 0 ? void 0 : _a.name) === 'arcgis-map' ? container.id : '';
    });
};
/**
 * Get the section where the view is located.
 * @param viewId
 */
export const getParentSection = (viewId) => {
    const appConfig = getAppStore().getState().appConfig;
    const sections = appConfig.sections;
    const section = Object.values(sections !== null && sections !== void 0 ? sections : {}).find((section) => { var _a; return (_a = section.views) === null || _a === void 0 ? void 0 : _a.includes(viewId); });
    return section === null || section === void 0 ? void 0 : section.id;
};
/**
 * Get all activated views.
 * @param sectionNavInfos
 */
export const getActiveViews = (sectionNavInfos) => {
    const appConfig = getAppStore().getState().appConfig;
    const sections = appConfig.sections;
    const activedViews = sectionNavInfos ? Object.values(sectionNavInfos).map((section) => section.currentViewId) : [];
    const activedSections = activedViews.map(getParentSection);
    const defaultActivedViews = Object.values(sections !== null && sections !== void 0 ? sections : {}).map(section => {
        var _a;
        if (!activedSections.includes(section.id)) {
            return (_a = section.views) === null || _a === void 0 ? void 0 : _a[0];
        }
        return undefined;
    }).filter((view) => !!view);
    const views = activedViews;
    defaultActivedViews.forEach((view) => {
        if (!activedViews.includes(view)) {
            views.push(view);
        }
    });
    return views;
};
/**
 * Check whether current widget is hidden in section view or not.
 * @param sectionNavInfos
 * @param id
 */
const getWhetherWidgetVisible = (sectionNavInfos, id) => {
    const activedViews = getActiveViews(sectionNavInfos);
    const browserSizeMode = getAppStore().getState().browserSizeMode;
    const appConfig = getAppStore().getState().appConfig;
    const info = searchUtils.getContentContainerInfo(appConfig, id, LayoutItemType.Widget, browserSizeMode);
    let visible = true;
    if (!info)
        return visible;
    if (info.type === ContainerType.View) {
        if (!activedViews.includes(info.id)) {
            visible = false;
        }
        else {
            const parentViewId = info.id;
            const parentSectionId = getParentSection(parentViewId);
            const sectionContainerViewInfo = searchUtils.getContentContainerInfo(appConfig, parentSectionId, LayoutItemType.Section, browserSizeMode);
            if (sectionContainerViewInfo && sectionContainerViewInfo.type === ContainerType.View) {
                if (!activedViews.includes(sectionContainerViewInfo.id)) {
                    visible = false;
                }
            }
        }
    }
    return visible;
};
const useWhetherWidgetVisible = (id) => {
    const sectionNavInfos = ReactRedux.useSelector((state) => { var _a; return (_a = state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.sectionNavInfos; });
    return getWhetherWidgetVisible(sectionNavInfos, id);
};
export const Runtime = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { id, config, version } = props;
    const onlyOpenOne = (_a = config.behavior) === null || _a === void 0 ? void 0 : _a.onlyOpenOne;
    const openStarts = (_b = config.behavior) === null || _b === void 0 ? void 0 : _b.openStarts;
    const size = (_c = config.behavior) === null || _c === void 0 ? void 0 : _c.size;
    const vertical = (_d = config.behavior) === null || _d === void 0 ? void 0 : _d.vertical;
    const displayType = (_e = config.behavior) === null || _e === void 0 ? void 0 : _e.displayType;
    const card = (_f = config === null || config === void 0 ? void 0 : config.appearance) === null || _f === void 0 ? void 0 : _f.card;
    const itemLength = getListItemLength((_g = config === null || config === void 0 ? void 0 : config.appearance) === null || _g === void 0 ? void 0 : _g.card, (_h = config === null || config === void 0 ? void 0 : config.appearance) === null || _h === void 0 ? void 0 : _h.space);
    const isRTL = (_l = (_k = (_j = getAppStore()) === null || _j === void 0 ? void 0 : _j.getState()) === null || _k === void 0 ? void 0 : _k.appContext) === null || _l === void 0 ? void 0 : _l.isRTL;
    const isInBuilder = (_p = (_o = (_m = getAppStore()) === null || _m === void 0 ? void 0 : _m.getState()) === null || _o === void 0 ? void 0 : _o.appContext) === null || _p === void 0 ? void 0 : _p.isInBuilder;
    const widgetsLuncherStart = React.useMemo(() => {
        return isRTL ? Object.assign(Object.assign({}, DEFAULT_WIDGET_START_POSITION), { x: document.body.clientWidth - DEFAULT_PANEL_SIZE.width - DEFAULT_WIDGET_START_POSITION.x }) : DEFAULT_WIDGET_START_POSITION;
    }, [isRTL]);
    const widgetsLuncherSpace = React.useMemo(() => isRTL ? Object.assign(Object.assign({}, DEFAULT_PANEL_SPACE), { x: -DEFAULT_PANEL_SPACE.x }) : DEFAULT_PANEL_SPACE, [isRTL]);
    const placement = !vertical ? 'bottom' : 'right-start';
    const visible = useWhetherWidgetVisible(id);
    const containerMapId = useContainerMapId(id);
    const mobile = hooks.useCheckSmallBrowserSzieMode();
    const currentPageId = ReactRedux.useSelector((state) => state.appRuntimeInfo.currentPageId);
    const rootRef = React.useRef(null);
    // Get all the widgets contained in the controller
    const widgets = useControlledWidgets(id, BASE_LAYOUT_NAME);
    const widgetIds = Object.keys(widgets);
    const openingWidgets = widgetIds.filter((widgetId) => widgets[widgetId].state === WidgetState.Opened);
    const handleOpenWidget = React.useCallback((evt) => {
        var _a;
        const widgetId = (_a = evt.currentTarget.dataset) === null || _a === void 0 ? void 0 : _a.widgetid;
        if (!widgetId)
            return;
        const keepOneOpened = mobile ? true : onlyOpenOne;
        if (keepOneOpened) {
            getAppStore().dispatch(appActions.closeWidgets(openingWidgets));
            if (!openingWidgets.includes(widgetId)) {
                getAppStore().dispatch(appActions.openWidget(widgetId));
            }
        }
        else {
            if (!openingWidgets.includes(widgetId)) {
                getAppStore().dispatch(appActions.openWidget(widgetId));
            }
            else {
                getAppStore().dispatch(appActions.closeWidget(widgetId));
            }
        }
    }, [mobile, onlyOpenOne, openingWidgets]);
    const handleCloseWidget = (id) => {
        if (!id)
            return;
        getAppStore().dispatch(appActions.closeWidget(id));
        const widgetNode = getWidgetCardNode(id);
        widgetNode === null || widgetNode === void 0 ? void 0 : widgetNode.focus();
    };
    //When version (it means in builder and related config changed) or currentPageIdchanged, close opening widgets
    hooks.useUpdateEffect(() => {
        getAppStore().dispatch(appActions.closeWidgets(openingWidgets));
    }, [version, currentPageId]);
    //When visible changed, close opening widgets
    hooks.useUpdateEffect(() => {
        if (!visible) {
            getAppStore().dispatch(appActions.closeWidgets(openingWidgets));
        }
    }, [visible]);
    //When widget mounted, trigger open at start widgets
    React.useEffect(() => {
        if (isInBuilder || !(openStarts === null || openStarts === void 0 ? void 0 : openStarts.length) || !visible)
            return;
        setTimeout(() => {
            getAppStore().dispatch(appActions.openWidgets(openStarts));
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //The function to create widget card
    const createItem = React.useCallback((id, className) => {
        const active = openingWidgets.includes(id);
        return (React.createElement(WidgetAvatarCard, Object.assign({}, card, { key: id, className: `${className} layout-item`, widgetid: id, markerEnabled: false, active: active, onClick: handleOpenWidget })));
    }, [card, handleOpenWidget, openingWidgets]);
    return (React.createElement("div", { className: 'controller-runtime w-100 h-100' },
        mobile && React.createElement(MobileWidgetLuncher, { containerMapId: containerMapId, widgets: widgets, onClose: handleCloseWidget }),
        (!mobile && onlyOpenOne) && React.createElement(SingleWidgetsLuncher, { sizes: size, root: rootRef.current, placement: placement, widgets: widgets, onClose: handleCloseWidget }),
        (!mobile && !onlyOpenOne) && React.createElement(MultipleWidgetsLuncher, { sizes: size, mode: displayType, start: widgetsLuncherStart, spaceX: widgetsLuncherSpace.x, spaceY: widgetsLuncherSpace.y, widgets: widgets, onClose: handleCloseWidget }),
        React.createElement(ScrollList, { ref: rootRef, className: 'runtime--scroll-list', vertical: vertical, itemLength: itemLength, space: (_q = config.appearance) === null || _q === void 0 ? void 0 : _q.space, autoHideArrow: true, lists: widgetIds, createItem: createItem })));
};
//# sourceMappingURL=runtime.js.map