import { React, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Switch, Select, NumericInput } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { FieldSelector, FillSymbolSetting } from '../../components';
import { getDefaultSeriesFillColor, getDefaultSeriesOutlineColor, getDefaultHistomgramOverlayColor, SeriesColors } from '../../../../../../utils/default';
import { createHistogramQuery, createHistogramSeries } from './utils';
import { WebChartDataTransformations } from 'jimu-ui/advanced/chart';
import { HistogramOverlaySetting } from './overlay';
export const isOverlaysVisible = (series) => {
    var _a;
    const overlays = (_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.overlays;
    if (!overlays) {
        return false;
    }
    return Object.values(overlays).some((overlay) => overlay.visible);
};
const presetColors = SeriesColors.map((color) => ({
    label: color,
    value: color,
    color: color
}));
const defaultFillColor = getDefaultSeriesFillColor();
const defaultLineColor = getDefaultSeriesOutlineColor('histogramSeries');
const defaultChartDataSource = Immutable({});
const HistogramData = (props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { chartDataSource: propChartDataSource = defaultChartDataSource, useDataSources, series: propSeries, onChange } = props;
    const dataSourceId = (_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    const query = propChartDataSource.query;
    const pageSize = query === null || query === void 0 ? void 0 : query.pageSize;
    const numericField = (_b = query === null || query === void 0 ? void 0 : query.outFields) === null || _b === void 0 ? void 0 : _b[0];
    const propSerie = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0];
    const dataTransformationType = propSerie === null || propSerie === void 0 ? void 0 : propSerie.dataTransformationType;
    const binCount = propSerie === null || propSerie === void 0 ? void 0 : propSerie.binCount;
    const fillSymbol = propSerie === null || propSerie === void 0 ? void 0 : propSerie.fillSymbol;
    const valueLabelVisible = (_c = propSerie === null || propSerie === void 0 ? void 0 : propSerie.dataLabels.visible) !== null && _c !== void 0 ? _c : false;
    // Overlays
    const meanOverlay = (_d = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays) === null || _d === void 0 ? void 0 : _d.mean;
    const medianOverlay = (_e = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays) === null || _e === void 0 ? void 0 : _e.median;
    const stdOverlay = (_f = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays) === null || _f === void 0 ? void 0 : _f.standardDeviation;
    const codOverlay = (_g = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays) === null || _g === void 0 ? void 0 : _g.comparisonDistribution;
    const handleNumberFieldChange = (numericFields) => {
        const x = numericFields === null || numericFields === void 0 ? void 0 : numericFields[0];
        const orderByFields = [`${x} ASC`];
        const series = createHistogramSeries(x, propSeries, dataSourceId);
        const query = createHistogramQuery(x, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), chartDataSource);
    };
    const handleDataTransformationTypeChange = (evt) => {
        const dataTransformationType = evt.currentTarget
            .value;
        const series = Immutable.setIn(propSeries, ['0', 'dataTransformationType'], dataTransformationType);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleBinCountChange = (binCount) => {
        const series = Immutable.setIn(propSeries, ['0', 'binCount'], binCount);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleFillSymbolChange = (value) => {
        const series = Immutable.setIn(propSeries, ['0', 'fillSymbol'], value);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleDataLabelsVisibleChange = (evt) => {
        const visible = evt.target.checked;
        const series = Immutable.setIn(propSeries, ['0', 'dataLabels', 'visible'], visible);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleOverlayVisibleChange = (type, visible) => {
        var _a, _b, _c;
        const created = (_c = (_b = (_a = propSerie.overlays) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.created) !== null && _c !== void 0 ? _c : false;
        let series = Immutable.setIn(propSeries, ['0', 'overlays', type, 'visible'], visible);
        if (!created) {
            series = Immutable.setIn(series, ['0', 'overlays', type, 'created'], true);
        }
        const overlaysVisible = isOverlaysVisible(series);
        onChange === null || onChange === void 0 ? void 0 : onChange(series, propChartDataSource, overlaysVisible);
    };
    const handleOverlaysChange = (type, value) => {
        const series = Immutable.setIn(propSeries, ['0', 'overlays', type], value);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { level: 2, label: translate('variables'), flow: 'wrap' },
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('numericFields'), flow: 'wrap' },
                React.createElement(FieldSelector, { className: 'numeric-field-selector', type: 'numeric', useDataSources: useDataSources, isMultiple: false, fields: numericField ? Immutable([numericField]) : undefined, onChange: handleNumberFieldChange })),
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('transformation'), flow: 'wrap' },
                React.createElement(Select, { size: 'sm', disabled: !numericField, value: dataTransformationType, onChange: handleDataTransformationTypeChange },
                    React.createElement("option", { value: WebChartDataTransformations.None }, translate('none')),
                    React.createElement("option", { value: WebChartDataTransformations.Log }, translate('logarithmic')),
                    React.createElement("option", { value: WebChartDataTransformations.Sqrt }, translate('squareRoot'))))),
        React.createElement(SettingRow, { level: 2, label: translate('bins'), flow: 'wrap' },
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('numberOfBins'), flow: 'no-wrap' },
                React.createElement(NumericInput, { className: 'w-50', value: binCount, onAcceptValue: handleBinCountChange, min: 1, max: 64, step: 1, showHandlers: false })),
            React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'no-wrap' },
                React.createElement(FillSymbolSetting, { defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, presetFillColors: presetColors, value: fillSymbol, onChange: handleFillSymbolChange })),
            React.createElement(SettingRow, { className: 'w-100', level: 2, label: translate('valueLabel'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: valueLabelVisible, onChange: handleDataLabelsVisibleChange }))),
        React.createElement(SettingRow, { level: 2, label: translate('statisticGraph'), flow: 'wrap' },
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('mean'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: meanOverlay.visible, onChange: (evt) => handleOverlayVisibleChange('mean', evt.target.checked) })),
            meanOverlay.visible && (React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'wrap' },
                React.createElement(HistogramOverlaySetting, { defaultColor: getDefaultHistomgramOverlayColor('mean'), value: meanOverlay, onChange: (value) => handleOverlaysChange('mean', value) }))),
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('median'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: medianOverlay.visible, onChange: (evt) => handleOverlayVisibleChange('median', evt.target.checked) })),
            medianOverlay.visible && (React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'wrap' },
                React.createElement(HistogramOverlaySetting, { defaultColor: getDefaultHistomgramOverlayColor('median'), value: medianOverlay, onChange: (value) => handleOverlaysChange('median', value) }))),
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('normalDistribution'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: codOverlay.visible, onChange: (evt) => handleOverlayVisibleChange('comparisonDistribution', evt.target.checked) })),
            codOverlay.visible && (React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'wrap' },
                React.createElement(HistogramOverlaySetting, { defaultColor: getDefaultHistomgramOverlayColor('comparisonDistribution'), value: codOverlay, onChange: (value) => handleOverlaysChange('comparisonDistribution', value) }))),
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('standardDeviation'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: stdOverlay.visible, onChange: (evt) => handleOverlayVisibleChange('standardDeviation', evt.target.checked) })),
            stdOverlay.visible && (React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'wrap' },
                React.createElement(HistogramOverlaySetting, { defaultColor: getDefaultHistomgramOverlayColor('standardDeviation'), value: stdOverlay, onChange: (value) => handleOverlaysChange('standardDeviation', value) }))))));
};
export default HistogramData;
//# sourceMappingURL=index.js.map