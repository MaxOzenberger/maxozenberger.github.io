var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataSourceManager, DataSourceTypes, esri } from 'jimu-core';
/*
This 'GDBVersionManager' supports Version Management Service (VMS) (Branch Versioning) available through ArcGIS Enterprise.
The Feature service must have branch versioning enabled to use this class.
If you standalone, call GDBVersionManager.getInstance().getUnqiueVMSURL(). This will look through all the data sources and return
an array of valid VMS URLs.
If you also have a VMS enabled service, you can call the other methods directly such as GDBVersionManager.getInstance().getVersions()
*/
export default class GDBVersionManager {
    constructor() {
        this.defaultVersion = 'sde.DEFAULT';
        this.isOrgUser = false;
        this.uniqueURLs = [];
    }
    static getInstance() {
        if (!GDBVersionManager.instance) {
            GDBVersionManager.instance = new GDBVersionManager();
        }
        return GDBVersionManager.instance;
    }
    getUniqueVMSURL(specific) {
        return new Promise((resolve, reject) => {
            const ds = DataSourceManager.getInstance();
            const dsList = ds.getDataSources();
            const urls = [];
            const vmsUrls = [];
            for (const key in dsList) {
                if (specific) {
                    if (key.includes(specific)) {
                        if (dsList[key].type === DataSourceTypes.FeatureLayer) {
                            const dsJson = dsList[key].getDataSourceJson();
                            if (dsJson.url.includes('FeatureServer')) {
                                const trunURL = dsJson.url.substring(0, dsJson.url.indexOf('FeatureServer'));
                                if (!urls.includes(trunURL)) {
                                    urls.push(trunURL);
                                }
                            }
                        }
                    }
                }
                else {
                    if (dsList[key].type === DataSourceTypes.FeatureLayer) {
                        const dsJson = dsList[key].getDataSourceJson();
                        if (dsJson.url.includes('FeatureServer')) {
                            const trunURL = dsJson.url.substring(0, dsJson.url.indexOf('FeatureServer'));
                            if (!urls.includes(trunURL)) {
                                urls.push(trunURL);
                            }
                        }
                    }
                }
            }
            //check if the uniqueURLs have VMS
            if (urls.length > 0) {
                const promises = urls.map((u, i) => __awaiter(this, void 0, void 0, function* () {
                    let valid = false;
                    valid = yield this.checkValidVMS(u);
                    if (valid) {
                        const name = yield this.serviceNameLookup(u);
                        vmsUrls.push({ url: u, name: name });
                    }
                }));
                Promise.all(promises).then((result) => __awaiter(this, void 0, void 0, function* () {
                    this.uniqueURLs = vmsUrls;
                    resolve(vmsUrls);
                }));
            }
            else {
                this.uniqueURLs = vmsUrls;
                resolve(vmsUrls);
            }
        });
    }
    checkValidVMS(url, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnVal = false;
            let trunURL = url;
            if (trunURL.includes('FeatureServer')) {
                trunURL = trunURL.substring(0, trunURL.indexOf('FeatureServer'));
            }
            if (trunURL.includes('MapServer')) {
                trunURL = trunURL.substring(0, trunURL.indexOf('MapServer'));
            }
            const requestURL = trunURL + 'VersionManagementServer';
            let params = null;
            if (token) {
                params = { f: 'json', token: token };
            }
            else {
                params = { f: 'json' };
            }
            returnVal = yield this.requestService({ method: 'POST', url: requestURL, params: params }).then((result) => {
                // eslint-disable-next-line
                if (result.hasOwnProperty('name')) {
                    if (result.name === 'Version Management Server') {
                        return (true);
                    }
                    else {
                        return (false);
                    }
                }
                else {
                    return (false);
                }
            })
                .catch((e) => {
                return (false);
            });
            return returnVal;
        });
    }
    getVersions(service, url, token) {
        return new Promise((resolve, reject) => {
            if (url) {
                let trunURL = url;
                if (trunURL.includes('FeatureServer')) {
                    trunURL = trunURL.substring(0, trunURL.indexOf('FeatureServer'));
                }
                if (trunURL.includes('MapServer')) {
                    trunURL = trunURL.substring(0, trunURL.indexOf('MapServer'));
                }
                if (token) {
                    resolve(this.requestVersions(trunURL, token));
                }
                else {
                    resolve(this.requestVersions(trunURL));
                }
            }
            else {
                if (this.uniqueURLs.length === 0) {
                    this.getUniqueVMSURL().then((arrResult) => {
                        let serviceObj = arrResult[0];
                        if (service) {
                            serviceObj = arrResult.filter((val) => {
                                return (val.name === service);
                            });
                        }
                        const serviceURL = serviceObj[0].url;
                        if (token) {
                            resolve(this.requestVersions(serviceURL, token));
                        }
                        else {
                            resolve(this.requestVersions(serviceURL));
                        }
                    });
                }
                else {
                    let serviceObj = this.uniqueURLs[0];
                    if (service) {
                        serviceObj = this.uniqueURLs.filter((val) => {
                            return (val.name === service);
                        });
                    }
                    const serviceURL = serviceObj[0].url;
                    if (token) {
                        resolve(this.requestVersions(serviceURL, token));
                    }
                    else {
                        resolve(this.requestVersions(serviceURL));
                    }
                }
            }
        });
    }
    changeGDBVersion(name, dsList) {
        let returnVal = false;
        // eslint-disable-next-line
        for (const key in dsList) {
            if (dsList[key].type === DataSourceTypes.FeatureLayer) {
                const dsObj = this.getLayerObject(dsList[key]);
                dsObj.changeGDBVersion(name);
                returnVal = true;
            }
            if (dsList[key].type === DataSourceTypes.FeatureService) {
                dsList[key].changeGDBVersion(name);
                returnVal = true;
            }
            else if (dsList[key].type === DataSourceTypes.MapService) {
                dsList[key].changeGDBVersion(name);
                returnVal = true;
            }
            else {
                //do nothing
            }
        }
        return returnVal;
    }
    createGDBVersion(versionObj, token, dsList, service, url, autoSwitch) {
        return new Promise((resolve, reject) => {
            const returnVal = {};
            let requestURL = null;
            if (this.isOrgUser) {
                const isValid = this.checkValidVersionName(versionObj.versionName);
                if (isValid.success) {
                    if (url) {
                        requestURL = url;
                        if (requestURL.indexOf('FeatureServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('FeatureServer'));
                            requestURL = requestURL + 'VersionManagementServer/create';
                        }
                        else if (requestURL.indexOf('MapServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('MapServer'));
                            requestURL = requestURL + 'VersionManagementServer/create';
                        }
                        else {
                            requestURL = requestURL + 'VersionManagementServer/create';
                        }
                    }
                    else {
                        let serviceObj = this.uniqueURLs[0];
                        if (service) {
                            serviceObj = this.uniqueURLs.filter((val) => {
                                return (val.name === service);
                            });
                        }
                        const serviceURL = serviceObj[0].url;
                        requestURL = serviceURL + 'VersionManagementServer/create';
                    }
                    this.requestService({
                        method: 'POST',
                        url: requestURL,
                        params: {
                            f: 'json',
                            versionName: versionObj.versionName,
                            description: versionObj.versionDescription,
                            accessPermission: versionObj.versionScope,
                            token: token
                        }
                    })
                        .then((result) => {
                        if (autoSwitch) {
                            // eslint-disable-next-line
                            if (result.hasOwnProperty('versionInfo')) {
                                this.changeGDBVersion(result.versionInfo.versionName, dsList);
                            }
                        }
                        resolve(result);
                    })
                        .catch((e) => {
                        resolve(e);
                    });
                }
                else {
                    resolve(isValid);
                }
            }
            else {
                resolve(returnVal);
            }
        });
    }
    deleteGDBVersion(name, token, dsList, service, url) {
        return new Promise((resolve, reject) => {
            if (name.toLowerCase() !== 'sde.default') {
                const returnVal = {};
                let requestURL = null;
                if (this.isOrgUser) {
                    if (url) {
                        requestURL = url;
                        if (requestURL.indexOf('FeatureServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('FeatureServer'));
                            requestURL = requestURL + 'VersionManagementServer/delete';
                        }
                        else if (requestURL.indexOf('MapServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('MapServer'));
                            requestURL = requestURL + 'VersionManagementServer/delete';
                        }
                        else {
                            requestURL = requestURL + 'VersionManagementServer/delete';
                        }
                    }
                    else {
                        let serviceObj = this.uniqueURLs[0];
                        if (service) {
                            serviceObj = this.uniqueURLs.filter((val) => {
                                return (val.name === service);
                            });
                        }
                        const serviceURL = serviceObj[0].url;
                        requestURL = serviceURL + 'VersionManagementServer/delete';
                    }
                    this.requestService({
                        method: 'POST',
                        url: requestURL,
                        params: {
                            f: 'json',
                            versionName: name,
                            sessionId: token,
                            token: token
                        }
                    })
                        .then((result) => {
                        const layersToSwitchToDefault = [];
                        // eslint-disable-next-line
                        for (const key in dsList) {
                            if (dsList[key].type === DataSourceTypes.FeatureLayer) {
                                const dsObj = this.getLayerObject(dsList[key]);
                                if (dsObj.getGDBVersion() === name) {
                                    layersToSwitchToDefault[key] = dsList[key];
                                }
                            }
                        }
                        this.changeGDBVersion(this.defaultVersion, layersToSwitchToDefault);
                        result.version = this.defaultVersion;
                        resolve(result);
                    })
                        .catch((e) => {
                        resolve(e);
                    });
                }
                else {
                    resolve(returnVal);
                }
            }
            else {
                resolve({ error: { message: 'Cannot delete Default version' } });
            }
        });
    }
    alterGDBVersion(versionObj, token, dsList, service, url, autoSwitch) {
        return new Promise((resolve, reject) => {
            const returnVal = {};
            let requestURL = null;
            if (this.isOrgUser) {
                const isValid = this.checkValidVersionName(versionObj.versionName);
                if (isValid.success) {
                    let versionStripped = versionObj.versionGuid.replace('{', '');
                    versionStripped = versionStripped.replace('}', '');
                    if (url) {
                        requestURL = url;
                        if (requestURL.indexOf('FeatureServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('FeatureServer'));
                            requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped + '/alter';
                        }
                        else if (requestURL.indexOf('MapServer') >= 0) {
                            requestURL = requestURL.substring(0, requestURL.indexOf('MapServer'));
                            requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped + '/alter';
                        }
                        else {
                            requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped + '/alter';
                        }
                    }
                    else {
                        let serviceObj = this.uniqueURLs[0];
                        if (service) {
                            serviceObj = this.uniqueURLs.filter((val) => {
                                return (val.name === service);
                            });
                        }
                        const serviceURL = serviceObj[0].url;
                        requestURL = serviceURL + 'VersionManagementServer/versions/' + versionStripped + '/alter';
                    }
                    this.requestService({
                        method: 'POST',
                        url: requestURL,
                        params: {
                            f: 'json',
                            versionName: versionObj.versionName,
                            description: versionObj.versionDescription,
                            accessPermission: versionObj.versionScope,
                            ownerName: versionObj.versionOwner,
                            token: token
                        }
                    })
                        .then((result) => {
                        if (autoSwitch) {
                            this.changeGDBVersion(versionObj.versionOwner + '.' + versionObj.versionName, dsList);
                        }
                        resolve(result);
                    })
                        .catch((e) => {
                        resolve(e);
                    });
                }
                else {
                    resolve(isValid);
                }
            }
            else {
                resolve(returnVal);
            }
        });
    }
    getVersionState(versionObj, token, service, url) {
        return new Promise((resolve, reject) => {
            let requestURL = null;
            let versionStripped = versionObj.versionGuid.replace('{', '');
            versionStripped = versionStripped.replace('}', '');
            if (url) {
                requestURL = url;
                if (requestURL.indexOf('FeatureServer') >= 0) {
                    requestURL = requestURL.substring(0, requestURL.indexOf('FeatureServer'));
                    requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped;
                }
                else if (requestURL.indexOf('MapServer') >= 0) {
                    requestURL = requestURL.substring(0, requestURL.indexOf('MapServer'));
                    requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped;
                }
                else {
                    requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped;
                }
            }
            else {
                let serviceObj = this.uniqueURLs[0];
                if (service) {
                    serviceObj = this.uniqueURLs.filter((val) => {
                        return (val.name === service);
                    });
                }
                const serviceURL = serviceObj[0].url;
                requestURL = serviceURL + 'VersionManagementServer/versions/' + versionStripped;
            }
            this.requestService({
                method: 'POST',
                url: requestURL,
                params: {
                    f: 'json',
                    token: token
                }
            })
                .then((result) => {
                resolve(result);
            })
                .catch((e) => {
                resolve(e);
            });
        });
    }
    checkValidVersionName(name) {
        const retVal = { success: true, error: { message: 'Version is valid' } };
        const charLimit = 62;
        if (name.length <= charLimit) {
            //first character cannot be a space
            if (name.substring(0, 1) === ' ') {
                retVal.success = false;
                retVal.error.message = 'Version name can not start with a space';
            }
            else {
                //version cannot have . ; ' or '
                if (name.match(/(?=.*[.;'"])/)) {
                    retVal.success = false;
                    retVal.error.message = 'Version name can not have a period, semicolon, and single or double quotes';
                }
            }
        }
        else {
            retVal.success = false;
            retVal.error.message = 'Exceeded ' + charLimit + ' characters for version name';
        }
        return retVal;
    }
    requestVersions(serviceURL, token) {
        return new Promise((resolve, reject) => {
            let requestURL = serviceURL;
            let params = {};
            if (token) {
                requestURL = requestURL + 'VersionManagementServer/versionInfos';
                params = { f: 'json', includeHidden: true, token: token };
                this.isOrgUser = true;
            }
            else {
                requestURL = requestURL + 'VersionManagementServer/versions';
                params = { f: 'json', includeHidden: true };
                this.isOrgUser = false;
            }
            //requestURL = requestURL + 'VersionManagementServer/versions';
            this.requestService({ method: 'POST', url: requestURL, params: params })
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                // eslint-disable-next-line
                if (result.hasOwnProperty('error')) {
                    //if there is an error, call again, this time with no token so it goes to the open end point
                    //(won't have create/delete abilities, just for listing and switching)
                    if (token) {
                        if (serviceURL) {
                            console.log('second pass, service url');
                            this.getVersions(serviceURL).then((secondPass) => {
                                //although we get a list of versions using non token endpoint. Manage version tools should not be enabled in consumer.
                                secondPass.canManage = false;
                                resolve(secondPass);
                            });
                        }
                        else {
                            console.log('second pass, no service url');
                            this.getVersions().then((secondPass) => {
                                //although we get a list of versions using non token endpoint. Manage version tools should not be enabled in consumer.
                                secondPass.canManage = false;
                                resolve(secondPass);
                            });
                        }
                    }
                    else {
                        result.canManage = false;
                        resolve(result);
                    }
                }
                else {
                    //inject that you can manage version since it's a signed on org user
                    result.canManage = true;
                    resolve(result);
                }
            }))
                .catch((e) => {
                resolve(e);
            });
        });
    }
    getLayerObject(ds) {
        if (ds.type === DataSourceTypes.FeatureLayer) {
            return ds;
        }
        else {
            return ds;
        }
    }
    serviceNameLookup(service) {
        return new Promise((resolve, reject) => {
            const requestURL = service + 'FeatureServer';
            const params = { f: 'json' };
            this.requestService({ method: 'POST', url: requestURL, params: params }).then((result) => {
                // eslint-disable-next-line
                if (result.hasOwnProperty('documentInfo')) {
                    resolve(result.documentInfo.Title);
                }
                else {
                    resolve('');
                }
            })
                .catch((e) => {
                resolve(e);
            });
        });
    }
    versionRead(opts) {
        return new Promise((resolve, reject) => {
            let requestURL = this.uniqueURLs[0];
            let versionStripped = opts.versionGuid.replace('{', '');
            versionStripped = versionStripped.replace('}', '');
            requestURL = requestURL + 'VersionManagementServer/versions/' + versionStripped + '/' + opts.action + 'Reading/';
            this.requestService({
                method: 'POST',
                url: requestURL,
                params: {
                    f: 'json',
                    sessionId: opts.versionGuid,
                    token: opts.token
                }
            }).then((result) => {
                resolve(result);
            });
        });
    }
    searchPortalUsers(url, search, token) {
        return new Promise((resolve, reject) => {
            //let portalUrl = portalUrlUtils.getPortalSelfInfoUrl(url);
            let userURL = url + '/sharing/rest/community/users';
            if (url.includes('sharing/rest')) {
                userURL = url + '/community/users';
            }
            this.requestService({
                method: 'POST',
                url: userURL,
                params: {
                    f: 'json',
                    q: search,
                    token: token
                }
            })
                .then((result) => {
                resolve(result);
            })
                .catch((e) => {
                resolve(e);
            });
        });
    }
    requestService(opts) {
        return new Promise(function (resolve, reject) {
            const requestOptions = {
                params: opts.params,
                httpMethod: opts.method
            };
            esri.restRequest.request(opts.url, requestOptions).then((result) => {
                resolve(result);
            })
                .catch((e) => {
                resolve(e);
            });
        });
    }
}
//# sourceMappingURL=branch-version-manager.js.map