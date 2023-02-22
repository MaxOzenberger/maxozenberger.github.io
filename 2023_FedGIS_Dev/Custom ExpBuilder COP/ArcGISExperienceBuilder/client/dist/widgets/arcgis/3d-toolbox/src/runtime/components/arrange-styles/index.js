/** @jsx jsx */
import { React, jsx, Immutable } from 'jimu-core';
import { useTheme } from 'jimu-theme';
import { ArrangementStyle } from '../../../constraints';
import { ListMode } from './list-mode';
import { IconMode } from './icon-mode';
import { getStyle } from './style';
export const ArrangeStyles = React.memo((props) => {
    const theme = useTheme();
    function findToolConfigById(toolID) {
        return Immutable(props.config.tools.find((tool) => (tool.id === toolID)));
    }
    return (jsx("div", { className: 'h-100', css: getStyle(theme) },
        (props.config.arrangement.style === ArrangementStyle.List) &&
            jsx(ListMode, { toolsConfig: props.config.tools, findToolConfigById: findToolConfigById, useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView }),
        (props.config.arrangement.style === ArrangementStyle.Icon) &&
            jsx(IconMode, { direction: props.config.arrangement.direction, toolsConfig: props.config.tools, findToolConfigById: findToolConfigById, useMapWidgetId: props.useMapWidgetId, jimuMapView: props.jimuMapView })));
});
//# sourceMappingURL=index.js.map