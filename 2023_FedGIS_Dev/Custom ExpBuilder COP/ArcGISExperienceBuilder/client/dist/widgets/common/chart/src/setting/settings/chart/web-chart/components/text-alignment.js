import { classNames, React } from 'jimu-core';
import { hooks, Select } from 'jimu-ui';
export const TextAlignments = {
    verticalAlignment: ['baseline', 'top', 'middle', 'bottom'],
    horizontalAlignment: ['left', 'right', 'center', 'justify']
};
export const getCorrespondingAlignment = (alignment) => {
    let index = TextAlignments.horizontalAlignment.indexOf(alignment);
    if (index > -1) {
        return TextAlignments.verticalAlignment[index];
    }
    else {
        index = TextAlignments.verticalAlignment.indexOf(alignment);
        if (index > -1) {
            return TextAlignments.horizontalAlignment[index];
        }
    }
};
export const TextAlignment = (props) => {
    const { className, vertical, value, onChange } = props;
    const translate = hooks.useTranslate();
    const alignments = vertical ? TextAlignments.verticalAlignment : TextAlignments.horizontalAlignment;
    const handleChange = (evt) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(evt.target.value);
    };
    return (React.createElement(Select, { size: 'sm', className: classNames('text-aligment', className), value: value, onChange: handleChange }, alignments.map(alignment => (React.createElement("option", { key: alignment, value: alignment }, translate(alignment))))));
};
//# sourceMappingURL=text-alignment.js.map