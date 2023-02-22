/** @jsx jsx */
import { React, jsx, DataSourceComponent } from 'jimu-core';
export default class FilterItemDataSource extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onDataSourceCreated = (ds) => {
            this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, ds);
        };
        this.onCreateDataSourceFailed = () => {
            this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, null);
        };
    }
    componentWillUnmount() {
    }
    render() {
        return (jsx(DataSourceComponent, { useDataSource: this.props.useDataSource, onDataSourceCreated: this.onDataSourceCreated, onCreateDataSourceFailed: this.onCreateDataSourceFailed }));
    }
}
//# sourceMappingURL=filter-item-ds.js.map