/**
 * Get expression parts from expressions
 * @param expressions
 */
export const getExpressionParts = (expressions) => {
    let parts = [];
    for (const uniqueid in expressions) {
        const expression = expressions[uniqueid];
        const iparts = expression === null || expression === void 0 ? void 0 : expression.parts;
        if (iparts != null) {
            parts = parts.concat(iparts);
        }
    }
    return parts;
};
//# sourceMappingURL=utils.js.map