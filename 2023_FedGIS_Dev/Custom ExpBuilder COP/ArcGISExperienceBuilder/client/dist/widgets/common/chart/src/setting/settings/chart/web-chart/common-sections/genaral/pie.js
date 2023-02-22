import { React, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { Title } from './components/title';
import { Legend } from './components/legend';
import { Angle } from './components/angle';
import { InnerRadius } from './components/radius';
export const PieGeneralSetting = (props) => {
    var _a, _b, _c, _d;
    const { value, onChange } = props;
    const title = value.title;
    const footer = value.footer;
    const legend = value.legend;
    const propSeries = value.series;
    const angle = (_b = (_a = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0]) === null || _a === void 0 ? void 0 : _a.startAngle) !== null && _b !== void 0 ? _b : 0;
    const innerRadius = (_d = (_c = propSeries === null || propSeries === void 0 ? void 0 : propSeries[0]) === null || _c === void 0 ? void 0 : _c.innerRadius) !== null && _d !== void 0 ? _d : 0;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const handleTitleChange = (title) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('title', title));
    };
    const onFooterChange = (footer) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('footer', footer));
    };
    const handleAngleChange = (start, end) => {
        let series = Immutable.setIn(propSeries, ['0', 'startAngle'], start);
        series = Immutable.setIn(series, ['0', 'endAngle'], end);
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('series', series));
    };
    const handleInnerRadiusChange = (radius) => {
        const series = Immutable.setIn(propSeries, ['0', 'innerRadius'], radius);
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('series', series));
    };
    const handleLegendChange = (legend) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('legend', legend));
    };
    return (React.createElement("div", { className: 'pie-general-setting w-100 mt-2' },
        React.createElement(Title, { type: 'input', value: title, label: translate('chartTitle'), onChange: handleTitleChange }),
        React.createElement(Title, { type: 'area', value: footer, label: translate('description'), onChange: onFooterChange }),
        React.createElement(Angle, { value: angle, onChange: handleAngleChange }),
        React.createElement(InnerRadius, { value: innerRadius, onChange: handleInnerRadiusChange }),
        React.createElement(Legend, { value: legend, onChange: handleLegendChange })));
};
//# sourceMappingURL=pie.js.map