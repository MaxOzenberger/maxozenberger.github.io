/** @jsx jsx */
import { jsx, css } from 'jimu-core';
import { defaultMessages, Label, TextInput, Checkbox } from 'jimu-ui';
import BaseItem, { ShownMode, ExpandType } from './base-item';
import nls from '../../translations/default';
import { ItemsName, UiMode } from '../../../config';
import { ItemBtn } from './subcomps/item-btn';
import { CopyBtn } from './subcomps/copy-btn';
// shortLink
import * as ShortLinkUtil from '../short-link';
const IconImage = {
    default: require('./assets/icons/default/sharelink.svg'),
    white: require('./assets/icons/white/sharelink.svg'),
    black: require('./assets/icons/black/sharelink.svg')
};
export class ShareLink extends BaseItem {
    constructor(props) {
        super(props);
        // componentDidMount() {
        //   this.setState({ isShortLink: true });
        //   var urlObj = this.props.updateUrl();
        //   ShortLink.fetchShortLink(urlObj.location).then((shortUrl) => {
        //     this.setState({ url: shortUrl });
        //     this.props.onShortUrlChange(shortUrl);
        //   }, (longUrl) => {
        //     this.setState({ isShortLink: false });
        //   })
        // }
        this.onClickCopy = ( /* { target: { innerHTML } } */) => {
        };
        this.onCopy = (text, result) => {
            var _a;
            if (typeof ((_a = this.props) === null || _a === void 0 ? void 0 : _a.onCopy) === 'function') {
                this.props.onCopy(text, result);
            }
        };
        this.onShortUrlChange = (e) => {
            const url = e.target.value;
            this.setState({ url: url /*, copied: false */ });
            this.props.onShortUrlChange(url);
        };
        this.onClick = (ref) => {
            this.props.onItemClick(ItemsName.Sharelink, ref, ExpandType.ShowInPopup, false);
        };
        this.toggleShortLink = (isChecked) => {
            let href = '';
            const res = this.props.updateUrl();
            if (res) {
                href = res;
            }
            // console.log('is ShortLink click==>' + isChecked);
            this.setState({ isShortLink: isChecked });
            if (isChecked) {
                ShortLinkUtil.fetchShortLink(href).then((shortUrl) => {
                    this.setState({ url: shortUrl });
                    this.props.onShortUrlChange(shortUrl);
                }, (longUrl) => {
                    this.setState({ isShortLink: false });
                });
            }
            else {
                this.setState({ url: href });
                this.props.onLongUrlChange(href); // let other's itme use longURL
            }
        };
        this.getStyle = () => {
            return css `
      .short-link-wapper {
        margin-bottom: 1rem;
      }

      .share-link-input {
        border: none;
      }
      .share-link-group {
        margin: 10px 0 18px 0;
      }

      .short-link-label {
        margin: 0 0.5rem;
      }
    `;
        };
        // this.init(ItemsName.Sharelink, '#35465C', ExpandType.ShowInPopup);
        this.state = {
            url: this.props.url || '',
            isShortLink: !(this.props.url === this.props.longUrl)
        };
    }
    render() {
        let content = null;
        const { shownMode } = this.props;
        const titleNls = this.props.intl.formatMessage({ id: 'link' /*ItemsName.Sharelink*/, defaultMessage: defaultMessages.link /*defaultMessages.sharelink*/ });
        const shortLinkNls = this.props.intl.formatMessage({ id: 'shortLink', defaultMessage: nls.shortLink });
        if (shownMode !== ShownMode.Btn) {
            content = (jsx("div", { css: this.getCommonStyle() },
                jsx("div", { css: this.getStyle() },
                    jsx("div", { className: 'share-inputs-wrapper share-link-group d-flex justify-content-between align-items-center' },
                        jsx(TextInput, { name: 'text', className: 'share-link-input d-flex w-100', value: this.state.url, onChange: this.onShortUrlChange }),
                        jsx(CopyBtn, { text: this.state.url, onCopy: this.onCopy })),
                    jsx("div", { className: 'd-flex justify-content-between short-link-wapper' },
                        jsx(Label, { className: 'd-flex align-items-center' },
                            jsx(Checkbox, { checked: this.state.isShortLink, onChange: evt => this.toggleShortLink(evt.target.checked) }),
                            jsx("span", { className: 'mx-2' }, shortLinkNls))),
                    this.props.uiMode === UiMode.Popup &&
                        jsx("div", { className: 'separator-line' }))));
        }
        else {
            content = (jsx("div", { css: this.getStyle() },
                jsx(ItemBtn, { name: ItemsName.Sharelink, intl: this.props.intl, nls: titleNls, iconImages: IconImage, attr: this.props, onClick: this.onClick, a11yFocusElement: this.props.a11yFocusElement, a11yIsBtnHaspopup: true })));
        }
        return content;
    }
}
//# sourceMappingURL=sharelink.js.map