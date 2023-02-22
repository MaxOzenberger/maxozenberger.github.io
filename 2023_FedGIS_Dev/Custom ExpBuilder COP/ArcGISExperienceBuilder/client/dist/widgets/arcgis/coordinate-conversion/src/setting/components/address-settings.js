/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, Immutable, SupportedUtilityType } from 'jimu-core';
import { NumericInput, Label, Icon, Tooltip, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { UtilitySelector } from 'jimu-ui/advanced/utility-selector';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getAddressSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
const infoIcon = require('jimu-icons/svg/outlined/suggested/info.svg');
export default class AddressSettings extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c, _d, _e;
        super(props);
        this.geocodeTextBox = React.createRef();
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
            //When using geocode service URL from helper services it was not getting updated in config
            //as we were updating service URL only on OK button click
            // so set geocodeServiceUrl from here it will be updated in config
            this.props.onAddressSettingsUpdated('geocodeServiceUrl', this.state.geocodeLocatorUrl);
        };
        this.onCandidateScoreChange = (value) => {
            this.setState({
                candidateScoreInput: value
            });
            this.props.onAddressSettingsUpdated('minCandidateScore', value);
        };
        this.onMaxSuggestionsChange = (value) => {
            this.setState({
                maxSuggestionsInput: value
            });
            this.props.onAddressSettingsUpdated('maxSuggestions', value);
        };
        this.onUtilityChange = (utilities) => {
            let showDefaultGeocodeUrl = false;
            //if no utility selected show and use the default geocode URL
            if (utilities.length < 1) {
                showDefaultGeocodeUrl = true;
            }
            this.setState({
                showDefaultGeocodeUrl: showDefaultGeocodeUrl,
                utilities: utilities
            });
            this.props.onAddressSettingsUpdated('useUtilitiesGeocodeService', utilities);
        };
        this.geocodeTextBox = React.createRef();
        let geocodeServiceUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
        let showDefaultGeocodeUrl = true;
        if (((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.useUtilitiesGeocodeService) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            showDefaultGeocodeUrl = false;
        }
        else if (this.props.config && this.props.config.geocodeServiceUrl) {
            geocodeServiceUrl = this.props.config.geocodeServiceUrl;
        }
        else if (this.props.portalSelf && this.props.portalSelf.helperServices &&
            this.props.portalSelf.helperServices.geocode &&
            this.props.portalSelf.helperServices.geocode.length > 0 &&
            this.props.portalSelf.helperServices.geocode[0].url) { //Use org's first geocode service if available
            geocodeServiceUrl = this.props.portalSelf.helperServices.geocode[0].url;
        }
        let minCandidateScore = 100;
        if (this.props.config && this.props.config.minCandidateScore) {
            minCandidateScore = this.props.config.minCandidateScore;
        }
        let maxSuggestions = 6;
        if (((_c = this.props.config) === null || _c === void 0 ? void 0 : _c.maxSuggestions) || ((_d = this.props.config) === null || _d === void 0 ? void 0 : _d.maxSuggestions) === 0) {
            maxSuggestions = this.props.config.maxSuggestions;
        }
        this.state = {
            geocodeLocatorUrl: geocodeServiceUrl,
            updateGeocodeLocatorUrl: geocodeServiceUrl,
            candidateScoreInput: minCandidateScore,
            maxSuggestionsInput: maxSuggestions,
            isAlertPopupOpen: false,
            isInvalidValue: false,
            utilities: ((_e = this.props.config) === null || _e === void 0 ? void 0 : _e.useUtilitiesGeocodeService) ? this.props.config.useUtilitiesGeocodeService : [],
            showDefaultGeocodeUrl: showDefaultGeocodeUrl
        };
    }
    render() {
        return jsx("div", { style: { height: '100%', marginTop: '5px' } },
            jsx("div", { css: getAddressSettingsStyle(this.props.theme) },
                jsx(SettingRow, { flow: 'wrap' },
                    jsx(UtilitySelector, { useUtilities: Immutable(this.state.utilities ? this.state.utilities : []), onChange: this.onUtilityChange, showRemove: true, closePopupOnSelect: true, type: SupportedUtilityType.GeoCoding })),
                this.state.showDefaultGeocodeUrl &&
                    jsx(SettingRow, { className: 'locator-url' },
                        jsx(Label, { tabIndex: 0, "aria-label": this.state.geocodeLocatorUrl }, this.state.geocodeLocatorUrl),
                        jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('defaultGeocodeUrlTooltip'), title: this.nls('defaultGeocodeUrlTooltip'), showArrow: true, placement: 'top' },
                            jsx("div", { className: 'ml-2 d-inline defGeocode-tooltip' },
                                jsx(Icon, { size: 14, icon: infoIcon })))),
                jsx(SettingRow, { label: this.nls('minCandidateScore') },
                    jsx(NumericInput, { "aria-label": this.nls('minCandidateScore'), className: 'addrSettingNumericInput', size: 'sm', min: 0, max: 100, defaultValue: this.state.candidateScoreInput, onChange: this.onCandidateScoreChange })),
                jsx(SettingRow, { label: this.nls('maxSuggestions') },
                    jsx(NumericInput, { "aria-label": this.nls('maxSuggestions'), className: 'addrSettingNumericInput', size: 'sm', min: 0, max: 100, defaultValue: this.state.maxSuggestionsInput, onChange: this.onMaxSuggestionsChange }))));
    }
}
//# sourceMappingURL=address-settings.js.map