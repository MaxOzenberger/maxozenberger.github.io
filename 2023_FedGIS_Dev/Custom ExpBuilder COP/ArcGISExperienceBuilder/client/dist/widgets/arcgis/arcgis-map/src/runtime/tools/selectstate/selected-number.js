import { React, ReactRedux, DataSourceManager } from 'jimu-core';
class _SelectedNumber extends React.PureComponent {
    componentDidMount() {
        this.computerSelectedGraphics();
    }
    componentDidUpdate() {
        this.computerSelectedGraphics();
    }
    computerSelectedGraphics() {
        if (this.props.onSelectedGraphicsChanged) {
            const jimuLayerViews = this.props.jimuMapView.jimuLayerViews;
            const jimuLayerViewIds = Object.keys(jimuLayerViews);
            const selectedGraphics = [];
            for (let i = 0; i < jimuLayerViewIds.length; i++) {
                const jimuLayerView = jimuLayerViews[jimuLayerViewIds[i]];
                const dsId = jimuLayerView.layerDataSourceId;
                const ds = DataSourceManager.getInstance().getDataSource(dsId);
                if (ds) {
                    const selectedRecords = ds.getSelectedRecords();
                    for (let j = 0; j < selectedRecords.length; j++) {
                        const tempFeature = selectedRecords[j].feature.clone();
                        selectedGraphics.push(tempFeature);
                    }
                }
            }
            this.props.onSelectedGraphicsChanged(selectedGraphics);
        }
    }
    render() {
        return null;
    }
}
const mapStateToProps = (state, ownProps) => {
    if (state.appStateInBuilder) {
        const dataSourcesInfo = state.appStateInBuilder && state.appStateInBuilder.dataSourcesInfo;
        const jimuMapViewsInfo = state.appStateInBuilder && state.appStateInBuilder.jimuMapViewsInfo;
        return {
            dataSourcesInfo: dataSourcesInfo,
            viewInfos: jimuMapViewsInfo
        };
    }
    else {
        const dataSourcesInfo = state && state.dataSourcesInfo;
        const jimuMapViewsInfo = state && state.jimuMapViewsInfo;
        return {
            dataSourcesInfo: dataSourcesInfo,
            viewInfos: jimuMapViewsInfo
        };
    }
};
export const SelectedNumber = ReactRedux.connect(mapStateToProps)(_SelectedNumber);
//# sourceMappingURL=selected-number.js.map