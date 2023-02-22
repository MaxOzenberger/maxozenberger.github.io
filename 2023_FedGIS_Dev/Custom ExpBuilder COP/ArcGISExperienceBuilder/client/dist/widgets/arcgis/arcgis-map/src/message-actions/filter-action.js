import { AbstractMessageAction, MessageType, lodash, DataSourceManager, dataSourceUtils, MutableStoreManager } from 'jimu-core';
const FILTER_ACTION_KEY_PREFIX = 'filterActionValue-';
const FILTER_MESSAGE_KEY_PREFIX = 'filterMessageValue-';
export default class FilterAction extends AbstractMessageAction {
    constructor() {
        super(...arguments);
        this.filterActions = {};
    }
    filterMessageDescription(messageDescription) {
        return messageDescription.messageType === MessageType.DataRecordsSelectionChange;
    }
    filterMessage(message) {
        return true;
    }
    onRemoveListen(messageType, messageWidgetId) {
        Object.keys(this.filterActions || {}).forEach(actionKey => {
            Object.entries(this.filterActions[actionKey] || {}).forEach(entry => {
                var _a;
                const messageKey = entry[0];
                if (((_a = entry[1]) === null || _a === void 0 ? void 0 : _a.messageWidgetId) === messageWidgetId) {
                    lodash.setValue(this.filterActions, `${actionKey}.${messageKey}.querySQL`, '');
                }
            });
            const filterActionValue = {
                layerDataSourceId: actionKey.slice(FILTER_ACTION_KEY_PREFIX.length),
                querySQL: this.getUnionAllFilterQuerySQL(actionKey)
            };
            MutableStoreManager.getInstance().updateStateValue(this.widgetId, actionKey, filterActionValue);
        });
    }
    onExecute(message, actionConfig) {
        switch (message.type) {
            case MessageType.DataRecordsSelectionChange:
                let filterActionValue = null;
                let messageDataSource, actionDataSource;
                if (actionConfig) {
                    if (actionConfig.messageUseDataSource && actionConfig.actionUseDataSource) {
                        if (message.records.length > 0 &&
                            message.records[0].dataSource.getMainDataSource().id !== actionConfig.messageUseDataSource.mainDataSourceId) {
                            MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'filterActionValue', null);
                            break;
                        }
                        messageDataSource = DataSourceManager.getInstance().getDataSource(actionConfig.messageUseDataSource.mainDataSourceId);
                        actionDataSource = DataSourceManager.getInstance().getDataSource(actionConfig.actionUseDataSource.mainDataSourceId);
                        if (messageDataSource && actionDataSource) {
                            if (message.records.length <= 0) {
                                // clear filter
                                filterActionValue = {
                                    layerDataSourceId: actionDataSource && actionDataSource.id,
                                    querySQL: ''
                                };
                            }
                            else if (actionConfig.enabledDataRelationShip) {
                                // when ds instances exit
                                // use DataRelationShip
                                let messageField = null;
                                let actionField = null;
                                if (actionConfig.messageUseDataSource.mainDataSourceId === actionConfig.actionUseDataSource.mainDataSourceId &&
                                    actionConfig.messageUseDataSource.rootDataSourceId === actionConfig.actionUseDataSource.rootDataSourceId) {
                                    // if trigger ds is same to action ds
                                    const messageDsSchema = messageDataSource.getSchema();
                                    const objectIdJimuFieldName = messageDsSchema && messageDsSchema.fields &&
                                        Object.keys(messageDsSchema.fields).find(jimuFieldName => messageDsSchema.fields[jimuFieldName].esriType === 'esriFieldTypeOID');
                                    messageField = messageDsSchema && messageDsSchema.fields && messageDsSchema.fields[objectIdJimuFieldName];
                                    actionField = messageField;
                                }
                                else {
                                    // if trigger ds isn't same to action ds
                                    const messageJimuFieldName = actionConfig.messageUseDataSource.fields[0];
                                    const actionJimuFieldName = actionConfig.actionUseDataSource.fields[0];
                                    messageField = messageDataSource.getSchema().fields[messageJimuFieldName];
                                    actionField = actionDataSource.getSchema().fields[actionJimuFieldName];
                                }
                                let whereSql = '';
                                if (messageField && actionField) {
                                    const messageFieldName = messageField.name;
                                    const messageFieldType = messageField.type;
                                    const tempMessage = message;
                                    const messageFieldValues = [];
                                    for (let i = 0; i < tempMessage.records.length; i++) {
                                        const tempFieldValue = tempMessage.records[i].getData()[messageFieldName];
                                        if (messageFieldValues.includes(`${this.formatValue(tempFieldValue, messageFieldType)}`)) {
                                            continue;
                                        }
                                        else {
                                            messageFieldValues.push(`${this.formatValue(tempMessage.records[i].getData()[messageFieldName], messageFieldType)}`);
                                        }
                                    }
                                    whereSql = `${actionField.name} IN `;
                                    if (messageFieldValues.length > 0) {
                                        whereSql = whereSql + `(${messageFieldValues.join(', ')})`;
                                    }
                                    else {
                                        whereSql = '';
                                    }
                                }
                                if (message.records.length > 0) {
                                    const moreAditionSQL = actionConfig.sqlExprObj ? dataSourceUtils.getArcGISSQL(actionConfig.sqlExprObj, actionDataSource).sql : null;
                                    if (moreAditionSQL) {
                                        if (whereSql) {
                                            whereSql = whereSql + ' AND ' + moreAditionSQL;
                                        }
                                        else {
                                            whereSql = moreAditionSQL;
                                        }
                                    }
                                }
                                else {
                                    whereSql = '';
                                }
                                filterActionValue = {
                                    layerDataSourceId: actionDataSource && actionDataSource.id,
                                    querySQL: whereSql
                                };
                            }
                            else {
                                // not use DataRelationShip
                                let whereSql = '';
                                if (message.records.length > 0) {
                                    const moreAditionSQL = actionConfig.sqlExprObj ? dataSourceUtils.getArcGISSQL(actionConfig.sqlExprObj, actionDataSource).sql : null;
                                    if (moreAditionSQL) {
                                        whereSql = moreAditionSQL;
                                    }
                                }
                                else {
                                    whereSql = '';
                                }
                                filterActionValue = {
                                    layerDataSourceId: actionDataSource && actionDataSource.id,
                                    querySQL: whereSql
                                };
                            }
                        }
                        else {
                            // when ds instances don't exist
                            filterActionValue = null;
                        }
                    }
                    else {
                        filterActionValue = null;
                    }
                }
                const messageKey = this.getFilterMessageKey(message.widgetId, messageDataSource === null || messageDataSource === void 0 ? void 0 : messageDataSource.id);
                const actionKey = this.getFilterActionKey(filterActionValue === null || filterActionValue === void 0 ? void 0 : filterActionValue.layerDataSourceId);
                if (filterActionValue) {
                    lodash.setValue(this.filterActions, `${actionKey}.${messageKey}`, {
                        querySQL: filterActionValue === null || filterActionValue === void 0 ? void 0 : filterActionValue.querySQL,
                        messageWidgetId: message.widgetId
                    });
                    filterActionValue.querySQL = this.getUnionAllFilterQuerySQL(actionKey);
                }
                MutableStoreManager.getInstance().updateStateValue(this.widgetId, actionKey, filterActionValue);
                break;
        }
        return true;
    }
    getUnionAllFilterQuerySQL(actionKey) {
        let unionQuerySQL = '';
        Object.entries(this.filterActions[actionKey] || {}).forEach(entry => {
            var _a;
            //const filterMessageKey = entry[0]
            const querySQL = (_a = entry[1]) === null || _a === void 0 ? void 0 : _a.querySQL;
            if (unionQuerySQL && querySQL) {
                unionQuerySQL = ` ${unionQuerySQL} AND ${querySQL} `;
            }
            else {
                unionQuerySQL = querySQL || unionQuerySQL;
            }
        });
        return unionQuerySQL;
    }
    getFilterActionKey(actionLayerDataSourceId) {
        const actionKey = `${FILTER_ACTION_KEY_PREFIX}${actionLayerDataSourceId}`;
        return actionKey;
    }
    getFilterMessageKey(messageWidgetId, messageLayerDataSourceId) {
        const messageKey = `${FILTER_MESSAGE_KEY_PREFIX}${messageWidgetId}-${messageLayerDataSourceId}`;
        return messageKey;
    }
    getLayerIdFromLayerDs(ds) {
        if (ds.layerId) {
            return ds.layerId;
        }
        else if (ds.layer) {
            return ds.layer.id;
        }
        else {
            return null;
        }
    }
    formatValue(value, type) {
        if (type === 'STRING') {
            return `'${value}'`;
        }
        else if (type === 'NUMBER') {
            return `${value}`;
        }
        else if (type === 'DATE') {
            return `'${value}'`;
        }
    }
}
//# sourceMappingURL=filter-action.js.map