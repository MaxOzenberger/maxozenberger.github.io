/**@jsx jsx */
import { React, jsx, css, classNames } from 'jimu-core';
import { AlertPanel, hooks } from 'jimu-ui';
const style = css `
  z-index: 1;
  position: absolute;
  left: 0px;
  bottom: 43px;
  height: 32px;
  > .left-part {
    max-width: calc(100% - 24px);
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
export const Message = (props) => {
    const { className, message, version, delay = 3000 } = props;
    const hoverRef = React.useRef(false);
    const [open, setOpen] = React.useState(false);
    const unmountRef = React.useRef(false);
    hooks.useUnmount(() => { unmountRef.current = true; });
    const handleClose = React.useCallback(() => {
        setTimeout(() => {
            if (unmountRef.current)
                return;
            if (hoverRef.current)
                return;
            setOpen(false);
        }, delay);
    }, [delay]);
    React.useEffect(() => {
        if (!version)
            return;
        setOpen(true);
        handleClose();
    }, [handleClose, version]);
    const handleMouseEnter = () => {
        hoverRef.current = true;
    };
    const handleMouseLeave = () => {
        hoverRef.current = false;
        if (open) {
            handleClose();
        }
    };
    return (jsx(AlertPanel, { css: style, title: message, type: 'info', open: open, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: classNames('message w-100', className), withIcon: true, text: message, closable: true, onClose: () => setOpen(false) }));
};
//# sourceMappingURL=message.js.map