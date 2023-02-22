import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
export default class Legend extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Legend';
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'LegendLabel', defaultMessage: defaultMessages.LegendLabel });
    }
    getIcon() {
        return {
            icon: require('../assets/icons/legend.svg')
        };
    }
    getExpandPanel() {
        return React.createElement(LegendInner, { jimuMapView: this.props.jimuMapView });
    }
}
class LegendInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Legend = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Legend']).then(modules => {
                [this.Legend] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            this.LegendBtn = new this.Legend({
                container: this.container,
                view: this.props.jimuMapView.view
            });
        }
    }
    componentWillUnmount() {
        if (this.LegendBtn) {
            this.LegendBtn.destroy();
            this.LegendBtn = null;
        }
    }
    render() {
        return (React.createElement("div", { className: 'legend-map-tool', ref: ref => { this.container = ref; }, style: { width: '250px', minHeight: '32px', position: 'relative' } }, !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
    }
}
//# sourceMappingURL=legend.js.map