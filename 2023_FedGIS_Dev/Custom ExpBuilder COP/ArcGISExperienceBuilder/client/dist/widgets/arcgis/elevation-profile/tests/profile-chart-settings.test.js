var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { shallow } from 'enzyme';
import { mockTheme } from 'jimu-for-test';
import { createIntl } from 'jimu-core';
import ProfileChartSettings from '../src/setting/components/profile-chart-settings';
const validElevationServices = ['https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'];
//Mock Esri request response for valid & invalid Elevation service
jest.mock('jimu-arcgis', () => {
    return {
        loadArcGISJSAPIModules: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Promise.resolve([
                function (urlValue) {
                    if (validElevationServices.includes(urlValue)) {
                        return Promise.resolve({
                            data: {
                                cacheType: 'Elevation'
                            }
                        });
                    }
                    else {
                        return Promise.reject({
                            error: {}
                        });
                    }
                }
            ]);
        })
    };
});
describe('Validate that the widget properly checks the elevation layer', function () {
    //Create required config for ProfileChartSettings
    const mockProfileChartConfig = {
        isCustomElevationLayer: true,
        elevationLayerURL: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
        linearUnit: 'miles',
        elevationUnit: 'feet',
        displayStatistics: true,
        selectedStatistics: [],
        groundColor: '#b54900',
        graphicsHighlightColor: '00ffff'
    };
    const props = {
        theme: mockTheme,
        intl: createIntl({ locale: 'en' }),
        isRTL: false,
        config: mockProfileChartConfig,
        currentDs: 'default',
        onProfileChartSettingsUpdated: jest.fn(),
        groundLayerInfo: [],
        portalSelf: { units: 'english' }
    };
    const wrapper = shallow(React.createElement(ProfileChartSettings, Object.assign({}, props)));
    const currentInstance = wrapper.instance();
    it('Should have specified elevation layer URL', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield currentInstance.loadAPIModule();
            expect(wrapper.state('updateElevationLayerURL')).toEqual(mockProfileChartConfig.elevationLayerURL);
        });
    });
    it('Valid elevation service URL should be accessible and should not show an error message', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield currentInstance.onInputChange(mockProfileChartConfig.elevationLayerURL);
            wrapper.update();
            expect(wrapper.state('isInvalidValue')).toEqual(false);
            expect(wrapper.find('.is-invalid').length).toEqual(0);
        });
    });
    it('Invalid rest end point of an elevation service URL should show an error message', function () {
        return __awaiter(this, void 0, void 0, function* () {
            //Invalid Rest end
            const elevationLayerURL = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/InvalidRestEND';
            yield currentInstance.onInputChange(elevationLayerURL);
            wrapper.update();
            expect(wrapper.state('isInvalidValue')).toEqual(true);
            expect(wrapper.find('.is-invalid').length).toEqual(1);
        });
    });
    it('Invalid value in elevation service URL textbox should show an error message', function () {
        return __awaiter(this, void 0, void 0, function* () {
            //Invalid url
            const elevationLayerURL = 'InvalidURL';
            wrapper.find('.elevationUrlTextInput').simulate('change', { currentTarget: { value: elevationLayerURL } });
            wrapper.update();
            expect(wrapper.state('isInvalidValue')).toEqual(true);
            expect(wrapper.find('.is-invalid').length).toEqual(1);
        });
    });
    it('Use Ground Elevation Radio should be disabled when using ground elevation URL is not available', function () {
        return __awaiter(this, void 0, void 0, function* () {
            //Use ground elevation layer option should be disabled
            expect(wrapper.state('isGroundDisabled')).toEqual(true);
            //Use ground elevation layer option should be disabled and unchecked and Custom Elevation option should be checked
            expect(wrapper.find('Radio').getElements()[0].props.disabled).toEqual(true);
            expect(wrapper.find('Radio').getElements()[0].props.checked).toEqual(false);
            expect(wrapper.find('Radio').getElements()[1].props.checked).toEqual(true);
        });
    });
    it('Should use ground elevation URL if available', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockConfigToUseGroundElevationURL = {
                isCustomElevationLayer: false,
                elevationLayerURL: '',
                linearUnit: 'miles',
                elevationUnit: 'feet',
                displayStatistics: true,
                selectedStatistics: [],
                groundColor: '#b54900',
                graphicsHighlightColor: '00ffff'
            };
            const props = {
                theme: mockTheme,
                intl: createIntl({ locale: 'en' }),
                isRTL: false,
                config: mockConfigToUseGroundElevationURL,
                currentDs: 'dataSource_1',
                onProfileChartSettingsUpdated: jest.fn(),
                groundLayerInfo: [{
                        dataSourceId: 'dataSource_1',
                        isGroundElevationLayerExists: true,
                        groundElevationLayerUrl: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
                    }],
                portalSelf: { units: 'english' }
            };
            const wrapper = shallow(React.createElement(ProfileChartSettings, Object.assign({}, props)));
            const currentInstance = wrapper.instance();
            yield currentInstance.loadAPIModule();
            //Use ground elevation layer option should be enabled
            expect(wrapper.state('isGroundDisabled')).toEqual(false);
            //Use ground elevation layer option should be checked and Custom Elevation option should be unchecked
            expect(wrapper.find('Radio').getElements()[0].props.checked).toEqual(true);
            expect(wrapper.find('Radio').getElements()[1].props.checked).toEqual(false);
        });
    });
});
//# sourceMappingURL=profile-chart-settings.test.js.map