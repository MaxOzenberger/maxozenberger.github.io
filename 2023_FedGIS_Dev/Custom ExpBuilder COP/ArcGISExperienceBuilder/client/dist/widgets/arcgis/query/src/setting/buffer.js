/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { hooks, Switch, NumericInput, Select } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { UnitType } from '../config';
export function BufferSetting(props) {
    const { enabled, distance, unit, onEnableChanged, onDistanceChanged, onUnitChanged } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    return (jsx(React.Fragment, null,
        jsx(SettingRow, { label: getI18nMessage('enableBuffer') },
            jsx(Switch, { "aria-label": getI18nMessage('enableBuffer'), checked: enabled, onChange: (e) => onEnableChanged(e.target.checked) })),
        enabled && (jsx(React.Fragment, null,
            jsx(SettingRow, { label: getI18nMessage('defaultDistance') },
                jsx(NumericInput, { css: css `
                flex: 0 0 40%;
              `, "aria-label": getI18nMessage('defaultDistance'), className: 'w-100', size: 'sm', value: distance, onChange: (value) => onDistanceChanged(value) })),
            jsx(SettingRow, { label: getI18nMessage('defaultUnit') },
                jsx(Select, { css: css `
                flex: 0 0 40%;
              `, size: 'sm', value: unit, "aria-label": getI18nMessage('defaultUnit'), onChange: (e) => onUnitChanged(e.target.value) }, Object.values(UnitType).map((value) => (jsx("option", { key: value, value: value }, getI18nMessage(`unit_${value}`))))))))));
}
//# sourceMappingURL=buffer.js.map