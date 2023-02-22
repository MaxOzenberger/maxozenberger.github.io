/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Button, Label, Loading, LoadingType, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { useTheme } from 'jimu-theme';
import defaultMessages from '../../translations/default';
import { ToolsID } from '../../../constraints';
import { getStyle } from './style';
import { useDaylight } from './daylight';
import { useWeather } from './weather';
import { useShadowCast } from './shadowcast';
import { useLineOfSight } from './lineofsight';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
export const ToolPanel = React.memo((props) => {
    var _a, _b, _c;
    const theme = useTheme();
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const domContainerRef = React.useRef(null);
    const widgetRef = React.useRef(null);
    // 508
    const backBtnRefFor508 = React.useRef(null);
    React.useEffect(() => {
        var _a, _b;
        if (props.isShowBackBtn && (((_a = props.shownModeState) === null || _a === void 0 ? void 0 : _a.id) === props.mode)) {
            (_b = backBtnRefFor508 === null || backBtnRefFor508 === void 0 ? void 0 : backBtnRefFor508.current) === null || _b === void 0 ? void 0 : _b.focus(); // 508
        }
    }, [props.shownModeState, props.isShowBackBtn, props.mode]);
    const keepApiWidgetFlagRef = React.useRef(props.toolConfig.activedOnLoad);
    React.useEffect(() => {
        keepApiWidgetFlagRef.current = props.toolConfig.activedOnLoad;
    }, [props.toolConfig]); // update flag when config changed
    const [isLoadingState, setIsLoadingState] = React.useState(true); // API loading flag
    const hideApiLoading = React.useCallback(() => {
        setIsLoadingState(false);
    }, []);
    // widgets
    const { updateDaylightWidget, destoryDaylightWidget } = useDaylight({
        jimuMapView: props.jimuMapView,
        daylightConfig: props.toolConfig.config,
        onUpdated: hideApiLoading
    });
    const { updateWeatherWidget, destoryWeatherWidget } = useWeather({
        jimuMapView: props.jimuMapView,
        weatherConfig: props.toolConfig.config,
        onUpdated: hideApiLoading
    });
    const { updateShadowCastWidget, destoryShadowCastWidget } = useShadowCast({
        jimuMapView: props.jimuMapView,
        shadowCastConfig: props.toolConfig.config,
        onUpdated: hideApiLoading
    });
    const { updateLineOfSightWidget, destoryLineOfSightWidget } = useLineOfSight({
        jimuMapView: props.jimuMapView,
        lineOfSightConfig: props.toolConfig.config,
        onUpdated: hideApiLoading
    });
    function createContainerDom(id) {
        const c = document.createElement('div');
        c.className = id + '-container w-100';
        domContainerRef.current.innerHTML = '';
        domContainerRef.current.appendChild(c);
        return c;
    }
    const destoryWidget = React.useCallback(() => {
        var _a, _b, _c;
        //console.log('==> destoryWidget ' + props.mode)
        if ((_b = (_a = widgetRef.current) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.map) {
            // subclass destruction implementation
            switch (props.mode) {
                case ToolsID.Daylight: {
                    destoryDaylightWidget();
                    break;
                }
                case ToolsID.Weather: {
                    destoryWeatherWidget();
                    break;
                }
                case ToolsID.ShadowCast: {
                    destoryShadowCastWidget();
                    break;
                }
                case ToolsID.LineOfSight: {
                    destoryLineOfSightWidget();
                    break;
                }
                default: {
                    break;
                }
            }
        }
        (_c = widgetRef === null || widgetRef === void 0 ? void 0 : widgetRef.current) === null || _c === void 0 ? void 0 : _c.destroy();
        widgetRef.current = null;
        if (domContainerRef === null || domContainerRef === void 0 ? void 0 : domContainerRef.current) {
            domContainerRef.current.innerHTML = '';
        }
    }, [props.mode,
        destoryDaylightWidget, destoryWeatherWidget,
        destoryShadowCastWidget, destoryLineOfSightWidget]);
    const initWidget = React.useCallback(() => {
        destoryWidget();
        //console.log('==> initWidget ' + props.mode)
        const isEnable = props.toolConfig.enable;
        if (isEnable) {
            switch (props.mode) {
                case ToolsID.Daylight: {
                    widgetRef.current = updateDaylightWidget(createContainerDom(props.mode));
                    break;
                }
                case ToolsID.Weather: {
                    widgetRef.current = updateWeatherWidget(createContainerDom(props.mode));
                    break;
                }
                case ToolsID.ShadowCast: {
                    widgetRef.current = updateShadowCastWidget(createContainerDom(props.mode));
                    break;
                }
                case ToolsID.LineOfSight: {
                    widgetRef.current = updateLineOfSightWidget(createContainerDom(props.mode));
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }, [props.mode, props.toolConfig,
        destoryWidget,
        updateDaylightWidget, updateWeatherWidget, updateShadowCastWidget, updateLineOfSightWidget
    ]);
    // on map changed
    React.useEffect(() => {
        if (!props.useMapWidgetId) {
            destoryWidget();
        }
        return () => {
            destoryWidget();
        };
    }, [(_a = props.jimuMapView) === null || _a === void 0 ? void 0 : _a.view, props.useMapWidgetId,
        props.toolConfig,
        destoryWidget, initWidget]);
    // on shownModeState changed
    const { onBackBtnClick } = props;
    React.useEffect(() => {
        var _a, _b;
        if (((_a = props.shownModeState) === null || _a === void 0 ? void 0 : _a.id) === props.mode) {
            keepApiWidgetFlagRef.current = true; // reset to true
        } // else : 1.init by 'toolConfig.activedOnLoad'; 2. destory by click 'Back&Clear'
        if (keepApiWidgetFlagRef === null || keepApiWidgetFlagRef === void 0 ? void 0 : keepApiWidgetFlagRef.current) {
            if (!widgetRef.current && props.useMapWidgetId && ((_b = props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view)) {
                initWidget();
            }
        }
        else {
            if (widgetRef.current) {
                destoryWidget();
            }
        }
    }, [props.mode,
        props.useMapWidgetId, (_b = props.jimuMapView) === null || _b === void 0 ? void 0 : _b.view, // map changed
        props.shownModeState,
        props.toolConfig,
        //keepApiWidgetState,
        destoryWidget, initWidget]);
    const _isShow = (((_c = props.shownModeState) === null || _c === void 0 ? void 0 : _c.id) === props.mode);
    const clearTips = (props.mode === ToolsID.Daylight || props.mode === ToolsID.Weather) ? translate('clearEffect') : translate('clearAnalysis');
    return (jsx("div", { className: 'p-2 w-100 ' + (_isShow ? 'd-block' : 'd-none'), css: getStyle(theme) },
        ((props.isShowBackBtn) && (typeof onBackBtnClick === 'function')) &&
            jsx("div", { className: "tool-header d-flex align-items-center my-1" },
                jsx(Button, { ref: ref => { backBtnRefFor508.current = ref; }, className: "", type: 'tertiary', icon: true, size: 'sm', onClick: onBackBtnClick },
                    jsx(ArrowLeftOutlined, { size: 16, autoFlip: true })),
                jsx(Label, { className: "label ml-1 my-0" }, translate(props.mode))),
        jsx("div", { className: "tool-content" },
            isLoadingState && jsx("div", { className: "api-loader m-2" },
                jsx(Loading, { type: LoadingType.Secondary })),
            jsx("div", { ref: domContainerRef }),
            jsx("div", { className: "tool-footer w-100 px-3 mb-2" },
                jsx(Button, { type: "secondary", className: 'w-100', onClick: () => {
                        keepApiWidgetFlagRef.current = false;
                        //setKeepApiWidgetState(false)
                        onBackBtnClick();
                    } }, clearTips)))));
});
//# sourceMappingURL=index.js.map