/** @jsx jsx */
import { React, jsx, css, Immutable, DataSourceManager, DataSourceComponent } from 'jimu-core';
import { hooks, Select } from 'jimu-ui';
import { SpatialRelation } from '../config';
import { BufferInput } from './buffer-input';
import defaultMessage from './translations/default';
import { QueryTaskContext } from './query-task-context';
const marginStyle = css `margin-top: 0.75rem;`;
export function GeometryFromDataSource(props) {
    const { onSelectionChange, useDataSources, spatialRelations, enableBuffer, bufferDistance, bufferUnit, onBufferChange, onRelationChange } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const [currentDataSource, setCurrentDataSource] = React.useState(useDataSources[0]);
    const [count, setCount] = React.useState(0);
    const [currentRelation, setCurrentRelation] = React.useState(spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations[0]);
    const queryTaskContext = React.useContext(QueryTaskContext);
    const resetSymbolRef = React.useRef(queryTaskContext.resetSymbol);
    const spatialRelationOptions = React.useMemo(() => {
        return Object.entries(SpatialRelation).map(([key, value]) => ({
            value,
            label: getI18nMessage(`spatialRelation_${key}`)
        }));
    }, [getI18nMessage]);
    hooks.useEffectOnce(() => {
        if ((spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations.length) > 0) {
            onRelationChange(spatialRelations[0]);
        }
        if (enableBuffer) {
            onBufferChange(bufferDistance, bufferUnit);
        }
    });
    React.useEffect(() => {
        if (queryTaskContext.resetSymbol && queryTaskContext.resetSymbol !== resetSymbolRef.current) {
            resetSymbolRef.current = queryTaskContext.resetSymbol;
            setCurrentRelation(spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations[0]);
            onRelationChange(spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations[0]);
        }
    }, [queryTaskContext.resetSymbol, onRelationChange, spatialRelations]);
    React.useEffect(() => {
        if (!spatialRelations) {
            setCurrentRelation(null);
        }
        else if (!spatialRelations.includes(currentRelation)) {
            setCurrentRelation(spatialRelations[0]);
            onRelationChange(spatialRelations[0]);
        }
    }, [spatialRelations, currentRelation, onRelationChange]);
    const handleDataSourceChange = React.useCallback((evt) => {
        const ds = useDataSources.find((item) => item.dataSourceId === evt.target.value);
        setCurrentDataSource(Immutable(ds));
    }, [useDataSources]);
    const handleDataSourceInfoChange = React.useCallback(() => {
        const ds = DataSourceManager.getInstance().getDataSource(currentDataSource.dataSourceId);
        const records = ds === null || ds === void 0 ? void 0 : ds.getSelectedRecords();
        if ((records === null || records === void 0 ? void 0 : records.length) > 0) {
            const geometries = records.map((record) => record.getGeometry());
            onSelectionChange(geometries);
            setCount(records.length);
        }
        else {
            onSelectionChange(null);
            setCount(0);
        }
    }, [currentDataSource.dataSourceId, onSelectionChange]);
    const getLabelOfSpatialRelation = (relation) => {
        return spatialRelationOptions.find(item => item.value === relation).label;
    };
    const handleSpatialRelationChange = React.useCallback(e => {
        setCurrentRelation(e.target.value);
        onRelationChange(e.target.value);
    }, [onRelationChange]);
    return (jsx("div", null,
        jsx("div", { css: marginStyle }, getI18nMessage('chooseFilterLayer')),
        jsx(Select, { "aria-label": getI18nMessage('chooseFilterLayer'), value: currentDataSource.dataSourceId, onChange: handleDataSourceChange }, useDataSources.map((item) => {
            const ds = DataSourceManager.getInstance().getDataSource(item.dataSourceId);
            return (jsx("option", { key: item.dataSourceId, value: item.dataSourceId }, ds === null || ds === void 0 ? void 0 : ds.getLabel()));
        })),
        jsx("div", { className: 'mt-1 font-italic', css: css `color: var(--dark-800);` }, getI18nMessage('selectedRecords', { num: count })),
        (spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations.length) > 0 && (jsx("div", { css: marginStyle },
            jsx("div", { className: 'text-truncate mb-0' }, getI18nMessage('relationship')),
            jsx(Select, { "aria-label": getI18nMessage('relationship'), value: currentRelation, onChange: handleSpatialRelationChange }, spatialRelations.map((item) => {
                return (jsx("option", { key: item, value: item }, getLabelOfSpatialRelation(item)));
            })))),
        enableBuffer && (jsx("div", { role: 'group', "aria-label": getI18nMessage('bufferDistance'), css: marginStyle },
            jsx("div", { className: 'text-truncate' }, getI18nMessage('bufferDistance')),
            jsx("div", { className: 'd-flex mt-1' },
                jsx(BufferInput, { distance: bufferDistance, unit: bufferUnit, onBufferChange: onBufferChange })))),
        jsx(DataSourceComponent, { useDataSource: currentDataSource, onDataSourceInfoChange: handleDataSourceInfoChange })));
}
//# sourceMappingURL=geometry-from-ds.js.map