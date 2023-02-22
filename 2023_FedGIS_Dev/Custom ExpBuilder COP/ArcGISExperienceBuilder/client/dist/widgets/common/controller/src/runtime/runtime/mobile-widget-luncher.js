import { React, classNames, Immutable, WidgetState, getAppStore } from 'jimu-core';
import { MobilePanel } from 'jimu-ui';
import { WidgetRenderer } from './widget-renderer';
const DefaultWidgets = Immutable({});
export const MobileWidgetLuncher = (props) => {
    var _a, _b, _c;
    const { containerMapId, onClose, widgets = DefaultWidgets } = props;
    const openingWidget = (_a = Object.keys(widgets).find((widgetId) => widgets[widgetId].state === WidgetState.Opened)) !== null && _a !== void 0 ? _a : '';
    const title = (_c = (_b = getAppStore().getState().appConfig.widgets) === null || _b === void 0 ? void 0 : _b[openingWidget]) === null || _c === void 0 ? void 0 : _c.label;
    const handleClose = (evt) => {
        evt === null || evt === void 0 ? void 0 : evt.stopPropagation();
        evt === null || evt === void 0 ? void 0 : evt.nativeEvent.stopImmediatePropagation();
        onClose === null || onClose === void 0 ? void 0 : onClose(openingWidget);
    };
    return (React.createElement(MobilePanel, { className: classNames({ 'd-none': !openingWidget }), mapWidgetId: containerMapId, title: title, open: openingWidget, keepMount: true, toggle: handleClose }, Object.entries(widgets).map(([id, runtimeInfo]) => {
        const opened = runtimeInfo.state !== undefined;
        if (!opened)
            return null;
        const opening = runtimeInfo.state === WidgetState.Opened;
        return (React.createElement(WidgetRenderer, { widgetId: id, key: id, className: classNames({ 'd-none': !opening }) }));
    })));
};
//# sourceMappingURL=mobile-widget-luncher.js.map