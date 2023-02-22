/** @jsx jsx */
/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, css, jsx } from 'jimu-core';
import { Button, Checkbox, Icon, Label, Radio, TextInput } from 'jimu-ui';
import { MapWidgetSelector, SettingSection } from 'jimu-ui/advanced/setting-components';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import checkIcon from 'jimu-ui/lib/icons/check.svg';
import i18n from './translations/default';
import './style.css';
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleAllowExportChange = (evt, checked) => {
            if (evt) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('allowExport', checked)
                });
            }
        };
        this.handleDisplayLabelChange = (evt, checked) => {
            if (evt) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('displayLabel', checked)
                });
            }
        };
        this.handleMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.handleSearchBlur = () => {
            setTimeout(() => {
                this.setState({ searchHasFocus: false });
            }, 10);
        };
        this.handleSearchFocus = () => {
            this.setState({ searchHasFocus: true });
        };
        this.handleSearchItemClick = (e) => {
            const itemId = e.target.getAttribute('data-itemId');
            const itemTitle = e.target.getAttribute('data-itemTitle');
            this.setState({ clearSearch: true }, () => {
                this.setState({ searchHasFocus: false });
                this.search().catch(() => { }); // the catch is for ts-standard
                this.setModelProps(false, null, itemId, itemTitle);
            });
        };
        this.nls = (id) => {
            if (this.props.intl) {
                return this.props.intl.formatMessage({
                    id: id,
                    defaultMessage: i18n[id]
                });
            }
            return id;
        };
        this.searchRef = React.createRef();
        let byUrl = true;
        if (this.props.config.serviceUrl) {
            byUrl = true;
        }
        else if (this.props.config.itemId) {
            byUrl = false;
        }
        this.state = {
            serviceUrl: this.props.config.serviceUrl,
            itemId: this.props.config.itemId,
            itemTitle: this.props.config.itemTitle,
            byUrl: byUrl,
            searchHasFocus: false,
            searchResults: null,
            clearSearch: false
        };
    }
    componentDidMount() {
        this.init().catch(() => { }); // the catch is for ts-standard
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modules = yield loadArcGISJSAPIModules(['esri/portal/Portal']);
                const Portal = modules[0];
                const portal = new Portal({
                    url: this.props.portalUrl
                });
                yield portal.load();
                this.portal = portal;
                this.search().catch(() => { }); // the catch is for ts-standard
            }
            catch (ex) {
                console.error(ex);
                // @todo need to inform user?
            }
        });
    }
    render() {
        return (jsx(SettingSection, null,
            jsx("div", { className: 'widget-setting-wro-section' },
                jsx(Label, { className: 'widget-setting-wro-label' }, this.nls('wro_setting_selectMap')),
                jsx("div", null,
                    jsx(MapWidgetSelector, { onSelect: this.handleMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }))),
            jsx("div", { className: 'widget-setting-wro-section-b' },
                jsx(Label, null,
                    jsx(Checkbox, { checked: !!this.props.config.displayLabel, onChange: this.handleDisplayLabelChange }),
                    jsx("span", { className: 'widget-setting-wro-checkbox-label' }, this.nls('wro_setting_displayLabel')))),
            jsx("div", { className: 'widget-setting-wro-section-b' },
                jsx(Label, null,
                    jsx(Checkbox, { checked: !!this.props.config.allowExport, onChange: this.handleAllowExportChange }),
                    jsx("span", { className: 'widget-setting-wro-checkbox-label' }, this.nls('wro_setting_allowExport')))),
            this.renderModelSection()));
    }
    renderItemSection() {
        const clearSearch = this.state.clearSearch;
        let cssModelName = css ``;
        let modelName;
        if (this.props.config.serviceUrl) {
            modelName = this.props.config.serviceUrl;
        }
        else if (this.props.config.itemId) {
            modelName = this.state.itemTitle || this.props.config.itemTitle || this.props.config.itemId;
        }
        if (modelName) {
            cssModelName = css `
        background-color: ${this.props.theme.colors.primary};
        padding: 2px 6px;
        width: 100%;
      `;
        }
        else {
            modelName = this.nls('wro_setting_model');
        }
        const handleSearchChange = (e) => {
            const v = e.target.value;
            this.search(v).catch(() => { }); // the catch is for ts-standard
        };
        let items = [];
        const searchResults = this.state.searchResults;
        if (searchResults) {
            items = searchResults.map((item) => {
                return (jsx("li", { key: item.itemId },
                    jsx(Button, { className: 'widget-setting-wro-search-item', onMouseDown: this.handleSearchItemClick, "data-itemId": item.itemId, "data-itemTitle": item.itemTitle }, item.itemTitle)));
            });
        }
        let ulCls = 'widget-setting-wro-search-items';
        const ref = this.searchRef;
        if (document.activeElement && (document.activeElement === ref.current)) {
            ulCls += ' widget-setting-wro-on';
        }
        else {
            ulCls += ' widget-setting-wro-off';
        }
        return (jsx("div", { className: 'widget-setting-wro-section' },
            jsx(Label, { className: 'widget-setting-wro-label', css: cssModelName }, modelName),
            !clearSearch &&
                jsx("div", null,
                    jsx(TextInput, { className: 'w-100', type: 'text', allowClear: true, maxLength: 1024, ref: this.searchRef, placeholder: this.nls('wro_setting_searchForAModel'), onChange: handleSearchChange, onFocus: this.handleSearchFocus, onBlur: this.handleSearchBlur }),
                    jsx("ul", { className: ulCls }, items))));
    }
    renderModelSection() {
        const byUrl = this.state.byUrl;
        const byItem = !byUrl;
        const handleByUrlChange = () => {
            if (!this.state.byUrl) {
                this.setModelProps(true, null, null, null);
            }
            this.setState({ byUrl: true });
        };
        const handleByItemChange = () => {
            if (this.state.byUrl) {
                this.setModelProps(false, null, null, null);
            }
            this.setState({ byUrl: false });
        };
        return (jsx(React.Fragment, null,
            jsx("div", { className: 'widget-setting-wro-section-b' },
                jsx(Label, { className: 'widget-setting-wro-label' }, this.nls('wro_setting_startingState')),
                jsx("div", null,
                    jsx(Label, null,
                        jsx(Radio, { name: 'startingState', checked: byUrl, onChange: handleByUrlChange }),
                        jsx("span", { className: 'widget-setting-wro-radio-label' }, this.nls('wro_setting_byUrl')))),
                jsx("div", null,
                    jsx(Label, null,
                        jsx(Radio, { name: 'startingState', checked: byItem, onChange: handleByItemChange }),
                        jsx("span", { className: 'widget-setting-wro-radio-label' }, this.nls('wro_setting_byItem'))))),
            byUrl && this.renderUrlSection(),
            byItem && this.renderItemSection()));
    }
    renderUrlSection() {
        const handleServiceUrlChange = (e) => {
            this.setState({ serviceUrl: e.target.value });
        };
        const handleSet = () => {
            this.setModelProps(true, this.state.serviceUrl, null, null);
        };
        return (jsx("div", { className: 'widget-setting-wro-section' },
            jsx("div", null,
                jsx(Label, { className: 'widget-setting-wro-label' }, this.nls('wro_setting_serviceUrl')),
                jsx("div", { style: { display: 'flex' } },
                    jsx(TextInput, { className: 'w-100', type: 'text', maxLength: 1024, defaultValue: this.state.serviceUrl, onChange: handleServiceUrlChange }),
                    jsx(Button, { icon: true, title: this.nls('wro_setting_setUrl'), onClick: handleSet },
                        jsx(Icon, { icon: checkIcon })))),
            jsx("div", { className: 'widget-setting-wro-note', style: { width: '100%' } },
                jsx("div", { className: 'widget-setting-wro-note-br' }, "https://example.com/arcgis/rest/services/Example/ImageServer"),
                jsx("div", { className: 'widget-setting-wro-note-br' }, "https://utility.arcgis.com/usrsvcs/servers/24b7c7752170431a95719323a9e71a5e/rest/services/WRO_World_Ecophysiographic_Data/ImageServer"),
                jsx("div", { className: 'widget-setting-wro-note-br' }, "https://greeninfrastructuremapsdev.arcgis.com/arcgis/rest/services/GreenInfrastructure/WeightedOverlay_Geoplanner/ImageServer"))));
    }
    search(v) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.portal) {
                    // @todo need to inform user?
                    console.error("WRO search, Portal wasn't loaded");
                    return;
                }
                const searchingId = this.searchingId = Date.now();
                let items = [];
                let q = '(type:"Image Service" AND typekeywords:geodesignModelerLayer)';
                if (typeof v === 'string' && v.length > 0) {
                    q = q + ' AND (' + v + ')';
                    // q = q+" AND (title:("+v+"))";
                    let params = {
                        query: q,
                        num: 100,
                        sortField: 'title'
                    };
                    for (let i = 1; i <= 10; i++) {
                        const result = yield this.portal.queryItems(params);
                        if (result.results && result.results.length > 0) {
                            items = items.concat(result.results);
                            params = result.nextQueryParams;
                            if (params.start === -1)
                                break;
                        }
                        else {
                            break;
                        }
                        if (searchingId !== this.searchingId)
                            break;
                    }
                }
                const searchResults = items.map(item => {
                    return {
                        itemId: item.id,
                        itemTitle: item.title
                    };
                });
                if (searchingId !== this.searchingId)
                    return;
                this.setState({ searchResults: searchResults });
            }
            catch (ex) {
                console.error('Search error', ex);
                // @todo need to inform user?
            }
        });
    }
    setModelProps(byUrl, serviceUrl, itemId, itemTitle) {
        const chk = (v) => {
            if (typeof v !== 'string')
                v = '';
            v = v.trim();
            if (v.length === 0)
                v = null;
            return v;
        };
        if (byUrl) {
            serviceUrl = chk(serviceUrl);
        }
        else {
            itemId = chk(itemId);
            itemTitle = chk(itemTitle);
        }
        const cfg = this.props.config.set('serviceUrl', serviceUrl).set('itemId', itemId).set('itemTitle', itemTitle);
        this.props.onSettingChange({
            id: this.props.id,
            config: cfg
        });
        setTimeout(() => {
            this.setState({
                serviceUrl: serviceUrl,
                itemId: itemId,
                itemTitle: itemTitle,
                clearSearch: false
            });
        }, 100);
    }
}
//# sourceMappingURL=setting.js.map