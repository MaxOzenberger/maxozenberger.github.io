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
/** @jsx jsx */
import { React, jsx, css, DataSourceComponent, Immutable, classNames, CONSTANTS, DataSourceStatus, DataRecordSetChangeMessage, RecordSetChangeType, MessageManager } from 'jimu-core';
import { Button, Loading, LoadingType, Tooltip, hooks } from 'jimu-ui';
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash';
import { QueryTaskForm } from './query-task-form';
import { QueryTaskResult } from './query-result';
import { DataSourceTip } from '../common/data-source-tip';
import { QueryTaskLabel } from './query-task-label';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { generateQueryParams, executeQuery, executeCountQuery } from './query-utils';
import { MenuOutlined } from 'jimu-icons/outlined/editor/menu';
import defaultMessage from './translations/default';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import { useDataSourceExists } from '../common/use-ds-exists';
const style = css `
  &.wrapped .query-form {
    height: 100%;
  }
  .query-task__content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .query-form__header {
    display: flex;
    .nav-action {
      flex: 1 1 0;
      overflow: hidden;
      display: flex;
    }
    .result-menu {
      display: flex;
    }
  }
`;
export function QueryTask(props) {
    var _a, _b, _c;
    const { queryItem, onNavBack, total, wrappedInPopper = false, className = '', index } = props, otherProps = __rest(props, ["queryItem", "onNavBack", "total", "wrappedInPopper", "className", "index"]);
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const [stage, setStage] = React.useState(0);
    const [enabled, setEnabled] = React.useState(true);
    const [resultCount, setResultCount] = React.useState(0);
    const queryParamRef = React.useRef(null);
    const recordsRef = React.useRef(null);
    const [outputDS, setOutputDS] = React.useState(null);
    const [dataSource, setDataSource] = React.useState(null);
    const [spatialFilterEnabled, setSpatialFilterEnabled] = React.useState(true);
    const attributeFilterSqlExprObj = React.useRef(queryItem.sqlExprObj);
    const spatialFilterObj = React.useRef(null);
    const backBtnRef = React.useRef();
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const { icon, name, displayLabel } = currentItem;
    const dsExists = useDataSourceExists({ widgetId: props.widgetId, useDataSourceId: (_a = currentItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId });
    const defaultPageSize = (_b = outputDS === null || outputDS === void 0 ? void 0 : outputDS.getQueryPageSize()) !== null && _b !== void 0 ? _b : CONSTANTS.DEFAULT_QUERY_PAGE_SIZE;
    hooks.useEffectOnce(() => {
        // focus the back button when it is rendered
        backBtnRef.current.focus();
    });
    const useOutputDs = React.useMemo(() => Immutable({
        dataSourceId: queryItem.outputDataSourceId,
        mainDataSourceId: queryItem.outputDataSourceId
    }), [queryItem.outputDataSourceId]);
    const updateDataSource = React.useCallback((ds) => {
        var _a, _b;
        const currentDs = ds !== null && ds !== void 0 ? ds : dataSource;
        // should disable spatial filter if the dataSource is an output ds and it already has spatial filter
        if ((_a = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.isOutputFromWidget) {
            const qDs = currentDs;
            const qParams = (_b = qDs.getCurrentQueryParams) === null || _b === void 0 ? void 0 : _b.call(qDs);
            if (qParams.geometry != null) {
                setSpatialFilterEnabled(false);
            }
            else {
                setSpatialFilterEnabled(true);
            }
        }
    }, [dataSource]);
    const handleStatusChange = React.useCallback((enabled) => {
        setEnabled(enabled);
        updateDataSource();
    }, [updateDataSource]);
    const handleDataSourceCreated = React.useCallback((ds) => {
        setDataSource(ds);
        updateDataSource(ds);
    }, [updateDataSource]);
    const handleOutputDataSourceCreated = React.useCallback((ds) => {
        setOutputDS(ds);
    }, []);
    const publishDataClearedMsg = React.useCallback(() => {
        const dataRecordSetChangeMessage = new DataRecordSetChangeMessage(props.widgetId, outputDS.id, RecordSetChangeType.Remove, {
            records: [],
            fields: [],
            dataSource: outputDS
        });
        MessageManager.getInstance().publishMessage(dataRecordSetChangeMessage);
    }, [props.widgetId, outputDS]);
    const navToForm = React.useCallback((clearResults = false) => {
        if (clearResults) {
            recordsRef.current = null;
            outputDS === null || outputDS === void 0 ? void 0 : outputDS.setStatus(DataSourceStatus.NotReady);
            setResultCount(0);
            publishDataClearedMsg();
        }
        setStage(0);
    }, [outputDS, publishDataClearedMsg]);
    const navToResult = React.useCallback(() => {
        setStage(1);
    }, []);
    const handleFormSubmit = React.useCallback((sqlExpr, spatialFilter) => {
        attributeFilterSqlExprObj.current = sqlExpr;
        spatialFilterObj.current = spatialFilter;
        // Load the first page
        const featureDS = outputDS;
        setStage(2);
        publishDataClearedMsg();
        generateQueryParams(featureDS, sqlExpr, spatialFilter, currentItem, 1, defaultPageSize)
            .then((queryParams) => {
            queryParamRef.current = queryParams;
            featureDS.setCountStatus(DataSourceStatus.Unloaded);
            return executeCountQuery(props.widgetId, featureDS, queryParams);
        })
            .then((count) => {
            setResultCount(count);
            // update ds in order to execute query
            featureDS.updateQueryParams(queryParamRef.current, props.widgetId);
            featureDS.setStatus(DataSourceStatus.Unloaded);
            return executeQuery(props.widgetId, queryItem, featureDS, queryParamRef.current);
        })
            .then((result) => {
            recordsRef.current = result.records;
        })
            .finally(() => {
            if ((spatialFilter === null || spatialFilter === void 0 ? void 0 : spatialFilter.layer) && (spatialFilter === null || spatialFilter === void 0 ? void 0 : spatialFilter.clearAfterApply)) {
                spatialFilter.layer.removeAll();
            }
            setStage(1);
        });
    }, [currentItem, queryItem, props.widgetId, outputDS, defaultPageSize, publishDataClearedMsg]);
    const clearResult = React.useCallback(() => {
        recordsRef.current = null;
        outputDS === null || outputDS === void 0 ? void 0 : outputDS.setStatus(DataSourceStatus.NotReady);
        setResultCount(0);
        publishDataClearedMsg();
    }, [outputDS, publishDataClearedMsg]);
    return (jsx("div", { className: classNames('query-task h-100 d-flex', className, { wrapped: wrappedInPopper }), css: style },
        jsx("div", { className: classNames('query-task__content', { 'd-none': stage === 1 }) },
            jsx(DataSourceComponent, { useDataSource: useOutputDs, onDataSourceCreated: handleOutputDataSourceCreated }),
            jsx("div", { className: 'query-form__header px-3 align-items-center' },
                jsx("div", { className: classNames('nav-action align-items-center', { 'd-none': wrappedInPopper }) },
                    jsx(Button, { className: classNames('p-0 mr-2', { 'd-none': total === 1 }), size: 'sm', type: 'tertiary', icon: true, onClick: onNavBack, "aria-label": getI18nMessage('back'), ref: backBtnRef },
                        jsx(ArrowLeftOutlined, { autoFlip: true })),
                    jsx(QueryTaskLabel, { icon: icon, name: displayLabel ? name : '' })),
                jsx("div", { className: classNames('result-menu ml-auto align-items-center', { 'd-none': resultCount === 0 }) },
                    jsx(Tooltip, { title: getI18nMessage('checkResult'), placement: 'bottom' },
                        jsx(Button, { size: 'sm', type: 'tertiary', "aria-label": getI18nMessage('checkResult'), icon: true, onClick: navToResult },
                            jsx(MenuOutlined, null))),
                    jsx("div", { css: css `width: 1px; height: 16px; background-color: var(--light-400);` }),
                    jsx(Tooltip, { title: getI18nMessage('clearResult'), placement: 'bottom' },
                        jsx(Button, { size: 'sm', type: 'tertiary', "aria-label": getI18nMessage('clearResult'), icon: true, onClick: clearResult },
                            jsx(TrashOutlined, null))))),
            enabled && dsExists && (jsx(QueryTaskForm, Object.assign({}, otherProps, { configId: queryItem.configId, outputDS: outputDS, datasourceReady: dataSource != null, spatialFilterEnabled: spatialFilterEnabled, onFormSubmit: handleFormSubmit }))),
            jsx(DataSourceTip, { widgetId: props.widgetId, useDataSource: queryItem.useDataSource, showMessage: true, onStatusChange: handleStatusChange, onDataSourceCreated: handleDataSourceCreated })),
        jsx("div", { className: classNames('query-task__content', { 'd-none': stage !== 1 }) },
            jsx(QueryTaskResult, { widgetId: props.widgetId, queryItem: queryItem, queryParams: queryParamRef.current, resultCount: resultCount, maxPerPage: (_c = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getMaxRecordCount) === null || _c === void 0 ? void 0 : _c.call(dataSource), records: recordsRef.current, defaultPageSize: defaultPageSize, outputDS: outputDS, onNavBack: navToForm })),
        stage === 2 && jsx(Loading, { type: LoadingType.Donut })));
}
//# sourceMappingURL=query-task.js.map