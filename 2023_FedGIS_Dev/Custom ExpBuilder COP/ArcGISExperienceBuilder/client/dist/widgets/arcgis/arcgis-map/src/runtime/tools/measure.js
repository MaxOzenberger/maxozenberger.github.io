import { React, classNames } from 'jimu-core';
import { Icon, Nav, NavItem, NavLink, defaultMessages } from 'jimu-ui';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class Measure extends BaseTool {
    constructor(props) {
        super(props);
        this.toolName = 'Measure';
        this.measureModules2D = [{
                name: 'Line',
                title: 'Line',
                activeTool: 'distance',
                src: require('../assets/icons/measure-distance.svg')
            }, {
                name: 'Polygon',
                title: 'Polygon',
                activeTool: 'area',
                src: require('../assets/icons/measure-area.svg')
            }];
        this.measureModules3D = [{
                name: 'Line',
                title: 'Line',
                activeTool: 'direct-line',
                src: require('../assets/icons/measure-distance.svg')
            }, {
                name: 'Polygon',
                title: 'Polygon',
                activeTool: 'area',
                src: require('../assets/icons/measure-area.svg')
            }];
        this.destroy = () => {
            if (this.state.measureInstance && !this.state.measureInstance.destroyed) {
                this.state.measureInstance.destroy();
                this.setState({
                    measureInstance: null,
                    activeTabIndex: 0
                });
            }
        };
        this.handleMeasurceInstanceCreated = (measureInstance) => {
            this.setState({
                measureInstance: measureInstance
            });
        };
        this.onTabClick = (index) => {
            if (this.state.activeTabIndex === index) {
                return;
            }
            this.state.measureInstance.clear();
            this.setState({ activeTabIndex: index });
            if (index === 0) {
                this.state.measureInstance.activeTool = this.props.jimuMapView.view.type === '2d' ? 'distance' : 'direct-line';
            }
            else if (index === 1) {
                this.state.measureInstance.activeTool = 'area';
            }
        };
        this.onClosePanel = () => {
            this.destroy();
        };
        this.onShowPanel = () => {
            if (this.state.measureInstance) {
                if (this.state.activeTabIndex === 0) {
                    this.state.measureInstance.activeTool = this.props.jimuMapView.view.type === '2d' ? 'distance' : 'direct-line';
                }
                else if (this.state.activeTabIndex === 1) {
                    this.state.measureInstance.activeTool = 'area';
                }
            }
        };
        this.getNavTab = () => {
            if (this.props.jimuMapView.view.type === '2d') {
                return (React.createElement(Nav, { tabs: true }, this.measureModules2D.map((module, index) => {
                    return (React.createElement(NavItem, { key: index },
                        React.createElement(NavLink, { active: this.state.activeTabIndex === index, onClick: () => { this.onTabClick(index); } },
                            React.createElement(Icon, { width: 16, height: 16, className: 'm-0', icon: module.src }))));
                })));
            }
            else if (this.props.jimuMapView.view.type === '3d') {
                return (React.createElement(Nav, { tabs: true }, this.measureModules3D.map((module, index) => {
                    return (React.createElement(NavItem, { key: index },
                        React.createElement(NavLink, { active: this.state.activeTabIndex === index, onClick: () => { this.onTabClick(index); } },
                            React.createElement(Icon, { width: 16, height: 16, className: 'm-0', icon: module.src }))));
                })));
            }
            else {
                return null;
            }
        };
        this.getMeasureModule = () => {
            if (this.props.jimuMapView.view.type === '2d') {
                return this.measureModules2D[this.state.activeTabIndex];
            }
            else {
                return this.measureModules3D[this.state.activeTabIndex];
            }
        };
        this.state = {
            activeTabIndex: 0,
            measureInstance: null
        };
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'MeasureLabel', defaultMessage: defaultMessages.MeasureLabel });
    }
    getIcon() {
        return {
            icon: require('../assets/icons/measure.svg')
        };
    }
    getExpandPanel() {
        return (React.createElement("div", { style: { width: this.props.isMobile ? '100%' : '250px', position: 'relative' }, className: classNames({ 'exbmap-ui-pc-expand-maxheight': !this.props.isMobile }) },
            this.getNavTab(),
            React.createElement(MeasureInner, { activeTabIndex: this.state.activeTabIndex, jimuMapView: this.props.jimuMapView, measureModule: this.getMeasureModule(), measureInstance: this.state.measureInstance, onMeasurceInstanceCreated: this.handleMeasurceInstanceCreated })));
    }
}
class MeasureInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.MeasureInstance = null;
        this.toolName = 'measurement';
        this.checkContainer = () => {
            if (this.container.style.opacity === '0' || this.container.style.opacity === 0) {
                this.container.style.opacity = 1;
                this.container.style.height = '';
            }
        };
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Measurement']).then(modules => {
                [this.MeasureClass] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.apiLoaded && this.parentContainer && this.container) {
            if (!this.props.measureInstance) {
                // crate measure isntance here
                const tempInstance = new this.MeasureClass({
                    container: this.container,
                    view: this.props.jimuMapView.view
                });
                tempInstance.activeTool = this.props.measureModule.activeTool;
                this.props.jimuMapView.deleteJimuMapTool(this.toolName);
                this.props.jimuMapView.addJimuMapTool({
                    name: this.toolName,
                    instance: tempInstance
                });
                this.props.onMeasurceInstanceCreated(tempInstance);
            }
            else {
                if (this.props.measureInstance.view !== this.props.jimuMapView.view) {
                    // map view changed by switch
                    this.props.measureInstance.clear();
                    this.props.measureInstance.view = this.props.jimuMapView.view;
                    // @ts-expect-error
                    this.props.measureInstance.activeTool = this.props.measureModule.activeTool;
                }
            }
            this.checkContainer();
        }
    }
    reload() {
        if (this.container.childNodes && this.container.childNodes[0]) {
            this.container.style.opacity = 0;
            this.container.style.height = '35px';
        }
        //this.setState({
        //  apiLoaded: false
        //}, () => {
        //  loadArcGISJSAPIModules(['esri/widgets/Measurement']).then(modules => {
        //    [this.MeasureClass] = modules
        //    this.setState({
        //      apiLoaded: true
        //    })
        //  })
        //})
    }
    render() {
        return (React.createElement("div", { className: 'w-100', style: { width: '250px', position: 'relative', minHeight: '32px' }, ref: ref => { this.parentContainer = ref; } },
            React.createElement("div", { className: 'measure-container measure-map-tool', ref: ref => { this.container = ref; } }),
            !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
    }
}
//# sourceMappingURL=measure.js.map