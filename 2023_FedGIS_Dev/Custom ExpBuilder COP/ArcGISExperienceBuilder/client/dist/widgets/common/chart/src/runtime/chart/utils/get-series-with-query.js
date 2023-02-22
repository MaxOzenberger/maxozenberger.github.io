import { Immutable } from 'jimu-core';
import { isSerialSeries } from '../../../utils/default';
import { CategoryType } from '../../../config';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { getCategoryType } from '../../../utils/common/serial';
const getSingleQueryForByGroup = (serie, queries) => {
    const y = serie.y;
    const outStatistics = queries.outStatistics.filter((s) => s.outStatisticFieldName === y);
    const { groupByFieldsForStatistics, orderByFields } = queries;
    const query = Immutable({ groupByFieldsForStatistics, outStatistics, orderByFields });
    return serie.set('query', query);
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleQueryForByFeature = (serie, queries) => {
    const { groupByFieldsForStatistics, orderByFields } = queries;
    const query = Immutable({ groupByFieldsForStatistics, orderByFields });
    return serie.set('query', query);
};
const getSeriesWithQuery = (series, query) => {
    let callback = null;
    const type = getSeriesType(series);
    // don't set query for pie chart(/arcgis-charts/issues/5355)
    if (isSerialSeries(type)) {
        const categoryType = getCategoryType(query);
        if (categoryType === CategoryType.ByGroup) {
            callback = getSingleQueryForByGroup;
        }
    }
    if (callback) {
        return series === null || series === void 0 ? void 0 : series.map((serie) => callback(serie, query));
    }
    return series;
};
export default getSeriesWithQuery;
//# sourceMappingURL=get-series-with-query.js.map