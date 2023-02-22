/** @jsx jsx */
import { React, Immutable, FormattedMessage, css, jsx, DataSourceManager, getAppStore, polished, classNames, AllDataSourceTypes } from 'jimu-core';
import { Switch, ImageWithParam, Radio, defaultMessages as mapDefaultMessages, Select } from 'jimu-ui';
import { MapStatesEditor } from 'jimu-ui/advanced/map';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { ColorPicker } from 'jimu-ui/basic/color-picker';
import { builderAppSync } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { SceneQualityMode } from '../config';
import defaultMessages from './translations/default';
import MapThumb from '../../src/runtime/components/map-thumb';
import ToolModules from '../../src/runtime/layout/tool-modules-config';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.unmount = false;
        this.dsManager = DataSourceManager.getInstance();
        this.integratedDataSourceSetting = {};
        this.supportedDsTypes = Immutable([AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene]);
        this.presetColors = [
            { label: '#00FFFF', value: '#00FFFF', color: '#00FFFF' },
            { label: '#FF9F0A', value: '#FF9F0A', color: '#FF9F0A' },
            { label: '#089BDC', value: '#089BDC', color: '#089BDC' },
            { label: '#FFD159', value: '#FFD159', color: '#FFD159' },
            { label: '#74B566', value: '#74B566', color: '#74B566' },
            { label: '#FF453A', value: '#FF453A', color: '#FF453A' },
            { label: '#9868ED', value: '#9868ED', color: '#9868ED' },
            { label: '#43ABEB', value: '#43ABEB', color: '#43ABEB' }
        ];
        this.getPortUrl = () => {
            const portUrl = getAppStore().getState().portalUrl;
            return portUrl;
        };
        this.hasWebSceneDataSource = () => {
            var _a;
            return (_a = this.props.useDataSources) === null || _a === void 0 ? void 0 : _a.some(useDataSource => { var _a; return ((_a = this.props.dsJsons[useDataSource.dataSourceId]) === null || _a === void 0 ? void 0 : _a.type) === 'WEB_SCENE'; });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            if (!this.props.useDataSources || useDataSources.length === this.props.useDataSources.length) {
                this.props.onSettingChange({
                    id: this.props.id,
                    useDataSources: useDataSources
                });
            }
            else if (useDataSources.length > this.props.useDataSources.length) {
                const currentSelectedDs = useDataSources.find(ds => !this.props.useDataSources.some(uDs => uDs.dataSourceId === ds.dataSourceId));
                this.onDataSourceSelected(currentSelectedDs);
            }
            else {
                const currentRemovedDs = this.props.useDataSources.find(uDs => !useDataSources.some(ds => uDs.dataSourceId === ds.dataSourceId));
                this.onDataSourceRemoved(currentRemovedDs);
            }
        };
        this.onDataSourceSelected = (currentSelectedDs) => {
            if (!currentSelectedDs) {
                return;
            }
            let tempUseDataSources = [];
            tempUseDataSources = Object.assign(tempUseDataSources, this.props.useDataSources);
            tempUseDataSources.push(currentSelectedDs);
            this.integratedDataSourceSetting = {
                id: this.props.id,
                useDataSources: Immutable(tempUseDataSources)
            };
            const settingOption = Object.assign({}, this.integratedDataSourceSetting);
            // eslint-disable-next-line
            settingOption.config = this.props.config.set('initialMapDataSourceID', currentSelectedDs.dataSourceId).set('isUseCustomMapState', false).set('initialMapState', null),
                this.props.onSettingChange(settingOption);
        };
        this.onDataSourceRemoved = (currentRemovedDs) => {
            if (!currentRemovedDs) {
                return;
            }
            const removedDatasourceId = currentRemovedDs.dataSourceId;
            // remove related useDataSource
            let tempUseDataSources = [];
            tempUseDataSources = Object.assign(tempUseDataSources, this.props.useDataSources);
            for (let i = 0; i < tempUseDataSources.length; i++) {
                if (tempUseDataSources[i].dataSourceId === removedDatasourceId) {
                    tempUseDataSources.splice(i, 1);
                    break;
                }
            }
            const settingChange = {
                id: this.props.id,
                useDataSources: Immutable(tempUseDataSources)
            };
            let settingOption = {};
            this.integratedDataSourceSetting = settingChange;
            settingOption = Object.assign({}, this.integratedDataSourceSetting);
            if (tempUseDataSources.length > 0) {
                const initialMapDataSourceID = tempUseDataSources[0] && tempUseDataSources[0].dataSourceId;
                settingOption.config = this.props.config.set('initialMapDataSourceID', initialMapDataSourceID).set('isUseCustomMapState', false).set('initialMapState', null);
            }
            else {
                settingOption.config = this.props.config.set('initialMapDataSourceID', null).set('isUseCustomMapState', false).set('initialMapState', null);
            }
            this.props.onSettingChange(Object.assign({}, settingOption));
        };
        this.onMapToolsChanged = (checked, name) => {
            if (name === 'canSelect') {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['toolConfig', 'canSelect'], checked).setIn(['toolConfig', 'canSelectState'], checked)
                });
            }
            else {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['toolConfig', name], checked)
                });
            }
        };
        this.onMapOptionsChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
        };
        this.onSceneQualityModeChnaged = (value, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, value)
            });
        };
        this.onDisableSelection = (useDataSources) => {
            if (useDataSources.length > 1) {
                return true;
            }
            else {
                return false;
            }
        };
        // use for dataSourceSetting cache
        this.initDataSourceSettingOption = () => {
            let tempUseDataSources = [];
            tempUseDataSources = Object.assign(tempUseDataSources, this.props.useDataSources);
            const dataSourceSettingOption = {
                widgetId: this.props.id,
                useDataSources: Immutable(tempUseDataSources)
            };
            this.integratedDataSourceSetting = dataSourceSettingOption;
        };
        this.setInitialMap = (dataSourceId) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('initialMapDataSourceID', dataSourceId)
            });
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'initialMapDataSourceID', value: dataSourceId });
        };
        this.changeToolLaylout = (index) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('layoutIndex', index)
            });
        };
        this.handleMapInitStateChanged = (config) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('initialMapDataSourceID', config.initialMapDataSourceID).set('initialMapState', config.initialMapState)
            });
        };
        this.handleIsUseCustomMapState = (isUseCustomMapState) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('isUseCustomMapState', isUseCustomMapState).set('initialMapState', null)
            });
        };
        this.updateSelectionHighlightColor = (color) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('selectionHighlightColor', color)
            });
        };
        this.updateSelectionHighlightHaloColor = (color) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('selectionHighlightHaloColor', color)
            });
        };
        this.initDataSourceSettingOption();
    }
    getStyle() {
        return css `
      .widget-setting-map{
        font-weight: lighter;
        font-size: 13px;

        .source-descript {
          color: ${this.props.theme.colors.palette.dark[600]};
        }

        .thumbnail-horizontal-revert {
          -moz-transform:scaleX(-1);
          -webkit-transform:scaleX(-1);
          -o-transform:scaleX(-1);
          transform:scaleX(-1);
        }

        .webmap-thumbnail{
          cursor: pointer;
          width: 100%;
          height: 120px;
          overflow: hidden;
          padding: 1px;
          border: ${polished.rem(2)} solid initial;
          img, div{
            width: 100%;
            height: 100%;
          }
        }

        .selected-item{
          border: ${polished.rem(2)} solid ${this.props.theme.colors.palette.primary[700]} !important;
        }

        .webmap-thumbnail-multi{
          cursor: pointer;
          width: 48%;
          height: 100px;
          overflow: hidden;
          padding: 1px;
          border: ${polished.rem(2)} solid initial;
          img, div{
            width: 100%;
            height: 100%;
          }
        }

        .placeholder-container {
          background-color: ${this.props.theme.colors.secondary};
          width: 100%;
          height: 120px;
          position: relative;
        }

        .placeholder-icon {
          top: 40%;
          left: 46%;
          position: absolute;
          fill: ${this.props.theme.colors.palette.dark[300]};
        }

        .choose-btn{
          width: 100%;
        }

        .webmap-tools{
          .webmap-tools-item{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
        }

        .uploadInput {
          position: absolute;
          opacity: 0;
          left: 0;
          top: 0;
          cursor: pointer;
        }

        .uploadInput-container {
          position: relative;
        }

        .setting-map-button{
          cursor: 'pointer';
        }
      }
      .item-selector-popup {
        width: 850px;
        .modal-body {
          max-height: 70vh;
          overflow: auto;
        }
      }`;
    }
    componentDidMount() {
        this.unmount = false;
    }
    componentWillUnmount() {
        this.unmount = true;
    }
    render() {
        var _a, _b;
        const portalUrl = this.getPortUrl();
        const isRTL = getAppStore().getState().appContext.isRTL;
        let sceneQualityModeConten = null;
        if (this.hasWebSceneDataSource()) {
            sceneQualityModeConten = (jsx("div", null,
                jsx("label", null,
                    jsx(FormattedMessage, { id: 'sceneQualityMode', defaultMessage: defaultMessages.sceneQualityMode })),
                jsx(SettingRow, null,
                    jsx(Select, { size: 'sm', value: (this.props.config && this.props.config.sceneQualityMode) || SceneQualityMode.low, onChange: evt => { this.onSceneQualityModeChnaged(evt.target.value, 'sceneQualityMode'); }, className: '' },
                        jsx("option", { key: 2, value: 'low' },
                            jsx(FormattedMessage, { id: 'low', defaultMessage: 'Low' })),
                        jsx("option", { key: 3, value: 'medium' },
                            jsx(FormattedMessage, { id: 'medium', defaultMessage: 'Medium' })),
                        jsx("option", { key: 4, value: 'high' },
                            jsx(FormattedMessage, { id: 'high', defaultMessage: 'High' }))))));
        }
        return (jsx("div", { css: this.getStyle() },
            jsx("div", { className: 'widget-setting-map' },
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'sourceLabel', defaultMessage: defaultMessages.sourceLabel }) },
                    jsx(SettingRow, { flow: 'wrap' },
                        jsx("div", { className: 'source-descript text-break' }, this.props.intl.formatMessage({ id: 'sourceDescript', defaultMessage: defaultMessages.sourceDescript }))),
                    jsx(SettingRow, null,
                        jsx(DataSourceSelector, { isMultiple: true, types: this.supportedDsTypes, buttonLabel: this.props.intl.formatMessage({ id: 'selectMap', defaultMessage: defaultMessages.selectMap }), onChange: this.onDataSourceChange, useDataSources: this.props.useDataSources, disableSelection: this.onDisableSelection, mustUseDataSource: true, widgetId: this.props.id })),
                    portalUrl && this.props.dsJsons && this.props.useDataSources && this.props.useDataSources.length === 1 && jsx(SettingRow, null,
                        jsx("div", { className: 'w-100' },
                            jsx("div", { className: 'webmap-thumbnail selected-item', title: (_a = this.props.dsJsons[this.props.useDataSources[0].dataSourceId]) === null || _a === void 0 ? void 0 : _a.label, onClick: () => { this.setInitialMap(this.props.useDataSources[0].dataSourceId); } },
                                jsx(MapThumb, { mapItemId: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                        ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].itemId
                                        : null, portUrl: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                        ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].portalUrl
                                        : null, theme: this.props.theme })))),
                    portalUrl && this.props.dsJsons && this.props.useDataSources && this.props.useDataSources.length === 2 &&
                        jsx(SettingRow, null,
                            jsx("div", { className: 'w-100 d-flex justify-content-between' },
                                jsx("div", { onClick: () => { this.setInitialMap(this.props.useDataSources[0].dataSourceId); }, title: (_b = this.props.dsJsons[this.props.useDataSources[0].dataSourceId]) === null || _b === void 0 ? void 0 : _b.label, className: classNames('webmap-thumbnail-multi', { 'selected-item': this.props.config.initialMapDataSourceID === this.props.useDataSources[0].dataSourceId }) },
                                    jsx(MapThumb, { mapItemId: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                            ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].itemId
                                            : null, portUrl: this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                                            ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].portalUrl
                                            : null, theme: this.props.theme })),
                                jsx("div", { onClick: () => { this.setInitialMap(this.props.useDataSources[1].dataSourceId); }, title: this.props.dsJsons[this.props.useDataSources[1].dataSourceId].label, className: classNames('webmap-thumbnail-multi', { 'selected-item': this.props.config.initialMapDataSourceID === this.props.useDataSources[1].dataSourceId }) },
                                    jsx(MapThumb, { mapItemId: this.props.dsJsons[this.props.useDataSources[1].dataSourceId]
                                            ? this.props.dsJsons[this.props.useDataSources[1].dataSourceId].itemId
                                            : null, portUrl: this.props.dsJsons[this.props.useDataSources[1].dataSourceId]
                                            ? this.props.dsJsons[this.props.useDataSources[1].dataSourceId].portalUrl
                                            : null, theme: this.props.theme }))))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'initialMapView', defaultMessage: defaultMessages.initialMapView }) },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                            jsx("div", { className: 'align-items-center d-flex' },
                                jsx(Radio, { style: { cursor: 'pointer' }, onChange: () => this.handleIsUseCustomMapState(false), checked: !this.props.config.isUseCustomMapState, title: this.props.intl.formatMessage({ id: 'defaultViewTip', defaultMessage: defaultMessages.defaultViewTip }) }),
                                jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.handleIsUseCustomMapState(false), title: this.props.intl.formatMessage({ id: 'defaultViewTip', defaultMessage: defaultMessages.defaultViewTip }) }, this.props.intl.formatMessage({ id: 'defaultView', defaultMessage: defaultMessages.defaultView }))))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                            jsx("div", { className: 'align-items-center d-flex' },
                                jsx(Radio, { style: { cursor: 'pointer' }, onChange: () => this.handleIsUseCustomMapState(true), checked: this.props.config.isUseCustomMapState, title: this.props.intl.formatMessage({ id: 'customViewTip', defaultMessage: defaultMessages.customViewTip }) }),
                                jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.handleIsUseCustomMapState(true), title: this.props.intl.formatMessage({ id: 'customViewTip', defaultMessage: defaultMessages.customViewTip }) }, this.props.intl.formatMessage({ id: 'customView', defaultMessage: defaultMessages.customView }))))),
                    this.props.config.isUseCustomMapState && jsx(SettingRow, null,
                        jsx("div", { className: 'ml-4' },
                            jsx(MapStatesEditor, { title: this.props.intl.formatMessage({ id: 'setMapView', defaultMessage: defaultMessages.setMapView }), buttonLabel: this.props.intl.formatMessage({ id: 'customViewSet', defaultMessage: defaultMessages.customViewSet }), useDataSources: this.props.useDataSources, jimuMapConfig: this.props.config, id: this.props.id, onConfigChanged: this.handleMapInitStateChanged, isUseWidgetSize: true })))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'toolLabel', defaultMessage: defaultMessages.toolLabel }) },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'w-100 webmap-tools' }, Object.keys(ToolModules).map((key, index) => {
                            if (ToolModules[key].isNeedSetting) {
                                return (jsx("div", { className: 'webmap-tools-item', key: index },
                                    jsx("span", { className: 'text-break', style: { width: '80%' } }, this.props.intl.formatMessage({ id: key + 'Label', defaultMessage: mapDefaultMessages[key + 'Label'] })),
                                    jsx(Switch, { className: 'can-x-switch', checked: (this.props.config.toolConfig && this.props.config.toolConfig[`can${key}`]) || false, onChange: evt => { this.onMapToolsChanged(evt.target.checked, `can${key}`); } })));
                            }
                            else {
                                return null;
                            }
                        })))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'mapLayout', defaultMessage: defaultMessages.mapLayout }) },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'source-descript' }, this.props.intl.formatMessage({ id: 'mapLayout_LargeAndMedium', defaultMessage: defaultMessages.mapLayout_LargeAndMedium }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'w-100 d-flex justify-content-between' },
                            jsx("div", { onClick: () => { this.changeToolLaylout(0); }, className: classNames('webmap-thumbnail-multi border d-flex justify-content-center align-items-center', {
                                    'selected-item': !this.props.config.layoutIndex,
                                    'thumbnail-horizontal-revert': isRTL
                                }) },
                                jsx(ImageWithParam, { imageParam: { url: require('./assets/pc-layout-0.svg') } })),
                            jsx("div", { onClick: () => { this.changeToolLaylout(1); }, className: classNames('webmap-thumbnail-multi border d-flex justify-content-center align-items-center', {
                                    'selected-item': this.props.config.layoutIndex === 1,
                                    'thumbnail-horizontal-revert': isRTL
                                }) },
                                jsx(ImageWithParam, { imageParam: { url: require('./assets/pc-layout-1.svg') } })))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'source-descript' }, this.props.intl.formatMessage({ id: 'mapLayout_Small', defaultMessage: defaultMessages.mapLayout_Small }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'w-100 d-flex justify-content-between' },
                            jsx("div", { className: classNames('webmap-thumbnail-multi border d-flex justify-content-center align-items-center', {
                                    'selected-item': false,
                                    'thumbnail-horizontal-revert': isRTL
                                }), style: { cursor: 'initial' } },
                                jsx(ImageWithParam, { imageParam: { url: require('./assets/mobile-layout-0.svg') } })),
                            jsx("div", null)))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'options', defaultMessage: defaultMessages.options }) },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'w-100 webmap-tools' },
                            jsx("div", { className: 'webmap-tools-item' },
                                jsx("label", null,
                                    jsx(FormattedMessage, { id: 'featureSelectionColor', defaultMessage: defaultMessages.featureSelectionColor }))),
                            jsx("div", { className: 'webmap-tools-item pl-4' },
                                jsx("label", null,
                                    jsx(FormattedMessage, { id: 'featureHighlightFill', defaultMessage: defaultMessages.featureHighlightFill })),
                                jsx("div", null,
                                    jsx(ColorPicker, { style: { padding: '0' }, width: 26, height: 14, color: this.props.config.selectionHighlightColor ? this.props.config.selectionHighlightColor : '#00FFFF', onChange: this.updateSelectionHighlightColor, presetColors: this.presetColors }))),
                            jsx("div", { className: 'webmap-tools-item pl-4' },
                                jsx("label", null,
                                    jsx(FormattedMessage, { id: 'featureHighlightOutline', defaultMessage: defaultMessages.featureHighlightOutline })),
                                jsx("div", null,
                                    jsx(ColorPicker, { style: { padding: '0' }, width: 26, height: 14, color: this.props.config.selectionHighlightHaloColor ? this.props.config.selectionHighlightHaloColor : '#00FFFF', onChange: this.updateSelectionHighlightHaloColor, presetColors: this.presetColors }))),
                            jsx("div", { className: 'webmap-tools-item' },
                                jsx("label", null,
                                    jsx(FormattedMessage, { id: 'enableScrollZoom', defaultMessage: defaultMessages.enableScrollZoom })),
                                jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.disableScroll !== true) /* eslint-disable-line */, "data-key": 'disableScroll', onChange: evt => { this.onMapOptionsChanged(!evt.target.checked, 'disableScroll'); } })),
                            jsx("div", { className: 'webmap-tools-item' },
                                jsx("span", { className: 'text-break', style: { width: '80%' } },
                                    jsx(FormattedMessage, { id: 'enablePopUp', defaultMessage: defaultMessages.enablePopUp })),
                                jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.disablePopUp !== true) /* eslint-disable-line */, "data-key": 'disablePopUp', onChange: evt => { this.onMapOptionsChanged(!evt.target.checked, 'disablePopUp'); } })))),
                    sceneQualityModeConten))));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        dsJsons: state.appStateInBuilder.appConfig.dataSources
    };
};
//# sourceMappingURL=setting.js.map