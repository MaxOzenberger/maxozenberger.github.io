/** @jsx jsx */
import { React, jsx, Immutable, dateUtils, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { Label, NumericInput, Option, Radio, Select, Tooltip, Button } from 'jimu-ui';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { DateUnitInput } from 'jimu-ui/advanced/style-setting-components';
import { TimeDisplayStrategy } from '../config';
import { getStyleForTimePanel } from './style';
import { DatePicker } from 'jimu-ui/basic/date-picker';
import TimeSpan from './components/time-span';
import { DATE_PATTERN, DIVIDED_COUNT, getCalculatedTimeSettings, getInsideLayersFromWebmap, getStepLengthByAccuracy, getTimesByVirtualDate, MAX_DATE_TIME, MIN_DATE_TIME, SecondsForDateUnit, TIME_PATTERN, UnitSelectorDateWeekUnits, UnitSelectorTimeUnits } from '../utils/utils';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { WarningCircleFilled } from 'jimu-icons/filled/suggested/warning-circle';
const SUPPORTED_TYPE = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.MapService]);
const START_VIRTUAL_LIST = [dateUtils.VirtualDateType.Min, dateUtils.VirtualDateType.Today, dateUtils.VirtualDateType.Now];
const END_VIRTUAL_LIST = [dateUtils.VirtualDateType.Max, dateUtils.VirtualDateType.Today, dateUtils.VirtualDateType.Now];
export default class TimePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.timeSpanChanged = (start, end) => {
            const { config, dataSources, exactStartTime, exactEndTime } = this.props;
            let newConfig;
            if (exactStartTime !== start) {
                newConfig = config.set('startTime', { value: start });
                this.checkIfDatesInvalid({ value: start }, true);
            }
            else if (exactEndTime !== end) {
                newConfig = config.set('endTime', { value: end });
                this.checkIfDatesInvalid({ value: end }, false);
            }
            else {
                return;
            }
            // Update accuracy and stepLengh if needed.
            if (config.stepLength) {
                const calcConfig = getCalculatedTimeSettings(newConfig, dataSources).config;
                newConfig = newConfig.set('accuracy', calcConfig.accuracy).set('stepLength', calcConfig.stepLength);
            }
            this.props.onChange(newConfig);
        };
        this.onTimeChanged = (date, isStart) => {
            const { config, dataSources } = this.props;
            const value = { value: date };
            if (date === dateUtils.VirtualDateType.Today) {
                value.offset = { val: 0, unit: 'day' };
            }
            else if (date === dateUtils.VirtualDateType.Now) {
                value.offset = { val: 0, unit: 'minute' };
            }
            else if (typeof date === 'number') {
                if (isStart) {
                    value.value = Math.max(MIN_DATE_TIME, date);
                }
                else {
                    value.value = Math.min(MAX_DATE_TIME, date);
                }
            }
            let newConfig = config.set(`${isStart ? 'start' : 'end'}Time`, value);
            this.checkIfDatesInvalid(value, isStart);
            // Update accuracy and stepLengh if needed.
            if (config.stepLength) {
                const calcConfig = getCalculatedTimeSettings(newConfig, dataSources).config;
                newConfig = newConfig.set('accuracy', calcConfig.accuracy).set('stepLength', calcConfig.stepLength);
            }
            this.props.onChange(newConfig);
        };
        // Reset config when start is later than end.
        this.checkIfDatesInvalid = (value, isStart) => {
            const { exactStartTime, exactEndTime } = this.props;
            let isValid = true;
            const newDateTimes = getTimesByVirtualDate(value, isStart);
            if ((isStart && newDateTimes > exactEndTime) || (!isStart && newDateTimes < exactStartTime)) {
                isValid = false;
            }
            this.setState({ isDateValid: isValid });
        };
        /**
         * Get offset units for start and end.
         * Today: min='day', Now: min='minute'
         * @param value
         * @returns
         */
        this.getOffsetUnits = (value) => {
            let list;
            if (value === dateUtils.VirtualDateType.Today) {
                list = UnitSelectorDateWeekUnits;
            }
            else {
                list = [...UnitSelectorDateWeekUnits, ...UnitSelectorTimeUnits];
            }
            return list;
        };
        this.onDateOffsetChanged = (value, isStart = false) => {
            const key = isStart ? 'startTime' : 'endTime';
            const newConfig = this.props.config.setIn([key, 'offset'], value);
            // Reset config when start is later than end.
            this.checkIfDatesInvalid(newConfig[key], isStart);
            this.props.onChange(newConfig);
        };
        this.onAccuracyChanged = e => {
            const { config, exactStartTime, exactEndTime, accuracyList } = this.props;
            const accuracy = e.target.value;
            let newConfig = config.set('accuracy', accuracy);
            // Update stepLength if chosen accuracy is smaller than stepUnit.
            if (config.stepLength && accuracyList.indexOf(accuracy) < accuracyList.indexOf(config.stepLength.unit)) {
                const stepLenth = getStepLengthByAccuracy(exactStartTime, exactEndTime, accuracy);
                newConfig = newConfig.set('stepLength', stepLenth);
            }
            this.props.onChange(newConfig);
        };
        this.onStepChecked = () => {
            const { config, exactStartTime, exactEndTime } = this.props;
            const stepLenth = getStepLengthByAccuracy(exactStartTime, exactEndTime, config.accuracy);
            this.props.onChange(this.props.config.set('stepLength', stepLenth).set('dividedCount', null));
        };
        this.onDividedChecked = () => {
            this.props.onChange(this.props.config.set('stepLength', null).set('dividedCount', DIVIDED_COUNT));
        };
        this.onStepLengthChanged = (value) => {
            this.props.onChange(this.props.config.set('stepLength', value).set('dividedCount', null));
        };
        this.onDividedCountChanged = (count) => {
            this.props.onChange(this.props.config.set('dividedCount', count || 2).set('stepLength', null));
        };
        this.onChange = (prop, value) => {
            this.props.onChange(this.props.config.set(prop, value));
        };
        this.getAllSupportedLayersFromMap = () => {
            const { dataSources, dataSourceType, config } = this.props;
            if (dataSourceType === AllDataSourceTypes.WebMap) {
                return getInsideLayersFromWebmap(dataSources, config === null || config === void 0 ? void 0 : config.layerList);
            }
            return null;
        };
        /**
         * Get all supported layers' ids.
         */
        this.getSupportedLayerIdsFromMap = () => {
            if (this.props.dataSourceType === AllDataSourceTypes.WebMap) {
                const idList = Object.keys(this.allSupportedLayers).map(layerId => layerId);
                return Immutable(idList);
            }
            return null;
        };
        /**
         * For timeSpan
         */
        this.getSelectedDataSources = () => {
            const { dataSources, dataSourceType, config } = this.props;
            let selectedLayers = {};
            if (dataSourceType === AllDataSourceTypes.WebMap) {
                Object.keys(this.allSupportedLayers).forEach(lyId => {
                    if (config.layerList === null ||
                        config.layerList.filter(useDS => useDS.dataSourceId === lyId).length > 0) {
                        selectedLayers[lyId] = this.allSupportedLayers[lyId];
                    }
                });
            }
            else {
                selectedLayers = dataSources;
            }
            return selectedLayers;
        };
        /**
         * Used for DataSource selector when type is webmap.
         */
        this.getSelectedUseDataSources = () => {
            var _a;
            const { config, dataSourceType } = this.props;
            if (dataSourceType === AllDataSourceTypes.WebMap) {
                if (config.layerList !== null) {
                    return config.layerList;
                }
                const useDs = [];
                (_a = Object.keys(this.allSupportedLayers)) === null || _a === void 0 ? void 0 : _a.forEach(lyId => {
                    var _a, _b;
                    const ly = this.allSupportedLayers[lyId];
                    useDs.push({
                        rootDataSourceId: (_a = ly.getRootDataSource()) === null || _a === void 0 ? void 0 : _a.id,
                        dataSourceId: lyId,
                        mainDataSourceId: (_b = ly.getMainDataSource()) === null || _b === void 0 ? void 0 : _b.id
                    });
                });
                return Immutable(useDs);
            }
            return null;
        };
        this.dataSourceChange = ds => {
            // Reset to default settings with currrent layerList.
            const layers = getInsideLayersFromWebmap(this.props.dataSources, ds);
            const newConfig = getCalculatedTimeSettings(null, layers).config;
            this.props.onChange(newConfig.set('layerList', ds));
        };
        this.getDateValue = date => {
            if (!date) {
                return null;
            }
            if (typeof date === 'number') {
                date = new Date(date);
            }
            return date;
        };
        this.isSelectionDisabled = () => {
            const { layerList } = this.props.config;
            return layerList === null || layerList.length === this.state.supportedLayerIdsFromMap.length;
        };
        this.allSupportedLayers = this.getAllSupportedLayersFromMap();
        this.state = {
            supportedLayerIdsFromMap: this.getSupportedLayerIdsFromMap(),
            selectedUseDataSources: this.getSelectedUseDataSources(),
            selectedDataSources: this.getSelectedDataSources(),
            isDateValid: props.exactStartTime <= props.exactEndTime
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.config.layerList !== prevProps.config.layerList) {
            this.setState({
                selectedUseDataSources: this.getSelectedUseDataSources(),
                selectedDataSources: this.getSelectedDataSources()
            });
        }
    }
    render() {
        const { i18nMessage, config, dataSourceType, intl, theme, exactStartTime, exactEndTime, accuracyList } = this.props;
        const { supportedLayerIdsFromMap, selectedUseDataSources, selectedDataSources } = this.state;
        const { startTime, endTime, accuracy, timeDisplayStrategy, stepLength, dividedCount } = config;
        const startDate = this.getDateValue(startTime === null || startTime === void 0 ? void 0 : startTime.value);
        const endDate = this.getDateValue(endTime === null || endTime === void 0 ? void 0 : endTime.value);
        const showStartOffset = typeof (startTime === null || startTime === void 0 ? void 0 : startTime.value) === 'string' && [dateUtils.VirtualDateType.Today, dateUtils.VirtualDateType.Now].includes(startTime === null || startTime === void 0 ? void 0 : startTime.value);
        const showEndOffset = typeof (endTime === null || endTime === void 0 ? void 0 : endTime.value) === 'string' && [dateUtils.VirtualDateType.Today, dateUtils.VirtualDateType.Now].includes(endTime === null || endTime === void 0 ? void 0 : endTime.value);
        return (jsx("div", { className: 'time-panel w-100 h-100', css: getStyleForTimePanel(theme) },
            dataSourceType === AllDataSourceTypes.WebMap && jsx(SettingSection, { className: "pt-0", title: jsx("span", { title: i18nMessage('enableTimeAnimation') }, i18nMessage('enableTimeAnimation')) },
                jsx(React.Fragment, null,
                    jsx(SettingRow, null,
                        jsx(DataSourceSelector, { isMultiple: true, types: SUPPORTED_TYPE, useDataSources: selectedUseDataSources, mustUseDataSource: true, disableDataView: true, hideDataView: true, closeDataSourceListOnChange: true, disableRemove: () => selectedUseDataSources.length === 1, onChange: this.dataSourceChange, hideDs: dsJson => {
                                // check id from all supported ds list
                                return !supportedLayerIdsFromMap.includes(dsJson.id);
                            }, disableSelection: this.isSelectionDisabled })))),
            jsx(SettingSection, { className: `border-0 ${dataSourceType !== AllDataSourceTypes.WebMap ? 'pt-0' : ''}`, title: i18nMessage('timeSpan') },
                jsx(SettingRow, null,
                    jsx(TimeSpan, { intl: intl, theme: theme, overalExtentLabel: i18nMessage('overallTimeExtent'), dataSources: selectedDataSources, startTime: exactStartTime, endTime: exactEndTime, onChange: this.timeSpanChanged }))),
            jsx(SettingSection, { className: 'border-0 pt-0', title: i18nMessage('startTime') },
                jsx(SettingRow, { className: 'mt-2' },
                    jsx(DatePicker, { style: { width: '226px' }, "aria-label": i18nMessage('startTime'), disablePortal: false, selectedDate: startDate, format: 'shortDateLongTime', runtime: false, showDoneButton: true, hideEmpty: true, showTimeInput: true, isTimeLong: true, virtualDateListForSetting: START_VIRTUAL_LIST, onChange: date => this.onTimeChanged(date, true) })),
                typeof (startTime === null || startTime === void 0 ? void 0 : startTime.value) === 'string' && startTime.value === dateUtils.VirtualDateType.Min &&
                    jsx(SettingRow, { className: 'mt-1 date-label' }, dateUtils.formatDateLocally(exactStartTime, intl, DATE_PATTERN, TIME_PATTERN)),
                showStartOffset && jsx(SettingRow, { label: i18nMessage('offset') },
                    jsx(DateUnitInput, { style: { width: '125px' }, step: 1, value: startTime.offset, units: this.getOffsetUnits(startTime.value), onChange: value => this.onDateOffsetChanged(value, true) }))),
            jsx(SettingSection, { className: 'border-0 pt-0', title: i18nMessage('endTime') },
                jsx(SettingRow, { className: 'mt-2' },
                    jsx(DatePicker, { style: { width: '226px' }, "aria-label": i18nMessage('endTime'), disablePortal: false, selectedDate: endDate, format: 'shortDateLongTime', runtime: false, showDoneButton: true, hideEmpty: true, showTimeInput: true, isTimeLong: true, virtualDateListForSetting: END_VIRTUAL_LIST, onChange: date => this.onTimeChanged(date, false) })),
                typeof (endTime === null || endTime === void 0 ? void 0 : endTime.value) === 'string' && endTime.value === dateUtils.VirtualDateType.Max &&
                    jsx(SettingRow, { className: 'mt-1 date-label' }, dateUtils.formatDateLocally(exactEndTime, intl, DATE_PATTERN, TIME_PATTERN)),
                showEndOffset && jsx(SettingRow, { label: i18nMessage('offset') },
                    jsx(DateUnitInput, { style: { width: '125px' }, step: 1, value: endTime.offset, units: this.getOffsetUnits(endTime.value), onChange: value => this.onDateOffsetChanged(value, false) })),
                !this.state.isDateValid && jsx("div", { className: 'd-flex mt-2 ml-1 mr-1', role: 'alert', "aria-live": 'polite' },
                    jsx(WarningCircleFilled, { color: this.props.theme.colors.palette.danger[700], className: 'mr-2' }),
                    jsx("div", { className: 'flex-grow-1', style: { color: theme.colors.palette.danger[700] } }, i18nMessage('timeWarning')))),
            jsx(SettingSection, { className: 'pt-0' },
                jsx(SettingRow, { flow: 'wrap', label: jsx("div", { className: 'm-0' },
                        i18nMessage('setMinTimeAccuracy'),
                        jsx(Tooltip, { title: i18nMessage('setMinTimeAccuracyTip'), showArrow: true, placement: 'left' },
                            jsx(Button, { icon: true, type: 'tertiary', size: 'sm', className: 'ml-2 p-0' },
                                jsx(InfoOutlined, null)))) }),
                jsx(SettingRow, { className: 'mt-1' },
                    jsx(Select, { onChange: this.onAccuracyChanged, value: accuracy }, accuracyList.map(unit => {
                        return jsx(Option, { key: unit, value: unit, active: unit === accuracy }, i18nMessage(unit));
                    })))),
            jsx(SettingSection, { title: i18nMessage('timeStep') },
                jsx(SettingRow, null,
                    jsx(Label, { check: true },
                        jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: !!stepLength, onChange: this.onStepChecked }),
                        i18nMessage('lengthOfOneStep'))),
                stepLength && jsx(SettingRow, { className: 'time-step-details' },
                    jsx(DateUnitInput, { className: 'w-100', min: 1, step: 1, value: stepLength, units: accuracyList.filter(unit => SecondsForDateUnit[unit] >= SecondsForDateUnit[accuracy]), onChange: this.onStepLengthChanged })),
                jsx(SettingRow, null,
                    jsx(Label, { check: true },
                        jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: dividedCount > 0, onChange: this.onDividedChecked }),
                        i18nMessage('totalTimeDividedIntoEqualSteps'))),
                dividedCount && jsx(SettingRow, { className: 'time-step-details', label: i18nMessage('count') },
                    jsx(NumericInput, { "aria-label": i18nMessage('count'), size: 'sm', min: 2, showHandlers: false, value: dividedCount, onAcceptValue: this.onDividedCountChanged }))),
            jsx(SettingSection, { title: i18nMessage('timeDisplay') },
                jsx(SettingRow, null,
                    jsx(Tooltip, { placement: 'bottom', title: i18nMessage('showCurrentWindowTip'), describeChild: true },
                        jsx(Label, { check: true },
                            jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: timeDisplayStrategy === TimeDisplayStrategy.current, onChange: () => this.onChange('timeDisplayStrategy', TimeDisplayStrategy.current) }),
                            i18nMessage('showCurrentWindow')))),
                jsx(SettingRow, null,
                    jsx(Tooltip, { placement: 'bottom', title: i18nMessage('showDataCumulativelyTip'), describeChild: true },
                        jsx(Label, { check: true },
                            jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: timeDisplayStrategy === TimeDisplayStrategy.cumulatively, onChange: () => this.onChange('timeDisplayStrategy', TimeDisplayStrategy.cumulatively) }),
                            i18nMessage('showDataCumulatively')))))));
    }
}
//# sourceMappingURL=time-panel.js.map