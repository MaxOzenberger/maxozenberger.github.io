import { React, getAppStore, WidgetManager, lodash } from 'jimu-core';
import { hooks } from 'jimu-ui';
import { getItemLength } from './avatar-card';
/**
 * Get AvatarCard element length by AvatarCard props and space
 * @param props The props of AvatarCard
 * @param space Spacing between each AvatarCard element
 */
export const getListItemLength = (props, space) => {
    const showLabel = props === null || props === void 0 ? void 0 : props.showLabel;
    const labelGrowth = props === null || props === void 0 ? void 0 : props.labelGrowth;
    const size = props === null || props === void 0 ? void 0 : props.avatar.size;
    const shape = props === null || props === void 0 ? void 0 : props.avatar.shape;
    const baseLength = getItemLength(size, showLabel, shape);
    return baseLength + space + labelGrowth;
};
export const loadWidgetClass = (widgetId) => {
    var _a, _b;
    if (!widgetId)
        return;
    const isClassLoaded = (_b = (_a = getAppStore().getState().widgetsRuntimeInfo) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.isClassLoaded;
    if (!isClassLoaded) {
        return WidgetManager.getInstance().loadWidgetClass(widgetId);
    }
    else {
        return Promise.resolve(WidgetManager.getInstance().getWidgetClass(widgetId));
    }
};
/**
 * Debounce monitor element size
 * @param rootRef
 * @param duration
 * @param vertical
 */
export const useObserveDebouncedLength = (rootRef, duration = 500, vertical) => {
    var _a, _b;
    const clientSize = vertical ? 'clientHeight' : 'clientWidth';
    const [length, setLength] = React.useState((_b = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a[clientSize]) !== null && _b !== void 0 ? _b : 0);
    const fn = () => {
        const node = rootRef.current;
        const length = node[clientSize] || 0;
        setLength(length);
    };
    const fnRef = hooks.useLatest(fn);
    const debounced = React.useMemo(() => lodash.debounce(() => {
        return fnRef.current();
    }, duration), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    //Use ResizeObserver to monitor the size change of root dom
    React.useEffect(() => {
        const node = rootRef.current;
        if (node) {
            debounced();
        }
        const resizeObserver = new ResizeObserver(debounced);
        resizeObserver.observe(node);
        return () => {
            resizeObserver.disconnect();
            debounced.cancel();
        };
    }, [rootRef, debounced]);
    return length;
};
//# sourceMappingURL=utils.js.map