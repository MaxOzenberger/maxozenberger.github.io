import { React } from 'jimu-core';
import { SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { defaultMessages as jimuBuilderDefaultMessage } from 'jimu-for-builder';
import defaultMessages from '../../../../translations/default';
import { ChartSettingSection } from '../../type';
import { ScatterPlotData } from './data';
import { AppearanceSetting } from '../common-sections/appearance';
import { AxesSetting } from '../common-sections/axes';
import { XYGeneralSetting } from '../common-sections/genaral';
import { getSerialSeriesRotated } from '../../../../../utils/common/serial';
const ScatterPlotSetting = (props) => {
    var _a, _b, _c, _d;
    const { section, webChart: propWebChart, useDataSources, onSectionChange, onWebChartChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage, jimuBuilderDefaultMessage);
    const rotated = getSerialSeriesRotated(propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series);
    const legendValid = (_d = (_c = (_b = (_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.overlays) === null || _c === void 0 ? void 0 : _c.trendLine.visible) !== null && _d !== void 0 ? _d : false;
    const handleSeriesChange = (series, chartDataSource, trendLineVisible) => {
        var _a;
        let webChart;
        let query;
        if (chartDataSource) {
            webChart = propWebChart.set('dataSource', chartDataSource).set('series', series);
            if (chartDataSource.query !== ((_a = propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.dataSource) === null || _a === void 0 ? void 0 : _a.query)) {
                query = chartDataSource === null || chartDataSource === void 0 ? void 0 : chartDataSource.query;
            }
        }
        else {
            webChart = propWebChart.set('series', series);
        }
        if (typeof trendLineVisible !== 'undefined') {
            webChart = webChart.setIn(['legend', 'visible'], trendLineVisible);
        }
        onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(webChart, query);
    };
    const handleAxesChange = (axes) => {
        onWebChartChange === null || onWebChartChange === void 0 ? void 0 : onWebChartChange(propWebChart.set('axes', axes));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('data'), isOpen: section === ChartSettingSection.Data, onRequestOpen: () => onSectionChange(ChartSettingSection.Data), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(ScatterPlotData, { chartDataSource: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.dataSource, useDataSources: useDataSources, series: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.series, onChange: handleSeriesChange }))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('axes'), isOpen: section === ChartSettingSection.Axes, onRequestOpen: () => onSectionChange(ChartSettingSection.Axes), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(AxesSetting, { rotated: rotated, axes: propWebChart === null || propWebChart === void 0 ? void 0 : propWebChart.axes, onChange: handleAxesChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('general'), isOpen: section === ChartSettingSection.General, onRequestOpen: () => onSectionChange(ChartSettingSection.General), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(XYGeneralSetting, { value: propWebChart, legendValid: legendValid, rotatable: false, onChange: onWebChartChange })))),
        React.createElement(SettingSection, null,
            React.createElement(SettingCollapse, { label: translate('appearance'), isOpen: section === ChartSettingSection.Appearance, onRequestOpen: () => onSectionChange(ChartSettingSection.Appearance), onRequestClose: () => onSectionChange(ChartSettingSection.None) },
                React.createElement(SettingRow, { flow: 'wrap' },
                    React.createElement(AppearanceSetting, { webChart: propWebChart, onChange: onWebChartChange }))))));
};
export default ScatterPlotSetting;
//# sourceMappingURL=index.js.map