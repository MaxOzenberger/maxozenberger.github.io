/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModelFactory } from './wro-model';
import * as layerUtil from './wro-layer-util';
import * as rasterUtil from './wro-raster-util';
import PortalItem from 'esri/portal/PortalItem';
import esriRequest from 'esri/request';
export class WroService {
    checkMixedContent(uri) {
        if (typeof window.location.href === 'string' &&
            window.location.href.indexOf('https://') === 0) {
            if (typeof uri === 'string' && uri.indexOf('http://') === 0) {
                uri = 'https:' + uri.substring(5);
            }
        }
        return uri;
    }
    loadModel(wroContext, serviceUrl, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nls = wroContext.nls;
            const errors = [];
            let wroModel = ModelFactory.newWroModel();
            let item = null;
            let renderingRule;
            itemId = (typeof itemId === 'string') ? itemId.trim() : null;
            serviceUrl = (typeof serviceUrl === 'string') ? serviceUrl.trim() : null;
            const trackError = (uiMessage, error) => {
                const issue = ModelFactory.newIssue();
                issue.message = uiMessage;
                if (error === null || error === void 0 ? void 0 : error.message)
                    issue.detail = error.message;
                errors.push(issue);
            };
            if (!serviceUrl && !itemId && errors.length === 0) {
                trackError(nls('wro_validation_wroServiceNotDefined'));
            }
            if (!serviceUrl && itemId && errors.length === 0) {
                this.itemId = itemId;
                item = new PortalItem({
                    id: itemId
                });
                try {
                    yield item.load();
                }
                catch (ex) {
                    console.error('Error loading item', itemId, ex);
                    trackError(nls('wro_validation_errorLoadingItem'), ex);
                }
                if (errors.length === 0) {
                    if (!this.serviceTitle && item.title) {
                        this.serviceTitle = item.title;
                    }
                    serviceUrl = (typeof item.url === 'string') ? item.url.trim() : null;
                    if (!serviceUrl) {
                        trackError(nls('wro_validation_undefinedItemUrl'));
                    }
                }
                if (errors.length === 0) {
                    try {
                        const data = yield item.fetchData('json');
                        // console.log("Service item data:",data);
                        renderingRule = data === null || data === void 0 ? void 0 : data.renderingRule;
                    }
                    catch (ex) {
                        console.error('Error fetching item data', itemId, ex);
                        trackError(nls('wro_validation_errorLoadingItem'), ex);
                    }
                }
            }
            if (serviceUrl && errors.length === 0) {
                this.serviceUrl = this.checkMixedContent(serviceUrl);
                if (this.serviceUrl.indexOf('http://') !== 0 &&
                    this.serviceUrl.indexOf('https://') !== 0) {
                    trackError(nls('wro_validation_invalidServiceUrl'));
                }
                else {
                    try {
                        const url = new URL(this.serviceUrl);
                        if (!url)
                            trackError(nls('wro_validation_invalidServiceUrl'));
                    }
                    catch (ex) {
                        trackError(nls('wro_validation_invalidServiceUrl'));
                    }
                }
                if (errors.length === 0) {
                    try {
                        this.serviceJson = yield this.readServiceJson(this.serviceUrl);
                        if (!this.serviceTitle && this.serviceJson && this.serviceJson.name) {
                            this.serviceTitle = this.serviceJson.name;
                        }
                    }
                    catch (ex) {
                        console.error('Error loading service', this.serviceUrl, ex);
                        trackError(nls('wro_validation_errorloadingService'), ex);
                    }
                }
                if (errors.length === 0) {
                    layerUtil.validateWROLayer(wroContext.nls, this.serviceJson, errors);
                }
                if (errors.length === 0) {
                    try {
                        yield this.queryRasters(this.serviceUrl);
                    }
                    catch (ex) {
                        console.error('Error querying mosaic', this.serviceUrl, ex);
                        trackError(nls('wro_validation_errorQueryingLayers'), ex);
                    }
                }
            }
            const hasRasters = (this.rasterLayers && this.rasterLayers.length > 0);
            if (errors.length === 0 && !hasRasters) {
                trackError(nls('wro_validation_noLayers'));
            }
            wroModel = ModelFactory.initModel(this, errors);
            if (renderingRule && errors.length === 0) {
                rasterUtil.renderingRuleToModel(wroModel, renderingRule);
            }
            return wroModel;
        });
    }
    queryRasters(url) {
        return __awaiter(this, void 0, void 0, function* () {
            url = url + '/query';
            const query = {
                f: 'json',
                where: '1=1',
                outFields: ['*'],
                returnGeometry: false
            };
            const options = { query: query, responseType: 'json' };
            // @ts-expect-error
            return esriRequest(url, options).then(result => {
                var _a;
                // console.log("queryRasters",result);
                const features = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.features;
                if (features && features.length > 0 && features[0].attributes) {
                    const fld = 'Title';
                    features.sort((a, b) => {
                        if (a.attributes[fld] < b.attributes[fld]) {
                            return -1;
                        }
                        else if (a.attributes[fld] > b.attributes[fld]) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    });
                    const rasterLayers = [];
                    features.forEach(feature => {
                        const rasterLayer = rasterUtil.featureToRasterLayer(feature);
                        if (rasterLayer) {
                            rasterLayer.url = this.checkMixedContent(rasterLayer.url);
                            rasterLayers.push(rasterLayer);
                        }
                    });
                    this.rasterLayers = rasterLayers;
                }
            });
        });
    }
    readServiceJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { query: { f: 'json' }, responseType: 'json' };
            // @ts-expect-error
            return esriRequest(url, options).then(result => {
                return result === null || result === void 0 ? void 0 : result.data;
            });
        });
    }
}
//# sourceMappingURL=wro-service.js.map