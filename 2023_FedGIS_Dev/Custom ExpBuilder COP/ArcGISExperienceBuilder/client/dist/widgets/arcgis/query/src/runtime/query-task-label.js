/** @jsx jsx */
import { jsx, css } from 'jimu-core';
import { Icon } from 'jimu-ui';
const textStyle = css `
  font-weight: 500;
  font-size: 14px;
`;
export function QueryTaskLabel(props) {
    const { icon, name } = props;
    return (jsx("div", { className: 'd-flex align-items-center text-truncate', css: textStyle },
        icon && jsx(Icon, { className: 'query-task-icon mr-2', icon: icon.svg }),
        jsx("div", { className: 'text-truncate', title: name }, name)));
}
//# sourceMappingURL=query-task-label.js.map