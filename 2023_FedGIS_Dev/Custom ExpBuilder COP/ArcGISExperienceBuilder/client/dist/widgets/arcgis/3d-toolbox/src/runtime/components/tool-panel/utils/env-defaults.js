/** @jsx jsx */
import { React } from 'jimu-core';
// export interface EnvDefaultProps {
//   jimuMapView: JimuMapView
// }
export const useEnvDefault = ( /*props: EnvDefaultProps*/) => {
    // 1.Lighting
    const defaultLightingRef = React.useRef(null);
    const cacheDefaultLighting = React.useCallback((view) => {
        if (!defaultLightingRef.current) {
            const defautLighting = view.environment.lighting.clone();
            defaultLightingRef.current = defautLighting;
        }
    }, []);
    const restoreDefaultLighting = React.useCallback((view) => {
        if (view && defaultLightingRef.current) {
            view.environment.lighting = defaultLightingRef.current;
        }
        defaultLightingRef.current = null;
    }, []);
    // 2.Weather
    const defaultWeatherRef = React.useRef(null);
    const cacheDefaultWeather = React.useCallback((view) => {
        if (!defaultWeatherRef.current) {
            const defautWeather = view.environment.weather.clone();
            defaultWeatherRef.current = defautWeather;
        }
    }, []);
    const restoreDefaultWeather = React.useCallback((view) => {
        if (view && defaultWeatherRef.current) {
            view.environment.weather = defaultWeatherRef.current;
        }
        defaultWeatherRef.current = null;
    }, []);
    // export interfaces
    return {
        // Lighting
        cacheDefaultLighting: cacheDefaultLighting,
        restoreDefaultLighting: restoreDefaultLighting,
        // Weather
        cacheDefaultWeather: cacheDefaultWeather,
        restoreDefaultWeather: restoreDefaultWeather
    };
};
//# sourceMappingURL=env-defaults.js.map