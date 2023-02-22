/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { hooks, DropdownItem, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { getCurrentLocation, getCurrentAddress } from '../utils/locator-service';
import { PinOutlined } from 'jimu-icons/outlined/application/pin';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
import { SearchServiceType } from '../../config';
const { useState } = React;
const CurrentLocation = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const { serviceList, onLocationChange } = props;
    const [isGetLocationError, setIsGetLocationError] = useState(false);
    const [geocodeServiceItem, setGeocodeServiceItem] = React.useState(null);
    React.useEffect(() => {
        initGeocodeService();
        // eslint-disable-next-line
    }, [serviceList]);
    const confirmUseCurrentLocation = () => {
        getCurrentLocation(getLocationSuccess, getLocationError);
    };
    const initGeocodeService = () => {
        var _a;
        for (const configId in serviceList) {
            const serviceItem = (_a = serviceList[configId]) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
            if (serviceItem.searchServiceType === SearchServiceType.GeocodeService) {
                setGeocodeServiceItem(serviceItem);
                break;
            }
        }
    };
    const getLocationSuccess = (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        const address = `${longitude},${latitude}`;
        if (geocodeServiceItem) {
            const geocodeURL = geocodeServiceItem === null || geocodeServiceItem === void 0 ? void 0 : geocodeServiceItem.geocodeURL;
            getCurrentAddress(geocodeURL, position).then(res => {
                onLocationChange(res);
            });
        }
        else {
            onLocationChange(address);
        }
    };
    const getLocationError = () => {
        setIsGetLocationError(true);
    };
    return (jsx("div", null,
        !isGetLocationError && jsx(DropdownItem, { onClick: confirmUseCurrentLocation, title: nls('useCurrentLocation') },
            jsx(PinOutlined, { className: 'mr-2' }),
            nls('useCurrentLocation')),
        isGetLocationError && jsx(DropdownItem, { title: nls('couldNotRetrieve') },
            jsx(WarningOutlined, { className: 'mr-2' }),
            nls('couldNotRetrieve'))));
};
export default CurrentLocation;
//# sourceMappingURL=use-current-location.js.map