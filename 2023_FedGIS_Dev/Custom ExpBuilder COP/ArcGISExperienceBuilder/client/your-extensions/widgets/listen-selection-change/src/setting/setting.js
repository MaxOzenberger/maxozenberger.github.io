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
import { React, Immutable } from 'jimu-core';
import { DataSourceSelector, AllDataSourceTypes } from 'jimu-ui/advanced/data-source-selector';
export default function Setting(props) {
    const onToggleUseDataEnabled = (useDataSourcesEnabled) => {
        props.onSettingChange({
            id: props.id,
            useDataSourcesEnabled
        });
    };
    const onDataSourceChange = (useDataSources) => {
        props.onSettingChange({
            id: props.id,
            useDataSources: useDataSources
        });
    };
    return React.createElement("div", { className: 'widget-setting-listen-selection-change p-2' },
        React.createElement(DataSourceSelector, { types: Immutable([AllDataSourceTypes.FeatureLayer]), useDataSources: props.useDataSources, useDataSourcesEnabled: props.useDataSourcesEnabled, onToggleUseDataEnabled: onToggleUseDataEnabled, onChange: onDataSourceChange, widgetId: props.id }));
}
//# sourceMappingURL=setting.js.map