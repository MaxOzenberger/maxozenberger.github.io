/** @jsx jsx */
import { React, Immutable, css, jsx, expressionUtils, CONSTANTS, DataSourceManager, ImageDisplayQualityMode, AllDataSourceTypes } from 'jimu-core';
import { SettingSection, SettingRow, LinkSelector } from 'jimu-ui/advanced/setting-components';
import { Select, ImageFillMode, Slider, NumericInput, Tabs, Tab, Tooltip, imageUtils } from 'jimu-ui';
import { ImageSelector } from 'jimu-ui/advanced/resource-selector';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { ImgSourceType, DynamicUrlType } from '../config';
import { PreDefinedConfigs } from './predefined-configs';
import defaultMessages from './translations/default';
import ShapeSelector from './components/shape-selector';
import ToolTipSetting from './components/tooltip-setting';
import AltTextSetting from './components/alttext-setting';
import DynamicUrlSetting from './components/dynamicurl-setting';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
        this.onSymbolScaleChanged = null;
        this.minSymbolScale = 0.5;
        this.maxSymbolScale = 5;
        this.SymbolScaleStep = 0.1;
        this.linkSettingTrigger = React.createRef();
        this.displayQualityTrigger = React.createRef();
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.settingLinkConfirm = (linkResult) => {
            var _a;
            const { id, config, onSettingChange, useDataSources } = this.props;
            const srcExpression = this.getSrcExpression();
            const toolTipExpression = this.getToolTipExpression();
            const altTextExpression = this.getAltTextExpression();
            const useExpression = (_a = linkResult === null || linkResult === void 0 ? void 0 : linkResult.expression) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
            const mergedUseDataSources = this.mergeUseDataSources(srcExpression, toolTipExpression, altTextExpression, useExpression, useDataSources);
            onSettingChange({
                id,
                config: config.setIn(['functionConfig', 'linkParam'], linkResult),
                useDataSources: mergedUseDataSources
            });
        };
        this.updateStyle = (key, value) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['styleConfig', key], value)
            });
        };
        this.shapeChange = (shapeName) => {
            let style = Immutable(this.props.config.styleConfig);
            style = style.set('shape', shapeName);
            style = style.set('borderRadius', this.props.preDefinedConfigs.shapes[shapeName].borderRadius);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['styleConfig'], style)
            });
        };
        this.altTextConfigChange = () => {
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'altText'], this.state.currentAltTextInput)
                    .setIn(['functionConfig', 'altTextExpression'], null),
                useDataSources: this.getUseDataSourcesWithoutFields(this.props.useDataSources)
            };
            this.props.onSettingChange(config);
        };
        this.toolTipConfigChange = () => {
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'toolTip'], this.state.currentTipInput)
                    .setIn(['functionConfig', 'toolTipExpression'], null),
                useDataSources: this.getUseDataSourcesWithoutFields(this.props.useDataSources)
            };
            this.props.onSettingChange(config);
        };
        this.imgSourceTypeChanged = (imgSourceType) => {
            let functionConfig = Immutable(this.props.config.functionConfig);
            functionConfig = functionConfig.set('dynamicUrlType', null);
            functionConfig = functionConfig.set('imgSourceType', imgSourceType);
            functionConfig = functionConfig.set('srcExpression', null);
            functionConfig = functionConfig.set('imageParam', this.resetImageParam(this.props.config.functionConfig.imageParam));
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('functionConfig', functionConfig)
            });
        };
        this.dynamicUrlTypeChanged = (dynamicUrlType) => {
            let functionConfig = Immutable(this.props.config.functionConfig);
            functionConfig = functionConfig.set('dynamicUrlType', dynamicUrlType);
            functionConfig = functionConfig.set('imgSourceType', ImgSourceType.ByDynamicUrl);
            functionConfig = functionConfig.set('srcExpression', null);
            functionConfig = functionConfig.set('imageParam', this.resetImageParam(this.props.config.functionConfig.imageParam));
            functionConfig = functionConfig.set('altTextWithAttachmentName', null);
            functionConfig = functionConfig.set('toolTipWithAttachmentName', null);
            const resetDsFields = dynamicUrlType !== DynamicUrlType.Expression;
            const linkExpression = this.getLinkExpression();
            const toolTipExpression = this.getToolTipExpression();
            const altTextExpression = this.getAltTextExpression();
            const srcExpression = null;
            const mergedUseDataSources = this.mergeUseDataSources(linkExpression, toolTipExpression, altTextExpression, srcExpression, this.props.useDataSources);
            this.props.onSettingChange(Object.assign({ id: this.props.id, config: this.props.config.set('functionConfig', functionConfig) }, (resetDsFields ? (dynamicUrlType === DynamicUrlType.Symbol ? { useDataSources: [this.props.useDataSources[0].set('fields', mergedUseDataSources[0].fields).set('useFieldsInSymbol', true).asMutable({ deep: true })] } : { useDataSources: [this.props.useDataSources[0].set('fields', mergedUseDataSources[0].fields).without('useFieldsInSymbol').asMutable({ deep: true })] }) : { useDataSources: [this.props.useDataSources[0].without('useFieldsInSymbol').asMutable({ deep: true })] })));
        };
        this.openSrcPopup = () => {
            this.setState({
                isSrcPopupOpen: true,
                isAltTextPopupOpen: false,
                isToolTipPopupOpen: false
            });
        };
        this.closeSrcPopup = () => {
            this.setState({ isSrcPopupOpen: false });
        };
        this.openToolTipPopup = () => {
            this.setState({
                isSrcPopupOpen: false,
                isAltTextPopupOpen: false,
                isToolTipPopupOpen: true
            });
        };
        this.closeToolTipPopup = () => {
            this.setState({ isToolTipPopupOpen: false });
        };
        this.openAltTextPopup = () => {
            this.setState({
                isSrcPopupOpen: false,
                isAltTextPopupOpen: true,
                isToolTipPopupOpen: false
            });
        };
        this.closeAltTextPopup = () => {
            this.setState({ isAltTextPopupOpen: false });
        };
        this.getUseDataSourcesWithoutFields = (useDataSources) => {
            return useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.map(useDataSource => useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.without('fields').asMutable({ deep: true }));
        };
        this.getSrcExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.srcExpression &&
                this.props.config.functionConfig.srcExpression;
            return (expression && expression.asMutable({ deep: true })) || null;
        };
        this.getToolTipExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression &&
                this.props.config.functionConfig.toolTipExpression;
            return (expression && expression.asMutable({ deep: true })) || null;
        };
        this.getAltTextExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.altTextExpression &&
                this.props.config.functionConfig.altTextExpression;
            return (expression && expression.asMutable({ deep: true })) || null;
        };
        this.getLinkExpression = () => {
            var _a, _b, _c, _d;
            const expression = (_d = (_c = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.functionConfig) === null || _c === void 0 ? void 0 : _c.linkParam) === null || _d === void 0 ? void 0 : _d.expression;
            return (expression && expression.asMutable({ deep: true })) || null;
        };
        this.onToolTipExpChange = (expression) => {
            if (!expression) {
                return;
            }
            const srcExpression = this.getSrcExpression();
            const altTextExpression = this.getAltTextExpression();
            const linkExpression = this.getLinkExpression();
            const mergedUseDataSources = this.mergeUseDataSources(srcExpression, expression, altTextExpression, linkExpression, this.props.useDataSources);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'toolTipExpression'], expression).setIn(['functionConfig', 'toolTip'], ''),
                useDataSources: mergedUseDataSources
            });
            this.setState({ isToolTipPopupOpen: false });
        };
        this.onAltTextExpChange = (expression) => {
            if (!expression) {
                return;
            }
            const srcExpression = this.getSrcExpression();
            const toolTipExpression = this.getToolTipExpression();
            const linkExpression = this.getLinkExpression();
            const mergedUseDataSources = this.mergeUseDataSources(srcExpression, toolTipExpression, expression, linkExpression, this.props.useDataSources);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'altTextExpression'], expression).setIn(['functionConfig', 'altText'], ''),
                useDataSources: mergedUseDataSources
            });
            this.setState({ isAltTextPopupOpen: false });
        };
        this.onSrcExpChange = (expression) => {
            if (!expression) {
                return;
            }
            const toolTipExpression = this.getToolTipExpression();
            const altTextExpression = this.getAltTextExpression();
            const linkExpression = this.getLinkExpression();
            const mergedUseDataSources = this.mergeUseDataSources(expression, toolTipExpression, altTextExpression, linkExpression, this.props.useDataSources);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'srcExpression'], expression).setIn(['functionConfig', 'imageParam'], this.resetImageParam(this.props.config.functionConfig.imageParam)),
                useDataSources: mergedUseDataSources
            });
            this.setState({ isSrcPopupOpen: false });
        };
        this.mergeUseDataSources = (srcExpression, toolTipExpression, altTextExpression, linkExpression, useDataSources) => {
            const srcDss = expressionUtils.getUseDataSourceFromExpParts(srcExpression && srcExpression.parts, useDataSources);
            const toolTipDss = expressionUtils.getUseDataSourceFromExpParts(toolTipExpression && toolTipExpression.parts, useDataSources);
            const altTextDss = expressionUtils.getUseDataSourceFromExpParts(altTextExpression && altTextExpression.parts, useDataSources);
            const linkDss = expressionUtils.getUseDataSourceFromExpParts(linkExpression && linkExpression.parts, useDataSources);
            return this.mergeUseDataSourcesByDss(srcDss, toolTipDss, altTextDss, linkDss, useDataSources);
        };
        this.mergeUseDataSourcesByDss = (srcDss, toolTipDss, altTextDss, linkDss, useDataSources) => {
            const useDataSourcesWithoutFields = this.getUseDataSourcesWithoutFields(useDataSources);
            let mergedUseDss = expressionUtils.mergeUseDataSources(useDataSourcesWithoutFields, toolTipDss);
            mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, altTextDss);
            mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, srcDss);
            mergedUseDss = expressionUtils.mergeUseDataSources(mergedUseDss, linkDss);
            return mergedUseDss;
        };
        this.onResourceChange = (imageParam) => {
            let tempImageParam = imageParam;
            if (!tempImageParam) {
                tempImageParam = {};
            }
            let functionConfig = Immutable(this.props.config.functionConfig);
            if (functionConfig.imageParam && functionConfig.imageParam.cropParam) {
                tempImageParam.cropParam = {
                    svgViewBox: functionConfig.imageParam.cropParam.svgViewBox,
                    svgPath: functionConfig.imageParam.cropParam.svgPath,
                    cropShape: functionConfig.imageParam.cropParam.cropShape
                };
            }
            functionConfig = functionConfig.set('imageParam', tempImageParam);
            functionConfig = functionConfig.set('imgSourceType', '');
            functionConfig = functionConfig.set('srcExpression', null);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('functionConfig', functionConfig)
            });
        };
        this.resetImageParam = (imageParam) => {
            if (!imageParam || !imageParam.cropParam) {
                return null;
            }
            else {
                return {
                    cropParam: imageParam.cropParam
                };
            }
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled
            });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: this.mergeUseDataSources(this.getSrcExpression(), this.getToolTipExpression(), this.getAltTextExpression(), this.getLinkExpression(), Immutable(useDataSources)),
                config: this.props.config.setIn(['functionConfig', 'dynamicUrlType'], null)
                    .setIn(['functionConfig', 'altTextWithAttachmentName'], null)
                    .setIn(['functionConfig', 'toolTipWithAttachmentName'], null)
                    .setIn(['functionConfig', 'isSelectedFromRepeatedDataSourceContext'], null)
                    .setIn(['functionConfig', 'useDataSourceForMainDataAndViewSelector'], null)
            });
        };
        this.onTypeNoSupportChange = () => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'dynamicUrlType'], null)
                    .setIn(['functionConfig', 'altTextWithAttachmentName'], null)
                    .setIn(['functionConfig', 'toolTipWithAttachmentName'], null)
                    .setIn(['functionConfig', 'isSelectedFromRepeatedDataSourceContext'], null)
                    .setIn(['functionConfig', 'useDataSourceForMainDataAndViewSelector'], null)
            });
        };
        this.onDataSourceRemoved = () => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [],
                config: this.props.config.setIn(['functionConfig', 'dynamicUrlType'], null)
                    .setIn(['functionConfig', 'altTextWithAttachmentName'], null)
                    .setIn(['functionConfig', 'toolTipWithAttachmentName'], null)
            });
        };
        this.handleChooseShape = (cropParam) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'imageParam', 'cropParam'], cropParam)
            });
        };
        this.handleImageFillModeChange = (imageFillMode) => {
            let config = this.props.config.setIn(['functionConfig', 'imageFillMode'], imageFillMode);
            if (config.functionConfig.imageParam && config.functionConfig.imageParam.originalUrl) {
                config = config.setIn(['functionConfig', 'imageParam', 'url'], config.functionConfig.imageParam.originalUrl);
            }
            if (config.functionConfig.imageParam && config.functionConfig.imageParam.cropParam) {
                config = config.setIn(['functionConfig', 'imageParam', 'cropParam'], {
                    svgViewBox: config.functionConfig.imageParam.cropParam.svgViewBox,
                    svgPath: config.functionConfig.imageParam.cropParam.svgPath,
                    cropShape: config.functionConfig.imageParam.cropParam.cropShape
                });
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: config
            });
        };
        this.getIsDataSourceUsed = () => {
            return !!this.props.useDataSourcesEnabled;
        };
        this.handleSymbolScaleChange = (inputValue) => {
            const value = parseFloat(inputValue);
            if (value === this.props.config.functionConfig.symbolScale) {
                return;
            }
            clearTimeout(this.onSymbolScaleChanged);
            this.onSymbolScaleChanged = setTimeout(() => {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['functionConfig', 'symbolScale'], value)
                });
            }, 500);
        };
        this.onToolTipTextInputChange = (toolTip) => {
            this.setState({ currentTipInput: toolTip });
        };
        this.onAltTextTextInputChange = (altText) => {
            this.setState({ currentAltTextInput: altText });
        };
        this.onToolTipWithSomeKeyChange = (key, value) => {
            const linkExpression = this.getLinkExpression();
            const altTextExpression = this.getAltTextExpression();
            const srcExpression = this.getSrcExpression();
            const toolTipExpression = null;
            const mergedUseDataSources = this.mergeUseDataSources(linkExpression, toolTipExpression, altTextExpression, srcExpression, this.props.useDataSources);
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'toolTip'], null)
                    .setIn(['functionConfig', 'toolTipExpression'], null)
                    .setIn(['functionConfig', key], value),
                useDataSources: mergedUseDataSources
            };
            this.props.onSettingChange(config);
        };
        this.onAltTextWithSomeKeyChange = (key, value) => {
            const linkExpression = this.getLinkExpression();
            const altTextExpression = null;
            const srcExpression = this.getSrcExpression();
            const toolTipExpression = this.getToolTipExpression();
            const mergedUseDataSources = this.mergeUseDataSources(linkExpression, toolTipExpression, altTextExpression, srcExpression, this.props.useDataSources);
            const config = {
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'altText'], null)
                    .setIn(['functionConfig', 'altTextExpression'], null)
                    .setIn(['functionConfig', key], value),
                useDataSources: mergedUseDataSources
            };
            this.props.onSettingChange(config);
        };
        this.onTabSelect = title => {
            const isDynamicSource = title === 'dynamicSource';
            const linkExpression = this.getLinkExpression();
            const toolTipExpression = this.getToolTipExpression();
            const altTextExpression = this.getAltTextExpression();
            const srcExpression = null;
            const mergedUseDataSources = this.mergeUseDataSources(linkExpression, toolTipExpression, altTextExpression, srcExpression, this.props.useDataSources);
            if (isDynamicSource) {
                this.imgSourceTypeChanged(ImgSourceType.ByDynamicUrl);
            }
            else {
                this.imgSourceTypeChanged(ImgSourceType.ByUpload);
                this.props.onSettingChange({
                    id: this.props.id,
                    useDataSources: [this.props.useDataSources[0].set('fields', mergedUseDataSources[0].fields).without('useFieldsInSymbol').asMutable({ deep: true })]
                });
            }
        };
        this.onSelectedUseDsChangeForSymbol = (useDataSource, isSelectedFromRepeatedDataSourceContext) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'useDataSourceForMainDataAndViewSelector'], useDataSource)
                    .setIn(['functionConfig', 'isSelectedFromRepeatedDataSourceContext'], isSelectedFromRepeatedDataSourceContext)
            });
        };
        this.onSelectedUseDsChangeForAttachment = (useDataSource, isSelectedFromRepeatedDataSourceContext) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'useDataSourceForMainDataAndViewSelector'], useDataSource)
                    .setIn(['functionConfig', 'isSelectedFromRepeatedDataSourceContext'], isSelectedFromRepeatedDataSourceContext)
            });
        };
        this.getWhetherDsIdInUseDss = (dsId) => {
            if (!dsId) {
                return false;
            }
            const useDataSources = this.props.useDataSources || [];
            const isSelectionDataView = dsId.split('-').reverse()[0] === CONSTANTS.SELECTION_DATA_VIEW_ID;
            if (isSelectionDataView) {
                const ds = DataSourceManager.getInstance().getDataSource(dsId);
                const mainDs = ds && ds.getMainDataSource();
                const mainDataSourceId = mainDs && mainDs.id;
                return useDataSources.some(u => u.mainDataSourceId === mainDataSourceId);
            }
            return useDataSources.some(u => u.dataSourceId === dsId);
        };
        this.onImageDisplayQualityChange = (event) => {
            const { value } = event.currentTarget;
            const mode = imageUtils.getImageDisplayQualityModeByValue(value);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['functionConfig', 'imageDisplayQualityMode'], mode)
            });
        };
        this.state = {
            currentTipInput: this.props.config.functionConfig.toolTip,
            currentAltTextInput: this.props.config.functionConfig.altText,
            shadowOpen: !!this.props.config.styleConfig.boxShadow,
            isSrcPopupOpen: false,
            isToolTipPopupOpen: false,
            isAltTextPopupOpen: false
        };
    }
    getStyle(theme) {
        return css `
      .widget-setting-image {
        font-size: 13px;
        font-weight: lighter;
        overflow-y: auto;

        .setting-function {

          .setting-function-item {
            overflow: hidden;

            .setting-function-item-input {
              width: 200px;
            }
          }
        }

        .widget-image-chooseshape-item {
          border: 2px solid transparent;
        }

        .border-selected {
          border: 2px solid ${theme.colors.palette.primary[600]} !important;
        }

        .uploadInput {
          position: absolute;
          opacity: 0;
          left: 0;
          top: 0;
          cursor: pointer;
        }

        .uploadFileName {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.5;
        }

        .uploadInput-container {
          position: relative;
        }

        .setting-exterior {

          .exterior-shape-item {
            padding-bottom: 100%;
            cursor: pointer;
          }
        }

        .setting-stylepicker-selected {
          border-width: 2px !important;
        }

        .set-link-btn{
          background-color: ${theme.colors.palette.light[500]};
        }
        .set-link-btn:hover, .set-link-btn:hover.set-link-btn:active{
          background-color: ${theme.colors.palette.light[400]};
        }

        .set-clear-image {
          &:focus {
            outline: none;
            box-shadow: none !important;
            text-decoration: none;
          }
        }

        .set-image-display-quality .image-display-quality-option {
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
        }
      }
    `;
    }
    componentDidUpdate(prevProps) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (this.props.useDataSourcesEnabled !== prevProps.useDataSourcesEnabled) {
            const checked = this.props.useDataSourcesEnabled;
            let functionConfig = Immutable(this.props.config.functionConfig);
            if (checked) {
                if (this.props.config.functionConfig.imgSourceType === ImgSourceType.ByStaticUrl) {
                    functionConfig = functionConfig.set('imgSourceType', ImgSourceType.ByDynamicUrl);
                }
            }
            else {
                if (this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl) {
                    functionConfig = functionConfig.set('imgSourceType', ImgSourceType.ByStaticUrl);
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('functionConfig', functionConfig)
            });
        }
        if (!this.props.useDataSourcesEnabled) {
            if (((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.functionConfig) === null || _b === void 0 ? void 0 : _b.toolTip) !== ((_d = (_c = prevProps.config) === null || _c === void 0 ? void 0 : _c.functionConfig) === null || _d === void 0 ? void 0 : _d.toolTip)) {
                this.setState({
                    currentTipInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip) || ''
                });
            }
            if (((_f = (_e = this.props.config) === null || _e === void 0 ? void 0 : _e.functionConfig) === null || _f === void 0 ? void 0 : _f.altText) !== ((_h = (_g = prevProps.config) === null || _g === void 0 ? void 0 : _g.functionConfig) === null || _h === void 0 ? void 0 : _h.altText)) {
                this.setState({
                    currentAltTextInput: (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.altText) || ''
                });
            }
            if (!imageUtils.canUseImageDisplayQuality((_k = (_j = this.props.config) === null || _j === void 0 ? void 0 : _j.functionConfig) === null || _k === void 0 ? void 0 : _k.imageParam)) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.setIn(['functionConfig', 'imageDisplayQualityMode'], ImageDisplayQualityMode.Orginial)
                });
            }
        }
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        const { config, useDataSourcesEnabled } = this.props;
        const { functionConfig } = config;
        const fileName = (_a = functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.imageParam) === null || _a === void 0 ? void 0 : _a.originalName;
        const selectedName = fileName || this.formatMessage('imageNoneSource');
        const modeWithSlideTitleMap = {
            [ImageDisplayQualityMode.Low]: this.formatMessage('displayQualityTooltipWithLow'),
            [ImageDisplayQualityMode.Medium]: this.formatMessage('displayQualityTooltipWithMedium'),
            [ImageDisplayQualityMode.High]: this.formatMessage('displayQualityTooltipWithHigh'),
            [ImageDisplayQualityMode.Orginial]: this.formatMessage('displayQualityTooltipWithOriginal')
        };
        return (jsx("div", { css: this.getStyle(this.props.theme), className: 'jimu-widget' },
            jsx("div", { className: 'widget-setting-image' },
                jsx(SettingSection, null,
                    jsx(SettingRow, null,
                        jsx("div", { className: 'choose-ds w-100' },
                            jsx(DataSourceSelector, { types: this.supportedTypes, useDataSourcesEnabled: this.getIsDataSourceUsed(), useDataSources: this.props.useDataSources, onToggleUseDataEnabled: this.onToggleUseDataEnabled, onChange: this.onDataSourceChange, widgetId: this.props.id }))),
                    !useDataSourcesEnabled && jsx(SettingRow, { label: this.formatMessage('imageSource'), role: 'group', "aria-label": this.formatMessage('imageSource'), flow: 'wrap' },
                        jsx("div", { className: 'w-100 d-flex align-items-center' },
                            jsx("div", { style: { minWidth: '60px' } },
                                jsx(ImageSelector, { buttonClassName: 'text-dark d-flex justify-content-center btn-browse', widgetId: this.props.id, buttonLabel: this.formatMessage('imageSet'), buttonSize: 'sm', onChange: this.onResourceChange, imageParam: functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.imageParam, "aria-describedby": 'image-selected-name', trigger: this.displayQualityTrigger.current })),
                            jsx("div", { style: { width: '70px' }, className: 'uploadFileName ml-2', title: selectedName }, selectedName),
                            jsx("div", { id: 'image-selected-name', className: 'sr-only' }, this.formatMessage('numSelected', { number: selectedName })))),
                    !window.jimuConfig.isDevEdition &&
                        !useDataSourcesEnabled &&
                        ((_b = functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.imageParam) === null || _b === void 0 ? void 0 : _b.originalUrl) &&
                        imageUtils.canUseImageDisplayQuality((_c = this.props.config.functionConfig) === null || _c === void 0 ? void 0 : _c.imageParam) &&
                        jsx(SettingRow, { className: 'flex-wrap', label: this.formatMessage('imageDisplayQuality'), role: 'group', "aria-label": this.formatMessage('imageDisplayQuality'), flow: 'wrap' },
                            jsx("div", { className: 'set-image-display-quality w-100 d-flex flex-wrap align-items-center' },
                                jsx(Tooltip, { placement: 'bottom', title: modeWithSlideTitleMap[this.props.config.functionConfig.imageDisplayQualityMode] },
                                    jsx(Slider, { ref: this.displayQualityTrigger, style: { transform: 'translateY(-4px)' }, className: 'image-display-quality-range', list: 'image-display-quality-datalist', "aria-label": 'set-image-display-quality', "data-field": 'space', defaultValue: imageUtils.getImageDisplayQualityValueByMode(this.props.config.functionConfig.imageDisplayQualityMode), min: 0, max: 99.99, step: 33.33, onChange: this.onImageDisplayQualityChange })),
                                jsx("datalist", { id: 'image-display-quality-datalist', className: 'display-none' },
                                    jsx("option", { value: '0', label: modeWithSlideTitleMap[ImageDisplayQualityMode.Low] }),
                                    jsx("option", { value: '99.99', label: modeWithSlideTitleMap[ImageDisplayQualityMode.Orginial] })),
                                jsx("div", { className: "image-display-quality-option-wrapper text-dark-400 d-flex w-100 justify-content-between", style: { marginTop: '4px' } },
                                    jsx("div", { className: "image-display-quality-option" }, modeWithSlideTitleMap[ImageDisplayQualityMode.Low]),
                                    jsx("div", { className: "image-display-quality-option" }, modeWithSlideTitleMap[ImageDisplayQualityMode.Orginial])))),
                    useDataSourcesEnabled && jsx("div", { className: 'mt-3' },
                        jsx(Tabs, { fill: true, type: 'pills', onChange: this.onTabSelect, value: this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl ? 'dynamicSource' : 'staticSource' },
                            jsx(Tab, { id: 'staticSource', title: this.formatMessage('staticSource') },
                                jsx("div", { className: 'mt-3' }, (!this.props.config.functionConfig.imgSourceType || this.props.config.functionConfig.imgSourceType === ImgSourceType.ByUpload) && jsx(SettingRow, null,
                                    jsx("div", { className: 'w-100 d-flex align-items-center' },
                                        jsx("div", { style: { minWidth: '60px' } },
                                            jsx(ImageSelector, { buttonClassName: 'text-dark d-flex justify-content-center btn-browse', widgetId: this.props.id, buttonLabel: this.formatMessage('imageSet'), buttonSize: 'sm', disabled: (this.props.config.functionConfig.imgSourceType === ImgSourceType.ByStaticUrl) ||
                                                    (this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl), onChange: this.onResourceChange, imageParam: this.props.config.functionConfig.imageParam, buttonDescribedby: 'image-ds-selected-name' })),
                                        jsx("div", { style: { width: '70px' }, className: 'uploadFileName ml-2', title: selectedName }, selectedName),
                                        jsx("div", { id: 'image-ds-selected-name', className: 'sr-only' }, this.formatMessage('numSelected', { number: selectedName })))))),
                            jsx(Tab, { id: 'dynamicSource', title: this.formatMessage('dynamicSource') },
                                jsx("div", { className: 'mt-3' }, ((this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl)) &&
                                    jsx(DynamicUrlSetting, { dynamicUrlType: this.props.config.functionConfig.dynamicUrlType, srcExpression: this.getSrcExpression(), useDataSources: this.props.useDataSources, isSrcPopupOpen: this.state.isSrcPopupOpen, onDynamicUrlTypeChanged: this.dynamicUrlTypeChanged, onSrcExpChange: this.onSrcExpChange, openSrcPopup: this.openSrcPopup, closeSrcPopup: this.closeSrcPopup, widgetId: this.props.id, intl: this.props.intl, isSelectedFromRepeatedDataSourceContext: this.props.config.functionConfig.isSelectedFromRepeatedDataSourceContext, useDataSourceForMainDataAndViewSelector: this.getWhetherDsIdInUseDss((_e = (_d = this.props.config.functionConfig) === null || _d === void 0 ? void 0 : _d.useDataSourceForMainDataAndViewSelector) === null || _e === void 0 ? void 0 : _e.dataSourceId)
                                            ? this.props.config.functionConfig.useDataSourceForMainDataAndViewSelector
                                            : null, onSelectedUseDsChangeForSymbol: this.onSelectedUseDsChangeForSymbol, onSelectedUseDsChangeForAttachment: this.onSelectedUseDsChangeForAttachment, onTypeNoSupportChange: this.onTypeNoSupportChange })))))),
                jsx(SettingSection, null,
                    jsx(SettingRow, null,
                        jsx(LinkSelector, { onSettingConfirm: this.settingLinkConfirm, linkParam: this.props.config.functionConfig.linkParam, useDataSources: this.getIsDataSourceUsed() && this.props.useDataSources, widgetId: this.props.id })),
                    jsx(ToolTipSetting, { imgSourceType: this.props.config.functionConfig.imgSourceType, dynamicUrlType: this.props.config.functionConfig.dynamicUrlType, intl: this.props.intl, useDataSourcesEnabled: useDataSourcesEnabled, useDataSources: this.props.useDataSources, openToolTipPopup: this.openToolTipPopup, closeToolTipPopup: this.closeToolTipPopup, toolTipExpression: this.getToolTipExpression(), onToolTipExpChange: this.onToolTipExpChange, isToolTipPopupOpen: this.state.isToolTipPopupOpen, toolTipConfigChange: this.toolTipConfigChange, onToolTipTextInputChange: this.onToolTipTextInputChange, toolTipText: this.state.currentTipInput, widgetId: this.props.id, toolTipWithAttachmentName: this.props.config.functionConfig.toolTipWithAttachmentName, onToolTipWithAttachmentNameChange: (toolTipWithAttachmentName) => { this.onToolTipWithSomeKeyChange('toolTipWithAttachmentName', toolTipWithAttachmentName); } }),
                    jsx(AltTextSetting, { imgSourceType: this.props.config.functionConfig.imgSourceType, dynamicUrlType: this.props.config.functionConfig.dynamicUrlType, intl: this.props.intl, useDataSourcesEnabled: useDataSourcesEnabled, useDataSources: this.props.useDataSources, openAltTextPopup: this.openAltTextPopup, closeAltTextPopup: this.closeAltTextPopup, altTextExpression: this.getAltTextExpression(), onAltTextExpChange: this.onAltTextExpChange, isAltTextPopupOpen: this.state.isAltTextPopupOpen, altTextConfigChange: this.altTextConfigChange, onAltTextTextInputChange: this.onAltTextTextInputChange, altTextText: this.state.currentAltTextInput, widgetId: this.props.id, altTextWithAttachmentName: this.props.config.functionConfig.altTextWithAttachmentName, onAltTextWithAttachmentNameChange: (altTextWithAttachmentName) => { this.onAltTextWithSomeKeyChange('altTextWithAttachmentName', altTextWithAttachmentName); } })),
                jsx(SettingSection, null,
                    (functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.dynamicUrlType) !== DynamicUrlType.Symbol &&
                        jsx(SettingRow, { label: this.formatMessage('imagePosition') },
                            jsx("div", { style: { width: '50%' } },
                                jsx(Select, { size: 'sm', value: (functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.imageFillMode) || ImageFillMode.Fill, onChange: (e) => this.handleImageFillModeChange(e.target.value), "aria-label": this.formatMessage('imagePosition') },
                                    jsx("option", { key: 0, value: ImageFillMode.Fill }, this.props.intl.formatMessage({ id: 'imageFill', defaultMessage: defaultMessages.imageFill })),
                                    jsx("option", { key: 1, value: ImageFillMode.Fit }, this.props.intl.formatMessage({ id: 'imageFit', defaultMessage: defaultMessages.imageFit }))))),
                    (functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.dynamicUrlType) === DynamicUrlType.Symbol &&
                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('imageSymbolScale') },
                            jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                                jsx(Slider, { style: { width: '60%' }, "data-field": 'space', onChange: (evt) => { this.handleSymbolScaleChange(evt.currentTarget.value); }, value: this.props.config.functionConfig.symbolScale ? this.props.config.functionConfig.symbolScale : 1, title: '0.5-5', size: 'sm', min: this.minSymbolScale, max: this.maxSymbolScale, step: this.SymbolScaleStep }),
                                jsx(NumericInput, { style: { width: '35%' }, showHandlers: false, min: this.minSymbolScale, max: this.maxSymbolScale, value: this.props.config.functionConfig.symbolScale ? this.props.config.functionConfig.symbolScale : 1, onBlur: (evt) => { this.handleSymbolScaleChange(evt.currentTarget.value); }, title: '0.5-5' }))),
                    (functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.dynamicUrlType) !== DynamicUrlType.Symbol &&
                        jsx(SettingRow, { flow: 'wrap', label: this.formatMessage('imageShape'), role: 'group', "aria-label": this.formatMessage('imageShape') },
                            jsx(ShapeSelector, { theme: this.props.theme, cropParam: (_f = functionConfig === null || functionConfig === void 0 ? void 0 : functionConfig.imageParam) === null || _f === void 0 ? void 0 : _f.cropParam, onShapeChoosed: (cropParam) => { this.handleChooseShape(cropParam); }, intl: this.props.intl }))))));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        preDefinedConfigs: PreDefinedConfigs
    };
};
//# sourceMappingURL=setting.js.map