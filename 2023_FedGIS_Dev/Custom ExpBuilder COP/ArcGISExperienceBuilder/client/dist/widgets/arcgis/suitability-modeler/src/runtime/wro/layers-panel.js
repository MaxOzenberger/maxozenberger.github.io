/** @jsx jsx */
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
import { React, jsx } from 'jimu-core';
import { Checkbox, Label } from 'jimu-ui';
export class LayersPanel extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handlePanelClicked = () => {
            const modelController = this.props.wroContext.modelController;
            const wroModel = this.props.wroModel;
            if (wroModel) {
                modelController.setActivePanel(wroModel, 'model-panel');
            }
        };
    }
    render() {
        const nls = this.props.wroContext.nls;
        const wroModel = this.props.wroModel;
        const loadErrors = wroModel === null || wroModel === void 0 ? void 0 : wroModel.loadErrors;
        const rasterLayers = wroModel === null || wroModel === void 0 ? void 0 : wroModel.rasterLayers;
        const hasMap = !!this.props.wroStatus.viewId;
        let items = [];
        if (this.props.wroStatus.isModelLoading) {
            items = [
                jsx("li", { key: 'loading', className: 'widget-wro-loading-msg' }, nls('wro_general_loading'))
            ];
        }
        else if (loadErrors && loadErrors.length > 0) {
            loadErrors.forEach((v) => {
                items.push(jsx("li", { key: v.message, className: 'widget-wro-loading-error-msg' }, v.message));
            });
        }
        else if (!wroModel) {
            let prop = 'wro_validation_noModel';
            if (!hasMap)
                prop = 'wro_validation_noMap';
            items = [
                jsx("li", { key: 'noMap', className: 'widget-wro-loading-error-msg widget-wro-fadein' }, nls(prop))
            ];
        }
        else if (!rasterLayers || rasterLayers.length === 0) {
            items = [
                jsx("li", { key: 'noLayers', className: 'widget-wro-loading-error-msg' }, nls('wro_validation_noLayers'))
            ];
        }
        else if (rasterLayers && rasterLayers.length > 0) {
            rasterLayers.forEach((rl) => {
                const item = this.renderLayer(rl, wroModel);
                items.push(item);
            });
        }
        return (jsx("div", { className: 'widget-wro-layers-panel' },
            jsx("div", { className: 'widget-wro-layers-body' },
                jsx("ul", { className: 'widget-wro-layers-list' }, items),
                jsx("div", { className: 'widget-wro-layers-footer' }))));
    }
    renderLayer(rasterLayer, wroModel) {
        const modelController = this.props.wroContext.modelController;
        const handleChange = (e, checked) => {
            if (e) {
                modelController.selectLayer(wroModel, rasterLayer.rasterLayerId, !!checked);
            }
        };
        const title = rasterLayer.title;
        const checked = modelController.isLayerSelected(wroModel, rasterLayer.rasterLayerId);
        return (jsx("li", { key: rasterLayer.name },
            jsx(Label, null,
                jsx(Checkbox, { checked: checked, onChange: handleChange }),
                jsx("span", { className: 'widget-wro-layer-title' }, title))));
    }
}
//# sourceMappingURL=layers-panel.js.map