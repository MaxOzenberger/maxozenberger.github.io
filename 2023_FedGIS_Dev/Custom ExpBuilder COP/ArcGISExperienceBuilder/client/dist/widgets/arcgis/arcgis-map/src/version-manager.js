import { BaseVersionManager, Immutable } from 'jimu-core';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.10.0',
                description: '1.10.0',
                upgrader: (oldConfig) => {
                    let newConfig;
                    if (oldConfig.toolConifg) {
                        // fix typo for 'toolConifg'
                        newConfig = Immutable.without(oldConfig, 'toolConifg');
                        newConfig = newConfig.set('toolConfig', oldConfig.toolConifg);
                    }
                    return newConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map