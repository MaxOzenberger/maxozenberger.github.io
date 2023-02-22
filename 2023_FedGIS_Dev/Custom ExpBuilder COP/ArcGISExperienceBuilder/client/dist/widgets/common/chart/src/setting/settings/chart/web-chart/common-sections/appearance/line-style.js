import { React, classNames, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { getDefaultAxisColor, getDefaultGridColor, getDefaultLineColor, isXYChart } from '../../../../../../utils/default';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { LineSymbolSetting, LineStyleCollapse } from '../../components';
import { RESTSymbolType } from 'jimu-ui/advanced/chart';
var LineElementPathes;
(function (LineElementPathes) {
    LineElementPathes["CategoryAxis"] = "axes.0.lineSymbol";
    LineElementPathes["CategoryGrid"] = "axes.0.grid";
    LineElementPathes["ValueAxis"] = "axes.1.lineSymbol";
    LineElementPathes["ValueGrid"] = "axes.1.grid";
})(LineElementPathes || (LineElementPathes = {}));
/**
 * Get the supported line elements.
 * @param type
 */
export const getLineElements = (type) => {
    if (isXYChart(type)) {
        return Object.values(LineElementPathes);
    }
    else if (type === 'pieSeries') {
        return [];
    }
};
const LineStyleProp = ['color', 'style', 'width'];
const LineElementsTranslation = {
    [LineElementPathes.CategoryAxis]: 'categoryAxis',
    [LineElementPathes.CategoryGrid]: 'categoryGrid',
    [LineElementPathes.ValueAxis]: 'valueAxis',
    [LineElementPathes.ValueGrid]: 'valueGrid'
};
const getDefaultSymbolElementColor = (element) => {
    if (element === LineElementPathes.CategoryAxis || element === LineElementPathes.ValueAxis) {
        return getDefaultAxisColor();
    }
    else if (element === LineElementPathes.CategoryGrid || element === LineElementPathes.ValueGrid) {
        return getDefaultGridColor();
    }
    return getDefaultLineColor();
};
/**
 * Convert path to array path
 */
const getPathArray = (path) => path === null || path === void 0 ? void 0 : path.split('.');
/**
 * Check whether a style is the same in all elements
 * @param key
 * @param elements
 * @param webChart
 */
const isSameLineStyle = (key, elements, webChart) => {
    const first = webChart === null || webChart === void 0 ? void 0 : webChart.getIn(getPathArray(elements[0]))[key];
    return elements.every(path => {
        const symbol = webChart === null || webChart === void 0 ? void 0 : webChart.getIn(getPathArray(path));
        return (symbol === null || symbol === void 0 ? void 0 : symbol[key]) === first;
    });
};
/**
 * Gets the same style in all elements
 * @param textElements
 * @param webChart
 */
const getSameLineStyle = (textElements, webChart) => {
    let symbol = Immutable({
        type: RESTSymbolType.SLS
    });
    const first = webChart.getIn(getPathArray(textElements[0]));
    LineStyleProp.forEach(key => {
        const same = isSameLineStyle(key, textElements, webChart);
        if (same) {
            symbol = symbol.set(key, first === null || first === void 0 ? void 0 : first[key]);
        }
    });
    return symbol;
};
const DefaultLineElements = getLineElements('barSeries');
export const LineStyle = (props) => {
    const { className, elements = DefaultLineElements, webChart, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const [useAll, setUseAll] = React.useState(false);
    const [currentPath, setCurrentPath] = React.useState();
    const allSymbol = getSameLineStyle(elements, webChart);
    const handleAllLineChange = (key, value) => {
        if (value !== 0 && !value)
            return;
        let ret = webChart;
        elements.forEach(path => {
            const paths = getPathArray(path);
            let symbol = ret.getIn(paths);
            if (symbol) {
                symbol = symbol.set(key, value);
                ret = ret.setIn(paths, symbol);
            }
        });
        onChange(ret);
    };
    const handleLineChange = (path, value) => {
        let ret = webChart;
        const paths = getPathArray(path);
        ret = ret.setIn(paths, value);
        onChange(ret);
    };
    return (React.createElement("div", { className: classNames('line-style w-100', className) },
        React.createElement(SettingSection, null,
            React.createElement(SettingRow, { label: translate('allLine'), level: 1 },
                React.createElement(Switch, { checked: useAll, onChange: (_, checked) => setUseAll(checked) }))),
        React.createElement(SettingSection, null,
            useAll && (React.createElement(LineSymbolSetting, { defaultColor: getDefaultSymbolElementColor(), value: allSymbol, onPropsChange: handleAllLineChange })),
            !useAll && (React.createElement(React.Fragment, null, elements.map((path, idx) => {
                const symbol = webChart.getIn(getPathArray(path));
                const label = translate(LineElementsTranslation[path]);
                return (React.createElement(LineStyleCollapse, { className: 'mb-2', defaultColor: getDefaultSymbolElementColor(path), open: currentPath === path, baseline: idx !== (elements === null || elements === void 0 ? void 0 : elements.length) - 1, toggle: open => setCurrentPath(open ? path : undefined), label: label, key: idx, value: symbol, onChange: value => handleLineChange(path, value) }));
            }))))));
};
//# sourceMappingURL=line-style.js.map