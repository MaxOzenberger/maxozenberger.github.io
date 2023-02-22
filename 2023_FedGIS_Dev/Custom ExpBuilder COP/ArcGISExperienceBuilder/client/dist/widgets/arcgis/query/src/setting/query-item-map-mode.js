/** @jsx jsx */
import { React, jsx, css, ReactRedux, classNames } from 'jimu-core';
import { hooks, Switch, Button, Checkbox } from 'jimu-ui';
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline';
import { PolygonOutlined } from 'jimu-icons/outlined/gis/polygon';
import { RectangleOutlined } from 'jimu-icons/outlined/gis/rectangle';
import { CircleOutlined } from 'jimu-icons/outlined/gis/circle';
import { SettingRow, SettingSection, MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { CreateToolType, SpatialFilterType } from '../config';
import { toggleItemInArray } from '../common/utils';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { BufferSetting } from './buffer';
import { PinEsriOutlined } from 'jimu-icons/outlined/gis/pin-esri';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
export const sketchToolInfos = [
    { type: CreateToolType.Point, drawToolName: 'point', icon: jsx(PinEsriOutlined, null) },
    { type: CreateToolType.Polyline, drawToolName: 'polyline', icon: jsx(PolylineOutlined, null) },
    { type: CreateToolType.Polygon, drawToolName: 'polygon', icon: jsx(PolygonOutlined, null) },
    { type: CreateToolType.Rectangle, drawToolName: 'rectangle', icon: jsx(RectangleOutlined, null) },
    { type: CreateToolType.Circle, drawToolName: 'circle', icon: jsx(CircleOutlined, null) }
];
const headerStyle = css `
  border-top: 1px solid var(--light-800);
  .title {
    font-weight: 500;
    font-size: 14px;
    color: var(--dark-600);
  }
`;
export function QueryItemSettingMapMode(props) {
    const { index, handleStageChange, queryItem, onQueryItemChanged, visible } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    const backBtnRef = React.useRef();
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const mapExists = ReactRedux.useSelector((state) => {
        var _a;
        if (((_a = queryItem.spatialMapWidgetIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const mapWidgetId = queryItem.spatialMapWidgetIds[0];
            return state.appStateInBuilder.appConfig.widgets[mapWidgetId] != null;
        }
        return false;
    });
    const updateProperty = React.useCallback((prop, value, dsUpdateRequired = false) => {
        const newItem = queryItem.set(prop, value);
        onQueryItemChanged(index, newItem, dsUpdateRequired);
    }, [onQueryItemChanged, queryItem, index]);
    React.useEffect(() => {
        if (visible) {
            backBtnRef.current.focus();
        }
    }, [visible]);
    const toggleSpatialFilterType = React.useCallback((type) => {
        const types = toggleItemInArray(type, queryItem.spatialFilterTypes ? [...queryItem.spatialFilterTypes] : []);
        updateProperty('spatialFilterTypes', types);
    }, [updateProperty, queryItem]);
    const handleUseMapWidgetChange = React.useCallback((useMapWidgetIds) => {
        let newItem = queryItem.set('spatialMapWidgetIds', useMapWidgetIds);
        if (!useMapWidgetIds || useMapWidgetIds.length === 0) {
            newItem = newItem.set('spatialFilterTypes', []);
        }
        onQueryItemChanged(index, newItem, false);
    }, [onQueryItemChanged, index, queryItem]);
    if (!queryItem) {
        return null;
    }
    return (jsx("div", { className: classNames({ 'd-none': !visible }) },
        jsx("div", { className: 'd-flex align-items-center px-3 pt-3', css: headerStyle },
            jsx(Button, { ref: backBtnRef, "aria-label": getI18nMessage('back'), type: 'tertiary', size: 'sm', icon: true, className: 'p-0 action-btn', onClick: () => handleStageChange(0) },
                jsx(ArrowLeftOutlined, { autoFlip: true })),
            jsx("div", { className: 'title flex-grow-1 text-truncate ml-2', title: getI18nMessage('featureFromMap') }, getI18nMessage('featureFromMap'))),
        jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('chooseAMapWidget'), title: getI18nMessage('chooseAMapWidget'), className: 'text-truncate' },
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: handleUseMapWidgetChange, useMapWidgetIds: currentItem.spatialMapWidgetIds }))),
        mapExists && (jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('geometryTypes'), title: getI18nMessage('geometryTypes') },
            jsx(SettingRow, null,
                jsx("label", null,
                    jsx(Checkbox, { className: 'mr-2', checked: currentItem.spatialFilterTypes.includes(SpatialFilterType.CurrentMapExtent), onChange: () => toggleSpatialFilterType(SpatialFilterType.CurrentMapExtent) }),
                    jsx("span", null, getI18nMessage('spatialFilterType_CurrentMapExtent')))),
            jsx(SettingRow, null,
                jsx("label", null,
                    jsx(Checkbox, { className: 'mr-2', checked: currentItem.spatialFilterTypes.includes(SpatialFilterType.InteractiveDrawMode), onChange: () => toggleSpatialFilterType(SpatialFilterType.InteractiveDrawMode) }),
                    jsx("span", null, getI18nMessage('spatialFilterType_InteractiveDrawMode')))),
            currentItem.spatialFilterTypes.includes(SpatialFilterType.InteractiveDrawMode) && (jsx(React.Fragment, null,
                jsx(SettingRow, { role: 'group', "aria-label": getI18nMessage('chooseSelectionTools'), flow: 'wrap', className: 'd-block', label: getI18nMessage('chooseSelectionTools') }, sketchToolInfos.map((value) => {
                    const { type, icon, drawToolName } = value;
                    const currentSpatialInteractiveCreateToolTypes = currentItem.spatialInteractiveCreateToolTypes;
                    const selected = currentSpatialInteractiveCreateToolTypes.includes(type);
                    return (jsx("div", { key: type, className: 'd-flex mt-2' },
                        icon,
                        jsx("label", { className: 'ml-2' }, getI18nMessage(`sketchTool_${drawToolName}`)),
                        jsx(Switch, { "aria-label": getI18nMessage(`sketchTool_${drawToolName}`), className: 'ml-auto', checked: selected, onChange: () => {
                                const types = toggleItemInArray(type, [...currentSpatialInteractiveCreateToolTypes]);
                                updateProperty('spatialInteractiveCreateToolTypes', types);
                            } })));
                })),
                jsx(BufferSetting, { enabled: currentItem.spatialInteractiveEnableBuffer, distance: currentItem.spatialInteractiveBufferDistance, unit: currentItem.spatialInteractiveBufferUnit, onEnableChanged: (enabled) => updateProperty('spatialInteractiveEnableBuffer', enabled), onDistanceChanged: (distance) => updateProperty('spatialInteractiveBufferDistance', distance), onUnitChanged: (unit) => updateProperty('spatialInteractiveBufferUnit', unit) })))))));
}
//# sourceMappingURL=query-item-map-mode.js.map