import { Immutable } from 'jimu-core';
import { createDefaultSerie } from '../utils';
export const createByFieldSeries = ({ x, y, name, propSeries }) => {
    const seriesProps = propSeries[0];
    const serie = createDefaultSerie(seriesProps, 0);
    serie.x = x;
    serie.y = y;
    serie.name = name;
    serie.id = y;
    return Immutable([serie]);
};
export const createByFieldQuery = ({ statisticType, numericFields }, orderByFields) => {
    const outStatistics = numericFields.map((numericField) => {
        const statistic = {
            statisticType,
            onStatisticField: numericField,
            outStatisticFieldName: numericField
        };
        if (statisticType === 'percentile_cont') {
            const statisticParameters = {
                value: 0.5
            };
            statistic.statisticParameters = statisticParameters;
        }
        return statistic;
    });
    return Immutable({ outStatistics, orderByFields });
};
export const getByFieldOrderFields = (series, translate) => {
    var _a, _b;
    const categoryField = (_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.x;
    const serieY = (_b = series === null || series === void 0 ? void 0 : series[0]) === null || _b === void 0 ? void 0 : _b.y;
    let fields = Immutable([]);
    const xAxisLabel = translate('categoryAxis');
    const yAxisLabel = translate('valueAxis');
    fields = fields.concat([{
            name: xAxisLabel,
            value: categoryField
        },
        {
            name: yAxisLabel,
            value: serieY
        }]);
    return fields;
};
const translations = {
    sum: 'Sum of Value',
    avg: 'Mean of Value',
    min: 'Minimum of Value',
    max: 'Maximum of Value',
    count: 'Count',
    percentile_cont: 'Median of Value'
};
export const dummyNormalizeStatisticFieldLabel = (statisticType) => {
    return translations[statisticType];
};
//# sourceMappingURL=utils.js.map