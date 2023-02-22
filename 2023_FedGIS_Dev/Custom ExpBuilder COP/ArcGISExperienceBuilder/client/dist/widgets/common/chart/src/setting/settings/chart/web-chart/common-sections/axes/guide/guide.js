import { React } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, NumericInput, TextInput, AdvancedButtonGroup, Button } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import GuideCollapse from './collapse';
import { FillSymbolSetting, LineSymbolSetting, TextAlignment, TextAlignments } from '../../../components';
import defaultMessages from '../../../../../../translations/default';
import { DefaultGuideFillColor, DefaultGuideLineColor, DefaultLineColor, getFillSymbol, getLineSymbol } from '../../../../../../../utils/default';
import { parseNumber } from './utils';
import { ArrowDownOutlined } from 'jimu-icons/outlined/directional/arrow-down';
import { ArrowUpOutlined } from 'jimu-icons/outlined/directional/arrow-up';
const Guide = (props) => {
    var _a, _b, _c, _d;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { className, value: propValue, onChange, onDelete, bottomLine, defaultIsOpen, isHorizontal } = props;
    const name = propValue.name;
    const label = (_a = propValue.label.text) !== null && _a !== void 0 ? _a : '';
    const start = propValue.start;
    const end = propValue.end;
    const horizontalAlignment = (_b = propValue.label.horizontalAlignment) !== null && _b !== void 0 ? _b : TextAlignments.horizontalAlignment[2];
    const verticalAlignment = (_c = propValue.label.verticalAlignment) !== null && _c !== void 0 ? _c : TextAlignments.verticalAlignment[2];
    const valid = start != null;
    const isLineType = end == null;
    let style = null;
    if (isLineType) {
        style = propValue.style;
    }
    else {
        style = propValue.style;
    }
    const above = (_d = propValue.above) !== null && _d !== void 0 ? _d : false;
    const handleNameChange = (name) => {
        const value = propValue.set('name', name);
        onChange(value);
    };
    const handleStartChange = (val, evt) => {
        // means it a invalid value
        if (val === null && evt.target.value !== '') {
            return;
        }
        const value = propValue.set('start', parseNumber(val));
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    const handleEndChange = (val, evt) => {
        // means it a invalid value
        if (val === null && evt.target.value !== '') {
            return;
        }
        let value = propValue.set('end', parseNumber(val));
        const isFillType = val != null && val !== '';
        const typeChanged = isLineType === isFillType;
        if (typeChanged) {
            const color = style === null || style === void 0 ? void 0 : style.color;
            if (isFillType) {
                const style = getFillSymbol(color || DefaultGuideFillColor, 0, DefaultLineColor);
                value = value.set('style', style);
                value = value.setIn(['label', 'horizontalAlignment'], 'center')
                    .setIn(['label', 'verticalAlignment'], 'middle');
            }
            else {
                const style = getLineSymbol(1, color || DefaultGuideLineColor);
                value = value.set('style', style);
                const horizontalAlignment = isHorizontal ? 'center' : 'right';
                const verticalAlignment = isHorizontal ? 'top' : 'middle';
                value = value.setIn(['label', 'horizontalAlignment'], horizontalAlignment)
                    .setIn(['label', 'verticalAlignment'], verticalAlignment);
            }
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    const handleStyleChange = (style) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set('style', style));
    };
    const handleLabelTextChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['label', 'text'], value));
    };
    const handleLabelHorizontalAlignChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['label', 'horizontalAlignment'], value));
    };
    const handleLabelVerticalAlignChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.setIn(['label', 'verticalAlignment'], value));
    };
    const handleAboveChange = (above) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(propValue.set('above', above));
    };
    return (React.createElement(GuideCollapse, { className: className, name: name, onChange: handleNameChange, onDelete: onDelete, bottomLine: bottomLine, defaultIsOpen: defaultIsOpen },
        React.createElement("div", { className: 'd-flex align-items-center justify-content-between mt-2 px-1' },
            React.createElement(NumericInput, { size: 'sm', showHandlers: false, defaultValue: start, required: true, style: { width: '40%' }, title: translate('start'), placeholder: translate('start'), onAcceptValue: handleStartChange }),
            React.createElement("span", { className: 'text-truncate' }, translate('to')),
            React.createElement(NumericInput, { disabled: !valid, size: 'sm', showHandlers: false, defaultValue: end, style: { width: '40%' }, title: translate('end'), placeholder: translate('end'), onAcceptValue: handleEndChange })),
        React.createElement("div", { className: 'symbol-setting my-3' },
            !isLineType && React.createElement(FillSymbolSetting, { defaultFillColor: DefaultGuideFillColor, defaultLineColor: DefaultLineColor, value: style, onChange: handleStyleChange }),
            isLineType && React.createElement(LineSymbolSetting, { defaultColor: DefaultGuideLineColor, value: style, onChange: handleStyleChange })),
        React.createElement(SettingRow, { level: 2, label: translate('label'), flow: 'no-wrap', truncateLabel: true },
            React.createElement(TextInput, { size: 'sm', defaultValue: label, className: 'w-50', onAcceptValue: handleLabelTextChange })),
        React.createElement(SettingRow, { truncateLabel: true, level: 2, label: translate('labelAlign'), flow: 'wrap' },
            React.createElement(SettingRow, { truncateLabel: true, level: 3, className: 'horizontal-alignment w-100 mt-2', label: translate('horizontal'), flow: 'no-wrap' },
                React.createElement(TextAlignment, { vertical: false, className: 'w-50', value: horizontalAlignment, onChange: handleLabelHorizontalAlignChange })),
            React.createElement(SettingRow, { truncateLabel: true, level: 3, className: 'vertical-alignment w-100 mt-2', label: translate('vertical'), flow: 'no-wrap' },
                React.createElement(TextAlignment, { vertical: true, className: 'w-50', value: verticalAlignment, onChange: handleLabelVerticalAlignChange }))),
        React.createElement(SettingRow, { level: 2, label: translate('render'), flow: 'no-wrap', truncateLabel: true },
            React.createElement(AdvancedButtonGroup, { size: 'sm' },
                React.createElement(Button, { icon: true, active: !above, title: translate('behindChart'), onClick: () => handleAboveChange(false) },
                    React.createElement(ArrowDownOutlined, null)),
                React.createElement(Button, { icon: true, active: above, title: translate('aboveChart'), onClick: () => handleAboveChange(true) },
                    React.createElement(ArrowUpOutlined, null))))));
};
export default Guide;
//# sourceMappingURL=guide.js.map