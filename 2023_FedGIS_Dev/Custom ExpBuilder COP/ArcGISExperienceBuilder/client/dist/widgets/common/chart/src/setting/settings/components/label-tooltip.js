/** @jsx jsx */
import { css, jsx, classNames } from 'jimu-core';
import iconInfo from 'jimu-icons/svg/outlined/suggested/info.svg';
import { useTheme } from 'jimu-theme';
import { Icon, Tooltip } from 'jimu-ui';
const useStyle = () => {
    const theme = useTheme();
    const dark600 = theme === null || theme === void 0 ? void 0 : theme.colors.palette.dark[600];
    const black = theme === null || theme === void 0 ? void 0 : theme.colors.black;
    return css `
    .jimu-icon {
      color: ${dark600};
      &:hover {
        color: ${black};
      }
    }
  `;
};
export const IconTooltip = (props) => {
    const style = useStyle();
    const { className, tooltip = '', icon = iconInfo, showArrow = false } = props;
    return (jsx(Tooltip, { title: tooltip, showArrow: showArrow },
        jsx("div", { css: style, className: classNames('icon-tooltip d-flex align-items-center', className) },
            jsx(Icon, { size: 12, icon: icon }))));
};
export const LabelTooltip = (props) => {
    const { className, label, tooltip = '', icon, showArrow } = props;
    return jsx("div", { className: classNames('label-tooltip d-flex align-items-center', className) },
        jsx("div", { className: 'mr-2 text-truncate', title: label }, label),
        jsx(IconTooltip, { icon: icon, tooltip: tooltip, showArrow: showArrow }));
};
//# sourceMappingURL=label-tooltip.js.map