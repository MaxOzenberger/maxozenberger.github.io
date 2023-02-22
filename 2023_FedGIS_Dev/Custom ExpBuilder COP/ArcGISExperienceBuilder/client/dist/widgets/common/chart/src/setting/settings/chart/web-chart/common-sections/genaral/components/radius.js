import { React } from 'jimu-core';
import { hooks, NumericInput } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../../translations/default';
export const InnerRadius = (props) => {
    const { value = 0, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const handleChange = (value) => {
        const radius = Math.floor(+value);
        onChange === null || onChange === void 0 ? void 0 : onChange(radius);
    };
    return (React.createElement(SettingRow, { label: translate('innerRadius'), flow: 'no-wrap' },
        React.createElement(NumericInput, { className: 'w-50', size: 'sm', min: 0, step: 1, max: 100, defaultValue: value, onAcceptValue: handleChange })));
};
//# sourceMappingURL=radius.js.map