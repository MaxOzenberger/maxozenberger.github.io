/** @jsx jsx */
import { React, jsx, css, polished, Immutable } from 'jimu-core';
import { hooks, Button, Loading, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { SettingSection } from 'jimu-ui/advanced/setting-components';
import TemplateList from './template-list';
import defaultMessage from '../translations/default';
import { checkIsCustomTemplate, mergeTemplateSetting } from '../../utils/utils';
import { getNewTemplateId } from '../util/util';
import { PrintTemplateType, DEFAULT_COMMON_SETTING } from '../../config';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import CustomSetting from './template-custom-setting';
import PrintServiceSelect from './print-service-select';
const { useState } = React;
const TemplateSetting = (props) => {
    const { config, id, jimuMapView, onSettingChange, handlePropertyChange } = props;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const STYLE = css `
    .radio-con {
      cursor: pointer;
    }
    .loading-con {
      height: ${polished.rem(100)};
    }
  `;
    const [activeTemplateId, setActiveTemplateId] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const handelActiveTemplateIdChange = (templateId) => {
        if (templateId === activeTemplateId) {
            setActiveTemplateId(null);
        }
        else {
            setActiveTemplateId(templateId);
        }
    };
    const toggleLoading = (isShowLoading) => {
        setShowLoading(isShowLoading);
    };
    const handelTemplateListChange = (newTemplate) => {
        const isCustomTemplate = checkIsCustomTemplate(config === null || config === void 0 ? void 0 : config.printServiceType, config === null || config === void 0 ? void 0 : config.printTemplateType);
        if (isCustomTemplate) {
            handlePropertyChange('printCustomTemplate', newTemplate);
        }
        else {
            handlePropertyChange('printOrgTemplate', newTemplate);
        }
    };
    const newCustomTemplate = () => {
        var _a, _b;
        let newPrintCustomTemplate = ((_a = config === null || config === void 0 ? void 0 : config.printCustomTemplate) === null || _a === void 0 ? void 0 : _a[0]) || Immutable({});
        const newCustomTemplate = ((_b = config === null || config === void 0 ? void 0 : config.printCustomTemplate) === null || _b === void 0 ? void 0 : _b.asMutable({ deep: true })) || [];
        const newTemplateId = getNewTemplateId(newCustomTemplate, config === null || config === void 0 ? void 0 : config.printServiceType, PrintTemplateType.Customize);
        newPrintCustomTemplate = mergeTemplateSetting(newPrintCustomTemplate, Immutable(DEFAULT_COMMON_SETTING));
        newPrintCustomTemplate = newPrintCustomTemplate.set('format', config === null || config === void 0 ? void 0 : config.defaultFormat).set('templateId', newTemplateId);
        newCustomTemplate.push(newPrintCustomTemplate === null || newPrintCustomTemplate === void 0 ? void 0 : newPrintCustomTemplate.asMutable({ deep: true }));
        handlePropertyChange('printCustomTemplate', newCustomTemplate);
        setActiveTemplateId(newTemplateId);
    };
    return (jsx(SettingSection, { title: nls('configurePrintTemplate'), css: STYLE, role: 'group', "aria-label": nls('configurePrintTemplate') },
        jsx(PrintServiceSelect, { id: id, config: config, showLoading: showLoading, onSettingChange: onSettingChange, toggleLoading: toggleLoading }),
        showLoading && jsx("div", { className: 'loading-con position-relative' },
            jsx(Loading, null)),
        (config === null || config === void 0 ? void 0 : config.useUtility) && jsx("div", null,
            (config === null || config === void 0 ? void 0 : config.printTemplateType) === PrintTemplateType.Customize && jsx(Button, { className: 'w-100 mt-2', type: 'primary', onClick: newCustomTemplate },
                jsx(PlusOutlined, { className: 'mr-1' }),
                nls('newTemplate')),
            !showLoading && jsx(TemplateList, { id: id, handelActiveTemplateIdChange: handelActiveTemplateIdChange, handelTemplateListChange: handelTemplateListChange, showNewTemplateItem: false, activeTemplateId: activeTemplateId, config: config }),
            jsx(CustomSetting, { id: id, isOpen: activeTemplateId, config: config, activeTemplateId: activeTemplateId, toggle: () => { handelActiveTemplateIdChange(null); }, handelTemplateListChange: handelTemplateListChange, jimuMapView: jimuMapView }))));
};
export default TemplateSetting;
//# sourceMappingURL=template-setting.js.map