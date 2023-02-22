/** @jsx jsx */
import { css, jsx, classNames } from 'jimu-core';
import { Icon, Tooltip, Button } from 'jimu-ui';
import infoOutlined from 'jimu-icons/svg/outlined/suggested/info.svg';
import { useTheme } from 'jimu-theme';
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
    const { className, tooltip = '', icon = infoOutlined } = props;
    return (jsx(Tooltip, { title: tooltip },
        jsx(Button, { icon: true, size: 'sm', type: 'tertiary', css: style, className: classNames('icon-tooltip d-flex align-items-center', className) },
            jsx(Icon, { icon: icon }))));
};
export const LabelTooltip = (props) => {
    const { className, label, tooltip = '', icon } = props;
    return jsx("div", { className: classNames('label-tooltip d-flex align-items-center', className) },
        jsx("div", { className: 'text-truncate', title: label }, label),
        jsx(IconTooltip, { icon: icon, tooltip: tooltip }));
};
//# sourceMappingURL=label-tooltip.js.map