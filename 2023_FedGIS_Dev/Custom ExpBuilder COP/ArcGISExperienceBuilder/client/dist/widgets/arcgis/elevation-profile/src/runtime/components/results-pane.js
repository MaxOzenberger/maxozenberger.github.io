/** @jsx jsx */
import { React, jsx, classNames, Immutable } from 'jimu-core';
import { Button, Icon, Popper, Select, Option, MultiSelect, Alert, Label, Checkbox, LoadingType, Loading, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { ButtonTriggerType } from '../../config';
import defaultMessages from '../translations/default';
import { getContainerStyle, geSettingsOptionsStyle, getChartStyle } from '../lib/style';
import { getRuntimeIcon, unitOptions } from '../constants';
import { getAllLayersFromDataSource, defaultSelectedUnits } from '../../common/utils';
import ProfileChart from './profile-chart';
import ProfileStatistics from './chart-statistics';
const { epIcon } = getRuntimeIcon();
export default class ResultPane extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c;
        super(props);
        this.selectableLayers = [];
        this.alertElement = React.createRef();
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.componentDidMount = () => {
            this.getSelectableLayers(this.props.activeDataSource);
            if (this.props.selectMode || this.props.drawMode) {
                setTimeout(() => {
                    var _a, _b;
                    (_b = (_a = this.alertElement) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
                }, 100);
            }
        };
        this.componentDidUpdate = (prevProps) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            const selectedUnit = defaultSelectedUnits(this.props.activeDatasourceConfig, this.props.portalSelf);
            if (prevProps.commonDsGeneralSettings.showLegend !== ((_a = this.props.commonDsGeneralSettings) === null || _a === void 0 ? void 0 : _a.showLegend) ||
                ((_b = prevProps.activeDatasourceConfig) === null || _b === void 0 ? void 0 : _b.profileChartSettings.displayStatistics) !== ((_c = this.props.activeDatasourceConfig) === null || _c === void 0 ? void 0 : _c.profileChartSettings.displayStatistics) ||
                prevProps.profileResult !== this.props.profileResult ||
                this.didStatisticsListChanged((_d = prevProps.activeDatasourceConfig) === null || _d === void 0 ? void 0 : _d.profileChartSettings.selectedStatistics, (_e = this.props.activeDatasourceConfig) === null || _e === void 0 ? void 0 : _e.profileChartSettings.selectedStatistics)) {
                this.setState({
                    showLegend: (_f = this.props.commonDsGeneralSettings) === null || _f === void 0 ? void 0 : _f.showLegend,
                    displayStats: (_g = this.props.activeDatasourceConfig) === null || _g === void 0 ? void 0 : _g.profileChartSettings.displayStatistics,
                    chartResult: this.props.profileResult,
                    selectedStatisticsList: (_h = this.props.activeDatasourceConfig) === null || _h === void 0 ? void 0 : _h.profileChartSettings.selectedStatistics
                }, () => {
                    if (!this.state.displayStats) {
                        this.setState({
                            statisticsOpen: false
                        });
                    }
                    this.displayStatisticsInfo(this.chart);
                });
            }
            if (prevProps.noFeaturesFoundError !== this.props.noFeaturesFoundError) {
                this.setState({
                    noFeaturesError: this.props.noFeaturesFoundError
                });
            }
            if (prevProps.viewModelErrorState !== this.props.viewModelErrorState ||
                prevProps.profileErrorMsg !== this.props.profileErrorMsg) {
                this.setState({
                    noValidInput: this.props.viewModelErrorState,
                    viewModelErrorMsg: this.props.profileErrorMsg
                });
            }
            //for more options live update
            if (((_j = prevProps.activeDatasourceConfig) === null || _j === void 0 ? void 0 : _j.profileChartSettings.elevationUnit) !== ((_k = this.props.activeDatasourceConfig) === null || _k === void 0 ? void 0 : _k.profileChartSettings.elevationUnit) ||
                ((_l = prevProps.activeDatasourceConfig) === null || _l === void 0 ? void 0 : _l.profileChartSettings.linearUnit) !== ((_m = this.props.activeDatasourceConfig) === null || _m === void 0 ? void 0 : _m.profileChartSettings.linearUnit) ||
                ((_o = prevProps.activeDatasourceConfig) === null || _o === void 0 ? void 0 : _o.advanceOptions) !== ((_p = this.props.activeDatasourceConfig) === null || _p === void 0 ? void 0 : _p.advanceOptions)) {
                this.setState({
                    selectedElevationUnit: ((_q = this.props.activeDatasourceConfig) === null || _q === void 0 ? void 0 : _q.profileChartSettings.elevationUnit) ? this.props.activeDatasourceConfig.profileChartSettings.elevationUnit : selectedUnit[0],
                    selectedLinearUnit: ((_r = this.props.activeDatasourceConfig) === null || _r === void 0 ? void 0 : _r.profileChartSettings.linearUnit) ? this.props.activeDatasourceConfig.profileChartSettings.linearUnit : selectedUnit[1],
                    isAdvanceOptionEnabled: (_s = this.props.activeDatasourceConfig) === null || _s === void 0 ? void 0 : _s.advanceOptions,
                    profileLayers: (_t = this.props.activeDatasourceConfig) === null || _t === void 0 ? void 0 : _t.profileSettings.layers
                }, () => {
                    this.displayStatisticsInfo(this.chart);
                    this.getSelectableLayers(this.props.activeDataSource);
                });
            }
            //check if profile layers config are updated in live view mode
            if (this.didProfileLayersSettingsChanged((_u = prevProps.activeDatasourceConfig) === null || _u === void 0 ? void 0 : _u.profileSettings.layers, (_v = this.props.activeDatasourceConfig) === null || _v === void 0 ? void 0 : _v.profileSettings.layers)) {
                this.setState({
                    profileLayers: (_w = this.props.activeDatasourceConfig) === null || _w === void 0 ? void 0 : _w.profileSettings.layers
                }, () => {
                    this.getSelectableLayers(this.props.activeDataSource);
                });
            }
            if (prevProps.drawingOrSelectingComplete !== this.props.drawingOrSelectingComplete ||
                prevProps.isNewSegmentsForSelection !== this.props.isNewSegmentsForSelection ||
                prevProps.noGraphicAfterFirstSelection !== this.props.noGraphicAfterFirstSelection) {
                this.setState({
                    dismissInfoMsg: !this.props.drawingOrSelectingComplete,
                    dismissWarningMsg: !this.props.isNewSegmentsForSelection && !this.props.noGraphicAfterFirstSelection && this.props.selectMode
                });
            }
        };
        this.didStatisticsListChanged = (prevSettings, newSettings) => {
            let statsListChange = false;
            //eslint-disable-next-line
            newSettings === null || newSettings === void 0 ? void 0 : newSettings.some((newStatsSettings, index) => {
                if (newStatsSettings.name !== prevSettings[index].name ||
                    newStatsSettings.label !== prevSettings[index].label ||
                    newStatsSettings.enabled !== prevSettings[index].enabled) {
                    statsListChange = true;
                    return true;
                }
            });
            return statsListChange;
        };
        this.didProfileLayersSettingsChanged = (prevProfileLayers, currentProfileLayers) => {
            let profileSettingsChanged = false;
            if ((prevProfileLayers === null || prevProfileLayers === void 0 ? void 0 : prevProfileLayers.length) !== (currentProfileLayers === null || currentProfileLayers === void 0 ? void 0 : currentProfileLayers.length)) {
                profileSettingsChanged = true;
            }
            return profileSettingsChanged;
        };
        this.getSelectableLayers = (activeDs) => {
            const dataSource = getAllLayersFromDataSource(activeDs);
            this.selectableLayers = [];
            const selectedLayers = [];
            let anyLineLayer = false;
            dataSource === null || dataSource === void 0 ? void 0 : dataSource.forEach((layer) => {
                var _a;
                if (layer && layer.layerDefinition && layer.layerDefinition.geometryType) {
                    //if advance option is enabled in config then display all the configured layers in layers dropdown
                    if (this.state.isAdvanceOptionEnabled) {
                        if (this.state.profileLayers.length === 0) {
                            anyLineLayer = false;
                        }
                        else {
                            if (layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                                (_a = this.state.profileLayers) === null || _a === void 0 ? void 0 : _a.forEach((currentSetting) => {
                                    if (currentSetting.layerId === layer.id) {
                                        this.selectableLayers.push({
                                            label: layer.schema.label,
                                            value: layer.id
                                        });
                                        selectedLayers.push(layer.id);
                                        //update the flag to true if any line layers are configured
                                        anyLineLayer = true;
                                    }
                                });
                            }
                        }
                    }
                    else { //display all the available line layers in layers dropdown available in map
                        if (layer.layerDefinition.geometryType === 'esriGeometryPolyline') {
                            this.selectableLayers.push({
                                label: layer.schema.label,
                                value: layer.id
                            });
                            selectedLayers.push(layer.id);
                            //update the flag to true if any line layers are configured
                            anyLineLayer = true;
                        }
                    }
                }
            });
            this.props.selectabelLayersRuntime(selectedLayers);
            this.setState({
                selectedLayers: selectedLayers,
                isAnyProfileLineLayers: anyLineLayer
            });
        };
        this.onDoneClick = () => {
            const enableToShowNewProfile = this.props.doneClick();
            if (enableToShowNewProfile) {
                this.setState({
                    enableForNewProfile: true
                });
            }
            else {
                //if empty state
                this.setState({
                    enableForNewProfile: false,
                    initialEmptyState: false,
                    emptyStateIfDoneClick: true,
                    noFeaturesError: false,
                    noValidInput: false
                }, () => {
                    setTimeout(() => {
                        var _a, _b;
                        (_b = (_a = this.alertElement) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
                    }, 100);
                });
            }
        };
        this.toggleStatistics = () => {
            this.setState({
                statisticsOpen: !this.state.statisticsOpen
            }, () => {
                this.displayStatisticsInfo(this.chart);
            });
        };
        this.toggleSettings = () => {
            this.setState({
                settingsOptionsOpen: !this.state.settingsOptionsOpen
            });
        };
        this.highlightChartPosition = (point) => {
            this.props.chartPosition(point);
        };
        this.hideChartPosition = () => {
            this.props.hideChartPosition();
        };
        this.onChartFlip = () => {
            this.setState({
                isFlipChart: !this.state.isFlipChart
            }, () => {
                this.displayStatisticsInfo(this.chart);
            });
        };
        this.onNewProfileClick = () => {
            this.createNewProfile();
            this.setState({
                enableForNewProfile: false
            });
        };
        this.onClearButtonClick = () => {
            this.createNewProfile();
        };
        this.createNewProfile = () => {
            this.props.activateDrawSelectToolForNewProfile();
            this.setState({
                initialEmptyState: true,
                emptyStateIfDoneClick: false,
                noFeaturesError: false,
                noValidInput: false,
                statisticsOpen: false
            }, () => {
                setTimeout(() => {
                    var _a, _b;
                    (_b = (_a = this.alertElement) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
                }, 100);
            });
        };
        this.onElevationUnitChange = (evt) => {
            this.setState({
                selectedElevationUnit: evt.target.value
            }, () => {
                this.displayStatisticsInfo(this.chart);
            });
        };
        this.onLinearUnitChange = (evt) => {
            this.setState({
                selectedLinearUnit: evt.target.value
            }, () => {
                this.displayStatisticsInfo(this.chart);
            });
        };
        this.onLayerSelected = (evt, value, values) => {
            let isLayerEnable = true;
            this.setState({
                selectedLayers: values
            });
            if (values.length === 0) {
                isLayerEnable = false;
            }
            this.setState({
                isLayerSelected: isLayerEnable
            });
            this.props.selectabelLayersRuntime(values);
        };
        this.displaySelectedFields = (values) => {
            //display enabled layers count on dropdown
            let selectedLabel = this.nls('selectLayerLabel');
            if (values && values.length) {
                selectedLabel = this.props.intl.formatMessage({
                    id: 'selectedLayerCount',
                    defaultMessage: defaultMessages.selectedLayerCount
                }, { selectedLayerCount: values.length });
            }
            return selectedLabel;
        };
        this.onUniformScalingChange = (evt) => {
            this.setState({
                isUniformScalingEnable: evt.target.checked
            });
        };
        this.displayStatisticsInfo = (chart) => {
            var _a, _b, _c;
            const items = [];
            this.setState({
                legendStats: []
            });
            let expandStats = false;
            if (!(chart === null || chart === void 0 ? void 0 : chart.series)) {
                items.push(jsx(Loading, { type: LoadingType.Secondary }));
            }
            else {
                if ((_b = (_a = chart === null || chart === void 0 ? void 0 : chart.series) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b[0]) {
                    expandStats = true;
                }
                (_c = chart === null || chart === void 0 ? void 0 : chart.series) === null || _c === void 0 ? void 0 : _c.values.forEach((series, index) => {
                    if (index === 0) { //currently showing only ground profile statistics so checked with index 0
                        items.push(jsx(ProfileStatistics, { theme: this.props.theme, intl: this.props.intl, parentWidgetId: this.props.widgetId, index: index, key: series.name + index, singleSeriesExpandStat: expandStats, legendName: series.name, activeDsConfig: this.props.activeDatasourceConfig, selectedElevationUnit: this.state.selectedElevationUnit, selectedLinearUnit: this.state.selectedLinearUnit, chartProfileResult: this.props.profileResult, selectedStatsDisplay: this.state.selectedStatisticsList, renderSeries: this.state.renderSeries, toggledSeriesName: this.state.toggledSeriesName, isFlip: this.state.isFlipChart }));
                        return true; //Remove once we show other series statistics
                    }
                });
            }
            this.setState({
                legendStats: items
            });
        };
        this.statisticsDisplay = () => {
            return (jsx("div", null,
                jsx(Popper, { css: getChartStyle(this.props.theme, this.props.chartColorRender ? this.props.chartColorRender : '#b54900'), open: this.state.statisticsOpen, reference: 'statistics' + this.props.widgetId, floating: true, headerTitle: this.nls('statisticsLabel'), placement: 'auto', version: 0, offset: [0, 0], onHeaderClose: () => { this.setState({ statisticsOpen: !this.state.statisticsOpen }); }, defaultSize: { width: 400, height: 235 } },
                    jsx("div", { style: { height: 'calc(100% - 15px)', overflow: 'auto' }, className: 'pr-3 pl-3 pt-2 pb-3' }, this.state.legendStats.map((statsComponent, index) => (jsx(React.Fragment, { key: index }, statsComponent)))))));
        };
        this.settingsOptionsRender = () => {
            return (jsx("div", null,
                jsx(Popper, { css: geSettingsOptionsStyle(this.props.theme), open: this.state.settingsOptionsOpen, reference: 'settingsOptions' + this.props.widgetId, placement: 'right-start', version: 0, offset: [0, 0], toggle: e => {
                        this.setState({ settingsOptionsOpen: !this.state.settingsOptionsOpen });
                    } },
                    jsx("div", { tabIndex: -1, style: { width: 175 } },
                        jsx("div", { tabIndex: -1, className: 'p-2' },
                            jsx(Label, { "aria-label": this.nls('elevationUnitLabel'), className: 'settingsLabel text-break' }, this.nls('elevationUnitLabel')),
                            jsx(Select, { menuRole: 'menu', "aria-label": this.state.selectedElevationUnit, className: 'pt-1', name: 'elevationUnit', size: 'sm', onChange: this.onElevationUnitChange, value: this.state.selectedElevationUnit }, unitOptions.map((unitOption) => {
                                return jsx(Option, { role: 'option', "aria-label": unitOption.value, key: unitOption.value, value: unitOption.value }, this.nls(unitOption.value));
                            }))),
                        jsx("div", { className: 'p-2' },
                            jsx(Label, { "aria-label": this.nls('distanceUnitLabel'), className: 'settingsLabel text-break' }, this.nls('distanceUnitLabel')),
                            jsx(Select, { menuRole: 'menu', "aria-label": this.state.selectedLinearUnit, className: 'pt-1', name: 'linearUnit', size: 'sm', onChange: this.onLinearUnitChange, value: this.state.selectedLinearUnit }, unitOptions.map((unitOption) => {
                                return jsx(Option, { role: 'option', "aria-label": unitOption.value, key: unitOption.value, value: unitOption.value }, this.nls(unitOption.value));
                            }))),
                        this.props.selectMode && this.state.isAnyProfileLineLayers &&
                            jsx(React.Fragment, null,
                                jsx("div", { className: 'p-2' },
                                    jsx(Label, { "aria-label": this.nls('selectableLayersLabel'), className: 'settingsLabel text-break' }, this.nls('selectableLayersLabel')),
                                    !this.state.isLayerSelected &&
                                        jsx(Alert, { tabIndex: 0, className: 'w-100 selectLayerWarningMsg', onClose: function noRefCheck() { }, open: !this.state.isLayerSelected, text: this.nls('selectLayerWarning'), type: 'warning', withIcon: true }),
                                    jsx(MultiSelect, { items: Immutable(this.selectableLayers), values: Immutable(this.state.selectedLayers), className: 'pt-1 custom-multiselect', buttonProps: { showDynamicTitle: true }, size: 'sm', fluid: true, onClickItem: this.onLayerSelected, displayByValues: this.displaySelectedFields }))),
                        jsx(React.Fragment, null,
                            jsx("div", { className: 'p-2' },
                                jsx(Label, { className: 'cursor-pointer settingsLabel text-break', title: this.nls('uniformChartScalingInfo') },
                                    jsx(Checkbox, { role: 'checkbox', className: 'mr-2 font-13', "aria-label": this.nls('uniformChartScaling'), checked: this.state.isUniformScalingEnable, onChange: this.onUniformScalingChange.bind(this) }),
                                    this.nls('uniformChartScaling'))))))));
        };
        this.dismissInfoMsg = () => {
            this.setState({ dismissInfoMsg: !this.state.dismissInfoMsg });
        };
        this.dismissWarningMsg = () => {
            this.setState({ dismissWarningMsg: !this.state.dismissWarningMsg });
        };
        this.getChartInfo = (chart) => {
            this.chart = chart;
            setTimeout(() => {
                this.displayStatisticsInfo(this.chart);
            }, 50);
        };
        this.onToggleSeries = (hideSeries, seriesName) => {
            this.setState({
                renderSeries: hideSeries,
                toggledSeriesName: seriesName
            });
        };
        const selectedUnit = defaultSelectedUnits(this.props.activeDatasourceConfig, this.props.portalSelf);
        this.chart = null;
        this.state = {
            chartResult: this.props.profileResult,
            initialEmptyState: true,
            emptyStateIfDoneClick: false,
            enableForNewProfile: false,
            settingsOptionsOpen: false,
            unitOptions: unitOptions,
            isFlipChart: false,
            selectedElevationUnit: this.props.activeDatasourceConfig ? selectedUnit[0] : this.props.defaultConfig.profileChartSettings.elevationUnit,
            selectedLinearUnit: this.props.activeDatasourceConfig ? selectedUnit[1] : this.props.defaultConfig.profileChartSettings.linearUnit,
            selectedLayers: [],
            profileLayers: (_a = this.props.activeDatasourceConfig) === null || _a === void 0 ? void 0 : _a.profileSettings.layers,
            isAnyProfileLineLayers: false,
            isAdvanceOptionEnabled: (_b = this.props.activeDatasourceConfig) === null || _b === void 0 ? void 0 : _b.advanceOptions,
            noFeaturesError: this.props.noFeaturesFoundError,
            dismissInfoMsg: !this.props.drawingOrSelectingComplete,
            dismissWarningMsg: !this.props.isNewSegmentsForSelection && !this.props.noGraphicAfterFirstSelection && this.props.selectMode,
            statisticsOpen: false,
            legendStats: [],
            showLegend: (_c = this.props.commonDsGeneralSettings) === null || _c === void 0 ? void 0 : _c.showLegend,
            displayStats: this.props.activeDatasourceConfig ? this.props.activeDatasourceConfig.profileChartSettings.displayStatistics : this.props.defaultConfig.profileChartSettings.displayStatistics,
            selectedStatisticsList: this.props.activeDatasourceConfig ? this.props.activeDatasourceConfig.profileChartSettings.selectedStatistics : this.props.defaultConfig.profileChartSettings.selectedStatistics,
            renderSeries: true,
            toggledSeriesName: '',
            isUniformScalingEnable: false,
            isLayerSelected: true,
            noValidInput: this.props.viewModelErrorState,
            viewModelErrorMsg: this.props.profileErrorMsg
        };
        this.selectableLayers = [];
    }
    render() {
        var _a, _b, _c;
        let infoMessagesForSelectDraw = '';
        let warningMessagesForSelectDraw = '';
        let infoMsgWhileSelectingOrDrawing = '';
        if ((this.state.initialEmptyState && this.props.drawMode) || (this.state.emptyStateIfDoneClick && this.props.drawMode)) {
            infoMessagesForSelectDraw = this.nls('drawUserInfo');
        }
        else if ((this.state.initialEmptyState && this.props.selectMode) || (this.state.emptyStateIfDoneClick && this.props.selectMode)) {
            infoMessagesForSelectDraw = this.nls('selectUserInfo');
        }
        if (this.state.emptyStateIfDoneClick && this.props.drawMode) {
            warningMessagesForSelectDraw = this.nls('emptyDrawStateWarning');
        }
        else if (this.state.emptyStateIfDoneClick && this.props.selectMode) {
            warningMessagesForSelectDraw = this.nls('emptySelectStateWarning');
        }
        if (!this.props.drawingOrSelectingComplete && this.props.drawMode && this.props.chartRender) {
            infoMsgWhileSelectingOrDrawing = this.nls('infoMsgWhileDrawing');
        }
        else if (this.props.selectMode && this.props.chartRender) {
            infoMsgWhileSelectingOrDrawing = this.props.isNewSegmentsForSelection && this.props.noGraphicAfterFirstSelection ? this.nls('infoMsgWhileSelecting') : this.nls('addToSelectionWarning');
        }
        //display error message when no features found for selection
        const noFeaturesErrorDisplay = this.nls('noFeaturesFound');
        const settingsOptions = this.settingsOptionsRender();
        const statsRender = this.statisticsDisplay();
        return jsx("div", { className: 'h-100 w-100', css: getContainerStyle(this.props.theme) },
            jsx("div", { style: { height: 35 }, className: 'ep-widget-header d-flex w-100' },
                jsx("div", { className: 'align-items-center w-100 pt-1', style: { display: 'inline-block' } },
                    jsx(Button, { role: 'button', "aria-label": this.nls('settingsOptions'), "aria-haspopup": 'dialog', title: this.nls('settingsOptions'), icon: true, id: 'settingsOptions' + this.props.widgetId, className: 'chart-actions', active: this.state.settingsOptionsOpen, size: 'sm', type: 'default', onClick: this.toggleSettings },
                        jsx(Icon, { size: 16, icon: epIcon.settingsIcon })),
                    this.props.chartRender &&
                        jsx(React.Fragment, null,
                            jsx(Button, { role: 'button', "aria-label": this.nls('chartFlip'), title: this.nls('chartFlip'), icon: true, className: 'chart-actions', active: this.state.isFlipChart, size: 'sm', type: 'default', onClick: this.onChartFlip },
                                jsx(Icon, { size: 16, icon: epIcon.flipIcon })),
                            this.state.displayStats &&
                                jsx(Button, { role: 'button', "aria-label": this.nls('chartStatistics'), "aria-haspopup": 'dialog', title: this.nls('chartStatistics'), icon: true, id: 'statistics' + this.props.widgetId, className: 'chart-actions', active: this.state.statisticsOpen, size: 'sm', type: 'default', onClick: this.toggleStatistics },
                                    jsx(Icon, { size: 16, icon: epIcon.chartIcon }))),
                    this.state.settingsOptionsOpen &&
                        settingsOptions,
                    this.state.statisticsOpen &&
                        statsRender)),
            jsx("div", { className: classNames('ep-widget-bodyContainer d-flex w-100', this.props.chartRender ? '' : 'align-items-center') },
                this.props.displayLoadingIndicator &&
                    jsx(React.Fragment, null,
                        jsx(Loading, { type: LoadingType.Secondary })),
                jsx("div", { className: classNames('w-100', this.props.chartRender ? '' : 'alignInfo align-items-center', this.props.noFeaturesFoundError ? 'alignInfo align-items-center' : '') },
                    !this.props.chartRender && !this.state.noFeaturesError && !this.state.noValidInput &&
                        jsx("div", { tabIndex: 0, ref: this.alertElement, "aria-label": infoMessagesForSelectDraw },
                            jsx(Alert, { className: 'mb-3 w-100 userInfo', onClose: function noRefCheck() { }, open: !this.props.chartRender && !this.state.noFeaturesError && !this.state.noValidInput, text: infoMessagesForSelectDraw, type: 'info', withIcon: true })),
                    this.state.emptyStateIfDoneClick && !this.props.chartRender && !this.state.noFeaturesError && !this.state.noValidInput &&
                        jsx(Alert, { tabIndex: 0, className: 'w-100 userInfo', onClose: function noRefCheck() { }, open: this.state.emptyStateIfDoneClick && !this.props.chartRender && !this.state.noFeaturesError && !this.state.noValidInput, text: warningMessagesForSelectDraw, type: 'warning', withIcon: true }),
                    this.state.noFeaturesError &&
                        jsx(Alert, { tabIndex: 0, className: 'w-100 userInfo', onClose: function noRefCheck() { }, open: this.state.noFeaturesError, text: noFeaturesErrorDisplay, type: 'warning', withIcon: true }),
                    this.state.noValidInput &&
                        jsx(Alert, { tabIndex: 0, className: 'w-100 userInfo', onClose: function noRefCheck() { }, open: this.state.noValidInput, text: this.state.viewModelErrorMsg, type: 'warning', withIcon: true }),
                    this.props.chartRender &&
                        jsx(ProfileChart, { ref: 'chartObj', intl: this.props.intl, parentWidgetId: this.props.widgetId, commonGeneralSettings: this.props.commonDsGeneralSettings, activeDs: this.props.activeDataSource, currentConfig: this.props.activeDatasourceConfig, theme: this.props.theme, selectedLinearUnit: this.state.selectedLinearUnit, selectedElevationUnit: this.state.selectedElevationUnit, profileResult: this.props.profileResult, unitOptions: this.state.unitOptions, highlightChartPositionOnMap: this.highlightChartPosition.bind(this), hideChartPosition: this.hideChartPosition.bind(this), chartInfo: this.getChartInfo.bind(this), toggleLegendSeriesState: this.onToggleSeries, elevationGraphColor: this.props.chartColorRender, isFlip: this.state.isFlipChart, isUniformChartScalingEnable: this.state.isUniformScalingEnable, drawingLayer: this.props.drawingLayer, mapView: this.props.jimuMapview }))),
            jsx("div", { className: 'floatingInfoMsg' }, !this.state.enableForNewProfile && this.props.chartRender &&
                jsx(React.Fragment, null,
                    jsx("div", { title: infoMsgWhileSelectingOrDrawing },
                        jsx(Alert, { tabIndex: 0, className: classNames('alignDismissibleInfo', this.state.dismissInfoMsg ? 'showMessage' : 'hideMessage'), onClose: this.dismissInfoMsg, open: this.state.dismissInfoMsg, text: infoMsgWhileSelectingOrDrawing, type: 'info', withIcon: true, closable: true })),
                    jsx("div", { title: infoMsgWhileSelectingOrDrawing },
                        jsx(Alert, { tabIndex: 0, className: classNames('alignDismissibleInfo', this.state.dismissWarningMsg ? 'showMessage' : 'hideMessage'), onClose: this.dismissWarningMsg, open: this.state.dismissWarningMsg, text: infoMsgWhileSelectingOrDrawing, type: 'warning', withIcon: true, closable: true })))),
            jsx("div", { className: 'ep-widget-footer' },
                jsx(SettingRow, null,
                    jsx("div", { className: 'w-100 footer-display' },
                        jsx(Button, { role: 'button', "aria-label": this.nls('backButtonLabel'), title: this.nls('backButtonLabel'), className: 'm-1 text-break', size: 'default', type: 'tertiary', onClick: this.props.onNavBack },
                            jsx(Icon, { size: 16, autoFlip: true, icon: epIcon.arrowNavBack }),
                            this.nls('backButtonLabel')),
                        ((_a = this.props.commonDsGeneralSettings) === null || _a === void 0 ? void 0 : _a.buttonStyle) === ButtonTriggerType.IconText &&
                            jsx(Button, { role: 'button', "aria-label": this.nls('doneButtonLabel'), title: this.nls('doneButtonLabel'), className: this.state.enableForNewProfile || this.props.drawingOrSelectingComplete || this.state.noValidInput || (this.props.selectMode && this.props.chartRender && !this.props.isNewSegmentsForSelection && !this.props.noGraphicAfterFirstSelection)
                                    ? 'hidden'
                                    : 'm-1 actionButton text-break', size: 'default', type: 'primary', onClick: this.onDoneClick },
                                jsx(React.Fragment, null,
                                    jsx(Icon, { size: 16, icon: epIcon.doneIcon }),
                                    this.nls('doneButtonLabel'))),
                        this.props.chartRender && ((_b = this.props.commonDsGeneralSettings) === null || _b === void 0 ? void 0 : _b.buttonStyle) === ButtonTriggerType.IconText &&
                            jsx(React.Fragment, null,
                                jsx(Button, { role: 'button', "aria-label": this.nls('clearButtonLabel'), title: this.nls('clearButtonLabel'), className: this.state.enableForNewProfile || this.props.drawingOrSelectingComplete || (this.props.selectMode && this.props.chartRender && !this.props.isNewSegmentsForSelection && !this.props.noGraphicAfterFirstSelection)
                                        ? 'hidden'
                                        : 'm-1 actionButton text-break', size: 'default', type: 'default', onClick: this.onClearButtonClick },
                                    jsx(Icon, { size: 16, icon: epIcon.clearIcon }),
                                    this.nls('clearButtonLabel'))),
                        (this.state.enableForNewProfile || this.props.drawingOrSelectingComplete || this.state.noValidInput ||
                            (this.props.selectMode && this.props.chartRender && !this.props.isNewSegmentsForSelection && !this.props.noGraphicAfterFirstSelection)) &&
                            ((_c = this.props.commonDsGeneralSettings) === null || _c === void 0 ? void 0 : _c.buttonStyle) === ButtonTriggerType.IconText &&
                            jsx(Button, { role: 'button', "aria-label": this.nls('newProfileButtonLabel'), title: this.nls('newProfileButtonLabel'), className: 'm-1 actionButton text-break', size: 'default', type: 'primary', onClick: this.onNewProfileClick },
                                jsx(React.Fragment, null,
                                    jsx(Icon, { size: 16, icon: this.props.drawMode ? epIcon.drawIcon : epIcon.selectIcon }),
                                    this.nls('newProfileButtonLabel')))))));
    }
}
//# sourceMappingURL=results-pane.js.map