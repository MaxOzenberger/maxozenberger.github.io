var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { render as _render, queries as _queries } from '@testing-library/react';
import { React, IntlProvider, ReactRedux, getAppStore, Immutable, SupportedLayerTypes } from 'jimu-core';
import { mount, render as enzymeRender } from 'enzyme';
import * as customQueries from './custom-queries';
import mockTheme from './theme-mock';
import { ThemeProvider, getTheme, setThemeModule, ThemeStore } from 'jimu-theme';
const queries = Object.assign(Object.assign({}, _queries), customQueries);
/** The render method used to render components. */
export const render = (ui, options) => {
    return _render(ui, Object.assign({ queries }, options));
};
/**
 * Create a wrapper with `ThemeProvider` and `IntlProvider`.
 * @param theme
 * @param locale
 * @param messages
 */
export const ThemeIntlWrapper = (theme, locale, messages, theme2) => {
    return ({ children }) => {
        return (React.createElement(ThemeProvider, { theme: theme, theme2: theme2 },
            React.createElement(IntlProvider, { locale: locale, messages: messages }, children)));
    };
};
/**
 * Create a wrapper with `ThemeProvider`.
 * @param theme
 */
export const ThemeWrapper = (theme, theme2) => {
    return ({ children }) => {
        return (React.createElement(ThemeProvider, { theme: theme, theme2: theme2 }, children));
    };
};
/**
 * Create a wrapper with `IntlProvider`.
 * @param locale
 * @param messages
 */
export const IntlWrapper = (locale, messages) => {
    return ({ children }) => {
        return (React.createElement(IntlProvider, { locale: locale, messages: messages }, children));
    };
};
/**
 * Create a wrapper with `ReactRedux.Provider`.
 * @param store
 */
export const StoreWrapper = (store) => {
    return ({ children }) => {
        return (React.createElement(ReactRedux.Provider, { store: store }, children));
    };
};
/**
 * Create a wrapper with `ReactRedux.Provider` and `IntlProvider`.
 * @param store
 * @param locale
 * @param messages
 */
export const StoreIntlWrapper = (store, locale, messages) => {
    var _a;
    locale = locale || ((_a = store.getState().appContext) === null || _a === void 0 ? void 0 : _a.locale) || 'en';
    messages = messages || store.getState().appI18nMessages || {};
    return ({ children }) => {
        return (React.createElement(ReactRedux.Provider, { store: store },
            React.createElement(IntlProvider, { locale: locale, messages: messages }, children)));
    };
};
/**
 * Create a wrapper with `ReactRedux.Provider` and `ThemeProvider`.
 * @param store
 * @param theme
 */
export const StoreThemeWrapper = (store, theme, theme2) => {
    theme = theme || getTheme() || mockTheme;
    return ({ children }) => {
        return (React.createElement(ReactRedux.Provider, { store: store },
            React.createElement(ThemeProvider, { theme: theme, theme2: theme2 }, children)));
    };
};
/**
 * Create a wrapper with `ReactRedux.Provider`, `ThemeProvider` and `IntlProvider`.
 * @param store
 * @param theme
 * @param locale
 * @param messages
 */
export const StoreThemeIntlWrapper = (store, theme, locale, messages, theme2) => {
    var _a;
    locale = locale || ((_a = store.getState().appContext) === null || _a === void 0 ? void 0 : _a.locale) || 'en';
    messages = messages || store.getState().appI18nMessages || {};
    theme = theme || getTheme() || mockTheme;
    return ({ children }) => {
        return (React.createElement(ReactRedux.Provider, { store: store },
            React.createElement(ThemeProvider, { theme: theme, theme2: theme2 },
                React.createElement(IntlProvider, { locale: locale, messages: messages }, children))));
    };
};
/**
 * Create a custom render function with `ThemeProvider` and `IntlProvider`.
 * @param theme
 * @param locale
 * @param messages
 */
