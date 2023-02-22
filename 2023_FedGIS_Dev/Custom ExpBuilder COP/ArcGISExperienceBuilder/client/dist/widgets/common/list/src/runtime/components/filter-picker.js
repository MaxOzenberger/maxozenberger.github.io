/** @jsx jsx */
import { React, jsx, polished, css, AppMode } from 'jimu-core';
import { Button, Popper } from 'jimu-ui';
import { SqlExpressionRuntime } from 'jimu-ui/basic/sql-expression-runtime';
import { Fragment } from 'react';
import { WidgetFilterOutlined } from 'jimu-icons/outlined/brand/widget-filter';
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset';
const popperOffset = [0, 5];
const popperModifiers = [
    {
        name: 'flip',
        options: {
            boundary: document.body,
            fallbackPlacements: ['bottom-start', 'right-end', 'top-start', 'left-start']
        }
    }
];
export default class FilterPicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formatMessage = (id, values) => {
            return this.props.formatMessage(id, values);
        };
        this.onPopperToggle = evt => {
            const { filter } = this.props;
            const { isOpen } = this.state;
            if (!isOpen) {
                // will open
                this.setState({
                    currentFilter: filter
                });
            }
            this.setState({ isOpen: !isOpen });
        };
        this.onItemClick = (evt, item) => {
            this.setState({ isOpen: false });
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
        };
        this.handleFilterChange = (sqlExprObj) => {
            this.setState({
                currentFilter: sqlExprObj
            });
        };
        this.handleApplyClick = evt => {
            const { currentFilter } = this.state;
            const { handleFilterApplyChange, handleFilterChange } = this.props;
            handleFilterChange(currentFilter);
            handleFilterApplyChange(true);
            this.setState({
                isOpen: false
            });
        };
        this.handleResetClick = evt => {
            const { handleFilterApplyChange, handleFilterChange } = this.props;
            handleFilterApplyChange(false);
            handleFilterChange(this.props.filterInConfig);
            this.setState({
                currentFilter: this.props.filterInConfig
            });
        };
        this.handleClearClick = evt => {
            const { handleFilterApplyChange } = this.props;
            handleFilterApplyChange(false);
            this.setState({
                isOpen: false
            });
        };
        this.getStyle = () => {
            const { theme } = this.props;
            return css `
      position: relative;
      .dot {
        position: absolute;
        width: 6px;
        height: 6px;
        right: -2px;
        top: 0px;
        .dot-bottom {
          width: 6px;
          height: 6px;
          background-color: transparent;
          .dot-top {
            width: 4px;
            height: 4px;
            background-color: ${theme.colors.palette.dark[600]};
          }
        }
      }
      :hover {
        .dot-top {
          background-color: ${theme.colors.palette.primary[500]};
        }
      }
      & .active {
        .dot-top {
          background-color: ${theme.colors.white};
        }
        :hover {
          .dot-top {
            background-color: ${theme.colors.white};
          }
        }
      }
    `;
        };
        this.getPopperStyle = () => {
            return css `
      .filter-button-con  {
        & {
          text-align: right;
        }
        button {
          max-width: ${polished.rem(92)};
          overflow: hidden;
          text-overflow: ellipsis;
        }
        button svg {
          margin-right: 0 !important;
        }
        .reset-button {
          padding-left: ${polished.rem(5)};
          padding-right: ${polished.rem(5)};
        }
      }
      .clear-button, .reset-button {
        margin-left: ${polished.rem(8)};
      }
    `;
        };
        this.toggleRef = React.createRef();
        this.state = {
            isOpen: false,
            currentFilter: props.filter
        };
    }
    componentDidUpdate(preProps) {
        const { filter, appMode } = this.props;
        if (filter !== preProps.filter) {
            this.setState({
                currentFilter: filter
            });
        }
        if (appMode !== preProps.appMode) {
            if (appMode === AppMode.Design) {
                this.setState({
                    isOpen: false
                });
            }
        }
    }
    render() {
        const { filter, selectedDs, widgetId, title, applied } = this.props;
        const { isOpen, currentFilter } = this.state;
        const isHadApply = applied && (filter === null || filter === void 0 ? void 0 : filter.sql) === (currentFilter === null || currentFilter === void 0 ? void 0 : currentFilter.sql);
        return (jsx(Fragment, null,
            jsx(Button, { css: this.getStyle(), size: 'sm', type: 'tertiary', icon: true, title: title, ref: this.toggleRef, onClick: this.onPopperToggle },
                jsx(WidgetFilterOutlined, { size: 16 }),
                applied && (jsx("div", { className: 'dot align-items-center justify-content-center' },
                    jsx("div", { className: 'dot-bottom rounded-circle' },
                        jsx("div", { className: 'dot-top rounded-circle' }))))),
            jsx(Popper, { placement: 'bottom-start', reference: this.toggleRef.current, offset: popperOffset, toggle: this.onPopperToggle, css: this.getPopperStyle(), open: isOpen, modifiers: popperModifiers },
                jsx("div", { style: { padding: polished.rem(20), width: polished.rem(250) } },
                    jsx("div", null,
                        jsx(SqlExpressionRuntime, { widgetId: widgetId, dataSource: selectedDs, expression: currentFilter, onChange: this.handleFilterChange })),
                    jsx("div", { className: 'w-100 mt-3 filter-button-con' },
                        jsx(Button, { disabled: isHadApply, onClick: this.handleApplyClick, type: 'primary', title: this.formatMessage('apply'), size: 'sm' }, this.formatMessage('apply')),
                        jsx(Button, { disabled: !applied, onClick: this.handleClearClick, title: this.formatMessage('commonModalCancel'), className: "clear-button", size: 'sm' }, this.formatMessage('commonModalCancel')),
                        jsx(Button, { onClick: this.handleResetClick, title: this.formatMessage('resetFilters'), className: "reset-button", size: 'sm' },
                            jsx(ResetOutlined, { size: 's' })))))));
    }
}
//# sourceMappingURL=filter-picker.js.map