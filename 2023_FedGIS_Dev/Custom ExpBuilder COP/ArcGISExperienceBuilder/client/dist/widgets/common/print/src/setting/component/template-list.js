/** @jsx jsx */
import { React, jsx, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { hooks, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui';
import { getIndexByTemplateId } from '../../utils/utils';
import { PrintTemplateType, PrintServiceType } from '../../config';
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg');
const TemplateList = (props) => {
    const nls = hooks.useTranslate(jimuCoreDefaultMessage, jimuUiDefaultMessage);
    const { className, config, activeTemplateId, showNewTemplateItem, handelActiveTemplateIdChange, handelTemplateListChange } = props;
    const AdvancedActionMap = {
        isItemFocused: (actionData, refComponent) => {
            const { itemJsons: [currentItemJson, parentArray] } = refComponent.props;
            return activeTemplateId && parentArray.indexOf(currentItemJson) === getIndexByTemplateId(templateList, activeTemplateId);
        },
        overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
            return {
                name: TreeItemActionType.RenderOverrideItem,
                children: [{
                        name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                        children: [{
                                name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                children: [{
                                        name: TreeItemActionType.RenderOverrideItemBody,
                                        children: [{
                                                name: TreeItemActionType.RenderOverrideItemMainLine,
                                                children: [{
                                                        name: TreeItemActionType.RenderOverrideItemDragHandle
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemIcon,
                                                        autoCollapsed: true
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemTitle
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemDetailToggle
                                                    }, {
                                                        name: TreeItemActionType.RenderOverrideItemCommands
                                                    }]
                                            }]
                                    }]
                            }]
                    }]
            };
        }
    };
    React.useEffect(() => {
        setIsTemplateEditable((config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.Customize || (config === null || config === void 0 ? void 0 : config.printServiceType) === PrintServiceType.Customize);
        getTemplateList();
        // eslint-disable-next-line
    }, [config]);
    const [isTemplateEditable, setIsTemplateEditable] = React.useState((config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.Customize || (config === null || config === void 0 ? void 0 : config.printServiceType) === PrintServiceType.Customize);
    const [templateList, setTemplateList] = React.useState([]);
    const getTemplateList = () => {
        var _a, _b;
        if ((config === null || config === void 0 ? void 0 : config.printServiceType) === PrintServiceType.Customize || (config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.Customize) {
            setTemplateList(((_a = config === null || config === void 0 ? void 0 : config.printCustomTemplate) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true })) || []);
        }
        else {
            setTemplateList(((_b = config === null || config === void 0 ? void 0 : config.printOrgTemplate) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true })) || []);
        }
    };
    const onRemoveTemplateButtonClick = (index) => {
        const newTemplateList = templateList;
        newTemplateList === null || newTemplateList === void 0 ? void 0 : newTemplateList.splice(index, 1);
        handelTemplateListChange(newTemplateList);
        handelActiveTemplateIdChange(null);
    };
    const getTtemStateCommands = (index) => {
        return (config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.Customize
            ? [{
                    label: nls('deleteOption'),
                    iconProps: () => ({ icon: IconClose, size: 12 }),
                    action: () => {
                        onRemoveTemplateButtonClick(index);
                    }
                }]
            : [];
    };
    return (jsx("div", { className: `w-100 mt-2 ${className || ''}` },
        jsx(List, Object.assign({ className: 'w-100', itemsJson: Array.from(templateList).map((item, index) => ({
                itemStateDetailContent: item,
                itemKey: `${item === null || item === void 0 ? void 0 : item.templateId}`,
                itemStateTitle: item === null || item === void 0 ? void 0 : item.label,
                itemStateIcon: null,
                itemStateCommands: getTtemStateCommands(index)
            })), dndEnabled: isTemplateEditable, renderOverrideItemDetailToggle: () => '', onUpdateItem: (actionData, refComponent) => {
                const { itemJsons } = refComponent.props;
                const [, parentItemJson] = itemJsons;
                const newTemplate = parentItemJson.map(item => {
                    return item.itemStateDetailContent;
                });
                handelActiveTemplateIdChange(null);
                handelTemplateListChange(newTemplate);
            }, onClickItemBody: (actionData, refComponent) => {
                const { itemJsons: [currentItemJson] } = refComponent.props;
                handelActiveTemplateIdChange(currentItemJson.itemKey);
            } }, AdvancedActionMap)),
        showNewTemplateItem && jsx(List, Object.assign({ className: 'setting-ui-unit-list-new', itemsJson: [{
                    name: '......'
                }].map((item, x) => ({
                itemStateDetailContent: 'item',
                itemKey: 'index',
                itemStateTitle: '......',
                itemStateCommands: []
            })), dndEnabled: false, renderOverrideItemDetailToggle: () => '' }, AdvancedActionMap, { isItemFocused: () => true }))));
};
export default TemplateList;
//# sourceMappingURL=template-list.js.map