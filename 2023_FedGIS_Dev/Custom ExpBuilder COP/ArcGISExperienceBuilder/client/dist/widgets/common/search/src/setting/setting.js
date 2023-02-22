/** @jsx jsx */
import { jsx, css } from 'jimu-core';
import { SearchDataSetting, SearchDataType } from 'jimu-ui/advanced/setting-components';
import { SearchServiceType } from '../config';
import SearchResultSetting from './component/search-setting-option';
const Setting = (props) => {
    const { config, id, portalUrl, onSettingChange, useDataSources } = props;
    const SYLE = css `
    .suggestion-setting-con  {
      padding-bottom: 0;
    }
  `;
    const onDataSettingChange = (datasourceConfig) => {
        if (!datasourceConfig)
            return false;
        const newConfig = config === null || config === void 0 ? void 0 : config.setIn(['datasourceConfig'], datasourceConfig);
        onSettingChange({ id, config: newConfig });
    };
    const createOutputDs = (outputDsJsonList, datasourceConfig) => {
        if (!datasourceConfig)
            return false;
        const newConfig = config === null || config === void 0 ? void 0 : config.setIn(['datasourceConfig'], datasourceConfig);
        onSettingChange({
            id,
            config: newConfig,
            useUtilities: getUseUtilities(newConfig)
        }, outputDsJsonList);
    };
    const getUseUtilities = (config) => {
        var _a;
        const useUtilities = [];
        (_a = config === null || config === void 0 ? void 0 : config.datasourceConfig) === null || _a === void 0 ? void 0 : _a.forEach(configItem => {
            if ((configItem === null || configItem === void 0 ? void 0 : configItem.searchServiceType) === SearchServiceType.GeocodeService) {
                useUtilities.push(configItem === null || configItem === void 0 ? void 0 : configItem.useUtility);
            }
        });
        return useUtilities;
    };
    return (jsx("div", { className: 'widget-setting-search jimu-widget-search', css: SYLE },
        jsx(SearchDataSetting, { id: id, portalUrl: portalUrl, useDataSources: useDataSources, createOutputDs: true, onSettingChange: onDataSettingChange, onOutputDsSettingChange: createOutputDs, datasourceConfig: config === null || config === void 0 ? void 0 : config.datasourceConfig, searchDataSettingType: SearchDataType.Both }),
        jsx(SearchResultSetting, { id: id, config: config, onSettingChange: onSettingChange, useDataSources: useDataSources })));
};
export default Setting;
//# sourceMappingURL=setting.js.map