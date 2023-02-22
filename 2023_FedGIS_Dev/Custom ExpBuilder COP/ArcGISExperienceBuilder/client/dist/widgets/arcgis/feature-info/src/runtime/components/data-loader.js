var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, DataSourceComponent, DataSourceStatus, DataSourceTypes } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export class DataLoader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onDataSourceCreated = (dataSource) => {
            this.dataSource = dataSource;
            this.previousIndex = this.props.index;
            this.isFirstLoad = true;
            this.setState({
                dataSourceId: this.dataSource.id
            });
        };
        // onQueryStatusChange = (status: DataSourceStatus): void => {
        // }
        // eslint-disable-next-line
        this.onCreateDataSourceFailed = (error) => {
        };
        this.onDataSourceInfoChange = (info) => {
            var _a;
            if (!info) {
                return;
            }
            if (info.status === DataSourceStatus.NotReady) {
                this.props.onDataSourceStatusChanged(DataSourceStatus.NotReady, (_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.getLabel());
            }
            // handle filter change
            this.setState({
                dataSourceStatus: info.status,
                dataSourceWidgetQueries: info.widgetQueries,
                dataSourceVersion: info.version
            });
            // handle selection change
            const selectedId = info.selectedIds && info.selectedIds[0];
            if (selectedId) {
                this.previousSelectedId = selectedId;
                this.getDataIndexByObjectId(selectedId).then(index => {
                    if (index > -1 && index < this.dataBuffer.count) {
                        this.props.onSelectedRecordIdChanged(index, this.dataSource.id);
                    }
                });
            }
            else if (this.previousSelectedId) {
                this.previousSelectedId = null;
                this.props.onUnselectedRecordIdChanged(this.dataSource.id);
            }
        };
        this.state = {
            dataSourceId: null,
            dataSourceStatus: DataSourceStatus.Loaded,
            dataSourceVersion: undefined,
            dataSourceWidgetQueries: undefined
        };
        this.previousIndex = 0;
        this.previousData = {
            id: null,
            count: null,
            index: null,
            graphic: null,
            record: null,
            dataSourceVersion: undefined,
            dataSourceId: null
        };
        this.dataBuffer = {
            count: null,
            dataMap: {},
            pagingNum: 30
            // dataObjectIds: []
        };
        this.isFirstLoad = false;
        this.previousSelectedId = null;
    }
    componentDidMount() {
        // if(this.dataSource) {
        //  this.dataSource.startAutoRefresh();
        // }
    }
    componentDidUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            // const sqlExprObj = this.props.useDataSource && this.props.useDataSource.query;
            const sqlExprObj = null;
            if (this.props.useDataSource &&
                this.state.dataSourceId === this.props.useDataSource.dataSourceId &&
                this.state.dataSourceStatus === DataSourceStatus.Loaded) {
                let index;
                if (this.props.index === this.previousIndex) {
                    this.clearData();
                    // this.previousIndex = null;
                    // index = 0;
                    index = this.props.index;
                }
                else {
                    this.previousIndex = this.props.index;
                    index = this.props.index;
                }
                let currentData = this.getData(index);
                if (currentData) {
                    this.onDataChanged(this.dataSource, currentData);
                }
                else {
                    return yield this.dataSource.queryCount({}).then(result => {
                        const realCount = result.count;
                        if (index >= realCount) {
                            index = 0;
                        }
                        // const start = Math.floor(index / this.dataBuffer.pagingNum) * this.dataBuffer.pagingNum;
                        this.queryGraphics(this.dataSource, sqlExprObj, index, this.dataBuffer.pagingNum, realCount).then((results) => {
                            if (results.graphics.length === 0) {
                                currentData = null;
                            }
                            else {
                                this.addData(results, this.dataSource.id);
                                currentData = this.getData(results.index);
                            }
                            this.onDataChanged(this.dataSource, currentData);
                            this.isFirstLoad = false;
                        });
                    });
                }
            }
        });
    }
    onDataChanged(dataSource, currentData) {
        var _a, _b, _c, _d, _e, _f;
        if (!currentData) {
            this.props.onDataChanged(this.dataSource, currentData);
        }
        else if (((_a = this.previousData) === null || _a === void 0 ? void 0 : _a.dataSourceId) !== (currentData === null || currentData === void 0 ? void 0 : currentData.dataSourceId) ||
            ((_b = this.previousData) === null || _b === void 0 ? void 0 : _b.id) !== (currentData === null || currentData === void 0 ? void 0 : currentData.id) ||
            ((_c = this.previousData) === null || _c === void 0 ? void 0 : _c.count) !== (currentData === null || currentData === void 0 ? void 0 : currentData.count) ||
            ((_d = this.previousData) === null || _d === void 0 ? void 0 : _d.index) !== (currentData === null || currentData === void 0 ? void 0 : currentData.index) ||
            ((_e = this.previousData) === null || _e === void 0 ? void 0 : _e.dataSourceVersion) !== (currentData === null || currentData === void 0 ? void 0 : currentData.dataSourceVersion)) {
            // previousData is null.
            // previousData is not null.
            // currentData is not null.
            // previousData !== currentData
            this.props.onDataChanged(this.dataSource, currentData, this.isFirstLoad);
        }
        else {
            // previousData is not null.
            // currentData is not null.
            // previousData === currentData
            this.props.onDataSourceStatusChanged(DataSourceStatus.Loaded, (_f = this.dataSource) === null || _f === void 0 ? void 0 : _f.getLabel());
        }
        this.previousData = currentData;
    }
    addData(queryResult, dataSourceId) {
        queryResult.records.forEach((record, i) => {
            const index = queryResult.start + i;
            this.dataBuffer.dataMap[index] = {
                id: record.getId(),
                count: this.dataBuffer.count,
                index: index,
                graphic: queryResult.graphics[i],
                record: record,
                dataSourceId: dataSourceId,
                dataSourceVersion: this.state.dataSourceVersion
            };
        });
    }
    initData(count) {
        // const maxCount = this.props.limitGraphics ? this.props.maxGraphics : Infinity;
        // this.dataBuffer.count = count < maxCount ? count : maxCount;
        this.dataBuffer.count = count;
        // this.dataBuffer.dataObjectIds = objectIds;
    }
    getData(index) {
        return this.dataBuffer.dataMap[index];
    }
    // getDataIndexByObjectId(objectId) {
    //  let index = -1;
    //  this.dataBuffer.dataObjectIds.some((oId, i) => {
    //    if(oId.toString() === objectId.toString()) {
    //      index = i;
    //      return true;
    //    } else {
    //      return false;
    //    }
    //  });
    //  return index;
    // }
    getDataIndexByObjectId(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = -1;
            const dataEntries = Object.entries(this.dataBuffer.dataMap);
            dataEntries.some(entry => {
                var _a;
                if (objectId === ((_a = entry[1]) === null || _a === void 0 ? void 0 : _a.id)) {
                    index = Number(entry[0]);
                    return true;
                }
                else {
                    return false;
                }
            });
            if (index < 0 && this.dataSource) {
                const idField = this.dataSource.getIdField();
                return this.dataSource.queryCount({ where: `${idField}<=${objectId}` }).then(result => {
                    index = result.count - 1;
                    return index;
                });
            }
            else {
                return Promise.resolve(index);
            }
        });
    }
    clearData() {
        this.dataBuffer.count = null;
        this.dataBuffer.dataMap = {};
        // this.dataBuffer.dataObjectIds = [];
    }
    isEmptyData() {
        return this.dataBuffer.count === null;
    }
    getLayerObject(dataSource) {
        if (dataSource.layer) {
            return dataSource.layer.load().then(() => {
                return Promise.resolve(dataSource.layer);
            });
        }
        else {
            return dataSource.createJSAPILayerByDataSource().then((layerObject) => {
                return layerObject.load().then(() => {
                    return Promise.resolve(layerObject);
                });
            });
        }
    }
    queryGraphics(dataSource, sqlExprObj, indexParam, num, realCount) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let index = indexParam;
            let start;
            this.props.onDataSourceStatusChanged(DataSourceStatus.Loading, (_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.getLabel());
            let layerObject;
            return this.getLayerObject(dataSource).then((layer) => __awaiter(this, void 0, void 0, function* () {
                layerObject = layer;
                if (this.isEmptyData()) {
                    this.initData(realCount);
                }
                if (this.isFirstLoad) {
                    const selectedRecordId = dataSource.getSelectedRecordIds()[0];
                    if (selectedRecordId !== undefined) {
                        return yield this.getDataIndexByObjectId(selectedRecordId).then((_index) => {
                            index = (_index === -1) ? 0 : _index;
                        });
                    }
                }
            })).then(() => {
                start = Math.floor(index / this.dataBuffer.pagingNum) * this.dataBuffer.pagingNum;
                const query = {
                    // where: where,
                    outFields: ['*'],
                    returnGeometry: true,
                    // orderByFields: orderBy,
                    page: Math.floor(start / num) + 1,
                    pageSize: num
                    // resultOffset: start,
                    // resultRecordCount: num,
                    // start: start,
                    // num: num
                };
                return dataSource.query(query);
            }).then((queryResults) => {
                const records = queryResults.records;
                //if (dataSource.layer) {
                //  graphics = records.map(record => record.feature)
                //} else {
                //  graphics = records.map(record => {
                //    record.feature.sourceLayer = layerObject.associatedLayer || layerObject
                //    return record.feature
                //  })
                //}
                const graphics = records.map(record => {
                    record.feature.sourceLayer = layerObject.associatedLayer || layerObject;
                    record.feature.layer = layerObject.associatedLayer || layerObject;
                    return record.feature;
                });
                return {
                    index: index,
                    start: start,
                    num: num,
                    graphics: graphics,
                    records: records
                };
            }).catch((e) => {
                console.warn(e);
                return {
                    graphics: [],
                    records: []
                };
            });
        });
    }
    getOrderBy(dataSource, sqlExprObj) {
        const orderBy = [];
        let result;
        if (sqlExprObj && sqlExprObj.orderBy && sqlExprObj.orderBy.length > 0) {
            sqlExprObj.orderBy.forEach(sortData => {
                if (sortData.jimuFieldName) {
                    orderBy.push(`${sortData.jimuFieldName} ${sortData.order}`);
                }
            });
            if (dataSource.type === DataSourceTypes.FeatureLayer) {
                result = orderBy.join(',');
            }
            else {
                result = orderBy;
            }
        }
        return result;
    }
    getQueryParamsFromDataSource(dataSource) {
        return dataSource.getRealQueryParams({}, 'query');
    }
    loadGraphics(dataSource, sqlExprObj) {
        return __awaiter(this, void 0, void 0, function* () {
            this.props.onDataSourceStatusChanged(DataSourceStatus.Loading);
            return yield loadArcGISJSAPIModules([
                'esri/layers/FeatureLayer',
                'esri/rest/support/Query'
            ]).then(modules => {
                const [FeatureLayer, Query] = modules;
                const query = new Query();
                let featureLayer = dataSource.layer;
                const sqlExpr = sqlExprObj && sqlExprObj.where.sql;
                let num;
                query.where = sqlExpr || '1=1';
                // query.outSpatialReference = view.spatialReference;
                query.returnGeometry = false;
                query.outFields = ['*'];
                this.props.maxGraphics === 0 ? num = null : num = this.props.maxGraphics;
                query.num = this.props.limitGraphics ? num : null;
                if (!featureLayer && dataSource.url) {
                    featureLayer = new FeatureLayer({
                        url: dataSource.url
                    });
                }
                if (featureLayer) {
                    return featureLayer.queryFeatures(query).then((featureSet) => {
                        return featureSet.features;
                    });
                }
                else {
                    return [];
                }
            }).catch((e) => {
                console.warn(e);
                return [];
            });
        });
    }
    render() {
        return (React.createElement(DataSourceComponent, { useDataSource: this.props.useDataSource, query: {}, widgetId: this.props.widgetId, onDataSourceCreated: this.onDataSourceCreated, 
            // onQueryStatusChange={this.onQueryStatusChange}
            onDataSourceInfoChange: this.onDataSourceInfoChange, onCreateDataSourceFailed: this.onCreateDataSourceFailed })
        // <DataQueryComponent useDataSource={this.props.useDataSource}
        //  query={null}
        //  onDataSourceCreated={this.onDataSourceCreated}
        //  //onQueryStatusChange={this.onQueryStatusChange}
        //  onDataSourceInfoChange={this.onDataSourceInfoChange}
        //  onCreateDataSourceFailed={this.onCreateDataSourceFailed}/>
        );
    }
}
//# sourceMappingURL=data-loader.js.map