/** @jsx jsx */
import { React, jsx, APP_FRAME_NAME_IN_BUILDER, Immutable, lodash, css, polished, getAppStore, ResourceType } from 'jimu-core';
import { Button, FloatingPanel, ImageFillMode } from 'jimu-ui';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { JimuMap, JimuDraw } from 'jimu-ui/advanced/map';
import { TemplateType, Status, ImgSourceType } from '../../config';
import { AppResourceManager } from 'jimu-for-builder';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
import { LeftOutlined } from 'jimu-icons/outlined/directional/left';
import { DrawOutlined } from 'jimu-icons/outlined/editor/draw';
import { viewChangeBufferCompare } from '../utils';
export class MarkPopper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Graphic = null;
        this.GraphicsLayer = null;
        this.LayerList = null;
        this.Extent = null;
        this.Viewpoint = null;
        this.formatMessage = (id, values) => {
            return this.props.formatMessage(id, values);
        };
        this.changeLayerWithGraphics = (reset) => {
            const { graphics, currentSketch, updateConfig } = this.state;
            const currentLayer = currentSketch === null || currentSketch === void 0 ? void 0 : currentSketch.layer;
            const orgConfig = updateConfig === null || updateConfig === void 0 ? void 0 : updateConfig.asMutable({ deep: true });
            const useGraphics = reset ? orgConfig === null || orgConfig === void 0 ? void 0 : orgConfig.graphics : graphics;
            if (reset) {
                this.setState({ graphics: useGraphics });
            }
            const graphicsExist = (useGraphics === null || useGraphics === void 0 ? void 0 : useGraphics.length) > 0;
            currentLayer === null || currentLayer === void 0 ? void 0 : currentLayer.removeAll();
            if (graphicsExist) {
                useGraphics &&
                    useGraphics.forEach(graphic => {
                        const tempGraphic = this.Graphic.fromJSON(graphic);
                        tempGraphic.layer = currentLayer;
                        currentLayer === null || currentLayer === void 0 ? void 0 : currentLayer.add(tempGraphic);
                    });
            }
        };
        // set watcher
        this.startWatcher = (view) => {
            var _a;
            // eslint-disable-next-line
            const that = this;
            const { activeBookmarkId, jimuMapConfig } = this.props;
            const toEditBookmarkConfig = jimuMapConfig === null || jimuMapConfig === void 0 ? void 0 : jimuMapConfig.asMutable().bookmarks.find(x => x.id === activeBookmarkId);
            // view watcher
            if (view.type === '2d') {
                view.watch('extent', function (newValue) {
                    if (toEditBookmarkConfig && toEditBookmarkConfig.type !== '2d')
                        return;
                    const originExtent = (toEditBookmarkConfig === null || toEditBookmarkConfig === void 0 ? void 0 : toEditBookmarkConfig.extent) &&
                        JSON.parse(JSON.stringify(toEditBookmarkConfig.extent));
                    const curExtent = JSON.parse(JSON.stringify(newValue.toJSON()));
                    if (!viewChangeBufferCompare(originExtent, curExtent, '2d')) {
                        that.setState({ configUpdate: true });
                    }
                    else {
                        that.setState({ configUpdate: false });
                    }
                });
            }
            else {
                view.watch('viewpoint', function (newValue) {
                    if (toEditBookmarkConfig && toEditBookmarkConfig.type !== '3d')
                        return;
                    const originViewPoint = (toEditBookmarkConfig === null || toEditBookmarkConfig === void 0 ? void 0 : toEditBookmarkConfig.viewpoint) &&
                        JSON.parse(JSON.stringify(toEditBookmarkConfig.viewpoint));
                    const curViewPoint = JSON.parse(JSON.stringify(newValue.toJSON()));
                    if (!viewChangeBufferCompare(originViewPoint, curViewPoint, '3d')) {
                        that.setState({ configUpdate: true });
                    }
                    else {
                        that.setState({ configUpdate: false });
                    }
                });
            }
            // layer watcher
            const layers = (_a = view === null || view === void 0 ? void 0 : view.map) === null || _a === void 0 ? void 0 : _a.layers;
            this.layerWatcher(layers, that);
        };
        this.locateAndSetLayersConfig = (currentJimuMapView) => {
            const { updateConfig } = this.state;
            if ((updateConfig === null || updateConfig === void 0 ? void 0 : updateConfig.mapViewId) !== (currentJimuMapView === null || currentJimuMapView === void 0 ? void 0 : currentJimuMapView.id))
                return;
            const config = updateConfig.asMutable({ deep: true });
            const { viewpoint, extent } = config;
            if (currentJimuMapView && currentJimuMapView.view) {
                // location
                setTimeout(() => {
                    if (currentJimuMapView && currentJimuMapView.view) {
                        currentJimuMapView.view.type === '3d'
                            ? currentJimuMapView.view.goTo(this.Viewpoint.fromJSON(viewpoint))
                            : currentJimuMapView.view.goTo({
                                extent: this.Extent.fromJSON(extent)
                            });
                        this.startWatcher(currentJimuMapView.view);
                    }
                }, 1000);
                // layers visibility
                // const layersArray = currentJimuMapView.view.map.layers.toArray()
                // const operationalLayers = JSON.parse(
                //   JSON.stringify(currentJimuMapView.view.map)
                // )?.operationalLayers
                // This variable indicates whether the current map is the map for which the bookmark corresponds.
                // If it is not, the variable is true, need to keep the layer attribute of the map itself.
                // const mapDsChange = currentJimuMapView.dataSourceId !== config.mapDataSourceId
                // showLayersConfig
                this.setState({ configUpdate: false });
            }
        };
        // turn base64 to file
        this.dataURLtoFile = (dataurl, filename) => {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        };
        this.uploadSnapFile = (dataurl, activeBookmarkId, callback) => {
            const { id } = this.props;
            const timestamp = new Date().getTime();
            const snapFile = this.dataURLtoFile(dataurl, `${id}-snap${activeBookmarkId}-${timestamp}`);
            const timeString = new Date().getTime().toString();
            const fileName = snapFile.name;
            const portalFileName = `${fileName}.jpg`;
            const fileSize = snapFile.size;
            const fileFormat = snapFile.type;
            const resourceItemInfo = {
                file: snapFile,
                fileName: portalFileName,
                originalName: fileName,
                type: ResourceType.Image,
                widgetId: id ? id.replace(/\./g, '_').replace(/\-/g, '_') : null
            };
            let resourceInfo;
            AppResourceManager.assignBlobUrlToResourceItem(resourceItemInfo)
                .then(newResourceItemInfo => {
                AppResourceManager.getInstance().upLoadAppResource(newResourceItemInfo);
                resourceInfo = {
                    fileName: portalFileName,
                    originalName: fileName,
                    url: newResourceItemInfo.blobUrl,
                    type: ResourceType.Image,
                    size: fileSize,
                    created: Number(timeString),
                    resourcesPrefix: newResourceItemInfo.resourcesPrefix,
                    fileFormat: fileFormat
                };
                callback(resourceInfo);
            }, error => {
                console.error(error);
            });
        };
        this.getLayersConfig = (layersArray) => {
            const layersConfig = {};
            const recursion = (array, config) => {
                array.forEach(layer => {
                    var _a;
                    config[layer.id] = { layers: {} };
                    const visibleFalg = (layer === null || layer === void 0 ? void 0 : layer.visibility) === undefined
                        ? !!(layer === null || layer === void 0 ? void 0 : layer.visible)
                        : false;
                    config[layer.id].visibility = visibleFalg;
                    const children = layer.layers || layer.sublayers || layer.allSublayers;
                    if (children && children.length > 0) {
                        recursion(children, (_a = config[layer.id]) === null || _a === void 0 ? void 0 : _a.layers);
                    }
                });
                return config;
            };
            return recursion(layersArray, layersConfig);
        };
        this.handleClickUpdate = () => {
            const { currentSketch, completeOperation } = this.state;
            this.isSaving = true;
            if (currentSketch) {
                completeOperation().then(() => {
                    this.isSaving = false;
                    const { currentJimuMapView, graphics } = this.state;
                    const { activeBookmarkId, jimuMapConfig } = this.props;
                    const toEditBookmarkConfig = jimuMapConfig.bookmarks.find(x => x.id === activeBookmarkId);
                    const customType = [TemplateType.Custom1, TemplateType.Custom2];
                    this.setState({
                        isShowDialog: true,
                        configUpdate: false
                    });
                    const view = currentJimuMapView.view;
                    const allLayers = view.map.layers.toArray();
                    const layersConfig = this.getLayersConfig(allLayers);
                    const imgShot = toEditBookmarkConfig.snapParam;
                    const updateBookmark = (snapShot) => {
                        const bookmark = {
                            id: activeBookmarkId,
                            name: toEditBookmarkConfig.name,
                            title: toEditBookmarkConfig.title,
                            description: toEditBookmarkConfig.description,
                            type: view.type,
                            imgParam: toEditBookmarkConfig.imgParam,
                            snapParam: snapShot || imgShot,
                            imagePosition: toEditBookmarkConfig.imagePosition,
                            imgSourceType: toEditBookmarkConfig.imgSourceType,
                            extent: view.extent.toJSON(),
                            viewpoint: view.viewpoint.toJSON(),
                            graphics,
                            showFlag: true,
                            mapViewId: currentJimuMapView.id,
                            mapDataSourceId: currentJimuMapView.dataSourceId,
                            layersConfig
                        };
                        if (customType.includes(jimuMapConfig.templateType)) {
                            bookmark.layoutId = toEditBookmarkConfig.layoutId;
                            bookmark.layoutName = toEditBookmarkConfig.layoutName;
                        }
                        this.setState({ updateConfig: Immutable(bookmark) });
                        this.props.onBookmarkUpdated(bookmark);
                    };
                    const isSnapshot = toEditBookmarkConfig.imgSourceType === ImgSourceType.Snapshot;
                    if (isSnapshot) {
                        view.takeScreenshot().then(screenshot => {
                            if (screenshot.dataUrl) {
                                this.uploadSnapFile(screenshot.dataUrl, activeBookmarkId, updateBookmark);
                            }
                        });
                    }
                    else {
                        updateBookmark();
                    }
                });
            }
        };
        this.handleClickClose = (delLastFlag) => {
            const { configUpdate } = this.state;
            if (configUpdate && !delLastFlag) {
                this.setState({ closeConfirmOpen: true });
            }
            else {
                // After closing the window and opening it again, the jimuMapview refreshes to a new view without layers
                this.setState({
                    isShowDialog: false,
                    viewEditable: true
                });
            }
        };
        this.handleClickReset = () => {
            const { currentJimuMapView } = this.state;
            this.changeLayerWithGraphics(true);
            this.locateAndSetLayersConfig(currentJimuMapView);
        };
        this.layerWatcher = (layersArray, that) => {
            const recursion = array => {
                array.forEach(layer => {
                    layer.watch('visible', function (newValue, oldValue) {
                        if (newValue !== oldValue)
                            that.setState({ configUpdate: true });
                    });
                    const children = layer.layers || layer.sublayers || layer.allSublayers;
                    if (children && children.length > 0)
                        recursion(children.toArray());
                });
            };
            recursion(layersArray);
        };
        this.addNewShowConfiger = (jimuMapView) => {
            const { currentJimuMapView } = this.state;
            const customType = [TemplateType.Custom1, TemplateType.Custom2];
            let view;
            if (jimuMapView) {
                if (!jimuMapView.view)
                    return;
                view = jimuMapView.view;
            }
            else {
                if (!currentJimuMapView || !currentJimuMapView.view)
                    return;
                view = currentJimuMapView.view;
            }
            // eslint-disable-next-line
            const that = this;
            const { jimuMapConfig, id, tempLayoutType } = this.props;
            const allLayers = view.map.layers.toArray();
            const layersConfig = this.getLayersConfig(allLayers);
            // new a bookmark with default snapshot
            const newBookmark = (snapShot) => {
                this.bookmarkId++;
                const bookmark = {
                    id: this.bookmarkId,
                    name: `${this.formatMessage('bookmarkName')}-${this.bookmarkId}`,
                    title: `${this.formatMessage('bookmarkName')}-${this.bookmarkId}`,
                    type: view.type,
                    imgParam: {},
                    snapParam: snapShot || {},
                    imagePosition: ImageFillMode.Fill,
                    imgSourceType: ImgSourceType.Snapshot,
                    extent: view.extent.toJSON(),
                    viewpoint: view.viewpoint.toJSON(),
                    graphics: [],
                    showFlag: true,
                    mapViewId: (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id) ? jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id : currentJimuMapView === null || currentJimuMapView === void 0 ? void 0 : currentJimuMapView.id,
                    mapDataSourceId: (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId) ? jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId : currentJimuMapView === null || currentJimuMapView === void 0 ? void 0 : currentJimuMapView.dataSourceId,
                    layersConfig
                };
                if (customType.includes(jimuMapConfig.templateType)) {
                    let originLayoutId;
                    // get origin layoutId from last one or from temp
                    if (jimuMapConfig.bookmarks && jimuMapConfig.bookmarks.length > 0) {
                        const mutableBookmark = jimuMapConfig.bookmarks.asMutable();
                        originLayoutId = mutableBookmark[mutableBookmark.length - 1].layoutId;
                    }
                    else {
                        const appConfig = getAppStore().getState().appStateInBuilder.appConfig;
                        originLayoutId =
                            appConfig.widgets[id].layouts[Status.Regular][appConfig.mainSizeMode];
                    }
                    const newLayoutId = this.props.duplicateNewLayouts(originLayoutId, id, `Bookmark-${this.bookmarkId}`, `Bookmark-${this.bookmarkId}-label`, tempLayoutType);
                    bookmark.layoutName = `Bookmark-${this.bookmarkId}`;
                    bookmark.layoutId = newLayoutId;
                }
                // change watcher
                const layers = view.map.layers;
                const viewWatcher = () => {
                    if (view.type === '2d') {
                        view.watch('extent', function (newValue) {
                            if (bookmark && bookmark.type !== '2d')
                                return;
                            const originExtent = bookmark &&
                                bookmark.extent &&
                                JSON.parse(JSON.stringify(bookmark.extent));
                            const curExtent = JSON.parse(JSON.stringify(newValue.toJSON()));
                            if (!viewChangeBufferCompare(originExtent, curExtent, '2d')) {
                                that.setState({ configUpdate: true });
                            }
                            else {
                                that.setState({ configUpdate: false });
                            }
                        });
                    }
                    else {
                        view.watch('viewpoint', function (newValue) {
                            if (bookmark && bookmark.type !== '3d')
                                return;
                            const originViewPoint = bookmark &&
                                bookmark.viewpoint &&
                                JSON.parse(JSON.stringify(bookmark.viewpoint));
                            const curViewPoint = JSON.parse(JSON.stringify(newValue.toJSON()));
                            if (!viewChangeBufferCompare(originViewPoint, curViewPoint, '3d')) {
                                that.setState({ configUpdate: true });
                            }
                            else {
                                that.setState({ configUpdate: false });
                            }
                        });
                    }
                    this.layerWatcher(layers, that);
                };
                viewWatcher();
                this.props.onAddNewBookmark(bookmark);
            };
            // There is an additional delay because of JSAPI
            setTimeout(() => {
                view.takeScreenshot().then(screenshot => {
                    if (screenshot.dataUrl) {
                        this.uploadSnapFile(screenshot.dataUrl, this.bookmarkId + 1, newBookmark);
                    }
                });
            }, 1000);
            const usedMapViewId = (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id) ? jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id : currentJimuMapView === null || currentJimuMapView === void 0 ? void 0 : currentJimuMapView.id;
            const initBookmark = {
                id: this.bookmarkId,
                name: `${this.formatMessage('bookmarkName')}-${this.bookmarkId}`,
                title: `${this.formatMessage('bookmarkName')}-${this.bookmarkId}`,
                type: view.type,
                imgParam: {},
                imagePosition: ImageFillMode.Fill,
                imgSourceType: ImgSourceType.Snapshot,
                extent: view.extent.toJSON(),
                viewpoint: view.viewpoint.toJSON(),
                graphics: [],
                showFlag: true,
                mapViewId: usedMapViewId,
                mapDataSourceId: (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId) ? jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId : currentJimuMapView === null || currentJimuMapView === void 0 ? void 0 : currentJimuMapView.dataSourceId,
                layersConfig
            };
            this.setState({
                graphics: [],
                configUpdate: false,
                updateConfig: Immutable(initBookmark)
            });
        };
        this.showDialogAndEdit = (jimuMapView) => {
            var _a;
            const { activeBookmarkId, jimuMapConfig } = this.props;
            const { updateConfig, viewGroup, editChangeView } = this.state;
            let { currentJimuMapView } = this.state;
            if (jimuMapView)
                currentJimuMapView = jimuMapView;
            const config = updateConfig.asMutable({ deep: true });
            if (!currentJimuMapView || !currentJimuMapView.view)
                return;
            const activeBookmarkConfig = jimuMapConfig.bookmarks.find(x => x.id === activeBookmarkId);
            const viewGroupArray = (viewGroup === null || viewGroup === void 0 ? void 0 : viewGroup.jimuMapViews) ? Object.keys(viewGroup.jimuMapViews) : [];
            const isOrgBookmarkInViewGroup = viewGroupArray.findIndex(x => x === (activeBookmarkConfig === null || activeBookmarkConfig === void 0 ? void 0 : activeBookmarkConfig.mapViewId)) > -1;
            // 'editChangeView' indicates that the view change is caused by the setting switch (non-manual)
            // This situation need to determine whether to switchMap
            const activeViewDsId = (_a = viewGroup === null || viewGroup === void 0 ? void 0 : viewGroup.getActiveJimuMapView()) === null || _a === void 0 ? void 0 : _a.dataSourceId;
            if (editChangeView && isOrgBookmarkInViewGroup && config && activeViewDsId && activeViewDsId !== config.mapDataSourceId) {
                viewGroup === null || viewGroup === void 0 ? void 0 : viewGroup.switchMap();
            }
            else {
                this.changeLayerWithGraphics();
                this.locateAndSetLayersConfig(currentJimuMapView);
            }
            this.setState({ editChangeView: false });
        };
        this.handleActiveViewChange = (jimuMapView) => {
            const { currentJimuMapView } = this.state;
            // Switching map: Resolve draw compoent's current support for hybrid maps
            if (currentJimuMapView && (currentJimuMapView.id !== jimuMapView.id)) {
                this.setState({ isSwitching: true }, () => {
                    this.setState({ isSwitching: false });
                });
            }
            this.setState({
                currentJimuMapView: jimuMapView,
                configUpdate: true,
                viewEditable: true
            });
        };
        this.handleExtentChanged = (extent) => {
            const { activeBookmarkId, jimuMapConfig } = this.props;
            const toEditBookmarkConfig = jimuMapConfig.bookmarks.find(x => x.id === activeBookmarkId);
            if (toEditBookmarkConfig && toEditBookmarkConfig.type !== '2d')
                return;
            const originExtent = (toEditBookmarkConfig === null || toEditBookmarkConfig === void 0 ? void 0 : toEditBookmarkConfig.extent) &&
                JSON.parse(JSON.stringify(toEditBookmarkConfig.extent));
            const curExtent = JSON.parse(JSON.stringify(extent.toJSON()));
            // Draw currently triggers this event in certain cases, this is used to avoid cases where the actual extent has not changed.
            // There is no need to use 'else', because it is impossible for the user to move the extent to exactly the same as before
            if (originExtent && !lodash.isDeepEqual(originExtent, curExtent)) {
                this.setState({ configUpdate: true });
            }
        };
        this.handleViewPointChanged = (viewPoint) => {
            const { activeBookmarkId, jimuMapConfig } = this.props;
            const toEditBookmarkConfig = jimuMapConfig.bookmarks.find(x => x.id === activeBookmarkId);
            if (toEditBookmarkConfig && toEditBookmarkConfig.type !== '3d')
                return;
            const originViewPoint = (toEditBookmarkConfig === null || toEditBookmarkConfig === void 0 ? void 0 : toEditBookmarkConfig.viewpoint) &&
                JSON.parse(JSON.stringify(toEditBookmarkConfig.viewpoint));
            const curViewPoint = JSON.parse(JSON.stringify(viewPoint.toJSON()));
            // Draw currently triggers this event in certain cases, this is used to avoid cases where the actual viewport has not changed.
            // There is no need to use 'else', because it is impossible for the user to move the viewport to exactly the same as before
            if (originViewPoint && !lodash.isDeepEqual(originViewPoint, curViewPoint)) {
                this.setState({ configUpdate: true });
            }
        };
        this.handleEditWhenOpen = (bookmark) => {
            const { isShowDialog } = this.state;
            if (isShowDialog)
                this.handleNewOrEdit(bookmark);
        };
        this.getDialogStatus = () => {
            const { isShowDialog } = this.state;
            return isShowDialog;
        };
        this.handleNewOrEdit = (config, settingEdit) => {
            var _a, _b;
            const { isShowDialog, viewEditable } = this.state;
            // Continuous clicking only triggers one new addition
            if (!viewEditable)
                return;
            const flag = config ? 'edit' : 'new';
            if (!config)
                this.setState({ newFlag: true });
            if (!isShowDialog) {
                this.setState({
                    isShowDialog: true,
                    updateFlag: flag,
                    updateConfig: config,
                    graphics: config ? (_a = config.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a.graphics : [],
                    viewEditable: false,
                    addWhenViewLoad: !settingEdit,
                    editChangeView: !!settingEdit
                });
            }
            else {
                this.setState({
                    updateFlag: flag,
                    updateConfig: config,
                    graphics: config ? (_b = config.asMutable({ deep: true })) === null || _b === void 0 ? void 0 : _b.graphics : [],
                    editChangeView: !!settingEdit
                }, () => {
                    flag === 'new' ? this.addNewShowConfiger() : this.showDialogAndEdit();
                });
            }
        };
        this.handleViewGroupCreate = (viewGroup) => {
            this.setState({ viewGroup });
        };
        this.handleJimuMapViewCreated = (jimuMapView) => {
            const { updateFlag, addWhenViewLoad, currentJimuMapView } = this.state;
            const { activeBookmarkId, jimuMapConfig } = this.props;
            const toEditBookmarkConfig = jimuMapConfig &&
                jimuMapConfig.bookmarks.find(x => x.id === activeBookmarkId);
            // When there are multiple maps, the second trigger is not the view currently in use
            if (updateFlag === 'new') {
                if (currentJimuMapView && (currentJimuMapView.id !== jimuMapView.id))
                    return;
            }
            else {
                if (toEditBookmarkConfig && (toEditBookmarkConfig.mapViewId !== jimuMapView.id))
                    return;
            }
            // click "Add bookmark" when markpopper is close
            if (addWhenViewLoad) {
                this.addNewShowConfiger(jimuMapView);
                this.setState({ addWhenViewLoad: false });
            }
            if (updateFlag === 'edit') {
                this.showDialogAndEdit(jimuMapView);
            }
        };
        this.getDefalutSize = () => {
            const layoutElem = this.querySelector(`div.widget-renderer[data-widgetid="${this.props.useMapWidgetIds[0]}"]`);
            const maxHeight = document.querySelector('#default')
                ? document.querySelector('#default').clientHeight - 20
                : 1080;
            let innerSize = { width: 770, height: 850 };
            let innerMapSize = { width: 770, height: 770 };
            if (layoutElem) {
                const clientRect = layoutElem.getBoundingClientRect();
                const ratio = clientRect.width / clientRect.height || 1;
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
                    defaultExpandWidth =
                        (maxHeight - 111) * ratio > 770 ? (maxHeight - 111) * ratio : 770;
                }
                if (defaultMapHeight > maxHeight - 111) {
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
        this.getMapRatio = () => {
            const layoutElem = this.querySelector(`div.widget-renderer[data-widgetid="${this.props.useMapWidgetIds[0]}"]`);
            let ratio = 1;
            if (layoutElem) {
                const clientRect = layoutElem.getBoundingClientRect();
                ratio = clientRect.width / clientRect.height || 1;
            }
            return ratio;
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
        this.onDrawCreatedCallback = (jimuDrawCompleteDescriptor) => {
            const { sketch, completeOperation } = jimuDrawCompleteDescriptor;
            this.setState({ currentSketch: sketch, completeOperation });
        };
        this.toggleDrawTools = () => {
            const { isDrawToolsOpen } = this.state;
            this.setState({ isDrawToolsOpen: !isDrawToolsOpen });
        };
        this.onDrawEndCallback = (newGraphic) => {
            const { graphics } = this.state;
            const newGraphicJson = newGraphic.toJSON();
            // use id to edit and delete graphics, id is now already produce by Draw
            this.setState({
                configUpdate: true,
                graphics: graphics.concat(newGraphicJson)
            });
        };
        this.onDrawUpdatedCallback = ({ type, graphics }) => {
            const { graphics: originGraphics } = this.state;
            let noChangeCount = 0;
            graphics.forEach(graphic => {
                const jsonGraphic = graphic.toJSON();
                const updateIndex = originGraphics.findIndex(item => item.attributes.jimuDrawId === jsonGraphic.attributes.jimuDrawId);
                // Handle the problem of triggering a callback function when clicked
                const orgGraphicGeo = updateIndex > -1 ? originGraphics[updateIndex].geometry : {};
                const newGraphicGeo = jsonGraphic.geometry;
                const orgGraphicSym = updateIndex > -1 ? originGraphics[updateIndex].symbol : {};
                const newGraphicSym = jsonGraphic.symbol;
                // when click save button trigger the editCallback
                if (this.isSaving) {
                    if (lodash.isDeepEqual(orgGraphicGeo, newGraphicGeo) &&
                        lodash.isDeepEqual(orgGraphicSym, newGraphicSym)) {
                        noChangeCount++;
                        return;
                    }
                }
                else {
                    if (lodash.isDeepEqual(orgGraphicGeo, newGraphicGeo) &&
                        type === 'complete') {
                        noChangeCount++;
                        return;
                    }
                }
                if (type === 'deleted') {
                    if (updateIndex > -1)
                        originGraphics.splice(updateIndex, 1);
                }
                else if (type === 'complete') {
                    if (updateIndex > -1) {
                        const temp = originGraphics[updateIndex];
                        originGraphics[updateIndex] = jsonGraphic;
                        originGraphics[updateIndex].symbol = temp.symbol;
                    }
                }
            });
            if (noChangeCount !== graphics.length) {
                this.setState({
                    configUpdate: true,
                    graphics: originGraphics
                });
            }
        };
        this.onDrawClearedCallback = () => {
            this.setState({
                configUpdate: true,
                graphics: []
            });
        };
        this.handleCloseOk = () => {
            this.setState({
                isShowDialog: false,
                closeConfirmOpen: false,
                viewEditable: true
            });
        };
        this.handleCloseBtn = () => {
            this.setState({ closeConfirmOpen: false });
        };
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
          width: 100%;
          height: 100%;
          background-color: gray;
          display: contents;
        }
        .popper-footer {
          background: ${theme.colors.palette.light[300]};
          color: ${theme.colors.palette.dark[600]};
          padding: ${polished.rem(8)} ${polished.rem(12)};
          .left-btn {
            position: absolute;
            margin: 6px;
          }
          .left-tool {
            position: absolute;
            left: 55px;
            z-index: 10;
          }
          .hidden-tool {
            display: none;
          }
          .right-btn {
            height: 45px;
            padding: 6px 2px;
            .btn {
              min-width: 80px;
            }
          }
        }
      }
    `;
        };
        this.resizeRatio = size => {
            const maxElem = this.querySelector('body');
            const maxClientRect = maxElem.getBoundingClientRect();
            const { mapRatio } = this.state;
            let { width } = size;
            if (width > 1080)
                width = 1080;
            let height = width / mapRatio + 111;
            if (height > maxClientRect.height) {
                height = maxClientRect.height;
                width = (maxClientRect.height - 111) * mapRatio;
            }
            this.setState({ mapSize: { width, height } });
        };
        this.state = {
            isShowDialog: false,
            currentSketch: null,
            currentJimuMapView: null,
            graphics: [],
            apiLoaded: false,
            isSwitching: false,
            configUpdate: false,
            updateFlag: 'new',
            viewGroup: undefined,
            closeConfirmOpen: false,
            mapSize: this.getDefalutSize().innerSize,
            mapRatio: this.getMapRatio(),
            isDrawToolsOpen: true,
            viewEditable: true,
            newFlag: false,
            addWhenViewLoad: false,
            editChangeView: false,
            completeOperation: undefined
        };
        // If the parent component sends the method, the method is called to pass the child component this pointer
        if (props.onShowBookmarkConfiger) {
            props.onShowBookmarkConfiger(this);
        }
        this.bookmarkId = props.maxBookmarkId;
        this.layerList = null;
        this.isSaving = false;
        this._uiOptions = {
            isHideBgColor: true,
            isHideBorder: true
        };
        this._drawingOptions = {
            drawingElevationMode3D: 'relative-to-scene'
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules([
                'esri/Graphic',
                'esri/layers/GraphicsLayer',
                'esri/widgets/LayerList',
                'esri/geometry/Extent',
                'esri/Viewpoint'
            ]).then(modules => {
                ;
                [
                    this.Graphic,
                    this.GraphicsLayer,
                    this.LayerList,
                    this.Extent,
                    this.Viewpoint
                ] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(preProps, preStates) {
        var _a, _b;
        const { currentSketch, graphics, currentJimuMapView } = this.state;
        const { currentSketch: preCurrentSketch, graphics: preGraphics, currentJimuMapView: preJimuMapView } = preStates;
        const layerChange = (currentSketch === null || currentSketch === void 0 ? void 0 : currentSketch.layer) && ((_a = currentSketch.layer) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = preCurrentSketch === null || preCurrentSketch === void 0 ? void 0 : preCurrentSketch.layer) === null || _b === void 0 ? void 0 : _b.id);
        const graphicsChange = (currentSketch === null || currentSketch === void 0 ? void 0 : currentSketch.layer) && graphics !== preGraphics;
        // repaint layer
        if (layerChange || graphicsChange) {
            this.changeLayerWithGraphics();
        }
        // zoom and listen view change
        const jimuMapViewChange = currentJimuMapView !== preJimuMapView;
        if (currentJimuMapView && jimuMapViewChange) {
            this.locateAndSetLayersConfig(currentJimuMapView);
        }
    }
    componentWillUnmount() {
        const { currentSketch, completeOperation } = this.state;
        if (completeOperation)
            completeOperation();
        currentSketch === null || currentSketch === void 0 ? void 0 : currentSketch.destroy();
    }
    querySelector(selector) {
        const appFrame = document.querySelector(`iframe[name="${APP_FRAME_NAME_IN_BUILDER}"]`);
        if (appFrame) {
            const appFrameDoc = appFrame.contentDocument || appFrame.contentWindow.document;
            return appFrameDoc.querySelector(selector);
        }
        return null;
    }
    render() {
        var _a;
        const { currentJimuMapView, isShowDialog, isSwitching, configUpdate, closeConfirmOpen, isDrawToolsOpen, viewEditable, newFlag } = this.state;
        const { title, theme } = this.props;
        const useMapWidget = this.props.useMapWidgetIds && this.props.useMapWidgetIds[0];
        const config = getAppStore().getState().appStateInBuilder.appConfig;
        const isRTL = getAppStore().getState().appStateInBuilder.appContext.isRTL;
        if (!config.widgets[useMapWidget])
            return null;
        let useDataSource = config.widgets[useMapWidget].useDataSources;
        // use the current view of Map widget
        if (newFlag) {
            const initialMapDataSourceID = (_a = config.widgets[useMapWidget].config) === null || _a === void 0 ? void 0 : _a.initialMapDataSourceID;
            const needToReverse = () => {
                return (useDataSource &&
                    useDataSource.length > 1 &&
                    initialMapDataSourceID &&
                    useDataSource[0].dataSourceId !== initialMapDataSourceID);
            };
            if (needToReverse()) {
                useDataSource = Immutable(useDataSource.asMutable({ deep: true }).reverse());
            }
        }
        const toolConfig = {
            canZoom: true,
            canHome: true,
            canSearch: true,
            canCompass: true,
            canLayers: true
        };
        const jimuMapConfig = this.props.jimuMapConfig
            ? this.props.jimuMapConfig.set('toolConfig', toolConfig)
            : Immutable({});
        const panelHeader = css `
      .panel-header {
        background: ${theme.colors.palette.light[300]};
        color: ${theme.colors.palette.dark[600]};
        height: 50px;
        flex-shrink: 0;
        font-size: 1rem;
        font-weight: 500;
        .jimu-btn {
          color: ${theme.colors.palette.dark[600]} !important;
        }
        & >.actions >.jimu-btn.action-close :hover {
          color: ${theme.colors.black};
        }
      }
    `;
        const { innerMapSize, innerSize } = this.getDefalutSize();
        const floatingPanel = (jsx(FloatingPanel, { onHeaderClose: () => this.handleClickClose(), defaultPosition: this.getWidgetPosition(), headerTitle: title, size: innerSize, minSize: { width: 770, height: 850 }, disableResize: true, css: panelHeader, className: 'surface-3', disableActivateOverlay: true, dragBounds: 'body' },
            jsx("div", { className: 'rounded w-100 h-100', css: this.getPoperStyle(theme), ref: ref => (this.reference = ref) },
                jsx("div", { className: 'popper-content' },
                    jsx("div", { style: {
                            width: `${innerMapSize.width}px`,
                            height: `${innerMapSize.height}px`,
                            margin: '0 auto'
                        } },
                        jsx("div", { className: 'map-container' },
                            jsx(JimuMap, { id: `${this.props.id}editor`, useDataSources: useDataSource, jimuMapConfig: jimuMapConfig, onActiveViewChange: this.handleActiveViewChange, onExtentChanged: this.handleExtentChanged, onViewPointChanged: this.handleViewPointChanged, onViewGroupCreate: this.handleViewGroupCreate, onJimuMapViewCreated: this.handleJimuMapViewCreated }),
                            closeConfirmOpen && (jsx("div", { css: css `
                      position: absolute;
                      z-index: 11;
                      top: 0;
                      left: 0;
                      background-color: ${polished.rgba(theme.colors.palette.secondary[400], 0.65)};
                      width: ${innerSize.width}px;
                      height: ${innerSize.height}px;
                      .real-container {
                        background-color: ${theme.colors.palette.light[300]};
                        border: 1px solid ${theme.colors.palette.light[800]};
                        background-clip: padding-box;
                        width: 400px;
                        position: relative;
                        top: 50%;
                        margin: -60px auto 0;
                        padding: 30px;
                      }
                      .confirm-context {
                        .title-icon{
                          padding: 0 6px;
                        }
                        .title-label{
                          font-size: 1rem;
                        }
                      }
                      .confirm-footer {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 30px;
                        button {
                          cursor: pointer;
                          margin-left: ${polished.rem(10)};
                          min-width: ${polished.rem(80)};
                        }
                      }
                    ` },
                                jsx("div", { className: 'real-container' },
                                    jsx("div", { className: 'confirm-context d-flex align-items-start' },
                                        jsx("div", { className: 'title-icon' },
                                            jsx(WarningOutlined, { size: 24, color: 'var(--warning-600)' })),
                                        jsx("div", { className: 'title-label' }, this.formatMessage('confirmUnsave'))),
                                    jsx("div", { className: 'confirm-footer' },
                                        jsx(Button, { type: 'primary', onClick: this.handleCloseOk }, this.formatMessage('yes')),
                                        jsx(Button, { onClick: this.handleCloseBtn }, this.formatMessage('cancel')))))))),
                    jsx("div", { className: 'popper-footer' },
                        jsx("div", { className: 'left-btn' },
                            jsx(Button, { icon: true, type: 'tertiary', onClick: this.toggleDrawTools }, isDrawToolsOpen
                                ? jsx(LeftOutlined, { className: 'mr-1', css: css `${isRTL && 'transform: scaleX(-1);'}` })
                                : jsx(DrawOutlined, { className: 'mr-1', css: css `${isRTL && 'transform: scaleX(-1);'}` }))),
                        jsx("div", { className: `left-tool ${isDrawToolsOpen ? '' : 'hidden-tool'}` }, currentJimuMapView &&
                            currentJimuMapView.view &&
                            !isSwitching && (jsx(JimuDraw, { jimuMapView: currentJimuMapView, drawingOptions: this._drawingOptions, uiOptions: this._uiOptions, onJimuDrawCreated: this.onDrawCreatedCallback, onDrawingFinished: this.onDrawEndCallback, onDrawingUpdated: this.onDrawUpdatedCallback, onDrawingCleared: this.onDrawClearedCallback }))),
                        jsx("div", { className: 'float-right right-btn' },
                            jsx(Button, { className: 'mr-2', type: 'primary', onClick: this.handleClickUpdate, disabled: !configUpdate, "data-testid": 'popperSaveBtn' }, configUpdate
                                ? this.formatMessage('save')
                                : this.formatMessage('saved')),
                            jsx(Button, { className: 'mr-1', onClick: this.handleClickReset, disabled: !configUpdate }, this.formatMessage('reset'))))))));
        return (jsx("div", { className: 'w-100' },
            jsx(Button, { className: 'w-100 text-dark map-popper-btn', type: 'primary', disabled: !viewEditable, onClick: () => this.handleNewOrEdit() }, this.props.buttonLabel),
            isShowDialog && floatingPanel));
    }
}
//# sourceMappingURL=mark-popper.js.map