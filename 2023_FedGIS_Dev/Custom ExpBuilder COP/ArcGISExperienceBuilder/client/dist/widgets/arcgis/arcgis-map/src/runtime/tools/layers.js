import { React, classNames } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { defaultMessages, Nav, NavItem, NavLink } from 'jimu-ui';
export default class Layers extends BaseTool {
    constructor(props) {
        super(props);
        this.toolName = 'Layers';
        this.handleTabIndexChange = (activeTabIndex) => {
            this.setState({
                activeTabIndex: activeTabIndex
            });
        };
        this.state = {
            activeTabIndex: 0
        };
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'LayersLabel', defaultMessage: defaultMessages.LayersLabel });
    }
    getIcon() {
        return {
            icon: require('../assets/icons/layerlist.svg')
        };
    }
    getExpandPanel() {
        return (React.createElement("div", { style: { width: this.props.isMobile ? '100%' : '250px', minHeight: '32px', position: 'relative' }, className: classNames({ 'exbmap-ui-pc-expand-maxheight': !this.props.isMobile }) },
            React.createElement(Nav, { tabs: true },
                React.createElement(NavItem, null,
                    React.createElement(NavLink, { active: this.state.activeTabIndex === 0, onClick: () => { this.handleTabIndexChange(0); } }, this.props.intl.formatMessage({ id: 'LayersLabelLayer', defaultMessage: defaultMessages.LayersLabelLayer }))),
                React.createElement(NavItem, null,
                    React.createElement(NavLink, { active: this.state.activeTabIndex === 1, onClick: () => { this.handleTabIndexChange(1); } }, this.props.intl.formatMessage({ id: 'LayersLabelLegend', defaultMessage: defaultMessages.LayersLabelLegend })))),
            React.createElement("div", { className: 'mt-1' }),
            this.state.activeTabIndex === 0 && React.createElement(LayerListInner, { jimuMapView: this.props.jimuMapView }),
            this.state.activeTabIndex === 1 && React.createElement(LegendInner, { jimuMapView: this.props.jimuMapView })));
    }
}
class LayerListInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.LayerList = null;
        this.state = {
            apiLoaded: false
        };
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/LayerList']).then(modules => {
                [this.LayerList] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.apiLoaded && this.container) {
            if (prevProps.jimuMapView && this.props.jimuMapView && (prevProps.jimuMapView.id !== this.props.jimuMapView.id)) {
                if (this.LayerListBtn) {
                    this.LayerListBtn.view = this.props.jimuMapView.view;
                    this.LayerListBtn.renderNow();
                }
            }
            else {
                this.LayerListBtn = new this.LayerList({
                    container: this.container,
                    view: this.props.jimuMapView.view
                });
                this.props.jimuMapView.deleteJimuMapTool('LayerList');
                this.props.jimuMapView.addJimuMapTool({
                    name: 'LayerList',
                    instance: this.LayerListBtn
                });
            }
        }
    }
    componentWillUnmount() {
        if (this.LayerListBtn) {
            this.LayerListBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('LayerList');
        }
    }
    render() {
        return (React.createElement("div", { className: 'layers-map-tool', ref: ref => { this.container = ref; }, style: { width: '100%', minHeight: '32px', position: 'relative' } }, !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
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
    componentDidUpdate(prevProps) {
        if (this.state.apiLoaded && this.container) {
            if (prevProps.jimuMapView && this.props.jimuMapView && (prevProps.jimuMapView.id !== this.props.jimuMapView.id)) {
                if (this.LegendBtn) {
                    this.LegendBtn.view = this.props.jimuMapView.view;
                    this.LegendBtn.renderNow();
                }
            }
            else {
                this.LegendBtn = new this.Legend({
                    container: this.container,
                    view: this.props.jimuMapView.view
                });
                this.props.jimuMapView.deleteJimuMapTool('Legend');
                this.props.jimuMapView.addJimuMapTool({
                    name: 'Legend',
                    instance: this.LegendBtn
                });
            }
        }
    }
    componentWillUnmount() {
        if (this.LegendBtn) {
            this.LegendBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Legend');
        }
    }
    render() {
        return (React.createElement("div", { ref: ref => { this.container = ref; }, style: { width: '100%', minHeight: '32px', position: 'relative' } }, !this.state.apiLoaded && React.createElement("div", { className: 'exbmap-basetool-loader' })));
    }
}
//# sourceMappingURL=layers.js.map