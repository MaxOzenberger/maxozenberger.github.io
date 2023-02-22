var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseVersionManager, JimuFieldType, loadArcGISJSAPIModules, UtilityManager } from 'jimu-core';
import { OutputDsAddress, SearchServiceType } from 'jimu-ui/advanced/setting-components';
export const AddressSchema = {
    jimuName: OutputDsAddress,
    alias: 'ADDRESS',
    type: JimuFieldType.String,
    name: OutputDsAddress
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [
            {
                version: '1.9.0',
                description: 'For geocode service, use arrary of Schema to set displayFields',
                upgrader: (oldConfig) => {
                    var _a, _b;
                    const newDatasourceConfig = (_b = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a.datasourceConfig) === null || _b === void 0 ? void 0 : _b.map(dsConfig => {
                        if ((dsConfig === null || dsConfig === void 0 ? void 0 : dsConfig.searchServiceType) === SearchServiceType.FeatureService) {
                            return dsConfig;
                        }
                        else {
                            if (dsConfig === null || dsConfig === void 0 ? void 0 : dsConfig.displayFields) {
                                return dsConfig;
                            }
                            else {
                                dsConfig.displayFields = [AddressSchema];
                                dsConfig.addressFields = [AddressSchema];
                                dsConfig.defaultAddressFieldName = AddressSchema.jimuName;
                                return dsConfig;
                            }
                        }
                    });
                    return oldConfig.setIn(['datasourceConfig'], newDatasourceConfig);
                }
            },
            {
                version: '1.10.0',
                description: 'For locator service, need to save support for suggest in config',
                upgrader: (oldConfig) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const getUrlOfUseUtility = (useUtility) => __awaiter(this, void 0, void 0, function* () {
                        return UtilityManager.getInstance().getUrlOfUseUtility(useUtility)
                            .then((url) => {
                            return Promise.resolve(url);
                        });
                    });
                    const newDatasourceConfigPromise = (_b = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a.datasourceConfig) === null || _b === void 0 ? void 0 : _b.map(dsConfig => {
                        if ((dsConfig === null || dsConfig === void 0 ? void 0 : dsConfig.searchServiceType) === SearchServiceType.FeatureService) {
                            return Promise.resolve(dsConfig);
                        }
                        else {
                            return getUrlOfUseUtility(dsConfig === null || dsConfig === void 0 ? void 0 : dsConfig.useUtility).then(url => {
                                return loadArcGISJSAPIModules(['esri/request']).then(modules => {
                                    const [esriRequest] = modules;
                                    return esriRequest(url, {
                                        query: {
                                            f: 'json'
                                        },
                                        responseType: 'json'
                                    }).then(res => {
                                        var _a;
                                        const result = (res === null || res === void 0 ? void 0 : res.data) || {};
                                        if (result === null || result === void 0 ? void 0 : result.capabilities) {
                                            const capabilitiesArr = ((_a = result === null || result === void 0 ? void 0 : result.capabilities) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
                                            const isSupportSuggest = capabilitiesArr === null || capabilitiesArr === void 0 ? void 0 : capabilitiesArr.includes('Suggest');
                                            dsConfig.isSupportSuggest = isSupportSuggest;
                                            return Promise.resolve(dsConfig);
                                        }
                                        else {
                                            return Promise.resolve(dsConfig);
                                        }
                                    });
                                });
                            });
                        }
                    });
                    const newDatasourceConfig = newDatasourceConfigPromise ? yield Promise.all(newDatasourceConfigPromise) : [];
                    return oldConfig.setIn(['datasourceConfig'], newDatasourceConfig);
                })
            }
        ];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map