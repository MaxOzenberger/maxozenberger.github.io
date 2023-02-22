import { React } from 'jimu-core';
import { getTheme2 } from 'jimu-theme';
import { hooks } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker';
export const Background = (props) => {
    const { value, onChange } = props;
    const translate = hooks.useTranslate();
    const appTheme = getTheme2();
    return (React.createElement(SettingRow, { label: translate('background'), flow: 'no-wrap', className: 'mt-2' },
        React.createElement(ThemeColorPicker, { specificTheme: appTheme, value: value, onChange: onChange })));
};
//# sourceMappingURL=background.js.map