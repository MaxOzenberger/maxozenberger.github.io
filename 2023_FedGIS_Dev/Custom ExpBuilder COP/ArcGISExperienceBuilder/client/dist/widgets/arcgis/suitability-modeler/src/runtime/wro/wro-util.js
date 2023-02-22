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
import PortalItem from 'esri/portal/PortalItem';
export function canComputeHistograms(props) {
    const imageLayer = getImageLayer(props);
    return !!(imageLayer === null || imageLayer === void 0 ? void 0 : imageLayer.renderingRule);
}
export function exportModel(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, summary, description, tags, folder } = task;
        const { itemData, portal, serviceUrl } = task;
        let tagsA = [];
        if (typeof tags === 'string') {
            const a = tags.split(',');
            tagsA = a.filter(v => (v.length > 0));
        }
        if (tagsA.length === 0)
            tagsA = ['weightedOverlayModel', 'geodesign'];
        const item = new PortalItem({
            type: 'Image Service',
            typeKeywords: ['geodesignModelerLayer'],
            title: title,
            snippet: summary,
            description: description,
            tags: tagsA,
            url: serviceUrl
        });
        const params = {
            item: item
        };
        if (itemData)
            params.data = JSON.stringify(itemData);
        if (folder)
            params.folder = folder;
        yield portal.user.addItem(params);
    });
}
export function getImageLayer(props) {
    const wroModel = props.wroModel;
    const view = props.wroContext.getView();
    if ((view === null || view === void 0 ? void 0 : view.map) && (wroModel === null || wroModel === void 0 ? void 0 : wroModel.mapLayerId)) {
        return (view.map.findLayerById(wroModel.mapLayerId));
    }
}
export function getPolygonLayers(props) {
    const layers = [];
    const view = props.wroContext.getView();
    if (view === null || view === void 0 ? void 0 : view.map) {
        view.map.allLayers.forEach(lyr => {
            if (lyr.type === 'feature' && lyr.geometryType === 'polygon') {
                layers.push(lyr);
            }
        });
        layers.reverse();
    }
    return layers;
}
//# sourceMappingURL=wro-util.js.map