/** @jsx jsx */
import { React } from 'jimu-core';
import Daylight from 'esri/widgets/Daylight';
import DaylightViewModel from 'esri/widgets/Daylight/DaylightViewModel';
import { DateOrSeason, Season } from '../../../constraints';
import { useEnvDefault } from './utils/env-defaults';
export const useDaylight = (props) => {
    const { cacheDefaultLighting, restoreDefaultLighting } = useEnvDefault();
    const { onUpdated } = props;
    const widgetRef = React.useRef(null);
    // const _initEnv = React.useCallback((view: __esri.SceneView) => {
    //   view.environment.lighting.directShadowsEnabled = props.daylightConfig.isShowShadows ?? true
    // }, [props.daylightConfig])
    //1
    const _updateWidget = React.useCallback((domRef) => {
        var _a, _b;
        const view = (_a = props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view;
        cacheDefaultLighting(view);
        //_initEnv(view)
        //vm
        // TODO
        const vmOptions = {
            view: view
        };
        // if (props.daylightConfig.dateOrSeason === DateOrSeason.Season &&
        //   props.daylightConfig.currentSeason !== Season.SyncedWithMap) {
        //   vmOptions = { ...vmOptions, ...{ currentSeason: props.daylightConfig.currentSeason } }
        // }
        // eslint-disable-next-line
        const vm = new DaylightViewModel(vmOptions); // API bug ,#9697
        widgetRef.current = new Daylight({
            //id: props.id,
            container: domRef,
            view: view,
            visibleElements: {
                timezone: props.daylightConfig.timezone,
                playButtons: props.daylightConfig.playButtons,
                datePicker: props.daylightConfig.datePicker,
                sunLightingToggle: props.daylightConfig.dateTimeToggle,
                shadowsToggle: props.daylightConfig.isShowShadows
            },
            timeSliderSteps: props.daylightConfig.timeSliderSteps,
            playSpeedMultiplier: props.daylightConfig.playSpeedMultiplier,
            dateOrSeason: (_b = props.daylightConfig.dateOrSeason) !== null && _b !== void 0 ? _b : DateOrSeason.Date
            //viewModel: new DaylightViewModel(vmOptions) // API bug ,#9697
        });
        widgetRef.current.when(() => {
            onUpdated();
            // TODO API bug ,#9697
            if (props.daylightConfig.dateOrSeason === DateOrSeason.Season &&
                props.daylightConfig.currentSeason !== Season.SyncedWithMap) {
                //vmOptions = { ...vmOptions, ...{ currentSeason: props.daylightConfig.currentSeason } }
                widgetRef.current.viewModel.set('currentSeason', props.daylightConfig.currentSeason);
            }
            const autoPlay = props.daylightConfig.dateTimeAutoPlay;
            if (props.daylightConfig.dateOrSeason === DateOrSeason.Season) {
                // widgetRef.current.viewModel.set('yearPlaying', autoPlay)
            }
            else {
                widgetRef.current.viewModel.set('dayPlaying', autoPlay);
            }
        });
        return widgetRef.current;
    }, [props.jimuMapView, props.daylightConfig,
        //_initEnv,
        cacheDefaultLighting, onUpdated]);
    const _destoryWidget = React.useCallback(() => {
        restoreDefaultLighting(props.jimuMapView.view);
    }, [props.jimuMapView,
        restoreDefaultLighting]);
    // export interfaces
    return {
        // ref
        daylightRef: widgetRef.current,
        // update
        updateDaylightWidget: _updateWidget,
        // remove
        destoryDaylightWidget: _destoryWidget
    };
};
//# sourceMappingURL=daylight.js.map