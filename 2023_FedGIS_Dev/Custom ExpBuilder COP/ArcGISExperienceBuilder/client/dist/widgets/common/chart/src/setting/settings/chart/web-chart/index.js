import { React } from 'jimu-core';
import { isSerialSeries } from '../../../../utils/default';
import SerialSetting from './serial';
import PieSetting from './pie';
import ScatterPlotSetting from './scatter';
import HistogramSetting from './histogram';
const WebChartSetting = (props) => {
    const { type, section, webChart, onSectionChange, useDataSources, onWebChartChange } = props;
    return (React.createElement(React.Fragment, null,
        isSerialSeries(type) && (React.createElement(SerialSetting, { type: type, section: section, webChart: webChart, onSectionChange: onSectionChange, useDataSources: useDataSources, onWebChartChange: onWebChartChange })),
        type === 'pieSeries' && (React.createElement(PieSetting, { type: type, section: section, webChart: webChart, onSectionChange: onSectionChange, useDataSources: useDataSources, onWebChartChange: onWebChartChange })),
        type === 'scatterSeries' && (React.createElement(ScatterPlotSetting, { section: section, webChart: webChart, onSectionChange: onSectionChange, useDataSources: useDataSources, onWebChartChange: onWebChartChange })),
        type === 'histogramSeries' && (React.createElement(HistogramSetting, { section: section, webChart: webChart, onSectionChange: onSectionChange, useDataSources: useDataSources, onWebChartChange: onWebChartChange }))));
};
export default WebChartSetting;
//# sourceMappingURL=index.js.map