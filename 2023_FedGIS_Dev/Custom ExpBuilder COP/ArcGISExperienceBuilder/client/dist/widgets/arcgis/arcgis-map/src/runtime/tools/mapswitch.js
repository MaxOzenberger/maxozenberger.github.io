/** @jsx jsx */
import { css, jsx, polished, getAppStore, classNames, appActions } from 'jimu-core';
import { Icon } from 'jimu-ui';
import { BaseTool } from '../layout/base/base-tool';
import { MultiSourceMapContext } from '../components/multisourcemap-context';
import MapThumb from '../components/map-thumb';
export default class MapSwitch extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'MapSwitch';
        this.switchMap = () => { };
        this.getContent = (isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap, mapWidgetId, theme) => {
            const onClick = () => {
                getAppStore().dispatch(appActions.requestAutoControlMapWidget(mapWidgetId, mapWidgetId));
                switchMap();
            };
            if (isShowMapSwitchBtn) {
                if (this.props.isMobile) {
                    return (jsx("div", { className: 'exbmap-ui-tool esri-widget--button', onClick: onClick },
                        jsx(Icon, { width: 16, height: 16, className: 'exbmap-ui-tool-icon', icon: this.getIcon().icon })));
                }
                else {
                    const dsJsons = getAppStore().getState().appConfig.dataSources;
                    return (jsx("div", { className: 'mapswitch-map-tool', css: this.getStyle(), onClick: onClick },
                        jsx("div", { title: dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].label : null, className: classNames('mapthumb-item', { front: dataSourceIds[0] !== activeDataSourceId }, { back: dataSourceIds[0] === activeDataSourceId }) },
                            jsx(MapThumb, { mapItemId: dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].itemId : null, portUrl: dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].portalUrl : null, theme: theme })),
                        jsx("div", { title: dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].label : null, className: classNames('mapthumb-item', { front: dataSourceIds[1] !== activeDataSourceId }, { back: dataSourceIds[1] === activeDataSourceId }) },
                            jsx(MapThumb, { mapItemId: dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].itemId : null, portUrl: dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].portalUrl : null, theme: theme }))));
                }
            }
            else {
                return null;
            }
        };
        this.getIconContent = (isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap) => {
            if (isShowMapSwitchBtn) {
                this.switchMap = switchMap;
                return super.render();
            }
            else {
                return null;
            }
        };
    }
    static getIsNeedSetting() {
        return false;
    }
    getStyle() {
        return css `
      width: ${polished.rem(68)};
      height: ${polished.rem(52)};
      cursor: pointer;
      position: relative;

      .mapthumb-item {
        position: absolute;
        width: ${polished.rem(64)};
        height: ${polished.rem(48)};
        transition: bottom 0.5s, left 0.5s, top 0.5s, right 0.5s, z-index 0.5s;
      }

      .front {
        z-index: 1;
        bottom: 0;
        left: 0;
      }

      .back {
        z-index: 0;
        top: 0;
        right: 0;
      }
    `;
    }
    getTitle() {
        return 'MapSwitch';
    }
    getIcon() {
        return {
            icon: require('../assets/icons/exchange.svg'),
            onIconClick: () => {
                this.switchMap();
            }
        };
    }
    getExpandPanel() {
        if (this.props.toolJson.isOnlyExpanded) {
            return (jsx(MultiSourceMapContext.Consumer, null, ({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap, mapWidgetId, theme }) => (this.getContent(isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap, mapWidgetId, theme))));
        }
        else {
            return null;
        }
    }
    render() {
        if (this.props.toolJson.isOnlyExpanded) {
            return super.render();
        }
        else {
            return (jsx(MultiSourceMapContext.Consumer, null, ({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap }) => (this.getIconContent(isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap))));
        }
    }
}
//# sourceMappingURL=mapswitch.js.map