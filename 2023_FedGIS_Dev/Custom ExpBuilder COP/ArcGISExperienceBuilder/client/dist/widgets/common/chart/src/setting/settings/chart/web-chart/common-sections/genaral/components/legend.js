import { React, Immutable } from 'jimu-core';
import { WebChartLegendPositions } from 'jimu-ui/advanced/chart';
import { TextInput, hooks, Select, Switch } from 'jimu-ui';
import { getDefaultLegend } from '../../../../../../../utils/default';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../../translations/default';
const defaultValue = Immutable(getDefaultLegend());
export const Legend = (props) => {
    var _a;
    const { disabled = false, value = defaultValue, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const handleTitleTextChange = (text) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.setIn(['title', 'content', 'text'], text));
    };
    const handleVisibleChange = (_, visible) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('visible', visible));
    };
    const handlePositionChange = (evt) => {
        const position = evt.currentTarget.value;
        onChange === null || onChange === void 0 ? void 0 : onChange(value.set('position', position));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SettingRow, { label: translate('LegendLabel'), flow: 'no-wrap' },
            React.createElement(Switch, { disabled: disabled, checked: !disabled && (value === null || value === void 0 ? void 0 : value.visible), onChange: handleVisibleChange })),
        (value === null || value === void 0 ? void 0 : value.visible) && (React.createElement(React.Fragment, null,
            React.createElement(SettingRow, { label: translate('legendTitle'), flow: 'wrap' },
                React.createElement(TextInput, { size: 'sm', className: 'w-100', defaultValue: (_a = value.title) === null || _a === void 0 ? void 0 : _a.content.text, onAcceptValue: handleTitleTextChange })),
            React.createElement(SettingRow, { label: translate('legendPosition'), flow: 'no-wrap' },
                React.createElement(Select, { size: 'sm', value: value === null || value === void 0 ? void 0 : value.position, style: { width: '88px' }, onChange: handlePositionChange },
                    React.createElement("option", { value: WebChartLegendPositions.Left }, translate(WebChartLegendPositions.Left)),
                    React.createElement("option", { value: WebChartLegendPositions.Right }, translate(WebChartLegendPositions.Right)),
                    React.createElement("option", { value: WebChartLegendPositions.Top }, translate(WebChartLegendPositions.Top)),
                    React.createElement("option", { value: WebChartLegendPositions.Bottom }, translate(WebChartLegendPositions.Bottom))))))));
};
//# sourceMappingURL=legend.js.map