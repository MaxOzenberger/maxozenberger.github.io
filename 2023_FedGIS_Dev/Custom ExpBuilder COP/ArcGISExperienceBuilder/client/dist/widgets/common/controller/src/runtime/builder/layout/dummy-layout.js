/** @jsx jsx */
import { React, css, jsx, getAppStore, Immutable, appActions, LayoutItemType, ReactRedux } from 'jimu-core';
import { Popper, hooks } from 'jimu-ui';
import { CONTAINER_LAYOUT_NAME } from '../../../common/consts';
import { getAppConfigAction } from 'jimu-for-builder';
import { LayoutBuilder } from 'jimu-layouts/layout-builder';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import { useWidgetChildLayoutJson } from '../../common/layout-utils';
const style = css `
  max-width: 100vw !important; 
  /* hide rnd-resize bar for the outermost layout item */
  .controller-configuration-container > * > * > .builder-layout-item > .select-wrapper > .action-area {
      > .rnd-resize-top,
      > .rnd-resize-right,
      > .rnd-resize-bottom,
      > .rnd-resize-left {
        display: none;
      }
    }

    .controller-configuration-container .builder-layout-item > .select-wrapper > .lock-layout-tip {
      display: none;
    }

  .selectable {
    > div {
      cursor: default;
    }
  }

  .widget-container {
    height: 100%;
    overflow: auto;
  }
`;
/**
 * Check whether controller widget or controlled widgets by controller widget is selected
 * @param controllerId
 */
export const useControlledWidgetsSelected = (controllerId, openWidget) => {
    var _a, _b, _c, _d, _e;
    const selection = ReactRedux.useSelector((state) => state.appRuntimeInfo.selection);
    const layoutId = selection === null || selection === void 0 ? void 0 : selection.layoutId;
    const layoutItemId = selection === null || selection === void 0 ? void 0 : selection.layoutItemId;
    const appConfig = getAppStore().getState().appConfig;
    const selectedWidget = (_d = (_c = (_b = (_a = appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c[layoutItemId]) === null || _d === void 0 ? void 0 : _d.widgetId;
    if (!selectedWidget)
        return false;
    let allowedWidgets = openWidget ? ((_e = searchUtils.getChildrenContents(appConfig, openWidget, LayoutItemType.Widget, false)) !== null && _e !== void 0 ? _e : []) : [];
    allowedWidgets = allowedWidgets.concat([controllerId, openWidget]);
    return allowedWidgets.includes(selectedWidget);
};
const MIN_SIZE = { width: 150, height: 150 };
const DEFAULT_SIZE = { width: 300, height: 300 };
const elementId = '0';
const getLayoutElementJson = (widgetId) => {
    return {
        type: 'WIDGET',
        widgetId: widgetId,
        bbox: {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        },
        id: elementId
    };
};
const createLayoutElement = (widgetId, layout) => {
    if (layout) {
        let appConfig = getAppConfigAction().appConfig;
        const elementJson = getLayoutElementJson(widgetId);
        appConfig = appConfig.setIn(['layouts', layout.id, 'content', elementJson.id], elementJson)
            .setIn(['layouts', layout.id, 'order'], [elementJson.id]);
        getAppConfigAction(appConfig).exec();
        getAppStore().dispatch(appActions.selectionChanged((Immutable({ layoutId: layout.id, layoutItemId: elementId }))));
    }
};
const isItemAccepted = () => {
    return false;
};
export const DummyLayout = (props) => {
    const { reference, placement, widgetId, controllerId, onClose, onSizeChange, size, version } = props;
    const layouts = ReactRedux.useSelector((state) => { var _a, _b, _c; return (_c = (_b = (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[controllerId]) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[CONTAINER_LAYOUT_NAME]; });
    const title = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.label; });
    const layout = useWidgetChildLayoutJson(controllerId, CONTAINER_LAYOUT_NAME);
    const selected = useControlledWidgetsSelected(controllerId, widgetId);
    const [open, setOpen] = React.useState(!!widgetId);
    hooks.useUpdateEffect(() => {
        setOpen(false);
        setTimeout(() => {
            setOpen(!!widgetId);
        }, 100);
    }, [widgetId]);
    React.useEffect(() => {
        if (!selected) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    }, [selected, onClose]);
    const handleEscape = (evt) => {
        if ((evt === null || evt === void 0 ? void 0 : evt.key) === 'Escape') {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            const button = reference === null || reference === void 0 ? void 0 : reference.querySelector('button');
            button === null || button === void 0 ? void 0 : button.focus();
        }
    };
    const layoutRef = hooks.useRefValue(layout);
    React.useEffect(() => {
        if (widgetId) {
            createLayoutElement(widgetId, layoutRef.current);
        }
    }, [widgetId, layoutRef]);
    const handleResize = (size) => {
        onSizeChange(widgetId, size);
    };
    return jsx(React.Fragment, null, open && jsx(Popper, { floating: true, open: true, headerTitle: title, onHeaderClose: onClose, minSize: MIN_SIZE, onResize: handleResize, dragBounds: "body", defaultSize: size || DEFAULT_SIZE, css: style, version: version, className: "flex-grow-1", reference: reference, toggle: handleEscape, placement: placement },
        jsx("div", { className: "widget-container controller-configuration-container d-flex p-1" },
            jsx(LayoutBuilder, { isItemAccepted: isItemAccepted, layouts: layouts, itemDraggable: false, itemResizable: true, showDefaultTools: false }))));
};
//# sourceMappingURL=dummy-layout.js.map