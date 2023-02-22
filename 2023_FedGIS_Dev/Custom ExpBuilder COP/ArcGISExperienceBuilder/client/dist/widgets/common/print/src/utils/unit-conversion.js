import { MapFrameUnit as Unit } from '../config';
export function convertToPxSize(value, unit, dpi) {
    switch (unit) {
        case Unit.Centimeter:
            return {
                width: cm2px(value[0], true, dpi),
                height: cm2px(value[1], false, dpi)
            };
        case Unit.Inch:
            return {
                width: in2px(value[0], true, dpi),
                height: in2px(value[1], false, dpi)
            };
        case Unit.Millimeter:
            return {
                width: mm2px(value[0], true, dpi),
                height: mm2px(value[1], false, dpi)
            };
        case Unit.Point:
            return {
                width: point2px(value[0], true, dpi),
                height: point2px(value[1], false, dpi)
            };
    }
}
export function convertToMeters(value, unit) {
    switch (unit) {
        case Unit.Centimeter:
            return {
                width: value[0] * 0.01,
                height: value[1] * 0.01
            };
        case Unit.Inch:
            return {
                width: value[0] * 0.0254,
                height: value[1] * 0.0254
            };
        case Unit.Millimeter:
            return {
                width: 1609.344,
                height: 1609.344
            };
        case Unit.Point:
            return {
                width: value[0] * 0.0254 * 1 / 72,
                height: value[1] * 0.0254 * 1 / 72
            };
    }
}
export function px2cm(pxValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const cm = pxValue / dpi * 2.54;
    return cm;
}
export function px2meter(pxValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const cm = pxValue / dpi * 2.54;
    return cm / 100;
}
export function px2in(pxValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const inch = pxValue / dpi;
    return inch;
}
export function px2mm(pxValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const mm = pxValue / dpi * 2.54 / 10;
    return mm;
}
export function px2point(pxValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const pt = pxValue / dpi / 10 / 0.376 * 2.54;
    return pt;
}
export function cm2px(cmValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const px = cmValue / 2.54 * dpi;
    return px;
}
export function in2px(inValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const px = inValue * dpi;
    return px;
}
export function mm2px(mmValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const px = mmValue / 2.54 * dpi * 10;
    return px;
}
export function point2px(pointValue, isX, extDip) {
    const DPI = getDpi(extDip);
    const dpi = isX ? DPI.XDPI : DPI.YDPI;
    const mm = pointValue * 0.376;
    const px = mm / 2.54 * dpi * 10;
    return px;
}
export function getDPIByInch() {
    const DPI = {
        XDPI: null,
        YDPI: null
    };
    const screen = window.screen;
    if (screen === null || screen === void 0 ? void 0 : screen.XDPI) {
        DPI.XDPI = screen === null || screen === void 0 ? void 0 : screen.deviceXDPI;
        DPI.YDPI = screen === null || screen === void 0 ? void 0 : screen.deviceYDPI;
    }
    else {
        const tmpNode = document.createElement('div');
        tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
        document.body.appendChild(tmpNode);
        DPI.XDPI = tmpNode.offsetWidth;
        DPI.YDPI = tmpNode.offsetHeight;
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return DPI;
}
function getDpi(dpi) {
    if (dpi) {
        return {
            XDPI: dpi,
            YDPI: dpi
        };
    }
    else {
        return getDPIByInch();
    }
}
//# sourceMappingURL=unit-conversion.js.map