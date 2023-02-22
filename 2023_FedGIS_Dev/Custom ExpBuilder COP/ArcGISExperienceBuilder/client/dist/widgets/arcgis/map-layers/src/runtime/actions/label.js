// import {MessageManager, ExtentChangeMessage, MessageType} from 'jimu-core';
import Action from './action';
export default class Leabel extends Action {
    constructor(widget, titleShow, titleHide) {
        super();
        this.isValid = (layerItem) => {
            var _a;
            this.title = layerItem.layer.labelsVisible ? this.titleHide : this.titleShow;
            if (!this.useMapWidget() || !this.widget.props.config.label || !((_a = layerItem === null || layerItem === void 0 ? void 0 : layerItem.layer) === null || _a === void 0 ? void 0 : _a.labelingInfo)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.execute = (layerItem) => {
            layerItem.layer.labelsVisible = !layerItem.layer.labelsVisible;
            this.updateTitle(layerItem.layer.labelsVisible);
        };
        this.updateTitle = (labelsVisible) => {
            var _a, _b;
            const dom = document.querySelector(`.widget-layerlist_${(_b = (_a = this.widget) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.id} .esri-layer-list__item-action .label-action-title`);
            const domParent = dom === null || dom === void 0 ? void 0 : dom.parentElement;
            let domTitle;
            domParent === null || domParent === void 0 ? void 0 : domParent.childNodes.forEach((childNode) => {
                var _a;
                // @ts-expect-error
                if (((_a = childNode.className) === null || _a === void 0 ? void 0 : _a.indexOf('esri-layer-list__item-action-title')) > -1) {
                    domTitle = childNode;
                }
            });
            if (domTitle) {
                domTitle.innerHTML = labelsVisible ? this.titleHide : this.titleShow;
            }
        };
        this.id = 'label';
        this.className = 'esri-icon-labels label-action-title';
        this.group = 0;
        this.widget = widget;
        this.titleShow = titleShow;
        this.titleHide = titleHide;
    }
}
//# sourceMappingURL=label.js.map