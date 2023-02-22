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
import { UtilityManager } from 'jimu-core';
import { PrintServiceType, CIMMarkerNorthArrow } from '../config';
import { getPrintTaskInfo, initDefaultTemplates } from '../setting/util/util';
import { initTemplateLayout, getUrlOfUseUtility, getPrintTemplateTaskInfo, getKeyOfNorthArrow } from './utils';
export const getNewTemplateInfo = (utility, config) => __awaiter(void 0, void 0, void 0, function* () {
    return getUrlOfUseUtility(utility).then(url => {
        return getPrintTemplate(url, utility, config);
    });
});
const getPrintTemplate = (serviceUrl, utility, config) => {
    const printServiceType = getPrintServiceType(utility === null || utility === void 0 ? void 0 : utility.utilityId);
    return getPrintTaskInfo(serviceUrl).then(printTask => {
        let newConfig = config;
        const templates = (printTask === null || printTask === void 0 ? void 0 : printTask.templates) ? initDefaultTemplates(printTask === null || printTask === void 0 ? void 0 : printTask.templates, printServiceType, config === null || config === void 0 ? void 0 : config.printTemplateType) : [];
        const newTemplates = templates === null || templates === void 0 ? void 0 : templates.map(temp => {
            var _a;
            (temp === null || temp === void 0 ? void 0 : temp.layout) && (temp.layout = initTemplateLayout(temp === null || temp === void 0 ? void 0 : temp.layout));
            (temp === null || temp === void 0 ? void 0 : temp.format) && (temp.format = (_a = temp === null || temp === void 0 ? void 0 : temp.format) === null || _a === void 0 ? void 0 : _a.toLowerCase());
            return temp;
        });
        return getPrintTemplateTaskInfo(serviceUrl).then(templateTaskInfo => {
            const template = addDefaultMapSizeInTemplate(templateTaskInfo, newTemplates);
            const layoutChoiceList = getLayoutChoiceList(printTask === null || printTask === void 0 ? void 0 : printTask.templates, template);
            newConfig = newConfig.set('printCustomTemplate', template)
                .set('useUtility', utility)
                .set('formatList', printTask === null || printTask === void 0 ? void 0 : printTask.formatList)
                .set('defaultFormat', printTask === null || printTask === void 0 ? void 0 : printTask.defaultFormat)
                .set('layoutChoiceList', layoutChoiceList);
            return Promise.resolve(newConfig);
        });
    });
};
const addDefaultMapSizeInTemplate = (templateTaskInfo, templates) => {
    const newTemplates = templates === null || templates === void 0 ? void 0 : templates.map(temp => {
        var _a, _b, _c, _d, _e, _f, _g;
        let info;
        templateTaskInfo.forEach(item => {
            if (temp.label === item.layoutTemplate) {
                info = item;
            }
        });
        if (info === null || info === void 0 ? void 0 : info.webMapFrameSize) {
            temp.mapFrameSize = info === null || info === void 0 ? void 0 : info.webMapFrameSize;
            temp.mapFrameUnit = info === null || info === void 0 ? void 0 : info.pageUnits;
        }
        const customTextElementEnableList = (_b = (_a = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _a === void 0 ? void 0 : _a.customTextElements) === null || _b === void 0 ? void 0 : _b.map(item => {
            const customTextElementsEnable = {};
            for (const key in item) {
                customTextElementsEnable[key] = true;
            }
            return customTextElementsEnable;
        });
        const elementOverrides = getElementOverrides(info === null || info === void 0 ? void 0 : info.layoutOptions);
        temp.mapFrameUnit = info === null || info === void 0 ? void 0 : info.pageUnits;
        temp.hasAuthorText = (_c = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _c === void 0 ? void 0 : _c.hasAuthorText;
        temp.hasCopyrightText = (_d = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _d === void 0 ? void 0 : _d.hasCopyrightText;
        temp.hasLegend = (_e = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _e === void 0 ? void 0 : _e.hasLegend;
        temp.hasTitleText = (_f = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _f === void 0 ? void 0 : _f.hasTitleText;
        temp.selectedFormatList = [temp === null || temp === void 0 ? void 0 : temp.format];
        temp.layoutOptions.customTextElements = ((_g = info === null || info === void 0 ? void 0 : info.layoutOptions) === null || _g === void 0 ? void 0 : _g.customTextElements) || [];
        temp.layoutOptions.elementOverrides = elementOverrides;
        temp.customTextElementEnableList = customTextElementEnableList || [];
        temp.enableNorthArrow = !!getKeyOfNorthArrow(elementOverrides);
        return temp;
    });
    return newTemplates;
};
const getElementOverrides = (layoutOptions) => {
    const mapSurroundInfos = (layoutOptions === null || layoutOptions === void 0 ? void 0 : layoutOptions.mapSurroundInfos) || [];
    const defaultElementOverridesItem = mapSurroundInfos === null || mapSurroundInfos === void 0 ? void 0 : mapSurroundInfos.find(info => info.type === `${CIMMarkerNorthArrow}`);
    const defaultElementOverrides = {};
    if (defaultElementOverridesItem) {
        defaultElementOverrides[defaultElementOverridesItem === null || defaultElementOverridesItem === void 0 ? void 0 : defaultElementOverridesItem.name] = defaultElementOverridesItem;
    }
    const elementOverrides = (layoutOptions === null || layoutOptions === void 0 ? void 0 : layoutOptions.elementOverrides) || defaultElementOverrides;
    return elementOverrides;
};
const getLayoutChoiceList = (templates, printCustomTemplate) => {
    const layoutChoiceList = (templates === null || templates === void 0 ? void 0 : templates.map(info => {
        info.layoutTemplate = initTemplateLayout(info === null || info === void 0 ? void 0 : info.layout);
        printCustomTemplate === null || printCustomTemplate === void 0 ? void 0 : printCustomTemplate.forEach(temp => {
            if ((info === null || info === void 0 ? void 0 : info.layout) === (temp === null || temp === void 0 ? void 0 : temp.layout)) {
                info.mapFrameSize = temp === null || temp === void 0 ? void 0 : temp.mapFrameSize;
                info.mapFrameUnit = temp === null || temp === void 0 ? void 0 : temp.mapFrameUnit;
                info.hasAuthorText = temp === null || temp === void 0 ? void 0 : temp.hasAuthorText;
                info.hasCopyrightText = temp === null || temp === void 0 ? void 0 : temp.hasCopyrightText;
                info.hasLegend = temp === null || temp === void 0 ? void 0 : temp.hasLegend;
                info.hasTitleText = temp === null || temp === void 0 ? void 0 : temp.hasTitleText;
            }
        });
        return info;
    })) || [];
    return layoutChoiceList;
};
const getPrintServiceType = (utilityId) => {
    const utilityJson = UtilityManager.getInstance().getUtilityJson(utilityId);
    const printServiceType = (utilityJson === null || utilityJson === void 0 ? void 0 : utilityJson.source) === 'org' ? PrintServiceType.OrganizationService : PrintServiceType.Customize;
    return printServiceType;
};
//# sourceMappingURL=service-util.js.map