/** @jsx jsx */
import { React } from 'jimu-core';
import ShadowCast from 'esri/widgets/ShadowCast';
import ShadowCastViewModel from 'esri/widgets/ShadowCast/ShadowCastViewModel';
export const useShadowCast = (props) => {
    const { onUpdated } = props;
    const widgetRef = React.useRef(null);
    //1
    const _updateWidget = React.useCallback((domRef) => {
        var _a, _b;
        widgetRef.current = new ShadowCast({
            //id: props.id,
            container: domRef,
            view: (_a = props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view,
            visibleElements: {
                timezone: props.shadowCastConfig.timezone,
                datePicker: props.shadowCastConfig.datePicker
            },
            viewModel: new ShadowCastViewModel({
                view: (_b = props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view,
                visualizationType: props.shadowCastConfig.visType
            })
        });
        widgetRef.current.when(() => {
            onUpdated();
        });
        return widgetRef.current;
    }, [props.jimuMapView, props.shadowCastConfig,
        onUpdated]);
    const _destoryWidget = React.useCallback(() => {
    }, []);
    // export interfaces
    return {
        // ref
        shadowCastRef: widgetRef.current,
        // update
        updateShadowCastWidget: _updateWidget,
        // remove
        destoryShadowCastWidget: _destoryWidget
    };
};
//# sourceMappingURL=shadowcast.js.map