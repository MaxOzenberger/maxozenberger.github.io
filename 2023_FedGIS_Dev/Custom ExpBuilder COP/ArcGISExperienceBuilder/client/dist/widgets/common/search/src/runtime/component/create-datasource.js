/** @jsx jsx */
import { jsx, DataSourceComponent, Immutable } from 'jimu-core';
const CreateDatasource = (props) => {
    const { datasourceConfig, id } = props;
    const renderDatasourceComponent = (configItem) => {
        const { configId } = configItem;
        const outputDataSourceId = configItem === null || configItem === void 0 ? void 0 : configItem.outputDataSourceId;
        const useDataSource = configItem === null || configItem === void 0 ? void 0 : configItem.useDataSource;
        const outputDatasource = {
            dataSourceId: outputDataSourceId,
            mainDataSourceId: outputDataSourceId
        };
        return (jsx("div", { key: `${configId}_con` },
            useDataSource && jsx(DataSourceComponent, { useDataSource: Immutable(useDataSource), query: null, key: `${configId}_useDataSource`, widgetId: id }),
            outputDataSourceId && jsx(DataSourceComponent, { useDataSource: Immutable(outputDatasource), query: null, key: `${configId}_outputDataSource`, widgetId: id })));
    };
    return (jsx("div", null, datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.map(configItem => {
        return renderDatasourceComponent(configItem);
    })));
};
export default CreateDatasource;
//# sourceMappingURL=create-datasource.js.map