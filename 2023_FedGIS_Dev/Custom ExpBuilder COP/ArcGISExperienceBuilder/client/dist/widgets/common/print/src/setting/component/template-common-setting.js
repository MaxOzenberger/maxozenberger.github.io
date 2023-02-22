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
import { React, css, jsx, esri, polished, classNames, moduleLoader, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { hooks, TextInput, Radio, Button, Checkbox, NumericInput, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui';
import { SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
import { PrintExtentType, ModeType, WKID_LINK } from '../../config';
import { ResetOutlined } from 'jimu-icons/outlined/editor/reset';
const EditIcon = require('jimu-icons/svg/outlined/editor/edit.svg');
const Sanitizer = esri.Sanitizer;
const sanitizer = new Sanitizer();
const { useRef } = React;
var SettingCollapseType;
(function (SettingCollapseType) {
    SettingCollapseType["Title"] = "TITLE";
    SettingCollapseType["Extents"] = "EXTENTS";
    SettingCollapseType["SpatialReference"] = "SPATIAL REFERENCE";
    SettingCollapseType["Feature"] = "FEATURE ATTRIBUTION";
    SettingCollapseType["Quality"] = "QUALITY";
})(SettingCollapseType || (SettingCollapseType = {}));
const CommonTemplateSetting = (props) => {
    var _a, _b;
    const nls = hooks.useTranslate(defaultMessages, jimuCoreDefaultMessage, jimuUiDefaultMessage);
    const odlWkid = React.useRef(null);
    const wkidUtilsRef = useRef(null);
    const modulesLoadedRef = useRef(false);
    const STYLE = css `
    .dpi-input .input-wrapper{
      padding-right: 0;
    }
    .radio-con {
      cursor: ponter;
    }
    .use-current-map-scale svg{
      margin: 0 auto;
    }
    .enable-setting-con .jimu-widget-setting--row-label{
      margin-bottom: 0;
    }
    .wkid-describtion {
      font-size: ${polished.rem(12)};
      color: var(--dark-400);
    }
    .wkid-describtion-invalid {
      color: var(--danger-600)
    }
  `;
    const { printTemplateProperties, modeType, jimuMapView, handleTemplatePropertyChange } = props;
    const [settingCollapse, setSettingCollapse] = React.useState(null);
    const [titleText, setTitleText] = React.useState(((_a = printTemplateProperties.layoutOptions) === null || _a === void 0 ? void 0 : _a.titleText) || '');
    const [wkid, setWkid] = React.useState(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkid);
    const [dpi, setDpi] = React.useState((_b = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.exportOptions) === null || _b === void 0 ? void 0 : _b.dpi);
    const [outScale, setOutScale] = React.useState(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.outScale);
    const [descriptionOfWkid, setDescriptionOfWkid] = React.useState(null);
    React.useEffect(() => {
        var _a, _b;
        setTitleText(((_a = printTemplateProperties.layoutOptions) === null || _a === void 0 ? void 0 : _a.titleText) || '');
        setWkid(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkid);
        odlWkid.current = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkid;
        setDpi((_b = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.exportOptions) === null || _b === void 0 ? void 0 : _b.dpi);
        setOutScale(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.outScale);
        if (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkidLabel) {
            setDescriptionOfWkid(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkidLabel);
        }
        else {
            if (wkidUtilsRef.current) {
                getSRLabelDynamic(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkid).then(label => {
                    setDescriptionOfWkid(label);
                });
            }
        }
    }, [printTemplateProperties]);
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
    const openSettingCollapse = (settingCollapseType) => __awaiter(void 0, void 0, void 0, function* () {
        if (settingCollapseType === SettingCollapseType.SpatialReference && !(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkidLabel)) {
            //When expanding the Output spatial reference, if the WKID util has not been loaded, you need to load the WKID util first.
            const wkidLabel = yield getSRLabelDynamic(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.wkid);
            setDescriptionOfWkid(wkidLabel);
        }
        setSettingCollapse(settingCollapseType);
    });
    const closeSettingCollapse = () => {
        setSettingCollapse(null);
    };
    const handlePrintTitleChange = (event) => {
        var _a;
        const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
        setTitleText(value);
    };
    const handlePrintTitleAccept = (value) => {
        const newPrintTemplateProperties = printTemplateProperties.setIn(['layoutOptions', 'titleText'], value);
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handleWKIDChange = (value) => __awaiter(void 0, void 0, void 0, function* () {
        setWkid(value);
        const isValid = yield isValidWkidDynamic(value);
        if (isValid) {
            const wkidLabel = yield getSRLabelDynamic(value);
            setDescriptionOfWkid(wkidLabel);
        }
        else {
            setDescriptionOfWkid(nls('uploadImageError'));
        }
    });
    const handleWKIDAccept = (value) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isValidWkidDynamic(value);
        if (!isValid) {
            setWkid(odlWkid.current);
            const oldWkidLabel = yield getSRLabelDynamic(value);
            setDescriptionOfWkid(oldWkidLabel);
            return false;
        }
        odlWkid.current = value;
        const newPrintTemplateProperties = printTemplateProperties.setIn(['wkid'], value).set('wkidLabel', descriptionOfWkid);
        handleTemplatePropertyChange(newPrintTemplateProperties);
        const wkidLabel = yield getSRLabelDynamic(value);
        setDescriptionOfWkid(wkidLabel);
    });
    const handleDPIChange = (value) => {
        if (value < 1)
            return false;
        setDpi(parseInt(value));
    };
    const handleDPIAccept = (value) => {
        if (value < 1)
            return false;
        const newPrintTemplateProperties = printTemplateProperties.setIn(['exportOptions', 'dpi'], parseInt(value));
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handleScaleChange = (value) => {
        setOutScale(value);
    };
    const setScaleByCurrentMapScale = () => {
        var _a;
        if (!jimuMapView)
            return;
        const scale = (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.scale;
        const newPrintTemplateProperties = printTemplateProperties.setIn(['outScale'], scale);
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handleScaleAccept = (value) => {
        const newPrintTemplateProperties = printTemplateProperties.setIn(['outScale'], value);
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handlePrintExtentTypeChange = (printExtentType) => {
        var _a;
        let newPrintTemplateProperties = printTemplateProperties.setIn(['printExtentType'], printExtentType);
        const scale = jimuMapView ? (_a = jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view) === null || _a === void 0 ? void 0 : _a.scale : 36978595.474472;
        switch (printExtentType) {
            case PrintExtentType.CurrentMapExtent:
                newPrintTemplateProperties = newPrintTemplateProperties.setIn(['scalePreserved'], false);
                break;
            case PrintExtentType.CurrentMapScale:
                newPrintTemplateProperties = newPrintTemplateProperties.setIn(['scalePreserved'], true);
                break;
            case PrintExtentType.SetMapScale:
                newPrintTemplateProperties = newPrintTemplateProperties.setIn(['scalePreserved'], true);
                newPrintTemplateProperties = newPrintTemplateProperties.setIn(['outScale'], scale);
                break;
        }
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handleCheckBoxChange = (key) => {
        const newPrintTemplateProperties = printTemplateProperties.setIn([key], !(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties[key]));
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const handleEnableTitleChange = () => {
        let newPrintTemplateProperties = printTemplateProperties.setIn(['showLabels'], !(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.showLabels));
        newPrintTemplateProperties = newPrintTemplateProperties.setIn(['enableTitle'], !(printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableTitle));
        handleTemplatePropertyChange(newPrintTemplateProperties);
    };
    const getWKIDElement = () => {
        return sanitizer.sanitize(nls('wellKnownId', { wkid: `<a target="_blank" href="${WKID_LINK}">WKID</a>` }));
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
    return (jsx("div", { css: STYLE },
        jsx(SettingRow, { label: nls('setDefaults'), flow: 'wrap' }),
        jsx(SettingCollapse, { label: nls('printTitle'), isOpen: settingCollapse === SettingCollapseType.Title, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Title); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('printTitle'), rightIcon: EditIcon, type: 'primary', className: settingCollapse === SettingCollapseType.Title && 'active-collapse' },
            jsx(SettingRow, { className: 'mt-2' },
                jsx(TextInput, { size: 'sm', className: 'search-placeholder w-100', placeholder: nls('printTitle'), value: titleText, onAcceptValue: handlePrintTitleAccept, onChange: handlePrintTitleChange, "aria-label": nls('printTitle') }))),
        jsx(SettingCollapse, { label: nls('mapPrintingExtents'), isOpen: settingCollapse === SettingCollapseType.Extents, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Extents); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('mapPrintingExtents'), rightIcon: EditIcon, type: 'primary', className: settingCollapse === SettingCollapseType.Extents && 'active-collapse' },
            jsx(SettingRow, { className: 'mt-2' },
                jsx("div", { className: 'w-100' },
                    jsx(Button, { title: nls('currentMapExtent'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con', onClick: () => { handlePrintExtentTypeChange(PrintExtentType.CurrentMapExtent); } },
                        jsx(Radio, { title: nls('currentMapExtent'), checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.printExtentType) === PrintExtentType.CurrentMapExtent, className: 'mr-2' }),
                        " ",
                        nls('currentMapExtent')),
                    jsx(Button, { title: nls('currentMapScale'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con', onClick: () => { handlePrintExtentTypeChange(PrintExtentType.CurrentMapScale); } },
                        jsx(Radio, { title: nls('currentMapScale'), checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.printExtentType) === PrintExtentType.CurrentMapScale, className: 'mr-2' }),
                        " ",
                        nls('currentMapScale')),
                    jsx(Button, { title: nls('setMapScale'), type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, className: 'd-flex align-items-center radio-con', onClick: () => { handlePrintExtentTypeChange(PrintExtentType.SetMapScale); } },
                        jsx(Radio, { title: nls('setMapScale'), checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.printExtentType) === PrintExtentType.SetMapScale, className: 'mr-2' }),
                        " ",
                        nls('setMapScale')),
                    (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.printExtentType) === PrintExtentType.SetMapScale && jsx("div", { className: 'd-flex mt-1 align-items-center' },
                        jsx(NumericInput, { size: 'sm', className: 'search-placeholder flex-grow-1 dpi-input', value: outScale, onAcceptValue: handleScaleAccept, onChange: handleScaleChange, showHandlers: false }),
                        jsx(Button, { className: 'use-current-map-scale', size: 'sm', title: nls('useCurrentScale'), disabled: !jimuMapView, onClick: setScaleByCurrentMapScale },
                            jsx(ResetOutlined, null)))))),
        jsx(SettingCollapse, { label: nls('outputSpatialReference'), isOpen: settingCollapse === SettingCollapseType.SpatialReference, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.SpatialReference); }, onRequestClose: closeSettingCollapse, role: 'group', type: 'primary', "aria-label": nls('outputSpatialReference'), rightIcon: EditIcon, className: settingCollapse === SettingCollapseType.SpatialReference && 'active-collapse' },
            jsx(SettingRow, { flow: 'wrap', label: jsx("div", { className: 'flex-grow-1', dangerouslySetInnerHTML: { __html: getWKIDElement() } }), className: 'mt-2' },
                jsx(NumericInput, { size: 'sm', className: 'search-placeholder w-100', value: wkid, onAcceptValue: handleWKIDAccept, onChange: handleWKIDChange, showHandlers: false, "aria-label": nls('outputSpatialReference') }),
                jsx("div", { className: classNames('text-truncate mt-1 wkid-describtion', { 'wkid-describtion-invalid': !checkIsValidWkid(Number(wkid)) }), title: descriptionOfWkid, "aria-label": descriptionOfWkid }, descriptionOfWkid))),
        jsx(SettingCollapse, { label: nls('printQuality'), isOpen: settingCollapse === SettingCollapseType.Quality, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Quality); }, onRequestClose: closeSettingCollapse, role: 'group', "aria-label": nls('printQuality'), type: 'primary', rightIcon: EditIcon, className: settingCollapse === SettingCollapseType.Quality && 'active-collapse' },
            jsx(SettingRow, { className: 'mt-2' },
                jsx("div", { className: 'd-flex align-items-center w-100' },
                    jsx(NumericInput, { size: 'sm', className: 'search-placeholder flex-grow-1 dpi-input', placeholder: nls('printQuality'), value: dpi, onAcceptValue: handleDPIAccept, onChange: handleDPIChange, showHandlers: false, "aria-label": nls('printQuality') }),
                    jsx(Button, { disabled: true, size: 'sm', title: 'DPI' }, "DPI")))),
        jsx(SettingCollapse, { label: nls('featureAttributes'), isOpen: settingCollapse === SettingCollapseType.Feature, onRequestOpen: () => { openSettingCollapse(SettingCollapseType.Feature); }, onRequestClose: closeSettingCollapse, role: 'group', type: 'primary', "aria-label": nls('featureAttributes'), rightIcon: EditIcon, className: settingCollapse === SettingCollapseType.Feature && 'active-collapse' },
            jsx(SettingRow, { className: 'mt-2' },
                jsx(Button, { title: nls('includeAttributes'), className: 'd-flex w-100 align-items-center', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, "aria-label": nls('includeAttributes'), onClick: () => { handleCheckBoxChange('forceFeatureAttributes'); } },
                    jsx(Checkbox, { title: nls('includeAttributes'), className: 'lock-item-ratio', "data-field": 'forceFeatureAttributes', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.forceFeatureAttributes) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('includeAttributes'))))),
        modeType === ModeType.Classic && jsx(SettingRow, { className: 'mt-3 enable-setting-con', flow: 'wrap', role: 'group', "aria-label": nls('selectEditableSettings'), label: nls('selectEditableSettings') },
            jsx("div", { className: 'w-100' },
                jsx(Button, { title: nls('printTitle'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleEnableTitleChange(); } },
                    jsx(Checkbox, { title: nls('printTitle'), className: 'lock-item-ratio', "data-field": 'enableTitle', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableTitle) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('printTitle'))),
                jsx(Button, { title: nls('mapPrintingExtents'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableMapPrintExtents'); } },
                    jsx(Checkbox, { title: nls('mapPrintingExtents'), className: 'lock-item-ratio', "data-field": 'enableMapPrintExtents', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableMapPrintExtents) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('mapPrintingExtents'))),
                jsx(Button, { title: nls('outputSpatialReference'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableOutputSpatialReference'); } },
                    jsx(Checkbox, { title: nls('outputSpatialReference'), className: 'lock-item-ratio', "data-field": 'enableOutputSpatialReference', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableOutputSpatialReference) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('outputSpatialReference'))),
                jsx(Button, { title: nls('printQuality'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableQuality'); } },
                    jsx(Checkbox, { title: nls('printQuality'), className: 'lock-item-ratio', "data-field": 'enableQuality', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableQuality) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('printQuality'))),
                jsx(Button, { title: nls('featureAttributes'), className: 'd-flex w-100 align-items-center text-wrap', type: 'tertiary', style: { paddingLeft: 0, paddingRight: 0 }, onClick: () => { handleCheckBoxChange('enableFeatureAttribution'); } },
                    jsx(Checkbox, { title: nls('featureAttributes'), className: 'lock-item-ratio', "data-field": 'enableFeatureAttribution', checked: (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.enableFeatureAttribution) || false }),
                    jsx("div", { className: 'lock-item-ratio-label text-left ml-2' }, nls('featureAttributes')))))));
};
export default CommonTemplateSetting;
//# sourceMappingURL=template-common-setting.js.map