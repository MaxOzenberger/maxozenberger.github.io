/** @jsx jsx */
import { jsx, React, classNames, LayoutType, ReactRedux } from 'jimu-core';
import { useTheme } from 'jimu-theme';
import { hooks, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { getAppConfigAction } from 'jimu-for-builder';
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { getStyle } from './style';
import { ArrangementStyle, ArrangementDirection } from '../constraints';
import { ToolsContainer } from './components/tools-container';
import { SidePopperContainer } from './components/side-popper-container';
import { ArrangementContainer } from './components/arrangement-container';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
const Setting = (props) => {
    const theme = useTheme();
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const extraStateProps = ReactRedux.useSelector((state) => {
        var _a, _b;
        let appConfig;
        if (window.jimuConfig.isBuilder) {
            appConfig = state.appStateInBuilder.appConfig;
        }
        else {
            appConfig = state.appConfig;
        }
        return {
            appConfig: appConfig,
            layoutInfo: (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.widgetsState[props.id]) === null || _b === void 0 ? void 0 : _b.layoutInfo
        };
    });
    // Map
    const selectedMap = React.useMemo(() => { var _a; return ((_a = props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a.length) > 0; }, [props.useMapWidgetIds]);
    const onMapWidgetSelected = (ids) => {
        props.onSettingChange({
            id: props.id,
            useMapWidgetIds: ids
        });
    };
    // Tools
    const onToolsConfigChanged = (tools) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.setIn(['tools'], tools)
        });
    };
    // Arrangement
    const ControllerStyleSize = {
        list: { w: 350, h: 290 },
        iconHorizontal: { w: 138, h: 42 },
        iconVertical: { w: 42, h: 138 }
    };
    const onArrangementChanged = (arrangement) => {
        var _a, _b, _c, _d;
        let size = ControllerStyleSize.list;
        const { style, direction } = arrangement;
        if (style === ArrangementStyle.List) {
            size = ControllerStyleSize.list;
        }
        else if (style === ArrangementStyle.Icon && direction === ArrangementDirection.Horizontal) {
            size = ControllerStyleSize.iconHorizontal;
        }
        else if (style === ArrangementStyle.Icon && direction === ArrangementDirection.Vertical) {
            size = ControllerStyleSize.iconVertical;
        }
        const layoutId = (_a = extraStateProps.layoutInfo) === null || _a === void 0 ? void 0 : _a.layoutId;
        const layoutType = (_d = (_c = (_b = extraStateProps.appConfig) === null || _b === void 0 ? void 0 : _b.layouts) === null || _c === void 0 ? void 0 : _c[layoutId]) === null || _d === void 0 ? void 0 : _d.type;
        if (layoutId && (layoutType === LayoutType.FixedLayout)) {
            getAppConfigAction().editLayoutItemSize(extraStateProps.layoutInfo, size.w, size.h).exec();
        }
        props.onSettingChange({
            id: props.id,
            config: props.config.setIn(['arrangement'], arrangement)
        });
    };
    // L2 side popper
    const [sidePopperOpenState, setSidePopperOpenState] = React.useState(null);
    const onSidePopperToggle = (toolsID, btnRef) => {
        if (btnRef) {
            toolSettingBtnRefFor508.current = btnRef;
        }
        setSidePopperOpenState(toolsID);
    };
    const onSidePopperSettingChanged = (toolsConfig) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.setIn(['tools'], toolsConfig)
        });
    };
    // 508
    const toolSettingBtnRefFor508 = React.useRef(null);
    React.useEffect(() => {
        if ((sidePopperOpenState === null) && (toolSettingBtnRefFor508 === null || toolSettingBtnRefFor508 === void 0 ? void 0 : toolSettingBtnRefFor508.current)) {
            toolSettingBtnRefFor508.current.focus();
            toolSettingBtnRefFor508.current = null;
        }
    }, [sidePopperOpenState]);
    return (jsx("div", { className: 'widget-setting-directions jimu-widget-setting', css: getStyle(theme) },
        jsx(SettingSection, { title: translate('selectMapWidget'), className: classNames({ 'border-0': !selectedMap }) },
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: onMapWidgetSelected, useMapWidgetIds: props.useMapWidgetIds }))),
        (!selectedMap) && jsx("div", { className: 'd-flex justify-content-center align-items-center placeholder-container' },
            jsx("div", { className: 'text-center' },
                jsx(ClickOutlined, { size: 48, className: 'd-inline-block placeholder-icon mb-2' }),
                jsx("p", { className: 'placeholder-hint' }, translate('selectMapHint')))),
        (selectedMap) && jsx(React.Fragment, null,
            jsx(ToolsContainer, { tools: props.config.tools, onToolsConfigChanged: onToolsConfigChanged, onSidePopperToggle: onSidePopperToggle }),
            jsx(ArrangementContainer, { widgetId: props.id, arrangement: props.config.arrangement, onChange: onArrangementChanged }),
            jsx(React.Fragment, null,
                jsx(SidePopperContainer, { toolsConfig: props.config.tools, shownMode: sidePopperOpenState, onSidePopperClose: () => onSidePopperToggle(null), onSettingChanged: onSidePopperSettingChanged })))));
};
export default Setting;
//# sourceMappingURL=setting.js.map