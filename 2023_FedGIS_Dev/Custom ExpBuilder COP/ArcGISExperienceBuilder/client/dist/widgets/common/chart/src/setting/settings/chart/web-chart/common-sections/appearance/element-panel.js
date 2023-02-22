import { React } from 'jimu-core';
import { SidePopper } from 'jimu-ui/advanced/setting-components';
import { Navigation } from '../../../../components';
export const ElementPanel = (props) => {
    const { level, label, title, children } = props;
    const ref = React.useRef(null);
    const [active, setActive] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Navigation, { ref: ref, className: 'mt-2', level: level, active: active, title: label, onClick: () => setActive(!active) }),
        React.createElement(SidePopper, { title: title, isOpen: active, position: "right", toggle: () => setActive(false), trigger: ref === null || ref === void 0 ? void 0 : ref.current }, children)));
};
//# sourceMappingURL=element-panel.js.map