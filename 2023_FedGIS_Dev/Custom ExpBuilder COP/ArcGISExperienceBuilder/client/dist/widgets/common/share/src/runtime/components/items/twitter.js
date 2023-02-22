/** @jsx jsx */
import { jsx } from 'jimu-core';
import { defaultMessages } from 'jimu-ui';
import BaseItem, { ExpandType } from './base-item';
import { ItemsName } from '../../../config';
import { ItemBtn } from './subcomps/item-btn';
const IconImage = {
    default: require('./assets/icons/default/twitter.svg'),
    white: require('./assets/icons/white/twitter.svg'),
    black: require('./assets/icons/black/twitter.svg')
};
export class Twitter extends BaseItem {
    constructor() {
        // constructor(props) {
        //   super(props);
        //   this.init(ItemsName.Twitter, '#1DA1F2', ExpandType.BtnRedirect);
        // }
        super(...arguments);
        // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
        this.onClick = (ref) => {
            this.props.onItemClick(ItemsName.Twitter, ref, ExpandType.BtnRedirect);
            const appTitle = this.getAppTitle() + this.getMsgBy();
            const atAccount = ' @ArcGISOnline \n';
            const url = 'https://twitter.com/intent/tweet?text=' + appTitle + atAccount +
                '&url=' + encodeURIComponent(this.props.url) + '&related=';
            this.openInNewTab(url);
        };
    }
    render() {
        const twitterNls = this.props.intl.formatMessage({ id: ItemsName.Twitter, defaultMessage: defaultMessages.twitter });
        return (jsx(ItemBtn, { name: ItemsName.Twitter, intl: this.props.intl, nls: twitterNls, iconImages: IconImage, attr: this.props, onClick: this.onClick, a11yFocusElement: this.props.a11yFocusElement }));
    }
}
//# sourceMappingURL=twitter.js.map