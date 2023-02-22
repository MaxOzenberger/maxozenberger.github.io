var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, getAppStore, appActions } from 'jimu-core';
import { Button, Slider, Dropdown, DropdownButton, DropdownMenu, DropdownItem, defaultMessages as jimuUiNls, NumericInput, Progress } from 'jimu-ui';
// components
import BarLayout from '../skins/bar/layout';
import PaletteLayout from '../skins/palette/layout';
import { getPaletteDropdownStyle } from '../skins/palette/style';
import { RouteMenu } from './route-menu';
import { getStyle, getDropdownStyle } from '../style';
import { FlyItemMode, PanelLayout } from '../../config';
// fly facade
import FlyManager from '../../common/fly-facade/fly-manager';
import GraphicInteractionManager, { DrawingMode, ShowItem } from '../../common/components/graphic-interaction-manager';
import { Constraints } from '../../common/constraints';
// common
import * as utils from '../../common/utils/utils';
import nls from '../translations/default';
import { SettingOutlined } from 'jimu-icons/outlined/application/setting';
import { PlayOutlined } from 'jimu-icons/outlined/editor/play';
import { PauseOutlined } from 'jimu-icons/outlined/editor/pause';
import { RoutePointOutlined } from 'jimu-icons/outlined/gis/route-point';
import { AlongPathOutlined } from 'jimu-icons/outlined/gis/along-path';
import { RouteOutlined } from 'jimu-icons/outlined/directional/route';
export default class InteractivePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onTerrainLoaded = () => {
            // console.log('onTerrainLoaded')
            this.setState({ isTerrainLoaded: true });
        };
        this.handleFlyManagerItemsUpdate = (items) => {
            this.setState({ flyManagerItems: items });
        };
        this.handleRefGraphicInteractionManager = (ref) => {
            this.setState({ graphicInteractionManagerRef: ref });
            if (ref !== null) {
                this.setState({ subCompsLoaded: true });
            }
            else {
                this.setState({ subCompsLoaded: false });
            }
        };
        // autoplay
        this.isAutoControlWidgetIdChanged = (prevProps) => {
            return (prevProps.autoControlWidgetId && this.props.autoControlWidgetId !== prevProps.autoControlWidgetId);
        };
        this.handleAutoControlMapPublish = () => {
            getAppStore().dispatch(appActions.requestAutoControlMapWidget(this.props.useMapWidgetIds[0], this.props.widgetId));
        };
        // handleAutoControlMapSubscribe = (): void => {
        //   this.flyManager?.pause()
        // }
        // 0 state
        this.resetDefaultUI = (actions) => {
            var _a, _b;
            // popup
            this.setState({ isFlyStylePopupOpen: false });
            this.setState({ isLiveview: false });
            // interaction
            (_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.onRenderStateChange({ drawingMode: DrawingMode.Null, isPicking: false });
            // controller
            this.handleStop();
            // clean
            if (actions === null || actions === void 0 ? void 0 : actions.isCleanGraphics) {
                this.handleFocusedGraphicChanged(null);
                (_b = this.state.graphicInteractionManagerRef) === null || _b === void 0 ? void 0 : _b.clearAll();
            }
        };
        // 0.1 flyMode
        this.handleFlyStyleChange = (uuid) => {
            var _a;
            let uid;
            let item;
            if (uuid === null) { // null means reset UI, and findFirstUsedItem in config
                item = this.flyManager.findFirstUsedItem();
                uid = item.config.uuid;
            }
            else {
                item = this.flyManager.findItemByUuid(uuid);
                uid = uuid;
            }
            // ui
            this.setState({ activedItemUuid: uid }, () => {
                if (!this.flyManager.isUesRouteFlyMode()) {
                    this.handleActivedRouteChange(null);
                }
            });
            this.handleSpeedChange(null);
            this.resetDefaultUI({ isCleanGraphics: true });
            this.flyManager.unRegisterItem();
            this.flyManager.registerItem(uid);
            (_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.removeAllGraphics();
        };
        // 0.2 draw
        // 0.3 picking
        // 0.4
        this.handlePlayStateBtnClick = () => {
            if (!this.state.isPlaying) {
                this.handlePlay();
            }
            else {
                this.handlePause();
            }
        };
        this.setPlayStatePlaying = (playState) => {
            var _a;
            this.setState({ isPlaying: playState, /* isDrawing: false, isPicking: false, */ isLiveview: false });
            (_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.onRenderStateChange(null);
        };
        // for callbacks
        this.handleFlyLoading = () => {
            this.setPlayStatePlaying(true); // change UI to play first
        };
        this.handleFlyLoaded = () => {
            this.setPlayStatePlaying(false);
        };
        this.handleFlyPlay = () => {
            if (this.state.isLiveview) {
                return;
            }
            if (!this.state.isPlaying) {
                this.setPlayStatePlaying(true);
            }
        };
        this.handleFlyPause = () => {
            this.setPlayStatePlaying(false);
        };
        this.handleFlyFinish = () => {
            this.setPlayStatePlaying(false);
            if (this.state.isSpeedPopupOpen) {
                this.setState({ isSpeedPopupOpen: false }); // close speed selector, when fly finish ,#10743
            }
        };
        this.isLiveviewMode = () => {
            return this.state.isLiveview;
        };
        this.handleUpdateProgress = (p) => {
            this.setState({ progress: p });
        };
        // 1 fly mode
        this.getFlyStyleContent = () => {
            const flyStyle = this.flyManager.getFlyStyle();
            let flyStyleContent = null;
            if (flyStyle === FlyItemMode.Rotate) {
                flyStyleContent = jsx(RoutePointOutlined, null);
            }
            else if (flyStyle === FlyItemMode.Path) {
                flyStyleContent = jsx(AlongPathOutlined, null);
            }
            else if (flyStyle === FlyItemMode.Route) {
                flyStyleContent = jsx(RouteOutlined, null);
            }
            return flyStyleContent;
        };
        this.toggleFlyStylePopup = () => {
            if (utils.getEnabledItemNum(this.props.config.itemsList) <= 1) {
                this.setState({ isFlyStylePopupOpen: false });
                return; // no dropdown if itemlist.length < 2
            }
            if (this.state.isPlaying) {
                return; // no disable in dropdown
            }
            this.setState({ isFlyStylePopupOpen: !this.state.isFlyStylePopupOpen });
        };
        // 2 trigger action
        this.isDisableButton = (judgment) => {
            const { isPlaying, isLiveview, focusedGraphic } = judgment;
            let work = !this.state.subCompsLoaded;
            if (isPlaying) {
                work = work && !this.state.isPlaying;
            }
            if (isLiveview) {
                work = work && !this.state.isLiveview;
            }
            if (focusedGraphic) {
                work = (work) || !utils.isDefined(this.state.focusedGraphic);
            }
            return work;
        };
        // 2.0 focused
        this.handleFocusedGraphicChanged = (graphic) => {
            this.setState({ focusedGraphic: graphic });
        };
        // 2.1 draw
        this.handleGraphicsUpdateHanlder = (res) => __awaiter(this, void 0, void 0, function* () {
            // reset speed
            this.handleSpeedChange(null);
            const graphicsInfo = res.graphicsInfo;
            const cameraInfo = res.cameraInfo;
            const flyStyle = this.flyManager.getFlyStyle();
            if (flyStyle === FlyItemMode.Rotate) {
                // 1.Point
            }
            else if (flyStyle === FlyItemMode.Path) {
                // 2. Line
                this.handleAltitudeChange(0, { setToController: true /* TODO should be false??? */, isUpdateLine: false, isNeedHighlight: false });
            }
            const recordConfig = yield this.flyManager.buildTemporaryRecordConfig(graphicsInfo, cameraInfo, this.props.jimuMapView);
            const record = yield this.flyManager.buildTemporaryRecord(recordConfig, this.props.jimuMapView.view, this.flyStateCallbacks, graphicsInfo);
            const itemConfig = this.flyManager.getActiveItemConfig();
            yield this.flyManager.setupFly(itemConfig, null, this.flyStateCallbacks, record);
            yield this.flyManager.prepare(null);
        });
        // 2.2 picking
        this.handlePickHanlder = (res) => {
            this.handleGraphicsUpdateHanlder(res);
        };
        // 2.3 clearBtn
        this.handleClearBtnClick = () => {
            this.resetDefaultUI({ isCleanGraphics: true });
            if (utils.isDefined(this.flyManager)) {
                this.handleStop();
            }
        };
        // 2.4 liveview
        this.toggleLiveviewSettingPopup = () => __awaiter(this, void 0, void 0, function* () {
            if (!utils.isDefined(this.state.focusedGraphic)) {
                return;
            }
            const isOpen = !this.state.isLiveview;
            yield this.flyManager.setIsLiveview(isOpen);
            // reset liveViewInfo if info exist
            const liveviewInfo = yield this.flyManager.getLiveviewSettingInfo();
            if (utils.isDefined(liveviewInfo)) {
                this.handleTiltChange(liveviewInfo.tilt);
                this.handleAltitudeChange(liveviewInfo.altitude, { isNeedHighlight: true });
                this.setState({ isLiveview: isOpen });
            }
        });
        this.handleSpeedChange = (value) => {
            var _a;
            if (value === null) {
                // reset to default value
                const initLiveviewSetting = utils.getInitLiveviewSetting();
                value = initLiveviewSetting.speed;
            }
            this.setState({ settingSpeed: value });
            (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.setSpeedFactor(value);
        };
        this.handleTiltChange = (value, opts) => {
            this.setState({ settingTilt: value });
            if (utils.isDefined(this.flyManager) && (opts === null || opts === void 0 ? void 0 : opts.setToController)) {
                this.flyManager.onLiveviewParamChange({ tilt: value }, { isUpdateLine: false, isNeedHighlight: opts === null || opts === void 0 ? void 0 : opts.isNeedHighlight }); // goto this camPos
            }
        };
        this.handleAltitudeChange = (value, opts) => {
            const alt = utils.altNumFix(value);
            this.setState({ settingAltitude: alt });
            if (utils.isDefined(this.flyManager) && (opts === null || opts === void 0 ? void 0 : opts.setToController)) {
                this.flyManager.onLiveviewParamChange({ altitude: alt }, { isUpdateLine: opts === null || opts === void 0 ? void 0 : opts.isUpdateLine, isNeedHighlight: opts === null || opts === void 0 ? void 0 : opts.isNeedHighlight }); // goto this camPos
            }
        };
        // 3 play state
        this.handlePlay = () => __awaiter(this, void 0, void 0, function* () {
            if (!utils.isDefined(this.state.focusedGraphic) && (!this.flyManager.isUesRouteFlyMode())) {
                return;
            }
            const isContinue = yield this.flyManager.setIsLiveview(false); // force sync settingMode
            if (!isContinue) {
                return;
            }
            // this.flyManager.loadingForUI()// change UI to play first
            this.handleAutoControlMapPublish();
            this.flyManager.fly({
                settingSpeed: this.state.settingSpeed,
                ids: { routeUuid: this.state.activedRouteUuid, recordUuid: null },
                isPreviewSpecifiedRecord: false
            });
        });
        this.handleStop = () => {
            var _a;
            (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.stop();
        };
        this.handlePause = () => {
            var _a;
            (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.pause();
        };
        // onResume = () => {
        //   flyManager.resume();
        // }
        this.handleClear = () => {
            var _a;
            (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.clear();
        };
        // speed
        this.toggleSpeedPopup = () => {
            this.setState({ isSpeedPopupOpen: !this.state.isSpeedPopupOpen });
        };
        /// //////////
        // for render
        this.isShowDropdownButtonArrow = (layout) => {
            var _a;
            if (layout === PanelLayout.Palette) {
                return false;
            }
            if (((_a = this.state.flyManagerItems) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                return true;
            }
            return false;
        };
        this.isShowDropdownButtonDot = (layout) => {
            var _a;
            if (layout === PanelLayout.Palette && ((_a = this.state.flyManagerItems) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                return true;
            }
            return false;
        };
        // RouteMenu
        this.handleActivedRouteChange = (uuid) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.clearAll();
            this.handleSpeedChange(null);
            this.setState({ activedRouteUuid: uuid }, () => __awaiter(this, void 0, void 0, function* () {
                if (utils.isDefined(this.state.activedRouteUuid) && this.flyManager.isUesRouteFlyMode()) {
                    // this.flyManager.loadingForUI()// change UI to play first
                    yield this.flyManager.prepareRoutePreview({ routeUuid: uuid });
                    // this.flyManager.loadedForUI()
                }
            }));
        });
        // graphic interaction
        this.handleDrawOrUpdateGraphics = (record) => {
            var _a;
            if (typeof ((_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.drawOrUpdateGraphics) === 'function') {
                return this.state.graphicInteractionManagerRef.drawOrUpdateGraphics(record); // draw graphics back
            }
        };
        this.highlightGraphics = (graphics) => {
            var _a;
            if (typeof ((_a = this.state.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.highlight) === 'function') {
                this.state.graphicInteractionManagerRef.highlight(graphics); // highlight graphics
            }
        };
        const initLiveviewSetting = utils.getInitLiveviewSetting();
        this.state = {
            graphicInteractionManagerRef: null,
            // state
            flyManagerItems: null,
            // errorTip: this.errorTipsManager.getDefaultError(), //for errorTipsManager
            subCompsLoaded: false,
            isTerrainLoaded: false,
            focusedGraphic: null,
            // 1.fly style
            isFlyStylePopupOpen: false,
            activedItemUuid: null,
            // 2.triggerAction
            isPlaying: false,
            // 3.liveview
            isLiveview: false,
            settingSpeed: initLiveviewSetting.speed,
            settingTilt: initLiveviewSetting.tilt,
            settingAltitude: initLiveviewSetting.altitude,
            // settingHeading: 0,
            // 4.progresser
            progress: 0,
            // 5. speed
            isSpeedPopupOpen: false,
            // 6. record
            activedRouteUuid: null
        };
        // observeStore(this.onFlyStop.bind(this), ['widgetsState', this.props.id, 'flyStop']);
        // observeStore(this.onRecordAdd.bind(this), ['widgetsState', this.props.id, 'recordAdd']);
    }
    /* async */ _reset(jimuMapView) {
        this.uiLoadingCallbacks = {
            onLoading: this.handleFlyLoading,
            onLoaded: this.handleFlyLoaded
        };
        this.flyStateCallbacks = {
            // onPreparing:
            onFly: this.handleFlyPlay,
            onPause: this.handleFlyPause,
            onFinish: this.handleFlyFinish,
            onUpdateProgress: this.handleUpdateProgress
        };
        // this.onSpeedChange(null);
        if (utils.isDefined(jimuMapView)) {
            this._resetFlyManager();
        }
    }
    _resetFlyManager() {
        var _a;
        (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.destructor();
        this.flyManager = new FlyManager({
            widgetConfig: this.props.config,
            isBuilderSettingFlag: false,
            jimuMapView: this.props.jimuMapView,
            viewGroup: this.props.viewGroup,
            uiLoadingCallbacks: this.uiLoadingCallbacks,
            flyStateCallbacks: this.flyStateCallbacks,
            drawOrUpdateGraphics: this.handleDrawOrUpdateGraphics,
            highlightGraphics: this.highlightGraphics,
            onItemsUpdate: this.handleFlyManagerItemsUpdate,
            onBeforeSwitchMap: this.handleAutoControlMapPublish,
            onTerrainLoaded: this.onTerrainLoaded
        });
        this.flyManager.unRegisterItem();
        this.handleFlyStyleChange(null);
    }
    getCurrentActiveItemName() {
        const config = this.flyManager.getActiveItemConfig();
        return config === null || config === void 0 ? void 0 : config.name;
    }
    componentDidMount() {
        this._reset(this.props.jimuMapView);
    }
    componentWillUnmount() {
        var _a;
        this.resetDefaultUI({ isCleanGraphics: true });
        (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.destructor();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.config !== prevProps.config) {
            this._resetFlyManager();
            this.handleClearBtnClick();
        }
        // map changed
        const isMapChanged = (this.props.jimuMapView !== prevProps.jimuMapView);
        const { isTriggeredByFly, isTriggeredByMapSelf } = utils.getMapSwitchingInfo(this.props.widgetId, this.props.autoControlWidgetId, this.props.useMapWidgetIds[0]);
        if (isMapChanged) {
            this.setState({ isTerrainLoaded: false });
            // switchMap
            if (!isTriggeredByFly && isTriggeredByMapSelf) {
                this.handleClearBtnClick();
            }
            else if (isTriggeredByFly) {
                // console.log('isTriggerSwitchMapByFly ==> true')
                // do nothing
            }
            if (!utils.isDefined(this.flyManager)) {
                this._resetFlyManager();
            }
            else {
                // should not pause/stop fly, bacause of switchMap()
                this.flyManager.updateJimuMapView(this.props.jimuMapView);
            }
        }
        // viewGroup
        if (this.props.viewGroup !== prevProps.viewGroup) {
            if (!utils.isDefined(this.flyManager)) {
                this._resetFlyManager();
            }
            else {
                // this.flyManager.stop({ isUpdate: true })
                this.flyManager.updateViewGroup(this.props.viewGroup);
            }
        }
        // autoplay
        if (!isMapChanged && // map not changed
            this.isAutoControlWidgetIdChanged(prevProps) && // autoControlWidgetId changed
            !isTriggeredByMapSelf // switchMap not triggered by map
        ) {
            this.handlePause();
        }
        // print preview ,#9240
        const isPauseForPrintPreview = (!prevProps.isPrintPreview && this.props.isPrintPreview); // noPrintPreview -> PrintPreview
        if (isPauseForPrintPreview) {
            this.handlePause();
        }
    }
    renderFlyStyleSelectorContent(layout) {
        // const isDisable = this.isDisableButton({ isPlaying: true });
        const item = this.flyManager.getActiveItemConfig();
        const styleTips = utils.isDefined(item) && utils.getFlyStyleTitle(item.name, this.props);
        const rotateTips = this.props.intl.formatMessage({ id: 'flyStyleRotate', defaultMessage: nls.flyStyleRotate });
        const pathTips = this.props.intl.formatMessage({ id: 'flyStylePath', defaultMessage: nls.flyStylePath });
        const routeTips = this.props.intl.formatMessage({ id: 'flyStyleRoute', defaultMessage: nls.flyStyleRoute });
        const isShowArrow = this.isShowDropdownButtonArrow(layout);
        const isShowDot = this.isShowDropdownButtonDot(layout);
        const flyStyleContent = this.getFlyStyleContent();
        return (jsx(Dropdown, { isOpen: this.state.isFlyStylePopupOpen, toggle: this.toggleFlyStylePopup, className: 'dropdowns flystyle-btn', activeIcon: true },
            jsx(DropdownButton, { icon: true, className: 'btns d-flex', title: styleTips, type: 'tertiary', arrow: isShowArrow, dot: isShowDot }, flyStyleContent),
            jsx(DropdownMenu, { showArrow: false }, this.state.flyManagerItems.map((itemConfig, idx) => {
                const config = itemConfig.config;
                const style = config.name;
                const uuid = itemConfig.config.uuid;
                const isActived = (uuid === this.state.activedItemUuid);
                if (!config.isInUse) {
                    return null;
                }
                if (FlyItemMode.Rotate === style) {
                    return (jsx("div", { key: idx },
                        jsx(DropdownItem, { className: 'dropdown-items', title: rotateTips, onClick: () => this.handleFlyStyleChange(uuid), active: isActived },
                            jsx(RoutePointOutlined, null),
                            jsx("span", { className: 'mx-2' }, rotateTips))));
                }
                else if (FlyItemMode.Path === style) {
                    return (jsx("div", { key: idx },
                        jsx(DropdownItem, { className: 'dropdown-items', title: pathTips, onClick: () => this.handleFlyStyleChange(uuid), active: isActived },
                            jsx(AlongPathOutlined, null),
                            jsx("span", { className: 'mx-2' }, pathTips))));
                }
                else if (FlyItemMode.Route === style) {
                    return (jsx("div", { key: idx },
                        jsx(DropdownItem, { className: 'dropdown-items', title: routeTips, onClick: () => this.handleFlyStyleChange(uuid), active: isActived },
                            jsx(RouteOutlined, null),
                            jsx("span", { className: 'mx-2' }, routeTips))));
                }
                return null;
            }))));
    }
    renderLiveviewSettingContent() {
        var _a;
        const isDisable = this.isDisableButton({ isPlaying: true, focusedGraphic: true });
        const settings = this.props.intl.formatMessage({ id: 'settings', defaultMessage: jimuUiNls.settings });
        // const heading = this.props.intl.formatMessage({ id: 'heading', defaultMessage: nls.heading });
        const tilt = this.props.intl.formatMessage({ id: 'tilt', defaultMessage: jimuUiNls.tilt });
        const altitude = this.props.intl.formatMessage({ id: 'altitude', defaultMessage: jimuUiNls.altitude });
        const degree = this.props.intl.formatMessage({ id: 'degree', defaultMessage: jimuUiNls.degree });
        const meter = this.props.intl.formatMessage({ id: 'meter', defaultMessage: jimuUiNls.meter });
        const meterAbbr = this.props.intl.formatMessage({ id: 'meterAbbr', defaultMessage: jimuUiNls.meterAbbr });
        const ground = this.props.intl.formatMessage({ id: 'ground', defaultMessage: jimuUiNls.ground });
        const space = this.props.intl.formatMessage({ id: 'outerSpace', defaultMessage: jimuUiNls.outerSpace });
        const relative2Ground = this.props.intl.formatMessage({ id: 'relative2Ground', defaultMessage: jimuUiNls.relative2Ground });
        const flyStyle = (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.getFlyStyle();
        return (jsx(Dropdown, { isOpen: this.state.isLiveview, toggle: this.toggleLiveviewSettingPopup, className: 'dropdowns liveview-btn' },
            jsx(DropdownButton, { icon: true, className: 'btns d-flex', disabled: isDisable, title: settings, type: 'tertiary', arrow: false },
                jsx(SettingOutlined, null)),
            jsx(DropdownMenu, { showArrow: false, css: getDropdownStyle(this.props.theme) },
                (flyStyle === FlyItemMode.Rotate) &&
                    jsx("div", { className: 'd-flex dropdown-items flex-column' },
                        jsx("span", { className: 'd-flex dropdown-item-title' }, tilt),
                        jsx(Slider, { id: 'setting-tilt', className: 'd-flex', size: 'sm', value: this.state.settingTilt, min: Constraints.TILT.MIN, max: Constraints.TILT.MAX, step: Constraints.TILT.STEP, onChange: (evt) => this.handleTiltChange(evt.target.value, { setToController: true, isNeedHighlight: true }), title: utils.showLiveviewSetting(this.state.settingTilt, degree) })),
                (flyStyle === FlyItemMode.Path) &&
                    jsx(React.Fragment, null,
                        jsx("div", { className: 'd-flex dropdown-items flex-column' },
                            jsx("span", { className: 'd-flex dropdown-item dropdown-item-title' }, altitude),
                            jsx(Slider, { id: 'setting-altitude', className: 'd-flex dropdown-item', size: 'sm', value: this.state.settingAltitude, min: Constraints.ALT.MIN, max: Constraints.ALT.MAX, step: Constraints.ALT.STEP, onChange: (evt) => __awaiter(this, void 0, void 0, function* () { return this.handleAltitudeChange(parseFloat(evt.target.value), { setToController: true, isNeedHighlight: true }); }), title: utils.showLiveviewSetting(this.state.settingAltitude, meter) }),
                            jsx("div", { className: 'd-flex justify-content-between dropdown-item-comment dropdown-item' },
                                jsx("span", null, ground),
                                jsx("span", null, space))),
                        jsx("div", { className: 'd-flex dropdown-items flex-column' },
                            jsx("div", { className: 'd-flex alt-wapper' },
                                jsx("div", { className: 'alt-input' },
                                    jsx(NumericInput, { defaultValue: '0', size: 'sm', value: this.state.settingAltitude, min: Constraints.ALT.MIN, max: Constraints.ALT.MAX, onChange: (val) => __awaiter(this, void 0, void 0, function* () { return this.handleAltitudeChange(val, { setToController: true, isNeedHighlight: true }); }) })),
                                jsx("span", { className: 'setting-altitude-separator' }, meterAbbr),
                                relative2Ground))))));
    }
    renderPlayStateContent() {
        let tips = null;
        const isDisable = this.isDisableButton({ isPlaying: true, isLiveview: true, focusedGraphic: true }) &&
            (this.state.activedRouteUuid === null); // choose a route
        let iconContent = null;
        if (this.state.isPlaying) {
            iconContent = jsx(PauseOutlined, null);
            tips = this.props.intl.formatMessage({ id: 'pause', defaultMessage: jimuUiNls.pause });
        }
        else {
            iconContent = jsx(PlayOutlined, null);
            tips = this.props.intl.formatMessage({ id: 'play', defaultMessage: jimuUiNls.play });
        }
        return (jsx(Button, { icon: true, onClick: this.handlePlayStateBtnClick, title: tips, disabled: isDisable, className: 'btns play-btn', type: 'tertiary' }, iconContent));
    }
    renderProgressBarContent(layout) {
        var _a;
        const type = (layout === PanelLayout.Palette ? 'circular' : 'linear');
        if (((_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.getFlyStyle()) === FlyItemMode.Path) {
            return jsx(Progress, { type: type, value: this.state.progress, className: 'w-100' });
        }
        else {
            return null;
        }
    }
    renderSpeedControllerContent() {
        const speedTips = this.props.intl.formatMessage({ id: 'speed', defaultMessage: jimuUiNls.speed });
        const speed = this.props.intl.formatNumber(utils.speedMapping(this.state.settingSpeed));
        const title = speedTips + ': ' + (speed + 'x');
        // Hash: settingSpeed,   shown
        //            0,        0.125x
        //            0.25,     0.25x
        //            0.375,    0.5x
        //            0.5 ,     1x
        //            0.59375,  1.5x
        //            0.625,    2x
        //            0.75,     4x
        //            1,        8x
        const speedList = [0, 0.25, 0.375, 0.5, 0.59375, 0.625, 0.75, 1];
        const len = speedList.length;
        return (jsx("div", { className: 'd-flex item align-items-center h-100' },
            jsx(Slider, { id: 'setting-speed', className: 'd-flex speed-controller', value: speedList.indexOf(this.state.settingSpeed), min: 0, max: len - 1, step: 1, size: 'sm', onChange: (evt) => this.handleSpeedChange(speedList[evt.target.value]), title: title })));
    }
    renderSpeedControllerContentPalette() {
        const speedTips = this.props.intl.formatMessage({ id: 'speed', defaultMessage: jimuUiNls.speed });
        const speed = utils.speedMapping(this.state.settingSpeed);
        const formattedSpeed = this.props.intl.formatNumber(speed);
        const title = speedTips + ': ' + (formattedSpeed + 'x');
        const speedList = [0, 0.25, 0.375, 0.5, 0.59375, 0.625, 0.75, 1];
        return (jsx(Dropdown, { isOpen: this.state.isSpeedPopupOpen, toggle: this.toggleSpeedPopup, className: 'speedcontroller-btn', direction: 'up' },
            jsx(DropdownButton, { icon: true, className: 'd-flex speedcontroller-text', title: title, type: 'tertiary', arrow: false }, formattedSpeed + 'x'),
            jsx(DropdownMenu, { showArrow: false, css: getPaletteDropdownStyle( /* this.props.theme */) },
                jsx("div", { className: 'speed-popup-wapper' }, speedList.map((speed, idx) => {
                    const isActived = (speed === this.state.settingSpeed);
                    const formattedSpeed = this.props.intl.formatNumber(utils.speedMapping(speed));
                    return (jsx("div", { key: idx },
                        jsx(DropdownItem, { onClick: () => this.handleSpeedChange(speed), active: isActived },
                            jsx("span", { className: 'mx-2' }, formattedSpeed + 'x'))));
                })))));
    }
    render() {
        if (!this.state.flyManagerItems) {
            return null;
        }
        const layout = this.props.config.layout;
        const flyStyle = this.flyManager.getFlyStyle();
        const flyStyleContent = this.renderFlyStyleSelectorContent(layout);
        const liveviewSettingContent = this.renderLiveviewSettingContent();
        const playStateContent = this.renderPlayStateContent();
        const progressBar = this.renderProgressBarContent(layout);
        const speedController = this.renderSpeedControllerContent();
        const speedControllerPalette = this.renderSpeedControllerContentPalette();
        // route
        const isRouteMode = this.flyManager.isUesRouteFlyMode();
        const routeListContent = this.renderRouteFlyModeContent(layout);
        const graphicManagerShowItems = isRouteMode ? [] : [ShowItem.Point, ShowItem.Line, ShowItem.Pick, ShowItem.Clear];
        const graphicInteractionManagerContent = (jsx(GraphicInteractionManager, { onRef: this.handleRefGraphicInteractionManager, widgetId: this.props.widgetId, theme: this.props.theme, intl: this.props.intl, jimuMapView: this.props.jimuMapView, showItems: graphicManagerShowItems, isDisabled: !this.state.isTerrainLoaded, 
            //
            flyStyle: flyStyle, isPlaying: this.state.isPlaying, focusedGraphic: this.state.focusedGraphic, onFocusedGraphicChanged: this.handleFocusedGraphicChanged, 
            //
            onDrawFinish: this.handleGraphicsUpdateHanlder, onClearBtnClick: this.handleClearBtnClick, onPickHanlder: this.handlePickHanlder }));
        let flyControllerContent = null;
        if (layout === PanelLayout.Horizontal) {
            flyControllerContent = (jsx(BarLayout, { flyStyleContent: flyStyleContent, graphicInteractionManager: graphicInteractionManagerContent, 
                //
                liveviewSettingContent: liveviewSettingContent, playStateContent: playStateContent, progressBar: progressBar, speedController: speedController, 
                //
                theme: this.props.theme, isPlaying: this.state.isPlaying, isRouteMode: isRouteMode, routeListContent: routeListContent }));
        }
        else if (layout === PanelLayout.Palette) {
            flyControllerContent = (jsx(PaletteLayout, { flyStyleContent: flyStyleContent, graphicInteractionManager: graphicInteractionManagerContent, 
                //
                liveviewSettingContent: liveviewSettingContent, playStateContent: playStateContent, progressBar: progressBar, speedController: speedControllerPalette, 
                //
                theme: this.props.theme, isPlaying: this.state.isPlaying, isRouteMode: isRouteMode, routeListContent: routeListContent }));
        }
        return (jsx("div", { css: getStyle(), className: 'd-flex align-items-center justify-content-center' }, flyControllerContent));
    }
    renderRouteFlyModeContent(layout) {
        const isEnable = this.state.subCompsLoaded;
        return (jsx(RouteMenu, { theme: this.props.theme, intl: this.props.intl, layout: layout, isEnable: isEnable, itemsList: this.state.flyManagerItems, activedItemUuid: this.state.activedItemUuid, activedRouteUuid: this.state.activedRouteUuid, graphicInteractionManagerRef: this.state.graphicInteractionManagerRef, isRouteMode: this.flyManager.isUesRouteFlyMode(), onActivedRouteChange: this.handleActivedRouteChange }));
    }
}
//# sourceMappingURL=interactive-panel.js.map