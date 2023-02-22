/** @jsx jsx */
import { React, jsx } from 'jimu-core';
//import { hooks, defaultMessages as jimuUIMessages } from 'jimu-ui'
//import defaultMessages from '../../translations/default'
//import { SymbolSelector, JimuSymbolType, SymbolSelectorCreatedDescriptor } from 'jimu-ui/advanced/map'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { AcitvedOnLoad } from './sub-comp/actived-on-load';
export const LineOfSight = React.memo((props) => {
    //const translate = hooks.useTranslate(defaultMessages, jimuUIMessages)
    const { onSettingChanged, hanldeToolSettingChanged } = props;
    const _onSettingChanged = React.useCallback((config, activedOnLoadFlag) => {
        onSettingChanged(hanldeToolSettingChanged(props.toolConfig, config, activedOnLoadFlag));
    }, [props.toolConfig,
        onSettingChanged, hanldeToolSettingChanged]);
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { className: 'first-setting-section' },
            jsx(SettingRow, null)),
        jsx(AcitvedOnLoad, { toolConfig: props.toolConfig, onAcitvedChanged: checkedFlag => _onSettingChanged(null, checkedFlag) })));
});
//# sourceMappingURL=lineofsight.js.map