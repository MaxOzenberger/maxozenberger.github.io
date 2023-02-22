var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, DataSourceManager } from 'jimu-core';
import { SettingOutlined } from 'jimu-icons/outlined/application/setting';
import { Button, hooks, Label, Radio } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
import defaultMessages from '../../../../../../translations/default';
import { CategoryType } from '../../../../../../../config';
import { DefaultColorMatchOtherColor, getFillSymbol, getSeriesFillColor, SeriesColors } from '../../../../../../../utils/default';
import { convertStripColors, getByFieldPieSlices, useLoadingPieSlices } from './utils';
import { COLORS_SET } from './color-list/colors-selector';
import { ColorList } from './color-list';
import { getTheme2 } from 'jimu-theme';
import { MaxColorCount } from '../../../../../../../constants';
import { getCategoryFieldType, getCategoryType } from '../../../../../../../utils/common/serial';
const defaultFillColor = getSeriesFillColor(0);
const presetSeriesColors = convertStripColors(SeriesColors);
const defaultFillSymbol = Immutable(getFillSymbol(defaultFillColor, 1, 'var(--light-100)'));
const totalNumberLimit = 50;
export const ColorType = (props) => {
    var _a, _b, _c;
    const { series: propSeries, chartDataSource, useDataSources, onChange } = props;
    const appTheme = getTheme2();
    const unmountRef = React.useRef(false);
    hooks.useUnmount(() => { unmountRef.current = true; });
    const translate = hooks.useTranslate(defaultMessages);
    const [open, setOpen] = React.useState(false);
    const [colors, setColors] = React.useState(COLORS_SET[0]);
    const dataSourceId = (_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) === null || _a === void 0 ? void 0 : _a.dataSourceId;
    const dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId);
    const propSerie = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0];
    const propSlices = propSerie === null || propSerie === void 0 ? void 0 : propSerie.slices;
    const query = chartDataSource === null || chartDataSource === void 0 ? void 0 : chartDataSource.query;
    const categoryType = getCategoryType(query);
    const categoryFieldType = getCategoryFieldType(query, dataSourceId);
    const numericFields = (_b = query === null || query === void 0 ? void 0 : query.outStatistics) === null || _b === void 0 ? void 0 : _b.map((outStatistic) => outStatistic.onStatisticField).filter((field) => !!field);
    const [loadSlices, loading] = useLoadingPieSlices(dataSource, query, propSlices, colors, totalNumberLimit);
    const colorType = (_c = propSerie === null || propSerie === void 0 ? void 0 : propSerie.colorType) !== null && _c !== void 0 ? _c : 'singleColor';
    const fillSymbol = propSerie === null || propSerie === void 0 ? void 0 : propSerie.fillSymbol;
    const outline = fillSymbol === null || fillSymbol === void 0 ? void 0 : fillSymbol.outline;
    const singleColor = fillSymbol === null || fillSymbol === void 0 ? void 0 : fillSymbol.color;
    const handleSingleColorChange = (value) => {
        value = value || defaultFillColor;
        const series = Immutable.setIn(propSeries, ['0', 'fillSymbol', 'color'], value);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleColorTypeChange = (type) => __awaiter(void 0, void 0, void 0, function* () {
        if (type === 'singleColor') {
            let series = Immutable.setIn(propSeries, ['0', 'colorType'], type);
            series = Immutable.setIn(series, ['0', 'fillSymbol'], fillSymbol.set('color', defaultFillColor));
            series = series.map(serie => serie.without('slices'));
            onChange === null || onChange === void 0 ? void 0 : onChange(series);
        }
        else if (type === 'colorMatch') {
            if (categoryType === CategoryType.ByGroup) {
                let series = Immutable.setIn(propSeries, ['0', 'colorType'], type);
                series = Immutable.setIn(series, ['0', 'fillSymbol'], fillSymbol.set('color', DefaultColorMatchOtherColor));
                loadSlices(MaxColorCount, outline).then(({ value: slices }) => {
                    if (unmountRef.current)
                        return;
                    series = Immutable.setIn(series, ['0', 'slices'], slices);
                    onChange === null || onChange === void 0 ? void 0 : onChange(series);
                });
            }
            else if (categoryType === CategoryType.ByField) {
                const slices = getByFieldPieSlices(numericFields, COLORS_SET[0], outline);
                let series = Immutable.setIn(propSeries, ['0', 'colorType'], type);
                series = Immutable.setIn(series, ['0', 'fillSymbol'], defaultFillSymbol.set('color', DefaultColorMatchOtherColor));
                series = Immutable.setIn(series, ['0', 'slices'], slices);
                onChange === null || onChange === void 0 ? void 0 : onChange(series);
            }
        }
    });
    const handleSlicesChange = (slices) => {
        const series = Immutable.setIn(propSeries, ['0', 'slices'], slices);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleOtherChange = (fillSymbol) => {
        const series = Immutable.setIn(propSeries, ['0', 'fillSymbol'], fillSymbol);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { label: translate('themeSettingColorMode'), flow: 'wrap' },
            React.createElement("div", { role: 'radiogroup', className: 'w-100' },
                React.createElement("div", { className: 'd-flex align-items-center justify-content-between' },
                    React.createElement(Label, { title: translate('singleColor'), className: 'd-flex align-items-center text-truncate', style: { width: '60%' } },
                        React.createElement(Radio, { name: 'singleColor', className: 'mr-2', checked: colorType === 'singleColor', onChange: () => handleColorTypeChange('singleColor') }),
                        translate('singleColor')),
                    colorType === 'singleColor' && (React.createElement(ThemeColorPicker, { specificTheme: appTheme, presetColors: presetSeriesColors, value: singleColor, onChange: handleSingleColorChange }))),
                React.createElement("div", { className: 'd-flex align-items-center justify-content-between' },
                    React.createElement(Label, { title: translate('byCategory'), className: 'd-flex align-items-center text-truncate', style: { width: '60%' } },
                        React.createElement(Radio, { name: 'radio1', className: 'mr-2', checked: colorType === 'colorMatch', onChange: () => handleColorTypeChange('colorMatch') }),
                        translate('byCategory')),
                    colorType === 'colorMatch' && (React.createElement(Button, { type: 'tertiary', active: open, icon: true, size: 'sm', onClick: () => setOpen(!open) },
                        React.createElement(SettingOutlined, null)))))),
        React.createElement(ColorList, { open: open, onRequestClose: () => setOpen(false), categoryType: categoryType, categoryFieldType: categoryFieldType, loadSlices: loadSlices, loading: loading, value: propSlices, other: fillSymbol, colors: colors, onColorsChange: setColors, onChange: handleSlicesChange, onOtherChange: handleOtherChange })));
};
//# sourceMappingURL=index.js.map