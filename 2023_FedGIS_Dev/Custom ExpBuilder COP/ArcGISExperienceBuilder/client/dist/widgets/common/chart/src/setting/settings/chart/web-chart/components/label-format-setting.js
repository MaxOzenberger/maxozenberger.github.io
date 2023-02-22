import { React } from 'jimu-core';
import { NumericInput, hooks, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../translations/default';
import { styled } from 'jimu-theme';
const Root = styled.div `
  width: 100%;
  .jimu-widget-setting--row-label {
    color: var(--dark-400);
  }
`;
export const LabelFormatSetting = (props) => {
    var _a;
    const { value, onChange } = props;
    const characterLimit = (_a = value === null || value === void 0 ? void 0 : value.characterLimit) !== null && _a !== void 0 ? _a : '';
    const translate = hooks.useTranslate(defaultMessages, jimuUiDefaultMessage);
    const handleCharacterLimitChange = (characterLimit) => {
        onChange(value.set('characterLimit', Math.floor(+characterLimit)));
    };
    return (React.createElement(Root, { className: 'label-format-setting' },
        React.createElement(SettingRow, { label: translate('characterLimit'), flow: 'no-wrap', truncateLabel: true },
            React.createElement(NumericInput, { size: 'sm', showHandlers: false, value: characterLimit, min: 1, max: 99, step: 1, className: 'w-50', onAcceptValue: handleCharacterLimitChange }))));
};
//# sourceMappingURL=label-format-setting.js.map