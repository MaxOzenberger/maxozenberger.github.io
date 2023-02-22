/** @jsx jsx */
import { React, Immutable, LinkType, ExpressionResolverComponent, ExpressionResolverErrorCode, lodash, getAppStore, css, jsx, ReactResizeDetector, ExpressionPartType, polished } from 'jimu-core';
import { Link, ImageWithParam, ImageFillMode, CropType } from 'jimu-ui';
import { ImgSourceType, DynamicUrlType } from '../config';
import { AttachmentComponent } from './components/attachment-component';
import { SymbolComponent } from './components/symbol-component';
import { RecordComponent } from './components/record-component';
import { ImageGallery } from './components/image-gallery';
const imageWidgetSizeMap = {};
export default class Widget extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(props);
        this.__unmount = false;
        this.attachmentTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'];
        this.isAutoHeight = false;
        this.checkIsStaticSrc = (imgSourceType) => {
            return imgSourceType === ImgSourceType.ByUpload || imgSourceType === ImgSourceType.ByStaticUrl || !imgSourceType;
        };
        this.getSrcExpression = () => {
            return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.srcExpression) ||
                Immutable({
                    name: '',
                    parts: [{
                            type: ExpressionPartType.String,
                            exp: `"${this.props.config &&
                                this.props.config.functionConfig && this.props.config.functionConfig.imageParam && this.props.config.functionConfig.imageParam.url}"`
                        }]
                });
        };
        this.getAltTextExpression = () => {
            return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.altTextExpression) ||
                Immutable({
                    name: '',
                    parts: [{
                            type: ExpressionPartType.String,
                            exp: `"${this.props.config &&
                                this.props.config.functionConfig && this.props.config.functionConfig.altText}"`
                        }]
                });
        };
        this.getToolTipExpression = () => {
            return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression) ||
                Immutable({
                    name: '',
                    parts: [{
                            type: ExpressionPartType.String,
                            exp: `"${this.props.config &&
                                this.props.config.functionConfig && this.props.config.functionConfig.toolTip}"`
                        }]
                });
        };
        this.getLinkUrlExpression = () => {
            const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam &&
                this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.expression;
            return expression || null;
        };
        this.onSrcExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ src: (result.value === 'null' ? '' : result.value) });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.srcExpression && this.state.srcExpression.name;
                }
                this.setState({ src: res });
            }
        };
        this.onToolTipExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ toolTip: (result.value === 'null' ? '' : result.value) });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.srcExpression && this.state.srcExpression.name;
                }
                this.setState({ toolTip: res });
            }
        };
        this.onAltTextExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ altText: (result.value === 'null' ? '' : result.value) });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.srcExpression && this.state.srcExpression.name;
                }
                this.setState({ altText: res });
            }
        };
        this.onLinkUrlExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ linkUrl: result.value });
            }
            else {
                let res = '';
                const errorCode = result.value;
                if (errorCode === ExpressionResolverErrorCode.Failed) {
                    res = this.state.srcExpression && this.state.srcExpression.name;
                }
                this.setState({ linkUrl: res });
            }
        };
        this.onAttachmentInfosChange = (attachmentInfos) => {
            this.setState({
                attachmentInfos: attachmentInfos
            });
        };
        this.unmountAttachmentInfosChange = () => {
            this.setState({
                attachmentInfos: []
            });
        };
        this.onSymbolElementChange = (symbolElement) => {
            this.setState({
                symbolElement: symbolElement
            });
        };
        this.unmountSymbolElementChange = () => {
            this.setState({
                symbolElement: null
            });
        };
        this.getRecordsFromRepeatedDataSource = () => {
            const dataSourceId = this.props.useDataSources && this.props.useDataSources[0] && this.props.useDataSources[0].dataSourceId;
            if (dataSourceId && this.props.repeatedDataSource) {
                if (dataSourceId === this.props.repeatedDataSource.dataSourceId) {
                    const record = this.props.repeatedDataSource.record;
                    return {
                        [dataSourceId]: record
                    };
                }
            }
            return null;
        };
        this.onClick = (event) => {
            const linkParam = this.props.config.functionConfig.linkParam;
            if (linkParam && linkParam.value && linkParam.linkType !== LinkType.None) {
                event.exbEventType = 'linkClick';
            }
        };
        this.handleImageLoaded = (imageWidth, imageHeight) => {
            this.setState({
                imageWidth: imageWidth,
                imageHeight: imageHeight
            });
        };
        this.getWidgetWidth = () => {
            return this.state.widgetWidth;
        };
        this.getWidgetHeight = () => {
            return this.state.widgetHeight;
        };
        this.onResize = (width, height) => {
            if (this.__unmount) {
                return;
            }
            if (!width && !height) {
                return;
            }
            // eslint-disable-next-line
            if (width === this.state.widgetWidth && height === this.state.widgetHeight) {
            }
            else {
                imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId] = {
                    width: width,
                    height: height
                };
                this.setState({
                    widgetWidth: width,
                    widgetHeight: height
                });
            }
        };
        this.onCropWidgetResize = (width, height) => {
            if (this.__unmount) {
                return;
            }
            if (!width && !height) {
                return;
            }
            this.setState({
                cropWidgetWidth: width,
                cropWidgetHeight: height
            });
        };
        this.clearCropWidgetSize = () => {
            this.setState({
                cropWidgetWidth: null,
                cropWidgetHeight: null
            });
        };
        this.handleRecordChange = (record) => {
            this.setState({
                record: record
            });
        };
        const ua = navigator.userAgent.toLowerCase();
        if (!ua.includes('chrom') && !ua.includes('firefox') && ua.includes('safari')) {
            this.isAutoHeight = true;
        }
        this.debounceOnResize = lodash.debounce((width, height) => this.onResize(width, height), 200);
        this.state = {
            record: null,
            toolTip: ((_c = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.functionConfig) === null || _c === void 0 ? void 0 : _c.toolTip) || '',
            altText: ((_f = (_e = (_d = this.props) === null || _d === void 0 ? void 0 : _d.config) === null || _e === void 0 ? void 0 : _e.functionConfig) === null || _f === void 0 ? void 0 : _f.altText) || '',
            src: ((_k = (_j = (_h = (_g = this.props) === null || _g === void 0 ? void 0 : _g.config) === null || _h === void 0 ? void 0 : _h.functionConfig) === null || _j === void 0 ? void 0 : _j.imageParam) === null || _k === void 0 ? void 0 : _k.url) || '',
            linkUrl: ((_p = (_o = (_m = (_l = this.props) === null || _l === void 0 ? void 0 : _l.config) === null || _m === void 0 ? void 0 : _m.functionConfig) === null || _o === void 0 ? void 0 : _o.linkParam) === null || _p === void 0 ? void 0 : _p.value) || '',
            srcExpression: this.props.useDataSourcesEnabled && this.getSrcExpression(),
            altTextExpression: this.props.useDataSourcesEnabled && this.getAltTextExpression(),
            toolTipExpression: this.props.useDataSourcesEnabled && this.getToolTipExpression(),
            linkUrlExpression: this.props.useDataSourcesEnabled && this.getLinkUrlExpression(),
            attachmentInfos: [],
            symbolElement: null,
            widgetWidth: imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId] && imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId].width,
            widgetHeight: imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId] && imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId].height,
            cropWidgetWidth: null,
            cropWidgetHeight: null
        };
    }
    getStyle() {
        const symbolScale = this.props.config.functionConfig.symbolScale
            ? this.props.config.functionConfig.symbolScale
            : 1;
        return css `
      .widget-image-container {
        .btn-link {
          padding: 0;
          width: 100%;
          height: 100%;
          outline-offset: -2px;
        }
      }
      .image-symbol {
        svg {
          transform: scale(${symbolScale}, ${symbolScale})
        }
      }
      .image-gallery-button {
        cursor: pointer;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        background-color: ${polished.rgba(this.props.theme.colors.white, 0.5)};
      }
      .image-gallery-button: hover {
        background-color: ${this.props.theme.colors.white};
      }
    `;
    }
    componentDidMount() {
        this.__unmount = false;
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if (!this.props.useDataSourcesEnabled &&
            (this.props.config !== prevProps.config || prevProps.useDataSourcesEnabled)) {
            this.setState({
                src: ((_d = (_c = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.functionConfig) === null || _c === void 0 ? void 0 : _c.imageParam) === null || _d === void 0 ? void 0 : _d.url) || '',
                toolTip: (_g = (_f = (_e = this.props) === null || _e === void 0 ? void 0 : _e.config) === null || _f === void 0 ? void 0 : _f.functionConfig) === null || _g === void 0 ? void 0 : _g.toolTip,
                altText: (_k = (_j = (_h = this.props) === null || _h === void 0 ? void 0 : _h.config) === null || _j === void 0 ? void 0 : _j.functionConfig) === null || _k === void 0 ? void 0 : _k.altText,
                linkUrl: (_p = (_o = (_m = (_l = this.props) === null || _l === void 0 ? void 0 : _l.config) === null || _m === void 0 ? void 0 : _m.functionConfig) === null || _o === void 0 ? void 0 : _o.linkParam) === null || _p === void 0 ? void 0 : _p.value
            });
        }
        if (this.props.useDataSourcesEnabled &&
            (this.props.config !== prevProps.config || !prevProps.useDataSourcesEnabled)) {
            if (this.checkIsStaticSrc(this.props.config.functionConfig.imgSourceType)) {
                this.setState({
                    src: ((_t = (_s = (_r = (_q = this.props) === null || _q === void 0 ? void 0 : _q.config) === null || _r === void 0 ? void 0 : _r.functionConfig) === null || _s === void 0 ? void 0 : _s.imageParam) === null || _t === void 0 ? void 0 : _t.url) || '',
                    toolTipExpression: this.getToolTipExpression(),
                    altTextExpression: this.getAltTextExpression(),
                    linkUrlExpression: this.getLinkUrlExpression()
                });
            }
            else if ((this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl &&
                (!this.props.config.functionConfig.dynamicUrlType || this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Expression))) {
                this.setState({
                    srcExpression: this.getSrcExpression(),
                    toolTipExpression: this.getToolTipExpression(),
                    altTextExpression: this.getAltTextExpression(),
                    linkUrlExpression: this.getLinkUrlExpression()
                });
            }
            else {
                this.setState({
                    src: '',
                    toolTipExpression: this.getToolTipExpression(),
                    altTextExpression: this.getAltTextExpression(),
                    linkUrlExpression: this.getLinkUrlExpression()
                });
            }
        }
    }
    componentWillUnmount() {
        this.__unmount = true;
        const widgetJson = getAppStore().getState().appConfig.widgets[this.props.id];
        if (!widgetJson) {
            delete imageWidgetSizeMap[this.props.id + '-' + this.props.layoutId];
        }
    }
    render() {
        const isDataSourceUsed = this.props.useDataSourcesEnabled;
        const { queryObject } = this.props;
        const { toolTip, altText, src } = this.state;
        let renderResult = null;
        let imageContent = null;
        let imageParam = this.props.config.functionConfig.imageParam ? this.props.config.functionConfig.imageParam : Immutable({});
        if (imageParam.set) {
            imageParam = imageParam.set('url', src);
        }
        else {
            imageParam.url = src;
        }
        const cropParam = imageParam && imageParam.cropParam;
        const isUseSvgRender = cropParam && (cropParam.cropType === CropType.Fake || cropParam.cropShape);
        imageContent = (jsx("div", { className: 'jimu-widget' },
            jsx("div", { className: 'jimu-widget widget-image image-param', style: { minHeight: '16px' } },
                this.props.config.functionConfig.dynamicUrlType !== DynamicUrlType.Attachment &&
                    this.props.config.functionConfig.dynamicUrlType !== DynamicUrlType.Symbol &&
                    jsx(ImageWithParam, { imageParam: imageParam, toolTip: toolTip, altText: altText, onImageLoaded: this.handleImageLoaded, useFadein: true, size: isUseSvgRender ? { width: this.state.widgetWidth, height: this.state.widgetHeight } : null, imageFillMode: this.props.config.functionConfig.imageFillMode, isAutoHeight: this.isAutoHeight, imageDisplayQualityMode: this.props.config.functionConfig.imageDisplayQualityMode }),
                this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Attachment &&
                    jsx("div", { className: 'w-100 h-100' },
                        isDataSourceUsed && jsx(ImageGallery, { sources: this.state.attachmentInfos, imageParam: imageParam, imageFillMode: this.props.config.functionConfig.imageFillMode, size: isUseSvgRender ? { width: this.state.widgetWidth, height: this.state.widgetHeight } : null, isAutoHeight: this.isAutoHeight, toolTip: toolTip, altText: altText, altTextWithAttachmentName: this.props.config.functionConfig.altTextWithAttachmentName, toolTipWithAttachmentName: this.props.config.functionConfig.toolTipWithAttachmentName, useFadein: true }),
                        !isDataSourceUsed && jsx(ImageWithParam, { imageParam: imageParam, toolTip: toolTip, altText: altText, useFadein: true, size: isUseSvgRender ? { width: this.state.widgetWidth, height: this.state.widgetHeight } : null, imageFillMode: this.props.config.functionConfig.imageFillMode, isAutoHeight: this.isAutoHeight, imageDisplayQualityMode: this.props.config.functionConfig.imageDisplayQualityMode })),
                this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Symbol &&
                    jsx("div", { className: 'w-100 h-100' },
                        (!this.state.symbolElement || !isDataSourceUsed) && jsx(ImageWithParam, { imageParam: imageParam, toolTip: toolTip, altText: altText, useFadein: true, size: isUseSvgRender ? { width: this.state.widgetWidth, height: this.state.widgetHeight } : null, imageFillMode: this.props.config.functionConfig.imageFillMode, isAutoHeight: this.isAutoHeight, imageDisplayQualityMode: this.props.config.functionConfig.imageDisplayQualityMode }),
                        this.state.symbolElement && isDataSourceUsed && jsx("div", { className: 'w-100 h-100 image-symbol', title: toolTip, dangerouslySetInnerHTML: { __html: this.state.symbolElement.outerHTML } })),
                isUseSvgRender && jsx(ReactResizeDetector, { handleWidth: true, handleHeight: true, onResize: this.debounceOnResize }))));
        let target;
        let linkTo;
        const linkParam = this.props.config.functionConfig.linkParam;
        if (linkParam && linkParam.linkType) {
            target = linkParam.openType;
            linkTo = {
                linkType: linkParam.linkType
            };
            if (linkParam.linkType === LinkType.WebAddress) {
                linkTo.value = this.state.linkUrl;
            }
            else {
                linkTo.value = linkParam.value;
            }
        }
        if (linkTo && (linkTo === null || linkTo === void 0 ? void 0 : linkTo.linkType) !== LinkType.None) {
            renderResult = (jsx("div", { className: 'widget-image-container jimu-widget' },
                jsx(Link, { to: linkTo, target: target, queryObject: queryObject }, imageContent)));
        }
        else {
            renderResult = imageContent;
        }
        if (this.props.config.functionConfig.imageFillMode !== ImageFillMode.Fit && this.props.isInlineEditing && src &&
            (!this.props.repeatedDataSource || (this.props.repeatedDataSource && this.props.repeatedDataSource.recordIndex === 0))) {
            // open crop tool
            const WidgetInBuilder = this.props.builderSupportModules.widgetModules.WidgetInBuilder;
            renderResult = (jsx("div", { className: 'jimu-widget' },
                jsx(ReactResizeDetector, { handleWidth: true, handleHeight: true, onResize: this.onCropWidgetResize }),
                renderResult,
                this.state.cropWidgetHeight && this.state.cropWidgetWidth && jsx(WidgetInBuilder, { widgetId: this.props.id, config: this.props.config, onUnmount: () => { this.clearCropWidgetSize(); }, widgetWidth: this.state.cropWidgetWidth, widgetHeight: this.state.cropWidgetHeight })));
        }
        else {
            renderResult = (jsx("div", { className: 'jimu-widget', css: this.getStyle(), onClick: (event) => { this.onClick(event); }, onTouchEnd: (event) => { this.onClick(event); } },
                renderResult,
                jsx("div", { style: { display: 'none' } },
                    isDataSourceUsed && this.props.config.functionConfig.imgSourceType === ImgSourceType.ByDynamicUrl &&
                        (!this.props.config.functionConfig.dynamicUrlType || this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Expression) &&
                        jsx("div", null,
                            jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.getSrcExpression(), onChange: this.onSrcExpResolveChange, widgetId: this.props.id })),
                    isDataSourceUsed && jsx("div", null,
                        jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.getAltTextExpression(), onChange: this.onAltTextExpResolveChange, widgetId: this.props.id }),
                        jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.getToolTipExpression(), onChange: this.onToolTipExpResolveChange, widgetId: this.props.id }),
                        jsx(ExpressionResolverComponent, { useDataSources: this.props.useDataSources, expression: this.state.linkUrlExpression, onChange: this.onLinkUrlExpResolveChange, widgetId: this.props.id })),
                    // The original logic determines whether the AttachmentComponent and SymbolComponent were rendered by dynamicUrlType, this causes attachmentInfos
                    // to remain unchanged when the data source changes and the type is reset to default, and the onChange event is not executed. When attachment type
                    // is selected again, if the new data is null, then attachmentInfos does not change internally (null -> null), so attachmentInfos does not change.
                    // Now add the method to reset the corresponding state when unmount
                    isDataSourceUsed && this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Attachment &&
                        jsx("div", null,
                            jsx(AttachmentComponent, { record: this.state.record, unmountAttachmentInfosChange: this.unmountAttachmentInfosChange, onChange: this.onAttachmentInfosChange, attachmentTypes: this.attachmentTypes })),
                    isDataSourceUsed && this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Symbol &&
                        jsx("div", null,
                            jsx(SymbolComponent, { record: this.state.record, unmountSymbolElementChange: this.unmountSymbolElementChange, onChange: this.onSymbolElementChange })),
                    isDataSourceUsed && (this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Attachment ||
                        this.props.config.functionConfig.dynamicUrlType === DynamicUrlType.Symbol) &&
                        jsx("div", null,
                            jsx(RecordComponent, { widgetId: this.props.id, useDataSources: this.props.config.functionConfig.useDataSourceForMainDataAndViewSelector
                                    ? Immutable([this.props.config.functionConfig.useDataSourceForMainDataAndViewSelector])
                                    : Immutable([]), isSelectedFromRepeatedDataSourceContext: this.props.config.functionConfig.isSelectedFromRepeatedDataSourceContext, onRecordChange: this.handleRecordChange })))));
        }
        return renderResult;
    }
}
Widget.mapExtraStateProps = (state) => {
    return {
        queryObject: state.queryObject
    };
};
//# sourceMappingURL=widget.js.map