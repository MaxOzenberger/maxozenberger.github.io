/** @jsx jsx */
import { React, classNames, jsx, dataSourceUtils, Immutable, DataSourceStatus, MessageManager, DataSourceFilterChangeMessage, lodash } from 'jimu-core';
import { FilterArrangeType, FilterTriggerType } from '../config';
import FilterItem from './filter-item';
import { WidgetPlaceholder, Button, Icon, Popper, Badge, maxSizeModifier, applyMaxSizeModifier, getCustomFlipModifier, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { versionManager } from '../version-manager';
import defaultMessages from './translations/default';
import { getStyles } from './style';
import { getShownClauseNumberByExpression, getTotalClauseNumberByExpression } from 'jimu-ui/basic/sql-expression-runtime';
import FilterItemDataSource from './filter-item-ds';
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset';
const FilterIcon = require('../../icon.svg');
const modifiers = [
    getCustomFlipModifier({ fallbackPlacements: ['top', 'left', 'right'], useClosestVerticalPlacement: true }),
    maxSizeModifier,
    applyMaxSizeModifier
];
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.setSqlToAllDs = () => {
            Object.keys(this.state.dataSources).forEach(dsId => {
                const ds = this.state.dataSources[dsId];
                if (ds) { // exclude invalid dataSources
                    const sql = this.getQuerySqlFromDs(ds);
                    // if(sql !== ''){
                    this.setSqlToDs(ds, sql);
                    // }
                }
            });
        };
        this.onFilterItemChange = (index, dataSource, sqlExprObj, applied) => {
            if (this.__unmount) {
                return;
            }
            // current filter item is destoryed and applied, fItem has alread been removed from state by didUpdate
            if (!this.state.filterItems[index] && applied) {
                this.setSqlToDs(dataSource, '');
                return;
            }
            // update fitlerItem
            const fItems = this.state.filterItems.asMutable({ deep: true });
            const needQuery = !((!applied && !fItems[index].autoApplyWhenWidgetOpen));
            const fItem = Object.assign({}, fItems[index], { sqlExprObj: sqlExprObj, autoApplyWhenWidgetOpen: applied });
            fItems.splice(index, 1, fItem);
            const filterItems = Immutable(fItems);
            this.setState({
                filterItems: filterItems
            });
            if (needQuery) {
                const sql = this.getQuerySqlFromDs(dataSource, filterItems);
                this.setSqlToDs(dataSource, sql);
            }
        };
        this.setSqlToDs = (dataSource, sql) => {
            var _a, _b;
            if (this._autoApplyInit && sql === '') { // empty SQL set for ds would cause more useless requests.
                return;
            }
            const queryParams = { where: sql };
            if (dataSource) {
                (_b = (_a = dataSource).updateQueryParams) === null || _b === void 0 ? void 0 : _b.call(_a, queryParams, this.props.id);
                MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, dataSource.id));
            }
        };
        this.getQuerySqlFromDs = (dataSource, filterItems = this.props.config.filterItems) => {
            const sqls = []; // get sqls for current ds
            filterItems.forEach(item => {
                // collect sqls from autoApplid, manual apply, or expaned single clause. dataSource could be null when it's not available.
                if (item.useDataSource.dataSourceId === (dataSource === null || dataSource === void 0 ? void 0 : dataSource.id) && (item.autoApplyWhenWidgetOpen || (this.props.config.omitInternalStyle && getShownClauseNumberByExpression(item.sqlExprObj) === 1))) {
                    const _sql = dataSourceUtils.getArcGISSQL(item.sqlExprObj, dataSource).sql;
                    if (_sql) {
                        sqls.push(_sql);
                    }
                }
            });
            let sqlString = '';
            if (sqls.length) {
                sqlString = sqls.length === 1 ? sqls[0] : '(' + sqls.join(') ' + this.props.config.logicalOperator + ' (') + ')';
            }
            return sqlString;
        };
        this.getDataSourceById = (dataSourceId) => {
            const dsList = this.props.useDataSources.asMutable({ deep: true }).filter(ds => ds.dataSourceId === dataSourceId);
            return Immutable(dsList[0]);
        };
        // check if it's in props.useDataSources.
        this.isDataSourceRemoved = (dataSourceId) => {
            var _a;
            return ((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.filter(useDs => dataSourceId === useDs.dataSourceId).length) === 0;
        };
        this.onResetChange = () => {
            this.setState({
                filterItems: this.props.config.filterItems
            });
            this.setSqlToAllDs();
        };
        /**
         * Whether to show reset button at bottom of widget
         * By default: bottom.
         * Special case: right. Only when filter item(s) are displayed as buttons.
         */
        this.showResetAtBottom = (resetAll, arrangeType, wrap, filterItems) => {
            let atBottom = true;
            if (resetAll && arrangeType === FilterArrangeType.Inline && !wrap &&
                (filterItems.length > 1 || (filterItems.length === 1 && getShownClauseNumberByExpression(filterItems[0].sqlExprObj) === 0))) {
                atBottom = false;
            }
            return atBottom;
        };
        this.getFilterItems = (config, arrangeType = FilterArrangeType.Block, wrap = false, isPopup = false) => {
            const showResetAtBottom = this.showResetAtBottom(config.resetAll, arrangeType, wrap, config.filterItems);
            return (jsx("div", { className: classNames('w-100 h-100 d-flex justify-content-between', showResetAtBottom ? 'flex-column' : 'flex-row'), css: getStyles(this.props.theme) },
                jsx("div", { className: classNames('w-100 filter-items-container', arrangeType && config.arrangeType === FilterArrangeType.Inline ? 'filter-items-inline' : '', wrap ? 'filter-items-wrap' : '', isPopup ? 'filter-items-popup' : '') }, this.state.filterItems.map((item, index) => {
                    const ds = this.isDataSourceRemoved(item.useDataSource.dataSourceId) ? null : this.state.dataSources[item.useDataSource.dataSourceId];
                    const isNotReadyFromWidget = this.state.outputDataSourceIsNotReady[item.useDataSource.dataSourceId];
                    return (jsx(FilterItem, { key: index, id: index, widgetId: this.props.id, intl: this.props.intl, selectedDs: ds, useDataSource: item.useDataSource, isNotReadyFromWidget: isNotReadyFromWidget, logicalOperator: config.logicalOperator, config: item, arrangeType: arrangeType, triggerType: config.triggerType, wrap: wrap, omitInternalStyle: config.omitInternalStyle, filterNum: this.state.filterItems.length, onChange: this.onFilterItemChange, itemBgColor: this.props.theme.colors.palette.light[300], theme: this.props.theme }));
                })),
                config.resetAll && jsx("div", { className: classNames('filter-reset-container', showResetAtBottom ? 'bottom-reset' : 'right-reset') },
                    jsx(Button, { icon: true, type: 'default', size: 'default', className: 'reset-button', style: { borderRadius: config.triggerType === FilterTriggerType.Toggle ? '16px' : null }, title: this.props.intl.formatMessage({ id: 'resetAllFilters', defaultMessage: jimuUIMessages.resetAllFilters }), "aria-label": this.props.intl.formatMessage({ id: 'resetAllFilters', defaultMessage: jimuUIMessages.resetAllFilters }), onClick: this.onResetChange },
                        jsx(ResetOutlined, null)))));
        };
        this.onShowPopper = () => {
            this.setState({
                isOpen: !this.state.isOpen,
                popperVersion: !this.state.isOpen ? this.state.popperVersion + 1 : this.state.popperVersion
            });
        };
        this.onTogglePopper = () => {
            this.setState({
                isOpen: false
            });
            lodash.defer(() => {
                this.widgetIconRef.focus();
            });
        };
        this.checkIfAnyFiltersApplied = () => {
            var _a;
            const { omitInternalStyle } = this.props.config;
            const filterItems = ((_a = this.state) === null || _a === void 0 ? void 0 : _a.filterItems) || this.props.config.filterItems;
            const isApplied = filterItems.some((item) => {
                if (omitInternalStyle && getTotalClauseNumberByExpression(item.sqlExprObj) === 1 && getShownClauseNumberByExpression(item.sqlExprObj) === 1) {
                    // ds exists, or it hasn't created when widget starts
                    return (this.state.dataSources[item.useDataSource.dataSourceId]
                        ? dataSourceUtils.getArcGISSQL(item.sqlExprObj, this.state.dataSources[item.useDataSource.dataSourceId]).sql
                        : item.sqlExprObj.sql) !== '';
                }
                else {
                    return item.autoApplyWhenWidgetOpen;
                }
            });
            return isApplied;
        };
        this.onIsDataSourceNotReady = (dataSourceId, dataSourceStatus) => {
            this.setState((state) => {
                var _a;
                const isOutPutDs = (_a = state.dataSources[dataSourceId]) === null || _a === void 0 ? void 0 : _a.getDataSourceJson().isOutputFromWidget;
                if (!isOutPutDs) {
                    return;
                }
                const outputDataSource = Object.assign({}, state.outputDataSourceIsNotReady);
                outputDataSource[dataSourceId] = dataSourceStatus === DataSourceStatus.NotReady;
                return { outputDataSourceIsNotReady: outputDataSource };
            });
        };
        this.onCreateDataSourceCreatedOrFailed = (dataSourceId, dataSource) => {
            this.setState((state) => {
                const newDataSources = Object.assign({}, state.dataSources);
                newDataSources[dataSourceId] = dataSource;
                return { dataSources: newDataSources };
            });
        };
        // Only for first time & autoApply option, after all datasources are ready
        this.applyAutoFiltersAtStart = () => {
            var _a;
            if (this._autoApplyInit) {
                const dsLength = Object.keys(this.state.dataSources).map(() => true).length;
                if (dsLength === ((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.length)) {
                    setTimeout(() => {
                        this.setSqlToAllDs();
                        this._autoApplyInit = false;
                    }, 0);
                }
            }
        };
        this.__unmount = false;
        this.index = 0;
        this._autoApplyInit = true;
        this.state = {
            popperVersion: 1,
            isOpen: false,
            // needQuery: true,
            filterItems: this.props.config.filterItems,
            dataSources: {},
            outputDataSourceIsNotReady: {}
        };
    }
    componentWillUnmount() {
        this.__unmount = true;
        Object.keys(this.state.dataSources).forEach(dsId => {
            const ds = this.state.dataSources[dsId];
            if (ds) {
                ds === null || ds === void 0 ? void 0 : ds.updateQueryParams(null, this.props.id);
                MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, ds.id));
            }
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.__unmount) {
            return;
        }
        this._autoApplyInit = false;
        // refresh all sqls for different dataSources when setting's changed
        if (prevProps.config !== this.props.config) {
            this.setState({
                filterItems: this.props.config.filterItems
            });
            this.setSqlToAllDs();
            // update auto apply by arrangement & styles
        }
        else if (this.state.dataSources !== prevState.dataSources) {
            this._autoApplyInit = true;
            this.applyAutoFiltersAtStart();
        }
        // else if(this.state.filterItems !== prevState.filterItems && this.state.needQuery){
        //   this.setState({needQuery: false});
        //   this.setSqlToAllDs();
        // }
    }
    render() {
        var _a;
        const { config, icon, label } = this.props;
        if (this.state.filterItems.length === 0) {
            return (jsx(WidgetPlaceholder, { icon: FilterIcon, widgetId: this.props.id, message: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }) }));
        }
        return (jsx("div", { className: 'jimu-widget widget-filter overflow-auto' }, (_a = this.props.useDataSources) === null || _a === void 0 ? void 0 :
            _a.map((useDs, key) => {
                return (jsx(FilterItemDataSource, { key: key, useDataSource: useDs, onIsDataSourceNotReady: this.onIsDataSourceNotReady, onCreateDataSourceCreatedOrFailed: this.onCreateDataSourceCreatedOrFailed }));
            }),
            // Filters & Clauses on Popup are as the same as Block panel.
            config.arrangeType === FilterArrangeType.Popper
                ? jsx("div", { className: 'filter-widget-popper' },
                    jsx(Badge, { dot: true, className: 'm-1', hideBadge: !this.checkIfAnyFiltersApplied(), color: 'primary' },
                        jsx(Button, { icon: true, size: 'sm', className: 'filter-widget-pill h-100', ref: ref => { this.widgetIconRef = ref; }, title: label, type: 'tertiary', onClick: this.onShowPopper },
                            jsx(Icon, { icon: typeof icon === 'string' ? icon : icon.svg, size: 16, color: typeof icon === 'string' ? '' : icon.properties.color }))),
                    this.state.popperVersion > 1 && jsx(Popper, { open: this.state.isOpen, version: this.state.popperVersion, keepMount: true, toggle: this.onTogglePopper, showArrow: true, modifiers: modifiers, forceLatestFocusElements: true, reference: this.widgetIconRef },
                        jsx("div", { className: 'p-2' }, this.getFilterItems(config, FilterArrangeType.Block, false, true))))
                : jsx("div", { className: 'w-100 h-100' }, this.getFilterItems(config, config.arrangeType, config.wrap))));
    }
}
Widget.versionManager = versionManager;
//# sourceMappingURL=widget.js.map