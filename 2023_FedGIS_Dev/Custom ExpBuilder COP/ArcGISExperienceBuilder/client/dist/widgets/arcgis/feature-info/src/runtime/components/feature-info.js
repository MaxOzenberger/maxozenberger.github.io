import { React } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus["Pending"] = "Pending";
    LoadStatus["Fulfilled"] = "Fulfilled";
    LoadStatus["Rejected"] = "Rejected";
})(LoadStatus || (LoadStatus = {}));
export default class FeatureInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadStatus: LoadStatus.Pending
        };
    }
    componentDidMount() {
        this.createFeature();
    }
    componentDidUpdate() {
        if (this.feature) {
            const graphic = { popupTemplate: { content: '' } };
            // @ts-expect-error
            this.feature.graphic = this.props.graphic || graphic;
            this.feature.visibleElements = this.props.visibleElements;
        }
    }
    destoryFeature() {
        this.feature && !this.feature.destroyed && this.feature.destroy();
    }
    createFeature() {
        let featureModulePromise;
        if (this.Feature) {
            featureModulePromise = Promise.resolve();
        }
        else {
            featureModulePromise = loadArcGISJSAPIModules([
                'esri/widgets/Feature'
            ]).then(modules => {
                [
                    this.Feature
                ] = modules;
            });
        }
        return featureModulePromise.then(() => {
            var _a, _b;
            const container = document && document.createElement('div');
            container.className = 'jimu-widget';
            this.refs.featureContainer.appendChild(container);
            const rootDataSource = this.props.dataSource.getRootDataSource();
            this.destoryFeature();
            this.feature = new this.Feature({
                container: container,
                defaultPopupTemplateEnabled: true,
                // @ts-expect-error
                spatialReference: ((_b = (_a = this.props.dataSource) === null || _a === void 0 ? void 0 : _a.layer) === null || _b === void 0 ? void 0 : _b.spatialReference) || null,
                // @ts-expect-error
                map: (rootDataSource === null || rootDataSource === void 0 ? void 0 : rootDataSource.map) || null
            });
        }).then(() => {
            this.setState({ loadStatus: LoadStatus.Fulfilled });
        });
    }
    render() {
        return (React.createElement("div", { className: 'feature-info-component' },
            React.createElement("div", { ref: 'featureContainer' })));
    }
}
//# sourceMappingURL=feature-info.js.map