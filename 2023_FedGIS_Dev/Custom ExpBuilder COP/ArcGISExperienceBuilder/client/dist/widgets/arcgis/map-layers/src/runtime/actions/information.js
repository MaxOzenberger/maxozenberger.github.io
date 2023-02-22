import { portalUrlUtils } from 'jimu-core';
import Action from './action';
export default class Information extends Action {
    constructor(widget, title) {
        super();
        this.isValid = (layerItem) => {
            if (layerItem.layer.url && this.widget.props.config.information) {
                return true;
            }
            else {
                return false;
            }
        };
        this.execute = (layerItem) => {
            var _a;
            const layerObject = layerItem.layer;
            const portalItem = layerObject === null || layerObject === void 0 ? void 0 : layerObject.portalItem;
            if (((_a = portalItem === null || portalItem === void 0 ? void 0 : portalItem.portal) === null || _a === void 0 ? void 0 : _a.url) && portalItem.id) {
                const itemDetailUrl = portalUrlUtils.getStandardPortalUrl(portalItem.portal.url) + `/home/item.html?id=${portalItem.id}`;
                window.open(itemDetailUrl);
            }
            else {
                const layerUrl = (layerObject === null || layerObject === void 0 ? void 0 : layerObject.type) === 'feature' ? `${layerObject.url}/${layerObject.layerId}` : layerObject.url;
                window.open(layerUrl);
            }
        };
        this.id = 'information';
        this.title = title;
        this.className = 'esri-icon-description';
        this.group = 3;
        this.widget = widget;
    }
}
//# sourceMappingURL=information.js.map