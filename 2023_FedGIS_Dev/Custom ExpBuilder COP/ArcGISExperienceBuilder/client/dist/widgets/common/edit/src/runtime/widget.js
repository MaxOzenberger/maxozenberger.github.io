var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, classNames, DataSourceStatus, dataSourceUtils, DataSourceManager, defaultMessages as jimuCoreMessages, appActions, privilegeUtils } from 'jimu-core';
import { EditModeType, LayerHonorModeType } from '../config';
import { JimuMapViewComponent } from 'jimu-arcgis';
import defaultMessages from './translations/default';
import { defaultMessages as jimuUIDefaultMessages, Button, Select, WidgetPlaceholder } from 'jimu-ui';
import { getStyle } from './style';
import EditItemDataSource from './edit-item-ds';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import FeatureForm from 'esri/widgets/FeatureForm';
import Editor from 'esri/widgets/Editor';
import FeatureLayer from 'esri/layers/FeatureLayer';
import FormTemplate from 'esri/form/FormTemplate';
import FieldElement from 'esri/form/elements/FieldElement';
import GroupElement from 'esri/form/elements/GroupElement';
import Graphic from 'esri/Graphic';
import Query from 'esri/rest/support/Query';
import { versionManager } from '../version-manager';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
const editPlaceholderIcon = require('./assets/icons/placeholder-edit-geometry-empty.svg');
const CSS = {
    base: 'esri-item-list',
    widget: 'esri-widget',
    header: 'esri-editor__header',
    formHeader: 'esri-feature-form__form-header',
    description: 'esri-feature-form__description-text',
    controls: 'esri-editor__controls',
    buttonDisabled: 'esri-button--disabled',
    heading: 'esri-widget__heading',
    featureForm: 'esri-feature-form',
    filterContainer: 'esri-item-list__filter-container',
    filterInput: 'esri-item-list__filter-input',
    filterPlaceholder: 'esri-item-list__filter-placeholder',
    filterPlaceholderText: 'esri-item-list__filter-placeholder-text',
    searchIcon: 'esri-icon-search',
    input: 'esri-input',
    scroller: 'esri-editor__scroller',
    content: 'esri-editor__content',
    list: 'esri-item-list__list',
    group: 'esri-item-list__group',
    noMatchesMessage: 'esri-item-list__no-matches-message',
    itemLabel: 'esri-item-list__list-item-label',
    itemContainer: 'esri-item-list__list-item-container',
    item: 'esri-item-list__list-item',
    groupHeader: 'esri-item-list__group-header',
    interactive: 'esri-interactive',
    backButton: 'esri-editor__back-button',
    title: 'esri-editor__title',
    leftArrowIcon: 'esri-icon-left',
    widgetHeading: 'esri-widget__heading',
    warningOption: 'esri-editor__warning-option',
    warningOptionPrimary: 'esri-editor__warning-option--primary',
    warningOptionPositive: 'esri-editor__warning-option--positive',
    progressBar: 'esri-editor__progress-bar',
    promptDanger: 'esri-editor__prompt--danger',
    promptHeader: 'esri-editor__prompt__header',
    promptHeaderHeading: 'esri-editor__prompt__header__heading',
    promptMessage: 'esri-editor__prompt__message',
    promptDivider: 'esri-editor__prompt__divider',
    promptActions: 'esri-editor__prompt__actions',
    loader: 'esri-feature-table__loader',
    loaderContainer: 'esri-feature-table__loader-container'
};
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleActiveViewChange = (jimuMapView) => {
            this.setState({ jimuMapView }, () => {
                const view = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view;
                view === null || view === void 0 ? void 0 : view.when(() => {
                    view === null || view === void 0 ? void 0 : view.on('layerview-create', event => {
                        var _a;
                        const newLayer = event.layer;
                        if ((_a = newLayer === null || newLayer === void 0 ? void 0 : newLayer.id) === null || _a === void 0 ? void 0 : _a.includes('jimu-draw-measurements-layer')) {
                            const editor = this.edit;
                            (editor === null || editor === void 0 ? void 0 : editor.layerInfos) ? this.setupEditLayerInfos(jimuMapView) : this.createEditor(jimuMapView);
                        }
                    });
                });
                if (!jimuMapView) {
                    this.destoryEdit();
                }
                else {
                    this.createEditor(jimuMapView);
                }
            });
        };
        this.formatMessage = (id, values) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreMessages);
            return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] }, values);
        };
        this.destoryEdit = () => {
            this.edit && !this.edit.destroyed && this.edit.destroy();
        };
        this.flatMapArray = (editFeatures) => {
            // flat editFeatures
            const flatEditFeatures = [];
            for (const dsId in editFeatures) {
                if (editFeatures === null || editFeatures === void 0 ? void 0 : editFeatures[dsId]) {
                    flatEditFeatures.push(...editFeatures[dsId]);
                }
            }
            return flatEditFeatures;
        };
        this.flatMapArrayWithView = (editFeatures, jimuMapView) => {
            const flatEditFeatures = [];
            const mapDsId = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.dataSourceId;
            for (const dsId in editFeatures) {
                if (dsId.indexOf(mapDsId) === 0 && (editFeatures === null || editFeatures === void 0 ? void 0 : editFeatures[dsId])) {
                    flatEditFeatures.push(...editFeatures[dsId]);
                }
            }
            return flatEditFeatures;
        };
        this.createEditForm = (dataSourceId, dsChange, newRequestId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { dataSources, editFeatures } = this.state;
            const { id, config } = this.props;
            const { layersConfig } = config;
            const dataSource = dataSources[dataSourceId];
            const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig);
            const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
            const editCount = flatEditFeatures.length;
            // create FeatureForm or change edit feature
            if (editCount === 1) {
                const graphic = (_a = dataSource.getSelectedRecords()) === null || _a === void 0 ? void 0 : _a[0];
                // Deselect one by one until the last one, if not the current DS, needs special treatment
                if (!graphic)
                    return;
                if (dsChange || !this.edit || ((_b = this.edit) === null || _b === void 0 ? void 0 : _b.destroyed)) {
                    this.renderFeatureForm(dataSource, graphic, newRequestId);
                }
                else {
                    (_c = document.getElementById(`edit-container-${id}`)) === null || _c === void 0 ? void 0 : _c.classList.remove('esri-hidden');
                    this.createOrUpdateheader(dataSource, graphic.feature);
                    const edit = this.edit;
                    if (!edit)
                        return;
                    const graphicFeature = yield dataSourceUtils.changeToJSAPIGraphic(graphic === null || graphic === void 0 ? void 0 : graphic.feature);
                    edit.feature = graphicFeature;
                }
            }
            else if (editCount > 1 || editCount === 0) { // list or no data
                (_d = document.getElementById(`edit-container-${id}`)) === null || _d === void 0 ? void 0 : _d.classList.add('esri-hidden');
            }
        });
        this.getDsAccessibleInfo = (url) => {
            if (!url)
                return Promise.resolve(false);
            return fetch(`${url}?f=pjson`).then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); })).then(info => {
                if (Object.keys(info).includes('error')) {
                    return false;
                }
                else {
                    return true;
                }
            }).catch((err) => {
                console.error(err);
            });
        };
        this.getPrivilege = () => {
            return privilegeUtils.checkExbAccess(privilegeUtils.CheckTarget.Experience).then(exbAccess => {
                var _a;
                return (_a = exbAccess === null || exbAccess === void 0 ? void 0 : exbAccess.capabilities) === null || _a === void 0 ? void 0 : _a.canEditFeature;
            });
        };
        this.renderFeatureForm = (dataSource, graphic, newRequestId) => {
            this.setState({ loading: true });
            const { activeId } = this.state;
            const { config, id } = this.props;
            const { editMode, layersConfig } = config;
            const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId);
            this.destoryEdit();
            this.getFeatureLayer(dataSource).then((layer) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const donotRender = newRequestId && (newRequestId !== this.currentRequestId);
                if (donotRender) {
                    this.setState({ loading: false });
                    return;
                }
                this.removeLayerOnce = false;
                if (!layer) {
                    this.setState({ loading: false });
                    return;
                }
                // Build container for edit
                const container = document && document.createElement('div');
                container.id = `edit-container-${id}`;
                container.className = `edit-container-${id}`;
                this.refs.editContainer.appendChild(container);
                let featureLayer;
                if (layer.layer) {
                    featureLayer = layer.layer;
                }
                else {
                    featureLayer = layer;
                }
                // fetch to confirm whether it's a public source
                const accessible = yield this.getDsAccessibleInfo(featureLayer === null || featureLayer === void 0 ? void 0 : featureLayer.url);
                // use exb privilege instead of api's supportsUpdateByOthers
                const privilegeEditable = yield this.getPrivilege();
                const editable = accessible || privilegeEditable;
                this.setState({ formEditable: editable });
                if (editMode === EditModeType.Attribute) {
                    const elements = this.constructFormElements(dataSource.id);
                    const formTemplate = new FormTemplate({
                        elements: elements
                    });
                    const graphicFeature = (graphic === null || graphic === void 0 ? void 0 : graphic.feature) ? yield dataSourceUtils.changeToJSAPIGraphic(graphic === null || graphic === void 0 ? void 0 : graphic.feature) : undefined;
                    const useFeature = graphicFeature || new Graphic({
                        layer: featureLayer
                    });
                    const useFormTemplate = activeConfig.layerHonorMode === LayerHonorModeType.Webmap
                        ? (((_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _a === void 0 ? void 0 : _a.formTemplate) || formTemplate)
                        : formTemplate;
                    this.edit = new FeatureForm({
                        container: container,
                        feature: useFeature,
                        layer: featureLayer,
                        formTemplate: useFormTemplate
                    });
                    // Render form header
                    this.createOrUpdateheader(dataSource, useFeature);
                    if (graphic)
                        this.setState({ featureFormStep: 'form' });
                    const editForm = this.edit;
                    editForm.on('submit', () => {
                        const newFeature = (editForm === null || editForm === void 0 ? void 0 : editForm.feature) || useFeature;
                        if (newFeature) {
                            if (newFeature === null || newFeature === void 0 ? void 0 : newFeature.geometry) {
                                newFeature.geometry = null;
                            }
                            // Grab updated attributes from the form.
                            const updated = editForm.getValues();
                            Object.keys(updated).forEach((name) => {
                                newFeature.attributes[name] = updated[name];
                            });
                            // Setup the applyEdits parameter with updates.
                            const edits = {
                                updateFeatures: [newFeature]
                            };
                            this.applyAttributeUpdates(edits);
                        }
                    });
                    editForm.on('value-change', (changedValue) => {
                        var _a;
                        const { feature, fieldName, value } = changedValue;
                        if (value !== ((_a = feature === null || feature === void 0 ? void 0 : feature.attributes) === null || _a === void 0 ? void 0 : _a[fieldName])) {
                            this.setState({ formChange: true });
                        }
                        else {
                            this.setState({ formChange: false });
                        }
                    });
                    featureLayer.on('edits', event => {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        const { addedFeatures, updatedFeatures, deletedFeatures } = event;
                        const adds = addedFeatures && addedFeatures.length > 0;
                        const updates = updatedFeatures && updatedFeatures.length > 0;
                        const deletes = deletedFeatures && deletedFeatures.length > 0;
                        if (adds) {
                            const addFeature = (_b = (_a = event === null || event === void 0 ? void 0 : event.edits) === null || _a === void 0 ? void 0 : _a.addFeatures) === null || _b === void 0 ? void 0 : _b[0];
                            if (addFeature) {
                                const idField = dataSource.getIdField();
                                const record = dataSource.buildRecord(addFeature, dataSource);
                                const recordData = (record === null || record === void 0 ? void 0 : record.getData()) || {};
                                record.setData(Object.assign(Object.assign({}, recordData), { [idField]: (_d = (_c = addedFeatures[0]) === null || _c === void 0 ? void 0 : _c.objectId) === null || _d === void 0 ? void 0 : _d.toString() }));
                                dataSource.afterAddRecord(record);
                                dataSource.selectRecordById(record.getId(), record);
                            }
                        }
                        if (updates) {
                            const updateFeature = (_f = (_e = event === null || event === void 0 ? void 0 : event.edits) === null || _e === void 0 ? void 0 : _e.updateFeatures) === null || _f === void 0 ? void 0 : _f[0];
                            if (updateFeature) {
                                const record = dataSource.buildRecord(updateFeature, dataSource);
                                dataSource.afterUpdateRecord(record);
                            }
                        }
                        if (deletes) {
                            const deleteFeature = (_h = (_g = event === null || event === void 0 ? void 0 : event.edits) === null || _g === void 0 ? void 0 : _g.deleteFeatures) === null || _h === void 0 ? void 0 : _h[0];
                            if (deleteFeature) {
                                const record = dataSource.buildRecord(deleteFeature, dataSource);
                                dataSource.afterDeleteRecordById(record.getId());
                            }
                        }
                    });
                    this.setState({ loading: false });
                }
            })).catch(err => {
                this.setState({ loading: false });
                this.removeLayerOnce = false;
                console.error(err);
            });
        };
        this.createOrUpdateheader = (dataSource, feature) => {
            var _a;
            const { id } = this.props;
            const { featureFormStep } = this.state;
            const displayField = this.getLayerDisplayField(dataSource);
            const title = featureFormStep === 'new' ? this.formatMessage('addFeature') : (_a = feature === null || feature === void 0 ? void 0 : feature.attributes) === null || _a === void 0 ? void 0 : _a[displayField];
            if (!(document === null || document === void 0 ? void 0 : document.getElementById(`form_heading_${id}`))) {
                const formDom = document && document.createElement('header');
                formDom.className = CSS.header;
                formDom.innerHTML = `
        <h4 id='form_heading_${id}' class='text-truncate ${classNames(CSS.heading)}' title='${title}'>${title}</h4>
      `;
                this.refs.formHeaderContainer.appendChild(formDom);
            }
            else {
                document.getElementById(`form_heading_${id}`).innerText = title;
            }
        };
        this.deleteChangeDataSource = (selectedAfterDel) => {
            const { config } = this.props;
            const { layersConfig } = config;
            const { activeId, editFeatures } = this.state;
            const newEditFeatures = Object.assign({}, editFeatures);
            newEditFeatures[activeId] = selectedAfterDel;
            const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, layersConfig);
            const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
            const editCount = flatEditFeatures.length;
            const step = editCount > 1 ? 'list' : editCount === 1 ? 'form' : 'empty';
            this.setState({ editFeatures: newEditFeatures, featureFormStep: step }, () => {
                this.createEditForm(activeId, false);
            });
        };
        this.applyAttributeUpdates = (params) => {
            const { dataSources, editFeatures, activeId } = this.state;
            const editForm = this.edit;
            const dataSource = dataSources[activeId];
            const gdbVersion = dataSource.getGDBVersion();
            editForm.layer.applyEdits(params, { gdbVersion }).then((editsResult) => {
                if (params === null || params === void 0 ? void 0 : params.deleteFeatures) {
                    const selectedRecords = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getSelectedRecords();
                    const selectedAfterDel = selectedRecords.filter(item => item.feature.attributes !== (params === null || params === void 0 ? void 0 : params.deleteFeatures[0].attributes));
                    if (selectedAfterDel.length > 0) {
                        this.deleteChangeDataSource(selectedAfterDel);
                    }
                    else {
                        const newEditFeatures = Object.assign({}, editFeatures);
                        delete newEditFeatures[activeId];
                        const formHeader = this.refs.formHeaderContainer;
                        if (formHeader === null || formHeader === void 0 ? void 0 : formHeader.innerHTML)
                            formHeader.innerHTML = '';
                        this.destoryEdit();
                        this.setState({ editFeatures: newEditFeatures, featureFormStep: 'empty', activeId: '' });
                    }
                }
                else if (params === null || params === void 0 ? void 0 : params.updateFeatures) {
                    this.setState({ attrUpdating: false });
                }
                this.setState({ formChange: false });
            }).catch((error) => {
                if (params === null || params === void 0 ? void 0 : params.updateFeatures) {
                    this.setState({ attrUpdating: false });
                }
                console.log('error = ', error);
            });
        };
        this.constructFormElements = (dsId) => {
            let { activeId } = this.state;
            if (dsId)
                activeId = dsId;
            const { config } = this.props;
            const { layersConfig } = config;
            const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId);
            if (!activeConfig)
                return [];
            const { groupedFields } = activeConfig;
            const elements = groupedFields.map(item => {
                if (item === null || item === void 0 ? void 0 : item.children) {
                    return new GroupElement({
                        label: item.name,
                        description: item.subDescription || (item === null || item === void 0 ? void 0 : item.description),
                        elements: item === null || item === void 0 ? void 0 : item.children.map(ele => {
                            return new FieldElement({
                                fieldName: ele.jimuName,
                                label: ele === null || ele === void 0 ? void 0 : ele.alias,
                                description: ele.subDescription || (ele === null || ele === void 0 ? void 0 : ele.description),
                                editable: ele.editAuthority
                            });
                        })
                    });
                }
                else {
                    return new FieldElement({
                        fieldName: item.jimuName,
                        label: item === null || item === void 0 ? void 0 : item.alias,
                        description: item.subDescription || (item === null || item === void 0 ? void 0 : item.description),
                        editable: item.editAuthority
                    });
                }
            });
            return elements;
        };
        this.onFilterChange = (evt) => {
            this.setState({ filterText: evt.target.value });
        };
        this.renderListItems = (editFeatures) => {
            var _a, _b, _c;
            const { filterText } = this.state;
            const groupedSelectedFeatures = [];
            for (const dsId in editFeatures) {
                const featuresArray = editFeatures[dsId];
                const dataSource = (_a = featuresArray === null || featuresArray === void 0 ? void 0 : featuresArray[0]) === null || _a === void 0 ? void 0 : _a.dataSource;
                const beToDs = dataSource === null || dataSource === void 0 ? void 0 : dataSource.belongToDataSource;
                const layerId = beToDs === null || beToDs === void 0 ? void 0 : beToDs.jimuChildId;
                const layerLabel = ((_b = beToDs === null || beToDs === void 0 ? void 0 : beToDs.layerDefinition) === null || _b === void 0 ? void 0 : _b.name) || ((_c = beToDs === null || beToDs === void 0 ? void 0 : beToDs.layerDefinition) === null || _c === void 0 ? void 0 : _c.description);
                const displayField = this.getLayerDisplayField(dataSource);
                const objectIdField = this.getLayerObjectIdField(dataSource);
                const group = {
                    id: layerId,
                    label: layerLabel,
                    dsId,
                    items: featuresArray.filter(ele => {
                        var _a, _b, _c, _d;
                        const label = ((_a = ele.feature.attributes) === null || _a === void 0 ? void 0 : _a[displayField]) || ((_b = ele.feature.attributes) === null || _b === void 0 ? void 0 : _b[objectIdField]) || ((_c = ele.feature.attributes) === null || _c === void 0 ? void 0 : _c.objectid);
                        const lowerCasedFilter = filterText.toLowerCase();
                        return !lowerCasedFilter || ((_d = label === null || label === void 0 ? void 0 : label.toString()) === null || _d === void 0 ? void 0 : _d.toLowerCase().indexOf(lowerCasedFilter)) > -1;
                    }).map(item => {
                        var _a, _b, _c;
                        const objectIdFieldValue = ((_a = item.feature.attributes) === null || _a === void 0 ? void 0 : _a[displayField]) || ((_b = item.feature.attributes) === null || _b === void 0 ? void 0 : _b[objectIdField]) || ((_c = item.feature.attributes) === null || _c === void 0 ? void 0 : _c.objectid);
                        return {
                            id: objectIdFieldValue,
                            dsId,
                            label: objectIdFieldValue,
                            data: item.feature
                        };
                    })
                };
                groupedSelectedFeatures.push(group);
            }
            let count = 0;
            groupedSelectedFeatures.forEach(item => {
                count += item.items.length;
            });
            if (count === 0) {
                return (jsx("div", { className: CSS.noMatchesMessage, key: 'no-matches' }, 'No items found'));
            }
            return (jsx("div", { key: 'item-container' }, groupedSelectedFeatures.map(group => this.renderGroup(group))));
        };
        this.renderGroup = (group) => {
            const headingId = `${group.id}-heading`;
            if (group.items.length === 0)
                return;
            return (jsx("section", { "aria-labelledby": headingId, className: CSS.group, key: group.label },
                jsx("h4", { id: headingId, className: classNames(CSS.groupHeader, CSS.heading) },
                    jsx("span", { className: CSS.itemLabel }, group.label)),
                jsx("ul", { className: CSS.list }, group.items.map(item => this.renderItem(item)))));
        };
        this.renderItem = (item) => {
            const key = `${item.id}__${item.label}`;
            const { dataSources } = this.state;
            return (jsx("li", { "aria-level": 2, className: CSS.item, "data-item": item, key: key, onClick: () => {
                    clearTimeout(this.timerFn);
                    this.timerFn = setTimeout(() => {
                        this.renderFeatureForm(dataSources[item.dsId], { feature: item.data });
                    }, 200);
                }, onDoubleClick: () => {
                    clearTimeout(this.timerFn);
                } },
                jsx("div", { className: CSS.itemContainer },
                    jsx("span", { className: CSS.itemLabel }, item.label))));
        };
        this.getLayerDisplayField = (dataSource) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const displayField = ((_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _a === void 0 ? void 0 : _a.displayField) ||
                ((_b = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layerDefinition) === null || _b === void 0 ? void 0 : _b.displayField) ||
                ((_d = (_c = dataSource === null || dataSource === void 0 ? void 0 : dataSource.belongToDataSource) === null || _c === void 0 ? void 0 : _c.layerDefinition) === null || _d === void 0 ? void 0 : _d.displayField) ||
                ((_e = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _e === void 0 ? void 0 : _e.objectIdField) ||
                ((_f = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layerDefinition) === null || _f === void 0 ? void 0 : _f.objectIdField) ||
                ((_h = (_g = dataSource === null || dataSource === void 0 ? void 0 : dataSource.belongToDataSource) === null || _g === void 0 ? void 0 : _g.layerDefinition) === null || _h === void 0 ? void 0 : _h.objectIdField) ||
                'OBJECTID';
            return displayField;
        };
        this.getLayerObjectIdField = (dataSource) => {
            var _a, _b, _c;
            const objectIdField = ((_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _a === void 0 ? void 0 : _a.objectIdField) ||
                ((_c = (_b = dataSource === null || dataSource === void 0 ? void 0 : dataSource.belongToDataSource) === null || _b === void 0 ? void 0 : _b.layerDefinition) === null || _c === void 0 ? void 0 : _c.objectIdField) ||
                'OBJECTID';
            return objectIdField;
        };
        this.renderFeatureList = (editFeatures, description) => {
            const { id, label } = this.props;
            const { filterText } = this.state;
            const placeholderId = `${id}-placeholder`;
            const formHeader = this.refs.formHeaderContainer;
            if (formHeader === null || formHeader === void 0 ? void 0 : formHeader.innerHTML)
                formHeader.innerHTML = '';
            return (jsx("div", { className: 'surface-1 h-100' },
                jsx("div", { className: CSS.featureForm },
                    jsx("div", { className: CSS.formHeader },
                        jsx("h2", { className: CSS.heading }, label),
                        jsx("p", { className: classNames(`text-truncate ${CSS.description}`), key: 'description', title: description }, description))),
                jsx("div", { className: classNames(`feature-list ${CSS.content} ${CSS.scroller}`) },
                    jsx("div", { className: classNames(CSS.base, CSS.widget) },
                        jsx("div", { className: CSS.filterContainer, key: "filter" },
                            jsx("input", { "aria-labelledby": placeholderId, className: classNames(CSS.input, CSS.filterInput), title: filterText, value: filterText, onChange: this.onFilterChange, type: 'search' }),
                            !filterText
                                ? jsx("div", { className: CSS.filterPlaceholder, id: placeholderId, key: "placeholder" },
                                    jsx("span", { className: CSS.searchIcon, "aria-hidden": "true" }),
                                    jsx("div", { className: CSS.filterPlaceholderText }, this.formatMessage('search')))
                                : null),
                        jsx("div", { key: 'content', className: classNames(CSS.scroller) }, this.renderListItems(editFeatures))))));
        };
        this.renderFormEmpty = (description) => {
            const { id, label, config } = this.props;
            const { noDataMessage, layersConfig, editMode } = config;
            const formHeader = this.refs.formHeaderContainer;
            if (formHeader === null || formHeader === void 0 ? void 0 : formHeader.innerHTML)
                formHeader.innerHTML = '';
            const hasValidLayer = layersConfig.length > 0;
            const isAttrMode = editMode === EditModeType.Attribute;
            const noLayerTips = isAttrMode ? this.formatMessage('initAttEmptyMessage') : this.formatMessage('initGeoEmptyMessage');
            const emptyTips = hasValidLayer ? (noDataMessage || this.formatMessage('noRecordTips')) : noLayerTips;
            const formDom = document.getElementById(`edit-container-${id}`);
            if (formDom)
                formDom === null || formDom === void 0 ? void 0 : formDom.classList.add('esri-hidden');
            return (jsx("div", { className: 'surface-1 h-100' },
                jsx("div", { className: classNames(`editor-white-bg ${CSS.featureForm}`) },
                    jsx("div", { className: CSS.formHeader },
                        jsx("h2", { className: CSS.heading }, label),
                        jsx("p", { className: classNames(`text-truncate ${CSS.description}`), key: 'description', title: description }, description))),
                jsx("div", { className: 'w-100 text-center edit-blank' },
                    jsx("div", { className: 'position-absolute edit-blank-content w-100' },
                        jsx(InfoOutlined, { size: 32, className: 'placeholder-icon' }),
                        jsx("p", null, emptyTips)))));
        };
        this.renderControlButtons = (buttons) => {
            return (jsx("div", { className: classNames(`flex-row justify-content-between ${CSS.controls}`), key: 'controls' }, buttons.map(({ disabled = false, label, type, clickHandler }, index) => this.renderButton({
                label,
                class: classNames({ 'single-buttons': buttons.length === 1 }, { 'multi-buttons': buttons.length > 1 }, disabled ? CSS.buttonDisabled : null),
                type,
                disabled,
                clickHandler,
                key: index
            }))));
        };
        this.handleNew = () => {
            var _a;
            const { dataSources } = this.state;
            const { config } = this.props;
            const { layersConfig } = config;
            const firstId = (_a = layersConfig.find(config => config === null || config === void 0 ? void 0 : config.addRecords)) === null || _a === void 0 ? void 0 : _a.id;
            if (firstId) {
                this.setState({ featureFormStep: 'new', activeId: firstId }, () => {
                    this.renderFeatureForm(dataSources[firstId]);
                });
            }
        };
        this.handleAdd = () => {
            var _a;
            const addFeature = (_a = this.edit.viewModel) === null || _a === void 0 ? void 0 : _a.feature;
            if (addFeature) {
                const updated = this.edit.getValues();
                addFeature.attributes = updated;
                const edits = {
                    addFeatures: [addFeature]
                };
                this.applyAttributeUpdates(edits);
            }
        };
        this.handleSave = () => {
            var _a, _b;
            (_b = (_a = this.edit) === null || _a === void 0 ? void 0 : _a.viewModel) === null || _b === void 0 ? void 0 : _b.submit();
            this.setState({ attrUpdating: true });
        };
        this.handleDeleteConfirm = () => {
            this.setState({ delConfirm: true });
        };
        this.cancleDelete = () => {
            this.setState({ delConfirm: false });
        };
        this.handleDelete = () => {
            const delFeature = this.edit.viewModel.feature;
            if (delFeature) {
                const edits = {
                    deleteFeatures: [delFeature]
                };
                this.applyAttributeUpdates(edits);
            }
            this.setState({ delConfirm: false });
        };
        this.renderButton = (props) => {
            return (jsx(Button, { className: props.class, disabled: props.disabled, key: props.key, onClick: props.clickHandler, type: props.type }, props.label));
        };
        this.constructFieldConfig = (groupedFields) => {
            const useGroupedFields = groupedFields === null || groupedFields === void 0 ? void 0 : groupedFields.asMutable({ deep: true });
            const elements = useGroupedFields.map(item => {
                if (item === null || item === void 0 ? void 0 : item.children) {
                    return new GroupElement({
                        label: item.name,
                        description: item.subDescription || (item === null || item === void 0 ? void 0 : item.description),
                        elements: item === null || item === void 0 ? void 0 : item.children.map(ele => {
                            return new FieldElement({
                                fieldName: ele.jimuName,
                                label: ele === null || ele === void 0 ? void 0 : ele.alias,
                                description: ele.subDescription || (ele === null || ele === void 0 ? void 0 : ele.description),
                                editable: ele.editAuthority
                            });
                        })
                    });
                }
                else {
                    return new FieldElement({
                        fieldName: item.jimuName,
                        label: item === null || item === void 0 ? void 0 : item.alias,
                        description: item.subDescription || (item === null || item === void 0 ? void 0 : item.description),
                        editable: item.editAuthority
                    });
                }
            });
            return elements;
        };
        this.setupEditLayerInfos = (jimuMapView) => {
            var _a, _b;
            const { config } = this.props;
            const { layersConfig } = config;
            const editLayerInfos = [];
            let count = 0;
            // Due to the special mechanism of the interface, all unconfigured layers are enabled by default.
            // Therefore, now set the default permissions of layer not configured to false.
            const mapAllLayers = ((_b = (_a = jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.allLayers) || [];
            const allLayers = mapAllLayers.filter(item => item.type === 'feature');
            // Draw widget measurements layer
            const measureLayers = [];
            mapAllLayers.forEach(layer => {
                if (layer === null || layer === void 0 ? void 0 : layer.id.includes('jimu-draw-measurements-layer')) {
                    measureLayers.push(layer);
                }
            });
            if (measureLayers.length > 0) {
                measureLayers.forEach(measureLayer => {
                    editLayerInfos.push({
                        layer: measureLayer,
                        enabled: false,
                        addEnabled: false,
                        updateEnabled: false,
                        deleteEnabled: false
                    });
                });
            }
            allLayers.forEach((layer) => __awaiter(this, void 0, void 0, function* () {
                const activeConfigLayer = layersConfig.find(config => config.layerId === layer.id);
                // new Editor must use layer on map
                const editorUseLayer = layer;
                // If editorUseLayer is undefined, indicates that map is invisible(switch mapGroup)
                // It does not have to be added to editLayerInfos
                if (editorUseLayer) {
                    if (activeConfigLayer) { // It has been configured in setting
                        const { groupedFields, addRecords, deleteRecords, updateGeometries, layerHonorMode, id } = activeConfigLayer;
                        const isHonorWebmap = layerHonorMode === LayerHonorModeType.Webmap;
                        // fetch to confirm whether it's a public source
                        const accessible = yield this.getDsAccessibleInfo(layer === null || layer === void 0 ? void 0 : layer.url);
                        // use exb privilege instead of api's supportsUpdateByOthers
                        const privilegeEditable = yield this.getPrivilege();
                        const editable = accessible || privilegeEditable;
                        const formTemplate = new FormTemplate({
                            elements: this.constructFieldConfig(groupedFields)
                        });
                        editLayerInfos.push(Object.assign(Object.assign({ layer: editorUseLayer }, (isHonorWebmap ? {} : { formTemplate })), { enabled: editable && (addRecords || updateGeometries || deleteRecords), addEnabled: addRecords, updateEnabled: updateGeometries, deleteEnabled: deleteRecords }));
                        // update dataSource after edit
                        const watchEditLayer = editorUseLayer;
                        watchEditLayer.on('edits', event => {
                            var _a, _b, _c, _d, _e, _f;
                            const { dataSources } = this.state;
                            const dataSource = dataSources[id];
                            const { addedFeatures, updatedFeatures, deletedFeatures } = event;
                            const adds = addedFeatures && addedFeatures.length > 0;
                            const updates = updatedFeatures && updatedFeatures.length > 0;
                            const deletes = deletedFeatures && deletedFeatures.length > 0;
                            if (adds) {
                                const addFeature = (_b = (_a = event === null || event === void 0 ? void 0 : event.edits) === null || _a === void 0 ? void 0 : _a.addFeatures) === null || _b === void 0 ? void 0 : _b[0];
                                if (addFeature) {
                                    const record = dataSource.buildRecord(addFeature);
                                    dataSource.afterAddRecord(record);
                                }
                            }
                            if (updates) {
                                const updateFeature = (_d = (_c = event === null || event === void 0 ? void 0 : event.edits) === null || _c === void 0 ? void 0 : _c.updateFeatures) === null || _d === void 0 ? void 0 : _d[0];
                                if (updateFeature) {
                                    const record = dataSource.buildRecord(updateFeature);
                                    dataSource.afterUpdateRecord(record);
                                }
                            }
                            if (deletes) {
                                const deleteFeature = (_f = (_e = event === null || event === void 0 ? void 0 : event.edits) === null || _e === void 0 ? void 0 : _e.deleteFeatures) === null || _f === void 0 ? void 0 : _f[0];
                                if (deleteFeature) {
                                    const record = dataSource.buildRecord(deleteFeature);
                                    dataSource.afterDeleteRecordById(record.getId());
                                }
                            }
                        });
                    }
                    else {
                        editLayerInfos.push({
                            layer: editorUseLayer,
                            enabled: false,
                            addEnabled: false,
                            updateEnabled: false,
                            deleteEnabled: false
                        });
                    }
                }
                count++;
                if (count === allLayers.length) {
                    const editor = this.edit;
                    editor.layerInfos = editLayerInfos;
                }
            }));
        };
        this.createEditor = (mapView) => {
            var _a, _b;
            let { jimuMapView } = this.state;
            const { useMapWidgetIds } = this.props;
            if (!useMapWidgetIds || useMapWidgetIds.length === 0)
                return;
            if (mapView)
                jimuMapView = mapView;
            if (!jimuMapView)
                return;
            const { id, config } = this.props;
            const { layersConfig, selfSnapping, featureSnapping } = config;
            if ((layersConfig === null || layersConfig === void 0 ? void 0 : layersConfig.length) === 0)
                return;
            // only setting change
            if (typeof this.edit !== 'undefined') {
                if (!mapView && this.edit && !this.edit.destroyed) {
                    this.setupEditLayerInfos(jimuMapView);
                    return;
                }
            }
            this.destoryEdit();
            let container = null;
            const existingDom = document.getElementById(`edit-container-${id}`);
            if (existingDom) {
                existingDom.remove();
            }
            container = document && document.createElement('div');
            container.id = `edit-container-${id}`;
            container.className = `h-100 edit-container-${id}`;
            this.refs.editContainer.appendChild(container);
            const editLayerInfos = [];
            let count = 0;
            const snapOn = selfSnapping || featureSnapping;
            const newEditor = () => {
                this.edit = new Editor({
                    container: container,
                    view: jimuMapView.view,
                    layerInfos: editLayerInfos,
                    snappingOptions: {
                        enabled: snapOn,
                        selfEnabled: selfSnapping,
                        featureEnabled: featureSnapping
                    },
                    visibleElements: {
                        snappingControls: snapOn
                    }
                });
            };
            // Due to the special mechanism of the interface, all unconfigured layers are enabled by default.
            // Therefore, now set the default permissions of layer not configured to false.
            const mapAllLayers = ((_b = (_a = jimuMapView.view) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.allLayers) || [];
            const allLayers = mapAllLayers.filter(item => item.type === 'feature');
            // Draw widget measurements layer
            const measureLayers = [];
            mapAllLayers.forEach(layer => {
                if (layer === null || layer === void 0 ? void 0 : layer.id.includes('jimu-draw-measurements-layer')) {
                    measureLayers.push(layer);
                }
            });
            if (measureLayers.length > 0) {
                measureLayers.forEach(measureLayer => {
                    editLayerInfos.push({
                        layer: measureLayer,
                        enabled: false,
                        addEnabled: false,
                        updateEnabled: false,
                        deleteEnabled: false
                    });
                });
            }
            allLayers.forEach((layer) => __awaiter(this, void 0, void 0, function* () {
                const activeConfigLayer = layersConfig.find(config => config.layerId === layer.id);
                // new Editor must use layer on map
                const editorUseLayer = layer;
                // If editorUseLayer is undefined, indicates that map is invisible(switch mapGroup)
                // It does not have to be added to editLayerInfos
                if (editorUseLayer) {
                    if (activeConfigLayer) { // It has been configured in setting
                        const { groupedFields, addRecords, deleteRecords, updateGeometries, layerHonorMode, id } = activeConfigLayer;
                        const isHonorWebmap = layerHonorMode === LayerHonorModeType.Webmap;
                        // fetch to confirm whether it's a public source
                        const accessible = yield this.getDsAccessibleInfo(layer === null || layer === void 0 ? void 0 : layer.url);
                        // use exb privilege instead of api's supportsUpdateByOthers
                        const privilegeEditable = yield this.getPrivilege();
                        const editable = accessible || privilegeEditable;
                        const formTemplate = new FormTemplate({
                            elements: this.constructFieldConfig(groupedFields)
                        });
                        editLayerInfos.push(Object.assign(Object.assign({ layer: editorUseLayer }, (isHonorWebmap ? {} : { formTemplate })), { enabled: editable && (addRecords || updateGeometries || deleteRecords), addEnabled: addRecords, updateEnabled: updateGeometries, deleteEnabled: deleteRecords }));
                        // update dataSource after edit
                        const watchEditLayer = editorUseLayer;
                        watchEditLayer.on('edits', event => {
                            var _a, _b, _c, _d, _e, _f;
                            const { dataSources } = this.state;
                            const dataSource = dataSources[id];
                            const { addedFeatures, updatedFeatures, deletedFeatures } = event;
                            const adds = addedFeatures && addedFeatures.length > 0;
                            const updates = updatedFeatures && updatedFeatures.length > 0;
                            const deletes = deletedFeatures && deletedFeatures.length > 0;
                            if (adds) {
                                const addFeature = (_b = (_a = event === null || event === void 0 ? void 0 : event.edits) === null || _a === void 0 ? void 0 : _a.addFeatures) === null || _b === void 0 ? void 0 : _b[0];
                                if (addFeature) {
                                    const record = dataSource.buildRecord(addFeature);
                                    dataSource.afterAddRecord(record);
                                }
                            }
                            if (updates) {
                                const updateFeature = (_d = (_c = event === null || event === void 0 ? void 0 : event.edits) === null || _c === void 0 ? void 0 : _c.updateFeatures) === null || _d === void 0 ? void 0 : _d[0];
                                if (updateFeature) {
                                    const record = dataSource.buildRecord(updateFeature);
                                    dataSource.afterUpdateRecord(record);
                                }
                            }
                            if (deletes) {
                                const deleteFeature = (_f = (_e = event === null || event === void 0 ? void 0 : event.edits) === null || _e === void 0 ? void 0 : _e.deleteFeatures) === null || _f === void 0 ? void 0 : _f[0];
                                if (deleteFeature) {
                                    const record = dataSource.buildRecord(deleteFeature);
                                    dataSource.afterDeleteRecordById(record.getId());
                                }
                            }
                        });
                    }
                    else {
                        editLayerInfos.push({
                            layer: editorUseLayer,
                            enabled: false,
                            addEnabled: false,
                            updateEnabled: false,
                            deleteEnabled: false
                        });
                    }
                }
                count++;
                if (count === allLayers.length) {
                    newEditor();
                }
            }));
        };
        this.getFeatureLayer = (dataSource) => {
            var _a;
            const { id } = this.props;
            const ds = dataSource;
            const notToLoad = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getDataSourceJson()) === null || _a === void 0 ? void 0 : _a.isDataInDataSourceInstance;
            let featureLayer;
            const curQuery = dataSource && dataSource.getCurrentQueryParams();
            if (notToLoad) {
                // chart output and selected features need load
                return ds.load({ returnGeometry: true }, { widgetId: id }).then((records) => __awaiter(this, void 0, void 0, function* () {
                    const dataRecords = yield Promise.resolve(records);
                    return dataSourceUtils.createFeatureLayerByRecords(ds, dataRecords);
                })).catch(err => {
                    console.error(err);
                });
            }
            // Adjust the order, because ds.layer is a reference type that changes the original data
            // csv upload type ds: only have layer, but not itemId and url
            if (!FeatureLayer)
                return Promise.resolve(featureLayer);
            if (ds.itemId) {
                const layerId = parseInt(ds.layerId);
                const layerConfig = {
                    portalItem: {
                        id: ds.itemId,
                        portal: {
                            url: ds.portalUrl
                        }
                    },
                    definitionExpression: curQuery.where,
                    layerId: layerId || undefined
                };
                if (ds.url)
                    layerConfig.url = ds.url;
                featureLayer = new FeatureLayer(layerConfig);
            }
            else if (ds.url) {
                featureLayer = new FeatureLayer({
                    definitionExpression: curQuery.where,
                    url: ds.url
                });
            }
            else if (ds.layer) {
                return ds.load({ returnGeometry: true }, { widgetId: id }).then((records) => __awaiter(this, void 0, void 0, function* () {
                    const dataRecords = yield Promise.resolve(records);
                    return dataSourceUtils.createFeatureLayerByRecords(ds, dataRecords);
                })).catch(err => {
                    console.error(err);
                });
            }
            else {
                return Promise.resolve(featureLayer);
            }
            if (notToLoad) { // output ds (dynamic layer, load will rise bug)
                return Promise.resolve(featureLayer);
            }
            else { // need load to get layer.capabilities
                return featureLayer.load().then(() => __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.resolve(featureLayer);
                })).catch(err => {
                    console.error(err);
                });
            }
        };
        this.getCurrentEditLayer = (layerId) => {
            const { activeId, jimuMapView } = this.state;
            const { config } = this.props;
            const { layersConfig } = config;
            const mapLayers = jimuMapView.view.map.layers;
            const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId);
            const { id: configDsId } = activeConfig;
            let currentEditLayer = mapLayers.find(layer => layer.id === layerId);
            if (!currentEditLayer) {
                mapLayers.forEach(layer => {
                    const subLayers = layer === null || layer === void 0 ? void 0 : layer.layers;
                    if (subLayers && ((configDsId === null || configDsId === void 0 ? void 0 : configDsId.includes(layer.id)) || (configDsId === null || configDsId === void 0 ? void 0 : configDsId.includes(layerId)))) {
                        currentEditLayer = subLayers.find(layer => { var _a; return (((_a = layer.layerId) === null || _a === void 0 ? void 0 : _a.toString()) === layerId || layer.id === layerId); });
                    }
                });
            }
            return currentEditLayer;
        };
        this.startWorkFlowWhenAwait = (editFeatures, useDataSourceId) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f;
            const { activeId, dataSources, editFeatures: orgEditFeatures, jimuMapView } = this.state;
            const edit = this.edit;
            // The number of selected(the layers from the same map)
            const newEditFeatures = editFeatures || orgEditFeatures;
            const mapEditCount = this.flatMapArrayWithView(newEditFeatures, jimuMapView).length;
            if (mapEditCount === 1) {
                const dsId = useDataSourceId || activeId;
                const objectIdField = this.getLayerObjectIdField(dataSources[dsId]);
                const activeGraphic = (_f = (_e = newEditFeatures === null || newEditFeatures === void 0 ? void 0 : newEditFeatures[dsId]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.feature;
                const currentEditLayer = this.getCurrentEditLayer(activeGraphic === null || activeGraphic === void 0 ? void 0 : activeGraphic.layer.id);
                // currentEditLayer is not in active map
                if (!currentEditLayer)
                    return;
                const query = new Query({
                    where: `${objectIdField} = ${activeGraphic.attributes[objectIdField]}`,
                    outFields: ['*'],
                    returnGeometry: true
                });
                currentEditLayer.queryFeatures(query).then(results => {
                    const activeFeature = results === null || results === void 0 ? void 0 : results.features[0];
                    edit === null || edit === void 0 ? void 0 : edit.startUpdateWorkflowAtFeatureEdit(activeFeature);
                }).catch(err => {
                    console.error(err);
                });
            }
            else if (mapEditCount > 1) {
                const loopAddGraphics = () => __awaiter(this, void 0, void 0, function* () {
                    var _g;
                    let graphics = [];
                    const promises = [];
                    for (const dsId in newEditFeatures) {
                        const objectIdField = this.getLayerObjectIdField(dataSources[dsId]);
                        const layerFeaturesArray = newEditFeatures === null || newEditFeatures === void 0 ? void 0 : newEditFeatures[dsId];
                        if ((layerFeaturesArray === null || layerFeaturesArray === void 0 ? void 0 : layerFeaturesArray.length) > 0) {
                            const selectedQuery = `${objectIdField} IN (${newEditFeatures[dsId]
                                .map(record => {
                                const activeGraphic = record === null || record === void 0 ? void 0 : record.feature;
                                return activeGraphic.attributes[objectIdField];
                            })
                                .join()})`;
                            const currentGraphic = (_g = layerFeaturesArray[0]) === null || _g === void 0 ? void 0 : _g.feature;
                            const currentEditLayer = this.getCurrentEditLayer(currentGraphic === null || currentGraphic === void 0 ? void 0 : currentGraphic.layer.id);
                            const query = new Query({
                                where: selectedQuery,
                                outFields: ['*'],
                                returnGeometry: true
                            });
                            promises.push(currentEditLayer.queryFeatures(query));
                        }
                    }
                    const results = yield Promise.all(promises);
                    Object.keys(newEditFeatures).forEach((dsId, index) => {
                        var _a;
                        graphics = graphics.concat(((_a = results[index]) === null || _a === void 0 ? void 0 : _a.features) || []);
                    });
                    return graphics;
                });
                const graphics = yield loopAddGraphics();
                edit === null || edit === void 0 ? void 0 : edit.startUpdateWorkflowAtMultipleFeatureSelection(graphics);
            }
            else {
                if (edit === null || edit === void 0 ? void 0 : edit.activeWorkflow)
                    edit === null || edit === void 0 ? void 0 : edit.cancelWorkflow();
            }
        });
        this.idsArrayEquals = (newDataSourceId, newSelectedIds) => {
            var _a, _b;
            if (!newSelectedIds)
                return false;
            if (((_a = this.selectedIds[newDataSourceId]) === null || _a === void 0 ? void 0 : _a.length) !== newSelectedIds.length)
                return false;
            let equal = true;
            (_b = this.selectedIds[newDataSourceId]) === null || _b === void 0 ? void 0 : _b.forEach((id, index) => {
                if (id !== newSelectedIds[index])
                    equal = false;
            });
            return equal;
        };
        this.onDataSourceSelectedChange = (dataSourceId, selectedIds) => __awaiter(this, void 0, void 0, function* () {
            var _h, _j;
            if (this.idsArrayEquals(dataSourceId, selectedIds))
                return;
            const newRequestId = this.currentRequestId + 1;
            this.currentRequestId++;
            this.selectedIds[dataSourceId] = selectedIds;
            const { config } = this.props;
            const { editMode, layersConfig } = config;
            const { activeId, dataSources, editFeatures, jimuMapView } = this.state;
            let useDataSourceId = dataSourceId;
            const newEditFeatures = Object.assign({}, editFeatures);
            if (!dataSources[useDataSourceId]) {
                const currentDs = this.dsManager.getDataSource(useDataSourceId);
                if (currentDs) {
                    dataSources[useDataSourceId] = currentDs;
                }
            }
            const selectedRecords = (_h = dataSources[useDataSourceId]) === null || _h === void 0 ? void 0 : _h.getSelectedRecords();
            newEditFeatures[useDataSourceId] = selectedRecords;
            const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, layersConfig);
            const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
            const editCount = flatEditFeatures.length;
            const step = editCount > 1 ? 'list' : editCount === 1 ? 'form' : 'empty';
            // If the last one of ds has been deselect, and there still other ds has selected record
            // dataSourceId need change to other's (Only for Attribute Type)
            if ((selectedRecords === null || selectedRecords === void 0 ? void 0 : selectedRecords.length) === 0 && editCount === 1) {
                let newDsId;
                for (const dsId in newEditFeatures) {
                    if (((_j = newEditFeatures === null || newEditFeatures === void 0 ? void 0 : newEditFeatures[dsId]) === null || _j === void 0 ? void 0 : _j.length) === 1) {
                        newDsId = dsId;
                    }
                }
                useDataSourceId = newDsId;
            }
            const dsChange = activeId !== dataSourceId;
            // FeatureForm
            if (editMode === EditModeType.Attribute) {
                this.setState({ editFeatures: newEditFeatures, activeId: useDataSourceId, featureFormStep: step }, () => {
                    this.createEditForm(useDataSourceId, dsChange, newRequestId);
                });
            }
            // Editor
            if (editMode === EditModeType.Geometry) {
                if (!jimuMapView)
                    return;
                this.setState({ editFeatures: newEditFeatures, activeId: dataSourceId }, () => {
                    this.startWorkFlowWhenAwait(newEditFeatures, useDataSourceId);
                });
            }
        });
        this.onIsDataSourceNotReady = (dataSourceId, dataSourceStatus) => {
            this.setState((state) => {
                var _a;
                const isOutPutDs = (_a = state.dataSources[dataSourceId]) === null || _a === void 0 ? void 0 : _a.getDataSourceJson().isOutputFromWidget;
                if (!isOutPutDs) {
                    return;
                }
                const outputDataSource = Object.assign({}, state.outputDataSourceIsNotReady);
                outputDataSource[dataSourceId] = dataSourceStatus === DataSourceStatus.NotReady;
                return { outputDataSourceIsNotReady: outputDataSource };
            });
        };
        this.onCreateDataSourceCreatedOrFailed = (dataSourceId, dataSource) => {
            this.setState((state) => {
                const newDataSources = Object.assign({}, state.dataSources);
                newDataSources[dataSourceId] = dataSource;
                return { dataSources: newDataSources };
            });
        };
        this.onDataSourceVersionChange = (dataSourceId) => {
            const { config } = this.props;
            const { editMode } = config;
            // FeatureForm
            if (editMode === EditModeType.Attribute) {
                this.setState({ activeId: dataSourceId }, () => {
                    this.createEditForm(dataSourceId, true);
                });
            }
        };
        this.onLayerChange = (evt) => {
            var _a;
            const { dataSources } = this.state;
            const selectedLayerId = (_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.value;
            this.setState({ activeId: selectedLayerId }, () => {
                this.renderFeatureForm(dataSources[selectedLayerId]);
            });
        };
        this.handleBack = () => {
            const { id, config } = this.props;
            const { layersConfig } = config;
            const { editFeatures } = this.state;
            const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig);
            const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
            const editCount = flatEditFeatures.length;
            if (editCount === 0) {
                this.setState({ featureFormStep: 'empty' });
            }
            else if (editCount > 1) {
                this.setState({ featureFormStep: 'list' });
            }
            document.getElementById(`edit-container-${id}`).classList.add('esri-hidden');
        };
        this.getInLayersConfigFeatures = (editFeatures, layersConfig) => {
            const newEditFeatures = Object.assign({}, editFeatures);
            const editFeaturesKeys = Object.keys(editFeatures);
            editFeaturesKeys.forEach(dsId => {
                const isInLayersConfig = layersConfig.some(config => dsId.includes(config.id));
                if (!isInLayersConfig) {
                    delete newEditFeatures[dsId];
                }
            });
            return newEditFeatures;
        };
        this.state = {
            jimuMapView: undefined,
            dataSources: {},
            outputDataSourceIsNotReady: {},
            editFeatures: {},
            activeId: undefined,
            featureFormStep: 'empty',
            filterText: '',
            formEditable: false,
            delConfirm: false,
            attrUpdating: false,
            formChange: false,
            loading: false
        };
        this.dsManager = DataSourceManager.getInstance();
        this.removeLayerOnce = false;
        this.selectedIds = {};
        this.currentRequestId = 0;
        this.timerFn = null;
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const { id, config } = this.props;
        const { editFeatures, dataSources, activeId } = this.state;
        const { editMode, layersConfig, selfSnapping, featureSnapping } = config;
        const { config: preConfig } = prevProps;
        const { editMode: preEditMode, layersConfig: preLayersConfig, selfSnapping: preSelf, featureSnapping: preFeature } = preConfig;
        const settingChange = preLayersConfig !== layersConfig;
        if (layersConfig.length === 0)
            this.destoryEdit();
        const editModeChange = preEditMode !== editMode;
        if (editModeChange)
            this.destoryEdit();
        if (settingChange) {
            if (editMode === EditModeType.Geometry) {
                this.createEditor();
            }
            else {
                const edit = this.edit;
                const selectedDs = Object.keys(editFeatures);
                const hasSelected = layersConfig.some(config => selectedDs.includes(config.id));
                const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig);
                const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
                const editCount = flatEditFeatures.length;
                if ((edit === null || edit === void 0 ? void 0 : edit.formTemplate) && layersConfig.length !== 0) {
                    const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId);
                    // layerHonorMode change
                    if ((activeConfig === null || activeConfig === void 0 ? void 0 : activeConfig.layerHonorMode) === LayerHonorModeType.Webmap) {
                        const dataSource = dataSources[activeId];
                        edit.formTemplate = (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.layer) === null || _a === void 0 ? void 0 : _a.formTemplate;
                    }
                    else if (edit === null || edit === void 0 ? void 0 : edit.formTemplate) {
                        const formElements = this.constructFormElements();
                        const formTemplate = new FormTemplate({
                            elements: formElements
                        });
                        edit.formTemplate = formTemplate;
                    }
                    const elements = (_b = edit === null || edit === void 0 ? void 0 : edit.formTemplate) === null || _b === void 0 ? void 0 : _b.elements;
                    if ((elements === null || elements === void 0 ? void 0 : elements.length) === 0) {
                        (_c = document.getElementById(`edit-container-${id}`)) === null || _c === void 0 ? void 0 : _c.classList.add('esri-hidden');
                    }
                    else if (editCount !== 0) {
                        (_d = document.getElementById(`edit-container-${id}`)) === null || _d === void 0 ? void 0 : _d.classList.remove('esri-hidden');
                    }
                }
                else if (layersConfig.length !== 0 && hasSelected) {
                    // some featur has been selected before mode change
                    if (editCount === 1) {
                        const dataSource = dataSources === null || dataSources === void 0 ? void 0 : dataSources[selectedDs[0]];
                        const graphic = (_e = dataSource.getSelectedRecords()) === null || _e === void 0 ? void 0 : _e[0];
                        if (!graphic)
                            return;
                        this.renderFeatureForm(dataSource, graphic);
                    }
                    else if (editCount > 1 || editCount === 0) {
                        (_f = document.getElementById(`edit-container-${id}`)) === null || _f === void 0 ? void 0 : _f.classList.add('esri-hidden');
                    }
                }
            }
        }
        // snap config change
        const snapChange = (selfSnapping !== preSelf) || (featureSnapping !== preFeature);
        if (snapChange) {
            const snapOn = selfSnapping || featureSnapping;
            if (this.edit && editMode === EditModeType.Geometry) {
                this.edit.visibleElements = {
                    snappingControls: snapOn,
                    snappingControlsElements: {
                        enabledToggle: true,
                        selfEnabledToggle: selfSnapping,
                        featureEnabledToggle: featureSnapping
                    }
                };
            }
        }
        const removeLayerFlag = ((_h = (_g = this.props) === null || _g === void 0 ? void 0 : _g.stateProps) === null || _h === void 0 ? void 0 : _h.removeLayerFlag) || false;
        if (removeLayerFlag && !this.removeLayerOnce) {
            this.props.dispatch(appActions.widgetStatePropChange(id, 'removeLayerFlag', false));
            const newEditFeatures = Object.assign({}, editFeatures);
            const idArray = Object.keys(newEditFeatures);
            idArray.forEach(id => {
                if (!layersConfig.find(config => config.id === id)) {
                    delete newEditFeatures[id];
                }
            });
            const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, layersConfig);
            const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
            const editCount = flatEditFeatures.length;
            const step = editCount > 1 ? 'list' : editCount === 1 ? 'form' : 'empty';
            if (step === 'form') {
                this.removeLayerOnce = true;
                const dsId = (_l = (_k = (_j = flatEditFeatures[0]) === null || _j === void 0 ? void 0 : _j.dataSource) === null || _k === void 0 ? void 0 : _k.belongToDataSource) === null || _l === void 0 ? void 0 : _l.id;
                (_m = document.getElementById(`edit-container-${id}`)) === null || _m === void 0 ? void 0 : _m.classList.remove('esri-hidden');
                this.renderFeatureForm(dataSources[dsId], flatEditFeatures[0]);
            }
            else if (step === 'list') {
                (_o = document.getElementById(`edit-container-${id}`)) === null || _o === void 0 ? void 0 : _o.classList.add('esri-hidden');
            }
            this.setState({ editFeatures: newEditFeatures, featureFormStep: step });
        }
    }
    componentWillUnmount() {
        const { config } = this.props;
        const { editMode } = config;
        const isGeoMode = editMode === EditModeType.Geometry;
        if (this.edit && isGeoMode) {
            const edit = this.edit;
            edit === null || edit === void 0 ? void 0 : edit.cancelWorkflow();
        }
    }
    render() {
        var _a;
        const { activeId, editFeatures, featureFormStep, formEditable, delConfirm, attrUpdating, formChange, loading } = this.state;
        const { id, theme, config, useDataSources, useMapWidgetIds } = this.props;
        const { editMode, description, layersConfig } = config;
        const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId);
        const deleteRecords = (_a = activeConfig === null || activeConfig === void 0 ? void 0 : activeConfig.deleteRecords) !== null && _a !== void 0 ? _a : false;
        const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig);
        const flatEditFeatures = this.flatMapArray(inConfigEditFeatures);
        const editCount = flatEditFeatures.length;
        // The add button is displayed if any of them are allowed to be added
        const addable = layersConfig.some(config => config === null || config === void 0 ? void 0 : config.addRecords);
        const controls = [
            {
                label: this.formatMessage('update'),
                type: 'primary',
                disabled: !formChange,
                clickHandler: this.handleSave
            }
        ];
        if (deleteRecords) {
            controls.push({
                label: this.formatMessage('delete'),
                type: 'default',
                clickHandler: this.handleDeleteConfirm
            });
        }
        const addControls = [
            {
                label: this.formatMessage('add'),
                type: 'primary',
                disabled: false,
                clickHandler: this.handleAdd
            }
        ];
        const isAttrMode = editMode === EditModeType.Attribute;
        const hasSurface = (isAttrMode && (featureFormStep === 'form' || featureFormStep === 'new')) || (!isAttrMode && layersConfig.length !== 0);
        const hasEdit = (isAttrMode && featureFormStep !== 'list' && featureFormStep !== 'empty') || (!isAttrMode && layersConfig.length !== 0);
        if (!isAttrMode && (!useMapWidgetIds || useMapWidgetIds.length === 0)) {
            return (jsx(WidgetPlaceholder, { widgetId: id, autoFlip: true, iconSize: 'large', style: { position: 'absolute', left: 0, top: 0 }, icon: editPlaceholderIcon, "data-testid": 'editPlaceholder' }));
        }
        return (jsx("div", { className: classNames(`jimu-widget widget-edit esri-widget edit-widget-${id}`), css: getStyle(theme, id, featureFormStep, editCount, isAttrMode) },
            isAttrMode && attrUpdating &&
                jsx("div", { className: CSS.progressBar }),
            jsx("div", { className: classNames('edit-con', { 'surface-1': hasSurface, 'h-100': hasEdit }) },
                jsx("div", { ref: 'formHeaderContainer', className: 'form-header-container' }),
                jsx("div", { ref: 'editContainer', className: classNames({ 'h-100': !isAttrMode, 'attr-height': isAttrMode && hasEdit }) }, isAttrMode && featureFormStep === 'new' &&
                    jsx("div", { className: 'layer-selector' },
                        jsx("label", { className: 'esri-feature-form__label' }, this.formatMessage('selectLayer')),
                        jsx(Select, { value: activeId, onChange: this.onLayerChange }, layersConfig.filter(item => item.addRecords).map(config => {
                            return (jsx("option", { key: config.id, value: config.id }, config.name));
                        })))),
                isAttrMode && editCount > 0 && featureFormStep === 'form' && formEditable &&
                    this.renderControlButtons(controls),
                isAttrMode && featureFormStep === 'new' &&
                    this.renderControlButtons(addControls)),
            !isAttrMode &&
                jsx(JimuMapViewComponent, { useMapWidgetId: useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0], onActiveViewChange: this.handleActiveViewChange }),
            isAttrMode && editCount > 1 && featureFormStep === 'list' &&
                this.renderFeatureList(inConfigEditFeatures, description),
            loading &&
                jsx("div", { className: CSS.loaderContainer },
                    jsx("div", { className: CSS.loader, key: 'loader' })),
            isAttrMode && (featureFormStep === 'empty' || layersConfig.length === 0) &&
                this.renderFormEmpty(description),
            !isAttrMode && layersConfig.length === 0 &&
                this.renderFormEmpty(),
            isAttrMode && delConfirm &&
                jsx(React.Fragment, null,
                    jsx("div", { className: 'confirm-scrim' }),
                    jsx("div", { className: CSS.promptDanger },
                        jsx("div", { className: CSS.promptHeader },
                            jsx(WarningOutlined, null),
                            jsx("h4", { className: classNames(CSS.widgetHeading, CSS.promptHeaderHeading) }, this.formatMessage('deleteRecord'))),
                        jsx("div", { className: CSS.promptMessage }, this.formatMessage('deleteRecordTips')),
                        jsx("div", { className: CSS.promptDivider }),
                        jsx("div", { className: CSS.promptActions },
                            jsx(Button, { className: classNames(CSS.warningOption, CSS.warningOptionPrimary), onClick: this.cancleDelete }, this.formatMessage('keepRecord')),
                            jsx(Button, { className: classNames(CSS.warningOption, CSS.warningOptionPositive), onClick: this.handleDelete }, this.formatMessage('delete'))))),
            isAttrMode && addable && featureFormStep !== 'form' && featureFormStep !== 'new' &&
                jsx(Button, { size: 'sm', icon: true, type: 'tertiary', className: 'add-feature-btn', onClick: this.handleNew, title: this.formatMessage('addFeature'), "aria-label": this.formatMessage('addFeature') },
                    jsx(PlusOutlined, null)),
            isAttrMode && (featureFormStep === 'form' || featureFormStep === 'new') && editCount > 1 &&
                jsx(Button, { size: 'sm', icon: true, type: 'tertiary', className: 'back-list-btn', onClick: this.handleBack, title: this.formatMessage('back'), "aria-label": this.formatMessage('back') },
                    jsx(ArrowLeftOutlined, { autoFlip: true })),
            jsx("div", { className: 'ds-container' }, useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.map((useDs, key) => {
                return (jsx(EditItemDataSource, { key: key, useDataSource: useDs, onIsDataSourceNotReady: this.onIsDataSourceNotReady, onDataSourceSelectedChange: this.onDataSourceSelectedChange, onCreateDataSourceCreatedOrFailed: this.onCreateDataSourceCreatedOrFailed, onDataSourceVersionChange: this.onDataSourceVersionChange }));
            }))));
    }
}
Widget.mapExtraStateProps = (state, props) => {
    var _a;
    return {
        appMode: (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.appMode
    };
};
Widget.versionManager = versionManager;
//# sourceMappingURL=widget.js.map