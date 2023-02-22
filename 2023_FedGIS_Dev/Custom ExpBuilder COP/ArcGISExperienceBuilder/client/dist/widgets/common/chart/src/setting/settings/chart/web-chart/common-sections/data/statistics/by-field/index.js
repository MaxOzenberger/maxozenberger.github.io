import { React, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { FieldSelector, SorteSetting } from '../../../../components';
import defaultMessages from '../../../../../../../translations/default';
import { createByFieldQuery, createByFieldSeries, dummyNormalizeStatisticFieldLabel, getByFieldOrderFields } from './utils';
import { ByFieldSeriesX, ByFieldSeriesY } from '../../../../../../../../constants';
import StatisticsSelector from '../statistics-selector';
const defaultChartDataSource = Immutable({});
export const ByFieldData = (props) => {
    var _a, _b, _c;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { chartDataSource: propChartDataSource = defaultChartDataSource, useDataSources, series: propSeries, supportPercentile, onChange } = props;
    const x = ByFieldSeriesX;
    const y = ByFieldSeriesY;
    const query = propChartDataSource.query;
    const outStatistics = query === null || query === void 0 ? void 0 : query.outStatistics;
    const numericFields = outStatistics === null || outStatistics === void 0 ? void 0 : outStatistics.map((outStatistic) => outStatistic.onStatisticField).filter(field => !!field);
    const statisticType = (_b = (_a = outStatistics === null || outStatistics === void 0 ? void 0 : outStatistics[0]) === null || _a === void 0 ? void 0 : _a.statisticType) !== null && _b !== void 0 ? _b : 'sum';
    const orderByFields = (_c = query === null || query === void 0 ? void 0 : query.orderByFields) !== null && _c !== void 0 ? _c : [`${x} ASC`];
    // const seriesName = React.useMemo(() => normalizeStatisticFieldLabel(statisticType, translate('value'), translate), [statisticType, translate])
    const seriesName = React.useMemo(() => dummyNormalizeStatisticFieldLabel(statisticType), [statisticType]);
    const orderFields = React.useMemo(() => getByFieldOrderFields(propSeries, translate), [translate, propSeries]);
    const handleStatisticTypeChange = (statisticType) => {
        // const seriesName = normalizeStatisticFieldLabel(statisticType, translate('value'), translate)
        const seriesName = dummyNormalizeStatisticFieldLabel(statisticType);
        const series = createByFieldSeries({ x, y, name: seriesName, propSeries });
        const query = createByFieldQuery({ statisticType, numericFields }, orderByFields);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), { chartDataSource });
    };
    const handleNumericFieldsChange = (numericFields) => {
        const series = createByFieldSeries({ x, y, name: seriesName, propSeries });
        const query = createByFieldQuery({ statisticType, numericFields }, orderByFields);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), { chartDataSource });
    };
    const handleOrderChanged = (value) => {
        const query = createByFieldQuery({ statisticType, numericFields }, [value]);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(propSeries, { chartDataSource });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { label: translate('statistics'), flow: 'wrap' },
            React.createElement(StatisticsSelector, { supportCount: false, supportPercentile: supportPercentile, value: statisticType, onChange: handleStatisticTypeChange })),
        React.createElement(SettingRow, { label: translate('numberFields'), flow: 'wrap' },
            React.createElement(FieldSelector, { className: 'numeric-fields-selector', type: 'numeric', isMultiple: true, useDataSources: useDataSources, fields: numericFields, onChange: handleNumericFieldsChange })),
        React.createElement(SettingRow, { label: translate('sortBy'), flow: 'wrap' },
            React.createElement(SorteSetting, { value: orderByFields === null || orderByFields === void 0 ? void 0 : orderByFields[0], fields: orderFields, onChange: handleOrderChanged }))));
};
//# sourceMappingURL=index.js.map