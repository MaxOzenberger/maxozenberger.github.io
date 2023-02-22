var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/** @jsx jsx */
import { React, css, jsx, classNames, polished } from 'jimu-core';
import { Button, Icon, Tooltip } from 'jimu-ui';
import { WIDGET_ITEM_SIZES } from '../../common/consts';
export const LABEL_HEIGHT = 21;
export const getItemLength = (buttonSize, showLabel, shape) => {
    let size = WIDGET_ITEM_SIZES[buttonSize];
    if (showLabel) {
        size = size + LABEL_HEIGHT;
    }
    const padding = calcPadding(buttonSize, shape);
    size = size + padding * 2;
    return size;
};
const calcPadding = (buttonSize, shape) => {
    const circle = shape === 'circle';
    if (!circle)
        return 6;
    if (buttonSize === 'sm')
        return 4;
    if (buttonSize === 'default')
        return 2;
    if (buttonSize === 'lg')
        return 0;
};
const useStyle = (size, showLabel, shape, labelGrowth) => {
    return React.useMemo(() => {
        const length = getItemLength(size, showLabel, shape);
        const width = length + labelGrowth;
        const padding = calcPadding(size, shape);
        return css `
      display: flex;
      align-items:center;
      flex-direction: column;
      justify-content: ${showLabel ? 'space-around' : 'center'};
      width: ${polished.rem(width)} !important;
      height: ${polished.rem(length)};
      .tool-drag-handler {
        cursor: auto;
      }
      .avatar {
        padding: ${padding}px;
        position: relative;
        text-align: center;
        .marker {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-btn-sizer {
            min-width: .625rem;
            min-height: .625rem;
          }
        }
      }
      .avatar-label {
        text-align: center;
        width: 100%;
        min-height: ${polished.rem(21)};
        cursor: default;
      }
    `;
    }, [size, showLabel, shape, labelGrowth]);
};
export const AvatarCard = React.forwardRef((props, ref) => {
    var _a;
    const { label, className, title, showLabel, showTooltip = true, labelGrowth = 0, icon, marker, onMarkerClick, avatar, autoFlip, active, editDraggable, disabled } = props, others = __rest(props, ["label", "className", "title", "showLabel", "showTooltip", "labelGrowth", "icon", "marker", "onMarkerClick", "avatar", "autoFlip", "active", "editDraggable", "disabled"]);
    const _b = avatar || {}, { shape, style } = _b, buttonProps = __rest(_b, ["shape", "style"]);
    const size = buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.size;
    const [hovered, setHovered] = React.useState(null);
    const cssStyle = useStyle(size, showLabel, shape, labelGrowth);
    const avatarButton = jsx(Button, Object.assign({ icon: true, active: active, disabled: disabled, className: "avatar-button", ref: ref }, buttonProps, { style: Object.assign({ borderRadius: shape === 'circle' ? '50%' : undefined }, style) }),
        jsx(Icon, { color: typeof icon !== 'string' && ((_a = icon.properties) === null || _a === void 0 ? void 0 : _a.color), icon: typeof icon !== 'string' ? icon.svg : icon, autoFlip: autoFlip }));
    return (jsx("div", Object.assign({}, others, { className: classNames('avatar-card', `${className} avatar-card`), css: cssStyle }),
        jsx("div", { className: classNames({ 'no-drag-action': !editDraggable }, 'avatar tool-drag-handler'), onMouseEnter: () => { setHovered(true); }, onMouseLeave: () => { setHovered(false); } },
            marker && hovered &&
                jsx(Button, { className: "marker", size: "sm", icon: true, onClick: onMarkerClick },
                    jsx(Icon, { size: 8, icon: marker })),
            showTooltip ? jsx(Tooltip, { title: title || label, style: { pointerEvents: 'none' } }, avatarButton) : avatarButton),
        showLabel &&
            jsx("div", { className: classNames('avatar-label text-truncate', { active }) }, label)));
});
//# sourceMappingURL=avatar-card.js.map