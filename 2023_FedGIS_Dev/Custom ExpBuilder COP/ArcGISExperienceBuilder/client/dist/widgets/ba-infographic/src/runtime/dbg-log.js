class DbgLog {
    constructor() {
        this.fixForLint = '';
    }
    static log(title, ...list) {
        if (DbgLog.showDebugConsoleLogs) {
            console.log('=======>' + title + ': ');
            if (list && list.length) {
                for (let ii = 0; ii < list.length; ii++) {
                    console.log('...', list[ii]);
                }
            }
        }
    }
}
// Default is to not show any console statements.  Set to 'true' to enable
DbgLog.showDebugConsoleLogs = false;
export default DbgLog;
//# sourceMappingURL=dbg-log.js.map