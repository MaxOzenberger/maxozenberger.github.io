var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, appActions, getAppStore } from 'jimu-core';
import { MarkPopper } from '../src/setting/components/mark-popper';
import { mockTheme, wrapWidget, widgetRender, getInitState } from 'jimu-for-test';
import { fireEvent, waitFor } from '@testing-library/react';
jest.mock('jimu-arcgis', () => {
    return {
        loadArcGISJSAPIModules: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Promise.resolve([
                { fromJSON: () => { } },
                function () {
                    return { fromJSON: () => { }, removeAll: () => { }, destroy: () => { } };
                },
                { fromJSON: () => { } },
                { fromJSON: () => { } },
                { fromJSON: () => { } }
            ]);
        })
    };
});
jest.mock('jimu-ui/advanced/map', () => (Object.assign(Object.assign({}, jest.requireActual('jimu-ui/advanced/map')), { JimuMap: ({ useDataSources }) => React.createElement("div", { "data-testid": 'popperJimuMapTest' }, useDataSources[0].dataSourceId), JimuDraw: () => React.createElement("div", null, "Draw") })));
const initState = getInitState().merge({
    appStateInBuilder: {
        appConfig: {
            widgets: {
                widget12: {
                    uri: 'widgets/arcgis/arcgis-map/',
                    config: {
                        toolConfig: {
                            canZoom: true,
                            canHome: true,
                            canSearch: true,
                            canNavigation: true
                        },
                        isUseCustomMapState: false,
                        initialMapDataSourceID: 'dataSource_2'
                    },
                    useDataSources: [
                        {
                            dataSourceId: 'dataSource_1',
                            mainDataSourceId: 'dataSource_1'
                        },
                        {
                            dataSourceId: 'dataSource_2',
                            mainDataSourceId: 'dataSource_2'
                        }
                    ]
                }
            }
        },
        appContext: { isRTL: false }
    }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('mark-popper test', function () {
    let render = null;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    const props = {
        useMapWidgetIds: Immutable(['widget12']),
        buttonLabel: 'Add bookmark',
        title: 'Set bookmark view: Bookmark-2',
        id: 'widget13',
        isUseWidgetSize: true,
        maxBookmarkId: 2,
        activeBookmarkId: 1,
        tempLayoutType: 'FIXED',
        onConfigChanged: jest.fn(),
        onBookmarkUpdated: jest.fn(),
        onShowBookmarkConfiger: jest.fn(),
        onAddNewBookmark: jest.fn(),
        formatMessage: jest.fn()
    };
    it.only('use current map view to add new bookmark', () => {
        const ref = { current: null };
        const Widget = wrapWidget(MarkPopper, { theme: mockTheme, ref });
        const { getByText, getByTestId } = render(React.createElement(Widget, Object.assign({ widgetId: 'markpopperTest1' }, props)));
        fireEvent.click(getByText('Add bookmark'));
        expect(getByTestId('popperJimuMapTest').innerHTML).toBe('dataSource_2');
        expect(getByTestId('popperSaveBtn')).toBeDisabled();
    });
    it.only('uploadSnapFile should call with rigth id', () => __awaiter(this, void 0, void 0, function* () {
        const ref = { current: null };
        const Widget = wrapWidget(MarkPopper, { theme: mockTheme, ref });
        const { getByText } = render(React.createElement(Widget, Object.assign({ widgetId: 'markpopperTest2' }, props)));
        ref.current.state.isShowDialog = true;
        ref.current.state.currentJimuMapView = {
            dataSourceId: 'dataSource_1',
            mapWidgetId: 'widget_2',
            maxLayerIndex: 2,
            view: {
                takeScreenshot: () => __awaiter(this, void 0, void 0, function* () { return yield Promise.resolve({ dataUrl: 'fakeUrl' }); }),
                extent: { toJSON: () => { } },
                viewpoint: { toJSON: () => { } },
                map: {
                    add: jest.fn(),
                    layers: { toArray: () => { return []; } },
                    findLayerById: jest.fn()
                }
            }
        };
        ref.current.uploadSnapFile = jest.fn();
        fireEvent.click(getByText('Add bookmark'));
        yield waitFor(() => {
            expect(ref.current.uploadSnapFile).toBeCalledWith('fakeUrl', 3, expect.any(Function));
        }, { timeout: 1100 });
    }));
});
//# sourceMappingURL=mark-popper.test.js.map