import { React, classNames } from 'jimu-core';
import { TextInput, defaultMessages as jimuMessages, hooks, Switch } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { LineSymbolSetting, MarkSymbolSetting } from '../../components';
import { SeriesColors } from '../../../../../../utils/default';
const presetSeriesColors = SeriesColors.map((color) => ({
    label: color,
    value: color,
    color: color
}));
export const LineSeriesStyle = (props) => {
    var _a, _b;
    const { className, serie, defaultFillColor, defaultLineColor, onChange } = props;
    const markerVisible = (_a = serie === null || serie === void 0 ? void 0 : serie.markerVisible) !== null && _a !== void 0 ? _a : false;
    const translate = hooks.useTranslate(defaultMessages, jimuMessages);
    const handleLabelChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('name', value));
    };
    const handleLineSymbolChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('lineSymbol', value));
    };
    const handleMarkerVisibleChange = (evt) => {
        const visible = evt.target.checked;
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('markerVisible', visible));
    };
    const handleMarkerSymbolChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('markerSymbol', value));
    };
    return (React.createElement("div", { className: classNames('line-series-style w-100', className) },
        React.createElement(SettingRow, { label: translate('label'), flow: 'no-wrap' },
            React.createElement(TextInput, { size: 'sm', className: 'w-50', defaultValue: (_b = serie === null || serie === void 0 ? void 0 : serie.name) !== null && _b !== void 0 ? _b : '', onAcceptValue: handleLabelChange })),
        React.createElement(SettingRow, { label: translate('symbol'), flow: 'wrap' },
            React.createElement(LineSymbolSetting, { defaultColor: defaultFillColor, presetColors: presetSeriesColors, value: serie.lineSymbol, onChange: handleLineSymbolChange })),
        React.createElement(SettingRow, { label: translate('valuePoint') },
            React.createElement(Switch, { checked: markerVisible, onChange: handleMarkerVisibleChange })),
        markerVisible && React.createElement(MarkSymbolSetting, { className: 'mt-2', defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, presetFillColors: presetSeriesColors, presetLineColors: presetSeriesColors, value: serie === null || serie === void 0 ? void 0 : serie.markerSymbol, onChange: handleMarkerSymbolChange })));
};
//# sourceMappingURL=line-series-style.js.map