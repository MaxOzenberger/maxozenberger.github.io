import { React, classNames } from 'jimu-core';
import { SettingCollapse } from '../../../components';
import { LineSymbolSetting } from './style-setting';
export const LineStyleCollapse = (props) => {
    const { className, open, baseline, toggle, label, value, defaultColor, onChange } = props;
    return (React.createElement("div", { className: classNames('single-line-style', className) },
        React.createElement(SettingCollapse, { label: label, level: 1, isOpen: open, bottomLine: baseline, onRequestClose: () => toggle(false), onRequestOpen: () => toggle(true) },
            React.createElement(LineSymbolSetting, { defaultColor: defaultColor, className: 'mt-2', value: value, onChange: onChange }))));
};
//# sourceMappingURL=line-style-collapse.js.map