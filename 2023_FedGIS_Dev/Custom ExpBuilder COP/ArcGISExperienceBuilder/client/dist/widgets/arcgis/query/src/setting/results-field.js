/** @jsx jsx */
import { React, jsx, Immutable, DataSourceManager } from 'jimu-core';
import { FieldSelector, dataComponentsUtils } from 'jimu-ui/advanced/data-source-selector';
import { withTheme } from 'jimu-theme';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
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
function _ResultsFieldSetting(props) {
    const { useDataSource, selectedFields, label, theme, onFieldsChanged } = props;
    const useDataSources = React.useMemo(() => Immutable([useDataSource]), [useDataSource]);
    const allFields = React.useMemo(() => {
        const selectedDs = DataSourceManager.getInstance().getDataSource(useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId);
        if (!selectedDs) {
            return [];
        }
        const allFieldsSchema = selectedDs === null || selectedDs === void 0 ? void 0 : selectedDs.getSchema();
        return (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema.fields) : [];
    }, [useDataSource]);
    const popupFields = React.useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        const selectedDs = DataSourceManager.getInstance().getDataSource(useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId);
        if (selectedDs) {
            const featureLayerDataSource = selectedDs;
            const popupContent = (_b = (_a = featureLayerDataSource.layer) === null || _a === void 0 ? void 0 : _a.popupTemplate) === null || _b === void 0 ? void 0 : _b.content;
            let fieldInfos = (_e = (_d = (_c = featureLayerDataSource.layer) === null || _c === void 0 ? void 0 : _c.popupTemplate) === null || _d === void 0 ? void 0 : _d.fieldInfos) !== null && _e !== void 0 ? _e : [];
            if ((popupContent === null || popupContent === void 0 ? void 0 : popupContent.length) > 0 && popupContent[0].type === 'fields') {
                fieldInfos = (_f = popupContent[0].fieldInfos) !== null && _f !== void 0 ? _f : [];
            }
            const popupFieldNames = fieldInfos.map(ele => ele.fieldName);
            const fields = allFields.filter(item => popupFieldNames === null || popupFieldNames === void 0 ? void 0 : popupFieldNames.includes(item.name));
            return fields;
        }
        return [];
    }, [useDataSource, allFields]);
    const fieldsSchema = React.useMemo(() => {
        if (selectedFields != null) {
            return selectedFields.map(name => {
                return allFields.find(item => item.jimuName === name);
            });
        }
        return popupFields;
    }, [popupFields, allFields, selectedFields]);
    const handleFieldsChange = (allSelectedFields) => {
        if (allSelectedFields) {
            const fieldNames = allSelectedFields.filter(item => item).map(item => item.jimuName);
            // 1. remove the field that is not in allSelectedFields
            const filterSelected = selectedFields != null ? selectedFields.filter(item => fieldNames.includes(item)) : fieldNames;
            // 2. remove the field that is already in selectedFields
            const extraFields = selectedFields != null ? fieldNames.filter(item => !selectedFields.includes(item)) : [];
            onFieldsChanged(filterSelected.concat(extraFields));
        }
    };
    const currentFields = selectedFields != null ? selectedFields : popupFields.map(field => field.jimuName);
    return (jsx(React.Fragment, null,
        jsx(SettingRow, { flow: 'wrap', label: label },
            jsx(FieldSelector, { useDataSources: useDataSources, onChange: handleFieldsChange, selectedFields: Immutable(currentFields), isMultiple: true, isSearchInputHidden: false, isDataSourceDropDownHidden: true, useDropdown: true, useMultiDropdownBottomTools: true })),
        currentFields.length > 1 && (jsx(SettingRow, null,
            jsx(List, Object.assign({ className: 'selected-fields-list w-100', itemsJson: Array.from(fieldsSchema).map((item, index) => ({
                    itemStateDetailContent: item,
                    itemKey: `${index}`,
                    itemStateIcon: dataComponentsUtils.getIconFromFieldType(item.type, theme),
                    itemStateTitle: item.alias || item.jimuName || item.name,
                    itemStateCommands: []
                })), dndEnabled: true, onUpdateItem: (actionData, refComponent) => {
                    const { itemJsons } = refComponent.props;
                    const [, parentItemJson] = itemJsons;
                    const newTableFields = parentItemJson.map(item => {
                        return item.itemStateDetailContent;
                    });
                    onFieldsChanged(newTableFields.map(item => item.jimuName));
                }, isItemFocused: () => false }, advancedActionMap))))));
}
export const ResultsFieldSetting = withTheme(_ResultsFieldSetting);
//# sourceMappingURL=results-field.js.map