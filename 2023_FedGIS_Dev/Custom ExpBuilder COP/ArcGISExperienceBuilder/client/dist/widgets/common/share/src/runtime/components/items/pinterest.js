/** @jsx jsx */
import { jsx } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import BaseItem, { ExpandType } from './base-item';
import { ItemsName } from '../../../config';
import { ItemBtn } from './subcomps/item-btn';
const IconImage = {
    default: require('./assets/icons/default/pinterest.svg'),
    white: require('./assets/icons/white/pinterest.svg'),
    black: require('./assets/icons/black/pinterest.svg')
};
export class Pinterest extends BaseItem {
    constructor() {
        super(...arguments);
        // https://pinterest.com/pin/create/button/?url={}&media={}&description={}
        this.onClick = (ref) => {
            this.props.onItemClick(ItemsName.Pinterest, ref, ExpandType.BtnRedirect);
            const appTitle = this.getAppTitle() + this.getMsgBy();
            const logoUrl = '/assets/logo.png';
            const origin = window.location.origin; // use the logo deployed in local
            const meadia = origin + logoUrl;
            // const meadia = 'https://experience.arcgis.com/assets/logo.png';
            const url = 'https://pinterest.com/pin/create/button/?' +
                'url=' + encodeURIComponent(this.props.url) +
                '&media=' + encodeURIComponent(meadia) +
                '&description=' + encodeURIComponent(appTitle);
            this.openInNewTab(url);
        };
    }
    render() {
        const pinterestNls = this.props.intl.formatMessage({ id: ItemsName.Pinterest, defaultMessage: defaultMessages.pinterest });
        return (jsx(ItemBtn, { name: ItemsName.Pinterest, intl: this.props.intl, nls: pinterestNls, iconImages: IconImage, attr: this.props, onClick: this.onClick, a11yFocusElement: this.props.a11yFocusElement }));
    }
}
//# sourceMappingURL=pinterest.js.map