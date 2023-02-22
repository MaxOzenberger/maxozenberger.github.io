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
import { React, jsx, DataSourceComponent } from 'jimu-core';
import { DataSourceTypes, loadArcGISJSAPIModules, JimuMapViewComponent } from 'jimu-arcgis';
import { WidgetPlaceholder } from 'jimu-ui';
import { getStyle } from './lib/style';
import Goto from './actions/goto';
import Label from './actions/label';
import Opacity from './actions/opacity';
import Information from './actions/information';
import defaultMessages from './translations/default';
import layerListIcon from '../../icon.svg';
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus["Pending"] = "Pending";
    LoadStatus["Fulfilled"] = "Fulfilled";
    LoadStatus["Rejected"] = "Rejected";
})(LoadStatus || (LoadStatus = {}));
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.defineLayerListActions = (event) => {
            const item = event.item;
            const actionGroups = {};
            item.actionsSections = [];
            this.layerListActions.forEach((actionObj) => {
                // let actionIsExisted = item.actionsSections.some((section) => section.some((action) => action.id === actionObj.id));
                if (actionObj.isValid(item)) {
                    let actionGroup = actionGroups[actionObj.group];
                    if (!actionGroup) {
                        actionGroup = [];
                        actionGroups[actionObj.group] = actionGroup;
                    }
                    actionGroup.push({
                        id: actionObj.id,
                        title: actionObj.title,
                        className: actionObj.className
                    });
                }
            });
            Object.entries(actionGroups).sort((v1, v2) => Number(v1[0]) - Number(v2[0])).forEach(([key, value]) => {
                item.actionsSections.push(value);
            });
        };
        this.onLayerListActionsTriggered = (event) => {
            const action = event.action;
            const item = event.item;
            const actionObj = this.layerListActions.find((actionObj) => actionObj.id === action.id);
            actionObj.execute(item);
        };
        this.onActiveViewChange = (jimuMapView) => {
            const useMapWidget = this.props.useMapWidgetIds &&
                this.props.useMapWidgetIds[0];
            if ((jimuMapView && jimuMapView.view) || !useMapWidget) {
                // this.setState({ loadStatus: LoadStatus.Pending})
                this.viewFromMapWidget = jimuMapView && jimuMapView.view;
                this.setState({
                    mapViewWidgetId: useMapWidget,
                    viewFromMapWidgetId: jimuMapView.id
                });
            }
            else {
                this.destoryLayerList();
                // this.setState({ loadStatus: LoadStatus.Rejected });
            }
        };
        this.onDataSourceCreated = (dataSource) => {
            this.dataSource = dataSource;
            this.setState({
                mapDataSourceId: dataSource.id
            });
        };
        // eslint-disable-next-line
        this.onCreateDataSourceFailed = (error) => {
        };
        this.state = {
            mapViewWidgetId: null,
            mapDataSourceId: null,
            viewFromMapWidgetId: null,
            loadStatus: LoadStatus.Pending
        };
        this.renderPromise = Promise.resolve();
        this.registerLayerListActions();
    }
    componentDidMount() {
    }
    componentDidUpdate() {
        if (this.props.config.useMapWidget) {
            if (this.state.mapViewWidgetId === this.currentUseMapWidgetId) {
                this.syncRenderer(this.renderPromise);
            }
        }
        else {
            if (this.state.mapDataSourceId === this.currentUseDataSourceId) {
                this.syncRenderer(this.renderPromise);
            }
        }
    }
    createView() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.config.useMapWidget) {
                return yield Promise.resolve(this.viewFromMapWidget);
            }
            else {
                return yield this.createViewByDatatSource();
            }
        });
    }
    createViewByDatatSource() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.loadViewModules(this.dataSource).then(() => __awaiter(this, void 0, void 0, function* () {
                if (this.dataSource.type === DataSourceTypes.WebMap) {
                    return yield new Promise((resolve, reject) => this.createWebMapView(this.MapView, resolve, reject));
                }
                else if (this.dataSource.type === DataSourceTypes.WebScene) {
                    return new Promise((resolve, reject) => this.createSceneView(this.SceneView, resolve, reject));
                }
                else {
                    return Promise.reject();
                }
            }));
        });
    }
    createWebMapView(MapView, resolve, reject) {
        if (this.mapView) {
            this.mapView.map = this.dataSource.map;
        }
        else {
            const mapViewOption = {
                map: this.dataSource.map,
                container: this.refs.mapContainer
            };
            this.mapView = new MapView(mapViewOption);
        }
        this.mapView.when(() => {
            resolve(this.mapView);
        }, (error) => reject(error));
    }
    createSceneView(SceneView, resolve, reject) {
        if (this.sceneView) {
            this.sceneView.map = this.dataSource.map;
        }
        else {
            const mapViewOption = {
                map: this.dataSource.map,
                container: this.refs.mapContainer
            };
            this.sceneView = new this.SceneView(mapViewOption);
        }
        this.sceneView.when(() => {
            resolve(this.sceneView);
        }, (error) => reject(error));
    }
    destoryView() {
        this.mapView && !this.mapView.destroyed && this.mapView.destroy();
        this.sceneView && !this.sceneView.destroyed && this.sceneView.destroy();
    }
    loadViewModules(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dataSource.type === DataSourceTypes.WebMap) {
                if (this.MapView) {
                    return yield Promise.resolve(this.MapView);
                }
                return yield loadArcGISJSAPIModules([
                    'esri/views/MapView'
                ]).then(modules => {
                    [
                        this.MapView
                    ] = modules;
                    return this.MapView;
                });
            }
            else if (dataSource.type === DataSourceTypes.WebScene) {
                if (this.SceneView) {
                    return Promise.resolve(this.SceneView);
                }
                return loadArcGISJSAPIModules([
                    'esri/views/SceneView'
                ]).then(modules => {
                    [
                        this.SceneView
                    ] = modules;
                    return this.SceneView;
                });
            }
            else {
                return Promise.reject();
            }
        });
    }
    destoryLayerList() {
        this.layerList && !this.layerList.destroyed && this.layerList.destroy();
    }
    createLayerList(view) {
        let layerListModulePromise;
        if (this.LayerList) {
            layerListModulePromise = Promise.resolve();
        }
        else {
            layerListModulePromise = loadArcGISJSAPIModules([
                'esri/widgets/LayerList'
            ]).then(modules => {
                [
                    this.LayerList
                ] = modules;
            });
        }
        return layerListModulePromise.then(() => {
            const container = document && document.createElement('div');
            container.className = 'jimu-widget';
            this.refs.layerListContainer.appendChild(container);
            this.destoryLayerList();
            this.layerList = new this.LayerList({
                view: view,
                listItemCreatedFunction: this.defineLayerListActions,
                container: container
            });
            this.configLayerList();
            this.layerList.on('trigger-action', (event) => {
                this.onLayerListActionsTriggered(event);
            });
        });
    }
    registerLayerListActions() {
        this.layerListActions = [
            new Goto(this, this.props.intl.formatMessage({ id: 'goto', defaultMessage: defaultMessages.goto })),
            new Label(this, this.props.intl.formatMessage({ id: 'showLabels', defaultMessage: defaultMessages.showLabels }), this.props.intl.formatMessage({ id: 'hideLabels', defaultMessage: defaultMessages.hideLabels })),
            new Opacity(this, this.props.intl.formatMessage({ id: 'increaseOpacity', defaultMessage: defaultMessages.increaseOpacity }), true),
            new Opacity(this, this.props.intl.formatMessage({ id: 'decreaseOpacity', defaultMessage: defaultMessages.decreaseOpacity }), false),
            new Information(this, this.props.intl.formatMessage({ id: 'information', defaultMessage: defaultMessages.information }))
        ];
    }
    configLayerList() {
        if (!this.props.config.setVisibility || !this.props.config.useMapWidget) {
            // @ts-expect-error
            this.layerList._toggleVisibility = function () { };
        }
    }
    renderLayerList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createView().then((view) => {
                return this.createLayerList(view);
            }).then(() => {
                this.setState({
                    loadStatus: LoadStatus.Fulfilled
                });
            }).catch((error) => console.error(error));
        });
    }
    syncRenderer(preRenderPromise) {
        this.renderPromise = new Promise((resolve, reject) => {
            preRenderPromise.then(() => {
                this.renderLayerList().then(() => {
                    resolve(null);
                }).catch(() => reject());
            });
        });
    }
    render() {
        var _a;
        const useMapWidget = this.props.useMapWidgetIds &&
            this.props.useMapWidgetIds[0];
        const useDataSource = this.props.useDataSources &&
            this.props.useDataSources[0];
        this.currentUseMapWidgetId = useMapWidget;
        this.currentUseDataSourceId = useDataSource && useDataSource.dataSourceId;
        let dataSourceContent = null;
        if (this.props.config.useMapWidget) {
            dataSourceContent = (jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.onActiveViewChange }));
        }
        else if (useDataSource) {
            dataSourceContent = (jsx(DataSourceComponent, { useDataSource: useDataSource, onDataSourceCreated: this.onDataSourceCreated, onCreateDataSourceFailed: this.onCreateDataSourceFailed }));
        }
        let content = null;
        if (this.props.config.useMapWidget ? !useMapWidget : !useDataSource) {
            this.destoryLayerList();
            content = (jsx("div", { className: 'widget-layerlist' },
                jsx(WidgetPlaceholder, { icon: layerListIcon, message: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }), widgetId: this.props.id })));
        }
        else {
            let loadingContent = null;
            if (this.state.loadStatus === LoadStatus.Pending) {
                loadingContent = (jsx("div", { className: 'jimu-secondary-loading' }));
            }
            // else if(this.state.loadStatus === LoadStatus.Rejected){
            //  loadingContent = (
            //    <div style={{padding: '5px 10px'}}> Invalid map widget! </div>
            //  );
            // }
            content = (jsx("div", { className: `widget-layerlist widget-layerlist_${this.props.id}` },
                loadingContent,
                jsx("div", { ref: 'layerListContainer' }),
                jsx("div", { style: { position: 'absolute', opacity: 0 }, ref: 'mapContainer' }, "mapContainer"),
                jsx("div", { style: { position: 'absolute', display: 'none' } }, dataSourceContent)));
        }
        return (jsx("div", { css: getStyle(this.props.theme, this.props.config), className: 'jimu-widget' }, content));
    }
}
//# sourceMappingURL=widget.js.map