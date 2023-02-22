var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, DataSourceManager } from 'jimu-core';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { ArcGISDataSourceTypes, MapViewManager, loadArcGISJSAPIModules } from 'jimu-arcgis';
import { Select, Option, Button, Checkbox, Label, TextInput, Tooltip, Switch, Collapse } from 'jimu-ui';
import defaultMessages from './translations/default';
import './assets/style.css';
// const arrowDown = require('jimu-ui/lib/icons/arrow-down-12.svg');
// const arrowUp = require('jimu-ui/lib/icons/arrow-up-12.svg');
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedTypes = Immutable([ArcGISDataSourceTypes.WebMap]);
        this.dsManager = DataSourceManager.getInstance();
        this.mvManager = MapViewManager.getInstance();
        this.featureLayerCss = 'oi-hideFeatureLayers';
        this.unmount = false;
        this.onMapSelected = (useMapWidgetIds) => {
            var _a, _b;
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
            if (useMapWidgetIds.length > 0) {
                // document.getElementById("oi-widget").style.display = "block";
                this.vectorLayers = [];
                this.mapView = (_a = this.mvManager.jimuMapViewGroups[useMapWidgetIds[0]].getActiveJimuMapView()) === null || _a === void 0 ? void 0 : _a.view;
                //var map = this.mvManager.getJimuMapViewById(useMapWidgetIds[0]);
                const layers = (_b = this.mapView) === null || _b === void 0 ? void 0 : _b.map.layers;
                if (layers) {
                    for (let i = 0; i < layers.length; i++) {
                        if (layers.getItemAt(i).type === 'feature') {
                            const layer = {};
                            layer.title = layers.getItemAt(i).title;
                            layer.id = layers.getItemAt(i).id;
                            this.vectorLayers.push({ featureLayer: layer, addToViewer: false, editing: false });
                        }
                    }
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('vectorLayers', this.vectorLayers)
            });
        };
        this.nls = (id) => {
            return this.props.intl ? this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }) : id;
        };
        this.getOICFromUserAcc = () => {
            const portal = new this.Portal({ url: this.props.portalUrl });
            portal.load().then((user) => {
                if (!this.userContentInfo) {
                    this.userContentInfo = {
                        userId: this.props.user.username,
                        myFolders: {},
                        myGroups: {},
                        myOrgGroups: {},
                        //myFavorites: {},
                        user: user
                    };
                    for (let b = 0; b < this.props.user.groups.length; b++) {
                        this.userContentInfo.myGroups[this.props.user.groups[b].title] = { id: this.props.user.groups[b].id, items: [] };
                    }
                    this.getOrganisationGroups(user);
                    this.getOICFromFolders(user);
                }
            });
        };
        this.getOrganisationGroups = (user) => {
            this.esriRequest(user.restUrl + '/community/groups', {
                query: {
                    f: 'json',
                    q: 'orgid:' + this.props.user.orgId,
                    start: 1,
                    num: 50,
                    sortField: 'title',
                    sortOrder: 'asc'
                },
                responseType: 'json'
            }).then((result) => {
                const orgGroups = result.data;
                for (let b = 0; b < orgGroups.results.length; b++) {
                    this.userContentInfo.myOrgGroups[orgGroups.results[b].title] = { id: orgGroups.results[b].id, items: [] };
                }
            });
        };
        this.getOICFromFolders = (user) => {
            this.esriRequest(user.restUrl + '/content/users/' + this.props.user.username, {
                query: {
                    f: 'json',
                    token: this.props.token
                },
                responseType: 'json'
            }).then((userContent) => {
                userContent = userContent.data;
                this.userContentInfo.myFolders[userContent.currentFolder || '[ root folder ]'] = { id: null, items: [] };
                for (let a = 0; a < userContent.items.length; a++) {
                    if (userContent.items[a].type === 'Oriented Imagery Catalog') {
                        this.userContentInfo.myFolders[userContent.currentFolder ||
                            '[ root folder ]'].items.push({
                            name: userContent.items[a].title,
                            url: this.props.portalUrl + '/sharing/rest/content/items/' + userContent.items[a].id
                        });
                    }
                }
                for (const a in userContent.folders) {
                    this.userContentInfo.myFolders[userContent.folders[a].title] = { id: userContent.folders[a].id, items: [] };
                }
                this.populateFolderGroupList(this.state.selectContent);
                //html.set("itemNotify", "");
                //this.hideLoading();
            }).catch(() => {
                this.populateFolderGroupList(this.state.selectContent);
                //html.set("itemNotify", "");
                //this.hideLoading();
            });
        };
        this.populateFolderGroupList = (value) => {
            let items;
            if (value === 'content') {
                items = Object.keys(this.userContentInfo.myFolders);
            }
            else if (value === 'group') { //groupchange
                items = Object.keys(this.userContentInfo.myGroups);
            }
            else if (value === 'orgGroups') {
                items = Object.keys(this.userContentInfo.myOrgGroups);
            }
            // else {
            //     var items = Object.keys(this.userContentInfo.myFavorites);
            // }
            items === null || items === void 0 ? void 0 : items.sort(function (a, b) {
                a = a.toLowerCase().split(' ')[0];
                b = b.toLowerCase().split(' ')[0];
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            this.setState({
                contentList: items
            });
        };
        this.populateOICList = (evt) => {
            var _a, _b, _c;
            const value = evt.currentTarget.value;
            if (value) {
                let items;
                if (this.state.selectContent === 'content') {
                    items = (_a = this.userContentInfo) === null || _a === void 0 ? void 0 : _a.myFolders[value].items;
                }
                else if (this.state.selectContent === 'group') { //groupchange
                    items = (_b = this.userContentInfo) === null || _b === void 0 ? void 0 : _b.myGroups[value].items;
                }
                else if (this.state.selectContent === 'orgGroups') {
                    items = (_c = this.userContentInfo) === null || _c === void 0 ? void 0 : _c.myOrgGroups[value].items;
                }
                // else
                //     var items = this.userContentInfo.myFavorites[value];
                if (items.length) {
                    items.sort(function (a, b) {
                        a = a.name.toLowerCase().split(' ')[0];
                        b = b.name.toLowerCase().split(' ')[0];
                        if (a < b) {
                            return -1;
                        }
                        if (a > b) {
                            return 1;
                        }
                        return 0;
                    });
                    const OIClist = [];
                    for (const a in items) {
                        //this.addSelectOption(document.getElementById("agolOICList"), items[a].name, items[a].url);
                        OIClist.push({ name: items[a].name, value: items[a].url });
                    }
                    this.setState({
                        itemList: OIClist
                    });
                }
                else {
                    if (this.state.selectContent === 'content') {
                        this.getOICFromFolder(value);
                    }
                    else {
                        this.getOICFromGroup(value);
                    }
                }
            }
        };
        this.getOICFromFolder = (value) => {
            const id = this.userContentInfo.myFolders[value].id;
            this.esriRequest(this.userContentInfo.user.restUrl + '/content/users/' + this.props.user.username + '/' + id, {
                query: {
                    f: 'json',
                    token: this.props.token
                },
                responseType: 'json'
            }).then((response) => {
                response = response.data;
                if (response.items) {
                    this.userContentInfo.myFolders[value].items = [];
                    for (let a = 0; a < response.items.length; a++) {
                        if (response.items[a].type === 'Oriented Imagery Catalog') {
                            this.userContentInfo.myFolders[value].items.push({ name: response.items[a].title, url: this.userContentInfo.user.restUrl + '/content/items/' + response.items[a].id });
                        }
                    }
                    const items = this.userContentInfo.myFolders[value].items;
                    items.sort(function (a, b) {
                        a = a.name.toLowerCase().split(' ')[0];
                        b = b.name.toLowerCase().split(' ')[0];
                        if (a < b) {
                            return -1;
                        }
                        if (a > b) {
                            return 1;
                        }
                        return 0;
                    });
                    const OIClist = [];
                    for (const a in items) {
                        //this.addSelectOption(document.getElementById("agolOICList"), items[a].name, items[a].url);
                        OIClist.push({ name: items[a].name, value: items[a].url });
                    }
                    this.setState({
                        itemList: OIClist
                    });
                    //this.hideLoading();
                } //else
                //this.hideLoading();
            }).catch(() => {
                //this.hideLoading();
            });
        };
        this.getOICFromGroup = (value) => {
            const id = this.userContentInfo.myGroups[value] ? this.userContentInfo.myGroups[value].id : this.userContentInfo.myOrgGroups[value].id; //groupchange
            this.esriRequest(this.userContentInfo.user.restUrl + '/content/groups/' + id, {
                query: {
                    f: 'json',
                    token: this.props.token
                },
                responseType: 'json'
            }).then((response) => {
                response = response.data;
                if (response.items) {
                    if (this.userContentInfo.myGroups[value]) {
                        this.userContentInfo.myGroups[value].items = [];
                    }
                    else if (this.userContentInfo.myOrgGroups[value]) {
                        this.userContentInfo.myOrgGroups[value].items = [];
                    }
                    for (let a = 0; a < response.items.length; a++) {
                        if (response.items[a].type === 'Oriented Imagery Catalog') {
                            if (this.userContentInfo.myGroups[value]) { //groupchange
                                this.userContentInfo.myGroups[value].items.push({ name: response.items[a].title, url: this.userContentInfo.user.restUrl + '/content/items/' + response.items[a].id });
                            }
                            else {
                                this.userContentInfo.myOrgGroups[value].items.push({ name: response.items[a].title, url: this.userContentInfo.user.restUrl + '/content/items/' + response.items[a].id });
                            }
                        }
                    }
                    const items = this.userContentInfo.myGroups[value] ? this.userContentInfo.myGroups[value].items : this.userContentInfo.myOrgGroups[value].items;
                    items.sort(function (a, b) {
                        a = a.name.toLowerCase().split(' ')[0];
                        b = b.name.toLowerCase().split(' ')[0];
                        if (a < b) {
                            return -1;
                        }
                        if (a > b) {
                            return 1;
                        }
                        return 0;
                    });
                    const OIClist = [];
                    for (const a in items) {
                        //this.addSelectOption(document.getElementById("agolOICList"), items[a].name, items[a].url);
                        OIClist.push({ name: items[a].name, value: items[a].url });
                    }
                    this.setState({
                        itemList: OIClist
                    });
                    //this.hideLoading();
                } //else
                //this.hideLoading();
            }).catch(() => {
                //this.hideLoading();
            });
        };
        this.changeContent = (evt) => {
            if (evt.currentTarget.value !== 'itemurl') {
                this.populateFolderGroupList(evt.currentTarget.value);
            }
            this.setState({
                selectContent: evt.currentTarget.value
            });
        };
        this.chooseOIC = (evt) => {
            this.setState({
                oic: { name: evt.currentTarget.textContent, url: evt.currentTarget.value }
            });
        };
        this.getOICfromUrl = (value) => {
            const url = value;
            if (url.includes('id=')) {
                //if (url.indexOf("/portal") !== -1)
                const itemUrl = url.split('/home')[0] + '/sharing/rest/content/items/' + (url.split('id=')[1]).split('/')[0]; //#530
                // else
                //     var itemUrl = "https://www.arcgis.com" + "/sharing/rest/content/items/" + (url.split("id=")[1]).split("/")[0];
                this.esriRequest(itemUrl, {
                    query: {
                        f: 'json'
                        //token: this.props.token
                    },
                    responseType: 'json'
                }).then((response) => {
                    if (response.data && response.data.type === 'Oriented Imagery Catalog') {
                        //#7136
                        // this.OICList = []
                        // this.OICList.push({ name: response.data.title, url: response.url })
                        this.setState({
                            oic: {
                                name: response.data.title, url: response.url
                            }
                        });
                    }
                    else {
                        //document.getElementById('addOICDialog').style.display = '';
                        //this.errorNotification("Error! Item type is not OIC.");
                    }
                }).catch((error) => {
                    // this.esriRequest(error.details.url, {
                    //   query: {
                    //     f: 'json',
                    //     token: this
                    //   }
                    // })
                    console.log(error);
                });
            }
            else {
                // document.getElementById('addOICDialog').style.display = '';
                // this.errorNotification("Error! Please enter a valid OIC item url.");
            }
        };
        this.addOICToList = () => {
            // if (this.state.selectContent !== 'itemurl') {
            //   this.OICList = []
            //   this.OICList.push(this.state.oic)
            // } else {
            //   this.OICList = []
            //   this.OICList.push(this.state.oic)
            // }
            this.OICList = [];
            if (this.state.oic)
                this.OICList.push(this.state.oic);
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('oicList', this.OICList)
            });
            this.setState({
                oicList: this.OICList
            });
        };
        this.deleteOICList = () => {
            this.OICList = [];
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('oicList', this.OICList)
            });
            this.setState({
                oicList: this.OICList
            });
        };
        this.enableEditing = (event, checked) => {
            //#861
            this.featureLayerCss = checked ? 'oi-showFeatureLayers' : 'oi-hideFeatureLayers';
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('editingEnabled', checked)
            });
        };
        this.enableLayerView = (event, checked) => {
            if (!this.vectorLayers || this.vectorLayers.length === 0) {
                this.vectorLayers = this.props.config.vectorLayers;
            }
            for (let i = 0; i < this.vectorLayers.length; i++) {
                if (event.currentTarget.id.split('-add')[0] === this.vectorLayers[i].featureLayer.id) {
                    this.vectorLayers[i].addToViewer = checked;
                    break;
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('vectorLayers', this.vectorLayers)
            });
        };
        this.enableLayerEdit = (event, checked) => {
            if (!this.vectorLayers || this.vectorLayers.length === 0) {
                this.vectorLayers = this.props.config.vectorLayers;
            }
            for (let i = 0; i < this.vectorLayers.length; i++) {
                if (event.currentTarget.id.split('-edit')[0] === this.vectorLayers[i].featureLayer.id) {
                    this.vectorLayers[i].editing = checked;
                    break;
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('vectorLayers', this.vectorLayers)
            });
        };
        this.state = {
            groupList: [],
            selectContent: 'group',
            folderList: [],
            itemList: [],
            orgGroupList: [],
            contentList: [],
            oicList: [],
            oic: null,
            layerEditCollapseFlags: {},
            apiLoaded: false
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.unmount) {
                if (!this.state.apiLoaded) {
                    yield loadArcGISJSAPIModules(['esri/portal/Portal', 'esri/request']).then((modules) => {
                        [this.Portal, this.esriRequest] = modules;
                        this.setState({
                            apiLoaded: true
                        });
                    });
                    if (this.props.config.oicList.length > 0) {
                        this.OICList = this.props.config.oicList;
                    }
                    else {
                        this.OICList = [];
                    }
                    this.getOICFromUserAcc();
                }
                //#839
                if (this.props.useMapWidgetIds && !this.mapView) {
                    this.onMapSelected(this.props.useMapWidgetIds);
                }
            }
        });
    }
    componentWillUnmount() {
        this.unmount = true;
    }
    render() {
        var _a, _b, _c, _d;
        let content;
        this.featureLayerCss = this.props.config.editingEnabled ? 'oi-showFeatureLayers' : 'oi-hideFeatureLayers'; //#861
        if (this.state.selectContent === 'itemurl') {
            content = React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('catalogUrl') },
                React.createElement(TextInput, { id: 'oic-itemurl', placeholder: this.nls('catalogUrl'), onAcceptValue: this.getOICfromUrl }),
                " ");
        }
        else {
            content = React.createElement(React.Fragment, null,
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('selectGroupFolder') },
                    React.createElement(Select, { placeholder: this.nls('selectGroupFolder'), 
                        // style={{ display: 'inline-block', width: '16.35rem', maxWidth: '16.35rem !important' }}
                        onChange: this.populateOICList }, this.state.contentList.map((item, i) => {
                        return React.createElement(Option, { value: item, key: i },
                            React.createElement("div", { className: 'text-truncate' }, item));
                    }))),
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('selectOIC') },
                    React.createElement(Select, { placeholder: this.nls('selectOIC'), 
                        // style={{ display: 'inline-block', width: '16.35rem', maxWidth: '16.35rem !important' }}
                        onChange: this.chooseOIC, value: this.state.oic ? this.state.oic.url : null }, this.state.itemList.map((oic, i) => {
                        return React.createElement(Option, { value: oic.value, key: i },
                            React.createElement("div", { className: 'text-truncate' }, oic.name));
                    }))));
        }
        let feautureDiv;
        //#804
        if (this.mapView) {
            if (((_a = this.props.config.vectorLayers) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                feautureDiv = (_b = this.props.config.vectorLayers) === null || _b === void 0 ? void 0 : _b.map((product, i) => {
                    var _a, _b, _c, _d;
                    //#861
                    //#872
                    const editingEnabled = !!(((_a = (this.mapView.map.findLayerById(product.featureLayer.id))) === null || _a === void 0 ? void 0 : _a.editingEnabled) &&
                        ((_d = (_c = (_b = (this.mapView.map.findLayerById(product.featureLayer.id))) === null || _b === void 0 ? void 0 : _b.capabilities) === null || _c === void 0 ? void 0 : _c.operations) === null || _d === void 0 ? void 0 : _d.supportsEditing));
                    return React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('editLayer'), flow: "wrap", key: i, className: this.featureLayerCss, label: React.createElement("div", { className: "w-100 d-flex" },
                            React.createElement("span", { className: "d-inline-flex" },
                                React.createElement(Checkbox, { checked: product.addToViewer, onChange: this.enableLayerView, id: product.featureLayer.id + '-add' }),
                                React.createElement(Label, { className: "pl-2" }, product.featureLayer.title))) },
                        React.createElement(Collapse, { isOpen: product.addToViewer, className: "w-100 offset-1" },
                            React.createElement(Tooltip, { placement: "top", showArrow: true, title: !editingEnabled ? this.nls('editingTooltip') : '' },
                                React.createElement("span", { className: "d-inline-flex" },
                                    React.createElement(Checkbox, { checked: product.editing, disabled: !editingEnabled, onChange: this.enableLayerEdit, id: product.featureLayer.id + '-edit' }),
                                    React.createElement(Label, { className: "pl-2" }, this.nls('editLayer'))))));
                });
            }
        }
        const enableEditingSwitch = ((_c = this.props.config.vectorLayers) === null || _c === void 0 ? void 0 : _c.length) > 0; //#870
        return React.createElement("div", { className: "widget-setting-orientedimagery" },
            React.createElement(SettingSection, { className: "map-selector-section", title: this.nls('chooseMapWidget'), role: 'group', "aria-label": this.nls('selectMap') },
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('selectMap') },
                    React.createElement(MapWidgetSelector, { onSelect: this.onMapSelected, useMapWidgetIds: this.props.useMapWidgetIds }),
                    React.createElement("br", null))),
            React.createElement(SettingSection, { title: this.nls('chooseOIC'), role: 'group', "aria-label": this.nls('catalogSelection') },
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('chooseOIC') },
                    React.createElement(Select
                    // style={{ display: 'inline-block', width: '16.35rem', maxWidth: '16.35rem !important' }}
                    , { 
                        // style={{ display: 'inline-block', width: '16.35rem', maxWidth: '16.35rem !important' }}
                        value: this.state.selectContent, onChange: this.changeContent },
                        React.createElement(Option, { value: 'content' }, this.nls('contents')),
                        React.createElement(Option, { value: 'group' }, this.nls('groups')),
                        React.createElement(Option, { value: 'orgGroups' }, this.nls('org')),
                        React.createElement(Option, { value: 'itemurl' }, this.nls('itemurl')))),
                content,
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('selectedCatalog') }, this.OICList && this.OICList[0]
                    ? React.createElement(TextInput, { style: { width: '228px' }, readOnly: true, disabled: true, value: (_d = this.OICList[0]) === null || _d === void 0 ? void 0 : _d.name })
                    : null),
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('addOIC') },
                    React.createElement(Button, { type: 'primary', disabled: !this.state.oic, size: 'sm', onClick: this.addOICToList }, this.nls('addOIC')),
                    React.createElement(Button, { type: 'secondary', disabled: !this.OICList, size: 'sm', onClick: this.deleteOICList, style: { marginLeft: '5px' } }, this.nls('deleteOIC')))),
            React.createElement(SettingSection, { title: this.nls('configureEdit'), role: 'group', "aria-label": this.nls('configureEdit') },
                React.createElement(SettingRow, { role: 'group', "aria-label": this.nls('configureEdit') },
                    React.createElement(Tooltip, { placement: "top", showArrow: true, title: !enableEditingSwitch ? this.nls('editingSwitchTooltip') : '' },
                        React.createElement("span", null,
                            React.createElement(Label, { style: { cursor: 'pointer' } },
                                React.createElement(Switch, { className: "mr-2", onChange: this.enableEditing, id: 'oi-editingCheckbox', checked: !!(this.props.config.editingEnabled && enableEditingSwitch), disabled: !enableEditingSwitch }),
                                this.nls('enableEditing'))))),
                feautureDiv));
    }
}
//# sourceMappingURL=setting.js.map