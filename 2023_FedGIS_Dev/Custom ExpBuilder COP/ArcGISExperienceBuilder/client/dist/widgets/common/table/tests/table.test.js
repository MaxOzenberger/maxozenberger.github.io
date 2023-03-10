var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, appActions, lodash, BrowserSizeMode, getAppStore } from 'jimu-core';
import TableWidget from '../src/runtime/widget';
import { mockTheme, wrapWidget, widgetRender, getInitState } from 'jimu-for-test';
import { fireEvent } from '@testing-library/react';
import { TableArrangeType } from '../src/config';
import { layerConfig, UseDataSources } from './config';
window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));
jest.mock('jimu-arcgis', () => {
    return {
        loadArcGISJSAPIModules: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Promise.resolve([
                function () {
                    return {
                        fromJSON: () => { },
                        clearSelection: () => { }
                    };
                },
                function () {
                    return { fromJSON: () => { } };
                }
            ]);
        })
    };
});
jest.mock('jimu-ui', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-ui')), { AdvancedSelect: jest.fn(() => React.createElement("div", { "data-testid": 'tableSelectTest' })) });
});
jest.mock('jimu-core', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-core')), { ResizeObserver: jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn()
        })) });
});
const initState = getInitState().merge({
    appContext: { isRTL: false },
    appConfig: {
        widgets: [],
        dataSources: UseDataSources[0],
        dialogs: {}
    }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('table test', function () {
    let render = null;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    const config = Immutable({
        layersConfig: [layerConfig],
        arrangeType: TableArrangeType.Tabs
    });
    let props = {
        config,
        browserSizeMode: BrowserSizeMode.Large
    };
    it('show selection/all change test', () => {
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTitle } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest1' }, props)));
        const current = ref.current;
        current.table = {
            grid: {
                selectedItems: {
                    items: [
                        {
                            objectId: 3,
                            feature: {
                                attributes: {
                                    OBJECTID: 3
                                }
                            }
                        }
                    ]
                }
            },
            layer: { definitionExpression: '' },
            menu: { open: false },
            filterBySelection: jest.fn(() => Promise.resolve()),
            clearSelectionFilter: jest.fn(() => Promise.resolve())
        };
        current.setState({
            dataSource: {
                updateQueryParams: jest.fn(() => Promise.resolve()),
                clearSelection: jest.fn(() => Promise.resolve()),
                getLabel: jest.fn(() => 'ds-label'),
                getCurrentQueryParams: jest.fn(() => Promise.resolve('1=1')),
                getSelectedRecords: jest.fn(() => [
                    {
                        dataSource: { id: 'dataSource_1-allFields_9212-selection' },
                        feature: {}
                    }
                ])
            }
        });
        fireEvent.click(getByTitle('Show selection'));
        expect(current.table.filterBySelection).toHaveBeenCalled();
        expect(current.state.selectQueryFlag).toBe(true);
        expect(getByTitle('Show all')).toBeInTheDocument();
    });
    it('different table tab with same ds should call createTable', () => {
        const newLayerConfig = lodash.assign({}, layerConfig, {
            id: 'test-2',
            name: 'test-table-2'
        });
        const mutConfig = config.asMutable({ deep: true });
        mutConfig.layersConfig.push(newLayerConfig);
        const newProps = { config: Immutable(mutConfig), dispatch: jest.fn() };
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTitle } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest2' }, newProps)));
        const current = ref.current;
        current.destoryTable = jest.fn(() => Promise.resolve());
        current.setState({
            dataSource: {
                id: 'dataSource_1-Hydrants_8477',
                updateQueryParams: jest.fn(() => Promise.resolve()),
                getLabel: jest.fn(() => 'ds-label'),
                getSelectedRecords: jest.fn(() => [
                    {
                        dataSource: { id: 'dataSource_1-allFields_9212-selection' },
                        feature: {}
                    }
                ])
            }
        });
        fireEvent.click(getByTitle('test-table-2').children[0]);
        expect(current.destoryTable).toHaveBeenCalled();
    });
    it('remove table should show the placeholder', () => {
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTestId, rerender } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest3' }, props)));
        const mutConfig = config.asMutable({ deep: true });
        mutConfig.layersConfig = [];
        const newProps = { config: Immutable(mutConfig), dispatch: jest.fn() };
        rerender(React.createElement(Widget, Object.assign({ widgetId: 'tableTest3' }, newProps)));
        expect(getByTestId('tablePlaceholder')).toBeInTheDocument();
    });
    it('when sizemode is small, serch tool should be responsive', () => {
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTestId, getByTitle, rerender } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest4' }, props)));
        const current = ref.current;
        current.state.searchToolFlag = true;
        props = lodash.assign({}, props, { browserSizeMode: BrowserSizeMode.Small });
        rerender(React.createElement(Widget, Object.assign({ widgetId: 'tableTest4' }, props)));
        expect(getByTitle('search')).toBeInTheDocument();
        fireEvent.click(getByTitle('search'));
        expect(getByTestId('popper')).toBeInTheDocument();
    });
    it('clearSelection should clear table, refresh should keep selection', () => {
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTitle, rerender } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest5' }, props)));
        const current = ref.current;
        current.setState({
            dataSource: {
                updateQueryParams: jest.fn(() => Promise.resolve()),
                clearSelection: jest.fn(() => Promise.resolve()),
                getLabel: jest.fn(() => 'ds-label'),
                getCurrentQueryParams: jest.fn(() => Promise.resolve('1=1')),
                getSelectedRecords: jest.fn(() => [
                    {
                        dataSource: { id: 'dataSource_1-allFields_9212-selection' },
                        feature: {}
                    }
                ])
            }
        });
        current.table = {
            grid: {
                selectedItems: {
                    items: [
                        {
                            objectId: 5,
                            feature: {
                                attributes: {
                                    OBJECTID: 5
                                }
                            }
                        }
                    ]
                }
            },
            layer: { definitionExpression: '' },
            menu: { open: false },
            clearSelection: jest.fn(() => Promise.resolve()),
            clearSelectionFilter: jest.fn(),
            refresh: jest.fn(() => Promise.resolve()),
            filterBySelection: jest.fn(() => Promise.resolve())
        };
        fireEvent.click(getByTitle('Show selection'));
        // expect(current.table.layer.definitionExpression).toBe('OBJECTID IN (5)')
        expect(current.table.filterBySelection).toHaveBeenCalled();
        expect(current.state.selectQueryFlag).toBe(true);
        expect(getByTitle('Show all')).toBeInTheDocument();
        fireEvent.click(getByTitle('Clear selection'));
        expect(current.table.layer.definitionExpression).toBeFalsy();
        expect(current.state.selectQueryFlag).toBe(false);
        expect(getByTitle('Show selection')).toBeInTheDocument();
        rerender(React.createElement(Widget, Object.assign({ widgetId: 'tableTest5' }, props)));
        fireEvent.click(getByTitle('Refresh'));
        expect(current.table.refresh).toHaveBeenCalled();
        expect(current.table.layer.definitionExpression).toBeFalsy();
        expect(current.state.selectQueryFlag).toBe(false);
        expect(getByTitle('Show selection')).toBeInTheDocument();
    });
    it('button should be disabled in some condition', () => {
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { getByTitle } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest5' }, props)));
        expect(getByTitle('Show selection')).toBeDisabled();
        expect(getByTitle('Clear selection')).toBeDisabled();
        const current = ref.current;
        current.setState({
            emptyTable: true
        });
        expect(getByTitle('Refresh')).toBeDisabled();
        expect(getByTitle('Show/hide columns')).toBeDisabled();
    });
    it('when unselect all fields, do not render table', () => {
        const newLayerConfig = lodash.assign({}, layerConfig, {
            tableFields: []
        });
        const mutConfig = config.asMutable({ deep: true });
        mutConfig.layersConfig.push(newLayerConfig);
        const newProps = { config: Immutable(mutConfig), dispatch: jest.fn() };
        const ref = { current: null };
        const Widget = wrapWidget(TableWidget, { theme: mockTheme, ref });
        const { queryBySelector } = render(React.createElement(Widget, Object.assign({ widgetId: 'tableTest6' }, newProps)));
        expect(queryBySelector('.esri-feature-table__content')).not.toBeInTheDocument();
    });
});
//# sourceMappingURL=table.test.js.map