var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-prototype-builtins */
import { React, Immutable, css, DataSourceManager, defaultMessages as jimuCoreMessages, SessionManager, urlUtils, AllDataSourceTypes } from 'jimu-core';
import { BaseWidgetSetting } from 'jimu-for-builder';
import defaultMessages from './translations/default';
import { Select, Checkbox, Table, Button, Icon, TextInput, Popper, Tooltip, Alert, Switch, defaultMessages as jimuUIDefaultMessages, NumericInput } from 'jimu-ui';
import { SettingSection, SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import GDBVersionManager from '../runtime/branch-version-manager';
import './css/custom.css';
const closeIcon = require('jimu-ui/lib/icons/close.svg');
const upArrowIcon = require('jimu-ui/lib/icons/direction-up.svg');
const downArrowIcon = require('jimu-ui/lib/icons/direction-down.svg');
const appSortIcon = require('jimu-ui/lib/icons/app-sort.svg');
const infoIcon = require('jimu-ui/lib/icons/info.svg');
const helpIcon = require('jimu-ui/lib/icons/help.svg');
export default class Setting extends BaseWidgetSetting {
    constructor(props) {
        super(props);
        this.sidePopperTrigger = React.createRef();
        this.defaultVersion = 'sde.DEFAULT';
        this.vms = GDBVersionManager.getInstance();
        //vms = new GDBVersionManager();
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.fieldColumns = [
            { field: 'access', alias: this.formatMessage('fieldColumnsAccess'), show: true, sort: 'desc', order: 2, available: true },
            { field: 'commonAncestorDate', alias: this.formatMessage('fieldColumnsCommonAncestorDate'), show: false, sort: 'desc', order: 5, available: true },
            { field: 'creationDate', alias: this.formatMessage('fieldColumnsCreationDate'), show: false, sort: 'desc', order: 3, available: true },
            { field: 'description', alias: this.formatMessage('fieldColumnsDescription'), show: false, sort: 'desc', order: 4, available: true },
            { field: 'evaluationDate', alias: this.formatMessage('fieldColumnsEvaluationDate'), show: false, sort: 'desc', order: 6, available: true },
            { field: 'modifiedDate', alias: this.formatMessage('fieldColumnsModifiedDate'), show: true, sort: 'desc', order: 7, available: true },
            { field: 'previousAncestorDate', alias: this.formatMessage('fieldColumnsPreviousAncestorDate'), show: false, sort: 'desc', order: 8, available: true },
            { field: 'reconcileDate', alias: this.formatMessage('fieldColumnsReconcileDate'), show: false, sort: 'desc', order: 9, available: true },
            { field: 'versionGuid', alias: this.formatMessage('fieldColumnsVersionGuid'), show: false, sort: 'desc', order: 10, available: true },
            { field: 'versionId', alias: this.formatMessage('fieldColumnsVersionId'), show: false, sort: 'desc', order: 11, available: true },
            { field: 'versionName', alias: this.formatMessage('fieldColumnsVersionName'), show: true, sort: 'desc', order: 0, available: true },
            { field: 'versionOwner', alias: this.formatMessage('fieldColumnsVersionOwner'), show: true, sort: 'desc', order: 1, available: true }
        ];
        this.allowance = [
            { label: this.formatMessage('allowancesSwitch'), key: 'Switch', enabled: true },
            { label: this.formatMessage('allowancesCreateNew'), key: 'CreateNew', enabled: true },
            { label: this.formatMessage('allowancesDeleteExisting'), key: 'DeleteExisting', enabled: false },
            { label: this.formatMessage('allowancesUpdateName'), key: 'UpdateName', enabled: true },
            { label: this.formatMessage('allowancesUpdateDescription'), key: 'UpdateDescription', enabled: true },
            { label: this.formatMessage('allowancesChangeOwner'), key: 'ChangeOwner', enabled: false },
            { label: this.formatMessage('allowancesChangePrivileges'), key: 'ChangePrivileges', enabled: false },
            { label: this.formatMessage('allowancesAutoRefreshList'), key: 'AutoRefreshList', enabled: true, refreshInterval: 1 }
        ];
        this._updateServicesToConfig = (useDataSources) => {
            const immObj = Immutable(this.state.configObject);
            const localConfig = Immutable.asMutable(immObj, { deep: true });
            localConfig.services = Immutable.asMutable(Immutable(this.state.vmsServices), { deep: true });
            this.setState({ configObject: localConfig }, () => {
                if (!useDataSources) {
                    this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set('versionConfig', localConfig)
                    });
                }
                else {
                    this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set('versionConfig', localConfig),
                        useDataSources: useDataSources
                    });
                }
            });
        };
        this.updateConfigItem = (evt, node) => {
            const immObj = Immutable(this.state.vmsServices);
            const localService = Immutable.asMutable(immObj, { deep: true });
            localService.forEach((s) => {
                if (s.name === this.state.selectedService.name) {
                    s.configuredSettings[node] = (evt.hasOwnProperty('currentTarget')) ? evt.currentTarget.value : evt;
                }
            });
            this.setState({ vmsServices: localService }, () => {
                this._updateServicesToConfig();
            });
        };
        this.updateGeneralItem = (value, node) => {
            const localConfig = Object.assign({}, this.state.configObject);
            localConfig[node] = value;
            if (node === 'expandMode') {
                this.setState({ configObject: localConfig, expandMode: value }, () => {
                    this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set('versionConfig', localConfig)
                    });
                });
            }
            else {
                this.setState({ configObject: localConfig }, () => {
                    this.props.onSettingChange({
                        id: this.props.id,
                        config: this.props.config.set('versionConfig', localConfig)
                    });
                });
            }
        };
        this.updateArrangementItem = (node) => {
            const localConfig = Object.assign({}, this.state.configObject);
            localConfig.arrangement = node;
            this.setState({ configObject: localConfig, arrangementStyle: node }, () => {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('versionConfig', localConfig)
                });
            });
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            // something else you want to do
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled
            });
        };
        this._checkDSInfo = (useDataSources) => {
            const ds = DataSourceManager.getInstance();
            const dsList = ds.getDataSources();
            for (const key in dsList) {
                // eslint-disable-next-line
                if (dsList[key].type === 'FEATURE_SERVICE') {
                }
            }
        };
        this.arrangementHandler = (type) => {
            this.updateArrangementItem(type);
        };
        this.renderFieldOrderList = () => {
            //{field:'access', alias:'Access', show:true, sort:'desc', order:2},
            const fieldsList = [];
            let fieldsPart = [];
            if (Object.keys(this.state.selectedService).length > 0) {
                const immObj = Immutable(this.state.vmsServices);
                const localConfig = Immutable.asMutable(immObj, { deep: true });
                if (this.state.selectedService !== '') {
                    const activeService = localConfig.filter((v) => {
                        return v.name === this.state.selectedService.name;
                    });
                    if (activeService.length > 0) {
                        fieldsPart = activeService[0].configuredSettings.displayInfo;
                    }
                }
                fieldsPart.sort(this._compare('order', 'desc'));
                fieldsPart.forEach((ff) => {
                    for (const key in defaultMessages) {
                        if (key.toLowerCase() === ('fieldColumns' + ff.field).toLowerCase()) {
                            ff.alias = this.formatMessage(key);
                        }
                    }
                });
                fieldsPart.forEach((fld, i) => {
                    if (fld.available) {
                        fieldsList.push(React.createElement("tr", { key: fld.field },
                            React.createElement("td", { style: { fontSize: 'smaller' } }, fld.alias),
                            React.createElement("td", null,
                                React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                                    (i > 0)
                                        ? React.createElement(Button, { icon: true, type: "tertiary", size: "sm", onClick: () => { this.changeFieldOrder('up', i); } },
                                            React.createElement(Icon, { icon: upArrowIcon, size: "12", color: "#fff" }))
                                        : React.createElement(Button, { icon: true, type: "tertiary", size: "sm" }),
                                    (i < fieldsPart.length - 1)
                                        ? React.createElement(Button, { icon: true, type: "tertiary", size: "sm", onClick: () => { this.changeFieldOrder('down', i); } },
                                            React.createElement(Icon, { icon: downArrowIcon, size: "12", color: "#fff" }))
                                        : React.createElement(Button, { icon: true, type: "tertiary", size: "sm" })))));
                    }
                });
            }
            return (React.createElement(Table, { style: { height: '100%' } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: { fontSize: 'smaller' } }, this.formatMessage('field')),
                        React.createElement("th", { style: { fontSize: 'smaller' } }))),
                React.createElement("tbody", null, fieldsList)));
        };
        this.renderConfigSlideout = () => {
            var _a;
            const { theme } = this.props;
            let allowanceAllFlag = true;
            allowanceAllFlag = this._checkAllowAllState();
            return (React.createElement(SidePopper, { isOpen: this.state.showSidePanel, position: "right", toggle: () => { this.setState({ showSidePanel: !this.state.showSidePanel }); }, trigger: (_a = this.sidePopperTrigger) === null || _a === void 0 ? void 0 : _a.current },
                React.createElement("div", { style: { height: '100%', overflow: 'auto' } },
                    React.createElement("div", { style: { textAlign: 'right', width: '100%' } },
                        React.createElement(Button, { size: "sm", icon: true, type: "tertiary", className: "ml-2", onClick: () => { this.setState({ showSidePanel: false }); } },
                            React.createElement(Icon, { icon: closeIcon, size: "16" }))),
                    (this.state.selectedService.hasOwnProperty('name')) && this.renderVersionSelector(),
                    (this.state.arrangementStyle !== 'simple') ? (this.state.selectedService.hasOwnProperty('name')) && this.renderVersionInformation() : '',
                    (this.state.arrangementStyle !== 'simple')
                        ? (this.state.selectedService.hasOwnProperty('name')) &&
                            React.createElement(SettingSection, { className: "map-selector-section", title: React.createElement(React.Fragment, null,
                                    React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                                        React.createElement("div", { style: { display: 'flex', flex: 1 } }, this.formatMessage('settingsSectionsVersionCapability')),
                                        React.createElement(Tooltip, { title: this.formatMessage('settingsSectionsVersionCapabilityTooltip'), placement: "bottom" },
                                            React.createElement("div", null,
                                                React.createElement(Icon, { icon: infoIcon, size: "16", color: theme.colors.palette.dark[100] }))))) },
                                React.createElement(SettingRow, null,
                                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', flex: 1 } },
                                        React.createElement("div", { style: { paddingBottom: '5px', display: 'flex', flexDirection: 'row', flex: 1 } },
                                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 4, justifyContent: 'flex-end' } }),
                                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end' } }, this.formatMessage('settingsSectionsAllowCapability'))),
                                        React.createElement("div", { style: { paddingBottom: '5px', display: 'flex', flexDirection: 'row', flex: 1 } },
                                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 4, justifyContent: 'flex-end', paddingLeft: 5, paddingRight: 5, paddingBottom: 5 } }, this.formatMessage('settingsSectionsAllowAll')),
                                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end', borderBottom: '1px solid #ccc', paddingBottom: 5 } },
                                                React.createElement(Switch, { checked: allowanceAllFlag, onChange: (evt) => { this.updateAllowanceAction(null, evt.currentTarget.checked, true); } }))),
                                        this.renderAllowances('advance'))))
                        : React.createElement(SettingSection, null, this.renderAllowances('simple')))));
        };
        this._checkAllowAllState = () => {
            let status = true;
            const localConfig = Immutable(this.state.vmsServices);
            if (this.state.selectedService !== '') {
                const activeService = localConfig.filter((v) => {
                    return v.name === this.state.selectedService.name;
                });
                if (activeService.length > 0) {
                    const allowancePart = activeService[0].configuredSettings.allowance;
                    status = !allowancePart.some((allow) => {
                        return allow.enabled === false;
                    });
                }
            }
            return status;
        };
        this.renderAllowances = (mode) => {
            const list = [];
            let allowancePart = [];
            const localVms = Immutable(this.state.vmsServices);
            const localConfig = Immutable.asMutable(localVms, { deep: true });
            if (this.state.selectedService !== '') {
                const activeService = localConfig.filter((v) => {
                    return v.name === this.state.selectedService.name;
                });
                if (activeService.length > 0) {
                    allowancePart = activeService[0].configuredSettings.allowance;
                }
            }
            allowancePart.forEach((all) => {
                for (const key in defaultMessages) {
                    if (key.toLowerCase() === ('allowances' + all.key).toLowerCase()) {
                        all.label = this.formatMessage(key);
                    }
                }
            });
            allowancePart.forEach((al) => {
                if (mode === 'advance') {
                    list.push(React.createElement("div", { key: al.label, style: { paddingBottom: '5px', display: 'flex', flexDirection: 'row', flex: 1 } },
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 4 } }, al.label),
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end' } },
                            React.createElement(Switch, { checked: al.enabled, onChange: ((evt) => { this.updateAllowanceAction(al.key, evt.currentTarget.checked, false); }) }))));
                }
                else {
                    if (al.key === 'AutoRefreshList') {
                        list.push(React.createElement("div", { key: al.label, style: { paddingBottom: '5px', display: 'flex', flexDirection: 'row', flex: 1 } },
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 4 } }, al.label),
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end' } },
                                React.createElement(Switch, { checked: al.enabled, onChange: ((evt) => { this.updateAllowanceAction(al.key, evt.currentTarget.checked, false); }) }))));
                    }
                }
                if (al.key === 'AutoRefreshList') {
                    if (al.enabled) {
                        list.push(React.createElement("div", { key: 'refreshInterval', style: { paddingBottom: '5px', display: 'flex', flexDirection: 'row', flex: 1 } },
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', flex: 6 } }, this.formatMessage('settingsSectionsMinutes')),
                            React.createElement("div", { style: {
                                    textAlign: 'right',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flex: 1
                                } },
                                React.createElement(NumericInput, { style: { width: 75 }, value: this.state.intervalNumber, size: 'sm', min: 1, max: 999, type: 'number', onChange: (value) => {
                                        this.setState({ invalidInterval: true, intervalNumber: value }, () => {
                                            this.updateAllowanceInterval(al.key, value);
                                        });
                                    } }))));
                        list.push(React.createElement("div", { key: 'toolTipHolder', style: {
                                textAlign: 'right',
                                fontSize: '12px',
                                fontStyle: 'italic'
                            } }, this.formatMessage('settingsSectionsTooltipNumber')));
                    }
                }
            });
            return list;
        };
        this.updateAllowanceInterval = (key, value) => {
            if (this.state.selectedService !== '') {
                let allowancePart = [];
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v) => {
                    if (v.name === this.state.selectedService.name) {
                        allowancePart = v.configuredSettings.allowance;
                        allowancePart.forEach((allow) => {
                            if (allow.key === key) {
                                allow.refreshInterval = value;
                            }
                        });
                    }
                });
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this.updateAllowanceAction = (key, value, updateAll) => {
            if (this.state.selectedService !== '') {
                let allowancePart = [];
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v) => {
                    if (v.name === this.state.selectedService.name) {
                        allowancePart = v.configuredSettings.allowance;
                        allowancePart.forEach((allow) => {
                            if (updateAll) {
                                allow.enabled = value;
                            }
                            else {
                                if (allow.key === key) {
                                    allow.enabled = value;
                                }
                            }
                        });
                    }
                });
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this.updateActiveService = () => {
            if (this.state.selectedService !== '') {
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v) => {
                    if (v.name === this.state.selectedService.name) {
                        v.activeInBuilder = true;
                    }
                    else {
                        v.activeInBuilder = false;
                    }
                });
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this.renderServiceSelector = () => {
            const { theme } = this.props;
            const rows = [];
            const helpLink = 'https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/register-a-dataset-as-branch-versioned.htm';
            if (this.state.vmsServices.length > 0) {
                this.state.vmsServices.forEach((s, idx) => {
                    const tableRow = React.createElement("tr", { key: s.name, style: { borderLeft: (s.name === this.state.selectedService.name) ? 'solid #00aabb' : '' } },
                        (this.state.vmsServices.length > 1) &&
                            React.createElement("td", null,
                                (idx > 0) ? React.createElement(Button, { icon: true, type: "tertiary", size: "sm", onClick: () => { this.changeServiceOrder('up', idx); } },
                                    React.createElement(Icon, { icon: upArrowIcon, size: "12", color: "#fff" })) : '',
                                (idx < this.state.vmsServices.length - 1)
                                    ? React.createElement(Button, { icon: true, type: "tertiary", size: "sm", onClick: () => { this.changeServiceOrder('down', idx); } },
                                        React.createElement(Icon, { icon: downArrowIcon, size: "12", color: "#fff" }))
                                    : ''),
                        React.createElement("td", { role: 'button', style: { fontSize: 'smaller', width: '100%' }, onClick: () => { this.serviceSelectorAction(s); } }, s.name),
                        React.createElement("td", { role: 'button', style: { fontSize: 'smaller' }, onClick: () => { this.serviceRemoveAction(s); } },
                            React.createElement(Icon, { icon: closeIcon, size: "12" })));
                    rows.push(tableRow);
                });
            }
            return (React.createElement(SettingSection, { className: "map-selector-section", title: React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                        React.createElement(Tooltip, { title: this.formatMessage('settingsSectionsVersionService'), placement: "bottom" },
                            React.createElement("div", { style: { width: '100%', paddingRight: 20, overflow: 'hidden', textOverflow: 'ellipsis' } }, this.formatMessage('settingsSectionsVersionService'))),
                        React.createElement(Tooltip, { title: this.formatMessage('settingsSectionsVersionServiceHelp'), placement: "bottom" },
                            React.createElement("div", { onClick: () => { window.open(helpLink, '_blank'); }, style: { cursor: 'pointer' } },
                                React.createElement(Icon, { icon: helpIcon, size: "16", color: theme.colors.palette.dark[100] }))))) },
                React.createElement(SettingRow, null,
                    React.createElement(DataSourceSelector, { types: Immutable([AllDataSourceTypes.FeatureService, AllDataSourceTypes.MapService]), mustUseDataSource: true, isMultiple: true, useDataSourcesEnabled: this.props.useDataSourcesEnabled, onToggleUseDataEnabled: this.onToggleUseDataEnabled, onChange: this.validateVMSExist, widgetId: this.props.id, closeDataSourceListOnChange: true })),
                React.createElement(SettingRow, null,
                    React.createElement(Alert, { form: "basic", type: "warning", open: this.state.showAlert, closable: true, text: this.state.alertMessage, onClose: () => { this.setState({ showAlert: !this.state.showAlert }); } })),
                React.createElement(SettingRow, null,
                    React.createElement("div", { className: "w-100" },
                        React.createElement("div", { className: "component-map-selector", style: { maxHeight: 300, overflow: 'auto' }, ref: this.sidePopperTrigger },
                            React.createElement(Table, { size: "sm", hover: true, style: { fontSize: 'medium' } },
                                React.createElement("tbody", null, rows)))))));
        };
        this.validateVMSExist = (evt) => __awaiter(this, void 0, void 0, function* () {
            const ds = DataSourceManager.getInstance();
            const dsList = ds.getDataSources();
            let validVMS = false;
            let alreadyExist = false;
            for (const key in dsList) {
                if (key === evt[0].dataSourceId) {
                    //see if it is a VMS service
                    const dsJson = dsList[key].getDataSourceJson();
                    let trunURL = dsJson.url;
                    if (dsJson.url.includes('FeatureServer')) {
                        trunURL = dsJson.url.substring(0, dsJson.url.indexOf('FeatureServer'));
                    }
                    if (dsJson.url.includes('MapServer')) {
                        trunURL = dsJson.url.substring(0, dsJson.url.indexOf('MapServer'));
                    }
                    if (this.state.vmsServices.length > 0) {
                        const filtered = this.state.vmsServices.filter((v) => {
                            return v.name === dsList[key].getLabel() || v.url === trunURL;
                        });
                        if (filtered.length > 0) {
                            alreadyExist = true;
                        }
                    }
                    if (!alreadyExist) {
                        //get the session since it might be coming from a different host.  To pass a token to the VMS
                        const serviceToken = this.getServiceToken(trunURL);
                        let valid = false;
                        if (serviceToken !== null) {
                            valid = yield this.vms.checkValidVMS(trunURL, serviceToken);
                        }
                        else {
                            valid = yield this.vms.checkValidVMS(trunURL);
                        }
                        if (valid) {
                            validVMS = true;
                            const VMSObject = {};
                            const immObj = Immutable(this.state.vmsServices);
                            const localServices = Immutable.asMutable(immObj, { deep: true });
                            VMSObject.name = dsList[key].getLabel();
                            VMSObject.url = trunURL;
                            VMSObject.datasource = key;
                            VMSObject.activeInBuilder = true;
                            VMSObject.configuredSettings = {
                                startupVersion: this.defaultVersion,
                                startOnLoad: false,
                                allowance: Immutable.asMutable(Immutable(this.allowance), { deep: true }),
                                displayInfo: Immutable.asMutable(Immutable(this.fieldColumns), { deep: true })
                            };
                            localServices.forEach((v) => {
                                v.activeInBuilder = false;
                            });
                            localServices.push(VMSObject);
                            this.setState({ vmsServices: localServices, showAlert: false, alertMessage: '', selectedService: VMSObject, showSidePanel: true }, () => {
                                this._updateServicesToConfig(evt);
                                this.pullVersions(this.state.selectedService);
                                //this.serviceSelectorAction(VMSObject);
                            });
                        }
                    }
                }
            }
            if (alreadyExist) {
                this.setState({ showAlert: true, alertMessage: this.formatMessage('alertMessagesAlreadyAdded') });
            }
            else {
                if (!validVMS) {
                    this.setState({ showAlert: true, alertMessage: this.formatMessage('alertMessagesNotValid') });
                }
            }
        });
        this.serviceSelectorAction = (value) => {
            if (value !== '') {
                const vms = this.state.vmsServices.filter((v) => {
                    return v.name === value.name;
                });
                if (vms.length > 0) {
                    this.setState({
                        selectedService: vms[0],
                        showSidePanel: true,
                        intervalNumber: (vms[0].configuredSettings.allowance[7].refreshInterval),
                        searchVersionText: '',
                        showAlert: false
                    }, () => {
                        this.pullVersions(this.state.selectedService);
                        this.updateActiveService();
                    });
                }
            }
            else {
                this.setState({ selectedService: '', showSidePanel: false, intervalNumber: 1, invalidInterval: false, searchVersionText: '' });
            }
        };
        this.serviceRemoveAction = (value) => {
            if (value) {
                let pos = -1;
                let isSelected = false;
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v, i) => {
                    if (v.name === value.name) {
                        pos = i;
                        if (this.state.selectedService !== '') {
                            if (v.name === this.state.selectedService.name) {
                                isSelected = true;
                            }
                        }
                    }
                });
                if (pos !== -1) {
                    localVMS.splice(pos, 1);
                    if (isSelected) {
                        this.setState({ vmsServices: localVMS, selectedService: '', showSidePanel: false, searchVersionText: '' }, () => {
                            this._updateServicesToConfig();
                        });
                    }
                    else {
                        this.setState({ vmsServices: localVMS }, () => {
                            this._updateServicesToConfig();
                        });
                    }
                }
            }
        };
        this.renderVersionSelector = () => {
            let startVersion = this.defaultVersion;
            let defaultInService = null;
            const versionList = [];
            let found = false;
            // eslint-disable-next-line
            const savedStartUp = this.state.vmsServices.filter((v) => {
                if (this.state.selectedService !== '') {
                    if (v.name === this.state.selectedService.name) {
                        return v;
                    }
                }
            });
            if (savedStartUp.length > 0) {
                startVersion = savedStartUp[0].configuredSettings.startupVersion;
            }
            if (this.state.searchVersionText !== '') {
                if (this.state.filteredVersionList.length > 0) {
                    startVersion = this.state.filteredVersionList[0].versionGuid;
                }
            }
            this.state.filteredVersionList.forEach((v) => {
                if (v.versionName === this.defaultVersion) {
                    defaultInService = v.versionGuid;
                }
                if (startVersion === v.versionGuid) {
                    found = true;
                }
                if (this.state.searchVersionText === v.versionName) {
                    found = true;
                    startVersion = v.versionGuid;
                }
                versionList.push(React.createElement("option", { key: v.versionGuid, value: v.versionGuid }, v.versionName));
            });
            if (!found) {
                //if name of version is no longer found, switch it back to default.
                if (defaultInService !== null) {
                    startVersion = defaultInService;
                }
                else {
                    startVersion = this.defaultVersion;
                }
            }
            return (React.createElement(SettingSection, { className: "map-selector-section", title: this.formatMessage('settingsSectionsSelectVersion') },
                React.createElement(SettingRow, null,
                    React.createElement(TextInput, { type: "text", onChange: this.searchVersions, value: this.state.searchVersionText, placeholder: this.formatMessage('settingsSectionsSearchName'), style: { width: '100%' } })),
                React.createElement(SettingRow, null,
                    React.createElement(Select, { onChange: (evt) => { this.updateVersionSelected(evt.currentTarget); }, defaultValue: startVersion, value: startVersion }, versionList))));
        };
        this.updateVersionSelected = (e) => {
            const immObj = Immutable(this.state.vmsServices);
            const localVMS = Immutable.asMutable(immObj, { deep: true });
            localVMS.forEach((v, i) => {
                if (this.state.selectedService !== '') {
                    if (v.name === this.state.selectedService.name) {
                        v.configuredSettings.startupVersion = e.value;
                    }
                }
            });
            if (this.state.searchVersionText !== '') {
                this.setState({ vmsServices: localVMS, searchVersionText: e.textContent }, () => {
                    this._updateServicesToConfig();
                });
            }
            else {
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this.renderGeneralSection = () => {
            let defaultVal = 10;
            const localConfig = Object.assign({}, this.state.configObject);
            if (localConfig.hasOwnProperty('pageCounter')) {
                defaultVal = localConfig.pageCounter;
            }
            const pageValues = [
                React.createElement("option", { key: '5', value: 5 }, "5"),
                React.createElement("option", { key: '10', value: 10 }, "10"),
                React.createElement("option", { key: '25', value: 25 }, "25"),
                React.createElement("option", { key: '50', value: 50 }, "50")
            ];
            return (React.createElement(React.Fragment, null,
                React.createElement(SettingSection, { className: "map-selector-section", title: this.formatMessage('settingsSectionsGeneralSettings') },
                    React.createElement(SettingRow, null, this.formatMessage('settingsSectionsRecordsPage')),
                    React.createElement(SettingRow, null,
                        React.createElement(Select, { size: 'sm', onChange: (evt) => { this.updateGeneralItem(evt.currentTarget.value, 'pageCounter'); }, defaultValue: defaultVal }, pageValues))),
                React.createElement(SettingSection, { className: "map-selector-section", title: '' },
                    React.createElement(SettingRow, null, this.formatMessage('settingsSectionsExpandBasic')),
                    React.createElement(SettingRow, null,
                        React.createElement(Switch, { checked: this.state.expandMode, onChange: ((evt) => { this.updateGeneralItem(evt.currentTarget.checked, 'expandMode'); }) })))));
        };
        this.pullVersions = (service) => {
            let requestURL = service.url;
            if (service.url.indexOf('FeatureServer') >= 0) {
                requestURL = service.url.substring(0, service.url.indexOf('FeatureServer'));
            }
            if (service.url.indexOf('MapServer') >= 0) {
                requestURL = service.url.substring(0, service.url.indexOf('MapServer'));
            }
            let validToken = this.getServiceToken(requestURL);
            if (validToken === null) {
                validToken = undefined;
            }
            this.vms.getVersions(service.name, requestURL, validToken).then((result) => {
                if (result.hasOwnProperty('success')) {
                    if (result.success) {
                        if (result.hasOwnProperty('versions')) {
                            this.setState({ filteredVersionList: result.versions, allVersionList: result.versions });
                        }
                    }
                }
                else {
                    if (result.hasOwnProperty('error')) {
                        this.setState({ filteredVersionList: [], allVersionList: [] });
                    }
                }
            });
        };
        this.searchVersions = (value) => {
            const allVersions = [...this.state.allVersionList];
            const filtered = allVersions.filter((v) => {
                return (v.versionName).toLowerCase().indexOf((value.currentTarget.value).toLowerCase()) >= 0;
            });
            this.setState({ filteredVersionList: filtered, searchVersionText: value.currentTarget.value }, () => {
                if (this.state.filteredVersionList.length > 0) {
                    this.updateConfigItem(this.state.filteredVersionList[0].versionGuid, 'startupVersion');
                }
            });
        };
        this.renderVersionInformation = () => {
            const { theme } = this.props;
            const fieldList = [];
            let fieldsPart = [];
            const immObj = Immutable(this.state.vmsServices);
            const localConfig = Immutable.asMutable(immObj, { deep: true });
            if (this.state.selectedService !== '') {
                const activeService = localConfig.filter((v) => {
                    return v.name === this.state.selectedService.name;
                });
                if (activeService.length > 0) {
                    fieldsPart = activeService[0].configuredSettings.displayInfo;
                }
                if (fieldsPart.length > 0) {
                    const onlyOneShown = () => {
                        let result = false;
                        const shown = fieldsPart.filter((lf) => {
                            return lf.show === true;
                        });
                        if (shown.length <= 1) {
                            result = true;
                        }
                        return result;
                    };
                    const disableChk = onlyOneShown();
                    fieldsPart.sort(this._compare('order', 'desc'));
                    fieldsPart.forEach((ff) => {
                        for (const key in defaultMessages) {
                            if (key.toLowerCase() === ('fieldColumns' + ff.field).toLowerCase()) {
                                ff.alias = this.formatMessage(key);
                            }
                        }
                    });
                    fieldsPart.forEach((fld) => {
                        fieldList.push(React.createElement("tr", { key: fld.field },
                            React.createElement("td", { style: { fontSize: 12, textAlign: 'left' } }, fld.alias),
                            React.createElement("td", null,
                                React.createElement(Checkbox, { className: "mr-2 font-13", checked: fld.available, onChange: (evt) => { this.changeFieldVisiblity(evt.currentTarget.value, 'available', evt.currentTarget.checked); }, value: fld.field })),
                            React.createElement("td", null,
                                React.createElement(Checkbox, { className: "mr-2 font-13", checked: fld.show, disabled: (fld.show) ? disableChk : false, onChange: (evt) => { this.changeFieldVisiblity(evt.currentTarget.value, 'show', evt.currentTarget.checked); }, value: fld.field }))));
                    });
                }
            }
            return (React.createElement(SettingSection, { className: "map-selector-section", title: React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                        React.createElement("div", { style: { display: 'flex', flex: 1 } }, this.formatMessage('settingsSectionsVersionInfo')),
                        React.createElement(Tooltip, { title: this.formatMessage('settingsSectionsVersionInfoTooltip'), placement: "bottom" },
                            React.createElement("div", null,
                                React.createElement(Icon, { icon: infoIcon, size: "16", color: theme.colors.palette.dark[100] }))))) },
                React.createElement(SettingRow, null,
                    React.createElement("div", { className: "w-100" },
                        React.createElement("div", { className: "component-map-selector", style: { maxHeight: 250, overflow: 'auto' } },
                            React.createElement(Table, { size: "sm", hover: true, width: "90%", style: { textAlign: 'center' } },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", { style: { position: 'sticky', top: 0, backgroundColor: '#000', border: '#000', fontSize: 'smaller', whiteSpace: 'nowrap', alignItems: 'top', zIndex: 9999 } },
                                            React.createElement(Button, { type: "tertiary", onClick: (evt) => { this.toggleDialogAction('fieldMgmt', 'showFieldMgmt'); }, id: "btnFieldMgmt" },
                                                React.createElement(Icon, { icon: appSortIcon, size: "14", color: "#fff" }))),
                                        React.createElement("th", { style: { position: 'sticky', top: 0, backgroundColor: '#000', border: '#000', fontSize: 13, whiteSpace: 'nowrap', alignItems: 'center', zIndex: 9999 } }, this.formatMessage('fieldColumnsColumnAvailable')),
                                        React.createElement("th", { style: { position: 'sticky', top: 0, backgroundColor: '#000', border: '#000', fontSize: 13, whiteSpace: 'nowrap', alignItems: 'center', zIndex: 9999 } }, this.formatMessage('fieldColumnsColumnShow')))),
                                React.createElement("tbody", null, fieldList))))),
                React.createElement(Popper, { open: this.state.showFieldMgmt, floating: true, reference: 'btnFieldMgmt', placement: 'left', showArrow: false, onHeaderClose: () => { this.toggleDialogAction('fieldMgmt', 'showFieldMgmt'); }, toggle: () => { this.toggleDialogAction('fieldMgmt', 'showFieldMgmt'); }, defaultSize: { width: 250, height: 600 } },
                    React.createElement("div", { style: { width: 250, height: '100%', overflow: 'auto' } }, this.renderFieldOrderList()))));
        };
        this.changeFieldOrder = (direction, index) => {
            if (this.state.selectedService !== '') {
                let fieldsPart = [];
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v) => {
                    if (v.name === this.state.selectedService.name) {
                        fieldsPart = v.configuredSettings.displayInfo;
                        fieldsPart.sort(this._compare('order', 'desc'));
                        let newPos = index;
                        if (direction === 'up') {
                            newPos = newPos - 1;
                            fieldsPart[index].order = newPos;
                            fieldsPart[index - 1].order = index;
                        }
                        else {
                            newPos = newPos + 1;
                            fieldsPart[index].order = newPos;
                            fieldsPart[index + 1].order = index;
                        }
                    }
                });
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this.changeServiceOrder = (direction, index) => {
            const immObj = Immutable(this.state.vmsServices);
            const localVMS = Immutable.asMutable(immObj, { deep: true });
            const f = localVMS.splice(index, 1)[0];
            if (direction === 'up') {
                localVMS.splice(index - 1, 0, f);
            }
            else {
                localVMS.splice(index + 1, 0, f);
            }
            this.setState({ vmsServices: localVMS }, () => {
                this._updateServicesToConfig();
            });
        };
        this.changeFieldVisiblity = (updField, task, value) => {
            if (this.state.selectedService !== '') {
                let fieldsPart = [];
                const immObj = Immutable(this.state.vmsServices);
                const localVMS = Immutable.asMutable(immObj, { deep: true });
                localVMS.forEach((v) => {
                    if (v.name === this.state.selectedService.name) {
                        fieldsPart = v.configuredSettings.displayInfo;
                        fieldsPart.forEach((fld) => {
                            if (fld.field === updField) {
                                fld[task] = value;
                            }
                        });
                    }
                });
                this.setState({ vmsServices: localVMS }, () => {
                    this._updateServicesToConfig();
                });
            }
        };
        this._compare = (prop, direction) => {
            return function (a, b) {
                let comparison = 0;
                if (direction === 'desc') {
                    if (a[prop] > b[prop]) {
                        comparison = 1;
                    }
                    else if (a[prop] < b[prop]) {
                        comparison = -1;
                    }
                }
                else {
                    if (a[prop] < b[prop]) {
                        comparison = 1;
                    }
                    else if (a[prop] > b[prop]) {
                        comparison = -1;
                    }
                }
                return comparison;
            };
        };
        this.updateVMSInfo = (param, value) => {
            return new Promise((resolve, reject) => {
                const selectedCopy = Object.assign({}, this.state.selectedService);
                if (param === 'configured') {
                    selectedCopy[param] = value;
                }
                else {
                    selectedCopy.configuredSettings[param] = value;
                }
                this.setState({ selectedService: selectedCopy }, () => {
                    const vmsCopy = [...this.state.vmsServices];
                    vmsCopy.forEach((v) => {
                        if (v.name === this.state.selectedService.name) {
                            v = this.state.selectedService;
                        }
                    });
                    this.setState({ vmsServices: vmsCopy }, () => {
                        resolve(true);
                    });
                });
            });
        };
        this.getServiceToken = (url) => {
            const baseURL = urlUtils.getUrlHost(url.toLowerCase());
            const sessionManager = SessionManager.getInstance();
            const allSessions = sessionManager.getSessions();
            const foundSession = allSessions.filter((as) => {
                return (((as.portal).toLowerCase()).indexOf(baseURL) > -1);
            });
            let serviceToken = null;
            if (((this.props.portalUrl).toLowerCase()).includes(baseURL)) {
                serviceToken = this.props.token;
            }
            if (foundSession.length > 0) {
                serviceToken = foundSession[0].token;
            }
            else {
                if (serviceToken === null) {
                    allSessions.map((as) => {
                        if (as.hasOwnProperty('federatedServers')) {
                            for (const key in as.federatedServers) {
                                if (((key).toLowerCase()).includes(baseURL)) {
                                    serviceToken = as.federatedServers[key].token;
                                }
                            }
                            return true;
                        }
                        else {
                            if (as.hasOwnProperty('trustedServers')) {
                                for (const key in as.trustedServers) {
                                    if (((key).toLowerCase()).includes(baseURL)) {
                                        serviceToken = as.trustedServers[key].token;
                                    }
                                }
                                return true;
                            }
                            return true;
                        }
                    });
                }
            }
            return serviceToken;
        };
        this.toggleDialogAction = (type, key) => {
            this.setState({ showFieldMgmt: !this.state.showFieldMgmt });
        };
        this.getStyle = (theme) => {
            return css `
      .simple-view-header{
        background: ${theme.colors.secondary};
      }

    `;
        };
        this.state = {
            allVersionList: [],
            filteredVersionList: [],
            selectedVersion: {},
            selectedService: {},
            selectedWebMap: '',
            vmsServices: (this.props.config.versionConfig) ? (this.props.config.versionConfig.hasOwnProperty('services')) ? this.props.config.versionConfig.services : [] : [],
            showServiceSelector: false,
            showSidePanel: false,
            showWebMapSelector: false,
            showFieldMgmt: false,
            showAlert: false,
            alertMessage: this.formatMessage('alertMessagesErrorAlert'),
            searchVersionText: '',
            intervalNumber: 1,
            invalidInterval: false,
            expandMode: (this.props.config.versionConfig) ? (this.props.config.versionConfig.hasOwnProperty('expandMode')) ? this.props.config.versionConfig.expandMode : true : true,
            arrangementStyle: (this.props.config.versionConfig) ? (this.props.config.versionConfig.hasOwnProperty('arrangement')) ? this.props.config.versionConfig.arrangement : 'simple' : 'simple',
            configObject: Immutable.asMutable(Immutable(this.props.config.versionConfig), { deep: true })
        };
    }
    //index 7 of allowance is hard coded and used in functions serviceCheckBoxAction and serviceSelectorAction.  Be sure to update if you add more allowances here.
    componentDidMount() {
    }
    //<JimuMapViewComponent useMapWidgetIds={this.props.config.useMapWidgetIds} onViewsCreate={()=>{}}></JimuMapViewComponent>
    //      {this.renderMapWidgetSelector()}
    //{(this.state.showWebMapSelector)?this.renderWebMapSelector():''}
    render() {
        const { theme } = this.props;
        return React.createElement("div", { className: "widget-setting-demo" },
            React.createElement(SettingSection, { className: "map-selector-section", title: this.formatMessage('layoutStyleTitle') },
                React.createElement(SettingRow, null,
                    React.createElement(Tooltip, { title: this.formatMessage('layoutStyleBasic'), placement: "bottom" },
                        React.createElement("div", { key: 'simpleMode' },
                            React.createElement(Button, { onClick: () => { this.arrangementHandler('simple'); }, icon: true, size: "sm", type: "tertiary", active: (this.state.arrangementStyle === 'simple'), style: { backgroundColor: theme.colors.palette.light[200], border: (this.state.arrangementStyle === 'simple') ? 'solid #00aabb' : '' } },
                                React.createElement(Icon, { width: 95, height: 95, icon: require('./assets/arrange_basic.svg') })),
                            React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } }, this.formatMessage('layoutStyleBasic')))),
                    React.createElement("div", { style: { padding: '0 10px' } }),
                    React.createElement(Tooltip, { title: this.formatMessage('layoutStyleAdvanced'), placement: "bottom" },
                        React.createElement("div", { key: 'advanceMode' },
                            React.createElement(Button, { onClick: () => { this.arrangementHandler('management'); }, icon: true, size: "sm", type: "tertiary", active: (this.state.arrangementStyle === 'management'), style: { backgroundColor: theme.colors.palette.light[200], border: (this.state.arrangementStyle === 'management') ? 'solid #00aabb' : '' } },
                                React.createElement(Icon, { width: 95, height: 95, icon: require('./assets/arrange_advanced.svg') })),
                            React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } }, this.formatMessage('layoutStyleAdvanced')))))),
            this.renderServiceSelector(),
            this.renderGeneralSection(),
            (this.state.showSidePanel) && this.renderConfigSlideout());
    }
}
//# sourceMappingURL=setting.js.map