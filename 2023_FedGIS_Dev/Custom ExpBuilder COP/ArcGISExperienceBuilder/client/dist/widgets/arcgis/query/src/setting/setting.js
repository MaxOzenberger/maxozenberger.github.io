/** @jsx jsx */
import { React, jsx, Immutable, DataSourceManager } from 'jimu-core';
import { getAppConfigAction } from 'jimu-for-builder';
import { DataSourceRemoveWarningPopup, DataSourceRemoveWaringReason, dataComponentsUtils } from 'jimu-ui/advanced/data-source-selector';
import { Select } from 'jimu-ui';
import { SettingRow, SettingSection, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import { PagingType, ListDirection, FieldsType } from '../config';
import defaultMessages from './translations/default';
import { createGetI18nMessage } from '../common/utils';
import { getOutputJsonOriginDs } from './setting-utils';
import { QueryItemList } from './query-item-list';
import { Arrangement } from './arrangement';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getI18nMessage = createGetI18nMessage({ intl: this.props.intl, defaultMessages });
        this.updateWidgetJson = (...args) => {
            const [changedWidgetJson, ...restArgs] = args;
            const widgetJson = Object.assign(Object.assign({ id: this.props.id }, changedWidgetJson));
            this.props.onSettingChange(widgetJson, ...restArgs);
        };
        this.updateConfigForOptions = (...setByKeyPairs) => {
            let allDataSources = null;
            const config = setByKeyPairs.reduce((config, [key, value, options]) => {
                if (key === 'queryItems' && (options === null || options === void 0 ? void 0 : options.dsUpdateRequired)) {
                    allDataSources = this.getAllDataSources(value);
                }
                return config.set(key, value);
            }, this.props.config);
            if (allDataSources) {
                this.updateWidgetJson({
                    config,
                    useDataSources: Object.values(allDataSources.useDataSourceMap)
                }, allDataSources.outputDataSources);
            }
            else {
                this.updateWidgetJson({ config });
            }
        };
        this.handleArrangeTypeChange = (arrangeType) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('arrangeType', arrangeType)
            });
        };
        this.handleArrangeWrapChange = (arrangeWrap) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('arrangeWrap', arrangeWrap)
            });
        };
        this.handleResultDirectionChange = (vertical) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('resultListDirection', vertical ? ListDirection.Vertical : ListDirection.Horizontal)
            });
        };
        this.handleResultPageStyleChange = (e) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('resultPagingStyle', e.target.value)
            });
        };
        this.tryRemoveQueryItem = (index) => {
            const queryItems = this.props.config.queryItems;
            const currentQueryItem = queryItems[index];
            const appConfig = getAppConfigAction().appConfig;
            const relatedWidgets = dataComponentsUtils.getWidgetsUsingDsOrItsDescendantDss(currentQueryItem.outputDataSourceId, appConfig.widgets);
            if (relatedWidgets.length === 0) {
                this.doRemoveQueryItem(index, true);
            }
            else {
                this.setState({
                    showRemoveQueryItemWarning: true,
                    indexOfQueryItemToRemove: index,
                    dsToRemove: currentQueryItem.outputDataSourceId
                });
            }
        };
        this.beforeRemovingDataSource = () => {
            this.doRemoveQueryItem(this.state.indexOfQueryItemToRemove);
        };
        this.doRemoveQueryItem = (index, dsUpdateRequired = false) => {
            const configOptions = { dsUpdateRequired };
            const queryItems = this.props.config.queryItems.asMutable({ deep: true });
            queryItems.splice(index, 1);
            this.updateConfigForOptions(['queryItems', queryItems, configOptions]);
        };
        this.afterRemovingDataSource = () => {
            this.setState({
                showRemoveQueryItemWarning: false,
                indexOfQueryItemToRemove: -1,
                dsToRemove: null
            });
        };
        this.addQueryItem = (queryItem) => {
            var _a, _b;
            this.updateQueryItem((_b = (_a = this.props.config.queryItems) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, queryItem, true);
        };
        this.updateQueryItem = (index, queryItem, dsUpdateRequired = false) => {
            var _a;
            let queryItems = (_a = this.props.config.queryItems) !== null && _a !== void 0 ? _a : Immutable([]);
            queryItems = Immutable.set(queryItems, index, queryItem);
            this.updateConfigForOptions(['queryItems', queryItems, { dsUpdateRequired }]);
        };
        this.reOrderQueryItems = (queryItems) => {
            this.updateConfigForOptions(['queryItems', queryItems]);
        };
        this.getAllDataSources = (queryItems) => {
            const dsUseFields = {};
            const dsMap = Immutable(queryItems)
                .asMutable({ deep: true })
                .reduce((currentDsMap, queryItem) => {
                var _a, _b;
                // add useDataSource
                // note: one data source may be used by multiple query items
                const sources = [queryItem.useDataSource, ...queryItem.spatialRelationUseDataSources];
                sources.forEach((useDs) => {
                    var _a, _b, _c, _d;
                    const dsId = useDs.dataSourceId;
                    currentDsMap.useDataSourceMap[dsId] = currentDsMap.useDataSourceMap[dsId] || useDs;
                    // const resultDisplayFields = useDs.
                    const sortOptions = (queryItem.sortOptions || []).filter((i) => i.jimuFieldName);
                    const sortFields = sortOptions.map((i) => i.jimuFieldName);
                    // fields used in resultTitleExpression
                    // extract fields from the value
                    const reg = /\{(\w*)\}/g;
                    const fields = (_a = queryItem.resultTitleExpression) === null || _a === void 0 ? void 0 : _a.match(reg);
                    const titleFields = [];
                    if ((fields === null || fields === void 0 ? void 0 : fields.length) > 0) {
                        const dataSource = DataSourceManager.getInstance().getDataSource(dsId);
                        const schemaFields = (_c = (_b = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSchema()) === null || _b === void 0 ? void 0 : _b.fields) !== null && _c !== void 0 ? _c : {};
                        fields.forEach(field => {
                            const fieldName = field.substring(1, field.length - 1);
                            if (schemaFields[fieldName]) {
                                titleFields.push(fieldName);
                            }
                        });
                    }
                    const alreadyUsedFields = (_d = dsUseFields[dsId]) !== null && _d !== void 0 ? _d : new Set();
                    currentDsMap.useDataSourceMap[dsId].fields = Array.from(new Set([
                        ...(Array.from(alreadyUsedFields)),
                        ...(useDs.fields || []),
                        ...(titleFields),
                        ...(queryItem.resultFieldsType === FieldsType.SelectAttributes && queryItem.resultDisplayFields ? queryItem.resultDisplayFields : []),
                        ...(sortFields)
                    ]));
                    dsUseFields[dsId] = currentDsMap.useDataSourceMap[dsId].fields;
                    if (queryItem.resultFieldsType !== FieldsType.SelectAttributes) {
                        currentDsMap.useDataSourceMap[dsId].useFieldsInPopupInfo = true;
                    }
                });
                // add outputDataSource
                const originDs = DataSourceManager.getInstance().getDataSource((_a = queryItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId);
                if (originDs) {
                    const originDataSourceJson = (_b = getOutputJsonOriginDs(originDs)) === null || _b === void 0 ? void 0 : _b.getDataSourceJson();
                    const outputDataSourceJson = {
                        id: queryItem.outputDataSourceId,
                        label: this.getI18nMessage('outputDsLabel', { values: { label: `${queryItem.name}` } }),
                        type: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.type,
                        geometryType: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.geometryType,
                        url: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.url,
                        itemId: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.itemId,
                        portalUrl: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.portalUrl,
                        originDataSources: [queryItem.useDataSource],
                        layerId: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.layerId,
                        isDataInDataSourceInstance: originDataSourceJson === null || originDataSourceJson === void 0 ? void 0 : originDataSourceJson.isDataInDataSourceInstance
                    };
                    currentDsMap.outputDataSources.push(outputDataSourceJson);
                }
                return currentDsMap;
            }, { useDataSourceMap: {}, outputDataSources: [] });
            return dsMap;
        };
        this.hideRemovePopup = () => {
            this.setState({ showRemoveQueryItemWarning: false });
        };
        this.state = {
            showRemoveQueryItemWarning: false,
            indexOfQueryItemToRemove: -1,
            dsToRemove: null
        };
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        const { config } = this.props;
        // use the first item's direction and paging style if they are not exist in the config
        let { resultListDirection, resultPagingStyle } = config;
        if (!resultListDirection) {
            resultListDirection = (_c = (_b = (_a = config.queryItems) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.resultListDirection) !== null && _c !== void 0 ? _c : ListDirection.Vertical;
        }
        if (!resultPagingStyle) {
            resultPagingStyle = (_f = (_e = (_d = config.queryItems) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.resultPagingStyle) !== null && _f !== void 0 ? _f : PagingType.MultiPage;
        }
        return (jsx("div", { className: 'setting-query h-100' },
            jsx("div", { className: 'jimu-widget-setting setting-query__setting-content' },
                jsx(QueryItemList, { widgetId: this.props.id, arrangeType: this.props.config.arrangeType, queryItems: this.props.config.queryItems, onNewQueryItemAdded: this.addQueryItem, onQueryItemRemoved: this.tryRemoveQueryItem, onQueryItemChanged: this.updateQueryItem, onOrderChanged: this.reOrderQueryItems }),
                this.props.config.queryItems.length > 0 && (jsx(Arrangement, { arrangeType: config.arrangeType, arrangeWrap: config.arrangeWrap, onArrangeTypeChanged: this.handleArrangeTypeChange, onArrangeWrapChanged: this.handleArrangeWrapChange })),
                this.props.config.queryItems.length > 0 && (jsx(SettingSection, { role: 'group', "aria-label": this.getI18nMessage('resultStyle'), title: this.getI18nMessage('resultStyle') },
                    jsx(SettingRow, { label: this.getI18nMessage('listDirection') },
                        jsx(DirectionSelector, { "aria-label": this.getI18nMessage('listDirection'), vertical: resultListDirection === ListDirection.Vertical, onChange: this.handleResultDirectionChange })),
                    jsx(SettingRow, { flow: 'wrap', label: this.getI18nMessage('pagingStyle') },
                        jsx(Select, { "aria-label": this.getI18nMessage('pagingStyle'), className: 'w-100', size: 'sm', value: resultPagingStyle, onChange: this.handleResultPageStyleChange },
                            jsx("option", { value: PagingType.MultiPage }, this.getI18nMessage('pagingStyle_MultiPage')),
                            jsx("option", { value: PagingType.LazyLoad }, this.getI18nMessage('pagingStyle_LazyLoad'))))))),
            jsx(DataSourceRemoveWarningPopup, { dataSourceId: this.state.dsToRemove, isOpen: this.state.showRemoveQueryItemWarning, toggle: this.hideRemovePopup, reason: DataSourceRemoveWaringReason.DataSourceRemoved, afterRemove: this.afterRemovingDataSource, beforeRemove: this.beforeRemovingDataSource })));
    }
}
//# sourceMappingURL=setting.js.map