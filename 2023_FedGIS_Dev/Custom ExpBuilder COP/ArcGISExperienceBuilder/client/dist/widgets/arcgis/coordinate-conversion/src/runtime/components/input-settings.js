/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { Icon, Row, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { getInputContainerStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import AddPopper from '../components/add-popper';
import { CoordinateControl } from 'jimu-ui/advanced/coordinate-control';
const iconAddConversion = require('jimu-ui/lib/icons/add.svg');
export default class InputSettings extends React.PureComponent {
    constructor(props) {
        super(props);
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
        this.onAddConversion = () => {
            this.setState({
                isAddConversionPopupOpen: true
            });
        };
        this.addNewConversion = (formatName, label, currentPattern, addAtTheTop) => {
            this.props.addNewConversion(formatName, label, currentPattern, addAtTheTop);
        };
        this.onAddPopperClose = () => {
            this.setState({
                isAddConversionPopupOpen: false
            });
        };
        this.onInputConversionComplete = (conversionResult) => {
            this.props.onConversionComplete(conversionResult.mapCoordinate);
        };
        this.onInputProcessing = (isProcessing) => {
            this.props.processing(isProcessing);
        };
        this.onInputClear = () => {
            this.props.onClear();
        };
        this.addNewFormat = (formatName, label, currentPattern, addAtTheTop) => {
            this.props.addNewConversion(formatName, label, currentPattern, addAtTheTop);
        };
        this.getSupportedFormats = (supportedFormats) => {
            this.setState({
                supportedFormats: supportedFormats
            });
        };
        this.state = {
            supportedFormats: null,
            isAddConversionPopupOpen: false
        };
    }
    render() {
        var _a, _b;
        const inputContainerStyles = getInputContainerStyle(this.props.theme);
        return jsx("div", { css: inputContainerStyles, className: 'input-container shadow' },
            jsx(CoordinateControl, { parentWidgetId: this.props.parentWidgetId, locatorURL: this.props.locatorURL, inputLabelString: this.nls('inputLabel'), defaultCoordinate: this.props.config.inputSettings.defaultCoordinate, defaultFormat: this.props.config.inputSettings.format, zoomScale: this.props.config.generalSettings.zoomScale, defaultPointSymbol: (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.generalSettings) === null || _b === void 0 ? void 0 : _b.defaultPointSymbol, minCandidateScore: this.props.config.addressSettings.minCandidateScore, maxSuggestions: this.props.maxSuggestions, jimuMapview: this.props.jimuMapview, copyAllList: this.props.copyAllList, showCopy: true, showZoom: true, onConversionComplete: this.onInputConversionComplete, processing: this.onInputProcessing, onClear: this.onInputClear, getSupportedFormats: this.getSupportedFormats }),
            jsx(Row, { className: 'pt-5 pl-3 add-button-row', "aria-label": this.nls('addConversion') }, jsx("div", { className: 'addBtn', title: this.nls('addConversion'), id: 'refAdd' + this.props.parentWidgetId, onClick: this.onAddConversion.bind(this) },
                jsx(Icon, { icon: iconAddConversion, size: '16' }))),
            this.state.isAddConversionPopupOpen && this.state.supportedFormats && this.state.supportedFormats.length > 0 &&
                jsx(AddPopper, { theme: this.props.theme, supportedFormats: this.state.supportedFormats, intl: this.props.intl, isOpen: this.state.isAddConversionPopupOpen, onOkClick: this.addNewConversion, onClose: this.onAddPopperClose }));
    }
}
//# sourceMappingURL=input-settings.js.map