import { React } from 'jimu-core';
import { NumericInput, Checkbox, hooks, defaultMessages as jimuUiDefaultMessage, Label, Select, Radio } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../translations/default';
import { styled } from 'jimu-theme';
const Root = styled.div `
  width: 100%;
  .jimu-widget-setting--row-label {
    color: var(--dark-400);
  }
`;
const InlineSettingRow = styled(SettingRow) `
  width: 47%;
  margin-top: 0 !important;
`;
// More info about intl option: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
export const NumericFormatSetting = (props) => {
    var _a, _b, _c, _d;
    const { value, onChange } = props;
    const intlOptions = value === null || value === void 0 ? void 0 : value.intlOptions;
    const minimumFractionDigits = (_a = intlOptions === null || intlOptions === void 0 ? void 0 : intlOptions.minimumFractionDigits) !== null && _a !== void 0 ? _a : 0;
    const maximumFractionDigits = (_b = intlOptions === null || intlOptions === void 0 ? void 0 : intlOptions.maximumFractionDigits) !== null && _b !== void 0 ? _b : 0;
    const unifiedFractionDigits = minimumFractionDigits;
    const [isUnifiedFractionDigits, setIsUnifiedFractionDigits] = React.useState(minimumFractionDigits === maximumFractionDigits);
    const notation = (_c = intlOptions === null || intlOptions === void 0 ? void 0 : intlOptions.notation) !== null && _c !== void 0 ? _c : 'standard';
    const useGrouping = (_d = intlOptions === null || intlOptions === void 0 ? void 0 : intlOptions.useGrouping) !== null && _d !== void 0 ? _d : true;
    const translate = hooks.useTranslate(defaultMessages, jimuUiDefaultMessage);
    const handleUnifiedChange = (unified) => {
        setIsUnifiedFractionDigits(unified);
        if (unified) {
            onChange(value.setIn(['intlOptions', 'minimumFractionDigits'], unifiedFractionDigits)
                .setIn(['intlOptions', 'maximumFractionDigits'], unifiedFractionDigits));
        }
    };
    const handleUnifiedDecimalChange = (number) => {
        const decimal = Math.floor(+number);
        onChange(value.setIn(['intlOptions', 'minimumFractionDigits'], decimal)
            .setIn(['intlOptions', 'maximumFractionDigits'], decimal));
    };
    const handleMinDecimalChange = (number) => {
        const decimal = Math.floor(+number);
        let option = value.setIn(['intlOptions', 'minimumFractionDigits'], decimal);
        if (decimal > maximumFractionDigits) {
            option = option.setIn(['intlOptions', 'maximumFractionDigits'], decimal);
        }
        onChange(option);
    };
    const handleMaxDecimalChange = (number) => {
        const decimal = Math.floor(+number);
        let option = value.setIn(['intlOptions', 'maximumFractionDigits'], decimal);
        if (decimal < minimumFractionDigits) {
            option = option.setIn(['intlOptions', 'minimumFractionDigits'], decimal);
        }
        onChange(option);
    };
    const handleShow1000SeperatorChange = (_, checked) => {
        onChange(value.setIn(['intlOptions', 'useGrouping'], checked));
    };
    const handleNotationChange = (evt) => {
        const notation = evt.currentTarget.value;
        let option = value.setIn(['intlOptions', 'notation'], notation);
        if (notation !== 'standard') {
            option = option.set('intlOptions', option.intlOptions.without('useGrouping'));
        }
        onChange(option);
    };
    return (React.createElement(Root, { className: 'numeric-format-setting' },
        React.createElement(SettingRow, { label: translate('decimal'), flow: 'wrap' },
            React.createElement("div", { role: 'radiogroup', className: 'w-100' },
                React.createElement(Label, { title: translate('uniform'), className: 'setting-text-level-3 d-flex align-items-center text-truncate', style: { width: '60%' } },
                    React.createElement(Radio, { name: 'singleColor', className: 'mr-2', checked: isUnifiedFractionDigits, onChange: () => handleUnifiedChange(true) }),
                    translate('uniform')),
                isUnifiedFractionDigits && (React.createElement(NumericInput, { size: 'sm', className: 'mb-2', min: 0, step: 1, max: 15, showHandlers: false, value: unifiedFractionDigits, onAcceptValue: handleUnifiedDecimalChange })),
                React.createElement(Label, { title: translate('mixed'), className: 'setting-text-level-3 d-flex align-items-center text-truncate', style: { width: '60%' } },
                    React.createElement(Radio, { name: 'radio1', className: 'mr-2', checked: !isUnifiedFractionDigits, onChange: () => handleUnifiedChange(false) }),
                    translate('mixed')),
                !isUnifiedFractionDigits && React.createElement("div", { className: 'pl-1 mb-1 d-flex align-items-center justify-content-between' },
                    React.createElement(InlineSettingRow, { label: translate('min'), flow: 'no-wrap', truncateLabel: true },
                        React.createElement(NumericInput, { size: 'sm', min: 0, step: 1, max: 15, showHandlers: false, value: minimumFractionDigits, className: 'w-50', onAcceptValue: handleMinDecimalChange })),
                    React.createElement(InlineSettingRow, { label: translate('max'), flow: 'no-wrap', truncateLabel: true },
                        React.createElement(NumericInput, { size: 'sm', min: 0, step: 1, max: 15, showHandlers: false, value: maximumFractionDigits, className: 'w-50', onAcceptValue: handleMaxDecimalChange }))))),
        React.createElement(SettingRow, { label: translate('notation'), flow: 'no-wrap', className: 'mt-2', truncateLabel: true },
            React.createElement(Select, { size: 'sm', value: notation, className: 'w-50', onChange: handleNotationChange },
                React.createElement("option", { value: 'standard' }, translate('standard')),
                React.createElement("option", { value: 'compact' }, translate('compact')),
                React.createElement("option", { value: 'scientific' }, translate('scientific')),
                React.createElement("option", { value: 'engineering' }, translate('engineering')))),
        notation === 'standard' && React.createElement(Label, { check: true, centric: true, className: 'justify-content-start align-items-start mt-2 setting-text-level-3' },
            React.createElement(Checkbox, { checked: useGrouping, onChange: handleShow1000SeperatorChange }),
            React.createElement("span", { className: 'ml-2' }, translate('show1000Seperator')))));
};
//# sourceMappingURL=numeric-format-setting.js.map