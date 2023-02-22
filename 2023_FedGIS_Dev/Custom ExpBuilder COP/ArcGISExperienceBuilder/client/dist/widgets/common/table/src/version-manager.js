import { BaseVersionManager } from 'jimu-core';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.6.0',
                description: 'Add editable to table fields.',
                upgrader: (oldConfig, id) => {
                    let newConfig = oldConfig;
                    if (newConfig.layersConfig.length === 0) {
                        return newConfig;
                    }
                    newConfig.layersConfig.forEach((config, i) => {
                        const newTableFields = config.tableFields.map(field => {
                            return Object.assign(Object.assign({}, field), { editAuthority: true });
                        });
                        newConfig = newConfig.setIn(['layersConfig', i, 'tableFields'], newTableFields);
                    });
                    return newConfig;
                }
            }, {
                version: '1.10.0',
                description: 'Add visible to table fields.',
                upgrader: (oldConfig) => {
                    let newConfig = oldConfig;
                    if (newConfig.layersConfig.length === 0) {
                        return newConfig;
                    }
                    newConfig.layersConfig.forEach((config, i) => {
                        const newTableFields = config.tableFields.map(field => {
                            return Object.assign(Object.assign({}, field), { visible: true });
                        });
                        newConfig = newConfig.setIn(['layersConfig', i, 'tableFields'], newTableFields);
                    });
                    return newConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map