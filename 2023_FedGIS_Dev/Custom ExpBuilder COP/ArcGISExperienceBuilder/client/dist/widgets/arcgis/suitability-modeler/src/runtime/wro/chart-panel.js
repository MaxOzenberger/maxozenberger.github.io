/** @jsx jsx */
/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, jsx } from 'jimu-core';
import { Alert, Button, ButtonGroup, Select } from 'jimu-ui';
import { SelectPolygonOutlined } from 'jimu-icons/outlined/gis/select-polygon';
import { SelectLassoOutlined } from 'jimu-icons/outlined/gis/select-lasso';
import { LayerOutlined } from 'jimu-icons/outlined/gis/layer';
import { MoveOutlined } from 'jimu-icons/outlined/editor/move';
import { WroChart } from './chart';
import * as chartUtil from './wro-chart-util';
import * as wroUtil from './wro-util';
import SketchViewModel from 'esri/widgets/Sketch/SketchViewModel';
export class ChartPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.watchHandles = [];
        this.activateSketch = (activeTool, type, createOptions) => {
            this.cancelSketch();
            const isSel = (activeTool === 'selectLayer');
            const view = this.props.wroContext.getView();
            if (view === null || view === void 0 ? void 0 : view.map) {
                this.setGraphicsLayerVisibility(this.drawGfxLayerId, !isSel);
                const gfxLayerId = isSel ? this.selGfxLayerId : this.drawGfxLayerId;
                const graphicsLayer = this.ensureGraphicsLayer(view, gfxLayerId);
                // let color = "#e6e6e6";
                const svm = this.activeSketchViewModel = new SketchViewModel({
                    view: view,
                    layer: graphicsLayer
                });
                svm.on('create', event => {
                    if (event.state === 'complete') {
                        if (isSel) {
                            this.clearHighlightHandle();
                            const geometry = event.graphic.geometry;
                            const task = this.newTask(view, geometry);
                            this.computeHistograms(task).catch(() => { }); // the catch is for ts-standard
                            graphicsLayer.remove(event.graphic);
                            // this.cancelSketch();
                            // this.activateSketch(activeTool,type,createOptions) ;
                        }
                        else {
                            if (event.graphic) {
                                event.graphic.symbol = chartUtil.makeSelectionSymbol();
                            }
                            const task = this.newTask(view, null);
                            this.computeHistograms(task).catch(() => { }); // the catch is for ts-standard
                        }
                        svm.create(type, createOptions);
                    }
                });
                svm.create(type, createOptions);
            }
        };
        this.cancelSketch = () => {
            const svm = this.activeSketchViewModel;
            if (svm) {
                try {
                    svm.cancel();
                    svm.destroy();
                }
                catch (ex) {
                    console.error('Error canceling SketchViewModel', ex);
                }
                this.activeSketchViewModel = null;
            }
        };
        this.canComputeHistograms = () => {
            return wroUtil.canComputeHistograms(this.props);
        };
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
        this.clearHighlightHandle = () => {
            this.clearHandles([this.highlightHandle]);
            this.highlightHandle = null;
        };
        this.computeHistograms = (task) => __awaiter(this, void 0, void 0, function* () {
            this.clearHighlightHandle();
            const nls = this.props.wroContext.nls;
            const workingId = this.workingId = Date.now();
            const isSel = !!task.featureSelectionGeometry;
            this.setState({ isWorking: true, showWarning: false, showError: false });
            try {
                const histogramData = yield chartUtil.computeHistograms(task);
                if (workingId !== this.workingId) {
                    if (task.highlightHandle)
                        this.clearHandles([task.highlightHandle]);
                }
                if (workingId === this.workingId) {
                    let warning = null;
                    const showNoData = ((histogramData === null || histogramData === void 0 ? void 0 : histogramData.colorCounts) && histogramData.colorCounts.length === 0);
                    if (showNoData) {
                        warning = nls('wro_chart_noData');
                    }
                    if (task.highlightHandle) {
                        this.highlightHandle = task.highlightHandle;
                    }
                    if (isSel) {
                        this.selGeometry = task.featureSelectionGeometry;
                        this.setState({
                            histogramDataSelect: histogramData,
                            isWorking: false,
                            showWarning: !!warning,
                            warning: warning
                        });
                    }
                    else {
                        this.selGeometry = null;
                        this.setState({
                            histogramDataDraw: histogramData,
                            isWorking: false,
                            showWarning: !!warning,
                            warning: warning
                        });
                    }
                }
            }
            catch (ex) {
                console.error('Error computing histograms', ex);
                if (workingId === this.workingId) {
                    this.setState({
                        isWorking: false,
                        showError: true,
                        warning: (ex === null || ex === void 0 ? void 0 : ex.message) ? nls('wro_validation_errorLoadingItemWithMsg', { message: String(ex.message) }) : nls('wro_validation_errorLoadingItem')
                    });
                }
            }
        });
        this.ensureGraphicsLayer = (view, layerId) => {
            return chartUtil.ensureGraphicsLayer(view, layerId);
        };
        this.getGraphicsLayer = (layerId) => {
            const view = this.props.wroContext.getView();
            if (view === null || view === void 0 ? void 0 : view.map) {
                return view.map.findLayerById(layerId);
            }
        };
        this.getImageLayer = () => {
            return wroUtil.getImageLayer(this.props);
        };
        this.getLayers = () => {
            return wroUtil.getPolygonLayers(this.props);
        };
        this.handleClearClicked = () => {
            this.workingId = null;
            const layer = this.getGraphicsLayer(this.drawGfxLayerId);
            if (layer)
                layer.removeAll();
            this.clearHighlightHandle();
            this.setState({
                histogramDataDraw: null,
                histogramDataSelect: null,
                showWarning: false,
                showError: false,
                isWorking: false
            });
        };
        this.handleDrawPolygonClicked = () => {
            this.clearHighlightHandle();
            this.activateSketch('drawPolygon', 'polygon');
            this.setState({
                activeTool: 'drawPolygon',
                histogramDataSelect: null,
                showWarning: false,
                showError: false,
                zoomPanActive: false
            });
        };
        this.handleDrawFreehandPolygonClicked = () => {
            this.clearHighlightHandle();
            this.activateSketch('drawFreehandPolygon', 'polygon', { mode: 'freehand' });
            this.setState({
                activeTool: 'drawFreehandPolygon',
                histogramDataSelect: null,
                showWarning: false,
                showError: false,
                zoomPanActive: false
            });
        };
        this.handleMapLayerSelected = (e) => {
            let v = e.target.value;
            if (typeof v !== 'string' || v.length === 0) {
                v = null;
            }
            if (v !== this.state.selectedMapLayerId) {
                this.clearHighlightHandle();
            }
            this.setState({
                selectedMapLayerId: v,
                showWarning: false,
                showError: false,
                histogramDataSelect: null
            });
        };
        this.handleSelectLayerClicked = () => {
            this.activateSketch('selectLayer', 'rectangle');
            this.setState({
                activeTool: 'selectLayer',
                showWarning: false,
                showError: false,
                zoomPanActive: false
            });
        };
        this.handleZoomPanClicked = () => {
            this.watchImageLayer();
            this.cancelSketch();
            this.setState({
                showWarning: false,
                showError: false,
                zoomPanActive: true
            });
        };
        this.newTask = (view, featureSelectionGeometry) => {
            const task = chartUtil.newTask(this.props.wroContext, view, this.getImageLayer(), this.state.selectedMapLayerId, featureSelectionGeometry, this.drawGfxLayerId);
            return task;
        };
        this.resetState = () => {
            this.cancelSketch();
            this.clearHighlightHandle();
            this.setState({
                activeTool: null,
                histogramDataDraw: null,
                histogramDataSelect: null,
                isWorking: false,
                selectedMapLayerId: null,
                showWarning: false,
                showError: false,
                warning: null,
                zoomPanActive: true
            });
        };
        this.setGraphicsLayerVisibility = (layerId, visible) => {
            const layer = this.getGraphicsLayer(layerId);
            if (layer)
                layer.visible = visible;
        };
        this.handlePanelClicked = () => {
            const modelController = this.props.wroContext.modelController;
            const wroModel = this.props.wroModel;
            if (wroModel) {
                modelController.setActivePanel(wroModel, 'model-panel');
            }
        };
        const id = this.props.wroContext.getId();
        this.drawGfxLayerId = `${id}_drawGfxLayerId`;
        this.selGfxLayerId = `${id}_selGfxLayerId`;
        this.state = {
            activeTool: null,
            histogramDataDraw: null,
            histogramDataSelect: null,
            isWorking: false,
            selectedMapLayerId: null,
            showWarning: false,
            showError: false,
            warning: null,
            zoomPanActive: true
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const wroModel = this.props.wroModel;
        const prevWroModel = prevProps.wroModel;
        const isChartPanel = wroModel && (wroModel.activePanel === 'chart-panel');
        const wasChartPanel = prevWroModel && (prevWroModel.activePanel === 'chart-panel');
        if (!isChartPanel && this.activeSketchViewModel) {
            this.cancelSketch();
        }
        const imgid = wroModel === null || wroModel === void 0 ? void 0 : wroModel.mapLayerId;
        const prevImgid = prevWroModel === null || prevWroModel === void 0 ? void 0 : prevWroModel.mapLayerId;
        if (prevImgid && imgid !== prevImgid) {
            this.unwatchImageLayer();
        }
        if (imgid && imgid !== prevImgid) {
            this.watchImageLayer();
        }
        if (prevProps.wroStatus.viewId !== this.props.wroStatus.viewId) {
            this.resetState();
            this.watchView();
        }
        else {
            const canComputeHistograms = this.canComputeHistograms();
            if (!canComputeHistograms) {
                this.resetState();
                this.watchImageLayer();
            }
            else {
                if (isChartPanel && !wasChartPanel && !this.state.zoomPanActive) {
                    const activeTool = this.state.activeTool;
                    if (activeTool === 'drawPolygon') {
                        // @todo check if ok
                        this.activateSketch('drawPolygon', 'polygon');
                    }
                    else if (activeTool === 'drawFreehandPolygon') {
                        // @todo check if ok
                        this.activateSketch('drawFreehandPolygon', 'polygon', { mode: 'freehand' });
                    }
                    else if (activeTool === 'selectLayer') {
                        // @todo check if ok
                        this.activateSketch('selectLayer', 'rectangle');
                    }
                    this.setState({ showWarning: false, showError: false });
                }
            }
        }
    }
    componentWillUnmount() {
        this.cancelSketch();
        this.unwatchView();
    }
    unwatchImageLayer() {
        if (this.imageLayerHandle) {
            // console.log('Unwatching image layer...')
            this.clearHandles([this.imageLayerHandle]);
            this.imageLayerHandle = null;
        }
    }
    unwatchView() {
        this.unwatchImageLayer();
        this.clearHighlightHandle();
        this.clearHandles(this.watchHandles);
        this.watchHandles = [];
    }
    watchImageLayer() {
        this.unwatchImageLayer();
        const imageLayer = this.getImageLayer();
        if (imageLayer && typeof imageLayer.watch === 'function') {
            // console.log('Watching image layer...')
            this.imageLayerHandle = imageLayer.watch('renderingRule', (newVal, oldVal, property, object) => {
                const refreshDraw = () => {
                    const view = this.props.wroContext.getView();
                    if (this.state.histogramDataDraw) {
                        const task = this.newTask(view, null);
                        this.computeHistograms(task).catch(() => { }); // the catch is for ts-standard
                    }
                };
                const view = this.props.wroContext.getView();
                if (this.state.histogramDataSelect && this.selGeometry) {
                    const task = this.newTask(view, this.selGeometry);
                    this.computeHistograms(task).then(() => {
                        refreshDraw();
                    }).catch(() => { });
                }
                else {
                    refreshDraw();
                }
            });
        }
    }
    watchView() {
        this.unwatchView();
        this.watchImageLayer();
        const view = this.props.wroContext.getView();
        if (view === null || view === void 0 ? void 0 : view.map) {
            const h = view.map.allLayers.on('change', (event) => {
                const layerId = this.state.selectedMapLayerId;
                if (layerId) {
                    const layer = view.map.findLayerById(layerId);
                    if (!layer) {
                        this.setState({ selectedMapLayerId: null });
                    }
                }
            });
            this.watchHandles.push(h);
        }
    }
    render() {
        const nls = this.props.wroContext.nls;
        const wroModel = this.props.wroModel;
        const { activeTool, isWorking, selectedMapLayerId, zoomPanActive } = this.state;
        const canComputeHistograms = this.canComputeHistograms();
        // isWorking = true;
        let selectNode;
        if (!canComputeHistograms) {
            selectNode = (jsx("span", { className: 'widget-wro-chart-note' }, nls('wro_chart_noModelLayer')));
        }
        else if (canComputeHistograms && (wroModel === null || wroModel === void 0 ? void 0 : wroModel.mapLayerId)) {
            const layers = this.getLayers();
            if (activeTool === 'selectLayer') {
                if (layers && layers.length > 0) {
                    const opts = [];
                    layers.forEach(lyr => {
                        const opt = (jsx("option", { key: lyr.id, value: lyr.id }, lyr.title));
                        opts.push(opt);
                    });
                    selectNode = (jsx(Select, { placeholder: nls('wro_chart_selectLayerPlaceholder'), value: selectedMapLayerId, onChange: this.handleMapLayerSelected }, opts));
                }
                else {
                    selectNode = (jsx("span", { className: 'widget-wro-chart-note' },
                        jsx(Alert, { closable: true, form: "basic", text: nls('wro_chart_noSubjectLayers'), type: "warning", withIcon: true })));
                }
            }
            else {
                // selectNode = (
                //   <span className='widget-wro-chart-note'>{' '}</span>
                // )
            }
        }
        const showSelectNode = !!selectNode;
        let msgNode = jsx("div", { className: 'widget-wro-chart-working' }, ' '); // show it always, it has a fixed height
        if (isWorking) {
            msgNode = jsx("div", { className: 'widget-wro-chart-working' },
                jsx("span", null, nls('wro_chart_working')));
        }
        else if (this.state.showWarning && this.state.warning) {
            msgNode = jsx("div", { className: 'widget-wro-chart-warning' },
                jsx(Alert, { closable: true, form: "basic", text: this.state.warning, type: "warning", withIcon: true }));
        }
        else if (this.state.showError && this.state.warning) {
            msgNode = jsx("div", { className: 'widget-wro-chart-warning' },
                jsx(Alert, { closable: true, form: "basic", text: this.state.warning, type: "error", withIcon: true }));
        }
        return (jsx("div", { className: 'widget-wro-chart-panel' },
            jsx("div", { className: 'widget-wro-chart-header' },
                jsx("div", { className: 'widget-wro-flex-between' },
                    jsx("span", { className: 'widget-wro-chart-features-label' }, nls('wro_chart_prompt')),
                    jsx(ButtonGroup, { className: 'widget-wro-chart-tools' },
                        jsx("span", { className: 'working', "data-dojo-attach-point": 'workingNode' }),
                        jsx(Button, { className: 'widget-wro-chart-button', active: !zoomPanActive && (activeTool === 'drawPolygon'), disabled: !canComputeHistograms, icon: true, title: nls('wro_chart_polygonTool'), onClick: this.handleDrawPolygonClicked },
                            jsx(SelectPolygonOutlined, { size: 'm' })),
                        jsx(Button, { className: 'widget-wro-chart-button', active: !zoomPanActive && (activeTool === 'drawFreehandPolygon'), disabled: !canComputeHistograms, icon: true, title: nls('wro_chart_freehandPolygonTool'), onClick: this.handleDrawFreehandPolygonClicked },
                            jsx(SelectLassoOutlined, { size: 'm' })),
                        jsx(Button, { className: 'widget-wro-chart-button', active: !zoomPanActive && (activeTool === 'selectLayer'), disabled: !canComputeHistograms, icon: true, title: nls('wro_chart_selectTool'), onClick: this.handleSelectLayerClicked },
                            jsx(LayerOutlined, { size: 'm' })),
                        jsx(Button, { className: 'widget-wro-chart-button', active: zoomPanActive, disabled: !canComputeHistograms, icon: true, title: nls('wro_chart_zoomPanTool'), onClick: this.handleZoomPanClicked },
                            jsx(MoveOutlined, { size: 'm' })),
                        jsx(Button, { className: 'widget-wro-chart-button', disabled: !canComputeHistograms || !!isWorking, type: 'link', onClick: this.handleClearClicked }, nls('wro_general_clear')))),
                showSelectNode &&
                    jsx("div", { className: 'widget-wro-chart-select-layer-section' }, selectNode),
                msgNode),
            jsx("div", { className: 'widget-wro-chart-body' }, this.renderChart())));
    }
    renderChart() {
        const wroContext = this.props.wroContext;
        const wroModel = this.props.wroModel;
        const wroStatus = this.props.wroStatus;
        const isSel = (this.state.activeTool === 'selectLayer');
        let histogramData;
        if (isSel) {
            histogramData = this.state.histogramDataSelect;
        }
        else {
            histogramData = this.state.histogramDataDraw;
        }
        return (jsx(WroChart, { histogramData: histogramData, wroContext: wroContext, wroModel: wroModel, wroStatus: wroStatus }));
    }
}
//# sourceMappingURL=chart-panel.js.map