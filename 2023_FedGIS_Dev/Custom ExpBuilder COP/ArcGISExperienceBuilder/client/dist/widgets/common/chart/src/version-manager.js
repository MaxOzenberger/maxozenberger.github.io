import { BaseVersionManager, Immutable } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { CategoryType } from './config';
import { ByFieldSeriesX, ByFieldSeriesY } from './constants';
import { capitalizeString } from './utils/common';
import { getCategoryType } from './utils/common/serial';
import { getFillSymbol, isSerialSeries } from './utils/default';
/**
 * Function merging multiple `outStatistics` properties.
 * @param uniqueQuery
 * @param series
 */
const mergeOutStatistics = (uniqueQuery, series) => {
    series.slice(1).forEach((serie) => {
        var _a, _b, _c;
        const outStatistics = ((_a = uniqueQuery.outStatistics) !== null && _a !== void 0 ? _a : []).concat((_c = (_b = serie.query) === null || _b === void 0 ? void 0 : _b.outStatistics) !== null && _c !== void 0 ? _c : []);
        uniqueQuery = uniqueQuery.set('outStatistics', outStatistics);
    });
    return uniqueQuery;
};
/**
 * Function building a unique query based on the chart series config.
 * Note: all queries have the same onStatisticsField, so they can be combined into one query.
 */
