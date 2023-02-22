/** Mock the window.location */
export function mockWindowLocation(loc) {
    const { location } = window;
    delete window.location;
    // @ts-expect-error
    window.location = Object.assign({ href: '', pathname: '/', search: '' }, loc);
    return {
        unMock: () => {
            window.location = location;
        }
    };
}
//# sourceMappingURL=mock-window-location.js.map