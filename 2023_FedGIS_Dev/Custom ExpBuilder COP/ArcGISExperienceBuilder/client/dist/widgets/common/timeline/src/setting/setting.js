var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, Immutable, DataSourceManager, dataSourceUtils, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { Label, Radio, Button, Icon, Tooltip, Switch, defaultMessages as jimuUIMessages, Checkbox } from 'jimu-ui';
import { TimeSpeed, TimeStyle } from '../config';
import defaultMessages from './translations/default';
import { getStyleForWidget } from './style';
import TimePanel from './time-panel';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { getCalculatedTimeSettings, getTimeSettingsFromHonoredWebMap } from '../utils/utils';
import TimelineDataSource from './timeline-ds';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
const allDefaultMessages = Object.assign({}, defaultMessages, jimuUIMessages);
const SUPPORTED_TYPES = Immutable([AllDataSourceTypes.WebMap, AllDataSourceTypes.MapService, AllDataSourceTypes.FeatureLayer]);
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.i18nMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: allDefaultMessages[id] }, values);
        };
        this.updateConfigForOptions = (prop, value) => {
            const config = {
                id: this.props.id,
                config: this.props.config.set(prop, value)
            };
            this.props.onSettingChange(config);
        };
        this.dataSourceChange = (ds) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let newDs = ds;
            let newDsState = this.state.dataSources;
            let config = this.props.config.set('timeSettings', null);
            let dsType = config.dataSourceType;
            // Remove one selected ds
            if (ds.length < ((_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.length)) {
                delete newDsState[this.props.useDataSources[this.props.useDataSources.length - 1].dataSourceId];
                this.setState({
                    dataSources: newDsState
                });
            }
            else { // Add new ds with current type, or another type
                const currentDs = ds[ds.length - 1];
                const currentDsObj = yield this.dsManager.createDataSourceByUseDataSource(Immutable(currentDs));
                let honorTimeSettings = currentDsObj.type === AllDataSourceTypes.WebMap ? config.honorTimeSettings : false;
                // ds type is changed, or replaced to another webMap
                if (currentDsObj.type !== config.dataSourceType || currentDsObj.type === AllDataSourceTypes.WebMap) {
                    newDs = [currentDs];
                    dsType = currentDsObj.type;
                    newDsState = {};
                    // ds type is changed to webMap from layers.
                    if (currentDsObj.type !== config.dataSourceType && currentDsObj.type === AllDataSourceTypes.WebMap) {
                        honorTimeSettings = true;
                    }
                }
                newDsState[currentDs.dataSourceId] = currentDsObj;
                this.setState({
                    dataSources: newDsState
                });
                config = config.set('honorTimeSettings', honorTimeSettings).set('dataSourceType', dsType);
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: config,
                useDataSources: newDs
            });
        });
        this.getTimeSettings = () => {
            return getCalculatedTimeSettings(this.props.config.timeSettings, this.state.dataSources);
        };
        this.setHonorTimeSettings = () => {
            const { id, config, onSettingChange } = this.props;
            if (config.honorTimeSettings) {
                const { settings } = getTimeSettingsFromHonoredWebMap(this.state.dataSources);
                onSettingChange({
                    id: id,
                    config: config
                        .set('honorTimeSettings', false)
                        .set('speed', TimeSpeed.Medium)
                        .set('timeSettings', settings)
                });
            }
            else {
                onSettingChange({
                    id: id,
                    config: config
                        .set('honorTimeSettings', true)
                        .set('speed', null)
                        .set('timeSettings', null)
                });
            }
        };
        this.enablePlayControl = (e, enable) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config
                    .set('enablePlayControl', enable)
                    .set('autoPlay', false)
            });
        };
        this.onTimeSettingPanel = () => {
            this.setState({ isTimePanelOpen: !this.state.isTimePanelOpen });
        };
        this.onCreateDataSourceCreatedOrFailed = (dataSourceId, dataSource) => {
            this.setState((state) => {
                const newDataSources = Object.assign({}, state.dataSources);
                newDataSources[dataSourceId] = dataSource;
                return {
                    dataSources: newDataSources
                };
            });
        };
        this.hideDs = (dsJson) => {
            var _a;
            let hide = false;
            const ds = (_a = this.dsManager) === null || _a === void 0 ? void 0 : _a.getDataSource(dsJson.id);
            if (ds.type === AllDataSourceTypes.FeatureLayer) {
                hide = !ds.supportTime() || dataSourceUtils.findMapServiceDataSource(ds) !== null;
            }
            else if (ds.type === AllDataSourceTypes.WebMap) { // check all layers inside.
                const layers = ds.getAllChildDataSources()
                    .filter(childDs => {
                    return [AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.MapService].includes(childDs.type) &&
                        childDs.supportTime();
                });
                hide = layers.length === 0;
            }
            else { // TODO: hide it when no featureLayers inside.
                hide = !ds.supportTime();
            }
            return hide;
        };
        this.dsManager = DataSourceManager.getInstance();
        this.state = {
            isTimePanelOpen: false,
            dataSources: {}
        };
    }
    render() {
        var _a;
        const { theme, theme2, config, useDataSources, intl } = this.props;
        const { honorTimeSettings, timeStyle, backgroundColor, foregroundColor, sliderColor, enablePlayControl, autoPlay, dataSourceType } = config;
        const hideEmptyPlaceholder = (useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0;
        return (jsx("div", { className: 'jimu-widget-setting widget-setting-timeline', css: getStyleForWidget(theme) }, useDataSources === null || useDataSources === void 0 ? void 0 :
            useDataSources.map((useDs, index) => {
                return (jsx(TimelineDataSource, { key: index, useDataSource: useDs, onCreateDataSourceCreatedOrFailed: this.onCreateDataSourceCreatedOrFailed }));
            }),
            jsx(SettingSection, { title: this.i18nMessage('source'), className: hideEmptyPlaceholder ? '' : 'border-0' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2', label: jsx("div", { className: 'm-0' },
                        jsx("span", { id: "timeline-ds-label" }, this.i18nMessage('selectDataSourceLabel')),
                        jsx(Tooltip, { title: this.i18nMessage('selectDataSourceTip'), showArrow: true, placement: 'left' },
                            jsx(Button, { icon: true, type: 'tertiary', size: 'sm', className: 'ml-2 p-0' },
                                jsx(InfoOutlined, null)))) }),
                jsx(SettingRow, { className: 'mt-2' },
                    jsx(DataSourceSelector, { hideAllOptionOfTypeDropdown: true, isMultiple: true, "aria-describedby": 'timeline-ds-label timeline-blank-msg', types: SUPPORTED_TYPES, useDataSources: useDataSources || Immutable([]), mustUseDataSource: true, disableDataView: true, hideDataView: true, hideDs: this.hideDs, closeDataSourceListOnChange: false, onChange: this.dataSourceChange }))),
            hideEmptyPlaceholder
                ? jsx(React.Fragment, null,
                    jsx(SettingSection, { title: this.i18nMessage('timeSetting'), className: "" },
                        dataSourceType === AllDataSourceTypes.WebMap &&
                            jsx(SettingRow, null,
                                jsx(Label, { className: 'honor-label', check: true },
                                    jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: honorTimeSettings, onChange: this.setHonorTimeSettings }),
                                    this.i18nMessage('honorTimeSettings'))),
                        jsx(SettingRow, { className: 'mt-2' },
                            jsx(Label, { className: 'honor-label', check: true },
                                dataSourceType === AllDataSourceTypes.WebMap &&
                                    jsx(Radio, { style: { cursor: 'pointer' }, className: 'mr-2 align-text-bottom', checked: !honorTimeSettings, onChange: this.setHonorTimeSettings }),
                                this.i18nMessage('customTimeSettings'))),
                        (!honorTimeSettings || dataSourceType === AllDataSourceTypes.FeatureLayer) &&
                            jsx(SettingRow, { className: 'mt-3' },
                                jsx(Button, { className: 'w-100', ref: ref => { this.timeSettingsRef = ref; }, "aria-label": this.i18nMessage('configureTime'), onClick: this.onTimeSettingPanel, disabled: Object.keys(this.state.dataSources).length === 0 },
                                    jsx("div", { className: 'w-100 px-2 text-truncate' }, this.i18nMessage('configureTime'))))),
                    jsx(SettingSection, { role: 'group', title: this.i18nMessage('style'), "aria-label": this.i18nMessage('style') },
                        jsx(SettingRow, { className: 'style-container' }, [TimeStyle.Classic, TimeStyle.Modern].map((tStyle, index) => {
                            const style = tStyle.toLowerCase();
                            return (jsx(Tooltip, { key: index, title: this.i18nMessage(`${style}Style`), placement: 'bottom' },
                                jsx(Button, { icon: true, size: 'sm', type: 'tertiary', active: tStyle === timeStyle, "aria-pressed": tStyle === timeStyle, onClick: () => this.updateConfigForOptions('timeStyle', tStyle) },
                                    jsx(Icon, { width: 104, height: 70, icon: require(`./assets/style_${style}.svg`) }))));
                        }))),
                    jsx(SettingSection, { role: 'grpup', title: this.i18nMessage('appearance'), "aria-label": this.i18nMessage('appearance') },
                        jsx(SettingRow, { label: this.i18nMessage('foregroundColor') },
                            jsx(ThemeColorPicker, { specificTheme: theme2, value: foregroundColor, onChange: color => this.updateConfigForOptions('foregroundColor', color) })),
                        jsx(SettingRow, { label: this.i18nMessage('backgroundColor') },
                            jsx(ThemeColorPicker, { specificTheme: theme2, value: backgroundColor, onChange: color => this.updateConfigForOptions('backgroundColor', color) })),
                        jsx(SettingRow, { label: this.i18nMessage('sliderColor') },
                            jsx(ThemeColorPicker, { specificTheme: theme2, value: sliderColor, onChange: color => this.updateConfigForOptions('sliderColor', color) }))),
                    jsx(SettingSection, { role: 'grpup', title: this.i18nMessage('displayOptions'), "aria-label": this.i18nMessage('displayOptions') },
                        jsx(SettingRow, { label: this.i18nMessage('enablePlayControl') },
                            jsx(Switch, { checked: enablePlayControl, onChange: this.enablePlayControl, "aria-label": this.i18nMessage('enablePlayControl') })),
                        enablePlayControl && jsx(SettingRow, null,
                            jsx(Label, { className: 'w-100 d-flex' },
                                jsx(Checkbox, { style: { cursor: 'pointer', marginTop: '2px' }, checked: autoPlay, onChange: () => this.updateConfigForOptions('autoPlay', !autoPlay) }),
                                jsx("div", { className: 'm-0 ml-2 flex-grow-1 autoplay-label' }, this.i18nMessage('autoPlay'))))),
                    this.state.isTimePanelOpen && jsx(SidePopper, { position: 'right', title: this.i18nMessage('configureTime'), isOpen: true, trigger: (_a = this.timeSettingsRef) === null || _a === void 0 ? void 0 : _a.current, backToFocusNode: this.state.popperFocusNode, toggle: this.onTimeSettingPanel },
                        jsx(TimePanel, Object.assign({ intl: intl, theme: theme, i18nMessage: this.i18nMessage, dataSources: this.state.dataSources, dataSourceType: dataSourceType }, this.getTimeSettings(), { onChange: settings => this.updateConfigForOptions('timeSettings', settings) }))))
                : jsx("div", { className: 'empty-placeholder w-100' },
                    jsx("div", { className: 'empty-placeholder-inner' },
                        jsx("div", { className: 'empty-placeholder-icon' },
                            jsx(ClickOutlined, { size: 48 })),
                        jsx("div", { className: 'empty-placeholder-text', id: 'timeline-blank-msg' }, this.i18nMessage('selectDataPlaceholder'))))));
    }
}
//# sourceMappingURL=setting.js.map