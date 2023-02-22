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
import { React, jsx, css, polished, classNames, esri, Immutable, moduleLoader, defaultMessages as jimucoreDefaultMessag } from 'jimu-core';
import { Checkbox, Button, hooks, TextInput, Select, Option, Radio, NumericInput, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { PrintExtentType, WKID_LINK } from '../../../config';
import { getIndexByTemplateId, getLegendLayer, getScaleBarList, checkIsMapOnly, getKeyOfNorthArrow } from '../../../utils/utils';
import defaultMessage from '../../translations/default';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset';
import SettingRow from '../setting-row';
import PreviewExtent from '../preview-extents';
const Sanitizer = esri.Sanitizer;
const sanitizer = new Sanitizer();
const { useState, useEffect, useRef } = React;
const TemplateSetting = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage, jimucoreDefaultMessag);
    const oldWkid = useRef(null);
    const wkidUtilsRef = useRef(null);
    const modulesLoadedRef = useRef(false);
    const STYLE = css `
    padding-bottom: ${polished.rem(16)};
    padding-top: ${polished.rem(16)};
    .setting-con {
      overflow-y: auto;
      padding-left: ${polished.rem(16)};
      padding-right: ${polished.rem(16)};
    }
    .print-button-con {
      padding-left: ${polished.rem(16)};
      padding-right: ${polished.rem(16)};
    }
    .no-right-padding .jimu-interactive-node{
      padding-right: 0;
    }
    .scalebar-unit {
      width: ${polished.rem(160)};
    }
    .collapse-button {
      padding-right: 0;
    }
    .map-size-con input {
      width: 100%;
    }
    .wkid-describtion {
      font-size: ${polished.rem(12)};
      color: var(--dark-400);
    }
    .wkid-describtion-invalid {
      color: var(--danger-600)
    }
    .outscale-con, .dpi-con {
      input {
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: ${polished.rem(26)};
        svg {
          margin-right: 0;
        }
      }
    }
  `;
    const { templateList, jimuMapView, selectedTemplate, id, confirmPrint, handleSelectedTemplateChange, setSelectedTemplateByIndex } = props;
    const [title, setTitle] = useState(((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.titleText) || '');
    const [wkid, setWkid] = useState((selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkid) || '');
    const [scale, setScale] = useState(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.outScale);
    const [author, setAuthor] = useState(((_b = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _b === void 0 ? void 0 : _b.authorText) || '');
    const [copyright, setCopyright] = useState(((_c = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _c === void 0 ? void 0 : _c.copyrightText) || '');
    const [customTextElements, setCustomTextElements] = useState((_d = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _d === void 0 ? void 0 : _d.customTextElements);
    const [dpi, setDpi] = React.useState((_e = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _e === void 0 ? void 0 : _e.dpi);
    const [mapWidth, setMapWidth] = React.useState((_f = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _f === void 0 ? void 0 : _f.width);
    const [mapHeight, setMapHeight] = React.useState((_g = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _g === void 0 ? void 0 : _g.height);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [descriptionOfWkid, setDescriptionOfWkid] = React.useState(null);
    const [northArrowKey, setNorthArrowKey] = useState(null);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        setTitle(((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.titleText) || '');
        setAuthor(((_b = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _b === void 0 ? void 0 : _b.authorText) || '');
        setCopyright(((_c = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _c === void 0 ? void 0 : _c.copyrightText) || '');
        setCustomTextElements((_d = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _d === void 0 ? void 0 : _d.customTextElements);
        setWkid(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkid);
        oldWkid.current = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkid;
        setScale(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.outScale);
        setDpi((_e = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _e === void 0 ? void 0 : _e.dpi);
        setMapWidth((_f = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _f === void 0 ? void 0 : _f.width);
        setMapHeight((_g = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _g === void 0 ? void 0 : _g.height);
        setNorthArrowKey(getKeyOfNorthArrow((_h = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _h === void 0 ? void 0 : _h.elementOverrides));
        checkAndInitDescriptionOfWkid(isOpenCollapse);
        if (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkidLabel) {
            setDescriptionOfWkid(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkidLabel);
        }
        else {
            if (wkidUtilsRef.current) {
                getSRLabelDynamic(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkid).then(label => {
                    setDescriptionOfWkid(label);
                });
            }
        }
        // eslint-disable-next-line
    }, [selectedTemplate]);
    const initDescriptionOfWkid = () => __awaiter(void 0, void 0, void 0, function* () {
        const wkidLabel = yield getSRLabelDynamic(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkid);
        setDescriptionOfWkid(wkidLabel);
    });
    const getSRLabelDynamic = (wkid) => __awaiter(void 0, void 0, void 0, function* () {
        if (!modulesLoadedRef.current) {
            return moduleLoader.loadModule('jimu-core/wkid').then(module => {
                wkidUtilsRef.current = module;
                modulesLoadedRef.current = true;
                const { getSRLabel } = wkidUtilsRef.current;
                return Promise.resolve(getSRLabel(wkid));
            });
        }
        else {
            const { getSRLabel } = wkidUtilsRef.current;
            return Promise.resolve(getSRLabel(wkid));
        }
    });
    const isValidWkidDynamic = (wkid) => __awaiter(void 0, void 0, void 0, function* () {
        if (!modulesLoadedRef.current) {
            return moduleLoader.loadModule('jimu-core/wkid').then(module => {
                wkidUtilsRef.current = module;
                modulesLoadedRef.current = true;
                const { isValidWkid } = wkidUtilsRef.current;
                return Promise.resolve(isValidWkid(wkid));
            });
        }
        else {
            const { isValidWkid } = wkidUtilsRef.current;
            return Promise.resolve(isValidWkid(wkid));
        }
    });
    const handelSelectedTemplateChange = (e) => {
        var _a;
        const templateId = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        const index = getIndexByTemplateId(templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true }), templateId);
        setSelectedTemplateByIndex(index);
    };
    const handleSelectedTemplateSettingChange = (key, value) => {
        const newTemplate = selectedTemplate.setIn(key, value);
        handleSelectedTemplateChange(newTemplate);
    };
    const handleAttributionVisibleChange = () => {
        handleSelectedTemplateSettingChange(['forceFeatureAttributes'], !(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.forceFeatureAttributes));
    };
    const handleMapAttributionChange = () => {
        handleSelectedTemplateSettingChange(['attributionVisible'], !(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.attributionVisible));
    };
    const handleLegendChanged = (e) => __awaiter(void 0, void 0, void 0, function* () {
        const legendEnabled = checkIsLegendEnabled();
        const legendLayers = !legendEnabled ? yield getLegendLayer(jimuMapView) : [];
        handleSelectedTemplateSettingChange(['layoutOptions', 'legendLayers'], legendLayers);
    });
    const handleNorthArrowChange = () => {
        var _a, _b, _c;
        const northArrowVisible = (_c = (_b = (_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.elementOverrides) === null || _b === void 0 ? void 0 : _b[northArrowKey]) === null || _c === void 0 ? void 0 : _c.visible;
        handleSelectedTemplateSettingChange(['layoutOptions', 'elementOverrides', northArrowKey, 'visible'], !northArrowVisible);
    };
    const checkIsLegendEnabled = () => {
        var _a, _b, _c;
        return ((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.legendLayers) && ((_c = (_b = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _b === void 0 ? void 0 : _b.legendLayers) === null || _c === void 0 ? void 0 : _c.length) > 0;
    };
    const handleTitleAccept = (value) => {
        handleSelectedTemplateSettingChange(['layoutOptions', 'titleText'], value);
    };
    const handleTitleChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setTitle(value);
    };
    const handleWkidAccept = (value) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isValidWkidDynamic(value);
        if (!isValid) {
            setWkid(oldWkid.current);
            const oldWkidLabel = yield getSRLabelDynamic(oldWkid.current);
            setDescriptionOfWkid(oldWkidLabel);
            return false;
        }
        oldWkid.current = value;
        const wkidLabel = yield getSRLabelDynamic(value);
        const newTemplate = selectedTemplate.set('wkid', value).set('wkidLabel', wkidLabel);
        handleSelectedTemplateChange(newTemplate);
    });
    const handleWkidChange = (value) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isValidWkidDynamic(value);
        if (isValid) {
            const wkidLabel = yield getSRLabelDynamic(value);
            setDescriptionOfWkid(wkidLabel);
        }
        else {
            setDescriptionOfWkid(nls('uploadImageError'));
        }
        setWkid(value);
    });
    const handleScaleAccept = (value) => {
        handleSelectedTemplateSettingChange(['outScale'], value);
    };
    const useCurrentMapScale = () => {
        var _a;
        const scale = (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.scale;
        setScale(scale);
        handleSelectedTemplateSettingChange(['outScale'], scale);
    };
    const handleScaleChange = (value) => {
        setScale(value);
    };
    const handleAuthorAccept = (value) => {
        handleSelectedTemplateSettingChange(['layoutOptions', 'authorText'], value);
    };
    const handleDPIChange = (value) => {
        if (value < 1)
            return false;
        setDpi(parseInt(value));
    };
    const handleDPIAccept = (value) => {
        if (value < 1)
            return false;
        handleSelectedTemplateSettingChange(['exportOptions', 'dpi'], parseInt(value));
    };
    const handleAuthorChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setAuthor(value);
    };
    const handleCopyrightAccept = (value) => {
        handleSelectedTemplateSettingChange(['layoutOptions', 'copyrightText'], value);
    };
    const handleCopyrightChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setCopyright(value);
    };
    const handleMapWidthAccept = (value) => {
        var _a;
        if (!value || Number(value) < 1) {
            setMapWidth((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _a === void 0 ? void 0 : _a.width);
            return false;
        }
        handleSelectedTemplateSettingChange(['exportOptions', 'width'], value);
    };
    const handleMapWidthChange = (value) => {
        setMapWidth(value);
    };
    const handleMapHeightAccept = (value) => {
        var _a;
        if (!value || Number(value) < 1) {
            setMapHeight((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.exportOptions) === null || _a === void 0 ? void 0 : _a.height);
            return false;
        }
        handleSelectedTemplateSettingChange(['exportOptions', 'height'], value);
    };
    const handleMapHeightChange = (value) => {
        setMapHeight(value);
    };
    const handleFormatChange = (e) => {
        const format = e.target.value;
        handleSelectedTemplateSettingChange(['format'], format);
    };
    const handleScaleUnitChange = (e) => {
        const format = e.target.value;
        handleSelectedTemplateSettingChange(['layoutOptions', 'scalebarUnit'], format);
    };
    const checkAndInitDescriptionOfWkid = (isOpenAdvanecCollapse) => {
        const showList = getShowList();
        const { showOutputSpatialReference } = showList;
        if (isOpenAdvanecCollapse && showOutputSpatialReference && !(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.wkidLabel)) {
            //If the setting contains Output spatial reference, when opening Advanced, if the WKID util has not been loaded, you need to load the WKID util first.
            initDescriptionOfWkid();
        }
    };
    const toggleCollapse = () => {
        checkAndInitDescriptionOfWkid(!isOpenCollapse);
        setIsOpenCollapse(!isOpenCollapse);
    };
    const handelConfirPrint = () => {
        confirmPrint(selectedTemplate);
    };
    const handelMapExtenesChange = (printExtentType) => {
        var _a;
        if (printExtentType === PrintExtentType.SetMapScale) {
            const scale = (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.scale;
            setScale(scale);
            handleSelectedTemplateSettingChange(['outScale'], scale);
            const newTemplate = selectedTemplate.set('outScale', scale).set('printExtentType', printExtentType);
            handleSelectedTemplateChange(newTemplate);
        }
        else {
            handleSelectedTemplateSettingChange(['printExtentType'], printExtentType);
        }
    };
    const checkIsValidWkid = (wkid) => {
        if (wkidUtilsRef.current) {
            const { isValidWkid } = wkidUtilsRef.current;
            return isValidWkid(wkid);
        }
        else {
            return true;
        }
    };
    const renderAdvancedSetting = () => {
        const isMapOnly = checkIsMapOnly(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layout);
        const showList = getShowList();
        const { showLayoutOption, showFeatureAttribution, showMapAttribution, showQuality, showMapSize, showMapPrintExtents, showScalebarUnit, showOutputSpatialReference } = showList;
        const showAdvance = showLayoutOption || showFeatureAttribution || showMapAttribution || showQuality || showMapSize || showMapPrintExtents || showScalebarUnit || showOutputSpatialReference;
        return (jsx("div", null,
            showAdvance && jsx("div", { className: 'd-flex align-items-center', role: 'group', "aria-label": nls('advance') },
                jsx("div", { className: 'flex-grow-1' }, nls('advance')),
                jsx(Button, { className: 'collapse-button', size: 'sm', type: 'tertiary', onClick: toggleCollapse, title: nls('advance') }, isOpenCollapse ? jsx(UpOutlined, null) : jsx(DownOutlined, null))),
            isOpenCollapse && jsx("div", null,
                showMapPrintExtents && jsx(SettingRow, { flowWrap: true, label: nls('mapPrintingExtents') },
                    jsx(Button, { title: nls('currentMapExtent'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con mt-1 checkbox-con', onClick: () => { handelMapExtenesChange(PrintExtentType.CurrentMapExtent); } },
                        jsx(Radio, { title: nls('currentMapExtent'), checked: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType) === PrintExtentType.CurrentMapExtent, className: 'mr-2' }),
                        " ",
                        nls('currentMapExtent')),
                    jsx(Button, { title: nls('currentMapScale'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con checkbox-con', onClick: () => { handelMapExtenesChange(PrintExtentType.CurrentMapScale); } },
                        jsx(Radio, { title: nls('currentMapScale'), checked: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType) === PrintExtentType.CurrentMapScale, className: 'mr-2' }),
                        " ",
                        nls('currentMapScale')),
                    jsx(Button, { title: nls('setMapScale'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con checkbox-con', onClick: () => { handelMapExtenesChange(PrintExtentType.SetMapScale); } },
                        jsx(Radio, { title: nls('setMapScale'), checked: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType) === PrintExtentType.SetMapScale, className: 'mr-2' }),
                        " ",
                        nls('setMapScale')),
                    (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType) === PrintExtentType.SetMapScale && jsx("div", { className: 'w-100 d-flex align-items-center outscale-con' },
                        jsx(NumericInput, { size: 'sm', className: 'flex-grow-1 dpi-input no-right-padding', value: scale, onAcceptValue: handleScaleAccept, onChange: handleScaleChange, showHandlers: false, "aria-label": nls('setMapScale') }),
                        jsx(Button, { size: 'sm', onClick: useCurrentMapScale, title: nls('useCurrentScale') },
                            jsx(ResetOutlined, null)))),
                showOutputSpatialReference && jsx(SettingRow, { flowWrap: true, label: jsx("div", { dangerouslySetInnerHTML: { __html: getWKIDElement() } }) },
                    jsx(NumericInput, { size: 'sm', className: 'w-100 dpi-input no-right-padding', value: wkid, onAcceptValue: handleWkidAccept, onChange: handleWkidChange, showHandlers: false, "aria-label": nls('spatialReference', { WKID: '' }) }),
                    jsx("div", { title: descriptionOfWkid, "aria-label": descriptionOfWkid, className: classNames('text-truncate mt-1 wkid-describtion', { 'wkid-describtion-invalid': !checkIsValidWkid(Number(wkid)) }) }, descriptionOfWkid)),
                !isMapOnly && renderLayoutOptionSetting(),
                isMapOnly && renderMapOnlyAdvanceSetting())));
    };
    const getShowList = () => {
        const isMapOnly = checkIsMapOnly(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layout);
        const showAuthor = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.hasAuthorText) && (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableAuthor) && !isMapOnly;
        const showCopyright = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.hasCopyrightText) && (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableCopyright) && !isMapOnly;
        const showLegend = (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.hasLegend) && (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableLegend) && !isMapOnly;
        const showCustomTextElements = checkIsShowCustomTextElements() && !isMapOnly;
        const showLayoutOption = showAuthor || showCopyright || showLegend || showCustomTextElements || (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableScalebarUnit);
        return {
            showLayoutOption: showLayoutOption,
            showAuthor: showAuthor,
            showCopyright: showCopyright,
            showLegend: showLegend,
            showCustomTextElements: showCustomTextElements,
            showTitle: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableTitle,
            showFeatureAttribution: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableFeatureAttribution,
            showMapAttribution: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableMapAttribution) && isMapOnly,
            showQuality: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableQuality,
            showMapSize: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableMapSize) && isMapOnly,
            showMapPrintExtents: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableMapPrintExtents,
            showScalebarUnit: (selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableScalebarUnit) && !isMapOnly,
            showOutputSpatialReference: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableOutputSpatialReference,
            showNorthArrow: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.enableNorthArrow
        };
    };
    const checkIsShowCustomTextElements = () => {
        var _a, _b;
        const enableList = [];
        (_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.customTextElementEnableList) === null || _a === void 0 ? void 0 : _a.forEach(item => {
            for (const key in item) {
                enableList.push(item[key]);
            }
        });
        return ((_b = enableList === null || enableList === void 0 ? void 0 : enableList.filter(enable => enable)) === null || _b === void 0 ? void 0 : _b.length) > 0;
    };
    const renderLayoutOptionSetting = () => {
        var _a, _b, _c, _d;
        const showList = getShowList();
        const { showAuthor, showCopyright, showLegend, showLayoutOption, showFeatureAttribution, showQuality, showScalebarUnit, showNorthArrow } = showList;
        return (jsx("div", null,
            showLayoutOption && jsx("div", { className: 'mb-2' }, nls('LayoutOptions')),
            showAuthor && jsx(SettingRow, { flowWrap: true, label: nls('printAuyhor') },
                jsx(TextInput, { size: 'sm', className: 'w-100 dpi-input', value: author, onAcceptValue: handleAuthorAccept, onChange: handleAuthorChange, "aria-label": nls('printAuyhor') })),
            showCopyright && jsx(SettingRow, { flowWrap: true, label: nls('printCopyright') },
                jsx(TextInput, { size: 'sm', className: 'w-100 dpi-input', value: copyright, onAcceptValue: handleCopyrightAccept, onChange: handleCopyrightChange, "aria-label": nls('printCopyright') })),
            renderCustomTextElementsSetting(),
            showLegend && jsx(SettingRow, null,
                jsx(Button, { title: nls('includeLegend'), className: 'w-100 align-items-center d-flex checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleLegendChanged },
                    jsx(Checkbox, { title: nls('includeLegend'), className: 'lock-item-ratio', checked: checkIsLegendEnabled() }),
                    jsx("div", { className: 'text-left ml-2 f-grow-1' }, nls('includeLegend')))),
            showNorthArrow && jsx(SettingRow, null,
                jsx(Button, { title: nls('includeNorthArrow'), className: 'w-100 align-items-center d-flex checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleNorthArrowChange },
                    jsx(Checkbox, { title: nls('includeNorthArrow'), className: 'lock-item-ratio', checked: (_c = (_b = (_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.elementOverrides) === null || _b === void 0 ? void 0 : _b[northArrowKey]) === null || _c === void 0 ? void 0 : _c.visible }),
                    jsx("div", { className: 'text-left ml-2 f-grow-1' }, nls('includeNorthArrow')))),
            showScalebarUnit && jsx(SettingRow, { label: nls('scaleBarUnit'), flowWrap: false },
                jsx(Select, { value: (_d = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _d === void 0 ? void 0 : _d.scalebarUnit, onChange: handleScaleUnitChange, size: 'sm', className: 'scalebar-unit', "aria-label": nls('scaleBarUnit') }, getScaleBarList(nls).map((item, index) => {
                    return (jsx(Option, { key: `unit${index}`, value: item.value, title: item.label }, item.label));
                }))),
            showQuality && jsx(SettingRow, { label: nls('printQuality'), flowWrap: true },
                jsx("div", { className: 'd-flex align-items-center w-100 dpi-con' },
                    jsx(NumericInput, { size: 'sm', className: 'flex-grow-1 no-right-padding', value: dpi, onAcceptValue: handleDPIAccept, onChange: handleDPIChange, showHandlers: false, "aria-label": nls('printQuality') }),
                    jsx(Button, { disabled: true, size: 'sm', title: 'DPI' }, "DPI"))),
            showFeatureAttribution && jsx(SettingRow, null,
                jsx(Button, { title: nls('includeAttributes'), className: 'w-100 align-items-center d-flex checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleAttributionVisibleChange },
                    jsx(Checkbox, { title: nls('includeAttributes'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.forceFeatureAttributes }),
                    jsx("div", { className: 'text-left ml-2 f-grow-1' }, nls('includeAttributes'))))));
    };
    const renderCustomTextElementsSetting = () => {
        const settingItem = [];
        customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.forEach((info, index) => {
            var _a, _b;
            for (const key in info) {
                if (!((_b = (_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.customTextElementEnableList) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b[key]))
                    continue;
                const elementItem = (jsx(SettingRow, { flowWrap: true, className: 'align-item-center', label: key, key: `${key}_${index}` },
                    jsx(TextInput, { size: 'sm', className: 'flex-grow-1', value: info[key] || '', onAcceptValue: value => { handelCustomTextElementsAccept(index, key, value); }, onChange: e => { handelCustomTextElementsChange(index, key, e); }, "aria-label": key })));
                settingItem.push(elementItem);
            }
        });
        return settingItem;
    };
    const handelCustomTextElementsAccept = (index, key, value) => {
        const newItem = customTextElements[index].set(key, value);
        const newCustomTextElements = customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.asMutable({ deep: true });
        newCustomTextElements.splice(index, 1, newItem);
        handleSelectedTemplateSettingChange(['layoutOptions', 'customTextElements'], newCustomTextElements);
    };
    const handelCustomTextElementsChange = (index, key, event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        const newItem = customTextElements[index].set(key, value);
        const newCustomTextElements = customTextElements === null || customTextElements === void 0 ? void 0 : customTextElements.asMutable({ deep: true });
        newCustomTextElements.splice(index, 1, newItem);
        setCustomTextElements(Immutable(newCustomTextElements));
    };
    const renderBaseSetting = () => {
        var _a, _b, _c;
        const showList = getShowList();
        const { showTitle } = showList;
        return (jsx("div", { className: 'base-setting-con' },
            showTitle && jsx(SettingRow, { flowWrap: true, label: nls('title') },
                jsx(TextInput, { size: 'sm', className: 'w-100', value: title, "aria-label": nls('title'), onAcceptValue: handleTitleAccept, onChange: handleTitleChange })),
            jsx(SettingRow, { flowWrap: true, label: nls('template') },
                jsx(Select, { value: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId, onChange: handelSelectedTemplateChange, size: 'sm', "aria-label": nls('template') }, templateList === null || templateList === void 0 ? void 0 : templateList.map((template, index) => {
                    return (jsx(Option, { key: template === null || template === void 0 ? void 0 : template.templateId, value: template === null || template === void 0 ? void 0 : template.templateId, title: template === null || template === void 0 ? void 0 : template.label }, template === null || template === void 0 ? void 0 : template.label));
                }))),
            ((_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.selectedFormatList) === null || _a === void 0 ? void 0 : _a.length) > 1 && jsx(SettingRow, { flowWrap: true, label: nls('fileFormat') },
                jsx(Select, { value: (_b = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.format) === null || _b === void 0 ? void 0 : _b.toLowerCase(), onChange: handleFormatChange, size: 'sm', "aria-label": nls('fileFormat') }, (_c = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.selectedFormatList) === null || _c === void 0 ? void 0 : _c.map((format, index) => {
                    return (jsx(Option, { key: `format${index}`, value: format, title: format }, format));
                })))));
    };
    const renderMapOnlyAdvanceSetting = () => {
        const showList = getShowList();
        const { showFeatureAttribution, showMapAttribution, showQuality } = showList;
        return (jsx("div", null,
            showFeatureAttribution && jsx(SettingRow, { className: 'mb-1' },
                jsx(Button, { title: nls('includeAttributes'), className: 'w-100 align-items-center mt-1 d-flex checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleAttributionVisibleChange },
                    jsx(Checkbox, { title: nls('includeAttributes'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.forceFeatureAttributes }),
                    jsx("div", { className: 'text-left ml-2 f-grow-1' }, nls('includeAttributes')))),
            showMapAttribution && jsx(SettingRow, null,
                jsx(Button, { title: nls('includeAttribution'), className: 'w-100 align-items-center d-flex checkbox-con', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: handleMapAttributionChange },
                    jsx(Checkbox, { title: nls('includeAttribution'), className: 'lock-item-ratio', "data-field": 'mapSize', checked: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.attributionVisible }),
                    jsx("div", { className: 'text-left ml-2 f-grow-1' }, nls('includeAttribution')))),
            showQuality && jsx(SettingRow, { flowWrap: true, label: nls('printQuality') },
                jsx(TextInput, { size: 'sm', className: 'w-100 no-right-padding', value: dpi, onAcceptValue: handleDPIAccept, onChange: handleDPIChange, suffix: jsx(Button, { disabled: true, size: 'sm' }, "DPI") }))));
    };
    const renderMapOnlyBaseSetting = () => {
        const showList = getShowList();
        const { showMapSize } = showList;
        return (jsx("div", null, showMapSize && jsx("div", { className: 'd-flex align-items-center' },
            jsx("div", { className: 'flex-grow-1' },
                jsx("div", { className: 'mb-1' }, nls('width')),
                jsx(NumericInput, { size: 'sm', className: 'w-100 map-size-con', value: mapWidth, onAcceptValue: handleMapWidthAccept, onChange: handleMapWidthChange, showHandlers: false, "aria-label": nls('width') })),
            jsx("div", { className: 'flex-grow-1 ml-2' },
                jsx("div", { className: 'mb-1' }, nls('height')),
                jsx(NumericInput, { size: 'sm', className: 'w-100 map-size-con', value: mapHeight, onAcceptValue: handleMapHeightAccept, onChange: handleMapHeightChange, showHandlers: false, "aria-label": nls('height') })))));
    };
    const renderSetting = () => {
        return (jsx("div", { className: 'w-100 h-100' },
            renderBaseSetting(),
            jsx("div", null,
                checkIsMapOnly(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layout) && renderMapOnlyBaseSetting(),
                renderAdvancedSetting())));
    };
    const getWKIDElement = () => {
        return sanitizer.sanitize(nls('spatialReference', { WKID: `<a target="_blank" href="${WKID_LINK}">WKID</a>` }));
    };
    return (jsx("div", { className: 'w-100 h-100 d-flex flex-column', css: STYLE },
        jsx("div", { className: 'flex-grow-1 w-100 setting-con' }, renderSetting()),
        jsx("div", { className: 'print-button-con' },
            jsx(PreviewExtent, { id: id, jimuMapView: jimuMapView, className: 'w-100', scale: scale, selectedTemplate: selectedTemplate, scalebarUnit: (_h = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _h === void 0 ? void 0 : _h.scalebarUnit, printExtentType: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType }),
            jsx(Button, { className: 'w-100 mt-2', type: 'primary', onClick: handelConfirPrint }, nls('_widgetLabel')))));
};
export default TemplateSetting;
//# sourceMappingURL=template-setting.js.map