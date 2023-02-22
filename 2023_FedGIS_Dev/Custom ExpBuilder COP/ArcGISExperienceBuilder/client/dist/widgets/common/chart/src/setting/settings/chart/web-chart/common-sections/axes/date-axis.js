import { React, classNames } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, TextInput, Switch } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { DateFormatSetting } from '../../components';
export const DateAxis = (props) => {
    var _a, _b, _c;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { className, axis, onChange } = props;
    const titleText = (_b = (_a = axis.title.content) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
    const valueFormat = axis.valueFormat;
    const showGrid = ((_c = axis.grid) === null || _c === void 0 ? void 0 : _c.width) > 0;
    const handleTitleTextChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('title', axis.title.set('visible', value !== '').setIn(['content', 'text'], value)));
    };
    const handleValueFormatChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('valueFormat', value));
    };
    const handleShowGridChange = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.setIn(['grid', 'width'], showGrid ? 0 : 1));
    };
    return (React.createElement("div", { className: classNames('date-axis w-100', className) },
        React.createElement(SettingRow, { label: translate('axisTitle'), flow: 'wrap', level: 2 },
            React.createElement(TextInput, { size: 'sm', defaultValue: titleText, className: 'w-100', onAcceptValue: handleTitleTextChange })),
        React.createElement(SettingRow, { label: translate('axisLabel'), flow: 'wrap', level: 2 },
            React.createElement(DateFormatSetting, { value: valueFormat, onChange: handleValueFormatChange })),
        React.createElement(SettingRow, { label: translate('axisGrid'), level: 2 },
            React.createElement(Switch, { checked: showGrid, onChange: handleShowGridChange }))));
};
//# sourceMappingURL=date-axis.js.map