/** @jsx jsx */
import { React, jsx, appActions } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { hooks } from 'jimu-ui';
import { ArrangeStyles } from './components/arrange-styles';
import { PlaceHolder } from './components/place-holder';
const Widget = (props) => {
    var _a, _b;
    const useMapWidgetId = (_a = props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0];
    hooks.useEffectOnce(() => {
        const { layoutId, layoutItemId, id, dispatch } = props;
        dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', { layoutId, layoutItemId }));
    });
    const [activedJimuMapViewState, setActivedJimuMapViewState] = React.useState(null);
    const onActiveMapViewChange = React.useCallback(activeView => {
        var _a;
        if (((_a = activeView === null || activeView === void 0 ? void 0 : activeView.view) === null || _a === void 0 ? void 0 : _a.type) === '3d') {
            setActivedJimuMapViewState(activeView);
        }
        else {
            setActivedJimuMapViewState(null); //reset
        }
    }, []);
    const isShowPlaceHolderFlag = !useMapWidgetId || !(((_b = activedJimuMapViewState === null || activedJimuMapViewState === void 0 ? void 0 : activedJimuMapViewState.view) === null || _b === void 0 ? void 0 : _b.type) === '3d');
    return (jsx("div", { className: 'widget-3d-toolbox jimu-widget h-100' },
        isShowPlaceHolderFlag &&
            jsx(PlaceHolder, { widgetId: props.id, arrangement: props.config.arrangement }),
        !isShowPlaceHolderFlag && activedJimuMapViewState &&
            jsx(ArrangeStyles, { config: props.config, useMapWidgetId: useMapWidgetId, jimuMapView: activedJimuMapViewState }),
        useMapWidgetId &&
            jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetId, onActiveViewChange: onActiveMapViewChange })));
};
export default Widget;
//# sourceMappingURL=widget.js.map