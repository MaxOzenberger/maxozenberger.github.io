/** @jsx jsx */
import { jsx, css, getAppStore, dateUtils } from 'jimu-core';
import { Button, Tooltip } from 'jimu-ui';
import React from 'react';
import InputRange from './input-range';
import { DataLayerOutlined } from 'jimu-icons/outlined/gis/data-layer';
import { StartEndFilled } from 'jimu-icons/filled/application/start-end';
import { getLineInfo } from './utils';
import { getTimeSpanStyles } from './style';
import { DATE_PATTERN, TIME_PATTERN } from '../../utils/utils';
/**
 * Time span componennt: it includes layers and time-range.
 * @param props
 * @returns
 */
const TimeSpan = function (props) {
    const { startTime, endTime, theme, intl, overalExtentLabel, width = 188, dataSources, onChange } = props;
    const [layersInfo, setLayersInfo] = React.useState(null);
    const [layersExtent, setLayersExtent] = React.useState(null);
    const [wholeExtent, setWholeExtent] = React.useState(null);
    const isRTL = getAppStore().getState().appContext.isRTL;
    React.useEffect(() => {
        if (layersExtent) {
            refreshWholeExtent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, endTime]);
    React.useEffect(() => {
        initLayers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSources]); // For layers from webMap
    /**
     * Init layersInfo and layers' extent.
     * layers' extent: from the whole extent from layers' timeInfo or features' attribute
     */
    const initLayers = () => {
        let min = null;
        let max = null;
        const layers = [];
        Object.keys(dataSources).forEach(dsId => {
            var _a, _b;
            const ds = dataSources[dsId];
            const dsInfo = ds.getTimeInfo();
            const start = (_a = dsInfo === null || dsInfo === void 0 ? void 0 : dsInfo.timeExtent) === null || _a === void 0 ? void 0 : _a[0];
            const end = (_b = dsInfo === null || dsInfo === void 0 ? void 0 : dsInfo.timeExtent) === null || _b === void 0 ? void 0 : _b[1];
            // TODO: query features if no timeExtent.
            layers.push({
                label: ds.getLabel(),
                extent: [start, end],
                extentLabels: [
                    dateUtils.formatDateLocally(start, intl, DATE_PATTERN, TIME_PATTERN),
                    dateUtils.formatDateLocally(end, intl, DATE_PATTERN, TIME_PATTERN)
                ]
            });
            min = min ? Math.min(min, start) : start;
            max = max ? Math.max(max, end) : end;
        });
        setLayersInfo(layers);
        setLayersExtent([min, max]);
        refreshWholeExtent(min, max);
    };
    // use min of all layer's extent and selected extent as final extent.
    const refreshWholeExtent = (startLayersExtent = layersExtent[0], endLayersExtent = layersExtent[1]) => {
        const min = startTime ? Math.min(startTime, startLayersExtent) : startLayersExtent;
        const max = endTime ? Math.max(endTime, endLayersExtent) : endLayersExtent;
        setWholeExtent([min, max]);
    };
    const inputRangeChanged = (start, end) => {
        onChange(start, end);
    };
    const getLayerLinesHeight = () => {
        const layerLength = Object.keys(dataSources).length + 1;
        return 20 * layerLength;
    };
    return (jsx("div", { className: 'time-span w-100', dir: 'ltr', css: getTimeSpanStyles(theme) },
        jsx("div", { className: 'layer-lines', css: css `
          height: ${getLayerLinesHeight()};
        ` }, layersInfo === null || layersInfo === void 0 ? void 0 :
            layersInfo.map((layer, index) => {
                const lineInfo = getLineInfo(width, wholeExtent, layer.extent[0], layer.extent[1]);
                return jsx("div", { className: 'd-flex align-items-center layer-line-container', key: 'layerline-' + index },
                    jsx(Tooltip, { placement: 'bottom', title: jsx("div", { className: 'p-2' },
                            jsx("div", null, layer.label),
                            jsx("div", null, `${layer.extentLabels[0]}-${layer.extentLabels[1]}`)) },
                        jsx(Button, { icon: true, size: 'sm', type: 'tertiary', className: 'layer-icon p-0 border-0' },
                            jsx(DataLayerOutlined, { size: 12 }))),
                    jsx("div", { className: 'layer-line', css: css `
                  margin-left: ${isRTL ? 'unset' : lineInfo.marginLeft};
                  margin-right: ${isRTL ? lineInfo.marginLeft : 'unset'};
                  width: ${lineInfo.width};
                ` }));
            }),
            jsx("div", { className: 'd-flex align-items-center layer-line-container' },
                jsx(Tooltip, { placement: 'bottom', title: overalExtentLabel },
                    jsx(Button, { icon: true, size: 'sm', type: 'tertiary', className: 'layer-icon p-0' },
                        jsx(StartEndFilled, { size: 12 }))),
                wholeExtent && jsx(InputRange, { theme: theme, width: width, isRTL: isRTL, intl: intl, shadowHeight: layersInfo.length * 20 + 10, startValue: startTime !== null && startTime !== void 0 ? startTime : wholeExtent[0], endValue: endTime !== null && endTime !== void 0 ? endTime : wholeExtent[1], extent: wholeExtent, onChange: inputRangeChanged })))));
};
export default TimeSpan;
//# sourceMappingURL=time-span.js.map