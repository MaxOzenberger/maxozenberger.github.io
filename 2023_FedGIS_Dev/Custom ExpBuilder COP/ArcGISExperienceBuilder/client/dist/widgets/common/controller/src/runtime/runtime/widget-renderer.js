var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { React, css, jsx, ErrorBoundary, WidgetState, classNames, getAppStore, appActions } from 'jimu-core';
import { hooks, Loading } from 'jimu-ui';
import { loadWidgetClass } from '../common';
const useStyle = (canCrossLayoutBoundary) => {
    return React.useMemo(() => {
        return css `
      overflow: ${canCrossLayoutBoundary ? 'visible' : 'hidden'};
      position: relative;
      .widget-content {
        position: relative;
        height: 100%;
        width: 100%;
        z-index: 0;
      }
  `;
    }, [canCrossLayoutBoundary]);
};
export function WidgetRenderer(props) {
    const { widgetId, canCrossLayoutBoundary, className } = props, others = __rest(props, ["widgetId", "canCrossLayoutBoundary", "className"]);
    const cancelable = hooks.useCancelablePromiseMaker();
    const [WidgetClass, setWidgetClass] = React.useState(null);
    const [widgetError, setWidgetError] = React.useState('');
    React.useEffect(() => {
        const promise = cancelable(loadWidgetClass(widgetId));
        promise.then((widgetClass) => {
            setWidgetClass(widgetClass);
        }, (error) => {
            var _a;
            setWidgetError((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
        });
    }, [cancelable, widgetId]);
    const handleMouseDown = React.useCallback(() => {
        var _a, _b;
        if (widgetError)
            return;
        if (window.jimuConfig.isBuilder) {
            return;
        }
        const isActive = ((_b = (_a = getAppStore().getState().widgetsRuntimeInfo) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.state) === WidgetState.Active;
        if (isActive) {
            return;
        }
        getAppStore().dispatch(appActions.activateWidget(widgetId));
    }, [widgetError, widgetId]);
    const classes = classNames('widget-renderer w-100 h-100', className);
    const style = useStyle(canCrossLayoutBoundary);
    return (jsx("div", Object.assign({ css: style, className: classes, onMouseDownCapture: handleMouseDown, "data-widgetid": widgetId }, others),
        jsx("div", { className: 'widget-content p-1' },
            widgetError,
            !widgetError && WidgetClass && jsx(ErrorBoundary, null,
                jsx(WidgetClass, { widgetId: widgetId })),
            !widgetError && !WidgetClass && jsx(Loading, null))));
}
//# sourceMappingURL=widget-renderer.js.map