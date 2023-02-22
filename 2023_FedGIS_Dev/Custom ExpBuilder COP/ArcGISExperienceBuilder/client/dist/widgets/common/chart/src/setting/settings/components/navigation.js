import { React, classNames } from 'jimu-core';
import { SettingOutlined } from 'jimu-icons/outlined/application/setting';
import { Button } from 'jimu-ui';
export const Navigation = React.forwardRef((props, ref) => {
    const { level = 3, title, active, onClick, className } = props;
    return (React.createElement("div", { ref: ref, 
        // css={style}
        className: classNames(className, 'navigation w-100 d-flex align-items-center justify-content-between', `setting-text-level-${level}`) },
        React.createElement("span", { className: 'title' }, title),
        React.createElement(Button, { size: 'sm', type: 'tertiary', active: active, icon: true, onClick: onClick },
            React.createElement(SettingOutlined, null))));
});
//# sourceMappingURL=navigation.js.map