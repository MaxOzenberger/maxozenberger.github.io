/** @jsx jsx */
import { React, jsx, ReactRedux, Immutable, getAppStore, appActions } from 'jimu-core';
import { ViewType } from '../config';
import { Palceholder } from './components/placeholder';
import { ViewNavigation } from './components/view-navigation';
import { versionManager } from '../version-manager';
import { hooks } from 'jimu-ui';
import { useWidgetStyle, useSectionViewsChange, useNavigationLinks, useHandleSectionsChange, useContainerSectionChange, useHandleViewsChange, useSwitchView, useUpdateProgress, useAppModeChange, useNavTemplates, useWidgetSelectedChange, useQuickStyleOpen, useNavigationViews } from './utils';
const { useRef, useEffect, useState } = React;
const { useSelector, useDispatch } = ReactRedux;
const getNavButtonGroupInfo = (currentViewId, progress, useProgress, views) => {
    var _a, _b;
    let disablePrevious, disableNext;
    const totalPage = (_a = views === null || views === void 0 ? void 0 : views.length) !== null && _a !== void 0 ? _a : 0;
    let current = !(views === null || views === void 0 ? void 0 : views.includes(currentViewId)) ? 0 : views === null || views === void 0 ? void 0 : views.indexOf(currentViewId);
    current = current + 1;
    if (!useProgress) {
        disablePrevious = current <= 1;
        disableNext = current === totalPage;
    }
    else {
        let index = 0;
        const length = (_b = views === null || views === void 0 ? void 0 : views.length) !== null && _b !== void 0 ? _b : 0;
        if (length > 1) {
            index = progress * (length - 1);
            const offset = index % 1;
            index = Math.floor(index);
            disablePrevious = index === 0 && offset === 0;
            disableNext = index === totalPage - 1 && offset === 0;
        }
    }
    return { current, totalPage, disableNext, disablePrevious };
};
const Widget = (props) => {
    var _a, _b, _c, _d, _e;
    const { id, config, builderSupportModules, onInitDragHandler, onInitResizeHandler } = props;
    const dispatch = useDispatch();
    const getAppConfigAction = (_a = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.jimuForBuilderLib) === null || _a === void 0 ? void 0 : _a.getAppConfigAction;
    const nodeRef = useRef(null);
    const { current: isInBuilder } = useRef((_c = (_b = getAppStore().getState()) === null || _b === void 0 ? void 0 : _b.appContext) === null || _c === void 0 ? void 0 : _c.isInBuilder);
    const showQuickStyle = useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.showQuickStyle; });
    const hasEverMount = useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.widgetsState) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.hasEverMount; });
    const templates = useNavTemplates(isInBuilder);
    const display = config === null || config === void 0 ? void 0 : config.display;
    const data = config === null || config === void 0 ? void 0 : config.data;
    const propStandard = display === null || display === void 0 ? void 0 : display.standard;
    const type = data === null || data === void 0 ? void 0 : data.type;
    const section = data === null || data === void 0 ? void 0 : data.section;
    const step = (_d = propStandard === null || propStandard === void 0 ? void 0 : propStandard.step) !== null && _d !== void 0 ? _d : 1;
    const [isMount, setIsMount] = useState(false);
    const defaultView = useSelector((state) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[section]) === null || _c === void 0 ? void 0 : _c.views) === null || _d === void 0 ? void 0 : _d[0]; });
    const sectionNavInfo = useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.sectionNavInfos) === null || _b === void 0 ? void 0 : _b[section]; });
    const views = useNavigationViews(section, data === null || data === void 0 ? void 0 : data.views, type);
    const links = useNavigationLinks(views);
    const progress = sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.progress;
    const useProgress = sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.useProgress;
    const currentViewId = (_e = sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.currentViewId) !== null && _e !== void 0 ? _e : defaultView;
    const style = useWidgetStyle(display === null || display === void 0 ? void 0 : display.vertical);
    const standard = React.useMemo(() => {
        const navButtonGroupInfo = getNavButtonGroupInfo(currentViewId, progress, useProgress, views);
        return Object.assign(Object.assign({}, propStandard), navButtonGroupInfo);
    }, [currentViewId, progress, propStandard, useProgress, views]);
    const closeQuickStyle = React.useCallback(() => {
        dispatch(appActions.widgetStatePropChange(id, 'showQuickStyle', false));
    }, [dispatch, id]);
    //When view navigation display changed (by quick style), save them to config
    const handleTemplateChange = (_display) => {
        if (!getAppConfigAction)
            return;
        const display = Immutable(_display).set('vertical', false).set('advanced', false).set('variant', null);
        getAppConfigAction().editWidgetProperty(id, 'config', config.setIn(['data', 'type'], ViewType.Auto).set('display', display)).exec();
    };
    //Monitor and trigger quick-style close when related state changed
    useAppModeChange(id);
    useWidgetSelectedChange(id);
    //Automatically display quick style panel for the newly added navigator
    useQuickStyleOpen(id, hasEverMount);
    //Listen the changes of sections
    const handleSectionsChange = useHandleSectionsChange(id, getAppConfigAction);
    useContainerSectionChange(id, handleSectionsChange);
    //Listen the changes of views
    const handleViewChange = useHandleViewsChange(id, getAppConfigAction);
    useSectionViewsChange(section, handleViewChange);
    //The method used to switch views
    const switchView = useSwitchView(section);
    //The method used to update the progress of `SectionNavInfo`
    const updateProgress = useUpdateProgress(section);
    const handleChange = hooks.useEventCallback((type, value) => {
        if (type === 'navButtonGroup') {
            switchView(value, step);
        }
        else if (type === 'slider') {
            updateProgress(value);
        }
    });
    useEffect(() => {
        if (!isMount) {
            setIsMount(true);
        }
        // eslint-disable-next-line
    }, []);
    const NavQuickStyle = builderSupportModules === null || builderSupportModules === void 0 ? void 0 : builderSupportModules.widgetModules.NavQuickStyle;
    return jsx("div", { className: "widget-view-navigation jimu-widget", css: style, ref: nodeRef },
        jsx(Palceholder, { widgetId: id, show: !links.length }),
        jsx(ViewNavigation, Object.assign({ data: links, activeView: currentViewId, progress: progress, onChange: handleChange }, display, { standard: standard })),
        isMount && NavQuickStyle && jsx(NavQuickStyle, { templates: templates, display: config === null || config === void 0 ? void 0 : config.display, onChange: handleTemplateChange, onClose: closeQuickStyle, open: showQuickStyle, reference: nodeRef.current, onInitDragHandler: onInitDragHandler, onInitResizeHandler: onInitResizeHandler }));
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map