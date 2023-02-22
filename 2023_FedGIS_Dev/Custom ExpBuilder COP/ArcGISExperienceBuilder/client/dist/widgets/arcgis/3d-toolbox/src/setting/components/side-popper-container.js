/** @jsx jsx */
import { React, jsx, Immutable } from 'jimu-core';
import { useTheme } from 'jimu-theme';
import { SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components';
import { hooks, defaultMessages as jimuUIMessages } from 'jimu-ui';
import defaultMessages from '../translations/default';
import { getStyle } from './style';
import { ToolsID } from '../../constraints';
import { Daylight } from './tools/daylight';
import { Weather } from './tools/weather';
import { ShadowCast } from './tools/shadowcast';
import { LineOfSight } from './tools/lineofsight';
export const SidePopperContainer = React.memo((props) => {
    const theme = useTheme();
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const findConfigbyId = React.useCallback((toolsID) => {
        const tool = props.toolsConfig.find((tool) => (tool.id === toolsID));
        if (tool && tool.config) {
            return tool;
        }
        else {
            return null;
        }
    }, [props.toolsConfig]);
    const hanldeToolSettingChanged = React.useCallback((toolConfig, config, activedOnLoadFlag) => {
        const newToolsConfig = Object.assign({}, toolConfig);
        if (config) {
            newToolsConfig.config = Object.assign(Object.assign({}, newToolsConfig.config), config);
        }
        if (typeof activedOnLoadFlag !== 'undefined') {
            newToolsConfig.activedOnLoad = activedOnLoadFlag;
        }
        return newToolsConfig;
    }, []);
    // update AllConfig.tools
    const _onSettingChanged = props.onSettingChanged;
    const onSettingChanged = React.useCallback((id, toolConfig) => {
        const foundIdx = props.toolsConfig.findIndex((tool) => (tool.id === id));
        if (foundIdx > -1) {
            //const newToolsConfig = Immutable.setIn(props.toolsConfig, [foundIdx, 'config'], config)
            const newToolsConfig = Immutable.setIn(props.toolsConfig, [foundIdx.toString()], toolConfig);
            _onSettingChanged(newToolsConfig);
        }
    }, [_onSettingChanged, props.toolsConfig]);
    //const [isOpenState, setIsOpenState] = React.useState(false)
    const sidePopperTitle = translate(props.shownMode ? props.shownMode : 'tools'); // Tool.id
    return (jsx(React.Fragment, null,
        jsx(SidePopper, { title: sidePopperTitle, css: getStyle(theme), isOpen: (props.shownMode !== null), toggle: () => props.onSidePopperClose(), trigger: null, position: "right" },
            jsx(SettingSection, { className: 'side-popper-container' },
                jsx("div", { className: 'side-popper' },
                    props.shownMode === ToolsID.Daylight &&
                        jsx(React.Fragment, null,
                            jsx(Daylight, { toolConfig: findConfigbyId(ToolsID.Daylight), hanldeToolSettingChanged: hanldeToolSettingChanged, onSettingChanged: (toolConfig) => {
                                    onSettingChanged(ToolsID.Daylight, toolConfig);
                                } })),
                    props.shownMode === ToolsID.Weather &&
                        jsx(Weather, { toolConfig: findConfigbyId(ToolsID.Weather), hanldeToolSettingChanged: hanldeToolSettingChanged, onSettingChanged: (toolConfig) => {
                                onSettingChanged(ToolsID.Weather, toolConfig);
                            } }),
                    props.shownMode === ToolsID.ShadowCast &&
                        jsx(ShadowCast, { toolConfig: findConfigbyId(ToolsID.ShadowCast), hanldeToolSettingChanged: hanldeToolSettingChanged, onSettingChanged: (toolConfig) => {
                                onSettingChanged(ToolsID.ShadowCast, toolConfig);
                            } }),
                    props.shownMode === ToolsID.LineOfSight &&
                        jsx(LineOfSight, { toolConfig: findConfigbyId(ToolsID.LineOfSight), hanldeToolSettingChanged: hanldeToolSettingChanged, onSettingChanged: (toolConfig) => {
                                onSettingChanged(ToolsID.LineOfSight, toolConfig);
                            } }))))));
});
//# sourceMappingURL=side-popper-container.js.map