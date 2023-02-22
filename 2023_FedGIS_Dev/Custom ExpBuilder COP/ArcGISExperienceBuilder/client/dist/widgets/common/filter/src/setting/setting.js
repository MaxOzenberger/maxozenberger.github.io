/** @jsx jsx */
import { React, jsx, DataSourceManager, Immutable, ClauseLogic, urlUtils, defaultMessages as jimuCoreMessages } from 'jimu-core';
import { SettingSection, SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components';
import FilterItem from './filter-item';
import { Button, Icon, AdvancedButtonGroup, Switch, Tooltip, Label, defaultMessages as jimuUIMessages, Checkbox, Alert } from 'jimu-ui';
import { FilterArrangeType, FilterTriggerType } from '../config';
import defaultMessages from './translations/default';
import { getStyleForWidget } from './style';
import { getJimuFieldNamesBySqlExpression } from 'jimu-ui/basic/sql-expression-runtime';
import FilterItemDataSource from './filter-item-ds';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
const FilterIcon = require('jimu-icons/svg/outlined/editor/filter.svg');
const DefaultIconResult = Immutable({
    svg: FilterIcon,
    properties: {
        color: '',
        filename: 'filter.svg',
        originalName: 'filter.svg',
        inlineSvg: true,
        path: ['general', 'filter'],
        size: 14
    }
});
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.sidePopperTrigger = React.createRef();
        // optionsContainerStyle : any = {position: 'absolute', bottom: '0', height: 'auto'};
        /** ********** For widget ***********/
        this.i18nMessage = (id, messages, values) => {
            messages = messages || defaultMessages;
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.onShowFilterItemPanel = (index, newAdded = false) => {
            this.settSidePopperAnchor(index, newAdded);
            if (index === this.index) {
                this.setState({
                    showFilterItemPanel: !this.state.showFilterItemPanel
                });
            }
            else {
                this.setState({
                    showFilterItemPanel: true,
                    refreshFilterItemPanel: !this.state.refreshFilterItemPanel
                });
                this.index = index;
            }
        };
        this.settSidePopperAnchor = (index, newAdded = false) => {
            let node;
            if (newAdded) {
                node = this.sidePopperTrigger.current.getElementsByClassName('add-filter-btn')[0];
            }
            else {
                node = this.sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index];
            }
            this.setState({
                popperFocusNode: node
            });
        };
        this.onCloseFilterItemPanel = () => {
            this.setState({
                showFilterItemPanel: false
            });
            this.index = 0;
        };
        this.updateConfigForOptions = (prop, value) => {
            const config = {
                id: this.props.id,
                config: this.props.config.set(prop, value)
            };
            this.props.onSettingChange(config);
        };
        /** ********** For Filter Item config ***********/
        this.removeFilterItem = (index) => {
            if (this.index === index) {
                this.onCloseFilterItemPanel();
            }
            const delUseDsId = this.props.config.filterItems[index].useDataSource.dataSourceId;
            // del current filter item
            const _fis = this.props.config.filterItems.asMutable({ deep: true });
            _fis.splice(index, 1);
            const fis = this.props.config.set('filterItems', _fis);
            const config = {
                id: this.props.id,
                config: fis
            };
            const useDSs = this.getUseDataSourcesByRemoved(_fis, delUseDsId);
            if (useDSs) {
                config.useDataSources = useDSs;
            }
            this.props.onSettingChange(config);
            if (this.index > index) {
                this.index--;
            }
        };
        this.optionChangeForFI = (prop, value) => {
            const currentFI = this.props.config.filterItems[this.index];
            if (currentFI) {
                const fItems = this.props.config.filterItems.asMutable({ deep: true });
                const fItem = Immutable(fItems[this.index]).set(prop, value);
                fItems.splice(this.index, 1, fItem.asMutable({ deep: true }));
                const config = {
                    id: this.props.id,
                    config: this.props.config.set('filterItems', fItems)
                };
                this.props.onSettingChange(config);
            }
        };
        this.optionChangeByDrag = (fItems) => {
            const config = {
                id: this.props.id,
                config: this.props.config.set('filterItems', fItems)
            };
            this.props.onSettingChange(config);
        };
        // save currentSelectedDs to array;
        this.dataSourceChangeForFI = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            const currentIMUseDs = Immutable(useDataSources[0]);
            this.dsManager.createDataSourceByUseDataSource(Immutable(useDataSources[0])).then(currentDs => {
                const filterItem = {
                    icon: DefaultIconResult,
                    name: currentDs.getLabel(),
                    useDataSource: currentIMUseDs,
                    sqlExprObj: null,
                    autoApplyWhenWidgetOpen: false,
                    collapseFilterExprs: false
                };
                const currentFI = this.props.config.filterItems[this.index];
                let filterItems;
                if (currentFI) { // update FI, reset other opts for current FI
                    const _fis = this.props.config.filterItems.asMutable({ deep: true });
                    _fis.splice(this.index, 1, filterItem);
                    filterItems = Immutable(_fis);
                }
                else { // add new FI to FIs
                    filterItems = this.props.config.filterItems.concat(Immutable([Immutable(filterItem)]));
                }
                const config = {
                    id: this.props.id,
                    config: this.props.config.set('filterItems', filterItems)
                };
                const useDSs = this.getUseDataSourcesByDsAdded(useDataSources[0], currentFI === null || currentFI === void 0 ? void 0 : currentFI.useDataSource.dataSourceId);
                if (useDSs) {
                    config.useDataSources = useDSs;
                }
                this.props.onSettingChange(config);
            });
        };
        this.sqlExprBuilderChange = (sqlExprObj) => {
            var _a;
            let fields = [];
            if (((_a = sqlExprObj === null || sqlExprObj === void 0 ? void 0 : sqlExprObj.parts) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                fields = getJimuFieldNamesBySqlExpression(sqlExprObj); // get fields
            }
            else {
                sqlExprObj = null; // when no valid clauses in builder
            }
            const currentUseDs = this.props.config.filterItems[this.index].useDataSource;
            const updatedDs = {
                dataSourceId: currentUseDs.dataSourceId,
                mainDataSourceId: currentUseDs.mainDataSourceId,
                dataViewId: currentUseDs.dataViewId,
                rootDataSourceId: currentUseDs.rootDataSourceId,
                fields: fields
            };
            // update sqlExprObj, sqlExprObj and ds
            const fItems = this.props.config.filterItems.asMutable({ deep: true });
            const fItem = Object.assign({}, fItems[this.index], { sqlExprObj: sqlExprObj, useDataSource: updatedDs });
            fItems.splice(this.index, 1, fItem);
            const config = {
                id: this.props.id,
                config: this.props.config.set('filterItems', Immutable(fItems))
            };
            const useDSs = this.getUseDataSourcesByFieldsChanged(fItems, updatedDs.dataSourceId);
            if (useDSs) {
                config.useDataSources = useDSs;
            }
            this.props.onSettingChange(config);
        };
        // Get all concated fields of current ds
        this.getAllUsedFieldsByDataSourceId = (fItems, dataSourceId) => {
            let fields = [];
            fItems.forEach(item => {
                if (item.useDataSource.dataSourceId === dataSourceId && item.useDataSource.fields) {
                    fields = fields.concat(item.useDataSource.fields);
                }
            });
            fields = Array.from(new Set(fields)).sort();
            return fields;
        };
        // Update fields for current useDataSource
        this.getUpdatedUseDsArray = (fields, dataSourceId) => {
            const usdDSs = [];
            this.props.useDataSources.forEach(useDs => {
                if (useDs.dataSourceId === dataSourceId) {
                    usdDSs.push(useDs.set('fields', fields));
                }
                else {
                    usdDSs.push(useDs);
                }
            });
            return usdDSs;
        };
        this.getUseDataSourcesByRemoved = (fItems, dataSourceId) => {
            // Check if multiple filter items share the same useDs.
            const isInNewFilters = fItems.filter(item => dataSourceId === item.useDataSource.dataSourceId).length > 0;
            if (isInNewFilters) {
                return this.getUseDataSourcesByFieldsChanged(fItems, dataSourceId);
            }
            else { // Remove useDs
                return this.props.useDataSources.asMutable({ deep: true }).filter(useDs => useDs.dataSourceId !== dataSourceId);
            }
        };
        // Concat all fields of current ds, and update them for current useDataSource.
        this.getUseDataSourcesByFieldsChanged = (fItems, dataSourceId) => {
            var _a, _b;
            const fields = this.getAllUsedFieldsByDataSourceId(fItems, dataSourceId);
            // useDs could be undefined when ds is invalid.
            const previousFields = ((_b = (_a = this.props.useDataSources.filter(useDs => dataSourceId === useDs.dataSourceId)[0]) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true })) || [];
            const isFieldsChanged = JSON.stringify(fields) !== JSON.stringify(previousFields); // Compare sorted fields
            return isFieldsChanged ? this.getUpdatedUseDsArray(fields, dataSourceId) : null;
        };
        // Save new useDs to props.useDataSource if it's not existed.
        this.getUseDataSourcesByDsAdded = (useDataSource, previousDsId) => {
            var _a;
            let useDSs = ((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })) || [];
            //remove previous ds when it's the only filter that consumes this data source.
            if (previousDsId) {
                const shouldRemove = this.props.config.filterItems.filter(item => item.useDataSource.dataSourceId === previousDsId).length === 1;
                if (shouldRemove) {
                    useDSs = useDSs.filter(ds => ds.dataSourceId !== previousDsId);
                }
            }
            //add new ds id when it's not in dsArray
            const isInUseDSs = useDSs.filter(useDs => useDataSource.dataSourceId === useDs.dataSourceId).length > 0;
            if (isInUseDSs) {
                useDSs = previousDsId ? useDSs : null;
            }
            else {
                useDSs.push(useDataSource);
            }
            return useDSs;
        };
        this.getUniqueValues = (array1 = [], array2 = []) => {
            const array = array1.concat(array2);
            const res = array.filter(function (item, index, array) {
                return array.indexOf(item) === index;
            });
            return res;
        };
        this.getDataSourceById = (useDataSources, dataSourceId) => {
            const dsList = useDataSources.filter(ds => ds.dataSourceId === dataSourceId);
            return Immutable(dsList[0]);
        };
        this.changeAndOR = (logicalOperator) => {
            this.updateConfigForOptions('logicalOperator', logicalOperator);
        };
        this.changeUseWrap = (wrap) => {
            this.updateConfigForOptions('wrap', wrap);
        };
        this.changeArrangeType = (type) => {
            if (type !== this.props.config.arrangeType) {
                this.updateConfigForOptions('arrangeType', type);
                // TODO: change wrap
            }
        };
        this.changeTriggerType = (type) => {
            this.updateConfigForOptions('triggerType', type);
        };
        this.changeOmitInternalStyle = (omit) => {
            this.updateConfigForOptions('omitInternalStyle', omit);
        };
        this.onCreateDataSourceCreatedOrFailed = (dataSourceId, dataSource) => {
            // The next state depends on the current state. Can't use this.state since it's not updated in in a cycle
            this.setState((state) => {
                const newDataSources = Object.assign({}, state.dataSources);
                newDataSources[dataSourceId] = dataSource;
                return { dataSources: newDataSources };
            });
        };
        this.isDataSourceCreated = (dataSourceId) => {
            // loading or created states from data component, and it's in props.useDataSources.
            return this.state.dataSources[dataSourceId] !== null && this.props.useDataSources.filter(useDs => dataSourceId === useDs.dataSourceId).length > 0;
        };
        this.CreateFilterItemElement = (item, index) => {
            var _a;
            return jsx("div", { key: index, className: 'filter-item align-items-center' },
                item.icon && jsx("div", { className: 'filter-item-icon' },
                    jsx(Icon, { icon: item.icon.svg, size: 14 })),
                jsx("div", { className: 'filter-item-name flex-grow-1' }, item.name),
                !this.isDataSourceCreated((_a = this.props.config.filterItems[index]) === null || _a === void 0 ? void 0 : _a.useDataSource.dataSourceId) &&
                    jsx(Alert, { buttonType: 'tertiary', form: 'tooltip', size: 'small', type: 'error', text: this.i18nMessage('dataSourceCreateError', jimuCoreMessages) }),
                jsx(Button, { size: 'sm', type: "tertiary", icon: true, className: 'p-0', title: this.i18nMessage('delete', jimuCoreMessages), "aria-label": this.i18nMessage('delete', jimuCoreMessages), onClick: (evt) => { evt.stopPropagation(); this.removeFilterItem(index); } },
                    jsx(CloseOutlined, null)));
        };
        this.createFilterItems = (isEditingState) => {
            return (jsx("div", { className: `filter-items-container ${this.props.config.filterItems.length > 1 ? 'mt-2' : 'mt-3'}` },
                jsx(List, { size: 'sm', className: 'setting-ui-unit-list', itemsJson: this.props.config.filterItems.asMutable().map((i, x) => ({ itemStateDetailContent: i, itemKey: `${x}` })), dndEnabled: true, onDidDrop: (actionData, refComponent) => {
                        const { itemJsons: [, listItemJsons] } = refComponent.props;
                        this.optionChangeByDrag(listItemJsons.map(i => i.itemStateDetailContent));
                    }, onClickItemBody: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const currentItemJson = itemJsons[0];
                        const listItemJsons = itemJsons[1];
                        this.onShowFilterItemPanel(listItemJsons.indexOf(currentItemJson));
                    }, isItemFocused: (actionData, refComponent) => {
                        const { itemJsons: [currentItemJson] } = refComponent.props;
                        return this.state.showFilterItemPanel && this.index + '' === currentItemJson.itemKey;
                    }, overrideItemBlockInfo: ({ itemBlockInfo }) => {
                        return {
                            name: TreeItemActionType.RenderOverrideItem,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                            children: [{
                                                    name: TreeItemActionType.RenderOverrideItemBody,
                                                    children: [{
                                                            name: TreeItemActionType.RenderOverrideItemDragHandle
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemMainLine
                                                        }]
                                                }]
                                        }]
                                }]
                        };
                    }, renderOverrideItemMainLine: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const currentItemJson = itemJsons[0];
                        const listItemJsons = itemJsons[1];
                        return this.CreateFilterItemElement(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
                    } }),
                isEditingState && jsx(List, { size: 'sm', className: 'mt-1', itemsJson: [{
                            itemKey: this.index + '',
                            itemStateIcon: () => ({ icon: FilterIcon, size: 14 }),
                            itemStateTitle: '......',
                            itemStateCommands: []
                        }], dndEnabled: false, isItemFocused: () => true, overrideItemBlockInfo: (itemBlockInfo) => {
                        return {
                            name: TreeItemActionType.RenderOverrideItem,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                            children: [{
                                                    name: TreeItemActionType.RenderOverrideItemBody,
                                                    children: [
                                                        {
                                                            name: TreeItemActionType.RenderOverrideItemMainLine,
                                                            children: [{
                                                                    name: TreeItemActionType.RenderOverrideItemDragHandle
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemIcon
                                                                }, {
                                                                    name: TreeItemActionType.RenderOverrideItemTitle
                                                                }]
                                                        }
                                                    ]
                                                }]
                                        }]
                                }]
                        };
                    } })));
        };
        this.index = 0;
        this.dsManager = DataSourceManager.getInstance();
        this.state = {
            popperFocusNode: null,
            showFilterItemPanel: false,
            refreshFilterItemPanel: false,
            dataSources: {}
        };
    }
    render() {
        var _a, _b, _c, _d;
        const { config } = this.props;
        const isEditingState = config.filterItems.length === this.index && this.state.showFilterItemPanel;
        const hasItems = config.filterItems.length > 0 || isEditingState;
        return (jsx("div", { className: 'jimu-widget-setting widget-setting-filter h-100', css: getStyleForWidget(this.props.theme) }, (_a = this.props.useDataSources) === null || _a === void 0 ? void 0 :
            _a.map((useDs, index) => {
                return (jsx(FilterItemDataSource, { key: index, useDataSource: useDs, onCreateDataSourceCreatedOrFailed: this.onCreateDataSourceCreatedOrFailed }));
            }),
            jsx(SettingSection, { className: hasItems ? '' : 'border-0', role: 'group' },
                jsx("div", { ref: this.sidePopperTrigger },
                    jsx(SettingRow, { label: jsx("span", { id: 'newFilterDesc' }, this.i18nMessage('filtersDesc')), flow: 'wrap' }),
                    jsx(SettingRow, { className: 'mt-2' },
                        jsx(Button, { type: 'primary', className: 'w-100 text-dark add-filter-btn', "aria-label": this.i18nMessage('newFilter'), "aria-describedby": 'newFilterDesc filter-blank-msg', onClick: () => { this.onShowFilterItemPanel(config.filterItems.length, true); } },
                            jsx("div", { className: 'w-100 px-2 text-truncate' },
                                jsx(PlusOutlined, { className: 'mr-1' }),
                                this.i18nMessage('newFilter')))),
                    hasItems && jsx(React.Fragment, null,
                        config.filterItems.length > 1 && jsx(SettingRow, null,
                            jsx(AdvancedButtonGroup, { className: 'w-100 and-or-group' },
                                jsx(Button, { onClick: () => { this.changeAndOR(ClauseLogic.And); }, className: 'btn-secondary max-width-50', size: 'sm', active: config.logicalOperator === ClauseLogic.And },
                                    jsx("div", { className: 'text-truncate' }, this.i18nMessage('and'))),
                                jsx(Button, { onClick: () => { this.changeAndOR(ClauseLogic.Or); }, className: 'btn-secondary max-width-50', size: 'sm', active: config.logicalOperator === ClauseLogic.Or },
                                    jsx("div", { className: 'text-truncate' }, this.i18nMessage('or'))))),
                        this.createFilterItems(isEditingState)))),
            config.filterItems.length > 0
                ? jsx(React.Fragment, null,
                    jsx(SettingSection, { className: 'arrange-style-container', title: this.i18nMessage('arrangeAndStyle'), role: 'group', "aria-label": this.i18nMessage('arrangeAndStyle') },
                        jsx(SettingRow, { className: 'arrange_container' },
                            jsx(Tooltip, { title: this.i18nMessage('vertical', jimuUIMessages), placement: 'bottom' },
                                jsx(Button, { onClick: () => this.changeArrangeType(FilterArrangeType.Block), icon: true, size: 'sm', type: 'tertiary', active: config.arrangeType === FilterArrangeType.Block, "aria-pressed": config.arrangeType === FilterArrangeType.Block, "aria-label": this.i18nMessage('vertical', jimuUIMessages) },
                                    jsx(Icon, { width: 68, height: 68, icon: require('./assets/arrange_block.svg'), autoFlip: true }))),
                            jsx(Tooltip, { title: this.i18nMessage('horizontal', jimuUIMessages), placement: 'bottom' },
                                jsx(Button, { onClick: () => this.changeArrangeType(FilterArrangeType.Inline), icon: true, size: 'sm', type: 'tertiary', active: config.arrangeType === FilterArrangeType.Inline, "aria-pressed": config.arrangeType === FilterArrangeType.Inline, "aria-label": this.i18nMessage('horizontal', jimuUIMessages) },
                                    jsx(Icon, { width: 68, height: 68, icon: require('./assets/arrange_inline.svg'), autoFlip: true }))),
                            jsx(Tooltip, { title: this.i18nMessage('icon', jimuCoreMessages), placement: 'bottom' },
                                jsx(Button, { onClick: () => this.changeArrangeType(FilterArrangeType.Popper), icon: true, size: 'sm', type: 'tertiary', active: config.arrangeType === FilterArrangeType.Popper, "aria-pressed": config.arrangeType === FilterArrangeType.Popper, "aria-label": this.i18nMessage('icon', jimuUIMessages) },
                                    jsx(Icon, { width: 68, height: 68, icon: require('./assets/arrange_popup.svg'), autoFlip: true })))),
                        config.arrangeType === FilterArrangeType.Inline && jsx(SettingRow, { label: this.i18nMessage('wrapFilters') },
                            jsx(Switch, { checked: config.wrap, "aria-label": this.i18nMessage('wrapFilters'), onChange: () => this.changeUseWrap(!config.wrap) })),
                        jsx(SettingRow, { className: 'trigger_container', label: this.i18nMessage('activationMethods'), flow: 'wrap', role: 'group', "aria-label": this.i18nMessage('activationMethods') }, [{ type: FilterTriggerType.Toggle, icon: 'toggle' },
                            { type: FilterTriggerType.Button, icon: 'button' }].map((item, index) => {
                            return (jsx(Tooltip, { key: index, title: this.i18nMessage(`${item.icon}Tooltip`), placement: 'bottom' },
                                jsx(Button, { onClick: () => this.changeTriggerType(item.type), icon: true, size: 'sm', type: 'tertiary', active: item.type === config.triggerType, "aria-pressed": item.type === config.triggerType, "aria-label": this.i18nMessage(`${item.icon}Tooltip`) },
                                    jsx(Icon, { width: 70, height: 50, icon: require(`./assets/trigger_${item.icon}.svg`), autoFlip: true }))));
                        })),
                        jsx(SettingRow, null,
                            jsx(Label, { className: 'w-100 d-flex' },
                                jsx(Checkbox, { style: { cursor: 'pointer', marginTop: '2px' }, checked: config.omitInternalStyle, "aria-label": this.i18nMessage('omitInternalStyle'), onChange: () => this.changeOmitInternalStyle(!config.omitInternalStyle) }),
                                jsx("div", { className: 'm-0 ml-2 flex-grow-1 omit-label' },
                                    this.i18nMessage('omitInternalStyle'),
                                    jsx(Tooltip, { title: this.i18nMessage('omitInternalStyleTip'), showArrow: true, placement: 'left' },
                                        jsx(Button, { icon: true, type: 'tertiary', size: 'sm', className: 'ml-2 p-0' },
                                            jsx(InfoOutlined, null))))))),
                    jsx(SettingSection, { title: this.i18nMessage('advancedTools'), role: 'group', "aria-label": this.i18nMessage('advancedTools') },
                        jsx(SettingRow, { label: this.i18nMessage('resetAllFilters') },
                            jsx(Switch, { checked: config.resetAll, "aria-label": this.i18nMessage('resetAllFilters'), onChange: () => this.updateConfigForOptions('resetAll', !config.resetAll) }))))
                : jsx(React.Fragment, null, isEditingState
                    ? null
                    : jsx("div", { className: 'empty-placeholder w-100' },
                        jsx("div", { className: 'empty-placeholder-inner' },
                            jsx("div", { className: 'empty-placeholder-icon' },
                                jsx(ClickOutlined, { size: 48 })),
                            jsx("div", { className: 'empty-placeholder-text', id: 'filter-blank-msg', dangerouslySetInnerHTML: { __html: this.i18nMessage('blankStatusMsg', null, { newFilter: this.i18nMessage('newFilter') }) } })))),
            jsx(SidePopper, { position: 'right', title: this.i18nMessage('setFilterItem'), isOpen: this.state.showFilterItemPanel && !urlUtils.getAppIdPageIdFromUrl().pageId, trigger: (_b = this.sidePopperTrigger) === null || _b === void 0 ? void 0 : _b.current, backToFocusNode: this.state.popperFocusNode, toggle: this.onCloseFilterItemPanel },
                jsx(FilterItem, Object.assign({}, config.filterItems[this.index], { intl: this.props.intl, theme: this.props.theme, useDataSource: (_c = config.filterItems[this.index]) === null || _c === void 0 ? void 0 : _c.useDataSource, dataSource: this.state.dataSources[(_d = config.filterItems[this.index]) === null || _d === void 0 ? void 0 : _d.useDataSource.dataSourceId], dataSourceChange: this.dataSourceChangeForFI, optionChange: this.optionChangeForFI, onSqlExprBuilderChange: this.sqlExprBuilderChange })))));
    }
}
//# sourceMappingURL=setting.js.map