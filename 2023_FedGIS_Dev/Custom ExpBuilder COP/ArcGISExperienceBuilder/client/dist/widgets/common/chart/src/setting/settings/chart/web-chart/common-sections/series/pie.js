import { React, Immutable } from 'jimu-core';
import { Select, hooks, defaultMessages as jimuiDefaultMessage, Switch, DistanceUnits } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { getDefaultSeriesOutlineColor, getFillSymbol } from '../../../../../../utils/default';
import { LineSymbolSetting } from '../../components';
import { ColorType } from './color-type';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { getTheme2 } from 'jimu-theme';
import { applyPieSlicesOutline } from './color-type/utils';
const units = [DistanceUnits.PERCENTAGE];
const defaultSeries = Immutable([]);
const sliceGroupingLabel = 'Other';
const sliceGroupingColor = '#D6D6D6';
const defaultSliceGrouping = Immutable({
    percentageThreshold: 0,
    groupName: sliceGroupingLabel,
    fillSymbol: getFillSymbol(sliceGroupingColor, 1, 'var(--light-100)')
});
const defaultOutlineColor = getDefaultSeriesOutlineColor('pieSeries');
export const PieSeriesSetting = (props) => {
    var _a, _b, _c, _d;
    const { series: propSeries = defaultSeries, useDataSources, chartDataSource, onChange } = props;
    const theme2 = getTheme2();
    const propSerie = propSeries[0];
    const dataLabelVisible = (_a = propSerie === null || propSerie === void 0 ? void 0 : propSerie.dataLabels.visible) !== null && _a !== void 0 ? _a : false;
    const displayPercentageOnDataLabel = (_b = propSerie === null || propSerie === void 0 ? void 0 : propSerie.displayPercentageOnDataLabel) !== null && _b !== void 0 ? _b : false;
    const labelType = displayPercentageOnDataLabel ? 'percentage' : 'value';
    const dataLabelsOffset = (_c = propSerie === null || propSerie === void 0 ? void 0 : propSerie.dataLabelsOffset) !== null && _c !== void 0 ? _c : 0;
    const dataLabelsOffsetUnit = {
        distance: dataLabelsOffset,
        unit: DistanceUnits.PIXEL
    };
    const propSliceGrouping = React.useMemo(() => {
        var _a;
        let grouping = (_a = propSerie === null || propSerie === void 0 ? void 0 : propSerie.sliceGrouping) !== null && _a !== void 0 ? _a : defaultSliceGrouping;
        if (!grouping.fillSymbol) {
            grouping = grouping.set('fillSymbol', defaultSliceGrouping.fillSymbol);
        }
        return grouping;
    }, [propSerie === null || propSerie === void 0 ? void 0 : propSerie.sliceGrouping]);
    const sliceGroupingFill = propSliceGrouping.fillSymbol;
    const percentageThreshold = propSliceGrouping.percentageThreshold;
    const percentageThresholdUnit = {
        distance: percentageThreshold,
        unit: DistanceUnits.PERCENTAGE
    };
    const outline = (_d = propSerie === null || propSerie === void 0 ? void 0 : propSerie.fillSymbol) === null || _d === void 0 ? void 0 : _d.outline;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const handleDataLabelsVisibleChange = (evt) => {
        const visible = evt.target.checked;
        const series = Immutable.setIn(propSeries, ['0', 'dataLabels', 'visible'], visible);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleLabelTypeChange = (evt) => {
        const labelType = evt.currentTarget.value;
        const displayNumericValueOnDataLabel = labelType === 'value';
        const displayPercentageOnDataLabel = labelType === 'percentage';
        let series = Immutable.setIn(propSeries, ['0', 'displayNumericValueOnDataLabel'], displayNumericValueOnDataLabel);
        series = Immutable.setIn(series, ['0', 'displayPercentageOnDataLabel'], displayPercentageOnDataLabel);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleLabelOffsetChange = (value) => {
        var _a;
        const number = (_a = value.distance) !== null && _a !== void 0 ? _a : 0;
        const dataLabelsOffset = Math.floor(+number);
        const series = Immutable.setIn(propSeries, ['0', 'dataLabelsOffset'], dataLabelsOffset);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handlePercentageThreshold = (value) => {
        var _a;
        const number = (_a = value.distance) !== null && _a !== void 0 ? _a : 0;
        const percentageThreshold = Math.floor(+number);
        const sliceGrouping = propSliceGrouping.set('percentageThreshold', percentageThreshold);
        const series = Immutable.setIn(propSeries, ['0', 'sliceGrouping'], sliceGrouping);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleSliceGroupingColorChange = (value) => {
        const sliceGrouping = propSliceGrouping.setIn(['fillSymbol', 'color'], value);
        const series = Immutable.setIn(propSeries, ['0', 'sliceGrouping'], sliceGrouping);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleOutlineChange = (value) => {
        var _a;
        let series = Immutable.setIn(propSeries, ['0', 'fillSymbol', 'outline'], value);
        const sliceGrouping = propSliceGrouping.setIn(['fillSymbol', 'outline'], value);
        series = Immutable.setIn(series, ['0', 'sliceGrouping'], sliceGrouping);
        const propSlices = (_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.slices;
        if (propSlices) {
            const slices = applyPieSlicesOutline(propSlices, value);
            series = Immutable.setIn(series, ['0', 'slices'], slices);
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    return (React.createElement("div", { className: 'pie-series-setting w-100' },
        React.createElement(SettingRow, { className: 'mt-3', label: translate('valueLabel') },
            React.createElement(Switch, { checked: dataLabelVisible, onChange: handleDataLabelsVisibleChange })),
        dataLabelVisible && React.createElement(React.Fragment, null,
            React.createElement(SettingRow, { label: translate('labelType') },
                React.createElement(Select, { size: 'sm', className: 'w-50', value: labelType, onChange: handleLabelTypeChange },
                    React.createElement("option", { value: 'value' }, translate('value')),
                    React.createElement("option", { value: 'percentage' }, translate('percentage')))),
            React.createElement(SettingRow, { label: translate('labelOffset') },
                React.createElement(InputUnit, { className: 'w-50', size: 'sm', min: -100, step: 1, max: 100, units: units, value: dataLabelsOffsetUnit, onChange: handleLabelOffsetChange }))),
        React.createElement(SettingRow, { label: translate('grouping') },
            React.createElement("div", { className: 'slice-grouping w-50 d-flex justify-content-between' },
                React.createElement(InputUnit, { className: 'flex-grow-1 mr-1', size: 'sm', min: 0, step: 1, max: 100, units: units, value: percentageThresholdUnit, onChange: handlePercentageThreshold }),
                React.createElement(ThemeColorPicker, { specificTheme: theme2, title: translate('groupedColor'), "aria-label": translate('groupedColor'), className: 'flex-shrink-0 mr-1', value: sliceGroupingFill.color, onChange: handleSliceGroupingColorChange }))),
        React.createElement(SettingRow, { label: translate('columnOutline'), flow: 'wrap' },
            React.createElement(LineSymbolSetting, { defaultColor: defaultOutlineColor, value: outline, onChange: handleOutlineChange })),
        React.createElement(ColorType, { chartDataSource: chartDataSource, useDataSources: useDataSources, series: propSeries, onChange: onChange })));
};
//# sourceMappingURL=pie.js.map