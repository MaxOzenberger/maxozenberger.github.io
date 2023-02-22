import { React, classNames } from 'jimu-core';
import { ZoomInOutlined } from 'jimu-icons/outlined/editor/zoom-in';
import { Button, hooks, Tooltip } from 'jimu-ui';
import { SelectRectangleOutlined } from 'jimu-icons/outlined/gis/select-rectangle';
import { isXYChart } from '../../../utils/default';
export const RangeCursorMode = (props) => {
    const translate = hooks.useTranslate();
    const [mode, setMode] = React.useState('selection');
    const { type = 'barSeries', className, onChange } = props;
    const handleSelectionClick = () => {
        if (type === 'pieSeries')
            return;
        onChange('selection');
        setMode('selection');
    };
    const handleZoomClick = () => {
        onChange('zoom');
        setMode('zoom');
    };
    return React.createElement("div", { className: classNames('range-cursor-mode', className) },
        React.createElement(Tooltip, { title: translate('SelectLabel') },
            React.createElement(Button, { size: 'sm', className: "mr-1", icon: true, type: 'tertiary', onClick: handleSelectionClick, active: mode === 'selection' },
                React.createElement(SelectRectangleOutlined, null))),
        isXYChart(type) && React.createElement(Tooltip, { title: translate('ZoomLabel') },
            React.createElement(Button, { size: 'sm', icon: true, type: 'tertiary', onClick: handleZoomClick, active: mode === 'zoom' },
                React.createElement(ZoomInOutlined, null))));
};
//# sourceMappingURL=range-cursor-mode.js.map