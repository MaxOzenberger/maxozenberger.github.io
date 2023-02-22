/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { TextInput, TextArea, Button, Icon, Popper, Label, AlertPopup, Collapse, Row, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { getOutputCoordsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
const iconCopy = require('jimu-ui/lib/icons/duplicate.svg');
const iconSettings = require('jimu-ui/lib/icons/settings-12.svg');
const iconClose = require('jimu-ui/lib/icons/close-12.svg');
const iconReset = require('jimu-ui/lib/icons/reset-outlined-16.svg');
const iconExpandCollapse = require('jimu-ui/lib/icons/arrow-down-16.svg');
export default class OutputFormatsDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.outputLabel = React.createRef();
        this._copyOutputTextbox = React.createRef();
        this._copyDetailsTextbox = React.createRef();
        this.editTextFocus = React.createRef();
        this.details1Input = React.createRef();
        this.details2Input = React.createRef();
        this.details3Input = React.createRef();
        this.details4Input = React.createRef();
        this.componentDidMount = () => {
            this.setDetailSection();
        };
        this.componentDidUpdate = (prevProps) => {
            if (prevProps.displayCoordinates !== this.props.displayCoordinates) {
                this.setDetailSection();
            }
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
        this.onOutputSettingsClick = () => {
            this.setState({
                outputSettingsActive: !this.state.outputSettingsActive
            }, () => {
                //added timeout since alert popup takes some to render
                //set focus to label textbox only once on settings popper open
                setTimeout(() => {
                    this.editTextFocus.current.focus();
                }, 500);
            });
        };
        this.onFormatLabelChange = (e) => {
            const value = e.target.value;
            this.setState({
                currentOutputFormatLabel: value
            });
        };
        this.onFormatLabelAcceptValue = (value) => {
            this.setState({
                currentOutputFormatLabel: value.trim()
            });
        };
        this.onFormatChange = (e) => {
            const value = e.target.value;
            this.setState({
                outputFormatPattern: value
            });
        };
        this.onFormatAcceptValue = (value) => {
            this.setState({
                outputFormatPattern: value.trim()
            });
        };
        this.onResetButtonClick = () => {
            this.setState({
                outputFormatPattern: this.props.conversionInfo.format.defaultPattern
            });
        };
        this.onOutputSettingsOkClicked = () => {
            if (this.props.conversionInfo.format.name !== 'address' &&
                (this.state.currentOutputFormatLabel === '' || this.state.outputFormatPattern === '')) {
                return;
            }
            this.setState({
                outputSettingsActive: false,
                outputFormatLabel: this.state.currentOutputFormatLabel
            }, () => {
                this.props.onCurrentPatternChange(this.props.index, this.state.outputFormatLabel, this.state.outputFormatPattern);
            });
        };
        this.onOutputSettingsCancelClicked = () => {
            //close the output settings and set format to the current selected format
            //get current pattern
            this.setState({
                outputSettingsActive: false,
                outputFormatPattern: this.props.conversionInfo.format.currentPattern,
                currentOutputFormatLabel: this.props.displayLabel || this.props.conversionInfo.format.name
            });
        };
        this.onExpandClick = () => {
            this.setState({
                isOutputFormatExpanded: !this.state.isOutputFormatExpanded
            }, () => {
                this.props.onOutPutSettingsActive(this.props.index, this.state.isOutputFormatExpanded);
            });
        };
        this.onRemoveClick = (evt) => {
            this.setState({
                isRemoveFormatActive: !this.state.isRemoveFormatActive
            });
            this.props.onRemove(this.props.index);
        };
        this.onCopyButtonClick = () => {
            //Remove the existing selection
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            this._copyOutputTextbox.current.select();
            //Copy the contents
            document.execCommand('copy');
            this.setState({
                isCopyMessageOpen: true
            });
            setTimeout(() => {
                //Remove the existing selection
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                this.setState({
                    isCopyMessageOpen: false
                });
            }, 500);
        };
        this.onCoordinateCopyBtnClick = (evt) => {
            let value = '';
            //get the value of specific details (1/2/3/4) as per the clicked button against each details textbox
            //and show the copy popover on for that specific details
            switch (evt.currentTarget.id) {
                case 'refCopyDetails1' + this.props.parentWidgetId + this.props.index:
                    value = this.state.details1Value;
                    this.setState({
                        isDetails1CopyMessageOpen: true
                    });
                    break;
                case 'refCopyDetails2' + this.props.parentWidgetId + this.props.index:
                    value = this.state.details2Value;
                    this.setState({
                        isDetails2CopyMessageOpen: true
                    });
                    break;
                case 'refCopyDetails3' + this.props.parentWidgetId + this.props.index:
                    value = this.state.details3Value;
                    this.setState({
                        isDetails3CopyMessageOpen: true
                    });
                    break;
                case 'refCopyDetails4' + this.props.parentWidgetId + this.props.index:
                    value = this.state.details4Value;
                    this.setState({
                        isDetails4CopyMessageOpen: true
                    });
                    break;
            }
            //set the value in hidden copy details textbox
            //and after timeout copy that value and hide the copy popover
            this.setState({ copyDetailsTextboxValue: value }, () => {
                setTimeout(() => {
                    if (this._copyDetailsTextbox.current) {
                        this._copyDetailsTextbox.current.select();
                        //Copy the contents
                        document.execCommand('copy');
                        this.setState({
                            isDetails1CopyMessageOpen: false,
                            isDetails2CopyMessageOpen: false,
                            isDetails3CopyMessageOpen: false,
                            isDetails4CopyMessageOpen: false
                        });
                    }
                }, 500);
            });
        };
        this.setDetailSection = () => {
            const segments = this.matchSegments();
            if (segments.length > 0) {
                switch (this.props.conversionInfo.format.name) {
                    case 'basemap':
                        this.setState({
                            details1Label: this.nls('xLabel'),
                            details2Label: this.nls('yLabel'),
                            details1Value: segments[0],
                            details2Value: segments[1]
                        });
                        break;
                    case 'xy':
                        this.setState({
                            details1Label: this.nls('lonLabel'),
                            details2Label: this.nls('latLabel'),
                            details1Value: segments[0],
                            details2Value: segments[1]
                        });
                        break;
                    case 'dd':
                        this.setState({
                            details1Label: this.nls('latLabel'),
                            details2Label: this.nls('lonLabel'),
                            details1Value: segments[0],
                            details2Value: segments[2]
                        });
                        break;
                    case 'dms':
                        this.setState({
                            details1Label: this.nls('latLabel'),
                            details2Label: this.nls('lonLabel'),
                            details1Value: segments[0] + ' ' + segments[1] + ' ' + segments[2],
                            details2Value: segments[4] + ' ' + segments[5] + ' ' + segments[6]
                        });
                        break;
                    case 'ddm':
                        this.setState({
                            details1Label: this.nls('latLabel'),
                            details2Label: this.nls('lonLabel'),
                            details1Value: segments[0] + ' ' + segments[1],
                            details2Value: segments[3] + ' ' + segments[4]
                        });
                        break;
                    case 'usng':
                    case 'mgrs':
                        this.setState({
                            details1Label: this.nls('gzdLabel'),
                            details2Label: this.nls('gridSquareLabel'),
                            details3Label: this.nls('eastingLabel'),
                            details4Label: this.nls('northingLabel'),
                            details3Visible: true,
                            details4Visible: true,
                            details1Value: segments[0],
                            details2Value: segments[1],
                            details3Value: segments[2],
                            details4Value: segments[3]
                        });
                        break;
                    case 'utm':
                        this.setState({
                            details1Label: this.nls('zoneLabel'),
                            details2Label: this.nls('bandLabel'),
                            details3Label: this.nls('eastingLabel'),
                            details4Label: this.nls('northingLabel'),
                            details3Visible: true,
                            details4Visible: true,
                            details1Value: segments[0],
                            details2Value: segments[1],
                            details3Value: segments[2],
                            details4Value: segments[3]
                        });
                        break;
                }
            }
        };
        this.matchSegments = () => {
            let coordinate, coordinateSegments;
            const segmentMatches = [];
            if (this.props && this.props.conversionInfo && this.props.conversionInfo.position &&
                this.props.conversionInfo.position.coordinate) {
                coordinate = this.props.conversionInfo.position.coordinate;
                coordinateSegments = this.props.conversionInfo.format.coordinateSegments;
                for (let i = 0; i < coordinateSegments.length; i++) {
                    const segment = coordinateSegments[i];
                    const match = coordinate.match(segment.searchPattern);
                    if (!match) {
                        segmentMatches.push('');
                        continue;
                    }
                    let segmentMatch = match[0];
                    coordinate = coordinate.replace(segmentMatch, '').trim();
                    if (segment.substitution) {
                        const substitutionString = segment.substitution.output(segmentMatch);
                        if (substitutionString) {
                            segmentMatch = substitutionString;
                        }
                    }
                    segmentMatches.push(this.props.isEmpty ? '' : segmentMatch);
                }
            }
            return segmentMatches;
        };
        this.showDetailsCopyMsg = () => {
            let showCopyMsgAt = 0;
            let showMsg = false;
            if (this.state.isDetails1CopyMessageOpen) {
                showCopyMsgAt = 1;
                showMsg = this.state.isDetails1CopyMessageOpen;
            }
            else if (this.state.isDetails2CopyMessageOpen) {
                showCopyMsgAt = 2;
                showMsg = this.state.isDetails2CopyMessageOpen;
            }
            else if (this.state.isDetails3CopyMessageOpen) {
                showCopyMsgAt = 3;
                showMsg = this.state.isDetails3CopyMessageOpen;
            }
            else if (this.state.isDetails4CopyMessageOpen) {
                showCopyMsgAt = 4;
                showMsg = this.state.isDetails4CopyMessageOpen;
            }
            return jsx(Popper, { open: showMsg, version: 0, placement: 'bottom', showArrow: true, reference: 'refCopyDetails' + showCopyMsgAt + this.props.parentWidgetId + this.props.index, offset: [0, 0] },
                jsx("div", { className: 'p-2' }, this.nls('copySuccessMessage')));
        };
        /**
         * Formats value in input box to show minus sign at front in case of RTL
         * @param displayValue : string - Value to be shown in input box
         * @returns : string
         */
        this.formatDisplayCoordinate = (displayValue) => {
            var _a, _b;
            if (this.props.isRTL && ((_b = (_a = this.props.conversionInfo) === null || _a === void 0 ? void 0 : _a.format) === null || _b === void 0 ? void 0 : _b.name) === 'xy' && displayValue && displayValue.charAt(0) === '-') {
                return displayValue.substr(1) + displayValue.substr(0, 1);
            }
            return displayValue;
        };
        this.state = {
            outputSettingsActive: false,
            isCopyMessageOpen: false,
            isDetails1CopyMessageOpen: false,
            isDetails2CopyMessageOpen: false,
            isDetails3CopyMessageOpen: false,
            isDetails4CopyMessageOpen: false,
            isOutputFormatExpanded: !!this.props.isOpen,
            isRemoveFormatActive: false,
            currentOutputFormatLabel: this.props.displayLabel || this.props.conversionInfo.format.name,
            outputFormatLabel: this.props.displayLabel || this.props.conversionInfo.format.name,
            outputFormatPattern: this.props.conversionInfo.format.currentPattern,
            details1Label: '',
            details2Label: '',
            details3Label: '',
            details4Label: '',
            details3Visible: false,
            details4Visible: false,
            details1Value: '',
            details2Value: '',
            details3Value: '',
            details4Value: '',
            copyDetailsTextboxValue: ''
        };
        this.outputLabel = React.createRef();
        this.details1Input = React.createRef();
        this.details2Input = React.createRef();
        this.details3Input = React.createRef();
        this.details4Input = React.createRef();
    }
    render() {
        const outputCoordinateStyles = getOutputCoordsStyle(this.props.theme);
        return jsx("div", { css: outputCoordinateStyles },
            jsx("div", { className: 'outputSection shadow py-2' },
                jsx(Row, { flow: 'wrap', "aria-label": this.state.outputFormatLabel, className: 'pl-3 pr-4' },
                    jsx("div", { className: 'adjust-buttons w-100 align-items-center' },
                        jsx(Label, { id: 'outputFormatLabel' + this.props.parentWidgetId + this.props.index, className: this.props.conversionInfo.format.name === 'address' ? 'w-100 outputSettingsFormatLabel outputSettingsAddressLabel' : 'outputSettingsFormatLabel' }, this.state.outputFormatLabel),
                        jsx(Button, { role: 'button', "aria-labelledby": 'outputFormatLabel' + this.props.parentWidgetId + this.props.index, "aria-haspopup": 'dialog', title: this.nls('outputSettings'), className: this.props.conversionInfo.format.name === 'address' ? 'hidden' : 'actionButton', type: 'tertiary', icon: true, size: 'sm', active: this.state.outputSettingsActive, onClick: this.onOutputSettingsClick.bind(this) },
                            jsx(Icon, { icon: iconSettings, size: '17' })),
                        jsx(Button, { role: 'button', "aria-label": this.state.outputFormatLabel, "aria-disabled": this.props.isEmpty, disabled: this.props.isEmpty, title: this.nls('copy'), className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', active: this.state.isCopyMessageOpen, id: 'refCopy' + this.props.parentWidgetId + this.props.index, onClick: this.onCopyButtonClick.bind(this) },
                            jsx(Icon, { icon: iconCopy, size: '17' })),
                        this.props.conversionInfo.format.name !== 'address' &&
                            jsx("div", { className: this.state.isOutputFormatExpanded ? 'arrow-up' : 'arrow-down' },
                                jsx(Button, { role: 'button', "aria-labelledby": 'outputFormatLabel' + this.props.parentWidgetId + this.props.index, "aria-expanded": this.state.isOutputFormatExpanded, title: this.nls('expandOutput'), className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', onClick: this.onExpandClick.bind(this) },
                                    jsx(Icon, { icon: iconExpandCollapse, size: '17' }))),
                        jsx(Button, { role: 'button', "aria-labelledby": 'outputFormatLabel' + this.props.parentWidgetId + this.props.index, title: this.nls('removeCoordinate'), className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', active: this.state.isRemoveFormatActive, onClick: this.onRemoveClick.bind(this) },
                            jsx(Icon, { icon: iconClose, size: '17' })))),
                jsx("div", { className: 'w-100 outputSettingsCoordinateLabel', ref: this.outputLabel }, this.props.isEmpty ? '' : this.formatDisplayCoordinate(this.props.displayCoordinates)),
                jsx(TextArea, { tabIndex: -1, className: 'hidden-copy-outputCoords', ref: this._copyOutputTextbox, value: this.props.isEmpty ? '' : this.props.displayCoordinates }),
                jsx(AlertPopup, { css: outputCoordinateStyles, "aria-expanded": this.state.outputSettingsActive, isOpen: this.state.outputSettingsActive, onClickOk: this.onOutputSettingsOkClicked.bind(this), onClickClose: this.onOutputSettingsCancelClicked.bind(this), title: this.nls('outputSettingsEditPopupTitle') },
                    jsx("table", { cellPadding: 10 },
                        jsx("tbody", null,
                            jsx("tr", null,
                                jsx("td", null,
                                    jsx(Label, null, this.nls('coordinateLabel'))),
                                jsx("td", null,
                                    jsx(TextInput, { required: true, role: 'textbox', ref: this.editTextFocus, "aria-label": this.nls('coordinateLabel'), size: 'sm', value: this.state.currentOutputFormatLabel, onAcceptValue: this.onFormatLabelAcceptValue, onChange: this.onFormatLabelChange, className: this.state.currentOutputFormatLabel === '' ? 'format-label invalid-value' : 'format-label' }))),
                            jsx("tr", { className: this.props.conversionInfo.format.name === 'address' ? 'hidden' : '' },
                                jsx("td", null,
                                    jsx(Label, null, this.nls('coordinateFormat'))),
                                jsx("td", null,
                                    jsx(TextInput, { required: true, role: 'textbox', "aria-label": this.nls('coordinateFormat'), size: 'sm', value: this.state.outputFormatPattern, onAcceptValue: this.onFormatAcceptValue, onChange: this.onFormatChange, className: this.state.outputFormatPattern === '' ? 'invalid-value' : '' })),
                                jsx("td", null,
                                    jsx(Button, { role: 'button', "aria-label": this.nls('resetFormat'), title: this.nls('resetFormat'), className: 'ml-2', type: 'tertiary', size: 'sm', onClick: this.onResetButtonClick.bind(this) },
                                        jsx(Icon, { icon: iconReset, size: '16' }))))))),
                this.state.isCopyMessageOpen &&
                    jsx(Popper, { open: this.state.isCopyMessageOpen, version: 0, placement: 'bottom', showArrow: true, reference: 'refCopy' + this.props.parentWidgetId + this.props.index, offset: [0, 0] },
                        jsx("div", { className: 'p-2' }, this.nls('copySuccessMessage'))),
                jsx(Collapse, { isOpen: this.state.isOutputFormatExpanded },
                    jsx("div", { className: 'pt-2' },
                        jsx(TextArea, { tabIndex: -1, className: 'hidden-copy-outputCoords', ref: this._copyDetailsTextbox, value: this.state.copyDetailsTextboxValue }),
                        jsx(Row, { flow: 'wrap', "aria-label": this.state.details1Label, className: 'pl-3 pr-4' },
                            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                jsx(Label, { id: 'details1Label' + this.props.parentWidgetId + this.props.index, className: 'details-section-label', title: this.state.details1Label }, this.state.details1Label),
                                jsx(TextInput, { role: 'textbox', "aria-labelledby": 'details1Label' + this.props.parentWidgetId + this.props.index, size: 'sm', className: 'details-section-text', ref: this.details1Input, title: this.formatDisplayCoordinate(this.state.details1Value), value: this.formatDisplayCoordinate(this.state.details1Value), readOnly: true }),
                                jsx(Button, { role: 'button', "aria-label": this.nls('copy') + ' ' + this.state.details1Label, disabled: this.props.isEmpty, title: this.nls('copy') + ' ' + this.state.details1Label, className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', id: 'refCopyDetails1' + this.props.parentWidgetId + this.props.index, active: this.state.isDetails1CopyMessageOpen, onClick: this.onCoordinateCopyBtnClick.bind(this) },
                                    jsx(Icon, { icon: iconCopy, size: '17' })))),
                        jsx(Row, { flow: 'wrap', "aria-label": this.state.details2Label, className: 'pl-3 pr-4 pt-3' },
                            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                jsx(Label, { id: 'details2Label' + this.props.parentWidgetId + this.props.index, className: 'details-section-label', title: this.state.details2Label }, this.state.details2Label),
                                jsx(TextInput, { role: 'textbox', "aria-labelledby": 'details2Label' + this.props.parentWidgetId + this.props.index, size: 'sm', className: 'details-section-text', ref: this.details2Input, title: this.formatDisplayCoordinate(this.state.details2Value), value: this.formatDisplayCoordinate(this.state.details2Value), readOnly: true }),
                                jsx(Button, { role: 'button', "aria-label": this.nls('copy') + ' ' + this.state.details2Label, disabled: this.props.isEmpty, title: this.nls('copy') + ' ' + this.state.details2Label, className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', id: 'refCopyDetails2' + this.props.parentWidgetId + this.props.index, active: this.state.isDetails2CopyMessageOpen, onClick: this.onCoordinateCopyBtnClick.bind(this) },
                                    jsx(Icon, { icon: iconCopy, size: '17' })))),
                        this.state.details3Visible &&
                            jsx(Row, { flow: 'wrap', "aria-label": this.state.details3Label, className: 'pl-3 pr-4 pt-3' },
                                jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                    jsx(Label, { id: 'details3Label' + this.props.parentWidgetId + this.props.index, className: 'details-section-label', title: this.state.details3Label }, this.state.details3Label),
                                    jsx(TextInput, { role: 'textbox', "aria-labelledby": 'details3Label' + this.props.parentWidgetId + this.props.index, size: 'sm', className: 'details-section-text', ref: this.details3Input, title: this.state.details3Value, value: this.state.details3Value, readOnly: true }),
                                    jsx(Button, { role: 'button', "aria-label": this.nls('copy') + ' ' + this.state.details3Label, disabled: this.props.isEmpty, title: this.nls('copy') + ' ' + this.state.details3Label, className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', id: 'refCopyDetails3' + this.props.parentWidgetId + this.props.index, active: this.state.isDetails3CopyMessageOpen, onClick: this.onCoordinateCopyBtnClick.bind(this) },
                                        jsx(Icon, { icon: iconCopy, size: '17' })))),
                        this.state.details3Visible &&
                            jsx(Row, { flow: 'wrap', "aria-label": this.state.details4Label, className: 'pl-3 pr-4 pt-3' },
                                jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                    jsx(Label, { id: 'details4Label' + this.props.parentWidgetId + this.props.index, className: 'details-section-label', title: this.state.details4Label }, this.state.details4Label),
                                    jsx(TextInput, { role: 'textbox', "aria-labelledby": 'details4Label' + this.props.parentWidgetId + this.props.index, size: 'sm', className: 'details-section-text', ref: this.details4Input, title: this.state.details4Value, value: this.state.details4Value, readOnly: true }),
                                    jsx(Button, { role: 'button', "aria-label": this.nls('copy') + ' ' + this.state.details4Label, disabled: this.props.isEmpty, title: this.nls('copy') + ' ' + this.state.details4Label, className: 'actionButton', type: 'tertiary', icon: true, size: 'sm', id: 'refCopyDetails4' + this.props.parentWidgetId + this.props.index, active: this.state.isDetails4CopyMessageOpen, onClick: this.onCoordinateCopyBtnClick.bind(this) },
                                        jsx(Icon, { icon: iconCopy, size: '17' })))),
                        (this.state.isDetails1CopyMessageOpen || this.state.isDetails2CopyMessageOpen ||
                            this.state.isDetails3CopyMessageOpen || this.state.isDetails4CopyMessageOpen) &&
                            this.showDetailsCopyMsg()))));
    }
}
//# sourceMappingURL=output-formats-display.js.map