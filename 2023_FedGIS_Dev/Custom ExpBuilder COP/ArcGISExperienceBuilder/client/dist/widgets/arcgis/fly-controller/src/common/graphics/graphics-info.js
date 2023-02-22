// object for pass GraphicsInfo
// for reduce storage
export var SymbolTypes;
(function (SymbolTypes) {
    SymbolTypes[SymbolTypes["Default"] = 0] = "Default";
    SymbolTypes[SymbolTypes["Custom"] = 1] = "Custom";
})(SymbolTypes || (SymbolTypes = {}));
export default class GraphicsInfo {
    constructor(graphicsInfoProps) {
        return this.update(graphicsInfoProps);
    }
    update(graphicsInfoProps) {
        const { graphics, isPicked } = graphicsInfoProps;
        this.setGraphics(graphics);
        this.isPicked = isPicked;
        this.symbolType = SymbolTypes.Default;
        return this;
    }
    setGraphics(graphics) {
        this.graphics = graphics;
    }
    getGraphics() {
        return this.graphics;
    }
    destructor() {
    }
    getMainGraphic() {
        if (this.graphics) {
            return this.graphics[0];
        }
        else {
            return null;
        }
    }
    updateByConfig() {
    }
    getConfig() {
        var _a;
        const graphicsInfoConfig = {
            graphics: null,
            isPicked: this.isPicked,
            symbolType: SymbolTypes.Default
        };
        graphicsInfoConfig.graphics = (_a = this.graphics) === null || _a === void 0 ? void 0 : _a.map((g) => {
            const _graphic = g.clone();
            _graphic.symbol = null; // g.delete('symbol')
            if (_graphic.toJSON) {
                return _graphic.toJSON();
            }
            return undefined;
        });
        return graphicsInfoConfig;
    }
}
//# sourceMappingURL=graphics-info.js.map