import { React, classNames, WidgetState, Immutable, ReactRedux } from 'jimu-core';
import { Popper } from 'jimu-ui';
import { WidgetRenderer } from './widget-renderer';
import { DEFAULT_PANEL_SIZE, MIN_PANEL_SIZE } from '../../common/consts';
import { getWidgetCardNode } from './utils';
const DefaultWidgets = Immutable({});
export const SingleWidgetsLuncher = (props) => {
    var _a;
    const { widgets = DefaultWidgets, root, placement, sizes: propSizes, onClose } = props;
    const widgetJsons = ReactRedux.useSelector((state) => state.appConfig.widgets);
    const openingWidget = (_a = Object.keys(widgets).find((widgetId) => widgets[widgetId].state === WidgetState.Opened)) !== null && _a !== void 0 ? _a : '';
    const [reference, setReference] = React.useState(() => { var _a; return (_a = getWidgetCardNode(openingWidget)) !== null && _a !== void 0 ? _a : root; });
    React.useEffect(() => {
        var _a;
        setReference((_a = getWidgetCardNode(openingWidget)) !== null && _a !== void 0 ? _a : root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openingWidget]);
    const [sizes, setSizes] = React.useState(propSizes);
    const onResizeing = (widgetId, value) => {
        setSizes((sizes) => sizes.set(widgetId, value));
    };
    const handleClose = (widgetId, evt) => {
        evt.stopPropagation();
        onClose === null || onClose === void 0 ? void 0 : onClose(widgetId);
        const button = reference === null || reference === void 0 ? void 0 : reference.querySelector('button');
        button === null || button === void 0 ? void 0 : button.focus();
    };
    const handleEscape = (widgetId, evt) => {
        if ((evt === null || evt === void 0 ? void 0 : evt.key) === 'Escape') {
            handleClose(widgetId, evt);
        }
    };
    return React.createElement(React.Fragment, null, Object.entries(widgets).map(([id, runtimeInfo]) => {
        var _a, _b;
        const opened = runtimeInfo.state !== undefined;
        if (!opened)
            return null;
        const opening = runtimeInfo.state === WidgetState.Opened;
        const size = (_a = sizes[id]) !== null && _a !== void 0 ? _a : DEFAULT_PANEL_SIZE;
        const title = (_b = widgetJsons === null || widgetJsons === void 0 ? void 0 : widgetJsons[id]) === null || _b === void 0 ? void 0 : _b.label;
        return React.createElement(Popper, { key: id, style: { maxWidth: '100vw' }, className: classNames({ 'd-none': !opening }, 'single-widget-launcher'), headerTitle: title, minSize: MIN_PANEL_SIZE, dragBounds: "body", defaultSize: size, onResize: (size) => onResizeing(id, size), onHeaderClose: evt => handleClose(id, evt), floating: true, open: true, autoFocus: opening, reference: reference, toggle: evt => handleEscape(id, evt), placement: placement },
            React.createElement(WidgetRenderer, { widgetId: id }));
    }));
};
//# sourceMappingURL=single-widget-luncher.js.map