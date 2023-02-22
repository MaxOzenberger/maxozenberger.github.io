// use Signal to cancel controller's fly ,#6258
export default class AbortSignalHandler {
    constructor() {
        this.abort();
        this.update();
        return this;
    }
    destructor() {
        if (this.signalHandler) {
            this.signalHandler.abort();
            this.signalHandler = null;
        }
    }
    update() {
        // this.abort()
        this.signalHandler = null;
        this.signalHandler = new AbortController();
        return this.signalHandler.signal;
    }
    abort() {
        var _a;
        if ((_a = this.signalHandler) === null || _a === void 0 ? void 0 : _a.signal) {
            this.signalHandler.abort();
        }
    }
}
//# sourceMappingURL=abort-signal-handler.js.map