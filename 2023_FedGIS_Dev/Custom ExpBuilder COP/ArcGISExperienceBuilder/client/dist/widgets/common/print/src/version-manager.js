var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseVersionManager, Immutable } from 'jimu-core';
import { getNewTemplateInfo } from './utils/service-util';
import { DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH } from './config';
import { checkIsMapOnly } from './utils/utils';
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [
            {
                version: '1.10.0',
                description: 'update layoutChoiceList of old print widget',
                upgrader: (oldConfig) => __awaiter(this, void 0, void 0, function* () {
                    const useUtility = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.useUtility;
                    const updateDpiAndMapSize = (template) => {
                        var _a, _b, _c, _d, _e, _f;
                        let temp = Immutable(template);
                        if ((_a = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _a === void 0 ? void 0 : _a.dpi) {
                            const dpi = Number((_b = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _b === void 0 ? void 0 : _b.dpi);
                            if (dpi < 0) {
                                temp = temp.setIn(['exportOptions', 'dpi'], 1);
                            }
                            else if (parseInt(dpi) !== dpi) {
                                temp = temp.setIn(['exportOptions', 'dpi'], parseInt(dpi));
                            }
                        }
                        if ((_c = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _c === void 0 ? void 0 : _c.width) {
                            const width = Number((_d = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _d === void 0 ? void 0 : _d.width);
                            if (width < 1) {
                                temp = temp.setIn(['exportOptions', 'width'], DEFAULT_MAP_WIDTH);
                            }
                        }
                        else if ((template === null || template === void 0 ? void 0 : template.layout) && checkIsMapOnly(template === null || template === void 0 ? void 0 : template.layout)) {
                            temp = temp.setIn(['exportOptions', 'width'], DEFAULT_MAP_WIDTH);
                        }
                        if ((_e = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _e === void 0 ? void 0 : _e.height) {
                            const height = Number((_f = template === null || template === void 0 ? void 0 : template.exportOptions) === null || _f === void 0 ? void 0 : _f.height);
                            if (height < 1) {
                                temp = temp.setIn(['exportOptions', 'height'], DEFAULT_MAP_HEIGHT);
                            }
                        }
                        else if ((template === null || template === void 0 ? void 0 : template.layout) && checkIsMapOnly(template === null || template === void 0 ? void 0 : template.layout)) {
                            temp = temp.setIn(['exportOptions', 'height'], DEFAULT_MAP_HEIGHT);
                        }
                        return temp === null || temp === void 0 ? void 0 : temp.asMutable({ deep: true });
                    };
                    const updateCommonSetting = (oldConfig) => {
                        var _a, _b;
                        if ((_b = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.commonSetting) === null || _a === void 0 ? void 0 : _a.exportOptions) === null || _b === void 0 ? void 0 : _b.dpi) {
                            return oldConfig.setIn(['commonSetting'], updateDpiAndMapSize(oldConfig.commonSetting));
                        }
                        else {
                            return oldConfig;
                        }
                    };
                    oldConfig = updateCommonSetting(oldConfig);
                    //update printCustomTemplate in config
                    const updatePrintCustomTemplate = (oldConfig, newLayoutChoiceList) => {
                        var _a;
                        const printCustomTemplate = ((_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.printCustomTemplate) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })) || [];
                        if (printCustomTemplate) {
                            return printCustomTemplate === null || printCustomTemplate === void 0 ? void 0 : printCustomTemplate.map(temp => {
                                var _a;
                                if (!(temp === null || temp === void 0 ? void 0 : temp.mapFrameSize)) {
                                    const currentLayout = (_a = newLayoutChoiceList === null || newLayoutChoiceList === void 0 ? void 0 : newLayoutChoiceList.filter(item => (item === null || item === void 0 ? void 0 : item.layout) === (temp === null || temp === void 0 ? void 0 : temp.layout))) === null || _a === void 0 ? void 0 : _a[0];
                                    const newLayoutInfo = {
                                        mapFrameSize: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.mapFrameSize,
                                        mapFrameUnit: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.mapFrameUnit,
                                        hasAuthorText: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.hasAuthorText,
                                        hasCopyrightText: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.hasCopyrightText,
                                        hasLegend: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.hasLegend,
                                        hasTitleText: currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.hasTitleText
                                    };
                                    return Object.assign(Object.assign({}, updateDpiAndMapSize(temp)), newLayoutInfo);
                                }
                                else {
                                    return updateDpiAndMapSize(temp);
                                }
                            });
                        }
                        else {
                            return printCustomTemplate;
                        }
                    };
                    if (useUtility) {
                        const newConfig = yield getNewTemplateInfo(useUtility, oldConfig);
                        if (newConfig === null || newConfig === void 0 ? void 0 : newConfig.layoutChoiceList) {
                            const printCustomTemplate = updatePrintCustomTemplate(oldConfig, newConfig === null || newConfig === void 0 ? void 0 : newConfig.layoutChoiceList);
                            return oldConfig.setIn(['layoutChoiceList'], newConfig === null || newConfig === void 0 ? void 0 : newConfig.layoutChoiceList).set('printCustomTemplate', printCustomTemplate);
                        }
                        else {
                            return oldConfig;
                        }
                    }
                    else {
                        return oldConfig;
                    }
                })
            }
        ];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map