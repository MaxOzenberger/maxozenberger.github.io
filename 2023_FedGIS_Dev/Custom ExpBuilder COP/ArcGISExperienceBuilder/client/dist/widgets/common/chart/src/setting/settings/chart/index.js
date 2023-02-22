import { React } from 'jimu-core';
import { SettingCollapse, SettingSection } from 'jimu-ui/advanced/setting-components';
import { hooks } from 'jimu-ui';
import { Tools } from './universal';
import WebChartSetting from './web-chart';
import { ChartSettingSection } from './type';
const ChartSetting = (props) => {
    const { type, tools, webChart, useDataSources, onToolsChange, onWebChartChange } = props;
    const translate = hooks.useTranslate();
    const [section, setSection] = React.useState(ChartSettingSection.Data);
    return (React.createElement(React.Fragment, null,
        React.createElement(WebChartSetting, { type: type, section: section, onSectionChange: setSection, webChart: webChart, useDataSources: useDataSources, onWebChartChange: onWebChartChange }),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('tools'), isOpen: section === ChartSettingSection.Tools, onRequestOpen: () => setSection(ChartSettingSection.Tools), onRequestClose: () => setSection(ChartSettingSection.None) },
                React.createElement(Tools, { type: type, tools: tools, onChange: onToolsChange })))));
};
export default ChartSetting;
//# sourceMappingURL=index.js.map