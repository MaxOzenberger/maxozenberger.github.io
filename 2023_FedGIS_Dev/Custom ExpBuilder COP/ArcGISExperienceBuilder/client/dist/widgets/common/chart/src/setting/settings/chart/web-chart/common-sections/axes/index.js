import { React, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessages from '../../../../../translations/default';
import { SettingCollapse } from '../../../../components';
import { CategoryAxis } from './category-axis';
import { DateAxis } from './date-axis';
import { NumericAxis } from './numeric-aixs';
export const AxesSetting = (props) => {
    const { showLogarithmicScale, axes: propAxes, onChange, rotated } = props;
    const [axisIndex, setAxisIndex] = React.useState(-1);
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const handleClick = (index) => {
        setAxisIndex(index);
    };
    const handleChange = (axis) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(Immutable.set(propAxes, axisIndex, axis));
    };
    return (React.createElement("div", { className: 'auto-axes-setting w-100' }, propAxes === null || propAxes === void 0 ? void 0 : propAxes.map((axis, index) => {
        const type = axis.valueFormat.type;
        const name = index === 0 ? 'xAxis' : 'yAxis';
        const isHorizontal = (name === 'xAxis' && !rotated) || (name === 'yAxis' && rotated);
        return (React.createElement(SettingCollapse, { level: 1, className: 'mt-2', key: index, bottomLine: index === 0, label: translate(name), isOpen: axisIndex === index, onRequestOpen: () => handleClick(index), onRequestClose: () => handleClick(-1) },
            type === 'category' && (React.createElement(CategoryAxis, { className: 'mt-3', isHorizontal: isHorizontal, axis: axis, onChange: handleChange })),
            type === 'number' && (React.createElement(NumericAxis, { className: 'mt-3', showLogarithmicScale: showLogarithmicScale, isHorizontal: isHorizontal, axis: axis, onChange: handleChange })),
            type === 'date' && (React.createElement(DateAxis, { className: 'mt-3', axis: axis, onChange: handleChange }))));
    })));
};
//# sourceMappingURL=index.js.map