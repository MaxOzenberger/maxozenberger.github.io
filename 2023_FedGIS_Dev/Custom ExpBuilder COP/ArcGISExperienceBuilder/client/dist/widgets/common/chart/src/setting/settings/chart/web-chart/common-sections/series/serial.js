import { React, Immutable, classNames } from 'jimu-core';
import { Select, hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { WebChartStackedKinds } from 'jimu-ui/advanced/chart';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { SettingCollapse } from '../../../../components';
import { DefaultSeriesOutlineColor, getSeriesFillColor } from '../../../../../../utils/default';
import { getSerialStackedType } from '../../../../../../utils/common/serial';
import { styled } from 'jimu-theme';
import { BarSeriesStyle } from './bar-series-style';
import { LineSeriesStyle } from './line-series-style';
import { TextAlignment, TextAlignments } from '../../components';
const SeriesContainer = styled.div `
  overflow-y: auto;
  max-height: 340px;
`;
const DefaultSeries = Immutable([]);
export const SerialSeriesSetting = (props) => {
    var _a, _b, _c, _d, _e;
    const { series: propSeries = DefaultSeries, onChange } = props;
    const valueLabelVisible = (_b = (_a = propSeries[0]) === null || _a === void 0 ? void 0 : _a.dataLabels.visible) !== null && _b !== void 0 ? _b : false;
    const rotated = (_c = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0]) === null || _c === void 0 ? void 0 : _c.rotated;
    const alignmentName = rotated ? 'horizontalAlignment' : 'verticalAlignment';
    const alignments = TextAlignments[alignmentName];
    const alignment = (_e = (_d = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0]) === null || _d === void 0 ? void 0 : _d.dataLabels.content[alignmentName]) !== null && _e !== void 0 ? _e : alignments[2];
    const [serieIndex, setSerieIndex] = React.useState(-1);
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const handleClick = (index) => {
        setSerieIndex(index);
    };
    const handleChange = (serie) => {
        const series = Immutable.set(propSeries, serieIndex, serie);
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleStackedTypeChange = (evt) => {
        const stackedType = evt.currentTarget.value;
        const series = propSeries === null || propSeries === void 0 ? void 0 : propSeries.map(propSerie => {
            return propSerie.set('stackedType', stackedType);
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleDataLabelsVisibleChange = (evt) => {
        const visible = evt.target.checked;
        const series = propSeries === null || propSeries === void 0 ? void 0 : propSeries.map(propSerie => {
            return propSerie.setIn(['dataLabels', 'visible'], visible);
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    const handleAlignmentChange = (alignment) => {
        const series = propSeries === null || propSeries === void 0 ? void 0 : propSeries.map(propSerie => {
            return propSerie.setIn(['dataLabels', 'content', alignmentName], alignment);
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(series);
    };
    return (React.createElement("div", { className: 'serial-series-setting w-100' },
        React.createElement(SettingRow, { label: translate('stacking'), className: "mt-2" },
            React.createElement(Select, { size: 'sm', className: 'w-50', value: getSerialStackedType(propSeries), onChange: handleStackedTypeChange },
                React.createElement("option", { value: WebChartStackedKinds.Side }, translate(WebChartStackedKinds.Side)),
                React.createElement("option", { value: WebChartStackedKinds.Stacked }, translate(WebChartStackedKinds.Stacked)),
                React.createElement("option", { value: WebChartStackedKinds.Stacked100 }, translate(WebChartStackedKinds.Stacked100)))),
        React.createElement(SettingRow, { label: translate('valueLabel') },
            React.createElement(Switch, { checked: valueLabelVisible, onChange: handleDataLabelsVisibleChange })),
        valueLabelVisible && React.createElement(SettingRow, { truncateLabel: true, className: 'label-alignment w-100 mt-2', label: translate('alignment'), flow: 'no-wrap' },
            React.createElement(TextAlignment, { vertical: !rotated, className: 'w-50', value: alignment, onChange: handleAlignmentChange })),
        React.createElement(SeriesContainer, { className: 'mt-3' }, propSeries === null || propSeries === void 0 ? void 0 : propSeries.map((serie, index) => {
            const type = serie.type;
            const defaultFillColor = getSeriesFillColor(index);
            const defaultLineColor = DefaultSeriesOutlineColor;
            return (React.createElement(SettingCollapse, { className: classNames({ 'mt-2': index !== 0 }, 'pr-1'), key: index, level: 1, type: 'primary', bottomLine: false, label: serie.name, isOpen: serieIndex === index, onRequestOpen: () => handleClick(index), onRequestClose: () => handleClick(-1) },
                type === 'barSeries' && (React.createElement(BarSeriesStyle, { className: 'mt-4', defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, serie: serie, onChange: handleChange })),
                type === 'lineSeries' && (React.createElement(LineSeriesStyle, { className: 'mt-4', defaultFillColor: defaultFillColor, defaultLineColor: defaultLineColor, serie: serie, onChange: handleChange }))));
        }))));
};
//# sourceMappingURL=serial.js.map