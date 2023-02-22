import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
import { MultiSourceMapContext } from '../components/multisourcemap-context';
export default class Home extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Home';
        this.getHomeContent = (initialMapState) => {
            return React.createElement(HomeInner, { jimuMapView: this.props.jimuMapView, initialMapState: initialMapState });
        };
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'HomeLabel', defaultMessage: defaultMessages.HomeLabel });
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        // return <HomeInner jimuMapView={this.props.jimuMapView}></HomeInner>;
        return (React.createElement(MultiSourceMapContext.Consumer, null, ({ initialMapState }) => (this.getHomeContent(initialMapState))));
    }
}
class HomeInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Home = null;
        this.generateViewPointFromInitialMapState = (initialMapState) => {
            if (initialMapState.viewType === '2d') {
                return new this.Viewpoint({
                    targetGeometry: this.Extent.fromJSON(initialMapState.extent),
                    rotation: initialMapState.rotation
                });
            }
            else {
                return this.Viewpoint.fromJSON(initialMapState.viewPoint);
            }
        };
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Home',
                'esri/geometry/Extent',
                'esri/Viewpoint']).then(modules => {
                [this.Home, this.Extent, this.Viewpoint] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        var _a;
        if (this.state.apiLoaded && this.container && ((_a = this.props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view)) {
            if (this.homeBtn) {
                this.container.innerHTML = '';
            }
            this.homeBtn = new this.Home({
                container: this.container,
                view: this.props.jimuMapView.view,
                viewpoint: this.props.initialMapState
                    ? this.generateViewPointFromInitialMapState(this.props.initialMapState)
                    : this.props.jimuMapView.view.map.initialViewProperties.viewpoint
            });
            this.props.jimuMapView.deleteJimuMapTool('Home');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Home',
                instance: this.homeBtn
            });
            if (prevProps.initialMapState !== this.props.initialMapState) {
                if (this.props.jimuMapView.view) {
                    this.props.jimuMapView.view.goTo(this.homeBtn.viewpoint, {
                        animate: false
                    });
                }
                else {
                    this.homeBtn.destroy();
                    this.homeBtn = null;
                }
            }
        }
    }
    componentWillUnmount() {
        if (this.homeBtn) {
            this.homeBtn.destroy();
            this.homeBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Home');
        }
    }
    render() {
        return React.createElement("div", { className: 'esri-widget--button home-map-tool', ref: ref => { if (!this.container) {
                this.container = ref;
            } } });
    }
}
//# sourceMappingURL=home.js.map