import { Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import React from 'react';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { FieldSelector, LineSymbolSetting, MarkSymbolSetting } from '../../components';
import { DefaultScatterPlotTrandLineColor, getDefaultSeriesFillColor, getDefaultSeriesOutlineColor, SeriesColors } from '../../../../../../utils/default';
import { createScatterPlotQuery, createScatterPlotSeries } from './utils';
const presetColors = SeriesColors.map((color) => ({
    label: color,
    value: color,
    color: color
}));
const defaultFillColor = getDefaultSeriesFillColor();
const defaultLineColor = getDefaultSeriesOutlineColor('scatterSeries');
const defaultChartDataSource = Immutable({});
export const ScatterPlotData = (props) => {
    var _a, _b, _c, _d, _e;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { chartDataSource: propChartDataSource = defaultChartDataSource, useDataSources, series: propSeries, onChange } = props;
    const dataSourceId = (_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    const query = propChartDataSource.query;
    const pageSize = query === null || query === void 0 ? void 0 : query.pageSize;
    const xNumericField = (_b = query === null || query === void 0 ? void 0 : query.outFields) === null || _b === void 0 ? void 0 : _b[0];
    const yNumericField = (_c = query === null || query === void 0 ? void 0 : query.outFields) === null || _c === void 0 ? void 0 : _c[1];
    const propSerie = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0];
    const showLinearTrend = (_d = propSerie.overlays) === null || _d === void 0 ? void 0 : _d.trendLine.visible;
    const trendLine = (_e = propSerie.overlays) === null || _e === void 0 ? void 0 : _e.trendLine.symbol;
    const handleXAxisNumberFieldChange = (numericFields) => {
        const x = numericFields === null || numericFields === void 0 ? void 0 : numericFields[0];
        const orderByFields = [`${x} ASC`];
        const series = createScatterPlotSeries({ x, y: yNumericField, propSeries }, dataSourceId);
        const query = createScatterPlotQuery({ x, y: yNumericField }, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), chartDataSource);
    };
    const handleYAxisNumberFieldChange = (numericFields) => {
        const y = numericFields === null || numericFields === void 0 ? void 0 : numericFields[0];
        const orderByFields = [`${xNumericField} ASC`];
        const series = createScatterPlotSeries({ x: xNumericField, y, propSeries }, dataSourceId);
        const query = createScatterPlotQuery({ x: xNumericField, y }, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), chartDataSource);
    };
    const handleShowLinearTrendChange = (_, checked) => {
        const overlays = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays.setIn(['trendLine', 'visible'], checked);
        const series = Immutable.setIn(propSeries, ['0', 'overlays'], overlays);
        onChange === null || onChange === void 0 ? void 0 : onChange(series, propChartDataSource, checked);
    };
    const handleTrendLineSymbolChange = (value) => {
        const overlays = propSerie === null || propSerie === void 0 ? void 0 : propSerie.overlays.setIn(['trendLine', 'symbol'], value);
        const series = Immutable.setIn(propSeries, ['0', 'overlays'], overlays);
        onChange === null || onChange === void 0 ? void 0 : onChange(series, propChartDataSource);
    };
    const handleMarkerSymbolChange = (value) => {
        const series = Immutable.setIn(propSeries, ['0', 'markerSymbol'], value);
        onChange === null || onChange === void 0 ? void 0 : onChange(series, propChartDataSource);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { level: 2, label: translate('variables'), flow: 'wrap' },
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('xAxisNumber'), flow: 'wrap' },
                React.createElement(FieldSelector, { className: 'x-numeric-field-selector', type: 'numeric', useDataSources: useDataSources, isMultiple: false, fields: xNumericField ? Immutable([xNumericField]) : undefined, onChange: handleXAxisNumberFieldChange })),
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('yAxisNumber'), flow: 'wrap' },
                React.createElement(FieldSelector, { className: 'y-numeric-field-selector', type: 'numeric', useDataSources: useDataSources, isMultiple: false, fields: yNumericField ? Immutable([yNumericField]) : undefined, onChange: handleYAxisNumberFieldChange }))),
        React.createElement(SettingRow, { level: 2, label: translate('statistics'), flow: 'wrap' },
            React.createElement(SettingRow, { className: 'w-100', level: 3, label: translate('showLinearTrend'), flow: 'no-wrap' },
                React.createElement(Switch, { checked: showLinearTrend, onChange: handleShowLinearTrendChange })),
            React.createElement(SettingRow, { className: 'w-100', level: 3, flow: 'no-wrap' }, showLinearTrend && React.createElement(LineSymbolSetting, { defaultColor: DefaultScatterPlotTrandLineColor, presetColors: presetColors, value: trendLine, onChange: handleTrendLineSymbolChange }))),
        React.createElement(SettingRow, { level: 2, label: translate('symbol'), flow: 'wrap' },
            React.createElement(MarkSymbolSetting, { value: propSerie === null || propSerie === void 0 ? void 0 : propSerie.markerSymbol, defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, presetFillColors: presetColors, presetLineColors: presetColors, onChange: handleMarkerSymbolChange }))));
};
//# sourceMappingURL=index.js.map