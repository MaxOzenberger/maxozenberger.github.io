import { BaseVersionManager } from 'jimu-core';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.10.0',
                description: 'allow users to reorder the media list, #6473',
                upgrader: (oldConfig) => {
                    // default templates before 1.10
                    const POPUP_MODE_DEFAULT_ITEMS = ['embed', 'qrcode', 'email', 'facebook', 'twitter', 'pinterest', 'linkedin'];
                    const INLINE_MODE_DEFAULT_ITEMS = ['facebook', 'twitter', 'pinterest', 'linkedin', 'embed', 'qrcode', 'email', 'sharelink'];
                    // updater
                    function undateOldItems(itemsInOldConfig, DEFAULT_ITEMS) {
                        const newItmes = []; // Array<{id: ItemsName, enable: boolean}>
                        DEFAULT_ITEMS.forEach((ITEM) => {
                            const found = (itemsInOldConfig.findIndex((itemName) => (itemName === ITEM)) > -1);
                            let enable = false;
                            if (found) {
                                enable = true;
                            }
                            newItmes.push({ id: ITEM, enable: enable });
                        });
                        return newItmes;
                    }
                    // items upgrad
                    // 1.popup
                    oldConfig = oldConfig.setIn(['popup', 'items'], (undateOldItems(oldConfig.popup.items, POPUP_MODE_DEFAULT_ITEMS)));
                    // 2.inline
                    oldConfig = oldConfig.setIn(['inline', 'items'], (undateOldItems(oldConfig.inline.items, INLINE_MODE_DEFAULT_ITEMS)));
                    return oldConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map