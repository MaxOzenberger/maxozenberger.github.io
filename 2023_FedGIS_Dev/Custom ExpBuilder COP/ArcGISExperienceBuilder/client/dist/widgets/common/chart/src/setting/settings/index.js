import { DataSourceStatus, React, ReactRedux } from 'jimu-core';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import { hooks } from 'jimu-ui';
import ChartSetting from './chart';
import defaultMessages from '../translations/default';
import ChartTypeSelector from './chart-type-selector';
import { Placeholder } from './components';
export const ChartSettings = (props) => {
    var _a;
    const { type, template, tools, webChart, useDataSources, onTemplateChange, onToolsChange, onWebChartChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const sourceStatus = ReactRedux.useSelector((state) => { var _a, _b, _c, _d; return (_d = (_b = (_a = state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.dataSourcesInfo) === null || _b === void 0 ? void 0 : _b[(_c = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _c === void 0 ? void 0 : _c.dataSourceId]) === null || _d === void 0 ? void 0 : _d.instanceStatus; });
    const hasDataSource = !!((_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId);
    return (React.createElement(React.Fragment, null,
        sourceStatus === DataSourceStatus.Created && React.createElement(React.Fragment, null,
            React.createElement(SettingSection, null,
                React.createElement(SettingRow, { label: translate('chartType'), flow: 'wrap', level: 1 },
                    React.createElement(ChartTypeSelector, { templateId: template, useDataSources: useDataSources, webChart: webChart, onChange: onTemplateChange }))),
            webChart && (React.createElement(ChartSetting, { type: type, tools: tools, webChart: webChart, useDataSources: useDataSources, onToolsChange: onToolsChange, onWebChartChange: onWebChartChange }))),
        !hasDataSource && React.createElement(Placeholder, { messageId: 'chart-blank-msg', placeholder: translate('selectDataPlaceholder') })));
};
//# sourceMappingURL=index.js.map