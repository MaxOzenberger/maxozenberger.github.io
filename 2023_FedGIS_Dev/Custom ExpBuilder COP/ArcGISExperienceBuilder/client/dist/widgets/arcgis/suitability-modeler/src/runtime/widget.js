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
import { React, jsx } from 'jimu-core';
import defaultMessages from './translations/default';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { Modeler } from './wro/modeler';
import { WroContext } from './wro/wro-context';
import { ModelFactory } from './wro/wro-model';
import * as layerUtil from './wro/wro-layer-util';
import * as wroColormaps from './wro/wro-colormaps';
import './style.css';
let COUNTER = 0;
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.autoRunModel = (isStartup) => {
            var _a;
            const wroContext = this.wroContext;
            const wroModel = this.state.wroModel;
            const jimuMapView = this.state.jimuMapView;
            // @todo should we auto-add the model layer to the new view
            // or wait for the user to hit the run button?
            if ((_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) {
                if (wroModel && (wroModel.mapLayerId || isStartup)) {
                    if (wroContext.modelController.isValid(wroModel)) {
                        layerUtil.runWroModel(wroContext, wroModel).then(() => {
                            // n/a
                        }).catch(ex => {
                            console.error('Error running WRO model', ex);
                        });
                    }
                }
            }
        };
        this.clearLayers = (view, wroModel) => {
            const wroContext = this.wroContext;
            const id = this.props.id;
            if (view === null || view === void 0 ? void 0 : view.map) {
                let l = view.map.findLayerById(`${id}_drawGfxLayerId`);
                if (l)
                    view.map.remove(l);
                l = view.map.findLayerById(`${id}_selGfxLayerId`);
                if (l)
                    view.map.remove(l);
                if (wroModel === null || wroModel === void 0 ? void 0 : wroModel.mapLayerId) {
                    layerUtil.removeLayer(wroContext, wroModel);
                }
            }
        };
        this.handleActiveViewChange = (jimuMapView) => {
            var _a;
            const wroModel = this.state.wroModel;
            // @todo should we remove the model layer from the previous view?
            const prev = this.state.jimuMapView;
            if ((_a = prev === null || prev === void 0 ? void 0 : prev.view) === null || _a === void 0 ? void 0 : _a.map) {
                this.clearLayers(prev === null || prev === void 0 ? void 0 : prev.view, wroModel);
            }
            const wroStatus = ModelFactory.cloneStatus(this.state.wroStatus);
            if (jimuMapView) {
                wroStatus.viewId = this.newViewId();
            }
            else {
                wroStatus.viewId = null;
            }
            this.setState({
                jimuMapView: jimuMapView,
                wroStatus: wroStatus
            }, () => {
                // if (jimuMapView && !prev) {
                //   const wroContext: WroContext = this.wroContext;
                //   let serviceUrl = this.props.config.serviceUrl;
                //   let itemId = this.props.config.itemId;
                //
                //   //serviceUrl = "https://utility.arcgis.com/usrsvcs/servers/24b7c7752170431a95719323a9e71a5e/rest/services/WRO_World_Ecophysiographic_Data/ImageServer";
                //   //itemId = null;
                //   //serviceUrl = null;
                //   //itemId = "7cf3a0ca09254e01a1a8b073cd80cbf7";
                //
                //   this.loadModel(wroContext,serviceUrl,itemId,true);
                // }
            });
        };
        this.newThemeId = () => {
            return 'themeId_' + (COUNTER++).toString();
        };
        this.newViewId = () => {
            return 'viewId_' + (COUNTER++).toString();
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
        this.onWroModelChange = (wroModel, wasCleared) => {
            var _a, _b, _c, _d;
            try {
                if (wasCleared) {
                    const clearGfx = (_d = (_c = (_b = (_a = this.modelerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.chartPanelRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.handleClearClicked;
                    if (clearGfx)
                        clearGfx();
                }
            }
            catch (ex) {
                console.error(ex);
            }
            this.setState({
                wroModel: wroModel
            });
        };
        this.onWroStatusChange = (wroStatus) => {
            this.setState({
                wroStatus: wroStatus
            });
        };
        this.modelerRef = React.createRef();
        const wroStatus = ModelFactory.newWroStatus();
        this.state = {
            jimuMapView: null,
            wasModelLoaded: false,
            wroModel: null,
            wroStatus: wroStatus
        };
        wroColormaps.initLabels(this.nls);
        const wroContext = this.wroContext = new WroContext();
        wroContext.nls = this.nls;
        wroContext.getConfig = () => this.props.config;
        wroContext.getId = () => this.props.id;
        wroContext.getLabel = () => this.props.config.displayLabel ? this.props.label : null;
        wroContext.getPortal = () => this.props.portalSelf;
        wroContext.getPortalUrl = () => this.props.portalUrl;
        wroContext.getTheme = () => this.props.theme;
        wroContext.getUser = () => this.props.user;
        wroContext.getView = () => { var _a; return (_a = this.state.jimuMapView) === null || _a === void 0 ? void 0 : _a.view; };
        wroContext.modelController.onModelChange = this.onWroModelChange;
        wroContext.modelController.onStatusChange = this.onWroStatusChange;
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b;
        const wroContext = this.wroContext;
        const wroModel = this.state.wroModel;
        const state = this.state;
        const props = this.props;
        const config = props.config;
        const prevConfig = prevProps.config;
        const serviceUrl = config.serviceUrl;
        const itemId = config.itemId;
        const prevServiceUrl = prevConfig.serviceUrl;
        const prevItemId = prevConfig.itemId;
        let newState;
        const ensureNewState = () => {
            if (newState === undefined)
                newState = {};
            return newState;
        };
        const ensureNewStatus = () => {
            ensureNewState();
            if (!newState.wroStatus) {
                newState.wroStatus = ModelFactory.cloneStatus(state.wroStatus);
            }
            return newState.wroStatus;
        };
        if (props.theme !== prevProps.theme) {
            ensureNewStatus().themeId = this.newThemeId();
        }
        if (props.label !== prevProps.label) {
            ensureNewStatus();
        }
        if (config.displayLabel !== prevConfig.displayLabel) {
            ensureNewStatus();
        }
        if (config.allowExport !== prevConfig.allowExport) {
            ensureNewStatus();
        }
        if (!serviceUrl && !itemId) {
            this.clearLayers((_a = state.jimuMapView) === null || _a === void 0 ? void 0 : _a.view, wroModel);
            ensureNewState().wroModel = null;
            this.setState(newState);
            return;
        }
        let reloadModel = true;
        if (prevServiceUrl && prevServiceUrl === serviceUrl) {
            reloadModel = false;
        }
        else if (prevItemId && prevItemId === itemId) {
            reloadModel = false;
        }
        if (state.jimuMapView && !prevState.jimuMapView && !state.wasModelLoaded) {
            reloadModel = true;
        }
        if (reloadModel) {
            this.clearLayers((_b = state.jimuMapView) === null || _b === void 0 ? void 0 : _b.view, wroModel);
            ensureNewStatus().isModelLoading = true;
            ensureNewState().wroModel = null;
            this.setState(newState);
            this.loadModel(wroContext, serviceUrl, itemId, true);
        }
        else {
            if (newState) {
                this.setState(newState);
            }
            const jimuMapView = state.jimuMapView;
            if (jimuMapView && jimuMapView !== prevState.jimuMapView) {
                if (state.wasModelLoaded && wroModel && wroModel.mapLayerId) {
                    const isStartup = true;
                    this.autoRunModel(isStartup);
                }
            }
        }
    }
    componentWillUnmount() {
        var _a;
        const view = (_a = this.state.jimuMapView) === null || _a === void 0 ? void 0 : _a.view;
        const wroModel = this.state.wroModel;
        this.clearLayers(view, wroModel);
    }
    loadModel(wroContext, serviceUrl, itemId, isStartup) {
        wroContext.loadModel(serviceUrl, itemId).then(result => {
            const wroModel = result;
            const wroStatus = ModelFactory.cloneStatus(this.state.wroStatus);
            wroStatus.isModelLoading = false;
            this.setState({
                wasModelLoaded: true,
                wroModel: wroModel,
                wroStatus: wroStatus
            }, () => {
                // @todo should we auto-add model layer on startup?
                if (isStartup) {
                    this.autoRunModel(isStartup);
                }
            });
        }).catch(ex => {
            console.error('Error loading WRO model', ex);
            const wroStatus = ModelFactory.cloneStatus(this.state.wroStatus);
            wroStatus.isModelLoading = false;
            this.setState({
                wroStatus: wroStatus
            });
        });
    }
    render() {
        var _a;
        const wroContext = this.wroContext;
        const wroModel = this.state.wroModel;
        const wroStatus = this.state.wroStatus;
        return (jsx("div", { className: 'widget-wro jimu-widget' },
            jsx(Modeler, { ref: this.modelerRef, wroContext: wroContext, wroModel: wroModel, wroStatus: wroStatus }),
            jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.handleActiveViewChange })));
    }
}
//# sourceMappingURL=widget.js.map