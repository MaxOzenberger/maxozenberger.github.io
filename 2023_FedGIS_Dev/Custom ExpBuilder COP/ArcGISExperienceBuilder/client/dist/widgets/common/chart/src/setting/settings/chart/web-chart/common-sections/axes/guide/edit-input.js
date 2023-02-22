import { classNames, React } from 'jimu-core';
import { styled } from 'jimu-theme';
import { TextInput } from 'jimu-ui';
const Root = styled(TextInput) `
  width: 73%;
  .input-wrapper {
    border: 1px solid transparent;
  }
`;
const EditInput = (props) => {
    const { className, value, onChange } = props;
    const ref = React.useRef(null);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            ref.current.blur();
        }
    };
    return (React.createElement(Root, { className: classNames('edit-input', className), size: 'sm', ref: ref, defaultValue: value, onAcceptValue: onChange, onKeyDown: handleKeyDown }));
};
export default EditInput;
//# sourceMappingURL=edit-input.js.map