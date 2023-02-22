/** @jsx jsx */
import { React, jsx, useIntl } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { WidgetPlaceholder } from 'jimu-ui';
import { DrawingTool } from '../config';
import { JimuDraw } from 'jimu-ui/advanced/map';
import { getStyles } from './style';
import defaultMessages from './translations/default';
import DrawIcon from '../../icon.svg';
function Widget(props) {
    var _a;
    const [currentJimuMapView, setCurrentJimuMapView] = React.useState(null);
    const handleActiveViewChange = (jimuMapView) => {
        setCurrentJimuMapView(jimuMapView);
    };
    // visibleElements
    const visibleElements = {};
    visibleElements.createTools = {
        point: props.config.drawingTools.includes(DrawingTool.Point),
        polyline: props.config.drawingTools.includes(DrawingTool.Polyline),
        polygon: props.config.drawingTools.includes(DrawingTool.Polygon),
        rectangle: props.config.drawingTools.includes(DrawingTool.Rectangle),
        circle: props.config.drawingTools.includes(DrawingTool.Circle)
    };
    // hide API setting icon for 10.1
    visibleElements.settingsMenu = false;
    const isShowPlaceHolderFlag = (!currentJimuMapView);
    const placeHolderTips = useIntl().formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel });
    // Renderer
    return jsx("div", { className: 'draw-widget-container h-100', css: getStyles() },
        isShowPlaceHolderFlag &&
            jsx("div", { className: 'w-100 h-100' },
                jsx(WidgetPlaceholder, { className: 'w-100 placeholder-wapper', icon: DrawIcon, widgetId: props.id, message: placeHolderTips })),
        !isShowPlaceHolderFlag &&
            jsx(JimuDraw, { jimuMapView: currentJimuMapView, isDisplayCanvasLayer: props.config.isDisplayCanvasLayer, 
                // api options
                drawingOptions: {
                    creationMode: props.config.drawMode,
                    visibleElements: visibleElements,
                    // snapping
                    //snappingOptions?: __esri.SnappingOptionsProperties
                    // defaults
                    updateOnGraphicClick: true,
                    // drawingEffect3D
                    drawingElevationMode3D: props.config.drawingElevationMode3D
                }, 
                // ui
                uiOptions: {
                    arrangement: props.config.arrangement
                }, 
                // measurements
                // eslint-disable-next-line
                measurementsInfo: props.config.measurementsInfo.asMutable(), measurementsUnitsInfos: props.config.measurementsUnitsInfos.asMutable() }),
        jsx(JimuMapViewComponent, { useMapWidgetId: (_a = props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: handleActiveViewChange }));
}
export default Widget;
//# sourceMappingURL=widget.js.map