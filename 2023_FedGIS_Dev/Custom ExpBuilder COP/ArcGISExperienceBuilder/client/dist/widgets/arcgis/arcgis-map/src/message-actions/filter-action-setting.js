/** @jsx jsx */
import { React, css, jsx, polished, getAppStore, Immutable, DataSourceComponent, dataSourceUtils, DataSourceManager, MessageType, SqlExpressionMode, AllDataSourceTypes } from 'jimu-core';
import { Button, Icon, Switch, Collapse } from 'jimu-ui';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { FieldSelector, DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { ArcGISDataSourceTypes } from 'jimu-arcgis';
import { withTheme } from 'jimu-theme';
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder';
import defaultMessages from '../setting/translations/default';
import * as actionUtils from './action-utils';
const DSSelectorTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
class _FilterActionSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.modalStyle = {
            position: 'absolute',
            top: '0',
            bottom: '0',
            width: '259px',
            height: 'auto',
            borderRight: '',
            borderBottom: '',
            paddingBottom: '1px'
        };
        this.initOutputDataSources = (outputDataSources) => {
            var _a;
            const ds = (_a = outputDataSources === null || outputDataSources === void 0 ? void 0 : outputDataSources.map(dsId => {
                return {
                    dataSourceId: dsId,
                    mainDataSourceId: dsId,
                    rootDataSourceId: null
                };
            })) !== null && _a !== void 0 ? _a : [];
            return Immutable(ds);
        };
        this.getInitConfig = () => {
            const messageWidgetId = this.props.messageWidgetId;
            const config = getAppStore().getState().appStateInBuilder.appConfig;
            let messageUseDataSource = null;
            let actionUseDataSource = null;
            if (!this.props.config.messageUseDataSource) {
                const useDataSources = actionUtils.getDsByWidgetId(messageWidgetId, this.props.messageType);
                if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0]) && (useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) === 1) {
                    const dsJson = config.dataSources[useDataSources[0].dataSourceId];
                    if (dsJson && ((dsJson.type === ArcGISDataSourceTypes.WebMap) || (dsJson.type === ArcGISDataSourceTypes.WebScene))) {
                        messageUseDataSource = null;
                    }
                    else {
                        messageUseDataSource = Immutable({
                            dataSourceId: useDataSources[0].dataSourceId,
                            mainDataSourceId: useDataSources[0].mainDataSourceId,
                            dataViewId: useDataSources[0].dataViewId,
                            rootDataSourceId: useDataSources[0].rootDataSourceId
                        });
                    }
                }
            }
            else {
                messageUseDataSource = this.checkAndGetInitUseDataSource(this.props.messageWidgetId, this.props.config.messageUseDataSource);
            }
            const actionWidgetId = this.props.widgetId;
            const actionWidgetJson = config.widgets[actionWidgetId];
            if (!this.props.config.actionUseDataSource) {
                if (actionWidgetJson && actionWidgetJson.useDataSources && actionWidgetJson.useDataSources[0] && actionWidgetJson.useDataSources.length === 1) {
                    const dsJson = config.dataSources[actionWidgetJson.useDataSources[0].dataSourceId];
                    if (dsJson && ((dsJson.type === ArcGISDataSourceTypes.WebMap) || (dsJson.type === ArcGISDataSourceTypes.WebScene))) {
                        actionUseDataSource = null;
                    }
                    else {
                        actionUseDataSource = Immutable({
                            dataSourceId: actionWidgetJson.useDataSources[0].dataSourceId,
                            mainDataSourceId: actionWidgetJson.useDataSources[0].mainDataSourceId,
                            dataViewId: actionWidgetJson.useDataSources[0].dataViewId,
                            rootDataSourceId: actionWidgetJson.useDataSources[0].rootDataSourceId
                        });
                    }
                }
            }
            else {
                actionUseDataSource = this.checkAndGetInitUseDataSource(this.props.widgetId, this.props.config.actionUseDataSource);
            }
            const oldActionUseDataSourceId = this.props.config.actionUseDataSource && this.props.config.actionUseDataSource.dataSourceId;
            const newActionUseDataSourceId = actionUseDataSource && actionUseDataSource.dataSourceId;
            if (newActionUseDataSourceId !== oldActionUseDataSourceId) {
                return {
                    messageUseDataSource: messageUseDataSource,
                    actionUseDataSource: actionUseDataSource,
                    sqlExprObj: null
                };
            }
            else {
                return {
                    messageUseDataSource: messageUseDataSource,
                    actionUseDataSource: actionUseDataSource,
                    sqlExprObj: this.props.config.sqlExprObj
                };
            }
        };
        this.checkAndGetInitUseDataSource = (widgetId, oldUseDataSource) => {
            var _a, _b, _c, _d;
            const config = getAppStore().getState().appStateInBuilder.appConfig;
            let initUseDataSource = null;
            let isMapDs = false;
            const dsM = DataSourceManager.getInstance();
            const isoldUseDataSourceIsOutputDs = (_b = (_a = dsM.getDataSource(oldUseDataSource.dataSourceId)) === null || _a === void 0 ? void 0 : _a.getDataSourceJson()) === null || _b === void 0 ? void 0 : _b.isOutputFromWidget;
            const useDataSources = actionUtils.getDsByWidgetId(widgetId, this.props.messageType);
            const dsId = useDataSources && useDataSources[0] && useDataSources[0].dataSourceId;
            if (!dsId) {
                return null;
            }
            const dsJson = config.dataSources[dsId];
            if (dsJson && ((dsJson.type === ArcGISDataSourceTypes.WebMap) || (dsJson.type === ArcGISDataSourceTypes.WebScene))) {
                isMapDs = true;
            }
            if (isMapDs) {
                // webmap or webscene ds
                let isUseOldDs = false;
                if (useDataSources) {
                    for (let i = 0; i < useDataSources.length; i++) {
                        if (useDataSources[i].dataSourceId === oldUseDataSource.rootDataSourceId) {
                            isUseOldDs = true;
                            break;
                        }
                    }
                }
                if (isUseOldDs) {
                    initUseDataSource = oldUseDataSource;
                }
                else {
                    initUseDataSource = null;
                }
            }
            else {
                // featurelayer ds
                let isUseOldDs = false;
                if (useDataSources) {
                    for (let i = 0; i < useDataSources.length; i++) {
                        const oldUseDataSourceId = isoldUseDataSourceIsOutputDs ? oldUseDataSource === null || oldUseDataSource === void 0 ? void 0 : oldUseDataSource.mainDataSourceId : oldUseDataSource === null || oldUseDataSource === void 0 ? void 0 : oldUseDataSource.dataSourceId;
                        const currentUseDataSourceId = isoldUseDataSourceIsOutputDs ? (_c = useDataSources[i]) === null || _c === void 0 ? void 0 : _c.mainDataSourceId : (_d = useDataSources[i]) === null || _d === void 0 ? void 0 : _d.dataSourceId;
                        if (currentUseDataSourceId === oldUseDataSourceId) {
                            isUseOldDs = true;
                            break;
                        }
                    }
                }
                if (isUseOldDs) {
                    initUseDataSource = oldUseDataSource;
                }
                else {
                    if ((useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) === 1) {
                        initUseDataSource = Immutable({
                            dataSourceId: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0].dataSourceId,
                            mainDataSourceId: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0].mainDataSourceId,
                            dataViewId: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0].dataViewId,
                            rootDataSourceId: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0].rootDataSourceId
                        });
                    }
                    else {
                        initUseDataSource = null;
                    }
                }
            }
            return initUseDataSource;
        };
        this.handleTriggerLayerChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.handleTriggerLayerSelected(useDataSources[0]);
            }
            else {
                this.handleRemoveLayerForTriggerLayer();
            }
        };
        this.handleActionLayerChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.handleActionLayerSelected(useDataSources[0]);
            }
            else {
                this.handleRemoveLayerForActionLayer();
            }
        };
        this.handleTriggerLayerSelected = (currentSelectedDs) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('messageUseDataSource', currentSelectedDs)
            });
        };
        this.handleActionLayerSelected = (currentSelectedDs) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('actionUseDataSource', currentSelectedDs).set('sqlExprObj', null)
            });
        };
        this.handleRemoveLayerForTriggerLayer = () => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('messageUseDataSource', null)
            });
        };
        this.handleRemoveLayerForActionLayer = () => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('actionUseDataSource', null).set('sqlExprObj', null)
            });
        };
        this.showSqlExprPopup = () => {
            this.setState({ isSqlExprShow: true });
        };
        this.toggleSqlExprPopup = () => {
            this.setState({ isSqlExprShow: !this.state.isSqlExprShow });
        };
        this.onSqlExprBuilderChange = (sqlExprObj) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('sqlExprObj', sqlExprObj)
            });
        };
        this.onMessageFieldSelected = (allSelectedFields, ds) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('messageUseDataSource', {
                    dataSourceId: this.props.config.messageUseDataSource.dataSourceId,
                    mainDataSourceId: this.props.config.messageUseDataSource.mainDataSourceId,
                    dataViewId: this.props.config.messageUseDataSource.dataViewId,
                    rootDataSourceId: this.props.config.messageUseDataSource.rootDataSourceId,
                    fields: allSelectedFields.map(f => f.jimuName)
                })
            });
        };
        this.onActionFieldSelected = (allSelectedFields, ds) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('actionUseDataSource', {
                    dataSourceId: this.props.config.actionUseDataSource.dataSourceId,
                    mainDataSourceId: this.props.config.actionUseDataSource.mainDataSourceId,
                    dataViewId: this.props.config.actionUseDataSource.dataViewId,
                    rootDataSourceId: this.props.config.actionUseDataSource.rootDataSourceId,
                    fields: allSelectedFields.map(f => f.jimuName)
                })
            });
        };
        this.swicthEnabledDataRelationShip = (checked) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('enabledDataRelationShip', checked)
            });
        };
        this.checkTrigerLayerIsSameToActionLayer = () => {
            if (this.props.config.messageUseDataSource && this.props.config.actionUseDataSource) {
                if (this.props.config.messageUseDataSource.mainDataSourceId === this.props.config.actionUseDataSource.mainDataSourceId &&
                    this.props.config.messageUseDataSource.rootDataSourceId === this.props.config.actionUseDataSource.rootDataSourceId) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        this.getDsRootIdsByWidgetId = (wId) => {
            var _a, _b, _c, _d;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[wId];
            const rootIds = [];
            const dsM = DataSourceManager.getInstance();
            (_d = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSources) === null || _d === void 0 ? void 0 : _d.forEach((useDS) => {
                const ds = dsM.getDataSource(useDS.dataSourceId);
                if ((ds === null || ds === void 0 ? void 0 : ds.type) === ArcGISDataSourceTypes.WebMap || (ds === null || ds === void 0 ? void 0 : ds.type) === ArcGISDataSourceTypes.WebScene) { // is root ds
                    rootIds.push(useDS.dataSourceId);
                }
            });
            return rootIds.length > 0 ? Immutable(rootIds) : undefined;
        };
        this.getDsIdsByWidgetId = (wId) => {
            var _a;
            const useDataSources = actionUtils.getDsByWidgetId(wId, this.props.messageType);
            return Immutable((_a = useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.map((useDS) => useDS === null || useDS === void 0 ? void 0 : useDS.mainDataSourceId)) !== null && _a !== void 0 ? _a : []);
        };
        this.getDsSelectorSourceData = (widgetId, useDataSource) => {
            var _a, _b, _c;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[widgetId];
            const dsRootIds = this.getDsRootIdsByWidgetId(widgetId);
            const isReadOnly = actionUtils.checkIsOnlyOneDs(widgetJson, this.props.messageType, dsRootIds);
            const useDataSources = (useDataSource && useDataSource.dataSourceId)
                ? Immutable([useDataSource])
                : Immutable([]);
            const fromDsIds = dsRootIds ? undefined : this.getDsIdsByWidgetId(widgetId);
            const dsSelectorSource = {
                isReadOnly: isReadOnly,
                useDataSources: useDataSources,
                fromRootDsIds: dsRootIds,
                fromDsIds: fromDsIds
            };
            return dsSelectorSource;
        };
        this.checkIsDisableDataView = (widgetId) => {
            var _a, _b, _c, _d;
            if (this.props.messageType === MessageType.DataRecordsSelectionChange) {
                return true;
            }
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[widgetId];
            if (widgetJson) {
                const widgetLabel = (_d = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.manifest) === null || _d === void 0 ? void 0 : _d.label;
                if (widgetLabel === 'Map') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        this.modalStyle.borderRight = '1px solid black';
        this.modalStyle.borderBottom = '1px solid black';
        this.state = {
            isShowLayerList: false,
            currentLayerType: null,
            isSqlExprShow: false
        };
    }
    componentDidMount() {
        const initConfig = this.getInitConfig();
        this.props.onSettingChange({
            actionId: this.props.actionId,
            config: this.props.config.set('messageUseDataSource', initConfig.messageUseDataSource)
                .set('actionUseDataSource', initConfig.actionUseDataSource).set('sqlExprObj', initConfig.sqlExprObj)
        });
    }
    getStyle(theme) {
        return css `
      .setting-header {
        padding: ${polished.rem(10)} ${polished.rem(16)} ${polished.rem(0)} ${polished.rem(16)}
      }

      .deleteIcon {
        cursor: pointer;
        opacity: .8;
      }

      .deleteIcon:hover {
        opacity: 1;
      }

      .sql-expr-display {
        width: 100%;
        height: auto;
        min-height: 60px;
        line-height: 25px;
        padding: 3px 5px;
        color: ${theme.colors.palette.dark[300]};
        border: 1px solid ${theme.colors.palette.light[500]};
      }

      .relate-panel-left {
        flex: auto;
        .action-select-chooser {
          margin-top: ${polished.rem(12)};
        }
      }
    `;
    }
    render() {
        var _a, _b;
        const actionUseDataSourceInstance = this.props.config.actionUseDataSource &&
            DataSourceManager.getInstance().getDataSource(this.props.config.actionUseDataSource.dataSourceId);
        const { theme } = this.props;
        const triggerDsSelectorSourceData = this.getDsSelectorSourceData(this.props.messageWidgetId, this.props.config.messageUseDataSource);
        const actionDsSelectorSourceData = this.getDsSelectorSourceData(this.props.widgetId, this.props.config.actionUseDataSource);
        return (jsx("div", { css: this.getStyle(this.props.theme) },
            jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'mapAction_TriggerLayer', defaultMessage: defaultMessages.mapAction_TriggerLayer }) },
                jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: triggerDsSelectorSourceData.useDataSources, fromRootDsIds: triggerDsSelectorSourceData.fromRootDsIds, fromDsIds: triggerDsSelectorSourceData.fromDsIds, closeDataSourceListOnChange: true, disableRemove: () => triggerDsSelectorSourceData.isReadOnly, disableDataSourceList: triggerDsSelectorSourceData.isReadOnly, hideAddDataButton: true, hideTypeDropdown: true, mustUseDataSource: true, onChange: this.handleTriggerLayerChange, widgetId: this.props.messageWidgetId, disableDataView: true, hideDataView: this.checkIsDisableDataView(this.props.messageWidgetId), enableToSelectOutputDsFromSelf: true })),
            jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'mapAction_ActionLayer', defaultMessage: defaultMessages.mapAction_ActionLayer }) },
                jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: actionDsSelectorSourceData.useDataSources, fromRootDsIds: actionDsSelectorSourceData.fromRootDsIds, fromDsIds: actionDsSelectorSourceData.fromDsIds, closeDataSourceListOnChange: true, disableRemove: () => actionDsSelectorSourceData.isReadOnly, disableDataSourceList: actionDsSelectorSourceData.isReadOnly, hideAddDataButton: true, hideTypeDropdown: true, mustUseDataSource: true, onChange: this.handleActionLayerChange, widgetId: this.props.widgetId, hideDataView: true, enableToSelectOutputDsFromSelf: true })),
            this.props.config && this.props.config.messageUseDataSource && this.props.config.actionUseDataSource &&
                jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'mapAction_Conditions', defaultMessage: defaultMessages.mapAction_Conditions }) },
                    jsx(SettingRow, { label: this.props.intl.formatMessage({ id: 'mapAction_RelateMessage', defaultMessage: defaultMessages.mapAction_RelateMessage }) },
                        jsx(Switch, { checked: this.props.config.enabledDataRelationShip, onChange: evt => { this.swicthEnabledDataRelationShip(evt.target.checked); } })),
                    jsx(SettingRow, null,
                        jsx(Collapse, { isOpen: this.props.config.enabledDataRelationShip, className: 'w-100' },
                            this.checkTrigerLayerIsSameToActionLayer() &&
                                jsx("div", { className: 'w-100 border p-1 mr-2' }, this.props.intl.formatMessage({ id: 'mapAction_AutoBind', defaultMessage: defaultMessages.mapAction_AutoBind })),
                            !this.checkTrigerLayerIsSameToActionLayer() && jsx("div", { className: 'w-100 d-flex align-items-center' },
                                jsx("div", { className: 'd-flex flex-column relate-panel-left' },
                                    jsx(FieldSelector, { className: 'w-100', useDataSources: Immutable([(_a = this.props.config.messageUseDataSource) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })]), isDataSourceDropDownHidden: true, placeholder: this.props.intl.formatMessage({ id: 'mapAction_TriggerLayerField', defaultMessage: defaultMessages.mapAction_TriggerLayerField }), onChange: this.onMessageFieldSelected, useDropdown: true, isSearchInputHidden: true, selectedFields: this.props.config.messageUseDataSource && this.props.config.messageUseDataSource.fields
                                            ? this.props.config.messageUseDataSource.fields
                                            : Immutable([]) }),
                                    jsx(FieldSelector, { className: 'w-100 action-select-chooser', placeholder: this.props.intl.formatMessage({ id: 'mapAction_ActionLayerField', defaultMessage: defaultMessages.mapAction_ActionLayerField }), useDataSources: Immutable([(_b = this.props.config.actionUseDataSource) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true })]), isDataSourceDropDownHidden: true, onChange: this.onActionFieldSelected, useDropdown: true, isSearchInputHidden: true, selectedFields: this.props.config.actionUseDataSource && this.props.config.actionUseDataSource.fields
                                            ? this.props.config.actionUseDataSource.fields
                                            : Immutable([]) })),
                                jsx(Icon, { className: 'flex-none', width: 12, height: 40, color: theme.colors.dark[400], icon: require('jimu-ui/lib/icons/link-combined.svg') })))),
                    jsx(SettingRow, null,
                        jsx(Button, { type: 'link', disabled: !this.props.config.actionUseDataSource, className: 'w-100 d-flex justify-content-start', onClick: this.showSqlExprPopup },
                            jsx("div", { className: 'w-100 text-truncate', style: { textAlign: 'start' } }, this.props.intl.formatMessage({ id: 'mapAction_MoreConditions', defaultMessage: defaultMessages.mapAction_MoreConditions }))),
                        this.props.config.actionUseDataSource && jsx(DataSourceComponent, { useDataSource: this.props.config.actionUseDataSource }, (ds) => {
                            return (jsx(SqlExpressionBuilderPopup, { dataSource: ds, mode: SqlExpressionMode.Simple, isOpen: this.state.isSqlExprShow, toggle: this.toggleSqlExprPopup, expression: this.props.config.sqlExprObj, onChange: (sqlExprObj) => { this.onSqlExprBuilderChange(sqlExprObj); } }));
                        })),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'sql-expr-display' }, this.props.config.sqlExprObj && actionUseDataSourceInstance
                            ? dataSourceUtils.getArcGISSQL(this.props.config.sqlExprObj, actionUseDataSourceInstance).displaySQL
                            : this.props.intl.formatMessage({ id: 'mapAction_SetExpression', defaultMessage: defaultMessages.mapAction_SetExpression }))))));
    }
}
_FilterActionSetting.defaultProps = {
    config: Immutable({
        messageUseDataSource: null,
        actionUseDataSource: null,
        sqlExprObj: null,
        enabledDataRelationShip: true
    })
};
export default withTheme(_FilterActionSetting);
//# sourceMappingURL=filter-action-setting.js.map