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
import { React, jsx } from 'jimu-core';
import { AlertPopup, Form, FormGroup, Label, Select, TextArea, TextInput } from 'jimu-ui';
import * as rasterUtil from './wro-raster-util';
import Portal from 'esri/portal/Portal';
export class Export extends React.PureComponent {
    constructor(props) {
        super(props);
        this.home = '__home__';
        this.chk = (v) => {
            if (typeof v === 'string') {
                v = v.trim();
                if (v.length > 0) {
                    return v;
                }
            }
            ;
            return null;
        };
        this.close = () => {
            if (this.props.close) {
                this.props.close();
            }
        };
        this.exportModel = () => {
            const portal = this.portal;
            const itemData = this.itemData;
            const serviceUrl = this.serviceUrl;
            const { title, summary, description, tags, folder } = this.state;
            if (!portal || !portal.user || !title)
                return;
            const task = {
                title,
                summary,
                description,
                tags,
                itemData,
                portal,
                serviceUrl
            };
            if (folder !== this.home)
                task.folder = folder;
            if (this.props.exportModel) {
                this.props.exportModel(task);
            }
            this.close();
        };
        this.handleDescriptionChange = (e) => {
            const v = this.chk(e.target.value);
            this.setState({ description: v });
        };
        this.handleFolderChange = (e) => {
            const v = this.chk(e.target.value);
            this.setState({ folder: v });
        };
        this.handleSummaryChange = (e) => {
            const v = this.chk(e.target.value);
            this.setState({ summary: v });
        };
        this.handleTagsChange = (e) => {
            const v = this.chk(e.target.value);
            this.setState({ tags: v });
        };
        this.handleTitleChange = (e) => {
            const v = this.chk(e.target.value);
            this.setState({
                title: v,
                hasTitle: !!v
            });
        };
        this._handleToggle = (isOK) => {
            if (isOK) {
                this.exportModel();
            }
            else {
                this.close();
            }
        };
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const wroModel = this.props.wroModel;
                this.serviceUrl = wroModel.serviceUrl;
                this.itemData = rasterUtil.modelToItemData(wroModel);
                const folders = [];
                const url = this.props.wroContext.getPortalUrl();
                const portal = new Portal({
                    url: url
                });
                yield portal.load();
                if (portal.user) {
                    this.portal = portal;
                    const list = yield portal.user.fetchFolders();
                    if (list) {
                        list.forEach(f => {
                            folders.push({
                                id: f.id,
                                title: f.title
                            });
                        });
                    }
                }
                if (folders.length > 0) {
                    this.setState({
                        folders: folders,
                        hasPortal: !!portal.user
                    });
                }
            }
            catch (ex) {
                console.error(ex);
                // @todo need to inform user
            }
        });
        this.state = {
            title: null,
            summary: null,
            description: null,
            tags: null,
            folder: this.home,
            folders: null,
            hasPortal: false,
            hasTitle: false
        };
    }
    componentDidMount() {
        this.init().catch(() => { }); // the catch is for ts-standard
    }
    render() {
        const nls = this.props.wroContext.nls;
        const hasTitle = !!this.state.title;
        const modalClassName = hasTitle ? 'widget-wro-valid-modal' : 'widget-wro-invalid-modal';
        return (jsx("div", null,
            jsx(AlertPopup, { className: `widget-wro-export-popup ${modalClassName}`, isOpen: true, okLabel: nls('wro_general_export'), title: nls('wro_general_export'), toggle: this._handleToggle }, this.renderForm())));
    }
    renderForm() {
        const nls = this.props.wroContext.nls;
        const id = this.props.wroContext.getId() + '_export';
        const user = this.props.wroContext.getUser();
        const username = (user === null || user === void 0 ? void 0 : user.username) || '';
        const hasTitle = !!this.state.title;
        const home = this.home;
        const tags = 'weightedOverlayModel, geodesign';
        const folderOptions = [];
        const homeLabel = nls('wro_saveModel_homeFolderPattern', {
            username: username
        });
        folderOptions.push(jsx("option", { key: home, value: home }, homeLabel));
        const folders = this.state.folders;
        if (folders) {
            folders.forEach(f => {
                folderOptions.push(jsx("option", { key: f.id, value: f.id }, f.title));
            });
        }
        let titleLabelKey = 'wro_saveModel_title';
        if (!hasTitle)
            titleLabelKey = 'wro_saveModel_titleRequired';
        return (jsx(Form, { className: 'widget-wro-form' },
            jsx(FormGroup, null,
                jsx(Label, { for: id + '_title' }, nls(titleLabelKey)),
                jsx(TextInput, { id: id + '_title', type: 'text', onChange: this.handleTitleChange })),
            jsx(FormGroup, null,
                jsx(Label, { for: id + '_summary' }, nls('wro_saveModel_summary')),
                jsx(TextInput, { id: id + '_summary', type: 'text', onChange: this.handleSummaryChange })),
            jsx(FormGroup, null,
                jsx(Label, { for: id + '_description' }, nls('wro_saveModel_description')),
                jsx(TextArea, { id: id + '_description', onChange: this.handleDescriptionChange })),
            jsx(FormGroup, null,
                jsx(Label, { for: id + '_tags' }, nls('wro_saveModel_tags')),
                jsx(TextInput, { id: id + '_tags', type: 'text', defaultValue: tags, onChange: this.handleTagsChange })),
            jsx(FormGroup, null,
                jsx(Label, { for: id + '_folder' }, nls('wro_saveModel_folder')),
                jsx(Select, { id: id + '_folder', defaultValue: home, onChange: this.handleFolderChange }, folderOptions))));
    }
}
//# sourceMappingURL=export.js.map