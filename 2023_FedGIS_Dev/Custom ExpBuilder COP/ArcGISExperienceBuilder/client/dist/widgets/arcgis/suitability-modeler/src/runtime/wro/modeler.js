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
import { Tabs, Tab } from 'jimu-ui';
import { ChartPanel } from './chart-panel';
import { LayersPanel } from './layers-panel';
import { ModelPanel } from './model-panel';
import * as wroUtil from './wro-util';
export class Modeler extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canEnableChart = () => {
            return wroUtil.canComputeHistograms(this.props);
        };
        this.canEnableDesignModel = () => {
            const wroModel = this.props.wroModel;
            let hasSelectedlayers = false;
            if (wroModel === null || wroModel === void 0 ? void 0 : wroModel.modelLayers) {
                hasSelectedlayers = wroModel.modelLayers.some(ml => !!ml.selected);
            }
            return hasSelectedlayers;
        };
        this.chartPanelRef = React.createRef();
    }
    componentDidUpdate(prevProps) {
        const modelController = this.props.wroContext.modelController;
        const wroModel = this.props.wroModel;
        if (wroModel && prevProps.wroModel !== wroModel) {
            const activePanel = wroModel.activePanel;
            if (activePanel === 'model-panel' && !this.canEnableDesignModel()) {
                modelController.setActivePanel(wroModel, 'layers-panel');
            }
            else if (activePanel === 'chart-panel' && !this.canEnableChart()) {
                modelController.setActivePanel(wroModel, 'layers-panel');
            }
        }
    }
    render() {
        const nls = this.props.wroContext.nls;
        const modelController = this.props.wroContext.modelController;
        const wroContext = this.props.wroContext;
        const wroModel = this.props.wroModel;
        const wroStatus = this.props.wroStatus;
        const hasModel = !!wroModel;
        const activePanel = (wroModel === null || wroModel === void 0 ? void 0 : wroModel.activePanel) || 'layers-panel';
        // isModelLoading??? isModelRunning???
        const handleTabChanged = (v) => {
            if (wroModel) {
                modelController.setActivePanel(wroModel, v);
            }
        };
        const disableDesignModel = !this.canEnableDesignModel();
        const disableChart = !this.canEnableChart();
        return (jsx("div", { className: 'widget-wro-modeler' },
            jsx("h4", { className: 'widget-wro-header', style: { display: this.props.wroContext.getLabel() ? 'block' : 'none' } }, this.props.wroContext.getLabel()),
            jsx("div", { className: 'widget-wro-body' },
                jsx(Tabs, { className: 'widget-wro-tabs', value: activePanel, onChange: handleTabChanged, type: 'underline' },
                    jsx(Tab, { id: 'layers-panel', title: nls('wro_main_selectLayersCaption') },
                        jsx(LayersPanel, { wroContext: wroContext, wroModel: wroModel, wroStatus: wroStatus })),
                    jsx(Tab, { id: 'model-panel', title: nls('wro_main_designModelCaption'), disabled: !hasModel || disableDesignModel },
                        jsx(ModelPanel, { wroContext: wroContext, wroModel: wroModel, wroStatus: wroStatus })),
                    jsx(Tab, { id: 'chart-panel', title: nls('wro_chart_generate'), disabled: !hasModel || disableChart },
                        jsx(ChartPanel, { ref: this.chartPanelRef, wroContext: wroContext, wroModel: wroModel, wroStatus: wroStatus }))))));
    }
}
//# sourceMappingURL=modeler.js.map