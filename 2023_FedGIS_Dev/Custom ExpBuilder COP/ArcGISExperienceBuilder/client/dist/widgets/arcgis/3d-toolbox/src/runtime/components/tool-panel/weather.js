/** @jsx jsx */
import { React } from 'jimu-core';
import Weather from 'esri/widgets/Weather';
//import WeatherViewModel from 'esri/widgets/Weather/WeatherViewModel'
import { WeatherType } from '../../../constraints';
import { useEnvDefault } from './utils/env-defaults';
export const useWeather = (props) => {
    const { cacheDefaultWeather, restoreDefaultWeather } = useEnvDefault();
    const { onUpdated } = props;
    const widgetRef = React.useRef(null);
    const DEFALUT_PARAMS = React.useMemo(() => {
        return {
            cloudCover: 0.5,
            precipitation: 0.5,
            fogStrength: 0.5
        };
    }, []);
    const envWatcher = React.useRef(null);
    const setDefaultConfig = React.useCallback((type, view) => {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (type) {
            case WeatherType.Sunny: {
                const params = props.weatherConfig.sunnyConfig;
                view.environment.weather = {
                    type: type,
                    cloudCover: (_a = params === null || params === void 0 ? void 0 : params.cloudCover) !== null && _a !== void 0 ? _a : DEFALUT_PARAMS.cloudCover
                };
                break;
            }
            case WeatherType.Cloudy: {
                const params = props.weatherConfig.cloudyConfig;
                view.environment.weather = {
                    type: type,
                    cloudCover: (_b = params === null || params === void 0 ? void 0 : params.cloudCover) !== null && _b !== void 0 ? _b : DEFALUT_PARAMS.cloudCover
                };
                break;
            }
            case WeatherType.Rainy: {
                const params = props.weatherConfig.rainyConfig;
                view.environment.weather = {
                    type: type,
                    cloudCover: (_c = params === null || params === void 0 ? void 0 : params.cloudCover) !== null && _c !== void 0 ? _c : DEFALUT_PARAMS.cloudCover,
                    precipitation: (_d = params === null || params === void 0 ? void 0 : params.precipitation) !== null && _d !== void 0 ? _d : DEFALUT_PARAMS.precipitation
                };
                break;
            }
            case WeatherType.Snowy: {
                const params = props.weatherConfig.snowyConfig;
                view.environment.weather = {
                    type: type,
                    cloudCover: (_e = params === null || params === void 0 ? void 0 : params.cloudCover) !== null && _e !== void 0 ? _e : DEFALUT_PARAMS.cloudCover,
                    precipitation: (_f = params === null || params === void 0 ? void 0 : params.precipitation) !== null && _f !== void 0 ? _f : DEFALUT_PARAMS.precipitation
                    //snowCover: params?.snowCover ?? 'disabled'
                };
                break;
            }
            case WeatherType.Foggy: {
                const params = props.weatherConfig.foggyConfig;
                view.environment.weather = {
                    type: type,
                    fogStrength: (_g = params === null || params === void 0 ? void 0 : params.fogStrength) !== null && _g !== void 0 ? _g : DEFALUT_PARAMS.fogStrength
                };
                break;
            }
            default: {
                break;
            }
        }
    }, [props.weatherConfig, DEFALUT_PARAMS]);
    //1
    const _updateWidget = React.useCallback((domRef) => {
        var _a;
        const view = (_a = props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view;
        cacheDefaultWeather(view);
        setDefaultConfig(props.weatherConfig.weatherType, view);
        widgetRef.current = new Weather({
            //id: props.id,
            container: domRef,
            view: view
            // viewModel: new WeatherViewModel({
            //   view: view//,
            //   //weatherType: props.weatherConfig.weatherType
            // })
        });
        widgetRef.current.when(() => {
            onUpdated();
            // init weatherType
            //widgetRef.current.viewModel.setWeatherByType(props.weatherConfig.weatherType)
            // every time when switching weather type, set default config ,#10116
            envWatcher.current = view.watch('environment.weather.type', () => {
                //console.log('==>111 ' + view.environment.weather.type)
                setDefaultConfig(view.environment.weather.type, view);
            });
        });
        return widgetRef.current;
    }, [props.jimuMapView, props.weatherConfig.weatherType,
        setDefaultConfig,
        cacheDefaultWeather, onUpdated]);
    const _destoryWidget = React.useCallback(() => {
        var _a;
        (_a = envWatcher === null || envWatcher === void 0 ? void 0 : envWatcher.current) === null || _a === void 0 ? void 0 : _a.remove();
        restoreDefaultWeather(props.jimuMapView.view);
    }, [props.jimuMapView,
        restoreDefaultWeather]);
    // export interfaces
    return {
        // ref
        weatherRef: widgetRef.current,
        // update
        updateWeatherWidget: _updateWidget,
        // remove
        destoryWeatherWidget: _destoryWidget
    };
};
//# sourceMappingURL=weather.js.map