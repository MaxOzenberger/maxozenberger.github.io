import { esri, portalUrlUtils, SessionManager } from 'jimu-core';
import { DefaultGeocodeLabel } from '../constants';
export const getDefaultGeocodeLabel = (geocodeUrl) => {
    if (isArcGISWorldGeocoder(geocodeUrl)) {
        return DefaultGeocodeLabel;
    }
    else {
        return getGeocodeName(geocodeUrl);
    }
};
export const getGeocodeName = (geocodeUrl) => {
    if (!geocodeUrl) {
        return 'geocoder';
    }
    const strs = geocodeUrl.split('/');
    return strs[strs.length - 2] || 'geocoder';
};
export const isMeteredArcGISWorldGeocoder = (url) => {
    if (!url) {
        return false;
    }
    return /(?:geocode\-api\.arcgis\.com\/arcgis\/rest\/services\/world\/geocodeserver).*/gi.test(url);
};
export const isProxiedArcGISWorldGeocoder = (url) => {
    if (!url) {
        return false;
    }
    return /(?:\/servers\/[\da-z\.-]+\/rest\/services\/world\/geocodeserver).*/gi.test(url);
};
export const isArcGISWorldGeocoder = (url) => {
    if (!url) {
        return false;
    }
    return /(?:arcgis\.com\/arcgis\/rest\/services\/world\/geocodeserver).*/gi.test(url);
};
export const getOrganizationGeocodeService = (portalUrl) => {
    const request = esri.restRequest.request;
    const sm = SessionManager.getInstance();
    return request(`${portalUrlUtils.getPortalRestUrl(portalUrl)}portals/self`, {
        authentication: sm.getMainSession(),
        httpMethod: 'GET'
    }).then(portalSelf => {
        var _a;
        return Promise.resolve(((_a = portalSelf === null || portalSelf === void 0 ? void 0 : portalSelf.helperServices) === null || _a === void 0 ? void 0 : _a.geocode) || []);
    }).catch(err => {
        return Promise.resolve([]);
    });
};
//# sourceMappingURL=geocode-utils.js.map