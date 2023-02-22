import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { DataSourceStatus, DataRecordSetChangeMessage, MessageManager, RecordSetChangeType, Immutable } from 'jimu-core';
import { checkIsSuggestionRepeat, getSuggestionItem, uniqueJson, getDatasource, changeDsStatus, checkIsDsCreated } from '../utils/utils';
import { OutputDsObjectField, OutputDsAddress } from '../../constants';
export const ObjectIdField = {
    alias: 'OBJECTID',
    type: 'oid',
    name: OutputDsObjectField
};
export const AddressField = {
    alias: 'ADDRESS',
    type: 'string',
    name: OutputDsAddress
};
export const AddressSchema = Object.assign(Object.assign({}, AddressField), { jimuName: OutputDsAddress });
/**
 * Get geocode suggestion
*/
export const fetchGeocodeSuggestions = (searchText, serviceListItem) => {
    if (!checkIsDsCreated(serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.outputDataSourceId) || !(serviceListItem === null || serviceListItem === void 0 ? void 0 : serviceListItem.isSupportSuggest)) {
        return Promise.resolve({});
    }
    return getSuggestion(serviceListItem, searchText);
};
/**
 * Query and get suggestion element
*/
export const getSuggestion = (geocodeItem, searchText) => {
    return loadSuggest(geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.geocodeURL, searchText, geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.maxSuggestions).then(res => {
        let searchSuggestion = [];
        res.forEach((addrInfo, index) => {
            const address = addrInfo.text;
            if (address && !checkIsSuggestionRepeat(searchSuggestion, address)) {
                const layerSuggestion = {
                    suggestionHtml: getSuggestionItem(address, searchText),
                    suggestion: address,
                    configId: geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.configId,
                    magicKey: addrInfo === null || addrInfo === void 0 ? void 0 : addrInfo.magicKey
                };
                searchSuggestion.push(layerSuggestion);
            }
        });
        searchSuggestion = uniqueJson(searchSuggestion, 'suggestion');
        const suggestion = {
            suggestionItem: searchSuggestion.splice(0, geocodeItem.maxSuggestions),
            layer: geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.label,
            icon: geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.icon
        };
        return Promise.resolve(suggestion);
    }).catch((error) => {
        return Promise.reject(error);
    });
};
/**
 * Load all geocode records
*/
export const loadGecodeRecords = (address, maxResultNumber, geocodeItem, searchResultView) => {
    if (!checkIsDsCreated(geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.outputDataSourceId))
        return;
    const outputDs = getDatasource(geocodeItem.outputDataSourceId);
    changeDsStatus(outputDs, DataSourceStatus.NotReady);
    return loadGeocodeRecodsAndUpdateOutputDs({
        address,
        maxResultNumber,
        searchResultView,
        geocodeItem: geocodeItem
    });
};
/**
 * load data from geocode service and then init outputDs records
*/
export const loadGeocodeRecodsAndUpdateOutputDs = (option) => {
    const { address, maxResultNumber, geocodeItem } = option;
    const { outputDataSourceId, singleLineFieldName, defaultAddressFieldName } = geocodeItem;
    const outputDs = getDatasource(outputDataSourceId);
    const addressToLocationsOption = {
        geocodeItem: geocodeItem,
        address: address,
        maxResultNumber: maxResultNumber,
        singleLineFieldName: singleLineFieldName,
        addressFields: (geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.addressFields) || []
    };
    return addressToLocations(addressToLocationsOption).then(response => {
        return loadArcGISJSAPIModules(['esri/layers/FeatureLayer', 'esri/Graphic']).then(modules => {
            var _a;
            const [FeatureLayer, Graphic] = modules;
            const newResponse = response === null || response === void 0 ? void 0 : response.filter(res => res === null || res === void 0 ? void 0 : res.address);
            let extent;
            const graphics = newResponse === null || newResponse === void 0 ? void 0 : newResponse.map((res, index) => {
                const attributes = res.attributes;
                attributes.address = res.address;
                if (defaultAddressFieldName) {
                    attributes[defaultAddressFieldName] = res.address;
                }
                attributes.objectid = index;
                extent = res.extent;
                const graphic = new Graphic({
                    attributes: attributes,
                    geometry: res.location
                });
                return graphic;
            });
            const layer = new FeatureLayer({
                id: `${outputDataSourceId}_layer`,
                fields: (_a = geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.addressFields) === null || _a === void 0 ? void 0 : _a.map(jimuField => {
                    return {
                        alias: jimuField.alias,
                        type: 'string',
                        name: jimuField.jimuName
                    };
                }),
                objectIdField: OutputDsObjectField,
                geometryType: 'point',
                source: graphics,
                fullExtent: extent
            });
            const featureLayerDs = outputDs;
            featureLayerDs.layer = layer;
            const dsStatus = address ? DataSourceStatus.Unloaded : DataSourceStatus.NotReady;
            changeDsStatus(outputDs, dsStatus);
            return Promise.resolve(DataSourceStatus.Unloaded);
        });
    }).catch((error) => {
        return Promise.reject(error);
    });
};
/**
 * Query geocode service and get geocode record
*/
export const addressToLocations = (addressToLocationsOption) => {
    const { geocodeItem, address, maxResultNumber, singleLineFieldName, addressFields } = addressToLocationsOption;
    const { geocodeURL, magicKey } = geocodeItem;
    return loadArcGISJSAPIModules(['esri/rest/locator']).then(modules => {
        var _a;
        const [locator] = modules;
        const singleLineKey = singleLineFieldName || 'SingleLine';
        let addressOption = Immutable({
            maxSuggestions: maxResultNumber
        });
        const outFields = (_a = addressFields === null || addressFields === void 0 ? void 0 : addressFields.map(field => field === null || field === void 0 ? void 0 : field.jimuName)) === null || _a === void 0 ? void 0 : _a.join(',');
        if (outFields) {
            addressOption = addressOption.set('outFields', outFields);
        }
        addressOption = addressOption.setIn([singleLineKey], address);
        magicKey && (addressOption = addressOption.set('magicKey', magicKey));
        return locator.addressToLocations(geocodeURL, {
            address: addressOption === null || addressOption === void 0 ? void 0 : addressOption.asMutable({ deep: true })
        }, {
            query: {}
        }).then(response => {
            response = response.sort((a, b) => { return b.score - a.score; });
            response = response.filter((item) => { return item.location; });
            return response;
        }, err => {
            console.error(err.message);
            return [];
        });
    });
};
/**
 * Query geocode service suggestion
*/
export const loadSuggest = (geocodeURL, address, maxSuggestion) => {
    return loadArcGISJSAPIModules(['esri/rest/locator']).then(modules => {
        const [locator] = modules;
        return locator.suggestLocations(geocodeURL, {
            text: address,
            maxSuggestions: maxSuggestion
        }).then(response => {
            return response || [];
        }, err => {
            console.error(err.message);
            return [];
        });
    });
};
export const getCurrentAddress = (geocodeURL, position) => {
    // const position = getCurrentLocation()
    if (!position)
        return Promise.resolve(null);
    return loadArcGISJSAPIModules(['esri/rest/locator']).then(modules => {
        const [locator] = modules;
        return createPoint(position).then(point => {
            return locator.locationToAddress(geocodeURL, {
                location: point
            }, {
                query: {}
            }).then(response => {
                return Promise.resolve(response.address);
            }, err => {
                console.error(err.message);
                return [];
            });
        });
    });
};
/**
 * Get current location
*/
export const getCurrentLocation = (onSeccess, onError) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSeccess, onError);
    }
    else {
        onError && onError();
    }
};
/**
 * Load geocode records by outputDatasources
*/
export const loadGeocodeOutputRecords = (geocodeItem, resultMaxNumber, id, isPublishRecordCreateAction = false) => {
    const outputDataSourceId = geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.outputDataSourceId;
    const ds = getDatasource(geocodeItem === null || geocodeItem === void 0 ? void 0 : geocodeItem.outputDataSourceId);
    const query = {
        where: '1=1',
        pageSize: resultMaxNumber,
        page: 1,
        returnGeometry: true
    };
    return ds === null || ds === void 0 ? void 0 : ds.load(query, { widgetId: id }).then(records => {
        isPublishRecordCreateAction && publishRecordCreatedMessageAction(outputDataSourceId, id, [], RecordSetChangeType.Remove);
        setTimeout(() => {
            isPublishRecordCreateAction && publishRecordCreatedMessageAction(outputDataSourceId, id, records);
        }, 100);
        return Promise.resolve({
            records: records,
            configId: geocodeItem.configId,
            dsId: outputDataSourceId,
            isGeocodeRecords: true
        });
    });
};
/**
 * Publish message action after records update
*/
export const publishRecordCreatedMessageAction = (outputDsId, widgetId, records, recordSetChangeType = RecordSetChangeType.Update) => {
    const ds = getDatasource(outputDsId);
    const dataRecordSetChangeMessage = new DataRecordSetChangeMessage(widgetId, outputDsId, recordSetChangeType, {
        records: records,
        dataSource: ds
    });
    MessageManager.getInstance().publishMessage(dataRecordSetChangeMessage);
};
/**
 * Create point by position
*/
export const createPoint = (position) => {
    const coords = position && position.coords;
    if (!coords) {
        return Promise.resolve(null);
    }
    return loadArcGISJSAPIModules(['esri/geometry/Point']).then(modules => {
        const [Point] = modules;
        return new Point({
            longitude: coords.longitude,
            latitude: coords.latitude,
            z: coords.altitude || null,
            spatialReference: {
                wkid: 4326
            }
        });
    });
};
//# sourceMappingURL=locator-service.js.map