import { React, MutableStoreManager, getAppStore, appActions, Immutable, ReactDOM } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { CropType } from 'jimu-ui';
import { ImageCrop } from 'jimu-ui/basic/imagecrop';
export default class _BuilderWidget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.__unmount = false;
        this.preloadImage = (url) => {
            this.imgObject = new Image();
            this.imgObject.src = url;
            // eslint-disable-next-line
            const self = this;
            this.imgObject.onload = (e) => {
                if (!self.imgObject) {
                    return;
                }
                if (self.__unmount) {
                    return;
                }
                self.setState({
                    imageWidth: self.imgObject.width,
                    imageHeight: self.imgObject.height
                });
            };
        };
        this.getCropZoomInCropTool = (cropParam, widgetWidth, widgetHeight, imageWidth, imageHeight) => {
            const cropPixel = cropParam && cropParam.cropPixel;
            const cropZoom = cropParam && cropParam.cropZoom;
            let relativeZoomInWidget = null;
            let zoomInCropTool = null;
            let imageWidthInSvg = null;
            let imageHeightInSvg = null;
            if (!cropPixel || !cropZoom) {
                if (widgetWidth / widgetHeight >= imageWidth / imageHeight) {
                    imageWidthInSvg = widgetWidth;
                    imageHeightInSvg = imageHeight / imageWidth * imageWidthInSvg;
                }
                else {
                    imageHeightInSvg = widgetHeight;
                    imageWidthInSvg = imageWidth / imageHeight * imageHeightInSvg;
                }
                relativeZoomInWidget = 1;
            }
            else {
                const cropWindowWidth = cropPixel.width;
                const cropWindowHeight = cropPixel.height;
                let scale = null;
                if (widgetWidth / widgetHeight >= imageWidth / imageHeight) {
                    imageWidthInSvg = widgetWidth;
                    imageHeightInSvg = imageHeight / imageWidth * imageWidthInSvg;
                    if (widgetWidth / widgetHeight >= cropWindowWidth / cropWindowHeight) {
                        scale = widgetWidth / (cropWindowWidth * cropZoom);
                        relativeZoomInWidget = imageHeight * cropZoom * scale / imageHeightInSvg;
                    }
                    else {
                        scale = widgetHeight / (cropWindowHeight * cropZoom);
                        relativeZoomInWidget = imageHeight * cropZoom * scale / imageHeightInSvg;
                    }
                }
                else {
                    imageHeightInSvg = widgetHeight;
                    imageWidthInSvg = imageWidth / imageHeight * imageHeightInSvg;
                    if (widgetWidth / widgetHeight >= cropWindowWidth / cropWindowHeight) {
                        scale = widgetWidth / (cropWindowWidth * cropZoom);
                        relativeZoomInWidget = imageHeight * cropZoom * scale / imageHeightInSvg;
                    }
                    else {
                        scale = widgetHeight / (cropWindowHeight * cropZoom);
                        relativeZoomInWidget = imageHeight * cropZoom * scale / imageHeightInSvg;
                    }
                }
            }
            zoomInCropTool = imageWidthInSvg * relativeZoomInWidget / imageWidth;
            return zoomInCropTool;
        };
        this.getCropPositonInCropTool = (cropParam, zoomInCropTool) => {
            const cropPosition = cropParam && cropParam.cropPosition;
            if (!cropPosition) {
                return {
                    x: 0,
                    y: 0
                };
            }
            return {
                x: zoomInCropTool * cropPosition.x / cropParam.cropZoom,
                y: zoomInCropTool * cropPosition.y / cropParam.cropZoom
            };
        };
        this.onCancelCrop = () => {
            getAppStore().dispatch(appActions.setWidgetIsInlineEditingState(this.props.widgetId, false));
        };
        this.onConfirmCrop = (cropParam, imageResourceItemInfo) => {
            let tempImageParam = this.props.config.functionConfig.imageParam;
            if (cropParam.cropType === CropType.Real && imageResourceItemInfo) {
                tempImageParam = tempImageParam.set('url', imageResourceItemInfo.blobUrl).set('fileFormat', imageResourceItemInfo.fileFormat);
            }
            tempImageParam = tempImageParam.set('cropParam', cropParam);
            if (cropParam.cropPixel) {
                getAppStore().dispatch(appActions.setWidgetIsInlineEditingState(this.props.widgetId, false));
                let functionConfig = Immutable(this.props.config.functionConfig);
                functionConfig = functionConfig.set('isCropped', true);
                functionConfig = functionConfig.set('imageParam', tempImageParam);
                getAppConfigAction().editWidgetConfig(this.props.widgetId, this.props.config.set('functionConfig', functionConfig)).exec();
            }
        };
        this.state = {
            imageWidth: null,
            imageHeight: null
        };
    }
    componentDidMount() {
        this.__unmount = false;
        this.preloadImage(this.props.config.functionConfig.imageParam.originalUrl);
    }
    componentWillUnmount() {
        this.__unmount = true;
        this.props.onUnmount && this.props.onUnmount();
    }
    render() {
        // open crop tool
        const clientRect = MutableStoreManager.getInstance().getStateValue([this.props.widgetId, 'clientRect']);
        const cropParam = this.props.config.functionConfig.imageParam && this.props.config.functionConfig.imageParam.cropParam;
        const widgetWidth = this.props.widgetWidth;
        const widgetHeight = this.props.widgetHeight;
        if (this.state.imageWidth && this.state.imageHeight) {
            const zoomInCropTool = this.getCropZoomInCropTool(cropParam, widgetWidth, widgetHeight, this.state.imageWidth, this.state.imageHeight);
            const cropPositionInCropTool = this.getCropPositonInCropTool(cropParam, zoomInCropTool);
            const originalUrl = this.props.config.functionConfig.imageParam.originalUrl;
            return (React.createElement(ImageCrop, { crop: cropPositionInCropTool, cropZoom: zoomInCropTool, imageFormat: this.props.config.functionConfig.imageParam.fileFormat, onCancelCrop: this.onCancelCrop, widgetArea: clientRect, cropParam: cropParam, originId: this.props.config.functionConfig.imageParam.originalId, widgetId: this.props.widgetId, image: originalUrl, onConfirmCrop: this.onConfirmCrop, cropType: this.props.config.functionConfig.imageParam.imgSourceType === 'BY_URL' ? CropType.Fake : null }));
        }
        else {
            return ReactDOM.createPortal(React.createElement("div", null,
                React.createElement("div", { className: 'jimu-widget', style: { zIndex: 9999, position: 'fixed', top: 0, left: 0, backgroundColor: 'rgb(0, 0, 0, .5)' } }),
                React.createElement("div", { style: { position: 'absolute', left: '50%', top: '50%', zIndex: 9999 }, className: 'jimu-secondary-loading' })), document && document.getElementsByTagName('body')[0]);
        }
    }
}
//# sourceMappingURL=widget.js.map