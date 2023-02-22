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
import { React, jsx, DataSourceComponent, ReactResizeDetector } from 'jimu-core';
import { DataSourceTypes, loadArcGISJSAPIModules, JimuMapViewComponent } from 'jimu-arcgis';
import { WidgetPlaceholder, FillType } from 'jimu-ui';
import { getStyle } from './lib/style';
import defaultMessages from './translations/default';
import legendIcon from '../../icon.svg';
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus["Pending"] = "Pending";
    LoadStatus["Fulfilled"] = "Fulfilled";
    LoadStatus["Rejected"] = "Rejected";
})(LoadStatus || (LoadStatus = {}));
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            // window.addEventListener('resize', this.onResize);
        };
        this.componentWillUnmount = () => {
            // window.removeEventListener('resize', this.onResize);
        };
        this.createWebMapView = (MapView, resolve, reject) => {
            this.destoryView();
            const mapViewOption = {
                map: this.dataSource.map,
                container: this.refs.mapContainer
            };
            this.mapView = new MapView(mapViewOption);
            this.mapView.when(() => {
                resolve(this.mapView);
            }, (error) => reject(error));
        };
        this.createSceneView = (SceneView, resolve, reject) => {
            this.destoryView();
            const mapViewOption = {
                map: this.dataSource.map,
                container: this.refs.mapContainer
            };
            this.sceneView = new this.SceneView(mapViewOption);
            this.sceneView.when(() => {
                resolve(this.sceneView);
            }, (error) => reject(error));
        };
        this.loadViewModules = (dataSource) => __awaiter(this, void 0, void 0, function* () {
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
        this.destoryLegend = () => {
            this.legend && !this.legend.destroyed && this.legend.destroy();
        };
        this.createLegend = (view) => {
            let legendModulePromise;
            if (this.Legend) {
                legendModulePromise = Promise.resolve();
            }
            else {
                legendModulePromise = loadArcGISJSAPIModules([
                    'esri/widgets/Legend'
                ]).then(modules => {
                    [
                        this.Legend
                    ] = modules;
                });
            }
            return legendModulePromise.then(() => {
                const container = document && document.createElement('div');
                // container.className = 'jimu-widget';
                this.refs.legendContainer.appendChild(container);
                this.destoryLegend();
                this.legend = new this.Legend({
                    view: view,
                    container: container
                });
                this.configLegend();
            });
        };
        this.configLegend = () => {
            if (this.legend) {
                // const style = this.props.config.cardStyle ? {type: 'card' as 'card', layout: this.props.config.cardLayout || 'auto'} : 'classic';
                const basemapLegendVisible = this.props.config.showBaseMap;
                this.legend.style = this.calculateStyle();
                this.legend.basemapLegendVisible = basemapLegendVisible;
            }
        };
        this.calculateStyle = () => {
            let style;
            const currentWidth = this.currentWidth || 100000; // window.innerWidth;
            if (this.legend) {
                if (this.props.config.cardStyle) {
                    let layout;
                    if (this.props.config.cardLayout === 'auto') {
                        if (currentWidth <= 600) {
                            layout = 'stack';
                        }
                        else {
                            layout = 'side-by-side';
                        }
                    }
                    else {
                        layout = this.props.config.cardLayout;
                    }
                    style = {
                        type: 'card',
                        layout: layout
                    };
                }
                else {
                    style = 'classic';
                }
            }
            else {
                style = 'classic';
            }
            return style;
        };
        this.onActiveViewChange = (jimuMapView) => {
            if (jimuMapView && jimuMapView.view) {
                // this.setState({ loadStatus: LoadStatus.Pending})
                this.createLegend(jimuMapView.view).then(() => {
                    this.setState({
                        loadStatus: LoadStatus.Fulfilled
                    });
                }).catch((error) => console.error(error));
            }
            else {
                this.destoryLegend();
                // this.setState({ loadStatus: LoadStatus.Rejected })
            }
        };
        this.onDataSourceCreated = (dataSource) => {
            this.dataSource = dataSource;
            this.createViewByDataSource(dataSource).then((view) => {
                return this.createLegend(view);
            }).then(() => {
                this.setState({
                    loadStatus: LoadStatus.Fulfilled
                });
            }).catch((error) => console.error(error));
        };
        // eslint-disable-next-line
        this.onCreateDataSourceFailed = (error) => {
        };
        this.onResize = (width) => {
            // const width = window.innerWidth;
            this.currentWidth = width;
            if (this.legend && this.props.config.cardLayout === 'auto') {
                const style = this.calculateStyle();
                this.legend.style = style;
            }
        };
        this.state = {
            loadStatus: LoadStatus.Pending
        };
    }
    createViewByDataSource(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.loadViewModules(dataSource).then(() => __awaiter(this, void 0, void 0, function* () {
                if (dataSource.type === DataSourceTypes.WebMap) {
                    return yield new Promise((resolve, reject) => this.createWebMapView(this.MapView, resolve, reject));
                }
                else if (dataSource.type === DataSourceTypes.WebScene) {
                    return new Promise((resolve, reject) => this.createSceneView(this.SceneView, resolve, reject));
                }
                else {
                    return Promise.reject();
                }
            }));
        });
    }
    destoryView() {
        this.mapView && !this.mapView.destroyed && this.mapView.destroy();
        this.sceneView && !this.sceneView.destroyed && this.sceneView.destroy();
    }
    getDefaultStyleConfig() {
        return {
            useCustom: false,
            background: {
                color: '',
                fillType: FillType.FILL
            },
            fontColor: ''
        };
    }
    getStyleConfig() {
        if (this.props.config.style && this.props.config.style.useCustom) {
            return this.props.config.style;
        }
        else {
            return this.getDefaultStyleConfig();
        }
    }
    render() {
        var _a;
        const useMapWidget = this.props.useMapWidgetIds &&
            this.props.useMapWidgetIds[0];
        const useDataSource = this.props.useDataSources &&
            this.props.useDataSources[0];
        let content = null;
        let dataSourceContent = null;
        if (useMapWidget) {
            dataSourceContent = (jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.onActiveViewChange }));
        }
        else if (useDataSource) {
            dataSourceContent = (jsx(DataSourceComponent, { useDataSource: useDataSource, onDataSourceCreated: this.onDataSourceCreated, onCreateDataSourceFailed: this.onCreateDataSourceFailed }));
        }
        if (!useMapWidget && !useDataSource) {
            this.destoryLegend();
            content = (jsx("div", { className: 'widget-legend' },
                jsx(WidgetPlaceholder, { icon: legendIcon, autoFlip: true, message: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }), widgetId: this.props.id })));
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
            if (window.jimuConfig.isInBuilder) {
                this.configLegend();
            }
            content = (jsx("div", { className: 'widget-legend' },
                loadingContent,
                jsx("div", { ref: 'legendContainer', style: { height: '100%' } }),
                jsx("div", { style: { position: 'absolute', display: 'none' }, ref: 'mapContainer' }, "mapContainer"),
                jsx("div", { style: { position: 'absolute', display: 'none' } }, dataSourceContent),
                jsx(ReactResizeDetector, { handleHeight: true, handleWidth: true, onResize: this.onResize })));
        }
        return (jsx("div", { css: getStyle(this.props.theme, this.getStyleConfig()), className: 'jimu-widget' }, content));
    }
}
//# sourceMappingURL=widget.js.map