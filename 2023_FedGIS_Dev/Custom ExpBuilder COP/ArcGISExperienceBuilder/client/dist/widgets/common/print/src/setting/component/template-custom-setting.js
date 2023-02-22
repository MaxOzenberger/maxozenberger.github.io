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
import { React, css, jsx, defaultMessages as jimuCoreDefaultMessage, Immutable, polished } from 'jimu-core';
import { SettingSection, SettingRow, SidePopper, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { hooks, TextInput, Select, Option, Button, Checkbox, Switch, NumericInput, MultiSelect, AlertPopup, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT, PrintTemplateType, ModeType } from '../../config';
import defaultMessages from '../translations/default';
import CommonTemplateSetting from './template-common-setting';
import { getIndexByTemplateId, checkIsCustomTemplate, initTemplateLayout, checkIsMapOnly, getLegendLayer, getScaleBarList, mergeTemplateSetting, getKeyOfNorthArrow } from '../../utils/utils';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
const { useEffect, useState } = React;
const EditIcon = require('jimu-icons/svg/outlined/editor/edit.svg');
var SettingCollapseType;
(function (SettingCollapseType) {
    SettingCollapseType["MapSize"] = "MAP SIZE";
    SettingCollapseType["Author"] = "AUTHOR";
    SettingCollapseType["Copyright"] = "COPYRIGHT";
    SettingCollapseType["Legend"] = "LEGEND";
    SettingCollapseType["ScaleBarUnit"] = "SCALE BAR UNIT";
    SettingCollapseType["AttributionVisible"] = "ATTRIBUTION VISIBLE";
    SettingCollapseType["CustomTextElements"] = "CUSTOM TEXZT ELEMENTS";
    SettingCollapseType["NorthArrow"] = "NORTH ARROW";
})(SettingCollapseType || (SettingCollapseType = {}));
const CustomSetting = (props) => {
    var _a, _b, _c, _d, _e;
    const nls = hooks.useTranslate(defaultMessages, jimuiDefaultMessage, jimuCoreDefaultMessage);
    const { id, isOpen, trigger, popperFocusNode, config, activeTemplateId, jimuMapView, toggle, handelTemplateListChange } = props;
    useEffect(() => {
        getCurrentTemplate();
        // eslint-disable-next-line
    }, [config, activeTemplateId]);
    const [template, setTemplate] = useState(null);
    const [templateIndex, setTemplateIndex] = useState(null);
    const [templateList, setTemplateList] = useState(null);
    const [templateName, setTemplateName] = useState((template === null || template === void 0 ? void 0 : template.label) || '');
    const [mapWidth, setMapWidth] = useState((_a = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _a === void 0 ? void 0 : _a.width);
    const [mapHeight, setMapHeight] = useState((_b = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _b === void 0 ? void 0 : _b.height);
    const [authorText, setAuthorText] = useState(((_c = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _c === void 0 ? void 0 : _c.authorText) || '');
    const [copyrightText, setCopyrightText] = useState(((_d = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _d === void 0 ? void 0 : _d.copyrightText) || '');
    const [openCollapseType, setOpenCollapseType] = useState(null);
    const [customTextElements, setcustomTextElements] = useState((_e = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _e === void 0 ? void 0 : _e.customTextElements);
    const [customTextElementsOpenList, setCustomTextElementsOpenList] = useState(null);
    const [isOpenRemind, setIsOpenRemind] = useState(false);
    const [northArrowKey, setNorthArrowKey] = useState(null);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f;
        setNorthArrowKey(getKeyOfNorthArrow((_a = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _a === void 0 ? void 0 : _a.elementOverrides));
        setTemplateName((template === null || template === void 0 ? void 0 : template.label) || '');
        setMapWidth((_b = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _b === void 0 ? void 0 : _b.width);
        setMapHeight((_c = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _c === void 0 ? void 0 : _c.height);
        setAuthorText(((_d = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _d === void 0 ? void 0 : _d.authorText) || '');
        setCopyrightText(((_e = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _e === void 0 ? void 0 : _e.copyrightText) || '');
        setcustomTextElements((_f = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _f === void 0 ? void 0 : _f.customTextElements);
    }, [template]);
    useEffect(() => {
        initCustomTextElementsOpenList();
    }, []);
    useEffect(() => {
        if (checkIsUpdateCustomTextElementsOpenList()) {
            initCustomTextElementsOpenList();
        }
    }, [customTextElements]);
    const checkIsUpdateCustomTextElementsOpenList = () => {
        if (!customTextElements)
            return false;
        if ((customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.length) !== (customTextElementsOpenList === null || customTextElementsOpenList === void 0 ? void 0 : customTextElementsOpenList.length)) {
            return true;
        }
        else {
            let isUpdate = false;
            customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.forEach((item, index) => {
                for (const key in item) {
                    if (!Object.prototype.hasOwnProperty.call(customTextElementsOpenList[index], key)) {
                        isUpdate = true;
                    }
                }
            });
            return isUpdate;
        }
    };
    const initCustomTextElementsOpenList = () => {
        const enableList = customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.map((info, index) => {
            const enable = {};
            for (const key in info) {
                enable[key] = false;
            }
            return enable;
        });
        setCustomTextElementsOpenList(Immutable(enableList || []));
    };
    const getCurrentTemplate = () => {
        const isCustomTemplate = checkIsCustomTemplate(config === null || config === void 0 ? void 0 : config.printServiceType, config === null || config === void 0 ? void 0 : config.printTemplateType);
        const templateList = isCustomTemplate ? config === null || config === void 0 ? void 0 : config.printCustomTemplate : config === null || config === void 0 ? void 0 : config.printOrgTemplate;
        const index = getIndexByTemplateId(templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true }), activeTemplateId);
        setTemplateIndex(index);
        setTemplateList(templateList);
        setTemplate((templateList === null || templateList === void 0 ? void 0 : templateList[index]) || null);
    };
    const handelCustomSettingChange = (key, value) => {
        const newTemplate = template.setIn(key, value);
        const newTemplateList = templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true });
        newTemplateList[templateIndex] = newTemplate === null || newTemplate === void 0 ? void 0 : newTemplate.asMutable({ deep: true });
        handelTemplateListChange(newTemplateList);
    };
    const handleTemplateNameAccept = (value) => {
        if (!value) {
            setTemplateName(template === null || template === void 0 ? void 0 : template.label);
            return false;
        }
        handelCustomSettingChange(['label'], value);
    };
    const handleTemplateNameChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setTemplateName(value);
    };
    const handleMapWidthAccept = (value) => {
        var _a;
        if (!value || Number(value) < 1) {
            setMapWidth((_a = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _a === void 0 ? void 0 : _a.width);
            return false;
        }
        handelCustomSettingChange(['exportOptions', 'width'], Number(value));
    };
    const handleMapWidthChange = (value) => {
        if (value < 1)
            return false;
        setMapWidth(value);
    };
    const handleMapHeightAccept = (value) => {
        var _a;
        if (!value || Number(value) < 1) {
            setMapHeight((_a = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _a === void 0 ? void 0 : _a.height);
            return false;
        }
        handelCustomSettingChange(['exportOptions', 'height'], Number(value));
    };
    const handleAuthorTextChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setAuthorText(value);
    };
    const handleAuthorTextAccept = (value) => {
        handelCustomSettingChange(['layoutOptions', 'authorText'], value);
    };
    const handleCopyrightTextChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setCopyrightText(value);
    };
    const handleCopyrightTextAccept = (value) => {
        handelCustomSettingChange(['layoutOptions', 'copyrightText'], value);
    };
    const handleMapHeightChange = (value) => {
        setMapHeight(value);
    };
    const openSettingCollapse = (openCollapseType) => {
        closeCustomTextElementCollapse();
        setOpenCollapseType(openCollapseType);
    };
    const closeSettingCollapse = () => {
        closeCustomTextElementCollapse();
        setOpenCollapseType(null);
    };
    const closeCustomTextElementCollapse = () => {
        //close Collapse of custom text elements
        const newCustomTextElementsOpenList = customTextElementsOpenList === null || customTextElementsOpenList === void 0 ? void 0 : customTextElementsOpenList.map(item => {
            const enable = {};
            for (const key in item) {
                enable[key] = false;
            }
            return enable;
        });
        setCustomTextElementsOpenList(newCustomTextElementsOpenList);
    };
    const handleScalebarUnitChange = (e) => {
        const format = e.target.value;
        handelCustomSettingChange(['layoutOptions', 'scalebarUnit'], format);
    };
    const handleLayoutChange = (e) => {
        var _a, _b, _c, _d;
        const layoutTemplate = e.target.value;
        const layout = (_c = (_b = (_a = config === null || config === void 0 ? void 0 : config.layoutChoiceList) === null || _a === void 0 ? void 0 : _a.filter(item => (item === null || item === void 0 ? void 0 : item.layout) === layoutTemplate)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.asMutable({ deep: true });
        const layoutInfo = {
            mapFrameSize: layout === null || layout === void 0 ? void 0 : layout.mapFrameSize,
            mapFrameUnit: layout === null || layout === void 0 ? void 0 : layout.mapFrameUnit,
            hasAuthorText: layout === null || layout === void 0 ? void 0 : layout.hasAuthorText,
            hasCopyrightText: layout === null || layout === void 0 ? void 0 : layout.hasCopyrightText,
            hasLegend: layout === null || layout === void 0 ? void 0 : layout.hasLegend,
            hasTitleText: layout === null || layout === void 0 ? void 0 : layout.hasTitleText,
            layout: layoutTemplate
        };
        let newTemplate = Object.assign(Object.assign({}, template === null || template === void 0 ? void 0 : template.asMutable({ deep: true })), layoutInfo);
        const isMapOnly = checkIsMapOnly(layout === null || layout === void 0 ? void 0 : layout.layout);
        if (isMapOnly) {
            newTemplate = (_d = Immutable(newTemplate).setIn(['exportOptions', 'width'], DEFAULT_MAP_WIDTH).setIn(['exportOptions', 'height'], DEFAULT_MAP_HEIGHT)) === null || _d === void 0 ? void 0 : _d.asMutable({ deep: true });
        }
        const newTemplateList = templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true });
        newTemplateList[templateIndex] = newTemplate;
        handelTemplateListChange(newTemplateList);
    };
    const handleCheckBoxChange = (key) => {
        handelCustomSettingChange([key], !(template === null || template === void 0 ? void 0 : template[key]));
    };
    const handleTemplatePropertyChange = (templateProperty) => {
        const newTemplateList = templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true });
        newTemplateList[templateIndex] = templateProperty === null || templateProperty === void 0 ? void 0 : templateProperty.asMutable({ deep: true });
        handelTemplateListChange(newTemplateList);
    };
    const handleOverrideCommonSettingsChanged = () => {
        const overrideCommonSetting = !(template === null || template === void 0 ? void 0 : template.overrideCommonSetting);
        if (overrideCommonSetting) {
            let newTemplate = template.setIn(['overrideCommonSetting'], overrideCommonSetting);
            newTemplate = mergeTemplateSetting(newTemplate, config === null || config === void 0 ? void 0 : config.commonSetting);
            const newTemplateList = templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true });
            newTemplateList[templateIndex] = newTemplate === null || newTemplate === void 0 ? void 0 : newTemplate.asMutable({ deep: true });
            handelTemplateListChange(newTemplateList);
        }
        else {
            handelCustomSettingChange(['overrideCommonSetting'], overrideCommonSetting);
        }
    };
    const handleLegendChanged = (e) => __awaiter(void 0, void 0, void 0, function* () {
        const legendEnabled = checkIsLegendEnabled();
        const legendLayers = !legendEnabled ? yield getLegendLayer(jimuMapView) : [];
        handelCustomSettingChange(['layoutOptions', 'legendLayers'], legendLayers);
    });
    const checkIsLegendEnabled = () => {
        var _a, _b, _c;
        return ((_a = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _a === void 0 ? void 0 : _a.legendLayers) && ((_c = (_b = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _b === void 0 ? void 0 : _b.legendLayers) === null || _c === void 0 ? void 0 : _c.length) > 0;
    };
    const handleAttributionVisibleChanged = (e) => {
        const attributionVisible = !(template === null || template === void 0 ? void 0 : template.attributionVisible);
        handelCustomSettingChange(['attributionVisible'], attributionVisible);
    };
    const renderMapOnlyCustomSetting = () => {
        return (jsx(SettingSection, { title: nls('MapOnlyOptions'), role: 'group', "aria-label": nls('MapOnlyOptions') },
            jsx(SettingRow, { label: nls('setDefaults'), flow: 'wrap' }),
            jsx(SettingCollapse, { label: nls('mapSize'), isOpen: openCollapseType === SettingCollapseType.MapSize, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.MapSize); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('mapSize'), rightIcon: EditIcon, type: 'primary', className: openCollapseType === SettingCollapseType.MapSize && 'active-collapse' },
                jsx(SettingRow, { label: nls('width'), className: 'mt-2' },
                    jsx(NumericInput, { size: 'sm', placeholder: nls('width'), value: mapWidth || DEFAULT_MAP_WIDTH, onAcceptValue: handleMapWidthAccept, onChange: handleMapWidthChange, showHandlers: false, "aria-label": nls('width') })),
                jsx(SettingRow, { label: nls('height') },
                    jsx(NumericInput, { size: 'sm', placeholder: nls('height'), value: mapHeight || DEFAULT_MAP_HEIGHT, onAcceptValue: handleMapHeightAccept, onChange: handleMapHeightChange, showHandlers: false, "aria-label": nls('height') }))),
            jsx(SettingCollapse, { label: nls('mapAttribution'), isOpen: openCollapseType === SettingCollapseType.AttributionVisible, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.AttributionVisible); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('mapAttribution'), rightIcon: EditIcon, type: 'primary', className: openCollapseType === SettingCollapseType.AttributionVisible && 'active-collapse' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(Button, { title: nls('includeAttribution'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleAttributionVisibleChanged },
                        jsx(Checkbox, { title: nls('includeAttribution'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: !!(template === null || template === void 0 ? void 0 : template.attributionVisible) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('includeAttribution'))))),
            config.modeType === ModeType.Classic && jsx(SettingRow, { className: 'mt-2', flow: 'wrap', label: nls('selectEditableSettings') },
                jsx("div", { className: 'w-100' },
                    jsx(Button, { title: nls('printTitle'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableMapSize'); } },
                        jsx(Checkbox, { title: nls('printTitle'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: (template === null || template === void 0 ? void 0 : template.enableMapSize) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('mapSize')))),
                jsx("div", { className: 'w-100 mt-1' },
                    jsx(Button, { title: nls('mapAttribution'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableMapAttribution'); } },
                        jsx(Checkbox, { title: nls('mapAttribution'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: (template === null || template === void 0 ? void 0 : template.enableMapAttribution) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('mapAttribution')))))));
    };
    const openCustomTextElementSetting = (key, index) => {
        const newCustomTextElementsOpenList = customTextElementsOpenList === null || customTextElementsOpenList === void 0 ? void 0 : customTextElementsOpenList.map((item, idx) => {
            const enable = {};
            for (const k in item) {
                if (index === idx && k === key) {
                    enable[k] = !customTextElementsOpenList[index][key];
                }
                else {
                    enable[k] = false;
                }
            }
            return enable;
        });
        setOpenCollapseType(null);
        setCustomTextElementsOpenList(newCustomTextElementsOpenList);
    };
    const renderCustomTextElementsSetting = () => {
        const settingItem = [];
        customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.forEach((info, index) => {
            var _a;
            for (const key in info) {
                const elementItem = (jsx(SettingCollapse, { label: key, key: `${key}_${index}`, isOpen: ((_a = customTextElementsOpenList === null || customTextElementsOpenList === void 0 ? void 0 : customTextElementsOpenList[index]) === null || _a === void 0 ? void 0 : _a[key]) || false, onRequestOpen: () => { openCustomTextElementSetting(key, index); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": key, rightIcon: EditIcon, type: 'primary', className: customTextElementsOpenList[key] && 'active-collapse' }, jsx(SettingRow, { flow: 'wrap', className: 'align-item-center mt-2' },
                    jsx(TextInput, { size: 'sm', className: 'flex-grow-1', value: info[key] || '', "aria-label": key, onAcceptValue: value => { handelCustomTextElementsAccept(index, key, value); }, onChange: e => { handelCustomTextElementsChange(index, key, e); } }))));
                settingItem.push(elementItem);
            }
        });
        return settingItem;
    };
    const renderCustomTextElementsEnableSetting = () => {
        const settingItem = [];
        customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.forEach((info, index) => {
            var _a, _b;
            for (const key in info) {
                const elementItem = (jsx(Button, { key: `${key}_${index}`, title: key, className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCustomTextElementEnableChange(key, index); } },
                    jsx(Checkbox, { title: key, className: 'lock-item-ratio', checked: ((_b = (_a = template === null || template === void 0 ? void 0 : template.customTextElementEnableList) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b[key]) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, key)));
                settingItem.push(elementItem);
            }
        });
        return settingItem;
    };
    const handleCustomTextElementEnableChange = (key, index) => {
        var _a, _b;
        const enableItem = (_a = template === null || template === void 0 ? void 0 : template.customTextElementEnableList) === null || _a === void 0 ? void 0 : _a[index];
        const newItem = enableItem.set(key, !(enableItem === null || enableItem === void 0 ? void 0 : enableItem[key]));
        const newCustomTextElementEnableList = (_b = template === null || template === void 0 ? void 0 : template.customTextElementEnableList) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true });
        newCustomTextElementEnableList.splice(index, 1, newItem);
        handelCustomSettingChange(['customTextElementEnableList'], newCustomTextElementEnableList);
    };
    const handelCustomTextElementsAccept = (index, key, value) => {
        const newItem = customTextElements[index].set(key, value);
        const newCustomTextElements = customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.asMutable({ deep: true });
        newCustomTextElements.splice(index, 1, newItem);
        handelCustomSettingChange(['layoutOptions', 'customTextElements'], newCustomTextElements);
    };
    const handelCustomTextElementsChange = (index, key, event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        const newItem = customTextElements[index].set(key, value);
        const newCustomTextElements = customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.asMutable({ deep: true });
        newCustomTextElements.splice(index, 1, newItem);
        setcustomTextElements(Immutable(newCustomTextElements));
    };
    const handleNorthArrowChange = () => {
        var _a, _b, _c;
        const northArrowVisible = (_c = (_b = (_a = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _a === void 0 ? void 0 : _a.elementOverrides) === null || _b === void 0 ? void 0 : _b[northArrowKey]) === null || _c === void 0 ? void 0 : _c.visible;
        handelCustomSettingChange(['layoutOptions', 'elementOverrides', northArrowKey, 'visible'], !northArrowVisible);
    };
    const renderLayoutOptionsCustomSetting = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return (jsx(SettingSection, { title: nls('LayoutOptions'), role: 'group', "aria-label": nls('LayoutOptions') },
            jsx(SettingRow, { label: nls('setDefaults'), flow: 'wrap' }),
            (template === null || template === void 0 ? void 0 : template.hasAuthorText) && jsx(SettingCollapse, { label: nls('printTemplateAuthor'), isOpen: openCollapseType === SettingCollapseType.Author, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Author); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('printTemplateAuthor'), type: 'primary', rightIcon: EditIcon, className: 'mb-2' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(TextInput, { size: 'sm', className: 'w-100', value: authorText, onAcceptValue: handleAuthorTextAccept, onChange: handleAuthorTextChange, "aria-label": nls('printTemplateAuthor') }))),
            (template === null || template === void 0 ? void 0 : template.hasCopyrightText) && jsx(SettingCollapse, { label: nls('copyright'), isOpen: openCollapseType === SettingCollapseType.Copyright, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Copyright); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('copyright'), rightIcon: EditIcon, type: 'primary', className: 'mb-2' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(TextInput, { size: 'sm', className: 'w-100', value: copyrightText, onAcceptValue: handleCopyrightTextAccept, onChange: handleCopyrightTextChange, "aria-label": nls('copyright') }))),
            (template === null || template === void 0 ? void 0 : template.hasLegend) && jsx(SettingCollapse, { label: nls('legend'), isOpen: openCollapseType === SettingCollapseType.Legend, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Legend); }, onRequestClose: closeSettingCollapse, role: 'group', type: 'primary', "aria-label": nls('legend'), rightIcon: EditIcon, className: 'mb-2' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(Button, { title: nls('includeLegend'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleLegendChanged },
                        jsx(Checkbox, { title: nls('includeLegend'), className: 'lock-item-ratio', checked: checkIsLegendEnabled() }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('includeLegend'))))),
            jsx(SettingCollapse, { label: nls('scaleBarUnit'), isOpen: openCollapseType === SettingCollapseType.ScaleBarUnit, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.ScaleBarUnit); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('scaleBarUnit'), rightIcon: EditIcon, type: 'primary', className: openCollapseType === SettingCollapseType.ScaleBarUnit && 'active-collapse' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(Select, { value: (_a = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _a === void 0 ? void 0 : _a.scalebarUnit, onChange: handleScalebarUnitChange, size: 'sm', "aria-label": nls('scaleBarUnit') }, getScaleBarList(nls).map((item, index) => {
                        return (jsx(Option, { key: `unit${index}`, value: item.value, title: item.label }, item.label));
                    })))),
            ((_c = (_b = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _b === void 0 ? void 0 : _b.customTextElements) === null || _c === void 0 ? void 0 : _c.length) > 0 && renderCustomTextElementsSetting(),
            northArrowKey && jsx(SettingCollapse, { label: nls('northArrow'), isOpen: openCollapseType === SettingCollapseType.NorthArrow, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.NorthArrow); }, onRequestClose: closeSettingCollapse, role: 'group', type: 'primary', "aria-label": nls('northArrow'), rightIcon: EditIcon, className: 'mb-2' },
                jsx(SettingRow, { flow: 'wrap', className: 'mt-2' },
                    jsx(Button, { title: nls('includeNorthArrow'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleNorthArrowChange },
                        jsx(Checkbox, { title: nls('includeNorthArrow'), className: 'lock-item-ratio', checked: (_f = (_e = (_d = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _d === void 0 ? void 0 : _d.elementOverrides) === null || _e === void 0 ? void 0 : _e[northArrowKey]) === null || _f === void 0 ? void 0 : _f.visible }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('includeNorthArrow'))))),
            config.modeType === ModeType.Classic && jsx(SettingRow, { className: 'mt-2', flow: 'wrap', label: nls('selectEditableSettings') },
                jsx("div", { className: 'w-100' },
                    (template === null || template === void 0 ? void 0 : template.hasAuthorText) && jsx(Button, { title: nls('printTemplateAuthor'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableAuthor'); } },
                        jsx(Checkbox, { title: nls('printTemplateAuthor'), className: 'lock-item-ratio', checked: (template === null || template === void 0 ? void 0 : template.enableAuthor) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('printTemplateAuthor'))),
                    (template === null || template === void 0 ? void 0 : template.hasCopyrightText) && jsx(Button, { title: nls('copyright'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableCopyright'); } },
                        jsx(Checkbox, { title: nls('copyright'), className: 'lock-item-ratio', checked: (template === null || template === void 0 ? void 0 : template.enableCopyright) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('copyright'))),
                    (template === null || template === void 0 ? void 0 : template.hasLegend) && jsx(Button, { title: nls('legend'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableLegend'); } },
                        jsx(Checkbox, { title: nls('legend'), className: 'lock-item-ratio', checked: (template === null || template === void 0 ? void 0 : template.enableLegend) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('legend'))),
                    jsx(Button, { title: nls('scaleBarUnit'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableScalebarUnit'); } },
                        jsx(Checkbox, { title: nls('scaleBarUnit'), className: 'lock-item-ratio', checked: (template === null || template === void 0 ? void 0 : template.enableScalebarUnit) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('scaleBarUnit'))),
                    ((_h = (_g = template === null || template === void 0 ? void 0 : template.layoutOptions) === null || _g === void 0 ? void 0 : _g.customTextElements) === null || _h === void 0 ? void 0 : _h.length) > 0 && renderCustomTextElementsEnableSetting(),
                    northArrowKey && jsx(Button, { title: nls('northArrow'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableNorthArrow'); } },
                        jsx(Checkbox, { title: nls('northArrow'), className: 'lock-item-ratio', checked: (template === null || template === void 0 ? void 0 : template.enableNorthArrow) || false }),
                        jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('northArrow')))))));
    };
    const renderBaseSetting = () => {
        var _a;
        return (jsx(SettingSection, null,
            jsx(SettingRow, { flow: 'wrap', label: nls('templateName') },
                jsx(TextInput, { size: 'sm', className: 'w-100', value: templateName, onAcceptValue: handleTemplateNameAccept, onChange: handleTemplateNameChange, "aria-label": nls('templateName'), disabled: (config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.OrganizationTemplate })),
            jsx(SettingRow, { flow: 'wrap', label: nls('fileFormat'), role: 'group', "aria-label": nls('fileFormat') },
                jsx(MultiSelect, { fluid: true, "aria-label": nls('fileFormat'), items: Immutable(getMultiFormatSelectItems()), onClickItem: handleSelectFormatChange, values: Immutable((template === null || template === void 0 ? void 0 : template.selectedFormatList) || []), size: 'sm' })),
            jsx(SettingRow, { flow: 'wrap', label: nls('printLayout') },
                jsx(Select, { value: initTemplateLayout(template === null || template === void 0 ? void 0 : template.layout), onChange: handleLayoutChange, size: 'sm', disabled: (config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.OrganizationTemplate, "aria-label": nls('printLayout') }, (_a = config === null || config === void 0 ? void 0 : config.layoutChoiceList) === null || _a === void 0 ? void 0 : _a.map((layout, index) => {
                    return (jsx(Option, { key: `layout${index}`, value: layout === null || layout === void 0 ? void 0 : layout.layoutTemplate, title: layout === null || layout === void 0 ? void 0 : layout.layoutTemplate }, layout === null || layout === void 0 ? void 0 : layout.layoutTemplate));
                })))));
    };
    const handleSelectFormatChange = (evt, value, values) => {
        if ((values === null || values === void 0 ? void 0 : values.length) === 0)
            return false;
        let newTemplate = template.set('selectedFormatList', values);
        if (!(values === null || values === void 0 ? void 0 : values.includes(newTemplate.format))) {
            newTemplate = newTemplate.set('format', values[0]);
        }
        const newTemplateList = templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true });
        newTemplateList[templateIndex] = newTemplate === null || newTemplate === void 0 ? void 0 : newTemplate.asMutable({ deep: true });
        handelTemplateListChange(newTemplateList);
    };
    const getMultiFormatSelectItems = () => {
        return config === null || config === void 0 ? void 0 : config.formatList.map((format, index) => {
            return {
                value: format,
                label: format
            };
        });
    };
    const handleToggleRemindModel = () => {
        setIsOpenRemind(!isOpenRemind);
    };
    const REMIND_MODEL_STYLE = css `
    .remind-con {
      padding-left: ${polished.rem(25)};
      color: var(--dark-800);
      margin-bottom: ${polished.rem(60)};
      margin-top: ${polished.rem(19)};
      font-size: ${polished.rem(13)};
    }
    .modal-body {
      padding: ${polished.rem(30)} ${polished.rem(30)} 0 ${polished.rem(30)};
    }
    .modal-footer {
      padding: 0 ${polished.rem(30)} ${polished.rem(30)} ${polished.rem(30)};
    }
    .remind-title {
      font-size: ${polished.rem(16)};
      font-weight: 500;
    }
  `;
    const renderRemindModel = () => {
        return (jsx(AlertPopup, { isOpen: isOpenRemind, toggle: handleToggleRemindModel, hideHeader: true, onClickOk: handleOverrideCommonSettingsChanged, onClickClose: handleToggleRemindModel, css: REMIND_MODEL_STYLE },
            jsx("div", { className: 'align-middle pt-2 remind-title d-flex align-items-center' },
                jsx("div", { className: 'mr-1' },
                    jsx(WarningOutlined, { className: 'align-middle', size: 'l', color: 'var(--warning-600)' })),
                jsx("span", { className: 'align-middle flex-grow-1' }, nls('overrideSettingsTitle'))),
            jsx("div", { className: 'remind-con' }, nls('overrideSettingsRemind'))));
    };
    const clickOverrideCommonSetting = (e) => {
        const value = e.target.checked;
        if (value) {
            handleOverrideCommonSettingsChanged();
        }
        else {
            handleToggleRemindModel();
        }
    };
    const renderCommonSetting = () => {
        return (jsx(SettingSection, null,
            jsx(SettingRow, { className: 'mb-3', label: nls('overrideCommonSettings') },
                jsx(Switch, { "aria-label": nls('overrideCommonSettings'), checked: (template === null || template === void 0 ? void 0 : template.overrideCommonSetting) || false, onChange: clickOverrideCommonSetting })),
            (template === null || template === void 0 ? void 0 : template.overrideCommonSetting) && jsx(CommonTemplateSetting, { id: id, printTemplateProperties: template, handleTemplatePropertyChange: handleTemplatePropertyChange, modeType: config === null || config === void 0 ? void 0 : config.modeType, jimuMapView: jimuMapView }),
            renderRemindModel()));
    };
    const SYLE = css `
    & {
      overflow: auto;
    }
    .text-wrap {
      overflow: hidden;
      white-space: pre-wrap;
    }
    .setting-collapse {
      & {
        margin-bottom: ${polished.rem(8)};
      }
      .collapse-header {
        line-height: 2.2;
        padding-left: ${polished.rem(8)} !important;
        padding-right: ${polished.rem(8)} !important;
      }
    }
  `;
    return (jsx(SidePopper, { isOpen: isOpen, position: 'right', toggle: toggle, trigger: trigger, title: nls('templateConfiguration'), backToFocusNode: popperFocusNode },
        jsx("div", { className: 'w-100 h-100', css: SYLE },
            renderBaseSetting(),
            checkIsMapOnly(template === null || template === void 0 ? void 0 : template.layout) && renderMapOnlyCustomSetting(),
            !checkIsMapOnly(template === null || template === void 0 ? void 0 : template.layout) && renderLayoutOptionsCustomSetting(),
            renderCommonSetting())));
};
export default CustomSetting;
//# sourceMappingURL=template-custom-setting.js.map