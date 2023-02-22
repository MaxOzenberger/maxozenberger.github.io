/** @jsx jsx */
import { React, jsx, css, polished, LayoutType, ReactRedux } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { getAppConfigAction } from 'jimu-for-builder';
import { hooks, Icon, Button, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { ModeType } from '../config';
import defaultMessage from './translations/default';
import { isDefined } from '../utils/utils';
import TemplateSetting from './component/template-setting';
import CommonTemplateSetting from './component/template-common-setting';
const { useEffect } = React;
const CLASSIC_DEFAULT_SIZE = {
    width: '360px',
    height: '460px'
};
const COMPACT_DEFAULT_SIZE = {
    width: '40px',
    height: '40px'
};
const Setting = (props) => {
    const { config, id, portalUrl, onSettingChange, useMapWidgetIds } = props;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const layoutInfo = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.widgetsState[id]) === null || _b === void 0 ? void 0 : _b.layoutInfo; });
    const appConfig = ReactRedux.useSelector((state) => state.appStateInBuilder.appConfig);
    const [jimuMapView, setJimuMapView] = React.useState(null);
    const SYLE = css `
    .select-mode-con {
      &>div {
        flex: 1;
      }
      button {
        height: ${polished.rem(80)};
        background: var(--light-200);
        border: 2px solid transparent;
        &:not(:disabled):not(.disabled).active {
          border-color: var(--primary);
          background: var(--light-200);
        }
      }
      img {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .text-wrap {
      overflow: hidden;
      white-space: pre-wrap;
    }
    .setting-collapse {
      & {
        margin-bottom: ${polished.rem(8)};
      }
      .collapse-header {
        line-height: 2.2;
        padding-left: ${polished.rem(8)} !important;
        padding-right: ${polished.rem(8)} !important;
      }
      .handle{
        height: ${polished.rem(32)};
        background: var(--light-500);
        padding-left: ${polished.rem(8)};
        padding-right: ${polished.rem(8)};
      }
    }
  `;
    useEffect(() => {
        initDefaultBorder();
    }, [config]);
    const initDefaultBorder = () => {
        var _a, _b;
        const style = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.style;
        if (!(config === null || config === void 0 ? void 0 : config.hasInitBorder) && !(style === null || style === void 0 ? void 0 : style.border)) {
            const appConfigAction = getAppConfigAction();
            const defaultBorder = {
                color: 'var(--light-400)',
                type: 'solid',
                width: '1px'
            };
            let newStyle;
            if (style) {
                newStyle = style.set('border', defaultBorder);
            }
            else {
                newStyle = {
                    border: defaultBorder
                };
            }
            const newConfig = config === null || config === void 0 ? void 0 : config.set('hasInitBorder', true);
            appConfigAction
                .editWidgetProperty(id, 'style', newStyle)
                .editWidgetProperty(id, 'config', newConfig)
                .exec();
        }
    };
    const handlePropertyChange = (key, value) => {
        if ((config === null || config === void 0 ? void 0 : config[key]) === value)
            return false;
        const newConfig = config.setIn([key], value);
        onSettingChange({
            id: id,
            config: newConfig
        });
    };
    const handleMapWidgetChange = (useMapWidgetIds) => {
        onSettingChange({
            id: id,
            useMapWidgetIds: useMapWidgetIds
        });
    };
    const handleActiveViewChange = (newJimuMapView) => {
        if (!isDefined(newJimuMapView) || newJimuMapView.view.type === '3d') {
            setJimuMapView(null);
        }
        else if ((newJimuMapView === null || newJimuMapView === void 0 ? void 0 : newJimuMapView.id) !== (jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id)) {
            setJimuMapView(newJimuMapView);
        }
    };
    const handleModeTypeChange = (modeType) => {
        var _a;
        const newConfig = config.setIn(['modeType'], modeType);
        //Edit default size of print layout when change mode type
        const appConfigAction = getAppConfigAction();
        let printSize = CLASSIC_DEFAULT_SIZE;
        if (modeType === ModeType.Compact) {
            printSize = COMPACT_DEFAULT_SIZE;
        }
        const layoutType = getLayoutType();
        if (layoutType === LayoutType.FixedLayout) {
            const { layoutId, layoutItemId } = layoutInfo;
            const layout = appConfig.layouts[layoutId];
            const layoutItem = (_a = layout === null || layout === void 0 ? void 0 : layout.content) === null || _a === void 0 ? void 0 : _a[layoutItemId];
            const bbox = layoutItem.bbox.set('width', printSize.width).set('height', printSize.height);
            appConfigAction
                .editLayoutItemBBox(layoutInfo, bbox)
                .editWidgetProperty(id, 'config', newConfig)
                .exec();
        }
        else {
            appConfigAction
                .editWidgetProperty(id, 'config', newConfig)
                .exec();
        }
    };
    const handleTemplatePropertyChange = (templateProperty) => {
        const newConfig = config.set('commonSetting', templateProperty);
        onSettingChange({
            id: id,
            config: newConfig
        });
    };
    //Get layout type
    const getLayoutType = () => {
        var _a, _b;
        const layoutId = layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.layoutId;
        const layoutType = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.type;
        return layoutType;
    };
    const renderModeSetting = () => {
        return (jsx(SettingSection, { className: 'map-selector-section' },
            jsx(SettingRow, { flow: 'wrap', label: nls('printMode'), role: 'group', "aria-label": nls('printMode') },
                jsx("div", { className: 'd-flex w-100 select-mode-con' },
                    jsx("div", { className: 'flex-grow-1 text-truncate' },
                        jsx(Button, { className: 'w-100', title: nls('printClassic'), active: (config === null || config === void 0 ? void 0 : config.modeType) === ModeType.Classic, onClick: () => { handleModeTypeChange(ModeType.Classic); } },
                            jsx(Icon, { autoFlip: true, icon: require('./assets/Classic.svg') })),
                        jsx("div", { className: 'mt-1 w-100 text-center text-truncate', title: nls('printClassic') }, nls('printClassic'))),
                    jsx("div", { className: 'flex-grow-1 ml-2 text-truncate' },
                        jsx(Button, { className: 'w-100', active: (config === null || config === void 0 ? void 0 : config.modeType) === ModeType.Compact, title: nls('printCompact'), onClick: () => { handleModeTypeChange(ModeType.Compact); } },
                            jsx(Icon, { autoFlip: true, icon: require('./assets/Compact.svg') })),
                        jsx("div", { className: 'mt-1 text-center text-truncate', title: nls('printCompact') }, nls('printCompact')))))));
    };
    return (jsx("div", { className: 'widget-setting-search jimu-widget-search', css: SYLE },
        jsx(SettingSection, { className: 'map-selector-section', title: nls('printSource') },
            jsx(SettingRow, { flow: 'wrap', label: nls('selectMap'), role: 'group', "aria-label": nls('selectMap') },
                jsx(MapWidgetSelector, { onSelect: handleMapWidgetChange, useMapWidgetIds: useMapWidgetIds })),
            jsx("div", { className: 'fly-map' },
                jsx("div", null,
                    jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0], onActiveViewChange: handleActiveViewChange })))),
        renderModeSetting(),
        jsx(TemplateSetting, { id: id, config: config, portalUrl: portalUrl, handlePropertyChange: handlePropertyChange, onSettingChange: onSettingChange, jimuMapView: jimuMapView }),
        (config === null || config === void 0 ? void 0 : config.useUtility) && jsx(SettingSection, { title: nls('templateCommonSettings'), role: 'group', "aria-label": nls('templateCommonSettings') },
            jsx(CommonTemplateSetting, { id: id, printTemplateProperties: config === null || config === void 0 ? void 0 : config.commonSetting, handleTemplatePropertyChange: handleTemplatePropertyChange, modeType: config === null || config === void 0 ? void 0 : config.modeType, jimuMapView: jimuMapView }))));
};
export default Setting;
//# sourceMappingURL=setting.js.map