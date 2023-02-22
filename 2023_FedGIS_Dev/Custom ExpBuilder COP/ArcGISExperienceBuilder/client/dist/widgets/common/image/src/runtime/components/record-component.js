import { Immutable, React, MultipleDataSourceComponent, withRepeatedDataSource, CONSTANTS, DataSourceManager } from 'jimu-core';
class _RecordComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.dataSources = null;
        this.__unmount = false;
        this.updateRecord = () => {
            const record = this.getSingleRecord();
            if (this.props.onRecordChange) {
                this.props.onRecordChange(record);
            }
        };
        this.shallowEquals = (obj1, obj2) => {
            if (!obj1 && !obj2) {
                return true;
            }
            else if (obj1 && obj2) {
                if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                    return false;
                }
                else {
                    return !Object.keys(obj1).some(key => obj1[key] !== obj2[key]);
                }
            }
            else {
                return false;
            }
        };
        this.getSingleRecord = () => {
            var _a, _b;
            if (this.props.isSelectedFromRepeatedDataSourceContext) {
                const repeatedDataSource = this.props.repeatedDataSource;
                const record = Array.isArray(repeatedDataSource)
                    ? (_a = (repeatedDataSource)[0]) === null || _a === void 0 ? void 0 : _a.record
                    : (_b = (repeatedDataSource)) === null || _b === void 0 ? void 0 : _b.record;
                return record;
            }
            else {
                if (!this.props.useDataSources || this.props.useDataSources.length === 0) {
                    return null;
                }
                const dsId = this.props.useDataSources[0].dataSourceId;
                const isSelectionDataView = dsId.split('-').reverse()[0] === CONSTANTS.SELECTION_DATA_VIEW_ID;
                if (isSelectionDataView) {
                    const ds = DataSourceManager.getInstance().getDataSource(dsId);
                    let record = ds === null || ds === void 0 ? void 0 : ds.getRecords()[0];
                    if (!record) {
                        const dataViewForNoSelection = ds === null || ds === void 0 ? void 0 : ds.getMainDataSource().getDataView(CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION);
                        record = dataViewForNoSelection === null || dataViewForNoSelection === void 0 ? void 0 : dataViewForNoSelection.getRecords()[0];
                    }
                    return record;
                }
                else {
                    const ds = DataSourceManager.getInstance().getDataSource(dsId);
                    const record = ds === null || ds === void 0 ? void 0 : ds.getRecords()[0];
                    return record;
                }
            }
        };
        this.onDataSourceCreated = (dss) => {
            this.dataSources = dss;
            if (dss) {
                const infos = {};
                Object.keys(dss).forEach(dsId => {
                    if (dsId && dss[dsId]) {
                        infos[dsId] = dss[dsId].getInfo();
                    }
                });
                this.setState({ infos });
            }
        };
        this.onDataSourceInfoChange = (infos) => {
            this.setState({ infos });
        };
        this.addDataViewForNoSelection = (useDataSources) => {
            let selectionDataViews = Immutable([]);
            if (!useDataSources) {
                return selectionDataViews;
            }
            useDataSources.forEach(u => {
                if (u.mainDataSourceId && !selectionDataViews.some(s => s.mainDataSourceId === u.mainDataSourceId)) {
                    const mainDataSource = DataSourceManager.getInstance().getDataSource(u.mainDataSourceId);
                    const mainDataSourceJson = mainDataSource && mainDataSource.getDataSourceJson();
                    const dataViewForNoSelection = (mainDataSourceJson === null || mainDataSourceJson === void 0 ? void 0 : mainDataSourceJson.dataViews) && (mainDataSourceJson === null || mainDataSourceJson === void 0 ? void 0 : mainDataSourceJson.dataViews[CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION]);
                    if (dataViewForNoSelection) {
                        selectionDataViews = selectionDataViews.concat(u.set('dataSourceId', DataSourceManager.getInstance().getDataViewDataSourceId(u.mainDataSourceId, CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION))
                            .set('dataViewId', CONSTANTS.DATA_VIEW_ID_FOR_NO_SELECTION));
                    }
                }
            });
            return selectionDataViews.concat(useDataSources);
        };
        this.getQueries = (useDataSources) => {
            const queries = {};
            if (!useDataSources) {
                return queries;
            }
            useDataSources.forEach(u => {
                // set empty query to load data
                queries[u.dataSourceId] = {};
            });
            return queries;
        };
        this.state = {
            infos: null
        };
    }
    componentDidMount() {
        this.__unmount = false;
        this.updateRecord();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.isSelectedFromRepeatedDataSourceContext) {
            if ((this.props.repeatedDataSource !== prevProps.repeatedDataSource) || (this.props.isSelectedFromRepeatedDataSourceContext !== prevProps.isSelectedFromRepeatedDataSourceContext)) {
                this.updateRecord();
            }
        }
        else {
            if (this.props.useDataSources !== prevProps.useDataSources || !this.shallowEquals(this.state.infos, prevState.infos)) {
                this.updateRecord();
            }
        }
    }
    render() {
        const useDataSources = this.addDataViewForNoSelection(this.props.useDataSources);
        return (React.createElement(MultipleDataSourceComponent, { useDataSources: useDataSources, onDataSourceCreated: this.onDataSourceCreated, onDataSourceInfoChange: this.onDataSourceInfoChange, queries: this.getQueries(useDataSources), widgetId: this.props.widgetId }));
    }
}
export const RecordComponent = withRepeatedDataSource(_RecordComponent);
//# sourceMappingURL=record-component.js.map