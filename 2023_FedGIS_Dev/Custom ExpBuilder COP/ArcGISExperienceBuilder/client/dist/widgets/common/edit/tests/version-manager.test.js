var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Immutable, DataSourceManager } from 'jimu-core';
import { versionManager } from '../src/version-manager';
import { LayerHonorModeType } from '../src/config';
let upgrader = null;
jest.mock('jimu-core', () => {
    return Object.assign({}, jest.requireActual('jimu-core'));
});
describe('Test Edit version-manager for version 1.7.0', () => {
    let mockFn = null;
    beforeAll(() => {
        var _a, _b;
        upgrader = (_b = (_a = versionManager.versions) === null || _a === void 0 ? void 0 : _a.filter(function (version) {
            return version.version === '1.7.0';
        })[0]) === null || _b === void 0 ? void 0 : _b.upgrader;
        mockFn = jest.fn().mockImplementation((useDataSource) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Promise.resolve({
                getLayerDefinition: () => ({
                    fields: {
                        field1: {
                            name: 'field1',
                            alias: 'Field1',
                            editable: false
                        },
                        field2: {
                            name: 'field2',
                            alias: 'Field2',
                            editable: true
                        }
                    }
                })
            });
        }));
        DataSourceManager.getInstance().createDataSourceByUseDataSource = mockFn;
    });
    it('should return new config', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            description: '',
            editMode: 'ATTRIBUTE',
            layersConfig: [{
                    id: 'dataSource_1-allFields_5838',
                    layerId: 'allFields_5838',
                    name: 'allFields',
                    addRecords: false,
                    deleteRecords: false,
                    featureSnapping: false,
                    updateGeometries: true,
                    groupedFields: [],
                    showFields: [],
                    useDataSource: {
                        dataSourceId: 'dataSource_1-allFields_5838',
                        mainDataSourceId: 'dataSource_1-allFields_5838',
                        rootDataSourceId: 'dataSource_1'
                    }
                }],
            noDataMessage: ''
        });
        const newConfig = yield upgrader(oldConfig);
        expect(newConfig.layersConfig[0].layerHonorMode).toBe(LayerHonorModeType.Custom);
    }));
});
//# sourceMappingURL=version-manager.test.js.map