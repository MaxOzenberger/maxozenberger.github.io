import { React, classNames } from 'jimu-core';
import { TextInput, hooks, NumericInput, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { NumericFormatSetting } from '../../components';
import Guides from './guide';
import { parseNumber } from './guide/utils';
export const NumericAxis = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { className, axis, isHorizontal, showLogarithmicScale, onChange } = props;
    const titleText = (_b = (_a = axis.title.content) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
    const valueFormat = axis.valueFormat;
    const showGrid = ((_c = axis.grid) === null || _c === void 0 ? void 0 : _c.width) > 0;
    const minimum = (_d = axis.minimum) !== null && _d !== void 0 ? _d : '';
    const maximum = (_e = axis.maximum) !== null && _e !== void 0 ? _e : '';
    const isLogarithmic = (_f = axis.isLogarithmic) !== null && _f !== void 0 ? _f : false;
    const guides = axis === null || axis === void 0 ? void 0 : axis.guides;
    const handleTitleTextChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('title', axis.title.set('visible', value !== '').setIn(['content', 'text'], value)));
    };
    const handleValueFormatChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('valueFormat', value));
    };
    const handleShowGridChange = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.setIn(['grid', 'width'], showGrid ? 0 : 1));
    };
    const handleMinumumChange = (value) => {
        const minimum = parseNumber(value);
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('minimum', minimum));
    };
    const handleMaxumumChange = (value) => {
        const maximum = parseNumber(value);
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('maximum', maximum));
    };
    const handleLogarithmicChange = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('isLogarithmic', !isLogarithmic));
    };
    const handleGuidesChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('guides', value));
    };
    return (React.createElement("div", { className: classNames('numeric-axis w-100', className) },
        React.createElement(SettingRow, { label: translate('valueRange'), flow: 'wrap', level: 2 },
            React.createElement("div", { className: 'd-flex align-items-center justify-content-between' },
                React.createElement(NumericInput, { placeholder: translate('min'), size: 'sm', showHandlers: false, value: minimum, style: { width: '40%' }, onAcceptValue: handleMinumumChange }),
                React.createElement("span", { className: 'text-truncate' }, translate('to')),
                React.createElement(NumericInput, { size: 'sm', showHandlers: false, placeholder: translate('max'), value: maximum, style: { width: '40%' }, onAcceptValue: handleMaxumumChange }))),
        showLogarithmicScale && (React.createElement(SettingRow, { label: translate('logarithmicScale'), level: 2 },
            React.createElement(Switch, { checked: isLogarithmic, onChange: handleLogarithmicChange }))),
        React.createElement(SettingRow, { label: translate('axisTitle'), flow: 'wrap', level: 2 },
            React.createElement(TextInput, { size: 'sm', defaultValue: titleText, className: 'w-100', onAcceptValue: handleTitleTextChange })),
        React.createElement(SettingRow, { label: translate('axisLabel'), flow: 'wrap', level: 2 },
            React.createElement(NumericFormatSetting, { value: valueFormat, onChange: handleValueFormatChange })),
        React.createElement(SettingRow, { label: translate('axisGrid'), level: 2 },
            React.createElement(Switch, { checked: showGrid, onChange: handleShowGridChange })),
        React.createElement(Guides, { isHorizontal: !isHorizontal, value: guides, onChange: handleGuidesChange })));
};
//# sourceMappingURL=numeric-aixs.js.map