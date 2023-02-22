/** @jsx jsx */
import { css, jsx, React, Immutable } from 'jimu-core';
import { hooks, defaultMessages } from 'jimu-ui';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
export const ItemsSelector = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages);
    const getStyle = () => {
        //const theme = props.theme
        return css `
      font-size: 13px;
      font-weight: lighter;

      /* List */
      .jimu-tree {
        .jimu-tree-item {
          .jimu-tree-item__content {
            .jimu-tree-item__body {
              background-color: transparent;

              .jimu-tree-item__main-line {
                padding: 0.25rem 0;
              }
              .jimu-tree-item__title-text {
                -webkit-line-clamp: 1;
                word-break: keep-all;
              }
            }
          }
        }
      }
    `;
    };
    // List
    const [listItems, setListItems] = React.useState();
    React.useEffect(() => {
        var _a;
        const listItems = (_a = props.items) === null || _a === void 0 ? void 0 : _a.map((item) => {
            return {
                itemKey: item.id,
                itemStateTitle: translate(item.id),
                itemStateChecked: item.enable
                //itemStateCommands: (tool.id !== ToolsID.LineOfSight) ? comd : []
            };
        });
        setListItems(listItems);
    }, [props.items, translate]);
    return (jsx("div", { css: getStyle(), "aria-label": props.title },
        jsx(List, { size: 'sm', className: 'w-100 py-1 pl-0 pr-1', itemsJson: listItems, showCheckbox: true, dndEnabled: true, disableDoubleClickTitle: true, onUpdateItem: (actionData, refComponent) => {
                const [, nextItemsJson] = actionData.itemJsons;
                const itemsInList = [...nextItemsJson];
                const newItemConfig = [];
                if (actionData.updateType === TreeItemActionType.HandleCheckboxChanged) {
                    // 1.update enable/disable
                    props.items.forEach((item) => {
                        itemsInList.forEach((listItem) => {
                            const key = listItem.itemKey;
                            if (item.id === key) {
                                item = item.setIn(['enable'], listItem.itemStateChecked);
                                newItemConfig.push(item);
                            }
                        });
                    });
                }
                else if (actionData.updateType === TreeItemActionType.HandleDidDrop) {
                    // 2.reorder list
                    itemsInList.forEach((item) => {
                        const key = item.itemKey;
                        const foundIdx = props.items.findIndex((item) => {
                            return item.id === key;
                        });
                        if (foundIdx > -1) {
                            newItemConfig.push(props.items[foundIdx]);
                        }
                    });
                }
                props.onItemsChange(Immutable(newItemConfig));
            } })));
});
//# sourceMappingURL=items-selector.js.map