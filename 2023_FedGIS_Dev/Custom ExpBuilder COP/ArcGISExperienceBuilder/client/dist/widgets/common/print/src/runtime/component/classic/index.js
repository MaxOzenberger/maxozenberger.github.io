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
import { React, jsx, css, polished, Immutable, classNames } from 'jimu-core';
import { hooks, Navbar, Nav, NavLink, NavItem, Badge, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { PrintResultState } from '../../../config';
import TemplateSetting from './template-setting';
import Result from './result';
import defaultMessage from '../../translations/default';
import { print } from '../../utils/print-service';
import { getNewResultItemTitle, getNewResultId, getPreviewLayerId, initTemplateProperties } from '../../utils/utils';
import { getIndexByTemplateId, checkIsTemplateExist, mergeTemplateSetting } from '../../../utils/utils';
const { useState, useRef, useEffect } = React;
var Views;
(function (Views) {
    Views["PrintTemplate"] = "PRINT TEMPLATE";
    Views["PrintResult"] = "PRINT RESULT";
})(Views || (Views = {}));
const Classic = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const printResultListRef = useRef([]);
    const oldPrintResultListRef = useRef([]);
    const preDefaultValueSelectedTemplate = useRef(null);
    const STYLE = css `
    .classic-setting-con {
      height: 0;
    }
    .nav-bar-con {
      height: ${polished.rem(40)};
      border: none !important;
      border-bottom: 1px solid var(--light-200) !important;
      padding: 0;
      .navbar-nav button.nav-link, .navbar-nav button.nav-link:hover {
        color: var(--dark-800);
      }
      .jimu-nav-link-wrapper .jimu-badge-wrapper {
        & {
          display: block;
        }
        .badge-dot {
          top: ${polished.rem(4)};
          right: ${polished.rem(4)};
        }
      }
    }
  `;
    const { config, jimuMapView, templateList, id } = props;
    const [views, setViews] = useState(Views.PrintTemplate);
    const [printResultList, setPrintResultList] = useState(Immutable([]));
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    useEffect(() => {
        setSelectedTemplateByIndex(0);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        var _a;
        if (selectedTemplate && checkIsTemplateExist(templateList, selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId)) {
            const index = getIndexByTemplateId(templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true }), selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId);
            const templateInConfig = (_a = getNewTemplateWithCommonSetting(templateList === null || templateList === void 0 ? void 0 : templateList[index])) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
            getNewSelectedTempWhenConfigChange(templateInConfig);
        }
        if (!selectedTemplate || (!checkIsTemplateExist(templateList, selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId))) {
            setSelectedTemplateByIndex(0);
        }
        // eslint-disable-next-line
    }, [templateList, config]);
    const getNewSelectedTempWhenConfigChange = (templateInConfig) => {
        var _a, _b;
        const currentSelectedTemplate = (_a = preDefaultValueSelectedTemplate.current) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        const diffKey = getSelectedTemplateDiffKey((_b = preDefaultValueSelectedTemplate.current) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true }), templateInConfig);
        for (const key in currentSelectedTemplate) {
            if (key.includes('enable')) {
                delete currentSelectedTemplate[key];
            }
        }
        diffKey === null || diffKey === void 0 ? void 0 : diffKey.forEach(key => {
            if (key instanceof Array) {
                const objectItem = currentSelectedTemplate[key[0]];
                delete objectItem[key[1]];
                currentSelectedTemplate[key[0]] = objectItem;
            }
            else {
                delete currentSelectedTemplate[key];
            }
        });
        currentSelectedTemplate.layoutOptions = Object.assign(Object.assign({}, templateInConfig === null || templateInConfig === void 0 ? void 0 : templateInConfig.layoutOptions), currentSelectedTemplate === null || currentSelectedTemplate === void 0 ? void 0 : currentSelectedTemplate.layoutOptions);
        currentSelectedTemplate.exportOptions = Object.assign(Object.assign({}, templateInConfig === null || templateInConfig === void 0 ? void 0 : templateInConfig.exportOptions), currentSelectedTemplate === null || currentSelectedTemplate === void 0 ? void 0 : currentSelectedTemplate.exportOptions);
        currentSelectedTemplate.customTextElementEnableList = templateInConfig === null || templateInConfig === void 0 ? void 0 : templateInConfig.customTextElementEnableList;
        currentSelectedTemplate.selectedFormatList = templateInConfig === null || templateInConfig === void 0 ? void 0 : templateInConfig.selectedFormatList;
        const newSelectedTemplate = Immutable(Object.assign(Object.assign({}, templateInConfig), currentSelectedTemplate));
        handleSelectedTemplateChange(newSelectedTemplate);
    };
    const getSelectedTemplateDiffKey = (temp, preTemplate) => {
        if (!temp || !preTemplate)
            return [];
        const diffKey = [];
        for (const key in temp) {
            const isItemObject = temp[key] instanceof Object;
            if (!isItemObject && temp[key] !== preTemplate[key]) {
                diffKey.push(key);
            }
            if (isItemObject) {
                const diifKey = getObjectDiffKey(temp[key], preTemplate[key]);
                diifKey === null || diifKey === void 0 ? void 0 : diifKey.forEach(k => {
                    diffKey.push([key, k]);
                });
            }
        }
        return diffKey;
    };
    const getObjectDiffKey = (obj1, obj2) => {
        if (!obj1 || !obj2)
            return null;
        const diffKey = [];
        for (const key in obj1) {
            if ((obj1 === null || obj1 === void 0 ? void 0 : obj1[key]) !== (obj2 === null || obj2 === void 0 ? void 0 : obj2[key])) {
                diffKey.push(key);
            }
        }
        return diffKey;
    };
    const setSelectedTemplateByIndex = (index) => {
        if ((templateList === null || templateList === void 0 ? void 0 : templateList.length) === 0)
            return false;
        const template = getNewTemplateWithCommonSetting(templateList === null || templateList === void 0 ? void 0 : templateList[index]);
        preDefaultValueSelectedTemplate.current = template;
        handleSelectedTemplateChange(template);
    };
    const getNewTemplateWithCommonSetting = (template) => {
        if (!template)
            return null;
        if (template === null || template === void 0 ? void 0 : template.overrideCommonSetting) {
            template = mergeTemplateSetting(Immutable(config === null || config === void 0 ? void 0 : config.commonSetting), Immutable(template));
        }
        else {
            template = mergeTemplateSetting(Immutable(template), Immutable(config === null || config === void 0 ? void 0 : config.commonSetting));
        }
        return template;
    };
    const handleSelectedTemplateChange = (template) => {
        setSelectedTemplate(template);
    };
    const toggleNav = (views) => {
        setViews(views);
        if (views === Views.PrintResult) {
            oldPrintResultListRef.current = Immutable(printResultListRef.current).asMutable();
        }
    };
    const togglePreviewLayer = (visible) => {
        const layerId = getPreviewLayerId(id, jimuMapView.id);
        const graphicsLayer = jimuMapView.view.map.findLayerById(layerId);
        if (graphicsLayer) {
            graphicsLayer.visible = visible;
        }
    };
    //Confirm print
    const confirmPrint = (printTemplateProperties) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const resultItem = {
            resultId: getNewResultId(Immutable(printResultListRef.current)),
            url: null,
            title: getNewResultItemTitle((_a = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.layoutOptions) === null || _a === void 0 ? void 0 : _a.titleText, Immutable(printResultListRef.current)),
            state: PrintResultState.Loading
        };
        const newPrintResultList = printResultListRef.current;
        newPrintResultList.push(resultItem);
        printResultListRef.current = newPrintResultList;
        setPrintResultList(Immutable(newPrintResultList));
        togglePreviewLayer(false);
        print({
            useUtility: config === null || config === void 0 ? void 0 : config.useUtility,
            mapView: jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view,
            printTemplateProperties: yield initTemplateProperties(printTemplateProperties, jimuMapView)
        }).then(printResult => {
            togglePreviewLayer(true);
            setNewPrintResultList(resultItem, PrintResultState.Success, printResult === null || printResult === void 0 ? void 0 : printResult.url);
        }, printError => {
            togglePreviewLayer(true);
            setNewPrintResultList(resultItem, PrintResultState.Error);
        });
    });
    //Update result list
    const setNewPrintResultList = (newPrintResultItem, state, url) => {
        url && (newPrintResultItem.url = url);
        newPrintResultItem.state = state;
        let newResultItemIndex;
        const newPrintResultList = printResultListRef.current;
        newPrintResultList.forEach((item, index) => {
            if (item.resultId === newPrintResultItem.resultId) {
                newResultItemIndex = index;
            }
        });
        if (newResultItemIndex || newResultItemIndex === 0) {
            newPrintResultList.splice(newResultItemIndex, 1, newPrintResultItem);
            setPrintResultList(Immutable(newPrintResultList));
            printResultListRef.current = newPrintResultList;
        }
    };
    // check is show badge
    const showBadge = () => {
        var _a, _b;
        return ((_a = printResultListRef === null || printResultListRef === void 0 ? void 0 : printResultListRef.current) === null || _a === void 0 ? void 0 : _a.length) === ((_b = oldPrintResultListRef === null || oldPrintResultListRef === void 0 ? void 0 : oldPrintResultListRef.current) === null || _b === void 0 ? void 0 : _b.length);
    };
    //Delete app item
    const deleteResultItem = (index) => {
        var _a, _b;
        const newPrintResultList = printResultListRef.current;
        newPrintResultList.splice(index, 1);
        setPrintResultList(Immutable(newPrintResultList));
        printResultListRef.current = (_a = Immutable(newPrintResultList)) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        oldPrintResultListRef.current = (_b = Immutable(newPrintResultList)) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true });
    };
    const renderNavbar = () => {
        return (jsx(Navbar, { className: "nav-bar-con w-100", border: false, color: "false", light: true },
            jsx(Nav, { className: 'w-100 h-100', underline: true, navbar: true, justified: true, fill: true },
                jsx(NavItem, { title: nls('printTemplate'), onClick: () => { toggleNav(Views.PrintTemplate); }, className: "link-con" },
                    jsx(NavLink, { tag: 'button', active: views === Views.PrintTemplate }, nls('printTemplate'))),
                jsx(NavItem, { title: nls('printResult'), onClick: () => { toggleNav(Views.PrintResult); } },
                    jsx(NavLink, { tag: 'button', active: views === Views.PrintResult },
                        jsx(Badge, { className: 'w-100 h-100', dot: true, color: 'primary', hideBadge: showBadge() }, nls('printResult')))))));
    };
    return (jsx("div", { className: 'w-100 h-100 d-flex flex-column', css: STYLE },
        renderNavbar(),
        jsx("div", { className: 'flex-grow-1 w-100 classic-setting-con overflow-hidden' },
            jsx("div", { className: classNames('w-100 h-100', { 'sr-only': views !== Views.PrintTemplate }) },
                jsx(TemplateSetting, { id: id, config: config, jimuMapView: jimuMapView, selectedTemplate: selectedTemplate, templateList: templateList, confirmPrint: confirmPrint, handleSelectedTemplateChange: handleSelectedTemplateChange, setSelectedTemplateByIndex: setSelectedTemplateByIndex })),
            views === Views.PrintResult && jsx(Result, { config: config, printResultList: printResultList, deleteResultItem: deleteResultItem }))));
};
export default Classic;
//# sourceMappingURL=index.js.map