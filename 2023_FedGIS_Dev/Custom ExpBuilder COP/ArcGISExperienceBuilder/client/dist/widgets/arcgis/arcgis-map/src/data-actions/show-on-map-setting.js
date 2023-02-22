import { React, injectIntl, Immutable } from 'jimu-core';
//import { TextInput } from 'jimu-ui'
import { Radio } from 'jimu-ui';
import { SymbolSelector, JimuSymbolType } from 'jimu-ui/advanced/map';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../setting/translations/default';
import { loadArcGISJSAPIModules, featureUtils } from 'jimu-arcgis';
class _ShowOnMapSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleIsUseCustomSymbolOption = (isUseCustomSymbol) => {
            this.props.onSettingChange(Object.assign({}, this.props.config.set('isUseCustomSymbol', isUseCustomSymbol).set('symbolOption', null)));
        };
        this.onSymbolCreated = (symbol, type) => {
            this.defaultSymbolOption = this.defaultSymbolOption.set(type, symbol === null || symbol === void 0 ? void 0 : symbol.toJSON());
            if (!this.props.config.symbolOption &&
                this.defaultSymbolOption.pointSymbol &&
                this.defaultSymbolOption.polylineSymbol &&
                this.defaultSymbolOption.polygonSymbol) {
                this.props.onSettingChange(Object.assign({}, this.props.config.set('symbolOption', this.defaultSymbolOption)));
            }
        };
        this.onSymbolChanged = (symbol, type) => {
            this.props.onSettingChange(Object.assign({}, this.props.config.setIn(['symbolOption', type], symbol.toJSON())));
        };
        this.getInitSymbolFromConfig = (jimuSymbolType) => {
            let symbol;
            const symbolOption = this.props.config.symbolOption;
            if (this.jsonUtils) {
                if (jimuSymbolType === JimuSymbolType.Point) {
                    symbol = (symbolOption === null || symbolOption === void 0 ? void 0 : symbolOption.pointSymbol) ? symbolOption.pointSymbol : featureUtils.getDefaultSymbol('point');
                }
                else if (jimuSymbolType === JimuSymbolType.Polyline) {
                    symbol = (symbolOption === null || symbolOption === void 0 ? void 0 : symbolOption.polylineSymbol) ? symbolOption.polylineSymbol : featureUtils.getDefaultSymbol('polyline');
                }
                else if (jimuSymbolType === JimuSymbolType.Polygon) {
                    symbol = (symbolOption === null || symbolOption === void 0 ? void 0 : symbolOption.polygonSymbol) ? symbolOption.polygonSymbol : featureUtils.getDefaultSymbol('polygon');
                }
            }
            // @ts-expect-error
            return symbol ? this.jsonUtils.fromJSON(symbol) : null;
        };
        this.jsonUtils = null;
        this.defaultSymbolOption = Immutable({});
        this.state = {
            isModulesLoaded: false
        };
    }
    componentDidMount() {
        loadArcGISJSAPIModules([
            'esri/symbols/support/jsonUtils'
        ]).then(modules => {
            [this.jsonUtils] = modules;
            this.setState({
                isModulesLoaded: true
            });
        });
        this.props.onSettingChange(Object.assign({}, this.props.config));
    }
    render() {
        const pointLabel = this.props.intl.formatMessage({ id: 'mapAction_Point', defaultMessage: defaultMessages.mapAction_Point });
        const polylineLabel = this.props.intl.formatMessage({ id: 'mapAction_Polyline', defaultMessage: defaultMessages.mapAction_Polyline });
        const polygonLabel = this.props.intl.formatMessage({ id: 'mapAction_Polygon', defaultMessage: defaultMessages.mapAction_Polygon });
        return (React.createElement("div", { className: 'w-100' },
            React.createElement(SettingSection, null,
                React.createElement(SettingRow, null,
                    React.createElement("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        React.createElement("div", { className: 'align-items-center d-flex' },
                            React.createElement(Radio, { style: { cursor: 'pointer' }, checked: !this.props.config.isUseCustomSymbol, onChange: () => this.handleIsUseCustomSymbolOption(false) }),
                            React.createElement("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' } }, this.props.intl.formatMessage({ id: 'mapAction_UseLayerDefinedSymbols', defaultMessage: defaultMessages.mapAction_UseLayerDefinedSymbols }))))),
                React.createElement(SettingRow, null,
                    React.createElement("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        React.createElement("div", { className: 'align-items-center d-flex' },
                            React.createElement(Radio, { style: { cursor: 'pointer' }, checked: this.props.config.isUseCustomSymbol, onChange: () => this.handleIsUseCustomSymbolOption(true) }),
                            React.createElement("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' } }, this.props.intl.formatMessage({ id: 'mapAction_UseCustomSymbols', defaultMessage: defaultMessages.mapAction_UseCustomSymbols }))))),
                this.props.config.isUseCustomSymbol && this.jsonUtils && React.createElement(SettingSection, { className: 'pb-0' },
                    React.createElement(SettingRow, { className: 'd-flex justify-content-around' },
                        React.createElement("div", { className: 'symbol-selector d-flex flex-column align-items-center w-25', title: pointLabel },
                            React.createElement(SymbolSelector, { jimuSymbolType: JimuSymbolType.Point, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Point), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'pointSymbol'), onPointSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'pointSymbol') }),
                            React.createElement("label", { className: 'm-0 ml-0 w-100 d-block text-center', style: { cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, pointLabel)),
                        React.createElement("div", { className: 'symbol-selector d-flex flex-column align-items-center w-25', title: polylineLabel },
                            React.createElement(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polyline, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Polyline), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'polylineSymbol'), onPolylineSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'polylineSymbol') }),
                            React.createElement("label", { className: 'm-0 ml-0 w-100 d-block text-center', style: { cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, polylineLabel)),
                        React.createElement("div", { className: 'symbol-selector d-flex flex-column align-items-center w-25', title: polygonLabel },
                            React.createElement(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polygon, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Polygon), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'polygonSymbol'), onPolygonSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'polygonSymbol') }),
                            React.createElement("label", { className: 'm-0 ml-0 w-100 d-block text-center', style: { cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, polygonLabel)))))));
    }
}
_ShowOnMapSetting.defaultProps = {
    config: Immutable({
        isUseCustomSymbol: true
    })
};
export default injectIntl(_ShowOnMapSetting);
//# sourceMappingURL=show-on-map-setting.js.map