/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Switch, Label, Radio, defaultMessages as jimuUIMessages } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { ShadowCastVisType } from '../../../constraints';
import { AcitvedOnLoad } from './sub-comp/actived-on-load';
export const ShadowCast = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const { onSettingChanged, hanldeToolSettingChanged } = props;
    const _onSettingChanged = React.useCallback((config, activedOnLoadFlag) => {
        onSettingChanged(hanldeToolSettingChanged(props.toolConfig, config, activedOnLoadFlag));
    }, [props.toolConfig,
        onSettingChanged, hanldeToolSettingChanged]);
    const _onDefaultAnalysisTypeChanged = React.useCallback((type, checked) => {
        if (checked) {
            _onSettingChanged(Object.assign(Object.assign({}, props.toolConfig.config), { visType: type }));
        }
    }, [_onSettingChanged, props.toolConfig]);
    const shadowCastConfig = props.toolConfig.config;
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { className: 'first-setting-section' },
            jsx(SettingRow, { label: translate('defaultAnalysisType') }),
            jsx(SettingRow, null,
                jsx("div", { className: 'd-block shadow-cast-radios' },
                    jsx("div", { className: 'd-flex align-items-center mb-2' },
                        jsx(Label, { className: 'd-flex align-items-center' },
                            jsx(Radio, { name: 'defaultAnalysisType', className: 'mr-2', checked: shadowCastConfig.visType === ShadowCastVisType.Threshold, onChange: (evt, checked) => _onDefaultAnalysisTypeChanged(ShadowCastVisType.Threshold, checked) }),
                            translate(ShadowCastVisType.Threshold))),
                    jsx("div", { className: 'd-flex align-items-center mb-2' },
                        jsx(Label, { className: 'd-flex align-items-center' },
                            jsx(Radio, { name: 'defaultAnalysisType', className: 'mr-2', checked: shadowCastConfig.visType === ShadowCastVisType.Duration, onChange: (evt, checked) => _onDefaultAnalysisTypeChanged(ShadowCastVisType.Duration, checked) }),
                            translate(ShadowCastVisType.Duration))),
                    jsx("div", { className: 'd-flex align-items-center' },
                        jsx(Label, { check: true, className: 'd-flex align-items-center' },
                            jsx(Radio, { name: 'defaultAnalysisType', className: 'mr-2', checked: shadowCastConfig.visType === ShadowCastVisType.Discrete, onChange: (evt, checked) => _onDefaultAnalysisTypeChanged(ShadowCastVisType.Discrete, checked) }),
                            translate(ShadowCastVisType.Discrete))))),
            jsx(SettingRow, { label: translate('timezoneSelector') },
                jsx(Switch, { "aria-label": translate('timezoneSelector'), checked: shadowCastConfig.timezone, onChange: evt => { _onSettingChanged({ timezone: evt.target.checked }); } })),
            jsx(SettingRow, { label: translate('dateSelector') },
                jsx(Switch, { "aria-label": translate('dateSelector'), checked: shadowCastConfig.datePicker, onChange: evt => { _onSettingChanged({ datePicker: evt.target.checked }); } }))),
        jsx(AcitvedOnLoad, { toolConfig: props.toolConfig, onAcitvedChanged: checkedFlag => _onSettingChanged(null, checkedFlag) })));
});
//# sourceMappingURL=shadowcast.js.map