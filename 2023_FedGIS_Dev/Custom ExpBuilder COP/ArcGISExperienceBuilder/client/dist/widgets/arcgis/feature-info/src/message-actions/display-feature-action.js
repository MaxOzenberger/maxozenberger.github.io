import { AbstractMessageAction, MessageType, MutableStoreManager } from 'jimu-core';
export default class ZoomToFeatureAction extends AbstractMessageAction {
    filterMessageDescription(messageDescription) {
        return messageDescription.messageType === MessageType.DataRecordsSelectionChange;
    }
    filterMessage(message) {
        return true;
    }
    onExecute(message) {
        switch (message.type) {
            case MessageType.DataRecordsSelectionChange:
                const dataRecordsSelectionChangeMessage = message;
                const record = dataRecordsSelectionChangeMessage.records && dataRecordsSelectionChangeMessage.records[0];
                MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'displayFeatureActionValue.record', record);
                break;
        }
        return Promise.resolve(true);
    }
}
//# sourceMappingURL=display-feature-action.js.map