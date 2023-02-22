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
import { React, jsx, css, polished, Immutable, classNames, ReactRedux } from 'jimu-core';
import { Button, hooks, Popper, getFallbackPlacementsModifier, Select, Option, Icon, SVG, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { PrintResultState } from '../../../config';
import defaultMessage from '../../translations/default';
import { WidgetPrintOutlined } from 'jimu-icons/outlined/brand/widget-print';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { print } from '../../utils/print-service';
import { checkIsTemplateExist, getIndexByTemplateId, mergeTemplateSetting } from '../../../utils/utils';
import SettingRow from '../setting-row';
import PrintResult from './result';
import PreviewExtent from '../preview-extents';
import { getPreviewLayerId, initTemplateProperties } from '../../utils/utils';
const { useState, useRef, useEffect } = React;
const { useSelector } = ReactRedux;
const CompactPrint = (props) => {
    var _a, _b;
    const { config, templateList, jimuMapView, errorTip, id } = props;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const printButtonRef = useRef(null);
    const widgetJson = useSelector((state) => { var _a, _b; return (_b = (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.widgets) === null || _b === void 0 ? void 0 : _b[id]; });
    const STYLE = css `
    .compact-con {
      padding: 0;
      svg {
        margin: 0 auto;
      }
      .compact-icon {
        color: ${(_b = (_a = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.icon) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.color};
      }
    }
  `;
    const POPPER_STYLE = css `
    & {
      padding: ${polished.rem(12)};
      width: ${polished.rem(320)};
      height: ${polished.rem(155)};
    }
    .close-con button{
      padding: 0;
    }
    .result-list-con button {
      padding: 0;
    }
    .compact-preview-con {
      width: 0;
    }
  `;
    const MODIFIERS = [
        {
            name: 'preventOverflow',
            options: {
                altAxis: true
            }
        },
        getFallbackPlacementsModifier(['left-start', 'left-end'], true)
    ];
    const [openPopper, setOpenPopper] = useState(false);
    const [showResult, setShowReult] = useState(false);
    const [printResult, setPrintResult] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    useEffect(() => {
        setSelectedTemplateByIndex(0);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (!selectedTemplate || (!checkIsTemplateExist(templateList, selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId))) {
            setSelectedTemplateByIndex(0);
        }
        if (selectedTemplate && checkIsTemplateExist(templateList, selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId)) {
            const index = getIndexByTemplateId(templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true }), selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId);
            setSelectedTemplateByIndex(index);
        }
        // eslint-disable-next-line
    }, [templateList, config]);
    const setSelectedTemplateByIndex = (index) => {
        if ((templateList === null || templateList === void 0 ? void 0 : templateList.length) === 0)
            return false;
        let template = templateList === null || templateList === void 0 ? void 0 : templateList[index];
        if (template === null || template === void 0 ? void 0 : template.overrideCommonSetting) {
            template = mergeTemplateSetting(config === null || config === void 0 ? void 0 : config.commonSetting, template);
        }
        else {
            template = mergeTemplateSetting(template, config === null || config === void 0 ? void 0 : config.commonSetting);
        }
        setSelectedTemplate(template);
    };
    const togglePopper = () => {
        setOpenPopper(!openPopper);
    };
    const toggleResultPanel = () => {
        setShowReult(!showResult);
    };
    const handleTemplateChange = (e) => {
        var _a;
        const templateId = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        const index = getIndexByTemplateId(templateList === null || templateList === void 0 ? void 0 : templateList.asMutable({ deep: true }), templateId);
        setSelectedTemplateByIndex(index);
    };
    const restPrint = () => {
        setPrintResult(null);
        setShowReult(false);
    };
    const togglePreviewLayer = (visible) => {
        const layerId = getPreviewLayerId(id, jimuMapView.id);
        const graphicsLayer = jimuMapView.view.map.findLayerById(layerId);
        if (graphicsLayer) {
            graphicsLayer.visible = visible;
        }
    };
    const confirmPrint = () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const printResult = {
            resultId: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId,
            url: null,
            title: (_c = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _c === void 0 ? void 0 : _c.titleText,
            state: PrintResultState.Loading
        };
        setPrintResult(Immutable(printResult));
        toggleResultPanel();
        togglePreviewLayer(false);
        print({
            useUtility: config === null || config === void 0 ? void 0 : config.useUtility,
            mapView: jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.view,
            printTemplateProperties: yield initTemplateProperties(selectedTemplate, jimuMapView)
        }).then(res => {
            printResult.url = res === null || res === void 0 ? void 0 : res.url;
            printResult.state = PrintResultState.Success;
            togglePreviewLayer(true);
            setPrintResult(Immutable(printResult));
        }, printError => {
            togglePreviewLayer(true);
            printResult.state = PrintResultState.Error;
            setPrintResult(Immutable(printResult));
        });
    });
    const renderTemplateSelect = () => {
        var _a;
        return (jsx("div", { className: 'd-flex flex-column' },
            jsx(SettingRow, { flowWrap: true, className: 'flex-grow-1', label: nls('template') },
                jsx(Select, { value: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.templateId, onChange: handleTemplateChange, size: 'sm', className: 'scalebar-unit', "aria-label": nls('template') }, templateList === null || templateList === void 0 ? void 0 : templateList.map((template, index) => {
                    return (jsx(Option, { key: template.templateId, value: template.templateId, title: template.label }, template.label));
                }))),
            jsx("div", { className: 'print-button-con d-flex align-items-center mt-2' },
                jsx(PreviewExtent, { className: 'flex-grow-1 compact-preview-con', id: id, jimuMapView: jimuMapView, scale: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.outScale, selectedTemplate: selectedTemplate, scalebarUnit: (_a = selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.layoutOptions) === null || _a === void 0 ? void 0 : _a.scalebarUnit, printExtentType: selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.printExtentType }),
                jsx(Button, { className: 'print-button text-truncate ml-1', type: 'primary', onClick: confirmPrint, title: nls('_widgetLabel') }, nls('_widgetLabel')))));
    };
    const checkShowPlaceholder = () => {
        return !jimuMapView || !(config === null || config === void 0 ? void 0 : config.useUtility);
    };
    const renderPrintIcon = () => {
        const icon = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.icon;
        if (!icon) {
            return (jsx(WidgetPrintOutlined, null));
        }
        if (typeof (icon) === 'string') {
            return (jsx(SVG, { src: icon }));
        }
        else {
            return (jsx(Icon, { className: 'compact-icon', icon: icon === null || icon === void 0 ? void 0 : icon.svg }));
        }
    };
    return (jsx("div", { className: 'w-100 h-100', css: STYLE },
        jsx(Button, { className: 'w-100 h-100 compact-con', type: 'tertiary', ref: printButtonRef, title: nls('_widgetLabel'), onClick: togglePopper }, renderPrintIcon()),
        jsx(Popper, { open: openPopper, disableResize: true, placement: 'bottom', reference: printButtonRef, modifiers: MODIFIERS, showArrow: true, toggle: togglePopper, trapFocus: false, autoFocus: false, css: POPPER_STYLE },
            !checkShowPlaceholder() && jsx("div", { className: 'd-flex flex-column w-100 h-100' },
                jsx("div", { className: 'text-right close-con' },
                    jsx(Button, { className: 'print-button', type: 'tertiary', title: nls('closeTour'), onClick: togglePopper },
                        jsx(CloseOutlined, null))),
                jsx("div", { className: 'flex-grow-1' },
                    jsx("div", { className: classNames('w-100 h-100', { 'sr-only': showResult }) }, renderTemplateSelect()),
                    showResult && jsx(PrintResult, { prinResult: printResult, restPrint: restPrint }))),
            checkShowPlaceholder() && jsx("div", null, errorTip))));
};
export default CompactPrint;
//# sourceMappingURL=index.js.map