import { React } from 'jimu-core';
import { getSeriesType } from 'jimu-ui/advanced/chart';
import { CategoryType } from '../../../config';
import { getCategoryType } from '../../../utils/common/serial';
import { isSerialSeries } from '../../../utils/default';
import { useChartRuntimeState } from '../../state';
import OriginDataSourceManager from './original';
import OutputSourceManager from './output';
import useFetchRecords from './use-fetch-records';
import { convertByFieldRecords, getRecordslimited } from './utils';
const InlineDataSourceManager = (props) => {
    var _a;
    const { widgetId, webChart, outputDataSourceId, useDataSource } = props;
    const type = getSeriesType(webChart === null || webChart === void 0 ? void 0 : webChart.series);
    const query = (_a = webChart === null || webChart === void 0 ? void 0 : webChart.dataSource) === null || _a === void 0 ? void 0 : _a.query;
    const recordsLimited = getRecordslimited(webChart === null || webChart === void 0 ? void 0 : webChart.series);
    const { queryVersion } = useChartRuntimeState();
    const categoryType = getCategoryType(query);
    const callback = React.useMemo(() => {
        if (categoryType !== CategoryType.ByField || (!isSerialSeries(type) && type !== 'pieSeries'))
            return null;
        return convertByFieldRecords;
    }, [categoryType, type]);
    useFetchRecords(type, query, queryVersion, recordsLimited, callback);
    return (React.createElement(React.Fragment, null,
        React.createElement(OriginDataSourceManager, { widgetId: widgetId, useDataSource: useDataSource }),
        React.createElement(OutputSourceManager, { widgetId: widgetId, dataSourceId: outputDataSourceId })));
};
export default InlineDataSourceManager;
//# sourceMappingURL=inline.js.map