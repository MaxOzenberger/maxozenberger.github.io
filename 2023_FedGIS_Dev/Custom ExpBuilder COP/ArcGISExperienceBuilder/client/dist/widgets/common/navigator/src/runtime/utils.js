import { React, ReactRedux, css, polished, appActions, Immutable, LinkType, lodash, getIndexFromProgress, getAppStore, LayoutItemType } from 'jimu-core';
import { ViewType } from '../config';
import { hooks, componentStyleUtils, styleUtils, utils, TextAlignValue, defaultMessages as jimuDefaultMessage } from 'jimu-ui';
import defaultMessages from './translations/default';
import { searchUtils } from 'jimu-layouts/layout-runtime';
const { useEffect, useMemo, useCallback } = React;
const { useSelector, useDispatch } = ReactRedux;
const dotIcon = require('jimu-ui/lib/icons/navigation/dot.svg');
const leftArrowIcon = require('jimu-ui/lib/icons/arrow-left-12.svg');
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right-12.svg');
const MIN_SIZE = 16;
const addFloatNumber = (base, increase) => {
    const magnification = 100;
    const baseInt = base * magnification;
    const increaseInt = increase * magnification;
    return (baseInt + increaseInt) / magnification;
};
export const useWidgetStyle = (vertical) => {
    return useMemo(() => {
        return css `
    overflow: hidden;
    min-height: ${vertical ? polished.rem(MIN_SIZE) : 'unset'};
    min-width: ${!vertical ? polished.rem(MIN_SIZE) : 'unset'};
  `;
    }, [vertical]);
};
export const useContainerSections = (id) => {
    const layouts = ReactRedux.useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.layouts; });
    const sections = ReactRedux.useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.sections; });
    const sizeMode = ReactRedux.useSelector((state) => state === null || state === void 0 ? void 0 : state.browserSizeMode);
    return React.useMemo(() => {
        const appConfig = getAppStore().getState().appConfig;
        return searchUtils.getContentsInTheSameContainer(appConfig, id, LayoutItemType.Widget, LayoutItemType.Section, sizeMode) || [];
        // We listen for changes in appConfig.sections and appConfig.layouts instead of appConfig, which can reduce the number of times we re render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, sizeMode, sections, layouts]);
};
/**
 * Get currentPageId from appRuntimeInfo or get defaultPageId from appConfig.pages
 * @param pages
 */
const useCurrentPageId = () => {
    return useSelector((state) => {
        const pages = state.appConfig.pages;
        const defaultPageId = Object.keys(pages).find(pId => { var _a; return (_a = pages === null || pages === void 0 ? void 0 : pages[pId]) === null || _a === void 0 ? void 0 : _a.isDefault; });
        const currentPageId = state.appRuntimeInfo.currentPageId;
        return currentPageId || defaultPageId;
    });
};
/**
 * Get view id from NavigationItem
 * @param item
 */
export const getViewId = (item) => {
    if (!(item === null || item === void 0 ? void 0 : item.value))
        return '';
    const splits = item.value.split(',');
    return (splits === null || splits === void 0 ? void 0 : splits.length) ? splits[1] : '';
};
/**
 * When `appMode` changed, close quick style planel
 * @param widgetId
 */
export const useAppModeChange = (widgetId) => {
    const dispatch = useDispatch();
    const appMode = useSelector((state) => utils.isWidgetSelected(widgetId, state) ? state.appRuntimeInfo.appMode : null);
    hooks.useUpdateEffect(() => {
        dispatch(appActions.widgetStatePropChange(widgetId, 'showQuickStyle', false));
    }, [appMode, widgetId]);
};
/**
 * When the views of specified section changed, trigger a callback function
 * @param section
 * @param callback
 */
export const useSectionViewsChange = (section, callback) => {
    const views = useSelector((state) => { var _a, _b, _c; return (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[section]) === null || _c === void 0 ? void 0 : _c.views; });
    const { current: isInBuilder } = React.useRef(getAppStore().getState().appContext.isInBuilder);
    const callbackRef = hooks.useRefValue(callback);
    useEffect(() => {
        var _a;
        isInBuilder && ((_a = callbackRef.current) === null || _a === void 0 ? void 0 : _a.call(callbackRef, views));
    }, [views, callbackRef, isInBuilder]);
};
/**
 * When widget container sections changed, trigger a callback function
 * @param id Widget id
 * @param callback
 */
export const useContainerSectionChange = (id, callback) => {
    const sections = useContainerSections(id);
    const callbackRef = hooks.useRefValue(callback);
    const { current: isInBuilder } = React.useRef(getAppStore().getState().appContext.isInBuilder);
    //When the sections are changed, check whether the current section is in the sections.
    //If not, set the sections[0] as config.data.section
    useEffect(() => {
        var _a;
        isInBuilder && ((_a = callbackRef.current) === null || _a === void 0 ? void 0 : _a.call(callbackRef, sections));
    }, [sections, isInBuilder, callbackRef]);
};
/**
 * When widget selected state changed to is false, close quick style planel
 * @param widgetId
 * @param callback
 */
export const useWidgetSelectedChange = (widgetId) => {
    const selected = hooks.useWidgetSelected(widgetId);
    const dispatch = useDispatch();
    hooks.useUpdateEffect(() => {
        if (!selected) {
            dispatch(appActions.widgetStatePropChange(widgetId, 'showQuickStyle', false));
        }
    }, [selected, widgetId]);
};
/**
 * Get next(previous) `SectionNavInfo`
 * @param section
 * @param nextViewId
 */
const getNextNavInfo = (previous, currentViewId, visibleViews, views = Immutable([])) => {
    let currentIndex = views.indexOf(currentViewId);
    currentIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = previous ? Math.max(0, currentIndex - 1) : Math.min(views.length - 1, currentIndex + 1);
    const nextViewId = views[nextIndex];
    return Immutable({ visibleViews }).set('previousViewId', currentViewId)
        .set('currentViewId', nextViewId)
        .set('useProgress', false)
        .set('progress', views.indexOf(nextViewId) / (views.length - 1));
};
/**
 * Return a function to change `SectionNavInfo` with previous or next view id(when step is 1) or progress (when step is 0 - 1)
 * @param section
 */
export const useSwitchView = (section) => {
    const dispatch = useDispatch();
    return useCallback((previous, step) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const state = (_a = getAppStore()) === null || _a === void 0 ? void 0 : _a.getState();
        const views = (_c = (_b = state.appConfig.sections) === null || _b === void 0 ? void 0 : _b[section]) === null || _c === void 0 ? void 0 : _c.views;
        const sectionNavInfo = (_e = (_d = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _d === void 0 ? void 0 : _d.sectionNavInfos) === null || _e === void 0 ? void 0 : _e[section];
        const currentViewId = (sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.currentViewId) || views[0];
        const visibleViews = (sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.visibleViews) || views;
        const progress = (_f = sectionNavInfo === null || sectionNavInfo === void 0 ? void 0 : sectionNavInfo.progress) !== null && _f !== void 0 ? _f : 0;
        let nextNavInfo = null;
        if (!((_j = (_h = (_g = state.appConfig) === null || _g === void 0 ? void 0 : _g.sections) === null || _h === void 0 ? void 0 : _h[section]) === null || _j === void 0 ? void 0 : _j.transition) || ((_o = (_m = (_l = (_k = state.appConfig) === null || _k === void 0 ? void 0 : _k.sections) === null || _l === void 0 ? void 0 : _l[section]) === null || _m === void 0 ? void 0 : _m.transition) === null || _o === void 0 ? void 0 : _o.type) === 'None') {
            step = Math.ceil(step);
        }
        if (step === 1) {
            nextNavInfo = getNextNavInfo(previous, currentViewId, views, visibleViews);
        }
        else {
            const nextProgress = previous ? Math.max(addFloatNumber(progress, -(step / (views.length - 1))), 0) : Math.min(addFloatNumber(progress, step / (views.length - 1)), 1);
            nextNavInfo = getProgressNavInfo(nextProgress, views, visibleViews);
        }
        dispatch(appActions.sectionNavInfoChanged(section, nextNavInfo));
    }, [dispatch, section]);
};
/**
 * Get `SectionNavInfo` by new progress
 * @param section
 * @param progress
 */
export const getProgressNavInfo = (progress, visibleViews, views = Immutable([])) => {
    const result = getIndexFromProgress(progress, views.length);
    return Immutable({ visibleViews }).set('previousViewId', views[result.previousIndex])
        .set('currentViewId', views[result.currentIndex])
        .set('useProgress', true)
        .set('progress', progress);
};
/**
 * Return a function to change `SectionNavInfo` by new progress
 * @param section
 */
export const useUpdateProgress = (section) => {
    const dispatch = useDispatch();
    return useCallback((progress) => {
        var _a, _b, _c, _d, _e, _f;
        const state = (_a = getAppStore()) === null || _a === void 0 ? void 0 : _a.getState();
        const views = (_c = (_b = state.appConfig.sections) === null || _b === void 0 ? void 0 : _b[section]) === null || _c === void 0 ? void 0 : _c.views;
        const visibleViews = (_f = (_e = (_d = state.appRuntimeInfo) === null || _d === void 0 ? void 0 : _d.sectionNavInfos) === null || _e === void 0 ? void 0 : _e[section]) === null || _f === void 0 ? void 0 : _f.visibleViews;
        const nevInfo = getProgressNavInfo(progress, views, visibleViews);
        dispatch(appActions.sectionNavInfoChanged(section, nevInfo));
    }, [dispatch, section]);
};
/**
 * Generate component styles to override the default
 * @param type
 * @param navStyle
 * @param advanced
 * @param variant
 * @param vertical
 */
export const useAdvanceStyle = (type, navStyle, advanced, variant, vertical, hideThumb) => {
    return useMemo(() => {
        var _a, _b, _c;
        if (!advanced || !variant)
            return css ``;
        const isRTL = (_c = (_b = (_a = getAppStore()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.appContext) === null || _c === void 0 ? void 0 : _c.isRTL;
        if (type === 'nav')
            return navAdvanceStyle(navStyle, variant, vertical, isRTL);
        if (type === 'navButtonGroup')
            return navButtonGroupAdvanceStyle(variant);
        if (type === 'slider')
            return sliderAdvanceStyle(variant, hideThumb, isRTL);
        return css ``;
    }, [advanced, type, navStyle, variant, vertical, hideThumb]);
};
const navAdvanceStyle = (navStyle, variant, vertical, isRTL) => {
    return css `
    .jimu-nav{
      ${componentStyleUtils.nav.getRootStyles(variant === null || variant === void 0 ? void 0 : variant.root)};
      ${componentStyleUtils.nav.getVariantStyles(navStyle, variant, vertical, isRTL)};
      ${styleUtils.getButtonStyleByState(variant === null || variant === void 0 ? void 0 : variant.item, true)}
    }
`;
};
const navButtonGroupAdvanceStyle = (variant) => {
    return css `
    .nav-button-group {
      ${componentStyleUtils.navButtonGroup.getVariantStyles(variant)};
      ${styleUtils.getButtonStyleByState(variant === null || variant === void 0 ? void 0 : variant.item, false)}
    }
 `;
};
const sliderAdvanceStyle = (variant, hideThumb, isRTL) => {
    return css `
   > .jimu-slider {
    ${componentStyleUtils.slider.getRootStyles(variant === null || variant === void 0 ? void 0 : variant.root)};
    ${componentStyleUtils.slider.getVariantStyles(variant, hideThumb, isRTL)};
   }
 `;
};
/**
 * When the container sections are changed, check whether the current section is in the sections,
 * if not, set the sections[0] as  config.data.section
 * @param id
 * @param config
 * @param getAppConfigAction
 */
export const useHandleSectionsChange = (id, getAppConfigAction) => {
    return useCallback((sections) => {
        var _a;
        const config = getAppStore().getState().appConfig.widgets[id].config;
        const section = (_a = config === null || config === void 0 ? void 0 : config.data) === null || _a === void 0 ? void 0 : _a.section;
        if (!(sections === null || sections === void 0 ? void 0 : sections.includes(section))) {
            if (!section && !(sections === null || sections === void 0 ? void 0 : sections[0]))
                return;
            getAppConfigAction().editWidgetProperty(id, 'config', config.setIn(['data', 'section'], sections === null || sections === void 0 ? void 0 : sections[0])).exec(false);
        }
    }, [getAppConfigAction, id]);
};
/**
 * When views changed, if `ViewType` is `auto`, set all views to config
 * if `custom` and `config.views` is in current views, keep them, otherwise, clear config.views
 * @param id
 * @param config
 * @param getAppConfigAction
 */
export const useHandleViewsChange = (id, getAppConfigAction) => {
    return useCallback((views) => {
        var _a, _b, _c, _d, _e, _f;
        const config = getAppStore().getState().appConfig.widgets[id].config;
        const viewType = (_a = config === null || config === void 0 ? void 0 : config.data) === null || _a === void 0 ? void 0 : _a.type;
        const vs = viewType === ViewType.Custom ? (_c = (_b = config === null || config === void 0 ? void 0 : config.data) === null || _b === void 0 ? void 0 : _b.views) === null || _c === void 0 ? void 0 : _c.filter(view => views === null || views === void 0 ? void 0 : views.includes(view)) : views;
        if (!(vs === null || vs === void 0 ? void 0 : vs.length) && !((_e = (_d = config === null || config === void 0 ? void 0 : config.data) === null || _d === void 0 ? void 0 : _d.views) === null || _e === void 0 ? void 0 : _e.length))
            return;
        if (!lodash.isDeepEqual(vs, (_f = config === null || config === void 0 ? void 0 : config.data) === null || _f === void 0 ? void 0 : _f.views)) {
            getAppConfigAction().editWidgetProperty(id, 'config', config.setIn(['data', 'views'], vs)).exec(false);
        }
    }, [getAppConfigAction, id]);
};
/**
 * Generate navigation data by view ids
 * @param views
 */
export const useNavigationLinks = (views) => {
    const viewJsons = useSelector((state) => state.appConfig.views);
    const pageId = useCurrentPageId();
    return React.useMemo(() => {
        var _a;
        return (_a = views === null || views === void 0 ? void 0 : views.map((view) => {
            var _a;
            const label = (_a = viewJsons === null || viewJsons === void 0 ? void 0 : viewJsons[view]) === null || _a === void 0 ? void 0 : _a.label;
            return {
                name: label,
                linkType: LinkType.View,
                value: `${pageId},${view}`
            };
        })) !== null && _a !== void 0 ? _a : Immutable([]);
    }, [pageId, viewJsons, views]);
};
/**
 * When the type is `ViewType.Auto`, we use the latest section views. Otherwise, we use the views of config
 * @param section
 * @param configViews
 * @param type
 */
export const useNavigationViews = (section, configViews, type) => {
    const views = useSelector((state) => { var _a, _b, _c; return (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[section]) === null || _c === void 0 ? void 0 : _c.views; });
    return React.useMemo(() => {
        const _Views = ((type === ViewType.Custom ? configViews : views) || Immutable([])).asMutable();
        _Views.sort((a, b) => {
            return (views === null || views === void 0 ? void 0 : views.indexOf(a)) - (views === null || views === void 0 ? void 0 : views.indexOf(b));
        });
        return Immutable(_Views);
    }, [configViews, views, type]);
};
/**
 * Automatically display quick style panel for the newly added navigation widget
 * @param widgetId
 */
export const useQuickStyleOpen = (widgetId, hasEverMount) => {
    const selected = hooks.useWidgetSelected(widgetId);
    const dispatch = useDispatch();
    useEffect(() => {
        if (selected && !hasEverMount) {
            dispatch(appActions.widgetStatePropChange(widgetId, 'showQuickStyle', true));
            dispatch(appActions.widgetStatePropChange(widgetId, 'hasEverMount', true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
/**
 * Generate a key for a view navigation config
 * @param display
 */
export const generateDisplayKey = (display) => {
    var _a, _b;
    const { type, navStyle } = display || {};
    const { showIcon, showText, alternateIcon, showPageNumber } = (_a = display === null || display === void 0 ? void 0 : display.standard) !== null && _a !== void 0 ? _a : {};
    if (display.type === 'nav') {
        const { filename } = (_b = alternateIcon === null || alternateIcon === void 0 ? void 0 : alternateIcon.properties) !== null && _b !== void 0 ? _b : {};
        return `${type}-${navStyle}-${showIcon ? 'showIcon' : 'hideIcon'}-${showText ? 'showText' : 'hideText'}-icon-${filename}`;
    }
    else if (type === 'navButtonGroup') {
        return `${type}-${navStyle}-${showPageNumber ? 'showPageNumber' : ''}`;
    }
};
/**
 * Generate view navigation display array for quick-style
 */
export const useNavTemplates = (isInBuilder) => {
    const translate = hooks.useTranslate(jimuDefaultMessage, defaultMessages);
    return useMemo(() => {
        if (!isInBuilder)
            return;
        return [{
                label: translate('tabDefault'),
                type: 'nav',
                navStyle: 'default',
                standard: {
                    gap: '0px',
                    scrollable: true,
                    showIcon: false,
                    showText: true,
                    iconPosition: 'start',
                    textAlign: TextAlignValue.CENTER
                }
            }, {
                label: translate('tabUnderline'),
                type: 'nav',
                navStyle: 'underline',
                standard: {
                    gap: '0px',
                    scrollable: true,
                    showIcon: false,
                    showText: true,
                    iconPosition: 'start',
                    textAlign: TextAlignValue.CENTER
                }
            }, {
                label: translate('tabPills'),
                type: 'nav',
                navStyle: 'pills',
                standard: {
                    gap: '0px',
                    scrollable: true,
                    showIcon: false,
                    showText: true,
                    iconPosition: 'start',
                    textAlign: TextAlignValue.CENTER
                }
            }, {
                label: translate('symbol'),
                type: 'nav',
                navStyle: 'default',
                standard: {
                    scrollable: false,
                    gap: '10px',
                    showIcon: true,
                    alternateIcon: utils.toIconResult(dotIcon, 'dot-6', 8),
                    activedIcon: utils.toIconResult(dotIcon, 'dot-10', 8),
                    showText: false,
                    iconPosition: 'start',
                    textAlign: TextAlignValue.CENTER
                }
            }, {
                label: translate('slider'),
                type: 'slider',
                navStyle: 'default'
            }, {
                label: translate('arrow1'),
                type: 'navButtonGroup',
                navStyle: 'default',
                standard: {
                    showPageNumber: true,
                    previousText: '',
                    previousIcon: utils.toIconResult(leftArrowIcon, 'left-arrow-12', 12),
                    nextText: '',
                    nextIcon: utils.toIconResult(rightArrowIcon, 'right-arrow-12', 12)
                }
            }, {
                label: translate('arrow2'),
                type: 'navButtonGroup',
                navStyle: 'tertiary',
                standard: {
                    previousText: translate('prev'),
                    previousIcon: utils.toIconResult(leftArrowIcon, 'left-arrow-12', 12),
                    nextText: translate('next'),
                    nextIcon: utils.toIconResult(rightArrowIcon, 'right-arrow-12', 12)
                }
            }, {
                label: translate('arrow3'),
                type: 'navButtonGroup',
                navStyle: 'tertiary',
                standard: {
                    showPageNumber: true,
                    previousText: '',
                    previousIcon: utils.toIconResult(leftArrowIcon, 'left-arrow-12', 12),
                    nextText: '',
                    nextIcon: utils.toIconResult(rightArrowIcon, 'right-arrow-12', 12)
                }
            }];
    }, [translate, isInBuilder]);
};
//# sourceMappingURL=utils.js.map