import { React, Immutable, defaultMessages as jimucoreMessages, getAppStore, AllDataSourceTypes } from 'jimu-core';
import { defaultMessages as jimuiMessages, hooks } from 'jimu-ui';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { ChartSettings } from './settings';
import defaultMessages from './translations/default';
import { createInitOutputDataSource, updateDataSources } from './data-source';
import { getSeriesType } from 'jimu-ui/advanced/chart';
const SUPPORTED_TYPES = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
const Setting = (props) => {
    var _a, _b;
    const { id, useDataSources: propUseDataSources, outputDataSources: propOutputDataSources, onSettingChange, config: propConfig, label } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuiMessages, jimucoreMessages);
    const { template = '', webChart, tools } = propConfig;
    const seriesType = (_a = getSeriesType(webChart === null || webChart === void 0 ? void 0 : webChart.series)) !== null && _a !== void 0 ? _a : 'barSeries';
    const outputDataSourceId = (_b = propOutputDataSources === null || propOutputDataSources === void 0 ? void 0 : propOutputDataSources[0]) !== null && _b !== void 0 ? _b : '';
    const outputDataSourceLabel = translate('outputStatistics', { name: label });
    const handleUseDataSourceChange = (useDataSources) => {
        let outputDataSources = [];
        if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0) {
            const outputId = id + '_ouput';
            //create the corresponding output data source after use data source changes
            const outputDataSource = createInitOutputDataSource(outputId, outputDataSourceLabel, useDataSources[0]);
            outputDataSources = [outputDataSource];
        }
        const config = propConfig.without('webChart').set('tools', { cursorEnable: true }).without('template');
        onSettingChange({ id, useDataSources, config }, outputDataSources);
    };
    const handleTemplateChange = (templateId, webChart) => {
        var _a;
        const config = propConfig.set('template', templateId).set('webChart', webChart).set('tools', { cursorEnable: true });
        const [useDataSources, outputDataSource] = updateDataSources(propUseDataSources, outputDataSourceId, (_a = webChart === null || webChart === void 0 ? void 0 : webChart.dataSource) === null || _a === void 0 ? void 0 : _a.query, seriesType);
        if (useDataSources && outputDataSource) {
            onSettingChange({ id, config, useDataSources }, [outputDataSource]);
        }
        else {
            onSettingChange({ id, config });
        }
    };
    //Update output ds label when the label of widget changes
    React.useEffect(() => {
        var _a, _b;
        let outputDataSource = (_b = (_a = getAppStore().getState().appStateInBuilder.appConfig) === null || _a === void 0 ? void 0 : _a.dataSources) === null || _b === void 0 ? void 0 : _b[outputDataSourceId];
        if (outputDataSource && outputDataSource.label !== outputDataSourceLabel) {
            outputDataSource = outputDataSource.set('label', outputDataSourceLabel);
            onSettingChange({ id }, [outputDataSource.asMutable({ deep: true })]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outputDataSourceLabel]);
    const handleWebChartChange = (webChart, query) => {
        const config = propConfig.set('webChart', webChart);
        if (query) {
            const [useDataSources, outputDataSource] = updateDataSources(propUseDataSources, outputDataSourceId, query, seriesType);
            if (useDataSources && outputDataSource) {
                onSettingChange({ id, config, useDataSources }, [outputDataSource]);
            }
            else {
                onSettingChange({ id, config });
            }
        }
        else {
            onSettingChange({ id, config });
        }
    };
    const handleToolsChange = (tools) => {
        onSettingChange({ id, config: propConfig.set('tools', tools) });
    };
    return (React.createElement("div", { className: 'widget-setting-chart jimu-widget-setting' },
        React.createElement("div", { className: 'w-100 h-100' },
            React.createElement("div", { className: 'w-100' },
                React.createElement(SettingSection, { className: 'd-flex flex-column pb-0' },
                    React.createElement(SettingRow, { label: translate('data'), flow: "wrap", level: 1 },
                        React.createElement(DataSourceSelector, { isMultiple: false, "aria-describedby": 'chart-blank-msg', mustUseDataSource: true, types: SUPPORTED_TYPES, useDataSources: propUseDataSources, onChange: handleUseDataSourceChange, widgetId: id })))),
            React.createElement(ChartSettings, { type: seriesType, template: template, onTemplateChange: handleTemplateChange, useDataSources: propUseDataSources, tools: tools, webChart: webChart, onToolsChange: handleToolsChange, onWebChartChange: handleWebChartChange }))));
};
export default Setting;
//# sourceMappingURL=setting.js.map