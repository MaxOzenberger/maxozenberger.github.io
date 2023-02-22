var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { React, Immutable } from 'jimu-core';
import { Select, hooks, defaultMessages as jimuiDefaultMessage, NumericInput } from 'jimu-ui';
import { CategoryType } from '../../../../../../../config';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../../translations/default';
import { ByGroupData } from './by-group';
import { ByFieldData } from './by-field';
import { getCategoryType } from '../../../../../../../utils/common/serial';
import { createDefaultSerie, createDefaultQuery } from './utils';
import { usePercentileStatisticsSupport } from '../../../../../utils';
const CategoryTypes = {
    [CategoryType.ByGroup]: 'byGroup',
    [CategoryType.ByField]: 'byField'
};
const defaultChartDataSource = Immutable({});
export const StatisticsDataSetting = (props) => {
    var _a, _b;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { type = 'barSeries', useDataSources, chartDataSource: propChartDataSource = defaultChartDataSource, series, onChange } = props, others = __rest(props, ["type", "useDataSources", "chartDataSource", "series", "onChange"]);
    const supportPercentile = usePercentileStatisticsSupport((_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId);
    const query = propChartDataSource.query;
    const categoryType = (_b = getCategoryType(query)) !== null && _b !== void 0 ? _b : CategoryType.ByGroup;
    const pageSize = query === null || query === void 0 ? void 0 : query.pageSize;
    const showMaxCategories = categoryType !== CategoryType.ByField;
    const handleCategoryTypeChange = (evt) => {
        const categoryType = evt === null || evt === void 0 ? void 0 : evt.currentTarget.value;
        const serie = createDefaultSerie(series === null || series === void 0 ? void 0 : series[0]);
        const query = createDefaultQuery(categoryType);
        const chartDataSource = propChartDataSource.set('query', query);
        onChange === null || onChange === void 0 ? void 0 : onChange(Immutable([serie]), { chartDataSource });
    };
    const handlePageSizeChange = (value) => {
        const pageSize = value ? Math.floor(+value) : undefined;
        const chartDataSource = propChartDataSource.setIn(['query', 'pageSize'], pageSize);
        onChange === null || onChange === void 0 ? void 0 : onChange(series, { chartDataSource });
    };
    return (React.createElement("div", Object.assign({ className: 'chart-data-setting w-100' }, others),
        React.createElement(SettingRow, { label: translate('categoryType'), flow: 'wrap', className: 'mt-2' },
            React.createElement(Select, { size: 'sm', value: categoryType, onChange: handleCategoryTypeChange }, Object.keys(CategoryType).map((categoryType, i) => (React.createElement("option", { value: CategoryType[categoryType], key: i, className: 'text-truncate' }, translate(CategoryTypes[CategoryType[categoryType]])))))),
        React.createElement(React.Fragment, null,
            categoryType === CategoryType.ByGroup && React.createElement(ByGroupData, { type: type, series: series, supportPercentile: supportPercentile, chartDataSource: propChartDataSource, useDataSources: useDataSources, onChange: onChange }),
            categoryType === CategoryType.ByField && React.createElement(ByFieldData, { series: series, chartDataSource: propChartDataSource, supportPercentile: supportPercentile, useDataSources: useDataSources, onChange: onChange })),
        showMaxCategories && React.createElement(SettingRow, { label: translate('maxCategories'), flow: 'no-wrap' },
            React.createElement(NumericInput, { style: { width: '60px' }, defaultValue: pageSize, onAcceptValue: handlePageSizeChange, min: 1, step: 1, size: 'sm', showHandlers: false }))));
};
//# sourceMappingURL=index.js.map