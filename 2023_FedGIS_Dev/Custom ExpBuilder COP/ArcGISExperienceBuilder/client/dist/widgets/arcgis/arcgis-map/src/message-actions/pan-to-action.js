import { AbstractMessageAction, MessageType, getAppStore, RecordSetChangeType, MutableStoreManager, DataSourceManager } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { handleFeature } from '../runtime/utils';
import { getDsByWidgetId } from './action-utils';
export default class PanToAction extends AbstractMessageAction {
    constructor() {
        super(...arguments);
        this.NoLockTriggerLayerWidgets = ['Map'];
    }
    filterMessageDescription(messageDescription) {
        if (messageDescription.messageType === MessageType.ExtentChange) {
            return true;
        }
        else if (messageDescription.messageType !== MessageType.DataRecordSetChange &&
            messageDescription.messageType !== MessageType.DataRecordsSelectionChange &&
            messageDescription.messageType !== MessageType.DataSourceFilterChange) {
            return false;
        }
        else {
            const dataSourceManager = DataSourceManager.getInstance();
            const messageWidgetUseDataSources = getDsByWidgetId(messageDescription.widgetId, messageDescription.messageType);
            return messageWidgetUseDataSources.some(useDataSource => {
                var _a;
                const ds = dataSourceManager.getDataSource(useDataSource.dataSourceId);
                if (ds.type === 'WEB_MAP' || ds.type === 'WEB_SCENE') {
                    return true;
                }
                else {
                    return !!((_a = ds.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.geometryType);
                }
            });
        }
    }
    filterMessage(message) {
        return true;
    }
    getSettingComponentUri(messageType, messageWidgetId) {
        //const config = getAppStore().getState().appStateInBuilder ? getAppStore().getState().appStateInBuilder.appConfig : getAppStore().getState().appConfig
        //const messageWidgetJson = config.widgets[messageWidgetId]
        if (messageType === MessageType.DataRecordsSelectionChange ||
            messageType === MessageType.DataSourceFilterChange) {
            return 'message-actions/pan-to-action-setting';
        }
        else {
            return null;
        }
    }
    onExecute(message, actionConfig) {
        return loadArcGISJSAPIModules(['esri/Graphic']).then(modules => {
            var _a;
            let Graphic = null;
            [Graphic] = modules;
            switch (message.type) {
                case MessageType.DataRecordSetChange:
                    const dataRecordSetChangeMessage = message;
                    if (dataRecordSetChangeMessage.changeType === RecordSetChangeType.Create ||
                        dataRecordSetChangeMessage.changeType === RecordSetChangeType.Update) {
                        let newFeatureSet = {};
                        if (dataRecordSetChangeMessage.dataRecordSet && dataRecordSetChangeMessage.dataRecordSet.records) {
                            const features = [];
                            for (let i = 0; i < dataRecordSetChangeMessage.dataRecordSet.records.length; i++) {
                                const dataRecordFeature = dataRecordSetChangeMessage.dataRecordSet.records[i].feature;
                                if (dataRecordFeature) {
                                    features.push(handleFeature(dataRecordFeature, Graphic).geometry);
                                }
                            }
                            newFeatureSet = {
                                features: features
                            };
                        }
                        MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'panToActionValue.value', newFeatureSet);
                    }
                    break;
                case MessageType.DataRecordsSelectionChange:
                    const config = getAppStore().getState().appConfig;
                    const messageWidgetJson = config.widgets[message.widgetId];
                    const messageWidgetLabel = messageWidgetJson.manifest.label;
                    const dataRecordsSelectionChangeMessage = message;
                    let selectionFeatureSet = {};
                    const selectFeatures = [];
                    if (dataRecordsSelectionChangeMessage.records) {
                        if (dataRecordsSelectionChangeMessage.records[0]) {
                            //if (!actionConfig.useDataSource || (dataRecordsSelectionChangeMessage.records[0].dataSource.getMainDataSource().id !== actionConfig.useDataSource.mainDataSourceId)) {
                            //  break
                            //}
                            if (this.NoLockTriggerLayerWidgets.includes(messageWidgetLabel)) {
                                const mainDataSourceOfSelection = dataRecordsSelectionChangeMessage.records[0].dataSource.getMainDataSource();
                                if (!((_a = actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.useDataSources) === null || _a === void 0 ? void 0 : _a.some(useDataSource => (useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.mainDataSourceId) === mainDataSourceOfSelection.id))) {
                                    break;
                                }
                            }
                            else {
                                const selectionChangeDS = dataRecordsSelectionChangeMessage.records[0].dataSource;
                                const selectionChangeMainDS = selectionChangeDS === null || selectionChangeDS === void 0 ? void 0 : selectionChangeDS.getMainDataSource();
                                // check dsId of mainDS currently, will support view in the future.
                                if (!actionConfig.useDataSources.some(useDataSource => (useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.mainDataSourceId) === selectionChangeMainDS.id)) {
                                    break;
                                }
                            }
                        }
                        for (let i = 0; i < dataRecordsSelectionChangeMessage.records.length; i++) {
                            const dataRecordFeature = dataRecordsSelectionChangeMessage.records[i].feature;
                            if (dataRecordFeature) {
                                selectFeatures.push(handleFeature(dataRecordFeature, Graphic).geometry);
                            }
                        }
                    }
                    selectionFeatureSet = {
                        features: selectFeatures
                    };
                    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'panToActionValue.value', selectionFeatureSet);
                    break;
                case MessageType.ExtentChange:
                    const extentChangeMessage = message;
                    if (extentChangeMessage.getRelatedWidgetIds().includes(this.widgetId)) {
                        break;
                    }
                    const extentValue = {
                        features: [extentChangeMessage.extent]
                    };
                    const panToFeatureActionValue = {
                        value: extentValue,
                        relatedWidgets: extentChangeMessage.getRelatedWidgetIds()
                    };
                    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'panToActionValue', panToFeatureActionValue);
                    break;
                case MessageType.DataSourceFilterChange:
                    const filterChangeMessage = message;
                    const filterChangeDS = DataSourceManager.getInstance().getDataSource(filterChangeMessage.dataSourceId);
                    //const filterChangeMainDS = filterChangeDS?.getMainDataSource()
                    // support view.
                    if (!actionConfig.useDataSources.some(useDataSource => (useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId) === filterChangeDS.id)) {
                        break;
                    }
                    const filterChangeActionValue = {
                        dataSourceId: filterChangeMessage.dataSourceId,
                        useDataSources: actionConfig.useDataSources || [],
                        type: 'pan-to-query-params'
                    };
                    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'panToActionValue.value', filterChangeActionValue);
                    break;
            }
            return true;
        });
    }
}
//# sourceMappingURL=pan-to-action.js.map