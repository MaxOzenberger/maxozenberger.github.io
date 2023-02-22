/** @jsx jsx */
import { React, jsx, css, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { ListLayout, Status } from '../../config';
import { hooks, Radio, Modal, ModalBody, ModalHeader, ModalFooter, Button, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
import { searchUtils } from 'jimu-layouts/layout-runtime';
import { setLayoutAuto, setLayoutCustom } from '../utils/utils';
import { useState, useEffect } from 'react';
const LayoutSetting = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const { id, listLayout, status, browserSizeMode, layouts, mainSizeMode, config, appConfig } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [reminderTitle, setReminderTitle] = useState(null);
    const [reminderText, setReminderText] = useState(null);
    const [reminderBottomText, setReminderBottomText] = useState(null);
    const layout = React.useRef(listLayout);
    const oldLayout = React.useRef(listLayout);
    useEffect(() => {
        layout.current = props.listLayout;
        oldLayout.current = props.listLayout;
    }, [status, props]);
    const STYLE = css `
    .jimu-radio {
      cursor: pointer;
    }
  `;
    const handleToggle = () => {
        setIsOpen(!isOpen);
        layout.current = oldLayout.current;
    };
    const handleConfirm = () => {
        const regularLayoutId = searchUtils.findLayoutId(layouts[Status.Regular], browserSizeMode, mainSizeMode);
        const desLayoutId = searchUtils.findLayoutId(layouts[status], browserSizeMode, mainSizeMode);
        const option = {
            layout: layout.current,
            config: config,
            widgetId: id,
            appConfig: appConfig,
            status: status,
            regularLayoutId: regularLayoutId,
            desLayoutId: desLayoutId,
            label: nls(status.toLowerCase())
        };
        if (layout.current === ListLayout.AUTO) {
            setLayoutAuto(option);
        }
        else {
            setLayoutCustom(option);
        }
        setIsOpen(false);
        oldLayout.current = layout.current;
    };
    const handleLayoutChange = (newLayout) => {
        if (oldLayout.current === newLayout)
            return;
        if (newLayout === ListLayout.AUTO) {
            setReminderTitle(nls('remindAutoLayoutTitle'));
            setReminderText(nls('remindAutoLayoutText'));
            setReminderBottomText('');
        }
        else {
            setReminderTitle(nls('remindCustomLayoutTitle'));
            setReminderText(nls('remindCustomLayoutText'));
            setReminderBottomText(nls('remindCustomLayoutBottomText'));
        }
        setIsOpen(true);
        layout.current = newLayout;
    };
    const renderRemindModel = () => {
        return (jsx(Modal, { isOpen: isOpen, toggle: handleToggle, centered: true },
            jsx(ModalHeader, { toggle: handleToggle },
                jsx(WarningOutlined, { className: 'mr-2', size: 16 }),
                reminderTitle),
            jsx(ModalBody, null,
                jsx("div", null, reminderText),
                jsx("div", { className: 'mt-2' }, reminderBottomText)),
            jsx(ModalFooter, null,
                jsx(Button, { title: nls('cancel'), onClick: () => { setIsOpen(false); } }, nls('cancel')),
                jsx(Button, { title: nls('ok'), type: 'primary', onClick: handleConfirm }, nls('ok')))));
    };
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage, jimuCoreDefaultMessage);
    return (jsx("div", { css: STYLE, role: 'group', "aria-label": nls('layout') },
        jsx(SettingRow, { label: nls('layout'), flow: 'wrap' },
            jsx(Radio, { title: nls('auto'), checked: ((_b = (_a = config === null || config === void 0 ? void 0 : config.cardConfigs) === null || _a === void 0 ? void 0 : _a[status]) === null || _b === void 0 ? void 0 : _b.listLayout) === ListLayout.AUTO, onChange: () => { handleLayoutChange(ListLayout.AUTO); }, className: 'mr-2' }),
            " ",
            nls('auto')),
        jsx(SettingRow, null,
            jsx(Radio, { title: nls('custom'), checked: ((_d = (_c = config === null || config === void 0 ? void 0 : config.cardConfigs) === null || _c === void 0 ? void 0 : _c[status]) === null || _d === void 0 ? void 0 : _d.listLayout) === ListLayout.CUSTOM || !((_f = (_e = config === null || config === void 0 ? void 0 : config.cardConfigs) === null || _e === void 0 ? void 0 : _e[status]) === null || _f === void 0 ? void 0 : _f.listLayout), onChange: () => { handleLayoutChange(ListLayout.CUSTOM); }, className: 'mr-2' }),
            " ",
            nls('custom')),
        renderRemindModel()));
};
export default LayoutSetting;
//# sourceMappingURL=switch-layout.js.map