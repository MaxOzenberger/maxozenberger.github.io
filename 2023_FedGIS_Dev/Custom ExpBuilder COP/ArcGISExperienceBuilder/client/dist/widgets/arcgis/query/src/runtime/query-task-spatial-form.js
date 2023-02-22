/** @jsx jsx */
import { React, ReactRedux, jsx, css, classNames } from 'jimu-core';
import { hooks, Select, Tooltip, Button } from 'jimu-ui';
import { SpatialFilterType, UnitType } from '../config';
import defaultMessage from './translations/default';
import { GeometryFromDataSource } from './geometry-from-ds';
import { GeometryFromMap } from './geometry-from-map';
import { GeometryFromDraw } from './geometry-from-draw';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
export function QueryTaskSpatialForm(props) {
    var _a;
    const { label, desc, filterTypes, mapWidgetIds, onFilterChange, onRelationChange, onBufferChange, useDataSources, spatialRelations, dsEnableBuffer, dsBufferDistance, dsBufferUnit, drawEnableBuffer, drawBufferDistance, drawBufferUnit, createToolTypes } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    // used to store the selection of the data source in order to update the filter when option changes
    const selectedGeometriesRef = React.useRef(null);
    const mapExists = ReactRedux.useSelector((state) => {
        if ((mapWidgetIds === null || mapWidgetIds === void 0 ? void 0 : mapWidgetIds.length) > 0) {
            const mapWidgetId = mapWidgetIds[0];
            return state.appConfig.widgets[mapWidgetId] != null;
        }
        return false;
    });
    const canUseMapFilter = React.useMemo(() => {
        return mapExists && ((filterTypes === null || filterTypes === void 0 ? void 0 : filterTypes.includes(SpatialFilterType.CurrentMapExtent)) || (filterTypes === null || filterTypes === void 0 ? void 0 : filterTypes.includes(SpatialFilterType.InteractiveDrawMode)));
    }, [filterTypes, mapExists]);
    const supportedFilterTypes = React.useMemo(() => {
        const result = [];
        if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0) {
            result.push({ value: 'data', label: getI18nMessage('featureFromDs') });
        }
        if (canUseMapFilter && (filterTypes === null || filterTypes === void 0 ? void 0 : filterTypes.includes(SpatialFilterType.CurrentMapExtent))) {
            result.push({ value: 'map', label: getI18nMessage(`spatialFilterType_${SpatialFilterType.CurrentMapExtent}`) });
        }
        if (canUseMapFilter && (filterTypes === null || filterTypes === void 0 ? void 0 : filterTypes.includes(SpatialFilterType.InteractiveDrawMode))) {
            result.push({ value: 'draw', label: getI18nMessage(`spatialFilterType_${SpatialFilterType.InteractiveDrawMode}`) });
        }
        return result;
    }, [canUseMapFilter, useDataSources, getI18nMessage, filterTypes]);
    const [currentFilterType, setCurrentFilterType] = React.useState((_a = supportedFilterTypes === null || supportedFilterTypes === void 0 ? void 0 : supportedFilterTypes[0]) === null || _a === void 0 ? void 0 : _a.value);
    React.useEffect(() => {
        var _a;
        // in order to avoid invalid option being selected
        if (currentFilterType !== 'none' && !supportedFilterTypes.find((item) => item.value === currentFilterType)) {
            setCurrentFilterType((_a = supportedFilterTypes === null || supportedFilterTypes === void 0 ? void 0 : supportedFilterTypes[0]) === null || _a === void 0 ? void 0 : _a.value);
        }
    }, [currentFilterType, supportedFilterTypes]);
    React.useEffect(() => {
        // clear the relationship and buffer if filter type is not 'data'
        if (currentFilterType === 'map' || currentFilterType === 'draw' || currentFilterType === 'none') {
            onRelationChange(null);
            onBufferChange(0, UnitType.Meters);
            onFilterChange({ geometry: null });
        }
        // no need to update the filter if the data source has selection since it will be updated in the handleSelectionChange method
        if (currentFilterType === 'data' && selectedGeometriesRef.current == null) {
            onFilterChange({ geometry: null });
        }
    }, [currentFilterType, onRelationChange, onBufferChange, onFilterChange]);
    const handleFilterTypeChanged = React.useCallback((evt) => setCurrentFilterType(evt.target.value), []);
    const handleGeometrychange = React.useCallback((geometry, layer, graphic, clearAfterApply) => {
        onFilterChange({ geometry, graphic, layer, clearAfterApply });
    }, [onFilterChange]);
    const handleSelectionChange = React.useCallback((geometries) => {
        selectedGeometriesRef.current = geometries;
        onFilterChange({ geometry: geometries });
    }, [onFilterChange]);
    if (!((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0 || canUseMapFilter)) {
        return null;
    }
    return (jsx("div", { role: 'group', className: 'px-3', "aria-label": label },
        jsx("div", { className: classNames('form-title my-2 d-flex align-items-center', { 'd-none': !label && !desc }) },
            label && jsx("div", { className: 'mr-2' }, label),
            desc && (jsx(Tooltip, { placement: 'bottom', css: css `white-space: pre-line;`, title: desc },
                jsx(Button, { size: 'sm', icon: true, type: 'tertiary' },
                    jsx(InfoOutlined, { color: 'var(--primary)', size: 's' }))))),
        supportedFilterTypes.length > 0 && (jsx("div", null,
            jsx("div", null, getI18nMessage('chooseFilterType')),
            jsx(Select, { "aria-label": getI18nMessage('chooseFilterType'), css: css `height: 32px;`, value: currentFilterType, onChange: handleFilterTypeChanged },
                jsx("option", { key: '-', value: 'none' }, "-"),
                supportedFilterTypes.map(item => jsx("option", { key: item.value, value: item.value }, item.label))))),
        currentFilterType === 'data' && (jsx(GeometryFromDataSource, { enableBuffer: dsEnableBuffer, bufferDistance: dsBufferDistance, bufferUnit: dsBufferUnit, spatialRelations: spatialRelations, useDataSources: useDataSources, onSelectionChange: handleSelectionChange, onRelationChange: onRelationChange, onBufferChange: onBufferChange })),
        currentFilterType === 'map' && (jsx(GeometryFromMap, { mapWidgetIds: mapWidgetIds, createToolTypes: createToolTypes, onGeometryChange: handleGeometrychange })),
        currentFilterType === 'draw' && (jsx(GeometryFromDraw, { enableBuffer: drawEnableBuffer, bufferDistance: drawBufferDistance, bufferUnit: drawBufferUnit, mapWidgetIds: mapWidgetIds, createToolTypes: createToolTypes, onGeometryChange: handleGeometrychange, onBufferChange: onBufferChange }))));
}
//# sourceMappingURL=query-task-spatial-form.js.map