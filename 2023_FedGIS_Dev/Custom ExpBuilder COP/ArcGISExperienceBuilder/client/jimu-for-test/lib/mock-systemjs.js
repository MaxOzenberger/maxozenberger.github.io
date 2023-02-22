/** Mock SystemJS.import() */
export function mockSystemJs() {
    if (!window.SystemJS) {
        window.SystemJS = {
            import: mockImport,
            get: mockGet,
            resolve: mockResolve
        };
    }
    else {
        window.SystemJS.import = mockImport;
    }
}
const mockImport = (moduleName) => Promise.resolve(require(moduleName));
const mockGet = (moduleName) => require(moduleName);
const mockResolve = (moduleName) => moduleName;
//# sourceMappingURL=mock-systemjs.js.map