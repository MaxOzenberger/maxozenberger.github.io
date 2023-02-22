import { BaseVersionManager, Immutable } from 'jimu-core';
export const DEFAULT_CONFIG = {
    data: {
        type: 'AUTO',
        section: '',
        views: []
    },
    display: {
        advanced: false,
        vertical: false,
        navType: 'default',
        alignment: 'center',
        showText: true,
        showIcon: false,
        iconPosition: 'start'
    }
};
const upgradeThemeNavVariant = (variants, type) => {
    if (!variants)
        return;
    const _variant = variants === null || variants === void 0 ? void 0 : variants[type];
    if (!_variant)
        return;
    let variant = _variant;
    if (_variant.bg) {
        variant = variant.setIn(['root', 'bg'], _variant.bg);
        variant = variant.without('bg');
    }
    return variant;
};
const upgradeOnePointOne = (oldConfig) => {
    const config = oldConfig;
    if (!oldConfig)
        return;
    const _display = config.display;
    if (!_display)
        return oldConfig;
    let display = Immutable({});
    const variant = upgradeThemeNavVariant(_display.variants, _display.navType);
    display = display.set('type', 'nav')
        .set('vertical', _display.vertical)
        .set('advanced', _display.advanced)
        .set('navStyle', _display.navType)
        .set('standard', {
        scrollable: true,
        textAlign: _display.alignment,
        showText: _display.showText,
        showIcon: _display.showIcon,
        iconPosition: _display.iconPosition
    })
        .set('variant', variant);
    return config.set('display', display);
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.0.0',
                description: 'Version manager for release 1.0.0',
                upgrader: (oldConfig) => {
                    var _a;
                    if (!oldConfig)
                        return DEFAULT_CONFIG;
                    let newConfig = oldConfig;
                    if ((_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.display) === null || _a === void 0 ? void 0 : _a.variants) {
                        newConfig = newConfig.setIn(['display', 'advanced'], true);
                    }
                    return newConfig;
                }
            }, {
                version: '1.1.0',
                description: 'Version manager for release 1.1.0',
                upgrader: (oldConfig) => {
                    return upgradeOnePointOne(oldConfig || DEFAULT_CONFIG);
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map