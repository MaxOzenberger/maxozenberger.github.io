import { React } from 'jimu-core';
import { BaseTool } from '../layout/base/base-tool';
import { MultiSourceMapContext } from '../components/multisourcemap-context';
import { defaultMessages } from 'jimu-ui';
export default class Fullscreen extends BaseTool {
    constructor() {
        super(...arguments);
        this.toolName = 'Fullscreen';
        this.isFullScreen = false;
        this.fullScreenMap = () => { };
        this.getContent = (fullScreenMap, isFullScreen) => {
            this.fullScreenMap = fullScreenMap;
            this.isFullScreen = isFullScreen;
            return super.render();
        };
    }
    getTitle() {
        return this.props.intl.formatMessage({ id: 'FullScreenLabel', defaultMessage: defaultMessages.FullScreenLabel });
    }
    getIcon() {
        return {
            icon: this.isFullScreen ? require('../assets/icons/exit-full-screen.svg') : require('../assets/icons/full-screen.svg'),
            onIconClick: (evt) => {
                this.fullScreenMap();
            }
        };
    }
    getExpandPanel() {
        return null;
    }
    render() {
        return (React.createElement(MultiSourceMapContext.Consumer, null, ({ fullScreenMap, isFullScreen }) => (this.getContent(fullScreenMap, isFullScreen))));
    }
}
//# sourceMappingURL=fullscreen.js.map