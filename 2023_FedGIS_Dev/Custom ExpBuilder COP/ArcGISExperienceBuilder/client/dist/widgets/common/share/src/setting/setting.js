/** @jsx jsx */
import { React, jsx, Immutable, defaultMessages, LayoutType /*, getAppStore*/ } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { SettingSection, SettingRow, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import { Switch, TextInput, Select, ButtonGroup, defaultMessages as commonMessages } from 'jimu-ui';
import { UiMode, InlineDirection, BtnIconSize, IconColorMode, DefaultIconConfig } from '../config';
import { getStyle } from './style';
import { ArrangementSelector } from './components/arrangement-selector';
import { ItemsSelector } from './components/items-selector';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
import nls from './translations/default';
const UiModeStyleSize = {
    Popup: { w: 24, h: 24 },
    InlineHorizontal: { w: 542, h: 68 },
    InlineVertical: { w: 82, h: 538 } // Vertical
};
export default class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        // 1
        this.onUIModeChanged = (uiMode) => {
            this.triggerLayoutItemSizeChange({ mode: uiMode });
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('uiMode', uiMode)
            });
        };
        // layout size
        this.triggerLayoutItemSizeChange = (opts) => {
            const { mode, dir } = opts;
            const appConfigAction = getAppConfigAction();
            const { layoutInfo } = this.props;
            const size = this.getLayoutItemSize(mode, dir);
            const layoutType = this.getLayoutType();
            if (layoutType === LayoutType.FixedLayout) {
                appConfigAction.editLayoutItemSize(layoutInfo, size.w, size.h).exec();
            }
        };
        this.getLayoutItemSize = (mode, dir) => {
            const uiMode = mode || this.props.config.uiMode;
            const direction = dir || this.props.config.inline.design.direction;
            if (uiMode === UiMode.Popup) {
                return UiModeStyleSize.Popup;
            }
            else if (uiMode === UiMode.Inline) {
                if (direction === InlineDirection.Horizontal) {
                    return UiModeStyleSize.InlineHorizontal;
                }
                else {
                    return UiModeStyleSize.InlineVertical;
                }
            }
        };
        this.getLayoutType = () => {
            var _a, _b;
            const { layoutInfo, appConfig } = this.props;
            const layoutId = layoutInfo.layoutId;
            const layoutType = (_b = (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.layouts) === null || _a === void 0 ? void 0 : _a[layoutId]) === null || _b === void 0 ? void 0 : _b.type;
            return layoutType;
        };
        // 2.1. popup mode
        // onIconColorChange = (color) => {
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.setIn(['popup', 'icon', 'color'], color)
        //   });
        // }
        // onBtnIconSizeChange = (e) => {
        //   var val = e.target.value;
        //   let popup = Immutable(this.props.config.popup);
        //   popup = popup.setIn(['icon', 'size'], val);
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.set('popup', popup)
        //   });
        // }
        this.onIconChange = (icon) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['popup', 'icon'], icon)
            });
        };
        this.onPopupItemsChange = (items) => {
            let popupSetting = Immutable(this.props.config.popup);
            popupSetting = popupSetting.set('items', items);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('popup', popupSetting)
            });
        };
        this.onToolTipConfigChange = (e) => {
            const val = e.target.value;
            let popupSetting = Immutable(this.props.config.popup);
            popupSetting = popupSetting.set('tooltip', val);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('popup', popupSetting)
            });
        };
        // 2.1. popup mode
        // 2.2 inline mode
        this.onInlineItemsChange = (items) => {
            let inlineSetting = Immutable(this.props.config.inline);
            inlineSetting = inlineSetting.set('items', items);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('inline', inlineSetting)
            });
        };
        this.onInlineDirChange = (isVertical) => {
            const dir = isVertical ? InlineDirection.Vertical : InlineDirection.Horizontal;
            this.triggerLayoutItemSizeChange({ dir: dir });
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['inline', 'design', 'direction'], dir)
            });
        };
        this.onIconStyleChange = (radius) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['inline', 'design', 'btnRad'], radius)
            });
        };
        this.onHideLabelChange = (e) => {
            const isChecked = e.target.checked;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['inline', 'design', 'hideLabel'], isChecked)
            });
        };
        // onInlineBtnColorChange = (color) => {
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.setIn(['inline', 'design', 'btnColor'], color)
        //   });
        // }
        // onInlineIconColorChange = (color) => {
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.setIn(['inline', 'design', 'iconColor'], color)
        //   });
        // }
        this.onInlineIconColorChange = (e) => {
            const val = e.target.value;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['inline', 'design', 'iconColor'], val)
            });
        };
        this.onInlineSizeChange = (e) => {
            const val = e.target.value;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['inline', 'design', 'size'], val)
            });
        };
        // 2.2 inline mode
        // for render
        // 2.1
        this._getShareWidgetIcons = () => {
            const shareIcon1 = require('../assets/icons/default-main-icon.svg'); // can't dynamic loading
            const shareIcon2 = require('../assets/icons/share_2.svg');
            const shareIcon3 = require('../assets/icons/share_3.svg');
            const shareIcon4 = require('../assets/icons/share_4.svg');
            const shareIcon5 = require('../assets/icons/share_5.svg');
            const shareIcon6 = require('../assets/icons/share_6.svg');
            const shareIcon7 = require('../assets/icons/share_7.svg');
            const shareIcon8 = require('../assets/icons/share_8.svg');
            const iconList = [shareIcon1, shareIcon2, shareIcon3, shareIcon4, shareIcon5, shareIcon6, shareIcon7, shareIcon8];
            const resList = [];
            for (let i = 0, len = 8; i < len; i++) {
                resList.push({
                    svg: iconList[i],
                    properties: {
                        color: this.props.theme.colors.palette.light[900],
                        size: DefaultIconConfig.properties.size,
                        inlineSvg: DefaultIconConfig.properties.inlineSvg
                    }
                });
            }
            return resList;
        };
        this.renderPopupModeSetting = () => {
            let subSettingUI = null;
            const { theme, intl } = this.props;
            const items = this.props.config.popup.items;
            const shareWidgetIcons = this._getShareWidgetIcons();
            const icon = this.props.config.popup.icon ? this.props.config.popup.icon : shareWidgetIcons[0];
            const iconTip = this.props.intl.formatMessage({ id: 'icon', defaultMessage: defaultMessages.icon });
            const shareOption = this.props.intl.formatMessage({ id: 'shareOption', defaultMessage: nls.shareOption });
            const tooltip = this.props.intl.formatMessage({ id: 'tooltip', defaultMessage: commonMessages.tooltip });
            subSettingUI = (jsx(React.Fragment, null,
                jsx(SettingSection, null,
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between align-items-center w-100 align-items-start' },
                            jsx("h6", { className: 'icon-tip', title: iconTip }, iconTip),
                            jsx(IconPicker, { configurableOption: 'all', hideRemove: true, icon: icon, groups: 'none', customIcons: shareWidgetIcons, onChange: (icon) => this.onIconChange(icon), "aria-label": iconTip, setButtonUseColor: false })))),
                jsx(SettingSection, { title: shareOption },
                    jsx(ItemsSelector, { items: items, theme: theme, intl: intl, title: shareOption, uiMode: this.props.config.uiMode, onItemsChange: this.onPopupItemsChange })),
                jsx(SettingSection, null,
                    jsx(SettingRow, { label: tooltip }),
                    jsx(SettingRow, null,
                        jsx(TextInput, { className: 'w-100', "aria-label": tooltip, size: 'sm', value: this.props.config.popup.tooltip, onChange: this.onToolTipConfigChange })))));
            return subSettingUI;
        };
        // 2.2
        this.renderInlineModeSetting = () => {
            let subSettingUI = null;
            const isVertical = (this.props.config.inline.design.direction === InlineDirection.Vertical);
            const { theme, intl } = this.props;
            const items = this.props.config.inline.items;
            const shareOption = this.props.intl.formatMessage({ id: 'shareOption', defaultMessage: nls.shareOption });
            const design = this.props.intl.formatMessage({ id: 'design', defaultMessage: nls.design });
            const direction = this.props.intl.formatMessage({ id: 'direction', defaultMessage: commonMessages.direction });
            const hideMedia = this.props.intl.formatMessage({ id: 'hideMedia', defaultMessage: nls.hideMedia });
            const size = this.props.intl.formatMessage({ id: 'size', defaultMessage: nls.size });
            const small = this.props.intl.formatMessage({ id: 'small', defaultMessage: defaultMessages.small });
            const medium = this.props.intl.formatMessage({ id: 'medium', defaultMessage: defaultMessages.medium });
            const large = this.props.intl.formatMessage({ id: 'large', defaultMessage: defaultMessages.large });
            const color = this.props.intl.formatMessage({ id: 'color', defaultMessage: commonMessages.color });
            const defaultStr = this.props.intl.formatMessage({ id: 'default', defaultMessage: commonMessages.default });
            const white = this.props.intl.formatMessage({ id: 'white', defaultMessage: nls.white });
            const black = this.props.intl.formatMessage({ id: 'black', defaultMessage: nls.black });
            // var btnRad = this.props.config.inline.design.btnRad;
            // var rad0 = IconRadius.Rad00,
            //   rad1 = IconRadius.Rad20,
            //   rad2 = IconRadius.Rad50;
            subSettingUI = (jsx(React.Fragment, null,
                jsx(SettingSection, { title: shareOption },
                    jsx(ItemsSelector, { items: items, theme: theme, intl: intl, title: shareOption, uiMode: this.props.config.uiMode, onItemsChange: this.onInlineItemsChange })),
                jsx(SettingSection, { title: design },
                    jsx(SettingRow, { label: direction },
                        jsx(ButtonGroup, null,
                            jsx(DirectionSelector, { vertical: isVertical, onChange: this.onInlineDirChange }))),
                    jsx(SettingRow, { label: color },
                        jsx(Select, { value: (this.props.config.inline.design.iconColor || IconColorMode.Default), onChange: this.onInlineIconColorChange, size: 'sm', className: 'w-50', "aria-label": color },
                            jsx("option", { value: IconColorMode.Default }, defaultStr),
                            jsx("option", { value: IconColorMode.White }, white),
                            jsx("option", { value: IconColorMode.Black }, black))),
                    jsx(SettingRow, { label: size },
                        jsx(Select, { value: this.props.config.inline.design.size, onChange: this.onInlineSizeChange, size: 'sm', className: 'w-50', "aria-label": size },
                            jsx("option", { value: BtnIconSize.Small }, small),
                            jsx("option", { value: BtnIconSize.Medium }, medium),
                            jsx("option", { value: BtnIconSize.Large }, large))),
                    jsx(SettingRow, { label: hideMedia },
                        jsx(Switch, { checked: this.props.config.inline.design.hideLabel, onChange: this.onHideLabelChange, "aria-label": hideMedia })))));
            return subSettingUI;
        };
        // 2.3
        this.renderSlideModeSetting = () => {
            let subSettingUI = null;
            const { theme, intl } = this.props;
            const items = this.props.config.popup.items;
            const shareOption = this.props.intl.formatMessage({ id: 'shareOption', defaultMessage: nls.shareOption });
            subSettingUI = (jsx(React.Fragment, null,
                jsx(SettingSection, { title: shareOption },
                    jsx(ItemsSelector, { items: items, theme: theme, intl: intl, title: shareOption, uiMode: this.props.config.uiMode, onItemsChange: this.onPopupItemsChange }))));
            return subSettingUI;
        };
    }
    render() {
        let subSettingUI = null;
        const uiMode = this.props.config.uiMode;
        if (uiMode === UiMode.Popup) {
            subSettingUI = this.renderPopupModeSetting();
        }
        else if (uiMode === UiMode.Inline) {
            subSettingUI = this.renderInlineModeSetting();
        } /* else if (uiMode === UiMode.Slide) {
          subSettingUI = this.renderSlideModeSetting();
        } */
        return (jsx("div", { css: getStyle(this.props.theme), className: 'widget-setting-menu jimu-widget-setting' },
            jsx(ArrangementSelector, { uiMode: uiMode, onChanged: this.onUIModeChanged, id: this.props.id }),
            subSettingUI));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b, _c;
    const { id } = props;
    return {
        appConfig: (_a = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig,
        layoutInfo: (_c = (_b = state === null || state === void 0 ? void 0 : state.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.widgetsState[id]) === null || _c === void 0 ? void 0 : _c.layoutInfo
    };
};
/* for image selector
  <SettingRow>
    <div className="d-flex justify-content-between w-100 align-items-center">
      <label className="m-0">source</label>
      <div style={{ width: '70px' }} className="uploadFileName"
        title={fileName ? fileName : "noneSource"}>
        {fileName ? fileName : "noneSource"}
      </div>
      <div style={{ width: '60px' }}><ImageSelector className="text-dark d-flex justify-content-center btn-browse" color="secondary"
        widgetId={this.props.id} label="Set" size="sm"
        onChange={this.onImageResourceChange} imageParam={this.props.config.imageParam} />
      </div>
    </div>
  </SettingRow>
*/
// onImageResourceChange = (imageParam: ImageParam) => {
//   let tempImageParam: ImageParam = imageParam;
//   if (!tempImageParam) {
//     tempImageParam = {};
//   }
//   let config = Immutable(this.props.config);
//   if (config.imageParam && config.imageParam.cropParam) {
//     tempImageParam.cropParam = {
//       svgViewBox: config.imageParam.cropParam.svgViewBox,
//       svgPath: config.imageParam.cropParam.svgPath,
//       cropShape: config.imageParam.cropParam.cropShape,
//     }
//   }
//   //config = config.set('imageParam', tempImageParam);
//   this.props.onSettingChange({
//     //widgetId: this.props.id,
//     id: this.props.id,
//     config: this.props.config.set('imageParam', tempImageParam)
//   });
// }
//# sourceMappingURL=setting.js.map