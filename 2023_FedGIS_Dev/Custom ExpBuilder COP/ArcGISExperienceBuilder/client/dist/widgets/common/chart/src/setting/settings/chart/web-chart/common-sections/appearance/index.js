import { React } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { DefaultBgColor } from '../../../../../../utils/default';
import defaultMessages from '../../../../../translations/default';
import { Background } from './background';
import { ElementPanel } from './element-panel';
import { TextStyle, getTextElements } from './text-style';
import { getLineElements, LineStyle } from './line-style';
import { getSeriesType } from 'jimu-ui/advanced/chart';
export const AppearanceSetting = (props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { webChart, onChange } = props;
    const background = webChart === null || webChart === void 0 ? void 0 : webChart.background;
    const seriesType = getSeriesType(webChart.series);
    const TextElements = React.useMemo(() => getTextElements(seriesType), [seriesType]);
    const LineElements = React.useMemo(() => getLineElements(seriesType), [seriesType]);
    const handleBackgroundChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(webChart.set('background', value || DefaultBgColor));
    };
    return (React.createElement("div", { className: 'appearance-setting w-100' },
        React.createElement(Background, { value: background, onChange: handleBackgroundChange }),
        !!TextElements.length && (React.createElement(ElementPanel, { label: translate('textElements'), title: translate('textElements') },
            React.createElement(TextStyle, { webChart: webChart, elements: TextElements, onChange: onChange }))),
        !!LineElements.length && (React.createElement(ElementPanel, { label: translate('symbolElements'), title: translate('symbolElements') },
            React.createElement(LineStyle, { webChart: webChart, elements: LineElements, onChange: onChange })))));
};
//# sourceMappingURL=index.js.map