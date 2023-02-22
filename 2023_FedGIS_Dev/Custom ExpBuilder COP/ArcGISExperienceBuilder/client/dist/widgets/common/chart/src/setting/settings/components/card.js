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
import { React, jsx, css, classNames } from 'jimu-core';
import { Icon } from 'jimu-ui';
const useStyle = (vertical) => {
    return React.useMemo(() => {
        return css `
    display: flex;
    flex-direction: ${vertical ? 'column' : 'row'};
    align-items: center;
    cursor: pointer;
    border: 1px solid transparent;
    .wrapper {
      width: ${vertical ? '100%' : '20%'};
      height: ${vertical ? '100%' : '85%'};
      background-color: var(--white);
    }
    label {
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 100%;
      margin-bottom: 0;
    }
    &.active {
      border: 2px solid var(--primary);
    }
  `;
    }, [vertical]);
};
export const Card = (props) => {
    const { vertical = true, label, icon, active, onClick, className } = props, others = __rest(props, ["vertical", "label", "icon", "active", "onClick", "className"]);
    const style = useStyle(vertical);
    return (jsx("div", Object.assign({ className: classNames('template-card', className, { active }), css: style, onClick: onClick }, others),
        jsx(Icon, { className: classNames('wrapper', { 'mx-2': !vertical }), icon: icon }),
        label && jsx("label", { className: classNames({ 'mt-2': vertical }) }, label)));
};
//# sourceMappingURL=card.js.map