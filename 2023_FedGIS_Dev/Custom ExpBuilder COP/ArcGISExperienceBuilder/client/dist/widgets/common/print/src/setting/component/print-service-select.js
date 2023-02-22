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
import { React, jsx, css, polished, Immutable, SupportedUtilityType } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessages } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { UtilitySelector } from 'jimu-ui/advanced/utility-selector';
import defaultMessages from '../translations/default';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { getNewTemplateInfo } from '../../utils/service-util';
const { useState, useEffect, useRef } = React;
const PrintServiceSelect = (props) => {
    const isRemoveServiceRef = useRef(false);
    const nls = hooks.useTranslate(defaultMessages, jimuiDefaultMessages);
    const { config, id, showLoading, onSettingChange, toggleLoading } = props;
    const [useUtility, setUseUtility] = useState(config === null || config === void 0 ? void 0 : config.useUtility);
    const STYLE = css `
    &>div>div {
      padding-left: 0!important;
      padding-right: 0!important;
    }
    .utility-placeholder {
      & {
        color: var(--dark-200);
      }
      p {
        color: var(--dark-500);
        font-size: ${polished.rem(14)};
        margin: ${polished.rem(16)} auto 0;
        line-height: ${polished.rem(19)};
        width: ${polished.rem(228)};
      }
    }
    .utility-list {
      margin-bottom: 0 !important;
    }
  }`;
    useEffect(() => {
        setUseUtility(config === null || config === void 0 ? void 0 : config.useUtility);
    }, [config]);
    const handleUtilityChange = (utilities) => {
        const utility = utilities[0];
        setUseUtility(utility);
        if (!utility) {
            isRemoveServiceRef.current = true;
            removeUtility();
        }
        else {
            isRemoveServiceRef.current = false;
            addUseUtility(utility);
        }
    };
    const removeUtility = () => {
        let newConfig = config;
        newConfig = newConfig.set('useUtility', null);
        toggleLoading(false);
        onSettingChange({
            id: id,
            config: newConfig,
            useUtilities: []
        });
    };
    const addUseUtility = (utility) => __awaiter(void 0, void 0, void 0, function* () {
        toggleLoading(true);
        getNewTemplateInfo(utility, config).then(newConfig => {
            if (isRemoveServiceRef.current) {
                return false;
            }
            toggleLoading(false);
            onSettingChange({
                id: id,
                config: newConfig,
                useUtilities: utility ? [utility] : []
            });
        }, err => {
            removeUtility();
            toggleLoading(false);
        });
    });
    const renderUseUtilityPlaceholder = () => {
        return (jsx("div", { className: 'w-100 mt-3 text-center utility-placeholder' },
            jsx("div", { className: "text-center w-100" },
                jsx(ClickOutlined, { size: 48 }),
                jsx("p", { className: 'text-Secondary', id: 'list-empty-tip', title: nls('utilityPlaceholder') }, nls('utilityPlaceholder')))));
    };
    return (jsx("div", { css: STYLE },
        jsx(SettingRow, { flow: 'wrap', label: nls('printService'), role: 'group', "aria-label": nls('printService') },
            jsx(UtilitySelector, { useUtilities: Immutable(useUtility ? [useUtility] : []), onChange: handleUtilityChange, showRemove: true, closePopupOnSelect: true, type: SupportedUtilityType.Printing })),
        (!(config === null || config === void 0 ? void 0 : config.useUtility) && !showLoading) && renderUseUtilityPlaceholder()));
};
export default PrintServiceSelect;
//# sourceMappingURL=print-service-select.js.map