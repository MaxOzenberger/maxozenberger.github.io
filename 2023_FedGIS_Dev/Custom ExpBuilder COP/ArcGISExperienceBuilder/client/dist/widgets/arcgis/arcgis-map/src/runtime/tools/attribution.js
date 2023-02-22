import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class Attribution extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Attribution';
    }
    static getIsNeedSetting() {
        return false;
    }
    getTitle() {
        return 'Attribution';
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(AttributionInner, { jimuMapView: this.props.jimuMapView });
    }
}
class AttributionInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Attribution = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Attribution']).then(modules => {
                [this.Attribution] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.apiLoaded && this.container) {
            if (prevProps.jimuMapView && this.props.jimuMapView && (prevProps.jimuMapView.id !== this.props.jimuMapView.id)) {
                if (this.AttributionBtn && !this.AttributionBtn.destroy) {
                    this.AttributionBtn.view = this.props.jimuMapView.view;
                    this.AttributionBtn.renderNow();
                    this.props.jimuMapView.addJimuMapTool({
                        name: 'Attribution',
                        instance: this.AttributionBtn
                    });
                }
            }
            else {
                this.AttributionBtn = new this.Attribution({
                    container: this.container,
                    view: this.props.jimuMapView.view
                });
                this.props.jimuMapView.deleteJimuMapTool('Attribution');
                this.props.jimuMapView.addJimuMapTool({
                    name: 'Attribution',
                    instance: this.AttributionBtn
                });
            }
        }
    }
    componentWillUnmount() {
        if (this.AttributionBtn) {
            this.AttributionBtn.destroy();
            this.AttributionBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Attribution');
        }
    }
    render() {
        return React.createElement("div", { className: 'attribution-map-tool', style: { position: 'relative' }, ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=attribution.js.map