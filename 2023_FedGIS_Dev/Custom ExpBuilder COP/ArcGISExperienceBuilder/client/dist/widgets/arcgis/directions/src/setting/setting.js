var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { jsx, React, css, polished, lodash, Immutable, DataSourceTypes, classNames, SupportedUtilityType, loadArcGISJSAPIModules } from 'jimu-core';
import { hooks, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { MapWidgetSelector, SettingRow, SettingSection, SearchGeneralSetting, SearchDataSetting, SearchSuggestionSetting, SearchDataType } from 'jimu-ui/advanced/setting-components';
import { UtilitySelector } from 'jimu-ui/advanced/utility-selector';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import defaultMessages from './translations/default';
import { DEFAULT_ROUTE_URL, MAX_SUGGESTIONS } from '../constants';
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId, convertJSAPIFieldsToJimuFields } from '../utils';
const { useMemo } = React;
const DEFAULT_SEARCH_SUGGESTION_SETTINGS = {
    maxSuggestions: MAX_SUGGESTIONS
};
const Setting = (props) => {
    var _a, _b, _c;
    const { onSettingChange, id, config, useMapWidgetIds, useUtilities, portalUrl } = props;
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const routeConfig = config === null || config === void 0 ? void 0 : config.routeConfig;
    const searchDataConfig = (_a = config.searchConfig) === null || _a === void 0 ? void 0 : _a.dataConfig;
    const searchGeneralConfig = (_b = config.searchConfig) === null || _b === void 0 ? void 0 : _b.generalConfig;
    const searchSuggestionConfig = useMemo(() => { var _a; return (Immutable(DEFAULT_SEARCH_SUGGESTION_SETTINGS).merge(((_a = config.searchConfig) === null || _a === void 0 ? void 0 : _a.suggestionConfig) || {})); }, [(_c = config.searchConfig) === null || _c === void 0 ? void 0 : _c.suggestionConfig]);
    const onMapWidgetSelected = (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const outputDsJsons = yield getOutputDataSourceJsons(id, ids, translate);
        onSettingChange({
            id: id,
            useMapWidgetIds: ids
        }, outputDsJsons);
    });
    const onSearchDataSettingsChange = (settings) => {
        var _a;
        if (!lodash.isDeepEqual(settings, searchDataConfig)) {
            onSettingChange({
                id: id,
                config: config.setIn(['searchConfig', 'dataConfig'], settings),
                useUtilities: getUsedUtilities(routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility, (_a = settings === null || settings === void 0 ? void 0 : settings.map(c => c.useUtility)) === null || _a === void 0 ? void 0 : _a.asMutable())
            });
        }
    };
    const onSearchGeneralSettingsChange = (hint) => {
        if (hint && hint !== (searchGeneralConfig === null || searchGeneralConfig === void 0 ? void 0 : searchGeneralConfig.hint)) {
            onSettingChange({
                id: id,
                config: config.setIn(['searchConfig', 'generalConfig'], { hint })
            });
        }
    };
    const onSearchSuggestionSettingsChange = (settings) => {
        if (!lodash.isDeepEqual(settings, searchSuggestionConfig)) {
            onSettingChange({
                id: id,
                config: config.setIn(['searchConfig', 'suggestionConfig'], settings)
            });
        }
    };
    const onRouteUtilityChange = (utilities) => {
        var _a, _b, _c, _d, _e;
        if (((_a = utilities === null || utilities === void 0 ? void 0 : utilities[0]) === null || _a === void 0 ? void 0 : _a.utilityId) !== ((_b = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility) === null || _b === void 0 ? void 0 : _b.utilityId)) {
            onSettingChange({
                id: id,
                config: config.setIn(['routeConfig', 'useUtility'], utilities === null || utilities === void 0 ? void 0 : utilities[0]),
                useUtilities: getUsedUtilities(utilities === null || utilities === void 0 ? void 0 : utilities[0], (_e = (_d = (_c = config.searchConfig) === null || _c === void 0 ? void 0 : _c.dataConfig) === null || _d === void 0 ? void 0 : _d.map(c => c.useUtility)) === null || _e === void 0 ? void 0 : _e.asMutable())
            });
        }
    };
    const hasMap = useMemo(() => (useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds.length) > 0, [useMapWidgetIds]);
    const ariaDescId = `${id}-desc`;
    return (jsx("div", { className: 'widget-setting-directions jimu-widget-setting', css: style },
        jsx(SettingSection, { role: 'group', "aria-label": translate('selectMapWidget'), title: translate('selectMapWidget'), className: classNames({ 'border-0': !hasMap }) },
            jsx(SettingRow, null,
                jsx(MapWidgetSelector, { onSelect: onMapWidgetSelected, useMapWidgetIds: useMapWidgetIds }))),
        hasMap
            ? jsx("div", null,
                jsx(SettingSection, { role: 'group', "aria-label": translate('routeSettings'), title: translate('routeSettings') },
                    jsx(SettingRow, { flow: 'wrap', label: translate('routeUrl') },
                        jsx(UtilitySelector, { useUtilities: Immutable((routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.useUtility) && (useUtilities === null || useUtilities === void 0 ? void 0 : useUtilities.some(u => routeConfig.useUtility.utilityId === u.utilityId)) ? [routeConfig.useUtility] : []), onChange: onRouteUtilityChange, showRemove: false, closePopupOnSelect: true, type: SupportedUtilityType.Routing, "aria-describedby": ariaDescId })),
                    jsx(SettingRow, { className: 'mt-0' },
                        jsx("i", { className: 'text-break example-url', id: ariaDescId }, translate('exampleUrl', { url: `${DEFAULT_ROUTE_URL}` })))),
                jsx(SettingSection, { role: 'group', "aria-label": translate('searchSettings'), title: translate('searchSettings'), className: 'search-settings' },
                    jsx(SearchDataSetting, { id: id, datasourceConfig: searchDataConfig, createOutputDs: false, portalUrl: portalUrl, hideIconSetting: true, searchDataSettingType: SearchDataType.GeocodeService, onSettingChange: onSearchDataSettingsChange }),
                    jsx(SearchGeneralSetting, { id: id, hint: searchGeneralConfig === null || searchGeneralConfig === void 0 ? void 0 : searchGeneralConfig.hint, onSettingChange: onSearchGeneralSettingsChange }),
                    jsx(SearchSuggestionSetting, { id: id, settingConfig: searchSuggestionConfig, onSettingChange: onSearchSuggestionSettingsChange, hideRecentSearchSetting: true })))
            : jsx("div", { className: 'd-flex justify-content-center align-items-center placeholder-container' },
                jsx("div", { className: 'text-center' },
                    jsx(ClickOutlined, { size: 48, className: 'd-inline-block placeholder-icon mb-2' }),
                    jsx("p", { className: 'placeholder-hint' }, translate('selectMapHint'))))));
};
export default Setting;
const style = css `
.route-url-input{
  min-height: ${polished.rem(100)}
}
.example-url{
  font-size: ${polished.rem(12)};
  color: var(--dark-500);
}
.warning-icon{
  color: var(--danger-500);
}
.warning-hint{
  width: calc(100% - 20px);
  margin: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--danger-500);
}
.placeholder-container{
  height: calc(100% - 100px);
  .placeholder-hint{
    font-size: ${polished.rem(14)};
    font-weight: 500;
    color: var(--dark-500);
    max-width: ${polished.rem(160)};
  }
  .placeholder-icon{
    color: var(--dark-200);
  }
}
.search-settings{
  >div{
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    border: 0 !important;
  }
}
`;
function getOutputDataSourceJsons(widgetId, mapWidgetIds, translate) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        // If do not have used map widget, won't generate any output data sources.
        if (!mapWidgetIds || mapWidgetIds.length === 0) {
            return Promise.resolve([]);
        }
        try {
            const [Stop, DirectionPoint, DirectionLine, RouteInfo] = yield loadArcGISJSAPIModules(['esri/rest/support/Stop', 'esri/rest/support/DirectionPoint', 'esri/rest/support/DirectionLine', 'esri/rest/support/RouteInfo']);
            return [
                {
                    id: getStopOutputDsId(widgetId),
                    label: translate('outputStops'),
                    type: DataSourceTypes.FeatureLayer,
                    isOutputFromWidget: true,
                    geometryType: 'esriGeometryPoint',
                    schema: {
                        idField: ((_a = Stop.fields.find(f => f.type === 'esriFieldTypeOID')) === null || _a === void 0 ? void 0 : _a.name) || '__OBJECTID',
                        fields: Object.assign({}, convertJSAPIFieldsToJimuFields(Stop.fields))
                    }
                },
                {
                    id: getDirectionPointOutputDsId(widgetId),
                    label: translate('outputDirectionPoints'),
                    type: DataSourceTypes.FeatureLayer,
                    isOutputFromWidget: true,
                    geometryType: 'esriGeometryPoint',
                    schema: {
                        idField: ((_b = DirectionPoint.fields.find(f => f.type === 'esriFieldTypeOID')) === null || _b === void 0 ? void 0 : _b.name) || '__OBJECTID',
                        fields: Object.assign({}, convertJSAPIFieldsToJimuFields(DirectionPoint.fields))
                    }
                },
                {
                    id: getDirectionLineOutputDsId(widgetId),
                    label: translate('outputDirectionLines'),
                    type: DataSourceTypes.FeatureLayer,
                    isOutputFromWidget: true,
                    geometryType: 'esriGeometryPolyline',
                    schema: {
                        idField: ((_c = DirectionLine.fields.find(f => f.type === 'esriFieldTypeOID')) === null || _c === void 0 ? void 0 : _c.name) || '__OBJECTID',
                        fields: Object.assign({}, convertJSAPIFieldsToJimuFields(DirectionLine.fields))
                    }
                },
                {
                    id: getRouteOutputDsId(widgetId),
                    label: translate('outputRoute'),
                    type: DataSourceTypes.FeatureLayer,
                    isOutputFromWidget: true,
                    geometryType: 'esriGeometryPolyline',
                    schema: {
                        idField: ((_d = RouteInfo.fields.find(f => f.type === 'esriFieldTypeOID')) === null || _d === void 0 ? void 0 : _d.name) || '__OBJECTID',
                        fields: Object.assign({}, convertJSAPIFieldsToJimuFields(RouteInfo.fields))
                    }
                }
            ];
        }
        catch (err) {
            console.warn('Failed to create output data source in directions widget. ', err);
            return Promise.resolve([]);
        }
    });
}
function getUsedUtilities(routeUtility, searchUtilities) {
    return [routeUtility].concat(searchUtilities).filter(u => !!u);
}
//# sourceMappingURL=setting.js.map