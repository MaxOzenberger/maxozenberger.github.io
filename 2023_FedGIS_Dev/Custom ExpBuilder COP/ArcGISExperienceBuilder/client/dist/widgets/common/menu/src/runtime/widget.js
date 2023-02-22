import { React } from 'jimu-core';
import { versionManager } from '../version-manager';
import { MenuNavigation } from './menu-navigation';
const Widget = (props) => {
    const { config } = props;
    return (React.createElement("div", { className: 'widget-menu jimu-widget' },
        React.createElement(MenuNavigation, Object.assign({}, config))));
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map