import { React, classNames } from 'jimu-core';
import { checkIsLive } from '../utils';
import MultiSourceMap from './multisourcemap';
import { portalUtils } from 'jimu-arcgis';
export default class DefaultMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            defaultMapInfo: null
        };
    }
    componentDidMount() {
        portalUtils.getDefaultWebMap(this.props.baseWidgetProps.portalUrl).then(defaultMapInfo => {
            this.setState({
                defaultMapInfo: defaultMapInfo
            });
        });
    }
    render() {
        return (React.createElement("div", { className: 'w-100 h-100' },
            !this.state.defaultMapInfo && React.createElement("div", { className: 'widget-map w-100 h-100 widget-map-background' },
                React.createElement("div", { style: { position: 'absolute', left: '50%', top: '50%' }, className: 'jimu-secondary-loading' })),
            this.state.defaultMapInfo && React.createElement("div", { className: classNames('w-100 h-100', { 'map-is-design-mode': !checkIsLive(this.props.baseWidgetProps.appMode) }) }, this.props.isMapInVisibleArea && React.createElement(MultiSourceMap, { key: 0, fullScreenMap: this.props.fullScreenMap, baseWidgetProps: this.props.baseWidgetProps, startLoadModules: this.props.startLoadModules, isDefaultMap: true, ref: this.props.setMultiSourceMapInstance, onViewGroupCreate: this.props.onViewGroupCreate, widgetHeight: this.props.widgetHeight, widthBreakpoint: this.props.widthBreakpoint, isFullScreen: this.props.isFullScreen, isMapInVisibleArea: this.props.isMapInVisibleArea, defaultMapInfo: this.state.defaultMapInfo }))));
    }
}
//# sourceMappingURL=default-map.js.map