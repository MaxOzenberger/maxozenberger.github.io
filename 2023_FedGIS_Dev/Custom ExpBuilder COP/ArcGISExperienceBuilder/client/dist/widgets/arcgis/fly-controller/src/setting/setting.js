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
import { React, jsx, Immutable, LayoutType, getAppStore, appActions } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { getAppConfigAction } from 'jimu-for-builder';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { FlyItemMode, RotateDirection, PathStyle, PanelLayout } from '../config';
import { Radio, Label, Loading, LoadingType } from 'jimu-ui';
// components
import { ItemMode } from './components/item-mode';
import { LayoutsContainer } from './components/layouts-container';
import { RouteList } from './components/plan-routes/route-list';
import { RouteDetail } from './components/plan-routes/route-detail';
import { RecordDetail } from './components/plan-routes/record/record-detail';
import { MapPopper } from './components/map-popper/map-popper';
import { getStyle, getSettingSectionStyles } from './style';
import nls from './translations/default';
import * as utils from '../common/utils/utils';
// fly
import FlyManager from '../common/fly-facade/fly-manager';
const ControllerStyleSize = {
    [PanelLayout.Horizontal]: { w: 262, h: 44 },
    [PanelLayout.Palette]: { w: 146, h: 94 }
};
export var PageMode;
(function (PageMode) {
    PageMode["Common"] = "flyStyle-list";
    PageMode["RouteDetails"] = "route-details";
    PageMode["RecordLoading"] = "record-loading";
    PageMode["RecordDetails"] = "record-details"; // L3
})(PageMode || (PageMode = {}));
export var NewFeatureMode;
(function (NewFeatureMode) {
    NewFeatureMode["Empty"] = "Empty";
    NewFeatureMode["Point"] = "Point";
    NewFeatureMode["Path"] = "Path";
    NewFeatureMode["Pick"] = "Pick";
})(NewFeatureMode || (NewFeatureMode = {}));
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        // autoplayActive
        // handleAutoControlMapPublish = (): void => {
        //   getAppStore().dispatch(appActions.requestAutoControlMapWidget(this.props.useMapWidgetIds[0], this.props.widgetId))
        // }
        // 0
        this.handleMapWidgetChange = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.handleActiveViewChange = (jimuMapView /*, previousActiveViewId: string */) => {
            var _a;
            if (!utils.isDefined(jimuMapView) || jimuMapView.view.type === '2d') {
                this.setState({ jimuMapView: null });
            }
            else if (((_a = this.state.jimuMapView) === null || _a === void 0 ? void 0 : _a.id) !== jimuMapView.id) {
                this.setState({ jimuMapView: jimuMapView });
            }
        };
        // fly callback
        this.handleFlyPlay = () => {
            // console.log('setting onFlyPlay()')
        };
        this.handleFlyPause = () => {
            // console.log('setting onFlyPause()')
            this.setState({ isPreviewRouteBtnPlaying: false });
        };
        this.handleFlyFinish = () => {
            // console.log('setting onFlyFinish()')
            this.setState({ isPreviewRouteBtnPlaying: false });
        };
        this.handleFlyModesChange = (isInUse, idx) => {
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const $item = Immutable(items[idx]);
            let item;
            if ($item.name === FlyItemMode.Rotate) {
                item = $item.set('isInUse', isInUse);
                items.splice(idx, 1, item.asMutable({ deep: true }));
            }
            else if ($item.name === FlyItemMode.Path) {
                item = $item.set('isInUse', isInUse);
                items.splice(idx, 1, item.asMutable({ deep: true }));
            }
            else if ($item.name === FlyItemMode.Route) {
                item = $item.set('isInUse', isInUse);
                items.splice(idx, 1, item.asMutable({ deep: true }));
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        // layouts
        this.handleControllerLayoutChanged = (layout) => {
            const style = layout; //e.target.getAttribute('data-uimode')
            const appConfigAction = getAppConfigAction();
            const { layoutInfo } = this.props;
            const size = ControllerStyleSize[style];
            const layoutType = this.getLayoutType();
            if (layoutType === LayoutType.FixedLayout) {
                appConfigAction.editLayoutItemSize(layoutInfo, size.w, size.h).exec();
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('layout', style)
            });
        };
        this.getLayoutType = () => {
            var _a, _b;
            const { layoutInfo, appConfig } = this.props;
            const layoutId = layoutInfo.layoutId;
            const layoutType = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.type;
            return layoutType;
        };
        // 1 Rotate Setting
        this.handleRotateRadioChange = (dir, idx) => {
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const $item = Immutable(items[idx]);
            if ($item.name === FlyItemMode.Rotate) {
                const item = $item.set('direction', dir);
                items.splice(idx, 1, item.asMutable({ deep: true }));
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('itemsList', items)
                });
            }
        };
        // 2 Path Setting
        this.handlePathRadioChange = (style, idx) => {
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const $item = Immutable(items[idx]);
            if ($item.name === FlyItemMode.Path) {
                const item = $item.set('style', style);
                items.splice(idx, 1, item.asMutable({ deep: true }));
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('itemsList', items)
                });
            }
        };
        // for render
        this.renderRotateSetting = (styleConfig, idx) => {
            const isCW = (styleConfig.direction === RotateDirection.CW);
            const klass = getSettingSectionStyles(this.props.config.itemsList, idx, this.state.flyModesUICollapseMap.getIn([String(idx)]));
            const label = this.props.intl.formatMessage({ id: 'styleLabelRotate', defaultMessage: nls.styleLabelRotate });
            const cw = this.props.intl.formatMessage({ id: 'CW', defaultMessage: nls.CW });
            const ccw = this.props.intl.formatMessage({ id: 'CCW', defaultMessage: nls.CCW });
            return (jsx(SettingSection, { className: 'd-2 item-detail-wapper ' + klass },
                jsx(SettingRow, null,
                    jsx(Label, { className: 'flystyle-label' }, label)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: isCW, id: 'CW', style: { cursor: 'pointer' }, onChange: e => this.handleRotateRadioChange(RotateDirection.CW, idx) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CW', className: 'ml-1 text-break' }, cw)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: !isCW, id: 'CCW', style: { cursor: 'pointer' }, onChange: e => this.handleRotateRadioChange(RotateDirection.CCW, idx) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CCW', className: 'ml-1 text-break' }, ccw))));
        };
        this.renderPathSetting = (styleConfig, idx) => {
            const isCurve = (styleConfig.style === PathStyle.Smoothed);
            const klass = getSettingSectionStyles(this.props.config.itemsList, idx, this.state.flyModesUICollapseMap.getIn([String(idx)]));
            const label = this.props.intl.formatMessage({ id: 'styleLabelPath', defaultMessage: nls.styleLabelPath });
            const smoothedCurve = this.props.intl.formatMessage({ id: 'pathTypeSmoothedCurve', defaultMessage: nls.pathTypeSmoothedCurve });
            const realPath = this.props.intl.formatMessage({ id: 'pathTypeRealPath', defaultMessage: nls.pathTypeRealPath });
            return (jsx(SettingSection, { className: 'd-2 item-detail-wapper ' + klass },
                jsx(SettingRow, null,
                    jsx(Label, { className: 'flystyle-label text-truncate' }, label)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: isCurve, id: 'CURVED', style: { cursor: 'pointer' }, onChange: e => this.handlePathRadioChange(PathStyle.Smoothed, idx) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CURVED', className: 'ml-1 text-break' }, smoothedCurve)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: !isCurve, id: 'LINE', style: { cursor: 'pointer' }, onChange: e => this.handlePathRadioChange(PathStyle.RealPath, idx) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'LINE', className: 'ml-1 text-break' }, realPath))));
        };
        this.handleRefGraphicInteractionManager = (ref) => {
            this.graphicInteractionManagerRef = ref;
            this.setState({ isDrawHelperLoaded: true });
            if (ref === null) {
                this.setState({ isDrawHelperLoaded: false });
            }
        };
        this.handleToggleFlyModesUICollapse = (idx, isUICollapse) => {
            this.setState({
                flyModesUICollapseMap: this.state.flyModesUICollapseMap.setIn([String(idx)], isUICollapse)
            });
        };
        /// ////////////////////////////////////////////////////////////////////
        // planned routes
        // state
        this.handleSettingPageModeChange = (mode) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.stopFly();
            this.setState({ pageMode: mode });
            this.setState({ playingInfo: null }); // clean when PageModeChange
            if (mode === PageMode.Common) {
                this.setState({ activedRouteUuid: null, activedRecordUuid: null }); // clean ids in PageMode.Common
                this.handleShowMapPopperChange(false);
            }
            else {
                this.handleShowMapPopperChange(true);
            }
            // clean newestRecord & PreviewingRouteInfo when outof L2 page
            if (mode !== PageMode.RouteDetails && mode !== PageMode.RecordLoading) {
                this.setState({ newestRecordIdx: null, playingInfo: null });
            }
            // highlight
            if (mode === PageMode.RouteDetails) {
                (_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.highlight(null); // clean highlight, when goto L2
            }
        });
        this.handleShowMapPopperChange = (isShow, mode) => __awaiter(this, void 0, void 0, function* () {
            // await this.stopFly();
            this.setState({ isShowMapPopper: isShow });
            if (!isShow) {
                this.setState({ isTerrainLoaded: false });
                if (utils.isDefined(mode)) {
                    this.handleSettingPageModeChange(mode);
                }
            }
        });
        this.handleMapPopperJimuMapViewUpdate = (jimuMapView) => {
            this.setState({ isTerrainLoaded: false });
            this.setState({ mapPopperJimuMapView: jimuMapView }, () => {
                var _a;
                const { isTriggeredByFly, isTriggeredByMapSelf } = utils.getMapSwitchingInfo(this.props.widgetId, this.props.autoControlWidgetId, utils.genJimuMapIdForFly(this.props.useMapWidgetIds[0]));
                // switchMap
                if (!isTriggeredByFly && isTriggeredByMapSelf) {
                    (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.stop();
                }
                else if (isTriggeredByFly) {
                    // do nothing
                }
                if (!utils.isDefined(this.flyManager)) {
                    this.initFlyManager();
                }
                else {
                    this.flyManager.stop({ isUpdate: true });
                    this.flyManager.updateJimuMapView(this.state.mapPopperJimuMapView);
                }
            });
        };
        this.handleAutoControlMapPublish = () => {
            getAppStore().dispatch(appActions.requestAutoControlMapWidget(utils.genJimuMapIdForFly(this.props.useMapWidgetIds[0]), this.props.widgetId));
        };
        this.handleMapPopperViewGroupUpdate = (viewGroup) => {
            this.setState({ viewGroup: viewGroup }, () => {
                if (!utils.isDefined(this.flyManager)) {
                    this.initFlyManager();
                }
                else {
                    this.flyManager.stop({ isUpdate: true });
                    this.flyManager.updateViewGroup(this.state.viewGroup);
                }
            });
        };
        this.getSpecifiedJimuMapId = () => {
            return utils.genJimuMapIdForFly(this.props.useMapWidgetIds[0]);
        };
        this.handleFlyManagerItemsUpdate = (items) => {
            this.setState({ flyManagerItems: items });
        };
        this.onTerrainLoaded = () => {
            // console.log('onTerrainLoaded')
            this.setState({ isTerrainLoaded: true });
        };
        // config
        // routeConfig
        this.handleRoutesOrderUpdate = (treeItems) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const reorderdItems = [];
            treeItems.forEach((item /*, keyIdx */) => {
                const key = item.itemKey;
                const route = routesModeConfig.routes.find((route) => (route.idx === key));
                reorderdItems.push(route);
            });
            routesModeConfig.routes = reorderdItems;
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        this.handleRouteConfigPush = (routesConfig) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            routesModeConfig.routes.push(routesConfig);
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        this.handleRouteConfigDelete = (routeIdx) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const idx = routesModeConfig.routes.findIndex(route => (route.idx === routeIdx));
            if (idx > -1) {
                routesModeConfig.routes.splice(idx, 1); // remove
                items.splice(flyModeId, 1, routesModeConfig); // update
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('itemsList', items)
                });
            }
        };
        this.handleRouteDisplayNameChange = (routeIdx, name) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const idx = routesModeConfig.routes.findIndex(route => (route.idx === routeIdx));
            const route = routesModeConfig.routes[idx];
            route.displayName = name;
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        this.handleRouteToggleVisibilityChange = (ids, visible) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const idx = routesModeConfig.routes.findIndex(route => (route.idx === ids.routeUuid));
            const route = routesModeConfig.routes[idx];
            route.isInUse = visible;
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        // recordConfig
        this.handleRecordsOrderUpdate = (treeItems) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const routeId = this.state.activedRouteUuid;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const route = routesModeConfig.routes.find(route => (route.idx === routeId));
            const recordsConfig = route.records;
            const reorderdRecords = [];
            treeItems.forEach((item /*, keyIdx */) => {
                const key = item.itemKey;
                const record = recordsConfig.find((record) => (record.idx === key));
                // TODO if(record.storedGraphicsInfo.type === )
                record.storedGraphicsInfo.rawData.graphics.forEach((graphic) => {
                    graphic.symbol = null;
                });
                reorderdRecords.push(record);
            });
            route.records = reorderdRecords;
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        this.handleRecordConfigPush = (recordConfig) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const routeId = this.state.activedRouteUuid;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const route = routesModeConfig.routes.find(route => (route.idx === routeId));
            route.records.push(recordConfig);
            items.splice(flyModeId, 1, routesModeConfig); // update
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('itemsList', items)
            });
        };
        this.handleRecordConfigDelete = (recordIdx) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const routeId = this.state.activedRouteUuid;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const route = routesModeConfig.routes.find(route => (route.idx === routeId));
            const records = route.records;
            const idx = records.findIndex(record => (record.idx === recordIdx));
            if (idx > -1) {
                records.splice(idx, 1); // remove
                items.splice(flyModeId, 1, routesModeConfig); // update
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('itemsList', items)
                });
            }
        };
        this.handleRecordConfigUpdate = (recordConfig) => {
            const flyModeId = this.state.activedRecordFlyStyleIdx;
            const routeId = this.state.activedRouteUuid;
            const recordIdx = recordConfig.idx;
            const items = this.props.config.itemsList.asMutable({ deep: true });
            const routesModeConfig = items[flyModeId];
            const route = routesModeConfig.routes.find(route => (route.idx === routeId));
            const records = route.records;
            const idx = records.findIndex(record => (record.idx === recordIdx));
            if (idx > -1) {
                records.splice(idx, 1, recordConfig); // update
                items.splice(flyModeId, 1, routesModeConfig); // update
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('itemsList', items)
                });
            }
        };
        this.handleRecordModeSelected = (idx) => {
            this.setState({ activedRecordFlyStyleIdx: idx });
        };
        // level-1 routes-list
        this.handleRouteAdd = (routesConfig) => {
            this.handleRouteConfigPush(routesConfig);
            setTimeout(() => {
                this.handleRouteEdit({ routeUuid: routesConfig.idx });
            }, 100);
        };
        this.handleRouteDelete = (ids) => {
            this.handleRouteConfigDelete(ids.routeUuid);
        };
        this.handleRouteEdit = (ids) => {
            // this.setState({ activedRecordFlyStyleIdx: flyModeIdx });
            this.setState({ activedRouteUuid: ids.routeUuid });
            this.handleSettingPageModeChange(PageMode.RouteDetails);
        };
        this.getCurrentRouteName = () => {
            const routesConfig = this.flyManager.getRouteConfigByIdx({ routeUuid: this.state.activedRouteUuid });
            return routesConfig === null || routesConfig === void 0 ? void 0 : routesConfig.displayName;
        };
        this.renderRoutesList = (routeConfig, idx) => {
            const { theme, intl } = this.props;
            const klass = getSettingSectionStyles(this.props.config.itemsList, idx, this.state.flyModesUICollapseMap.getIn([String(idx)]));
            // this.onRecordModeSelected(idx);// react warn: setState in render
            return (jsx(SettingSection, { className: 'd-2 item-detail-wapper ' + klass },
                jsx(RouteList, { useMapWidgetIds: this.props.useMapWidgetIds, jimuMapView: this.state.jimuMapView, theme: theme, intl: intl, 
                    //
                    flyModeIdx: idx, routeConfig: routeConfig, 
                    // onSettingPageModeChange={this.onSettingPageModeChange}
                    onRouteEdit: this.handleRouteEdit, onRouteAdd: this.handleRouteAdd, onRouteDelete: this.handleRouteDelete, onRouteToggleVisibilityChange: this.handleRouteToggleVisibilityChange, onRoutesOrderUpdate: this.handleRoutesOrderUpdate })));
        };
        this.stopFly = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            // await this.flyManager?.pause();
            yield ((_b = this.flyManager) === null || _b === void 0 ? void 0 : _b.stop());
        });
        // level-2 route-details & record-list
        this.handleRecordAdd = (record) => __awaiter(this, void 0, void 0, function* () {
            yield this.stopFly();
            this.handleRecordConfigPush(record);
            this._handleRecordAddNotify(record.idx); // for level-2 badge
        });
        this._handleRecordAddNotify = (idx) => {
            this.setState({ newestRecordIdx: idx });
        };
        this.handleRecordAddAndEdit = (record) => __awaiter(this, void 0, void 0, function* () {
            yield this.stopFly();
            this.handleRecordConfigPush(record);
            yield setTimeout(() => {
                this.handleRecordEdit({ routeUuid: this.state.activedRouteUuid, recordUuid: record.idx });
            }, 100);
            return true;
        });
        this.handleRouteNameChange = (ids, name) => {
            this.handleRouteDisplayNameChange(ids.routeUuid, name);
        };
        this.handleRecordEdit = (ids, isTriggeredByExit) => __awaiter(this, void 0, void 0, function* () {
            yield this.stopFly();
            // 1 state
            this.setState({ activedRecordUuid: ids.recordUuid });
            if (isTriggeredByExit) {
                return; // if exit, do not update flyManager
            }
            // 2 update Record
            const isLiveview = (ids.recordUuid !== null);
            this.setState({ delayUpdateFlyManagerFlag: isLiveview, activedRecordUuid: ids.recordUuid }, () => {
                this.handleSettingPageModeChange(PageMode.RecordLoading);
                this._asyncRecordEdit(isLiveview, ids);
            });
        });
        this._asyncRecordEdit = (isLiveview, ids) => __awaiter(this, void 0, void 0, function* () {
            yield this.flyManager.setIsLiveviewSpecifiedRecord({ routeUuid: this.state.activedRouteUuid, recordUuid: this.state.activedRecordUuid }, isLiveview);
            // ui
            if (isLiveview) {
                this.handleSettingPageModeChange(PageMode.RecordDetails);
            }
            else {
                this.initFlyManager();
                this.handleSettingPageModeChange(PageMode.RouteDetails); // means backBtn to RouteConfig-Detail-page
            }
        });
        this._getCurrentLiveviewSetting = () => {
            return this.flyManager.getLiveviewSettingInfo();
        };
        this.getDefaultDuration = () => {
            return this.flyManager.getDefaultDuration();
        };
        this.handleRecordPreview = (ids) => __awaiter(this, void 0, void 0, function* () {
            this.setState({ playingInfo: ids });
            yield this.stopFly();
            // playingInfo + isPreviewRouteBtnPlaying = isPlaying
            const flyCallbacks = {
                onFly: () => __awaiter(this, void 0, void 0, function* () {
                    this.handleFlyPlay();
                    this.setState({ playingInfo: ids });
                }),
                onPause: () => __awaiter(this, void 0, void 0, function* () {
                    this.handleFlyPause();
                    yield this.handlePauseRecordPreview(null, true);
                }),
                onFinish: () => __awaiter(this, void 0, void 0, function* () {
                    this.handleFlyFinish();
                    yield this.handleFinishRecordPreview();
                })
            };
            yield this.flyManager.previewSpecifiedRecord({ routeUuid: this.state.activedRouteUuid, recordUuid: ids.recordUuid }, flyCallbacks);
        });
        this.handlePauseRecordPreview = (ids, avoidTrigger) => __awaiter(this, void 0, void 0, function* () {
            if (!avoidTrigger) {
                yield this.stopFly(); // trigger stop
            }
            this.setState({ playingInfo: null });
        });
        this.handleFinishRecordPreview = ( /* ids: FlyIds */) => __awaiter(this, void 0, void 0, function* () {
            this.setState({ playingInfo: null });
        });
        this.handleRecordDelete = (ids) => __awaiter(this, void 0, void 0, function* () {
            yield this.stopFly();
            this.handleRecordConfigDelete(ids.recordUuid);
            this.setState({ playingInfo: null });
        });
        // Route preview
        this.handlePreviewRoute = (speed, ids, needToReset) => __awaiter(this, void 0, void 0, function* () {
            const playingInfo = this.state.playingInfo;
            if (playingInfo && playingInfo.routeUuid === null && playingInfo.recordUuid !== null) {
                yield this.stopFly(); // stop RecordPreview
            } // else do not stop current fly
            const flyIds = { routeUuid: ids.routeUuid };
            if (needToReset) { // needToReset e.g. configs changed
                yield this.flyManager.prepareRoutePreview(flyIds);
            }
            this.setState({ isPreviewRouteBtnPlaying: true });
            this.setState({ playingInfo: ids });
            yield this.flyManager.previewSpecifiedRoute(speed, flyIds);
        });
        this.handlePauseRoutePreview = () => {
            var _a;
            (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.pause();
            this.setState({ isPreviewRouteBtnPlaying: false });
        };
        this.handleNewFeatureModeChange = (mode) => __awaiter(this, void 0, void 0, function* () {
            yield this.stopFly();
            if (this.state.newFeatureMode !== mode) {
                this.setState({ newFeatureMode: mode });
            }
        });
        this.renderRouteDetailPage = () => {
            var _a;
            let content;
            const { theme, intl } = this.props;
            const { newFeatureMode } = this.state;
            const routesConfig = this.flyManager.getRouteConfigByIdx({ routeUuid: this.state.activedRouteUuid });
            if (!utils.isDefined(this.state.mapPopperJimuMapView)) {
                // loading
                content = jsx(Loading, { type: LoadingType.Secondary });
            }
            else {
                content = (utils.isDefined(routesConfig) &&
                    jsx(RouteDetail, { routeConfig: routesConfig, mapPopperJimuMapView: this.state.mapPopperJimuMapView, isTerrainLoaded: this.state.isTerrainLoaded, theme: theme, intl: intl, 
                        //
                        onShowMapPopperChange: this.handleShowMapPopperChange, onSettingPageModeChange: this.handleSettingPageModeChange, 
                        //
                        onRouteNameChange: this.handleRouteNameChange, onRouteDelete: this.handleRouteDelete, onRouteEdit: this.handleRouteEdit, newFeatureMode: newFeatureMode, onNewFeatureModeChange: this.handleNewFeatureModeChange, 
                        //
                        isPreviewRouteBtnPlaying: this.state.isPreviewRouteBtnPlaying, onPreviewRoute: this.handlePreviewRoute, onPauseRoutePreview: this.handlePauseRoutePreview, newestRecordIdx: this.state.newestRecordIdx, 
                        //
                        playingInfo: this.state.playingInfo, 
                        //
                        onRecordEdit: this.handleRecordEdit, onRecordPreview: this.handleRecordPreview, onPauseRecordPreview: this.handlePauseRecordPreview, onRecordDelete: this.handleRecordDelete, onRecordsOrderUpdate: this.handleRecordsOrderUpdate, 
                        //
                        isRecordCanPlay: (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.isRecordCanPlay, isDrawHelperLoaded: this.state.isDrawHelperLoaded }));
            }
            return content;
        };
        // level-3  record details setting
        this.buildTemporaryRecordConfig = (graphicsInfo, cameraInfo, jimuMapView) => {
            return this.flyManager.buildTemporaryRecordConfig(graphicsInfo, cameraInfo, jimuMapView);
        };
        this.buildDefaultRecord = (recordConfig, graphicsInfoRef) => __awaiter(this, void 0, void 0, function* () {
            const record = yield this.flyManager.buildTemporaryRecord(recordConfig, this.state.jimuMapView.view, null, graphicsInfoRef);
            return record;
        });
        this.getPopperJimuMapId = () => {
            return utils.removeJimuMapIdForFly(this.state.mapPopperJimuMapView.id);
        };
        this.handleRecordChange = (record) => {
            this.handleRecordConfigUpdate(record);
        };
        this.handleLiveviewSettingChange = (settingParamObj) => {
            this.flyManager.onLiveviewParamChange(settingParamObj, { isNeedHighlight: true });
        };
        this.renderRecordLoadingPage = () => {
            return jsx(Loading, { type: LoadingType.Secondary });
        };
        this.renderRecordDetailPage = () => {
            const { theme, intl } = this.props;
            const record = this.flyManager.getRecordByIds({ routeUuid: this.state.activedRouteUuid, recordUuid: this.state.activedRecordUuid });
            return (utils.isDefined(record) &&
                jsx(RecordDetail, { record: record, mapPopperJimuMapView: this.state.mapPopperJimuMapView, theme: theme, intl: intl, 
                    //
                    onRecordEdit: this.handleRecordEdit, onRecordChange: this.handleRecordChange, 
                    //
                    getCurrentLiveviewSetting: this._getCurrentLiveviewSetting, onLiveviewSettingChange: this.handleLiveviewSettingChange, getDefaultDuration: this.getDefaultDuration }));
        };
        // graphicInteractionManager callback
        // draw(update) graphics back
        this.handleDrawOrUpdateGraphics = (record) => {
            var _a;
            if (typeof ((_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.drawOrUpdateGraphics) === 'function') {
                return this.graphicInteractionManagerRef.drawOrUpdateGraphics(record); // draw graphics back
            }
        };
        this.handleRemoveGraphics = (graphics) => {
            var _a;
            (_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.removeGraphics(graphics);
        };
        this.handleHighlightGraphics = (graphics) => {
            var _a;
            if (typeof ((_a = this.graphicInteractionManagerRef) === null || _a === void 0 ? void 0 : _a.highlight) === 'function') {
                this.graphicInteractionManagerRef.highlight(graphics); // highlight graphics
            }
        };
        this.state = {
            jimuMapView: null,
            viewGroup: null,
            pageMode: PageMode.Common,
            isShowMapPopper: false,
            mapPopperJimuMapView: null,
            // flyManager
            flyManagerItems: null,
            isTerrainLoaded: false,
            // active states
            activedRecordFlyStyleIdx: null,
            activedRouteUuid: null,
            activedRecordUuid: null,
            // playing
            isPreviewRouteBtnPlaying: false,
            playingInfo: null,
            newestRecordIdx: null,
            // liveview
            delayUpdateFlyManagerFlag: false,
            // for draw
            isDrawHelperLoaded: false,
            newFeatureMode: NewFeatureMode.Empty,
            // flyMode UX
            flyModesUICollapseMap: this._initFlyModesUICollapseState()
        };
    }
    _initFlyModesUICollapseState() {
        const map = {};
        const itemsList = this.props.config.itemsList.asMutable({ deep: true });
        itemsList.forEach((styleConfig, idx) => {
            if (styleConfig.isInUse) {
                map[String(idx)] = false;
            }
            else {
                map[String(idx)] = true;
            }
        });
        return Immutable(map);
    }
    componentDidMount() {
        const firstRouteItemIdx = 2; // react warn: setState in render
        this.handleRecordModeSelected(firstRouteItemIdx);
        this.initFlyManager();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.config !== prevProps.config) {
            this.initFlyManager();
        }
        // setting page changed
        if (this.props.settingPanelChange !== prevProps.settingPanelChange) {
            this.handleRouteEdit({ routeUuid: null }); // L2
            this.handleRecordEdit({ routeUuid: null, recordUuid: null }, true); // L3
            this.handleSettingPageModeChange(PageMode.Common);
            this.initFlyManager();
        }
        // autoplay
        // if (this.props.autoControlWidgetId !== prevProps.autoControlWidgetId) {
        //   this.handleAutoControlMapSubscribe()
        // }
    }
    render() {
        var _a, _b;
        const itemsList = this.props.config.itemsList.asMutable({ deep: true });
        const selectMapTips = this.props.intl.formatMessage({ id: 'selectMap', defaultMessage: nls.selectMap });
        const selectStyleTips = this.props.intl.formatMessage({ id: 'selectStyle', defaultMessage: nls.selectStyle });
        const { theme, useDataSources, useMapWidgetIds, config, intl } = this.props;
        const { jimuMapView, isShowMapPopper, newFeatureMode } = this.state;
        const activedRouteConfig = (_a = this.flyManager) === null || _a === void 0 ? void 0 : _a.getRouteConfigByIdx({ routeUuid: this.state.activedRouteUuid });
        return (jsx("div", { className: ' h-100', css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-fly-controller h-100' },
                (PageMode.Common === this.state.pageMode) &&
                    jsx(React.Fragment, null,
                        jsx(SettingSection, { className: 'map-selector-section' },
                            jsx(SettingRow, { flow: 'wrap' },
                                jsx("div", { className: 'select-map-descript text-break' }, selectMapTips)),
                            jsx(SettingRow, null,
                                jsx(MapWidgetSelector, { onSelect: this.handleMapWidgetChange, useMapWidgetIds: this.props.useMapWidgetIds })),
                            jsx("div", { className: 'fly-map' },
                                jsx("div", null,
                                    jsx(JimuMapViewComponent, { useMapWidgetId: (_b = this.props.useMapWidgetIds) === null || _b === void 0 ? void 0 : _b[0], onActiveViewChange: this.handleActiveViewChange })))),
                        jsx(LayoutsContainer, { widgetId: this.props.id, layout: this.props.config.layout, onChange: this.handleControllerLayoutChanged }),
                        jsx(SettingSection, { title: selectStyleTips }, itemsList.map((styleConfig, idx) => {
                            const style = styleConfig.name;
                            if (FlyItemMode.Rotate === style) {
                                return (jsx("div", { key: idx },
                                    jsx(ItemMode, { idx: idx, styleConfig: styleConfig, handleFlyModesChange: this.handleFlyModesChange, flyModesUICollapseMap: this.state.flyModesUICollapseMap, handleToggleFlyModesUICollapse: this.handleToggleFlyModesUICollapse }),
                                    this.renderRotateSetting(styleConfig, idx)));
                            }
                            else if (FlyItemMode.Path === style) {
                                return (jsx("div", { key: idx },
                                    jsx(ItemMode, { idx: idx, styleConfig: styleConfig, handleFlyModesChange: this.handleFlyModesChange, flyModesUICollapseMap: this.state.flyModesUICollapseMap, handleToggleFlyModesUICollapse: this.handleToggleFlyModesUICollapse }),
                                    this.renderPathSetting(styleConfig, idx)));
                            }
                            else if (FlyItemMode.Route === style) {
                                return (jsx("div", { key: idx },
                                    jsx(ItemMode, { idx: idx, styleConfig: styleConfig, handleFlyModesChange: this.handleFlyModesChange, flyModesUICollapseMap: this.state.flyModesUICollapseMap, handleToggleFlyModesUICollapse: this.handleToggleFlyModesUICollapse }),
                                    this.renderRoutesList(styleConfig, idx)));
                            }
                            return null;
                        }))),
                (PageMode.RouteDetails === this.state.pageMode) && this.renderRouteDetailPage(),
                (PageMode.RecordLoading === this.state.pageMode) && this.renderRecordLoadingPage(),
                (PageMode.RecordDetails === this.state.pageMode) && this.renderRecordDetailPage(),
                this.state.isShowMapPopper && activedRouteConfig &&
                    jsx(MapPopper, { specifiedJimuMapId: this.getSpecifiedJimuMapId(), theme: theme, intl: intl, config: config, isShowMapPopper: isShowMapPopper, useDataSources: useDataSources, useMapWidgetIds: useMapWidgetIds, jimuMapView: jimuMapView, isTerrainLoaded: this.state.isTerrainLoaded, onRefGraphicInteractionManager: this.handleRefGraphicInteractionManager, activedRouteConfig: activedRouteConfig, 
                        //
                        pageMode: this.state.pageMode, onShowMapPopperChange: this.handleShowMapPopperChange, 
                        //
                        newFeatureMode: newFeatureMode, onNewFeatureModeChange: this.handleNewFeatureModeChange, 
                        //
                        onMapPopperJimuMapViewUpdate: this.handleMapPopperJimuMapViewUpdate, onMapPopperViewGroupUpdate: this.handleMapPopperViewGroupUpdate, 
                        //
                        onRecordAdd: this.handleRecordAdd, onRecordAddAndEdit: this.handleRecordAddAndEdit, buildTemporaryRecordConfig: this.buildTemporaryRecordConfig, buildDefaultRecord: this.buildDefaultRecord, getPopperJimuMapId: this.getPopperJimuMapId, 
                        //
                        playingInfo: this.state.playingInfo, isPreviewRouteBtnPlaying: this.state.isPreviewRouteBtnPlaying, 
                        //
                        onRemoveGraphics: this.handleRemoveGraphics, stopFly: this.stopFly }))));
    }
    initFlyManager() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.delayUpdateFlyManagerFlag) {
                return; // skip
            }
            // await this.stopFly();
            this.flyManager = new FlyManager({
                widgetConfig: this.props.config,
                isBuilderSettingFlag: true,
                jimuMapView: this.state.mapPopperJimuMapView,
                viewGroup: this.state.viewGroup,
                // uiLoadingCallbacks: {
                //   onLoading: this.handleFlyLoading,
                //   onLoaded: this.handleFlyLoaded
                // },
                flyStateCallbacks: {
                    onFly: this.handleFlyPlay,
                    onPause: this.handleFlyPause,
                    onFinish: this.handleFlyFinish
                },
                // call mult times in a single play, so use callback
                drawOrUpdateGraphics: this.handleDrawOrUpdateGraphics,
                highlightGraphics: this.handleHighlightGraphics,
                onItemsUpdate: this.handleFlyManagerItemsUpdate,
                onBeforeSwitchMap: this.handleAutoControlMapPublish,
                onTerrainLoaded: this.onTerrainLoaded
            });
            this.flyManager.unRegisterItem();
            const routeItem = this.flyManager.findFirstRouteItem();
            this.flyManager.registerItem((_a = routeItem.config) === null || _a === void 0 ? void 0 : _a.uuid);
        });
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f;
    const { id, useMapWidgetIds } = props;
    const mapWidgetId = useMapWidgetIds && useMapWidgetIds.length !== 0 ? utils.genJimuMapIdForFly(useMapWidgetIds[0]) : undefined;
    const mapWidgetsInfo = state && state.mapWidgetsInfo;
    return {
        appConfig: (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig,
        layoutInfo: (_c = (_b = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.widgetsState[id]) === null || _c === void 0 ? void 0 : _c.layoutInfo,
        autoControlWidgetId: mapWidgetId ? (_d = mapWidgetsInfo[mapWidgetId]) === null || _d === void 0 ? void 0 : _d.autoControlWidgetId : undefined,
        settingPanelChange: (_f = (_e = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _e === void 0 ? void 0 : _e[props.id]) === null || _f === void 0 ? void 0 : _f.settingPanelChange
    };
};
//# sourceMappingURL=setting.js.map