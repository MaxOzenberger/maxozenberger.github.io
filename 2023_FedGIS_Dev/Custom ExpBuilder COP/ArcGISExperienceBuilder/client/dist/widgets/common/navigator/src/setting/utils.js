import { React, Immutable, ReactRedux, getAppStore, LayoutItemType } from 'jimu-core';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import { getNavigationVariables } from 'jimu-theme';
const { useMemo } = React;
const END_NUMBER_REGEXP = /\d+$/;
export const getAppConfig = () => getAppStore().getState().appStateInBuilder.appConfig;
export const toMultiSelectItems = (views) => {
    var _a;
    const appConfig = getAppConfig();
    return (_a = views === null || views === void 0 ? void 0 : views.map(value => {
        var _a, _b;
        const label = (_b = (_a = appConfig.views) === null || _a === void 0 ? void 0 : _a[value]) === null || _b === void 0 ? void 0 : _b.label;
        return {
            label,
            value
        };
    })) !== null && _a !== void 0 ? _a : [];
};
export const getEndNumber = (string) => {
    const match = string.match(END_NUMBER_REGEXP);
    return (match === null || match === void 0 ? void 0 : match[0]) ? Number(match[0]) : 0;
};
//Get the label of section
export const getSectionLabel = (sectionId) => {
    var _a, _b, _c;
    const appConfig = getAppConfig();
    return (_c = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.sections) === null || _a === void 0 ? void 0 : _a[sectionId]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : '';
};
//Convert views to the data of multi-select component
export const getViewSelectItems = (views) => {
    const selectItems = toMultiSelectItems(views);
    return Immutable(selectItems);
};
export const getViewNavigationVariant = (type, navStyle) => {
    var _a;
    const variants = getNavigationVariables();
    let variant = (_a = variants === null || variants === void 0 ? void 0 : variants[type]) === null || _a === void 0 ? void 0 : _a[navStyle];
    const mixin = {
        item: {
            default: {
                icon: {
                    size: '8px'
                },
                size: '14px'
            },
            active: {
                icon: {
                    color: 'var(--primary)',
                    size: '8px'
                },
                size: '14px'
            },
            hover: {
                icon: {
                    color: 'var(--primary)',
                    size: '8px'
                },
                size: '14px'
            }
        }
    };
    variant = Immutable(variant).merge(mixin, { deep: true });
    return variant;
};
//Get theme navigation variants from theme
export const useViewNavigationVariant = (type, navStyle, advanced, advanceVariant) => {
    return useMemo(() => {
        if (advanced)
            return advanceVariant;
        return getViewNavigationVariant(type, navStyle);
    }, [advanced, advanceVariant, type, navStyle]);
};
export const useContainerSections = (id) => {
    const layouts = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.layouts; });
    const sections = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.sections; });
    const sizeMode = ReactRedux.useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.browserSizeMode; });
    return React.useMemo(() => {
        const appConfig = getAppStore().getState().appStateInBuilder.appConfig;
        return searchUtils.getContentsInTheSameContainer(appConfig, id, LayoutItemType.Widget, LayoutItemType.Section, sizeMode) || [];
        // We listen for changes in appConfig.sections and appConfig.layouts instead of appConfig, which can reduce the number of times we re render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, sizeMode, sections, layouts]);
};
export const useSectionViews = (section) => {
    return ReactRedux.useSelector((state) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.sections) === null || _c === void 0 ? void 0 : _c[section]) === null || _d === void 0 ? void 0 : _d.views; });
};
//# sourceMappingURL=utils.js.map