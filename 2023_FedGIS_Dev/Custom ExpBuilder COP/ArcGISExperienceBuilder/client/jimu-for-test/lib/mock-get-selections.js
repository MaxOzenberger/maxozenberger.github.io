// DOM Traversal is not implemented in JSDOM
// The best we can do is shim the functions
const getSelectionShim = () => {
    return {
        getRangeAt: () => { },
        removeAllRanges: () => { },
        setStart: () => { },
        setEnd: () => { },
        addRange: () => { }
    };
};
/**
 * Get [selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection) of document.
 */
export const mockGetSelection = (global) => {
    global.document = global.document || {};
    global.window = global.window || {};
    document.getSelection = getSelectionShim;
    document.createRange = document.getSelection;
};
//# sourceMappingURL=mock-get-selections.js.map