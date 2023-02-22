import { AbstractMessageAction, MessageType, getAppStore, appActions, DataSourceManager, dataSourceUtils } from 'jimu-core';
export default class FilterAction extends AbstractMessageAction {
    filterMessageDescription(messageDescription) {
        return (messageDescription.messageType === MessageType.DataRecordsSelectionChange ||
            messageDescription.messageType === MessageType.ExtentChange);
    }
    filterMessage(message) {
        return true;
    }
    onExecute(message, actionConfig) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.lastMessage = message;
        // let usedFileds = [];
        switch (message.type) {
            case MessageType.DataRecordsSelectionChange: {
                let filterActionValue = null;
                if (actionConfig) {
                    if (actionConfig.messageUseDataSource &&
                        actionConfig.actionUseDataSource) {
                        const records = message
                            .records;
                        if (!records ||
                            records.length < 1 ||
                            (records.length > 0 &&
                                records[0].dataSource.id !==
                                    actionConfig.messageUseDataSource.dataSourceId)) {
                            getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.DataRecordsSelectionChange, null));
                            break;
                        }
                        const messageDataSource = DataSourceManager.getInstance().getDataSource(actionConfig.messageUseDataSource.dataSourceId);
                        const actionDataSource = DataSourceManager.getInstance().getDataSource(actionConfig.actionUseDataSource.dataSourceId);
                        if (messageDataSource && actionDataSource) {
                            // when ds instances exit
                            if (actionConfig.enabledDataRelationShip) {
                                // use DataRelationShip
                                let messageField = null;
                                let actionField = null;
                                if (actionConfig.messageUseDataSource.dataSourceId ===
                                    actionConfig.actionUseDataSource.dataSourceId &&
                                    actionConfig.messageUseDataSource.rootDataSourceId ===
                                        actionConfig.actionUseDataSource.rootDataSourceId) {
                                    // if trigger ds is same to action ds
                                    const messageDsSchema = messageDataSource.getSchema();
                                    const objectIdJimuFieldName = messageDsSchema &&
                                        messageDsSchema.fields &&
                                        Object.keys(messageDsSchema.fields).find(jimuFieldName => messageDsSchema.fields[jimuFieldName].esriType ===
                                            'esriFieldTypeOID');
                                    messageField =
                                        messageDsSchema &&
                                            messageDsSchema.fields &&
                                            messageDsSchema.fields[objectIdJimuFieldName];
                                    actionField = messageField;
                                }
                                else {
                                    // if trigger ds isn't same to action ds
                                    const messageJimuFieldName = (_b = (_a = actionConfig.messageUseDataSource) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b[0];
                                    const actionJimuFieldName = (_d = (_c = actionConfig.actionUseDataSource) === null || _c === void 0 ? void 0 : _c.fields) === null || _d === void 0 ? void 0 : _d[0];
                                    messageField = (_f = (_e = messageDataSource.getSchema()) === null || _e === void 0 ? void 0 : _e.fields) === null || _f === void 0 ? void 0 : _f[messageJimuFieldName];
                                    actionField = (_h = (_g = actionDataSource.getSchema()) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h[actionJimuFieldName];
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
                                    // usedFileds.push(actionField.name);
                                    if (messageFieldValues.length > 0) {
                                        whereSql = whereSql + `(${messageFieldValues.join(', ')})`;
                                    }
                                    else {
                                        whereSql = '';
                                    }
                                }
                                // more conditions
                                // usedFileds.push(...(actionConfig.sqlExprObj && getJimuFieldNamesBySqlExpression(actionConfig.sqlExprObj) || []));
                                whereSql = this.getMoreConditionSql(actionConfig, actionDataSource, whereSql);
                                filterActionValue = {
                                    querySQL: this.getRealQuerySql(whereSql, actionDataSource)
                                    // usedFileds
                                };
                            }
                            else {
                                // not use DataRelationShip
                                // usedFileds = actionConfig.sqlExprObj && getJimuFieldNamesBySqlExpression(actionConfig.sqlExprObj) || [];
                                const whereSql = this.getMoreConditionSql(actionConfig, actionDataSource, '');
                                filterActionValue = {
                                    querySQL: whereSql
                                    // usedFileds
                                };
                                if (actionDataSource.getSelectedRecords().length < 1) {
                                    filterActionValue = null;
                                }
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
                getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.DataRecordsSelectionChange, filterActionValue));
                break;
            }
            case MessageType.ExtentChange: {
                if (!(actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.actionUseDataSource)) {
                    getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.ExtentChange, null));
                    return;
                }
                const extent = message === null || message === void 0 ? void 0 : message.extent;
                const extActionDataSource = DataSourceManager.getInstance().getDataSource((_j = actionConfig === null || actionConfig === void 0 ? void 0 : actionConfig.actionUseDataSource) === null || _j === void 0 ? void 0 : _j.dataSourceId);
                const extWhereSql = this.getMoreConditionSql(actionConfig, extActionDataSource, undefined);
                // extWhereSql = this.getRealQuerySql(extWhereSql, extActionDataSource);
                getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.ExtentChange, {
                    querySQL: extWhereSql,
                    queryExtent: actionConfig.enableQueryWithCurrentExtent && Object.assign({ type: extent === null || extent === void 0 ? void 0 : extent.type }, extent === null || extent === void 0 ? void 0 : extent.toJSON())
                }));
                break;
            }
        }
        return true;
    }
    onRemoveListen(messageType, messageWidgetId) {
        if (!this.lastMessage) {
            return;
        }
        if (this.lastMessage.type === messageType &&
            this.lastMessage.widgetId === messageWidgetId) {
            getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.DataRecordsSelectionChange, null));
            getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, MessageType.ExtentChange, null));
        }
    }
    getRealQuerySql(whereSql, actionDataSource) {
        const query = {
            outFields: ['*'],
            where: whereSql,
            returnGeometry: true
        };
        const realQuery = actionDataSource.getRealQueryParams(query, 'query');
        return realQuery && realQuery.where;
    }
    getMoreConditionSql(actionConfig, actionDataSource, whereSql) {
        const moreAditionSQL = actionConfig.sqlExprObj
            ? dataSourceUtils.getArcGISSQL(actionConfig.sqlExprObj, actionDataSource)
                .sql
            : null;
        if (moreAditionSQL) {
            if (whereSql && whereSql.trim() !== '') {
                whereSql = whereSql + ' AND ' + moreAditionSQL;
            }
            else {
                whereSql = moreAditionSQL;
            }
        }
        return whereSql;
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