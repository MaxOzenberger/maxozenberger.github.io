import { React, DataSourceStatus } from 'jimu-core';
import { getCategoryField } from '../../../utils/common/serial';
import { isSerialSeries } from '../../../utils/default';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
import { getSourceRecords } from './utils';
/**
 * Check whether a data source instance is valid (whether the corresponding data source is deleted)
 * @param dataSource
 */
const isDataSourceValid = (dataSource) => {
    if (!dataSource)
        return false;
    const info = dataSource.getInfo();
    return info && Object.keys(info).length > 0;
};
/**
 * Check whether a data source instance can be used to load data
 * @param dataSource
 */
const isDataSourceReady = (dataSource) => {
    if (!isDataSourceValid(dataSource))
        return false;
    const status = dataSource.getStatus();
    //The dats source is ready to use
    return status && status !== DataSourceStatus.NotReady;
};
/**
 * Check whether the query in chart data source is valid.
 * @param dataSource
 */
const isValidQuery = (type, query) => {
    var _a, _b, _c, _d, _e, _f;
    if (isSerialSeries(type) || type === 'pieSeries') {
        if (query.outFields) {
            return !!(((_a = query === null || query === void 0 ? void 0 : query.outFields) === null || _a === void 0 ? void 0 : _a[0]) && ((_b = query === null || query === void 0 ? void 0 : query.groupByFieldsForStatistics) === null || _b === void 0 ? void 0 : _b[0]));
        }
        else {
            return !!((_d = (_c = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.onStatisticField);
        }
    }
    else if (type === 'scatterSeries') {
        return !!((_e = query === null || query === void 0 ? void 0 : query.outFields) === null || _e === void 0 ? void 0 : _e[1]);
    }
    else if (type === 'histogramSeries') {
        return !!((_f = query === null || query === void 0 ? void 0 : query.outFields) === null || _f === void 0 ? void 0 : _f[0]);
    }
};
const getDataSourceQuery = (type, query) => {
    var _a;
    if (!isValidQuery(type, query))
        return null;
    // Remove `orderByField` for `by-field` mode of `serial` and `pie` chart
    if (((_a = query.outStatistics) === null || _a === void 0 ? void 0 : _a.length) && !query.groupByFieldsForStatistics) {
        return query.without('orderByFields');
    }
    return query;
};
const useFetchRecords = (type, query, version, recordsLimited, callback) => {
    const { dataSource, outputDataSource } = useChartRuntimeState();
    const dispatch = useChartRuntimeDispatch();
    const categoryField = getCategoryField(query);
    const params = React.useMemo(() => getDataSourceQuery(type, query), [query, type]);
    React.useEffect(() => {
        if (!isDataSourceReady(dataSource) || !outputDataSource || params == null) {
            return;
        }
        dispatch({ type: 'SET_RECORDS_STATUS', value: 'loading' });
        dataSource.query(params).then((result) => {
            let records = result.records;
            if (records.length > recordsLimited) {
                dispatch({ type: 'SET_RECORDS_STATUS', value: 'exceed' });
                return;
            }
            if (records.length === 0) {
                dispatch({ type: 'SET_RECORDS_STATUS', value: 'empty' });
                dispatch({ type: 'SET_RECORDS', value: records });
                return;
            }
            if (callback)
                records = callback(records, query, dataSource);
            records = getSourceRecords(records, outputDataSource, categoryField);
            dispatch({ type: 'SET_RECORDS_STATUS', value: 'loaded' });
            dispatch({ type: 'SET_RECORDS', value: records });
        }, (error) => {
            console.error(error);
            dispatch({ type: 'SET_RECORDS', value: undefined });
            dispatch({ type: 'SET_RECORDS_STATUS', value: 'error' });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource, outputDataSource, params, version]);
};
export default useFetchRecords;
//# sourceMappingURL=use-fetch-records.js.map