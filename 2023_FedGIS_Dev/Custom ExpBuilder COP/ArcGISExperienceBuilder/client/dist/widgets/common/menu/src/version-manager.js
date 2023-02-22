import { BaseVersionManager, Immutable } from 'jimu-core';
import { MenuType } from './config';
export const DEFAULT_CONFIG = {
    type: 'HORIZONTAL',
    subOpenMode: 'FOLDABLE',
    main: {
        alignment: 'center',
        space: {
            distance: 0,
            unit: 'px'
        },
        showText: true,
        showIcon: false,
        iconPosition: 'start'
    },
    navType: 'default',
    advanced: false
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
const getSubmenuMode = (menuType, subOpenMode) => {
    if (menuType === MenuType.Horizontal) {
        return 'dropdown';
    }
    else {
        return subOpenMode === 'EXPAND' ? 'static' : 'foldable';
    }
};
const upgradeOnePointOne = (oldConfig) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!oldConfig)
        return;
    const _config = oldConfig;
    const config = Immutable({});
    const type = _config.type === MenuType.Icon ? 'drawer' : 'nav';
    const menuStyle = _config.navType;
    const vertical = _config.type !== MenuType.Horizontal;
    const icon = _config === null || _config === void 0 ? void 0 : _config.icon;
    const anchor = _config === null || _config === void 0 ? void 0 : _config.drawerDirection;
    const submenuMode = getSubmenuMode(_config.type, _config.subOpenMode);
    const textAlign = (_a = _config === null || _config === void 0 ? void 0 : _config.main) === null || _a === void 0 ? void 0 : _a.alignment;
    const showText = (_b = _config === null || _config === void 0 ? void 0 : _config.main) === null || _b === void 0 ? void 0 : _b.showText;
    const showIcon = (_c = _config === null || _config === void 0 ? void 0 : _config.main) === null || _c === void 0 ? void 0 : _c.showIcon;
    const iconPosition = (_d = _config === null || _config === void 0 ? void 0 : _config.main) === null || _d === void 0 ? void 0 : _d.iconPosition;
    const space = (_f = (_e = _config === null || _config === void 0 ? void 0 : _config.main) === null || _e === void 0 ? void 0 : _e.space) !== null && _f !== void 0 ? _f : { distance: 0, unit: 'px' };
    const gap = `${space === null || space === void 0 ? void 0 : space.distance}${space === null || space === void 0 ? void 0 : space.unit}`;
    const standard = {
        icon,
        anchor,
        submenuMode,
        textAlign,
        showIcon,
        showText,
        iconPosition,
        gap
    };
    const advanced = _config.advanced;
    const paper = _config.paper;
    const variant = upgradeThemeNavVariant((_g = _config === null || _config === void 0 ? void 0 : _config.main) === null || _g === void 0 ? void 0 : _g.variants, _config.navType);
    return config
        .set('type', type)
        .set('menuStyle', menuStyle)
        .set('vertical', vertical)
        .set('standard', standard)
        .set('advanced', advanced)
        .set('paper', paper)
        .set('variant', variant);
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [
            {
                version: '1.0.0',
                description: 'The first release.',
                upgrader: oldConfig => {
                    var _a;
                    if (!oldConfig)
                        return DEFAULT_CONFIG;
                    let newConfig = oldConfig;
                    if ((_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.main) === null || _a === void 0 ? void 0 : _a.variants) {
                        newConfig = newConfig.set('advanced', true);
                    }
                    return newConfig;
                }
            },
            {
                version: '1.1.0',
                description: 'Version manager for release 1.1',
                upgrader: (oldConfig) => {
                    return upgradeOnePointOne(oldConfig || DEFAULT_CONFIG);
                }
            }
        ];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map