/** @jsx jsx */
import { jsx, css, React, Immutable } from 'jimu-core';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { QueryTaskListItem } from './query-task-list-item';
import { QueryTask } from './query-task';
const blockInfo = () => {
    return {
        name: TreeItemActionType.RenderOverrideItem,
        children: [
            {
                name: TreeItemActionType.RenderOverrideItemBody,
                children: [
                    {
                        name: TreeItemActionType.RenderOverrideItemMainLine
                    }
                ]
            }
        ]
    };
};
// show task label and an arrow to the task content
export function QueryTaskList(props) {
    var _a;
    const { queryItems, widgetId, className = '' } = props;
    const [stage, setStage] = React.useState(0);
    const [disabledList, setDisabledList] = React.useState(Immutable({}));
    const [selectedTask, setSelectedTask] = React.useState({ index: 0, id: (_a = queryItems === null || queryItems === void 0 ? void 0 : queryItems[0]) === null || _a === void 0 ? void 0 : _a.configId });
    const selectedIndex = React.useMemo(() => {
        var _a;
        const { index, id } = selectedTask;
        if (index >= 0) {
            if (((_a = queryItems[index]) === null || _a === void 0 ? void 0 : _a.configId) === id) {
                return index;
            }
            let realIndex = -1;
            queryItems.find((value, idx) => {
                if (value.configId === id) {
                    realIndex = idx;
                    return true;
                }
                return false;
            });
            if (realIndex === -1) {
                // currently selected item is removed
                setStage(0);
                setSelectedTask({ index: -1, id: null });
            }
            return realIndex;
        }
        return index;
    }, [queryItems, selectedTask]);
    const handleTaskSelected = (index, id) => {
        setStage(1);
        setSelectedTask({ index, id });
    };
    const handleTaskStatusChange = React.useCallback((index, enabled) => {
        const id = queryItems[index].configId;
        setDisabledList(disabledList.set(id, !enabled));
    }, [queryItems, disabledList]);
    const generateItemJson = React.useCallback(() => {
        return Array.from(queryItems).map((queryItem, index) => {
            var _a;
            return ({
                itemStateDetailContent: queryItem,
                itemStateDisabled: (_a = disabledList[queryItem.configId]) !== null && _a !== void 0 ? _a : false,
                itemKey: `${index}`
            });
        });
    }, [queryItems, disabledList]);
    const handleNavBack = () => {
        setStage(0);
        setSelectedTask({ index: -1, id: null });
    };
    return (jsx("div", { className: `runtime-query__query-list h-100 ${className}`, css: css `.jimu-tree-item__body {width: 100%;}` },
        stage === 0 && queryItems.length > 1 && (jsx(List, { itemsJson: generateItemJson(), isItemFocused: () => false, overrideItemBlockInfo: blockInfo, onClickItemBody: (actionData, refComponent) => {
                const { itemJsons } = refComponent.props;
                const currentItemJson = itemJsons[0];
                const index = +currentItemJson.itemKey;
                handleTaskSelected(index, currentItemJson.itemStateDetailContent.configId);
            }, renderOverrideItemMainLine: (actionData, refComponent) => {
                const { itemJsons } = refComponent.props;
                const currentItemJson = itemJsons[0];
                const queryItem = currentItemJson.itemStateDetailContent;
                const index = +currentItemJson.itemKey;
                return (jsx(QueryTaskListItem, { key: queryItem.configId, widgetId: widgetId, index: index, queryItem: queryItem, onStatusChange: (enabled) => { handleTaskStatusChange(index, enabled); } }));
            }, className: 'px-3' })),
        (stage === 1 || queryItems.length === 1) && (jsx(QueryTask, { widgetId: widgetId, index: queryItems.length > 1 && selectedIndex >= 0 ? selectedIndex : 0, total: queryItems.length, queryItem: queryItems[queryItems.length > 1 && selectedIndex >= 0 ? selectedIndex : 0], onNavBack: handleNavBack }))));
}
//# sourceMappingURL=query-task-list.js.map