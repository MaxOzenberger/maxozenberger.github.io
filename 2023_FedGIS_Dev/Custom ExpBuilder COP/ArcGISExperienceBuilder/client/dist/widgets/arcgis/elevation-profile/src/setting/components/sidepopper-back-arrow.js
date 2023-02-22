/** @jsx jsx */
import { React, css, jsx, polished, defaultMessages as jimuCoreDefaultMessages } from 'jimu-core';
import { Icon, Button, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import defaultMessages from '../translations/default';
import { getConfigIcon } from '../constants';
const { epConfigIcon } = getConfigIcon();
export default class SidepopperBackArrow extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.backRef = React.createRef();
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.backRefFocus = () => {
            setTimeout(() => {
                var _a, _b;
                (_b = (_a = this.backRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
            }, 50);
        };
    }
    getStyle(theme) {
        var _a, _b, _c;
        return css `
      .setting-header {
        padding: ${polished.rem(18)} ${polished.rem(16)} ${polished.rem(0)} ${polished.rem(16)}
      }

      .setting-title {
        font-size: ${polished.rem(16)};
        color: ${(_c = (_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.dark) === null || _c === void 0 ? void 0 : _c[600]}
      }
    `;
    }
    render() {
        return (jsx("div", { tabIndex: -1, className: 'w-100 h-100', css: this.getStyle(this.props.theme) },
            jsx("div", { tabIndex: -1, className: 'w-100 d-flex align-items-center justify-content-between setting-header border-0', style: { height: '38px' } },
                (!this.props.hideBackArrow)
                    ? jsx("div", { tabIndex: -1, className: 'h-100' },
                        jsx("div", { ref: this.backRef, tabIndex: 0, className: 'd-flex align-items-center h-100', style: { cursor: 'pointer' }, onClick: this.props.onBack, onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    this.props.onBack();
                                }
                            } },
                            jsx("div", { className: 'd-flex align-items-center', title: this.nls('backButton'), "aria-label": this.nls('backButton') },
                                jsx(Icon, { icon: epConfigIcon.iconBack, autoFlip: true, size: '14', className: 'text-dark' })),
                            jsx("div", { "aria-label": this.props.title, className: 'pl-2 setting-title', style: { maxWidth: '190px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: this.props.title }, this.props.title)))
                    : jsx("div", { "aria-label": this.props.title, tabIndex: 0, className: 'setting-title mt-1', style: { maxWidth: '190px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: this.props.title }, this.props.title),
                jsx(Button, { role: 'button', "aria-label": this.nls('close'), title: this.nls('close'), size: 'sm', icon: true, type: 'tertiary', onClick: this.props.onClose },
                    jsx(Icon, { icon: epConfigIcon.iconClose, size: '16' }))),
            this.props.children));
    }
}
//# sourceMappingURL=sidepopper-back-arrow.js.map