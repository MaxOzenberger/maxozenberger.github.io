import { AbstractMessageAction, MessageType, RecordSetChangeType, MutableStoreManager, getAppStore, DataSourceManager } from 'jimu-core';
import { SHOW_ON_MAP_DATA_ID_PREFIX, ShowOnMapDataType } from 'jimu-arcgis';
import { getDsByWidgetId } from './action-utils';
export default class ShowOnMapAction extends AbstractMessageAction {
    filterMessageDescription(messageDescription) {
        if (messageDescription.messageType === MessageType.DataRecordSetChange) {
            const dataSourceManager = DataSourceManager.getInstance();
            const messageWidgetUseDataSources = getDsByWidgetId(messageDescription.widgetId, messageDescription.messageType);
            return messageWidgetUseDataSources.some(useDataSource => {
                var _a;
                const ds = dataSourceManager.getDataSource(useDataSource.dataSourceId);
                return !!((_a = ds.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.geometryType);
            });
        }
        else {
            return false;
        }
    }
    filterMessage(message) {
        return true;
    }
    onRemoveListen(messageType, messageWidgetId) {
        var _a;
        const showOnMapDatas = ((_a = MutableStoreManager.getInstance().getStateValue([this.widgetId])) === null || _a === void 0 ? void 0 : _a.showOnMapDatas) || {};
        const newShowOnMapDatas = {};
        Object.entries(showOnMapDatas).forEach(entry => {
            var _a;
            if (((_a = entry[1]) === null || _a === void 0 ? void 0 : _a.messageWidgetId) !== messageWidgetId) {
                newShowOnMapDatas[entry[0]] = entry[1];
            }
        });
        // save action data
        MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'showOnMapDatas', newShowOnMapDatas);
    }
    //getSettingComponentUri (messageType: MessageType, messageWidgetId?: string): string {
    //  return 'message-actions/show-on-map-action-setting'
    //}
    onExecute(message, actionConfig) {
        var _a;
        const activeViewId = this._getActiveViewId(this.widgetId, getAppStore().getState().jimuMapViewsInfo);
        const defaultViewId = this._getDefaultViewId(this.widgetId, getAppStore().getState().jimuMapViewsInfo);
        const jimuMapViewId = activeViewId || defaultViewId;
        let showOnMapDatas = ((_a = MutableStoreManager.getInstance().getStateValue([this.widgetId])) === null || _a === void 0 ? void 0 : _a.showOnMapDatas) || {};
        const idBase = `${SHOW_ON_MAP_DATA_ID_PREFIX}messageAction_${this.widgetId}_${message.dataRecordSetId}_`;
        const idTemporary = `${idBase}???`;
        const id = activeViewId ? `${idBase}${activeViewId}` : idTemporary;
        if (defaultViewId && defaultViewId === activeViewId) {
            // allow to add data using a temporary id, temporary id data will be deleted if can get activeViewId
            delete showOnMapDatas[idTemporary];
        }
        if (message.changeType === RecordSetChangeType.Create || message.changeType === RecordSetChangeType.Update) {
            showOnMapDatas[id] = {
                mapWidgetId: this.widgetId,
                messageWidgetId: message.widgetId,
                // Set jimuMapViewId to null means the data will be shared between all jimuMapViews of one mapWidget
                jimuMapViewId: jimuMapViewId,
                dataSet: message.dataRecordSet,
                type: ShowOnMapDataType.MessageAction,
                // use code to maintain compatibility here
                // for 'symbolOption', the difference between the values 'undefined' and 'null':
                //   undefined: app was created before online10.1 (inlcude 10.1), use default symbol;
                //   null: app was created or saved after online10.1, use default renderer of layer.
                // eslint-disable-next-line
                symbolOption: (actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.isUseCustomSymbol) ? actionConfig.symbolOption : ((actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.isUseCustomSymbol) === false ? null : undefined),
                title: id // 'Show on map message ...'
            };
        }
        else if (message.changeType === RecordSetChangeType.Remove) {
            // delete showOnMapDatas[id]
            const newShowOnMapDatas = {};
            Object.entries(showOnMapDatas).forEach(entry => {
                if (entry[0].indexOf(idBase) !== 0) {
                    newShowOnMapDatas[entry[0]] = entry[1];
                }
            });
            showOnMapDatas = newShowOnMapDatas;
        }
        // save action data
        MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'showOnMapDatas', showOnMapDatas);
        return Promise.resolve(true);
    }
    _getActiveViewId(mapWidgetId, infos) {
        return Object.keys(infos || {}).find(viewId => infos[viewId].mapWidgetId === mapWidgetId && infos[viewId].isActive);
    }
    _getDefaultViewId(mapWidgetId, infos) {
        return Object.keys(infos || {}).find(viewId => infos[viewId].mapWidgetId === mapWidgetId);
    }
}
//# sourceMappingURL=show-on-map-action.js.map