/** @jsx jsx */
import { React, jsx, moduleLoader } from 'jimu-core';
import { hooks, Checkbox } from 'jimu-ui';
import { JimuDrawCreationMode } from 'jimu-ui/advanced/map';
import { CreateToolType } from '../config';
import { EntityStatusType, StatusIndicator } from '../common/common-components';
import defaultMessage from './translations/default';
const sketchToolInfoMap = {
    [CreateToolType.Point]: { drawToolName: 'point', esriClassName: 'esri-icon-point', toolIndex: 0 },
    [CreateToolType.Polyline]: { drawToolName: 'polyline', esriClassName: 'esri-icon-polyline', toolIndex: 4 },
    [CreateToolType.Polygon]: { drawToolName: 'polygon', esriClassName: 'esri-icon-polygon', toolIndex: 2 },
    [CreateToolType.Rectangle]: {
        drawToolName: 'rectangle',
        esriClassName: 'esri-icon-checkbox-unchecked',
        toolIndex: 1
    },
    [CreateToolType.Circle]: { drawToolName: 'circle', esriClassName: 'esri-icon-radio-unchecked', toolIndex: 3 }
};
export function InteractiveDraw(props) {
    const { toolTypes = [], jimuMapView, onDrawEnd } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessage);
    const [mapModule, setMapModule] = React.useState(null);
    const getLayerFunRef = React.useRef(null);
    const graphicRef = React.useRef(null);
    const [clearAfterApply, setClearAfterApply] = React.useState(false);
    const visibleElements = React.useMemo(() => {
        return {
            createTools: Object.entries(sketchToolInfoMap).reduce((result, [key, value]) => (Object.assign(Object.assign({}, result), { [value.drawToolName]: toolTypes.includes(key) })), { point: false }),
            selectionTools: {
                'lasso-selection': false,
                'rectangle-selection': false
            },
            settingsMenu: false,
            undoRedoMenu: false
        };
    }, [toolTypes]);
    hooks.useEffectOnce(() => {
        moduleLoader.loadModule('jimu-ui/advanced/map').then((result) => {
            setMapModule(result);
        });
    });
    const handleDrawToolCreated = React.useCallback((jimuDrawToolsRef) => {
        getLayerFunRef.current = jimuDrawToolsRef.getGraphicsLayer;
    }, []);
    const handleDrawStart = React.useCallback(() => {
        getLayerFunRef.current && (getLayerFunRef.current)().removeAll();
    }, []);
    const handleDrawEnd = React.useCallback((graphic) => {
        graphicRef.current = graphic;
        onDrawEnd(graphic, getLayerFunRef.current, clearAfterApply);
    }, [onDrawEnd, clearAfterApply]);
    const handleCleared = React.useCallback(() => {
        graphicRef.current = null;
        onDrawEnd(null);
    }, [onDrawEnd]);
    const handleClearSettingChange = React.useCallback((e) => {
        if (graphicRef.current) {
            onDrawEnd(graphicRef.current, getLayerFunRef.current, e.target.checked);
        }
        setClearAfterApply(e.target.checked);
    }, [onDrawEnd]);
    const JimuDraw = mapModule === null || mapModule === void 0 ? void 0 : mapModule.JimuDraw;
    if (!JimuDraw) {
        return jsx(StatusIndicator, { statusType: EntityStatusType.Loading });
    }
    const isAvailbel = Object.keys(visibleElements.createTools).some(toolName => visibleElements.createTools[toolName]);
    if (!isAvailbel) {
        return null;
    }
    return (jsx("div", null,
        jsx(JimuDraw, { jimuMapView: jimuMapView, disableSymbolSelector: true, drawingOptions: {
                creationMode: JimuDrawCreationMode.Single,
                updateOnGraphicClick: false,
                visibleElements: visibleElements
            }, uiOptions: {
                isHideBorder: true
            }, onJimuDrawCreated: handleDrawToolCreated, onDrawingStarted: handleDrawStart, onDrawingFinished: handleDrawEnd, onDrawingCleared: handleCleared }),
        jsx("label", { className: 'd-flex align-items-center' },
            jsx(Checkbox, { checked: clearAfterApply, onChange: handleClearSettingChange, className: 'mr-2' }),
            getI18nMessage('clearDrawing'))));
}
//# sourceMappingURL=interactive-draw-tool.js.map