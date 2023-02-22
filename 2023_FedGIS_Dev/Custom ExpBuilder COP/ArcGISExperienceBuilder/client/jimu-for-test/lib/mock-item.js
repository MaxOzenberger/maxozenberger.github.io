/**
 * Mock an item, return item data or item info.
 */
export function mockItem(mockData) {
    const itemDataUrl = `${mockData.portalUrl}/sharing/rest/content/items/${mockData.itemId}/data`;
    const itemInfoUrl = `${mockData.portalUrl}/sharing/rest/content/items/${mockData.itemId}`;
    fetchMock.mockResponse(req => {
        const reqUrl = decodeURIComponent(req.url).split('?')[0];
        if (reqUrl === itemDataUrl) {
            return Promise.resolve(JSON.stringify(mockData.itemData));
        }
        else if (reqUrl === itemInfoUrl) {
            return Promise.resolve(JSON.stringify(mockData.itemInfo));
        }
        else {
            console.log(`${reqUrl} is not mocked.`);
            return Promise.resolve({ status: 404 });
        }
    });
}
export const MOCK_PORTAL_URL = 'https://mock-portal-url.arcgis.com';
//# sourceMappingURL=mock-item.js.map