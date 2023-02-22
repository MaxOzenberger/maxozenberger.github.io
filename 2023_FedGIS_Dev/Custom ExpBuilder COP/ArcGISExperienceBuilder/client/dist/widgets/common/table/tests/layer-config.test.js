var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, appActions, getAppStore, lodash } from 'jimu-core';
import LayerConfig from '../src/setting/layer-config';
import { getInitState, mockTheme, withStoreThemeIntlRender } from 'jimu-for-test';
import { layerConfig, UseDataSources } from './config';
import { createIntl } from 'react-intl';
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
const initState = getInitState().merge({
    appContext: { isRTL: false },
    appConfig: {
        widgets: [],
        dataSources: UseDataSources[0],
        dialogs: {}
    }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
const render = withStoreThemeIntlRender(getAppStore(), mockTheme);
describe('table config panel test', function () {
    it.only('ds fields change will not change tableFields of config', () => {
        const ref = { current: null };
        const dataSourceChangeSave = jest.fn();
        const optionChangeSave = jest.fn();
        const onCloseLayerPanel = jest.fn();
        const { rerender } = render(React.createElement(LayerConfig, Object.assign({}, layerConfig, { intl: createIntl({ locale: 'en' }), theme: mockTheme, useDataSource: UseDataSources[0], dataSourceChange: dataSourceChangeSave, optionChange: optionChangeSave, onClose: onCloseLayerPanel, ref: ref })));
        const current = ref.current;
        current.getFieldsFromDatasource = jest.fn(() => {
            return {
                allFields: [
                    {
                        alias: 'uniqueId_alias',
                        esriType: 'esriFieldTypeInteger',
                        format: undefined,
                        jimuName: 'uniqueId',
                        name: 'uniqueId',
                        type: 'NUMBER'
                    }
                ],
                tableFields: [
                    {
                        alias: 'uniqueId_alias',
                        esriType: 'esriFieldTypeInteger',
                        format: undefined,
                        jimuName: 'uniqueId',
                        name: 'uniqueId',
                        type: 'NUMBER'
                    }
                ]
            };
        });
        rerender(React.createElement(LayerConfig, Object.assign({}, layerConfig, { intl: createIntl({ locale: 'en' }), theme: mockTheme, useDataSource: UseDataSources[0], dataSourceChange: dataSourceChangeSave, optionChange: optionChangeSave, onClose: onCloseLayerPanel, ref: ref })));
        expect(current.props.tableFields[0].jimuName).toBe('OBJECTID');
    });
    it.only('searching fields is supposed to follow the change of the "initial display fields"', () => {
        const ref = { current: null };
        const dataSourceChangeSave = jest.fn();
        const optionChangeSave = jest.fn();
        const onCloseLayerPanel = jest.fn();
        const newLayerConfig = lodash.assign({}, layerConfig, {
            tableFields: [
                {
                    alias: 'name_alias',
                    esriType: 'esriFieldTypeString',
                    jimuName: 'name',
                    name: 'name',
                    type: 'STRING'
                }
            ]
        });
        const { getByText } = render(React.createElement(LayerConfig, Object.assign({}, newLayerConfig, { intl: createIntl({ locale: 'en' }), theme: mockTheme, useDataSource: UseDataSources[0], dataSourceChange: dataSourceChangeSave, optionChange: optionChangeSave, onClose: onCloseLayerPanel, ref: ref })));
        expect(getByText('name_alias')).toBeInTheDocument();
    });
});
//# sourceMappingURL=layer-config.test.js.map