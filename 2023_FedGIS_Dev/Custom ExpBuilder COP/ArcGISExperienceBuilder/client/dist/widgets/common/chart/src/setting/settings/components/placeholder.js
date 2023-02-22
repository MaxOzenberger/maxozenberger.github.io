import { React } from 'jimu-core';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
import { styled } from 'jimu-theme';
const Root = styled.div `
  overflow: hidden;
  height: calc(100% - 102px);
  .jimu-icon {
    color: var(--dark-200);
  }
  p {
    color: var(--dark-500);
  }
`;
export const Placeholder = ({ placeholder, messageId }) => {
    return (React.createElement(Root, { className: 'placeholder d-flex flex-column align-items-center justify-content-center p-3' },
        React.createElement("div", { className: 'd-flex flex-column align-items-center' },
            React.createElement(ClickOutlined, { size: 48 }),
            React.createElement("p", { className: 'mt-3 text-center', id: messageId }, placeholder))));
};
//# sourceMappingURL=placeholder.js.map