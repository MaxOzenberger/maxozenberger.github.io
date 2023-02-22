import { React, classNames } from 'jimu-core';
import { TextInput, hooks, defaultMessages as jimuiDefaultMessage, Switch } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../../../../../translations/default';
import { LabelFormatSetting, TextAlignment, TextAlignments } from '../../components';
import { styled } from 'jimu-theme';
const Root = styled.div `
  .label-alignment .jimu-widget-setting--row-label {
    color: var(--dark-400);
  }
`;
export const CategoryAxis = (props) => {
    var _a, _b, _c, _d;
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { className, axis, isHorizontal, onChange } = props;
    const titleText = (_b = (_a = axis.title.content) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
    const valueFormat = axis.valueFormat;
    const showGrid = ((_c = axis.grid) === null || _c === void 0 ? void 0 : _c.width) > 0;
    const alignmentName = isHorizontal ? 'horizontalAlignment' : 'verticalAlignment';
    const alignments = TextAlignments[alignmentName];
    const alignment = (_d = axis === null || axis === void 0 ? void 0 : axis.labels.content[alignmentName]) !== null && _d !== void 0 ? _d : alignments[2];
    const handleTitleTextChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('title', axis.title.set('visible', value !== '').setIn(['content', 'text'], value)));
    };
    const handleValueFormatChange = (value) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.set('valueFormat', value));
    };
    const handleShowGridChange = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.setIn(['grid', 'width'], showGrid ? 0 : 1));
    };
    const handleAlignmentChange = (alignment) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(axis.setIn(['labels', 'content', alignmentName], alignment));
    };
    return (React.createElement(Root, { className: classNames('category-axis w-100', className) },
        React.createElement(SettingRow, { label: translate('axisTitle'), flow: 'wrap', level: 2 },
            React.createElement(TextInput, { size: 'sm', defaultValue: titleText, className: 'w-100', onAcceptValue: handleTitleTextChange })),
        React.createElement(SettingRow, { label: translate('axisLabel'), flow: 'wrap', level: 2 },
            React.createElement(React.Fragment, null,
                React.createElement(LabelFormatSetting, { value: valueFormat, onChange: handleValueFormatChange }),
                React.createElement(SettingRow, { truncateLabel: true, className: 'label-alignment w-100 mt-2', label: translate('alignment'), flow: 'no-wrap' },
                    React.createElement(TextAlignment, { vertical: !isHorizontal, className: 'w-50', value: alignment, onChange: handleAlignmentChange })))),
        React.createElement(SettingRow, { label: translate('axisGrid'), level: 2 },
            React.createElement(Switch, { checked: showGrid, onChange: handleShowGridChange }))));
};
//# sourceMappingURL=category-axis.js.map