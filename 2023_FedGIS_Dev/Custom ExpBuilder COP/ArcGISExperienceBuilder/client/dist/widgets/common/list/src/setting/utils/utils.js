import { getAppConfigAction } from 'jimu-for-builder';
export const setLayoutAuto = (option) => {
    const { layout, desLayoutId, config, widgetId, appConfig, status } = option;
    const action = getAppConfigAction();
    const widgetJson = getWidgetJsonById(appConfig, widgetId);
    action.removeLayout(desLayoutId, false);
    const newConfig = config.setIn(['cardConfigs', status, 'listLayout'], layout);
    let udpateWidgetJson = widgetJson.setIn(['layouts', status], {});
    udpateWidgetJson = udpateWidgetJson.setIn(['config'], newConfig);
    action.editWidget(udpateWidgetJson === null || udpateWidgetJson === void 0 ? void 0 : udpateWidgetJson.asMutable({ deep: true })).exec();
};
export const setLayoutCustom = (option) => {
    const { layout, regularLayoutId, config, widgetId, appConfig, status, label } = option;
    const widgetJson = getWidgetJsonById(appConfig, widgetId);
    const action = getAppConfigAction();
    let newLayoutJson = action.duplicateLayout(regularLayoutId, false);
    newLayoutJson = newLayoutJson.set('label', status);
    action.editLayoutLabel({ layoutId: newLayoutJson.id }, label);
    const newConfig = config.setIn(['cardConfigs', status, 'listLayout'], layout);
    let udpateWidgetJson = widgetJson.setIn(['layouts', status, 'LARGE'], newLayoutJson.id);
    udpateWidgetJson = udpateWidgetJson.setIn(['config'], newConfig);
    action.editWidget(udpateWidgetJson === null || udpateWidgetJson === void 0 ? void 0 : udpateWidgetJson.asMutable({ deep: true })).exec();
};
export const getWidgetJsonById = (appConfig, widgetId) => {
    const widgets = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets;
    const widgetJson = widgets === null || widgets === void 0 ? void 0 : widgets[widgetId];
    return widgetJson;
};
//# sourceMappingURL=utils.js.map