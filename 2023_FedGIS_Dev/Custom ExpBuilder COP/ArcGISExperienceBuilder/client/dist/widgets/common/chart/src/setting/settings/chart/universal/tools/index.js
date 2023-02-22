import { React, Immutable, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
const DefaultTools = Immutable({ cursorEnable: true });
export const Tools = (props) => {
    var _a;
    const { type = 'barSeries', tools: propTools = DefaultTools, onChange } = props;
    const translate = hooks.useTranslate(jimuiDefaultMessage, jimuCoreDefaultMessage);
    const selectionLabel = type === 'pieSeries' ? translate('selection') : `${translate('selection')} & ${translate('ZoomLabel')}`;
    const cursorEnable = (_a = propTools === null || propTools === void 0 ? void 0 : propTools.cursorEnable) !== null && _a !== void 0 ? _a : false;
    const handleCursorEnableChange = (_, checked) => {
        const tools = propTools.set('cursorEnable', checked);
        onChange === null || onChange === void 0 ? void 0 : onChange(tools);
    };
    return (React.createElement("div", { className: 'serial-tools w-100' },
        React.createElement(SettingRow, { label: selectionLabel, flow: 'no-wrap', className: 'mt-3' },
            React.createElement(Switch, { checked: cursorEnable, onChange: handleCursorEnableChange }))));
};
//# sourceMappingURL=index.js.map