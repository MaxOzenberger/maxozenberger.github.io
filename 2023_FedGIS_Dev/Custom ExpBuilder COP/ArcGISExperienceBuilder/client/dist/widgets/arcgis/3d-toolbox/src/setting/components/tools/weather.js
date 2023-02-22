/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Select, NumericInput, /*Switch,*/ defaultMessages as jimuUIMessages } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { WeatherType } from '../../../constraints';
import { AcitvedOnLoad } from './sub-comp/actived-on-load';
export const Weather = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const { onSettingChanged, hanldeToolSettingChanged } = props;
    const _onSettingChanged = React.useCallback((config, activedOnLoadFlag) => {
        onSettingChanged(hanldeToolSettingChanged(props.toolConfig, config, activedOnLoadFlag));
    }, [props.toolConfig,
        onSettingChanged, hanldeToolSettingChanged]);
    // SettingCollapse states
    const [isShowSunnyConfigState, setIsShowSunnyConfigState] = React.useState(false);
    const handleIsShowSunnyConfigState = () => {
        setIsShowSunnyConfigState(!isShowSunnyConfigState);
    };
    const [isShowCloudyConfigState, setIsShowCloudyConfigState] = React.useState(false);
    const handleIsShowCloudyConfigState = () => {
        setIsShowCloudyConfigState(!isShowCloudyConfigState);
    };
    const [isShowRainyConfigState, setIsShowRainyConfigState] = React.useState(false);
    const handleIsShowRainyConfigState = () => {
        setIsShowRainyConfigState(!isShowRainyConfigState);
    };
    const [isShowSnowyConfigState, setIsShowSnowyConfigState] = React.useState(false);
    const handleIsShowSnowyConfigState = () => {
        setIsShowSnowyConfigState(!isShowSnowyConfigState);
    };
    const [isShowFoggyConfigState, setIsShowFoggyConfigState] = React.useState(false);
    const handleIsShowFoggyConfigState = () => {
        setIsShowFoggyConfigState(!isShowFoggyConfigState);
    };
    // SettingCollapse states
    const weatherTypes = [WeatherType.Sunny, WeatherType.Cloudy, WeatherType.Rainy, WeatherType.Snowy, WeatherType.Foggy];
    const weatherConfig = props.toolConfig.config;
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { className: 'first-setting-section' },
            jsx(SettingRow, { label: translate('defaultWeather') }),
            jsx(SettingRow, null,
                jsx(Select, { size: 'sm', value: weatherConfig.weatherType, onChange: (evt) => _onSettingChanged({ weatherType: evt.target.value }), className: '' }, weatherTypes.map((type, idx) => {
                    return jsx("option", { key: idx, value: type }, translate(type));
                })))),
        jsx(SettingSection, null,
            jsx(SettingRow, { label: translate('defaultValues') }),
            jsx(SettingCollapse, { label: translate('sunnyDay'), isOpen: isShowSunnyConfigState, onRequestOpen: handleIsShowSunnyConfigState, onRequestClose: handleIsShowSunnyConfigState, className: "my-3" },
                jsx(SettingRow, { label: translate('cloudCover'), className: "mx-1 my-2" },
                    jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.sunnyConfig).cloudCover, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => { _onSettingChanged({ sunnyConfig: { cloudCover: val } }); }, required: true }))),
            jsx(SettingCollapse, { label: translate('cloudyDay'), isOpen: isShowCloudyConfigState, onRequestOpen: handleIsShowCloudyConfigState, onRequestClose: handleIsShowCloudyConfigState, className: "my-3" },
                jsx(SettingRow, { label: translate('cloudCover'), className: "mx-1 my-2" },
                    jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.cloudyConfig).cloudCover, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => { _onSettingChanged({ cloudyConfig: { cloudCover: val } }); }, required: true }))),
            jsx(SettingCollapse, { label: translate('rainyDay'), isOpen: isShowRainyConfigState, onRequestOpen: handleIsShowRainyConfigState, onRequestClose: handleIsShowRainyConfigState, className: "my-3" },
                jsx(React.Fragment, null,
                    jsx(SettingRow, { label: translate('cloudCover'), className: "mx-1 my-2" },
                        jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.rainyConfig).cloudCover, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => {
                                _onSettingChanged({
                                    rainyConfig: Object.assign(Object.assign({}, weatherConfig.rainyConfig), { cloudCover: val })
                                });
                            }, required: true })),
                    jsx(SettingRow, { label: translate('precipitation'), className: "mx-1 my-2" },
                        jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.rainyConfig).precipitation, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => {
                                _onSettingChanged({
                                    rainyConfig: Object.assign(Object.assign({}, weatherConfig.rainyConfig), { precipitation: val })
                                });
                            }, required: true })))),
            jsx(SettingCollapse, { label: translate('snowyDay'), isOpen: isShowSnowyConfigState, onRequestOpen: handleIsShowSnowyConfigState, onRequestClose: handleIsShowSnowyConfigState, className: "my-3" },
                jsx(React.Fragment, null,
                    jsx(SettingRow, { label: translate('cloudCover'), className: "mx-1 my-2" },
                        jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.snowyConfig).cloudCover, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => {
                                _onSettingChanged({
                                    snowyConfig: Object.assign(Object.assign({}, weatherConfig.snowyConfig), { cloudCover: val })
                                });
                            }, required: true })),
                    jsx(SettingRow, { label: translate('precipitation'), className: "mx-1 my-2" },
                        jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.snowyConfig).precipitation, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => {
                                _onSettingChanged({
                                    snowyConfig: Object.assign(Object.assign({}, weatherConfig.snowyConfig), { precipitation: val })
                                });
                            }, required: true })))),
            jsx(SettingCollapse, { label: translate('foggyDay'), isOpen: isShowFoggyConfigState, onRequestOpen: handleIsShowFoggyConfigState, onRequestClose: handleIsShowFoggyConfigState, className: "my-3" },
                jsx(SettingRow, { label: translate('fogStrength'), className: "mx-1 my-2" },
                    jsx(NumericInput, { className: 'ml-2 numeric-input', size: 'sm', value: (weatherConfig.foggyConfig).fogStrength, defaultValue: 0.5, min: 0, max: 1, step: 0.1, onChange: (val) => { _onSettingChanged({ foggyConfig: { fogStrength: val } }); }, required: true })))),
        jsx(AcitvedOnLoad, { toolConfig: props.toolConfig, onAcitvedChanged: checkedFlag => _onSettingChanged(null, checkedFlag) })));
});
//# sourceMappingURL=weather.js.map