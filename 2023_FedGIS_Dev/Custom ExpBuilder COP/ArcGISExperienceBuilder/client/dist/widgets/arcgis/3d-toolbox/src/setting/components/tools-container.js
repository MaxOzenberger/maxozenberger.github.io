/** @jsx jsx */
import { React, jsx, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import defaultMessages from '../translations/default';
import { ToolsID } from '../../constraints';
import settingOutlined from 'jimu-icons/svg/outlined/application/setting.svg';
export const ToolsContainer = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    // List
    const _onSidePopperToggle = props.onSidePopperToggle;
    const handleToolEdit = React.useCallback((tool, data) => {
        _onSidePopperToggle(tool.id, data.event.target);
    }, [_onSidePopperToggle]);
    const toolsToListItems = React.useCallback((tools) => {
        const listItems = tools === null || tools === void 0 ? void 0 : tools.map((tool) => {
            const isEnable = tool.enable;
            const comd = [{
                    label: translate('edit'),
                    iconProps: () => ({ icon: settingOutlined }),
                    action: (data) => {
                        handleToolEdit(tool, data);
                    }
                }];
            return {
                itemKey: tool.id,
                itemStateTitle: translate(tool.id),
                itemStateChecked: isEnable,
                itemStateCommands: (tool.id !== ToolsID.LineOfSight) ? comd : []
            };
        });
        return listItems.asMutable();
    }, [handleToolEdit, translate]);
    const [listItems, setListItems] = React.useState(() => {
        return toolsToListItems(props.tools);
    });
    React.useEffect(() => {
        setListItems(toolsToListItems(props.tools));
    }, [props.tools, toolsToListItems]);
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { title: translate('tools') },
            jsx(SettingRow, null,
                jsx("div", { className: 'w-100' },
                    jsx(List, { size: 'sm', className: 'w-100 py-1 pl-0 pr-1', itemsJson: listItems, showCheckbox: true, dndEnabled: true, disableDoubleClickTitle: true, onUpdateItem: (actionData, refComponent) => {
                            const [, nextItemsJson] = actionData.itemJsons;
                            const itemsInList = [...nextItemsJson];
                            const newConfig = [];
                            if (actionData.updateType === TreeItemActionType.HandleCheckboxChanged) {
                                // 1.update enable/disable
                                props.tools.forEach((config) => {
                                    itemsInList.forEach((item) => {
                                        const key = item.itemKey;
                                        if (config.id === key) {
                                            config = config.setIn(['enable'], item.itemStateChecked);
                                            newConfig.push(config);
                                        }
                                    });
                                });
                            }
                            else if (actionData.updateType === TreeItemActionType.HandleDidDrop) {
                                // 2.reorder list
                                itemsInList.forEach((item) => {
                                    const key = item.itemKey;
                                    const foundIdx = props.tools.findIndex((tool) => {
                                        return tool.id === key;
                                    });
                                    if (foundIdx > -1) {
                                        newConfig.push(props.tools[foundIdx]);
                                    }
                                });
                            }
                            props.onToolsConfigChanged(Immutable(newConfig));
                        } }))))));
});
//# sourceMappingURL=tools-container.js.map