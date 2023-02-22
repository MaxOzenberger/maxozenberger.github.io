import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
export default class BaseMap extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'BaseMap';
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'BaseMapLabel', defaultMessage: defaultMessages.BaseMapLabel });
    }
    getIcon() {
        return {
            icon: require('../assets/icons/basemap.svg')
        };
    }
    getExpandPanel() {
        return React.createElement(BaseMapInner, { jimuMapView: this.props.jimuMapView, isMobile: this.props.isMobile });
    }
}
class BaseMapInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.BaseMap = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/BasemapGallery']).then(modules => {
                [this.BaseMap] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.apiLoaded && this.container) {
            if (prevProps.jimuMapView && this.props.jimuMapView && (prevProps.jimuMapView.id !== this.props.jimuMapView.id)) {
                if (this.BaseMapBtn) {
                    this.BaseMapBtn.view = this.props.jimuMapView.view;
                    this.BaseMapBtn.renderNow();
                }
            }
            else {
                this.BaseMapBtn = new this.BaseMap({
                    container: this.container,
                    view: this.props.jimuMapView.view
                });
                this.props.jimuMapView.deleteJimuMapTool('BaseMap');
                this.props.jimuMapView.addJimuMapTool({
                    name: 'BaseMap',
                    instance: this.BaseMapBtn
                });
            }
        }
    }
    componentWillUnmount() {
        if (this.BaseMapBtn) {
            this.BaseMapBtn.destroy();
            this.BaseMapBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('BaseMap');
        }
    }
    render() {
        if (this.props.isMobile) {
            return (React.createElement("div", { className: 'basemap-map-tool', ref: ref => { this.container = ref; }, style: { width: '100%', minHeight: '32px', maxWidth: 'none', maxHeight: 'none', overflowY: 'auto', position: 'relative' } }, !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
        }
        else {
            return (React.createElement("div", { ref: ref => { this.container = ref; }, style: { width: '250px', minHeight: '32px', position: 'relative' }, className: 'exbmap-ui-pc-expand-maxheight basemap-map-tool' }, !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
        }
    }
}
//# sourceMappingURL=basemap.js.map