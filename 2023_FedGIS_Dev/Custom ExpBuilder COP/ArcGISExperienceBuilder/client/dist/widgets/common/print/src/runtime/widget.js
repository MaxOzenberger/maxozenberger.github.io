/** @jsx jsx */
import { React, jsx, css, appActions, ReactRedux, classNames } from 'jimu-core';
import { WidgetPlaceholder, hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { ModeType } from '../config';
import widgetPrintOutlined from 'jimu-icons/svg/outlined/brand/widget-print.svg';
import defaultMessage from './translations/default';
import Classic from './component/classic';
import CompactPrint from './component/compact';
import { checkIsCustomTemplate } from '../utils/utils';
import { versionManager } from '../version-manager';
const { useState, useRef, useEffect } = React;
const Widget = (props) => {
    const { id, config, dispatch, useMapWidgetIds, layoutId, layoutItemId } = props;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const selectionIsSelf = ReactRedux.useSelector((state) => {
        var _a;
        const selection = (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.selection;
        const selectionIsSelf = !!(selection && selection.layoutId === layoutId && selection.layoutItemId === layoutItemId);
        return selectionIsSelf;
    });
    const isSetlayoutRef = useRef(false);
    const STYLE = css `
    .jimu-widget-placeholder {
      border: none;
    }
    &.classic {
      background: var(--white);
    }
    .checkbox-con:hover {
      color: var(--dark-800);
    }
  `;
    useEffect(() => {
        setListLayoutInWidgetState();
        // eslint-disable-next-line
    }, [selectionIsSelf]);
    useEffect(() => {
        getTemplateList();
        // eslint-disable-next-line
    }, [config]);
    const [jimuMapView, setJimuMapView] = useState(null);
    const [errorTip, setErrorTip] = useState(nls('printPleaceholder'));
    const [templateList, setTemplateList] = useState(null);
    const getTemplateList = () => {
        const isCustomTemplate = checkIsCustomTemplate(config === null || config === void 0 ? void 0 : config.printServiceType, config === null || config === void 0 ? void 0 : config.printTemplateType);
        const template = isCustomTemplate ? config === null || config === void 0 ? void 0 : config.printCustomTemplate : config === null || config === void 0 ? void 0 : config.printOrgTemplate;
        setTemplateList(template);
    };
    const setListLayoutInWidgetState = () => {
        if (layoutId && id && layoutItemId && !isSetlayoutRef.current && selectionIsSelf) {
            dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', {
                layoutId,
                layoutItemId
            }));
            isSetlayoutRef.current = true;
        }
    };
    const handleActiveViewChange = (jimuMapView) => {
        // Async errors
        if (jimuMapView === null || undefined === jimuMapView) {
            setErrorTip(nls('chooseMapTip'));
            setJimuMapView(null);
            return; // skip null
        }
        if (jimuMapView.view.type !== '2d') {
            setErrorTip(nls('chooseMapTip'));
            setJimuMapView(null);
            return; // skip 2D
        }
        if (!useMapWidgetIds || (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) === 0) {
            setErrorTip(nls('printPleaceholder'));
        }
        setJimuMapView(jimuMapView); // 2d
    };
    const handleViewGroupCreate = (viewGroup) => {
        // setViewGroup(viewGroup)
    };
    // Render pleaceholder
    const renderWidgetPlaceholder = () => {
        return jsx(WidgetPlaceholder, { icon: widgetPrintOutlined, widgetId: id, message: getErrorTip() });
    };
    const getErrorTip = () => {
        let errMsg = errorTip;
        if (jimuMapView && !(config === null || config === void 0 ? void 0 : config.useUtility)) {
            errMsg = '';
        }
        return errMsg;
    };
    // Render map content
    const renderMapContent = () => {
        return (jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0], onActiveViewChange: handleActiveViewChange, onViewGroupCreate: handleViewGroupCreate }));
    };
    const checkShowPlaceholder = () => {
        return !jimuMapView || !(config === null || config === void 0 ? void 0 : config.useUtility);
    };
    return (jsx("div", { className: classNames('w-100 h-100', { classic: (config === null || config === void 0 ? void 0 : config.modeType) === ModeType.Classic }), css: STYLE },
        jsx("div", { className: 'map' },
            jsx("div", null, renderMapContent())),
        (config === null || config === void 0 ? void 0 : config.modeType) === ModeType.Classic && jsx("div", { className: 'w-100 h-100' },
            !checkShowPlaceholder() && jsx(Classic, { id: id, config: config, jimuMapView: jimuMapView, templateList: templateList }),
            checkShowPlaceholder() && renderWidgetPlaceholder()),
        (config === null || config === void 0 ? void 0 : config.modeType) === ModeType.Compact && jsx("div", { className: 'w-100 h-100' },
            jsx(CompactPrint, { id: id, config: config, jimuMapView: jimuMapView, templateList: templateList, errorTip: getErrorTip() }))));
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map