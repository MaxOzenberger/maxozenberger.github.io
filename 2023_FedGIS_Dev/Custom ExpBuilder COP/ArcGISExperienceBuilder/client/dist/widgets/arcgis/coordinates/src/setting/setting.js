/** @jsx jsx */
import { React, jsx, Immutable, defaultMessages as jimucoreMessages, urlUtils, moduleLoader } from 'jimu-core';
import { builderAppSync } from 'jimu-for-builder';
import { Button, defaultMessages as jimuiMessages, hooks, Icon, Label, NumericInput, Radio, Switch, Tooltip } from 'jimu-ui';
import { MapWidgetSelector, SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components';
import { DisplayOrderType, ElevationUnitType, WidgetStyleType } from '../config';
import defaultMessages from './translations/default';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import CloseOutlined from 'jimu-icons/svg/outlined/editor/close.svg';
import { SystemConfig } from './system-config';
import { Fragment } from 'react';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { getSettingStyle } from './style';
import { JimuMapViewComponent } from 'jimu-arcgis';
const { useState, useEffect, useRef } = React;
const coordinateSystemDefault = {
    id: '',
    name: '',
    wkid: '',
    displayUnit: '',
    elevationUnit: ElevationUnitType.metric,
    datumWkid: '',
    datumName: ''
};
const Setting = (props) => {
    var _a;
    const { id, theme, onSettingChange, config: propConfig, useMapWidgetIds } = props;
    const { coordinateSystem, showSeparators, coordinateDecimal, altitudeDecimal, displayOrder, widgetStyle, mapInfo, mapInfo2 } = propConfig;
    const sidePopperTrigger = useRef(null);
    // state
    const [showLayerPanel, setShowLayerPanel] = useState(false);
    const [popperFocusNode, setPopperFocusNode] = useState(null);
    const [mapView, setMapView] = useState(undefined);
    const [viewGroup, setViewGroup] = useState(undefined);
    const [modulesLoaded, setModulesLoaded] = useState(false);
    // translate
    const translate = hooks.useTranslate(defaultMessages, jimuiMessages, jimucoreMessages);
    const selectMapWidget = translate('selectMapWidget');
    const classicType = translate('classic');
    const modernType = translate('modern');
    const outputCoorSystem = translate('outputCoorSystem');
    const newCoordinateSystem = translate('newCoordinate');
    const remove = translate('remove');
    const configureCoordinateSystem = translate('configureCoordinate');
    const displayOptions = translate('displayOptions');
    const coordinateDecimalLabel = translate('coordinateDecimal');
    const altitudeDecimalLabel = translate('altitudeDecimal');
    const showSeparatorsLabel = translate('showSeparators');
    const displayOrderLabel = translate('displayOrder');
    const loLaMode = translate('loLaMode');
    const laLoMode = translate('laLoMode');
    const selectMapTips = translate('selectMapTips');
    const widgetStyleLabel = translate('style');
    // global variabl
    const panelIndex = useRef(0);
    const wkidUtilsRef = useRef(null);
    useEffect(() => {
        const useMap = (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) > 0;
        if (useMap && !modulesLoaded) {
            moduleLoader.loadModule('jimu-core/wkid').then(module => {
                wkidUtilsRef.current = module;
                setModulesLoaded(true);
            });
        }
        // eslint-disable-next-line
    }, [useMapWidgetIds]);
    useEffect(() => {
        if (useMapWidgetIds && modulesLoaded)
            viewGroupSetMapInfo(viewGroup);
        // eslint-disable-next-line
    }, [modulesLoaded, viewGroup, useMapWidgetIds]);
    const viewGroupSetMapInfo = (viewGroup) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (!viewGroup)
            return;
        const viewsKeys = Object.keys(viewGroup.jimuMapViews);
        if (viewsKeys.length > 0) {
            const { getSRLabel, getCSUnit } = wkidUtilsRef.current;
            const view1 = (_b = (_a = viewGroup.jimuMapViews) === null || _a === void 0 ? void 0 : _a[viewsKeys[0]]) === null || _b === void 0 ? void 0 : _b.view;
            const view2 = (_d = (_c = viewGroup.jimuMapViews) === null || _c === void 0 ? void 0 : _c[viewsKeys[1]]) === null || _d === void 0 ? void 0 : _d.view;
            const map1Wkid = (_e = view1 === null || view1 === void 0 ? void 0 : view1.spatialReference) === null || _e === void 0 ? void 0 : _e.wkid;
            const map2Wkid = (_f = view2 === null || view2 === void 0 ? void 0 : view2.spatialReference) === null || _f === void 0 ? void 0 : _f.wkid;
            const mapId = (_h = (_g = view1 === null || view1 === void 0 ? void 0 : view1.map) === null || _g === void 0 ? void 0 : _g.portalItem) === null || _h === void 0 ? void 0 : _h.id;
            const mapId2 = (_k = (_j = view2 === null || view2 === void 0 ? void 0 : view2.map) === null || _j === void 0 ? void 0 : _j.portalItem) === null || _k === void 0 ? void 0 : _k.id;
            if (mapId === (mapInfo === null || mapInfo === void 0 ? void 0 : mapInfo.id) && mapId2 === (mapInfo2 === null || mapInfo2 === void 0 ? void 0 : mapInfo2.id))
                return;
            const mapTitle = (_m = (_l = view1 === null || view1 === void 0 ? void 0 : view1.map) === null || _l === void 0 ? void 0 : _l.portalItem) === null || _m === void 0 ? void 0 : _m.title;
            const mapTitle2 = (_p = (_o = view2 === null || view2 === void 0 ? void 0 : view2.map) === null || _o === void 0 ? void 0 : _o.portalItem) === null || _p === void 0 ? void 0 : _p.title;
            onMultiSettingChange({
                mapInfo: { id: mapId, title: mapTitle, wkid: map1Wkid, label: getSRLabel(map1Wkid), csUnit: getCSUnit(map1Wkid) },
                mapInfo2: { id: mapId2, title: mapTitle2, wkid: map2Wkid, label: getSRLabel(map2Wkid), csUnit: getCSUnit(map2Wkid) }
            });
        }
    };
    const onMultiSettingChange = (updateOptions) => {
        const currentSystem = coordinateSystem[panelIndex.current];
        if (currentSystem) {
            const newConfig = propConfig.set('mapInfo', updateOptions.mapInfo).set('mapInfo2', updateOptions.mapInfo2);
            const config = { id, config: newConfig };
            onSettingChange(config);
        }
    };
    const onMapWidgetSelected = (useMapWidgetIds) => {
        onSettingChange({ id, useMapWidgetIds });
    };
    const onCloseLayerPanel = () => {
        setShowLayerPanel(false);
        panelIndex.current = 0;
    };
    const setSidePopperAnchor = (index, newAdded = false) => {
        let node;
        if (newAdded) {
            node = sidePopperTrigger.current.getElementsByClassName('add-table-btn')[0];
        }
        else {
            node = sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index];
        }
        setPopperFocusNode(node);
    };
    const onShowLayerPanel = (index, newAdded = false) => {
        setSidePopperAnchor(index, newAdded);
        if (index === panelIndex.current) {
            setShowLayerPanel(!showLayerPanel);
        }
        else {
            setShowLayerPanel(true);
            panelIndex.current = index;
        }
    };
    const onWkidChangeSave = (newWkid, crs) => {
        const itemsLength = coordinateSystem.length;
        if (itemsLength === panelIndex.current) {
            addNewSystem(newWkid, crs);
        }
    };
    const getArrayMaxId = () => {
        const numbers = coordinateSystem.map(systemConfig => {
            var _a;
            return (_a = systemConfig.id) === null || _a === void 0 ? void 0 : _a.split('-').reverse()[0];
        });
        return numbers.length > 0 ? Math.max.apply(null, numbers) : 0;
    };
    const getNewConfigId = () => {
        const index = coordinateSystem.length > 0
            ? getArrayMaxId()
            : 0;
        return `system-${index + 1}`;
    };
    const addNewSystem = (newWkid, crs, elevationUnit) => {
        var _a;
        const newConfigId = getNewConfigId();
        const systemItem = {
            id: newConfigId,
            name: (_a = crs === null || crs === void 0 ? void 0 : crs.name) !== null && _a !== void 0 ? _a : newConfigId,
            wkid: newWkid,
            crs,
            displayUnit: '',
            elevationUnit: ElevationUnitType.metric,
            datumWkid: '',
            datumName: ''
        };
        const currentLayer = coordinateSystem[panelIndex.current];
        let systemItems;
        if (currentLayer) {
            // update config, reset other opts for current config
            const _conf = coordinateSystem.asMutable({ deep: true });
            _conf.splice(panelIndex.current, 1, systemItem);
            systemItems = Immutable(_conf);
        }
        else {
            // add new config
            systemItems = coordinateSystem.concat([
                Immutable(systemItem)
            ]);
        }
        onPropertyChange('coordinateSystem', systemItems);
    };
    const removeSystem = (index) => {
        if (panelIndex.current === index) {
            onCloseLayerPanel();
        }
        // del current filter item
        const _system = propConfig.coordinateSystem.asMutable({ deep: true });
        _system.splice(index, 1);
        onPropertyChange('coordinateSystem', _system);
        if (panelIndex.current > index) {
            panelIndex.current--;
        }
        builderAppSync.publishChangeWidgetStatePropToApp({
            widgetId: id,
            propKey: 'removeLayerFlag',
            value: true
        });
    };
    const onItemUpdated = (parentItemJson, currentIndex) => {
        const newSystemConfigs = parentItemJson.map(item => {
            return item.itemStateDetailContent;
        });
        onShowLayerPanel(currentIndex);
        onPropertyChange('coordinateSystem', newSystemConfigs);
    };
    const handleCoordinateDecimal = (valueInt) => {
        onPropertyChange('coordinateDecimal', valueInt);
    };
    const handleAltitudeDecimal = (valueInt) => {
        onPropertyChange('altitudeDecimal', valueInt);
    };
    const onPropertyChange = (name, value) => {
        if (value === propConfig[name])
            return;
        const newConfig = propConfig.set(name, value);
        const newProps = { id, config: newConfig };
        onSettingChange(newProps);
    };
    const multiOptionsChangeSave = (updateOptions) => {
        const currentSystem = coordinateSystem[panelIndex.current];
        if (currentSystem) {
            const newConfig = propConfig.setIn(['coordinateSystem', panelIndex.current.toString()], Object.assign(Object.assign({}, currentSystem), updateOptions));
            const config = { id, config: newConfig };
            onSettingChange(config);
        }
    };
    const switchWidgetType = (type) => {
        if (type !== widgetStyle) {
            onPropertyChange('widgetStyle', type);
        }
    };
    const itemsLength = coordinateSystem.length;
    const useMap = (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) > 0;
    const advancedActionMap = {
        isItemFocused: (actionData, refComponent) => {
            const { itemJsons: [currentItemJson, parentArray] } = refComponent.props;
            return showLayerPanel && parentArray.indexOf(currentItemJson) === panelIndex.current;
        },
        overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
            return {
                name: TreeItemActionType.RenderOverrideItem,
                children: [{
                        name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                        children: [{
                                name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                children: [{
                                        name: TreeItemActionType.RenderOverrideItemBody,
                                        children: [{
                                                name: TreeItemActionType.RenderOverrideItemMainLine,
                                                children: [{
                                                        name: TreeItemActionType.RenderOverrideItemDragHandle
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemIcon,
                                                        autoCollapsed: true
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemTitle
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemCommands
                                                    }]
                                            }]
                                    }]
                            }]
                    }]
            };
        }
    };
    const onActiveViewChange = (jimuMapView) => {
        setMapView(jimuMapView);
    };
    const onViewGroupCreate = (viewGroup) => {
        setViewGroup(viewGroup);
    };
    return (jsx("div", { className: 'widget-setting-coordinates jimu-widget-setting', css: getSettingStyle(theme) },
        jsx(SettingSection, { title: selectMapWidget, role: 'group', "aria-label": selectMapWidget },
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: onMapWidgetSelected, useMapWidgetIds: useMapWidgetIds }))),
        !useMap &&
            jsx("div", { className: 'empty-placeholder w-100' },
                jsx("div", { className: 'empty-placeholder-inner' },
                    jsx("div", { className: 'empty-placeholder-icon' },
                        jsx(ClickOutlined, { size: 48 })),
                    jsx("div", { className: 'empty-placeholder-text', id: 'coordinates-blank-msg' }, selectMapTips))),
        useMap &&
            jsx(Fragment, null,
                jsx(SettingSection, { className: 'arrange-style-container', title: widgetStyleLabel, role: 'group', "aria-label": widgetStyleLabel },
                    jsx(SettingRow, { className: 'arrange_container' },
                        jsx(Tooltip, { title: classicType, placement: 'bottom' },
                            jsx(Button, { onClick: () => switchWidgetType(WidgetStyleType.classic), icon: true, size: 'sm', type: 'tertiary', active: widgetStyle === WidgetStyleType.classic },
                                jsx(Icon, { autoFlip: true, width: 109, height: 70, icon: require('./assets/style-coordinate-classic.svg') }))),
                        jsx(Tooltip, { title: modernType, placement: 'bottom' },
                            jsx(Button, { onClick: () => switchWidgetType(WidgetStyleType.modern), className: 'ml-2', icon: true, size: 'sm', type: 'tertiary', active: widgetStyle === WidgetStyleType.modern },
                                jsx(Icon, { autoFlip: true, width: 109, height: 70, icon: require('./assets/style-coordinate-modern.svg') }))))),
                jsx(SettingSection, { title: outputCoorSystem, role: 'group', "aria-label": outputCoorSystem },
                    jsx("div", { ref: sidePopperTrigger },
                        jsx(SettingRow, null,
                            jsx(Button, { className: 'w-100 text-dark add-table-btn', type: 'primary', onClick: () => {
                                    onShowLayerPanel(itemsLength, true);
                                }, title: newCoordinateSystem },
                                jsx("div", { className: 'w-100 px-2 text-truncate' }, newCoordinateSystem))),
                        jsx(SettingRow, null,
                            jsx("div", { className: 'setting-ui-unit-list w-100' },
                                !!itemsLength &&
                                    jsx(List, Object.assign({ size: 'sm', className: 'setting-ui-unit-list-exsiting', itemsJson: Array.from(coordinateSystem).map((item, index) => ({
                                            itemStateDetailContent: item,
                                            itemKey: `${index}`,
                                            itemStateTitle: item.name,
                                            itemStateCommands: [
                                                {
                                                    label: remove,
                                                    iconProps: () => ({ icon: CloseOutlined, size: 12 }),
                                                    action: () => {
                                                        removeSystem(index);
                                                    }
                                                }
                                            ]
                                        })), dndEnabled: true, onUpdateItem: (actionData, refComponent) => {
                                            const { itemJsons } = refComponent.props;
                                            const [currentItemJson, parentItemJson] = itemJsons;
                                            onItemUpdated(parentItemJson, +currentItemJson.itemKey);
                                        }, onClickItemBody: (actionData, refComponent) => {
                                            const { itemJsons: [currentItemJson] } = refComponent.props;
                                            onShowLayerPanel(+currentItemJson.itemKey);
                                        } }, advancedActionMap)),
                                itemsLength === panelIndex.current && showLayerPanel &&
                                    jsx(List, Object.assign({ size: 'sm', className: 'setting-ui-unit-list-new', itemsJson: [{
                                                name: '......'
                                            }].map((item, x) => ({
                                            itemStateDetailContent: item,
                                            itemKey: `${panelIndex.current}`,
                                            itemStateTitle: item.name,
                                            itemStateCommands: []
                                        })), dndEnabled: false, renderOverrideItemDetailToggle: () => '' }, advancedActionMap, { isItemFocused: () => true })))))),
                jsx(SettingSection, { title: displayOptions, role: 'group', "aria-label": displayOptions },
                    jsx(SettingRow, { flow: 'wrap', label: coordinateDecimalLabel },
                        jsx(NumericInput, { size: 'sm', value: coordinateDecimal, min: 0, max: 10, onChange: handleCoordinateDecimal, "aria-label": coordinateDecimalLabel, className: 'w-100' })),
                    jsx(SettingRow, { flow: 'wrap', label: altitudeDecimalLabel },
                        jsx(NumericInput, { size: 'sm', value: altitudeDecimal, min: 0, max: 10, onChange: handleAltitudeDecimal, "aria-label": altitudeDecimalLabel, className: 'w-100' })),
                    jsx(SettingRow, { label: showSeparatorsLabel },
                        jsx(Switch, { className: 'can-x-switch', checked: showSeparators, "data-key": 'showSeparators', onChange: evt => {
                                onPropertyChange('showSeparators', evt.target.checked);
                            }, "aria-label": showSeparatorsLabel })),
                    jsx(SettingRow, { flow: 'wrap', label: displayOrderLabel },
                        jsx("div", { role: 'radiogroup', className: 'mb-3' },
                            jsx(Label, { className: 'd-flex align-items-center' },
                                jsx(Radio, { style: { cursor: 'pointer' }, name: 'displayOrderType', className: 'mr-2', checked: displayOrder === DisplayOrderType.xy, onChange: () => onPropertyChange('displayOrder', DisplayOrderType.xy) }),
                                loLaMode),
                            jsx(Label, { className: 'd-flex align-items-center' },
                                jsx(Radio, { style: { cursor: 'pointer' }, name: 'displayOrderType', className: 'mr-2', checked: displayOrder === DisplayOrderType.yx, onChange: () => onPropertyChange('displayOrder', DisplayOrderType.yx) }),
                                laLoMode))))),
        jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0], onActiveViewChange: onActiveViewChange, onViewGroupCreate: onViewGroupCreate }),
        jsx(SidePopper, { position: 'right', title: configureCoordinateSystem, isOpen: showLayerPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, toggle: onCloseLayerPanel, trigger: sidePopperTrigger === null || sidePopperTrigger === void 0 ? void 0 : sidePopperTrigger.current, backToFocusNode: popperFocusNode },
            jsx(SystemConfig, Object.assign({}, ((_a = coordinateSystem.asMutable({ deep: true })[panelIndex.current]) !== null && _a !== void 0 ? _a : coordinateSystemDefault), { useMapWidgetIds: useMapWidgetIds, theme: theme, multiOptionsChange: multiOptionsChangeSave, onWkidChangeSave: onWkidChangeSave, onClose: onCloseLayerPanel, mapView: mapView, viewGroup: viewGroup, wkidUtils: wkidUtilsRef.current, mapInfo: mapInfo, mapInfo2: mapInfo2 })))));
};
export default Setting;
//# sourceMappingURL=setting.js.map