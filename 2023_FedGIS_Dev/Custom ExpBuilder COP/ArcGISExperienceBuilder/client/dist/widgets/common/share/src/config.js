// import { ImageParam } from 'jimu-ui';
import { Immutable } from 'jimu-core';
export var UiMode;
(function (UiMode) {
    UiMode["Popup"] = "POPUP";
    UiMode["Inline"] = "INLINE";
    // Slide = 'SLIDE'
})(UiMode || (UiMode = {}));
export var InlineDirection;
(function (InlineDirection) {
    InlineDirection["Horizontal"] = "HORIZONTAL";
    InlineDirection["Vertical"] = "VERTICAL";
})(InlineDirection || (InlineDirection = {}));
// popup mode
export var BtnIconSize;
(function (BtnIconSize) {
    BtnIconSize["Small"] = "sm";
    BtnIconSize["Medium"] = "default";
    BtnIconSize["Large"] = "lg";
})(BtnIconSize || (BtnIconSize = {}));
// inline mode
export var IconColorMode;
(function (IconColorMode) {
    IconColorMode["Default"] = "default";
    IconColorMode["White"] = "white";
    IconColorMode["Black"] = "black";
})(IconColorMode || (IconColorMode = {}));
export var IconSize;
(function (IconSize) {
    IconSize[IconSize["Small"] = 16] = "Small";
    IconSize[IconSize["Medium"] = 24] = "Medium";
    IconSize[IconSize["Large"] = 32] = "Large"; // 'lg',
})(IconSize || (IconSize = {}));
export var IconRadius;
(function (IconRadius) {
    IconRadius[IconRadius["Rad00"] = 0] = "Rad00";
    IconRadius["Rad20"] = "5px";
    IconRadius["Rad50"] = "50%";
})(IconRadius || (IconRadius = {}));
// items
export var ItemsName;
(function (ItemsName) {
    ItemsName["Embed"] = "embed";
    ItemsName["QRcode"] = "qrcode";
    ItemsName["Sharelink"] = "sharelink";
    ItemsName["Email"] = "email";
    ItemsName["Facebook"] = "facebook";
    ItemsName["Twitter"] = "twitter";
    ItemsName["Pinterest"] = "pinterest";
    ItemsName["Linkedin"] = "linkedin";
})(ItemsName || (ItemsName = {}));
export const BackableList = [ItemsName.Embed, ItemsName.QRcode, ItemsName.Sharelink];
/* default config */
const shareIconImage = require('./assets/icons/default-main-icon.svg');
export const DefaultIconConfig = Immutable({
    svg: shareIconImage,
    properties: {
        color: '#828282',
        size: IconSize.Small,
        inlineSvg: true
    }
});
//# sourceMappingURL=config.js.map