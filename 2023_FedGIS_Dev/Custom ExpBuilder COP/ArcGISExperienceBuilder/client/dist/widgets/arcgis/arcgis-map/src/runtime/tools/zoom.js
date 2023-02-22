import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
export default class Zoom extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Zoom';
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'ZoomLabel', defaultMessage: defaultMessages.ZoomLabel });
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(ZoomInner, { jimuMapView: this.props.jimuMapView });
    }
}
class ZoomInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Zoom = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Zoom']).then(modules => {
                [this.Zoom] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.ZoomBtn) {
                this.container.innerHTML = '';
            }
            this.ZoomBtn = new this.Zoom({
                container: this.container,
                view: this.props.jimuMapView.view
            });
            this.props.jimuMapView.deleteJimuMapTool('Zoom');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Zoom',
                instance: this.ZoomBtn
            });
        }
    }
    componentWillUnmount() {
        if (this.ZoomBtn) {
            this.ZoomBtn.destroy();
            this.ZoomBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Zoom');
            /**
             * TODO
             * When the map widget has two maps, the "componentWillUnmount" is called only for the current active view,
             * so the another view's mapTool is not cleared.
             */
        }
    }
    render() {
        return React.createElement("div", { className: 'zoom-map-tool', ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=zoom.js.map