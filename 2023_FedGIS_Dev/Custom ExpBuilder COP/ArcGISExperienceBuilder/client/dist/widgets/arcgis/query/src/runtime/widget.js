/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { WidgetPlaceholder } from 'jimu-ui';
import { QueryArrangeType } from '../config';
import defaultMessages from './translations/default';
import { getWidgetRuntimeDataMap } from './widget-config';
import { versionManager } from '../version-manager';
import { QueryTaskList } from './query-task-list';
import { TaskListInline } from './query-task-list-inline';
import { TaskListPopperWrapper } from './query-task-list-popper-wrapper';
import { QueryWidgetContext } from './widget-context';
const { iconMap } = getWidgetRuntimeDataMap();
const widgetStyle = css `
  background-color: var(--white);
`;
export default class Widget extends React.PureComponent {
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const { config, id, icon, label, layoutId, layoutItemId } = this.props;
        const widgetLabel = this.props.intl.formatMessage({
            id: '_widgetLabel',
            defaultMessage: defaultMessages._widgetLabel
        });
        if (!((_a = config.queryItems) === null || _a === void 0 ? void 0 : _a.length)) {
            return jsx(WidgetPlaceholder, { icon: iconMap.iconQuery, widgetId: this.props.id, message: widgetLabel });
        }
        if (config.arrangeType === QueryArrangeType.Popper) {
            return (jsx(QueryWidgetContext.Provider, { value: `${layoutId}:${layoutItemId}` },
                jsx(TaskListPopperWrapper, { id: 0, icon: icon, popperTitle: label, minSize: (_c = (_b = config.sizeMap) === null || _b === void 0 ? void 0 : _b.arrangementIconPopper) === null || _c === void 0 ? void 0 : _c.minSize, defaultSize: (_e = (_d = config.sizeMap) === null || _d === void 0 ? void 0 : _d.arrangementIconPopper) === null || _e === void 0 ? void 0 : _e.defaultSize },
                    jsx(QueryTaskList, { widgetId: id, queryItems: config.queryItems, className: 'py-3' }))));
        }
        if (config.arrangeType === QueryArrangeType.Inline) {
            return (jsx(QueryWidgetContext.Provider, { value: `${layoutId}:${layoutItemId}` },
                jsx(TaskListInline, { widgetId: id, widgetLabel: label, wrap: config.arrangeWrap, queryItems: config.queryItems, minSize: (_g = (_f = config.sizeMap) === null || _f === void 0 ? void 0 : _f.arrangementIconPopper) === null || _g === void 0 ? void 0 : _g.minSize, defaultSize: (_j = (_h = config.sizeMap) === null || _h === void 0 ? void 0 : _h.arrangementIconPopper) === null || _j === void 0 ? void 0 : _j.defaultSize })));
        }
        return (jsx("div", { className: 'jimu-widget runtime-query py-3', css: widgetStyle },
            jsx(QueryWidgetContext.Provider, { value: `${layoutId}:${layoutItemId}` },
                jsx(QueryTaskList, { widgetId: id, queryItems: config.queryItems }))));
    }
}
Widget.versionManager = versionManager;
//# sourceMappingURL=widget.js.map