export const withThemeIntlRender = (theme = mockTheme, locale = 'en', messages = {}, theme2) => {
    ThemeStore.setModule(getTestThemeModule(theme));
    theme2 && ThemeStore.setModule2(getTestThemeModule(theme2, 'theme2/test'));
    return (ui, options) => render(ui, Object.assign({ wrapper: ThemeIntlWrapper(theme, locale, messages, theme2) }, options));
};
/**
 * Create a custom render function with `ThemeProvider`.
 * @param theme
 */
export const withThemeRender = (theme = mockTheme, theme2) => {
    ThemeStore.setModule(getTestThemeModule(theme));
    theme2 && ThemeStore.setModule2(getTestThemeModule(theme2, 'theme2/test'));
    return (ui, options) => render(ui, Object.assign({ wrapper: ThemeWrapper(theme, theme2) }, options));
};
/**
 * Create a custom render function with `IntlProvider`.
 * @param locale
 * @param messages
 */
export const withIntlRender = (locale = 'en', messages = {}) => {
    return (ui, options) => render(ui, Object.assign({ wrapper: IntlWrapper(locale, messages) }, options));
};
/**
 * Create a custom render function with `ReactRedux.Provider`.
 * @param store
 */
export const withStoreRender = (store = getAppStore()) => {
    return (ui, options) => render(ui, Object.assign({ wrapper: StoreWrapper(store) }, options));
};
/**
 * Create a custom render function with `ReactRedux.Provider` and `IntlProvider`.
 * @param store
 * @param locale
 * @param messages
 */
export const withStoreIntlRender = (store = getAppStore(), locale, messages) => {
    return (ui, options) => render(ui, Object.assign({ wrapper: StoreIntlWrapper(store, locale, messages) }, options));
};
/**
 * Create a custom render function with `ReactRedux.Provider` and `ThemeProvider`.
 * @param store
 * @param theme
 */
export const withStoreThemeRender = (store = getAppStore(), theme = mockTheme, theme2) => {
    ThemeStore.setModule(getTestThemeModule(theme));
    theme2 && ThemeStore.setModule2(getTestThemeModule(theme2, 'theme2/test'));
    return (ui, options) => render(ui, Object.assign({ wrapper: StoreThemeWrapper(store, theme, theme2) }, options));
};
/**
 * Create a custom render function with `ReactRedux.Provider`, `ThemeProvider` and `IntlProvider`.
 * @param store
 * @param theme
 * @param locale
 * @param messages
 */
export const withStoreThemeIntlRender = (store = getAppStore(), theme, locale, messages, theme2) => {
    ThemeStore.setModule(getTestThemeModule(theme));
    theme2 && ThemeStore.setModule2(getTestThemeModule(theme2, 'theme2/test'));
    return (ui, options) => render(ui, Object.assign({ wrapper: StoreThemeIntlWrapper(store, theme, locale, messages, theme2) }, options));
};
/**
 * Used to render a widget component.
 */
export const widgetRender = withStoreThemeIntlRender;
/**
 * Used to render a widget setting component.
 */
export const widgetSettingRender = withStoreThemeIntlRender;
/**
 * @ignore
 * Full DOM rendering component with `ReactRedux.Provider`.
 * @param store
 * @param children
 */
export const mountWithStoreEnzyme = (store, children) => {
    return (mount(React.createElement(ReactRedux.Provider, { store: store }, children)));
};
/**
 * @ignore
 * Shallow rendering component with `ReactRedux.Provider`.
 * @param store
 * @param children
 */
export const renderWithStoreEnzyme = (store, children) => {
    return (enzymeRender(React.createElement(ReactRedux.Provider, { store: store }, children)));
};
/**
 * Create a function to run the passed function asynchronously.
 * @param timeout
 * @param useFakeTimers
 */
