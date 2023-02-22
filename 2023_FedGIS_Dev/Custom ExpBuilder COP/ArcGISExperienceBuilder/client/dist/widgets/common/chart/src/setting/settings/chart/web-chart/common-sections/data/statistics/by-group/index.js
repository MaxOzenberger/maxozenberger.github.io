import { React, Immutable, StatisticType } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { FieldSelector, SorteSetting } from '../../../../components';
import defaultMessages from '../../../../../../../translations/default';
import { getObjectIdField } from '../../../../../../../../utils/common';
import { createByGroupQuery, createByGroupSeries, getByGroupOrderFields } from './utils';
import { isSerialSeries } from '../../../../../../../../utils/default';
import StatisticsSelector from '../statistics-selector';
const defaultChartDataSource = Immutable({});
export const ByGroupData = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { type = 'barSeries', chartDataSource: propChartDataSource = defaultChartDataSource, useDataSources, series: propSeries, supportPercentile, onChange } = props;
    const seriesPropsRef = React.useRef();
    const dataSourceId = (_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    const objectidField = React.useMemo(() => getObjectIdField(dataSourceId), [dataSourceId]);
    const query = propChartDataSource.query;
    const categoryField = (_c = (_b = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : '';
    const outStatistics = query === null || query === void 0 ? void 0 : query.outStatistics;
    let numericFields = (_d = outStatistics === null || outStatistics === void 0 ? void 0 : outStatistics.map((outStatistic) => outStatistic.onStatisticField)) === null || _d === void 0 ? void 0 : _d.filter(field => !!field);
    if (!(numericFields === null || numericFields === void 0 ? void 0 : numericFields.length) && !categoryField) {
        numericFields = Immutable([objectidField]);
    }
    const statisticType = (_f = (_e = outStatistics === null || outStatistics === void 0 ? void 0 : outStatistics[0]) === null || _e === void 0 ? void 0 : _e.statisticType) !== null && _f !== void 0 ? _f : 'count';
    const orderByFields = query === null || query === void 0 ? void 0 : query.orderByFields;
    const pageSize = query === null || query === void 0 ? void 0 : query.pageSize;
    const orderFields = React.useMemo(() => getByGroupOrderFields(query, dataSourceId), [query, dataSourceId]);
    const hideNumericFields = (numericFields === null || numericFields === void 0 ? void 0 : numericFields.length) === 1 && statisticType === StatisticType.Count;
    const isNumericFieldsMultiple = isSerialSeries(type);
    const handleCategoryFieldChange = (fields) => {
        const categoryField = fields === null || fields === void 0 ? void 0 : fields[0];
        const orderByFields = [`${categoryField} ASC`];
        const series = createByGroupSeries({ categoryField, statisticType, numericFields, propSeries }, dataSourceId);
        const query = createByGroupQuery({ categoryField, statisticType, numericFields }, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        const otherProps = { chartDataSource };
        onChange(Immutable(series), otherProps);
    };
    const handleStatisticTypeChange = (statisticType) => {
        let _numericFields = numericFields;
        if (statisticType === StatisticType.Count) {
            _numericFields = Immutable([objectidField]);
        }
        const orderByFields = [`${categoryField} ASC`];
        const series = createByGroupSeries({ categoryField, statisticType, numericFields: _numericFields, propSeries }, dataSourceId);
        const query = createByGroupQuery({ categoryField, statisticType, numericFields: _numericFields }, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), { chartDataSource });
    };
    const handleNumericFieldsChange = (numericFields) => {
        if (!(numericFields === null || numericFields === void 0 ? void 0 : numericFields.length) && (propSeries === null || propSeries === void 0 ? void 0 : propSeries.length)) {
            seriesPropsRef.current = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0];
        }
        const seriesProps = (propSeries === null || propSeries === void 0 ? void 0 : propSeries.length) ? propSeries : Immutable([seriesPropsRef.current]);
        const orderByFields = [`${categoryField} ASC`];
        const series = createByGroupSeries({ categoryField, statisticType, numericFields, propSeries: seriesProps }, dataSourceId);
        const query = createByGroupQuery({ categoryField, statisticType, numericFields }, orderByFields, pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(Immutable(series), { chartDataSource });
    };
    const handleOrderChanged = (value) => {
        const query = createByGroupQuery({ categoryField, statisticType, numericFields }, [value], pageSize);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange(propSeries, { chartDataSource });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { label: translate('categoryField'), flow: 'wrap' },
            React.createElement(FieldSelector, { className: 'category-field-selector', type: 'category', useDataSources: useDataSources, isMultiple: false, fields: categoryField ? Immutable([categoryField]) : undefined, onChange: handleCategoryFieldChange })),
        React.createElement(SettingRow, { label: translate('statistics'), flow: 'wrap' },
            React.createElement(StatisticsSelector, { supportCount: true, supportPercentile: supportPercentile, value: statisticType, onChange: handleStatisticTypeChange })),
        !hideNumericFields &&
            React.createElement(React.Fragment, null,
                React.createElement(SettingRow, { label: translate('numberFields'), flow: 'no-wrap' }),
                React.createElement(FieldSelector, { disabled: !categoryField, className: 'numeric-fields-selector mt-2 mb-3', type: 'numeric', isMultiple: isNumericFieldsMultiple, useDataSources: useDataSources, fields: numericFields, onChange: handleNumericFieldsChange })),
        React.createElement(SettingRow, { label: translate('sortBy'), flow: 'wrap' },
            React.createElement(SorteSetting, { value: orderByFields === null || orderByFields === void 0 ? void 0 : orderByFields[0], fields: orderFields, onChange: handleOrderChanged }))));
};
//# sourceMappingURL=index.js.map