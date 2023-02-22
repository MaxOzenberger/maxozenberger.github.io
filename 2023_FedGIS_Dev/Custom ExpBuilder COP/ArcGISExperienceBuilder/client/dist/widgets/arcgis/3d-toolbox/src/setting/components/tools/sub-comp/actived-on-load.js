/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Switch, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../translations/default';
export const AcitvedOnLoad = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const _onAcitvedChanged = props.onAcitvedChanged;
    const onChanged = React.useCallback((checkedFlag) => {
        _onAcitvedChanged(checkedFlag);
    }, [_onAcitvedChanged]);
    return (jsx(React.Fragment, null,
        jsx(SettingSection, null,
            jsx(SettingRow, { label: translate('activedOnLoad') },
                jsx(Switch, { "aria-label": translate('activedOnLoad'), checked: props.toolConfig.activedOnLoad, onChange: evt => { onChanged(evt.target.checked); } })))));
});
//# sourceMappingURL=actived-on-load.js.map