export const buildUniqueQuery = (series) => {
    var _a, _b;
    if (!(series === null || series === void 0 ? void 0 : series.length))
        return null;
    let uniqueQuery = series[0].query;
    if (!((_a = uniqueQuery.outStatistics) === null || _a === void 0 ? void 0 : _a.length))
        return null;
    if ((_b = uniqueQuery === null || uniqueQuery === void 0 ? void 0 : uniqueQuery.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b.length) {
        uniqueQuery = mergeOutStatistics(uniqueQuery, series);
    }
    return uniqueQuery;
};
/**
 * Use the numeric field as the id of the serie.
 */
export const setSeriesIdWithNumericField = (series) => {
    return series === null || series === void 0 ? void 0 : series.map((serie) => {
        var _a, _b, _c, _d, _e;
        if (!((_b = (_a = serie.query) === null || _a === void 0 ? void 0 : _a.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b.length)) {
            return serie;
        }
        else {
            const numericField = (_e = (_d = (_c = serie.query) === null || _c === void 0 ? void 0 : _c.outStatistics) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.onStatisticField;
            const id = serie.id;
            if (numericField && numericField !== id) {
                serie = Immutable.set(serie, 'id', numericField);
            }
            return serie;
        }
    });
};
export const upgradeColorMatch = (oldConfig) => {
    var _a;
    if (!oldConfig)
        return oldConfig;
    let series = (_a = oldConfig.webChart) === null || _a === void 0 ? void 0 : _a.series;
    if (!(series === null || series === void 0 ? void 0 : series.length))
        return oldConfig;
    const seriesType = getSeriesType(series);
    if (seriesType !== 'pieSeries')
        return oldConfig;
    const colorType = series[0].colorType;
    if (colorType !== 'colorMatch')
        return oldConfig;
    let dataSource = oldConfig.webChart.dataSource;
    const colorMatch = dataSource === null || dataSource === void 0 ? void 0 : dataSource.colorMatch;
    if (!colorMatch)
        return oldConfig;
    const colorMatches = colorMatch.colorMatches;
    const defaultFillSymbol = series[0].fillSymbol;
    const slices = Object.entries(colorMatches).map(([key, match]) => {
        var _a, _b, _c;
        const sliceId = key;
        const color = match._fillColor;
        const fillSymbol = getFillSymbol(color, (_b = (_a = defaultFillSymbol.outline) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0, (_c = defaultFillSymbol.outline) === null || _c === void 0 ? void 0 : _c.color);
        return { sliceId, fillSymbol };
    });
    series = Immutable.setIn(series, ['0', 'slices'], slices);
    dataSource = dataSource.without('colorMatch');
    const newConfig = oldConfig.setIn(['webChart', 'series'], series)
        .setIn(['webChart', 'dataSource'], dataSource);
    return newConfig;
};
export const upgradeByField = (oldConfig) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!oldConfig)
        return oldConfig;
    let query = (_b = (_a = oldConfig.webChart) === null || _a === void 0 ? void 0 : _a.dataSource) === null || _b === void 0 ? void 0 : _b.query;
    let series = (_c = oldConfig.webChart) === null || _c === void 0 ? void 0 : _c.series;
    const seriesType = getSeriesType(series);
    if (seriesType !== 'pieSeries' && !isSerialSeries(seriesType))
        return oldConfig;
    const categoryType = getCategoryType(query);
    if (categoryType !== CategoryType.ByField)
        return oldConfig;
    const statisticType = (_f = (_e = (_d = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.statisticType) !== null && _f !== void 0 ? _f : 'sum';
    series = series.map(serie => {
        let x = serie.x;
        let y = serie.y;
        let id = serie.y;
        if (x === 'FieldName') {
            x = ByFieldSeriesX;
            serie = serie.set('x', x);
        }
        if (y === 'FieldValue') {
            y = ByFieldSeriesY;
            serie = serie.set('y', y);
        }
        if (id === 'FieldValue') {
            id = ByFieldSeriesY;
            serie = serie.set('id', id);
        }
        if (serie.name === 'Sum of value') {
            const name = `${capitalizeString(statisticType)} of value`;
            serie = serie.set('name', name);
        }
        return serie;
    });
    const orderByField = (_g = query.orderByFields) === null || _g === void 0 ? void 0 : _g[0];
    if (orderByField === null || orderByField === void 0 ? void 0 : orderByField.includes('FieldName')) {
        query = query.set('orderByFields', [orderByField.replace('FieldName', ByFieldSeriesX)]);
    }
    else if (orderByField === null || orderByField === void 0 ? void 0 : orderByField.includes('FieldValue')) {
        query = query.set('orderByFields', [orderByField.replace('FieldValue', ByFieldSeriesY)]);
    }
    const newConfig = oldConfig.setIn(['webChart', 'series'], series)
        .setIn(['webChart', 'dataSource', 'query'], query);
    return newConfig;
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.6.0',
                description: 'Rename `multipleBarType` to `stackedType`',
                upgrader: (oldConfig) => {
                    var _a;
                    if (!oldConfig)
                        return oldConfig;
                    let series = (_a = oldConfig.webChart) === null || _a === void 0 ? void 0 : _a.series;
                    if (!(series === null || series === void 0 ? void 0 : series.length))
                        return oldConfig;
                    series = series.map((serie) => {
                        serie = serie.set('stackedType', serie.multipleBarType);
                        serie = serie.without('multipleBarType');
                        return serie;
                    });
                    const newConfig = oldConfig.setIn(['webChart', 'series'], series);
                    return newConfig;
                }
            }, {
                version: '1.7.0',
                description: 'Use the `numericField` as the `id` of serie, build the `query` in the `series` as a data source',
                upgrader: (oldConfig) => {
                    var _a;
                    if (!oldConfig)
                        return oldConfig;
                    let series = (_a = oldConfig.webChart) === null || _a === void 0 ? void 0 : _a.series;
                    if (!(series === null || series === void 0 ? void 0 : series.length))
                        return oldConfig;
                    series = setSeriesIdWithNumericField(series);
                    const query = buildUniqueQuery(series);
                    series = series.map(serie => Immutable.without(serie, 'query'));
                    const dataSource = { query };
                    const newConfig = oldConfig.setIn(['webChart', 'series'], series)
                        .setIn(['webChart', 'dataSource'], dataSource);
                    return newConfig;
                }
            }, {
                version: '1.8.0',
                description: '',
                upgrader: (oldConfig) => {
                    return oldConfig;
                }
            }, {
                version: '1.9.0',
                description: '',
                upgrader: (oldConfig) => {
                    return oldConfig;
                }
            }, {
                version: '1.10.0',
                description: 'Upgrade `config.colorMatch` to `series[0].slices` for pie chart.',
                upgrader: (oldConfig) => {
                    let newConfig = upgradeColorMatch(oldConfig);
                    newConfig = upgradeByField(newConfig);
                    return newConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map