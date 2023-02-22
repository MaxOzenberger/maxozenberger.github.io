/** @jsx jsx */
import { React, jsx, lodash, css, defaultMessages as jimuCoreNls } from 'jimu-core';
import { ControllerMode } from '../../../../common/fly-facade/controllers/base-fly-controller';
import nls from '../../../translations/default';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { isDefined } from '../../../../common/utils/utils';
// resources
import editOutlined from 'jimu-icons/svg/outlined/editor/edit.svg';
import playCircleOutlined from 'jimu-icons/svg/outlined/editor/play-circle.svg';
import stopCircleOutlined from 'jimu-icons/svg/outlined/editor/stop-circle.svg';
import trashOutlined from 'jimu-icons/svg/outlined/editor/trash.svg';
import pinEsriOutlined from 'jimu-icons/svg/outlined/gis/pin-esri.svg';
import polylineOutlined from 'jimu-icons/svg/outlined/gis/polyline.svg';
export class RecordList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getStyle = () => {
            return css `
      .record-list {
        .is-available{
        }
        .not-available{
          background-color: red;
        }
      }
      `;
        };
        this.handleRecordEdit = (idx) => {
            this.props.onRecordEdit({ routeUuid: null, recordUuid: idx });
        };
        this.handleRecordPreview = (idx) => {
            this.props.onRecordPreview({ routeUuid: null, recordUuid: idx });
        };
        this.handlePauseRecordPreview = (idx) => {
            // const avoidTrigger = false;
            this.props.onPauseRecordPreview({ routeUuid: null, recordUuid: idx });
        };
        this.handleRecordDelete = (idx) => {
            this.props.onRecordDelete({ routeUuid: null, recordUuid: idx });
        };
        this.mapRoutesToListItems = (records) => {
            // const pointStyleLabel = this.props.intl.formatMessage({ id: 'pointStyle', defaultMessage: nls.pointStyle });
            // const pathStyleLabel = this.props.intl.formatMessage({ id: 'pathStyle', defaultMessage: nls.pathStyle });
            const editLabel = this.props.intl.formatMessage({ id: 'editElement', defaultMessage: nls.editElement });
            const previewLabel = this.props.intl.formatMessage({ id: 'previewElement', defaultMessage: nls.previewElement });
            const stopLabel = this.props.intl.formatMessage({ id: 'stopPreview', defaultMessage: nls.stopPreview });
            const deleteLabel = this.props.intl.formatMessage({ id: 'delete', defaultMessage: jimuCoreNls.delete });
            const listItems = records === null || records === void 0 ? void 0 : records.map((record /*, keyIdx */) => {
                // const isAbleToPlay = this.props.isRecordCanPlay && this.props.isRecordCanPlay(record);
                // const background = isAbleToPlay ? 'is-available' : 'not-available';//can play
                let headIcon;
                if (record.type === ControllerMode.Rotate) {
                    headIcon = { icon: pinEsriOutlined }; // title={pointStyleLabel}
                }
                else if (record.type === ControllerMode.Smoothed || record.type === ControllerMode.RealPath) {
                    headIcon = { icon: polylineOutlined }; // title={pathStyleLabel}
                }
                return {
                    itemStateIcon: headIcon,
                    itemKey: record.idx,
                    itemStateTitle: record.displayName,
                    itemStateDisabled: false,
                    itemStateCommands: [
                        {
                            label: editLabel,
                            iconProps: () => ({ icon: editOutlined }),
                            action: (data) => {
                                this.handleRecordEdit(data.data.itemJsons[0].itemKey);
                            }
                        }, {
                            label: previewLabel,
                            collapsed: false,
                            iconProps: () => ({ icon: playCircleOutlined }),
                            action: (data) => {
                                this.handleRecordPreview(data.data.itemJsons[0].itemKey);
                            }
                        }, {
                            label: stopLabel,
                            collapsed: true,
                            iconProps: () => ({ icon: stopCircleOutlined }),
                            action: (data) => {
                                this.handlePauseRecordPreview(data.data.itemJsons[0].itemKey);
                            }
                        }, {
                            label: deleteLabel,
                            iconProps: () => ({ icon: trashOutlined }),
                            action: (data) => {
                                this.handleRecordDelete(data.data.itemJsons[0].itemKey);
                            }
                        }
                    ]
                };
            });
            return listItems;
        };
        // switch play/pause btn state
        this.updateListItemsByPlayingInfo = () => {
            var _a;
            const listItems = (_a = this.state.listItems) === null || _a === void 0 ? void 0 : _a.map((item /*, keyIdx */) => {
                var _a;
                const { itemKey, itemStateCommands } = item;
                // isPlaying
                const isPlaying = (itemKey === ((_a = this.props.playingInfo) === null || _a === void 0 ? void 0 : _a.recordUuid));
                if (isPlaying) {
                    itemStateCommands[1].collapsed = true; // app-launch icon
                    itemStateCommands[2].collapsed = false; // record-stop icon
                }
                else {
                    itemStateCommands[1].collapsed = false;
                    itemStateCommands[2].collapsed = true;
                }
                // isTerrainLoaded
                item.itemStateDisabled = !this.props.isTerrainLoaded;
                return item;
            });
            this.setState({ listItems: listItems });
        };
        this.state = {
            listItems: null
        };
    }
    componentDidMount() {
        this.setState({ listItems: this.mapRoutesToListItems(this.props.records) }, () => {
            this.updateListItemsByPlayingInfo();
        });
    }
    componentDidUpdate(prevProps, prevState) {
        // update list
        if (!lodash.isDeepEqual(this.props.records, prevProps.records)) {
            this.setState({ listItems: this.mapRoutesToListItems(this.props.records) });
        }
        // update play/pause btn state
        if (this.props.playingInfo !== prevProps.playingInfo) {
            this.updateListItemsByPlayingInfo();
        }
        // isTerrainLoaded
        if (this.props.isTerrainLoaded !== prevProps.isTerrainLoaded) {
            this.updateListItemsByPlayingInfo();
        }
    }
    render() {
        return (isDefined(this.state.listItems) &&
            jsx("div", { css: this.getStyle() }, (isDefined(this.props.records) &&
                jsx("div", { className: 'record-list d-flex' },
                    jsx(List, { size: 'sm', className: 'w-100', itemsJson: this.state.listItems, dndEnabled: true, onUpdateItem: (actionData, refComponent) => {
                            if (actionData.updateType === TreeItemActionType.HandleDidDrop) {
                                const [, nextItemsJson] = actionData.itemJsons;
                                this.props.onRecordsOrderUpdate([...nextItemsJson]);
                            }
                        }, overrideItemBlockInfo: ({ itemBlockInfo }) => {
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
//# sourceMappingURL=record-list.js.map