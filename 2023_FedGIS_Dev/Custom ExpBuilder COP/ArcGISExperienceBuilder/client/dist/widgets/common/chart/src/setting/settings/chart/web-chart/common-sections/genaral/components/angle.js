import { React } from 'jimu-core';
import { hooks, NumericInput } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../../translations/default';
export const Angle = (props) => {
    const { value = 0, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const handleChange = (value) => {
        const start = Math.floor(+value);
        const end = start + 360;
        onChange === null || onChange === void 0 ? void 0 : onChange(start, end);
    };
    return (React.createElement(SettingRow, { label: translate('startAngle'), flow: 'no-wrap' },
        React.createElement(NumericInput, { className: 'w-50', size: 'sm', min: 0, step: 1, max: 360, defaultValue: value, onAcceptValue: handleChange })));
};
//# sourceMappingURL=angle.js.map