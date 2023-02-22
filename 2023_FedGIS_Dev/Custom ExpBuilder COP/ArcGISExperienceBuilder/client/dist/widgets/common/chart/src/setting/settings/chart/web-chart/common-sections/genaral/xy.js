import { React } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { Title } from './components/title';
import { Orientation } from './components/orientation';
import { Legend } from './components/legend';
import { getCorrespondingAlignment } from '../../components';
export const XYGeneralSetting = (props) => {
    var _a;
    const { value, rotatable = true, legendValid = false, onChange } = props;
    const title = value.title;
    const footer = value.footer;
    const legend = value.legend;
    const series = value.series;
    const rotated = (_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.rotated;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const handleTitleChange = (title) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('title', title));
    };
    const onFooterChange = (footer) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('footer', footer));
    };
    const handleLegendChange = (legend) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('legend', legend));
    };
    const handleRotatedChange = (rotated) => {
        var _a;
        const horizontalAlignment = rotated ? 'right' : 'center';
        const verticalAlignment = rotated ? 'middle' : 'top';
        const series = value === null || value === void 0 ? void 0 : value.series.map(serie => serie.set('rotated', rotated)
            .setIn(['dataLabels', 'content', 'horizontalAlignment'], horizontalAlignment)
            .setIn(['dataLabels', 'content', 'verticalAlignment'], verticalAlignment));
        let webChart = value.set('series', series);
        const axes = (_a = value === null || value === void 0 ? void 0 : value.axes) === null || _a === void 0 ? void 0 : _a.map((axis) => {
            var _a, _b;
            if (((_a = axis.valueFormat) === null || _a === void 0 ? void 0 : _a.type) === 'number') {
                const guides = (_b = axis === null || axis === void 0 ? void 0 : axis.guides) === null || _b === void 0 ? void 0 : _b.map((guide) => {
                    const verticalAlignment = getCorrespondingAlignment(guide.label.horizontalAlignment);
                    const horizontalAlignment = getCorrespondingAlignment(guide.label.verticalAlignment);
                    return guide.setIn(['label', 'horizontalAlignment'], horizontalAlignment)
                        .setIn(['label', 'verticalAlignment'], verticalAlignment);
                });
                return axis.set('guides', guides);
            }
            return axis;
        });
        webChart = webChart.set('axes', axes);
        onChange === null || onChange === void 0 ? void 0 : onChange(webChart);
    };
    return (React.createElement("div", { className: 'xy-general-setting w-100 mt-2' },
        React.createElement(Title, { type: 'input', value: title, label: translate('chartTitle'), onChange: handleTitleChange }),
        React.createElement(Title, { type: 'area', value: footer, label: translate('description'), onChange: onFooterChange }),
        rotatable && (React.createElement(Orientation, { value: rotated, onChange: handleRotatedChange })),
        React.createElement(Legend, { value: legend, onChange: handleLegendChange, disabled: !legendValid })));
};
//# sourceMappingURL=xy.js.map