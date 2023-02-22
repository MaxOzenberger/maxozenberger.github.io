import { React } from 'jimu-core';
import { Select } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { styled } from 'jimu-theme';
const Root = styled.div `
  width: 100%;
  .jimu-widget-setting--row-label {
    color: var(--dark-400);
  }
`;
// More info about intl option: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
export const DateFormatSetting = (props) => {
    var _a;
    const { value, onChange } = props;
    const intlOptions = value === null || value === void 0 ? void 0 : value.intlOptions;
    const dateStyle = (_a = intlOptions === null || intlOptions === void 0 ? void 0 : intlOptions.dateStyle) !== null && _a !== void 0 ? _a : 'none';
    const handleDateStyleChange = (evt) => {
        let dateStyle = evt.currentTarget.value;
        dateStyle = dateStyle === 'none' ? undefined : dateStyle;
        onChange(value.setIn(['intlOptions', 'dateStyle'], dateStyle));
    };
    return (React.createElement(Root, { className: 'date-format-setting' },
        React.createElement(SettingRow, { label: '$Date style', flow: 'no-wrap', className: 'mt-2', truncateLabel: true },
            React.createElement(Select, { size: 'sm', value: dateStyle, className: 'w-50', onChange: handleDateStyleChange },
                React.createElement("option", { value: 'none' }, "none"),
                React.createElement("option", { value: 'full' }, "full"),
                React.createElement("option", { value: 'long' }, "long"),
                React.createElement("option", { value: 'medium' }, "medium"),
                React.createElement("option", { value: 'short' }, "short")))));
};
//# sourceMappingURL=date-format-setting.js.map