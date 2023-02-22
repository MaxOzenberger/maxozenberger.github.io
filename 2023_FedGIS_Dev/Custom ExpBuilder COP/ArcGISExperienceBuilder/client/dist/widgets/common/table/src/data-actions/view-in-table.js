var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractDataAction, utils, getAppStore, appActions, MutableStoreManager } from 'jimu-core';
import { SelectionModeType } from '../config';
export default class ViewInTable extends AbstractDataAction {
    constructor() {
        super(...arguments);
        this.getDataActionRuntimeUuid = (widgetId) => {
            const runtimeUuid = utils.getLocalStorageAppKey();
            return `${runtimeUuid}-${widgetId}-DaTableArray`;
        };
        this.deepClone = (obj) => {
            const isArray = Array.isArray(obj);
            const cloneObj = isArray ? [] : {};
            for (const key in obj) {
                const isObject = (typeof obj[key] === 'object' || typeof obj[key] === 'function') && obj[key] !== null;
                cloneObj[key] = isObject ? this.deepClone(obj[key]) : obj[key];
            }
            return cloneObj;
        };
    }
    isSupported(dataSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return dataSet.records.length > 0;
        });
    }
    onExecute(dataSet, actionConfig) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { dataSource, records } = dataSet;
            const allFields = dataSource && dataSource.getSchema();
            const defaultInvisible = [
                'CreationDate',
                'Creator',
                'EditDate',
                'Editor',
                'GlobalID'
            ];
            const allFieldsDetails = Object.values(allFields.fields);
            const initTableFields = allFieldsDetails.filter(item => !defaultInvisible.includes(item.jimuName)).map(ele => {
                return Object.assign(Object.assign({}, ele), { visible: true });
            });
            const newItemId = `DaTable-${utils.getUUID()}`;
            const name = dataSet.name || dataSource.getLabel();
            const daLayerItem = {
                id: newItemId,
                name: name,
                useDataSource: {
                    dataSourceId: dataSource.id,
                    mainDataSourceId: (_a = dataSource.getMainDataSource()) === null || _a === void 0 ? void 0 : _a.id,
                    dataViewId: dataSource.dataViewId,
                    rootDataSourceId: (_b = dataSource.getRootDataSource()) === null || _b === void 0 ? void 0 : _b.id
                },
                allFields: allFieldsDetails,
                tableFields: initTableFields,
                enableAttachements: false,
                enableEdit: false,
                allowCsv: false,
                enableSearch: false,
                searchFields: '',
                enableRefresh: false,
                enableSelect: false,
                selectMode: SelectionModeType.Single,
                dataActionObject: true
            };
            const viewInTableObj = ((_c = MutableStoreManager.getInstance().getStateValue([this.widgetId])) === null || _c === void 0 ? void 0 : _c.viewInTableObj) || {};
            const copyRecords = [];
            records.forEach(record => {
                copyRecords.push(record.clone(true));
            });
            viewInTableObj[newItemId] = { daLayerItem, records: copyRecords };
            MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'viewInTableObj', viewInTableObj);
            getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'dataActionActiveObj', { activeTabId: newItemId, dataActionTable: true }));
            return true;
        });
    }
}
//# sourceMappingURL=view-in-table.js.map