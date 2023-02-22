var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { esri, portalUrlUtils, SessionManager, Immutable, UtilityManager, loadArcGISJSAPIModules } from 'jimu-core';
import { PrintServiceType, PrintTemplateType, CIMMarkerNorthArrow } from '../config';
// for tslint
export function isDefined(value) {
    if (typeof value !== 'undefined' && !(value === null)) {
        return true;
    }
    else {
        return false;
    }
}
export const getOrganizationprintTask = (portalUrl) => {
    const request = esri.restRequest.request;
    const sm = SessionManager.getInstance();
    return request(`${portalUrlUtils.getPortalRestUrl(portalUrl)}portals/self`, {
        authentication: sm.getMainSession(),
        httpMethod: 'GET'
    }).then(portalSelf => {
        var _a;
        return Promise.resolve(((_a = portalSelf === null || portalSelf === void 0 ? void 0 : portalSelf.helperServices) === null || _a === void 0 ? void 0 : _a.printTask) || null);
    }).catch(err => {
        return Promise.resolve(null);
    });
};
export const getTemplateType = (printServiceType, printTemplateType) => {
    return printServiceType === PrintServiceType.Customize || printTemplateType === PrintTemplateType.Customize ? 'custom' : 'org';
};
//Merge template setting
export const mergeTemplateSetting = (orgTemplateSetting, overwriteTemplateSetting) => {
    let newOverwriteTemplateSetting = overwriteTemplateSetting;
    //Init template exportOptions
    if (orgTemplateSetting === null || orgTemplateSetting === void 0 ? void 0 : orgTemplateSetting.exportOptions) {
        newOverwriteTemplateSetting = newOverwriteTemplateSetting.set('exportOptions', Object.assign(Object.assign({}, (orgTemplateSetting.exportOptions || {})), ((overwriteTemplateSetting === null || overwriteTemplateSetting === void 0 ? void 0 : overwriteTemplateSetting.exportOptions) || {})));
    }
    //Init template layoutOptions
    if ((orgTemplateSetting === null || orgTemplateSetting === void 0 ? void 0 : orgTemplateSetting.layoutOptions) && (overwriteTemplateSetting === null || overwriteTemplateSetting === void 0 ? void 0 : overwriteTemplateSetting.layoutOptions)) {
        newOverwriteTemplateSetting = newOverwriteTemplateSetting.set('layoutOptions', Object.assign(Object.assign({}, ((orgTemplateSetting === null || orgTemplateSetting === void 0 ? void 0 : orgTemplateSetting.layoutOptions) || {})), ((overwriteTemplateSetting === null || overwriteTemplateSetting === void 0 ? void 0 : overwriteTemplateSetting.layoutOptions) || {})));
    }
    return Immutable(Object.assign(Object.assign({}, orgTemplateSetting), newOverwriteTemplateSetting));
};
export const getIndexByTemplateId = (templates, templateId) => {
    let index;
    templates === null || templates === void 0 ? void 0 : templates.forEach((item, idx) => {
        if ((item === null || item === void 0 ? void 0 : item.templateId) === templateId) {
            index = idx;
        }
    });
    return index;
};
export const checkIsCustomTemplate = (printServiceType, printTemplateType) => {
    return printServiceType === PrintServiceType.Customize || printTemplateType === PrintTemplateType.Customize;
};
export const initTemplateLayout = (layout) => {
    // return layout?.replace(/\_/ig, '-')?.replace(/\s+/ig, '-')?.toLowerCase() as LayoutType
    return layout;
};
export const initMapOnlyLayout = (layout) => {
    var _a, _b;
    return (_b = (_a = layout === null || layout === void 0 ? void 0 : layout.replace(/\_/ig, '-')) === null || _a === void 0 ? void 0 : _a.replace(/\s+/ig, '-')) === null || _b === void 0 ? void 0 : _b.toLowerCase();
};
export const checkIsMapOnly = (layout) => {
    return initMapOnlyLayout(layout) === 'map-only';
};
export const checkIsTemplateExist = (templateList, templateId) => {
    let isExist = false;
    templateList === null || templateList === void 0 ? void 0 : templateList.forEach(tmp => {
        if ((tmp === null || tmp === void 0 ? void 0 : tmp.templateId) === templateId) {
            isExist = true;
        }
    });
    return isExist;
};
export const checkNumber = (value, minimum = 1) => {
    if ((value === null || value === void 0 ? void 0 : value.length) === 0)
        return true;
    if (isNaN(Number(value))) {
        return false;
    }
    else {
        const numberVal = Number(value);
        return Number.isInteger(numberVal) && numberVal >= minimum;
    }
};
export const getUrlOfUseUtility = (useUtility) => __awaiter(void 0, void 0, void 0, function* () {
    return UtilityManager.getInstance().getUrlOfUseUtility(useUtility)
        .then((url) => {
        return Promise.resolve(url);
    });
});
export function getPrintTemplateTaskInfo(printServiceUrl) {
    const options = {
        query: {
            'env:outSR': '',
            'env:processSR': '',
            returnZ: false,
            returnM: false,
            returnTrueCurves: false,
            returnFeatureCollection: false,
            context: '',
            f: 'json'
        },
        responseType: 'json'
    };
    return getPrintTemplateTaskInfoUrl(printServiceUrl).then(url => {
        return loadArcGISJSAPIModules(['esri/request']).then(modules => {
            const [esriRequest] = modules;
            return esriRequest(url, options).then(res => {
                var _a, _b;
                return Promise.resolve(((_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.results[0]) === null || _b === void 0 ? void 0 : _b.value) || []);
            });
        });
    });
}
function getPrintTemplateTaskInfoUrl(printServiceUrl) {
    var _a;
    if (!printServiceUrl)
        return Promise.resolve(null);
    const serverUrl = `${(_a = printServiceUrl.split('/GPServer')) === null || _a === void 0 ? void 0 : _a[0]}/GPServer`;
    const options = {
        query: {
            f: 'json'
        },
        responseType: 'json'
    };
    return loadArcGISJSAPIModules(['esri/request']).then(modules => {
        const [esriRequest] = modules;
        return esriRequest(serverUrl, options).then(res => {
            var _a;
            const tasks = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.tasks;
            let templatesInfoTaskUrl = `${serverUrl}/Get Layout Templates Info Task/execute`;
            tasks === null || tasks === void 0 ? void 0 : tasks.forEach(taskName => {
                if ((taskName === null || taskName === void 0 ? void 0 : taskName.includes('Templates')) && (taskName === null || taskName === void 0 ? void 0 : taskName.includes('Info'))) {
                    templatesInfoTaskUrl = `${serverUrl}/${taskName}/execute`;
                }
            });
            return Promise.resolve(templatesInfoTaskUrl);
        });
    });
}
export function getLegendLayer(mapView) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadArcGISJSAPIModules(['esri/rest/support/LegendLayer']).then(modules => {
            var _a, _b, _c, _d;
            const [LegendLayer] = modules;
            const legendLayers = (_d = (_c = (_b = (_a = mapView === null || mapView === void 0 ? void 0 : mapView.view) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.layers) === null || _c === void 0 ? void 0 : _c.toArray()) === null || _d === void 0 ? void 0 : _d.map(layer => {
                return new LegendLayer({
                    layerId: layer === null || layer === void 0 ? void 0 : layer.id,
                    title: layer === null || layer === void 0 ? void 0 : layer.title
                });
            });
            return Promise.resolve(legendLayers);
        });
    });
}
export function getScaleBarList(nls) {
    return [
        {
            value: 'Miles',
            label: nls('unitsLabelMiles')
        },
        {
            value: 'Kilometers',
            label: nls('unitsLabelKilometers')
        },
        {
            value: 'Meters',
            label: nls('unitsLabelMeters')
        },
        {
            value: 'Feet',
            label: nls('unitsLabelFeet')
        }
    ];
}
export function getKeyOfNorthArrow(elementOverrides = {}) {
    var _a;
    let northArrowKey = null;
    for (const key in elementOverrides) {
        if (((_a = elementOverrides === null || elementOverrides === void 0 ? void 0 : elementOverrides[key]) === null || _a === void 0 ? void 0 : _a.type) === CIMMarkerNorthArrow) {
            northArrowKey = key;
        }
    }
    return northArrowKey;
}
//# sourceMappingURL=utils.js.map