/**@jsx jsx */
import { React, jsx, css, classNames } from 'jimu-core';
import { AlertPanel, hooks } from 'jimu-ui';
const style = css `
  z-index: 1;
  position: absolute;
  left: 0px;
  bottom: 0px;
  > .left-part {
    max-width: calc(100% - 24px);
  }
  > div:nth-of-type(2) {
    align-self: flex-end;
  }
`;
export const Message = (props) => {
    const { className, text, type = 'info', withIcon = false, onClose } = props;
    const [open, setOpen] = React.useState(!!text);
    const unmountRef = React.useRef(false);
    hooks.useUnmount(() => { unmountRef.current = true; });
    React.useEffect(() => {
        setOpen(!!text);
    }, [text]);
    const handleClose = () => {
        setOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    };
    return (jsx(AlertPanel, { css: style, title: text, type: type, open: open, className: classNames('message w-100', className), withIcon: withIcon, text: text, closable: true, onClose: handleClose }));
};
//# sourceMappingURL=message.js.map