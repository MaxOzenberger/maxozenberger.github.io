import { React, classNames } from 'jimu-core';
import { Button, hooks, Tooltip } from 'jimu-ui';
import { RangeCursorMode } from './range-cursor-mode';
import { TrashCheckOutlined } from 'jimu-icons/outlined/editor/trash-check';
export const SelectionZoom = (props) => {
    const translate = hooks.useTranslate();
    const { type, className, onModeChange, onClearSelection } = props;
    return React.createElement("div", { className: classNames('selection-zoom d-flex', className) },
        React.createElement(RangeCursorMode, { type: type, className: "mr-1", onChange: onModeChange }),
        React.createElement(Tooltip, { title: translate('clearSelection') },
            React.createElement(Button, { size: 'sm', icon: true, type: 'tertiary', onClick: onClearSelection },
                React.createElement(TrashCheckOutlined, null))));
};
//# sourceMappingURL=selection-zoom.js.map