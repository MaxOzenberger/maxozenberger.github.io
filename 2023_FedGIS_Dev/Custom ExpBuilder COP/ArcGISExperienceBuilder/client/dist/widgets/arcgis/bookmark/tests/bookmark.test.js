var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, BrowserSizeMode, lodash, appActions, AppMode, getAppStore, utils } from 'jimu-core';
import BookmarkWidget from '../src/runtime/widget';
import { TemplateType, PageStyle, DirectionType } from '../src/config';
import { mockTheme, wrapWidget, widgetRender, getInitState } from 'jimu-for-test';
import { ViewportVisibilityContext, ViewVisibilityContext } from 'jimu-layouts/layout-runtime';
import { fireEvent, waitFor } from '@testing-library/react';
jest.mock('jimu-arcgis', () => {
    return {
        loadArcGISJSAPIModules: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Promise.resolve([
                { fromJSON: () => { } },
                function () {
                    return { fromJSON: () => { } };
                },
                { fromJSON: () => { } },
                { fromJSON: () => { } },
                { fromJSON: () => { } }
            ]);
        }),
        JimuMapViewComponent: jest.fn(() => React.createElement("div", { "data-testid": 'mapViewTest' }))
    };
});
const initState = getInitState().merge({
    appContext: { isRTL: false },
    appConfig: {
        widgets: [],
        views: {}
    }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('bookmark test', function () {
    let render = null;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    let config = Immutable({
        templateType: TemplateType.Slide1,
        isTemplateConfirm: true,
        isInitialed: true,
        bookmarks: [
            {
                id: 1,
                name: 'Test-1',
                title: 'Test-1',
                type: '2d',
                extent: {
                    spatialReference: {
                        latestWkid: 3857,
                        wkid: 102100
                    },
                    xmin: 12753609.910596116,
                    ymin: 4661461.4019647185,
                    xmax: 13223239.012380214,
                    ymax: 5095012.226398217
                },
                showFlag: true,
                mapViewId: 'widget_2editor-dataSource_1',
                mapDataSourceId: 'dataSource_1'
            },
            {
                id: 2,
                name: 'Test-2',
                title: 'Test-2',
                type: '2d',
                extent: {
                    spatialReference: {
                        latestWkid: 3857,
                        wkid: 102100
                    },
                    xmin: 12753609.910596116,
                    ymin: 4661461.4019647185,
                    xmax: 13223239.012380214,
                    ymax: 5095012.226398217
                },
                showFlag: true,
                mapViewId: 'widget_2editor-dataSource_1',
                mapDataSourceId: 'dataSource_1'
            }
        ],
        autoPlayAllow: true,
        autoInterval: 3,
        autoLoopAllow: true,
        pageStyle: PageStyle.Paging,
        direction: DirectionType.Horizon,
        initBookmark: true,
        runtimeAddAllow: true
    });
    let props = {
        id: 'testWidget1',
        config,
        browserSizeMode: BrowserSizeMode.Large,
        dispatch: jest.fn(),
        appMode: AppMode.Run
    };
    it('sizemode change should turn off autoPlay', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        const { getByTestId, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest1' }, props)))));
        yield waitFor(() => { }, { timeout: 0 });
        fireEvent.click(getByTestId('triggerAuto'));
        props = lodash.assign({}, props, {
            browserSizeMode: BrowserSizeMode.Medium
        });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest1' }, props)))));
        expect(ref.current.state.autoPlayStart).toBe(false);
    }));
    it('change map ds, showLayersConfig should called with special parameter', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        const { getByTitle } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest2' }, props)))));
        yield waitFor(() => { }, { timeout: 0 });
        ref.current.showLayersConfig = jest.fn();
        ref.current.state.jimuMapView = {
            dataSourceId: 'dataSource_1',
            mapWidgetId: 'widget_2',
            maxLayerIndex: 2,
            view: {
                goTo: jest.fn(),
                map: {
                    add: jest.fn(),
                    layers: { toArray: () => { } },
                    findLayerById: jest.fn(),
                    ground: { opacity: 1 }
                }
            }
        };
        ref.current.Extent = { fromJSON: () => { } };
        ref.current.GraphicsLayer = function () {
            return { fromJSON: () => { } };
        };
        fireEvent.click(getByTitle('Next'));
        yield waitFor(() => {
            expect(ref.current.showLayersConfig).toBeCalledWith(undefined, undefined, undefined, false);
        }, { timeout: 1000 });
    }));
    it('slide should sync with rtl', () => __awaiter(this, void 0, void 0, function* () {
        const initState = getInitState().merge({
            appContext: { isRTL: true },
            appConfig: { widgets: [] }
        });
        getAppStore().dispatch(appActions.updateStoreState(initState));
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        config = lodash.assign({}, config, { templateType: TemplateType.Gallery });
        props = lodash.assign({}, props, { config });
        const { getByTitle } = render(React.createElement(ViewportVisibilityContext.Provider, { value: true },
            React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest2' }, props))));
        yield waitFor(() => { }, { timeout: 0 });
        ref.current.scrollContainer = jest.fn();
        fireEvent.click(getByTitle('Next'));
        expect(ref.current.scrollContainer).toBeCalledWith({
            behavior: 'smooth',
            top: 0,
            left: -210
        });
        fireEvent.click(getByTitle('Previous'));
        expect(ref.current.scrollContainer).toBeCalledWith({
            behavior: 'smooth',
            top: 0,
            left: 210
        });
    }));
    it('active on loading in section view', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        props = lodash.assign({}, props, { appMode: AppMode.Design });
        const { rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: true, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest1' }, props)))));
        yield waitFor(() => { }, { timeout: 0 });
        ref.current.onViewBookmark = jest.fn();
        ref.current.state.jimuMapView = {
            dataSourceId: 'dataSource_1',
            mapWidgetId: 'widget_2',
            view: {
                when: callback => {
                    callback();
                },
                map: {
                    add: jest.fn(),
                    layers: { toArray: () => { } },
                    findLayerById: jest.fn()
                }
            }
        };
        expect(ref.current.onViewBookmark).not.toHaveBeenCalled();
        props = lodash.assign({}, props, { appMode: AppMode.Run });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: true, isInCurrentView: true } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest1' }, props)))));
        expect(ref.current.onViewBookmark).toHaveBeenCalled();
    }));
    it('widget should render when apiLoaded is true', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        const { getAllByText } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest1' }, props)))));
        yield waitFor(() => { }, { timeout: 0 });
        expect(ref.current.state.apiLoaded).toBe(true);
        expect(getAllByText('Test-1')[0]).toBeInTheDocument();
    }));
    it('runtime bookmark layer visibility test', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(BookmarkWidget, { theme: mockTheme, ref });
        config = lodash.assign({}, config, { templateType: TemplateType.Card });
        props = lodash.assign({}, props, { config });
        const { getByTitle } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(ViewportVisibilityContext.Provider, { value: true },
                React.createElement(Widget, Object.assign({ widgetId: 'bookmarkTest2' }, props)))));
        yield waitFor(() => { }, { timeout: 0 });
        ref.current.onViewBookmark = jest.fn();
        ref.current.state.jimuMapView = {
            dataSourceId: 'dataSource_1',
            mapWidgetId: 'widget_2',
            view: {
                when: callback => {
                    callback();
                },
                extent: { toJSON: () => { } },
                viewpoint: { toJSON: () => { } },
                map: {
                    add: jest.fn(),
                    operationalLayers: [
                        {
                            id: 'wildfire_test_ds_change_3528'
                        }
                    ],
                    layers: {
                        toArray: () => {
                            return [
                                {
                                    id: 'wildfire_test_ds_change_3528',
                                    visible: true
                                }
                            ];
                        }
                    },
                    findLayerById: jest.fn()
                }
            }
        };
        fireEvent.click(getByTitle('Add bookmark'));
        const runtimeArray = JSON.parse(utils.readLocalStorage('exb-/-testWidget1-default-RtBmArray'));
        const runtimeBookmark = JSON.parse(utils.readLocalStorage(runtimeArray[0]));
        expect(runtimeBookmark.layersConfig.wildfire_test_ds_change_3528.visibility).toBe(true);
    }));
});
//# sourceMappingURL=bookmark.test.js.map