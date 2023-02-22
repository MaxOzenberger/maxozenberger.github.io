/** @jsx jsx */
import { css, jsx, MutableStoreManager, getAppStore } from 'jimu-core';
import { ShowOnMapDataType } from 'jimu-arcgis';
import { Icon, Dropdown, DropdownMenu, DropdownButton, DropdownItem, defaultMessages } from 'jimu-ui';
import { BaseTool } from '../layout/base/base-tool';
import { MultiSourceMapContext } from '../components/multisourcemap-context';
export default class ClearActionData extends BaseTool {
    constructor(props) {
        super(props);
        this.toolName = 'ClearActionData';
        this.onIconClick = () => { };
        this.onDropDownToggle = () => {
            this.setState({ isOpen: !this.state.isOpen });
        };
        this.onActionItemClick = (evt, actionDataId, mapWidgetId) => {
            var _a;
            this.setState({ isOpen: false });
            const showOnMapDatas = (_a = MutableStoreManager.getInstance().getStateValue([mapWidgetId])) === null || _a === void 0 ? void 0 : _a.showOnMapDatas;
            if (showOnMapDatas) {
                delete showOnMapDatas[actionDataId];
                MutableStoreManager.getInstance().updateStateValue(mapWidgetId, 'showOnMapDatas', showOnMapDatas);
            }
        };
        this.getContent = (isShowClearShowOnMapDataBtn, mapWidgetId) => {
            if (isShowClearShowOnMapDataBtn) {
                return (jsx("div", { css: this.getStyle(), title: this.getTitle() },
                    jsx(Dropdown, { direction: 'down', size: 'sm', toggle: this.onDropDownToggle, isOpen: this.state.isOpen },
                        jsx(DropdownButton, { icon: true, arrow: false, size: 'sm', type: 'default' },
                            jsx(Icon, { size: 16, className: 'exbmap-ui-tool-icon', icon: this.getIcon().icon })),
                        jsx(DropdownMenu, null, this.getShowOnMapDatas(mapWidgetId).map((entry, index) => this.createActionDataItem(entry[0], entry[1].title, mapWidgetId, index))))));
            }
            else {
                return null;
            }
        };
        this.state = { isOpen: false };
    }
    static getIsNeedSetting() {
        return false;
    }
    getStyle() {
        return css `
      .jimu-dropdown {
        display: flex;
        .icon-btn {
          padding: 7px;
          border-radius: 0;
        }
      }
    `;
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'clearResults', defaultMessage: defaultMessages.clearResults });
    }
    getIcon() {
        return {
            icon: require('jimu-icons/svg/outlined/editor/trash.svg'),
            onIconClick: () => {
                this.onIconClick();
            }
        };
    }
    createActionDataItem(actionDataId, actionDataTitle, mapWidgetId, key) {
        return (jsx(DropdownItem, { key: key, header: false, onClick: e => this.onActionItemClick(e, actionDataId, mapWidgetId) }, actionDataTitle));
    }
    getShowOnMapDatas(mapWidgetId) {
        var _a;
        const showOnMapDatas = ((_a = MutableStoreManager.getInstance().getStateValue([mapWidgetId])) === null || _a === void 0 ? void 0 : _a.showOnMapDatas) || {};
        return Object.entries(showOnMapDatas).filter(entry => {
            // There is no jimuMapViewId while generating the action data if the map widget hasn't been loaded in the another page/view,
            // use a default jimuMapViewId to show data.
            let jimuMapViewId = entry[1].jimuMapViewId;
            if (!jimuMapViewId && entry[1].mapWidgetId === mapWidgetId) {
                const jimuMapViewsInfo = getAppStore().getState().jimuMapViewsInfo;
                jimuMapViewId = Object.keys(jimuMapViewsInfo || {}).find(viewId => jimuMapViewsInfo[viewId].mapWidgetId === mapWidgetId);
            }
            return (jimuMapViewId === this.props.jimuMapView.id && entry[1].type === ShowOnMapDataType.DataAction);
        });
    }
    getExpandPanel() {
        // return (
        //  <div className='exbmap-ui-tool esri-widget--button'>
        //    <Icon width={16} height={16} className='exbmap-ui-tool-icon' icon={this.getIcon().icon} />
        //  </div>
        // )
        return (jsx(MultiSourceMapContext.Consumer, null, ({ isShowClearShowOnMapDataBtn, mapWidgetId }) => (this.getContent(isShowClearShowOnMapDataBtn, mapWidgetId))));
    }
}
//# sourceMappingURL=clear-action-data.js.map