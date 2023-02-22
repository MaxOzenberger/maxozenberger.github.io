import { React, Immutable } from 'jimu-core';
import { getNavigationVariables } from 'jimu-theme';
const { useMemo } = React;
export const getMenuNavigationVariant = (type, navStyle) => {
    var _a;
    const variants = getNavigationVariables();
    let variant = (_a = variants === null || variants === void 0 ? void 0 : variants[type]) === null || _a === void 0 ? void 0 : _a[navStyle];
    const activeColor = navStyle === 'pills' ? 'var(--white)' : 'var(--primary)';
    const mixin = {
        item: {
            default: {
                icon: {
                    size: '14px'
                },
                size: '14px'
            },
            active: {
                icon: {
                    color: activeColor,
                    size: '14px'
                },
                size: '14px'
            },
            hover: {
                icon: {
                    color: 'var(--primary)',
                    size: '14px'
                },
                size: '14px'
            }
        }
    };
    variant = variant ? Immutable(variant).merge(mixin, { deep: true }) : mixin;
    return variant;
};
// Get theme navigation variants from theme
export const useMenuNavigationVariant = (type, menuStyle, advanced, advanceVariant) => {
    return useMemo(() => {
        if (advanced)
            return advanceVariant;
        return getMenuNavigationVariant(type, menuStyle);
    }, [advanced, advanceVariant, type, menuStyle]);
};
//# sourceMappingURL=utils.js.map