import { Immutable } from 'jimu-core';
const getGuideId = (names = Immutable([])) => {
    var _a;
    const reg = /^guide\_(\d+)$/;
    let max = -1;
    names.forEach(id => {
        const match = id.match(reg);
        if (match) {
            max = Math.max(max, parseInt(match[1], 10));
        }
    });
    if (max === -1) {
        max = ((_a = names === null || names === void 0 ? void 0 : names.length) !== null && _a !== void 0 ? _a : 0);
    }
    return max + 1;
};
export const getGuideName = (guides) => {
    const names = guides === null || guides === void 0 ? void 0 : guides.map(guide => guide.name);
    const id = getGuideId(names);
    const name = `guide_${id}`;
    return name;
};
const isValidGuide = (guide) => {
    return typeof (guide === null || guide === void 0 ? void 0 : guide.start) === 'number' && !Number.isNaN(guide === null || guide === void 0 ? void 0 : guide.start);
};
export const getValidGuides = (guides) => {
    return guides.filter(isValidGuide);
};
export const parseNumber = (value) => {
    if (value === '' || value == null)
        return undefined;
    const number = +value;
    return Number.isNaN(number) ? undefined : number;
};
//# sourceMappingURL=utils.js.map