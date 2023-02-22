import { React } from 'jimu-core';
import OriginDataSourceManager from './original';
import OutputSourceManager from './output';
const FeatureLayerDataSourceManager = (props) => {
    const { widgetId, useDataSource, outputDataSourceId } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement(OriginDataSourceManager, { widgetId: widgetId, useDataSource: useDataSource }),
        React.createElement(OutputSourceManager, { widgetId: widgetId, dataSourceId: outputDataSourceId })));
};
export default FeatureLayerDataSourceManager;
//# sourceMappingURL=feature-layer.js.map