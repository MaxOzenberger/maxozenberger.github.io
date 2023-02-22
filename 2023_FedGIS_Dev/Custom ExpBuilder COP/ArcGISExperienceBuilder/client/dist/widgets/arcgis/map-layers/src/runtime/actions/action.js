export default class Action {
    constructor() {
        this.id = 'id';
        this.title = 'title';
        this.className = 'esri-icon';
        this.group = 0;
        this.widget = null;
        this.isValid = (layerItem) => false;
        this.execute = (layerItem) => { };
    }
    hasActionWithMessage(messageType) {
        /*
        let messagesConfig = getAppStore().getState().appConfig.messages;
        return messagesConfig.some((messageConfig) => {
          return messageConfig.widgetId === this.widget.props.id && messageConfig.messageType === messageType && !!messageConfig.actions[0];
        });
        */
        return false;
    }
    useMapWidget() {
        return this.widget.props.config.useMapWidget;
    }
}
//# sourceMappingURL=action.js.map