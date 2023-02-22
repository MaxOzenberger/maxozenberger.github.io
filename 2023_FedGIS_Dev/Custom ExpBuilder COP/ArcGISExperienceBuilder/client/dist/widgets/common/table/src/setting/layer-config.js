/** @jsx jsx */
import { React, jsx, Immutable, polished, css, JimuFieldType, DataSourceComponent, DataSourceManager, CONSTANTS, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput, Switch, defaultMessages as jimuUIMessages, Checkbox, MultiSelect, Select, Label, Button } from 'jimu-ui';
import { DataSourceSelector, FieldSelector, dataComponentsUtils } from 'jimu-ui/advanced/data-source-selector';
import { SelectionModeType } from '../config';
import defaultMessages from './translations/default';
import { Fragment } from 'react';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { builderAppSync } from 'jimu-for-builder';
import { VisibleOutlined } from 'jimu-icons/outlined/application/visible';
import { InvisibleOutlined } from 'jimu-icons/outlined/application/invisible';
const { OUTPUT_DATA_VIEW_ID } = CONSTANTS;
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
        this.getUncheckState = (tableFields = [], dsConfigId) => {
            let hasUncheck = false;
            let currentDs;
            if (this.state) {
                currentDs = this.state.dataSource;
            }
            else {
                if (!dsConfigId)
                    return hasUncheck;
                const strIndex = dsConfigId.lastIndexOf('-');
                const dsId = dsConfigId.substr(0, strIndex);
                currentDs = DataSourceManager.getInstance().getDataSource(dsId);
            }
            const layerDefinition = currentDs === null || currentDs === void 0 ? void 0 : currentDs.getLayerDefinition();
            tableFields.forEach(item => {
                const editable = this.getFieldEditable(layerDefinition, item.jimuName);
                if (!item.editAuthority && editable)
                    hasUncheck = true;
            });
            return hasUncheck;
        };
        this.handleCheckboxChange = evt => {
            const target = evt.currentTarget;
            if (!target)
                return;
            this.props.optionChange(target.dataset.field, target.checked);
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.displaySelectedFields = values => {
            return this.formatMessage('numSelected', { number: values.length });
        };
        this.filterSearchFields = (newTableFields) => {
            const { searchFields } = this.props;
            const searchFieldsArray = searchFields.split(',');
            const tableFieldsNames = newTableFields.map(item => item.jimuName);
            const filteredSearchFields = searchFieldsArray.filter(field => tableFieldsNames.includes(field));
            return filteredSearchFields.join(',');
        };
        this.getFieldEditable = (layerDefinition, jimuName) => {
            const fieldsConfig = (layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.fields) || [];
            const orgField = fieldsConfig.find(config => config.name === jimuName);
            const fieldEditable = orgField ? orgField === null || orgField === void 0 ? void 0 : orgField.editable : true;
            return fieldEditable;
        };
        this.mergeArray = (arr1, arr2) => {
            const arr = arr1.concat(arr2);
            const newSet = new Set(arr);
            return Array.from(newSet);
        };
        this.onFieldChange = (allSelectedFields) => {
            if (!allSelectedFields)
                return;
            const { dataSource } = this.state;
            const { useDataSource, tableFields, onDataSourceFieldsChange } = this.props;
            const layerDefinition = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getLayerDefinition();
            const filteredFields = allSelectedFields.filter(ele => ele).map(item => {
                const editable = this.getFieldEditable(layerDefinition, item.jimuName);
                const curTableFields = tableFields.find(ele => ele.jimuName === item.jimuName);
                const newVisible = curTableFields ? curTableFields === null || curTableFields === void 0 ? void 0 : curTableFields.visible : true;
                return Object.assign(Object.assign({}, item), { editAuthority: editable, visible: newVisible });
            });
            // update searchFields, tableFields and the fields used
            const filteredSearchFields = this.filterSearchFields(filteredFields);
            const usedFields = allSelectedFields.map(f => f.jimuName);
            // merge usedFields
            const orgFields = (useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.fields) || [];
            const newUsedFields = this.mergeArray(orgFields, usedFields);
            onDataSourceFieldsChange(Immutable(useDataSource).set('fields', newUsedFields));
            this.props.multiOptionsChange({
                searchFields: filteredSearchFields,
                tableFields: filteredFields
            });
        };
        this.onDataSourceCreated = (dataSource) => {
            this.setState({ dataSource });
        };
        this.getSearchingFields = () => {
            const res = [];
            const { tableFields } = this.props;
            if (tableFields.length > 0) {
                tableFields.forEach(item => {
                    if (item.type === JimuFieldType.String) {
                        res.push({
                            value: item.jimuName || item.name,
                            label: item.alias || item.name
                        });
                    }
                });
            }
            return res;
        };
        this.handleChooseSearchingFieldsChange = (evt, value, values) => {
            const { widgetId } = this.props;
            const fieldStr = values.join(',');
            if (!fieldStr) {
                builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'optionChangeSuggestion', value: true });
            }
            this.props.optionChange('searchFields', fieldStr);
        };
        this.onSearchPlaceholderChange = (e) => {
            var _a;
            const searctHint = e.target.value;
            const preSearctHint = (_a = this.props) === null || _a === void 0 ? void 0 : _a.searchHint;
            if (preSearctHint === searctHint)
                return;
            this.props.optionChange('searchHint', searctHint);
        };
        this.getSelectModeOptions = () => {
            return [
                jsx("option", { key: SelectionModeType.Single, value: SelectionModeType.Single }, this.formatMessage('single')),
                jsx("option", { key: SelectionModeType.Multiple, value: SelectionModeType.Multiple }, this.formatMessage('multiple'))
            ];
        };
        this.getFieldsFromDatasource = () => {
            const { useDataSource } = this.props;
            const selectedDs = DataSourceManager.getInstance().getDataSource(useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId);
            const allFieldsSchema = selectedDs === null || selectedDs === void 0 ? void 0 : selectedDs.getSchema();
            const allFields = (allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) ? Object.values(allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) : [];
            const defaultInvisible = [
                'CreationDate',
                'Creator',
                'EditDate',
                'Editor',
                'GlobalID'
            ];
            let tableFields = allFields.filter(item => !defaultInvisible.includes(item.jimuName));
            // If there are too many columns, only the first 50 columns will be displayed by default
            if ((tableFields === null || tableFields === void 0 ? void 0 : tableFields.length) > 50) {
                tableFields = tableFields.slice(0, 50);
            }
            return { allFields, tableFields };
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
        this.handleListBoxAll = (hasUncheck) => {
            const { tableFields } = this.props;
            const newTableFields = tableFields.map(item => {
                return Object.assign(Object.assign({}, item), { editAuthority: hasUncheck });
            });
            this.setState({ hasUncheck: !hasUncheck });
            this.props.optionChange('tableFields', newTableFields);
        };
        this.getCurrentEditField = (jimuName) => {
            const { tableFields } = this.props;
            return tableFields.find(item => item.jimuName === jimuName);
        };
        this.toggleFieldVisible = (jimuName) => {
            const { tableFields } = this.props;
            const curIndex = tableFields.findIndex(item => item.jimuName === jimuName);
            const visible = tableFields[curIndex].visible;
            tableFields[curIndex].visible = !visible;
            this.props.optionChange('tableFields', tableFields);
        };
        this.state = {
            dataSource: undefined,
            itemLabel: props.name || '',
            hasUncheck: this.getUncheckState(props.tableFields, props.id)
        };
        this.colRef = React.createRef();
    }
    componentDidUpdate(preProps, preState) {
        if (this.props.name !== preProps.name) {
            this.setState({ itemLabel: this.props.name || '' });
        }
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
              max-height: 265px;
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
        }
      }
    `;
    }
    render() {
        const { useDataSource, optionChange, theme, tableFields, searchFields, searchExact, searchHint, enableEdit, enableSearch, widgetId, dataSourceChange } = this.props;
        const { dataSource, itemLabel, hasUncheck } = this.state;
        const layerDefinition = dataSource && dataSource.getLayerDefinition();
        const optionsArray = ['enableSelect', 'enableRefresh']; // 'allowCsv',
        const allFieldsSchema = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSchema();
        const dsTableFields = tableFields === null || tableFields === void 0 ? void 0 : tableFields.map(item => {
            var _a;
            const newItem = ((_a = allFieldsSchema === null || allFieldsSchema === void 0 ? void 0 : allFieldsSchema.fields) === null || _a === void 0 ? void 0 : _a[item.jimuName]) || {};
            return Object.assign(Object.assign({}, item), newItem);
        });
        const _tableFields = [];
        if (tableFields && tableFields.length > 0) {
            tableFields.forEach(item => {
                _tableFields.push(item.jimuName);
            });
        }
        const { allFields } = this.getFieldsFromDatasource();
        // Can't edit Feature collection(dataSource.url is undefined) and output ds
        const capabilities = layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities;
        let editing = false;
        if (capabilities) {
            editing = Array.isArray(capabilities)
                ? capabilities.join().toLowerCase().includes('editing')
                : layerDefinition === null || layerDefinition === void 0 ? void 0 : layerDefinition.capabilities.toLowerCase().includes('editing');
        }
        const editAble = (dataSource === null || dataSource === void 0 ? void 0 : dataSource.url) &&
            (dataSource === null || dataSource === void 0 ? void 0 : dataSource.dataViewId) !== OUTPUT_DATA_VIEW_ID &&
            editing;
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
                        }]
                };
            }
        };
        let editCount = 0;
        dsTableFields === null || dsTableFields === void 0 ? void 0 : dsTableFields.forEach(item => {
            if (item === null || item === void 0 ? void 0 : item.editAuthority)
                editCount++;
        });
        const visibleLabel = this.formatMessage('visible');
        const invisibleLabel = this.formatMessage('invisible');
        return (jsx("div", { className: 'w-100 h-100', css: this.getStyle(theme) },
            jsx("div", { className: 'w-100 h-100 layer-config-panel' },
                jsx("div", { className: 'setting-container' },
                    jsx(SettingSection, { title: this.formatMessage('data'), className: "pt-0" },
                        jsx(SettingRow, null,
                            jsx(DataSourceSelector, { types: this.supportedDsTypes, disableRemove: () => true, useDataSources: useDataSource ? Immutable([useDataSource]) : Immutable([]), mustUseDataSource: true, onChange: dataSourceChange, closeDataSourceListOnChange: true }))),
                    useDataSource &&
                        jsx(React.Fragment, null,
                            jsx(SettingSection, { title: this.formatMessage('label') },
                                jsx(SettingRow, null,
                                    jsx(TextInput, { type: 'text', size: 'sm', className: 'w-100', value: itemLabel, onChange: this.nameChange, onAcceptValue: this.nameAccept, "aria-label": this.formatMessage('label') }))),
                            jsx(SettingSection, { title: this.formatMessage('configFields') },
                                jsx(SettingRow, null, this.formatMessage('configTips')),
                                jsx(SettingRow, null,
                                    jsx(FieldSelector, { useDataSources: useDataSource ? Immutable([useDataSource]) : Immutable([]), onChange: this.onFieldChange, selectedFields: Immutable(_tableFields), isMultiple: true, isSearchInputHidden: false, isDataSourceDropDownHidden: true, useDropdown: true, useMultiDropdownBottomTools: true })),
                                jsx(SettingRow, { flow: 'wrap', label: enableEdit && this.formatMessage('editableCount', { count: editCount }) },
                                    jsx("div", { className: 'fields-list-header form-inline' },
                                        jsx("div", { className: 'd-flex w-100 ml-1 fields-list-check' },
                                            enableEdit &&
                                                jsx(Checkbox, { id: 'editAllField', "data-field": 'editAllField', onClick: () => this.handleListBoxAll(hasUncheck), checked: !hasUncheck, title: hasUncheck
                                                        ? `${this.formatMessage('editable')} (${this.formatMessage('checkAll')})`
                                                        : `${this.formatMessage('editable')} (${this.formatMessage('uncheckAll')})` }),
                                            jsx(Label, { for: 'editAllField', style: { cursor: 'pointer' }, className: 'ml-2', title: this.formatMessage('field') }, this.formatMessage('field'))))),
                                jsx(SettingRow, { className: 'selected-fields-con' },
                                    jsx(List, Object.assign({ size: 'sm', className: 'selected-fields-list', itemsJson: Array.from(dsTableFields).map((item, index) => ({
                                            itemStateDetailContent: item,
                                            itemStateChecked: item === null || item === void 0 ? void 0 : item.editAuthority,
                                            itemStateDisabled: !this.checkFieldsExist(allFields, item),
                                            itemKey: `${index}`,
                                            itemStateIcon: dataComponentsUtils.getIconFromFieldType(item.type, theme),
                                            itemStateTitle: item.alias || item.jimuName || item.name,
                                            isCheckboxDisabled: !this.getFieldEditable(layerDefinition, item.jimuName),
                                            itemStateCommands: []
                                        })), dndEnabled: true, showCheckbox: enableEdit, onUpdateItem: (actionData, refComponent) => {
                                            const { itemJsons } = actionData;
                                            const parentItemJson = itemJsons[itemJsons.length - 1];
                                            const newTableFields = parentItemJson.map(item => {
                                                return Object.assign(Object.assign({}, item.itemStateDetailContent), { editAuthority: item.itemStateChecked });
                                            });
                                            optionChange('tableFields', newTableFields);
                                            const hasUncheck = this.getUncheckState(newTableFields);
                                            this.setState({ hasUncheck });
                                        }, isItemFocused: () => false, renderOverrideItemDetailToggle: (actionData, refComponent) => {
                                            const { itemJsons, itemJsons: [{ itemStateDetailContent }] } = refComponent.props;
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
                                                ? jsx(Fragment, null,
                                                    jsx(Button, { icon: true, type: 'tertiary', title: curField.visible ? visibleLabel : invisibleLabel, "aria-label": curField.visible ? visibleLabel : invisibleLabel, className: 'jimu-tree-item__detail-toggle', onClick: (evt) => {
                                                            evt.stopPropagation();
                                                            this.toggleFieldVisible(jimuName);
                                                        }, css: getStyle }, curField.visible ? jsx(VisibleOutlined, null) : jsx(InvisibleOutlined, null)))
                                                : null);
                                        } }, advancedActionMap))),
                                editAble && (jsx(SettingRow, null,
                                    jsx("div", { className: 'd-flex w-100' },
                                        jsx(Checkbox, { id: 'editable-cb', "data-field": 'enableEdit', onClick: this.handleCheckboxChange, checked: enableEdit }),
                                        jsx(Label, { for: 'editable-cb', style: { cursor: 'pointer' }, className: 'ml-2', title: this.formatMessage('enableEdit') }, this.formatMessage('enableEdit')))))),
                            jsx(SettingSection, { title: this.formatMessage('tools') },
                                jsx("div", { className: 'w-100 table-options' },
                                    jsx("div", { className: 'table-options-item', key: 'enableSearch' },
                                        jsx("span", { className: 'text-break', style: { width: '80%' } }, this.formatMessage('enableSearch')),
                                        jsx(Switch, { className: 'can-x-switch', checked: enableSearch || false, onChange: evt => {
                                                const checked = evt.target.checked;
                                                builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'optionChangeSuggestion', value: true });
                                                optionChange('enableSearch', checked);
                                            } }))),
                                jsx("div", { className: 'ds-container' },
                                    jsx(DataSourceComponent, { useDataSource: Immutable(useDataSource), onDataSourceCreated: this.onDataSourceCreated })),
                                enableSearch && (jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('searchFields') },
                                    jsx("div", { className: 'd-flex w-100 search-container', style: { zIndex: 3 } },
                                        jsx(MultiSelect, { size: 'sm', items: Immutable(this.getSearchingFields()), values: searchFields ? Immutable(searchFields.split(',')) : Immutable([]), className: 'search-multi-select', fluid: true, onClickItem: this.handleChooseSearchingFieldsChange, displayByValues: this.displaySelectedFields })),
                                    jsx("div", { className: 'd-flex w-100', style: { marginTop: '10px' } },
                                        jsx(Checkbox, { id: 'fullMatch-cb', "data-field": 'searchExact', onClick: this.handleCheckboxChange, checked: searchExact }),
                                        jsx(Label, { for: 'fullMatch-cb', style: { cursor: 'pointer' }, className: 'ml-2', title: this.formatMessage('fullMatch') }, this.formatMessage('fullMatch'))))),
                                enableSearch && (jsx(SettingRow, { flow: 'wrap', role: 'group', label: this.formatMessage('searchHint'), "aria-label": this.formatMessage('searchHint') },
                                    jsx(TextInput, { size: 'sm', className: 'search-placeholder w-100', placeholder: this.formatMessage('search'), value: searchHint || '', onChange: this.onSearchPlaceholderChange }))),
                                jsx(SettingRow, null,
                                    jsx("div", { className: 'w-100 table-options' }, optionsArray.map((key, index) => {
                                        return (jsx(Fragment, { key: index },
                                            jsx("div", { className: 'table-options-item' },
                                                jsx("span", { className: 'text-break', style: { width: '80%' } }, this.formatMessage(key)),
                                                jsx(Switch, { className: 'can-x-switch', checked: this.props[key] || false, onChange: evt => {
                                                        optionChange(key, evt.target.checked);
                                                    } })),
                                            key === 'enableSelect' && this.props[key] && (jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('selectMode'), className: 'select-option' },
                                                jsx(Select, { size: 'sm', value: this.props.selectMode ||
                                                        SelectionModeType.Multiple, onChange: evt => {
                                                        optionChange('selectMode', evt.target.value);
                                                    } }, this.getSelectModeOptions())))));
                                    })))))))));
    }
}
//# sourceMappingURL=layer-config.js.map