import { React } from 'jimu-core';
import { versionManager } from '../version-manager';
import { ChartRuntimeStateProvider } from './state';
import Chart from './chart';
const Widget = (props) => {
    const { outputDataSources, useDataSources, config, id, enableDataAction } = props;
    const webChart = config === null || config === void 0 ? void 0 : config.webChart;
    const tools = config === null || config === void 0 ? void 0 : config.tools;
    const defaultTemplateType = config === null || config === void 0 ? void 0 : config._templateType;
    return (React.createElement("div", { className: 'jimu-widget widget-chart' },
        React.createElement(ChartRuntimeStateProvider, null,
            React.createElement(Chart, { widgetId: id, tools: tools, webChart: webChart, useDataSource: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0], outputDataSourceId: outputDataSources === null || outputDataSources === void 0 ? void 0 : outputDataSources[0], enableDataAction: enableDataAction, defaultTemplateType: defaultTemplateType }))));
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map