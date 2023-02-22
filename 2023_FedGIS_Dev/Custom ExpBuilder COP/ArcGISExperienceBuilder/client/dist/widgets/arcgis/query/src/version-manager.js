import { BaseVersionManager } from 'jimu-core';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.5.0',
                description: '1.5.0',
                upgrader: (oldConfig) => {
                    var _a;
                    let newConfig = oldConfig;
                    (_a = oldConfig.queryItems) === null || _a === void 0 ? void 0 : _a.forEach((queryItem, index) => {
                        if (queryItem.useAttributeFilter == null) {
                            newConfig = newConfig.setIn(['queryItems', index, 'useAttributeFilter'], true);
                        }
                        if (queryItem.useSpatialFilter == null) {
                            newConfig = newConfig.setIn(['queryItems', index, 'useSpatialFilter'], true);
                        }
                    });
                    return newConfig;
                }
            }, {
                version: '1.6.0',
                description: '1.6.0',
                upgrader: (oldConfig) => {
                    var _a;
                    let newConfig = oldConfig;
                    if (((_a = oldConfig.queryItems) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        const firstItem = oldConfig.queryItems[0];
                        newConfig = newConfig.set('resultListDirection', firstItem.resultListDirection);
                        newConfig = newConfig.set('resultPagingStyle', firstItem.resultPagingStyle);
                    }
                    return newConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map