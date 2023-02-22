/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, Immutable, JimuFieldType } from 'jimu-core';
import { Label, Select, Option, Tooltip, Icon, defaultMessages as jimuUIDefaultMessages, Alert } from 'jimu-ui';
import { FieldSelector } from 'jimu-ui/advanced/data-source-selector';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { getAdvanceSettingsStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import { elevationTypeOptions, elevationTypeOptionsWithoutZ, getConfigIcon, unitOptions } from '../constants';
import LineStylePicker from './line-style-picker';
const { epConfigIcon } = getConfigIcon();
export default class ProfileSettingPopper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.defaultSelectedItem = {
            name: ''
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
        this.onElevationValueChange = (evt) => {
            this.setState({
                elevationType: evt.target.value
            }, () => {
                this.props.updateProfileSettings('elevationSettings', 'type', this.state.elevationType);
            });
        };
        this.onElevationValueUnitChange = (evt) => {
            this.setState({
                elevationUnits: evt.target.value
            }, () => {
                this.props.updateProfileSettings('elevationSettings', 'unit', this.state.elevationUnits);
            });
        };
        this.updateLineStyle = (object, property, value) => {
            this.props.updateProfileSettings(object, property, value);
        };
        this.onOneFieldSelect = (allSelectedFields) => {
            if (allSelectedFields.length === 0) {
                this.setState({
                    oneFields: []
                });
                this.props.updateProfileSettings('elevationSettings', 'field1', '');
            }
            else {
                this.setState({
                    oneFields: [allSelectedFields[0].jimuName]
                });
                this.props.updateProfileSettings('elevationSettings', 'field1', allSelectedFields[0].jimuName);
            }
        };
        this.onTwoFieldSelect = (allSelectedFields) => {
            if (allSelectedFields.length === 0) {
                this.setState({
                    twoFields: []
                });
                this.props.updateProfileSettings('elevationSettings', 'field2', '');
            }
            else {
                this.setState({
                    twoFields: [allSelectedFields[0].jimuName]
                });
                this.props.updateProfileSettings('elevationSettings', 'field2', allSelectedFields[0].jimuName);
            }
        };
        //If layer does not support z value, removed this option from elevation drop down
        if (!this.props.hasSupportForZValue) {
            this.elevationTypeOptions = elevationTypeOptionsWithoutZ;
        }
        else {
            //layer supports z value, include z value option from elevation drop down
            this.elevationTypeOptions = elevationTypeOptions;
        }
        this.defaultSelectedItem.name = this.nls('noSelectionItemLabel');
        this.state = {
            oneFields: this.props.config.elevationSettings.field1 === '' ? [] : [this.props.config.elevationSettings.field1],
            twoFields: this.props.config.elevationSettings.field2 === '' ? [] : [this.props.config.elevationSettings.field2],
            elevationType: this.props.config.elevationSettings.type,
            elevationUnits: this.props.config.elevationSettings.unit
        };
    }
    render() {
        let selectedValueTypeHint;
        if (this.state.elevationType === 'no elevation') {
            selectedValueTypeHint = this.nls('noElevationHint');
        }
        else if (this.state.elevationType === 'z') {
            selectedValueTypeHint = this.nls('noVerticalParamHint');
        }
        return jsx("div", { style: { height: '100%', width: '100%' }, css: getAdvanceSettingsStyle(this.props.theme) },
            jsx(SettingSection, null,
                jsx(SettingRow, { className: 'pt-1' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('elevationSettingLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('elevationSettingLabel'))),
                    jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('elevationSettingTooltip'), title: this.nls('elevationSettingTooltip'), showArrow: true, placement: 'top' },
                        jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                            jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                jsx(SettingRow, null,
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('valueType'), className: 'flex-grow-1 ep-label' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('valueType'))),
                    jsx(Select, { menuRole: 'menu', "aria-label": this.state.elevationType, className: 'selectOption', name: 'elevationValueType', size: 'sm', value: this.state.elevationType, onChange: this.onElevationValueChange }, this.elevationTypeOptions.map((option, index) => {
                        return jsx(Option, { role: 'option', key: index, "aria-label": option.value, value: option.value }, this.nls(option.name));
                    }))),
                jsx(SettingRow, { className: this.state.elevationType === 'one' || this.state.elevationType === 'two' ? '' : 'hidden' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('oneFieldLabel'), className: 'flex-grow-1 ep-label' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('oneFieldLabel'))),
                    jsx(FieldSelector, { className: 'fieldSelectorWidth', dataSources: [this.props.selectedLayerDataSource.layer], isSearchInputHidden: true, onChange: this.onOneFieldSelect.bind(this), isDataSourceDropDownHidden: true, useDropdown: true, selectedFields: Immutable(this.state.oneFields), isMultiple: false, types: Immutable([JimuFieldType.Number]), noSelectionItem: this.defaultSelectedItem })),
                jsx(SettingRow, { className: this.state.elevationType === 'two' ? '' : 'hidden' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('twoFieldLabel'), className: 'flex-grow-1 ep-label' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('twoFieldLabel'))),
                    jsx(FieldSelector, { className: 'fieldSelectorWidth', dataSources: [this.props.selectedLayerDataSource.layer], isSearchInputHidden: true, onChange: this.onTwoFieldSelect.bind(this), isDataSourceDropDownHidden: true, useDropdown: true, selectedFields: Immutable(this.state.twoFields), types: Immutable([JimuFieldType.Number]), isMultiple: false, noSelectionItem: this.defaultSelectedItem })),
                jsx(SettingRow, { className: this.state.elevationType === 'no elevation' || (this.state.elevationType === 'z' && !this.props.hasVerticalUnit) ? 'hint' : 'hidden' },
                    jsx(Label, { tabIndex: 0, "aria-label": selectedValueTypeHint, className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, selectedValueTypeHint))),
                jsx(SettingRow, { className: this.state.elevationType === 'no elevation' || this.state.elevationType === 'z' ? 'hidden' : '' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('valueUnit'), className: 'flex-grow-1 ep-label' },
                        jsx("div", { className: 'flex-grow-1 text-break setting-text-level-3' }, this.nls('valueUnit'))),
                    jsx(Select, { menuRole: 'menu', "aria-label": this.state.elevationUnits, className: 'selectOption', name: 'valueunit', size: 'sm', value: this.state.elevationUnits, onChange: this.onElevationValueUnitChange }, unitOptions.map((option, index) => {
                        return jsx(Option, { role: 'option', "aria-label": option.value, key: index, value: option.value }, this.nls(option.value));
                    }))),
                this.props.config.distanceSettings.type !== 'map' &&
                    jsx(React.Fragment, null,
                        jsx(SettingRow, { className: 'pt-3 ep-divider-top' },
                            jsx(Label, { tabIndex: 0, "aria-label": this.nls('distanceSettingLabel'), className: 'w-100 d-flex' },
                                jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('distanceSettingLabel')))),
                        jsx(SettingRow, null,
                            jsx("div", { title: this.nls('distanceSettingsWarning') },
                                jsx(Alert, { tabIndex: 0, className: 'warningMsg', text: this.nls('distanceSettingsWarning'), type: 'warning' })))),
                jsx(SettingRow, { className: 'pt-3 ep-divider-top' },
                    jsx(Label, { tabIndex: 0, "aria-label": this.nls('styleLabel'), className: 'w-100 d-flex' },
                        jsx("div", { className: 'flex-grow-1 text-break color-label setting-text-level-1' }, this.nls('styleLabel'))),
                    jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('styleProfileGraphTooltip'), title: this.nls('styleProfileGraphTooltip'), showArrow: true, placement: 'top' },
                        jsx("div", { className: 'ml-2 d-inline ep-tooltip' },
                            jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
                jsx(SettingRow, null,
                    jsx(LineStylePicker, { intl: this.props.intl, lineItem: 'style', onLineStyleChange: this.updateLineStyle, config: this.props.config.style }))));
    }
}
//# sourceMappingURL=profile-settings-popper.js.map