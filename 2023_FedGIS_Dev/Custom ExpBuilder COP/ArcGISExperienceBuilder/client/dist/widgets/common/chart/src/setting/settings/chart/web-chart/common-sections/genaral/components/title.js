import { React, Immutable } from 'jimu-core';
import { TextInput, TextArea } from 'jimu-ui';
import { getChartText } from '../../../../../../../utils/default';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
const defaultValue = Immutable(getChartText());
export const Title = (props) => {
    var _a, _b;
    const { label, type = 'input', value = defaultValue, onChange } = props;
    const text = (_b = (_a = value === null || value === void 0 ? void 0 : value.content) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
    const handleChange = (val) => {
        const visible = val !== '';
        onChange === null || onChange === void 0 ? void 0 : onChange(value.setIn(['content', 'text'], val).set('visible', visible));
    };
    return (React.createElement(SettingRow, { label: label, flow: 'wrap' },
        type === 'input' && React.createElement(TextInput, { size: 'sm', className: 'w-100', defaultValue: text, onAcceptValue: handleChange }),
        type === 'area' && React.createElement(TextArea, { defaultValue: text, onAcceptValue: handleChange })));
};
//# sourceMappingURL=title.js.map