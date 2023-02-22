import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class Navigation extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Navigation';
    }
    getTitle() {
        return 'Navigation';
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(NavigationInner, { jimuMapView: this.props.jimuMapView });
    }
}
class NavigationInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Navigation = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/NavigationToggle']).then(modules => {
                [this.Navigation] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.NavigationBtn) {
                this.container.innerHTML = '';
            }
            this.NavigationBtn = new this.Navigation({
                container: this.container,
                view: this.props.jimuMapView.view
            });
            this.props.jimuMapView.deleteJimuMapTool('Navigation');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Navigation',
                instance: this.NavigationBtn
            });
        }
    }
    componentWillUnmount() {
        if (this.NavigationBtn) {
            this.NavigationBtn.destroy();
            this.NavigationBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Navigation');
        }
    }
    render() {
        return React.createElement("div", { className: 'navigation-map-tool', ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=navigation.js.map