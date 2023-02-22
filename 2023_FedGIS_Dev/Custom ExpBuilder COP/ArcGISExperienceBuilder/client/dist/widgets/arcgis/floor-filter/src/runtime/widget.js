/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import defaultMessages from './translations/default';
import { JimuMapViewComponent } from 'jimu-arcgis';
import FloorFilter from 'esri/widgets/FloorFilter';
import './style.css';
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.clearHandles = (handles) => {
            if (Array.isArray(handles)) {
                handles.forEach((h) => {
                    try {
                        if (h)
                            h.remove();
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                });
            }
        };
        this.handleActiveViewChange = (jimuMapView) => {
            var _a;
            this.setState({
                hadMap: !!(this.state.hadMap || ((_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map)),
                jimuMapView: jimuMapView
            });
        };
        this.hasFloorInfo = () => {
            var _a, _b, _c;
            return !!((_c = (_b = (_a = this.state.jimuMapView) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.map) === null || _c === void 0 ? void 0 : _c.floorInfo);
        };
        this.hasMap = () => {
            var _a, _b;
            return !!((_b = (_a = this.state.jimuMapView) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.map);
        };
        this.nls = (id, values) => {
            if (this.props.intl) {
                return this.props.intl.formatMessage({
                    id: id,
                    defaultMessage: defaultMessages[id]
                }, values);
            }
            return id;
        };
        this.state = {
            hadMap: false,
            jimuMapView: null,
            wasMounted: false
        };
    }
    componentDidMount() {
        this.setState({
            wasMounted: true
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const state = this.state;
        const props = this.props;
        if (state.wasMounted && !prevState.wasMounted) {
            this.loadCoreWidget();
        }
        else if (state.jimuMapView !== prevState.jimuMapView) {
            if (state.wasMounted)
                this.loadCoreWidget();
        }
        else if (props.config.longNames !== prevProps.config.longNames) {
            if (this.coreWidget) {
                this.coreWidget.longNames = !!props.config.longNames;
            }
        }
        else if (props.config.position !== prevProps.config.position) {
            if (this.coreWidget) {
                this.coreWidget.scheduleRender();
            }
        }
    }
    componentWillUnmount() {
        this.destroyCoreWidget();
    }
    destroyCoreWidget() {
        if (this.coreWidget) {
            const view = this.coreWidget.view;
            this.coreWidget.destroy();
            this.coreWidget = null;
            if (view) {
                view.floors = this.vwOriginalFloors || null;
            }
        }
        if (this.vwHeightHandle) {
            this.clearHandles([this.vwHeightHandle]);
            this.vwHeightHandle = null;
        }
        if (this.vwWidthHandle) {
            this.clearHandles([this.vwWidthHandle]);
            this.vwWidthHandle = null;
        }
    }
    fixBreakpoints(type) {
        // the core widget is expecting to be within the view.ui,
        // it's watching the view size to determine if it can be expanded (longNames),
        // we need to work around that
        // ExB html element class names: size-mode-LARGE size-mode-MEDIUM size-mode-SMALL
        // view beakpoint sizes: xsmall small medium large xlarge
        setTimeout(() => {
            var _a;
            const vm = (_a = this.coreWidget) === null || _a === void 0 ? void 0 : _a.viewModel;
            let size = 'large';
            try {
                if (document.documentElement.classList.contains('size-mode-MEDIUM')) {
                    size = 'medium';
                }
                else if (document.documentElement.classList.contains('size-mode-SMALL')) {
                    size = 'xsmall';
                }
            }
            catch (ex) {
                console.error(ex);
            }
            if (vm && (type === 'both' || type === 'widthBreakpoint')) {
                vm._viewWidthBreakpoint = size;
            }
            if (vm && (type === 'both' || type === 'heightBreakpoint')) {
                vm._viewHeightBreakpoint = size;
            }
        }, 100);
    }
    loadCoreWidget() {
        if (this.coreContainer) {
            const hasFloorInfo = this.hasFloorInfo();
            if (hasFloorInfo) {
                this.destroyCoreWidget();
                const coreNode = document.createElement('div');
                //coreNode.setAttribute('class', 'w-100 h-100')
                this.coreContainer.appendChild(coreNode);
                const longNames = !!this.props.config.longNames;
                const view = this.state.jimuMapView.view;
                this.coreWidget = new FloorFilter({
                    container: coreNode,
                    longNames: longNames,
                    view: view
                });
                // the core widget is expecting to be part of the view-ui,
                // we need to override this function
                // @ts-expect-error
                this.coreWidget._getComponentPosition = () => {
                    return this.props.config.position || 'top-left';
                };
                this.vwOriginalFloors = (view.floors && view.floors.clone());
                this.fixBreakpoints('both');
                this.vwWidthHandle = view.watch('widthBreakpoint', () => {
                    this.fixBreakpoints('widthBreakpoint');
                });
                this.vwWidthHandle = view.watch('heightBreakpoint', () => {
                    this.fixBreakpoints('heightBreakpoint');
                });
            }
            else {
                this.destroyCoreWidget();
            }
        }
    }
    render() {
        var _a;
        const lbl = this.props.config.displayLabel ? this.props.label : null;
        const hasMap = this.hasMap();
        const hasFloorInfo = this.hasFloorInfo();
        let msg;
        const msgClass = 'widget-floorfilter-msg';
        if (!hasMap) {
            msg = this.nls('floorfilter_noMap');
        }
        else if (!hasFloorInfo) {
            msg = this.nls('floorfilter_notFloorAware');
        }
        let className = 'jimu-widget widget-floorfilter';
        if (msg)
            className += ' widget-floorfilter-nomap';
        return (jsx("div", { className: className },
            jsx("h4", { className: 'widget-floorfilter-header', style: { display: lbl ? 'block' : 'none' } }, lbl),
            jsx("div", { className: msgClass, style: { display: msg ? 'block' : 'none' } },
                jsx("span", { className: "esri-icon esri-icon-urban-model" }),
                jsx("span", { style: { margin: '0 8px' } }, msg)),
            jsx("div", { className: 'widget-floorfilter-container', ref: ref => { this.coreContainer = ref; } }),
            jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.handleActiveViewChange })));
    }
}
//# sourceMappingURL=widget.js.map