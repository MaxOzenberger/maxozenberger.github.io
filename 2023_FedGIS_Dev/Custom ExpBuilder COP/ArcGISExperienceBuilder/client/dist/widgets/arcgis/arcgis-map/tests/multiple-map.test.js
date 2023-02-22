import { React, getAppStore, appActions } from 'jimu-core';
import { withStoreRender, getInitState, getDefaultAppConfig } from 'jimu-for-test';
import MultipleMap from '../src/runtime/components/multisourcemap';
jest.mock('../src/runtime/components/mapbase', () => {
    return {
        default: () => React.createElement("div", null, "Map")
    };
});
jest.mock('react-resize-detector', () => {
    return {
        default: () => React.createElement("div", null, "ReactResizeDetector")
    };
});
const render = withStoreRender();
describe('test multiple map component', () => {
    describe('has two maps', () => {
        const widgetJson = {
            id: 'widget1',
            useDataSources: [{ dataSourceId: 'map1' }, { dataSourceId: 'map2' }],
            config: {}
        };
        beforeAll(() => {
            getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
                appConfig: getDefaultAppConfig().merge({
                    widgets: {
                        widget1: widgetJson
                    },
                    dataSources: {
                        map1: {},
                        map2: {}
                    }
                })
            })));
        });
        it('test call switch map should not set autoControlWidgetId', () => {
            var _a, _b;
            const props = {
                baseWidgetProps: widgetJson
            };
            const ref = React.createRef();
            const { getAllByText } = render(React.createElement(MultipleMap, Object.assign({ ref: ref }, props)));
            expect(getAllByText('Map').length).toBe(2); // render two maps
            ref.current.switchMap();
            expect((_b = (_a = getAppStore().getState().mapWidgetsInfo) === null || _a === void 0 ? void 0 : _a.widget1) === null || _b === void 0 ? void 0 : _b.autoControlWidgetId).toBeUndefined();
        });
    });
});
//# sourceMappingURL=multiple-map.test.js.map