export const runFuncAsync = (timeout = 0, useFakeTimers) => (callback, ...args) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(callback.apply(null, args));
            }
            catch (error) {
                reject(error);
            }
        }, timeout);
        useFakeTimers && jest.runOnlyPendingTimers();
    });
};
/**
 * Return a promise to resolve a value after waiting a certain number of milliseconds.
 * @param milliseconds
 * @param value
 */
export const waitForMilliseconds = (milliseconds = 0, value) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve(value); }, milliseconds);
    });
};
/**
 * Determine whether a component is a Class component.
 */
export function isClassComponent(component) {
    var _a;
    return typeof component === 'function' && !!((_a = component.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent);
}
const getTestThemeModule = (theme, uri = 'theme/test') => ({
    uri,
    manifest: Immutable({ styleFiles: { js: true } }),
    variables: Immutable({}),
    theme
});
/**
 * Update the currently used theme for getTheme.
 * @param theme
 */
export const setTheme = (theme) => {
    const module = getTestThemeModule(theme);
    setThemeModule(module);
};
/**
* Update the currently used theme2 for getTheme2.
* @ignore
* @param theme
*/
export const setTheme2 = (theme) => {
    const module = getTestThemeModule(theme);
    ThemeStore.setModule2(module);
};
export function mockJSAPIMap(needToMockMapItems) {
    return jest.fn().mockImplementation(options => {
        var _a;
        const mapItem = needToMockMapItems[(_a = options.portalItem) === null || _a === void 0 ? void 0 : _a.id];
        const mapInstance = {
            isFulfilled: () => true,
            layers: {
                toArray: () => {
                    if (!mapItem) {
                        return [];
                    }
                    return mapItem.itemData.operationalLayers.map(l => mockJSAPILayerInstance(l));
                }
            },
            tables: {
                toArray: () => []
            },
            when: (func) => __awaiter(this, void 0, void 0, function* () {
                return func();
            })
        };
        mapInstance.allLayers = mapInstance.layers;
        return mapInstance;
    });
}
/**
 * @param needToMockLayers key is layer id, value is operational layer of map item data
 */
export function mockJSAPILayer(needToMockLayers) {
    return jest.fn().mockImplementation(options => {
        const layer = Object.values(needToMockLayers).find(l => l.url === options.url);
        return Object.assign(Object.assign({}, options), mockJSAPILayerInstance(layer));
    });
}
/**
 * @param layer operational layer of map item data
 */
function mockJSAPILayerInstance(layer) {
    var _a, _b;
    if (!layer) {
        return null;
    }
    if (layer.layerType === 'ArcGISFeatureLayer') {
        layer.type = SupportedLayerTypes.FeatureLayer;
    }
    else if (layer.layerType === 'GroupLayer') {
        layer.type = SupportedLayerTypes.GroupLayer;
    }
    else if (layer.layerType === 'ArcGISMapServiceLayer') {
        layer.type = SupportedLayerTypes.MapImageLayer;
    }
    else if (layer.layerType === 'ArcGISSceneServiceLayer') {
        layer.type = SupportedLayerTypes.SceneLayer;
    }
    const layerInstance = Object.assign(Object.assign({}, layer), { portalItem: {
            id: layer.itemId
        }, load: () => __awaiter(this, void 0, void 0, function* () { }), loadAll: () => __awaiter(this, void 0, void 0, function* () { }), fields: ((_b = (_a = layer.layerDefinition) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.map(f => ({ toJSON: () => f }))) || [], sourceJSON: layer.layerDefinition, queryFeatures: () => __awaiter(this, void 0, void 0, function* () { return ({}); }), queryFeatureCount: () => __awaiter(this, void 0, void 0, function* () { return ({}); }), applyEdits: () => __awaiter(this, void 0, void 0, function* () { return ({}); }), layers: {
            toArray: () => {
                if (!layer.layers) {
                    return [];
                }
                return layer.layers.map(l => mockJSAPILayerInstance(l));
            }
        }, sublayers: {
            toArray: () => []
        } });
    return layerInstance;
}
//# sourceMappingURL=test-utils.js.map