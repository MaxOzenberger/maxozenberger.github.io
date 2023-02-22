import { React, classNames } from 'jimu-core';
import { TextInput, defaultMessages as jimuMessages, hooks } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { FillSymbolSetting } from '../../components';
import { SeriesColors } from '../../../../../../utils/default';
const presetSeriesColors = SeriesColors.map((color) => ({
    label: color,
    value: color,
    color: color
}));
export const BarSeriesStyle = (props) => {
    var _a;
    const { className, serie, defaultFillColor, defaultLineColor, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuMessages);
    const handleLabelChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('name', value));
    };
    const handleFillSymbolChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(serie.set('fillSymbol', value));
    };
    return (React.createElement("div", { className: classNames('bar-series-style w-100', className) },
        React.createElement(SettingRow, { label: translate('label'), flow: 'no-wrap' },
            React.createElement(TextInput, { size: 'sm', className: 'w-50', defaultValue: (_a = serie === null || serie === void 0 ? void 0 : serie.name) !== null && _a !== void 0 ? _a : '', onAcceptValue: handleLabelChange })),
        React.createElement(SettingRow, { label: translate('symbol'), flow: 'wrap' },
            React.createElement(FillSymbolSetting, { defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, presetFillColors: presetSeriesColors, value: serie === null || serie === void 0 ? void 0 : serie.fillSymbol, onChange: handleFillSymbolChange }))));
};
//# sourceMappingURL=bar-series-style.js.map