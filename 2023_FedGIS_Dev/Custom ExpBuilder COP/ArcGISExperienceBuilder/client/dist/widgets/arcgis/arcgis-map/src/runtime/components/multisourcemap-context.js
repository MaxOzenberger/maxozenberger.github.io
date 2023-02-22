import { React } from 'jimu-core';
export const MultiSourceMapContext = React.createContext({
    mapWidgetId: null,
    mapWidgetHeight: null,
    isShowMapSwitchBtn: false,
    isShowClearShowOnMapDataBtn: false,
    isFullScreen: false,
    dataSourceIds: [],
    activeDataSourceId: null,
    switchMap: () => { },
    fullScreenMap: () => { },
    initialMapState: null,
    mobilePanelContainer: null,
    onMobilePanelContentChange: (MobilePanelContent) => { },
    theme: null
});
//# sourceMappingURL=multisourcemap-context.js.map