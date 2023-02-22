/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { JimuMapViewComponent, loadArcGISJSAPIModules } from 'jimu-arcgis';
export function GeometryFromMap(props) {
    const { onGeometryChange, mapWidgetIds } = props;
    const [jimuMapView, setJimuMapView] = React.useState(null);
    const PolygonRef = React.useRef(null);
    React.useEffect(() => {
        if (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) {
            const handler = jimuMapView.view.watch('extent', (extent) => {
                if (PolygonRef.current) {
                    onGeometryChange(PolygonRef.current.fromExtent(extent));
                }
                else {
                    loadArcGISJSAPIModules(['esri/geometry/Polygon']).then(modules => {
                        PolygonRef.current = modules[0];
                        onGeometryChange(PolygonRef.current.fromExtent(extent));
                    });
                }
            });
            // set initial extent
            onGeometryChange(jimuMapView.view.extent);
            return () => {
                handler.remove();
            };
        }
    }, [jimuMapView, onGeometryChange]);
    const handleJimuMapViewChanged = React.useCallback((jimuMapView) => {
        setJimuMapView((jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) != null ? jimuMapView : null);
    }, []);
    return (jsx(React.Fragment, null, mapWidgetIds === null || mapWidgetIds === void 0 ? void 0 : mapWidgetIds.map((mapWidgetId, x) => (jsx(JimuMapViewComponent, { key: x, useMapWidgetId: mapWidgetId, onActiveViewChange: handleJimuMapViewChanged })))));
}
//# sourceMappingURL=geometry-from-map.js.map