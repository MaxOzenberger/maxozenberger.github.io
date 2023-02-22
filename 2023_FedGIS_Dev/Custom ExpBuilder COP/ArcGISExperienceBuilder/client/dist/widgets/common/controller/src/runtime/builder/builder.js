/**@jsx jsx */
import { React, jsx, ReactRedux, appActions, getAppStore, Immutable, WidgetState, css } from 'jimu-core';
import { DummyLayout } from './layout/dummy-layout';
import { BASE_LAYOUT_NAME } from '../../common/consts';
import { getAppConfigAction } from 'jimu-for-builder';
import { getWidgetChildLayoutJson, useControlledWidgets } from '../common/layout-utils';
import { WidgetListPopper } from 'jimu-ui/advanced/setting-components';
import { isLayoutItemAcceptedForController, useInsertSyncWidgetToLayout } from './utils';
import { LayoutListPlaceholder } from './layout-list-placeholder';
import { PageContext } from 'jimu-layouts/layout-runtime';
const widgetPanelStyles = css `
  width: 300px;
  height: 300px;
  overflow-y: auto;
`;
const isAddWidgetExt = (node) => {
    var _a, _b;
    if (!node)
        return false;
    if (((_a = node.dataset) === null || _a === void 0 ? void 0 : _a.extname) === 'controller-add-widget') {
        return true;
    }
    const parent = node.parentElement;
    return ((_b = parent === null || parent === void 0 ? void 0 : parent.dataset) === null || _b === void 0 ? void 0 : _b.extname) === 'controller-add-widget';
};
export const Builder = (props) => {
    var _a, _b, _c, _d;
    const { id, config, version } = props;
    const vertical = (_a = config === null || config === void 0 ? void 0 : config.behavior) === null || _a === void 0 ? void 0 : _a.vertical;
    const size = (_b = config.behavior) === null || _b === void 0 ? void 0 : _b.size;
    const placement = !vertical ? 'bottom' : 'right-start';
    const { viewOnly } = React.useContext(PageContext);
    const rootRef = React.useRef(null);
    const widgetsState = ReactRedux.useSelector((state) => state.widgetsState[id]);
    const showWidgetsPanel = widgetsState === null || widgetsState === void 0 ? void 0 : widgetsState.showWidgetsPanel;
    const scrollRef = React.useRef();
    //DOM node used to locate the floating panel in the controller(Only for `onlyOpenOne`)
    const [reference, setReference] = React.useState(null);
    //Get all open state widgets in controller
    const widgets = useControlledWidgets(id, BASE_LAYOUT_NAME);
    const showPlaceholder = !Object.keys(widgets !== null && widgets !== void 0 ? widgets : {}).length;
    const openingWidgets = Object.keys(widgets).filter((widgetId) => widgets[widgetId].state === WidgetState.Opened);
    const firstOpeningWidget = openingWidgets === null || openingWidgets === void 0 ? void 0 : openingWidgets[0];
    const firstOpeningSize = size === null || size === void 0 ? void 0 : size[firstOpeningWidget];
    React.useEffect(() => {
        getAppStore().dispatch(appActions.closeWidgets(openingWidgets));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version]);
    const handleScrollStatusChange = React.useCallback((hideArrow, disablePrevious, disableNext) => {
        getAppStore().dispatch(appActions.widgetStatePropChange(id, 'hideArrow', hideArrow));
        getAppStore().dispatch(appActions.widgetStatePropChange(id, 'disablePrevious', disablePrevious));
        getAppStore().dispatch(appActions.widgetStatePropChange(id, 'disableNext', disableNext));
    }, [id]);
    //Synchronize the state and method of scroll-list component to toolbar
    React.useEffect(() => {
        getAppStore().dispatch(appActions.widgetStatePropChange(id, 'onArrowClick', scrollRef.current));
    }, [id]);
    const updateWidgetConfig = (config) => {
        getAppConfigAction().editWidgetConfig(id, config).exec();
    };
    const onWidgetSizeChanged = (widgetId, _size) => {
        if (!widgetId) {
            return;
        }
        let size = (config === null || config === void 0 ? void 0 : config.behavior.size) || Immutable({});
        size = size.set(widgetId, _size);
        updateWidgetConfig(config.setIn(['behavior', 'size'], size));
    };
    const handleItemClick = (evt) => {
        var _a;
        if (viewOnly)
            return;
        const reference = evt.currentTarget;
        const widgetId = (_a = reference.dataset) === null || _a === void 0 ? void 0 : _a.widgetid;
        setReference(reference);
        getAppStore().dispatch(appActions.closeWidgets(openingWidgets));
        getAppStore().dispatch(appActions.openWidget(widgetId));
    };
    const handleClose = (e) => {
        if (!isAddWidgetExt(e === null || e === void 0 ? void 0 : e.target)) {
            closeWidgetsPanel();
        }
    };
    const closeWidgetsPanel = () => {
        getAppStore().dispatch(appActions.widgetStatePropChange(id, 'showWidgetsPanel', false));
    };
    const handleRootClick = (evt) => {
        const target = evt.target;
        const root = rootRef.current;
        if (!target || !root)
            return;
        if (root.contains(target)) {
            closeWidgetsPanel();
        }
    };
    const insertSyncWidgetToLayout = useInsertSyncWidgetToLayout(id, BASE_LAYOUT_NAME);
    const onItemSelect = (item) => {
        var _a, _b;
        const layout = getWidgetChildLayoutJson(id, BASE_LAYOUT_NAME);
        const insertIndex = (_b = (_a = layout.order) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        insertSyncWidgetToLayout(layout, item, {}, {}, insertIndex);
    };
    return jsx("div", { className: 'controller-builder w-100 h-100', ref: rootRef, onClick: handleRootClick },
        firstOpeningWidget && jsx(DummyLayout, { reference: reference, version: version, widgetId: firstOpeningWidget, controllerId: id, size: firstOpeningSize, onClose: () => getAppStore().dispatch(appActions.closeWidgets(openingWidgets)), onSizeChange: onWidgetSizeChanged, placement: placement }),
        jsx(LayoutListPlaceholder, { scrollRef: scrollRef, showPlaceholder: showPlaceholder, onScrollStatusChange: handleScrollStatusChange, vertical: (_c = config === null || config === void 0 ? void 0 : config.behavior) === null || _c === void 0 ? void 0 : _c.vertical, widgetId: id, onItemClick: handleItemClick, itemStyle: config.appearance.card, draggable: true, markerEnabled: !viewOnly, space: (_d = config === null || config === void 0 ? void 0 : config.appearance) === null || _d === void 0 ? void 0 : _d.space }),
        showWidgetsPanel && jsx(WidgetListPopper, { css: widgetPanelStyles, placement: 'right-start', referenceElement: rootRef.current, isAccepted: isLayoutItemAcceptedForController, onSelect: onItemSelect, onClose: handleClose }));
};
//# sourceMappingURL=builder.js.map