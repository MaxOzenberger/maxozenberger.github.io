import { ServiceManager } from 'jimu-core';
/**
 * Mock a single feature layer.
 */
export function mockFeatureLayer(mockData) {
    const serverInfoUrl = ServiceManager.getInstance().getArcGISServerUrlFromServiceUrl(mockData.url);
    fetchMock.mockResponse(req => {
        const reqUrl = decodeURIComponent(req.url);
        if (reqUrl.split('?')[0] === serverInfoUrl) {
            return Promise.resolve(JSON.stringify(mockData.serverInfo));
        }
        else if (reqUrl.split('?')[0] === mockData.url) {
            return Promise.resolve(JSON.stringify(mockData.layerDefinition)); // schema
        }
        else {
            const query = mockData.queries && mockData.queries.find(q => decodeURIComponent(q.url) === reqUrl);
            if (query) {
                if (query.delay) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            return resolve(JSON.stringify(query.result));
                        }, query.delay);
                    });
                }
                else {
                    return Promise.resolve(JSON.stringify(query.result));
                }
            }
            else {
                console.log(`${reqUrl} is not mocked.`);
                return Promise.resolve({ status: 404 });
            }
        }
    });
}
/**
 * Mock a whole service, e.g. feature service, map service or scene service.
 */
export function mockService(mockData) {
    const serverInfoUrl = ServiceManager.getInstance().getArcGISServerUrlFromServiceUrl(mockData.url);
    fetchMock.mockResponse(req => {
        const reqUrl = decodeURIComponent(req.url);
        if (reqUrl.split('?')[0] === serverInfoUrl) {
            return Promise.resolve(JSON.stringify(mockData.serverInfo));
        }
        else if (reqUrl.split('?')[0] === mockData.url) {
            return Promise.resolve(JSON.stringify(mockData.serviceDefinition));
        }
        else {
            const layer = mockData.layers && mockData.layers.find(l => reqUrl.split('?')[0] === l.url);
            if (layer) {
                return Promise.resolve(JSON.stringify(layer.layerDefinition));
            }
            else {
                console.log(`${reqUrl} is not mocked.`);
                return Promise.resolve({ status: 404 });
            }
        }
    });
}
//# sourceMappingURL=mock-service.js.map