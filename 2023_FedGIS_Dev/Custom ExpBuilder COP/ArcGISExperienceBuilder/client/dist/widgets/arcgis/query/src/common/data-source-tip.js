/** @jsx jsx */
import { React, jsx, getAppStore, DataSourceComponent, appConfigUtils, DataSourceStatus } from 'jimu-core';
import { Icon, hooks, Tooltip, Button } from 'jimu-ui';
import { EntityStatusType, StatusIndicator } from './common-components';
import iconWarning from 'jimu-icons/svg/outlined/suggested/warning.svg';
import iconError from 'jimu-icons/svg/outlined/suggested/wrong.svg';
import { useDataSourceExists } from './use-ds-exists';
/**
 * Show icon and message if the data source doesn't work.
 * @param props
 * @returns
 */
export function DataSourceTip(props) {
    var _a, _b, _c;
    const { widgetId, useDataSource, onStatusChange, onDataSourceCreated, showMessage = false } = props;
    const getI18nMessage = hooks.useTranslate();
    const dsExists = useDataSourceExists({ widgetId, useDataSourceId: useDataSource.dataSourceId });
    const [dsStatus, setDsStatus] = React.useState(null);
    const [dataSource, setDataSource] = React.useState(null);
    const handleDsInfoChange = React.useCallback((info) => {
        if (info) {
            const { status, instanceStatus } = info;
            if (instanceStatus === DataSourceStatus.NotCreated) {
                setDsStatus('creating');
                onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(false);
            }
            else if (instanceStatus === DataSourceStatus.CreateError || status === DataSourceStatus.LoadError) {
                setDsStatus('error');
                onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(false);
            }
            else if (status === DataSourceStatus.NotReady) {
                setDsStatus('warning');
                onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(false);
            }
            else {
                setDsStatus(null);
                onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(true);
            }
        }
    }, [onStatusChange]);
    const handleDsCreated = React.useCallback((ds) => {
        setDataSource(ds);
        onDataSourceCreated === null || onDataSourceCreated === void 0 ? void 0 : onDataSourceCreated(ds);
    }, [onDataSourceCreated]);
    const handleDsCreateFailed = React.useCallback(() => {
        setDataSource(null);
        setDsStatus('error');
        onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange(false);
    }, [onStatusChange]);
    let statusIcon;
    let statusMsg;
    let color;
    if (dsStatus === 'creating') {
        statusIcon = iconError;
        statusMsg = getI18nMessage('loading');
    }
    else if (!dsExists || dsStatus === 'error') {
        statusIcon = iconError;
        statusMsg = getI18nMessage('dataSourceCreateError');
        color = 'var(--danger-500)';
    }
    else if (dsStatus === 'warning') {
        const originDs = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getOriginDataSources()) === null || _a === void 0 ? void 0 : _a[0];
        const dsLabel = originDs === null || originDs === void 0 ? void 0 : originDs.getLabel();
        const widgetId = appConfigUtils.getWidgetIdByOutputDataSource(useDataSource);
        const appState = ((_b = window === null || window === void 0 ? void 0 : window.jimuConfig) === null || _b === void 0 ? void 0 : _b.isBuilder)
            ? getAppStore().getState().appStateInBuilder
            : getAppStore().getState();
        const widgetLabel = (_c = appState.appConfig.widgets[widgetId]) === null || _c === void 0 ? void 0 : _c.label;
        color = 'var(--warning-700)';
        statusIcon = iconWarning;
        statusMsg = getI18nMessage('outputDataIsNotGenerated', {
            outputDsLabel: dsLabel !== null && dsLabel !== void 0 ? dsLabel : '',
            sourceWidgetName: widgetLabel !== null && widgetLabel !== void 0 ? widgetLabel : ''
        });
    }
    return (jsx(React.Fragment, null,
        dsExists && (jsx(DataSourceComponent, { useDataSource: useDataSource, onDataSourceInfoChange: handleDsInfoChange, onDataSourceCreated: handleDsCreated, onCreateDataSourceFailed: handleDsCreateFailed })),
        dsStatus === 'creating' && jsx(StatusIndicator, { statusType: EntityStatusType.Loading, title: statusMsg }),
        (!dsExists || dsStatus === 'error' || dsStatus === 'warning') && (jsx("div", { className: 'd-flex align-items-center' },
            jsx(Tooltip, { title: statusMsg },
                jsx(Button, { size: 'sm', type: 'tertiary', icon: true },
                    jsx(Icon, { icon: statusIcon, color: color }))),
            showMessage && jsx("div", { className: 'status-message' }, statusMsg)))));
}
//# sourceMappingURL=data-source-tip.js.map