/** @jsx jsx */
import { React, classNames, css, jsx, polished, AppMode, appActions, getAppStore, ReactResizeDetector, defaultMessages as jimuUIMessages, lodash, utils } from 'jimu-core';
import { WidgetPlaceholder } from 'jimu-ui';
import { Status } from '../config';
import CardEditor from './components/card-editor';
import CardViewer from './components/card-viewer';
import { LayoutEntry, searchUtils, LayoutItemSizeModes } from 'jimu-layouts/layout-runtime';
import defaultMessages from './translations/default';
const COMMON_PADDING = 0;
export class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.setListParentSizeInWidgetState = () => {
            const { browserSizeMode, id, parentSize, layoutId } = this.props;
            const appConfig = getAppStore().getState().appConfig;
            const viewportSize = utils.findViewportSize(appConfig, browserSizeMode);
            const selector = `div.layout[data-layoutid=${layoutId}]`;
            const parentElement = document.querySelector(selector);
            const newParentSize = {
                width: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientWidth) || viewportSize.width,
                height: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientHeight) || viewportSize.height
            };
            if (!parentSize || parentSize.height !== newParentSize.height || parentSize.width !== newParentSize.width) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'parentSize', newParentSize));
            }
        };
        this.setSelectionStatus = () => {
            const { id, selectionIsInSelf } = this.props;
            this.props.dispatch(appActions.widgetStatePropChange(id, 'selectionIsInSelf', selectionIsInSelf));
        };
        this.setSettinglayout = () => {
            const { layoutId, layoutItemId, id, selectionIsSelf } = this.props;
            const { isSetlayout } = this.state;
            if (layoutId && id && layoutItemId && !isSetlayout && selectionIsSelf) {
                this.props.dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', {
                    layoutId,
                    layoutItemId
                }));
                this.setState({
                    isSetlayout: true
                });
            }
        };
        this.onResize = (width, height) => {
            this.updateCardToolPosition();
        };
        this.updateCardToolPosition = () => {
            const { selectionIsSelf } = this.props;
            if (!selectionIsSelf)
                return;
            this.setState({
                hideCardTool: true
            });
            if (this.updateCardToolTimeout) {
                clearTimeout(this.updateCardToolTimeout);
                this.updateCardToolTimeout = undefined;
            }
            this.updateCardToolTimeout = setTimeout(() => {
                this.setState({
                    hideCardTool: false
                });
            }, 500);
        };
        this.formatMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: Object.assign(Object.assign({}, defaultMessages), jimuUIMessages)[id] }, values);
        };
        // call exec manuly
        this.editStatus = (name, value) => {
            const { dispatch, id } = this.props;
            dispatch(appActions.widgetStatePropChange(id, name, value));
        };
        this.editWidgetConfig = newConfig => {
            if (!window.jimuConfig.isInBuilder)
                return;
            const appConfigAction = this.props.builderSupportModules.jimuForBuilderLib.getAppConfigAction();
            appConfigAction.editWidgetConfig(this.props.id, newConfig).exec();
        };
        this.isEditing = () => {
            const { appMode, config, selectionIsSelf, selectionIsInSelf } = this.props;
            if (!window.jimuConfig.isInBuilder)
                return false;
            return ((selectionIsSelf || selectionIsInSelf) &&
                window.jimuConfig.isInBuilder &&
                appMode !== AppMode.Run &&
                config.isItemStyleConfirm);
        };
        this.editBuilderAndSettingStatus = (status) => {
            this.editStatus('showCardSetting', status);
            this.editStatus('builderStatus', status);
        };
        this.getAppConfig = () => {
            return getAppStore().getState().appConfig;
        };
        this.getStyle = (theme) => {
            const { id } = this.props;
            return css `
      ${'&.card-widget-' + id} {
        overflow: visible;
        background-color: transparent;
        border: ${polished.rem(COMMON_PADDING)} solid
          ${polished.rgba(theme.colors.black, window.jimuConfig.isInBuilder && this.isEditing() ? 0.2 : 0)};
        width: 100%;
        height: 100%;
      }
    `;
        };
        this.getCardProps = () => {
            const { config, selectionIsInSelf, selectionIsSelf, builderStatus, appMode, queryObject } = this.props;
            const isEditor = window.jimuConfig.isInBuilder && appMode === AppMode.Design;
            const editProps = isEditor
                ? {
                    hideCardTool: this.state.hideCardTool,
                    selectionIsCard: selectionIsSelf,
                    selectionIsInCard: selectionIsInSelf,
                    isEditing: this.isEditing(),
                    builderStatus: builderStatus,
                    selectSelf: this.selectSelf
                }
                : {
                    linkParam: config.linkParam,
                    queryObject: queryObject
                };
            return Object.assign(Object.assign({}, this.getOtherProps()), editProps);
        };
        this.getOtherProps = () => {
            const { config, theme, id, appMode, builderSupportModules, layouts, browserSizeMode, dispatch, isRTL, isHeightAuto, isWidthAuto } = this.props;
            return {
                browserSizeMode: browserSizeMode,
                isRTL: isRTL,
                builderSupportModules: builderSupportModules,
                formatMessage: this.formatMessage,
                dispatch: dispatch,
                widgetId: id,
                interact: window.jimuConfig.isInBuilder &&
                    builderSupportModules.widgetModules.interact,
                appMode: appMode,
                theme: theme,
                LayoutEntry: this.state.LayoutEntry,
                layouts: layouts,
                cardConfigs: config,
                isHeightAuto: isHeightAuto,
                isWidthAuto: isWidthAuto
            };
        };
        this.cardRender = () => {
            const props = this.getCardProps();
            const { appMode } = this.props;
            const isEditor = window.jimuConfig.isInBuilder && appMode === AppMode.Design;
            const Card = isEditor ? CardEditor : CardViewer;
            return jsx(Card, Object.assign({}, props));
        };
        const stateObj = {
            LayoutEntry: null,
            hideCardTool: false,
            isSetlayout: false
        };
        if (window.jimuConfig.isInBuilder) {
            stateObj.LayoutEntry = this.props.builderSupportModules.LayoutEntry;
        }
        else {
            stateObj.LayoutEntry = LayoutEntry;
        }
        this.state = stateObj;
        // this.editWidgetConfig('builderStatus', Status.Regular);
        this.onResize = this.onResize.bind(this);
        this.selectSelf = this.selectSelf.bind(this);
        this.debounceOnResize = lodash.debounce((width, height) => this.onResize(width, height), 200);
    }
    componentDidUpdate(preProps, preState) {
        var _a;
        const { appMode, selectionStatus, builderStatus, left, top } = this.props;
        if (appMode !== AppMode.Run &&
            selectionStatus !== builderStatus &&
            selectionStatus) {
            // clear show selected only
            // change status by toc
            this.editBuilderAndSettingStatus(selectionStatus);
        }
        if (preProps.appMode !== appMode && appMode === AppMode.Run) {
            this.editBuilderAndSettingStatus(Status.Regular);
        }
        if ((preProps === null || preProps === void 0 ? void 0 : preProps.selectionIsInSelf) !== ((_a = this.props) === null || _a === void 0 ? void 0 : _a.selectionIsInSelf)) {
            this.setSelectionStatus();
        }
        if (top !== preProps.top || left !== preProps.left) {
            this.updateCardToolPosition();
        }
        this.setSettinglayout();
        this.setListParentSizeInWidgetState();
    }
    selectSelf() {
        if (!window.jimuConfig.isInBuilder)
            return false;
        const { layoutId, layoutItemId } = this.props;
        const layoutInfo = { layoutId, layoutItemId };
        this.props.dispatch(appActions.selectionChanged(layoutInfo));
    }
    render() {
        const { config, id } = this.props;
        const classes = classNames('jimu-widget', 'widget-card', 'card-widget-' + id);
        if (!config.itemStyle) {
            return (jsx(WidgetPlaceholder, { widgetId: this.props.id, icon: require('./assets/icon.svg'), message: this.formatMessage('placeHolderTip') }));
        }
        return (jsx("div", { className: classes, css: this.getStyle(this.props.theme) },
            this.cardRender(),
            jsx(ReactResizeDetector, { handleWidth: true, handleHeight: true, onResize: this.debounceOnResize })));
    }
}
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const appConfig = state && state.appConfig;
    const { layouts, layoutId, layoutItemId, builderSupportModules, id } = props;
    const browserSizeMode = state === null || state === void 0 ? void 0 : state.browserSizeMode;
    const builderStatus = ((state === null || state === void 0 ? void 0 : state.widgetsState[props.id]) &&
        ((_a = state === null || state === void 0 ? void 0 : state.widgetsState[props.id]) === null || _a === void 0 ? void 0 : _a.builderStatus)) ||
        Status.Regular;
    const selection = state && state.appRuntimeInfo && state.appRuntimeInfo.selection;
    const selectionIsInSelf = selection &&
        builderSupportModules &&
        builderSupportModules.widgetModules &&
        builderSupportModules.widgetModules.selectionInCard(selection, id, appConfig, false);
    let selectionStatus;
    if (selectionIsInSelf) {
        selectionStatus = Object.keys(layouts).find(status => searchUtils.findLayoutId(layouts[status], browserSizeMode, appConfig.mainSizeMode) === selection.layoutId);
    }
    const layout = (_b = appConfig.layouts) === null || _b === void 0 ? void 0 : _b[layoutId];
    const layoutSetting = (_d = (_c = layout === null || layout === void 0 ? void 0 : layout.content) === null || _c === void 0 ? void 0 : _c[layoutItemId]) === null || _d === void 0 ? void 0 : _d.setting;
    const isHeightAuto = ((_e = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _e === void 0 ? void 0 : _e.height) === LayoutItemSizeModes.Auto ||
        ((_f = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _f === void 0 ? void 0 : _f.height) === true;
    const isWidthAuto = ((_g = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _g === void 0 ? void 0 : _g.width) === LayoutItemSizeModes.Auto ||
        ((_h = layoutSetting === null || layoutSetting === void 0 ? void 0 : layoutSetting.autoProps) === null || _h === void 0 ? void 0 : _h.width) === true;
    let widgetPosition;
    if (window.jimuConfig.isInBuilder) {
        const bbox = (_m = (_l = (_k = (_j = appConfig.layouts) === null || _j === void 0 ? void 0 : _j[layoutId]) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l[layoutItemId]) === null || _m === void 0 ? void 0 : _m.bbox;
        widgetPosition = bbox && {
            left: bbox.left,
            top: bbox.top
        };
    }
    const selectionIsSelf = (selection === null || selection === void 0 ? void 0 : selection.layoutId) === layoutId &&
        (selection === null || selection === void 0 ? void 0 : selection.layoutItemId) === layoutItemId;
    return {
        selectionIsSelf: selectionIsSelf,
        selectionIsInSelf,
        selectionStatus,
        appMode: (_o = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _o === void 0 ? void 0 : _o.appMode,
        browserSizeMode: state === null || state === void 0 ? void 0 : state.browserSizeMode,
        builderStatus: builderStatus,
        isRTL: (_p = state === null || state === void 0 ? void 0 : state.appContext) === null || _p === void 0 ? void 0 : _p.isRTL,
        left: widgetPosition && widgetPosition.left,
        top: widgetPosition && widgetPosition.top,
        isHeightAuto,
        isWidthAuto,
        queryObject: state.queryObject,
        parentSize: ((_q = state.widgetsState[props.id]) === null || _q === void 0 ? void 0 : _q.parentSize) || null
    };
};
export default Widget;
//# sourceMappingURL=widget.js.map