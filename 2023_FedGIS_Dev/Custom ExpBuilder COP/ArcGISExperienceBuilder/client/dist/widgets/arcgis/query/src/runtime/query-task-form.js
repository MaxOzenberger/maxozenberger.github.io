/** @jsx jsx */
import { React, jsx, css, classNames, ReactRedux } from 'jimu-core';
import { Button, hooks, Tooltip } from 'jimu-ui';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { SqlExpressionRuntime, getShownClauseNumberByExpression } from 'jimu-ui/basic/sql-expression-runtime';
import { SpatialRelation } from '../config';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import defaultMessage from './translations/default';
import { QueryTaskSpatialForm } from './query-task-spatial-form';
import { useAutoHeight } from './useAutoHeight';
import { QueryTaskContext } from './query-task-context';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
const getFormStyle = (isAutoHeight) => {
    return css `
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    .form-title {
      color: var(--dark-800);
      font-weight: 500;
      font-size: 13px;
      line-height: 18px;
    }
    .query-form__content {
      flex: 1 1 ${isAutoHeight ? 'auto' : 0};
      max-height: ${isAutoHeight ? '61.8vh' : 'none'};
      overflow: auto;
    }
  `;
};
export function QueryTaskForm(props) {
    const { widgetId, configId, outputDS, spatialFilterEnabled, datasourceReady, onFormSubmit } = props;
    const queryItem = ReactRedux.useSelector((state) => {
        const widgetJson = state.appConfig.widgets[widgetId];
        return widgetJson.config.queryItems.find(item => item.configId === configId);
    });
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const [resetSymbol, setResetSymbol] = React.useState(null);
    // const [dataSource, setDataSource] = React.useState<DataSource>(null)
    const { useAttributeFilter, useSpatialFilter, spatialFilterTypes, sqlExprObj, spatialMapWidgetIds, spatialInteractiveCreateToolTypes, spatialRelationUseDataSources, spatialRelations, spatialRelationEnableBuffer, spatialRelationBufferDistance, spatialRelationBufferUnit, spatialInteractiveEnableBuffer, spatialInteractiveBufferDistance, spatialInteractiveBufferUnit, attributeFilterLabel = getI18nMessage('attributeFilter'), spatialFilterLabel = getI18nMessage('spatialFilter'), attributeFilterDesc, spatialFilterDesc } = currentItem;
    const [attributeFilterSqlExprObj, setAttributeFilterSqlExprObj] = React.useState(sqlExprObj);
    const spatialFilterObjRef = React.useRef(null);
    const spatialRelationRef = React.useRef(SpatialRelation.Intersect);
    const bufferRef = React.useRef(null);
    const isAutoHeight = useAutoHeight();
    const showClauseNumber = React.useRef(getShownClauseNumberByExpression(sqlExprObj));
    const originDS = outputDS === null || outputDS === void 0 ? void 0 : outputDS.getOriginDataSources()[0];
    React.useEffect(() => {
        // The sqlExprObj.parts may changes but the displaySQL is the same
        if (!sqlExprObj) {
            showClauseNumber.current = 0;
            setAttributeFilterSqlExprObj(null);
        }
        else {
            showClauseNumber.current = getShownClauseNumberByExpression(sqlExprObj);
            setAttributeFilterSqlExprObj(sqlExprObj);
        }
    }, [sqlExprObj]);
    const applyQuery = React.useCallback(() => {
        var _a, _b;
        let rel = spatialRelationRef.current;
        if (((_a = spatialFilterObjRef.current) === null || _a === void 0 ? void 0 : _a.geometry) && rel == null) {
            rel = SpatialRelation.Intersect;
        }
        if (Array.isArray((_b = spatialFilterObjRef.current) === null || _b === void 0 ? void 0 : _b.geometry)) {
            loadArcGISJSAPIModules([
                'esri/geometry/geometryEngine'
            ]).then(modules => {
                const geometryEngine = modules[0];
                const geometry = geometryEngine.union(spatialFilterObjRef.current.geometry);
                onFormSubmit(attributeFilterSqlExprObj, Object.assign(Object.assign({}, spatialFilterObjRef.current), { geometry, relation: rel, buffer: bufferRef.current }));
            });
        }
        else {
            onFormSubmit(attributeFilterSqlExprObj, Object.assign(Object.assign({}, spatialFilterObjRef.current), { relation: rel, buffer: bufferRef.current }));
        }
    }, [onFormSubmit, attributeFilterSqlExprObj]);
    const resetQuery = React.useCallback(() => {
        // 1. reset attribute filter
        showClauseNumber.current = getShownClauseNumberByExpression(sqlExprObj);
        setAttributeFilterSqlExprObj(sqlExprObj);
        // 2. reset spatial filter
        setResetSymbol(Symbol());
    }, [sqlExprObj]);
    const handleSqlExprObjChange = React.useCallback((sqlObj) => {
        showClauseNumber.current = getShownClauseNumberByExpression(sqlObj);
        setAttributeFilterSqlExprObj(sqlObj);
    }, []);
    const handleSpatialFilterChange = React.useCallback((filter) => {
        spatialFilterObjRef.current = filter;
    }, []);
    const handleRelationChange = React.useCallback((rel) => {
        spatialRelationRef.current = rel;
    }, []);
    const handleBufferChange = React.useCallback((distance, unit) => {
        bufferRef.current = { distance, unit };
    }, []);
    const showAttributeFilter = useAttributeFilter && sqlExprObj != null;
    const showSpatialFilter = spatialFilterEnabled && useSpatialFilter && (spatialFilterTypes.length > 0 || (spatialRelationUseDataSources === null || spatialRelationUseDataSources === void 0 ? void 0 : spatialRelationUseDataSources.length) > 0);
    return (jsx(QueryTaskContext.Provider, { value: { resetSymbol } },
        jsx("div", { className: 'query-form', css: getFormStyle(isAutoHeight) },
            jsx("div", { className: 'query-form__content my-2' },
                showAttributeFilter && (jsx("div", { role: 'group', className: 'px-3', "aria-label": attributeFilterLabel },
                    jsx("div", { className: classNames('form-title my-2 d-flex align-items-center', { 'd-none': !attributeFilterLabel && !attributeFilterDesc }) },
                        attributeFilterLabel && jsx("div", { className: 'mr-2' }, attributeFilterLabel),
                        attributeFilterDesc && (jsx(Tooltip, { placement: 'bottom', css: css `white-space: pre-line;`, title: attributeFilterDesc },
                            jsx(Button, { size: 'sm', icon: true, type: 'tertiary' },
                                jsx(InfoOutlined, { color: 'var(--primary)', size: 's' }))))),
                    originDS && (jsx(SqlExpressionRuntime, { widgetId: widgetId, dataSource: originDS, expression: attributeFilterSqlExprObj, onChange: handleSqlExprObjChange })))),
                showAttributeFilter && showSpatialFilter && (jsx("hr", { className: 'm-3', css: css `border: none; height: 1px; background-color: var(--light-300);` })),
                showSpatialFilter && (jsx(QueryTaskSpatialForm, { widgetId: widgetId, label: spatialFilterLabel, desc: spatialFilterDesc, filterTypes: spatialFilterTypes, mapWidgetIds: spatialMapWidgetIds, createToolTypes: spatialInteractiveCreateToolTypes, onFilterChange: handleSpatialFilterChange, onRelationChange: handleRelationChange, onBufferChange: handleBufferChange, spatialRelations: spatialRelations, dsEnableBuffer: spatialRelationEnableBuffer, dsBufferDistance: spatialRelationBufferDistance, dsBufferUnit: spatialRelationBufferUnit, drawEnableBuffer: spatialInteractiveEnableBuffer, drawBufferDistance: spatialInteractiveBufferDistance, drawBufferUnit: spatialInteractiveBufferUnit, useDataSources: spatialRelationUseDataSources }))),
            jsx("div", { className: 'query-form__actions px-3 d-flex align-items-center' },
                jsx(Button, { className: 'active ml-auto', disabled: !datasourceReady, onClick: applyQuery }, getI18nMessage('apply')),
                (showClauseNumber.current > 0 || showSpatialFilter) && (jsx(Button, { className: 'ml-2', onClick: resetQuery }, getI18nMessage('reset')))))));
}
//# sourceMappingURL=query-task-form.js.map