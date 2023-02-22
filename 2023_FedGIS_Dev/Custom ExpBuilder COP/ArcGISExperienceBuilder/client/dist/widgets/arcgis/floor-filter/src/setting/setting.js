/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Checkbox, Label, Select } from 'jimu-ui';
import { MapWidgetSelector, SettingSection } from 'jimu-ui/advanced/setting-components';
import i18n from './translations/default';
import './style.css';
export default class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handleDisplayLabelChange = (evt, checked) => {
            if (evt) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('displayLabel', checked)
                });
            }
        };
        this.handleLongNamesChange = (evt, checked) => {
            if (evt) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('longNames', checked)
                });
            }
        };
        this.handleMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.handlePositionChange = (evt) => {
            if (evt) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('position', evt.target.value)
                });
            }
        };
        this.nls = (id) => {
            if (this.props.intl) {
                return this.props.intl.formatMessage({
                    id: id,
                    defaultMessage: i18n[id]
                });
            }
            return id;
        };
    }
    render() {
        const position = this.props.config.position || 'top-left';
        return (jsx(SettingSection, null,
            jsx("div", { className: 'widget-setting-floorfilter-section' },
                jsx(Label, { className: 'widget-setting-floorfilter-label' }, this.nls('floorfilter_setting_selectMap')),
                jsx("div", null,
                    jsx(MapWidgetSelector, { onSelect: this.handleMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }))),
            jsx("div", { className: 'widget-setting-floorfilter-section-b', style: { display: 'none' } },
                jsx(Label, null,
                    jsx(Checkbox, { checked: !!this.props.config.displayLabel, onChange: this.handleDisplayLabelChange }),
                    jsx("span", { className: 'widget-setting-floorfilter-checkbox-label' }, this.nls('floorfilter_setting_displayLabel')))),
            jsx("div", { className: 'widget-setting-floorfilter-section-b' },
                jsx(Label, null,
                    jsx(Checkbox, { checked: !!this.props.config.longNames, onChange: this.handleLongNamesChange }),
                    jsx("span", { className: 'widget-setting-floorfilter-checkbox-label' }, this.nls('floorfilter_setting_longNames')))),
            jsx("div", { className: 'widget-setting-floorfilter-section-b' },
                jsx(Label, { className: 'widget-setting-floorfilter-label' }, this.nls('floorfilter_setting_positioned')),
                jsx("div", null,
                    jsx(Select, { value: position, onChange: this.handlePositionChange },
                        jsx("option", { key: 'top-left', value: 'top-left' }, this.nls('floorfilter_setting_topLeft')),
                        jsx("option", { key: 'top-right', value: 'top-right' }, this.nls('floorfilter_setting_topRight')),
                        jsx("option", { key: 'bottom-left', value: 'bottom-left' }, this.nls('floorfilter_setting_bottomLeft')),
                        jsx("option", { key: 'bottom-right', value: 'bottom-right' }, this.nls('floorfilter_setting_bottomRight')))))));
    }
}
//# sourceMappingURL=setting.js.map