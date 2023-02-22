/* eslint-disable multiline-ternary */
/** @jsx jsx */
import { React, Immutable, DataSourceManager, jsx, SessionManager, css, moduleLoader, portalUrlUtils, DataSourceTypes, getAppStore, semver } from 'jimu-core';
import { builderAppSync } from 'jimu-for-builder';
import { appServices } from 'jimu-for-builder/service';
import { MapWidgetSelector, SettingSection, SettingRow, JimuLayerViewSelector } from 'jimu-ui/advanced/setting-components';
import { ArcGISDataSourceTypes } from 'jimu-arcgis';
import { Button, TextInput, TextArea, Select, Radio, Switch, Label, Modal, AlertPopup, TagInput, AdvancedSelect } from 'jimu-ui';
import { survey123Service } from '../service/survey123.service';
import defaultMessages from './translations/default';
import { getStyle, getModalStyle } from './css/style';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { LinkHorizontalOutlined } from 'jimu-icons/outlined/application/link-horizontal';
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash';
export default class Setting extends React.PureComponent {
    // private _survey123HostUrl: string = survey123Service.getSurvey123HostUrl();
    // private _dsManager = DataSourceManager.getInstance();
    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * state variable
         */
        this.supportedMapTypes = Immutable([ArcGISDataSourceTypes.WebMap]);
        this.supportedLayerTypes = Immutable([DataSourceTypes.FeatureLayer]);
        this.dsManager = DataSourceManager.getInstance();
        this.state = {
            userTags: [],
            canCreateSurvey: true,
            loadApiFailed: false,
            /**
             * survey123
             */
            newSurveyTitle: null,
            newSurveyTags: [],
            newSurveyTitleDirty: false,
            newSurveyTagsDirty: false,
            newSurveySnippet: null,
            newSurveyItemId: null,
            newSurveyThumbnailUrls: [
                'https://survey123.arcgis.com/assets/img/default-thumbnails/Image01.png',
                'https://survey123.arcgis.com/assets/img/default-thumbnails/Image02.png',
                'https://survey123.arcgis.com/assets/img/default-thumbnails/Image03.png'
            ],
            newSurveyMsg: null,
            newSurveyLoading: false,
            existSurveyMsg: null,
            existSharedSurveyMsg: null,
            existSurveys: [],
            existSharedSurveys: [],
            selectedSurvey: null,
            selectedMyOwnSurvey: null,
            selectedSharedSurvey: null,
            currentActiveSurvey: null,
            modalIsOpen: false,
            mode: 'none',
            isCheckedSurveyItemId: false,
            isShowSurveyQuestionField: false,
            surveyQuestionFields: [],
            selectedQuestionField: null,
            createSurveyErrorMsg: null,
            surveyStatusCode: 0,
            isShowCloseDesignerAlert: false,
            surveyChanged: false,
            /**
             * data source
             */
            dsMapView: null,
            dsFeatureLayer: null,
            dsFeatureLayerFields: [],
            /**
             * field-question mapping
             */
            mapWidgetList: [],
            addMapping: null,
            editMapping: null,
            /**
             * selected layer info for view/edit mode
             */
            layerViewInfoInNewMode: null,
            layerViewInfoInEditMode: null,
            layerViewInfoInViewMode: null,
            useMapWidgetIdsInNewMode: null,
            useMapWidgetIdsInEditMode: null,
            useMapWidgetIdsInViewMode: null
        };
        this.newDefaultValue = {
            key: '',
            value: ''
        };
        this.API = {
            survey123: null,
            Survey123WebForm: null
        };
        this.isPortal = false;
        this.isOrgAdmin = false;
        this.isTagRequired = false;
        /**
         * for old app created before 9.3, set the default mode as 'new'
         * set state from saved config
         */
        this.setDefaultVal = () => {
            if (!this.props.config.mode) {
                this.setMode('new');
            }
            const mode = this.props.config.mode || 'new';
            const layerViewInfo = this.props.config.layerViewInfo || null;
            const useMapWidgetIds = this.props.useMapWidgetIds || null;
            if (mode === 'new') {
                this.setState({
                    layerViewInfoInNewMode: layerViewInfo,
                    useMapWidgetIdsInNewMode: useMapWidgetIds
                });
            }
            else if (mode === 'edit') {
                this.setState({
                    layerViewInfoInEditMode: layerViewInfo,
                    useMapWidgetIdsInEditMode: useMapWidgetIds
                });
            }
            else if (mode === 'view') {
                this.setState({
                    layerViewInfoInViewMode: layerViewInfo,
                    useMapWidgetIdsInViewMode: useMapWidgetIds
                });
            }
        };
        /**
         * prepare:
         * get survey123 host url from portal's config.js
         * load survey123 js api
         */
        this.prepare = () => {
            return Promise.resolve(true)
                .then(() => {
                if (this.isPortal) {
                    const portalUrl = this.props.config.portalUrl || this.props.portalUrl;
                    return survey123Service.getSurveyHostUrlFromPortal(portalUrl);
                }
                return true;
            })
                /**
                 * load survey client api if it's connecting to portal
                 */
                .then(() => {
                if (this.isPortal) {
                    return this.loadSurveyAPI();
                }
                return true;
            });
        };
        // set state: dsFeatureLayer after loaded if the dataSourceId exist
        this.componentDidMount = () => {
            this.checkPrivilige();
            const useDataSources = this.props.useDataSources;
            const dataSourceId = (useDataSources && useDataSources.length) ? useDataSources[0].dataSourceId : null;
            if (dataSourceId) {
                const dataSource = this.dsManager.getDataSource(dataSourceId);
                const layer = dataSource ? dataSource.layer : null;
                this.setState({
                    dsFeatureLayer: layer,
                    dsFeatureLayerFields: this.getLayerFields(layer)
                });
            }
            const user = this.props.user;
            this.isOrgAdmin = !!((user && user.role === 'org_admin'));
            this.isPortal = !(portalUrlUtils.isAGOLDomain(this.props.config.portalUrl || this.props.portalUrl));
            this.checkTagRequired();
            this.getUserTags();
        };
        // load survey api
        this.loadSurveyAPI = () => {
            const apiUrl = survey123Service.getSurvey123HostAPIUrl();
            if (!this.API.survey123) {
                return moduleLoader.loadModule(apiUrl)
                    .then((survey123) => {
                    this.API = survey123;
                    // this.API.Survey123WebForm = Survey123WebForm;
                    if (!survey123) {
                        const apiErrMsg = this.props.intl.formatMessage({ id: 'errLoadS123JSAPI', defaultMessage: defaultMessages.errLoadS123JSAPI }, { S123JSAPIURL: apiUrl });
                        this.setState({
                            loadApiFailed: true
                        });
                        throw new Error(apiErrMsg);
                    }
                    else {
                        this.setState({
                            loadApiFailed: false,
                            existSurveyMsg: '',
                            existSharedSurveyMsg: '',
                            newSurveyMsg: ''
                        });
                    }
                    return survey123;
                });
            }
            else {
                return Promise.resolve(this.API.survey123);
            }
        };
        /**
         * check the user privilige of creating featureservice and creating portal item
         */
        this.checkPrivilige = () => {
            const user = getAppStore().getState().user;
            const privileges = user.privileges || [];
            const canCreateSurvey = privileges.includes('portal:user:createItem') && privileges.includes('portal:publisher:publishFeatures');
            this.setState({
                canCreateSurvey: canCreateSurvey
            });
        };
        /**
         * tags for an item become optional since portal 10.9.1(the rest api version of portal 10.9.2 is 9.2)
         */
        this.checkTagRequired = () => {
            let portalVersion = this.props.portalSelf ? this.props.portalSelf.currentVersion : null;
            this.isTagRequired = false;
            if (portalVersion && this.isPortal) {
                if ((portalVersion + '').split('.').length < 3) {
                    portalVersion += '.0';
                }
                try {
                    this.isTagRequired = semver.lt(portalVersion, '9.2.0');
                }
                catch (e) {
                    // ignore
                }
            }
            return this.isTagRequired;
        };
        /**
         * get user tags
         * @returns
         */
        this.getUserTags = () => {
            if (window.jimuConfig.isDevEdition) {
                return false;
            }
            const username = getAppStore().getState().user.username;
            appServices.getUserTags(username).then(res => {
                var _a;
                const userTags = (_a = res === null || res === void 0 ? void 0 : res.tags) === null || _a === void 0 ? void 0 : _a.map(el => {
                    return el.tag;
                });
                this.setState({
                    userTags: userTags || []
                });
            });
        };
        this.getLayerFields = (layer) => {
            if (!layer) {
                return [];
            }
            // clone the layer.fields
            const fields = Object.assign({}, { fields: layer.fields }).fields;
            if (layer.type !== 'feature') {
                // table or other type (has no geometry)
                return fields;
            }
            const existGeoField = (fields || []).find((item) => {
                return item.name === 'geometry';
            });
            if (existGeoField) {
                return fields;
            }
            const type = layer.geometryType;
            const geometryTypeStr = this.nls('geometryType' + type.substr(0, 1).toUpperCase() + type.substr(1));
            fields.push({
                alias: `${this.nls('geometryLabel')}(${geometryTypeStr})`,
                name: 'geometry'
            });
            return fields;
        };
        /**
         * on setting value changed
         */
        this.onValueChanged = (evt) => {
            const target = evt.currentTarget;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(target.name, target.value)
            });
        };
        this.nls = (id, params) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }, params);
        };
        /**
         * add default value
         */
        this.addDefaultValue = (evt) => {
            if (this.newDefaultValue.key && this.newDefaultValue.value) {
                /**
                 * clear newDefaultValue key / value
                 */
                this.newDefaultValue = {
                    key: '',
                    value: ''
                };
            }
        };
        /**
         * listen to the desinger iframe
         */
        this.addDesigerHandler = () => {
            window.addEventListener('message', (evt) => {
                if (evt.data) {
                    let data = evt.data;
                    // if the window get the message from other iframe, maybe it cannot be converted to object
                    // We can only sure the message from webform can be converted to object
                    try {
                        if (typeof evt.data === 'string') {
                            data = JSON.parse(evt.data) || {};
                        }
                    }
                    catch (e) {
                        // don't show the error
                    }
                    if (data.event === 'survey123:design:onFormPublished' && data.data) {
                        let surveyStatusCode = this.state.surveyStatusCode || 0;
                        surveyStatusCode++;
                        builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'surveyStatusCode', value: surveyStatusCode });
                        this.setState({
                            surveyStatusCode: surveyStatusCode
                        });
                        this.handleCloseModal();
                    }
                    else if (data.event === 'survey123:design:onFormUnsaved' && data.data) {
                        this.setState({
                            surveyChanged: true
                        });
                    }
                    else if (data.event === 'survey123:design:onFormSaved' && data.data) {
                        this.setState({
                            surveyChanged: false
                        });
                    }
                }
            });
        };
        /**
         * get field alias by fild name
         */
        this.getFielAlias = (field) => {
            const fields = this.state.dsFeatureLayerFields || [];
            const target = fields.find((item) => {
                return item.name === field;
            });
            if (target) {
                return target.alias || target.name;
            }
            return field;
        };
        /**
         * get question label by question name
         */
        this.getQuestionLabel = (questionName) => {
            const questions = this.state.surveyQuestionFields || [];
            const target = questions.find((item) => {
                return item.name === questionName;
            });
            if (target) {
                return target.label || target.name;
            }
            return questionName;
        };
        /**
         * on new survey value changed
         */
        this.onNewSurveyValueChanged = (e, type) => {
            const target = e.currentTarget;
            if (type) {
                this.setState({
                    [type]: target.value
                });
            }
            if (type === 'newSurveyTags') {
                this.setState({
                    newSurveyTagsDirty: true
                });
            }
            if (type === 'newSurveyTitle') {
                this.setState({
                    newSurveyTitleDirty: true
                });
            }
        };
        /**
         * switch the survey source type(from myown surveys or others‘ surveys)
         * @param type
         */
        this.onSurveySourceTypeChange = (type) => {
            this.setState({
                mode: type,
                currentActiveSurvey: type === 'survey-selectExistingSharedSurvey' ? this.state.selectedSharedSurvey : this.state.selectedMyOwnSurvey,
                selectedSurvey: type === 'survey-selectExistingSharedSurvey' ? this.state.selectedSharedSurvey : this.state.selectedMyOwnSurvey
            });
        };
        /**
         * onExistSurveyChanged
         */
        this.onExistSurveyChanged = (valuePairs) => {
            if (valuePairs && valuePairs.length) {
                this.updateMapWidgetList();
                this.setState({
                    selectedSurvey: valuePairs[0],
                    currentActiveSurvey: valuePairs[0]
                });
                if (this.state.mode === 'survey-selectExistingSharedSurvey') {
                    this.setState({
                        selectedSharedSurvey: valuePairs[0]
                    });
                }
                else {
                    this.setState({
                        selectedMyOwnSurvey: valuePairs[0]
                    });
                }
            }
            else {
                this.setState({
                    selectedSurvey: null,
                    currentActiveSurvey: null
                });
                if (this.state.mode === 'survey-selectExistingSharedSurvey') {
                    this.setState({
                        selectedSharedSurvey: null
                    });
                }
                else {
                    this.setState({
                        selectedMyOwnSurvey: null
                    });
                }
            }
            // if (target.value && target.value !== 'null') {
            //   /**
            //    * update selected survey
            //    */
            //   const selectedSurvey = this.state.existSurveys.find((survey) => survey.id === target.value)
            //   this.updateMapWidgetList()
            //   this.setState({
            //     selectedSurvey: selectedSurvey
            //   })
            // }
        };
        /**
         * create survey
         */
        this.createSurvey = () => {
            if (!this.state.canCreateSurvey) {
                return;
            }
            /**
             * handle title, tags, description
             */
            const title = this.state.newSurveyTitle ? this.state.newSurveyTitle.trim() : '';
            let tags = null;
            if (this.state.newSurveyTags && this.state.newSurveyTags.length) {
                tags = this.state.newSurveyTags.map((tag) => tag.trim());
            }
            const snippet = this.state.newSurveySnippet;
            if (!title) {
                this.setState({
                    newSurveyTitleDirty: true
                });
            }
            if (this.isTagRequired) {
                if (!this.state.newSurveyTags || !this.state.newSurveyTags.length) {
                    this.setState({
                        newSurveyTagsDirty: true
                    });
                }
            }
            if (!title) {
                return;
            }
            if (this.isTagRequired && (!tags || !tags.length)) {
                return;
            }
            return Promise.resolve(true)
                .then(() => {
                var _a;
                /**
                 * update msg
                 */
                this.setState({
                    newSurveyMsg: '',
                    newSurveyLoading: true
                });
                const randomIdx = parseInt(Math.random() * 10 + '') % 3;
                const thumbnail = this.state.newSurveyThumbnailUrls[randomIdx];
                if (this.isPortal) {
                    const options = {
                        title: title,
                        tags: tags,
                        token: this.props.token,
                        thumbnailUrl: thumbnail,
                        portalUrl: this.props.config.portalUrl || this.props.portalUrl
                    };
                    return this.API.survey123.createSurvey(options);
                }
                else {
                    return survey123Service.createSurvey(title, tags, {
                        token: this.props.token,
                        username: (_a = this.props.user) === null || _a === void 0 ? void 0 : _a.username,
                        /**
                         * portalUrl
                         */
                        portalUrl: this.props.config.portalUrl || this.props.portalUrl
                    }, {
                        snippet: snippet,
                        thumbnailUrl: thumbnail
                    });
                }
            })
                .then((res) => {
                if ((this.isPortal && res.id) || (!this.isPortal && res.success === true)) {
                    this.updateMapWidgetList();
                    /**
                     * set item id
                     */
                    this.setState({
                        createSurveyErrorMsg: null,
                        newSurveyItemId: res.id,
                        selectedSurvey: res,
                        newSurveyLoading: false
                    });
                    return res.id;
                }
                throw res;
            })
                .then((itemId) => {
                if (!itemId) {
                    return;
                }
                /**
                 * we should set hides in config
                 */
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('hides', ['navbar', 'header', 'description', 'footer', 'theme'])
                });
                /**
                 * show survey123 designer modal
                 */
                this.showSurvey123DesignerModal(itemId);
            })
                .catch((err) => {
                if (err) {
                    /**
                     * In fact, if the error code is 400, the reason can be multiple, maybe it's not because the survey name is duplicated.
                     * update msg
                     */
                    // if (err.error && err.error.code + '' === '400') {
                    //   this.setState({
                    //     createSurveyErrorMsg: this.props.intl.formatMessage({ id: 'surveyTitleDuplicateMsg', defaultMessage: defaultMessages.surveyTitleDuplicateMsg }),
                    //     newSurveyLoading: false,
                    //     newSurveyTitleDirty: false
                    //   })
                    //   return null
                    // } else {
                    const error = err.error ? err.error : err;
                    let errorMsg = error.message ? error.message : (typeof error === 'string') ? err : '';
                    if (error.details && error.details.length) {
                        error.details.forEach((detail) => {
                            errorMsg += ' ' + detail;
                        });
                    }
                    this.setState({
                        newSurveyMsg: errorMsg || 'Create survey failed.',
                        newSurveyLoading: false
                    });
                    // }
                }
                console.error(err);
            });
        };
        /**
         * query survey
         */
        this.querySurvey = (options) => {
            options = options || {};
            return Promise.resolve(true)
                .then(() => {
                var _a;
                // todo: remove the belowing codes?
                if (this.props.config.surveyItemId && this.props.config.selectedSurvey) {
                    const selectedSurvey = this.props.config.selectedSurvey;
                    // this.state.mode = 'settings';
                    setTimeout(() => {
                        this.props.onSettingChange({
                            id: this.props.id,
                            config: this.props.config.set('surveyItemId', selectedSurvey.id)
                        });
                        /**
                         * switch to settings page
                         */
                        this.updateMapWidgetList();
                        this.setState({
                            existSurveyMsg: null,
                            mode: 'settings',
                            selectedSurvey: selectedSurvey
                        });
                    }, 0);
                    // options
                    const queryMySurveyOption = Object.assign({
                        isPublished: false
                    }, options || {});
                    const queryOption = {
                        isPublished: queryMySurveyOption.isPublished,
                        queryFromClient: this.isPortal,
                        surveyClientAPI: this.API
                    };
                    // if (this.isOrgAdmin) {
                    //   queryOption.searchSurveyType = 'all-admin'
                    // }
                    return survey123Service.querySurvey({
                        username: (_a = this.props.user) === null || _a === void 0 ? void 0 : _a.username,
                        token: this.props.token,
                        portalUrl: this.props.config.portalUrl || this.props.portalUrl
                    }, queryOption)
                        .then((surveys) => {
                        const surveyItems = this.getSurveyItems(surveys);
                        this.setState({
                            existSurveys: surveyItems
                        });
                    });
                }
            })
                .then(() => {
                if (this.state.mode === 'none') {
                    this.setState({
                        mode: 'survey-createSurvey'
                    });
                }
                /**
                 * update msg
                 */
                this.setState({
                    existSurveyMsg: '<div class="survey-list-loading-outter"><div class="jimu-secondary-loading"></div></div>'
                });
                // query my surveys
                // options
                const queryMySurveyOption = Object.assign({
                    isPublished: false
                }, options || {});
                const queryOption = {
                    isPublished: queryMySurveyOption.isPublished,
                    queryFromClient: this.isPortal,
                    surveyClientAPI: this.API
                };
                /**
                 * According to https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/7026#issuecomment-3735803
                 * event the current user is org admin, should still only show my owned surveys here
                 * other's survey will be shown in the third radio item(Select others' survey)
                 */
                // if (this.isOrgAdmin) {
                //   queryOption.searchSurveyType = 'all-admin'
                // }
                return survey123Service.querySurvey({
                    username: this.props.user.username,
                    token: this.props.token,
                    portalUrl: this.props.config.portalUrl || this.props.portalUrl
                }, queryOption);
            })
                .then((surveys) => {
                /**
                 * update msg(for my existing surveys)
                 */
                const surveyItems = this.getSurveyItems(surveys);
                this.setState({
                    existSurveyMsg: null,
                    existSurveys: surveyItems
                });
                if (!surveys || !surveys.length) {
                    this.setState({
                        existSurveyMsg: `<p class="no-survey-message">${this.props.intl.formatMessage({ id: 'noExistingSurvey', defaultMessage: defaultMessages.noExistingSurvey })}</p>`
                    });
                }
            })
                /**
                 * query shared surveys
                 */
                .then(() => {
                this.setState({
                    existSharedSurveyMsg: '<div class="survey-list-loading-outter"><div class="jimu-secondary-loading"></div></div>'
                });
                /**
                 * According to https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/7026#issuecomment-3735803
                 * we are searching others' survey here by sending reqeuests to AGO rest api in exb side, because survey api cannot do this currently,
                 * will use survey api when this feature is supported in the future.
                 */
                return survey123Service.queryOthersSurvey({
                    username: this.props.user.username,
                    token: this.props.token,
                    portalUrl: this.props.config.portalUrl || this.props.portalUrl
                }, {
                    orgId: this.props.portalSelf ? this.props.portalSelf.id : null
                });
            })
                .then((sharedSurveys) => {
                /**
                 * update msg(for shared surveys)
                 */
                const surveyItems = this.getSurveyItems(sharedSurveys);
                this.setState({
                    existSharedSurveyMsg: null,
                    existSharedSurveys: surveyItems
                });
                if (!sharedSurveys || !sharedSurveys.length) {
                    // todo: will use the new string when the string is ready
                    // https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/11116
                    this.setState({
                        existSharedSurveyMsg: `<p class="no-survey-message">${this.props.intl.formatMessage({ id: 'noExistingSurvey', defaultMessage: defaultMessages.noExistingSurvey })}</p>`
                    });
                }
            })
                .then(() => {
                /**
                 * update selected survey
                 */
                const usedSurveyItemId = this.props.config.surveyItemId;
                if (usedSurveyItemId) {
                    const selectedSurvey = this.state.existSurveys.find((survey) => survey.id === usedSurveyItemId);
                    const selectedSharedSurvey = this.state.existSharedSurveys.find((survey) => survey.id === usedSurveyItemId);
                    const targetSurvey = selectedSurvey || selectedSharedSurvey;
                    if (targetSurvey) {
                        this.updateMapWidgetList();
                        this.setState({
                            selectedSurvey: targetSurvey
                        });
                        this.props.onSettingChange({
                            id: this.props.id,
                            config: this.props.config.set('selectedSurvey', targetSurvey)
                        });
                    }
                }
            })
                .catch((err) => {
                this.setState({
                    mode: 'survey-createSurvey',
                    existSurveyMsg: `<p class="error-message">${this.props.intl.formatMessage({ id: 'errmsgGeneralLoading', defaultMessage: defaultMessages.errmsgGeneralLoading })}</p>`
                });
                console.log(err);
            });
        };
        /**
         * convert survey to AdvancedSelectItem type
         * @param surveys
         */
        this.getSurveyItems = (surveys) => {
            // const surveyItems = [];
            (surveys || []).forEach((survey) => {
                survey.value = survey.id;
                survey.label = survey.title;
                survey.render = () => {
                    return (jsx("div", { css: css `width: 178px;text-overflow: ellipsis; white-space: nowrap;overflow: hidden;`, title: survey.title },
                        jsx("span", null, survey.title)));
                };
            });
            return surveys;
        };
        /**
         * get survey question fields
         */
        this.getSurveyQuestionFields = () => {
            const surveyItemId = this.props.config.surveyItemId;
            return Promise.resolve(true)
                .then(() => {
                if (surveyItemId && this.props.token && this.isPortal && this.API.getForm) {
                    const params = {
                        itemId: surveyItemId,
                        token: this.props.token,
                        portalUrl: this.props.config.portalUrl || this.props.portalUrl || 'https://www.arcgis.com'
                    };
                    return this.API.getForm(params);
                }
                return null;
            })
                .then((res) => {
                // if the request from js api failed, try to request the rest api
                if (res && res.questions) {
                    return res;
                }
                if (surveyItemId && this.props.token) {
                    return survey123Service.getSurveyQuestionFields(surveyItemId, {
                        token: this.props.token,
                        portalUrl: this.props.config.portalUrl || this.props.portalUrl || 'https://www.arcgis.com'
                    });
                }
                return null;
            })
                .then((res) => {
                const fields = [];
                if (res && res.questions && res.questions.length > 0) {
                    // flat the questions tree, move the questions out if they are in the group.
                    const questions = survey123Service.flatQuestions(res.questions);
                    questions.forEach((q) => {
                        const shortType = (q.type + '').replace('esriQuestionType', '');
                        if (q.fieldName || ['geopoint', 'polyline', 'polygon'].includes(shortType.toLowerCase())) {
                            fields.push({
                                name: q.fieldName || q.name,
                                label: q.label
                            });
                        }
                    });
                }
                if (res.error && res.error.message) {
                    console.warn('Cannot get survey question fields for survey: ' + surveyItemId, res.error.message);
                }
                this.setState({
                    surveyQuestionFields: fields
                });
                return fields;
            });
        };
        /**
         * remove default value
         */
        // removeDefaultValue = (key: string, evt: any) => {
        //   let defaultValue = this.props.config.defaultValue;
        //   if (key && defaultValue[key]) {
        //     delete defaultValue[key];
        //   }
        // }
        /**
         * show setting page
         */
        this.showSettingPage = () => {
            this.setState({
                mode: 'settings'
            });
            /**
             * get survey question fields
             */
            this.getSurveyQuestionFields();
        };
        /**
         * handle close modal
         */
        this.handleCloseModal = () => {
            if (this.state.surveyChanged) {
                this.setState({
                    isShowCloseDesignerAlert: true
                });
                return;
            }
            this.setState({
                modalIsOpen: false
            });
            this.setState({
                surveyChanged: false
            });
            this.showSettingPage();
            /**
             * update survey itemid in props config
             */
            const surveyItemId = this.state.newSurveyItemId || this.props.config.surveyItemId;
            if (surveyItemId) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('surveyItemId', surveyItemId).set('timestamp', Date.now()).set('mode', 'new')
                });
            }
            /**
             * update the survey list
             */
            this.querySurvey();
        };
        /**
         * handler close desinger alert popup
         */
        this.handleCloseDesignerAlert = (isOk) => {
            this.setState({
                isShowCloseDesignerAlert: false
            });
            if (isOk) {
                this.setState({
                    surveyChanged: false
                });
                setTimeout(() => {
                    this.handleCloseModal();
                }, 0);
            }
        };
        this.onTagInputChange = (data) => {
            this.setState({
                newSurveyTags: data
            });
        };
        /**
         * get thumbnail url from portal
         */
        this.getThumbnailUrl = () => {
            const portalUrl = this.props.config.portalUrl || this.props.portalUrl || 'https://www.arcgis.com';
            const surveyItemId = this.state.selectedSurvey.id;
            const thumbnail = this.state.selectedSurvey.thumbnail;
            if ((thumbnail + '').startsWith('http://') || (thumbnail + '').startsWith('https://')) {
                return thumbnail;
            }
            return `${portalUrl}/sharing/rest/content/items/${surveyItemId}/info/${thumbnail}?token=${this.props.token}`;
        };
        /**
         * set survey item id
         * update this.props.config
         */
        this.setSurveyItemId = () => {
            const selectedSurvey = this.state.selectedSurvey;
            if (selectedSurvey && selectedSurvey.id) {
                /**
                 * update props to have the same setting in runtime
                 * and ensure the hides are all switched on
                 */
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('surveyItemId', selectedSurvey.id).set('hides', ['navbar', 'header', 'description', 'footer', 'theme']).set('mode', 'new')
                });
                /**
                 * switch to settings page
                 */
                this.setState({
                    mode: 'settings'
                });
            }
        };
        /**
         * edit survey
         */
        this.editSurvey = () => {
            this.showSurvey123DesignerModal();
        };
        /**
         * set appearance
         */
        this.setAppearance = (isChecked, value) => {
            // let target = e.currentTarget;
            // let value = target.value;
            // clone this.props.config.hides
            const hides = [].concat(this.props.config.hides || []);
            // let isChecked = target.checked;
            if (isChecked && hides.indexOf(value) >= 0) {
                const pos = hides.indexOf(value);
                hides.splice(pos, 1);
                // hides = hides.concat([value])
            }
            else {
                hides.push(value);
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('hides', hides)
            });
        };
        /**
         * set survey mode: new/view/edit
         * @param mode
         * @returns
         */
        this.setMode = (mode) => {
            if (this.props.config.mode === mode) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('mode', mode)
            });
        };
        /**
         * set selected map view
         */
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            // update the state first.
            const mode = this.props.config.mode || 'new';
            if (mode === 'new') {
                if (!useMapWidgetIds || !useMapWidgetIds.length) {
                    this.clearMapping();
                }
                this.setState({
                    useMapWidgetIdsInNewMode: useMapWidgetIds
                });
            }
            else if (mode === 'edit') {
                this.setState({
                    useMapWidgetIdsInEditMode: useMapWidgetIds
                });
            }
            else if (mode === 'view') {
                this.setState({
                    useMapWidgetIdsInViewMode: useMapWidgetIds
                });
            }
            // then update the config.useMapWidgetIds.
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        /**
         * on feature layer view selected
         */
        // onFeatureLayerViewSelected = (useDataSources: UseDataSource[]) => {
        //   const d = useDataSources[0];
        //   if (d && d.dataSourceJson && d.rootDataSourceId) {
        //     /**
        //      * update state
        //      */
        //     this.setState({
        //       dsMapView: null,
        //       dsFeatureLayer: d
        //     });
        //     /**
        //      * embed params
        //      */
        //     let embeds = this.props.config.embeds || [];
        //     if (embeds.indexOf('associatedMap') === -1) {
        //       embeds = embeds.concat(['associatedMap']);
        //     }
        //     /**
        //      * update useDataSources
        //      */
        //     this.props.onSettingChange({
        //       id: this.props.id,
        //       config: this.props.config.set('embeds', embeds).set('dsType', ArcGISDataSourceTypes.FeatureLayer)
        //       /* useDataSources: Immutable([{
        //         dataSourceId: d.dataSourceJson.id,
        //         rootDataSourceId: d.rootDataSourceId
        //       }]) as ImmutableArray<IMUseDataSource> */
        //     });
        //   }
        // }
        this.updateMapWidgetList = () => {
            // get the map widget list
            const state = window._appState;
            const appConfig = window && window.jimuConfig && window.jimuConfig.isBuilder ? state.appStateInBuilder && state.appStateInBuilder.appConfig : state.appConfig;
            const widgets = appConfig && appConfig.widgets;
            // eslint-disable-next-line max-len
            const mapWidgetList = widgets ? Object.keys(widgets).filter(wId => widgets[wId] && widgets[wId].manifest && widgets[wId].manifest.properties && widgets[wId].manifest.properties.canCreateMapView).map(wId => widgets[wId]) : [];
            this.setState({
                mapWidgetList: mapWidgetList
            });
        };
        this.activeLinkDataChange = (e) => {
            const target = e.currentTarget;
            const isActive = target.checked;
            if (isActive) {
                this.updateMapWidgetList();
            }
            /**
             * update activeLinkData in data source
             */
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('activeLinkData', isActive)
            });
        };
        /**
         * on map view selected
         */
        // onMapViewSelected = (useDataSources: UseDataSource[], d: UseDataSource) => {
        //   if (d && d.dataSourceJson) {
        //     // if (d && d.dataSourceJson && d.rootDataSourceId) {
        //     // let mapViewDSJson = d.dataSourceJson;
        //     /**
        //      * update state
        //      */
        //     this.setState({
        //       dsMapView: d,
        //       dsFeatureLayer: null,
        //       dsFeatureLayerFields: []
        //     });
        //     /**
        //      * embed params
        //      */
        //     let embeds = this.props.config.embeds || [];
        //     if (embeds.indexOf('associatedMap') === -1) {
        //       embeds = embeds.concat(['associatedMap']);
        //     }
        //     /**
        //      * update props
        //      */
        //     this.props.onSettingChange({
        //       id: this.props.id,
        //       config: this.props.config.set('embeds', embeds).set('selectedSurveyQuestionFields', []).set('dsType', ArcGISDataSourceTypes.Map)
        //       /* useDataSources: Immutable([{
        //         dataSourceId: d.dataSourceJson.id,
        //         rootDataSourceId: d.rootDataSourceId
        //       }]) as ImmutableArray<IMUseDataSource> */
        //     });
        //   }
        // }
        /**
         * on feature layer field selected
         */
        this.onFieldSelected = (allSelectedFields, field, ds) => {
            /**
             * update fields in data source
             */
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['title', 'field'], field.name),
                useDataSources: [{
                        dataSourceId: this.props.useDataSources[0].dataSourceId,
                        mainDataSourceId: this.props.useDataSources[0].mainDataSourceId,
                        dataViewId: this.props.useDataSources[0].dataViewId,
                        rootDataSourceId: this.props.useDataSources[0].rootDataSourceId,
                        fields: [field.name]
                    }]
            });
        };
        /**
         * select a feature layer
         * todo: check and remove the layerViewInfo from config, move it to state
         */
        this.onDataSourceSelected = (jimuLayerViewInfo) => {
            // todo: consider the mode
            const mode = this.props.config.mode || 'new';
            if (mode === 'new' && !jimuLayerViewInfo) {
                this.clearMapping();
            }
            const dataSourceId = jimuLayerViewInfo ? jimuLayerViewInfo.dataSourceId : null;
            const dataSource = this.dsManager.getDataSource(dataSourceId);
            const layer = dataSource ? dataSource.layer : null;
            if (mode === 'new') {
                if (!dataSourceId || !dataSource || !layer) {
                    this.clearMapping();
                }
                this.setState({
                    layerViewInfoInNewMode: jimuLayerViewInfo,
                    dsFeatureLayer: layer,
                    dsFeatureLayerFields: this.getLayerFields(layer)
                });
            }
            else if (mode === 'edit') {
                this.setState({
                    layerViewInfoInEditMode: jimuLayerViewInfo
                });
            }
            else if (mode === 'view') {
                this.setState({
                    layerViewInfoInViewMode: jimuLayerViewInfo
                });
            }
            // let schema = null;
            // if (dataSource) {
            //   schema = dataSource.getSchema();
            //   fields = schema ? (schema.fields || []) : [];
            // }
            const rootDataSourceId = jimuLayerViewInfo ? jimuLayerViewInfo.rootDataSourceId : null;
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: [{
                        dataSourceId: dataSourceId,
                        mainDataSourceId: dataSourceId,
                        rootDataSourceId: rootDataSourceId
                    }],
                config: this.props.config.set('layerViewInfo', jimuLayerViewInfo).set('fieldQuestionMapping', null)
            });
            // this.props.onSettingChange({
            //   id: this.props.id,
            //   useDataSources: [{
            //     dataSourceId: currentSelectedDs.dataSourceJson.id,
            //     rootDataSourceId: currentSelectedDs.rootDataSourceId
            //   }],
            // }, [{
            //   id: `${this.props.id}-output`,
            //   label: `${this.props.label} Query Result`,
            //   type: ArcGISDataSourceTypes.FeatureLayerView,
            //   originDataSources: [{dataSourceId: currentSelectedDs.dataSourceJson.id, rootDataSourceId: currentSelectedDs.rootDataSourceId}]
            // }]);
        };
        /**
         * change the layer field in field-question mapping panel
         */
        this.addMapppingChange = (type, e) => {
            const target = e.currentTarget;
            const value = target.value;
            let field = this.state.addMapping ? this.state.addMapping.field : null;
            let question = this.state.addMapping ? this.state.addMapping.question : null;
            if (type === 'field') {
                field = value;
            }
            else {
                question = value;
            }
            this.setState({
                addMapping: {
                    field: field,
                    question: question
                }
            });
        };
        /**
         * clear the setting of field-question mapping
         */
        this.clearMapping = () => {
            // todo:
        };
        this.onDataSourceRemoved = () => {
            // todo
        };
        /**
         * trigger evnet type change
         */
        this.triggerEventTypeChange = () => {
        };
        /**
         * show edit mapping panel
         */
        this.showEditMappingPanel = (index, e) => {
            const curEditMapping = this.state.editMapping || {};
            if (curEditMapping.index === index) {
                return;
            }
            let mappings = this.props.config.fieldQuestionMapping || [];
            mappings = (index >= 0 && index < mappings.length) ? mappings[index] : null;
            const newMapping = Object.assign({}, mappings);
            newMapping.index = index;
            this.setState({
                editMapping: newMapping,
                addMapping: null
            });
        };
        /**
         * change the edit mapping
         */
        this.changeEditMapping = (type, e) => {
            const target = e.currentTarget;
            const value = target.value;
            const curSetting = Object.assign({}, this.state.editMapping || {});
            if (type === 'field') {
                curSetting.field = value;
            }
            else {
                curSetting.question = value;
            }
            this.setState({
                editMapping: curSetting
            });
        };
        /**
         * change an field/question mapping
         */
        this.editMapping = (index) => {
            const mapping = [].concat(this.props.config.fieldQuestionMapping || []);
            const curEditMapping = this.state.editMapping || {};
            if (index >= 0 && index < mapping.length) {
                mapping[index] = {
                    field: curEditMapping.field,
                    question: curEditMapping.question
                };
            }
            // delete mapping[field];
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('fieldQuestionMapping', mapping)
            });
        };
        /**
         * add connection for field and question
         */
        this.activeAddFieldQuestionConnPanel = () => {
            this.setState({
                addMapping: {
                    field: null,
                    question: null
                },
                editMapping: null
            });
        };
        /**
         * hide the field-question panel
         */
        this.deactiveAddFieldQuestionConnPanel = () => {
            this.setState({
                addMapping: null
            });
        };
        this.deleteConnection = (index, e) => {
            if (e) {
                e.stopPropagation();
            }
            const mapping = [].concat(this.props.config.fieldQuestionMapping || []);
            if (index >= 0 && index < mapping.length) {
                mapping.splice(index, 1);
            }
            // delete mapping[field];
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('fieldQuestionMapping', mapping)
            });
        };
        /**
         * add a field-question mapping
         */
        this.addFieldQuestionConn = (e) => {
            const field = this.state.addMapping.field;
            const question = this.state.addMapping.question;
            if (!field || !question) {
                console.log('Please ensure field/question is not null.');
                return;
            }
            const mapping = [].concat(this.props.config.fieldQuestionMapping || []);
            mapping.push({
                field: field,
                question: question
            });
            // mapping[field] = question;
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('fieldQuestionMapping', mapping)
            });
            this.deactiveAddFieldQuestionConnPanel();
        };
        /**
         * on survey question field changed
         */
        this.onSurveyQuestionFieldChanged = (e) => {
            const target = e.currentTarget;
            const value = target.value;
            /**
             * update fields in data source
             */
            if (value && value !== 'null') {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: this.props.config.set('selectedSurveyQuestionFields', [value])
                });
            }
        };
        /**
         * isDsConfigured
         */
        this.isDsConfigured = () => {
            if (this.props.useDataSources &&
                this.props.useDataSources.length === 1) {
                return true;
            }
            return false;
        };
        /**
         * reset survey
         */
        this.resetSurvey = () => {
            /**
             * reset survey item id
             */
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('surveyItemId', null).set('hides', [])
                    .set('embeds', ['fullScreen', 'onSubmitted'])
                    .set('selectedSurveyQuestionFields', [])
                    .set('fieldQuestionMapping', [])
                    .set('activeLinkData', false)
                    .set('dsType', null).set('selectedSurvey', null)
                    .set('mode', 'new')
            });
            this.setState({
                mode: 'survey-createSurvey',
                selectedSurvey: null,
                selectedMyOwnSurvey: null,
                selectedSharedSurvey: null,
                currentActiveSurvey: null,
                isCheckedSurveyItemId: false,
                surveyQuestionFields: [],
                dsMapView: null,
                dsFeatureLayer: null,
                dsFeatureLayerFields: []
            });
        };
        /**
         * query existing survey
         */
        survey123Service.setQueryObject(this.props.queryObject);
        this.isPortal = !(portalUrlUtils.isAGOLDomain(this.props.config.portalUrl || this.props.portalUrl));
        this.checkTagRequired();
        const user = this.props.user;
        this.isOrgAdmin = !!((user && user.role === 'org_admin'));
        this.prepare().then(() => {
            this.setDefaultVal();
            this.querySurvey();
            this.addDesigerHandler();
        })
            .catch((e) => {
            setTimeout(() => {
                if (this.state.loadApiFailed) {
                    this.setState({
                        existSurveyMsg: `<p class="error-message">${e.message || ''}</p>`,
                        existSharedSurveyMsg: `<p class="error-message">${e.message || ''}</p>`,
                        mode: 'survey-createSurvey',
                        newSurveyMsg: e.message || '',
                        loadApiFailed: true
                    });
                }
            }, 0);
        });
    }
    /**
     * show survey123 designer modal
     */
    showSurvey123DesignerModal(surveyItemId) {
        surveyItemId = surveyItemId || this.props.config.surveyItemId;
        const sessionManager = SessionManager.getInstance();
        const portalUrl = this.props.config.portalUrl || this.props.portalUrl;
        if (!surveyItemId) {
            throw new Error('cannot get survey item id to open survey123 designer');
        }
        /**
         * popup window and embed survey123 designer
         */
        let url = survey123Service.getSurvey123DesignerUrl(surveyItemId, {
            portalUrl: portalUrl
        });
        /**
         * we need to add access_token / username / expires_in in hash
         * to tell survey123 website to parse the hash to use the token
         */
        const session = sessionManager.getMainSession();
        if (session && session.token && session.username && session.tokenDuration) {
            url += `#access_token=${session.token}&username=${session.username}&expires_in=${session.tokenDuration}`;
        }
        /**
         * show modal
         */
        this.setState({
            modalIsOpen: true,
            newSurveyMsg: null
        });
        /**
         * cannot use window.open because address bar will be shown.
         * try to use modal and iframe to show survey123 designer webpage
         */
        // eslint-disable-next-line
        const self = this;
        let index = 0;
        const checkTimer = setInterval(() => {
            if (!self.state.modalIsOpen) {
                self.setState({
                    modalIsOpen: true
                });
            }
            index++;
            const target = document.getElementById('survey123-designer');
            if (target || index > 100) {
                clearInterval(checkTimer);
                target.src = url;
            }
        }, 50);
        // setTimeout(() => {
        //   let target: any = document.getElementById('survey123-designer');
        //   target.src = url;
        // }, 200);
    }
    /**
     * render
     */
    render() {
        // let defaultValue = this.props.config.defaultValue;
        // const usedFieldName = this.props.useDataSources && this.props.useDataSources[0] &&
        //   this.props.useDataSources[0].fields && this.props.useDataSources[0].fields[0];
        // const selectedSurveyQuestionField = this.props.config.selectedSurveyQuestionFields && this.props.config.selectedSurveyQuestionFields[0];
        /**
         * show setting page
         */
        if (this.state.selectedSurvey && this.props.config.surveyItemId && this.state.isCheckedSurveyItemId === false) {
            this.setState({
                isCheckedSurveyItemId: true
            });
            this.showSettingPage();
        }
        /**
         * render
         */
        return jsx("div", { css: getStyle(this.props.theme), className: "jimu-widget-setting survey123" },
            jsx("div", { className: "survey123__section", style: (this.state.mode.indexOf('survey-') !== -1)
                    ? { display: 'block' }
                    : { display: 'none' } },
                jsx(SettingSection, { role: 'radiogroup', "aria-label": this.nls('chooseSurvey') },
                    jsx(SettingRow, null,
                        jsx("p", { className: "choose-survey-label" }, this.props.intl.formatMessage({ id: 'chooseSurvey', defaultMessage: defaultMessages.chooseSurvey }))),
                    jsx(SettingRow, null,
                        jsx(Radio, { name: "survey-survey", className: "cursor-pointer", id: "survey-survey-createNewSurvey", checked: this.state.mode === 'survey-createSurvey', onChange: () => { this.setState({ mode: 'survey-createSurvey' }); } }),
                        jsx(Label, { for: "survey-survey-createNewSurvey", className: "cursor-pointer select-survey-label" }, this.props.intl.formatMessage({ id: 'createNewSurveyLabel', defaultMessage: defaultMessages.createNewSurveyLabel }))),
                    jsx(SettingRow, null,
                        jsx(Radio, { name: "survey-survey", className: "cursor-pointer", id: "survey-survey-chooseExistingSurvey", checked: this.state.mode === 'survey-selectExistingSurvey', onChange: () => { this.onSurveySourceTypeChange('survey-selectExistingSurvey'); } }),
                        jsx(Label, { for: "survey-survey-chooseExistingSurvey", className: "cursor-pointer select-survey-label" }, this.props.intl.formatMessage({ id: 'chooseSurveyLabel1', defaultMessage: defaultMessages.chooseSurveyLabel1 }))),
                    jsx(SettingRow, null,
                        jsx(Radio, { name: "survey-survey", className: "cursor-pointer", id: "survey-survey-chooseExistingSharedSurvey", checked: this.state.mode === 'survey-selectExistingSharedSurvey', onChange: () => { this.onSurveySourceTypeChange('survey-selectExistingSharedSurvey'); } }),
                        jsx(Label, { for: "survey-survey-chooseExistingSharedSurvey", className: "cursor-pointer select-survey-label" }, this.props.intl.formatMessage({ id: 'chooseSurveyLabel2', defaultMessage: defaultMessages.chooseSurveyLabel2 })))),
                jsx("div", { className: "survey123__section-selectExistingSurvey", role: "group", "aria-label": this.nls('chooseSurveyLabel1'), style: (this.state.mode === 'survey-selectExistingSurvey' || this.state.mode === 'survey-selectExistingSharedSurvey')
                        ? { display: 'block' }
                        : { display: 'none' } },
                    this.state.mode === 'survey-selectExistingSurvey'
                        ? jsx(SettingSection, { className: "select-survey-section" },
                            jsx(SettingRow, null,
                                jsx(AdvancedSelect, { size: 'sm', className: "survey-dropdown", fluid: true, staticValues: this.state.existSurveys, selectedValues: this.state.selectedMyOwnSurvey ? [this.state.selectedMyOwnSurvey] : [], allTag: this.props.intl.formatMessage({ id: 'selectSurveyTip', defaultMessage: defaultMessages.selectSurveyTip }), onChange: this.onExistSurveyChanged, placeholder: this.props.intl.formatMessage({ id: 'selectSurveyTip', defaultMessage: defaultMessages.selectSurveyTip }) })),
                            jsx("div", { className: "survey-list-msg", dangerouslySetInnerHTML: { __html: this.state.existSurveyMsg } }))
                        : jsx(SettingSection, { className: "select-survey-section" },
                            jsx(SettingRow, null,
                                jsx(AdvancedSelect, { size: 'sm', className: "survey-dropdown", fluid: true, staticValues: this.state.existSharedSurveys, selectedValues: this.state.selectedSharedSurvey ? [this.state.selectedSharedSurvey] : [], allTag: this.props.intl.formatMessage({ id: 'selectSurveyTip', defaultMessage: defaultMessages.selectSurveyTip }), onChange: this.onExistSurveyChanged, placeholder: this.props.intl.formatMessage({ id: 'selectSurveyTip', defaultMessage: defaultMessages.selectSurveyTip }) })),
                            jsx("div", { className: "survey-list-msg", dangerouslySetInnerHTML: { __html: this.state.existSharedSurveyMsg } })),
                    jsx("div", { style: {
                            display: (this.state.currentActiveSurvey) ? 'block' : 'none'
                        } },
                        jsx(SettingSection, { title: this.nls('surveyDetailLabel'), className: "create-survey-container" }, (this.state.currentActiveSurvey)
                            ? [
                                jsx(SettingRow, { key: "surveyThumnail" },
                                    jsx("img", { src: this.state.currentActiveSurvey.thumbnail, style: { width: '100%', height: 'auto' } })),
                                jsx(SettingRow, { key: "surveyTitle" },
                                    jsx("span", { style: { wordBreak: 'break-word', fontSize: '0.8125rem', color: '#FFFFFF' } }, this.state.currentActiveSurvey.title)),
                                // <SettingRow label="Tags"><p className="w-100">{this.state.selectedSurvey.tags}</p></SettingRow>,
                                // <SettingRow>{this.state.selectedSurvey.owner}</SettingRow>,
                                // author
                                jsx(SettingRow, { className: "items", key: "surveyAuthor" },
                                    jsx("div", { className: "w-100" }, this.nls('ownerIs', { ownerName: this.state.currentActiveSurvey.owner || '' }))),
                                // last update
                                jsx(SettingRow, { className: "items", key: "surveyCreationDate" },
                                    jsx("div", { className: "w-100" }, this.nls('updatedOn', { updatedDate: (typeof this.state.currentActiveSurvey.formItemInfo.modified === 'number') ? this.props.intl.formatDate(new Date(this.state.currentActiveSurvey.formItemInfo.modified)) : '' }))),
                                // snippet
                                this.state.currentActiveSurvey.snippet
                                    ? jsx(SettingRow, { className: "items", key: "surveySnippet" },
                                        jsx("h6", null, this.nls('summaryLabel')),
                                        jsx("div", { className: "w-100" }, this.state.currentActiveSurvey.snippet))
                                    : null,
                                // insert survey button
                                jsx(SettingRow, { key: "surveyInsertBtn" },
                                    jsx(Button, { type: "primary", className: "w-100", onClick: this.setSurveyItemId }, this.props.intl.formatMessage({ id: 'insertLabel', defaultMessage: defaultMessages.insertLabel })))
                            ]
                            : null))),
                jsx("div", { className: "survey123__section-createSurvey", role: "group", "aria-label": this.nls('createNewSurveyLabel'), style: (this.state.mode === 'survey-createSurvey')
                        ? { display: 'block' }
                        : { display: 'none' } },
                    jsx(SettingSection, null,
                        jsx("div", { className: "w-100 d-flex flex-wrap align-items-center justify-content-between setting-header setting-title pb-2" },
                            jsx("div", null,
                                this.nls('surveyTitleLabel'),
                                jsx("span", { className: "isRequired" }, "*")),
                            jsx(TextInput, { "aria-label": this.nls('surveyTitleLabel'), "aria-required": "true", required: true, className: "w-100", value: this.state.newSurveyTitle || '', onChange: (evt) => this.onNewSurveyValueChanged(evt, 'newSurveyTitle') }),
                            (!this.state.newSurveyTitle || !(this.state.newSurveyTitle.trim())) && this.state.newSurveyTitleDirty
                                ? jsx("div", { className: "error-message" }, this.props.intl.formatMessage({ id: 'surveyTitleRequiredMsg', defaultMessage: defaultMessages.surveyTitleRequiredMsg }))
                                : '',
                            this.state.createSurveyErrorMsg && !this.state.newSurveyTitleDirty
                                ? jsx("div", { className: "error-message" }, this.props.intl.formatMessage({ id: 'surveyTitleDuplicateMsg', defaultMessage: defaultMessages.surveyTitleDuplicateMsg }))
                                : ''),
                        jsx("div", { className: "w-100 d-flex flex-wrap align-items-center justify-content-between setting-header setting-title pb-2" },
                            jsx("div", null,
                                this.nls('surveyTagLabel'),
                                this.isTagRequired
                                    ? jsx("span", { className: "isRequired" }, "*")
                                    : ''),
                            jsx(TagInput, { "aria-label": this.nls('surveyTagLabel'), data: this.state.newSurveyTags, selectListData: this.state.userTags, onChange: this.onTagInputChange, name: this.nls('surveyTagLabel'), menuProps: { maxHeight: 80 } }),
                            !(this.state.newSurveyTags && this.state.newSurveyTags.length) && this.state.newSurveyTagsDirty && this.isTagRequired
                                ? jsx("div", { className: "error-message" }, this.props.intl.formatMessage({ id: 'surveyTagsRequiredMsg', defaultMessage: defaultMessages.surveyTagsRequiredMsg }))
                                : ''),
                        jsx("div", { className: "w-100 d-flex flex-wrap align-items-center justify-content-between setting-header setting-title pb-2" },
                            jsx("div", null, this.nls('surveySummaryLabel')),
                            jsx(TextArea, { "aria-label": this.nls('surveySummaryLabel'), className: "w-100 summary", height: 80, value: this.state.newSurveySnippet || '', onChange: (evt) => this.onNewSurveyValueChanged(evt, 'newSurveySnippet') })),
                        jsx(SettingRow, { flow: "wrap" },
                            jsx(Button, { type: "primary", className: "w-100", disabled: this.state.newSurveyLoading === true || !this.state.canCreateSurvey || (this.isPortal && this.state.loadApiFailed), onClick: this.createSurvey }, this.props.intl.formatMessage({ id: 'createSurveyBtn', defaultMessage: defaultMessages.createSurveyBtn })),
                            jsx("span", { className: "newSurvey-msg" }, !this.state.canCreateSurvey ? this.nls('createSurveyDisabled1') : this.state.newSurveyMsg),
                            jsx("div", { className: "w-100", style: {
                                    position: 'relative',
                                    display: 'block',
                                    marginTop: '50px'
                                } },
                                jsx("div", { className: "jimu-secondary-loading", style: (this.state.newSurveyLoading === true) ? { display: 'block' } : { display: 'none' } })))))),
            jsx("div", { className: "survey123__section", style: (this.state.mode.indexOf('settings') !== -1)
                    ? { display: 'block' }
                    : { display: 'none' } },
                jsx(SettingSection, null,
                    jsx(SettingRow, null,
                        jsx("div", { className: "section-title" },
                            jsx("h6", null, (this.state.selectedSurvey) ? this.state.selectedSurvey.title : ''),
                            jsx(Button, { "aria-label": this.nls('remove'), "aria-description": (this.state.selectedSurvey) ? this.state.selectedSurvey.title : '', className: "survey123__section-resetSurvey", onClick: () => this.setState({ mode: 'confirmResetSurvey' }) },
                                jsx(CloseOutlined, { size: 8 })))),
                    jsx(SettingRow, null,
                        jsx(Button, { "aria-description": (this.state.selectedSurvey) ? this.state.selectedSurvey.title : '', className: "w-100", color: "primary", type: "primary", onClick: this.editSurvey }, this.props.intl.formatMessage({ id: 'editSurveyBtn', defaultMessage: defaultMessages.editSurveyBtn })))),
                jsx(SettingSection, { role: "group", "aria-label": this.nls('appearanceTitle'), title: this.nls('appearanceTitle') },
                    jsx(SettingRow, null,
                        jsx("div", { className: "appearance" },
                            jsx("span", null, this.props.intl.formatMessage({ id: 'showOptionsBarLabel', defaultMessage: defaultMessages.showOptionsBarLabel })),
                            jsx(Switch, { "aria-label": this.nls('showOptionsBarLabel'), className: "can-x-switch", checked: !this.props.config.hides.includes('navbar'), onChange: evt => { this.setAppearance(evt.target.checked, 'navbar'); } }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: "appearance" },
                            jsx("span", null, this.props.intl.formatMessage({ id: 'showOptionsHeaderLabel', defaultMessage: defaultMessages.showOptionsHeaderLabel })),
                            jsx(Switch, { "aria-label": this.nls('showOptionsHeaderLabel'), className: "can-x-switch", checked: !this.props.config.hides.includes('header'), onChange: evt => { this.setAppearance(evt.target.checked, 'header'); } }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: "appearance" },
                            jsx("span", null, this.props.intl.formatMessage({ id: 'showOptionsDesLabel', defaultMessage: defaultMessages.showOptionsDesLabel })),
                            jsx(Switch, { "aria-label": this.nls('showOptionsDesLabel'), className: "can-x-switch", checked: !this.props.config.hides.includes('description'), onChange: evt => { this.setAppearance(evt.target.checked, 'description'); } }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: "appearance" },
                            jsx("span", null, this.props.intl.formatMessage({ id: 'showOptionsFooterLabel', defaultMessage: defaultMessages.showOptionsFooterLabel })),
                            jsx(Switch, { "aria-label": this.nls('showOptionsFooterLabel'), className: "can-x-switch", checked: !this.props.config.hides.includes('footer'), onChange: evt => { this.setAppearance(evt.target.checked, 'footer'); } }))),
                    jsx(SettingRow, null,
                        jsx("div", { className: "appearance" },
                            jsx("span", null, this.props.intl.formatMessage({ id: 'useSurveyTheme', defaultMessage: defaultMessages.useSurveyTheme })),
                            jsx(Switch, { "aria-label": this.nls('useSurveyTheme'), className: "can-x-switch", checked: !this.props.config.hides.includes('theme'), onChange: evt => { this.setAppearance(evt.target.checked, 'theme'); } })))),
                jsx(SettingSection, { role: "radiogroup", "aria-label": this.nls('surveyModeTitle'), title: this.nls('surveyModeTitle') },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                            jsx("div", { className: 'align-items-center d-flex' },
                                jsx(Radio, { style: { cursor: 'pointer' }, onChange: () => this.setMode('new'), checked: this.props.config.mode === 'new', title: this.props.intl.formatMessage({ id: 'surveyModeNew', defaultMessage: defaultMessages.surveyModeNew }) }),
                                jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.setMode('new'), title: this.props.intl.formatMessage({ id: 'surveyModeNew', defaultMessage: defaultMessages.surveyModeNew }) }, this.props.intl.formatMessage({ id: 'surveyModeNew', defaultMessage: defaultMessages.surveyModeNew }))))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                            jsx("div", { className: 'align-items-center d-flex' },
                                jsx(Radio, { "aria-describedby": (this.state.mapWidgetList && this.state.mapWidgetList.length > 0) ? '' : `survey_${this.props.id}_sendDataDisabled2ForEdit`, style: { cursor: 'pointer' }, onChange: () => this.setMode('edit'), checked: this.props.config.mode === 'edit', title: this.props.intl.formatMessage({ id: 'surveyModeEdit', defaultMessage: defaultMessages.surveyModeEdit }) }),
                                jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.setMode('edit'), title: this.props.intl.formatMessage({ id: 'surveyModeEdit', defaultMessage: defaultMessages.surveyModeEdit }) }, this.props.intl.formatMessage({ id: 'surveyModeEdit', defaultMessage: defaultMessages.surveyModeEdit }))))),
                    jsx(SettingRow, null,
                        jsx("div", { className: 'd-flex justify-content-between w-100 align-items-center' },
                            jsx("div", { className: 'align-items-center d-flex' },
                                jsx(Radio, { "aria-describedby": (this.state.mapWidgetList && this.state.mapWidgetList.length > 0) ? '' : `survey_${this.props.id}_sendDataDisabled2ForView`, style: { cursor: 'pointer' }, onChange: () => this.setMode('view'), checked: this.props.config.mode === 'view', title: this.props.intl.formatMessage({ id: 'surveyModeView', defaultMessage: defaultMessages.surveyModeView }) }),
                                jsx("label", { className: 'm-0 ml-2', style: { cursor: 'pointer' }, onClick: () => this.setMode('view'), title: this.props.intl.formatMessage({ id: 'surveyModeView', defaultMessage: defaultMessages.surveyModeView }) }, this.props.intl.formatMessage({ id: 'surveyModeView', defaultMessage: defaultMessages.surveyModeView }))))),
                    this.props.config.mode === 'new' && jsx(React.Fragment, null,
                        jsx(SettingRow, null,
                            jsx("div", { className: "section-title" },
                                jsx("h6", null, this.nls('sendDataToSurveyTitle')),
                                jsx(Switch, { "aria-label": this.nls('sendDataToSurveyTitle'), "aria-describedby": (this.state.mapWidgetList && this.state.mapWidgetList.length > 0) ? (this.props.config.activeLinkData ? `survey_${this.props.id}_sendDataToSurveyDesc survey_${this.props.id}_triggerEventDesc1` : '') : `survey_${this.props.id}_sendDataDisabled1`, className: "can-x-switch", checked: this.props.config.activeLinkData, onChange: this.activeLinkDataChange }))),
                        this.props.config.activeLinkData &&
                            jsx(React.Fragment, null, this.state.mapWidgetList && this.state.mapWidgetList.length > 0
                                ? jsx(React.Fragment, null,
                                    jsx(SettingRow, null,
                                        jsx("span", { id: `survey_${this.props.id}_sendDataToSurveyDesc`, className: "w-100" }, this.nls('sendDataToSurveyDesc'))),
                                    jsx(SettingRow, null,
                                        jsx("span", null, this.nls('selectSourceWidget'))),
                                    jsx("div", { className: "setting-row" },
                                        jsx(MapWidgetSelector, { "aria-label": this.nls('selectSourceWidget'), onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.state.useMapWidgetIdsInNewMode })),
                                    jsx(SettingRow, { className: "fea-layer-outter" },
                                        jsx(SettingRow, { className: "use-feature-layer-setting" },
                                            jsx("span", null, this.nls('selectSourceLayer'))),
                                        jsx("div", { className: "feature-layer-dropdown" },
                                            jsx(JimuLayerViewSelector, { "aria-label": this.nls('selectSourceLayer'), onSelect: this.onDataSourceSelected, useMapWidgetIds: this.state.useMapWidgetIdsInNewMode, jimuLayerViewInfo: this.state && this.state.layerViewInfoInNewMode }))),
                                    jsx(SettingRow, null,
                                        jsx("span", { id: `survey_${this.props.id}_triggerEventDesc1`, className: "w-100" }, this.nls('triggerEventDesc1'))),
                                    jsx(SettingRow, null,
                                        jsx("div", { role: "group", "aria-owns": `survey_${this.props.id}_addNewMapping survey_${this.props.id}_addMappingBtn`, "aria-label": this.nls('addConnTitle') },
                                            jsx("span", null, this.nls('addConnTitle')))),
                                    (this.state.useMapWidgetIdsInNewMode && this.state.useMapWidgetIdsInNewMode.length && this.state && this.state.layerViewInfoInNewMode && this.state.layerViewInfoInNewMode.dataSourceId)
                                        ? jsx(React.Fragment, null,
                                            (this.props.config.fieldQuestionMapping && this.props.config.fieldQuestionMapping.length > 0)
                                                ? jsx("div", null, this.props.config.fieldQuestionMapping.asMutable().map((mapping, index) => {
                                                    const field = mapping.field;
                                                    const question = mapping.question;
                                                    return jsx("div", { key: field + '_' + question + '_' + index, className: "mapping-container" }, this.state.editMapping && this.state.editMapping.index === index
                                                        ? jsx(React.Fragment, null,
                                                            jsx(Select, { value: this.state.editMapping.field || '', style: { marginBottom: '8px' }, onChange: (e) => this.changeEditMapping('field', e) }, this.state.dsFeatureLayerFields.map((field) => {
                                                                return jsx("option", { key: 'edit_' + field.name + '_' + index, value: field.name }, field.alias || field.name);
                                                            })),
                                                            jsx(Select, { value: this.state.editMapping.question || '', onChange: (e) => this.changeEditMapping('question', e) }, this.state.surveyQuestionFields.length > 0 &&
                                                                this.state.surveyQuestionFields.map((question) => {
                                                                    return jsx("option", { key: 'edit_' + question.name + '_' + index, value: question.name }, question.label);
                                                                })),
                                                            jsx("div", { className: "btn-group" },
                                                                jsx(Button, { className: "float-left icon-remove-mapping", type: "primary", color: "primary", onClick: () => { this.deleteConnection(index); this.setState({ editMapping: null }); } },
                                                                    jsx(TrashOutlined, { className: 'remove-mapping' })),
                                                                jsx(Button, { className: "float-right", type: "secondary", onClick: () => { this.setState({ editMapping: null }); } }, this.nls('cancel')),
                                                                jsx(Button, { className: "float-right", type: "primary", color: "primary", onClick: () => { this.editMapping(index); this.setState({ editMapping: null }); } }, this.nls('ok'))))
                                                        : jsx(React.Fragment, null,
                                                            jsx("div", { className: "link-info", onClick: (e) => this.showEditMappingPanel(index, e) },
                                                                jsx("p", null, this.getFielAlias(field)),
                                                                jsx("div", { className: "center-line" },
                                                                    jsx("div", { className: "connect" },
                                                                        jsx(LinkHorizontalOutlined, null))),
                                                                jsx("p", null, this.getQuestionLabel(question)),
                                                                jsx("div", { className: "delete-connect", onClick: (e) => this.deleteConnection(index, e) },
                                                                    jsx(TrashOutlined, { size: 's' })))));
                                                })) : '',
                                            this.state.addMapping && this.state.dsFeatureLayer && this.state.dsFeatureLayerFields && this.state.dsFeatureLayerFields.length > 0 &&
                                                jsx("div", { className: "mapping-container", id: `survey_${this.props.id}_addNewMapping` },
                                                    jsx(Select, { "aria-label": this.nls('addConnSelectField'), value: this.state.addMapping.field || 'null', style: { marginBottom: '8px' }, onChange: (e) => this.addMapppingChange('field', e) },
                                                        jsx("option", { key: 'add_field_default', value: "null" }, this.nls('addConnSelectField')),
                                                        this.state.dsFeatureLayerFields.map((field) => {
                                                            return jsx("option", { key: 'add_' + field.name, value: field.name }, field.alias || field.name);
                                                        })),
                                                    jsx(Select, { "aria-label": this.nls('addConnSelectQuestion'), value: this.state.addMapping.question || 'null', onChange: (e) => this.addMapppingChange('question', e) },
                                                        jsx("option", { key: 'add_question_default', value: "null" }, this.nls('addConnSelectQuestion')),
                                                        this.state.surveyQuestionFields.length > 0 &&
                                                            this.state.surveyQuestionFields.map((question) => {
                                                                return jsx("option", { key: 'add_' + question.name, value: question.name }, question.label);
                                                            })),
                                                    jsx("div", { className: "btn-group" },
                                                        jsx(Button, { className: "float-right", type: "secondary", onClick: this.deactiveAddFieldQuestionConnPanel }, this.nls('cancel')),
                                                        jsx(Button, { className: "float-right", type: "primary", disabled: !this.state.addMapping.field || this.state.addMapping.field === 'null' || !this.state.addMapping.question || this.state.addMapping.question === 'null', onClick: this.addFieldQuestionConn }, this.nls('ok'))))) : '',
                                    jsx(SettingRow, null,
                                        jsx(Button, { className: "w-100", type: "primary", id: `survey_${this.props.id}_addMappingBtn`, 
                                            // eslint-disable-next-line max-len
                                            disabled: this.state.addMapping !== null || this.state.editMapping !== null || !(this.state.useMapWidgetIdsInNewMode && this.state.useMapWidgetIdsInNewMode.length && this.state && this.state.layerViewInfoInNewMode && this.state.layerViewInfoInNewMode.dataSourceId), onClick: this.activeAddFieldQuestionConnPanel }, this.nls('addConnBtn'))))
                                : jsx(SettingRow, null,
                                    jsx("span", { id: `survey_${this.props.id}_sendDataDisabled1` }, this.nls('sendDataDisabled1'))))),
                    this.props.config.mode === 'edit' && jsx(React.Fragment, null, this.state.mapWidgetList && this.state.mapWidgetList.length > 0
                        ? jsx(React.Fragment, null,
                            jsx(SettingRow, { className: "section-title" },
                                jsx("div", { role: "group", "aria-describedby": `survey_${this.props.id}_chooseExistDataEditDesc survey_${this.props.id}_chooseExistDataLoadDesc`, "aria-label": this.nls('chooseExistDataTitle'), "aria-owns": `survey_${this.props.id}_selectWidgetForEditMode survey_${this.props.id}_selectSurveyLayerForEditMode` },
                                    jsx("h6", null, this.nls('chooseExistDataTitle')))),
                            jsx(SettingRow, null,
                                jsx("span", { id: `survey_${this.props.id}_chooseExistDataEditDesc`, className: "w-100" }, this.nls('chooseExistDataEditDesc'))),
                            jsx("div", { id: `survey_${this.props.id}_selectWidgetForEditMode` },
                                jsx(SettingRow, null,
                                    jsx("span", null, this.nls('selectSourceWidget'))),
                                jsx("div", { className: "setting-row" },
                                    jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.state.useMapWidgetIdsInEditMode }))),
                            jsx(SettingRow, { className: "fea-layer-outter" },
                                jsx("div", { id: `survey_${this.props.id}_selectSurveyLayerForEditMode` },
                                    jsx(SettingRow, { className: "use-feature-layer-setting" },
                                        jsx("span", { title: this.nls('selectSurveyLayerTip') }, this.nls('selectSurveyLayer'))),
                                    jsx("div", { className: "feature-layer-dropdown", title: this.nls('selectSurveyLayerTip') },
                                        jsx(JimuLayerViewSelector, { onSelect: this.onDataSourceSelected, useMapWidgetIds: this.state.useMapWidgetIdsInEditMode, jimuLayerViewInfo: this.state && this.state.layerViewInfoInEditMode })))),
                            jsx(SettingRow, null,
                                jsx("span", { id: `survey_${this.props.id}_chooseExistDataLoadDesc` }, this.nls('chooseExistDataLoadDesc'))))
                        : jsx(SettingRow, null,
                            jsx("span", { id: `survey_${this.props.id}_sendDataDisabled2ForEdit` }, this.nls('sendDataDisabled2')))),
                    this.props.config.mode === 'view' && jsx(React.Fragment, null, this.state.mapWidgetList && this.state.mapWidgetList.length > 0
                        ? jsx(React.Fragment, null,
                            jsx(SettingRow, null,
                                jsx("div", { role: "group", className: "section-title", "aria-describedby": `survey_${this.props.id}_chooseExistDataViewDesc survey_${this.props.id}_chooseExistDataLoadDescForView`, "aria-label": this.nls('chooseExistDataTitle'), "aria-owns": `survey_${this.props.id}_selectWidgetForViewMode survey_${this.props.id}_selectMapForVIewMode` },
                                    jsx("h6", null, this.nls('chooseExistDataTitle')))),
                            jsx(SettingRow, null,
                                jsx("span", { id: `survey_${this.props.id}_chooseExistDataViewDesc`, className: "w-100" }, this.nls('chooseExistDataViewDesc'))),
                            jsx("div", { id: `survey_${this.props.id}_selectWidgetForViewMode` },
                                jsx(SettingRow, null,
                                    jsx("span", null, this.nls('selectSourceWidget'))),
                                jsx("div", { className: "setting-row" },
                                    jsx(MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.state.useMapWidgetIdsInViewMode }))),
                            jsx(SettingRow, { className: "fea-layer-outter" },
                                jsx("div", { id: `survey_${this.props.id}_selectMapForVIewMode` },
                                    jsx(SettingRow, { className: "use-feature-layer-setting" },
                                        jsx("span", { title: this.nls('selectSurveyLayerTip') }, this.nls('selectSurveyLayer'))),
                                    jsx("div", { className: "feature-layer-dropdown", title: this.nls('selectSurveyLayerTip') },
                                        jsx(JimuLayerViewSelector, { onSelect: this.onDataSourceSelected, useMapWidgetIds: this.state.useMapWidgetIdsInViewMode, jimuLayerViewInfo: this.state && this.state.layerViewInfoInViewMode })))),
                            jsx(SettingRow, null,
                                jsx("span", { id: `survey_${this.props.id}_chooseExistDataLoadDescForView` }, this.nls('chooseExistDataLoadDesc'))))
                        : jsx(SettingRow, null,
                            jsx("span", { id: `survey_${this.props.id}_sendDataDisabled2ForView` }, this.nls('sendDataDisabled2')))))),
            jsx("div", { className: "survey123__section", role: "group", "aria-label": this.nls('resetSurveyLabel'), style: (this.state.mode.indexOf('confirmResetSurvey') !== -1)
                    ? { display: 'block' }
                    : { display: 'none' } },
                jsx(SettingSection, { title: this.nls('resetSurveyLabel') },
                    jsx(SettingRow, null, this.props.intl.formatMessage({ id: 'resetSurveyTip', defaultMessage: defaultMessages.resetSurveyTip })),
                    this.props.intl.formatMessage({ id: 'confirmResetSurveyTip', defaultMessage: defaultMessages.confirmResetSurveyTip }),
                    jsx(SettingRow, null,
                        jsx(Button, { "aria-description": this.props.intl.formatMessage({ id: 'resetSurveyTip', defaultMessage: defaultMessages.resetSurveyTip }), type: "primary", onClick: () => this.resetSurvey() }, this.nls('yes')),
                        jsx(Button, { onClick: () => this.showSettingPage() }, this.nls('no'))))),
            jsx(Modal, { isOpen: this.state.modalIsOpen, className: "w-100 h-100 p-0 m-0 survey123__desinger_modal", css: getModalStyle(this.props.theme) },
                jsx("div", { className: "survey123__desinger" },
                    jsx("p", null, this.props.intl.formatMessage({ id: 'editSurveyBtn', defaultMessage: defaultMessages.editSurveyBtn })),
                    jsx("button", { color: "primary", onClick: this.handleCloseModal },
                        jsx(CloseOutlined, { size: 24 }))),
                jsx("iframe", { id: "survey123-designer", width: "100%" }),
                jsx(AlertPopup, { isOpen: this.state.isShowCloseDesignerAlert, okLabel: this.nls('ok'), title: this.props.label, toggle: this.handleCloseDesignerAlert },
                    jsx("div", { style: { fontSize: '1rem' } }, this.nls('msgUnsavedBeforeLeaving')))));
    }
}
//# sourceMappingURL=setting.js.map