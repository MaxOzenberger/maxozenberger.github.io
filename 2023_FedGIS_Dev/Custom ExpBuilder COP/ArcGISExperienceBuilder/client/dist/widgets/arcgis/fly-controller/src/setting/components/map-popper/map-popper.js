// 0. jimuMap
// 1. container for draw panel
// 2. ConfirmWindow for popup
/** @jsx jsx */
import { React, jsx, APP_FRAME_NAME_IN_BUILDER, Immutable, css, polished, getAppStore } from 'jimu-core';
import { Button, TextInput, FloatingPanel, PanelHeader } from 'jimu-ui';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { JimuMap } from 'jimu-ui/advanced/map';
import { PageMode } from '../../setting';
import ActionPanel from './action-panel';
import nls from '../../translations/default';
import * as utils from '../../../common/utils/utils';
// resources
import closeIconOutlined from 'jimu-icons/svg/outlined/editor/close.svg';
export class MapPopper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Graphic = null;
        this.GraphicsLayer = null;
        this.getPoperStyle = (theme) => {
            return css `
        .popper-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;

          .popper-header {
            width: 100%;
            flex-shrink: 0;
            flex-grow: 0;
            cursor: move;
          }
          .map-container {
            width: 800px;
            height: 800px;
            background-color: gray;
            display: contents;
          }
          .popper-footer {
            display: flex;
            background:${theme.colors.palette.light[300]};
            color:${theme.colors.palette.dark[600]};
            padding: ${polished.rem(10)} ${polished.rem(20)};

            .left-tool {
              min-height: 32px;
            }
          }
        }
    `;
        };
        this.handleClickClose = () => {
            this.props.onShowMapPopperChange(false, PageMode.Common);
        };
        this.getDefalutSize = () => {
            const layoutElem = this.querySelector(`div.widget-renderer[data-widgetid="${this.props.useMapWidgetIds[0]}"]`);
            const maxHeight = utils.isDefined(document.querySelector('#default')) ? document.querySelector('#default').clientHeight - 20 : 1080;
            let innerSize = { width: 770, height: 850 };
            let innerMapSize = { width: 770, height: 770 };
            if (utils.isDefined(layoutElem)) {
                const clientRect = layoutElem.getBoundingClientRect();
                let ratio = (clientRect.width / clientRect.height);
                ratio = ratio > 0 ? ratio : 1; // for lint: || 1
                let defaultExpandWidth = clientRect.width * 1.1;
                let defaultExpandHeight = clientRect.height * 1.1 + 111;
                let defaultMapWidth = clientRect.width * 1.1;
                let defaultMapHeight = clientRect.height * 1.1;
                // width
                if (defaultExpandWidth < 770) {
                    defaultExpandWidth = 770;
                    defaultExpandHeight = 770 / ratio + 111;
                    defaultMapWidth = 770;
                    defaultMapHeight = 770 / ratio;
                }
                else if (defaultExpandWidth > 1080) {
                    defaultExpandWidth = 1080;
                    defaultExpandHeight = 1080 / ratio + 111;
                    defaultMapWidth = 1080;
                    defaultMapHeight = 1080 / ratio;
                }
                // height
                if (defaultExpandHeight > maxHeight) {
                    defaultExpandHeight = maxHeight;
                    defaultExpandWidth = (maxHeight - 111) * ratio > 770 ? (maxHeight - 111) * ratio : 770;
                }
                if (defaultMapHeight > (maxHeight - 111)) {
                    defaultMapHeight = maxHeight - 111;
                    defaultMapWidth = (maxHeight - 111) * ratio;
                }
                innerSize = {
                    width: defaultExpandWidth,
                    height: defaultExpandHeight
                };
                innerMapSize = {
                    width: defaultMapWidth - 2,
                    height: defaultMapHeight
                };
            }
            return { innerSize, innerMapSize };
        };
        this.getWidgetPosition = () => {
            const isRTL = getAppStore().getState().appStateInBuilder.appContext.isRTL;
            let pos = { x: 500, y: 50 };
            const { innerSize } = this.getDefalutSize();
            const width = isRTL
                ? 260
                : document.body.clientWidth - innerSize.width - 260;
            pos = { x: width, y: 50 };
            return pos;
        };
        this.handleActiveViewChange = (jimuMapView) => {
            var _a;
            this.props.onMapPopperJimuMapViewUpdate(jimuMapView);
            if (jimuMapView !== this.state.jimuMapView) {
                if (((_a = jimuMapView.view) === null || _a === void 0 ? void 0 : _a.type) === '3d') {
                    this.setState({ is3DView: true });
                }
                else {
                    this.setState({ is3DView: false });
                }
            }
            this.setState({ jimuMapView: jimuMapView });
        };
        this.handleViewGroupCreate = (viewGroup) => {
            this.props.onMapPopperViewGroupUpdate(viewGroup);
        };
        this.handleRefGraphicInteractionManager = (ref) => {
            this.graphicInteractionManagerRef = ref;
            this.props.onRefGraphicInteractionManager(ref);
        };
        // draw
        this.handleDrawFinish = (record) => {
            this.tmpRecordForConfirm = record;
            this._toggleConfirmWindow(true);
        };
        /// ////////////////////////////////////////////////////////////////////
        // Confirm window
        this._toggleConfirmWindow = (cmd) => {
            let isShowConfirmWin;
            if (typeof cmd !== 'undefined') {
                isShowConfirmWin = cmd;
            }
            else {
                isShowConfirmWin = !this.state.isShowConfirmWin;
            }
            this.setState({
                isShowConfirmWin: isShowConfirmWin,
                isConfirmBtnsDisabled: false //reset ConfirmBtnsDisabled flag
            }, () => {
                if (!isShowConfirmWin && utils.isDefined(this.tmpRecordForConfirm)) {
                    this.tmpRecordForConfirm = null; // clean
                }
            });
        };
        this.getRecordName = () => {
            var _a;
            return (_a = this.tmpRecordForConfirm) === null || _a === void 0 ? void 0 : _a.getConfig().displayName;
        };
        this._getConfirmWindow = () => {
            var _a;
            const { innerSize } = this.getDefalutSize();
            const { theme } = this.props;
            const saveToLabel = this.props.intl.formatMessage({ id: 'saveTo', defaultMessage: nls.saveTo });
            const closePopupLabel = this.props.intl.formatMessage({ id: 'closePopup', defaultMessage: nls.closePopup });
            const editElementLabel = this.props.intl.formatMessage({ id: 'editElement', defaultMessage: nls.editElement });
            const saveLabel = this.props.intl.formatMessage({ id: 'save', defaultMessage: nls.save });
            return (jsx("div", { css: css `
        position: absolute;
        z-index: 11;
        top: 0;
        left: 0;
        background-color: ${polished.rgba(theme.colors.palette.secondary[400], 0.65)};
        width: ${innerSize.width}px;
        height: ${innerSize.height}px;
        .real-container{
          background-color: ${theme.colors.palette.secondary[300]};
          border: 1px solid ${theme.colors.palette.secondary[800]};
          background-clip: padding-box;
          width: 480px;
          position: relative;
          top: 50%;
          margin: -60px auto 0;
        }
        .confirm-header {
          border-bottom: 1px solid ${theme.colors.palette.light[800]};
          padding: 16px 20px;
        }
        .confirm-context {
          padding: ${polished.rem(20)} ${polished.rem(20)} 0 ${polished.rem(20)};
        }
        .confirm-footer {
          display: flex;
          justify-content: flex-end;
          padding: ${polished.rem(20)};
          button {
            cursor: pointer;
            margin-left: ${polished.rem(8)};
            min-width: ${polished.rem(100)};
          }
        }
      ` },
                jsx("div", { className: 'real-container' },
                    jsx(PanelHeader, { title: saveToLabel + ' ' + this.props.activedRouteConfig.displayName, moveable: false, className: 'confirm-header', actions: [{
                                name: 'close',
                                label: closePopupLabel,
                                icon: closeIconOutlined,
                                onClick: this.handleConfirmWinClose
                            }] }),
                    jsx("div", { className: 'confirm-context' },
                        jsx(TextInput, { className: 'w-100', size: 'sm', required: true, defaultValue: (_a = this.getRecordName()) !== null && _a !== void 0 ? _a : '', onChange: evt => this.handleConfirmWinNameChange(evt.target.value) })),
                    jsx("div", { className: 'confirm-footer' },
                        jsx(Button, { type: 'primary', onClick: this.handleConfirmWinSave, disabled: this.state.isConfirmBtnsDisabled }, saveLabel),
                        jsx(Button, { type: 'secondary', onClick: this.handleConfirmWinEdit, disabled: this.state.isConfirmBtnsDisabled }, editElementLabel)))));
        };
        this.handleConfirmWinClose = () => {
            this.props.onRemoveGraphics(this.tmpRecordForConfirm.cachingGraphicsInfo.getGraphics());
            this._toggleConfirmWindow(false);
        };
        this.handleConfirmWinNameChange = (name) => {
            if (!name) { // empty name is not allowed ,#6563
                this.setState({ isConfirmBtnsDisabled: true });
            }
            else {
                this.setState({ isConfirmBtnsDisabled: false });
            }
            this.tmpRecordForConfirm.getConfig().displayName = name;
        };
        this.handleConfirmWinEdit = () => {
            if (utils.isDefined(this.tmpRecordForConfirm)) {
                this.props.onRecordAddAndEdit(this.tmpRecordForConfirm.getConfig()).then(() => {
                    this._toggleConfirmWindow(false);
                });
            }
        };
        this.handleConfirmWinSave = () => {
            if (utils.isDefined(this.tmpRecordForConfirm)) {
                this.props.onRecordAdd(this.tmpRecordForConfirm.getConfig());
            }
            this._toggleConfirmWindow(false);
        };
        this.state = {
            jimuMapView: null,
            jimuMapViews: null,
            apiLoaded: false,
            is3DView: false,
            isTerrainLoaded: false,
            // viewGroup: undefined,
            mapSize: this.getDefalutSize().innerSize,
            // mapRatio: 1,//this.getMapRatio(),
            // confirm window
            isShowConfirmWin: false,
            isConfirmBtnsDisabled: false
        };
    }
    // componentDidUpdate(prevProps: Props, prevState: States): void {
    // }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules([
                'esri/Graphic'
            ]).then(modules => {
                [this.Graphic] = modules;
                this.setState({ apiLoaded: true });
            });
        }
    }
    componentWillUnmount() {
        var _a, _b, _c, _d, _e, _f, _g;
        // update follow API 10.2: must unmount sketch before unmont map ,#10323
        (_c = (_b = (_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.drawHelperRef) === null || _b === void 0 ? void 0 : _b.jimuDrawToolsRef) === null || _c === void 0 ? void 0 : _c.completeOperation();
        (_g = (_f = (_e = (_d = this.graphicInteractionManagerRef) === null || _d === void 0 ? void 0 : _d.drawHelperRef) === null || _e === void 0 ? void 0 : _e.jimuDrawToolsRef) === null || _f === void 0 ? void 0 : _f.sketch) === null || _g === void 0 ? void 0 : _g.destroy();
    }
    // resizeRatio = (size) => {
    //   const maxElem = this.querySelector('body');
    //   const maxClientRect = maxElem.getBoundingClientRect();
    //   const { mapRatio } = this.state;
    //   let { width } = size;
    //   if (width > 1080) width = 1080;
    //   let height = width / mapRatio + 111;
    //   if (height > maxClientRect.height) {
    //     height = maxClientRect.height;
    //     width = (maxClientRect.height - 111) * mapRatio;
    //   }
    //   this.setState({ mapSize: { width, height } });
    // }
    querySelector(selector) {
        var _a;
        const appFrame = document.querySelector(`iframe[name="${APP_FRAME_NAME_IN_BUILDER}"]`);
        if (utils.isDefined(appFrame)) {
            const appFrameDoc = (_a = appFrame.contentDocument) !== null && _a !== void 0 ? _a : appFrame.contentWindow.document;
            return appFrameDoc.querySelector(selector);
        }
        return null;
    }
    render() {
        var _a, _b;
        const { mapSize } = this.state;
        const { activedRouteConfig, theme, isShowMapPopper } = this.props;
        const useMapWidget = utils.isDefined(this.props.useMapWidgetIds) && this.props.useMapWidgetIds[0];
        const config = getAppStore().getState().appStateInBuilder.appConfig;
        // const isRTL = getAppStore().getState().appStateInBuilder.appContext.isRTL;
        if (!utils.isDefined(config.widgets[useMapWidget])) {
            return null;
        }
        const useDataSource = config.widgets[useMapWidget].useDataSources;
        const toolConfig = {
            canZoom: true,
            canHome: true,
            // canSearch: true,
            canCompass: true,
            canLayers: true
        };
        let jimuMapConfig;
        if (utils.isDefined((_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.dataSourceId)) {
            const initialMapDataSourceID = (_b = this.props.jimuMapView) === null || _b === void 0 ? void 0 : _b.dataSourceId;
            jimuMapConfig = Immutable({}).set('initialMapDataSourceID', initialMapDataSourceID).set('toolConfig', toolConfig);
        }
        const panelHeader = css `.panel-header{
          background:${theme.colors.palette.light[300]};
          color:${theme.colors.palette.dark[600]};
          height: 50px;
          flex-shrink: 0;
          font-size: 1rem;
          font-weight: 500;
          .jimu-btn {
            color: ${theme.colors.palette.dark[600]} !important;
          }
          & >.actions >.jimu-btn.action-close :hover {
            color: ${theme.colors.black} !important;
          }
        }`;
        const floatingPanel = (jsx(FloatingPanel, { onHeaderClose: this.handleClickClose, defaultPosition: this.getWidgetPosition(), headerTitle: activedRouteConfig.displayName, size: mapSize, minSize: { width: 770, height: 850 }, disableResize: true, css: panelHeader, className: 'surface-3', disableActivateOverlay: true, dragBounds: 'body', 
            //508
            autoFocus: false },
            jsx("div", { className: 'rounded w-100 h-100', css: this.getPoperStyle(theme) },
                jsx("div", { className: 'popper-content' },
                    jsx("div", { className: 'map-container', style: { height: '600px', width: '700px' } },
                        jsx(JimuMap, { id: this.props.specifiedJimuMapId, useDataSources: useDataSource, jimuMapConfig: jimuMapConfig, onActiveViewChange: this.handleActiveViewChange, onViewGroupCreate: this.handleViewGroupCreate })),
                    this.state.isShowConfirmWin && this._getConfirmWindow(),
                    jsx("div", { className: 'popper-footer' },
                        jsx("div", { className: 'left-tool' },
                            jsx(ActionPanel, { specifiedJimuMapId: this.props.specifiedJimuMapId, theme: theme, intl: this.props.intl, jimuMapView: this.state.jimuMapView, isDisableDraw: !this.state.is3DView || (this.props.pageMode === PageMode.RecordLoading || this.props.pageMode === PageMode.RecordDetails), isTerrainLoaded: this.props.isTerrainLoaded, getPopperJimuMapId: this.props.getPopperJimuMapId, onRefGraphicInteractionManager: this.handleRefGraphicInteractionManager, 
                                //
                                newFeatureMode: this.props.newFeatureMode, onNewFeatureModeChange: this.props.onNewFeatureModeChange, 
                                //
                                buildTemporaryRecordConfig: this.props.buildTemporaryRecordConfig, buildDefaultRecord: this.props.buildDefaultRecord, onDrawFinish: this.handleDrawFinish, 
                                //
                                activedRouteConfig: this.props.activedRouteConfig, 
                                //
                                playingInfo: this.props.playingInfo, isPreviewRouteBtnPlaying: this.props.isPreviewRouteBtnPlaying, 
                                //
                                stopFly: this.props.stopFly })),
                        jsx("div", { className: 'float-right' }))))));
        return (jsx("div", { className: 'w-100' }, isShowMapPopper && floatingPanel));
    }
}
//# sourceMappingURL=map-popper.js.map