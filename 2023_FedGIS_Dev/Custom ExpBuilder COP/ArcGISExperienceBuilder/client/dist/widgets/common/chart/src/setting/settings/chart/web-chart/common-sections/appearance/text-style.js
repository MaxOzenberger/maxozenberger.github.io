import { React, classNames, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { TextSymbolSetting, TextStyleCollapse } from '../../components';
import { getDefaultAxisLabelColor, getDefaultAxisTitleColor, getDefaultFooterColor, getDefaultLegendLabelColor, getDefaultLegendTitleColor, getDefaultTextColor, getDefaultTitleColor, getDefaultValueLabelColor, isSerialSeries } from '../../../../../../utils/default';
import { RESTHorizontalAlignment, RESTSymbolType } from 'jimu-ui/advanced/chart';
var TextElementPathes;
(function (TextElementPathes) {
    TextElementPathes["ChartTitle"] = "title.content";
    TextElementPathes["ChartDescription"] = "footer.content";
    TextElementPathes["AxisTitle"] = "axes.title.content";
    TextElementPathes["AxisLabel"] = "axes.labels.content";
    TextElementPathes["LegendTitle"] = "legend.title.content";
    TextElementPathes["LegendLabel"] = "legend.body";
    TextElementPathes["ValueLabel"] = "series.dataLabels.content";
})(TextElementPathes || (TextElementPathes = {}));
/**
 * Get the supported text elements.
 * @param type
 */
export const getTextElements = (type) => {
    if (isSerialSeries(type) || type === 'histogramSeries') {
        return Object.values(TextElementPathes);
    }
    else if (type === 'scatterSeries') {
        return [
            TextElementPathes.ChartTitle,
            TextElementPathes.ChartDescription,
            TextElementPathes.AxisTitle,
            TextElementPathes.AxisLabel,
            TextElementPathes.LegendTitle,
            TextElementPathes.LegendLabel
        ];
    }
    else if (type === 'pieSeries') {
        return [
            TextElementPathes.ChartTitle,
            TextElementPathes.ChartDescription,
            TextElementPathes.LegendTitle,
            TextElementPathes.LegendLabel,
            TextElementPathes.ValueLabel
        ];
    }
};
const TextElementsTranslation = {
    [TextElementPathes.ChartTitle]: 'chartTitle',
    [TextElementPathes.ChartDescription]: 'chartDescription',
    [TextElementPathes.AxisTitle]: 'axisTitle',
    [TextElementPathes.AxisLabel]: 'axisLabel',
    [TextElementPathes.LegendTitle]: 'legendTitle',
    [TextElementPathes.LegendLabel]: 'legendLabel',
    [TextElementPathes.ValueLabel]: 'valueLabel'
};
const getDefaultTextElementColor = (element) => {
    if (element === TextElementPathes.ChartTitle) {
        return getDefaultTitleColor();
    }
    else if (element === TextElementPathes.ChartDescription) {
        return getDefaultFooterColor();
    }
    else if (element === TextElementPathes.AxisTitle) {
        return getDefaultAxisTitleColor();
    }
    else if (element === TextElementPathes.AxisLabel) {
        return getDefaultAxisLabelColor();
    }
    else if (element === TextElementPathes.LegendTitle) {
        return getDefaultLegendTitleColor();
    }
    else if (element === TextElementPathes.LegendLabel) {
        return getDefaultLegendLabelColor();
    }
    else if (element === TextElementPathes.ValueLabel) {
        return getDefaultValueLabelColor();
    }
    return getDefaultTextColor();
};
const TextSymbolKeys = [
    'color',
    'weight',
    'style',
    'decoration',
    'family',
    'size'
];
/**
 * Convert path to array path
 * @param path
 * @param capture
 */
const getPathArray = (path, capture = true) => {
    let paths = path.split('.');
    if (path === TextElementPathes.AxisLabel ||
        path === TextElementPathes.AxisTitle ||
        path === TextElementPathes.ValueLabel) {
        if (capture) {
            paths.splice(1, 0, '0');
        }
        else {
            paths = paths.slice(1);
        }
    }
    return paths;
};
/**
 * Check whether a style is the same in all elements
 * @param key
 * @param textElements
 * @param webChart
 */
const isSameTextStyle = (key, textElements, webChart) => {
    var _a, _b, _c;
    const first = key === 'color'
        ? (_a = webChart.getIn(getPathArray(textElements[0]))) === null || _a === void 0 ? void 0 : _a.color
        : (_c = (_b = webChart.getIn(getPathArray(textElements[0]))) === null || _b === void 0 ? void 0 : _b.font) === null || _c === void 0 ? void 0 : _c[key];
    return textElements.every(path => {
        var _a;
        const symbol = webChart.getIn(getPathArray(path));
        return key === 'color'
            ? (symbol === null || symbol === void 0 ? void 0 : symbol.color) === first
            : ((_a = symbol === null || symbol === void 0 ? void 0 : symbol.font) === null || _a === void 0 ? void 0 : _a[key]) === first;
    });
};
/**
 * Gets the same style in all elements
 * @param textElements
 * @param webChart
 */
const getSameTextStyle = (textElements, webChart) => {
    let symbol = Immutable({
        type: RESTSymbolType.TS,
        horizontalAlignment: RESTHorizontalAlignment.Center
    });
    const first = webChart.getIn(getPathArray(textElements[0]));
    TextSymbolKeys.forEach(key => {
        var _a;
        const same = isSameTextStyle(key, textElements, webChart);
        if (same) {
            symbol =
                key === 'color'
                    ? symbol.set(key, first === null || first === void 0 ? void 0 : first[key])
                    : symbol.setIn(['font', key], (_a = first === null || first === void 0 ? void 0 : first.font) === null || _a === void 0 ? void 0 : _a[key]);
        }
    });
    return symbol;
};
/**
 * Set the style in webChart according to the path
 * @param key
 * @param path
 * @param value
 * @param webChart
 */
const setTextStyle = (key, path, value, webChart) => {
    var _a;
    let ret = webChart;
    const paths = getPathArray(path, false).concat(key === 'color' ? ['color'] : ['font', key]);
    if (path === TextElementPathes.AxisLabel ||
        path === TextElementPathes.AxisTitle) {
        ret = webChart.set('axes', (_a = ret.axes) === null || _a === void 0 ? void 0 : _a.map(axis => {
            return axis === null || axis === void 0 ? void 0 : axis.setIn(paths, value);
        }));
    }
    else if (path === TextElementPathes.ValueLabel) {
        ret = ret.set('series', ret.series.map(serie => {
            return Immutable.setIn(serie, paths, value);
        }));
    }
    else {
        ret = ret.setIn(paths, value);
    }
    return ret;
};
const DefaultTextElements = getTextElements('barSeries');
export const TextStyle = (props) => {
    const { className, elements = DefaultTextElements, webChart, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const [useAll, setUseAll] = React.useState(false);
    const [currentPath, setCurrentPath] = React.useState();
    const allSymbol = getSameTextStyle(elements, webChart);
    const handleAllTextChange = (key, value) => {
        let ret = webChart;
        elements.forEach(path => {
            ret = setTextStyle(key, path, value, ret);
        });
        onChange(ret);
    };
    const handleTextChange = (path, value) => {
        var _a;
        let ret = webChart;
        const paths = getPathArray(path, false);
        if (path === TextElementPathes.AxisLabel ||
            path === TextElementPathes.AxisTitle) {
            ret = webChart.set('axes', (_a = ret.axes) === null || _a === void 0 ? void 0 : _a.map(axis => {
                var _a, _b;
                const text = (_b = (_a = axis.getIn(paths)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
                value = value.set('text', text);
                return axis === null || axis === void 0 ? void 0 : axis.setIn(paths, value);
            }));
        }
        else if (path === TextElementPathes.ValueLabel) {
            ret = ret.set('series', ret.series.map(serie => {
                return Immutable.setIn(serie, paths, value);
            }));
        }
        else {
            ret = ret.setIn(paths, value);
        }
        onChange(ret);
    };
    return (React.createElement("div", { className: classNames('text-style w-100', className) },
        React.createElement(SettingSection, null,
            React.createElement(SettingRow, { label: translate('allText'), level: 1 },
                React.createElement(Switch, { checked: useAll, onChange: (_, checked) => setUseAll(checked) }))),
        React.createElement(SettingSection, null,
            useAll && (React.createElement(TextSymbolSetting, { defaultColor: getDefaultTextElementColor(), value: allSymbol, onColorChange: value => handleAllTextChange('color', value), onFontChange: handleAllTextChange })),
            !useAll && (React.createElement(React.Fragment, null, elements.map((path, idx) => {
                const symbol = webChart.getIn(getPathArray(path));
                const label = translate(TextElementsTranslation[path]);
                return (React.createElement(TextStyleCollapse, { key: idx, className: 'mb-2', defaultColor: getDefaultTextElementColor(path), open: currentPath === path, baseline: idx !== (elements === null || elements === void 0 ? void 0 : elements.length) - 1, toggle: open => setCurrentPath(open ? path : undefined), label: label, value: symbol, onChange: value => handleTextChange(path, value) }));
            }))))));
};
//# sourceMappingURL=text-style.js.map