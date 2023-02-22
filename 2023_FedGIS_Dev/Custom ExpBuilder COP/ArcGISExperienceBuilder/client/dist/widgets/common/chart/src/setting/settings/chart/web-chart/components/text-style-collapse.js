import { React, classNames } from 'jimu-core';
import { SettingCollapse } from '../../../components';
import { TextSymbolSetting } from './style-setting';
export const TextStyleCollapse = (props) => {
    const { className, open, baseline, toggle, label, value, defaultColor, onChange } = props;
    return (React.createElement("div", { className: classNames('single-text-style', className) },
        React.createElement(SettingCollapse, { label: label, level: 1, isOpen: open, bottomLine: baseline, onRequestClose: () => toggle(false), onRequestOpen: () => toggle(true) },
            React.createElement(TextSymbolSetting, { defaultColor: defaultColor, className: 'mt-2', value: value, onChange: onChange }))));
};
//# sourceMappingURL=text-style-collapse.js.map