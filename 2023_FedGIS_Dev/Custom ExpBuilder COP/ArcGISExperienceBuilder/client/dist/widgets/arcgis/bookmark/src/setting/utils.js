const compareRatio = (origin, current) => {
    let equal = true;
    const ratio = Math.floor((origin / current) * 1000) / 1000;
    if (ratio !== 0.999 && ratio !== 1)
        equal = false;
    return equal;
};
export const viewChangeBufferCompare = (origin, current, type) => {
    let equal = true;
    if (!origin)
        return equal;
    if (type === '2d') {
        const extentKeys = ['xmin', 'ymin', 'xmax', 'ymax'];
        extentKeys.forEach(key => {
            if (!compareRatio(origin === null || origin === void 0 ? void 0 : origin[key], current === null || current === void 0 ? void 0 : current[key]))
                equal = false;
        });
    }
    else {
        const viewpointKeys = ['camera', 'rotation', 'scale', 'targetGeometry'];
        viewpointKeys.forEach(key => {
            if (key === 'camera') {
                const cameraKeys = ['heading', 'position', 'tilt'];
                cameraKeys.forEach(cameraKey => {
                    var _a, _b;
                    if (cameraKey === 'position') {
                        const posKeys = ['x', 'y', 'z'];
                        posKeys.forEach(posKey => {
                            var _a, _b, _c, _d;
                            if (!compareRatio((_b = (_a = origin === null || origin === void 0 ? void 0 : origin.camera) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b[posKey], (_d = (_c = current === null || current === void 0 ? void 0 : current.camera) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d[posKey]))
                                equal = false;
                        });
                    }
                    else {
                        if (!compareRatio((_a = origin === null || origin === void 0 ? void 0 : origin.camera) === null || _a === void 0 ? void 0 : _a[cameraKey], (_b = current === null || current === void 0 ? void 0 : current.camera) === null || _b === void 0 ? void 0 : _b[cameraKey]))
                            equal = false;
                    }
                });
            }
            else if (key === 'targetGeometry') {
                const subKeys = ['x', 'y', 'z'];
                subKeys.forEach(subKey => {
                    var _a, _b;
                    if (!compareRatio((_a = origin === null || origin === void 0 ? void 0 : origin.targetGeometry) === null || _a === void 0 ? void 0 : _a[subKey], (_b = current === null || current === void 0 ? void 0 : current.targetGeometry) === null || _b === void 0 ? void 0 : _b[subKey]))
                        equal = false;
                });
            }
            else {
                if (!compareRatio(origin === null || origin === void 0 ? void 0 : origin[key], current === null || current === void 0 ? void 0 : current[key]))
                    equal = false;
            }
        });
    }
    return equal;
};
//# sourceMappingURL=utils.js.map