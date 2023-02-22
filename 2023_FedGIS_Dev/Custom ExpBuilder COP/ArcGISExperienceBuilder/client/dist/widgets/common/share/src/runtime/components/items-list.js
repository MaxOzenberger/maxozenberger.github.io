/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { UiMode, InlineDirection, ItemsName } from '../../config';
// items
import { ShownMode } from './items/base-item';
import { ShareLink } from './items/sharelink';
import { QRCode } from './items/qr-code';
import { Facebook } from './items/facebook';
import { Twitter } from './items/twitter';
import { Email } from './items/email';
import { Embed } from './items/embed';
import { Pinterest } from './items/pinterest';
import { Linkedin } from './items/linkedin';
export class ItemsList extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.getElementByItemId = (id) => {
            let itemUI = null;
            const { url, longUrl, uiMode, theme, intl, config, isShowInModal, onItemClick, updateUrl, onLongUrlChange, onShortUrlChange, getAppTitle } = this.props;
            const shownMode = ShownMode.Btn;
            switch (id) {
                case ItemsName.Embed: {
                    itemUI = (jsx(Embed, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.QRcode: {
                    itemUI = (jsx(QRCode, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Sharelink: {
                    itemUI = (jsx(ShareLink, { url: url, longUrl: longUrl, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, onShortUrlChange: onShortUrlChange, onLongUrlChange: onLongUrlChange, updateUrl: updateUrl, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Email: {
                    itemUI = (jsx(Email, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Facebook: {
                    itemUI = (jsx(Facebook, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Twitter: {
                    itemUI = (jsx(Twitter, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Pinterest: {
                    itemUI = (jsx(Pinterest, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                case ItemsName.Linkedin: {
                    itemUI = (jsx(Linkedin, { url: url, uiMode: uiMode, shownMode: shownMode, isShowInModal: isShowInModal, config: config, theme: theme, intl: intl, onItemClick: onItemClick, getAppTitle: getAppTitle, a11yFocusElement: this.props.a11yFocusElement }));
                    break;
                }
                default: {
                    itemUI = null;
                    break;
                }
            }
            return itemUI;
        };
        this._getDirClassName = (dir, isPopup) => {
            if (isPopup) {
                dir = InlineDirection.Horizontal;
            }
            if (dir) {
                return 'dir-' + dir.toLowerCase();
            }
            else {
                return '';
            }
        };
        this.getStyle = () => {
            const theme = this.props.theme;
            return css `
      .dir-horizontal{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
      }

      .dir-vertical{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
      }

      .item-wapper {
        margin: 0.5rem;
        max-width: 100px;
      }
      .share-item {
        /*flex-basis: max-content;
        flex-basis: 130px;*/
      }

      .label-in-btn{
        color: ${theme.colors.light}
      }
      .label-outof-btn{
        width: 100%;
        max-width: 100px;
        margin: 0.25rem;
        font-size: 0.8rem;
        color: ${theme.colors.black};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        font-weight: ${(parseInt(theme.body.fontWeight) + 100)};
      }
    `;
        };
    }
    render() {
        const { config, uiMode } = this.props;
        const isPopup = (uiMode === UiMode.Popup);
        const itemListImmutable = isPopup ? config.popup.items : config.inline.items;
        const itemList = itemListImmutable.asMutable();
        const dir = config.inline.design.direction;
        const dirKlass = this._getDirClassName(dir, isPopup);
        return (jsx("div", { css: this.getStyle() },
            jsx("div", { className: dirKlass }, itemList.map((item, idx) => {
                const { id, enable } = item;
                if (enable) {
                    return (jsx("div", { key: 'key-' + idx, className: 'item-wapper' }, this.getElementByItemId(id)));
                }
                else {
                    return null;
                }
            }))));
    }
}
//# sourceMappingURL=items-list.js.map