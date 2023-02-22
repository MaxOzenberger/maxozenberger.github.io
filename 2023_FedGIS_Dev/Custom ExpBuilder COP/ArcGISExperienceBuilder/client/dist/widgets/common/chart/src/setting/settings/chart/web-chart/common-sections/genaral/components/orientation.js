import { React } from 'jimu-core';
import { hooks } from 'jimu-ui';
import { DirectionSelector, SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../../translations/default';
export const Orientation = (props) => {
    const { value = false, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const handleChange = (vertical) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(!vertical);
    };
    return (React.createElement(SettingRow, { label: translate('chartOrientation'), flow: 'no-wrap' },
        React.createElement(DirectionSelector, { size: 'sm', vertical: !value, onChange: handleChange })));
};
//# sourceMappingURL=orientation.js.map