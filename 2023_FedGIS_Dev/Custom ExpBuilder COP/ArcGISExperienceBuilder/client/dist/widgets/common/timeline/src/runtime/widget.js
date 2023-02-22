/** @jsx jsx */
import { React, jsx, ReactResizeDetector, MultipleDataSourceComponent, DataSourceStatus, DataSourceManager, Immutable, DataSourceTypes, AllDataSourceTypes } from 'jimu-core';
import { loadArcGISJSAPIModules, MapViewManager } from 'jimu-arcgis';
import { Alert, hooks, WidgetPlaceholder } from 'jimu-ui';
import { TimeDisplayStrategy } from '../config';
import TimeLine from './components/timeline';
import { getCalculatedTimeSettings, getInsideLayersFromWebmap, getTimeSettingsFromHonoredWebMap } from '../utils/utils';
import defaultMessages from './translations/default';
const widgetIcon = require('../../icon.svg');
const Widget = (props) => {
    var _a, _b, _c, _d;
    const { useDataSources, theme, id, config, intl } = props;
    const { enablePlayControl, speed: _speed, autoPlay, timeSettings, honorTimeSettings, dataSourceType, timeStyle, foregroundColor, backgroundColor, sliderColor } = config;
    const [timeExtent, setTimeExtent] = React.useState(null);
    const [applied, setApplied] = React.useState(true);
    const [speed, setSpeed] = React.useState(_speed);
    // Used to store all layer useDss from widget dataSources
    const [layerUseDss, setLayerUseDss] = React.useState(null);
    const [watchUtils, setWatchUtils] = React.useState(null);
    const [dataSources, setDataSources] = React.useState(null);
    const [isDsUpdating, setDsUpdating] = React.useState(true);
    const [isDsLoading, setDsLoading] = React.useState(true);
    const [width, setWidth] = React.useState(null);
    const [timeSettingsForRuntime, setDataSourcesForRuntime] = React.useState(null);
    const widgetRef = React.useRef(null);
    const mvManager = React.useMemo(() => MapViewManager.getInstance(), []);
    const dsManager = React.useMemo(() => DataSourceManager.getInstance(), []);
    React.useEffect(() => {
        var _a;
        setWidth((_a = widgetRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth);
        loadArcGISJSAPIModules([
            'esri/core/watchUtils'
        ]).then(modules => {
            setWatchUtils(modules[0]);
        });
        return () => {
            onTimeChanged(null, null, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        setDataSources(null);
        if (dataSourceType !== DataSourceTypes.FeatureLayer) {
            let _layerUseDss = null;
            if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0) {
                _layerUseDss = [];
                const promises = [];
                useDataSources.forEach(useDs => {
                    promises.push(dsManager.createDataSourceByUseDataSource(Immutable(useDs)));
                });
                Promise.all(promises).then(dataSources => {
                    const _dataSources = {};
                    dataSources.forEach(ds => {
                        _dataSources[ds.id] = ds;
                    });
                    dataSources.forEach(ds => {
                        ds.getAllChildDataSources().forEach(layerDs => {
                            var _a, _b;
                            if (layerDs.type === DataSourceTypes.FeatureLayer && layerDs.supportTime()) {
                                _layerUseDss.push({
                                    dataSourceId: layerDs.id,
                                    mainDataSourceId: (_a = layerDs.getMainDataSource()) === null || _a === void 0 ? void 0 : _a.id,
                                    dataViewId: layerDs.dataViewId,
                                    rootDataSourceId: (_b = layerDs.getRootDataSource()) === null || _b === void 0 ? void 0 : _b.id
                                });
                            }
                        });
                    });
                    setDataSources(_dataSources);
                    setLayerUseDss(Immutable(_layerUseDss));
                }).catch(err => { });
            }
        }
        else {
            setLayerUseDss(useDataSources);
        }
    }, [useDataSources, dsManager, dataSourceType, setLayerUseDss, setDataSources]);
    React.useEffect(() => {
        if (dataSources && watchUtils) {
            if (honorTimeSettings) {
                const { settings, speed } = getTimeSettingsFromHonoredWebMap(dataSources, true);
                setSpeed(speed);
                setDataSourcesForRuntime(settings);
            }
            else {
                const _timeSettings = getCalculatedTimeSettings(timeSettings, dataSources, true);
                setSpeed(_speed);
                setDataSourcesForRuntime(_timeSettings);
            }
        }
    }, [dataSources, watchUtils, honorTimeSettings, _speed, timeSettings]);
    /** Call it when timeline plays for each extent since mapViewIds could be updated.
     *  1. Map widgets are created or rendered after timeline is ready. (Runtime & Builder)
     *  2. Selected webMap, or WebMap including selected mapServices or layers are used/removed by map widgets. (Builder)
     */
    const watchDsUpdating = () => {
        let layerIds = [];
        let mapDs = null;
        const allMapViewIds = mvManager.getAllJimuMapViewIds();
        if (dataSourceType === AllDataSourceTypes.WebMap) {
            mapDs = dataSources[Object.keys(dataSources)[0]];
            layerIds = mapDs.getAllChildDataSources().map(layerDs => layerDs.id);
        }
        else { // MapService, Feature layers
            layerIds = Object.keys(dataSources);
        }
        const requests = [];
        layerIds.forEach(layerId => {
            const rootDs = mapDs || dataSources[layerId].getRootDataSource();
            if ((rootDs === null || rootDs === void 0 ? void 0 : rootDs.type) === AllDataSourceTypes.WebMap) {
                const mapViewIds = allMapViewIds.filter(id => mvManager.getJimuMapViewById(id).dataSourceId === rootDs.id);
                mapViewIds.forEach(mapViewId => {
                    const mapView = mvManager.getJimuMapViewById(mapViewId);
                    const layerView = getLayerViewByLayerId(mapView, layerId);
                    (layerView === null || layerView === void 0 ? void 0 : layerView.view) && requests.push(watchUtils.whenFalseOnce(layerView.view, 'updating'));
                });
            }
        });
        Promise.all(requests).then((result) => {
            setDsUpdating(false);
        });
    };
    const getLayerViewByLayerId = (mapView, layerId) => {
        let layerView = null;
        Object.keys(mapView.jimuLayerViews).forEach(vid => {
            if (mapView.jimuLayerViews[vid].layerDataSourceId === layerId) {
                layerView = mapView.jimuLayerViews[vid];
            }
        });
        return layerView;
    };
    const onTimeChanged = hooks.useEventCallback((startTime, endTime, unmount = false) => {
        var _a;
        if (!dataSources) {
            return;
        }
        const queryParams = { time: unmount ? null : [startTime, endTime] };
        if (!unmount) {
            watchDsUpdating();
        }
        if (dataSourceType === AllDataSourceTypes.WebMap) {
            const layers = getInsideLayersFromWebmap(dataSources, (_a = config.timeSettings) === null || _a === void 0 ? void 0 : _a.layerList);
            Object.keys(layers).forEach(lyId => {
                updateLayerQueryParams(layers[lyId], queryParams, id);
            });
        }
        else {
            Object.keys(dataSources).forEach(dsId => {
                updateLayerQueryParams(dataSources[dsId], queryParams, id);
            });
        }
    });
    React.useEffect(() => {
        if (timeExtent) {
            onTimeChanged(timeExtent[0], timeExtent[1], !applied);
        }
    }, [timeExtent, applied, onTimeChanged]);
    const updateLayerQueryParams = (layerDs, queryParams, id) => {
        var _a, _b, _c, _d;
        if (layerDs.type === DataSourceTypes.MapService) {
            layerDs = layerDs;
            if ((_a = layerDs.supportTime) === null || _a === void 0 ? void 0 : _a.call(layerDs)) {
                queryParams = getTimeOffsetedQueryParams(layerDs, queryParams);
                (_b = layerDs.changeTimeExtent) === null || _b === void 0 ? void 0 : _b.call(layerDs, queryParams.time, id);
            }
        }
        else if (layerDs.type === DataSourceTypes.FeatureLayer) {
            layerDs = layerDs;
            if ((_c = layerDs.supportTime) === null || _c === void 0 ? void 0 : _c.call(layerDs)) {
                queryParams = getTimeOffsetedQueryParams(layerDs, queryParams);
                (_d = layerDs.updateQueryParams) === null || _d === void 0 ? void 0 : _d.call(layerDs, queryParams, id);
            }
        }
    };
    const getTimeOffsetedQueryParams = (layerDs, queryParams) => {
        const exportOptions = layerDs.getTimeInfo().exportOptions || {};
        const { TimeOffset: offset = 0, timeOffsetUnits } = exportOptions;
        if ((queryParams === null || queryParams === void 0 ? void 0 : queryParams.time) && offset !== 0) {
            let startTime = queryParams.time[0];
            let endTime = queryParams.time[1];
            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            switch (timeOffsetUnits) {
                case 'esriTimeUnitsCenturies':
                case 'esriTimeUnitsDecades':
                case 'esriTimeUnitsYears':
                    const offsetedYear = timeOffsetUnits === 'esriTimeUnitsCenturies' ? 100 : timeOffsetUnits === 'esriTimeUnitsDecades' ? 10 : 1;
                    startTime = startDate.setFullYear(startDate.getFullYear() - offset * offsetedYear);
                    endTime = endDate.setFullYear(endDate.getFullYear() - offset * offsetedYear);
                    break;
                case 'esriTimeUnitsMonths':
                    startTime = startDate.setMonth(startDate.getMonth() - offset);
                    endTime = endDate.setMonth(endDate.getMonth() - offset);
                    break;
                case 'esriTimeUnitsWeeks':
                case 'esriTimeUnitsDays':
                    const offsetedDay = timeOffsetUnits === 'esriTimeUnitsWeeks' ? 7 : 1;
                    startTime = startDate.setDate(startDate.getDate() - offset * offsetedDay);
                    endTime = endDate.setDate(endDate.getDate() - offset * offsetedDay);
                    break;
                case 'esriTimeUnitsHours':
                    startTime = startDate.setHours(startDate.getHours() - offset);
                    endTime = endDate.setHours(endDate.getHours() - offset);
                    break;
                case 'esriTimeUnitsMinutes':
                    startTime = startDate.setMinutes(startDate.getMinutes() - offset);
                    endTime = endDate.setMinutes(endDate.getMinutes() - offset);
                    break;
                case 'esriTimeUnitsSeconds':
                    startTime = startDate.setSeconds(startDate.getSeconds() - offset);
                    endTime = endDate.setSeconds(endDate.getSeconds() - offset);
                    break;
                case 'esriTimeUnitsMilliseconds':
                    startTime = startDate.setMilliseconds(startDate.getMilliseconds() - offset);
                    endTime = endDate.setMilliseconds(endDate.getMilliseconds() - offset);
                    break;
                default:
                    break;
            }
            queryParams.time = [startTime, endTime];
        }
        return queryParams;
    };
    const onResize = (width) => {
        setWidth(width);
    };
    if (!useDataSources || useDataSources.length === 0) {
        return jsx(WidgetPlaceholder, { icon: widgetIcon, widgetId: id, message: intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }) });
    }
    else if ((dataSources && watchUtils && timeSettingsForRuntime === null) || ((_a = timeSettingsForRuntime === null || timeSettingsForRuntime === void 0 ? void 0 : timeSettingsForRuntime.startTime) === null || _a === void 0 ? void 0 : _a.value) > ((_b = timeSettingsForRuntime === null || timeSettingsForRuntime === void 0 ? void 0 : timeSettingsForRuntime.endTime) === null || _b === void 0 ? void 0 : _b.value)) {
        const noTlFromHonoredMap = intl.formatMessage({ id: 'noTlFromHonoredMapWarning', defaultMessage: defaultMessages.noTlFromHonoredMapWarning });
        const dateExtentError = intl.formatMessage({ id: 'invalidTimeSpanWarning', defaultMessage: defaultMessages.invalidTimeSpanWarning });
        return jsx("div", { className: 'placeholder-container w-100 h-100 position-relative' },
            jsx(WidgetPlaceholder, { icon: widgetIcon, widgetId: id, message: intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel }) }),
            jsx(Alert, { buttonType: 'tertiary', form: 'tooltip', size: 'small', type: 'warning', withIcon: true, className: 'position-absolute', style: { bottom: 10, right: 10, backgroundColor: 'var(--warning-100)', border: '1px solid var(--warning-300)' }, text: timeSettingsForRuntime === null ? noTlFromHonoredMap : dateExtentError }));
    }
    else {
        return (jsx("div", { className: 'timeline-widget', ref: el => (widgetRef.current = el) },
            jsx(ReactResizeDetector, { handleWidth: true, onResize: onResize }),
            (layerUseDss === null || layerUseDss === void 0 ? void 0 : layerUseDss.length) > 0 && jsx(MultipleDataSourceComponent, { useDataSources: layerUseDss }, (dss, infos) => {
                // set ds
                if (dataSourceType === DataSourceTypes.FeatureLayer) {
                    const isCreated = Object.keys(infos).filter(dsId => { var _a; return [DataSourceStatus.Created, DataSourceStatus.CreateError].includes((_a = infos[dsId]) === null || _a === void 0 ? void 0 : _a.instanceStatus); }).length === useDataSources.length;
                    if (!dataSources && isCreated && Object.keys(dss).length === useDataSources.length) {
                        setTimeout(() => {
                            setDataSources(dss);
                        }, 0);
                    }
                }
                // set loading
                const isDsNotLoading = Object.keys(infos).filter(dsId => infos[dsId] && infos[dsId].status !== DataSourceStatus.Loading).length === Object.keys(infos).length;
                setTimeout(() => {
                    setDsLoading(!isDsNotLoading);
                }, 0);
            }),
            dataSources && timeSettingsForRuntime && width && jsx(TimeLine, { theme: theme, width: width, updating: isDsLoading || isDsUpdating, startTime: (_c = timeSettingsForRuntime.startTime) === null || _c === void 0 ? void 0 : _c.value, endTime: (_d = timeSettingsForRuntime.endTime) === null || _d === void 0 ? void 0 : _d.value, accuracy: timeSettingsForRuntime.accuracy, stepLength: timeSettingsForRuntime.stepLength, dividedCount: timeSettingsForRuntime.dividedCount, cumulatively: timeSettingsForRuntime.timeDisplayStrategy === TimeDisplayStrategy.cumulatively, timeStyle: timeStyle, foregroundColor: foregroundColor, backgroundColor: backgroundColor, sliderColor: sliderColor, enablePlayControl: enablePlayControl, speed: speed, autoPlay: autoPlay, applied: applied, onTimeChanged: (sTime, eTime) => setTimeExtent([sTime, eTime]), onApplyStateChanged: applied => setApplied(applied) })));
    }
};
export default Widget;
//# sourceMappingURL=widget.js.map