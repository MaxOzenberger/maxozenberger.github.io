import Action from './action';
export default class Opacity extends Action {
    constructor(widget, title, isIncreaseOpacity) {
        super();
        this.isValid = (layerItem) => {
            if (layerItem.parent && layerItem.parent.layer.declaredClass !== 'esri.layers.GroupLayer') {
                return false;
            }
            if (this.useMapWidget() && this.widget.props.config.opacity) {
                return true;
            }
            else {
                return false;
            }
        };
        this.execute = (layerItem) => {
            if (this.isIncreaseOpacity) {
                if (layerItem.layer.opacity < 1) {
                    layerItem.layer.opacity += 0.25;
                }
            }
            else {
                if (layerItem.layer.opacity > 0) {
                    layerItem.layer.opacity -= 0.25;
                }
            }
        };
        isIncreaseOpacity ? this.id = 'increaseOpacity' : this.id = 'decreaseOpacity';
        this.title = title;
        isIncreaseOpacity ? this.className = 'esri-icon-up' : this.className = 'esri-icon-down';
        this.group = 1;
        this.widget = widget;
        this.isIncreaseOpacity = isIncreaseOpacity;
    }
}
//# sourceMappingURL=opacity.js.map