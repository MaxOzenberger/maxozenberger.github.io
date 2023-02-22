var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrintExtentType } from '../../config';
import { getLegendLayer } from '../../utils/utils';
export const getNewResultItemTitle = (title, printResultList) => {
    let index = 1;
    let newTitle = title;
    printResultList.forEach(item => {
        if (newTitle === (item === null || item === void 0 ? void 0 : item.title)) {
            newTitle = `${title} (${index})`;
            index++;
            getNewResultItemTitle(newTitle, printResultList);
        }
    });
    return newTitle;
};
/**
 * Get result id list
*/
export const getResultIdList = (printResultList) => {
    var _a;
    if (!printResultList)
        return [];
    return (_a = printResultList === null || printResultList === void 0 ? void 0 : printResultList.asMutable()) === null || _a === void 0 ? void 0 : _a.map(item => item.resultId);
};
/**
 * Get new datasource config id
*/
export const getNewResultId = (printResultList) => {
    const resultIdList = getResultIdList(printResultList);
    if (!resultIdList || (resultIdList === null || resultIdList === void 0 ? void 0 : resultIdList.length) === 0)
        return 'result_0';
    const maxIndex = getConfigIndexMaxNumber(resultIdList);
    return `config_${maxIndex + 1}`;
};
const getConfigIndexMaxNumber = (resultIdList) => {
    var _a;
    if (!resultIdList || (resultIdList === null || resultIdList === void 0 ? void 0 : resultIdList.length) === 0)
        return 0;
    const idIndexData = resultIdList === null || resultIdList === void 0 ? void 0 : resultIdList.map(id => {
        var _a;
        const currentIndex = (_a = id === null || id === void 0 ? void 0 : id.split('_')) === null || _a === void 0 ? void 0 : _a.pop();
        return currentIndex ? Number(currentIndex) : 0;
    });
    return (_a = idIndexData === null || idIndexData === void 0 ? void 0 : idIndexData.sort((a, b) => b - a)) === null || _a === void 0 ? void 0 : _a[0];
};
export function getPreviewLayerId(widgetId, jimuMapViewId) {
    return 'print-extents-layer-' + widgetId + '-' + jimuMapViewId;
}
export function initTemplateProperties(printTemplateProperties, mapView) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line
        const isRemoveTitleText = (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.hasTitleText) === false;
        // eslint-disable-next-line
        const isRemoveLegend = (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.hasLegend) === false;
        let newTemplateProperties = printTemplateProperties
            .without('enableTitle', 'enableAuthor', 'enableOutputSpatialReference', 'enableMapPrintExtents', 'enableQuality', 'enableMapSize', 'enableFeatureAttribution', 'enableCopyright', 'enableLegend', 'enableMapAttribution', 'enableCustomTextElements', 'hasAuthorText', 'hasCopyrightText', 'hasLegend', 'hasTitleText', 'selectedFormatList', 'mapFrameSize', 'mapFrameUnit', 'legendEnabled', 'templateId', 'printExtentType', 'customTextElementEnableList');
        switch (printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.printExtentType) {
            case PrintExtentType.CurrentMapExtent:
                newTemplateProperties = newTemplateProperties.set('scalePreserved', false);
                break;
            case PrintExtentType.CurrentMapScale:
                newTemplateProperties = newTemplateProperties.set('outScale', (_a = mapView === null || mapView === void 0 ? void 0 : mapView.view) === null || _a === void 0 ? void 0 : _a.scale).set('scalePreserved', true);
                break;
            case PrintExtentType.SetMapScale:
                newTemplateProperties = newTemplateProperties.set('scalePreserved', true);
                break;
        }
        const templateProperties = newTemplateProperties === null || newTemplateProperties === void 0 ? void 0 : newTemplateProperties.asMutable({ deep: true });
        if (isRemoveTitleText) {
            (_b = templateProperties === null || templateProperties === void 0 ? void 0 : templateProperties.layoutOptions) === null || _b === void 0 ? true : delete _b.titleText;
        }
        if (isRemoveLegend) {
            (_c = templateProperties === null || templateProperties === void 0 ? void 0 : templateProperties.layoutOptions) === null || _c === void 0 ? true : delete _c.legendLayers;
        }
        if (((_d = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.layoutOptions) === null || _d === void 0 ? void 0 : _d.legendLayers) && ((_f = (_e = printTemplateProperties === null || printTemplateProperties === void 0 ? void 0 : printTemplateProperties.layoutOptions) === null || _e === void 0 ? void 0 : _e.legendLayers) === null || _f === void 0 ? void 0 : _f.length) > 0) {
            templateProperties.layoutOptions.legendLayers = yield getLegendLayer(mapView);
        }
        return Promise.resolve(templateProperties);
    });
}
//# sourceMappingURL=utils.js.map