import { ReactRedux } from 'jimu-core';
export function useDataSourceExists(props) {
    const { widgetId, useDataSourceId } = props;
    const exists = ReactRedux.useSelector((state) => {
        var _a;
        let appConfig;
        if (window.jimuConfig.isBuilder) {
            appConfig = state.appStateInBuilder.appConfig;
        }
        else {
            appConfig = state.appConfig;
        }
        const useDataSources = (_a = appConfig.widgets[widgetId].useDataSources) !== null && _a !== void 0 ? _a : [];
        return useDataSources.some(useDs => useDs.dataSourceId === useDataSourceId);
    });
    return exists;
}
//# sourceMappingURL=use-ds-exists.js.map