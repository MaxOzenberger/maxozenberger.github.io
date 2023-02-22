import { ExtensionManager, extensionSpec, Immutable, getAppStore, appActions, version, DataSourceTypes, BrowserSizeMode } from 'jimu-core';
import { ArcGISDependencyDefineExtension, ArcGISDataSourceFactoryUriExtension } from 'jimu-arcgis';
import { mockSystemJs } from './lib/mock-systemjs';
import * as mockData from './lib/mock-data';
export * from './lib/widget-wrapper';
export * from './lib/widget-setting-wrapper';
export * from './lib/test-utils';
export * from './lib/mock-service';
export * from './lib/mock-item';
export * from './lib/mock-get-selections';
export * from './lib/mock-systemjs';
export * from './lib/mock-window-location';
export * from './lib/mock-numeric-input';
export { mockData };
/**
 * Init globals to make test easy.
 */
export function initGlobal() {
    window.jimuConfig = {
        isBuilder: false,
        isSite: false,
        isInBuilder: false,
        isOutOfExb: false,
        rootPath: '/',
        appFolderName: '',
        baseUrl: '/',
        useStructuralUrl: true,
        isInPortal: false,
        mountPath: '/',
        hostEnv: 'prod',
        isDevEdition: false,
        arcgisJsApiUrl: 'https://js.arcgis.com/4.25/',
        buildNumber: '',
        exbVersion: '1.10.0'
    };
    mockSystemJs();
}
/** Return an empty init state. */
export function getInitState() {
    if (!window.jimuConfig) {
        initGlobal();
    }
    const INIT_STATE = Immutable({
        appConfig: null,
        portalUrl: null,
        portalSelf: null,
        widgetsRuntimeInfo: {},
        widgetsClassStatus: {},
        widgetsPreloadProps: {},
        dataSourcesPreloadData: {},
        appContext: {},
        appPath: window.jimuConfig.rootPath,
        appInfo: {},
        isNetworkOffLine: false,
        isMobileSize: false,
        appId: null,
        appI18nMessages: {},
        appRuntimeInfo: {},
        jimuCoreNls: null,
        queryObject: {},
        dataSourcesInfo: {},
        jimuMapViewsInfo: {},
        widgetsState: {},
        widgetsMutableStateVersion: {},
        mapWidgetsInfo: {},
        token: null,
        user: null,
        theme: null,
        browserSizeMode: BrowserSizeMode.Large,
        overlays: [],
        userLocaleChanged: false,
        hasPrivilege: true,
        privilegeError: null,
        loadAppConfigError: null,
        portalsNeedToRegisterClinetId: [],
        extensionsInfo: {}
    });
    return INIT_STATE;
}
/** Get an empty default app config. */
export function getDefaultAppConfig() {
    return Immutable({
        theme: '/themes/default/',
        mainSizeMode: BrowserSizeMode.Large,
        pages: {},
        pageStructure: [],
        dialogs: {},
        layouts: {},
        sections: {},
        views: {},
        widgets: {},
        screenGroups: {},
        screens: {},
        header: {},
        footer: {},
        dataSources: {},
        attributes: {},
        widgetsManifest: {},
        messageConfigs: {},
        exbVersion: version
    });
}
export function updateStore(storeItem) {
    let appState = getInitState();
    appState = appState.merge(storeItem);
    getAppStore().dispatch(appActions.updateStoreState(appState));
}
/**
 * Init extensions. Will init `DependencyDefine` and `DataSourceFactoryUri`.
 */
export function initExtensions() {
    ExtensionManager.getInstance().registerExtension({
        epName: extensionSpec.ExtensionPoints.DependencyDefine,
        extension: new ArcGISDependencyDefineExtension()
    });
    ExtensionManager.getInstance().registerExtension({
        epName: extensionSpec.ExtensionPoints.DataSourceFactoryUri,
        extension: new ArcGISDataSourceFactoryUriExtension()
    });
    // jimu-core does not export this class, so we define it here.
    class JimuCoreDataSourceFactoryUriExtension {
        constructor() {
            this.id = 'jimu-core-ds-factory';
        }
        getFactoryUri(dataSourceType) {
            if (Object.keys(DataSourceTypes).map(t => DataSourceTypes[t]).includes(dataSourceType)) {
                return 'jimu-core/data-source';
            }
        }
    }
    ExtensionManager.getInstance().registerExtension({
        epName: extensionSpec.ExtensionPoints.DataSourceFactoryUri,
        extension: new JimuCoreDataSourceFactoryUriExtension()
    });
}
/** Init store with default app config. */
export function initStore() {
    getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })));
}
export { default as mockTheme } from './lib/theme-mock';
//# sourceMappingURL=index.js.map