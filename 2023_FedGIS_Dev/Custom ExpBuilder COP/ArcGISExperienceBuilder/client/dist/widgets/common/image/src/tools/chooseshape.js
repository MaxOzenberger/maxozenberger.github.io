/** @jsx jsx */
import { React, ReactRedux, moduleLoader, getAppStore, css, jsx, Immutable, classNames, i18n } from 'jimu-core';
import { Icon, Tooltip } from 'jimu-ui';
import { DynamicUrlType } from '../config';
import defaultMessage from '../../src/runtime/translations/default';
import settingDefaultMessage from '../setting/translations/default';
import { withBuilderTheme } from 'jimu-theme';
import ShapeOutlined from 'jimu-icons/svg/outlined/application/shape.svg';
class _ChooseShape extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.cropShapeList = ['square', 'circle', 'hexagon', 'pentagon', 'rhombus', 'triangle'];
        this.shapeClick = (e, index) => {
            if (this.props.widgetConfig.functionConfig.imageParam && this.props.widgetConfig.functionConfig.imageParam.cropParam &&
                this.props.widgetConfig.functionConfig.imageParam.cropParam.cropShape === this.cropShapeList[index]) {
                return;
            }
            const svgItem = e.currentTarget.getElementsByTagName('svg') && e.currentTarget.getElementsByTagName('svg')[0];
            if (svgItem) {
                const appConfigAction = moduleLoader.getJimuForBuilderModules().getAppConfigAction();
                let widgetConfig = Immutable(this.props.widgetConfig);
                let cropParam = Immutable(widgetConfig.functionConfig.imageParam ? widgetConfig.functionConfig.imageParam.cropParam : null);
                if (!cropParam) {
                    cropParam = Immutable({});
                }
                cropParam = cropParam.set('svgViewBox', svgItem.getAttribute('viewBox'));
                cropParam = cropParam.set('svgPath', svgItem.getElementsByTagName('path')[0].getAttribute('d'));
                cropParam = cropParam.set('cropShape', this.cropShapeList[index]);
                widgetConfig = widgetConfig.setIn(['functionConfig', 'imageParam', 'cropParam'], cropParam);
                appConfigAction.editWidgetConfig(this.props.id, widgetConfig).exec();
            }
        };
    }
    getStyle() {
        const theme = this.props.theme;
        return css `
      .widget-image-chooseshape-item {
        background-color: ${theme.colors.palette.light[300]};
      }

      .widget-image-chooseshape-item:hover {
        cursor: 'pointer';
        background-color: ${theme.colors.palette.light[500]};
      }

      .chooseshape-item-selected {
        background-color: ${theme.colors.palette.light[500]};
      }
      `;
    }
    getTooltipStyle() {
        const theme = this.props.theme;
        return css `
      border: none;

      .tooltip {
        color: ${theme.colors.black};
        background-color: ${theme.colors.palette.light[600]};
        border-color: ${theme.colors.palette.light[300]};
      }
    `;
    }
    render() {
        const { id, appConfig, theme, widgetConfig } = this.props;
        const widgetJson = appConfig.widgets[id];
        // get widgetSettingManager from the parent of the app frame
        const widgetSettingManager = window.parent._widgetSettingManager;
        const messages = widgetSettingManager.getSettingI18nMessagesByUri(widgetJson.uri);
        return (jsx("div", { style: { width: '50px' }, css: this.getStyle() }, this.cropShapeList.map((item, index) => {
            var _a, _b, _c, _d;
            const iconComponent = require(`jimu-icons/svg/filled/data/${item}.svg`);
            const imageNlsId = item === 'square' ? 'imagerectangle' : `image${item}`;
            const tooltip = (_a = messages[imageNlsId]) !== null && _a !== void 0 ? _a : settingDefaultMessage[imageNlsId];
            const selected = (item === 'rectangle' && !((_b = widgetConfig.functionConfig.imageParam) === null || _b === void 0 ? void 0 : _b.cropParam)) || ((_d = (_c = widgetConfig.functionConfig.imageParam) === null || _c === void 0 ? void 0 : _c.cropParam) === null || _d === void 0 ? void 0 : _d.cropShape) === item;
            return (jsx(Tooltip, { key: index, title: tooltip, placement: 'right-start', css: this.getTooltipStyle() },
                jsx("div", { className: classNames('w-100 d-flex justify-content-center align-items-center widget-image-chooseshape-item', {
                        'chooseshape-item-selected': selected
                    }), style: { height: '40px' }, onClick: (e) => this.shapeClick(e, index) },
                    jsx(Icon, { icon: iconComponent, color: theme.colors.black }))));
        })));
    }
}
const ChooseShape = withBuilderTheme(_ChooseShape);
export default class CropTool {
    constructor() {
        this.index = 0;
        this.id = 'choose-shape';
        this.classes = {};
        this.isEmptySource = (config) => {
            if ((!config.functionConfig.imageParam || !config.functionConfig.imageParam.url) && !config.functionConfig.srcExpression &&
                (config.functionConfig.dynamicUrlType !== DynamicUrlType.Attachment)) {
                return true;
            }
            else {
                return false;
            }
        };
    }
    getGroupId() {
        return null;
    }
    getTitle() {
        const widgetId = this.widgetId;
        const intl = i18n.getIntl(widgetId);
        return intl ? intl.formatMessage({ id: 'imageChooseShape', defaultMessage: defaultMessage.imageChooseShape }) : 'Shape';
    }
    getIcon() {
        return ShapeOutlined;
    }
    onClick(props) {
        return null;
    }
    visible(props) {
        const widgetInfo = getAppStore().getState().appConfig.widgets[props.layoutItem.widgetId];
        if (widgetInfo) {
            const widgetConfig = widgetInfo.config;
            if (this.isEmptySource(widgetConfig)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    getSettingPanel(props) {
        const widgetId = props.layoutItem.widgetId;
        if (this.classes[widgetId]) {
            return this.classes[widgetId];
        }
        const mapStateToProps = (state) => {
            const widgetConfig = Immutable(state.appConfig.widgets[widgetId].config);
            return {
                id: widgetId,
                appConfig: state.appConfig,
                queryObject: state.queryObject,
                widgetConfig: widgetConfig
            };
        };
        this.classes[widgetId] = ReactRedux.connect(mapStateToProps)(ChooseShape);
        return this.classes[widgetId];
    }
}
//# sourceMappingURL=chooseshape.js.map