/** @jsx jsx */
import { React, jsx, css, ReactRedux, DataSourceComponent, DataSourceManager, Immutable } from 'jimu-core';
import { Button, Icon, hooks, Tooltip, DataActionDropDown } from 'jimu-ui';
import { getWidgetRuntimeDataMap } from './widget-config';
import { PagingType, ListDirection } from '../config';
import defaultMessage from './translations/default';
import { LazyList } from './lazy-list';
import { PagingList } from './paging-list';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
const { iconMap } = getWidgetRuntimeDataMap();
const resultStyle = css `
  display: flex;
  flex-direction: column;

  .query-result__header {
    color: var(--dark-800);
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
  }

  .query-result-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
  }
`;
export function QueryTaskResult(props) {
    var _a, _b;
    const { queryItem, queryParams, resultCount, maxPerPage, records, defaultPageSize, widgetId, outputDS, onNavBack } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const [queryData, setQueryData] = React.useState(null);
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const backBtnRef = React.useRef();
    const enableDataAction = ReactRedux.useSelector((state) => {
        var _a;
        const widgetJson = state.appConfig.widgets[widgetId];
        return (_a = widgetJson.enableDataAction) !== null && _a !== void 0 ? _a : true;
    });
    const pagingTypeInConfig = ReactRedux.useSelector((state) => {
        const widgetJson = state.appConfig.widgets[widgetId];
        return widgetJson.config.resultPagingStyle;
    });
    const directionTypeInConfig = ReactRedux.useSelector((state) => {
        const widgetJson = state.appConfig.widgets[widgetId];
        return widgetJson.config.resultListDirection;
    });
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const pagingType = pagingTypeInConfig !== null && pagingTypeInConfig !== void 0 ? pagingTypeInConfig : PagingType.MultiPage;
    const direction = directionTypeInConfig !== null && directionTypeInConfig !== void 0 ? directionTypeInConfig : ListDirection.Vertical;
    hooks.useEffectOnce(() => {
        // focus the back button when it is rendered
        backBtnRef.current.focus();
    });
    React.useEffect(() => {
        setQueryData({
            records,
            pageSize: defaultPageSize,
            page: 1
        });
    }, [records, defaultPageSize]);
    const clearResults = () => {
        onNavBack(true);
        setQueryData(null);
    };
    const handleRenderDone = React.useCallback(({ dataItems, pageSize, page }) => {
        setQueryData({
            records: dataItems,
            pageSize,
            page
        });
    }, []);
    const handleDataSourceInfoChange = React.useCallback(() => {
        var _a;
        const ds = DataSourceManager.getInstance().getDataSource(outputDS === null || outputDS === void 0 ? void 0 : outputDS.id);
        const records = ds === null || ds === void 0 ? void 0 : ds.getSelectedRecords();
        const selectedIds = (_a = ds === null || ds === void 0 ? void 0 : ds.getSelectedRecordIds()) !== null && _a !== void 0 ? _a : [];
        let shouldUpdate = false;
        if (selectedIds.length !== selectedRecords.length) {
            shouldUpdate = true;
        }
        else { // equal length
            shouldUpdate = selectedIds.some(id => {
                const target = selectedRecords.find((item) => item.getId() === id);
                return target == null;
            });
        }
        if (shouldUpdate) {
            setSelectedRecords(records);
        }
    }, [outputDS === null || outputDS === void 0 ? void 0 : outputDS.id, selectedRecords]);
    const getTipMessage = React.useCallback(() => {
        var _a;
        if (queryData) {
            if (pagingType === PagingType.LazyLoad) {
                return `${getI18nMessage('featuresDisplayed')}: ${(_a = queryData === null || queryData === void 0 ? void 0 : queryData.records) === null || _a === void 0 ? void 0 : _a.length} / ${resultCount}`;
            }
            const from = (queryData.page - 1) * queryData.pageSize + 1;
            const to = from + queryData.pageSize - 1;
            if (resultCount > 0) {
                return `${getI18nMessage('featuresDisplayed')}: ${from} - ${Math.min(to, resultCount)} / ${resultCount}`;
            }
            return `${getI18nMessage('featuresDisplayed')}: 0 - 0 / 0`;
        }
        return '';
    }, [queryData, resultCount, getI18nMessage, pagingType]);
    const resultUseOutputDataSource = React.useMemo(() => {
        return Immutable({
            dataSourceId: queryItem.outputDataSourceId,
            mainDataSourceId: queryItem.outputDataSourceId
        });
    }, [queryItem === null || queryItem === void 0 ? void 0 : queryItem.outputDataSourceId]);
    return (jsx("div", { className: 'query-result h-100', css: resultStyle, role: 'listbox', "aria-label": getI18nMessage('results') },
        jsx(DataSourceComponent, { useDataSource: resultUseOutputDataSource, onDataSourceInfoChange: handleDataSourceInfoChange }),
        jsx("div", { className: 'query-result__header d-flex align-items-center px-3' },
            jsx(Button, { ref: backBtnRef, className: 'p-0 mr-2', size: 'sm', type: 'tertiary', icon: true, onClick: () => onNavBack() },
                jsx(ArrowLeftOutlined, { autoFlip: true })), (_a = currentItem.resultsLabel) !== null && _a !== void 0 ? _a : getI18nMessage('results'),
            ((_b = queryData === null || queryData === void 0 ? void 0 : queryData.records) === null || _b === void 0 ? void 0 : _b.length) > 0 && (jsx(React.Fragment, null,
                jsx(Tooltip, { title: getI18nMessage('clearResult'), placement: 'bottom' },
                    jsx(Button, { className: 'ml-auto', icon: true, size: 'sm', type: 'tertiary', onClick: clearResults, "aria-label": getI18nMessage('clearResult') },
                        jsx(Icon, { icon: iconMap.toolDelete }))),
                enableDataAction && (jsx(React.Fragment, null,
                    jsx("div", { css: css `width: 1px; height: 16px; background-color: var(--light-400);` }),
                    jsx(DataActionDropDown, { widgetId: widgetId, dataSet: { dataSource: outputDS, records: (selectedRecords === null || selectedRecords === void 0 ? void 0 : selectedRecords.length) > 0 ? selectedRecords : queryData === null || queryData === void 0 ? void 0 : queryData.records, name: outputDS.getLabel() }, size: 'sm', type: 'tertiary' })))))),
        jsx("div", { className: 'query-result-container mt-1' },
            jsx("div", { className: 'query-result-info mb-2 px-3', role: 'alert', "aria-live": 'polite' }, getTipMessage()),
            pagingType === PagingType.LazyLoad && resultCount > 0 && (jsx(LazyList, { widgetId: widgetId, queryItem: queryItem, outputDS: outputDS, queryParams: queryParams, resultCount: resultCount, records: records, direction: direction, onRenderDone: handleRenderDone })),
            pagingType === PagingType.MultiPage && resultCount > 0 && (jsx(PagingList, { widgetId: widgetId, queryItem: queryItem, outputDS: outputDS, queryParams: queryParams, resultCount: resultCount, maxPerPage: maxPerPage, records: records, direction: direction, onRenderDone: handleRenderDone })))));
}
//# sourceMappingURL=query-result.js.map