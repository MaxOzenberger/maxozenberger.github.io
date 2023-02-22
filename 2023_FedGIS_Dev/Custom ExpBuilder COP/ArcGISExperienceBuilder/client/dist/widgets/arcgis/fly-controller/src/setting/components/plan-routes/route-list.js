/** @jsx jsx */
import { React, jsx, css, lodash, polished, uuidv1, defaultMessages as jimuCoreNls } from 'jimu-core';
import { Button, defaultMessages as jimuUiNls } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import nls from '../../translations/default';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import SkeletonList from '../../../common/components/loadings/skeleton-list';
import * as utils from '../../../common/utils/utils';
// resources
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import editOutlined from 'jimu-icons/svg/outlined/editor/edit.svg';
import trashOutlined from 'jimu-icons/svg/outlined/editor/trash.svg';
import visibleOutlined from 'jimu-icons/svg/outlined/application/visible.svg';
import invisibleOutlined from 'jimu-icons/svg/outlined/application/invisible.svg';
export class RouteList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleEdit = (idx) => {
            this.props.onRouteEdit({ routeUuid: idx });
        };
        // handleKeydown = (e: any, ref) => {
        //   if (e.key === 'Enter') {
        //     ref.current.blur();
        //   } else {
        //     return
        //   }
        // }
        this.handleAddRoute = () => {
            const autoNamingTmpl = this.props.intl.formatMessage({ id: 'plannedRoute', defaultMessage: nls.plannedRoute });
            const name = utils.getIncreasedNameByConfig(this.props.routeConfig.routes, autoNamingTmpl);
            const newRoute = {
                idx: uuidv1(),
                isInUse: true,
                type: null,
                records: [],
                displayName: name
            };
            this.props.onRouteAdd(newRoute, this.props.flyModeIdx);
        };
        this.handleRouteDelete = (idx) => {
            this.props.onRouteDelete({ routeUuid: idx });
        };
        this.handleToggleVisibility = (idx, visible) => {
            this.props.onRouteToggleVisibilityChange({ routeUuid: idx }, visible);
        };
        this.getStyle = (theme) => {
            return css `
      .records-list {
        border: 1px solid #888;
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: ${polished.rem(4)};
        .record-name-input {
          padding: 3px 0;
          width: 110px;
        }
      }
      .records-list:hover {
        cursor: pointer;
        background: ${theme.colors.secondary};
        border-left: 2px solid ${theme.colors.primary};
      }
      `;
        };
        this.mapRoutesToListItems = (routes) => {
            const editLabel = this.props.intl.formatMessage({ id: 'editRoute', defaultMessage: nls.editRoute });
            const deleteLabel = this.props.intl.formatMessage({ id: 'delete', defaultMessage: jimuCoreNls.delete });
            const clickToHideLabel = this.props.intl.formatMessage({ id: 'clickToHide', defaultMessage: jimuUiNls.clickToHide });
            const clickToShowLabel = this.props.intl.formatMessage({ id: 'clickToShow', defaultMessage: jimuUiNls.clickToShow });
            const listItems = routes === null || routes === void 0 ? void 0 : routes.map((route /*, keyIdx */) => {
                var _a;
                const isVisible = route.isInUse;
                return {
                    itemKey: route.idx,
                    itemStateTitle: (_a = route.displayName) !== null && _a !== void 0 ? _a : '',
                    itemStateCommands: [
                        {
                            label: editLabel,
                            iconProps: () => ({ icon: editOutlined }),
                            action: (data) => {
                                this.handleEdit(data.data.itemJsons[0].itemKey);
                            }
                        }, {
                            label: deleteLabel,
                            iconProps: () => ({ icon: trashOutlined }),
                            action: (data) => {
                                this.handleRouteDelete(data.data.itemJsons[0].itemKey);
                            }
                        }, {
                            label: clickToHideLabel,
                            collapsed: !isVisible,
                            iconProps: () => ({ icon: visibleOutlined }),
                            action: (data) => {
                                this.handleToggleVisibility(data.data.itemJsons[0].itemKey, false);
                            }
                        }, {
                            label: clickToShowLabel,
                            collapsed: isVisible,
                            iconProps: () => ({ icon: invisibleOutlined }),
                            action: (data) => {
                                this.handleToggleVisibility(data.data.itemJsons[0].itemKey, true);
                            }
                        }
                    ]
                };
            });
            return listItems;
        };
        this.state = {
            listItems: null
        };
    }
    componentDidMount() {
        var _a;
        this.setState({ listItems: this.mapRoutesToListItems((_a = this.props.routeConfig) === null || _a === void 0 ? void 0 : _a.routes) });
    }
    componentDidUpdate(prevProps, prevState) {
        var _a;
        if (!lodash.isDeepEqual(this.props.routeConfig, prevProps.routeConfig)) {
            this.setState({ listItems: this.mapRoutesToListItems((_a = this.props.routeConfig) === null || _a === void 0 ? void 0 : _a.routes) });
        }
    }
    render() {
        const { useMapWidgetIds, jimuMapView, theme, routeConfig } = this.props;
        const { listItems } = this.state;
        const newRouteLabel = this.props.intl.formatMessage({ id: 'newRoute', defaultMessage: nls.newRoute });
        const isShowList = utils.isDefined(useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) && (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) > 0;
        const isListLoading = utils.isDefined(jimuMapView) && utils.isDefined(routeConfig) && utils.isDefined(listItems);
        return (jsx(React.Fragment, null,
            jsx(SettingRow, null,
                jsx(Button, { className: 'w-100 d-flex align-items-center justify-content-center', disabled: !isListLoading, onClick: this.handleAddRoute },
                    jsx(PlusOutlined, { size: 's' }),
                    newRouteLabel)),
            jsx(SettingRow, null,
                jsx("div", { className: 'w-100', css: this.getStyle(theme) },
                    (isShowList && !isListLoading) &&
                        jsx(SkeletonList, { placeholderNums: 3, theme: this.props.theme }),
                    (isShowList && isListLoading) &&
                        jsx(List, { size: 'sm', className: 'w-100', itemsJson: listItems, dndEnabled: true, onUpdateItem: (actionData, refComponent) => {
                                if (actionData.updateType === TreeItemActionType.HandleDidDrop) {
                                    const [, nextItemsJson] = actionData.itemJsons;
                                    this.props.onRoutesOrderUpdate([...nextItemsJson]);
                                }
                            }, overrideItemBlockInfo: ( /* { itemBlockInfo } */) => {
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
                            } })))));
    }
}
//# sourceMappingURL=route-list.js.map