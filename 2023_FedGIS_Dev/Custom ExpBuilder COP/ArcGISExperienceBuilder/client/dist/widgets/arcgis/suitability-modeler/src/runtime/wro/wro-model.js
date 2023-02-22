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
import { getDefaultColormapName } from './wro-colormaps';
/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
export class ModelController {
    // _subscribers = [];
    clear(wroModel) {
        wroModel = ModelFactory.cloneModel(wroModel);
        wroModel.colormapName = getDefaultColormapName();
        if (wroModel.modelLayers) {
            wroModel.modelLayers.forEach((ml) => {
                ml.selected = false;
                ml.remapOpen = false;
                ml.weight = null;
                const rasterLayer = ModelFactory.findRasterLayer(wroModel, ml.rasterLayerId);
                if (rasterLayer === null || rasterLayer === void 0 ? void 0 : rasterLayer.remapRanges) {
                    ml.remapRanges = ModelFactory.cloneRemapRanges(rasterLayer.remapRanges);
                }
            });
        }
        wroModel.activePanel = 'layers-panel';
        this.onModelChange(wroModel, true);
        return wroModel;
    }
    isLayerSelected(wroModel, rasterLayerId) {
        const modelLayer = ModelFactory.findModelLayer(wroModel, rasterLayerId);
        return !!(modelLayer === null || modelLayer === void 0 ? void 0 : modelLayer.selected);
    }
    isValid(wroModel) {
        let total = 0;
        if (wroModel === null || wroModel === void 0 ? void 0 : wroModel.modelLayers) {
            wroModel.modelLayers.forEach(ml => {
                if (ml.selected) {
                    if (typeof ml.weight === 'number') {
                        total += ml.weight;
                    }
                }
            });
        }
        return (total === 100);
    }
    // onModelChange(wroModel: WroModel) {
    //   this._subscribers.forEach(callback => {
    //     callback(wroModel);
    //   });
    // }
    // overriden by widget.tsx
    onModelChange(wroModel, wasCleared) { }
    // overriden by widget.tsx
    onStatusChange(wroStatus) { }
    selectLayer(wroModel, rasterLayerId, selected) {
        wroModel = ModelFactory.cloneModel(wroModel);
        const modelLayer = ModelFactory.findModelLayer(wroModel, rasterLayerId);
        const considerReset = true;
        const reset = considerReset && !selected;
        if (modelLayer && reset) {
            const rasterLayer = ModelFactory.findRasterLayer(wroModel, rasterLayerId);
            if (rasterLayer === null || rasterLayer === void 0 ? void 0 : rasterLayer.remapRanges) {
                modelLayer.remapRanges = ModelFactory.cloneRemapRanges(rasterLayer.remapRanges);
            }
            modelLayer.remapOpen = false;
            modelLayer.weight = null;
        }
        if (modelLayer)
            modelLayer.selected = !!selected;
        this.onModelChange(wroModel);
        return wroModel;
    }
    setActivePanel(wroModel, activePanel) {
        wroModel = ModelFactory.cloneModel(wroModel);
        wroModel.activePanel = activePanel;
        this.onModelChange(wroModel);
        return wroModel;
    }
    setColormapName(wroModel, colormapName) {
        wroModel = ModelFactory.cloneModel(wroModel);
        wroModel.colormapName = colormapName;
        this.onModelChange(wroModel);
        return wroModel;
    }
    setMapLayerId(wroModel, mapLayerId) {
        wroModel = ModelFactory.cloneModel(wroModel);
        wroModel.mapLayerId = mapLayerId;
        wroModel.lastRun = this.stringifyCriteria(wroModel);
        this.onModelChange(wroModel);
        return wroModel;
    }
    setRemapOpen(wroModel, rasterLayerId, remapOpen) {
        wroModel = ModelFactory.cloneModel(wroModel);
        const modelLayer = ModelFactory.findModelLayer(wroModel, rasterLayerId);
        if (modelLayer)
            modelLayer.remapOpen = !!remapOpen;
        this.onModelChange(wroModel);
        return wroModel;
    }
    setRemapOutputValue(wroModel, rasterLayerId, index, outputValue) {
        wroModel = ModelFactory.cloneModel(wroModel);
        const modelLayer = ModelFactory.findModelLayer(wroModel, rasterLayerId);
        if (modelLayer)
            modelLayer.remapRanges[index].outputValue = outputValue;
        this.onModelChange(wroModel);
        return wroModel;
    }
    setWeight(wroModel, rasterLayerId, weight) {
        wroModel = ModelFactory.cloneModel(wroModel);
        const modelLayer = ModelFactory.findModelLayer(wroModel, rasterLayerId);
        if (modelLayer)
            modelLayer.weight = weight;
        this.onModelChange(wroModel);
        return wroModel;
    }
    stringifyCriteria(wroModel) {
        const mlyrs = [];
        if (wroModel.modelLayers) {
            wroModel.modelLayers.forEach((ml) => {
                if (ml.selected && (typeof ml.weight === 'number') && (ml.weight > 0)) {
                    mlyrs.push({
                        remapRanges: ml.remapRanges,
                        weight: ml.weight
                    });
                }
            });
        }
        return JSON.stringify({
            colormapName: wroModel.colormapName,
            mapLayerId: wroModel.mapLayerId,
            modelLayers: mlyrs,
            serviceUrl: wroModel.serviceUrl
        });
    }
}
export class ModelFactory {
    static cloneModel(wroModel) {
        wroModel = JSON.parse(JSON.stringify(wroModel));
        return wroModel;
    }
    static cloneRasterLayers(rasterLayers) {
        rasterLayers = JSON.parse(JSON.stringify(rasterLayers));
        return rasterLayers;
    }
    static cloneRemapRanges(remapRanges) {
        remapRanges = JSON.parse(JSON.stringify(remapRanges));
        return remapRanges;
    }
    static cloneStatus(wroStatus) {
        wroStatus = JSON.parse(JSON.stringify(wroStatus));
        return wroStatus;
    }
    static findModelLayer(wroModel, rasterLayerId) {
        let modelLayer;
        if (wroModel.modelLayers) {
            wroModel.modelLayers.some((ml) => {
                if (ml.rasterLayerId === rasterLayerId) {
                    modelLayer = ml;
                }
                return !!modelLayer;
            });
        }
        return modelLayer;
    }
    static findRasterLayer(wroModel, rasterLayerId) {
        let rasterLayer;
        if (wroModel.rasterLayers) {
            wroModel.rasterLayers.some((rl) => {
                if (rl.rasterLayerId === rasterLayerId) {
                    rasterLayer = rl;
                }
                return !!rasterLayer;
            });
        }
        return rasterLayer;
    }
    static initModel(wroService, loadErrors) {
        const wroModel = this.newWroModel();
        wroModel.serviceUrl = wroService.serviceUrl;
        if (loadErrors && loadErrors.length > 0) {
            wroModel.loadErrors = JSON.parse(JSON.stringify(loadErrors));
        }
        if (wroService === null || wroService === void 0 ? void 0 : wroService.rasterLayers) {
            wroModel.rasterLayers = this.cloneRasterLayers(wroService.rasterLayers);
            wroModel.rasterLayers.forEach(rl => {
                const ml = this.newModelLayer();
                ml.rasterLayerId = rl.rasterLayerId;
                ml.title = rl.title;
                if (rl.remapRanges) {
                    ml.remapRanges = this.cloneRemapRanges(rl.remapRanges);
                }
                if (ml.remapRanges && ml.remapRanges.length > 0) {
                    wroModel.modelLayers.push(ml);
                }
            });
        }
        return wroModel;
    }
    static newIssue() {
        const issue = {
            detail: null,
            message: null
        };
        return issue;
    }
    static newModelLayer() {
        const modelLayer = {
            rasterLayerId: null,
            remapOpen: false,
            remapRanges: [],
            selected: false,
            title: null,
            weight: null
        };
        return modelLayer;
    }
    static newRasterLayer() {
        const rasterLayer = {
            metadata: null,
            name: null,
            rasterLayerId: null,
            remapRanges: [],
            title: null,
            url: null
        };
        return rasterLayer;
    }
    static newRemapRange() {
        const remapRange = {
            inputMax: null,
            inputMin: null,
            label: null,
            originalOutputValue: null,
            outputValue: null
        };
        return remapRange;
    }
    static newWroModel() {
        const wroModel = {
            activePanel: null,
            colormapName: getDefaultColormapName(),
            lastRun: null,
            loadErrors: [],
            mapLayerId: null,
            modelLayers: [],
            rasterLayers: [],
            serviceUrl: null
        };
        return wroModel;
    }
    static newWroStatus() {
        const wroModel = {
            activePanel: null,
            isModelLoading: false,
            isModelRunning: false,
            themeId: null,
            viewId: null
        };
        return wroModel;
    }
}
//# sourceMappingURL=wro-model.js.map