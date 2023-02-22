/** @jsx jsx */
import { React, css, jsx, getAppStore, Immutable, SqlExpressionMode, DataSourceComponent, dataSourceUtils, DataSourceManager, MessageType, AllDataSourceTypes, polished /*, ReactRedux, IMState */ } from 'jimu-core';
import { Button, Icon, Switch } from 'jimu-ui';
import { ArcGISDataSourceTypes, DataSourceTypes } from 'jimu-arcgis';
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder';
import defaultMessages from '../setting/translations/default';
import { Fragment } from 'react';
import { withTheme } from 'jimu-theme';
import { FieldSelector, DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
const DSSelectorTypes = Immutable([AllDataSourceTypes.FeatureLayer]);
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
        this.formatMessage = (id, values) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }, values);
        };
        this.openChooseLayerList = (currentLayerType) => {
            this.setState({
                isShowLayerList: true,
                currentLayerType: currentLayerType
            });
        };
        this.closeChooseLayerList = () => {
            this.setState({
                isShowLayerList: false,
                currentLayerType: null
            });
        };
        this.getInitConfig = () => {
            const messageWidgetId = this.props.messageWidgetId;
            const config = getAppStore().getState().appStateInBuilder.appConfig;
            const messageWidgetJson = config.widgets[messageWidgetId];
            let messageUseDataSource = null;
            let actionUseDataSource = null;
            let enableQueryWithCurrentExtent = true;
            if (!this.props.config.messageUseDataSource) {
                if (messageWidgetJson &&
                    messageWidgetJson.useDataSources &&
                    messageWidgetJson.useDataSources[0] &&
                    messageWidgetJson.useDataSources.length === 1) {
                    const dsJson = config.dataSources[messageWidgetJson.useDataSources[0].dataSourceId];
                    if (dsJson &&
                        (dsJson.type === ArcGISDataSourceTypes.WebMap ||
                            dsJson.type === ArcGISDataSourceTypes.WebScene)) {
                        messageUseDataSource = null;
                    }
                    else {
                        messageUseDataSource = Immutable({
                            dataSourceId: messageWidgetJson.useDataSources[0].dataSourceId,
                            mainDataSourceId: messageWidgetJson.useDataSources[0].mainDataSourceId,
                            dataViewId: messageWidgetJson.useDataSources[0].dataViewId,
                            rootDataSourceId: messageWidgetJson.useDataSources[0].rootDataSourceId
                        });
                    }
                }
            }
            else {
                messageUseDataSource = this.checkAndGetInitUseDataSource(messageWidgetId, this.props.config.messageUseDataSource);
            }
            if (this.props.config.enableQueryWithCurrentExtent !== undefined) {
                enableQueryWithCurrentExtent = this.props.config
                    .enableQueryWithCurrentExtent;
            }
            const actionWidgetId = this.props.widgetId;
            const actionWidgetJson = config.widgets[actionWidgetId];
            if (actionWidgetJson &&
                actionWidgetJson.useDataSources &&
                actionWidgetJson.useDataSources[0] &&
                actionWidgetJson.useDataSources.length === 1) {
                actionUseDataSource = {
                    dataSourceId: actionWidgetJson.useDataSources[0].dataSourceId,
                    mainDataSourceId: actionWidgetJson.useDataSources[0].mainDataSourceId,
                    dataViewId: actionWidgetJson.useDataSources[0].dataViewId,
                    rootDataSourceId: actionWidgetJson.useDataSources[0].rootDataSourceId
                };
            }
            let sqlExprObj = null;
            const oldActionUseDataSource = this.props.config.actionUseDataSource;
            if (oldActionUseDataSource) {
                if (actionUseDataSource) {
                    if (oldActionUseDataSource.dataSourceId ===
                        actionUseDataSource.dataSourceId &&
                        oldActionUseDataSource.rootDataSourceId ===
                            actionUseDataSource.rootDataSourceId) {
                        actionUseDataSource = oldActionUseDataSource.asMutable({ deep: true });
                        sqlExprObj = this.props.config.sqlExprObj;
                    }
                }
            }
            return this.props.config
                .set('messageUseDataSource', messageUseDataSource)
                .set('actionUseDataSource', actionUseDataSource)
                .set('enableQueryWithCurrentExtent', enableQueryWithCurrentExtent)
                .set('sqlExprObj', sqlExprObj);
        };
        this.checkAndGetInitUseDataSource = (widgetId, oldUseDataSource) => {
            const config = getAppStore().getState().appStateInBuilder.appConfig;
            const widgetJson = config.widgets[widgetId];
            let initUseDataSource = null;
            let isMapDs = false;
            const dsId = widgetJson.useDataSources &&
                widgetJson.useDataSources[0] &&
                widgetJson.useDataSources[0].dataSourceId;
            if (!dsId) {
                return null;
            }
            const dsJson = config.dataSources[dsId];
            if (dsJson &&
                (dsJson.type === ArcGISDataSourceTypes.WebMap ||
                    dsJson.type === ArcGISDataSourceTypes.WebScene)) {
                isMapDs = true;
            }
            if (isMapDs) {
                // webmap or webscene ds
                let isUseOldDs = false;
                if (widgetJson && widgetJson.useDataSources) {
                    for (let i = 0; i < widgetJson.useDataSources.length; i++) {
                        if (widgetJson.useDataSources[i].dataSourceId ===
                            oldUseDataSource.rootDataSourceId) {
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
                if (widgetJson && widgetJson.useDataSources) {
                    for (let i = 0; i < widgetJson.useDataSources.length; i++) {
                        if (widgetJson.useDataSources[i].dataSourceId ===
                            oldUseDataSource.dataSourceId) {
                            isUseOldDs = true;
                            break;
                        }
                    }
                }
                if (isUseOldDs) {
                    initUseDataSource = oldUseDataSource;
                }
                else {
                    if (widgetJson &&
                        widgetJson.useDataSources &&
                        widgetJson.useDataSources.length === 1) {
                        initUseDataSource = Immutable({
                            dataSourceId: widgetJson.useDataSources[0].dataSourceId,
                            mainDataSourceId: widgetJson.useDataSources[0].mainDataSourceId,
                            dataViewId: widgetJson.useDataSources[0].dataViewId,
                            rootDataSourceId: widgetJson.useDataSources[0].rootDataSourceId
                        });
                    }
                    else {
                        initUseDataSource = null;
                    }
                }
            }
            return initUseDataSource;
        };
        this.checkIsShowSetData = (widgetId) => {
            const config = getAppStore().getState().appStateInBuilder.appConfig;
            const widgetJson = config.widgets[widgetId];
            if (widgetJson &&
                widgetJson.useDataSources &&
                widgetJson.useDataSources[0] &&
                widgetJson.useDataSources.length === 1) {
                const dsJson = config.dataSources[widgetJson.useDataSources[0].dataSourceId];
                if (dsJson &&
                    (dsJson.type === ArcGISDataSourceTypes.WebMap ||
                        dsJson.type === ArcGISDataSourceTypes.WebScene)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };
        this.getTriggerDsIds = () => {
            const { messageWidgetId } = this.props;
            return this._getDsIdsByWidgetId(messageWidgetId);
        };
        this.getTriggerDsRootIds = () => {
            const { messageWidgetId } = this.props;
            return this._getDsRootIdsByWidgetId(messageWidgetId);
        };
        this.getActionDsIds = () => {
            const { widgetId } = this.props;
            const ids = this._getDsIdsByWidgetId(widgetId);
            return ids;
        };
        this._getDsIdsByWidgetId = (wId) => {
            var _a, _b, _c, _d, _e;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[wId];
            return Immutable((_e = (_d = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSources) === null || _d === void 0 ? void 0 : _d.map((useDS) => useDS.dataSourceId)) !== null && _e !== void 0 ? _e : []);
        };
        this._getDsRootIdsByWidgetId = (wId) => {
            var _a, _b, _c, _d;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[wId];
            const rootIds = [];
            const dsM = DataSourceManager.getInstance();
            (_d = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.useDataSources) === null || _d === void 0 ? void 0 : _d.forEach((useDS) => {
                const ds = dsM.getDataSource(useDS.dataSourceId);
                if ((ds === null || ds === void 0 ? void 0 : ds.type) === DataSourceTypes.WebMap ||
                    (ds === null || ds === void 0 ? void 0 : ds.type) === DataSourceTypes.WebScene) {
                    // is root ds
                    rootIds.push(useDS.dataSourceId);
                }
            });
            return rootIds.length > 0 ? Immutable(rootIds) : undefined;
        };
        this.handleTriggerLayerChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.handleTriggerLayerSelected(useDataSources[0]);
            }
            else {
                this.handleRemoveLayerItemForTriggerLayer();
            }
        };
        this.handleActionLayerChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.handleActionLayerSelected(useDataSources[0]);
            }
            else {
                this.handleRemoveLayerItemForActionLayer();
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
                config: this.props.config.set('actionUseDataSource', currentSelectedDs)
            });
        };
        this.handleRemoveLayerItemForTriggerLayer = () => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('messageUseDataSource', null)
            });
        };
        this.handleRemoveLayerItemForActionLayer = () => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('actionUseDataSource', null)
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
                    mainDataSourceId: this.props.config.messageUseDataSource
                        .mainDataSourceId,
                    dataViewId: this.props.config.messageUseDataSource.dataViewId,
                    rootDataSourceId: this.props.config.messageUseDataSource
                        .rootDataSourceId,
                    fields: allSelectedFields.map(f => f.jimuName)
                })
            });
        };
        this.onActionFieldSelected = (allSelectedFields, ds) => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('actionUseDataSource', {
                    dataSourceId: this.props.config.actionUseDataSource.dataSourceId,
                    mainDataSourceId: this.props.config.actionUseDataSource
                        .mainDataSourceId,
                    dataViewId: this.props.config.actionUseDataSource.dataViewId,
                    rootDataSourceId: this.props.config.actionUseDataSource
                        .rootDataSourceId,
                    fields: allSelectedFields.map(f => f.jimuName)
                })
            });
        };
        this.swicthEnabledDataRelationShip = checked => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('enabledDataRelationShip', checked)
            });
        };
        this.swicthEnabledQueryWithCurrentExtent = checked => {
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: this.props.config.set('enableQueryWithCurrentExtent', checked)
            });
        };
        this.checkTrigerLayerIsSameToActionLayer = () => {
            if (this.props.config.messageUseDataSource &&
                this.props.config.actionUseDataSource) {
                if (this.props.config.messageUseDataSource.dataSourceId ===
                    this.props.config.actionUseDataSource.dataSourceId &&
                    this.props.config.messageUseDataSource.rootDataSourceId ===
                        this.props.config.actionUseDataSource.rootDataSourceId) {
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
            config: initConfig
        });
    }
    getStyle(theme) {
        return css `
      .equal-text {
        padding: ${polished.rem(4)} ${polished.rem(8)};
        background-color: ${theme.colors.palette.light[400]};
        color: ${theme.colors.palette.dark[600]};
        width: fit-content;
        height: auto;
        margin-top: ${polished.rem(10)};
        margin-bottom: ${polished.rem(10)};
      }

      .relate-text {
        color: ${theme.colors.palette.dark[800]};
      }

      .relate-panel-left {
        flex: auto;
        .action-select-chooser {
          margin-top: ${polished.rem(12)};
        }
      }

      .setting-header {
        padding: ${polished.rem(10)} ${polished.rem(16)} ${polished.rem(0)}
          ${polished.rem(16)};
      }

      .deleteIcon {
        cursor: pointer;
        opacity: 0.8;
      }

      .deleteIcon:hover {
        opacity: 1;
      }

      .sql-expr-display {
        width: 100%;
        height: auto;
        min-height: ${polished.rem(80)};
        line-height: 25px;
        color: ${theme.colors.palette.dark[400]};
        border: 1px solid ${theme.colors.palette.light[500]};
        padding: ${polished.rem(4)} ${polished.rem(6)};
      }

      .setting-header {
        padding: ${polished.rem(10)} ${polished.rem(16)} ${polished.rem(0)}
          ${polished.rem(16)};
      }
    `;
    }
    render() {
        var _a, _b;
        // const isShowSetDataForTriggerLayer = this.checkIsShowSetData(this.props.messageWidgetId);
        // const isShowSetDataForActionLayer = this.checkIsShowSetData(this.props.widgetId);
        const actionUseDataSourceInstance = this.props.config.actionUseDataSource &&
            DataSourceManager.getInstance().getDataSource(this.props.config.actionUseDataSource.dataSourceId);
        const { messageType, config, theme } = this.props;
        const messageDataSources = config.messageUseDataSource
            ? Immutable([config.messageUseDataSource])
            : Immutable([]);
        const actionDataSources = config.actionUseDataSource
            ? Immutable([config.actionUseDataSource])
            : Immutable([]);
        const isExtendChange = messageType === MessageType.ExtentChange;
        const triggerRootIds = this.getTriggerDsRootIds();
        return (jsx("div", { css: this.getStyle(this.props.theme) },
            !isExtendChange && (jsx(Fragment, null,
                jsx(SettingSection, { title: this.formatMessage('triggerLayer') },
                    jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: messageDataSources, fromRootDsIds: triggerRootIds, fromDsIds: triggerRootIds ? undefined : this.getTriggerDsIds(), closeDataSourceListOnChange: true, hideAddDataButton: true, hideTypeDropdown: true, mustUseDataSource: true, onChange: this.handleTriggerLayerChange, widgetId: this.props.messageWidgetId })),
                jsx(SettingSection, { title: this.formatMessage('actionLayer') },
                    jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: actionDataSources, fromDsIds: this.getActionDsIds(), closeDataSourceListOnChange: true, hideAddDataButton: true, hideTypeDropdown: true, disableRemove: () => true, mustUseDataSource: true, onChange: this.handleActionLayerChange, widgetId: this.props.widgetId })))),
            ((!!config.messageUseDataSource && !!config.actionUseDataSource) ||
                isExtendChange) && (jsx(Fragment, null,
                jsx(SettingSection, { title: this.formatMessage('conditions') },
                    isExtendChange && (jsx(SettingRow, { label: this.formatMessage('queryWithCurrentExtent') },
                        jsx(Switch, { checked: config.enableQueryWithCurrentExtent, onChange: evt => {
                                this.swicthEnabledQueryWithCurrentExtent(evt.target.checked);
                            } }))),
                    !isExtendChange && (jsx(SettingRow, { label: this.formatMessage('relateMessage') },
                        jsx(Switch, { checked: config.enabledDataRelationShip, onChange: evt => {
                                this.swicthEnabledDataRelationShip(evt.target.checked);
                            } }))),
                    !isExtendChange && this.props.config.enabledDataRelationShip && (jsx(SettingRow, { flow: 'wrap' },
                        this.checkTrigerLayerIsSameToActionLayer() && (jsx("div", { className: 'w-100 border p-1 mr-2' }, this.formatMessage('autoBind'))),
                        !this.checkTrigerLayerIsSameToActionLayer() && (jsx("div", { className: 'w-100 d-flex align-items-center' },
                            jsx("div", { className: 'd-flex flex-column relate-panel-left' },
                                jsx(FieldSelector, { className: 'w-100', useDataSources: Immutable([
                                        (_a = this.props.config.messageUseDataSource) === null || _a === void 0 ? void 0 : _a.asMutable({
                                            deep: true
                                        })
                                    ]), isDataSourceDropDownHidden: true, placeholder: this.formatMessage('triggerLayerField'), onChange: this.onMessageFieldSelected, useDropdown: true, isSearchInputHidden: true, selectedFields: this.props.config.messageUseDataSource &&
                                        this.props.config.messageUseDataSource.fields
                                        ? this.props.config.messageUseDataSource.fields
                                        : Immutable([]) }),
                                jsx(FieldSelector, { className: 'w-100 action-select-chooser', placeholder: this.formatMessage('actionLayerField'), useDataSources: Immutable([
                                        (_b = this.props.config.actionUseDataSource) === null || _b === void 0 ? void 0 : _b.asMutable({
                                            deep: true
                                        })
                                    ]), isDataSourceDropDownHidden: true, onChange: this.onActionFieldSelected, useDropdown: true, isSearchInputHidden: true, selectedFields: this.props.config.actionUseDataSource &&
                                        this.props.config.actionUseDataSource.fields
                                        ? this.props.config.actionUseDataSource.fields
                                        : Immutable([]) })),
                            jsx(Icon, { className: 'flex-none', width: 12, height: 40, color: theme.colors.dark[400], icon: require('jimu-ui/lib/icons/link-combined.svg') }))))),
                    jsx(SettingRow, { label: jsx(Button, { className: 'p-0', type: 'link', disabled: !this.props.config.actionUseDataSource, onClick: this.showSqlExprPopup }, this.formatMessage('moreConditions')) }),
                    jsx(SettingRow, null,
                        this.props.config.actionUseDataSource && (jsx(DataSourceComponent, { useDataSource: this.props.config.actionUseDataSource }, ds => {
                            return (jsx(SqlExpressionBuilderPopup, { dataSource: ds, mode: SqlExpressionMode.Simple, isOpen: this.state.isSqlExprShow, toggle: this.toggleSqlExprPopup, expression: this.props.config.sqlExprObj, onChange: sqlExprObj => {
                                    this.onSqlExprBuilderChange(sqlExprObj);
                                } }));
                        })),
                        jsx("div", { className: 'sql-expr-display body-1' }, this.props.config.sqlExprObj && actionUseDataSourceInstance
                            ? dataSourceUtils.getArcGISSQL(this.props.config.sqlExprObj, actionUseDataSourceInstance).displaySQL
                            : this.formatMessage('setExprTip'))))))));
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
// export default withTheme(ReactRedux.connect<StateProps, {}, ActionSettingProps<IMConfig> & ExtraProps>(
//   (state: IMState, props: ActionSettingProps<IMConfig> & ExtraProps) => {
//     const {widgetId} = props
//     const appConfig = state && state.appStateInBuilder && state.appStateInBuilder.appConfig;
//     if(!appConfig)return null;
//     let actionWidgetId = widgetId;
//     let actionWidgetJson = appConfig.widgets[actionWidgetId];
//     const useDS = actionWidgetJson && actionWidgetJson.useDataSources && actionWidgetJson.useDataSources[0]
//     return{
//       dataSourceId: useDS && useDS.dataSourceId,
//       rootDataSourceId: useDS && useDS.rootDataSourceId
//     }
//   }
// )(_FilterActionSetting));
export default withTheme(_FilterActionSetting);
//# sourceMappingURL=filter-action-setting.js.map