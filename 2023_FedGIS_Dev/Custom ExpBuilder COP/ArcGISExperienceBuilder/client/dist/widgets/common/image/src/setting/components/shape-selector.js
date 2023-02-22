/** @jsx jsx */
import { React, classNames, css, jsx, Immutable } from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
import defaultMessages from '../translations/default';
export default class ShapeChooser extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.cropShapeList = ['square', 'circle', 'hexagon', 'pentagon', 'rhombus', 'triangle'];
        this.shapeClick = (e, index) => {
            if (this.props.cropParam && this.props.cropParam.cropShape === this.cropShapeList[index]) {
                return;
            }
            const svgItem = e.currentTarget.getElementsByTagName('svg') && e.currentTarget.getElementsByTagName('svg')[0];
            if (svgItem) {
                let cropParam = this.props.cropParam;
                if (!cropParam) {
                    cropParam = Immutable({});
                }
                cropParam = cropParam.set('svgViewBox', svgItem.getAttribute('viewBox'));
                cropParam = cropParam.set('svgPath', svgItem.getElementsByTagName('path')[0].getAttribute('d'));
                cropParam = cropParam.set('cropShape', this.cropShapeList[index]);
                this.props.onShapeChoosed && this.props.onShapeChoosed(cropParam);
            }
        };
    }
    getStyle() {
        const theme = this.props.theme;
        return css `
      .widget-image-chooseshape-item {
        cursor: pointer;
        height: 30px;
        width: 35px;
        background-color: ${theme.colors.palette.secondary[200]};

        svg {
          fill: ${theme.colors.black};
        }
      }
      `;
    }
    render() {
        return (jsx("div", { className: 'w-100 d-flex justify-content-between', css: this.getStyle() }, this.cropShapeList.map((item, index) => {
            var _a, _b;
            const iconComponent = require(`jimu-icons/svg/filled/data/${item}.svg`);
            if (item === 'square' && !this.props.cropParam) {
                return (jsx(Button, { key: index, className: classNames('widget-image-chooseshape-item border-selected p-0'), onClick: (e) => this.shapeClick(e, index), icon: true, title: this.props.intl.formatMessage({ id: 'imagerectangle', defaultMessage: defaultMessages.imagerectangle }), "aria-pressed": true },
                    jsx(Icon, { width: 12, height: 12, icon: iconComponent })));
            }
            else {
                const intlItem = item === 'square' ? 'imagerectangle' : `image${item}`;
                const iconSelected = ((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.cropParam) === null || _b === void 0 ? void 0 : _b.cropShape) === item;
                return (jsx(Button, { key: index, className: classNames('widget-image-chooseshape-item p-0', { 'border-selected': iconSelected }), onClick: (e) => this.shapeClick(e, index), icon: true, title: this.props.intl.formatMessage({ id: intlItem, defaultMessage: defaultMessages[intlItem] }), "aria-pressed": iconSelected },
                    jsx(Icon, { width: 12, height: 12, icon: iconComponent })));
            }
        })));
    }
}
//# sourceMappingURL=shape-selector.js.map