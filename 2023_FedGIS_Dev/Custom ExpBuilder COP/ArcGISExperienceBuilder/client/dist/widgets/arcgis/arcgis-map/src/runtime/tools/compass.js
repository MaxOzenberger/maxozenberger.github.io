import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
export default class Compass extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Compass';
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'CompassLabel', defaultMessage: defaultMessages.CompassLabel });
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        return React.createElement(CompassInner, { jimuMapView: this.props.jimuMapView });
    }
}
class CompassInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Compass = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Compass']).then(modules => {
                [this.Compass] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.CompassBtn) {
                this.container.innerHTML = '';
            }
            this.CompassBtn = new this.Compass({
                container: this.container,
                view: this.props.jimuMapView.view
            });
            this.props.jimuMapView.deleteJimuMapTool('Compass');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Compass',
                instance: this.CompassBtn
            });
        }
    }
    componentWillUnmount() {
        if (this.CompassBtn) {
            this.CompassBtn.destroy();
            this.CompassBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Compass');
        }
    }
    render() {
        return React.createElement("div", { className: 'compass-map-tool', ref: ref => { this.container = ref; } });
    }
}
//# sourceMappingURL=compass.js.map