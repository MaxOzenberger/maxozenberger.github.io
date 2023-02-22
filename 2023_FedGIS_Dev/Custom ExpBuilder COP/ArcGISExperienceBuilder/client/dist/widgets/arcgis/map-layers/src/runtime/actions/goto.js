// import {MessageManager, ExtentChangeMessage, MessageType} from 'jimu-core';
import Action from './action';
import { zoomToUtils } from 'jimu-arcgis';
export default class Goto extends Action {
    constructor(widget, title) {
        super();
        this.isValid = (layerItem) => {
            if (layerItem.layer.declaredClass === 'esri.layers.GroupLayer') {
                return false;
            }
            if (layerItem.parent && layerItem.parent.layer.declaredClass !== 'esri.layers.GroupLayer') {
                return false;
            }
            if (this.useMapWidget() && this.widget.props.config.goto) {
                return true;
            }
            else {
                return false;
            }
        };
        this.execute = (layerItem) => {
            // let extentMessage = new ExtentChangeMessage(this.widget.props.id, layerItem.layer.fullExtent);
            // MessageManager.getInstance().publishMessage(extentMessage);
            if (this.widget.viewFromMapWidget) {
                /// /this.widget.viewFromMapWidget.goTo(layerItem.layer.fullExtent);
                // layerItem.layer.queryFeatures().then( (result) => {
                //  //zoomToGraphics(this.widget.viewFromMapWidget, [result.features[0]]).then(() => {
                //  //  console.log("abc");
                //  //});
                //  zoomToUtils.zoomTo(this.widget.viewFromMapWidget, {
                //    layer: layerItem.layer,
                //    graphics: [result.features[0]]
                //  }, {
                //    scale: 23111621
                //  });
                // })
                zoomToUtils.zoomTo(this.widget.viewFromMapWidget, layerItem.layer, {
                // scale: null
                });
            }
        };
        this.id = 'goto';
        this.title = title;
        this.className = 'esri-icon-zoom-out-fixed';
        this.group = 0;
        this.widget = widget;
    }
}
//# sourceMappingURL=goto.js.map