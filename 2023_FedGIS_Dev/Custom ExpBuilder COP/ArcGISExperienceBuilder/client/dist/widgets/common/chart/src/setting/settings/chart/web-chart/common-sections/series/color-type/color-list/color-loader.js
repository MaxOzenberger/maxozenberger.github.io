import { React, classNames } from 'jimu-core';
import { LoadOutlined } from 'jimu-icons/outlined/editor/load';
import { Button, hooks, Tooltip } from 'jimu-ui';
import defaultMessages from '../../../../../../../translations/default';
import { Message } from './message';
const NumberPerLoads = 10;
export const ColorLoader = (props) => {
    const { className, loadSlices, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const [version, setVersion] = React.useState(0);
    const meessageRef = React.useRef('loadout');
    const message = meessageRef.current === 'loadout' ? translate('categoriesLatest') : translate('manyDistinctValues');
    const unmountRef = React.useRef(false);
    hooks.useUnmount(() => { unmountRef.current = true; });
    const handleLoadClick = () => {
        loadSlices(NumberPerLoads).then(({ value: slices, loadout, exceed }) => {
            if (unmountRef.current)
                return;
            onChange === null || onChange === void 0 ? void 0 : onChange(slices);
            if (loadout || exceed) {
                meessageRef.current = exceed ? 'exceed' : 'loadout';
                setVersion(v => v + 1);
            }
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: translate('loadMoreCategory'), showArrow: true, enterDelay: 300 },
            React.createElement(Button, { className: classNames('color-loader', className), size: 'sm', icon: true, onClick: handleLoadClick },
                React.createElement(LoadOutlined, { size: 'm' }))),
        React.createElement(Message, { version: version, message: message })));
};
//# sourceMappingURL=color-loader.js.map