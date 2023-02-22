/** @jsx jsx */
import { React, Immutable, FormattedMessage, jsx, getAppStore } from 'jimu-core';
import { Switch, Radio, Label, FillType, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { DataSourceTypes } from 'jimu-arcgis';
import { defaultMessages as jimuLayoutMessages } from 'jimu-layouts/layout-runtime';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import defaultMessages from './translations/default';
// import MapThumb from './components/map-thumb';
import { getStyle } from './lib/style';
const textIcon = require('jimu-ui/lib/icons/uppercase.svg');
export var CardLayout;
(function (CardLayout) {
    CardLayout["Auto"] = "auto";
    CardLayout["SideBySide"] = "side-by-side";
    CardLayout["Stack"] = "stack";
})(CardLayout || (CardLayout = {}));
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([DataSourceTypes.WebMap, DataSourceTypes.WebScene]);
        this.getPortUrl = () => {
            const portUrl = getAppStore().getState().portalUrl;
            return portUrl;
        };
        this.onOptionsChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
            if (name === 'cardStyle') {
                this.setState({
                    cardStyle: checked
                });
            }
        };
        this.onRadioChange = (cardLayout) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('cardLayout', cardLayout)
            });
            this.setState({
                cardLayoutValue: cardLayout
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
        this.onUseCustomStyleChanged = (checked) => {
            // const style = this.props.config.style ? Immutable(this.props.config.style) : Immutable({} as Style);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'useCustom'], checked)
            });
        };
        this.onFontStyleChanged = (color) => {
            // const style = this.props.config.style ? Immutable(this.props.config.style) : Immutable({} as Style);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'fontColor'], color)
            });
        };
        this.onBackgroundStyleChange = (backgroundColor) => {
            var _a, _b, _c;
            const bg = {
                color: backgroundColor,
                fillType: FillType.FILL
            };
            let background = Immutable((_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.background) !== null && _c !== void 0 ? _c : {});
            for (const key in bg) {
                switch (key) {
                    case 'fillType':
                        if (background.fillType !== bg[key]) {
                            background = background.set('fillType', bg[key]);
                        }
                        break;
                    case 'color':
                        background = background.set('color', bg[key]);
                        break;
                    case 'image':
                        background = background.set('image', bg[key]);
                        break;
                }
            }
            // const style = this.props.config.style ? Immutable(this.props.config.style) : Immutable({} as Style);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'background'], background)
            });
        };
        this.state = {
            cardStyle: this.props.config.cardStyle || false,
            cardLayoutValue: this.props.config.cardLayout || CardLayout.Auto
        };
    }
    getDefaultStyleConfig() {
        return {
            useCustom: false,
            background: {
                color: '',
                fillType: FillType.FILL
            },
            fontColor: ''
        };
    }
    getStyleConfig() {
        if (this.props.config.style && this.props.config.style.useCustom) {
            return this.props.config.style;
        }
        else {
            return this.getDefaultStyleConfig();
        }
    }
    render() {
        // const portalUrl = this.getPortUrl();
        var _a, _b, _c, _d, _e;
        let cardLayoutContent = null;
        if (this.state.cardStyle) {
            cardLayoutContent = (jsx("div", { className: 'card-layout-content pl-2' },
                jsx("div", { className: 'w-100 legend-tools' },
                    jsx("div", { className: 'legend-tools-item card-style-radio' },
                        jsx(Radio, { id: 'auto', style: { cursor: 'pointer' }, name: 'auto', onChange: e => this.onRadioChange(CardLayout.Auto), checked: this.state.cardLayoutValue === CardLayout.Auto }),
                        jsx(Label, { style: { cursor: 'pointer' }, for: 'auto', className: 'ml-1' }, this.props.intl.formatMessage({ id: 'auto', defaultMessage: 'Auto' })))),
                jsx("div", { className: 'w-100 legend-tools' },
                    jsx("div", { className: 'legend-tools-item card-style-radio' },
                        jsx(Radio, { id: 'side-by-side', style: { cursor: 'pointer' }, name: 'side-by-side', onChange: e => this.onRadioChange(CardLayout.SideBySide), checked: this.state.cardLayoutValue === CardLayout.SideBySide }),
                        jsx(Label, { style: { cursor: 'pointer' }, for: 'side-by-side', className: 'ml-1' }, this.props.intl.formatMessage({ id: 'sideBySide', defaultMessage: jimuiDefaultMessage.sideBySide })))),
                jsx("div", { className: 'w-100 legend-tools' },
                    jsx("div", { className: 'legend-tools-item card-style-radio' },
                        jsx(Radio, { id: 'stack', style: { cursor: 'pointer' }, name: 'stack', onChange: e => this.onRadioChange(CardLayout.Stack), checked: this.state.cardLayoutValue === CardLayout.Stack }),
                        jsx(Label, { style: { cursor: 'pointer' }, for: 'stack', className: 'ml-1' }, this.props.intl.formatMessage({ id: 'stack', defaultMessage: jimuLayoutMessages.stack }))))));
        }
        let displayStyleContent;
        if ((_a = this.props.config.style) === null || _a === void 0 ? void 0 : _a.useCustom) {
            displayStyleContent = 'block';
        }
        else {
            displayStyleContent = 'none';
        }
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-setting-legend' },
                jsx(SettingSection, { className: 'map-selector-section', title: this.props.intl.formatMessage({ id: 'sourceLabel', defaultMessage: defaultMessages.sourceLabel }) },
                    jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'selectMapWidget', defaultMessage: defaultMessages.selectMapWidget }) }),
                    jsx(SettingRow, null,
                        jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }))),
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'options', defaultMessage: defaultMessages.options }) },
                    jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'showBaseMap', defaultMessage: defaultMessages.showBaseMap }) },
                        jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.showBaseMap) || false, "data-key": 'showBaseMap', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'showBaseMap'); } })),
                    jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'cardStyle', defaultMessage: defaultMessages.cardStyle }) },
                        jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.cardStyle) || false, "data-key": 'cardStyle', onChange: evt => { this.onOptionsChanged(evt.target.checked, 'cardStyle'); } })),
                    jsx(SettingRow, { flow: 'wrap' }, cardLayoutContent)),
                jsx(SettingSection, null,
                    jsx(SettingRow, { className: 'advanced-setting-row', label: jsx(FormattedMessage, { id: 'advance', defaultMessage: 'Advanced' }) },
                        jsx(Switch, { className: 'can-x-switch', checked: this.getStyleConfig().useCustom || false, "data-key": 'showBaseMap', onChange: evt => { this.onUseCustomStyleChanged(evt.target.checked); } })),
                    jsx("div", { className: 'mt-3', style: { display: displayStyleContent } },
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'font', defaultMessage: 'Font' }) },
                            jsx(ThemeColorPicker, { icon: textIcon, type: 'with-icon', specificTheme: this.props.theme2, value: this.getStyleConfig().fontColor || ((_d = (_c = (_b = this.props.theme2.arcgis.widgets.legend.variants) === null || _b === void 0 ? void 0 : _b.default) === null || _c === void 0 ? void 0 : _c.root) === null || _d === void 0 ? void 0 : _d.color) || '', onChange: this.onFontStyleChanged })),
                        jsx(SettingRow, { label: jsx(FormattedMessage, { id: 'background', defaultMessage: 'Background' }) },
                            jsx(ThemeColorPicker, { specificTheme: this.props.theme2, value: ((_e = this.getStyleConfig().background) === null || _e === void 0 ? void 0 : _e.color) || this.props.theme2.surfaces[1].bg || '', onChange: this.onBackgroundStyleChange })))))));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        dsJsons: state.appStateInBuilder.appConfig.dataSources
    };
};
//# sourceMappingURL=setting.js.map