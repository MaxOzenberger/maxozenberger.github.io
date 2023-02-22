import { React } from 'jimu-core';
import { SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { StatisticsDataSetting } from '../common-sections/data';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { defaultMessages as jimuBuilderDefaultMessage } from 'jimu-for-builder';
import { getSerialSeriesRotated } from '../../../../../utils/common/serial';
import defaultMessages from '../../../../translations/default';
import { ChartSettingSection } from '../../type';
import { AppearanceSetting } from '../common-sections/appearance';
import { AxesSetting } from '../common-sections/axes';
import { XYGeneralSetting } from '../common-sections/genaral';
import { SerialSeriesSetting } from '../common-sections/series';
const SerialSetting = (props) => {
    var _a;
    const { type, section, webChart: propWebChart, useDataSources, onSectionChange, onWebChartChange } = props;
    const rotated = getSerialSeriesRotated(propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series);
    const legendValid = (propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series) != null && ((_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series) === null || _a === void 0 ? void 0 : _a.length) > 1;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage, jimuBuilderDefaultMessage);
    const handleSeriesChange = (series, otherProps) => {
        var _a;
        const chartDataSource = otherProps === null || otherProps === void 0 ? void 0 : otherProps.chartDataSource;
        const valueFormat = otherProps === null || otherProps === void 0 ? void 0 : otherProps.valueFormat;
        let query = null;
        let webChart = propWebChart.set('series', series);
        if (valueFormat) {
            webChart = webChart.setIn(['axes', '0', 'valueFormat'], valueFormat);
        }
        if (chartDataSource) {
            webChart = webChart.set('dataSource', chartDataSource);
            if (chartDataSource.query !== ((_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.dataSource) === null || _a === void 0 ? void 0 : _a.query)) {
                query = chartDataSource.query;
            }
        }
        onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(webChart, query);
    };
    const handleAxesChange = (axes) => {
        onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(propWebChart.set('axes', axes));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('data'), isOpen: section === ChartSettingSection.Data, onRequestOpen: () => onSectionChange(ChartSettingSection.Data), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(StatisticsDataSetting, { type: type, chartDataSource: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.dataSource, useDataSources: useDataSources, series: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series, onChange: handleSeriesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('series'), isOpen: section === ChartSettingSection.Series, onRequestOpen: () => onSectionChange(ChartSettingSection.Series), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(SerialSeriesSetting, { series: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series, onChange: handleSeriesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('axes'), isOpen: section === ChartSettingSection.Axes, onRequestOpen: () => onSectionChange(ChartSettingSection.Axes), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(AxesSetting, { rotated: rotated, axes: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.axes, onChange: handleAxesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('general'), isOpen: section === ChartSettingSection.General, onRequestOpen: () => onSectionChange(ChartSettingSection.General), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(XYGeneralSetting, { value: propWebChart, rotatable: true, legendValid: legendValid, onChange: onWebChartChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('appearance'), isOpen: section === ChartSettingSection.Appearance, onRequestOpen: () => onSectionChange(ChartSettingSection.Appearance), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(AppearanceSetting, { webChart: propWebChart, onChange: onWebChartChange }))))));
};
export default SerialSetting;
//# sourceMappingURL=index.js.map