import { BaseVersionManager } from 'jimu-core';
export const DEFAULT_CONFIG = {
    behavior: {
        onlyOpenOne: true,
        openStarts: [],
        displayType: 'STACK',
        vertical: false,
        size: {}
    },
    appearance: {
        space: 0,
        advanced: false,
        card: {
            showLabel: false,
            labelGrowth: 10,
            avatar: {
                type: 'primary',
                size: 'default',
                shape: 'circle'
            }
        }
    }
};
const mapOldConfigSize = (oldSize) => {
    if (oldSize === 'SMALL')
        return 'sm';
    if (oldSize === 'MEDIUM')
        return 'default';
    if (oldSize === 'LARGE')
        return 'lg';
    return oldSize;
};
const getThemeButtonVariant = (variants, type = 'primary') => {
    return variants === null || variants === void 0 ? void 0 : variants[type];
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.0.0',
                description: 'Version manager for release 1.0.0',
                upgrader: (oldConfig) => {
                    if (!oldConfig)
                        return DEFAULT_CONFIG;
                    if (!oldConfig.behavior || !oldConfig.appearance) {
                        let newConfig = oldConfig;
                        if (!oldConfig.behavior) {
                            newConfig = newConfig.setIn(['behavior', 'openStarts'], []);
                            newConfig = newConfig.setIn(['behavior', 'onlyOpenOne'], oldConfig.onlyOpenOne);
                            newConfig = newConfig.setIn(['behavior', 'displayType'], oldConfig.displayType);
                            newConfig = newConfig.setIn(['behavior', 'vertical'], oldConfig.vertical);
                            newConfig = newConfig.setIn(['behavior', 'size'], oldConfig.size);
                            newConfig = newConfig.without(['onlyOpenOne', 'displayType', 'size']);
                        }
                        if (!oldConfig.appearance) {
                            newConfig = newConfig.setIn(['appearance', 'advanced'], false);
                            if (!oldConfig.vertical) {
                                newConfig = newConfig.setIn(['appearance', 'space'], 0);
                                newConfig = newConfig.setIn(['appearance', 'card', 'labelGrowth'], oldConfig.space);
                            }
                            else {
                                newConfig = newConfig.setIn(['appearance', 'space'], oldConfig.space);
                            }
                            newConfig = newConfig.setIn(['appearance', 'card', 'showLabel'], oldConfig.showLabel);
                            newConfig = newConfig.setIn(['appearance', 'card', 'avatar', 'size'], mapOldConfigSize(oldConfig.iconSize));
                            newConfig = newConfig.setIn(['appearance', 'card', 'avatar', 'shape'], oldConfig.iconStyle);
                            newConfig = newConfig.setIn(['appearance', 'card', 'avatar', 'type'], 'primary');
                            newConfig = newConfig.without(['space', 'showLabel', 'iconSize', 'iconStyle', 'vertical']);
                        }
                        return newConfig;
                    }
                    else {
                        return oldConfig;
                    }
                }
            }, {
                version: '1.1.0',
                description: 'Version manager for release 1.1.0',
                upgrader: (oldConfig) => {
                    var _a, _b;
                    if (!oldConfig)
                        return DEFAULT_CONFIG;
                    let card = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.appearance) === null || _a === void 0 ? void 0 : _a.card;
                    const variants = card === null || card === void 0 ? void 0 : card.variants;
                    const type = (_b = card === null || card === void 0 ? void 0 : card.avatar) === null || _b === void 0 ? void 0 : _b.type;
                    let newConfig = oldConfig;
                    if (variants) {
                        const variant = getThemeButtonVariant(variants, type);
                        card = card === null || card === void 0 ? void 0 : card.set('variant', variant).without('variants');
                        newConfig = newConfig.setIn(['appearance', 'card'], card);
                    }
                    return newConfig;
                }
            }, {
                version: '1.6.0',
                description: 'Version manager for release 1.6.0',
                upgrader: (oldConfig) => {
                    var _a;
                    if (!oldConfig)
                        return DEFAULT_CONFIG;
                    let card = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.appearance) === null || _a === void 0 ? void 0 : _a.card;
                    let newConfig = oldConfig;
                    if (card) {
                        card = card.set('showTooltip', true);
                        newConfig = newConfig.setIn(['appearance', 'card'], card);
                    }
                    return newConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map