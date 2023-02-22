import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class Locate extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Locate';
    }
    getTitle() {
        return 'Locate';
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(LocateInner, { jimuMapView: this.props.jimuMapView });
    }
}
class LocateInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Locate = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Locate']).then(modules => {
                [this.Locate] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.LocateBtn) {
                this.container.innerHTML = '';
            }
            this.LocateBtn = new this.Locate({
                container: this.container,
                view: this.props.jimuMapView.view
            });
            this.props.jimuMapView.deleteJimuMapTool('Locate');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Locate',
                instance: this.LocateBtn
            });
        }
    }
    componentWillUnmount() {
        if (this.LocateBtn) {
            this.LocateBtn.destroy();
            this.LocateBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Locate');
        }
    }
    render() {
        return React.createElement("div", { className: 'esri-widget--button locate-map-tool', ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=locate.js.map