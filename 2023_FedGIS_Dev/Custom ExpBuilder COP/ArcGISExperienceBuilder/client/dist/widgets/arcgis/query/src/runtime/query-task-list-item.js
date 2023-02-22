/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import { getWidgetRuntimeDataMap } from './widget-config';
import { DataSourceTip } from '../common/data-source-tip';
import { QueryTaskLabel } from './query-task-label';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
const { iconMap } = getWidgetRuntimeDataMap();
const style = css `
  height: 32px;
`;
export function QueryTaskListItem(props) {
    const { widgetId, queryItem, onStatusChange } = props;
    const [enabled, setEnabled] = React.useState(true);
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const { icon, name, useDataSource } = currentItem;
    const handleStatusChange = (enabled) => {
        setEnabled(enabled);
        onStatusChange(enabled);
    };
    return (jsx("div", { className: 'd-flex align-items-center pl-2 pr-1 w-100', css: style },
        jsx(QueryTaskLabel, { icon: icon, name: name }),
        jsx("div", { className: 'ml-auto' },
            jsx(DataSourceTip, { widgetId: widgetId, useDataSource: useDataSource, onStatusChange: handleStatusChange })),
        jsx(Button, { "aria-label": name, className: 'ml-2', size: 'sm', type: 'tertiary', disabled: !enabled, icon: true },
            jsx(Icon, { size: 16, icon: iconMap.arrowRight, autoFlip: true }))));
}
//# sourceMappingURL=query-task-list-item.js.map