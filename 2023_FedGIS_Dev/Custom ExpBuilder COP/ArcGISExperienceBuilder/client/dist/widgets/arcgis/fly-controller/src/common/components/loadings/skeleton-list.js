/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
export default class SkeletonList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mapRoutesToListItems = () => {
            const listItems = [];
            for (let i = 0, len = this.props.placeholderNums; i < len; i++) {
                listItems.push({
                    itemKey: i.toString(),
                    itemStateCommands: [{
                            iconProps: () => ({ icon: null, size: 12, style: { opacity: 0 } })
                        }]
                });
            }
            return listItems;
        };
        this.getStyle = () => {
            return css `
    /* disable hover for skeleton-list */
    .skeleton-list .jimu-tree-main .jimu-tree-item .jimu-tree-item__body:hover {
      background-color: ${this.props.theme.colors.palette.light[500]};
    } `;
        };
        this.state = { listItems: [] };
    }
    componentDidMount() {
        this.setState({ listItems: this.mapRoutesToListItems() });
    }
    render() {
        return (jsx("div", { css: this.getStyle(), className: 'd-flex' },
            jsx(List, { size: 'sm', className: 'skeleton-list w-100', itemsJson: this.state.listItems, dndEnabled: false, isItemFocused: () => false, overrideItemBlockInfo: ( /* { itemBlockInfo } */) => {
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
                                                        name: TreeItemActionType.RenderOverrideItemMainLine,
                                                        children: [{
                                                                name: TreeItemActionType.RenderOverrideItemTitle
                                                            }, {
                                                                name: TreeItemActionType.RenderOverrideItemCommands
                                                            }]
                                                    }]
                                            }]
                                    }]
                            }]
                    };
                } })));
    }
}
//# sourceMappingURL=skeleton-list.js.map