/** @jsx jsx */
import { React, jsx, DataSourceComponent, DataSourceStatus } from 'jimu-core';
export default class FilterItemDataSource extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onDataSourceCreated = (ds) => {
            this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, ds);
        };
        this.onDataSourceInfoChange = (info) => {
            this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId, info === null || info === void 0 ? void 0 : info.status);
        };
        this.onCreateDataSourceFailed = () => {
            this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, null);
        };
    }
    componentWillUnmount() {
        this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, null);
        this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId, DataSourceStatus.NotReady);
    }
    render() {
        const { useDataSource } = this.props;
        return (jsx(DataSourceComponent, { useDataSource: useDataSource, onDataSourceCreated: this.onDataSourceCreated, onCreateDataSourceFailed: this.onCreateDataSourceFailed, onDataSourceInfoChange: this.onDataSourceInfoChange }));
    }
}
//# sourceMappingURL=filter-item-ds.js.map