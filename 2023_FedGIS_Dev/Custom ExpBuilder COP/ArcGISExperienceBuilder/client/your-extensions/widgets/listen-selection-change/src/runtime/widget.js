/** @jsx jsx */
/**
  Licensing

  Copyright 2022 Esri

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
import { jsx, css, DataSourceStatus, DataSourceComponent, classNames } from 'jimu-core';
import { Button } from 'jimu-ui';
/**
 * This widget shows how to listen to the selection change of a data source.
 */
export default function Widget(props) {
    const isDsConfigured = () => {
        if (props.useDataSources && props.useDataSources.length === 1) {
            return true;
        }
        return false;
    };
    const dataRender = (ds, info) => {
        return jsx("div", { className: 'record-list' }, ds && ds.getStatus() === DataSourceStatus.Loaded
            ? ds.getRecords().map((r, i) => {
                var _a;
                return jsx(Button, { type: 'tertiary', key: i, onClick: () => ds.selectRecordById(r.getId()), className: classNames({ 'blue-border': (_a = ds.getSelectedRecordIds()) === null || _a === void 0 ? void 0 : _a.includes(r.getId()) }) }, r.getId());
            })
            : null);
    };
    if (!isDsConfigured()) {
        return jsx("h3", null,
            "This widget shows how to listen to the selection change of a data source.",
            jsx("br", null),
            "Please configure the data source.");
    }
    return jsx("div", { className: 'widget-listen-selection-change', css: style },
        jsx("h3", null, "This widget shows how to listen to the selection change of a data source."),
        jsx(DataSourceComponent, { useDataSource: props.useDataSources[0], query: { where: '1=1' }, widgetId: props.id }, dataRender));
}
const style = css `
  width: 100%;
  height: 100%;
  max-height: 800px;
  overflow: auto;
  .blue-border {
    border: 1px solid var(--primary-500);
  }
  .record-list {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 80px);
    overflow: auto;
  }
`;
//# sourceMappingURL=widget.js.map