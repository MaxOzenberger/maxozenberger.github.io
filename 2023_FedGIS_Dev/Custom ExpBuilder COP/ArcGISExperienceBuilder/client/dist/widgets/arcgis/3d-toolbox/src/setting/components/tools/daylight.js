/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Switch, Select, NumericInput, Radio, Label, defaultMessages as jimuUIMessages } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { DateOrSeason, Season } from '../../../constraints';
import { AcitvedOnLoad } from './sub-comp/actived-on-load';
export const Daylight = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const DEFALUT_PARAMS = React.useMemo(() => {
        return {
            timeSliderStepsDefault: 5,
            timeSliderStepsMax: (60 * 2),
            timeSliderStepsMin: 1,
            speedDefault: 1.0,
            speedMax: 10,
            speedMin: 0.1
        };
    }, []);
    const { onSettingChanged, hanldeToolSettingChanged } = props;
    const daylightConfig = props.toolConfig.config;
    const _onSettingChanged = React.useCallback((config, activedOnLoadFlag) => {
        onSettingChanged(hanldeToolSettingChanged(props.toolConfig, config, activedOnLoadFlag));
    }, [props.toolConfig,
        onSettingChanged, hanldeToolSettingChanged]);
    const _onDateOrSeasonChanged = React.useCallback((type, checked) => {
        if (checked) {
            _onSettingChanged({ dateOrSeason: type });
        }
    }, [_onSettingChanged]);
    const _onEnablePlayControlChanged = React.useCallback((isEnablePlayButtons) => {
        let paramObj = { playButtons: isEnablePlayButtons };
        if (!isEnablePlayButtons && daylightConfig.dateTimeAutoPlay) {
            paramObj = Object.assign(Object.assign({}, paramObj), { dateTimeAutoPlay: false //disable AutoPlay, when turn off "Enable play control" ,#10469
             });
        }
        _onSettingChanged(paramObj);
    }, [_onSettingChanged, daylightConfig.dateTimeAutoPlay]);
    const seasonTypes = [Season.SyncedWithMap, Season.Spring, Season.Summer, Season.Fall, Season.Winter];
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { className: 'first-setting-section' },
            jsx(SettingRow, { label: translate('timezoneSelector') },
                jsx(Switch, { "aria-label": translate('timezoneSelector'), checked: daylightConfig.timezone, onChange: evt => { _onSettingChanged({ timezone: evt.target.checked }); } })),
            jsx(SettingRow, { label: translate('timeSliderSteps') },
                jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: daylightConfig.timeSliderSteps, defaultValue: DEFALUT_PARAMS.timeSliderStepsDefault, min: DEFALUT_PARAMS.timeSliderStepsMin, max: DEFALUT_PARAMS.timeSliderStepsMax, step: 1, precision: 0, onChange: (val) => { _onSettingChanged({ timeSliderSteps: val }); }, required: true })),
            jsx(SettingRow, { label: translate('dateSelector') },
                jsx(Switch, { "aria-label": translate('dateSelector'), checked: daylightConfig.datePicker, onChange: evt => { _onSettingChanged({ datePicker: evt.target.checked }); } })),
            daylightConfig.datePicker &&
                jsx(SettingRow, null,
                    jsx("div", { className: 'd-block' },
                        jsx("div", { className: 'd-flex align-items-center mb-2' },
                            jsx(Label, { className: 'd-flex align-items-center' },
                                jsx(Radio, { name: 'dateOrSeason', className: 'mr-2', checked: daylightConfig.dateOrSeason === DateOrSeason.Date, onChange: (evt, checked) => { _onDateOrSeasonChanged(DateOrSeason.Date, checked); } }),
                                translate('date'))),
                        jsx("div", { className: 'd-flex align-items-center' },
                            jsx(Label, { className: 'd-flex align-items-center' },
                                jsx(Radio, { name: 'dateOrSeason', className: 'mr-2', checked: daylightConfig.dateOrSeason === DateOrSeason.Season, onChange: (evt, checked) => { _onDateOrSeasonChanged(DateOrSeason.Season, checked); } }),
                                translate('season'))))),
            (daylightConfig.dateOrSeason === DateOrSeason.Season) &&
                jsx(React.Fragment, null,
                    jsx(SettingRow, { label: translate('defaultSeason') }),
                    jsx(SettingRow, null,
                        jsx(Select, { size: 'sm', value: daylightConfig.currentSeason, onChange: (evt) => _onSettingChanged({ currentSeason: evt.target.value }), className: '' }, seasonTypes.map((type, idx) => {
                            const tip = translate(type);
                            return jsx("option", { key: idx, value: type }, tip);
                        })))),
            jsx(SettingRow, { label: translate('enablePlayControl') },
                jsx(Switch, { "aria-label": translate('enablePlayControl'), checked: daylightConfig.playButtons, onChange: evt => { _onEnablePlayControlChanged(evt.target.checked); } })),
            (daylightConfig.playButtons && daylightConfig.dateOrSeason === DateOrSeason.Date) &&
                jsx(React.Fragment, null,
                    jsx(SettingRow, { label: translate('autoPlay') },
                        jsx(Switch, { "aria-label": translate('autoPlay'), checked: daylightConfig.dateTimeAutoPlay, onChange: evt => { _onSettingChanged({ dateTimeAutoPlay: evt.target.checked }); } })),
                    jsx(SettingRow, { label: translate('daytimePlaySpeed') },
                        jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: daylightConfig.playSpeedMultiplier, defaultValue: DEFALUT_PARAMS.speedDefault, min: DEFALUT_PARAMS.speedMin, max: DEFALUT_PARAMS.speedMax, step: 0.5, onChange: (val) => { _onSettingChanged({ playSpeedMultiplier: val }); }, required: true }))),
            jsx(SettingRow, { label: translate('dateTimeOption') },
                jsx(Switch, { "aria-label": translate('dateTimeOption'), checked: daylightConfig.dateTimeToggle, onChange: evt => { _onSettingChanged({ dateTimeToggle: evt.target.checked }); } })),
            jsx(SettingRow, { label: translate('shadowOption') },
                jsx(Switch, { "aria-label": translate('shadowOption'), checked: daylightConfig.isShowShadows, onChange: evt => { _onSettingChanged({ isShowShadows: evt.target.checked }); } }))),
        jsx(AcitvedOnLoad, { toolConfig: props.toolConfig, onAcitvedChanged: checkedFlag => _onSettingChanged(null, checkedFlag) })));
});
//# sourceMappingURL=daylight.js.map