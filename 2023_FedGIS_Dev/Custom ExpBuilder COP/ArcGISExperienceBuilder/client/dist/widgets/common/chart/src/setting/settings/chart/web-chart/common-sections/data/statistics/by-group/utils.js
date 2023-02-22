import { Immutable, StatisticType } from 'jimu-core';
import { createDefaultSerie, getUsedSeriesProps } from '../utils';
import { getFieldSchema } from '../../../../../../../../utils/common';
import { getOutStatisticName } from '../../../../../../../../utils/common/serial';
export const createByGroupSeries = ({ categoryField, statisticType, numericFields, propSeries }, dataSourceId) => {
    const series = numericFields.map((numericField, index) => {
        var _a;
        const seriesProps = getUsedSeriesProps(propSeries, numericField, index);
        const serie = createDefaultSerie(seriesProps, index);
        const y = getOutStatisticName(numericField, statisticType);
        const name = ((_a = getFieldSchema(numericField, dataSourceId)) === null || _a === void 0 ? void 0 : _a.alias) || numericField;
        serie.id = numericField;
        serie.x = categoryField;
        serie.y = y;
        serie.name = name;
        return serie;
    });
    return Immutable(series);
};
export const createByGroupQuery = ({ categoryField, statisticType, numericFields }, orderByFields, pageSize) => {
    let outStatistics = numericFields.map((numericField) => {
        const outStatisticFieldName = getOutStatisticName(numericField, statisticType);
        const statistic = {
            statisticType,
            onStatisticField: numericField,
            outStatisticFieldName
        };
        if (statisticType === 'percentile_cont') {
            const statisticParameters = {
                value: 0.5
            };
            statistic.statisticParameters = statisticParameters;
        }
        return statistic;
    });
    const groupByFieldsForStatistics = [categoryField];
    if (!outStatistics.length) {
        outStatistics = [{
                statisticType: statisticType !== null && statisticType !== void 0 ? statisticType : StatisticType.Sum,
                onStatisticField: '',
                outStatisticFieldName: ''
            }];
    }
    return Immutable({ groupByFieldsForStatistics, outStatistics, orderByFields, pageSize });
};
export const getByGroupOrderFields = (query, dataSourceId) => {
    var _a, _b, _c, _d;
    const categoryField = (_a = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _a === void 0 ? void 0 : _a[0];
    const numericFields = (_b = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _b === void 0 ? void 0 : _b.map((outStatistic) => outStatistic.onStatisticField);
    if (!categoryField || !(numericFields === null || numericFields === void 0 ? void 0 : numericFields.length))
        return Immutable([]);
    let fields = Immutable([]);
    if (categoryField !== '') {
        fields = fields.concat([{
                name: ((_c = getFieldSchema(categoryField, dataSourceId)) === null || _c === void 0 ? void 0 : _c.alias) || categoryField,
                value: categoryField
            }]);
    }
    const numericOrderFields = (_d = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _d === void 0 ? void 0 : _d.map(statistic => {
        var _a;
        const value = statistic.outStatisticFieldName;
        const field = statistic.onStatisticField;
        let name = '';
        if (statistic.statisticType === StatisticType.Count) {
            name = 'COUNT';
        }
        else {
            name = ((_a = getFieldSchema(field, dataSourceId)) === null || _a === void 0 ? void 0 : _a.alias) || field;
        }
        return ({ name, value });
    });
    fields = fields.concat(numericOrderFields);
    return fields;
};
//# sourceMappingURL=utils.js.map