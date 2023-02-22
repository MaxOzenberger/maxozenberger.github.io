import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class ScaleBar extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'ScaleBar';
    }
    getTitle() {
        return 'ScaleBar';
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(ScaleBarInner, { jimuMapView: this.props.jimuMapView });
    }
}
class ScaleBarInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ScaleBar = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/ScaleBar']).then(modules => {
                [this.ScaleBar] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.ScaleBarBtn) {
                this.container.innerHTML = '';
            }
            this.ScaleBarBtn = new this.ScaleBar({
                container: this.container,
                view: this.props.jimuMapView.view,
                unit: 'dual'
            });
            this.props.jimuMapView.deleteJimuMapTool('ScaleBar');
            this.props.jimuMapView.addJimuMapTool({
                name: 'ScaleBar',
                instance: this.ScaleBarBtn
            });
        }
    }
    componentWillUnmount() {
        if (this.ScaleBarBtn) {
            this.ScaleBarBtn.destroy();
            this.ScaleBarBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('ScaleBar');
        }
    }
    render() {
        return React.createElement("div", { className: 'scalebar-map-tool', ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=scalebar.js.map