/** @jsx jsx */
import { React, jsx, css, Immutable, DataSourceManager, classNames, AllDataSourceTypes } from 'jimu-core';
import { hooks, TextInput, Switch } from 'jimu-ui';
import { IconPicker } from 'jimu-ui/advanced/resource-selector';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { QueryArrangeType } from '../config';
import { getOutputJsonOriginDs } from './setting-utils';
import { AttributeFilterSetting } from './attribute-filter';
import { SpatialFilterSetting } from './spatial-filter';
import { ResultsSetting } from './results';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
import { useDataSourceExists } from '../common/use-ds-exists';
const dsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
function createNewQueryItem(widgetId, useDataSource, outputJsonOriginDs) {
    const nextConfigId = `${Math.random()}`.slice(2);
    const queryItemLabel = outputJsonOriginDs === null || outputJsonOriginDs === void 0 ? void 0 : outputJsonOriginDs.getLabel();
    return Immutable({
        configId: nextConfigId,
        name: queryItemLabel,
        useDataSource: useDataSource,
        outputDataSourceId: `${widgetId}_output_${nextConfigId}`,
        spatialRelationUseDataSources: []
    });
}
export function QueryItemSettingMain(props) {
    var _a;
    const { index, total, arrangeType, widgetId, queryItem, onQueryItemAdded, onQueryItemChanged, handleStageChange, visible } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    const [itemLabel, setItemLabel] = React.useState('');
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const stageChangeTrigger = React.useRef();
    const useDataSources = currentItem.useDataSource != null ? Immutable([currentItem.useDataSource]) : undefined;
    const dsExists = useDataSourceExists({ widgetId, useDataSourceId: (_a = currentItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId });
    React.useEffect(() => {
        if ((queryItem === null || queryItem === void 0 ? void 0 : queryItem.name) && itemLabel !== queryItem.name) {
            setItemLabel(queryItem.name);
        }
        // eslint-disable-next-line
    }, [queryItem === null || queryItem === void 0 ? void 0 : queryItem.name]);
    React.useEffect(() => {
        if (visible && stageChangeTrigger.current) {
            stageChangeTrigger.current.focus();
        }
    }, [visible]);
    const handleStageChangeInSpatialFilter = React.useCallback((id, event) => {
        stageChangeTrigger.current = event.target;
        handleStageChange(id);
    }, [handleStageChange]);
    const handleUseDsChanged = (useDataSource) => {
        if (!useDataSource) {
            return;
        }
        DataSourceManager.getInstance()
            .createDataSourceByUseDataSource(Immutable(useDataSource))
            .then((originDs) => {
            const outputJsonOriginDs = getOutputJsonOriginDs(originDs);
            if (!outputJsonOriginDs)
                Promise.reject(Error(''));
            return outputJsonOriginDs;
        })
            .then((outputJsonOriginDs) => {
            if (queryItem == null) {
                const newItem = createNewQueryItem(widgetId, useDataSource, outputJsonOriginDs);
                onQueryItemAdded(newItem);
            }
            else {
                const newItem = queryItem.set('useDataSource', useDataSource).set('name', outputJsonOriginDs === null || outputJsonOriginDs === void 0 ? void 0 : outputJsonOriginDs.getLabel());
                onQueryItemChanged(index, newItem, true);
            }
        });
    };
    const updateProperty = React.useCallback((prop, value, dsUpdateRequired = false) => {
        let newItem;
        if (value == null) {
            newItem = queryItem.without(prop);
        }
        else {
            newItem = queryItem.set(prop, value);
        }
        onQueryItemChanged(index, newItem, dsUpdateRequired);
    }, [onQueryItemChanged, index, queryItem]);
    const updateItem = (newItem, dsUpdateRequired = false) => {
        onQueryItemChanged(index, newItem, dsUpdateRequired);
    };
    const handleLabelChange = React.useCallback((e) => setItemLabel(e.target.value), []);
    const handleLabelAccept = React.useCallback((value) => {
        if (value.trim().length > 0) {
            updateProperty('name', value, true);
        }
        else {
            setItemLabel(queryItem.name);
        }
    }, [queryItem === null || queryItem === void 0 ? void 0 : queryItem.name, updateProperty]);
    return (jsx("div", { className: classNames('h-100', { 'd-none': !visible }) },
        jsx("div", { css: css `height: 100%;overflow: auto;` },
            jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('data'), title: getI18nMessage('data'), className: 'pt-0' },
                jsx(SettingRow, null,
                    jsx(DataSourceSelector, { widgetId: widgetId, disableRemove: () => true, mustUseDataSource: true, closeDataSourceListOnChange: true, types: dsTypes, isMultiple: false, useDataSources: useDataSources, onChange: (useDataSources) => handleUseDsChanged(useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) }))),
            queryItem && dsExists && (jsx(React.Fragment, null,
                jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('label'), title: getI18nMessage('label') },
                    jsx(SettingRow, null,
                        jsx(TextInput, { "aria-label": getI18nMessage('label'), className: 'w-100', size: 'sm', value: itemLabel, onChange: handleLabelChange, onAcceptValue: handleLabelAccept })),
                    total < 2 && arrangeType !== QueryArrangeType.Inline && (jsx(SettingRow, { label: getI18nMessage('displayLabel') },
                        jsx(Switch, { "aria-label": getI18nMessage('displayLabel'), checked: currentItem.displayLabel, onChange: (e) => updateProperty('displayLabel', e.target.checked) })))),
                jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('icon') },
                    jsx(SettingRow, { label: getI18nMessage('icon'), truncateLabel: true },
                        jsx(IconPicker, { icon: currentItem.icon, onChange: (icon) => updateProperty('icon', icon), configurableOption: 'none', setButtonUseColor: false }))),
                jsx(AttributeFilterSetting, { queryItem: queryItem, onPropertyChanged: updateProperty, onQueryItemChanged: updateItem }),
                jsx(SpatialFilterSetting, { queryItem: queryItem, onPropertyChanged: updateProperty, handleStageChange: handleStageChangeInSpatialFilter }),
                jsx(ResultsSetting, { widgetId: widgetId, queryItem: queryItem, onPropertyChanged: updateProperty, onQueryItemChanged: updateItem }))))));
}
//# sourceMappingURL=query-item-main-mode.js.map