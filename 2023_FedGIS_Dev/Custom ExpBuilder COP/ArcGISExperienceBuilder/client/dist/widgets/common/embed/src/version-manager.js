import { BaseVersionManager, utils, ExpressionPartType, getAppStore } from 'jimu-core';
import { EmbedType } from './config';
const getExpressionString = (expression) => {
    try {
        let string = JSON.stringify(expression);
        string = encodeURIComponent(string);
        return string;
    }
    catch (error) {
        console.error(error);
    }
};
const renderExpressionToHtml = (expression) => {
    let multiExpDom = '';
    const { parts } = expression;
    if (parts.length > 0) {
        let functionFlag = false;
        const functionExp = { name: '', parts: [] };
        // Ensure that Function nesting is closed
        let leftBracketsCount = 0;
        let rightBracketsCount = 0;
        let functionDsid = '';
        parts.forEach(part => {
            const { type, dataSourceId: dsid, exp: name } = part;
            if (functionFlag) {
                functionExp.name += name;
                functionExp.parts.push(part);
                if (dsid)
                    functionDsid = dsid;
                if (type === ExpressionPartType.Operator && name === '(') {
                    leftBracketsCount++;
                }
                else if (type === ExpressionPartType.Operator && name === ')') {
                    rightBracketsCount++;
                    if (rightBracketsCount === leftBracketsCount) {
                        // reset all
                        leftBracketsCount = 0;
                        rightBracketsCount = 0;
                        functionFlag = false;
                        // encode function
                        const uniqueid = utils.getUUID();
                        const expDom = document && document.createElement('exp');
                        expDom.setAttribute('data-uniqueid', uniqueid);
                        expDom.setAttribute('data-dsid', functionDsid);
                        expDom.setAttribute('data-expression', getExpressionString(functionExp));
                        expDom.innerHTML = functionExp.name;
                        multiExpDom += expDom.outerHTML;
                    }
                }
                return false;
            }
            if (type === ExpressionPartType.Field) {
                const uniqueid = utils.getUUID();
                const expDom = document && document.createElement('exp');
                expDom.setAttribute('data-uniqueid', uniqueid);
                expDom.setAttribute('data-dsid', dsid);
                expDom.setAttribute('data-expression', getExpressionString({ name, parts: [part] }));
                expDom.innerHTML = name;
                multiExpDom += expDom.outerHTML;
            }
            else if (type === ExpressionPartType.String) {
                multiExpDom += name.replace(/(^['|"]*|['|"]*$)/g, '');
            }
            else if (type === ExpressionPartType.Number) {
                multiExpDom += name;
            }
            else if (type === ExpressionPartType.Function) {
                functionFlag = true;
                functionExp.name = name;
                functionExp.parts.push(part);
            }
        });
    }
    return `<p>${multiExpDom}</p>`;
};
class VersionManager extends BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [{
                version: '1.0.0',
                description: 'The first release.',
                upgrader: (oldConfig) => {
                    var _a, _b;
                    const embedType = (_a = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.functionConfig) === null || _a === void 0 ? void 0 : _a.embedType;
                    const content = (_b = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.functionConfig) === null || _b === void 0 ? void 0 : _b.content;
                    if (embedType) {
                        oldConfig = oldConfig.set('embedType', embedType);
                        if (embedType === EmbedType.Url) {
                            oldConfig = oldConfig.set('staticUrl', content);
                        }
                        else {
                            oldConfig = oldConfig.set('embedCode', content);
                        }
                    }
                    else {
                        oldConfig = oldConfig.set('embedType', EmbedType.Url);
                    }
                    oldConfig = oldConfig.without('functionConfig');
                    return oldConfig;
                }
            }, {
                version: '1.4.0',
                description: 'Enhance the URL editor.',
                upgrader: (oldConfig, id) => {
                    var _a, _b;
                    const embedType = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.embedType;
                    const expression = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.expression;
                    const staticUrl = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.staticUrl;
                    const widgetProps = (_b = (_a = getAppStore().getState()) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.widgets[id];
                    const useDataSourcesEnabled = widgetProps === null || widgetProps === void 0 ? void 0 : widgetProps.useDataSourcesEnabled;
                    if (expression === null || expression === void 0 ? void 0 : expression.name) {
                        oldConfig = oldConfig.set('enableLabel', true).set('label', expression.name);
                    }
                    if (embedType === EmbedType.Url && staticUrl) {
                        const expression = `<p>${staticUrl}</p>`;
                        oldConfig = oldConfig.set('expression', expression);
                        // eslint-disable-next-line
                    }
                    else if (embedType === EmbedType.Url && expression && (useDataSourcesEnabled !== false)) {
                        const htmlValue = renderExpressionToHtml(expression);
                        oldConfig = oldConfig.set('expression', htmlValue);
                    }
                    return oldConfig;
                }
            }, {
                version: '1.7.0',
                description: 'Update some wrong config',
                upgrader: (oldConfig, id) => {
                    const expression = oldConfig === null || oldConfig === void 0 ? void 0 : oldConfig.expression;
                    const clearEmptyTag = (expression) => {
                        const EXP_TAG_REGEXP = /\<exp((?!\<exp).)+\<\/exp\>/gmi;
                        const hasExpressionTag = expression === null || expression === void 0 ? void 0 : expression.match(EXP_TAG_REGEXP);
                        let filterExp = expression;
                        if (hasExpressionTag) {
                            hasExpressionTag.forEach(exptag => {
                                var _a, _b;
                                const tagContent = (_a = exptag.match(/<exp[^>]*>([\s\S]*?)<\/exp>/)) === null || _a === void 0 ? void 0 : _a[1];
                                const matchSpan = tagContent.match(/<span[^>]*>([\s\S]*?)<\/span>/);
                                const spanContent = matchSpan && ((_b = tagContent.match(/<span[^>]*>([\s\S]*?)<\/span>/)) === null || _b === void 0 ? void 0 : _b[1]);
                                if (!tagContent.trim() || (matchSpan && !spanContent.trim())) {
                                    filterExp = filterExp.replace(exptag, '');
                                }
                            });
                        }
                        return filterExp;
                    };
                    oldConfig = oldConfig.set('expression', clearEmptyTag(expression));
                    return oldConfig;
                }
            }];
    }
}
export const versionManager = new VersionManager();
//# sourceMappingURL=version-manager.js.map