var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, classNames } from 'jimu-core';
import { Label, AlertPopup, Button, Switch, Select, Option, Tooltip, Radio, Icon, TextArea, TextInput, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getPopupStyle, getProfileChartStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import { ColorPicker } from 'jimu-ui/basic/color-picker';
import { unitOptions, getConfigIcon } from '../constants';
import StatisticsList from './common-statistics-list';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
const { epConfigIcon } = getConfigIcon();
//regular expression for validating the elevation service url
const urlRegExString = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export default class ProfileChartSettings extends React.PureComponent {
    constructor(props) {
        var _a, _b;
        super(props);
        this.elevationTextBox = React.createRef();
        this.setLinearUnit = (configuredLinearUnit) => {
            var _a;
            if (configuredLinearUnit === '') {
                if (((_a = this.props.portalSelf) === null || _a === void 0 ? void 0 : _a.units) === 'english') {
                    configuredLinearUnit = 'miles';
                }
                else {
                    configuredLinearUnit = 'kilometers';
                }
            }
            this.setState({
                linearUnit: configuredLinearUnit
            });
        };
        this.setElevationUnit = (configuredElevationUnit) => {
            var _a;
            if (configuredElevationUnit === '') {
                if (((_a = this.props.portalSelf) === null || _a === void 0 ? void 0 : _a.units) === 'english') {
                    configuredElevationUnit = 'feet';
                }
                else {
                    configuredElevationUnit = 'meters';
                }
            }
            this.setState({
                elevationUnit: configuredElevationUnit
            });
        };
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
            if (!this.state.apiLoaded) {
                this.loadAPIModule();
            }
        };
        this.componentDidUpdate = (prevProps) => {
            if (prevProps.config.elevationUnit !== this.props.config.elevationUnit) {
                this.setElevationUnit(this.props.config.elevationUnit);
            }
            if (prevProps.config.linearUnit !== this.props.config.linearUnit) {
                this.setLinearUnit(this.props.config.linearUnit);
            }
        };
        this.loadAPIModule = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.state.apiLoaded) {
                return yield loadArcGISJSAPIModules([
                    'esri/request'
                ]).then(modules => {
                    [this.esriRequest] = modules;
                    this.setState({
                        apiLoaded: true
                    });
                });
            }
            return Promise.resolve();
        });
        //Update the config values when the values are modified
        this.onLinearUnitChange = (evt) => {
            this.setState({
                linearUnit: evt.target.value
            }, () => {
                this.props.onProfileChartSettingsUpdated('linearUnit', this.state.linearUnit);
            });
        };
        this.onElevationUnitChange = (evt) => {
            this.setState({
                elevationUnit: evt.target.value
            }, () => {
                this.props.onProfileChartSettingsUpdated('elevationUnit', this.state.elevationUnit);
            });
        };
        this.onSetButtonClicked = () => {
            this.setState({
                isAlertPopupOpen: true,
                isInvalidValue: false
            }, () => {
                setTimeout(() => {
                    //for setting the cursor to the front of textbox
                    const ua = window.jimuUA.browser ? (window.jimuUA.browser.name + '').toLowerCase() : '';
                    if (ua === 'chrome' || ua === 'microsoft edge') {
                        this.elevationTextBox.current.selectionStart = this.elevationTextBox.current.selectionEnd = 0;
                        this.elevationTextBox.current.focus();
                    }
                    else {
                        if (this.props.isRTL) {
                            this.elevationTextBox.current.focus();
                        }
                        else {
                            this.elevationTextBox.current.selectionStart = this.elevationTextBox.current.selectionEnd = 0;
                            this.elevationTextBox.current.focus();
                        }
                    }
                }, 1000);
            });
            setTimeout(() => {
                const currValue = this.state.elevationLayerURL;
                this.setState({
                    updateElevationLayerURL: currValue
                });
            }, 500);
        };
        this.onAlertOkButtonClicked = () => {
            if (this.elevationTextBox.current.value === '') {
                return;
            }
            //Check if valid url is entered, if not then don't hide the Alert popup on ok button
            if (!this.state.isInvalidValue) {
                this.setState({
                    elevationLayerURL: this.elevationTextBox.current.value
                });
                this.props.onProfileChartSettingsUpdated('elevationLayerURL', this.elevationTextBox.current.value);
                this.onAlertCloseButtonClicked();
            }
        };
        this.onAlertCloseButtonClicked = () => {
            this.setState({
                isAlertPopupOpen: false
            });
        };
        this.onInputChange = (value) => {
            return new Promise((resolve) => {
                this.setState({
                    updateElevationLayerURL: value
                });
                if (value && urlRegExString.test(value)) {
                    // validate the elevation service url on change of user input url
                    this._validateElevationService(value).then((isInvalidValue) => {
                        this.setState({
                            isInvalidValue: isInvalidValue
                        }, () => {
                            resolve(this.state.isInvalidValue);
                        });
                    });
                }
                else {
                    this.setState({
                        isInvalidValue: true
                    }, () => {
                        resolve(this.state.isInvalidValue);
                    });
                }
            });
        };
        this._validateElevationService = (value) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                try {
                    this.esriRequest(value, {
                        query: {
                            f: 'json'
                        },
                        responseType: 'json'
                    }).then((result) => {
                        var _a;
                        let isInvalidValue = true;
                        //validate elevation layer with its type
                        if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.cacheType) === 'Elevation') {
                            isInvalidValue = false;
                        }
                        resolve(isInvalidValue);
                    }, (err) => {
                        console.error(err);
                        resolve(true);
                    });
                }
                catch (e) {
                    console.error(e);
                    resolve(true);
                }
            });
        });
        this.ondisplayGroundProfileStatsChange = (evt) => {
            this.props.onProfileChartSettingsUpdated('displayStatistics', evt.target.checked);
        };
        this.onGroundColorChange = (color) => {
            this.props.onProfileChartSettingsUpdated('groundColor', color);
        };
        this.onHighlightGraphicsColorChange = (color) => {
            this.props.onProfileChartSettingsUpdated('graphicsHighlightColor', color);
        };
        this.handleIsUseCustomElevation = (isCustom) => {
            if (!isCustom) {
                setTimeout(() => {
                    this.props.onProfileChartSettingsUpdated('elevationLayerURL', this.state.groundElevationLayer);
                }, 50);
            }
            else {
                setTimeout(() => {
                    this.props.onProfileChartSettingsUpdated('elevationLayerURL', this.state.updateElevationLayerURL);
                }, 50);
            }
            this.props.onProfileChartSettingsUpdated('isCustomElevationLayer', isCustom);
        };
        this.updateStatistics = (newStatistics) => {
            this.props.onProfileChartSettingsUpdated('selectedStatistics', newStatistics);
        };
        this.elevationTextBox = React.createRef();
        //get the configured units
        let configuredElevationUnit = this.props.config.elevationUnit;
        let configuredLinearUnit = this.props.config.linearUnit;
        //if configured units are empty set the units based on portal units
        if (this.props.config.elevationUnit === '') {
            if (((_a = this.props.portalSelf) === null || _a === void 0 ? void 0 : _a.units) === 'english') {
                configuredElevationUnit = 'feet';
            }
            else {
                configuredElevationUnit = 'meters';
            }
        }
        if (this.props.config.linearUnit === '') {
            if (((_b = this.props.portalSelf) === null || _b === void 0 ? void 0 : _b.units) === 'english') {
                configuredLinearUnit = 'miles';
            }
            else {
                configuredLinearUnit = 'kilometers';
            }
        }
        let groundDisabled = false;
        let groundLayer = '';
        this.props.groundLayerInfo.forEach((data) => {
            if (data.dataSourceId === this.props.currentDs) {
                groundDisabled = data.isGroundElevationLayerExists;
                groundLayer = data.groundElevationLayerUrl;
            }
        });
        this.state = {
            apiLoaded: false,
            elevationLayerURL: this.props.config.elevationLayerURL,
            updateElevationLayerURL: this.props.config.elevationLayerURL,
            isGroundDisabled: !groundDisabled,
            groundElevationLayer: groundLayer,
            elevationUnit: configuredElevationUnit,
            linearUnit: configuredLinearUnit,
            isInvalidValue: false,
            isAlertPopupOpen: false
        };
    }
    render() {
        return jsx("div", { style: { height: '100%', width: '100%', marginTop: 5 }, css: getProfileChartStyle(this.props.theme) },
            jsx("div", null,
                jsx(SettingRow, null,
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('elevationLayerLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('elevationLayerLabel'))),
                    jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('elevationLayerTooltip'), title: this.nls('elevationLayerTooltip'), showArrow: true, placement: 'top' },
                        jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                            jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                jsx(SettingRow, null,
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx("div", { className: 'align-items-center d-flex' },
                            jsx(Radio, { role: 'radio', disabled: this.state.isGroundDisabled, className: 'cursor-pointer', onChange: () => this.handleIsUseCustomElevation(false), checked: !this.props.config.isCustomElevationLayer, title: this.nls('useDefaultGround'), "aria-label": this.nls('useDefaultGround') }),
                            jsx("label", { className: classNames('m-0 ml-2 text-break cursor-pointer', this.state.isGroundDisabled ? 'disabled-label' : ' color-label'), onClick: () => !this.state.isGroundDisabled && this.handleIsUseCustomElevation(false) }, this.nls('useDefaultGround'))))),
                jsx(SettingRow, null,
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx("div", { className: 'align-items-center d-flex' },
                            jsx(Radio, { role: 'radio', className: 'cursor-pointer', onChange: () => this.handleIsUseCustomElevation(true), checked: this.props.config.isCustomElevationLayer, "aria-expanded": this.props.config.isCustomElevationLayer, title: this.nls('useCustomElevation'), "aria-label": this.nls('useCustomElevation') }),
                            jsx("label", { className: 'm-0 ml-2 text-break cursor-pointer color-label', onClick: () => this.handleIsUseCustomElevation(true) }, this.nls('useCustomElevation'))))),
                this.props.config.isCustomElevationLayer &&
                    jsx("div", { className: 'pb-3 pt-3' },
                        jsx(SettingRow, null,
                            jsx(TextArea, { role: 'textarea', "aria-label": this.state.elevationLayerURL, height: 76, className: 'w-100', spellCheck: false, value: this.state.elevationLayerURL, onClick: e => e.currentTarget.select(), readOnly: true })),
                        jsx(SettingRow, null,
                            jsx(Button, { role: 'button', "aria-label": this.nls('setServiceLabel'), className: 'w-100 text-dark text-break', type: 'primary', onClick: this.onSetButtonClicked.bind(this) }, this.nls('setServiceLabel')))),
                jsx(SettingRow, { className: 'pt-3 ep-divider-top' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('measurementUnitsHeadingLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('measurementUnitsHeadingLabel'))),
                    jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('measurementUnitsHeadingTooltip'), title: this.nls('measurementUnitsHeadingTooltip'), showArrow: true, placement: 'top' },
                        jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                            jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                jsx(SettingRow, null,
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('elevationUnitLabel'), style: { width: 108 }, className: 'd-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('elevationUnitLabel'))),
                    jsx(Select, { menuRole: 'menu', "aria-label": this.state.elevationUnit, className: 'selectOption', size: 'sm', name: 'elevationUnit', value: this.state.elevationUnit, onChange: this.onElevationUnitChange }, unitOptions.map((option, index) => {
                        return jsx(Option, { role: 'option', "aria-label": option.value, key: index, value: option.value }, this.nls(option.value));
                    }))),
                jsx(SettingRow, null,
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('distanceUnitLabel'), style: { width: 108 }, className: 'd-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('distanceUnitLabel'))),
                    jsx(Select, { menuRole: 'menu', "aria-label": this.state.linearUnit, className: 'selectOption', size: 'sm', name: 'linearUnit', value: this.state.linearUnit, onChange: this.onLinearUnitChange }, unitOptions.map((option, index) => {
                        return jsx(Option, { role: 'option', "aria-label": option.value, key: index, value: option.value }, this.nls(option.value));
                    }))),
                jsx(SettingRow, { className: 'pt-3 ep-divider-top' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('styleLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('styleLabel'))),
                    jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('styleGroundTooltip'), title: this.nls('styleGroundTooltip'), showArrow: true, placement: 'top' },
                        jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                            jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                jsx(SettingRow, { label: this.nls('groundColor') },
                    jsx(ColorPicker, { "aria-label": this.nls('groundColor'), title: this.nls('groundColor'), placement: 'top', offset: [0, 0], showArrow: true, color: this.props.config.groundColor ? this.props.config.groundColor : '#b54900', onChange: this.onGroundColorChange })),
                this.props.currentDs !== 'default' &&
                    jsx(SettingRow, { label: this.nls('chooseHighlightColor') },
                        jsx(ColorPicker, { "aria-label": this.nls('chooseHighlightColor'), title: this.nls('chooseHighlightColor'), placement: 'top', offset: [0, 0], showArrow: true, color: this.props.config.graphicsHighlightColor ? this.props.config.graphicsHighlightColor : '#b54900', onChange: this.onHighlightGraphicsColorChange })),
                jsx(SettingRow, { className: 'pt-3 ep-divider-top' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('displayGroundProfileStatsLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('displayGroundProfileStatsLabel'))),
                    jsx(Switch, { role: 'switch', "aria-label": this.nls('displayGroundProfileStatsLabel'), title: this.nls('displayGroundProfileStatsLabel'), checked: this.props.config.displayStatistics, onChange: this.ondisplayGroundProfileStatsChange })),
                this.props.config.displayStatistics &&
                    jsx("div", null,
                        jsx(StatisticsList, { intl: this.props.intl, theme: this.props.theme, availableStatistics: this.props.config.selectedStatistics, onStatsListUpdated: this.updateStatistics }))),
            jsx(AlertPopup, { isOpen: this.state.isAlertPopupOpen, css: getPopupStyle(this.props.theme), onClickOk: this.onAlertOkButtonClicked.bind(this), onClickClose: this.onAlertCloseButtonClicked, title: this.props.intl ? this.nls('alertPopupTitle') : '' },
                jsx("div", { className: 'popupContents' },
                    jsx("div", { className: 'alertValidationContent' },
                        jsx(TextInput, { className: this.state.isInvalidValue ? 'elevationUrlTextInput w-100 is-invalid' : 'elevationUrlTextInput w-100 is-valid', size: 'sm', type: 'text', ref: this.elevationTextBox, value: this.state.updateElevationLayerURL, onChange: (evt) => this.onInputChange(evt.currentTarget.value) }),
                        jsx("div", { className: this.state.isInvalidValue ? 'invalidServiceURL elevationErrorMessage text-truncate' : 'validServiceURL text-truncate' }, this.nls('invalidElevationLayerURL'))))));
    }
}
//# sourceMappingURL=profile-chart-settings.js.map