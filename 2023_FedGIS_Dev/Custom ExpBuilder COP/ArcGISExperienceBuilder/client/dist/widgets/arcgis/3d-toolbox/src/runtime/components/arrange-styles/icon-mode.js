/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, Button, Popper, Label, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { useTheme } from 'jimu-theme';
import defaultMessages from '../../translations/default';
import { ToolsID, ArrangementDirection } from '../../../constraints';
import { ToolPanel } from '../tool-panel/index';
import { getPopperStyle } from './style';
import { DaylightOutlined } from 'jimu-icons/outlined/gis/daylight';
import { WeatherOutlined } from 'jimu-icons/outlined/gis/weather';
import { ShadowCastOutlined } from 'jimu-icons/outlined/gis/shadow-cast';
import { LineOfSightOutlined } from 'jimu-icons/outlined/gis/line-of-sight';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
export const IconMode = React.memo((props) => {
    const theme = useTheme();
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const popperPositionRef = React.useRef(null);
    const [shownModeState, setPopperModeState] = React.useState(null);
    const [popupVisibleState, setPopupVisibleState] = React.useState(false);
    // a11y
    const btnRefFor508 = React.useRef(null);
    // const togglePoppup = React.useCallback((isOpenFlag: boolean/*, forceCloseFlag: boolean*/) => {
    //   const isOpen = isOpenFlag
    //   //let isChange = (popupVisibleState !== isOpen)
    //   // if (forceCloseFlag) { //forceCloseFlag, e.g. page change / unmount
    //   //   isChange = true
    //   //   isOpen = false
    //   // }
    //   setPopupVisibleState(isOpen)
    //   // if (typeof props.onPopperToggle === 'function' && isChange) {
    //   //   props.onPopperToggle(isOpen)
    //   // }
    // }, [/*props, popupVisibleState*/])
    const _closePoppup = React.useCallback(() => {
        var _a;
        setPopperModeState(null);
        (_a = btnRefFor508 === null || btnRefFor508 === void 0 ? void 0 : btnRefFor508.current) === null || _a === void 0 ? void 0 : _a.focus(); // 508
        setPopupVisibleState(false);
    }, []);
    // unmount // hooks.useUnmount(() => {
    React.useEffect(() => {
        btnRefFor508.current = null;
        return () => {
            _closePoppup();
        };
    }, [props.toolsConfig, _closePoppup]);
    // const _currentActiveToolChanged = props.currentActiveToolChanged
    const handlePoppupToggle = React.useCallback((evt, type) => {
        let closePopper = false;
        const isSwitchExbPage = (type === 'pageOrSizeMode');
        // if (isSwitchExbPage) {
        //   _currentActiveToolChanged(null)
        // }
        if (isSwitchExbPage || (evt && evt.key && (evt === null || evt === void 0 ? void 0 : evt.key) === 'Escape')) {
            closePopper = true;
        }
        // if (!evt.key) {
        // TODO mouse click do not hide, like bookmark
        // }
        //const forceCloseFlag = isSwitchExbPage
        if (closePopper) {
            //props.popperPositionRef?.focus() // 508 focus on PreviewBtn
            _closePoppup();
        }
    }, [_closePoppup /*togglePoppup*/]);
    // version
    // const [popperVersion, setPopperVersion] = React.useState(props.popperVersion ?? 0)
    // React.useEffect(() => {
    //   setPopperVersion((_curPopperVersion) => _curPopperVersion + 1)
    // }, [popupVisibleState, props.popperVersion, props.popperPositionRef, props.popperIsVisible])
    // icons
    const _findToolConfigById = props.findToolConfigById;
    const _getIconItem = React.useCallback((tool) => {
        if (!tool.enable) {
            return null; //disable
        }
        const name = translate('' + tool.id);
        let icon = null;
        switch (tool.id) {
            case ToolsID.Daylight: {
                icon = jsx(DaylightOutlined, null);
                break;
            }
            case ToolsID.Weather: {
                icon = jsx(WeatherOutlined, null);
                break;
            }
            case ToolsID.ShadowCast: {
                icon = jsx(ShadowCastOutlined, null);
                break;
            }
            case ToolsID.LineOfSight: {
                icon = jsx(LineOfSightOutlined, null);
                break;
            }
            default: {
                break;
            }
        }
        return jsx("div", { className: 'icon-item d-flex', key: tool.id },
            jsx(Button, { type: 'tertiary', className: 'w-100', size: 'sm', icon: true, active: (shownModeState === null || shownModeState === void 0 ? void 0 : shownModeState.id) === tool.id, title: name, "data-id": tool.id, onClick: (evt) => {
                    const target = evt.target;
                    const btn = target.dataset.id ? target : target.parentElement;
                    popperPositionRef.current = btn; //click on the icon-resizer
                    const id = (popperPositionRef.current.dataset.id);
                    setPopperModeState(_findToolConfigById(id));
                    btnRefFor508.current = btn;
                    setPopupVisibleState(!!id);
                    //togglePoppup(id)
                } }, icon));
    }, [shownModeState, translate, _findToolConfigById]);
    // Avoid the z-index change of popper in widget controller ,#9895
    const keepPopperZIndex = React.useCallback((evt) => {
        var _a;
        evt === null || evt === void 0 ? void 0 : evt.stopPropagation();
        (_a = evt === null || evt === void 0 ? void 0 : evt.nativeEvent) === null || _a === void 0 ? void 0 : _a.stopPropagation();
    }, []);
    const directionClass = props.direction === ArrangementDirection.Horizontal ? 'flex-row' : 'flex-column';
    return (jsx(React.Fragment, null,
        jsx("div", { className: 'icon-item-container d-flex p-1 ' + directionClass, onClick: keepPopperZIndex }, props.toolsConfig.map((tool) => {
            return _getIconItem(tool);
        })),
        jsx(Popper, { reference: popperPositionRef.current, placement: (props.direction === ArrangementDirection.Vertical) ? 'right' : 'bottom', 
            //className='surface-2 border-0'
            offset: [0, 12], showArrow: true, open: popupVisibleState, keepMount: true, 
            //version={popperVersion}
            toggle: handlePoppupToggle, forceLatestFocusElements: true },
            jsx("div", { className: 'content-container', css: getPopperStyle(theme) },
                jsx("div", { className: 'popper-header d-flex px-3 pt-2 align-items-center justify-content-between' },
                    jsx(Label, { className: "popper-title mt-0 py-1" }, translate((shownModeState === null || shownModeState === void 0 ? void 0 : shownModeState.id) ? shownModeState.id : '_widgetLabel')),
                    jsx(Button, { className: 'print-button p-0', type: 'tertiary', size: 'sm', icon: true, onClick: _closePoppup },
                        jsx(CloseOutlined, null))),
                jsx("div", { className: 'popper-content' },
                    jsx(ToolPanel, { mode: ToolsID.Daylight, toolConfig: props.findToolConfigById(ToolsID.Daylight), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, onBackBtnClick: _closePoppup }),
                    jsx(ToolPanel, { mode: ToolsID.Weather, toolConfig: props.findToolConfigById(ToolsID.Weather), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, onBackBtnClick: _closePoppup }),
                    jsx(ToolPanel, { mode: ToolsID.ShadowCast, toolConfig: props.findToolConfigById(ToolsID.ShadowCast), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, onBackBtnClick: _closePoppup }),
                    jsx(ToolPanel, { mode: ToolsID.LineOfSight, toolConfig: props.findToolConfigById(ToolsID.LineOfSight), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, onBackBtnClick: _closePoppup }))))));
});
//# sourceMappingURL=icon-mode.js.map