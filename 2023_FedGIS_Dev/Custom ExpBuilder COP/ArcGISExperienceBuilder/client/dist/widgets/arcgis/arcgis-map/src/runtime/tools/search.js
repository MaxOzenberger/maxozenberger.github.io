/** @jsx jsx */
import { React, css, jsx, getAppStore, MessageManager, LocationChangeMessage } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { loadArcGISJSAPIModules, zoomToUtils } from 'jimu-arcgis';
import { defaultMessages } from 'jimu-ui';
export default class Search extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Search';
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'SearchLabel', defaultMessage: defaultMessages.SearchLabel });
    }
    getIcon() {
        return {
            icon: require('../assets/icons/search.svg')
        };
    }
    getExpandPanel() {
        if (this.props.isMobile) {
            return (jsx("div", { style: { minHeight: '32px', position: 'relative', width: '100%' } },
                jsx(SearchInner, { jimuMapView: this.props.jimuMapView, mapWidgetId: this.props.mapWidgetId })));
        }
        else {
            return (jsx("div", { style: { minWidth: '250px', minHeight: '32px', position: 'relative' } },
                jsx(SearchInner, { jimuMapView: this.props.jimuMapView, mapWidgetId: this.props.mapWidgetId })));
        }
    }
}
class SearchInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Search = null;
        this.Portal = null;
        this.state = {
            apiLoaded: false
        };
    }
    getStyle() {
        return css `
      /* border: solid 1px rgba(110,110,110,0.3); */
    `;
    }
    componentDidMount() {
        if (!this.state.apiLoaded) {
            loadArcGISJSAPIModules(['esri/widgets/Search', 'esri/portal/Portal']).then(modules => {
                [this.Search, this.Portal] = modules;
                this.setState({
                    apiLoaded: true
                });
            });
        }
    }
    componentDidUpdate() {
        if (this.state.apiLoaded && this.container) {
            if (this.SearchBtn) {
                this.container.innerHTML = '';
            }
            this.SearchBtn = new this.Search({
                container: this.container,
                view: this.props.jimuMapView.view,
                portal: new this.Portal({
                    url: getAppStore().getState().portalUrl
                })
            });
            this.props.jimuMapView.deleteJimuMapTool('Search');
            this.props.jimuMapView.addJimuMapTool({
                name: 'Search',
                instance: this.SearchBtn
            });
            this.SearchBtn.on('select-result', (event) => {
                var _a, _b, _c, _d, _e;
                // use zoomToUtils to instead of default zoom for searing result with single point
                if (((_b = (_a = event === null || event === void 0 ? void 0 : event.result) === null || _a === void 0 ? void 0 : _a.feature) === null || _b === void 0 ? void 0 : _b.layer) && ((_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.result) === null || _c === void 0 ? void 0 : _c.feature) === null || _d === void 0 ? void 0 : _d.geometry) === null || _e === void 0 ? void 0 : _e.type) === 'point') {
                    zoomToUtils.zoomTo(this.props.jimuMapView.view, [event.result.feature], {});
                }
                if (!event.result.feature.layer) {
                    const geometry = event.result.feature.geometry.toJSON();
                    MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, geometry));
                }
                else {
                    const geometry = event.result.feature.geometry;
                    if (geometry.type === 'point') {
                        MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, geometry.toJSON()));
                    }
                    else {
                        const point = geometry.extent.center;
                        MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, point.toJSON()));
                    }
                }
            });
        }
    }
    componentWillUnmount() {
        if (this.SearchBtn) {
            this.SearchBtn.destroy();
            this.SearchBtn = null;
            this.props.jimuMapView.deleteJimuMapTool('Search');
        }
    }
    render() {
        return (jsx("div", { css: this.getStyle(), className: 'w-100 search-map-tool', ref: ref => { this.container = ref; } }, !this.state.apiLoaded && jsx("div", { className: 'exbmap-basetool-loader' })));
    }
}
//# sourceMappingURL=search.js.map