/** @jsx jsx */
import { React, jsx, DataSourceComponent, DataSourceStatus } from 'jimu-core';
export default class EditItemDataSource extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onDataSourceCreated = (ds) => {
            this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId, ds);
        };
        this.onDataSourceInfoChange = (info, preInfo) => {
            this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId, info === null || info === void 0 ? void 0 : info.status);
            const preSelectedIds = preInfo === null || preInfo === void 0 ? void 0 : preInfo.selectedIds;
            const newSelectedIds = info === null || info === void 0 ? void 0 : info.selectedIds;
            const selectedChange = preSelectedIds !== newSelectedIds && ((preSelectedIds === null || preSelectedIds === void 0 ? void 0 : preSelectedIds.length) !== 0 || (newSelectedIds === null || newSelectedIds === void 0 ? void 0 : newSelectedIds.length) !== 0);
            const preGdbVersion = preInfo === null || preInfo === void 0 ? void 0 : preInfo.gdbVersion;
            const newGdbVersion = info === null || info === void 0 ? void 0 : info.gdbVersion;
            if (selectedChange) {
                this.props.onDataSourceSelectedChange(this.props.useDataSource.dataSourceId, newSelectedIds);
            }
            if (preGdbVersion !== newGdbVersion) {
                this.props.onDataSourceVersionChange(this.props.useDataSource.dataSourceId);
            }
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
//# sourceMappingURL=edit-item-ds.js.map