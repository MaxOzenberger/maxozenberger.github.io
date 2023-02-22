var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseVersionManager, DataSourceManager, Immutable } from 'jimu-core';
import { LayerHonorModeType } from './config';
import { INVISIBLE_FIELD } from './setting/setting-const';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.7.0',
                description: 'Add layerHonorMode to config for support smart form.',
                upgrader: (oldConfig) => __awaiter(this, void 0, void 0, function* () {
                    let newConfig = oldConfig;
                    const decoupleNested = (groupSubItems, fieldsConfig) => {
                        const unnestedFields = [];
                        const recursion = (subItems) => {
                            subItems.forEach(item => {
                                if (item.groupKey) {
                                    recursion(item.children);
                                }
                                else {
                                    const subOrgField = fieldsConfig.find(config => config.name === item.jimuName);
                                    if (!INVISIBLE_FIELD.includes(item.jimuName)) {
                                        unnestedFields.push(Object.assign(Object.assign({}, item), { editable: subOrgField === null || subOrgField === void 0 ? void 0 : subOrgField.editable, editAuthority: (subOrgField === null || subOrgField === void 0 ? void 0 : subOrgField.editable) ? item === null || item === void 0 ? void 0 : item.editAuthority : false }));
                                    }
                                }
                            });
                            return unnestedFields;
                        };
                        return recursion(groupSubItems);
                    };
                    return yield Promise.all(newConfig.layersConfig.map(layerConfig => {
                        return new Promise(resolve => {
                            DataSourceManager.getInstance().createDataSourceByUseDataSource(layerConfig.useDataSource).then(currentDs => {
                                const layerDefinition = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getLayerDefinition();
                                const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
                                const newGroupedFields = layerConfig.groupedFields.map(field => {
                                    var _a;
                                    const orgField = fieldsConfig.find(config => config.name === field.jimuName);
                                    if (field.groupKey) {
                                        return Object.assign(Object.assign({}, field), { editable: true, editAuthority: !((_a = field === null || field === void 0 ? void 0 : field.children) === null || _a === void 0 ? void 0 : _a.some(item => item.editAuthority === false)), children: decoupleNested(field === null || field === void 0 ? void 0 : field.children, fieldsConfig) });
                                    }
                                    return Object.assign(Object.assign({}, field), { editable: orgField === null || orgField === void 0 ? void 0 : orgField.editable, editAuthority: (orgField === null || orgField === void 0 ? void 0 : orgField.editable) ? field === null || field === void 0 ? void 0 : field.editAuthority : false });
                                }).filter(item => !INVISIBLE_FIELD.includes(item.jimuName));
                                resolve(newGroupedFields);
                            });
                        });
                    })).then(res => {
                        res.forEach((resItem, i) => {
                            const selectedFields = newConfig.layersConfig[i].showFields.filter(item => !INVISIBLE_FIELD.includes(item.jimuName));
                            let unGroupedFields = [];
                            const resGroupedFields = resItem.asMutable({ deep: true });
                            resItem.forEach(item => {
                                if (item.groupKey) {
                                    unGroupedFields = unGroupedFields.concat(item.children);
                                }
                                else {
                                    unGroupedFields.push(item);
                                }
                            });
                            selectedFields.forEach(ele => {
                                if (!unGroupedFields.find(field => field.jimuName === ele.jimuName)) {
                                    resGroupedFields.push(ele);
                                }
                            });
                            newConfig = newConfig.setIn(['layersConfig', i, 'groupedFields'], Immutable(resGroupedFields));
                            newConfig = newConfig.setIn(['layersConfig', i, 'layerHonorMode'], LayerHonorModeType.Custom);
                        });
                        return Promise.resolve(newConfig);
                    });
                })
            }, {
                version: '1.10.0',
                description: 'Set old app default snapping to true',
                upgrader: (oldConfig) => __awaiter(this, void 0, void 0, function* () {
                    let newConfig = oldConfig;
                    newConfig = newConfig.set('selfSnapping', true).set('featureSnapping', true);
                    return newConfig;
                })
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map