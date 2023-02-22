/** @jsx jsx */
import { React, Immutable, jsx } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { WidgetPlaceholder } from 'jimu-ui';
import WidgetModel from './widget-model';
import defaultMessages from './translations/default';
import { getStyle } from './lib/style';
import traceIcon from 'jimu-icons/svg/outlined/brand/widget-utility-network-trace.svg';
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.viewModel = WidgetModel.getInstance();
        this.defaultColor = {
            color: [255, 255, 0, 0.6],
            haloOpacity: 0.9,
            fillOpacity: 0.2,
            hex: '#FFFF00'
        };
        this.onActiveViewChange = (jimuMapView) => {
            this.viewModel.loadPropsFromView(this.props);
            if (jimuMapView !== null) {
                if (this.state.unt) {
                    if (this.state.unt !== null) {
                        if (this.state.unt.viewModel._unObject !== null) {
                            this.viewModel.clearAll();
                            this.state.unt.destroy();
                        }
                        else {
                            this.state.unt.destroy();
                        }
                    }
                }
                this.setState({}, () => {
                    const c = document.createElement('div');
                    c.className = 'trace-container';
                    this.containerRef.current.innerHTML = '';
                    this.containerRef.current.appendChild(c);
                    const un = this.viewModel.loadTraceWidgetFromAPI(jimuMapView, c);
                    this.setState({ unt: un, jmv: jimuMapView });
                });
                //})
            }
            else {
                if (this.state.unt) {
                    if (this.state.unt !== null) {
                        if (this.state.unt.viewModel._unObject !== null) {
                            this.viewModel.callResetOnJSWidget();
                            this.viewModel.clearAll();
                            this.state.unt.destroy();
                        }
                    }
                    else {
                        this.state.unt.destroy();
                    }
                }
                this.setState({ unt: null, jmv: null });
            }
        };
        this.componentWillUnmount = () => {
            //clear flags and graphics
            this.viewModel.clearAll();
        };
        this.state = {
            jmv: null,
            unt: null,
            hasMapWidget: this.props.config.useMapWidget ? this.props.config.useMapWidget : false
        };
    }
    componentDidUpdate(preProps, preState) {
        if (window.jimuConfig.isInBuilder) {
            if (this.state.jmv !== null) {
                if (this.state.unt !== null) {
                    const selectedTraces = [];
                    //let showGraphicsOnComplete = true
                    //let showSelectedFeatureList = true
                    //let selectFeaturesOnComplete = true
                    /*
                    let graphicsColor: GraphicColor = {
                      color: [255, 255, 0, 0.6],
                      haloOpacity: 0.9,
                      fillOpacity: 0.2,
                      hex: '#FFFF00'
                    }
                    */
                    const untInputProps = [];
                    if (Object.prototype.hasOwnProperty.call(this.props.config, 'configInfo')) {
                        this.props.config.configInfo.forEach((ci) => {
                            ci.traceSettings.forEach((ts) => {
                                if (ts.selected) {
                                    selectedTraces.push(ts.globalId);
                                }
                                /*
                                showGraphicsOnComplete =
                                  ts.traceResultSettings.showGraphicsOnComplete
                                showSelectedFeatureList =
                                  ts.traceResultSettings.showSelectedFeatureList
                                selectFeaturesOnComplete =
                                  ts.traceResultSettings.selectFeaturesOnComplete
                                graphicsColor = Immutable.asMutable(
                                  Immutable(ts.traceResultSettings.graphicsColor),
                                  {
                                    deep: true
                                  }
                                )
                                */
                            });
                            if (ci.inputSettings.length > 0) {
                                ci.inputSettings.forEach((is) => {
                                    const symbolClean = Immutable.asMutable(Immutable(is.inputSymbol), {
                                        deep: true
                                    });
                                    delete symbolClean.defaultPointSymbol.imageData;
                                    symbolClean.defaultPointSymbol.type = 'picture-marker';
                                    untInputProps.push({
                                        label: is.label,
                                        description: is.description,
                                        type: is.type,
                                        symbol: symbolClean.defaultPointSymbol
                                    });
                                });
                            }
                        });
                        //let unt = Immutable.asMutable(Immutable(this.state.unt), {
                        //  deep: true,
                        //});
                        //this.state.unt.selectOnComplete = selectFeaturesOnComplete
                        //this.state.unt.showGraphicsOnComplete = showGraphicsOnComplete
                        //this.state.unt.showSelectionAttributes = showSelectedFeatureList
                        //this.state.unt.defaultGraphicColor = graphicsColor
                        //this.state.unt.selectedTraces = selectedTraces
                        //this.state.unt.inputSettings = untInputProps
                        this.setState({ unt: this.state.unt, hasMapWidget: true });
                    }
                }
            }
            else {
                this.setState({ hasMapWidget: false }, () => {
                    this.viewModel.callResetOnJSWidget();
                    this.viewModel.clearAll();
                });
            }
        }
    }
    componentDidMount() {
    }
    render() {
        var _a;
        return (jsx("div", { css: getStyle(this.props.theme, this.props.config), id: this.props.widgetId + '_trace_widget' },
            jsx("div", { ref: this.containerRef }),
            this.state.hasMapWidget
                ? ''
                : jsx(WidgetPlaceholder, { icon: traceIcon, message: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }), widgetId: this.props.id }),
            this.props.config.useMapWidget &&
                jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.onActiveViewChange })));
    }
}
//# sourceMappingURL=widget.js.map