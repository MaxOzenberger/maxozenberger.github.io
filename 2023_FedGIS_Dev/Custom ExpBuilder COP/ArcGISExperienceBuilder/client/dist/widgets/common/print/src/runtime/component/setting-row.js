/** @jsx jsx */
import { jsx, css, classNames } from 'jimu-core';
const SettingRow = (props) => {
    const { label, className, children, flowWrap } = props;
    const STYLE = css `
    .title {
      font-size: 14px;
    }
  `;
    return (jsx("div", { className: classNames('mb-2 align-items-center', { className, 'd-flex': !flowWrap }), css: STYLE },
        jsx("div", { className: classNames('title flex-grow-1', { 'mb-2': flowWrap }) }, label),
        children));
};
export default SettingRow;
//# sourceMappingURL=setting-row.js.map