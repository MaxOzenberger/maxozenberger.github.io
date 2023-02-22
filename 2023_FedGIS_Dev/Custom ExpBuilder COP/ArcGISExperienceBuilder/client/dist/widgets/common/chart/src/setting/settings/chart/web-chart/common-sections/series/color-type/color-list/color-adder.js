/**@jsx jsx */
import { React, jsx, css, classNames, JimuFieldType } from 'jimu-core';
import { Button, hooks, Label, TextInput, defaultMessages as jimuDefaultMessages, Tooltip } from 'jimu-ui';
import { MinusCircleOutlined } from 'jimu-icons/outlined/editor/minus-circle';
import { PlusCircleOutlined } from 'jimu-icons/outlined/editor/plus-circle';
import defaultMessages from '../../../../../../../translations/default';
const style = css `
  width: 100%;
  display: flex;
  justify-content: flex-end;
  > .editor {
    width: 100%;
    > .top-part {
      width: 100%;
      display: flex;
      justify-content: space-between;
      > .jimu-input {
        width: 88%;
      }
      > .jimu-btn {
        align-self: flex-start;
      }
    }
    > .info-msg {
      color: var(--dark-600);
      width: 88%;
    }
  }
`;
const isNumeric = (value) => /[0-9]+$/mg.test(value);
export const ColorAdder = (props) => {
    const { className, categoryFieldType, validity, onChange } = props;
    const translate = hooks.useTranslate(jimuDefaultMessages, defaultMessages);
    const ref = React.useRef(null);
    const [editable, setEditable] = React.useState(false);
    const [value, setValue] = React.useState('');
    const handleAddClick = () => {
        setEditable(!editable);
        setTimeout(() => {
            var _a;
            (_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        });
    };
    const handlekeyDown = (evt) => {
        if (evt.key === 'Enter') {
            if (categoryFieldType === JimuFieldType.String) {
                const valid = validity(value).valid;
                if (value && valid) {
                    setValue('');
                    onChange === null || onChange === void 0 ? void 0 : onChange(value);
                    setEditable(false);
                }
            }
            else if (categoryFieldType === JimuFieldType.Number) {
                const valid = isNumeric(value.trim());
                if (valid) {
                    setValue('');
                    onChange === null || onChange === void 0 ? void 0 : onChange(+value.trim());
                    setEditable(false);
                }
            }
        }
    };
    const handleCancleClick = () => {
        setValue('');
        setEditable(false);
    };
    return (jsx("div", { className: classNames('color-adder', className), css: style },
        !editable && jsx(Label, { check: true },
            translate('addCategory'),
            jsx(Tooltip, { title: translate('addCategoryTip'), showArrow: true, enterDelay: 300 },
                jsx(Button, { type: 'tertiary', icon: true, className: 'add', size: 'sm', onClick: handleAddClick },
                    jsx(PlusCircleOutlined, { size: 'm' })))),
        editable && jsx("div", { className: 'editor' },
            jsx("div", { className: 'top-part' },
                jsx(TextInput, { ref: ref, size: 'sm', placeholder: translate('categoryName'), value: value, onKeyDown: handlekeyDown, onChange: (e) => setValue(e.target.value), checkValidityOnAccept: validity }),
                jsx(Button, { icon: true, type: 'tertiary', size: 'sm', onClick: handleCancleClick, title: translate('commonModalCancel') },
                    jsx(MinusCircleOutlined, { size: 'm' }))),
            jsx("div", { className: 'info-msg mt-1' }, translate('pressEnter')))));
};
//# sourceMappingURL=color-adder.js.map