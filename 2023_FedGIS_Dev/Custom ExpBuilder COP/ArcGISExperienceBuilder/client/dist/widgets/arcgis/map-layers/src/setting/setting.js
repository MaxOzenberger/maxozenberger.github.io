/** @jsx jsx */
import { React, Immutable, FormattedMessage, jsx, getAppStore, AllDataSourceTypes } from 'jimu-core';
import { Switch, Radio, Label } from 'jimu-ui';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import defaultMessages from './translations/default';
import MapThumb from './components/map-thumb';
import { getStyle } from './lib/style';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene]);
        this.getPortUrl = () => {
            const portUrl = getAppStore().getState().portalUrl;
            return portUrl;
        };
        this.onRadioChange = (useMapWidget) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('useMapWidget', useMapWidget)
            });
            this.setState({
                useMapWidget: useMapWidget
            });
        };
        this.onToolsChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
        };
        this.onOptionsChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled
            });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: useDataSources
            });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.state = {
            useMapWidget: this.props.config.useMapWidget || false
        };
    }
    render() {
        var _a;
        const portalUrl = this.getPortUrl();
        let setDataContent = null;
        let dataSourceSelectorContent = null;
        let mapSelectorContent = null;
        let actionsContent = null;
        let optionsContent = null;
        dataSourceSelectorContent = (jsx("div", { className: 'data-selector-section' },
            jsx(SettingRow, null,
                jsx(DataSourceSelector, { types: this.supportedDsTypes, useDataSources: this.props.useDataSources, useDataSourcesEnabled: true, mustUseDataSource: true, onChange: this.onDataSourceChange, widgetId: this.props.id })),
            portalUrl && this.props.dsJsons && this.props.useDataSources && this.props.useDataSources.length === 1 && jsx(SettingRow, null,
                jsx("div", { className: 'w-100' },
                    jsx("div", { className: 'webmap-thumbnail', title: (_a = this.props.dsJsons[this.props.useDataSources[0].dataSourceId]) === null || _a === void 0 ? void 0 : _a.label },
                        jsx(MapThumb, { mapItemId: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].itemId
                                : null, portUrl: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].portalUrl
                                : null }))))));
        mapSelectorContent = (jsx("div", { className: 'map-selector-section' },
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }))));
        if (this.state.useMapWidget) {
            setDataContent = mapSelectorContent;
            actionsContent = (jsx(React.Fragment, null,
                jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'goto', defaultMessage: defaultMessages.goto }) },
                    jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.goto) || false, "data-key": 'goto', onChange: evt => { this.onToolsChanged(evt.target.checked, 'goto'); } })),
                jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'showOrHideLabels', defaultMessage: defaultMessages.showOrHideLabels }) },
                    jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.label) || false, "data-key": 'goto', onChange: evt => { this.onToolsChanged(evt.target.checked, 'label'); } })),
                jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'transparency', defaultMessage: defaultMessages.layerTransparency }) },
                    jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.opacity) || false, "data-key": 'opacity', onChange: evt => { this.onToolsChanged(evt.target.checked, 'opacity'); } }))));
            optionsContent = (jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'setVisibility', defaultMessage: defaultMessages.setVisibility }) },
                jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.setVisibility) || false, "data-key": 'setVisibility', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'setVisibility'); } })));
        }
        else {
            setDataContent = dataSourceSelectorContent;
        }
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-layerlist' },
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'sourceLabel', defaultMessage: defaultMessages.sourceLabel }) },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'layerlist-tools w-100' },
                            jsx("div", { className: 'w-100' },
                                jsx("div", { className: 'layerlist-tools-item radio' },
                                    jsx(Radio, { id: 'map-data', style: { cursor: 'pointer' }, name: 'map-data', onChange: e => this.onRadioChange(false), checked: !this.state.useMapWidget }),
                                    jsx(Label, { style: { cursor: 'pointer' }, for: 'map-data', className: 'ml-1' }, this.props.intl.formatMessage({ id: 'showLayerForMap', defaultMessage: defaultMessages.showLayerForMap })))),
                            jsx("div", { className: 'w-100' },
                                jsx("div", { className: 'layerlist-tools-item radio' },
                                    jsx(Radio, { id: 'map-view', style: { cursor: 'pointer' }, name: 'map-view', onChange: e => this.onRadioChange(true), checked: this.state.useMapWidget }),
                                    jsx(Label, { style: { cursor: 'pointer' }, for: 'map-view', className: 'ml-1' }, this.props.intl.formatMessage({ id: 'interactWithMap', defaultMessage: defaultMessages.interactWithMap })))))),
                    setDataContent),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'options', defaultMessage: defaultMessages.options }) },
                    actionsContent,
                    jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'information', defaultMessage: defaultMessages.information }) },
                        jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.information) || false, "data-key": 'information', onChange: evt => { this.onToolsChanged(evt.target.checked, 'information'); } })),
                    optionsContent))));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        dsJsons: state.appStateInBuilder.appConfig.dataSources
    };
};
//# sourceMappingURL=setting.js.map