/** @jsx jsx */
import { React, jsx, css, classNames, Immutable, DataSourceManager, CONSTANTS, AllDataSourceTypes } from 'jimu-core';
import { hooks, Button, MultiSelect } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import defaultMessages from './translations/default';
import { SpatialRelation } from '../config';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { BufferSetting } from './buffer';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
const headerStyle = css `
  border-top: 1px solid var(--light-800);
  .title {
    font-weight: 500;
    font-size: 14px;
    color: var(--dark-600);
  }
`;
const dsTypes = Immutable([AllDataSourceTypes.FeatureLayer]);
const advancedActionMap = {
    overrideItemBlockInfo: () => {
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
                                                    name: TreeItemActionType.RenderOverrideItemTitle
                                                }]
                                        }]
                                }]
                        }]
                }]
        };
    }
};
function shouldHideDataSource(dsJson) {
    return dsJson.geometryType == null;
}
export function QueryItemSettingDataMode(props) {
    var _a, _b;
    const { index, widgetId, handleStageChange, queryItem, onQueryItemChanged, visible } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    const backBtnRef = React.useRef();
    const spatialRelationOptions = React.useMemo(() => {
        return Immutable(Object.entries(SpatialRelation).map(([key, value]) => ({
            value,
            label: getI18nMessage(`spatialRelation_${key}`)
        })));
    }, [getI18nMessage]);
    React.useEffect(() => {
        if (visible) {
            backBtnRef.current.focus();
        }
    }, [visible]);
    const updateProperty = (prop, value, dsUpdateRequired = false) => {
        const newItem = queryItem.set(prop, value);
        onQueryItemChanged(index, newItem, dsUpdateRequired);
    };
    const displaySelectedFields = React.useCallback(values => {
        return getI18nMessage('numSelected', {
            number: values.length
        });
    }, [getI18nMessage]);
    const handleSpatailRelationsChange = hooks.useEventCallback((evt, value, values) => {
        updateProperty('spatialRelations', values);
    });
    const handleDsChange = hooks.useEventCallback((useDataSources) => {
        const ds = useDataSources.map(u => {
            if (u.dataViewId !== CONSTANTS.SELECTION_DATA_VIEW_ID) {
                return Object.assign(Object.assign({}, u), { dataSourceId: DataSourceManager.getInstance().getDataSource(u.mainDataSourceId).getDataView(CONSTANTS.SELECTION_DATA_VIEW_ID).id, dataViewId: CONSTANTS.SELECTION_DATA_VIEW_ID });
            }
            return u;
        });
        updateProperty('spatialRelationUseDataSources', ds, true);
    });
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const dataSources = Immutable((_a = currentItem.spatialRelationUseDataSources) !== null && _a !== void 0 ? _a : []);
    const spatialRelations = Immutable((_b = currentItem.spatialRelations) === null || _b === void 0 ? void 0 : _b.filter(rel => Object.values(SpatialRelation).includes(rel)));
    if (!queryItem) {
        return null;
    }
    return (jsx("div", { className: classNames({ 'd-none': !visible }) },
        jsx("div", { className: 'd-flex align-items-center px-3 pt-3', css: headerStyle },
            jsx(Button, { ref: backBtnRef, "aria-label": getI18nMessage('back'), type: 'tertiary', size: 'sm', icon: true, className: 'p-0 action-btn', onClick: () => handleStageChange(0) },
                jsx(ArrowLeftOutlined, { autoFlip: true })),
            jsx("div", { className: 'title flex-grow-1 text-truncate ml-2', title: getI18nMessage('featureFromDs') }, getI18nMessage('featureFromDs'))),
        jsx("div", { css: css `height: calc(100% - 30px); overflow: auto;` },
            jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('selectionViewOnly') },
                jsx(SettingRow, { flow: 'wrap', truncateLabel: true, label: getI18nMessage('selectionViewOnly') },
                    jsx(DataSourceSelector, { widgetId: widgetId, buttonLabel: getI18nMessage('newFilterLayer'), disableRemove: () => false, disableDataView: true, mustUseDataSource: true, types: dsTypes, isMultiple: true, hideDs: shouldHideDataSource, isMultipleDataView: false, useDataSources: dataSources, onChange: handleDsChange }))),
            jsx(SettingSection, null,
                jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('chooseSpatialRelationshipRules') },
                    jsx(MultiSelect, { "aria-label": getI18nMessage('chooseSpatialRelationshipRules'), items: spatialRelationOptions, values: spatialRelations, fluid: true, onClickItem: handleSpatailRelationsChange, displayByValues: displaySelectedFields, size: 'sm' })),
                (spatialRelations === null || spatialRelations === void 0 ? void 0 : spatialRelations.length) > 0 && (jsx(SettingRow, null,
                    jsx(List, Object.assign({ className: 'selected-fields-list w-100', itemsJson: Array.from(spatialRelations).map((item, index) => {
                            const label = spatialRelationOptions.find(rel => rel.value === item).label;
                            return {
                                itemStateDetailContent: item,
                                itemKey: `${index}`,
                                itemStateTitle: label,
                                itemStateCommands: []
                            };
                        }), dndEnabled: true, onUpdateItem: (actionData, refComponent) => {
                            const { itemJsons } = refComponent.props;
                            const [, parentItemJson] = itemJsons;
                            const relations = parentItemJson.map(item => {
                                return item.itemStateDetailContent;
                            });
                            updateProperty('spatialRelations', relations);
                        }, isItemFocused: () => false }, advancedActionMap))))),
            jsx(SettingSection, null,
                jsx(BufferSetting, { enabled: currentItem.spatialRelationEnableBuffer, distance: currentItem.spatialRelationBufferDistance, unit: currentItem.spatialRelationBufferUnit, onEnableChanged: (enabled) => updateProperty('spatialRelationEnableBuffer', enabled), onDistanceChanged: (distance) => updateProperty('spatialRelationBufferDistance', distance), onUnitChanged: (unit) => updateProperty('spatialRelationBufferUnit', unit) })))));
}
//# sourceMappingURL=query-item-data-mode.js.map