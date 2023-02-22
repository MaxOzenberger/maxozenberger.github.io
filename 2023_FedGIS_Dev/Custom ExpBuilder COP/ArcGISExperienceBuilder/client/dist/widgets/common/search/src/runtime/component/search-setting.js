/** @jsx jsx */
import { React, css, jsx, polished } from 'jimu-core';
import { Checkbox, Dropdown, DropdownButton, DropdownMenu, DropdownItem, hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { useEffect } from 'react';
import defaultMessage from '../translations/default';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
const { useRef, useState } = React;
const SearchSetting = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const STYLE = css `
    & {
      box-sizing: border-box;
      width: ${polished.rem(32)}
    }
    .setting-dropdown-button {
      border-radius: 0;
      svg {
        margin: 0 !important;
      }
    }
  `;
    const [isCheckAll, setIsCheckAll] = useState(true);
    const [isOpen, setIsOpen] = React.useState(false);
    const { className, datasourceConfig, onDatasourceConfigChange } = props;
    const dropdownMenuRef = useRef(null);
    const toggleSearchSetting = (e) => {
        var _a;
        const target = e === null || e === void 0 ? void 0 : e.target;
        if ((_a = dropdownMenuRef === null || dropdownMenuRef === void 0 ? void 0 : dropdownMenuRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) {
            return false;
        }
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        var _a;
        const isSelectAll = ((_a = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.filter(dsConfigItem => !(dsConfigItem === null || dsConfigItem === void 0 ? void 0 : dsConfigItem.enable))) === null || _a === void 0 ? void 0 : _a.length) === 0;
        setIsCheckAll(isSelectAll);
    }, [datasourceConfig]);
    const onDsConfigItemChange = (enable, index) => {
        const newDatasourceConfig = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.setIn([index, 'enable'], enable);
        onDatasourceConfigChange(newDatasourceConfig);
    };
    const selectAll = () => {
        const newDatasourceConfig = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.map(configItem => {
            var _a;
            return (_a = configItem.setIn(['enable'], true)) === null || _a === void 0 ? void 0 : _a.asMutable({ deep: true });
        });
        onDatasourceConfigChange(newDatasourceConfig);
    };
    const renderFieldListElement = () => {
        return datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.map((configDsItem, index) => {
            var _a;
            const disabled = ((_a = datasourceConfig === null || datasourceConfig === void 0 ? void 0 : datasourceConfig.filter(dsConfigItem => dsConfigItem === null || dsConfigItem === void 0 ? void 0 : dsConfigItem.enable)) === null || _a === void 0 ? void 0 : _a.length) === 1 && (configDsItem === null || configDsItem === void 0 ? void 0 : configDsItem.enable);
            return jsx(DropdownItem, { key: `${configDsItem === null || configDsItem === void 0 ? void 0 : configDsItem.label}${index}`, title: configDsItem === null || configDsItem === void 0 ? void 0 : configDsItem.label, disabled: disabled, onClick: () => { onDsConfigItemChange(!(configDsItem === null || configDsItem === void 0 ? void 0 : configDsItem.enable), index); } },
                jsx(Checkbox, { checked: configDsItem === null || configDsItem === void 0 ? void 0 : configDsItem.enable, disabled: disabled, className: 'mr-2' }), configDsItem === null || configDsItem === void 0 ? void 0 :
                configDsItem.label);
        });
    };
    return (jsx("div", { className: `${className || ''}`, css: STYLE, role: 'group', "aria-label": nls('searchIn', { value: '' }) },
        jsx(Dropdown, { className: 'w-100 h-100', toggle: toggleSearchSetting, isOpen: isOpen },
            jsx(DropdownButton, { className: 'h-100 setting-dropdown-button', arrow: false, icon: true, title: nls('searchIn', { value: '' }) },
                !isOpen && jsx(DownOutlined, { size: 16, className: 'mr-1 d-inline-block', autoFlip: true }),
                isOpen && jsx(UpOutlined, { size: 16, className: 'mr-1 d-inline-block', autoFlip: true })),
            jsx(DropdownMenu, { trapFocus: false, autoFocus: false, style: { maxHeight: 'auto' } },
                jsx("div", { ref: dropdownMenuRef },
                    jsx(DropdownItem, { onClick: selectAll, disabled: isCheckAll, title: nls('all') },
                        jsx(Checkbox, { checked: isCheckAll, disabled: isCheckAll, className: 'mr-2' }),
                        nls('all')),
                    jsx(DropdownItem, { divider: true }),
                    renderFieldListElement())))));
};
export default SearchSetting;
//# sourceMappingURL=search-setting.js.map