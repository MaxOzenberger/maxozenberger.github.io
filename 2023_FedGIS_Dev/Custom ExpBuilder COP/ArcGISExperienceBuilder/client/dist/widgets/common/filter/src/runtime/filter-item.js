/** @jsx jsx */
import { React, jsx, classNames, defaultMessages as jimuCoreMessages, appConfigUtils, getAppStore, lodash } from 'jimu-core';
import { FilterArrangeType, FilterTriggerType } from '../config';
import { Switch, Icon, Button, Popper, Card, defaultMessages as jimuUIMessages, Alert } from 'jimu-ui';
import { SqlExpressionRuntime, getShownClauseNumberByExpression, getTotalClauseNumberByExpression } from 'jimu-ui/basic/sql-expression-runtime';
import { getStyles } from './style';
import { DownFilled } from 'jimu-icons/filled/directional/down';
const modifiers = [
    {
        name: 'preventOverflow',
        options: {
            altAxis: true
        }
    }
];
export default class FilterItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOutPutWidgetLabel = () => {
            var _a;
            const widgets = getAppStore().getState().appConfig.widgets;
            const wId = appConfigUtils.getWidgetIdByOutputDataSource(this.props.useDataSource);
            return (_a = widgets[wId]) === null || _a === void 0 ? void 0 : _a.label;
        };
        this.getAppliedState = () => {
            let applied = this.props.config.autoApplyWhenWidgetOpen;
            if (this.props.omitInternalStyle && this.endUserClausesNum === 1 && this.clausesNumConfigured === 1) {
                applied = true;
            }
            return applied;
        };
        this.oncollapsedChange = () => {
            this.setState({ collapsed: !this.state.collapsed });
        };
        this.onApplyChange = (checked) => {
            this.setState({ sqlChanged: false });
            this.props.onChange(this.props.id, this.props.selectedDs, this.state.sqlExprObj, checked);
        };
        this.onToggleChange = (checked) => {
            this.setState({ applied: checked });
            this.onApplyChange(checked);
        };
        this.onPillClick = (hasPopper, pillTarget) => {
            if (hasPopper) {
                this.setState({
                    popperVersion: !this.state.isOpen ? this.state.popperVersion + 1 : this.state.popperVersion
                });
                this.onTogglePopper();
            }
            else {
                const willActive = pillTarget.className.indexOf('active') < 0;
                this.onToggleChange(!!willActive);
            }
        };
        this.onSqlExpressionChange = (sqlExprObj) => {
            var _a;
            this.setState({
                sqlExprObj: sqlExprObj,
                sqlChanged: !!(this.props.triggerType === FilterTriggerType.Button && !this.props.omitInternalStyle && ((_a = this.props.config.sqlExprObj) === null || _a === void 0 ? void 0 : _a.sql) !== (sqlExprObj === null || sqlExprObj === void 0 ? void 0 : sqlExprObj.sql))
            });
            if (this.props.triggerType === FilterTriggerType.Toggle || this.props.omitInternalStyle) {
                this.props.onChange(this.props.id, this.props.selectedDs, sqlExprObj, this.state.applied);
            }
        };
        this.onTogglePopper = () => {
            if (this.state.isOpen) {
                lodash.defer(() => {
                    this.pillButton.focus();
                });
            }
            this.setState({ isOpen: !this.state.isOpen });
        };
        this.getFilterItem = (hasEndUserClauses, isTitleHidden = false) => {
            const { icon, name } = this.props.config;
            return (jsx("div", { className: 'h-100' },
                jsx("div", { className: classNames('d-flex justify-content-between w-100 pr-2 align-items-center', isTitleHidden ? 'flex-row-reverse' : '') },
                    !isTitleHidden && hasEndUserClauses && jsx(Button, { size: 'sm', icon: true, type: 'tertiary', onClick: this.oncollapsedChange, className: 'jimu-outline-inside' },
                        jsx(DownFilled, { className: this.state.collapsed ? 'filter-item-arrow' : '', size: 's' })),
                    !isTitleHidden && icon && jsx("div", { className: classNames('filter-item-icon', hasEndUserClauses ? '' : 'no-arrow') },
                        jsx(Icon, { icon: icon.svg, size: icon.properties.size })),
                    !isTitleHidden && jsx("div", { className: classNames('filter-item-name flex-grow-1', !hasEndUserClauses && !icon ? 'no-icons' : '') }, name),
                    this.props.triggerType === FilterTriggerType.Toggle && jsx("div", { className: 'ml-1 d-flex align-items-center' }, this.getToggle())),
                this.state.sqlExprObj && jsx("div", { style: { display: this.state.collapsed ? 'none' : 'block' }, className: classNames('w-100 pl-5 pr-5', this.props.arrangeType === FilterArrangeType.Inline && this.props.filterNum === 1 && this.props.omitInternalStyle ? 'sql-expression-inline' : '', this.props.arrangeType === FilterArrangeType.Inline && this.props.filterNum === 1 && this.props.wrap ? 'sql-expression-wrap' : '') }, this.getSqlExpression()),
                this.props.triggerType === FilterTriggerType.Button && jsx("div", { className: 'd-flex justify-content-end pl-4 pr-4 pt-2 pb-2' }, this.getApplyButtons())));
        };
        this.isDataSourceError = () => {
            return this.props.selectedDs === null;
        };
        this.isOutputFromWidget = () => {
            var _a;
            return (_a = this.props.selectedDs) === null || _a === void 0 ? void 0 : _a.getDataSourceJson().isOutputFromWidget;
        };
        this.isOutputDataSourceValid = () => {
            return this.isOutputFromWidget() && !this.props.isNotReadyFromWidget;
        };
        this.isOutputDataSourceInvalid = () => {
            return this.isOutputFromWidget() && this.props.isNotReadyFromWidget;
        };
        // valid: for display all clauses of current filter.
        this.isDataSourceValid = () => {
            return this.props.selectedDs && ((this.isOutputFromWidget() && !this.props.isNotReadyFromWidget) || !this.isOutputDataSourceInvalid());
        };
        // loading or invalid: for the enabled/disabled state of Swith and Button.
        this.isDataSourceLoadingOrInvalid = () => {
            return !this.isDataSourceValid();
        };
        this.getErrorIcon = () => {
            if (this.isDataSourceError()) {
                const errorLabel = this.props.intl.formatMessage({ id: 'dataSourceCreateError', defaultMessage: jimuCoreMessages.dataSourceCreateError });
                return (jsx(Alert, { buttonType: 'tertiary', form: 'tooltip', size: 'small', type: 'error', text: errorLabel }));
            }
            else if (this.isOutputDataSourceInvalid()) {
                const warningLabel = this.props.intl.formatMessage({ id: 'outputDataIsNotGenerated', defaultMessage: jimuUIMessages.outputDataIsNotGenerated }, { outputDsLabel: this.props.selectedDs.getLabel(), sourceWidgetName: this.state.outputWidgetLabel });
                return (jsx(Alert, { buttonType: 'tertiary', form: 'tooltip', size: 'small', type: 'warning', text: warningLabel }));
            }
            else {
                return null;
            }
        };
        this.getToggle = () => {
            // bind error icon with toggle
            // return <Switch checked={this.state.applied} disabled={!this.props.selectedDs} onChange={evt => this.onToggleChange(evt.target.checked)} />
            return (jsx(React.Fragment, null,
                this.getErrorIcon(),
                jsx(Switch, { checked: this.state.applied, disabled: this.isDataSourceLoadingOrInvalid(), "aria-label": this.props.config.name, onChange: evt => this.onToggleChange(evt.target.checked) })));
        };
        this.getApplyButtons = () => {
            return (jsx("div", { className: 'w-100 d-flex justify-content-end apply-cancel-group' },
                this.getErrorIcon(),
                jsx(Button, { type: 'primary', className: 'filter-apply-button wrap', disabled: this.isDataSourceLoadingOrInvalid() || !!(this.state.applied && !this.state.sqlChanged), onClick: () => this.onApplyChange(true) }, this.props.intl.formatMessage({ id: 'apply', defaultMessage: jimuCoreMessages.apply })),
                jsx(Button, { type: 'default', className: 'filter-cancel-button ml-2', disabled: this.isDataSourceLoadingOrInvalid() || !this.state.applied, onClick: () => this.onApplyChange(false) }, this.props.intl.formatMessage({ id: 'cancel', defaultMessage: jimuCoreMessages.cancel }))));
        };
        this.getTriggerNodeForClauses = (triggerType = this.props.triggerType) => {
            let Trigger = null;
            switch (triggerType) {
                case FilterTriggerType.Toggle:
                    Trigger = this.getToggle();
                    break;
                case FilterTriggerType.Button:
                    Trigger = this.getApplyButtons();
                    break;
                default:
                    break;
            }
            return Trigger;
        };
        this.getSqlExpression = () => {
            return this.isDataSourceValid()
                ? jsx(SqlExpressionRuntime, { widgetId: this.props.widgetId, dataSource: this.props.selectedDs, expression: this.state.sqlExprObj, onChange: this.onSqlExpressionChange })
                : null;
        };
        /* toggle(TR) or button(BR): for wrap multiple clauses */
        this.getTirggerNodeForWrapClauses = (triggerType) => {
            return triggerType === this.props.triggerType && this.isSingleFilterAndMultipleClauses() && this.props.wrap && jsx("div", { className: 'd-flex flex-row-reverse' }, this.getTriggerNodeForClauses(triggerType));
        };
        /* toggle or button (Right) for no-wrap multiple clauses */
        this.getTriggerNodeForNoWrapClause = () => {
            return this.isSingleFilterAndMultipleClauses() && !this.props.wrap && jsx("div", { className: 'ml-3' }, this.getTriggerNodeForClauses());
        };
        this.endUserClausesNum = getShownClauseNumberByExpression(this.props.config.sqlExprObj);
        this.clausesNumConfigured = getTotalClauseNumberByExpression(this.props.config.sqlExprObj);
        this.state = {
            isOpen: false,
            applied: this.getAppliedState(),
            collapsed: this.props.config.collapseFilterExprs,
            sqlExprObj: this.props.config.sqlExprObj,
            sqlChanged: false,
            outputWidgetLabel: this.getOutPutWidgetLabel(),
            popperVersion: 1
        };
    }
    componentDidUpdate(prevProps, prevState) {
        this.endUserClausesNum = getShownClauseNumberByExpression(this.props.config.sqlExprObj);
        this.clausesNumConfigured = getTotalClauseNumberByExpression(this.props.config.sqlExprObj);
        if (prevProps.config !== this.props.config || prevProps.selectedDs !== this.props.selectedDs) {
            this.setState({
                applied: this.getAppliedState(),
                collapsed: prevProps.config.collapseFilterExprs !== this.props.config.collapseFilterExprs ? this.props.config.collapseFilterExprs : this.state.collapsed,
                sqlExprObj: this.props.selectedDs ? this.props.config.sqlExprObj : null,
                outputWidgetLabel: this.props.useDataSource.dataSourceId === prevProps.useDataSource.dataSourceId ? this.state.outputWidgetLabel : this.getOutPutWidgetLabel()
            });
        }
        else if (prevProps.logicalOperator !== this.props.logicalOperator || prevProps.omitInternalStyle !== this.props.omitInternalStyle) { // update applied btn
            this.setState({
                applied: this.getAppliedState()
            });
        }
    }
    // 1 filter, multiple clause configured, and visible clauses exists
    isSingleFilterAndMultipleClauses() {
        return this.props.filterNum === 1 && this.clausesNumConfigured > 1 && this.endUserClausesNum >= 1;
    }
    // 1 filter, 1 clause configured, and it's visible for endUser.
    isSingleFilterAndSingleShownClause() {
        return this.props.filterNum === 1 && this.clausesNumConfigured === 1 && this.endUserClausesNum === 1;
    }
    // multiple filters, current filter has only 1 sinlge clause & it's visible for endUser.
    isMultipleFiltersAndSingleShownClause() {
        return this.props.filterNum > 1 && this.clausesNumConfigured === 1 && this.endUserClausesNum === 1;
    }
    // Render block ( & popup-block), or inline.
    render() {
        const { name, icon } = this.props.config;
        return (jsx("div", { className: 'filter-item', role: 'group', "aria-label": name },
            jsx(Card, { className: 'filter-item-inline' }, this.props.arrangeType === FilterArrangeType.Block
                ? jsx("div", { className: 'w-100' }, this.props.omitInternalStyle &&
                    (this.isSingleFilterAndSingleShownClause() || this.isMultipleFiltersAndSingleShownClause())
                    ? jsx("div", { className: 'w-100 pl-5 pr-5' }, this.getSqlExpression())
                    : jsx("div", { className: 'filter-expanded-container' }, this.getFilterItem(this.endUserClausesNum >= 1)))
                : jsx(React.Fragment, null, 
                // single filter, single clause, single shown
                this.isSingleFilterAndSingleShownClause()
                    ? jsx("div", { className: 'sql-expression-inline d-flex' },
                        this.getSqlExpression(),
                        !this.props.omitInternalStyle && jsx("div", { className: 'ml-3' }, this.getTriggerNodeForClauses()))
                    : jsx(React.Fragment, null, (this.isSingleFilterAndMultipleClauses() ||
                        (this.isMultipleFiltersAndSingleShownClause() && this.props.omitInternalStyle))
                        ? jsx("div", { className: classNames('sql-expression-inline d-flex', {
                                'sql-expression-wrap': this.props.wrap,
                                'filter-item-pill': this.isMultipleFiltersAndSingleShownClause()
                            }) },
                            this.getTirggerNodeForWrapClauses(FilterTriggerType.Toggle),
                            this.getSqlExpression(),
                            this.getTirggerNodeForWrapClauses(FilterTriggerType.Button),
                            this.getTriggerNodeForNoWrapClause())
                        : jsx("div", { className: 'filter-popper-container' },
                            this.props.triggerType === FilterTriggerType.Toggle && this.endUserClausesNum === 0
                                ? jsx(Card, { className: 'filter-item-pill filter-item-toggle-pill' },
                                    icon && jsx(Icon, { icon: icon.svg, size: icon.properties.size, className: 'mr-1' }),
                                    jsx("div", { className: 'filter-item-name toggle-name' }, name),
                                    this.getToggle())
                                : jsx("div", { className: "filter-item-pill h-100 nowrap" },
                                    jsx(Button, { className: classNames('', { 'frame-active': this.state.applied }), title: name, ref: ref => { this.pillButton = ref; }, type: 'default', onClick: evt => this.onPillClick(this.endUserClausesNum >= 1, this.pillButton) },
                                        icon && jsx(Icon, { icon: icon.svg, size: icon.properties.size }),
                                        name)),
                            this.endUserClausesNum >= 1 && jsx(Popper, { open: this.state.isOpen, toggle: this.onTogglePopper, modifiers: modifiers, showArrow: true, reference: this.pillButton, version: this.state.popperVersion, autoFocus: this.state.popperVersion > 1, forceLatestFocusElements: this.props.triggerType === FilterTriggerType.Button },
                                jsx("div", { className: 'filter-items-container', css: getStyles(this.props.theme) },
                                    jsx("div", { className: 'filter-item filter-item-popper overflow-auto', style: { maxHeight: 'calc(100vh - 20px)' } },
                                        jsx(Card, { className: 'filter-item-inline' }, this.getFilterItem(this.endUserClausesNum >= 1, this.props.arrangeType !== FilterArrangeType.Popper)))))))))));
    }
}
//# sourceMappingURL=filter-item.js.map