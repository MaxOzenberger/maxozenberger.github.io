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
import { React, css, jsx } from 'jimu-core';
import { NumericInput, Slider } from 'jimu-ui';
export class RemapRanges extends React.PureComponent {
    render() {
        const wroModel = this.props.wroModel;
        const modelLayer = this.props.modelLayer;
        const items = [];
        const ranges = modelLayer === null || modelLayer === void 0 ? void 0 : modelLayer.remapRanges;
        if (ranges) {
            ranges.forEach((range, i) => {
                items.push(this.renderRange(range, i, modelLayer, wroModel));
            });
        }
        return (jsx("div", { className: 'widget-wro-remap-panel' }, items));
    }
    renderRange(remapRange, index, modelLayer, wroModel) {
        const nls = this.props.wroContext.nls;
        const modelController = this.props.wroContext.modelController;
        const key = 'remap_' + modelLayer.rasterLayerId.toString() + '_' + index.toString();
        let minmax;
        if (remapRange.inputMin === remapRange.inputMax) {
            minmax = `${remapRange.inputMin}`;
        }
        else {
            minmax = `${remapRange.inputMin} - ${remapRange.inputMax}`;
        }
        const rangeLabel = nls('wro_remap_label', {
            name: remapRange.label,
            minmax: minmax
        });
        const onInputChange = (v) => {
            if (typeof v === 'number') {
                modelController.setRemapOutputValue(wroModel, modelLayer.rasterLayerId, index, v);
            }
        };
        const onSliderChange = (e) => {
            const v = parseInt(e.target.value);
            modelController.setRemapOutputValue(wroModel, modelLayer.rasterLayerId, index, v);
        };
        const inputSectionStyle = css `
      white-space: nowrap;
    `;
        return (jsx("div", { key: key + '_item', className: 'widget-wro-remap-range' },
            jsx("div", { className: 'widget-wro-remap-range-label', title: rangeLabel }, rangeLabel),
            jsx("div", { key: key + '_inputSection', css: inputSectionStyle },
                jsx(Slider, { key: key + '_slider', className: 'widget-wro-remap-slider', min: 0, max: 9, step: 1, value: remapRange.outputValue, onChange: onSliderChange }),
                jsx(NumericInput, { key: key + '_input', className: 'widget-wro-remap-numeric-input', size: 'sm', min: 0, max: 9, precision: 0, showHandlers: false, value: remapRange.outputValue, onChange: onInputChange }))));
    }
}
//# sourceMappingURL=remap.js.map