import { React } from 'jimu-core';
import { SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { defaultMessages as jimuBuilderDefaultMessage } from 'jimu-for-builder';
import defaultMessages from '../../../../translations/default';
import { ChartSettingSection } from '../../type';
import { AppearanceSetting } from '../common-sections/appearance';
import { PieGeneralSetting } from '../common-sections/genaral';
import { PieSeriesSetting } from '../common-sections/series';
import { StatisticsDataSetting } from '../common-sections/data';
const PieSetting = (props) => {
    const { type, section, webChart, onSectionChange, useDataSources, onWebChartChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage, jimuBuilderDefaultMessage);
    const handleSeiesChange = (series, otherProps) => {
        var _a;
        const chartDataSource = otherProps === null || otherProps === void 0 ? void 0 : otherProps.chartDataSource;
        if (chartDataSource) {
            if (chartDataSource.query !== ((_a = webChart === null || webChart === void 0 ? void 0 : webChart.dataSource) === null || _a === void 0 ? void 0 : _a.query)) {
                onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(webChart.set('dataSource', chartDataSource).set('series', series), chartDataSource === null || chartDataSource === void 0 ? void 0 : chartDataSource.query);
            }
            else {
                onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(webChart.set('dataSource', chartDataSource).set('series', series));
            }
        }
        else {
            onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(webChart.set('series', series));
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('data'), isOpen: section === ChartSettingSection.Data, onRequestOpen: () => onSectionChange(ChartSettingSection.Data), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(StatisticsDataSetting, { type: type, chartDataSource: webChart === null || webChart === void 0 ? void 0 : webChart.dataSource, useDataSources: useDataSources, series: webChart === null || webChart === void 0 ? void 0 : webChart.series, onChange: handleSeiesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('slices'), isOpen: section === ChartSettingSection.Series, onRequestOpen: () => onSectionChange(ChartSettingSection.Series), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(PieSeriesSetting, { useDataSources: useDataSources, chartDataSource: webChart.dataSource, series: webChart === null || webChart === void 0 ? void 0 : webChart.series, onChange: handleSeiesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('general'), isOpen: section === ChartSettingSection.General, onRequestOpen: () => onSectionChange(ChartSettingSection.General), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(PieGeneralSetting, { value: webChart, onChange: onWebChartChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('appearance'), isOpen: section === ChartSettingSection.Appearance, onRequestOpen: () => onSectionChange(ChartSettingSection.Appearance), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(AppearanceSetting, { webChart: webChart, onChange: onWebChartChange }))))));
};
export default PieSetting;
//# sourceMappingURL=index.js.map