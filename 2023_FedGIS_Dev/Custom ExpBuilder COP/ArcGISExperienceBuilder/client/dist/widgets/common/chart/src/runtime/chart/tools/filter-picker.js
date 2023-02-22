import { React, classNames } from 'jimu-core';
import { Button, Popper, defaultMessages, hooks, Badge, Tooltip } from 'jimu-ui';
import { SqlExpressionRuntime } from 'jimu-ui/basic/sql-expression-runtime';
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state';
import { FilterOutlined } from 'jimu-icons/outlined/editor/filter';
export const FilterPicker = (props) => {
    const { dataSource } = useChartRuntimeState();
    const dispatch = useChartRuntimeDispatch();
    const translate = hooks.useTranslate(defaultMessages);
    const ref = React.useRef(null);
    const { className, filter: initFilter, widgetId } = props;
    const [filter, setFilter] = React.useState(initFilter);
    const [applied, setApplied] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const toggleFilterVisible = () => setShowFilter(v => !v);
    hooks.useUpdateEffect(() => {
        setFilter === null || setFilter === void 0 ? void 0 : setFilter(initFilter);
        setApplied(false);
        setShowFilter(false);
        dispatch({ type: 'SET_FILTER', value: null });
    }, [initFilter]);
    const handleChange = (filter) => {
        setApplied(false);
        setFilter === null || setFilter === void 0 ? void 0 : setFilter(filter);
    };
    const handleApply = () => {
        setApplied(true);
        dispatch({ type: 'SET_FILTER', value: filter });
    };
    const handleClear = () => {
        setApplied(false);
        dispatch({ type: 'SET_FILTER', value: null });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Badge, { className: classNames('filter-picker', className), dot: true, hideBadge: !applied },
            React.createElement(Tooltip, { title: translate('filter') },
                React.createElement(Button, { size: 'sm', icon: true, ref: ref, type: 'tertiary', onClick: toggleFilterVisible },
                    React.createElement(FilterOutlined, null)))),
        showFilter && (React.createElement(Popper, { open: showFilter, reference: ref.current, className: 'p-2', toggle: () => setShowFilter(false) },
            React.createElement("div", null,
                React.createElement(SqlExpressionRuntime, { widgetId: widgetId, dataSource: dataSource, expression: filter, onChange: handleChange }),
                React.createElement("div", { className: classNames('d-flex w-100 filter-button-con', {
                        'mt-3': showFilter
                    }) },
                    React.createElement(Button, { disabled: applied, size: 'sm', onClick: handleApply, type: 'primary', title: translate('apply') }, translate('apply')),
                    React.createElement(Button, { className: 'ml-3', disabled: !applied, size: 'sm', onClick: handleClear, title: translate('clear') }, translate('clear'))))))));
};
//# sourceMappingURL=filter-picker.js.map