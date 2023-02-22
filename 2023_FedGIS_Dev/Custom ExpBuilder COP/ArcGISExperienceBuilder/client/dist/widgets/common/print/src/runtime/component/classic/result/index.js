/** @jsx jsx */
import { jsx, css, polished, classNames } from 'jimu-core';
import { hooks, Button, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import { PrintResultState } from '../../../../config';
import defaultMessage from '../../../translations/default';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { PageOutlined } from 'jimu-icons/outlined/data/page';
import { WrongOutlined } from 'jimu-icons/outlined/suggested/wrong';
const Result = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const STYLE = css `
    & {
      overflow: auto;
      padding: ${polished.rem(16)} ${polished.rem(16)} ${polished.rem(16)} ${polished.rem(16)};
    }
    button {
      padding-left: 0;
      padding-right: 0;
    }
    a {
      padding: 0;
    }
    .print-loading-con {
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
    .error-link, .error-link:hover {
      color: var(--dark);
      & svg {
        color: var(--danger-800);
      }
    }
  `;
    const { printResultList, deleteResultItem } = props;
    const renderLoading = () => {
        return (jsx("div", { className: 'print-loading-con' }));
    };
    const renderResultItemIcon = (item) => {
        switch (item.state) {
            case PrintResultState.Loading:
                return renderLoading();
            case PrintResultState.Success:
                return (jsx(PageOutlined, null));
            case PrintResultState.Error:
                return (jsx("span", { title: nls('uploadImageError') },
                    jsx(WrongOutlined, null)));
        }
    };
    return (jsx("div", { className: 'w-100 h-100', css: STYLE },
        (printResultList === null || printResultList === void 0 ? void 0 : printResultList.length) === 0 && jsx("div", null, nls('resultEmptyMessage')),
        printResultList.map((item, index) => {
            return (jsx("div", { className: 'd-flex align-items-center mb-2 w-100', key: item === null || item === void 0 ? void 0 : item.resultId },
                jsx(Button, { href: item === null || item === void 0 ? void 0 : item.url, disabled: !(item === null || item === void 0 ? void 0 : item.url), target: '_blank', size: 'sm', "aria-label": item === null || item === void 0 ? void 0 : item.title, title: (item === null || item === void 0 ? void 0 : item.state) !== PrintResultState.Error ? item === null || item === void 0 ? void 0 : item.title : '', type: 'tertiary', className: classNames('flex-grow-1 d-flex align-items-center', { 'error-link': (item === null || item === void 0 ? void 0 : item.state) === PrintResultState.Error }) },
                    renderResultItemIcon(item),
                    jsx("div", { className: 'ml-2', title: (item === null || item === void 0 ? void 0 : item.state) === PrintResultState.Error ? item === null || item === void 0 ? void 0 : item.title : '' }, item === null || item === void 0 ? void 0 : item.title)),
                jsx(Button, { size: 'sm', type: 'tertiary', onClick: () => { deleteResultItem(index); }, title: nls('remove') },
                    jsx(CloseOutlined, null))));
        })));
};
export default Result;
//# sourceMappingURL=index.js.map