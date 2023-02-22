/** @jsx jsx */
import { jsx, css, React, lodash, classNames } from 'jimu-core';
import { hooks, Button, Icon, MobilePanel, Popper } from 'jimu-ui';
const popperModifiers = [{ name: 'preventOverflow', options: { padding: 1 } }];
export function TaskListPopperWrapper(props) {
    const { id, icon, label, forceClose, onOpenedChange, popperTitle, minSize, defaultSize, onWidthChange, buttonType = 'tertiary', children } = props;
    const iconRef = React.useRef();
    const widthRef = React.useRef(0);
    const [isOpen, setIsOpen] = React.useState(false);
    const [popperVersion, setPopperVersion] = React.useState(0);
    const isMobile = hooks.useCheckSmallBrowserSzieMode();
    React.useEffect(() => {
        if (forceClose) {
            setIsOpen(false);
        }
    }, [forceClose]);
    hooks.useEffectOnce(() => {
        if (typeof onWidthChange === 'function') {
            widthRef.current = Math.round(iconRef.current.clientWidth);
            onWidthChange(id, widthRef.current);
            const resizeObserver = new ResizeObserver(lodash.throttle((entries) => {
                const width = Math.round(entries[0].contentRect.width);
                if (widthRef.current !== width) {
                    widthRef.current = width;
                    onWidthChange(id, width);
                }
            }, 200));
            resizeObserver.observe(iconRef.current);
            return () => {
                resizeObserver.disconnect();
            };
        }
    });
    const togglePopper = React.useCallback(() => {
        if (typeof onOpenedChange === 'function') {
            onOpenedChange(id, !isOpen);
        }
        setIsOpen(!isOpen);
        setPopperVersion(popperVersion + 1);
    }, [id, isOpen, popperVersion, onOpenedChange]);
    return (jsx("div", { className: 'runtime-query__widget-popper' },
        jsx(Button, { title: label, "aria-label": label, icon: true, size: 'sm', type: buttonType, ref: iconRef, onClick: togglePopper },
            icon && jsx(Icon, Object.assign({ size: 16 }, (typeof icon === 'string' ? { icon, color: '' } : { icon: icon.svg, color: icon.properties.color }))),
            label && jsx("div", { css: css `
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-word;
            word-wrap: break-word;
            line-height: 1.2;
          `, className: classNames({ 'ml-2': icon != null }) }, label)),
        isMobile
            ? jsx(MobilePanel, { open: isOpen, title: popperTitle, toggle: togglePopper }, children)
            : jsx(Popper, { className: 'ui-unit-popper ui-unit-popper_k-arrangement-icon flex-grow-1', floating: true, open: isOpen, onHeaderClose: togglePopper, toggle: togglePopper, headerTitle: popperTitle, minSize: minSize, defaultSize: defaultSize, dragBounds: 'body', version: popperVersion, reference: iconRef.current, placement: 'bottom-start', modifiers: popperModifiers }, children)));
}
//# sourceMappingURL=query-task-list-popper-wrapper.js.map