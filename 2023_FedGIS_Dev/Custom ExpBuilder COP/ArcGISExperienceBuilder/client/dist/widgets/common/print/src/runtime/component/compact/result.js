/** @jsx jsx */
import { jsx, css, classNames } from 'jimu-core';
import { Button, hooks, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { PrintResultState } from '../../../config';
import defaultMessage from '../../translations/default';
import { PageOutlined } from 'jimu-icons/outlined/data/page';
import PrintLoading from '../loading-icon';
import { WrongOutlined } from 'jimu-icons/outlined/suggested/wrong';
const Result = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const { prinResult, restPrint } = props;
    const STYLE = css `
    .error-link, .error-link:hover {
      color: var(--dark);
      & svg {
        color: var(--danger-800);
      }
    }
  `;
    const renderResultItemIcon = () => {
        switch (prinResult === null || prinResult === void 0 ? void 0 : prinResult.state) {
            case PrintResultState.Loading:
                return jsx(PrintLoading, null);
            case PrintResultState.Success:
                return (jsx(PageOutlined, null));
            case PrintResultState.Error:
                return (jsx("span", { title: nls('uploadImageError') },
                    jsx(WrongOutlined, null)));
        }
    };
    return (jsx("div", { className: 'd-flex flex-column h-100 w-100', css: STYLE },
        jsx(Button, { href: prinResult === null || prinResult === void 0 ? void 0 : prinResult.url, disabled: !(prinResult === null || prinResult === void 0 ? void 0 : prinResult.url), target: '_blank', size: 'sm', "aria-label": prinResult === null || prinResult === void 0 ? void 0 : prinResult.title, title: prinResult === null || prinResult === void 0 ? void 0 : prinResult.title, type: 'tertiary', className: classNames('d-flex align-items-center', { 'error-link': (prinResult === null || prinResult === void 0 ? void 0 : prinResult.state) === PrintResultState.Error }) },
            renderResultItemIcon(),
            jsx("div", { className: 'ml-2' }, prinResult === null || prinResult === void 0 ? void 0 : prinResult.title)),
        jsx("div", { className: 'flex-grow-1 d-flex align-items-end' },
            jsx("div", { className: 'flex-grow-1' }),
            jsx(Button, { type: 'primary', onClick: restPrint }, nls('reset')))));
};
export default Result;
//# sourceMappingURL=result.js.map