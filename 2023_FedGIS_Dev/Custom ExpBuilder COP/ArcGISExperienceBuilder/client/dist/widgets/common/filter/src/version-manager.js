var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseVersionManager, DataSourceManager } from 'jimu-core';
import { FilterArrangeType, FilterTriggerType } from './config';
import { updateSQLExpressionByVersion } from 'jimu-ui/basic/sql-expression-runtime';
const getAllDs = function (filterItems) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        const dsManager = DataSourceManager.getInstance();
        filterItems && filterItems.forEach(item => {
            if (item.sqlExprObj) {
                promises.push(dsManager.createDataSourceByUseDataSource(Object.assign({}, item.dataSource, { mainDataSourceId: item.dataSource.dataSourceId })));
            }
        });
        return Promise.all(promises);
    });
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.1.0',
                description: '',
                upgrader: (oldConfig) => __awaiter(this, void 0, void 0, function* () {
                    return yield getAllDs(oldConfig.filterItems).then((dsList) => {
                        let newConfig = oldConfig;
                        newConfig = newConfig.set('arrangeType', FilterArrangeType.Block);
                        newConfig = newConfig.set('triggerType', FilterTriggerType.Toggle);
                        newConfig = newConfig.set('wrap', false);
                        newConfig = newConfig.set('omitInternalStyle', false);
                        const newFItems = dsList.map((ds, index) => {
                            const fItem = newConfig.filterItems[index];
                            return Object.assign({}, fItem, {
                                sqlExprObj: fItem.sqlExprObj ? updateSQLExpressionByVersion(fItem.sqlExprObj, '1.1.0', ds) : null,
                                icon: fItem.icon.setIn(['properties', 'color'], null),
                                useDataSource: Object.assign({}, fItem.dataSource, { mainDataSourceId: fItem.dataSource.dataSourceId })
                            });
                        });
                        newConfig = newConfig.set('filterItems', newFItems);
                        return newConfig;
                    });
                })
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map