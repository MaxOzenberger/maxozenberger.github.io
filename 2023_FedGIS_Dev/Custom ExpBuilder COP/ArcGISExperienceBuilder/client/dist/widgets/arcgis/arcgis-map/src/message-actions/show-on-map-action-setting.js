/** @jsx jsx */
import { React, css, jsx, polished, Immutable } from 'jimu-core';
import { Radio } from 'jimu-ui';
import { SymbolSelector, JimuSymbolType } from 'jimu-ui/advanced/map';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../setting/translations/default';
import { withTheme } from 'jimu-theme';
import { loadArcGISJSAPIModules, featureUtils } from 'jimu-arcgis';
class _ShowOnMapActionSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.modalStyle = {
            position: 'absolute',
            top: '0',
            bottom: '0',
            width: '259px',
            height: 'auto',
            borderRight: '',
            borderBottom: '',
            paddingBottom: '1px'
        };
        this.handleIsUseCustomSymbolOption = (isUseCustomSymbol) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                //config: this.props.config.set('isUseCustomSymbol', isUseCustomSymbol)
                config: this.props.config.set('isUseCustomSymbol', isUseCustomSymbol).set('symbolOption', null)
            });
        };
        this.onSymbolChanged = (symbol, type) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.setIn(['symbolOption', type], symbol.toJSON())
            });
        };
        this.onSymbolCreated = (symbol, type) => {
            this.defaultSymbolOption = this.defaultSymbolOption.set(type, symbol === null || symbol === void 0 ? void 0 : symbol.toJSON());
            if (!this.props.config.symbolOption &&
                this.defaultSymbolOption.pointSymbol &&
                this.defaultSymbolOption.polylineSymbol &&
                this.defaultSymbolOption.polygonSymbol) {
                this.props.onSettingChange({
                    actionId: this.props.actionId,
                    config: this.props.config.setIn(['symbolOption'], this.defaultSymbolOption)
                });
            }
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
            [
                this.jsonUtils
            ] = modules;
            this.setState({
                isModulesLoaded: true
            });
        });
        this.props.onSettingChange({
            actionId: this.props.actionId,
            config: this.props.config
        });
    }
    getStyle(theme) {
        return css `
      .setting-header {
        padding: ${polished.rem(10)} ${polished.rem(16)} ${polished.rem(0)} ${polished.rem(16)}
      }

      .deleteIcon {
        cursor: pointer;
        opacity: .8;
      }

      .deleteIcon:hover {
        opacity: 1;
      }
    `;
    }
    render() {
        return (jsx("div", { css: this.getStyle(this.props.theme) },
            jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'symbol', defaultMessage: 'symbol' }) },
                jsx(SettingRow, null,
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx("div", { className: 'align-items-center d-flex' },
                            jsx(Radio, { style: { cursor: 'pointer' }, checked: !this.props.config.isUseCustomSymbol, onChange: () => this.handleIsUseCustomSymbolOption(false) }),
                            jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' } }, this.props.intl.formatMessage({ id: 'mapAction_UseLayerDefinedSymbols', defaultMessage: defaultMessages.mapAction_UseLayerDefinedSymbols }))))),
                jsx(SettingRow, null,
                    jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx("div", { className: 'align-items-center d-flex' },
                            jsx(Radio, { style: { cursor: 'pointer' }, checked: this.props.config.isUseCustomSymbol, onChange: () => this.handleIsUseCustomSymbolOption(true) }),
                            jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' } }, this.props.intl.formatMessage({ id: 'mapAction_UseCustomSymbols', defaultMessage: defaultMessages.mapAction_UseCustomSymbols }))))),
                this.props.config.isUseCustomSymbol && this.jsonUtils && jsx(SettingSection, null,
                    jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'mapAction_Point', defaultMessage: defaultMessages.mapAction_Point }) },
                        jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Point, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Point), onPointSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'pointSymbol'), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'pointSymbol') })),
                    jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'mapAction_Polyline', defaultMessage: defaultMessages.mapAction_Polyline }) },
                        jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polyline, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Polyline), onPolylineSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'polylineSymbol'), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'polylineSymbol') })),
                    jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'mapAction_Polygon', defaultMessage: defaultMessages.mapAction_Polygon }) },
                        jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polygon, symbol: this.getInitSymbolFromConfig(JimuSymbolType.Polygon), onPolygonSymbolChanged: (symbol) => this.onSymbolChanged(symbol, 'polygonSymbol'), onCreated: (symbolParam) => this.onSymbolCreated(symbolParam.symbol, 'polygonSymbol') }))))));
    }
}
_ShowOnMapActionSetting.defaultProps = {
    config: Immutable({
        isUseCustomSymbol: true
    })
};
export default withTheme(_ShowOnMapActionSetting);
//# sourceMappingURL=show-on-map-action-setting.js.map