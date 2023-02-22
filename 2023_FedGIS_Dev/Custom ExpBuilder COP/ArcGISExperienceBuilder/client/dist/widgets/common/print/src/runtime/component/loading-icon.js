/** @jsx jsx */
import { css, jsx, polished } from 'jimu-core';
const PrintLoading = (props) => {
    const STYLE = css `
    &.print-loading-con {
      @keyframes loading {
        0% {transform: rotate(0deg); };
        100% {transform: rotate(360deg)};
      }
      width: ${polished.rem(16)};
      height: ${polished.rem(16)};
      border: 1px solid var(--dark-100);
      border-radius: 50%;
      border-top: 1px solid var(--dark-800);
      box-sizing: border-box;
      animation:loading 2s infinite linear;
      margin-right: ${polished.rem(4)};
    }
  `;
    return (jsx("div", { css: STYLE, className: 'print-loading-con' }));
};
export default PrintLoading;
//# sourceMappingURL=loading-icon.js.map