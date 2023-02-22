import { React } from 'jimu-core';
import { ImageWithParam } from 'jimu-ui';
import { LeftOutlined } from 'jimu-icons/outlined/directional/left';
import { RightOutlined } from 'jimu-icons/outlined/directional/right';
export class ImageGallery extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backImg = (e) => {
            const preIndex = this.state.currentIndex > 0 ? this.state.currentIndex - 1 : this.props.sources.length - 1;
            this.setState({
                currentIndex: preIndex
            });
            e === null || e === void 0 ? void 0 : e.preventDefault();
            e === null || e === void 0 ? void 0 : e.stopPropagation();
        };
        this.forwardImg = (e) => {
            const nextIndex = this.state.currentIndex < this.props.sources.length - 1 ? this.state.currentIndex + 1 : 0;
            this.setState({
                currentIndex: nextIndex
            });
            e === null || e === void 0 ? void 0 : e.preventDefault();
            e === null || e === void 0 ? void 0 : e.stopPropagation();
        };
        this.state = {
            currentIndex: 0
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.sources !== this.props.sources) {
            this.setState({
                currentIndex: 0
            });
        }
    }
    render() {
        let tempImageParam = {};
        const toolTip = this.props.toolTipWithAttachmentName ? (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].name) : this.props.toolTip;
        const altText = this.props.altTextWithAttachmentName ? (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].name) : this.props.altText;
        if (this.props.imageParam.set) {
            tempImageParam = this.props.imageParam.set('url', (this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].url));
        }
        else {
            tempImageParam.url = this.props.sources && this.props.sources[this.state.currentIndex] && this.props.sources[this.state.currentIndex].url;
        }
        return (React.createElement("div", { className: 'w-100 h-100' },
            this.props.sources && this.props.sources.length > 1 && React.createElement("div", { title: toolTip, className: 'silder-tool-container w-100 h-100', style: { position: 'absolute', zIndex: 1 } },
                React.createElement("div", { className: 'd-flex justify-content-center align-items-center image-gallery-button ml-2', onClick: this.backImg, style: { top: '50%', transform: 'translateY(-50%)', position: 'absolute', left: 0 } },
                    React.createElement(LeftOutlined, { size: 's' })),
                React.createElement("div", { className: 'd-flex justify-content-center align-items-center image-gallery-button mr-2', onClick: this.forwardImg, style: { top: '50%', transform: 'translateY(-50%)', position: 'absolute', right: 0 } },
                    React.createElement(RightOutlined, { size: 's' }))),
            React.createElement("div", { className: 'image-gallery-content w-100 h-100' },
                React.createElement(ImageWithParam, { imageParam: tempImageParam, useFadein: true, size: this.props.size, imageFillMode: this.props.imageFillMode, isAutoHeight: this.props.isAutoHeight, toolTip: toolTip, altText: altText }))));
    }
}
//# sourceMappingURL=image-gallery.js.map