/** @jsx jsx */
import { React, jsx, classNames } from 'jimu-core';
import { Button, hooks, defaultMessages as jimuUIMessages } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { ToolsID } from '../../../constraints';
import { ToolPanel } from '../tool-panel/index';
import { DaylightOutlined } from 'jimu-icons/outlined/gis/daylight';
import { WeatherOutlined } from 'jimu-icons/outlined/gis/weather';
import { ShadowCastOutlined } from 'jimu-icons/outlined/gis/shadow-cast';
import { LineOfSightOutlined } from 'jimu-icons/outlined/gis/line-of-sight';
export const ListMode = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const [shownModeState, setShownModeState] = React.useState(null);
    // a11y
    const btnRefFor508 = React.useRef(null);
    const onItemClick = React.useCallback((tool, evt) => {
        setShownModeState(tool);
        const target = evt.target; // 508 for back to main-list
        const btn = target.dataset.id ? target : target.parentElement;
        btnRefFor508.current = btn;
    }, []);
    const onBackBtnClick = React.useCallback(() => {
        setShownModeState(null);
    }, []);
    React.useEffect(() => {
        var _a;
        if (shownModeState === null) {
            (_a = btnRefFor508 === null || btnRefFor508 === void 0 ? void 0 : btnRefFor508.current) === null || _a === void 0 ? void 0 : _a.focus(); // 508 for back to main-list
        }
    }, [shownModeState]);
    const _getListItem = React.useCallback((tool) => {
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
        return (jsx(Button, { className: 'list-item d-flex align-items-center pl-2 py-1 my-3 w-100 jimu-outline-inside', type: 'tertiary', title: name, role: 'listitem', key: tool.id, "data-id": tool.id, onClick: (evt) => onItemClick(tool, evt) },
            jsx("div", { className: 'd-flex list-item-icon mx-2' }, icon),
            jsx("div", { className: 'd-flex list-item-name' }, name)));
    }, [translate, onItemClick]);
    return (jsx(React.Fragment, null,
        jsx("div", { className: 'list-item-container d-flex h-100', role: 'list' },
            jsx("div", { className: classNames('main-list w-100 ', { hide: (shownModeState !== null) }) }, props.toolsConfig.map((tool) => {
                return _getListItem(tool);
            })),
            jsx(ToolPanel, { mode: ToolsID.Daylight, toolConfig: props.findToolConfigById(ToolsID.Daylight), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, isShowBackBtn: true, onBackBtnClick: onBackBtnClick }),
            jsx(ToolPanel, { mode: ToolsID.Weather, toolConfig: props.findToolConfigById(ToolsID.Weather), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, isShowBackBtn: true, onBackBtnClick: onBackBtnClick }),
            jsx(ToolPanel, { mode: ToolsID.ShadowCast, toolConfig: props.findToolConfigById(ToolsID.ShadowCast), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, isShowBackBtn: true, onBackBtnClick: onBackBtnClick }),
            jsx(ToolPanel, { mode: ToolsID.LineOfSight, toolConfig: props.findToolConfigById(ToolsID.LineOfSight), useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView, shownModeState: shownModeState, isShowBackBtn: true, onBackBtnClick: onBackBtnClick }))));
});
//# sourceMappingURL=list-mode.js.map