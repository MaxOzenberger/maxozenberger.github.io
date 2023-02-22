/** @jsx jsx */
import { React, ReactRedux, jsx, Immutable, APP_FRAME_NAME_IN_BUILDER } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { utils as layoutUtils } from 'jimu-layouts/layout-runtime';
import { DEFAULT_ROW_LAYOUT_SETTING } from 'jimu-layouts/layout-builder';
import { utils, DistanceUnits, styleUtils } from 'jimu-ui';
import { Padding, InputUnit } from 'jimu-ui/advanced/style-setting-components';
class Setting extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handleSpaceChange = (value) => {
            const { layoutSetting } = this.props;
            const appConfigAction = getAppConfigAction();
            this.getLayoutIds().forEach(layoutId => {
                appConfigAction.editLayoutSetting({ layoutId }, layoutSetting.set('space', value.distance));
            });
            appConfigAction.exec();
        };
        this.handlePaddingChange = (value) => {
            const { layoutSetting } = this.props;
            const previousUnit = layoutSetting.style.padding.unit;
            let paddingNumbers = styleUtils.expandStyleArray(value.number);
            if (previousUnit !== value.unit) {
                // convert value to specified unit
                const rect = this.getSizeOfItem();
                if (rect != null) {
                    paddingNumbers = paddingNumbers.map((numItem, index) => {
                        const size = index % 2 === 0 ? rect.height : rect.width;
                        if (value.unit === DistanceUnits.PIXEL) {
                            // convert from percentage to pixel
                            return Math.round(numItem * size / 100);
                        }
                        // convert from pixel to percentage, keep 1 decimal number
                        return Math.round((numItem / size) * 1000) / 10;
                    });
                }
            }
            const appConfigAction = getAppConfigAction();
            this.getLayoutIds().forEach(layoutId => {
                appConfigAction.editLayoutSetting({ layoutId }, layoutSetting.setIn(['style', 'padding'], {
                    number: paddingNumbers,
                    unit: value.unit
                }));
            });
            appConfigAction.exec();
        };
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({ id });
        };
    }
    getLayoutIds() {
        const result = [];
        const { layouts } = this.props;
        if (layouts != null) {
            const layoutName = Object.keys(layouts)[0];
            const sizemodeLayouts = layouts[layoutName];
            Object.keys(sizemodeLayouts).forEach(sizemode => {
                result.push(sizemodeLayouts[sizemode]);
            });
        }
        return result;
    }
    getSizeOfItem() {
        const { id } = this.props;
        const widgetElem = this.querySelector(`div[data-widgetid="${id}"]`);
        if (widgetElem != null) {
            return widgetElem.getBoundingClientRect();
        }
        return null;
    }
    querySelector(selector) {
        const appFrame = document.querySelector(`iframe[name="${APP_FRAME_NAME_IN_BUILDER}"]`);
        if (appFrame != null) {
            const appFrameDoc = appFrame.contentDocument || appFrame.contentWindow.document;
            return appFrameDoc.querySelector(selector);
        }
        return null;
    }
    render() {
        var _a;
        const { layoutSetting } = this.props;
        const space = layoutSetting.space >= 0 ? layoutSetting.space : DEFAULT_ROW_LAYOUT_SETTING.space;
        const max = ((_a = layoutSetting.style.padding) === null || _a === void 0 ? void 0 : _a.unit) === DistanceUnits.PERCENTAGE ? 100 : Number.POSITIVE_INFINITY;
        return (jsx("div", { className: 'row-layout-setting' },
            jsx(SettingSection, { title: this.formatMessage('layout') },
                jsx(SettingRow, { label: this.formatMessage('gap') },
                    jsx(InputUnit, { "aria-label": this.formatMessage('gap'), value: utils.stringOfLinearUnit(space), min: 0, onChange: this.handleSpaceChange, style: { width: 110 } })),
                jsx(SettingRow, { role: 'group', "aria-label": this.formatMessage('padding'), label: this.formatMessage('padding'), flow: 'wrap' },
                    jsx(Padding, { value: layoutSetting.style.padding, max: max, onChange: this.handlePaddingChange })))));
    }
}
const mapStateToProps = (state, ownProps) => {
    var _a, _b;
    const { layouts } = ownProps;
    let setting = DEFAULT_ROW_LAYOUT_SETTING;
    if (layouts != null) {
        const layoutName = Object.keys(layouts)[0];
        const sizemodeLayouts = layouts[layoutName];
        const layoutId = sizemodeLayouts[layoutUtils.getCurrentSizeMode()];
        setting = (_b = (_a = state.appStateInBuilder.appConfig.layouts[layoutId]) === null || _a === void 0 ? void 0 : _a.setting) !== null && _b !== void 0 ? _b : DEFAULT_ROW_LAYOUT_SETTING;
    }
    return {
        layoutSetting: Immutable(setting)
    };
};
// connect<IMapStateToProps, IMapDispatchToProps, ICompProps, IReduxState>(mapStateToProps, mapDispatchToProps)
export default ReactRedux.connect(mapStateToProps)(Setting);
//# sourceMappingURL=setting.js.map