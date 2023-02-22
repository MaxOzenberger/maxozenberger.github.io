var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseVersionManager, DataSourceManager, getAppStore } from 'jimu-core';
import { updateSQLExpressionByVersion } from 'jimu-ui/basic/sql-expression-runtime';
import { ListLayoutType, DirectionType } from './config';
const getDs = function (filter, widgetId) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let ds;
        const dataSource = (_d = (_c = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.widgets[widgetId]) === null || _c === void 0 ? void 0 : _c.useDataSources) === null || _d === void 0 ? void 0 : _d[0];
        const dsManager = DataSourceManager.getInstance();
        if (filter && dataSource) {
            ds = dsManager.createDataSourceByUseDataSource(Object.assign({}, dataSource, {
                mainDataSourceId: dataSource.mainDataSourceId
            }), 'localId');
        }
        return yield Promise.resolve(ds);
    });
};
const checkIsShowAutoRefreshSetting = (datasource) => {
    if (!datasource)
        return false;
    const interval = (datasource === null || datasource === void 0 ? void 0 : datasource.getAutoRefreshInterval()) || 0;
    return interval > 0;
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [
            {
                version: '1.1.0',
                description: '',
                upgrader: (oldConfig, id) => __awaiter(this, void 0, void 0, function* () {
                    const filter = oldConfig.filter;
                    return yield getDs(filter, id).then(ds => {
                        let newConfig = oldConfig;
                        const newFItems = filter
                            ? updateSQLExpressionByVersion(filter, '1.1.0', ds)
                            : null;
                        newConfig = newConfig.set('filter', newFItems);
                        return newConfig;
                    });
                })
            },
            {
                version: '1.5.0',
                description: '1.5.0',
                upgrader: (oldConfig, id) => __awaiter(this, void 0, void 0, function* () {
                    const filter = oldConfig.filter;
                    return yield getDs(filter, id).then(ds => {
                        let newConfig = oldConfig;
                        if (typeof (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.isShowAutoRefresh) !== 'boolean') {
                            const isShowAutoRefresh = checkIsShowAutoRefreshSetting(ds);
                            newConfig = newConfig.set('isShowAutoRefresh', isShowAutoRefresh);
                        }
                        return newConfig;
                    });
                })
            },
            {
                version: '1.8.0',
                description: '1.8.0',
                upgrader: (oldConfig, id) => __awaiter(this, void 0, void 0, function* () {
                    let newConfig = oldConfig;
                    if ((oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.direction) && !(oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.layoutType)) {
                        const layoutType = (oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.direction) === DirectionType.Horizon ? ListLayoutType.Column : ListLayoutType.Row;
                        newConfig = newConfig.set('layoutType', layoutType).set('keepAspectRatio', false);
                    }
                    return newConfig;
                })
            }
        ];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map