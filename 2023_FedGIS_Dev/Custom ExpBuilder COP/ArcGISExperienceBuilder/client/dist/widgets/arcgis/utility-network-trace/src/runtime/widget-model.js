var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataSourceManager, MessageManager, DataRecordsSelectionChangeMessage } from 'jimu-core';
import { MapViewManager } from 'jimu-arcgis';
import UtilityNetworkTrace from 'esri/widgets/UtilityNetworkTrace';
import watchUtils from 'esri/core/watchUtils';
export default class WidgetModel {
    constructor() {
        this.unt = null;
        this.props = null;
        this.mvManager = MapViewManager.getInstance();
    }
    static getInstance() {
        if (!WidgetModel.instance) {
            WidgetModel.instance = new WidgetModel();
        }
        return WidgetModel.instance;
    }
    /****** PUBLIC METHODS ****/
    loadPropsFromView(props) {
        this.props = props;
    }
    loadTraceWidgetFromAPI(jmv, domRef) {
        if (this.unt !== null) {
            if (this.unt.viewModel !== null) {
                this.unt.viewModel.reset();
            }
        }
        const unt = new UtilityNetworkTrace({
            container: domRef,
            view: jmv.view,
            showSelectionAttributes: true,
            selectOnComplete: true,
            showGraphicsOnComplete: true,
            selectedTraces: [],
            flags: []
        });
        this.unt = unt;
        this.registerEvents();
        return unt;
    }
    registerEvents() {
        // @ts-expect-error: 'select-features' event is not documented for 4.23, let us fix it later.
        this.unt.on('select-features', (res) => {
            this.clearSelection(res);
            const mapDS = this.getActiveMap();
            const mapLyrVws = mapDS.jimuLayerViews;
            const dsObj = DataSourceManager.getInstance();
            const mapLyrVwsSel = {};
            // @ts-expect-error: 'res' is not documented as a result set from this event.
            res.resultSet.forEach((arrResult) => {
                arrResult.forEach((rs) => {
                    //dsObj.forEach((ds) => {
                    for (const key in mapLyrVws) {
                        const ds = dsObj.getDataSource(mapLyrVws[key].layerDataSourceId);
                        if (ds.type === 'FEATURE_LAYER') {
                            // @ts-expect-error
                            if (ds.layer.id === rs.layer.id) {
                                const oidField = rs.layer.objectIdField;
                                if (!mapLyrVwsSel[key]) {
                                    mapLyrVwsSel[key] = {
                                        ds: ds,
                                        featDatRecList: [],
                                        objectIdList: []
                                    };
                                }
                                rs.featureSet.features.forEach((feat) => {
                                    mapLyrVwsSel[key].featDatRecList.push(ds.buildRecord(feat));
                                    mapLyrVwsSel[key].objectIdList.push(feat.attributes[oidField]);
                                    // featDatRecList.push(ds.buildRecord(feat))
                                    // objectIdList.push(feat.attributes[oidField])
                                });
                                // ds.selectRecordsByIds(objectIdList.map(String), featDatRecList, true)
                            }
                        }
                    }
                });
            });
            for (const key in mapLyrVwsSel) {
                const ds = mapLyrVwsSel[key].ds;
                ds.selectRecordsByIds(mapLyrVwsSel[key].objectIdList.map(String), mapLyrVwsSel[key].featDatRecList, true);
                const message = new DataRecordsSelectionChangeMessage(this.props.id, mapLyrVwsSel[key].featDatRecList);
                MessageManager.getInstance().publishMessage(message);
            }
        });
        // @ts-expect-error: 'clear-selection' event is not documented for 4.23, let us fix it later.
        this.unt.on('clear-selection', (res) => {
            if (this.unt) {
                this.clearSelection(res);
            }
        });
        const fsDS = this.getFeatureLayerDS();
        if (fsDS !== null) {
            this.unt.gdbVersion = fsDS.getGDBVersion();
            watchUtils.watch(fsDS.layer, 'gdbVersion', (value) => __awaiter(this, void 0, void 0, function* () {
                this.unt.gdbVersion = value;
            }));
        }
    }
    clearSelection(res) {
        const mapDS = this.getActiveMap();
        if (mapDS !== null) {
            const mapLyrVws = mapDS.jimuLayerViews;
            const dsObj = DataSourceManager.getInstance();
            if (res.resultSet.length > 0) {
                res.resultSet.forEach((arrResult) => {
                    arrResult.forEach((rs) => {
                        for (const key in mapLyrVws) {
                            const ds = dsObj.getDataSource(mapLyrVws[key].layerDataSourceId);
                            if (ds) {
                                if (ds.type === 'FEATURE_LAYER') {
                                    //const dsJson = ds.getDataSourceJson()
                                    //if (ds.layer.id === rs.layer.id) {
                                    ds.clearSelection();
                                    //}
                                }
                            }
                        }
                    });
                });
            }
            else {
                for (const key in mapLyrVws) {
                    const ds = dsObj.getDataSource(mapLyrVws[key].layerDataSourceId);
                    if (ds) {
                        if (ds.type === 'FEATURE_LAYER') {
                            //const dsJson = ds.getDataSourceJson()
                            //if (dsJson.url !== null && dsJson.url === rs.layerUrl) {
                            ds.clearSelection();
                            //}
                        }
                    }
                }
            }
        }
    }
    clearAll() {
        //const mapDS = this.getActiveMap()
        //const mapLyrVws = mapDS.jimuLayerViews
        let activeMap = null;
        const allIds = this.mvManager.getAllJimuMapViewIds();
        allIds.forEach((ids) => {
            const jmapView = this.mvManager.getJimuMapViewById(ids);
            //if (jmapView.isActive) {
            activeMap = jmapView;
            //}
            if (activeMap !== null) {
                const dsObj = DataSourceManager.getInstance();
                const mapLyrVws = activeMap.jimuLayerViews;
                for (const key in mapLyrVws) {
                    const ds = dsObj.getDataSource(mapLyrVws[key].layerDataSourceId);
                    if (ds) {
                        if (ds.type === 'FEATURE_LAYER') {
                            ds.clearSelection();
                        }
                    }
                }
                activeMap.view.graphics.removeAll();
                this.callResetOnJSWidget();
            }
        });
    }
    callResetOnJSWidget() {
        if (this.unt !== null) {
            if (this.unt.viewModel !== null) {
                //@ts-expect-error
                if (this.unt.viewModel._unObject !== null) {
                    this.unt.viewModel.reset();
                }
            }
        }
    }
    getActiveMap() {
        let returnVal = null;
        if (this.props) {
            if (this.props.config.useMapWidget) {
                const mapViewGroups = this.mvManager.getJimuMapViewGroup(this.props.config.useMapWidgetIds);
                if (mapViewGroups && mapViewGroups.jimuMapViews) {
                    for (const id in mapViewGroups.jimuMapViews) {
                        if (mapViewGroups.jimuMapViews[id].dataSourceId) {
                            if (mapViewGroups.jimuMapViews[id].isActive ||
                                mapViewGroups.jimuMapViews[id].isActive === undefined) {
                                returnVal = mapViewGroups.jimuMapViews[id];
                            }
                        }
                    }
                }
            }
        }
        return returnVal;
    }
    getFeatureLayerDS() {
        const mapDS = this.getActiveMap();
        if (mapDS !== null) {
            const mapLyrVws = mapDS.jimuLayerViews;
            const dsObj = DataSourceManager.getInstance();
            for (const key in mapLyrVws) {
                const ds = dsObj.getDataSource(mapLyrVws[key].layerDataSourceId);
                if (ds) {
                    if (ds.type === 'FEATURE_LAYER') {
                        const flDS = ds;
                        const lyrDef = flDS.getLayerDefinition();
                        const unField = lyrDef.fields.some((fld) => {
                            return fld.name.toLowerCase() === 'subnetworkname';
                        });
                        if (unField) {
                            return flDS;
                        }
                    }
                }
                else {
                    return null;
                }
            }
            return null;
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=widget-model.js.map