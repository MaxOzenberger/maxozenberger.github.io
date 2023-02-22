/** @jsx jsx */
import { React, jsx, getAppStore } from 'jimu-core';
import { defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { MapWidgetSelector, SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { BaseWidgetSetting } from 'jimu-for-builder';
import defaultMessages from './translations/default';
import { getStyle } from './lib/style';
import InputSetting from './components/input-settings';
import OutputSetting from './components/output-settings';
import AddressSettings from './components/address-settings';
import GeneralSettings from './components/general-settings';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
export default class Setting extends BaseWidgetSetting {
    constructor(props) {
        var _a;
        super(props);
        this.CoordinateConversionViewModel = null;
        this.Format = null;
        this.outputSettingsObj = React.createRef();
        this.nls = (id) => {
            //for unit testing no need to mock intl we can directly use default en msg
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.componentDidMount = () => {
            if (!this.state.apiLoaded) {
                loadArcGISJSAPIModules([
                    'esri/widgets/CoordinateConversion/CoordinateConversionViewModel',
                    'esri/widgets/CoordinateConversion/support/Format'
                ]).then(modules => {
                    [this.CoordinateConversionViewModel, this.Format] = modules;
                    this.setState({
                        apiLoaded: true
                    });
                    this.createCoordinateConversionViewModel();
                });
            }
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.onToggleInputSettings = () => {
            this.setState({
                isInputSettingsOpen: !this.state.isInputSettingsOpen
            });
        };
        this.onToggleOutputSettings = () => {
            this.setState({
                isOutputSettingsOpen: !this.state.isOutputSettingsOpen
            }, () => {
                //Close the output settings popper once the output settings are closed
                if (this.outputSettingsObj && this.outputSettingsObj.current && !this.state.isOutputSettingsOpen) {
                    this.outputSettingsObj.current.closeOutputSettingPopper();
                }
            });
        };
        this.onToggleAddressSettings = () => {
            this.setState({
                isAddressSettingsOpen: !this.state.isAddressSettingsOpen
            });
        };
        this.onToggleGeneralSettings = () => {
            this.setState({
                isGeneralSettingsOpen: !this.state.isGeneralSettingsOpen
            });
        };
        this.updateInputSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn([property], value)
            });
        };
        this.updateOutputSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn([property], value)
            });
        };
        this.updateAddressSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['addressSettings', property], value)
            });
        };
        this.updateGeneralSettings = (property, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['generalSettings', property], value)
            });
        };
        this.state = {
            supportedFormats: [],
            apiLoaded: false,
            isInputSettingsOpen: false,
            isOutputSettingsOpen: false,
            isAddressSettingsOpen: true,
            isGeneralSettingsOpen: false,
            coordinateVM: null
        };
        this.isRTL = false;
        const appState = getAppStore().getState();
        this.isRTL = (_a = appState === null || appState === void 0 ? void 0 : appState.appContext) === null || _a === void 0 ? void 0 : _a.isRTL;
    }
    createCoordinateConversionViewModel() {
        if (!this.state.coordinateVM) {
            const cVM = new this.CoordinateConversionViewModel();
            cVM.watch('messages', () => {
                setTimeout(() => {
                    const allSupportedFormats = [];
                    const addressFormat = {
                        name: 'address',
                        label: this.nls('address'),
                        defaultPattern: '',
                        currentPattern: '',
                        enabled: true,
                        isCustom: false
                    };
                    allSupportedFormats.push(addressFormat);
                    cVM.formats.forEach((format) => {
                        if (format.name !== 'basemap') {
                            const newSupportedFormat = {
                                name: format.name,
                                label: this.nls(format.name),
                                defaultPattern: format.defaultPattern,
                                currentPattern: format.defaultPattern,
                                enabled: true,
                                isCustom: false
                            };
                            allSupportedFormats.push(newSupportedFormat);
                        }
                    });
                    allSupportedFormats.sort((a, b) => a.label.localeCompare(b.label));
                    this.setState({
                        supportedFormats: allSupportedFormats
                    });
                }, 100);
            });
        }
    }
    render() {
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-coordinate-conversion' },
                jsx(SettingSection, { className: 'map-selector-section' },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'text-truncate setting-text-level-0', title: this.nls('selectMapWidgetLabel') }, this.nls('selectMapWidgetLabel'))),
                    jsx(SettingRow, null,
                        jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected.bind(this), useMapWidgetIds: this.props.useMapWidgetIds }))),
                jsx(SettingSection, null,
                    jsx(SettingCollapse, { label: this.nls('addressSettingsLabel'), isOpen: this.state.isAddressSettingsOpen, onRequestOpen: () => this.onToggleAddressSettings(), onRequestClose: () => this.onToggleAddressSettings() },
                        jsx(SettingRow, { flow: 'wrap' },
                            jsx(AddressSettings, { intl: this.props.intl, theme: this.props.theme, portalSelf: this.props.portalSelf, config: this.props.config.addressSettings, isRTL: this.isRTL, onAddressSettingsUpdated: this.updateAddressSettings })))),
                jsx(SettingSection, null,
                    jsx(SettingCollapse, { label: this.nls('inputSettingsLabel'), isOpen: this.state.isInputSettingsOpen, onRequestOpen: () => this.onToggleInputSettings(), onRequestClose: () => this.onToggleInputSettings() },
                        jsx(SettingRow, { flow: 'wrap' },
                            jsx(InputSetting, { allSupportedFormats: this.state.supportedFormats, intl: this.props.intl, theme: this.props.theme, config: this.props.config.inputSettings, onInputSettingsUpdated: this.updateInputSettings })))),
                jsx(SettingSection, null,
                    jsx(SettingCollapse, { label: this.nls('outputSettingsLabel'), isOpen: this.state.isOutputSettingsOpen, onRequestOpen: () => this.onToggleOutputSettings(), onRequestClose: () => this.onToggleOutputSettings() },
                        jsx(SettingRow, { flow: 'wrap' }, this.state.supportedFormats && this.state.supportedFormats.length > 0 &&
                            jsx(OutputSetting, { allSupportedFormats: this.state.supportedFormats, intl: this.props.intl, theme: this.props.theme, config: this.props.config.outputSettings.asMutable(), onOutputSettingsUpdated: this.updateOutputSettings, ref: this.outputSettingsObj })))),
                this.props.useMapWidgetIds && this.props.useMapWidgetIds.length > 0 &&
                    jsx(SettingSection, null,
                        jsx(SettingCollapse, { label: this.nls('generalSettingsLabel'), isOpen: this.state.isGeneralSettingsOpen, onRequestOpen: () => this.onToggleGeneralSettings(), onRequestClose: () => this.onToggleGeneralSettings() },
                            jsx(SettingRow, { flow: 'wrap' },
                                jsx(GeneralSettings, { intl: this.props.intl, theme: this.props.theme, config: this.props.config.generalSettings, onGeneralSettingsUpdated: this.updateGeneralSettings })))))));
    }
}
//# sourceMappingURL=setting.js.map