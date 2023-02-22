import { React, Immutable, classNames, WidgetState, ReactRedux } from 'jimu-core';
import { DisplayType } from '../../config';
import { FloatingPanel, hooks } from 'jimu-ui';
import { WidgetRenderer } from './widget-renderer';
import { DEFAULT_PANEL_SIZE } from '../../common/consts';
import { getWidgetCardNode } from './utils';
const getSizes = (widgets, sizeMap) => {
    let sizes = Immutable({});
    Object.keys(widgets).forEach((id) => {
        sizes = sizes.set(id, sizeMap[id] || DEFAULT_PANEL_SIZE);
    });
    return sizes;
};
const getBodyRect = () => {
    return document.body.getBoundingClientRect();
};
/**
 * Layout multiple floating panels
 * @param mode
 * @param sizes
 * @param start
 * @param spaceX
 * @param spaceY
 */
export const useFigureOutLayouts = (mode, sizes, start, spaceX, spaceY) => {
    const [boundary, setBoundary] = React.useState(() => getBodyRect());
    const [anchors, setAnchors] = React.useState([start]);
    const callbackNumRef = React.useRef(0);
    React.useEffect(() => {
        const handleResize = () => {
            const rect = getBodyRect();
            setBoundary(rect);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isHorizontalOutBoundary = (rect, boundary) => {
        return rect.right >= boundary.right ||
            rect.left <= boundary.left;
    };
    const isVerticalOutBoundary = (rect, boundary) => {
        return rect.bottom >= boundary.bottom ||
            rect.top <= boundary.top;
    };
    /**
     * Check if a rect is out of boundary rect
     * @param rect
     * @param boundary
     */
    const isOutBoundary = (rect, boundary) => {
        if (!rect || !boundary)
            return false;
        return isHorizontalOutBoundary(rect, boundary) || isVerticalOutBoundary(rect, boundary);
    };
    //The maximum number to recursively prevent intersect or cross boundary
    const MaxNumberOfCallbacks = 7;
    //prevent intersect or cross boundary
    const determineRect = hooks.useEventCallback((undetermine) => {
        callbackNumRef.current++;
        if (callbackNumRef.current > MaxNumberOfCallbacks) {
            console.warn(`Number of cycles: ${callbackNumRef.current}.You may have opened too many panels, and now there is not enough space for them to be placed without overstepping and blocking`);
            return undetermine;
        }
        // const intersect = isIntersect(undetermine, forbidden);
        const outBoundary = isOutBoundary(undetermine, boundary);
        if (!outBoundary) {
            return undetermine;
        }
        const { width, height } = undetermine;
        let { left, top, right, bottom } = undetermine;
        // if (intersect) {
        //   left = forbidden.right + spaceX;
        //   right = left + width;
        // }
        if (outBoundary) {
            const horOutBoundary = isHorizontalOutBoundary({ left, top, right, bottom, width, height }, boundary);
            const verOutBoundary = isVerticalOutBoundary({ left, top, right, bottom, width, height }, boundary);
            if (horOutBoundary) {
                left = mode === DisplayType.SideBySide ? start.x : boundary.right - width;
            }
            if (!verOutBoundary && mode === DisplayType.SideBySide) {
                top += spaceY;
            }
            right = left + width;
            bottom = top + height;
        }
        return determineRect({ left, top, right, bottom, width, height });
    });
    React.useEffect(() => {
        const anchors = [];
        let prevSize = { width: 0, height: 0 };
        Object.keys(sizes).forEach((id, idx) => {
            const size = sizes[id];
            const anchor = idx !== 0 ? anchors[idx - 1] : start;
            let { x, y } = anchor;
            if (mode === DisplayType.SideBySide) {
                const { width } = prevSize;
                x += width;
                x += idx !== 0 ? spaceX : 0;
            }
            else if (mode === DisplayType.Stack) {
                x += idx !== 0 ? spaceX : 0;
                y += idx !== 0 ? spaceY : 0;
            }
            const rect = { left: x, top: y, right: x + size.width, bottom: y + size.height, width: size.width, height: size.height };
            const { left, top } = determineRect(rect);
            if (callbackNumRef.current > MaxNumberOfCallbacks) {
                x = anchor.x;
                y = anchor.y;
            }
            else {
                x = left;
                y = top;
            }
            callbackNumRef.current = 0;
            anchors.push({ x, y });
            prevSize = size;
        });
        setAnchors(anchors);
    }, [mode, start, spaceX, spaceY, boundary.width, boundary.height, determineRect, sizes]);
    return anchors;
};
const DefaultWidgets = Immutable({});
export const MultipleWidgetsLuncher = (props) => {
    const { mode, start, spaceX, spaceY, sizes: propSizes, widgets = DefaultWidgets, onClose } = props;
    const widgetJsons = ReactRedux.useSelector((state) => state.appConfig.widgets);
    const [sizeMap, setSizeMap] = React.useState(propSizes);
    const sizes = React.useMemo(() => getSizes(widgets, sizeMap), [sizeMap, widgets]);
    const handleClose = (widgetId, evt) => {
        evt === null || evt === void 0 ? void 0 : evt.stopPropagation();
        onClose === null || onClose === void 0 ? void 0 : onClose(widgetId);
        handleLeave(widgetId);
    };
    const handleLeave = (widgetId) => {
        const node = getWidgetCardNode(widgetId);
        const button = node === null || node === void 0 ? void 0 : node.querySelector('button');
        button === null || button === void 0 ? void 0 : button.focus();
    };
    const onResizeing = (widgetId, value) => {
        setSizeMap(sizeMap.set(widgetId, value));
    };
    const anchors = useFigureOutLayouts(mode, sizes, start, spaceX, spaceY);
    return React.createElement(React.Fragment, null, Object.entries(widgets).map(([id, runtimeInfo], idx) => {
        var _a;
        const opened = runtimeInfo.state !== undefined;
        if (!opened)
            return null;
        const opening = runtimeInfo.state === WidgetState.Opened;
        const anchor = anchors[idx];
        if (!anchor)
            return null;
        const size = sizes[id];
        const title = (_a = widgetJsons === null || widgetJsons === void 0 ? void 0 : widgetJsons[id]) === null || _a === void 0 ? void 0 : _a.label;
        return React.createElement(FloatingPanel, { key: id, style: { maxWidth: '100vw' }, headerTitle: title, defaultPosition: anchor, defaultSize: size, className: classNames({ 'd-none': !opening }, 'multiple-widget-launcher'), showHeaderClose: true, autoFocus: opening, dragBounds: "body", onResize: (size) => onResizeing(id, size), onLeave: () => handleLeave(id), onHeaderClose: (evt) => handleClose(id, evt) },
            React.createElement(WidgetRenderer, { widgetId: id }));
    }));
};
//# sourceMappingURL=multiple-widgets-luncher.js.map