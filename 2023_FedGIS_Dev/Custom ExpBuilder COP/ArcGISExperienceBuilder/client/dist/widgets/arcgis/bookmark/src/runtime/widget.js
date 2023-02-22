/** @jsx jsx */
import { classNames, React, css, jsx, polished, defaultMessages as jimuCoreMessages, AppMode, utils, appActions, TransitionContainer, getAppStore, BrowserSizeMode } from 'jimu-core';
import { Button, Card, CardBody, TextInput, ImageWithParam, NavButtonGroup, Select, ImageFillMode, defaultMessages as jimuUIDefaultMessages, Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'jimu-ui';
import { TemplateType, PageStyle, DirectionType, DisplayType, Status, ImgSourceType } from '../config';
import defaultMessages from './translations/default';
import { Fragment } from 'react';
import { JimuMapViewComponent, loadArcGISJSAPIModules } from 'jimu-arcgis';
import { LayoutEntry, ViewportVisibilityContext, ViewVisibilityContext } from 'jimu-layouts/layout-runtime';
import { versionManager } from '../version-manager';
import { TextDotsOutlined } from 'jimu-icons/outlined/editor/text-dots';
import { PlayCircleFilled } from 'jimu-icons/filled/editor/play-circle';
import { PauseOutlined } from 'jimu-icons/outlined/editor/pause';
import { PinOutlined } from 'jimu-icons/outlined/application/pin';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
import { RightOutlined } from 'jimu-icons/outlined/directional/right';
import { LeftOutlined } from 'jimu-icons/outlined/directional/left';
import { TrashFilled } from 'jimu-icons/filled/editor/trash';
const AUTOPLAY_DURATION = 1000;
export class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Graphic = null;
        this.GraphicsLayer = null;
        this.Extent = null;
        this.Viewpoint = null;
        this.Basemap = null;
        this.autoOffCondition = prevProps => {
            var _a, _b;
            const { config, appMode, browserSizeMode } = this.props;
            const { pageStyle, autoPlayAllow, autoInterval, autoLoopAllow } = config;
            const sizeModeChange = browserSizeMode !== prevProps.browserSizeMode;
            const autoSettingChange = autoInterval !== ((_a = prevProps.config) === null || _a === void 0 ? void 0 : _a.autoInterval) ||
                autoLoopAllow !== ((_b = prevProps.config) === null || _b === void 0 ? void 0 : _b.autoLoopAllow);
            return (appMode === AppMode.Design ||
                pageStyle === PageStyle.Scroll ||
                !autoPlayAllow ||
                autoSettingChange ||
                sizeModeChange);
        };
        this.getRuntimeUuid = () => {
            const { id, mapWidgetId } = this.props;
            const runtimeUuid = utils.getLocalStorageAppKey();
            return `${runtimeUuid}-${id}-${mapWidgetId || 'default'}-RtBmArray`;
        };
        this.settingLayout = () => {
            const { layoutId, layoutItemId, id, selectionIsSelf } = this.props;
            const { isSetLayout } = this.state;
            if (layoutId && id && layoutItemId && !isSetLayout && selectionIsSelf) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', {
                    layoutId,
                    layoutItemId
                }));
                this.setState({ isSetLayout: true });
            }
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.isEditing = () => {
            const { appMode, config, selectionIsSelf, selectionIsInSelf } = this.props;
            if (!window.jimuConfig.isInBuilder)
                return false;
            return ((selectionIsSelf || selectionIsInSelf) &&
                window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                config.isTemplateConfirm);
        };
        this.handleRuntimeAdd = () => {
            this.rtBookmarkId++;
            const { jimuMapView } = this.state;
            if (!jimuMapView)
                return;
            const view = jimuMapView.view;
            const { appMode, id } = this.props;
            if (appMode === AppMode.Run) {
                const allLayers = view.map.layers.toArray();
                const opLayersArray = JSON.parse(JSON.stringify(view.map)).operationalLayers;
                const layersArray = [];
                allLayers.forEach(layer => {
                    for (const index in opLayersArray) {
                        const item = opLayersArray[index];
                        if (layer.id === item.id) {
                            layersArray.push(layer);
                            break;
                        }
                    }
                });
                const layersConfig = this.getLayersConfig(layersArray);
                const newBookmarkId = `RtBm-${utils.getUUID()}`;
                const bookmark = {
                    id: newBookmarkId,
                    name: `${this.formatMessage('_widgetLabel')}(${this.rtBookmarkId})`,
                    title: `${this.formatMessage('_widgetLabel')}-${this.rtBookmarkId}`,
                    type: view.type,
                    extent: view.extent.toJSON(),
                    viewpoint: view.viewpoint.toJSON(),
                    showFlag: true,
                    runTimeFlag: true,
                    mapViewId: jimuMapView.id,
                    mapDataSourceId: jimuMapView.dataSourceId,
                    layersConfig
                };
                const runtimeBmId = this.getRuntimeUuid();
                const runtimeBookmarkArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
                utils.setLocalStorage(runtimeBmId, JSON.stringify(runtimeBookmarkArray.concat(`${id}-${newBookmarkId}`)));
                utils.setLocalStorage(`${id}-${newBookmarkId}`, JSON.stringify(bookmark));
                this.setState({
                    runtimeBmArray: runtimeBookmarkArray.concat(`${id}-${newBookmarkId}`)
                });
            }
        };
        this.getLayersConfig = layersArray => {
            const layersConfig = {};
            const recursion = (array, config) => {
                array.forEach(layer => {
                    config[layer.id] = { layers: {} };
                    const visibleFalg = (layer === null || layer === void 0 ? void 0 : layer.visibility) === undefined
                        ? !!(layer === null || layer === void 0 ? void 0 : layer.visible)
                        : false;
                    config[layer.id].visibility = visibleFalg;
                    const children = layer.layers || layer.sublayers || layer.allSublayers;
                    if (children && children.length > 0) {
                        recursion(children, config[layer.id].layers);
                    }
                });
                return config;
            };
            return recursion(layersArray, layersConfig);
        };
        this.showLayersConfig = (layersArray, layersConfig, operationalLayers = [], mapDsChange = false) => {
            if (mapDsChange)
                return;
            const recursion = (array, config) => {
                array.forEach(layer => {
                    var _a, _b, _c;
                    // The Bookmark layer displays by default. Map layers and other map operations layers,
                    // if the value of visibility is not available in config, it will not be displayed by default.
                    const index = operationalLayers.findIndex(operLayer => operLayer.id === layer.id);
                    const defaultVision = !(index > -1);
                    layer.visible =
                        ((_a = config[layer.id]) === null || _a === void 0 ? void 0 : _a.visibility) === undefined
                            ? defaultVision
                            : (_b = config[layer.id]) === null || _b === void 0 ? void 0 : _b.visibility;
                    const children = layer.layers || layer.sublayers || layer.allSublayers;
                    const subConfig = (_c = config === null || config === void 0 ? void 0 : config[layer.id]) === null || _c === void 0 ? void 0 : _c.layers;
                    if (children &&
                        children.length > 0 &&
                        subConfig &&
                        Object.keys(subConfig).length > 0) {
                        recursion(children.toArray(), subConfig);
                    }
                });
            };
            recursion(layersArray, layersConfig);
        };
        this.showMapOrgLayer = (layersArray, visibleLayers) => {
            const recursion = (array, visibleArray) => {
                array.forEach(layer => {
                    for (const index in visibleArray) {
                        const item = visibleArray[index];
                        layer.visible = false;
                        if (layer.id === item.id) {
                            layer.visible = true;
                            break;
                        }
                    }
                    if (layer.layers && layer.layers.length > 0) {
                        recursion(layer.layers.toArray(), visibleArray);
                    }
                });
            };
            recursion(layersArray, visibleLayers);
        };
        this.onViewBookmark = (item) => {
            var _a, _b;
            if (!item)
                return;
            const { jimuMapView, viewGroup } = this.state;
            const { id, useMapWidgetIds } = this.props;
            const activeBookmarkId = ((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.stateProps) === null || _b === void 0 ? void 0 : _b.activeBookmarkId) || 0;
            if (item && !item.runTimeFlag && activeBookmarkId !== item.id) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'activeBookmarkId', item.id));
            }
            // Apply for control of the Map, to turn off other widget's control
            if (useMapWidgetIds && useMapWidgetIds.length !== 0) {
                getAppStore().dispatch(appActions.requestAutoControlMapWidget(useMapWidgetIds[0], id));
            }
            // Either go directly to view or view after the switch of the map
            if (jimuMapView) {
                if (item && jimuMapView.dataSourceId !== item.mapDataSourceId) {
                    viewGroup &&
                        viewGroup.switchMap().then(() => {
                            this.viewBookmark(item);
                        });
                }
                else {
                    this.viewBookmark(item);
                }
            }
        };
        this.isNumber = (n) => {
            return !isNaN(parseFloat(n)) && isFinite(n) && Object.prototype.toString.call(n) === '[object Number]';
        };
        this.viewBookmark = (item) => {
            var _a, _b;
            const { appMode, config } = this.props;
            const { jimuMapView } = this.state;
            const { extent, viewpoint } = item;
            const gotoOpts = { duration: AUTOPLAY_DURATION };
            if (appMode === AppMode.Run) {
                if (jimuMapView && jimuMapView.view) {
                    jimuMapView.view.type === '3d'
                        ? jimuMapView.view.goTo({ target: this.Viewpoint.fromJSON(viewpoint) }, gotoOpts)
                        : jimuMapView.view.goTo({ extent: this.Extent.fromJSON(extent) }, gotoOpts);
                    if (item.baseMap) {
                        jimuMapView.view.map.basemap = this.Basemap.fromJSON(item.baseMap);
                    }
                    // map ground transparency
                    const itemTransparency = (_a = item === null || item === void 0 ? void 0 : item.ground) === null || _a === void 0 ? void 0 : _a.transparency;
                    if ((item === null || item === void 0 ? void 0 : item.ground) && this.isNumber(itemTransparency)) {
                        jimuMapView.view.map.ground.opacity = ((100 - itemTransparency) / 100);
                    }
                    else {
                        jimuMapView.view.map.ground.opacity = this.mapOpacity;
                    }
                    const layersArray = jimuMapView.view.map.layers.toArray();
                    const operationalLayers = (_b = JSON.parse(JSON.stringify(jimuMapView.view.map))) === null || _b === void 0 ? void 0 : _b.operationalLayers;
                    // This variable indicates whether the current map is the map for which the bookmark corresponds.
                    // If it is not, the variable is true, need to keep the layer attribute of the map itself.
                    const mapDsChange = jimuMapView.dataSourceId !== item.mapDataSourceId;
                    item.mapOriginFlag
                        ? this.showMapOrgLayer(layersArray, item.visibleLayers)
                        : this.showLayersConfig(layersArray, item.layersConfig, operationalLayers, mapDsChange);
                    // repaint graphics to map widget
                    const graphicsExist = item.graphics && item.graphics.length > 0;
                    if (!this.graphicsLayerCreated[jimuMapView.id]) {
                        const timeStamp = (new Date().getTime());
                        const bookmarkGraphicsLayerId = `bookmark-layer-${jimuMapView.id}-${timeStamp}`;
                        const layer = new this.GraphicsLayer({
                            id: bookmarkGraphicsLayerId,
                            listMode: 'hide',
                            title: this.formatMessage('graphicLayer'),
                            elevationInfo: { mode: 'relative-to-scene' }
                        });
                        if (graphicsExist) {
                            item.graphics.forEach(graphic => {
                                layer.graphics.push(this.Graphic.fromJSON(graphic));
                            });
                        }
                        jimuMapView.view.map.add(layer);
                        this.graphicsPainted[jimuMapView.id] = {};
                        this.graphicsPainted[jimuMapView.id][item.id] = true;
                        this.graphicsLayerId[jimuMapView.id] = layer.id;
                        this.graphicsLayerCreated[jimuMapView.id] = true;
                    }
                    else {
                        const graphicsLayer = jimuMapView.view.map.findLayerById(this.graphicsLayerId[jimuMapView.id]);
                        if (config.displayType === DisplayType.Selected) {
                            // Only selected
                            graphicsLayer === null || graphicsLayer === void 0 ? void 0 : graphicsLayer.removeAll();
                            if (graphicsExist && graphicsLayer) {
                                item.graphics.forEach(graphic => {
                                    graphicsLayer.graphics.push(this.Graphic.fromJSON(graphic));
                                });
                            }
                        }
                        else {
                            // See all (Note: Already drawed repaint after edit)
                            if (!this.graphicsPainted[jimuMapView.id][item.id]) {
                                if (graphicsExist) {
                                    item.graphics.forEach(graphic => {
                                        graphicsLayer.graphics.push(this.Graphic.fromJSON(graphic));
                                    });
                                }
                                this.graphicsPainted[jimuMapView.id][item.id] = true;
                            }
                            else {
                                // remove already drawed and repaint after edit
                                if (graphicsExist) {
                                    item.graphics.forEach(toMoveGraphic => {
                                        const toRemoveGraphic = graphicsLayer.graphics.find(oldGraphic => oldGraphic.attributes.id === toMoveGraphic.attributes.id);
                                        graphicsLayer.remove(toRemoveGraphic);
                                    });
                                    item.graphics.forEach(graphic => {
                                        graphicsLayer.graphics.push(this.Graphic.fromJSON(graphic));
                                    });
                                }
                            }
                        }
                    }
                }
            }
        };
        this.getStyle = (theme) => {
            const { id, appMode, config } = this.props;
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            return css `
      ${'&.bookmark-widget-' + id} {
        overflow: ${window.jimuConfig.isInBuilder && appMode !== AppMode.Run
                ? 'hidden'
                : 'auto'};
        height: 100%;
        width: 100%;
        .bookmark-title-height{
          height: 45px;
        }
        .bookmark-list-height {
          height: calc(100% - 45px);
          overflow-y: ${window.jimuConfig.isInBuilder && appMode !== AppMode.Run
                ? 'hidden !important'
                : 'auto'};
        }
        .bookmark-title {
          flex-grow: 1;
          padding: 0 15px;
          line-height: 45px;
          font-size: ${polished.rem(16)};
        }
        .bookmark-btn-container {
          width: 32px;
          height: 32px;
        }
        .bookmark-btn {
          font-weight: bold;
          font-size: ${polished.rem(12)};
        }
        .bookmark-view-auto {
          overflow-y: ${window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                !customType.includes(config.templateType)
                ? 'hidden'
                : 'auto'};
        }
        .gallery-card-add {
          cursor: pointer;
          min-width: 200px;
          height: 189px;
          display: grid;
          border: 1px solid ${theme.colors.secondary};
          background: ${theme.colors.white};
          margin: ${config.direction === DirectionType.Horizon
                ? polished.rem(12)
                : polished.rem(16)};
        }
        .card-add {
          cursor: pointer;
          height: 159px;
          display: inline-flex;
          border: 1px solid ${theme.colors.palette.light[400]};
          background: ${theme.colors.white};
          width: 150px;
          margin: 15px 10px;
          position: relative;
          .add-placeholder {
            height: 120px;
          }
        }
        .list-add {
          cursor: pointer;
          height: 37px;
          display: inline-flex;
          border: 1px solid ${theme.colors.palette.light[400]};
          background: ${theme.colors.white};
          width: calc(100% - 30px);
          margin: 0 15px 15px;
          position: relative;
        }
        .gallery-add-icon {
          position: relative;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin-top: -${polished.rem(10)};
          margin-left: -${polished.rem(10)};
        }
        .bookmark-container {
          ${config.templateType !== TemplateType.Card &&
                config.templateType !== TemplateType.List &&
                'height: 100%'};
          width: 100%;
          color: ${theme.colors.black};
          .bookmark-runtimeSeparator {
            margin: 10px 15px 15px;
            border: 1px dashed ${theme.colors.secondary};
          }
          .widget-card-content {
            padding: 8px 9px !important;
          }
          .bookmark-card-col {
            width: 170px;
            padding: 10px 10px 0;
            position: relative;
            .widget-card-image-inner {
              width: 148px;
              height: 120px;
            }
            .card-inner {
              transition: all 0.5s;
            }
          }
          .bookmark-list-col {
            padding: ${polished.rem(8)} 0;
            align-items: center !important;
            margin: 8px 15px 0;
          }
          .bookmark-pointer {
            cursor: pointer;
            &:hover {
              background: ${theme.colors.palette.light[200]};
            }
          }
          .bookmark-only-pointer {
            cursor: pointer;
          }
          .bookmark-custom-pointer {
            cursor: pointer;
            border: 1px solid ${theme.colors.light};
            ${config.direction === DirectionType.Vertical &&
                'position: absolute;'}
            ${config.direction === DirectionType.Vertical &&
                'width: calc(100% - 40px) !important;'}
            ${config.direction === DirectionType.Vertical &&
                `height: calc(100% - ${config.space}px) !important;`}
          }
          .layout-height{
            height: ${config.pageStyle === PageStyle.Paging
                ? 'calc(100% - 49px)'
                : '100%'} !important;
          }
          .border-none {
            border: none !important;
          }
          .runtime-bookmarkCard {
            .runtimeBookmarkCard-upload,
            .runtimeBookmarkCard-operation {
              display: none;
            }
            &:hover {
              .runtimeBookmarkCard-operation {
                display: block;
                position: absolute;
                right: 10px;
                background: ${theme.colors.secondary};
                opacity: 0.9;
              }
              .runtimeBookmarkCard-upload {
                display: block;
                position: absolute;
                right: 10px;
                bottom: 48px;
                background: ${theme.colors.secondary};
                opacity: 0.9;
              }
            }
          }
          .runtime-bookmarkList {
            display: inline-block !important;
            width: calc(100% - 30px);
            padding: ${polished.rem(4)} 0;
            margin: 0 15px 6px;
            align-items: center !important;
            .runtimeBookmarkList-operation {
              margin-right: 15px;
              display: none;
              height: 28px;
            }
            &:hover {
              .runtimeBookmarkList-operation {
                display: block;
              }
            }
          }
          .runtime-title-con {
            padding: 4px 0 !important;
          }
          .runtime-title {
            width: auto;
            border: none;
            background-color: transparent;
            display: inline-block !important;
            height: 29px;
            &:focus {
              border: 1px solid ${theme.colors.secondary};
            }
            &:hover {
              border: 1px solid ${theme.colors.secondary};
            }
          }
          .suspension-drop-btn{
            border-radius: 12px;
            border: 0;
          }
          .suspension-drop-placeholder{
            width: 32px;
          }
          .suspension-nav-placeholder1{
            height: 32px;
            width: 60px;
          }
          .suspension-nav-placeholder2{
            height: 24px;
            width: 100px;
          }
          .suspension-noborder-btn{
            border: 0;
            padding-left: ${polished.rem(7)};
          }
          .suspension-tools-top {
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 1;
            .jimu-dropdown {
              width: 32px;
            }
            .caret-icon {
              margin-left: ${polished.rem(2)};
            }
          }
          .suspension-top-number {
            position: absolute;
            top: 5px;
            right: 5px;
            background: ${theme.colors.white};
            border-radius: 10px;
            opacity: 0.8;
            width: 40px;
            text-align: center;
            z-index: 1;
          }
          .suspension-tools-middle {
            display: flex;
            width: 100%;
            padding: 0 ${polished.rem(8)};
            position: absolute;
            top: 50%;
            margin-top: ${config.direction === DirectionType.Horizon ? '-13px' : '-26px'};
            z-index: 1;
            .middle-nav-group button {
              background: ${theme.colors.white};
              opacity: 0.8;
              border-radius: 50%;
            }
          }
          .suspension-middle-play {
            position: absolute;
            right: 5px;
            bottom: 20px;
            z-index: 2;
          }
          .suspension-navbar {
            display: flex;
            width: 100%;
            padding: 0 ${polished.rem(8)};
            position: absolute;
            top: 50%;
            z-index: 1;
            .navbar-btn-pre{
              position: absolute;
              left: 5px;
              border-radius: 50%;
            }
            .navbar-btn-next{
              position: absolute;
              right: 5px;
              border-radius: 50%;
            }
          }
          .suspension-navbar-verticle {
            display: flex;
            height: 100%;
            position: absolute;
            top: 0;
            left: 50%;
            z-index: 1;
            margin-left: -13px;
            .navbar-btn-pre{
              position: absolute;
              top: 5px;
              border-radius: 50%;
            }
            .navbar-btn-next{
              position: absolute;
              bottom: 5px;
              border-radius: 50%;
            }
          }
          .suspension-tools-text {
            display: flex;
            width: 100%;
            padding: ${polished.rem(8)};
            position: absolute;
            border-top: 1px solid ${theme.colors.secondary};
            bottom: 0;
            z-index: 1;
            .jimu-dropdown {
              width: 32px;
            }
            .caret-icon {
              margin-left: ${polished.rem(2)};
            }
            .nav-btn-text {
              width: 100px;
            }
          }
          .suspension-tools-bottom {
            display: flex;
            width: 100%;
            padding: 0 ${polished.rem(8)};
            position: absolute;
            bottom: 5px;
            z-index: 1;
            .jimu-dropdown {
              width: 32px;
            }
            .caret-icon {
              margin-left: ${polished.rem(3)};
            }
            .scroll-navigator {
              .btn {
                border-radius: ${theme.borderRadiuses.circle};
              }
            }
            .nav-btn-bottom {
              width: ${config.autoPlayAllow ? '100px' : '60px'};
              border-radius: 16px;
              opacity: 0.8;
              background: ${theme.colors.white};
            }
            .number-count {
              border-radius: 10px;
              opacity: 0.8;
              background: ${theme.colors.white};
              width: 40px;
              text-align: center;
            }
          }
          .bookmark-slide {
            position: absolute;
            bottom: ${config.templateType === TemplateType.Slide3 ? '1px' : 'unset'};
            opacity: 0.8;
            background: ${theme.colors.white};
            width: calc(100% - 2px);
            z-index: 1;
            padding: ${polished.rem(8)};
            .bookmark-slide-title {
              font-size: ${polished.rem(16)};
              font-weight: bold;
            }
            .bookmark-slide-description {
              font-size: ${polished.rem(13)};
              max-height: 80px;
              overflow-y: auto;
            }
          }
          .bookmark-slide-gallery {
            position: absolute;
            bottom: ${config.templateType === TemplateType.Slide3 ? 0 : 'unset'};
            opacity: 0.8;
            background: ${theme.colors.white};
            width: calc(100% - 2px);
            z-index: 1;
            padding: ${polished.rem(8)};
            .bookmark-slide-title {
              font-size: ${polished.rem(16)};
              font-weight: bold;
            }
            .bookmark-slide-description {
              max-height: 60px;
              overflow-y: auto;
              font-size: ${polished.rem(13)};
            }
          }
          .bookmark-text {
            background: ${theme.colors.white};
            width: calc(100% - 2px);
            height: 60%;
            z-index: 1;
            padding: ${polished.rem(8)};
            .bookmark-text-title {
              font-size: ${polished.rem(16)};
              font-weight: bold;
            }
            .bookmark-text-description {
              height: calc(100% - 75px);
              overflow-y: auto;
              font-size: ${polished.rem(14)};
            }
          }
          .gallery-card {
            min-width: 200px;
            min-height: 180px;
            height: auto;
            position: relative;
            padding: ${config.direction === DirectionType.Horizon
                ? 'unset'
                : polished.rem(16)};
            margin: ${config.direction === DirectionType.Horizon
                ? polished.rem(12)
                : 'unset'};
            .gallery-card-inner {
              transition: all 0.5s;
              &:hover {
                transform: scale(1.05);
              }
            }
            .gallery-card-operation {
              display: none;
            }
            &:hover {
              .gallery-card-operation {
                display: block;
                position: absolute;
                top: ${config.direction === DirectionType.Horizon
                ? 0
                : polished.rem(20)};
                right: ${config.direction === DirectionType.Horizon
                ? 0
                : polished.rem(20)};
                background: ${theme.colors.light};
                opacity: 0.9;
              }
            }
            .gallery-img {
              width: 198px;
              height: 150px;
              display: inline-flex;
            }
            .gallery-img-vertical {
              width: 100%;
              height: 200px;
            }
          }
          .gallery-slide-card {
            ${config.direction === DirectionType.Horizon &&
                `width: ${config.itemWidth}px !important`};
            ${config.direction === DirectionType.Horizon
                ? `min-width: ${config.itemWidth}px !important`
                : `height: ${config.itemHeight}px !important`};
            height: calc(100% - ${polished.rem(32)});
            position: relative;
            margin: ${config.direction === DirectionType.Horizon
                ? `${polished.rem(16)} 0`
                : `0 ${polished.rem(16)}`};
            padding-top: ${config.direction === DirectionType.Horizon
                ? 'unset'
                : polished.rem(config.space)};
            ${config.direction === DirectionType.Horizon &&
                `margin-left: ${polished.rem(config.space)}`};
            &:first-of-type {
              margin-top: ${config.direction === DirectionType.Horizon
                ? polished.rem(16)
                : polished.rem(10)};
              padding-top: ${config.direction === DirectionType.Horizon
                ? 'unset'
                : polished.rem(10)};
            }
            &:last-of-type {
              ${config.direction === DirectionType.Horizon
                ? `padding-right: ${polished.rem(16)}`
                : `margin-bottom: ${polished.rem(20)}`};
            }
            .gallery-slide-inner {
              transition: all 0.5s;
              &:hover {
                transform: scale(1.05);
                .bookmark-slide-gallery {
                  width: 100%;
                }
              }
            }
          }
          .gallery-slide-lastItem {
            padding-right: 16px;
            margin-bottom: 16px;
          }
          .nav-bar {
            height: 48px;
            width: 280px;
            min-width: 280px;
            border: 1px solid ${theme.colors.secondary};
            background: ${theme.colors.light};
            padding: 0 ${polished.rem(8)};
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -24px;
            margin-left: -140px;
            .scroll-navigator {
              .btn {
                border-radius: ${theme.borderRadiuses.circle};
              }
            }
            .navbtn {
              width: 100px;
            }
          }
          .example-tips {
            margin-top: -10px;
            top: 50%;
            position: relative;
            text-align: center;
          }
        }
        .bookmark-container::-webkit-scrollbar {
          display: none;
        }
        .gallery-container {
          display: inline-flex !important;
          overflow-x: ${window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                !customType.includes(config.templateType)
                ? 'hidden'
                : 'auto'};
        }
        .gallery-container-ver {
          overflow-y: ${window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                !customType.includes(config.templateType)
                ? 'hidden'
                : 'auto'};
        }
        .horizon-line {
          margin: 10px 15px;
          border-bottom: 1px solid ${theme.colors.secondary};
        }
        .vertical-line {
          margin: 10px 15px;
          border-right: 1px solid ${theme.colors.secondary};
        }
        .vertical-border {
          padding-right: ${polished.rem(16)};
        }
        .default-img {
          width: 100%;
          height: 100%;
          background: ${theme.colors.palette.light[200]} url(${require('./assets/defaultimg.svg')}) center center no-repeat;
          background-size: 50% 50%;
        }
        .edit-mask {
          height: calc(100% - 49px);
          z-index: 2;
        }
      }
    `;
        };
        this.onActiveViewChange = (jimuMapView) => {
            var _a, _b, _c;
            const { appMode, config } = this.props;
            this.setState({ jimuMapView });
            // map default opacity
            this.mapOpacity = ((_c = (_b = (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.ground) === null || _c === void 0 ? void 0 : _c.opacity) || 1;
            if (jimuMapView &&
                appMode === AppMode.Run &&
                config.initBookmark &&
                !this.alreadyActiveLoading) {
                const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
                const bookmarks = config.displayFromWeb
                    ? config.bookmarks.concat(mapBookmarks)
                    : config.bookmarks;
                if (bookmarks.length > 0) {
                    this.alreadyActiveLoading = true;
                    jimuMapView.view.when(() => {
                        this.setState({
                            bookmarkOnViewId: bookmarks[0].id
                        });
                        this.onViewBookmark(bookmarks[0]);
                    });
                }
            }
        };
        this.handleViewGroupCreate = (viewGroup) => {
            this.setState({ viewGroup });
        };
        this.typedImgExist = bookmark => {
            var _a, _b;
            return bookmark.imgSourceType === ImgSourceType.Snapshot
                ? (_a = bookmark.snapParam) === null || _a === void 0 ? void 0 : _a.url
                : (_b = bookmark.imgParam) === null || _b === void 0 ? void 0 : _b.url;
        };
        this.renderSlideViewTop = item => {
            var _a, _b;
            const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
            const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
            return (jsx("div", { className: 'w-100 h-100 bookmark-pointer surface-1', onClick: () => this.onViewBookmark(item), key: item.id || `webmap-${item.name}` },
                jsx("div", { className: 'bookmark-slide' },
                    jsx("div", { className: 'bookmark-slide-title' }, item.name),
                    jsx("div", { className: 'bookmark-slide-description' }, item.description)),
                exist
                    ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                    : (jsx("div", { className: 'default-img' }))));
        };
        this.renderSlideViewText = item => {
            var _a, _b;
            const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
            const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
            return (jsx("div", { className: 'w-100 h-100 bookmark-only-pointer surface-1', onClick: () => this.onViewBookmark(item), key: item.id || `webmap-${item.name}` },
                jsx("div", { className: 'w-100', style: { height: '40%' } }, exist
                    ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                    : (jsx("div", { className: 'default-img' }))),
                jsx("div", { className: 'bookmark-text' },
                    jsx("div", { className: 'bookmark-text-title' }, item.name),
                    jsx("div", { className: 'bookmark-text-description' }, item.description))));
        };
        this.renderSlideViewBottom = item => {
            var _a, _b;
            const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
            const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
            return (jsx("div", { className: 'w-100 h-100 bookmark-pointer surface-1', onClick: () => this.onViewBookmark(item), key: item.id || `webmap-${item.name}` },
                exist
                    ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                    : (jsx("div", { className: 'default-img' })),
                jsx("div", { className: 'bookmark-slide' },
                    jsx("div", { className: 'bookmark-slide-title' }, item.name),
                    jsx("div", { className: 'bookmark-slide-description' }, item.description))));
        };
        this.renderCustomContents = item => {
            const { LayoutEntry } = this.state;
            const { layouts } = this.props;
            if (!item.layoutName)
                return (jsx("div", null));
            return (jsx("div", { className: 'w-100 h-100 bookmark-only-pointer surface-1', onClick: () => this.onViewBookmark(item), key: item.id },
                jsx(LayoutEntry, { isRepeat: true, layouts: layouts[item.layoutName], isInWidget: true, className: 'layout-height' })));
        };
        this.renderCustomExample = () => {
            const { LayoutEntry } = this.state;
            const { layouts } = this.props;
            if (!layouts[Status.Regular])
                return;
            return (jsx("div", { className: 'w-100 h-100 bookmark-only-pointer surface-1' },
                jsx(LayoutEntry, { isRepeat: true, layouts: layouts[Status.Regular], isInWidget: true, className: 'layout-height' })));
        };
        this.handleArrowChange = (previous) => {
            const { config } = this.props;
            const { jimuMapView } = this.state;
            const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
            const bookmarks = config.displayFromWeb
                ? config.bookmarks.concat(mapBookmarks)
                : config.bookmarks;
            const bookmarkCount = bookmarks.length;
            if (bookmarkCount === 0)
                return;
            const { bookmarkOnViewId } = this.state;
            let current = bookmarks.findIndex(x => x.id === bookmarkOnViewId) > -1
                ? bookmarks.findIndex(x => x.id === bookmarkOnViewId)
                : 0;
            if (current === bookmarkCount - 1 && !previous) {
                // the last one, click next
                current = 0;
            }
            else if (current === 0 && previous) {
                // the first one, click previous
                current = bookmarkCount - 1;
            }
            else if (previous && current > 0) {
                current--;
            }
            else if (!previous) {
                current++;
            }
            this.setState({ bookmarkOnViewId: bookmarks[current].id });
            this.onViewBookmark(bookmarks[current]);
        };
        this.handleOnViewChange = value => {
            const { appMode, config } = this.props;
            const { jimuMapView } = this.state;
            const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
            const bookmarks = config.displayFromWeb
                ? config.bookmarks.concat(mapBookmarks)
                : config.bookmarks;
            const current = bookmarks.findIndex(x => x.id === value) > -1
                ? bookmarks.findIndex(x => x.id === value)
                : 0;
            this.setState({ bookmarkOnViewId: value });
            if (appMode !== AppMode.Run)
                return;
            this.onViewBookmark(bookmarks[current]);
        };
        this.getBookmarksOptions = (bookmarks) => {
            const optionsArray = [];
            bookmarks.forEach(item => {
                optionsArray.push(jsx("option", { key: item.id, value: item.id }, item.name));
            });
            return optionsArray;
        };
        this.getBookmarksDropdownItems = (bookmarks) => {
            const { bookmarkOnViewId } = this.state;
            const optionsArray = [];
            bookmarks.forEach(item => {
                optionsArray.push(jsx(DropdownItem, { key: item.id, active: item.id === bookmarkOnViewId }, item.name));
            });
            return optionsArray;
        };
        this.handleAutoPlay = () => {
            const { config, useMapWidgetIds, id } = this.props;
            const { bookmarkOnViewId, autoPlayStart, playTimer, jimuMapView } = this.state;
            const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
            const bookmarks = config.displayFromWeb
                ? config.bookmarks.concat(mapBookmarks)
                : config.bookmarks;
            if (bookmarks.length === 0)
                return;
            // turn off the autoplay
            if (autoPlayStart) {
                if (playTimer)
                    clearInterval(playTimer);
                this.setState({
                    autoPlayStart: false,
                    playTimer: undefined
                });
                return;
            }
            // Apply for control of the Map, to turn off other widget's control
            if (useMapWidgetIds && useMapWidgetIds.length !== 0) {
                getAppStore().dispatch(appActions.requestAutoControlMapWidget(useMapWidgetIds[0], id));
            }
            // this.props.dispatch(appActions.autoplayActiveIdChanged(id));
            const { autoInterval, autoLoopAllow } = config;
            let index = bookmarks.findIndex(x => x.id === bookmarkOnViewId);
            // Other bookmarks change the bookmarkOnViewId, and then click directly on the autoplay of another bookmark.
            // And when the current is the last, click play, start play form the first one
            if (index === -1 || index === bookmarks.length - 1)
                index = 0;
            this.setState({ bookmarkOnViewId: bookmarks[index].id });
            this.onViewBookmark(bookmarks[index]);
            const autoplayTimer = setInterval(() => {
                index++;
                if (autoLoopAllow) {
                    if (index >= bookmarks.length)
                        index = 0;
                }
                else {
                    if (index >= bookmarks.length) {
                        clearInterval(autoplayTimer);
                        if (playTimer)
                            clearInterval(playTimer);
                        this.setState({
                            autoPlayStart: false,
                            playTimer: undefined
                        });
                        return;
                    }
                }
                this.setState({ bookmarkOnViewId: bookmarks[index].id });
                this.onViewBookmark(bookmarks[index]);
            }, autoInterval * 1000 + AUTOPLAY_DURATION);
            this.setState({
                autoPlayStart: true,
                playTimer: autoplayTimer
            });
        };
        this.renderBottomTools = (example) => {
            const { config } = this.props;
            const { jimuMapView } = this.state;
            const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
            const bookmarks = config.displayFromWeb
                ? config.bookmarks.concat(mapBookmarks)
                : config.bookmarks;
            const totalCount = bookmarks.length;
            const { bookmarkOnViewId, autoPlayStart } = this.state;
            let current = 1;
            if (example) {
                current = 0;
            }
            else {
                current =
                    bookmarks.findIndex(x => x.id === bookmarkOnViewId) > -1
                        ? bookmarks.findIndex(x => x.id === bookmarkOnViewId) + 1
                        : 1;
            }
            const typedNavbtnGrounp = (tempType) => {
                let navbtnGrounp;
                switch (tempType) {
                    case TemplateType.Slide1:
                        navbtnGrounp = (jsx("div", { className: 'suspension-tools-bottom align-items-center justify-content-around' },
                            bookmarks.length > 1
                                ? (jsx(Dropdown, { size: 'sm', activeIcon: true },
                                    jsx(DropdownButton, { arrow: false, icon: true, size: 'sm', type: 'default', className: 'suspension-drop-btn', title: this.formatMessage('bookmarkList') },
                                        jsx(TextDotsOutlined, { className: 'suspension-drop-btn' })),
                                    jsx(DropdownMenu, null, bookmarks.map(item => {
                                        const isActived = item.id === bookmarkOnViewId;
                                        return (jsx(DropdownItem, { key: item.id, active: isActived, onClick: () => this.handleOnViewChange(item.id) }, item.name));
                                    }))))
                                : (jsx("div", { className: 'suspension-drop-placeholder' })),
                            bookmarks.length > 1
                                ? (jsx(NavButtonGroup, { type: 'tertiary', vertical: false, onChange: this.handleArrowChange, className: 'nav-btn-bottom', previousTitle: this.formatMessage('previous'), nextTitle: this.formatMessage('next') },
                                    jsx("div", { className: 'bookmark-btn-container' }, config.autoPlayAllow && (jsx(Button, { icon: true, className: 'bookmark-btn', type: 'link', onClick: this.handleAutoPlay, title: this.formatMessage('autoPlay'), "data-testid": 'triggerAuto' }, autoPlayStart ? jsx(PauseOutlined, { className: 'mr-1', size: 'l' }) : jsx(PlayCircleFilled, { className: 'mr-1', size: 'l' }))))))
                                : (jsx("div", { className: 'suspension-nav-placeholder1' })),
                            jsx("span", { className: 'number-count' },
                                current,
                                "/",
                                totalCount)));
                        break;
                    case TemplateType.Slide2:
                    case TemplateType.Custom1:
                    case TemplateType.Custom2:
                        navbtnGrounp =
                            bookmarks.length > 1
                                ? (jsx("div", { className: 'suspension-tools-text align-items-center justify-content-around' },
                                    jsx(Dropdown, { size: 'sm', activeIcon: true },
                                        jsx(DropdownButton, { arrow: false, icon: true, size: 'sm', type: 'default', className: 'suspension-drop-btn', title: this.formatMessage('bookmarkList') },
                                            jsx(TextDotsOutlined, { className: 'suspension-drop-btn' })),
                                        jsx(DropdownMenu, null, bookmarks.map(item => {
                                            const isActived = item.id === bookmarkOnViewId;
                                            return (jsx(DropdownItem, { key: item.id, active: isActived, onClick: () => this.handleOnViewChange(item.id) }, item.name));
                                        }))),
                                    jsx(NavButtonGroup, { type: 'tertiary', vertical: false, onChange: this.handleArrowChange, className: 'nav-btn-text', previousTitle: this.formatMessage('previous'), nextTitle: this.formatMessage('next') },
                                        jsx("span", null,
                                            current,
                                            "/",
                                            totalCount)),
                                    jsx("div", { className: 'bookmark-btn-container' }, config.autoPlayAllow && (jsx(Button, { icon: true, className: 'bookmark-btn', type: 'link', onClick: this.handleAutoPlay, title: this.formatMessage('autoPlay') }, autoPlayStart ? jsx(PauseOutlined, { className: 'mr-1', size: 'l' }) : jsx(PlayCircleFilled, { className: 'mr-1', size: 'l' }))))))
                                : (jsx("div", { className: 'align-items-center' }));
                        break;
                    case TemplateType.Slide3:
                        navbtnGrounp = (jsx(Fragment, null,
                            jsx("div", { className: 'suspension-tools-top align-items-center justify-content-around' }, bookmarks.length > 1
                                ? (jsx(Dropdown, { size: 'sm', activeIcon: true },
                                    jsx(DropdownButton, { arrow: false, icon: true, size: 'sm', type: 'default', className: 'suspension-drop-btn', title: this.formatMessage('bookmarkList') },
                                        jsx(TextDotsOutlined, { className: 'suspension-drop-btn' })),
                                    jsx(DropdownMenu, null, bookmarks.map(item => {
                                        const isActived = item.id === bookmarkOnViewId;
                                        return (jsx(DropdownItem, { key: item.id, active: isActived, onClick: () => this.handleOnViewChange(item.id) }, item.name));
                                    }))))
                                : (jsx("div", { className: 'suspension-drop-placeholder' }))),
                            jsx("span", { className: 'suspension-top-number' },
                                current,
                                "/",
                                totalCount),
                            jsx("div", { className: 'suspension-tools-middle' }, bookmarks.length > 1 && (jsx(NavButtonGroup, { type: 'tertiary', vertical: false, onChange: this.handleArrowChange, className: 'middle-nav-group', previousTitle: this.formatMessage('previous'), nextTitle: this.formatMessage('next') }))),
                            config.autoPlayAllow && (jsx("div", { className: 'suspension-middle-play' },
                                jsx(Button, { icon: true, className: 'bookmark-btn', type: 'link', onClick: this.handleAutoPlay, title: this.formatMessage('autoPlay') }, autoPlayStart ? jsx(PauseOutlined, { className: 'mr-1', size: 30 }) : jsx(PlayCircleFilled, { className: 'mr-1', size: 30 }))))));
                        break;
                    default:
                }
                return navbtnGrounp;
            };
            return typedNavbtnGrounp(config.templateType);
        };
        this.renderSlideScroll = (bookmarks) => {
            const bookmarkGalleryList = bookmarks.map((item, index) => {
                var _a, _b;
                const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
                const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
                return (jsx("div", { className: 'gallery-slide-card', key: index },
                    jsx("div", { className: 'w-100 h-100 bookmark-pointer gallery-slide-inner surface-1', onClick: () => this.onViewBookmark(item) },
                        jsx("div", { className: 'bookmark-slide-gallery' },
                            jsx("div", { className: 'bookmark-slide-title' }, item.name),
                            jsx("div", { className: 'bookmark-slide-description' }, item.description)),
                        exist
                            ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                            : (jsx("div", { className: 'default-img' })))));
            });
            const lastItem = jsx("div", { className: 'gallery-slide-lastItem', key: 'last' });
            const scrollGalleryList = bookmarkGalleryList
                .asMutable({ deep: true })
                .concat(lastItem);
            return scrollGalleryList;
        };
        this.renderCustomScroll = (bookmarks) => {
            const { LayoutEntry } = this.state;
            const { layouts } = this.props;
            const bookmarkCustomList = bookmarks.map((item, index) => {
                return (jsx("div", { className: 'gallery-slide-card', key: index },
                    jsx("div", { className: 'w-100 h-100 bookmark-custom-pointer surface-1', onClick: () => this.onViewBookmark(item) },
                        jsx(LayoutEntry, { isRepeat: true, layouts: layouts[item.layoutName], isInWidget: true, className: 'layout-height' }))));
            });
            const lastItem = jsx("div", { className: 'gallery-slide-lastItem', key: 'last' });
            const scrollCustomList = bookmarkCustomList
                .asMutable({ deep: true })
                .concat(lastItem);
            return scrollCustomList;
        };
        this.scrollContainer = scrollParam => {
            this.containerRef.current.scrollBy(scrollParam);
        };
        this.handleScroll = (type = 'next') => {
            var _a;
            const appState = getAppStore().getState();
            const isRTL = (_a = appState === null || appState === void 0 ? void 0 : appState.appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
            const { config } = this.props;
            const { itemHeight: scrollHeight = 280, itemWidth: scrollWidth = 210, space = 0 } = config;
            const directionIsHorizon = config.direction === DirectionType.Horizon;
            if (this.containerRef.current && type === 'next') {
                const scrollParam = directionIsHorizon
                    ? {
                        top: 0,
                        left: isRTL ? -(scrollWidth + space) : scrollWidth + space,
                        behavior: 'smooth'
                    }
                    : {
                        top: scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    };
                this.scrollContainer(scrollParam);
            }
            else if (this.containerRef.current && type === 'previous') {
                const scrollParam = directionIsHorizon
                    ? {
                        top: 0,
                        left: isRTL ? scrollWidth + space : -(scrollWidth + space),
                        behavior: 'smooth'
                    }
                    : {
                        top: -scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    };
                this.scrollContainer(scrollParam);
            }
        };
        this.renderNavbar = (isHorizon) => {
            const { config } = this.props;
            return (jsx("div", { key: 'navBar', className: `${config.direction === DirectionType.Horizon
                    ? 'suspension-navbar'
                    : 'suspension-navbar-verticle'} align-items-center justify-content-between` },
                jsx(Button, { title: this.formatMessage('previous'), type: 'primary', size: 'sm', icon: true, onClick: () => this.handleScroll('previous'), className: 'navbar-btn-pre' }, isHorizon ? jsx(LeftOutlined, { autoFlip: true, size: 's' }) : jsx(UpOutlined, { autoFlip: true, size: 's' })),
                jsx(Button, { title: this.formatMessage('next'), type: 'primary', size: 'sm', icon: true, onClick: () => this.handleScroll('next'), className: 'navbar-btn-next' }, isHorizon ? jsx(RightOutlined, { autoFlip: true, size: 's' }) : jsx(DownOutlined, { autoFlip: true, size: 's' }))));
        };
        this.getMapBookmarks = (jimuMapView) => {
            var _a, _b;
            if (jimuMapView && (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId)) {
                const view = jimuMapView.view;
                // del the map
                if (!view)
                    return;
                const mapSource = (_a = jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map;
                // extra bookmark from map
                let extraBookmarks = [];
                if (view.type === '3d') {
                    extraBookmarks = ((_b = mapSource.presentation) === null || _b === void 0 ? void 0 : _b.slides)
                        ? JSON.parse(JSON.stringify(mapSource.presentation.slides))
                        : [];
                }
                else if (view.type === '2d') {
                    extraBookmarks = (mapSource === null || mapSource === void 0 ? void 0 : mapSource.bookmarks)
                        ? JSON.parse(JSON.stringify(mapSource.bookmarks))
                        : [];
                }
                return extraBookmarks.map((item, index) => {
                    var _a, _b;
                    item.id = `maporigin-${index}`;
                    item.runTimeFlag = true;
                    item.mapOriginFlag = true;
                    item.mapDataSourceId = jimuMapView.dataSourceId;
                    if ((_a = item.thumbnail) === null || _a === void 0 ? void 0 : _a.url) {
                        item.imgParam = { url: item.thumbnail.url };
                    }
                    else {
                        item.imgParam = {};
                    }
                    if ((_b = item.title) === null || _b === void 0 ? void 0 : _b.text) {
                        item.name = item.title.text;
                    }
                    item.imagePosition = ImageFillMode.Fill;
                    return item;
                });
            }
        };
        this.renderBookmarkList = (bookmarks) => {
            const { appMode, config, selectionIsSelf, selectionIsInSelf } = this.props;
            const { transitionInfo } = config;
            const { bookmarkOnViewId, autoPlayStart, jimuMapView } = this.state;
            // get ds bookmark
            const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
            if (config.displayFromWeb) {
                bookmarks = bookmarks.concat(mapBookmarks);
            }
            const currentIndex = bookmarks.findIndex(x => x.id === bookmarkOnViewId) > -1
                ? bookmarks.findIndex(x => x.id === bookmarkOnViewId)
                : 0;
            const previousIndex = currentIndex === 0 ? 1 : Math.max(0, currentIndex - 1);
            const directionIsHorizon = config.direction === DirectionType.Horizon;
            const slideType = [
                TemplateType.Slide1,
                TemplateType.Slide2,
                TemplateType.Slide3,
                TemplateType.Custom1,
                TemplateType.Custom2
            ];
            const usePreviewId = (selectionIsSelf || selectionIsInSelf) ? transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.previewId : null;
            const previewId = usePreviewId || null;
            const typedBookmarkList = (tempType) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let bookmarkList;
                switch (tempType) {
                    case TemplateType.Card:
                        bookmarkList = bookmarks.map((item, index) => {
                            var _a, _b;
                            const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
                            const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
                            return (jsx(Fragment, { key: index },
                                jsx("div", { className: 'd-inline-flex bookmark-card-col' },
                                    jsx(Card, { onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} card-inner surface-1` },
                                        jsx("div", { className: 'widget-card-image' },
                                            jsx("div", { className: 'widget-card-image-inner' }, exist
                                                ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                                                : (jsx("div", { className: 'default-img' })))),
                                        jsx(CardBody, { className: 'widget-card-content text-truncate' },
                                            jsx("span", { className: 'text-capitalize', title: item.name }, item.name))))));
                        });
                        break;
                    case TemplateType.List:
                        bookmarkList = bookmarks.map((item, index) => {
                            return (jsx("div", { key: index, onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} d-flex bookmark-list-col surface-1` },
                                jsx(PinOutlined, { className: 'ml-3' }),
                                jsx("div", { className: 'ml-2' }, item.name)));
                        });
                        break;
                    case TemplateType.Slide1:
                        const viewTopContents = bookmarks.map(item => this.renderSlideViewTop(item));
                        return (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_a = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _a === void 0 ? void 0 : _a.type, direction: (_b = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _b === void 0 ? void 0 : _b.direction, playId: previewId }, viewTopContents))
                                : (this.renderSlideScroll(bookmarks)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools()));
                    case TemplateType.Slide2:
                        const viewTextContents = bookmarks.map(item => this.renderSlideViewText(item));
                        return (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_c = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _c === void 0 ? void 0 : _c.type, direction: (_d = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _d === void 0 ? void 0 : _d.direction, playId: previewId }, viewTextContents))
                                : (this.renderSlideScroll(bookmarks)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools()));
                    case TemplateType.Slide3:
                        const viewContents = bookmarks.map(item => this.renderSlideViewBottom(item));
                        return (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_e = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _e === void 0 ? void 0 : _e.type, direction: (_f = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _f === void 0 ? void 0 : _f.direction, playId: previewId }, viewContents))
                                : (this.renderSlideScroll(bookmarks)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools()));
                    case TemplateType.Gallery:
                        const runtimeBmId = this.getRuntimeUuid();
                        const runtimeBookmarkArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
                        const bookmarkGalleryList = bookmarks.map((item, index) => {
                            var _a, _b;
                            const typeSnap = item.imgSourceType === ImgSourceType.Snapshot;
                            const exist = typeSnap ? (_a = item.snapParam) === null || _a === void 0 ? void 0 : _a.url : (_b = item.imgParam) === null || _b === void 0 ? void 0 : _b.url;
                            return (jsx("div", { className: 'gallery-card', key: index },
                                jsx(Card, { onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} gallery-card-inner surface-1` },
                                    jsx("div", { className: `widget-card-image bg-light-300 ${directionIsHorizon
                                            ? 'gallery-img'
                                            : 'gallery-img-vertical'}` }, exist
                                        ? (jsx(ImageWithParam, { imageParam: typeSnap ? item.snapParam : item.imgParam, altText: item.name, useFadein: true, imageFillMode: item.imagePosition }))
                                        : (jsx("div", { className: 'default-img' }))),
                                    jsx(CardBody, { className: 'widget-card-content text-truncate' },
                                        jsx("span", { className: 'text-capitalize', title: item.name }, item.name)))));
                        });
                        const runtimeGalleryList = runtimeBookmarkArray.map((rbmId, index) => {
                            const item = JSON.parse(utils.readLocalStorage(rbmId));
                            const titleTextInput = React.createRef();
                            return (jsx("div", { className: 'gallery-card', key: `RuntimeGallery-${index}` },
                                jsx(Card, { onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} gallery-card-inner surface-1` },
                                    jsx("div", { className: `widget-card-image bg-light-300 ${directionIsHorizon
                                            ? 'gallery-img'
                                            : 'gallery-img-vertical'}` },
                                        jsx("div", { className: 'default-img' })),
                                    jsx(CardBody, { className: 'widget-card-content text-truncate runtime-title-con' },
                                        jsx(TextInput, { className: 'runtime-title w-100', ref: titleTextInput, size: 'sm', title: item.name, defaultValue: item.name || '', onClick: evt => evt.stopPropagation(), onKeyDown: evt => this.handleKeydown(evt, titleTextInput), onAcceptValue: value => this.onRuntimeBookmarkNameChange(rbmId, value) }))),
                                jsx("span", { className: 'gallery-card-operation float-right' },
                                    jsx(Button, { title: this.formatMessage('deleteOption'), onClick: () => this.handleRuntimeDelete(rbmId), type: 'tertiary', icon: true },
                                        jsx(TrashFilled, { size: 's' })))));
                        });
                        const galleryAdd = config.runtimeAddAllow
                            ? (jsx(Fragment, { key: 'galleryAdd' },
                                jsx("div", { className: 'gallery-card-add', onClick: this.handleRuntimeAdd, title: this.formatMessage('addBookmark') },
                                    jsx("div", { className: 'gallery-add-icon' },
                                        jsx(PlusOutlined, { className: 'mr-1', size: 'l' }))),
                                jsx("div", { className: 'vertical-border' })))
                            : (jsx("div", { className: 'vertical-border', key: 'last' }));
                        const newList = bookmarkGalleryList
                            .asMutable({ deep: true })
                            .concat(runtimeGalleryList);
                        const galleryNavbar = this.renderNavbar(config.direction === DirectionType.Horizon);
                        newList.push(galleryAdd);
                        newList.push(galleryNavbar);
                        bookmarkList = newList;
                        break;
                    case TemplateType.Navigator:
                        const totalCount = config.bookmarks.length;
                        const current = config.bookmarks.findIndex(x => x.id === bookmarkOnViewId) > -1
                            ? config.bookmarks.findIndex(x => x.id === bookmarkOnViewId) + 1
                            : 1;
                        return (jsx("div", { className: 'nav-bar d-flex align-items-center justify-content-around' },
                            jsx(Select, { size: 'sm', value: bookmarkOnViewId, onChange: this.handleOnViewChange, style: { width: 32 } }, this.getBookmarksOptions(bookmarks)),
                            jsx(Button, { icon: true, className: 'bookmark-btn', type: 'tertiary', onClick: this.handleRuntimeAdd },
                                jsx(PlusOutlined, { className: 'mr-1', size: 'l' })),
                            jsx(NavButtonGroup, { type: 'tertiary', circle: true, vertical: false, onChange: this.handleArrowChange, className: 'navbtn' },
                                jsx("span", null,
                                    current,
                                    "/",
                                    totalCount)),
                            jsx(Button, { icon: true, className: 'bookmark-btn', type: 'tertiary', onClick: this.handleAutoPlay, disabled: !config.autoPlayAllow }, autoPlayStart ? jsx(PauseOutlined, { className: 'mr-1', size: 'l' }) : jsx(PlayCircleFilled, { className: 'mr-1', size: 'l' }))));
                    case TemplateType.Custom1:
                    case TemplateType.Custom2:
                        const isEditing = this.isEditing();
                        const customContents = bookmarks.map(item => this.renderCustomContents(item));
                        return (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_g = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _g === void 0 ? void 0 : _g.type, direction: (_h = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _h === void 0 ? void 0 : _h.direction, playId: previewId }, customContents))
                                : (this.renderCustomScroll(bookmarks)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools(),
                            !isEditing &&
                                config.pageStyle === PageStyle.Paging &&
                                appMode === AppMode.Design && (jsx("div", { className: 'edit-mask position-absolute w-100' }))));
                    default:
                }
                return bookmarkList;
            };
            const showGallery = config.templateType === TemplateType.Gallery ||
                (slideType.includes(config.templateType) &&
                    config.pageStyle === PageStyle.Scroll);
            return (jsx("div", { className: `bookmark-container ${showGallery
                    ? directionIsHorizon
                        ? 'gallery-container'
                        : 'gallery-container-ver'
                    : ''}`, ref: this.containerRef }, typedBookmarkList(config.templateType)));
        };
        this.renderExampleSlideScroll = (bookmark) => {
            return (jsx("div", { className: 'gallery-slide-card' },
                jsx("div", { className: 'w-100 h-100 bookmark-pointer surface-1' },
                    jsx("div", { className: 'bookmark-slide-gallery' },
                        jsx("div", { className: 'bookmark-slide-title' }, bookmark.title),
                        jsx("div", { className: 'bookmark-slide-description' }, bookmark.description)),
                    jsx("div", { className: 'default-img' }))));
        };
        this.renderBookmarkExample = (bookmark) => {
            const { appMode, config } = this.props;
            const directionIsHorizon = config.direction === DirectionType.Horizon;
            const typedBookmarkExampleList = (tempType) => {
                let bookmarkExample;
                switch (tempType) {
                    case TemplateType.Card:
                        bookmarkExample = new Array(3).fill(1).map((item, index) => {
                            return (jsx("div", { className: 'd-inline-flex bookmark-card-col', key: index },
                                jsx(Card, { className: 'surface-1' },
                                    jsx("div", { className: 'widget-card-image bg-light-300' },
                                        jsx("div", { className: 'widget-card-image-inner' },
                                            jsx("div", { className: 'default-img' }))),
                                    jsx(CardBody, { className: 'widget-card-content text-truncate' },
                                        jsx("span", { className: 'text-capitalize', title: bookmark.name }, bookmark.name)))));
                        });
                        break;
                    case TemplateType.List:
                        bookmarkExample = new Array(3).fill(1).map((item, index) => {
                            return (jsx("div", { className: 'd-flex bookmark-list-col surface-1', key: index },
                                jsx(PinOutlined, { className: 'ml-3' }),
                                jsx("div", { className: 'ml-2' }, bookmark.name)));
                        });
                        break;
                    case TemplateType.Slide1:
                        bookmarkExample = (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: 1, currentIndex: 0, transitionType: config.transition, direction: config.transitionDirection },
                                    jsx("div", { className: 'w-100 h-100 bookmark-pointer surface-1' },
                                        jsx("div", { className: 'bookmark-slide' },
                                            jsx("div", { className: 'bookmark-slide-title' }, bookmark.title),
                                            jsx("div", { className: 'bookmark-slide-description' }, bookmark.description)),
                                        jsx("div", { className: 'default-img' }))))
                                : (this.renderExampleSlideScroll(bookmark)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools(true)));
                        break;
                    case TemplateType.Slide2:
                        bookmarkExample = (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: 1, currentIndex: 0, transitionType: config.transition, direction: config.transitionDirection },
                                    jsx("div", { className: 'w-100 h-100 bookmark-only-pointer surface-1' },
                                        jsx("div", { className: 'w-100', style: { height: '40%' } },
                                            jsx("div", { className: 'default-img' })),
                                        jsx("div", { className: 'bookmark-text' },
                                            jsx("div", { className: 'bookmark-text-title' }, bookmark.title),
                                            jsx("div", { className: 'bookmark-text-description' }, bookmark.description)))))
                                : (this.renderExampleSlideScroll(bookmark)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools(true)));
                        break;
                    case TemplateType.Slide3:
                        bookmarkExample = (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: 1, currentIndex: 0, transitionType: config.transition, direction: config.transitionDirection },
                                    jsx("div", { className: 'w-100 h-100 bookmark-pointer surface-1' },
                                        jsx("div", { className: 'default-img' }),
                                        jsx("div", { className: 'bookmark-slide' },
                                            jsx("div", { className: 'bookmark-slide-title' }, bookmark.title),
                                            jsx("div", { className: 'bookmark-slide-description' }, bookmark.description)))))
                                : (this.renderExampleSlideScroll(bookmark)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools(true)));
                        break;
                    case TemplateType.Gallery:
                        bookmarkExample = new Array(3).fill(1).map((item, index) => {
                            return (jsx("div", { className: 'gallery-card', key: index },
                                jsx(Card, { className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} surface-1` },
                                    jsx("div", { className: `widget-card-image bg-light-300 ${directionIsHorizon
                                            ? 'gallery-img'
                                            : 'gallery-img-vertical'}` },
                                        jsx("div", { className: 'default-img' })),
                                    jsx(CardBody, { className: 'widget-card-content text-truncate' },
                                        jsx("span", { className: 'text-capitalize', title: bookmark.name }, bookmark.name)))));
                        });
                        break;
                    case TemplateType.Custom1:
                    case TemplateType.Custom2:
                        const isEditing = this.isEditing();
                        const customExample = this.renderCustomExample();
                        bookmarkExample = (jsx(Fragment, null,
                            config.pageStyle === PageStyle.Paging
                                ? (jsx(TransitionContainer, { previousIndex: 1, currentIndex: 0, transitionType: config.transition, direction: config.transitionDirection }, customExample))
                                : (jsx("div", { className: 'gallery-slide-card' }, customExample)),
                            config.pageStyle === PageStyle.Scroll &&
                                this.renderNavbar(config.direction === DirectionType.Horizon),
                            config.pageStyle === PageStyle.Paging &&
                                this.renderBottomTools(true),
                            !isEditing &&
                                config.pageStyle === PageStyle.Paging &&
                                appMode === AppMode.Design && (jsx("div", { className: 'edit-mask position-absolute w-100 h-100' }))));
                        break;
                    default:
                }
                return bookmarkExample;
            };
            const showGallery = config.templateType === TemplateType.Gallery;
            return (jsx("div", { className: `bookmark-container ${showGallery
                    ? directionIsHorizon
                        ? 'gallery-container'
                        : 'gallery-container-ver'
                    : ''}`, ref: this.containerRef }, typedBookmarkExampleList(config.templateType)));
        };
        this.onRuntimeBookmarkNameChange = (rbmId, newName) => {
            const item = JSON.parse(utils.readLocalStorage(rbmId));
            item.name = newName;
            utils.setLocalStorage(rbmId, JSON.stringify(item));
        };
        this.handleKeydown = (e, ref) => {
            if (e.key === 'Enter') {
                ref.current.blur();
            }
        };
        this.handleRuntimeDelete = (rbmId) => {
            const runtimeBmId = this.getRuntimeUuid();
            const runtimeBookmarkArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
            const delIndex = runtimeBookmarkArray.findIndex(id => id === rbmId);
            if (delIndex > -1) {
                runtimeBookmarkArray.splice(delIndex, 1);
            }
            utils.setLocalStorage(runtimeBmId, JSON.stringify(runtimeBookmarkArray));
            utils.removeFromLocalStorage(rbmId);
            this.setState({ runtimeBmArray: runtimeBookmarkArray });
        };
        this.renderRuntimeBookmarkList = () => {
            const { appMode, config } = this.props;
            const runtimeBmId = this.getRuntimeUuid();
            const runtimeBookmarkArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
            const typedRuntimeBookmarkList = () => {
                let runtimeBookmarkList;
                switch (config.templateType) {
                    case TemplateType.Card:
                        runtimeBookmarkList = runtimeBookmarkArray.map(rbmId => {
                            const item = JSON.parse(utils.readLocalStorage(rbmId));
                            const titleTextInput = React.createRef();
                            return (jsx(Fragment, { key: rbmId },
                                jsx("div", { className: 'd-inline-flex bookmark-card-col runtime-bookmarkCard' },
                                    jsx(Card, { onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} surface-1` },
                                        jsx("div", { className: 'widget-card-image bg-light-300' },
                                            jsx("div", { className: 'widget-card-image-inner' },
                                                jsx("div", { className: 'default-img' }))),
                                        jsx(CardBody, { className: 'widget-card-content runtime-title-con' },
                                            jsx(TextInput, { className: 'runtime-title w-100', ref: titleTextInput, size: 'sm', title: item.name, defaultValue: item.name || '', onClick: evt => evt.stopPropagation(), onKeyDown: evt => this.handleKeydown(evt, titleTextInput), onAcceptValue: value => this.onRuntimeBookmarkNameChange(rbmId, value) }))),
                                    jsx("span", { className: 'runtimeBookmarkCard-operation float-right' },
                                        jsx(Button, { title: this.formatMessage('deleteOption'), onClick: () => this.handleRuntimeDelete(rbmId), type: 'tertiary', icon: true },
                                            jsx(TrashFilled, { size: 's' }))))));
                        });
                        const cardAdd = (jsx(Fragment, { key: 'card-add' },
                            jsx("div", { className: 'card-add', onClick: this.handleRuntimeAdd, title: this.formatMessage('addBookmark') },
                                jsx("div", { className: 'add-placeholder' }),
                                jsx("div", { className: 'gallery-add-icon' },
                                    jsx(PlusOutlined, { className: 'mr-1', size: 'l' }))),
                            jsx("div", { className: 'vertical-border' })));
                        if (config.runtimeAddAllow)
                            runtimeBookmarkList.push(cardAdd);
                        break;
                    case TemplateType.List:
                        runtimeBookmarkList = runtimeBookmarkArray.map(rbmId => {
                            const item = JSON.parse(utils.readLocalStorage(rbmId));
                            const titleTextInput = React.createRef();
                            return (jsx("div", { key: rbmId, onClick: () => this.onViewBookmark(item), className: `${appMode === AppMode.Run ? 'bookmark-pointer' : ''} d-flex runtime-bookmarkList surface-1` },
                                jsx(PinOutlined, { className: 'ml-3' }),
                                jsx(TextInput, { className: 'runtime-title', ref: titleTextInput, size: 'sm', title: item.name, defaultValue: item.name || '', 
                                    // onClick={evt =>  evt.stopPropagation()}
                                    onKeyDown: evt => this.handleKeydown(evt, titleTextInput), onAcceptValue: value => this.onRuntimeBookmarkNameChange(rbmId, value) }),
                                jsx("span", { className: 'runtimeBookmarkList-operation float-right' },
                                    jsx(Button, { title: this.formatMessage('deleteOption'), onClick: () => this.handleRuntimeDelete(rbmId), type: 'tertiary', icon: true },
                                        jsx(TrashFilled, { size: 's' })))));
                        });
                        const listAdd = (jsx(Fragment, { key: 'list-add' },
                            jsx("div", { className: 'list-add', onClick: this.handleRuntimeAdd, title: this.formatMessage('addBookmark') },
                                jsx("div", { className: 'gallery-add-icon' },
                                    jsx(PlusOutlined, { className: 'mr-1', size: 'l' }))),
                            jsx("div", { className: 'vertical-border' })));
                        if (config.runtimeAddAllow)
                            runtimeBookmarkList.push(listAdd);
                        break;
                    default:
                }
                return runtimeBookmarkList;
            };
            return (jsx("div", { className: 'bookmark-container' },
                ((runtimeBookmarkArray &&
                    runtimeBookmarkArray.length > 0 &&
                    config.templateType !== TemplateType.Gallery) ||
                    config.runtimeAddAllow) && (jsx("div", { className: 'bookmark-runtimeSeparator' })),
                typedRuntimeBookmarkList()));
        };
        const runtimeBmId = this.getRuntimeUuid();
        const runtimeBmArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
        const stateObj = {
            jimuMapView: undefined,
            widgetRect: undefined,
            apiLoaded: false,
            viewGroup: undefined,
            bookmarkOnViewId: 1,
            autoPlayStart: false,
            LayoutEntry: null,
            runtimeBmArray,
            playTimer: undefined,
            isSetLayout: false,
            isSuspendMode: false
        };
        if (window.jimuConfig.isInBuilder) {
            stateObj.LayoutEntry = this.props.builderSupportModules.LayoutEntry;
        }
        else {
            stateObj.LayoutEntry = LayoutEntry;
        }
        let rtId = 0;
        if (runtimeBmArray.length > 0) {
            const lastId = runtimeBmArray[runtimeBmArray.length - 1];
            const { title: lastItem } = JSON.parse(utils.readLocalStorage(lastId));
            const strIndex = lastItem.lastIndexOf('-');
            rtId = parseInt(lastItem.substring(strIndex + 1));
        }
        this.state = stateObj;
        this.graphicsLayerCreated = {};
        this.graphicsPainted = {};
        this.graphicsLayerId = {};
        this.runtimeReference = undefined;
        this.containerRef = React.createRef();
        this.rtBookmarkId = rtId;
        this.showInView = false;
        this.alreadyActiveLoading = false;
        this.mapOpacity = 1;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps ||
            Object.keys(nextProps).length === 0 ||
            !prevState ||
            Object.keys(prevState).length === 0) {
            return null;
        }
        const { autoPlayStart, playTimer } = prevState;
        if (nextProps.autoplayActiveId !== nextProps.id) {
            if (autoPlayStart && playTimer)
                clearInterval(playTimer);
            return {
                autoPlayStart: false,
                playTimer: undefined
            };
        }
        return null;
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules([
                'esri/Graphic',
                'esri/layers/GraphicsLayer',
                'esri/geometry/Extent',
                'esri/Viewpoint',
                'esri/Basemap'
            ]).then(modules => {
                ;
                [
                    this.Graphic,
                    this.GraphicsLayer,
                    this.Extent,
                    this.Viewpoint,
                    this.Basemap
                ] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        var _a, _b, _c, _d, _e, _f;
        // config setting widget synchronous switch
        const { config, appMode, id, autoplayActiveId, isPrintPreview } = this.props;
        const { autoPlayStart, playTimer, jimuMapView, isSuspendMode } = this.state;
        const activeBookmarkId = ((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.stateProps) === null || _b === void 0 ? void 0 : _b.activeBookmarkId) || 0;
        // Clear the previous widget's drawing when the widget that controls the Map changes
        if (autoplayActiveId && jimuMapView && id !== autoplayActiveId) {
            const toClearLayerId = this.graphicsLayerId[jimuMapView.id];
            if (!toClearLayerId)
                return;
            const toClearLayer = jimuMapView.view.map.findLayerById(toClearLayerId);
            toClearLayer && toClearLayer.removeAll();
            this.graphicsPainted[jimuMapView.id] = {};
        }
        // Handle manually opening Live view (active on loading)
        if (prevProps.appMode === AppMode.Design && appMode === AppMode.Run) {
            if (jimuMapView && config.initBookmark) {
                const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
                const bookmarks = config.displayFromWeb
                    ? config.bookmarks.concat(mapBookmarks)
                    : config.bookmarks;
                if (bookmarks.length > 0 && this.showInView) {
                    jimuMapView.view.when(() => {
                        this.setState({
                            bookmarkOnViewId: bookmarks[0].id
                        });
                        this.onViewBookmark(bookmarks[0]);
                    });
                }
            }
        }
        // Turn off liveview,change paging style to 'scroll',sizeMode change and uncheck auto play need to turn off the autoplay
        if (this.autoOffCondition(prevProps)) {
            if (autoPlayStart) {
                if (playTimer)
                    clearInterval(playTimer);
                this.setState({
                    autoPlayStart: false,
                    playTimer: undefined
                });
                return;
            }
        }
        // PrintPreview mode
        if (prevProps.isPrintPreview !== isPrintPreview) {
            if (autoPlayStart) {
                this.setState({ isSuspendMode: true });
                this.handleAutoPlay();
            }
            else if (isSuspendMode && !autoPlayStart) {
                this.setState({ isSuspendMode: false });
                this.handleAutoPlay();
            }
        }
        // This indicates that the activeId change is caused by setting
        const settingChangeBookmark = ((_d = (_c = this.props) === null || _c === void 0 ? void 0 : _c.stateProps) === null || _d === void 0 ? void 0 : _d.settingChangeBookmark) || false;
        if (settingChangeBookmark && activeBookmarkId) {
            // && (activeBookmarkId !== bookmarkOnViewId)
            const current = config.bookmarks.findIndex(x => x.id === activeBookmarkId) > -1
                ? config.bookmarks.findIndex(x => x.id === activeBookmarkId)
                : 0;
            this.setState({ bookmarkOnViewId: activeBookmarkId });
            this.props.dispatch(appActions.widgetStatePropChange(id, 'settingChangeBookmark', false));
            if (appMode === AppMode.Run) {
                this.onViewBookmark(config.bookmarks[current]);
            }
        }
        // Delete the last bookmark need to clear the layer in map widget
        const lastFlag = ((_f = (_e = this.props) === null || _e === void 0 ? void 0 : _e.stateProps) === null || _f === void 0 ? void 0 : _f.lastFlag) || false;
        if (lastFlag) {
            this.props.dispatch(appActions.widgetStatePropChange(id, 'lastFlag', false));
            const bookmarkLayer = jimuMapView.view.map.findLayerById(this.graphicsLayerId[jimuMapView.id]);
            bookmarkLayer && bookmarkLayer.removeAll();
        }
        this.settingLayout();
    }
    componentWillUnmount() {
        // Delete the widget need to clear the layer in map widget and the localeStorage for runtime bm.
        const { jimuMapView } = this.state;
        const widgets = getAppStore().getState().appConfig.widgets;
        if (!widgets[this.props.id] && jimuMapView) {
            const bookmarkLayer = jimuMapView.view.map.findLayerById(this.graphicsLayerId[jimuMapView.id]);
            bookmarkLayer && bookmarkLayer.removeAll();
            const runtimeBmId = this.getRuntimeUuid();
            const runtimeBookmarkArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
            runtimeBookmarkArray.forEach(key => {
                utils.removeFromLocalStorage(key);
            });
            utils.removeFromLocalStorage(runtimeBmId);
        }
    }
    render() {
        const { config, id, useMapWidgetIds, theme, isPrintPreview } = this.props;
        const { jimuMapView, apiLoaded } = this.state;
        const { runtimeAddAllow } = config;
        const classes = classNames('jimu-widget', 'widget-bookmark', 'bookmark-widget-' + id);
        const mapBookmarks = this.getMapBookmarks(jimuMapView) || [];
        const configLength = config.displayFromWeb
            ? config.bookmarks.concat(mapBookmarks).length
            : config.bookmarks.length;
        const runtimeBmId = this.getRuntimeUuid();
        const runtimeArray = JSON.parse(utils.readLocalStorage(runtimeBmId)) || [];
        const runtimeLength = runtimeArray.length;
        const egBookmark = {
            id: 99999,
            name: this.formatMessage('_widgetLabel'),
            title: this.formatMessage('_widgetLabel'),
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            type: '2d',
            mapViewId: 'widget_egeditor-dataSource_eg',
            mapDataSourceId: 'dataSource_eg'
        };
        const noRuntimeType = [
            TemplateType.Slide1,
            TemplateType.Slide2,
            TemplateType.Slide3,
            TemplateType.Gallery,
            TemplateType.Custom1,
            TemplateType.Custom2
        ];
        return (jsx(ViewVisibilityContext.Consumer, null, ({ isInView, isInCurrentView }) => {
            let embedLoad = true;
            embedLoad = isInView ? isInCurrentView : true;
            if (!embedLoad)
                this.alreadyActiveLoading = false;
            return (jsx(Fragment, null, embedLoad && (jsx(ViewportVisibilityContext.Consumer, null, isVisibleInViewPort => {
                if (!isVisibleInViewPort)
                    this.alreadyActiveLoading = false;
                this.showInView = isVisibleInViewPort;
                return (jsx("div", { className: classes, css: this.getStyle(theme) }, (isPrintPreview || isVisibleInViewPort) && apiLoaded && (jsx(Fragment, null,
                    jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0], onActiveViewChange: this.onActiveViewChange, onViewGroupCreate: this.handleViewGroupCreate }),
                    runtimeAddAllow ||
                        runtimeLength !== 0 ||
                        configLength !== 0
                        ? (jsx(Fragment, null,
                            jsx("div", { className: 'h-100 d-flex flex-wrap bookmark-view-auto' },
                                (configLength > 0 ||
                                    config.templateType ===
                                        TemplateType.Gallery) &&
                                    this.renderBookmarkList(config.bookmarks),
                                (runtimeLength > 0 || runtimeAddAllow) &&
                                    !noRuntimeType.includes(config.templateType) &&
                                    this.renderRuntimeBookmarkList())))
                        : (jsx(Fragment, null,
                            jsx("div", { className: 'h-100 d-flex flex-wrap bookmark-view-auto' }, this.renderBookmarkExample(egBookmark))))))));
            }))));
        }));
    }
}
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e;
    const appConfig = state === null || state === void 0 ? void 0 : state.appConfig;
    const { layouts, layoutId, layoutItemId, builderSupportModules, id, useMapWidgetIds } = props;
    const selection = (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.selection;
    const selectionIsInSelf = selection &&
        builderSupportModules &&
        builderSupportModules.widgetModules &&
        builderSupportModules.widgetModules.selectionInBookmark(selection, id, appConfig, false);
    const mapWidgetsInfo = state === null || state === void 0 ? void 0 : state.mapWidgetsInfo;
    const mapWidgetId = useMapWidgetIds && useMapWidgetIds.length !== 0
        ? useMapWidgetIds[0]
        : undefined;
    const browserSizeMode = (state === null || state === void 0 ? void 0 : state.browserSizeMode) || BrowserSizeMode.Large;
    return {
        appMode: (_b = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _b === void 0 ? void 0 : _b.appMode,
        appConfig,
        layouts,
        selectionIsSelf: selection &&
            selection.layoutId === layoutId &&
            selection.layoutItemId === layoutItemId,
        selectionIsInSelf,
        autoplayActiveId: mapWidgetId
            ? (_c = mapWidgetsInfo[mapWidgetId]) === null || _c === void 0 ? void 0 : _c.autoControlWidgetId
            : undefined,
        mapWidgetId,
        browserSizeMode,
        isPrintPreview: (_e = (_d = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _d === void 0 ? void 0 : _d.isPrintPreview) !== null && _e !== void 0 ? _e : false
    };
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map