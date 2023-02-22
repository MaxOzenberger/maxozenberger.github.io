/** @jsx jsx */
import { React, jsx, Immutable, polished, css, DataSourceManager, DataSourceComponent, SupportedLayerServiceTypes, utils, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput, defaultMessages as jimuUIMessages, Checkbox, PanelHeader, Button, Switch, TextArea, Label, Popper, Select } from 'jimu-ui';
import { DataSourceSelector, FieldSelector, dataComponentsUtils } from 'jimu-ui/advanced/data-source-selector';
import { EditModeType, LayerHonorModeType } from '../config';
import defaultMessages from './translations/default';
import { Tree, TreeCollapseStyle, TreeItemActionType, TreeType } from 'jimu-ui/basic/list-tree';
import { AddFolderOutlined } from 'jimu-icons/outlined/editor/add-folder';
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { INVISIBLE_FIELD } from './setting-const';
const TREE_ROOT_ITEM = 'root item for tree data entry';
export default class LayerConfig extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
        this.nameChange = event => {
            const value = event.target.value;
            this.setState({ itemLabel: value });
        };
        this.nameAccept = (value) => {
            value = value === null || value === void 0 ? void 0 : value.trim();
            value = value === '' ? this.props.name : value;
            if (value !== this.state.itemLabel) {
                this.setState({ itemLabel: value });
            }
            this.props.optionChange('name', value);
        };
        this.getUncheckState = (groupedFields = []) => {
            return groupedFields.some(item => !item.editAuthority && item.editable);
        };
        this.getIndeterminate = (groupedFields = []) => {
            const hasCheck = groupedFields.some(item => item.editAuthority && item.editable);
            const hasUncheck = groupedFields.some(item => !item.editAuthority && item.editable);
            return hasCheck && hasUncheck;
        };
        this.onLayerModeChange = (value) => {
            this.props.optionChange('layerHonorMode', value);
        };
        this.handleSwitchChange = (evt, name) => {
            const target = evt.currentTarget;
            if (!target)
                return;
            this.props.optionChange(name, target.checked);
        };
        this.findEditingIndex = (targetId) => {
            const { groupedFields: orgGroupedFields } = this.props;
            let editingIndex;
            orgGroupedFields.forEach((field, index) => {
                if (field.jimuName === targetId) {
                    editingIndex = [index];
                }
                else if (field === null || field === void 0 ? void 0 : field.children) {
                    const subIndex = field.children.findIndex(item => item.jimuName === targetId);
                    if (subIndex > -1) {
                        editingIndex = [index, subIndex];
                    }
                }
            });
            return editingIndex;
        };
        this.handleTreeBoxChange = evt => {
            const target = evt.currentTarget;
            if (!target)
                return;
            const { groupedFields: orgGroupedFields } = this.props;
            const editingIndex = this.findEditingIndex(target.id);
            // edit editAuthority
            if (editingIndex.length === 2) {
                const [index, subIndex] = editingIndex;
                orgGroupedFields[index][subIndex].editAuthority = target.checked;
            }
            else if (editingIndex.length === 1) {
                const [index] = editingIndex;
                orgGroupedFields[index].editAuthority = target.checked;
            }
            this.props.optionChange('groupedFields', orgGroupedFields);
            const newItemJson = this.constructTreeItem(orgGroupedFields);
            this.setState({ rootItemJson: newItemJson });
        };
        this.handleTreeDescChange = (id, value) => {
            const { groupedFields: orgGroupedFields } = this.props;
            const editingIndex = this.findEditingIndex(id);
            // edit description
            if (editingIndex.length === 2) {
                const [index, subIndex] = editingIndex;
                orgGroupedFields[index].children[subIndex].subDescription = value;
            }
            else if (editingIndex.length === 1) {
                const [index] = editingIndex;
                orgGroupedFields[index].subDescription = value;
            }
            this.props.optionChange('groupedFields', orgGroupedFields);
            const newItemJson = this.constructTreeItem(orgGroupedFields);
            this.setState({ rootItemJson: newItemJson, isOpenDetailPopper: false });
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.minusArray = (array1, array2, key) => {
            const keyField = key || 'jimuName';
            const lengthFlag = array1.length > array2.length;
            const arr1 = lengthFlag ? array1 : array2;
            const arr2 = lengthFlag ? array2 : array1;
            return arr1.filter(item => {
                const hasField = arr2.some(ele => {
                    return (ele === null || ele === void 0 ? void 0 : ele[keyField]) === (item === null || item === void 0 ? void 0 : item[keyField]);
                });
                return !hasField;
            });
        };
        this.onFieldChange = (allSelectedFields) => {
            if (!allSelectedFields)
                return;
            const { dataSource } = this.state;
            const { showFields: orgShowFields, groupedFields: orgGroupedFields } = this.props;
            const filteredFields = allSelectedFields.filter(item => item);
            if (allSelectedFields.length === 0) { // uncheck all
                orgGroupedFields.length = 0;
            }
            else {
                // find the changed field
                const changed = this.minusArray(allSelectedFields, orgShowFields);
                const changedField = changed === null || changed === void 0 ? void 0 : changed[0];
                // find the changed index in orgGroupedFields
                let editingIndex;
                orgGroupedFields.forEach((field, index) => {
                    if (field === null || field === void 0 ? void 0 : field.children) {
                        const subIndex = field.children.findIndex(item => item.jimuName === (changedField === null || changedField === void 0 ? void 0 : changedField.jimuName));
                        if (subIndex > -1) {
                            editingIndex = [index, subIndex];
                        }
                    }
                    else {
                        if (field.jimuName === (changedField === null || changedField === void 0 ? void 0 : changedField.jimuName)) {
                            editingIndex = [index];
                        }
                    }
                });
                if (editingIndex) { // uncheck
                    if (editingIndex.length === 2) {
                        const [index, subIndex] = editingIndex;
                        orgGroupedFields[index].children.splice(subIndex, 1);
                    }
                    else if (editingIndex.length === 1) {
                        const [index] = editingIndex;
                        orgGroupedFields.splice(index, 1);
                    }
                }
                else { // check
                    const layerDefinition = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLayerDefinition();
                    const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
                    const orgField = fieldsConfig.find(field => field.name === changedField.jimuName);
                    const defaultAuthority = orgField === null || orgField === void 0 ? void 0 : orgField.editable;
                    orgGroupedFields.push(Object.assign(Object.assign({}, changedField), { editAuthority: defaultAuthority, subDescription: (changedField === null || changedField === void 0 ? void 0 : changedField.description) || '', editable: defaultAuthority }));
                }
            }
            this.props.multiOptionsChange({
                showFields: filteredFields,
                groupedFields: orgGroupedFields
            });
            const newItemJson = this.constructTreeItem(orgGroupedFields);
            const hasUncheck = this.getUncheckState(orgGroupedFields);
            const indeterminate = this.getIndeterminate(orgGroupedFields);
            this.setState({ rootItemJson: newItemJson, hasUncheck, indeterminate });
        };
        this.onDataSourceCreated = (dataSource) => {
            this.setState({ dataSource }, () => {
                const { groupedFields } = this.props;
                const newItemJson = this.constructTreeItem(groupedFields);
                this.setState({ rootItemJson: newItemJson });
            });
        };
        this.getFieldsFromDatasource = () => {
            const { useDataSource } = this.props;
            const selectedDs = DataSourceManager.getInstance().getDataSource(useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId);
            const allFieldsSchema = selectedDs === null || selectedDs === void 0 ? void 0 : selectedDs.getSchema();
            const allFields = (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) : [];
            return allFields;
        };
        this.checkFieldsExist = (allFields, tableField) => {
            let exist = false;
            for (const item of allFields) {
                if (item.jimuName === tableField.jimuName) {
                    exist = true;
                    break;
                }
            }
            return exist;
        };
        this.getSelectorFields = (showFields) => {
            const selectorFields = [];
            if (showFields && showFields.length > 0) {
                showFields.forEach(item => {
                    selectorFields.push(item.jimuName);
                });
            }
            return selectorFields;
        };
        this.handleTreeBoxAll = (hasUncheck) => {
            const { groupedFields } = this.props;
            const newGroupedFields = groupedFields.map(item => {
                if (item === null || item === void 0 ? void 0 : item.children) {
                    return Object.assign(Object.assign({}, item), { editAuthority: hasUncheck, children: item.children.map(child => {
                            return Object.assign(Object.assign({}, child), (child.editable ? { editAuthority: hasUncheck } : {}));
                        }) });
                }
                return Object.assign(Object.assign({}, item), (item.editable ? { editAuthority: hasUncheck } : {}));
            });
            this.props.optionChange('groupedFields', newGroupedFields);
            const newItemJson = this.constructTreeItem(newGroupedFields);
            this.setState({ rootItemJson: newItemJson, hasUncheck: !hasUncheck, indeterminate: false });
        };
        this.addGroupForFields = () => {
            this.setState({ groupUpdating: true }, () => {
                setTimeout(() => {
                    this.setState({ groupUpdating: false });
                }, 1000);
            });
            const { groupedFields: orgGroupedFields } = this.props;
            const newGroupId = this.getGroupMaxId(orgGroupedFields) + 1;
            const newGroupField = {
                jimuName: `${this.formatMessage('group')}-${newGroupId}`,
                name: `${this.formatMessage('group')}-${newGroupId}`,
                alias: `${this.formatMessage('group')}-${newGroupId}`,
                subDescription: '',
                editAuthority: false,
                editable: true,
                children: [],
                groupKey: newGroupId
            };
            orgGroupedFields.unshift(newGroupField);
            this.props.optionChange('groupedFields', orgGroupedFields);
            const newItemJson = this.constructTreeItem(orgGroupedFields);
            this.setState({ rootItemJson: newItemJson });
        };
        this.removeGroup = (jimuName) => {
            var _a;
            const { groupedFields: orgGroupedFields } = this.props;
            const activeIndex = orgGroupedFields.findIndex(item => item.jimuName === jimuName);
            orgGroupedFields.splice(activeIndex, 1, ...(_a = orgGroupedFields[activeIndex]) === null || _a === void 0 ? void 0 : _a.children);
            this.props.optionChange('groupedFields', orgGroupedFields);
            const newItemJson = this.constructTreeItem(orgGroupedFields);
            this.setState({ rootItemJson: newItemJson });
        };
        this.constructTreeItem = (groupedFields = []) => {
            const { theme } = this.props;
            const allFields = this.getFieldsFromDatasource();
            const showFieldsToTreeItem = (groupedFields) => {
                return Array.from(groupedFields).map((item, index) => (Object.assign({ itemKey: `${utils.getUUID()}_${index}`, itemStateChecked: item === null || item === void 0 ? void 0 : item.editAuthority, itemStateTitle: item.alias || item.jimuName || item.name, itemStateIcon: dataComponentsUtils.getIconFromFieldType(item.type, theme), itemStateDetailContent: item, itemStateDisabled: (item === null || item === void 0 ? void 0 : item.groupKey) ? false : !this.checkFieldsExist(allFields, item), itemStateCommands: [], isCheckboxDisabled: !item.editable }, (item.children ? { itemChildren: showFieldsToTreeItem(item.children) } : {}))));
            };
            const treeItem = showFieldsToTreeItem(groupedFields);
            const treeItemJson = {
                itemKey: TREE_ROOT_ITEM,
                itemStateTitle: TREE_ROOT_ITEM,
                itemChildren: treeItem
            };
            return treeItemJson;
        };
        this.setRootItemJson = (nextRootItemJson) => {
            this.setState({ rootItemJson: nextRootItemJson });
        };
        this.showDetailPopper = (ref, curField) => {
            const { isOpenDetailPopper } = this.state;
            this.setState({
                isOpenDetailPopper: !isOpenDetailPopper,
                popperRef: ref,
                curEditField: curField
            });
        };
        this.getCurrentEditField = (jimuName) => {
            const { groupedFields } = this.props;
            const curIndex = this.findEditingIndex(jimuName);
            let curField = {
                jimuName: '',
                groupKey: '',
                editAuthority: false,
                children: [],
                subDescription: '',
                description: '',
                name: ''
            };
            if ((curIndex === null || curIndex === void 0 ? void 0 : curIndex.length) === 2) {
                const [index, subIndex] = curIndex;
                curField = groupedFields[index].children[subIndex];
            }
            else if ((curIndex === null || curIndex === void 0 ? void 0 : curIndex.length) === 1) {
                const [index] = curIndex;
                curField = groupedFields[index];
            }
            return curField;
        };
        this.state = {
            dataSource: undefined,
            rootItemJson: this.constructTreeItem(props.groupedFields),
            itemLabel: props.name || '',
            hasUncheck: this.getUncheckState(props.groupedFields),
            indeterminate: this.getIndeterminate(props.groupedFields),
            isOpenDetailPopper: false,
            popperRef: undefined,
            curEditField: undefined,
            groupUpdating: false
        };
        this.colRef = React.createRef();
    }
    componentDidUpdate(preProps, preState) {
        if (this.props.name !== preProps.name) {
            this.setState({ itemLabel: this.props.name || '' });
        }
        if (this.props.id !== preProps.id) {
            this.setState({ rootItemJson: this.constructTreeItem(this.props.groupedFields) });
        }
    }
    getGroupMaxId(arr = []) {
        const numbers = [];
        arr.forEach(item => {
            if (item === null || item === void 0 ? void 0 : item.groupKey) {
                numbers.push(item === null || item === void 0 ? void 0 : item.groupKey);
            }
        });
        return numbers.length > 0 ? Math.max.apply(null, numbers) : 0;
    }
    getStyle(theme) {
        return css `
      .layer-config-panel {
        .panel-inner {
          .title {
            max-width: 70%;
          }
        }
        .setting-container {
          height: calc(100% - ${polished.rem(58)});
          overflow: auto;
          .layer-mode {
            .layer-mode-item {
              display: flex;
              margin-bottom: 8px;
            }
          }
          .fields-list-header {
            background: ${theme.colors.palette.light[200]};
            border-bottom: 1px solid ${theme.colors.palette.light[600]};
            height: 34px;
            width: 100%;
            flex-wrap: nowrap;
            .jimu-checkbox {
              margin-top: 2px;
            }
          }
          .selected-fields-con{
            margin-top: 0;
            .selected-fields-list {
              flex: 1;
              max-height: 300px;
              overflow-y: auto;
            }
            .jimu-tree-item{
              background: ${theme.colors.palette.light[200]};
              border-bottom: 1px solid ${theme.colors.palette.light[300]};
              .jimu-tree-item__content{
                div:first-of-type{
                  padding-left: 2px;
                }
                .jimu-tree-item__body{
                  background: ${theme.colors.palette.light[200]};
                  .jimu-tree-item__title{
                    .jimu-input{
                      width: 125px;
                    }
                  }
                }
              }
            }
          }
          .table-options {
            .table-options-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .select-option {
              margin-bottom: 8px;
            }
          }
          .ds-container {
            position: absolute;
            display: none;
          }
          .component-field-selector {
            .search-input {
              width: 100%;
            }
            .field-list {
              max-height: 300px;
            }
          }
          .config-word-break {
            word-wrap: break-word;
          }
          .capability-item{
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
        }
      }
    `;
    }
    render() {
        var _a;
        const { onClose, optionChange, dataSourceChange, filterDs, id, useDataSource, theme, showFields, editorConfig, addRecords, deleteRecords, updateGeometries, groupedFields, layerHonorMode } = this.props;
        const { rootItemJson, itemLabel, dataSource, hasUncheck, indeterminate, isOpenDetailPopper, popperRef, curEditField, groupUpdating } = this.state;
        const geometryMode = editorConfig.editMode === EditModeType.Geometry;
        const selectorFields = this.getSelectorFields(showFields);
        // capabilities
        const currentDataSource = !dataSource ? DataSourceManager.getInstance().getDataSource(id) : dataSource;
        const layerDefinition = currentDataSource === null || currentDataSource === void 0 ? void 0 : currentDataSource.getLayerDefinition();
        const isTable = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.type) === SupportedLayerServiceTypes.Table;
        const getDsCap = (capabilities, capType) => {
            if (capabilities) {
                return Array.isArray(capabilities)
                    ? capabilities === null || capabilities === void 0 ? void 0 : capabilities.join().toLowerCase().includes(capType)
                    : capabilities === null || capabilities === void 0 ? void 0 : capabilities.toLowerCase().includes(capType);
            }
            else {
                return false;
            }
        };
        const capabilities = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities;
        const create = getDsCap(capabilities, 'create');
        const update = getDsCap(capabilities, 'update');
        const deletable = getDsCap(capabilities, 'delete');
        const advancedActionMap = {
            overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
                return {
                    name: TreeItemActionType.RenderOverrideItem,
                    children: [{
                            name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemContent,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemBody,
                                            children: [{
                                                    name: TreeItemActionType.RenderOverrideItemMainLine,
                                                    children: [{
                                                            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                                            children: [{
                                                                    name: TreeItemActionType.RenderOverrideItemDragHandle
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemChildrenToggle
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemIcon
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemTitle
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemCommands
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemDetailToggle
                                                                }]
                                                        }]
                                                }, {
                                                    name: TreeItemActionType.RenderOverrideItemDetailLine
                                                }]
                                        }]
                                }]
                        }, {
                            name: TreeItemActionType.RenderOverrideItemSubitems
                        }]
                };
            }
        };
        let editCount = 0;
        groupedFields === null || groupedFields === void 0 ? void 0 : groupedFields.forEach(item => {
            if (item === null || item === void 0 ? void 0 : item.children) {
                item === null || item === void 0 ? void 0 : item.children.forEach(ele => {
                    if (ele === null || ele === void 0 ? void 0 : ele.editAuthority)
                        editCount++;
                });
            }
            else {
                if (item === null || item === void 0 ? void 0 : item.editAuthority)
                    editCount++;
            }
        });
        const isFromMap = !!((_a = currentDataSource === null || currentDataSource === void 0 ? void 0 : currentDataSource.getRootDataSource()) === null || _a === void 0 ? void 0 : _a.map);
        return (jsx("div", { className: 'w-100 h-100', css: this.getStyle(theme) },
            jsx("div", { className: 'w-100 h-100 layer-config-panel' },
                jsx("div", { className: "w-100 d-flex px-3 py-0" },
                    jsx(PanelHeader, { level: 1, className: 'py-3 panel-inner', showClose: !!onClose, onClose: onClose, title: this.formatMessage('layerConfig') })),
                jsx("div", { className: 'setting-container' },
                    jsx(SettingSection, { title: this.formatMessage('data'), className: "pt-0" },
                        jsx(SettingRow, null,
                            jsx(DataSourceSelector, { types: this.supportedDsTypes, hideDataView: true, disableRemove: () => true, useDataSources: useDataSource ? Immutable([useDataSource]) : Immutable([]), mustUseDataSource: true, onChange: dataSourceChange, closeDataSourceListOnChange: true, hideDs: filterDs, hideTabs: Immutable(['OUTPUT']) }))),
                    useDataSource &&
                        jsx(React.Fragment, null,
                            jsx(SettingSection, { title: this.formatMessage('label') },
                                jsx(SettingRow, null,
                                    jsx(TextInput, { size: 'sm', type: 'text', className: 'w-100', value: itemLabel, onChange: this.nameChange, onAcceptValue: this.nameAccept, "aria-label": this.formatMessage('label') }))),
                            jsx(SettingSection, { title: this.formatMessage('capability') },
                                ((!geometryMode && isTable) || geometryMode) &&
                                    jsx("div", { className: 'capability-item', key: 'addRecords' },
                                        jsx("span", { className: 'text-break', style: { width: '80%' } }, this.formatMessage('addRecords')),
                                        jsx(Switch, { className: 'can-x-switch', checked: addRecords, onChange: evt => this.handleSwitchChange(evt, 'addRecords'), disabled: !create })),
                                jsx("div", { className: 'capability-item', key: 'deleteRecords' },
                                    jsx("span", { className: 'text-break', style: { width: '80%' } }, this.formatMessage('deleteRecords')),
                                    jsx(Switch, { className: 'can-x-switch', checked: deleteRecords, onChange: evt => this.handleSwitchChange(evt, 'deleteRecords'), disabled: !deletable })),
                                geometryMode &&
                                    jsx("div", { className: 'capability-item', key: 'updateGeometries' },
                                        jsx("span", { className: 'text-break', style: { width: '80%' } }, this.formatMessage('updateGeometries')),
                                        jsx(Switch, { className: 'can-x-switch', checked: updateGeometries, onChange: evt => this.handleSwitchChange(evt, 'updateGeometries'), disabled: !update }))),
                            jsx(SettingSection, { title: this.formatMessage('configFields') },
                                isFromMap &&
                                    jsx(SettingRow, null,
                                        jsx(Select, { size: 'sm', className: 'w-100', value: layerHonorMode, onChange: (e) => { optionChange('layerHonorMode', e.target.value); } },
                                            jsx("option", { value: LayerHonorModeType.Webmap }, this.formatMessage('layerHonorSetting')),
                                            jsx("option", { value: LayerHonorModeType.Custom }, this.formatMessage('layerCustomize')))),
                                layerHonorMode === LayerHonorModeType.Custom &&
                                    jsx(React.Fragment, null,
                                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('configFieldsTip') },
                                            jsx(FieldSelector, { useDataSources: useDataSource ? Immutable([useDataSource]) : Immutable([]), onChange: this.onFieldChange, selectedFields: Immutable(selectorFields), isMultiple: true, isSearchInputHidden: false, isDataSourceDropDownHidden: true, useDropdown: true, useMultiDropdownBottomTools: true, hiddenFields: Immutable(INVISIBLE_FIELD) })),
                                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('editableCount', { count: editCount }) },
                                            jsx("div", { className: 'fields-list-header form-inline' },
                                                jsx("div", { className: 'd-flex w-100 ml-4 fields-list-check' },
                                                    jsx(Checkbox, { id: 'editAll', "data-field": 'editAll', onClick: () => this.handleTreeBoxAll(hasUncheck), checked: !hasUncheck, indeterminate: indeterminate, title: hasUncheck
                                                            ? `${this.formatMessage('editable')} (${this.formatMessage('checkAll')})`
                                                            : `${this.formatMessage('editable')} (${this.formatMessage('uncheckAll')})` }),
                                                    jsx(Label, { for: 'editAll', style: { cursor: 'pointer' }, className: 'ml-2', title: this.formatMessage('field') }, this.formatMessage('field'))),
                                                jsx(Button, { icon: true, size: 'sm', type: 'tertiary', onClick: this.addGroupForFields, title: this.formatMessage('addGroup'), "aria-label": this.formatMessage('addGroup'), disabled: groupUpdating },
                                                    jsx(AddFolderOutlined, null)))),
                                        jsx(SettingRow, { className: 'selected-fields-con' },
                                            jsx(Tree, Object.assign({ className: 'selected-fields-list', rootItemJson: rootItemJson, treeType: TreeType.Intact, dndEnabled: true, showCheckbox: true, collapseStyle: TreeCollapseStyle.Arrow, renderOverrideItemCommands: (actionData, refComponent) => {
                                                    const { itemJsons } = refComponent.props;
                                                    const [currentItemJson] = itemJsons;
                                                    const { jimuName: jimuNameKey } = currentItemJson === null || currentItemJson === void 0 ? void 0 : currentItemJson.itemStateDetailContent;
                                                    const curField = this.getCurrentEditField(jimuNameKey);
                                                    const { jimuName, groupKey } = curField;
                                                    return groupKey
                                                        ? jsx(Button, { icon: true, size: 'sm', type: 'tertiary', onClick: () => this.removeGroup(jimuName), onKeyUp: (evt) => {
                                                                if (evt.key === ' ' || evt.key === 'Enter') {
                                                                    this.removeGroup(jimuName);
                                                                }
                                                            }, title: this.formatMessage('remove'), "aria-label": this.formatMessage('remove') },
                                                            jsx(TrashOutlined, null))
                                                        : '';
                                                }, renderOverrideItemDetailToggle: (actionData, refComponent) => {
                                                    const { itemJsons, itemJsons: [{ itemStateDetailVisible, itemStateDetailContent, itemStateDisabled }] } = refComponent.props;
                                                    const [currentItemJson] = itemJsons;
                                                    const { jimuName } = currentItemJson === null || currentItemJson === void 0 ? void 0 : currentItemJson.itemStateDetailContent;
                                                    const curField = this.getCurrentEditField(jimuName);
                                                    const getStyle = () => {
                                                        return css `
                                &.jimu-tree-item__detail-toggle {
                                  display: flex;
                                  align-items: center;
                                  cursor: pointer;

                                  .icon-btn-sizer {
                                    margin: 0;
                                    min-width: 0.5rem;
                                    min-height: 0.5rem;
                                  }
                                }
                              `;
                                                    };
                                                    return (itemStateDetailContent
                                                        ? jsx(Button, { icon: true, type: 'tertiary', title: this.formatMessage('description'), "aria-label": this.formatMessage('description'), disabled: !!itemStateDisabled, "aria-expanded": !!itemStateDetailVisible, className: 'jimu-tree-item__detail-toggle', onClick: (evt) => {
                                                                evt.stopPropagation();
                                                                this.showDetailPopper(refComponent.dragRef, curField);
                                                            }, onKeyUp: (evt) => {
                                                                if (evt.key === ' ' || evt.key === 'Enter') {
                                                                    evt.stopPropagation();
                                                                    this.showDetailPopper(refComponent.dragRef, curField);
                                                                }
                                                            }, css: getStyle },
                                                            jsx(InfoOutlined, { autoFlip: !itemStateDetailVisible }))
                                                        : null);
                                                }, isItemDroppable: (actionData, refComponent) => {
                                                    var _a, _b, _c, _d;
                                                    const { draggingItemJsons, targetItemJsons } = actionData;
                                                    const dragIntoGrouped = ((_a = targetItemJsons[1]) === null || _a === void 0 ? void 0 : _a.itemKey) !== TREE_ROOT_ITEM && !!((_b = targetItemJsons[1]) === null || _b === void 0 ? void 0 : _b.itemChildren);
                                                    return !!(((_c = targetItemJsons[0]) === null || _c === void 0 ? void 0 : _c.itemChildren) && !((_d = draggingItemJsons[0]) === null || _d === void 0 ? void 0 : _d.itemChildren) && !dragIntoGrouped);
                                                }, isFolder: (actionData, refComponent) => {
                                                    const { targetItemJsons } = actionData;
                                                    const [currentItemJson] = targetItemJsons;
                                                    const { groupKey } = currentItemJson === null || currentItemJson === void 0 ? void 0 : currentItemJson.itemStateDetailContent;
                                                    return !!groupKey;
                                                }, onUpdateItem: (actionData, refComponent) => {
                                                    var _a;
                                                    const { itemJsons, updateType } = actionData;
                                                    const parentItemJson = itemJsons[itemJsons.length - 1];
                                                    const [currentItemJson] = itemJsons;
                                                    const { jimuName } = currentItemJson === null || currentItemJson === void 0 ? void 0 : currentItemJson.itemStateDetailContent;
                                                    const curField = this.getCurrentEditField(jimuName);
                                                    const { groupKey } = curField;
                                                    if (!groupKey && updateType === TreeItemActionType.HandleStartEditing)
                                                        return;
                                                    const newGroupedFields = (_a = parentItemJson.itemChildren) === null || _a === void 0 ? void 0 : _a.map((item, index) => {
                                                        var _a, _b, _c, _d, _e;
                                                        if (item === null || item === void 0 ? void 0 : item.itemChildren) {
                                                            if (!item.itemStateTitle) {
                                                                parentItemJson.itemChildren[index].itemStateTitle = (_a = item.itemStateDetailContent) === null || _a === void 0 ? void 0 : _a.jimuName;
                                                            }
                                                            return Object.assign(Object.assign(Object.assign(Object.assign({}, item.itemStateDetailContent), { children: item.itemChildren.map(child => {
                                                                    return Object.assign(Object.assign({}, child.itemStateDetailContent), { editAuthority: child.itemStateChecked });
                                                                }) }), (item.itemStateTitle
                                                                ? {
                                                                    name: item.itemStateTitle,
                                                                    alias: item.itemStateTitle
                                                                }
                                                                : {
                                                                    name: (_b = item.itemStateDetailContent) === null || _b === void 0 ? void 0 : _b.jimuName,
                                                                    alias: (_c = item.itemStateDetailContent) === null || _c === void 0 ? void 0 : _c.jimuName
                                                                })), { editAuthority: ((_d = item.itemChildren) === null || _d === void 0 ? void 0 : _d.length) > 0
                                                                    ? !((_e = item.itemChildren) === null || _e === void 0 ? void 0 : _e.some(item => {
                                                                        return item.isCheckboxDisabled === false && item.itemStateChecked === false;
                                                                    }))
                                                                    : false });
                                                        }
                                                        return Object.assign(Object.assign({}, item.itemStateDetailContent), { editAuthority: item.itemStateChecked });
                                                    });
                                                    optionChange('groupedFields', newGroupedFields);
                                                    const hasUncheck = this.getUncheckState(newGroupedFields);
                                                    const indeterminate = this.getIndeterminate(newGroupedFields);
                                                    this.setState({ rootItemJson: parentItemJson, hasUncheck, indeterminate });
                                                }, isItemFocused: () => false }, advancedActionMap)),
                                            jsx(Popper, { placement: 'bottom-start', disableResize: true, reference: popperRef, offset: [-27, 3], open: isOpenDetailPopper, showArrow: false, toggle: e => {
                                                    this.setState({ isOpenDetailPopper: !isOpenDetailPopper });
                                                } },
                                                jsx("div", { style: { width: 228, height: 132 }, className: 'p-3' },
                                                    jsx(TextArea, { ref: e => { this.popperTextRef = e; }, id: curEditField === null || curEditField === void 0 ? void 0 : curEditField.jimuName, className: 'w-100', height: 60, placeholder: this.formatMessage('editFieldDescription'), defaultValue: (curEditField === null || curEditField === void 0 ? void 0 : curEditField.subDescription) || (curEditField === null || curEditField === void 0 ? void 0 : curEditField.description) }),
                                                    jsx("div", { className: 'mt-3 float-right' },
                                                        jsx(Button, { size: 'sm', type: 'primary', onClick: () => this.handleTreeDescChange(curEditField === null || curEditField === void 0 ? void 0 : curEditField.jimuName, this.popperTextRef.value) }, this.formatMessage('commonModalOk')),
                                                        jsx(Button, { size: 'sm', className: 'ml-1', onClick: () => {
                                                                this.setState({ isOpenDetailPopper: false });
                                                            } }, this.formatMessage('commonModalCancel')))))))),
                            jsx("div", { className: 'ds-container' },
                                jsx(DataSourceComponent, { useDataSource: Immutable(useDataSource), onDataSourceCreated: this.onDataSourceCreated })))))));
    }
}
//# sourceMappingURL=layer-config.js.map