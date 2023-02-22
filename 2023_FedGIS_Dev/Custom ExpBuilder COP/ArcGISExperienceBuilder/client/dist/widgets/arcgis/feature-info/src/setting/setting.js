/** @jsx jsx */
import { React, Immutable, FormattedMessage, jsx, getAppStore, DataSourceComponent } from 'jimu-core';
import { Button, ButtonGroup, Dropdown, DropdownButton, DropdownMenu, DropdownItem, Checkbox, TextArea, DistanceUnits, Select } from 'jimu-ui';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector, AllDataSourceTypes } from 'jimu-ui/advanced/data-source-selector';
import { StyleType, FontSizeType } from '../config';
import defaultMessages from './translations/default';
import { getStyle } from './lib/style';
import { InputUnit } from 'jimu-ui/advanced/style-setting-components';
import { getFeatureLayer } from '../utils';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
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
        this.onPropertyChange = (name, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, value)
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
        this.onStyleTypeChanged = (event) => {
            const styleType = event.target.value;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('styleType', styleType)
            });
        };
        this.onStyleChanged = (key, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', key], value)
            });
        };
        this.onSelectAutoFontSizeType = () => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'fontSizeType'], FontSizeType.auto)
            });
        };
        this.onSelectCustomFontSizeType = () => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'fontSizeType'], FontSizeType.custom)
            });
        };
        this.onFontSizeChanged = (value) => {
            // let fontSize = this.getStyleConfig().fontSize || {};
            // fontSize = {...fontSize, ...value};
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'fontSize'], value)
            });
        };
        this.onFilterChange = (sqlExprObj, dsId) => {
            const useDataSources = this.props.useDataSources;
            if (!useDataSources || !useDataSources[0] || useDataSources[0].dataSourceId !== dsId)
                return;
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [useDataSources[0].setIn(['query', 'where'], sqlExprObj).asMutable({ deep: true })]
            });
        };
        this.onSortChange = (sortData, dsId) => {
            const { useDataSources } = this.props;
            if (!useDataSources || !useDataSources[0] || useDataSources[0].dataSourceId !== dsId)
                return;
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [useDataSources[0].setIn(['query', 'orderBy'], sortData).asMutable({ deep: true })]
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
        this.onDataSourceCreated = (dataSource) => {
            this.dataSource = dataSource;
            this.setDisplayFieldsToConfig(dataSource);
            getFeatureLayer(dataSource).then(featureLayer => {
                var _a, _b, _c, _d, _e;
                // popup capabilities
                const popupContent = (_a = featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.popupTemplate) === null || _a === void 0 ? void 0 : _a.content;
                let popupHasTextContent = false;
                let popupHasMediaContent = false;
                let popupHasAttachmentsContent = false;
                let popupHasTitle = !!((_b = featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.popupTemplate) === null || _b === void 0 ? void 0 : _b.title);
                let popupHasChangeTracking = (_c = featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.popupTemplate) === null || _c === void 0 ? void 0 : _c.lastEditInfoEnabled;
                if (popupContent && popupContent.length) {
                    popupContent.forEach(content => {
                        switch (content.type) {
                            case 'text':
                                popupHasTextContent = true;
                                break;
                            case 'media':
                                popupHasMediaContent = true;
                                break;
                            case 'attachments':
                                popupHasAttachmentsContent = true;
                                break;
                        }
                    });
                }
                else {
                    popupHasTextContent = true;
                    popupHasTitle = true;
                    popupHasMediaContent = false;
                    popupHasAttachmentsContent = false;
                    popupHasChangeTracking = false;
                }
                if (!popupHasTextContent) {
                    this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set('styleType', StyleType.custom)
                    });
                }
                // layer capabilities
                const layerHasAttachment = (_e = (_d = featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.capabilities) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.supportsAttachment;
                const layerHasChangeTracking = !!((featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.editingInfo) && (featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.editFieldsInfo));
                this.setState({
                    popupHasTextContent: popupHasTextContent,
                    popupHasMediaContent: popupHasMediaContent,
                    popupHasAttachmentsContent: popupHasAttachmentsContent,
                    popupHasTitle: popupHasTitle,
                    popupHasChangeTracking: popupHasChangeTracking,
                    layerHasAttachment: layerHasAttachment,
                    layerHasChangeTracking: layerHasChangeTracking
                });
            });
        };
        this.onDataSourceRemoved = () => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: []
            });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.state = {
            useMapWidget: this.props.config.useMapWidget || false,
            popupHasTextContent: true,
            popupHasMediaContent: false,
            popupHasAttachmentsContent: false,
            popupHasTitle: false,
            popupHasChangeTracking: false,
            layerHasAttachment: false,
            layerHasChangeTracking: false
        };
    }
    getStyleConfig() {
        if (this.props.config.style) {
            return this.props.config.style;
        }
        else {
            return {
                textColor: '',
                fontSize: {
                    distance: 0,
                    unit: DistanceUnits.PIXEL
                },
                backgroundColor: ''
            };
        }
    }
    getCapabilities() {
        return {
            supportsTitle: this.state.popupHasTitle,
            supportsMedia: this.state.popupHasMediaContent,
            supportsAttachment: this.state.popupHasAttachmentsContent && this.state.layerHasAttachment,
            supportsChangeTracking: this.state.popupHasChangeTracking && this.state.layerHasChangeTracking
        };
    }
    setDisplayFieldsToConfig(dataSource) {
        var _a;
        const useDataSource = (_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a[0];
        if (!useDataSource || !dataSource) {
            return;
        }
        this.props.onSettingChange({
            id: this.props.id,
            useDataSources: [useDataSource.set('useFieldsInPopupInfo', true).asMutable({ deep: true })]
        });
    }
    render() {
        const mapDsIds = [];
        if (this.props.useDataSources) {
            for (let i = 0; i < this.props.useDataSources.length; i++) {
                mapDsIds.push(this.props.useDataSources[i].dataSourceId);
            }
        }
        // const filterConfig = {};
        // const sortConfig = {};
        const useDataSource = this.props.useDataSources && this.props.useDataSources[0];
        // if(useDataSource && useDataSource.dataSourceId) {
        //   filterConfig[useDataSource.dataSourceId] = useDataSource.query && useDataSource.query.where;
        //   sortConfig[useDataSource.dataSourceId] = useDataSource.query && useDataSource.query.orderBy;
        // }
        let setDataContent = null;
        let dataSourceSelectorContent = null;
        let dataSourceComponentContent = null;
        let mapSelectorContent = null;
        const optionsContent = null;
        if (useDataSource && useDataSource.dataSourceId) {
            dataSourceComponentContent = (jsx(DataSourceComponent, { useDataSource: useDataSource, onDataSourceCreated: this.onDataSourceCreated, query: null }));
        }
        dataSourceSelectorContent = (jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'sourceLabel', defaultMessage: defaultMessages.sourceLabel }) },
            jsx(SettingRow, null,
                jsx(DataSourceSelector, { types: this.supportedDsTypes, useDataSourcesEnabled: true, mustUseDataSource: true, useDataSources: this.props.useDataSources, onChange: this.onDataSourceChange, widgetId: this.props.id }),
                dataSourceComponentContent)));
        mapSelectorContent = (jsx(SettingSection, { className: 'map-selector-section', title: this.props.intl.formatMessage({ id: 'sourceDescript', defaultMessage: 'map widget **' }) },
            jsx(SettingRow, null,
                jsx("div", { className: 'map-selector-descript' }, this.props.intl.formatMessage({ id: 'sourceDescript', defaultMessage: 'set an interactive map **' }))),
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }))));
        if (this.state.useMapWidget) {
            setDataContent = mapSelectorContent;
        }
        else {
            setDataContent = dataSourceSelectorContent;
        }
        let styleContent;
        let styleTypeContent;
        let unitContent;
        if (this.state.popupHasTextContent) {
            styleTypeContent = (jsx(Select, { size: 'sm', value: this.props.config && this.props.config.styleType, onChange: this.onStyleTypeChanged, className: '' },
                jsx("option", { key: 2, value: StyleType.usePopupDefined },
                    jsx(FormattedMessage, { id: 'respectTheSource', defaultMessage: defaultMessages.respectTheSource })),
                jsx("option", { key: 3, value: StyleType.custom },
                    jsx(FormattedMessage, { id: 'custom', defaultMessage: 'abc' }))));
        }
        if (this.props.config.styleType === 'custom') {
            if (this.props.config.style.fontSizeType === FontSizeType.custom) {
                unitContent = (jsx(InputUnit, { style: { width: '6.5rem' }, units: [DistanceUnits.PIXEL, DistanceUnits.PERCENTAGE], className: 'item', min: 1, value: this.getStyleConfig().fontSize, onChange: this.onFontSizeChanged }));
            }
            else {
                unitContent = (jsx(Button, { style: { width: '6.5rem' }, disabled: true, size: 'sm' },
                    jsx(FormattedMessage, { id: 'auto', defaultMessage: 'Auto' })));
            }
            styleContent = (jsx("div", null,
                jsx(SettingRow, { className: 'mt-3', label: jsx(FormattedMessage, { id: 'textSize', defaultMessage: defaultMessages.textSize }) },
                    jsx(ButtonGroup, null,
                        jsx(Dropdown, { activeIcon: true, className: 'dropdown' },
                            jsx(DropdownButton, { size: 'sm', style: { width: 'auto' }, icon: true }),
                            jsx(DropdownMenu, { className: 'dropdown-menu', zIndex: '55', alignment: 'start' },
                                jsx(DropdownItem, { key: 1, active: this.props.config.style.fontSizeType === FontSizeType.auto, onClick: this.onSelectAutoFontSizeType },
                                    jsx(FormattedMessage, { id: 'auto', defaultMessage: 'Auto' })),
                                jsx(DropdownItem, { key: 2, active: this.props.config.style.fontSizeType === FontSizeType.custom, onClick: this.onSelectCustomFontSizeType },
                                    jsx(FormattedMessage, { id: 'custom', defaultMessage: 'Custom' })))),
                        unitContent)),
                jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'textColor', defaultMessage: 'Text color' }) },
                    jsx(ThemeColorPicker, { specificTheme: this.props.theme2, value: this.getStyleConfig().textColor, onChange: value => this.onStyleChanged('textColor', value) }))));
        }
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-featureInfo' },
                setDataContent,
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'detailOptions', defaultMessage: defaultMessages.detailOptions }) },
                    jsx("div", { className: 'featureInfo-options-part' },
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'title', defaultMessage: 'Title' }) },
                            jsx(Checkbox, { className: 'can-x-switch', disabled: !this.getCapabilities().supportsTitle, checked: this.props.config && this.props.config.title, "data-key": 'title', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'title'); } })),
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'content', defaultMessage: defaultMessages.content }) },
                            jsx(Checkbox, { className: 'can-x-switch', checked: this.props.config && this.props.config.fields, "data-key": 'content', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'fields'); } })),
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'media', defaultMessage: defaultMessages.media }) },
                            jsx(Checkbox, { className: 'can-x-switch', disabled: !this.getCapabilities().supportsMedia, checked: this.props.config && this.props.config.media, "data-key": 'media', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'media'); } })),
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'attachments', defaultMessage: defaultMessages.attachments }) },
                            jsx(Checkbox, { className: 'can-x-switch', disabled: !this.getCapabilities().supportsAttachment, checked: this.props.config && this.props.config.attachments, "data-key": 'attachments', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'attachments'); } })),
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'lastEditInfo', defaultMessage: defaultMessages.lastEditInfo }) },
                            jsx(Checkbox, { className: 'can-x-switch', disabled: !this.getCapabilities().supportsChangeTracking, checked: this.props.config && this.props.config.lastEditInfo, "data-key": 'lastEditInfo', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'lastEditInfo'); } })))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'style', defaultMessage: 'Style' }) },
                    styleTypeContent,
                    styleContent),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'general', defaultMessage: 'General' }) },
                    jsx("label", { className: 'second-header' },
                        jsx(FormattedMessage, { id: 'noDataMessage', defaultMessage: defaultMessages.noDataMessage })),
                    jsx(TextArea, { className: 'w-100', name: 'text', id: 'noDeataMessageDefaultText', defaultValue: this.props.config.noDataMessage || this.props.intl.formatMessage({ id: 'noDeataMessageDefaultText', defaultMessage: defaultMessages.noDeataMessageDefaultText }), onBlur: evt => { this.onPropertyChange('noDataMessage', evt.target.value); } })),
                optionsContent)));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        dsJsons: state.appStateInBuilder.appConfig.dataSources
    };
};
//# sourceMappingURL=setting.js.map