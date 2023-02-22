/** @jsx jsx */
import { jsx } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import BaseItem, { ExpandType } from './base-item';
import { ItemsName } from '../../../config';
import { ItemBtn } from './subcomps/item-btn';
const IconImage = {
    default: require('./assets/icons/default/linkedin.svg'),
    white: require('./assets/icons/white/linkedin.svg'),
    black: require('./assets/icons/black/linkedin.svg')
};
export class Linkedin extends BaseItem {
    constructor() {
        super(...arguments);
        // https://www.linkedin.com/shareArticle?mini=true&url={}&title={}&summary={}&source={}
        this.onClick = (ref) => {
            this.props.onItemClick(ItemsName.Linkedin, ref, ExpandType.BtnRedirect);
            const appTitle = this.props.getAppTitle();
            const by = this.getMsgBy();
            const url = 'https://www.linkedin.com/sharing/share-offsite/?' +
                'url=' + this.props.url +
                '&title=' + appTitle +
                '&summary=' + by +
                '&source=' + appTitle;
            this.openInNewTab(url);
        };
    }
    render() {
        const linkedinNls = this.props.intl.formatMessage({ id: ItemsName.Linkedin, defaultMessage: defaultMessages.linkedin });
        return (jsx(ItemBtn, { name: ItemsName.Linkedin, intl: this.props.intl, nls: linkedinNls, iconImages: IconImage, attr: this.props, onClick: this.onClick, a11yFocusElement: this.props.a11yFocusElement }));
    }
}
//# sourceMappingURL=linkedin.js.map