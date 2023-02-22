import { React, classNames } from 'jimu-core';
import { withRnd } from 'jimu-layouts/layout-builder';
import { WidgetAvatarCard } from '../../common';
const WidgetRndAvatarCard = withRnd(false)(WidgetAvatarCard);
export const LayoutItem = (props) => {
    const { className, draggable, layoutId, layoutItem, onClick, label, showLabel, showTooltip, labelGrowth, markerEnabled, avatar, active, removeWidget } = props;
    return (React.createElement(WidgetRndAvatarCard, { className: classNames(className, 'layout-item', 'align-items-center'), layoutId: layoutId, layoutItem: layoutItem, widgetid: layoutItem.widgetId, layoutItemId: layoutItem.id, label: label, markerEnabled: markerEnabled, showLabel: showLabel, showTooltip: showTooltip, labelGrowth: labelGrowth, avatar: avatar, active: active, editDraggable: draggable, useDragHandler: true, onClick: onClick, onMarkerClick: () => removeWidget(layoutItem.widgetId) }));
};
//# sourceMappingURL=layout-item.js.map