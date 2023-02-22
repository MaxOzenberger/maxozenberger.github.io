/** @jsx jsx */
import { React, css, jsx, polished, Immutable, MessageType, getAppStore, CONSTANTS, AllDataSourceTypes } from 'jimu-core';
import { SettingSection } from 'jimu-ui/advanced/setting-components';
//import { ArcGISDataSourceTypes } from 'jimu-arcgis'
import { DataSourceSelector, DEFAULT_DATA_VIEW_ID } from 'jimu-ui/advanced/data-source-selector';
import defaultMessages from '../setting/translations/default';
import { withTheme } from 'jimu-theme';
import { checkOutActionConfig, getUseDataSourceInfo, getDsByWidgetId } from './action-utils';
const DSSelectorTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer]);
class _PanToActionSetting extends React.PureComponent {
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
        this.handleTriggerLayerChange = (useDataSources) => {
            if (useDataSources && useDataSources.length > 0) {
                this.handleTriggerLayerSelected(useDataSources);
            }
            else {
                this.handleRemoveLayerForTriggerLayer();
            }
        };
        this.handleTriggerLayerSelected = (currentSelectedDs) => {
            const messageWidgetUseDataSources = getDsByWidgetId(this.props.messageWidgetId, this.props.messageType);
            // supports data view
            let finalSelectedDs;
            if (this.checkIsDisableDataView()) {
                finalSelectedDs = currentSelectedDs;
            }
            else {
                finalSelectedDs = messageWidgetUseDataSources.filter(messageWidgetUseDataSource => {
                    const dataSource = currentSelectedDs.find(ds => {
                        var _a;
                        if ((!ds.dataViewId || ds.dataViewId === CONSTANTS.OUTPUT_DATA_VIEW_ID) && !((_a = this.props.config.useDataSources) === null || _a === void 0 ? void 0 : _a.find(preDs => ds.mainDataSourceId === preDs.mainDataSourceId))) {
                            // select ds from ds list
                            return ds.mainDataSourceId === messageWidgetUseDataSource.mainDataSourceId;
                        }
                        else {
                            // select ds from data view check box
                            return ds.dataSourceId === messageWidgetUseDataSource.dataSourceId;
                        }
                    });
                    if (dataSource) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
            let config = this.props.config.set('useDataSource', finalSelectedDs[0]);
            // supports multiple trigger
            config = config.set('useDataSources', finalSelectedDs);
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: config
            });
        };
        this.handleRemoveLayerForTriggerLayer = () => {
            let config = this.props.config.set('useDataSource', null);
            // supports multiple trigger
            config = config.set('useDataSources', []);
            this.props.onSettingChange({
                actionId: this.props.actionId,
                config: config
            });
        };
        this.checkIsSupportMultipleTriggerDataSources = (widgetId) => {
            var _a, _b, _c, _d;
            const appConfig = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
            const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[widgetId];
            const messageWidgetUseDataSources = getDsByWidgetId(this.props.messageWidgetId, this.props.messageType);
            const widgetLabel = (_d = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.manifest) === null || _d === void 0 ? void 0 : _d.label;
            if (widgetLabel === 'Map') {
                return true;
            }
            else {
                if (messageWidgetUseDataSources.length > 1) {
                    return this.props.messageType === MessageType.DataSourceFilterChange || this.props.messageType === MessageType.DataRecordsSelectionChange;
                }
                else {
                    return false;
                }
            }
        };
        this.checkIsDisableDataView = () => {
            if (this.props.messageType === MessageType.DataRecordsSelectionChange) {
                return true;
            }
            else {
                return false;
            }
        };
        this.modalStyle.borderRight = '1px solid black';
        this.modalStyle.borderBottom = '1px solid black';
        this.state = {
            isShowLayerList: false
        };
    }
    componentDidMount() {
        //const initConfig = this.getInitConfig()
        const initConfig = checkOutActionConfig(this.props.config, this.props.messageWidgetId, this.props.messageType);
        let config = this.props.config.set('useDataSource', initConfig.useDataSource);
        config = config.set('useDataSources', initConfig.useDataSources);
        this.props.onSettingChange({
            actionId: this.props.actionId,
            config: config
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
    `;
    }
    render() {
        //const triggerRootIds = this.getDsRootIdsByWidgetId(this.props.messageWidgetId)
        const triggerDsSelectorSourceData = getUseDataSourceInfo(this.props.messageWidgetId, this.props.config.useDataSource, this.props.config.useDataSources, this.props.messageType);
        let useDataSources;
        if (this.checkIsSupportMultipleTriggerDataSources(this.props.messageWidgetId) || triggerDsSelectorSourceData.useDataSources) {
            useDataSources = Immutable(triggerDsSelectorSourceData.useDataSources);
        }
        else {
            useDataSources = triggerDsSelectorSourceData.useDataSource ? Immutable([triggerDsSelectorSourceData.useDataSource]) : Immutable([]);
        }
        return (jsx("div", { css: this.getStyle(this.props.theme) },
            jsx(SettingSection, { title: this.props.intl.formatMessage({ id: 'mapAction_TriggerLayer', defaultMessage: defaultMessages.mapAction_TriggerLayer }) },
                jsx(DataSourceSelector, { types: DSSelectorTypes, useDataSources: useDataSources, fromRootDsIds: triggerDsSelectorSourceData.fromRootDsIds, fromDsIds: triggerDsSelectorSourceData.fromDsIds, hideAddDataButton: true, hideTypeDropdown: true, mustUseDataSource: true, onChange: this.handleTriggerLayerChange, widgetId: this.props.messageWidgetId, disableDataView: false, 
                    //hideDataView={this.checkIsDisableDataView()}
                    hideDataView: ((dataViewJson, mainDataSourceId) => {
                        const messageWidgetUseDataSources = getDsByWidgetId(this.props.messageWidgetId, this.props.messageType);
                        return !messageWidgetUseDataSources.filter(messageWidgetUseDataSource => {
                            return messageWidgetUseDataSource.mainDataSourceId === mainDataSourceId;
                        }).find(messageWidgetUseDataSource => {
                            let messageWidgetUseDataSourceDataViewId;
                            if (messageWidgetUseDataSource.dataViewId) {
                                messageWidgetUseDataSourceDataViewId = messageWidgetUseDataSource.dataViewId;
                            }
                            else {
                                messageWidgetUseDataSourceDataViewId = DEFAULT_DATA_VIEW_ID;
                            }
                            return messageWidgetUseDataSourceDataViewId === dataViewJson.id;
                        });
                    }), isMultiple: this.checkIsSupportMultipleTriggerDataSources(this.props.messageWidgetId), isMultipleDataView: true, hideCreateViewButton: true, enableToSelectOutputDsFromSelf: true }))));
    }
}
_PanToActionSetting.defaultProps = {
    config: Immutable({
        useDataSource: null
    })
};
export default withTheme(_PanToActionSetting);
//# sourceMappingURL=pan-to-action-setting.js.map