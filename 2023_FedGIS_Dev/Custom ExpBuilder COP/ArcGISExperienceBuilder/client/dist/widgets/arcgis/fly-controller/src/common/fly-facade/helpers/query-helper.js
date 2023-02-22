var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataSourceManager } from 'jimu-core';
import * as utils from '../../utils/utils';
export default class QueryHelper {
    // dsManager: DataSourceManager;
    constructor(options) {
        // getDataSource = (dsId):DataSource => {
        //   return this.dsManager.getDataSource(dsId);
        // }
        this.queryByGraphic = () => {
            // const jimuMapView = this.jimuMapView
            // jimuMapView.selectFeaturesByGraphic(event.graphic, this.state.spatialRelationship).then(() => {
            //   this.setState({
            //     isQuerying: false
            //   })
            // })
        };
        this.getInfoByRecord = (records) => {
            let recordIds = {
                dsId: '',
                featureId: -1
            };
            const record = records[0]; // 0
            const idField = record.dataSource.belongToDataSource.getIdField();
            const featureId = record.feature.attributes[idField];
            recordIds = {
                dsId: record.dataSource.id,
                featureId: featureId
            };
            console.log('recordIds ', recordIds);
        };
        this.queryRecordsByInfo = (opts) => __awaiter(this, void 0, void 0, function* () {
            const ds = DataSourceManager.getInstance().getDataSource(opts.dsId);
            const query = {};
            query.objectIds = [opts.featureId];
            let records = [];
            const result = yield ds.query(query);
            if (utils.isDefined(result)) {
                records = result.records;
            }
            return records;
        });
        this._testQuery = () => __awaiter(this, void 0, void 0, function* () {
            const testOpts = {
                dsId: 'dataSource_3-15baa741740-layer-0',
                featureId: 14
            };
            const res = yield this.queryRecordsByInfo(testOpts);
            return res;
        });
        this.jimuMapView = options.jimuMapView;
        // this.sceneView = options.sceneView;
        // this.clearCacheMapState();
        // this.clearCacheHighlightGeo();
        // this.dsManager = DataSourceManager.getInstance();
    }
    destructor() {
        // this.clear();
        // this.restoreMapPopupHightlightState();
    }
}
//# sourceMappingURL=query-helper.js.map