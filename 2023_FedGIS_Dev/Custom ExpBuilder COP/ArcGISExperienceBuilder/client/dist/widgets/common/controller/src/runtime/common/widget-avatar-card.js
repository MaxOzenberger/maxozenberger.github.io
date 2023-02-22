import { React, ReactRedux } from 'jimu-core';
import { AvatarCard } from './avatar-card';
import { Loading } from 'jimu-ui';
import closeOutlined from 'jimu-icons/svg/outlined/editor/close.svg';
export const WidgetAvatarCard = (props) => {
    var _a, _b;
    const { markerEnabled, onMarkerClick, widgetid, showLabel, showTooltip, labelGrowth, avatar, onClick, active, editDraggable, className } = props;
    const widgetJson = ReactRedux.useSelector((state) => { var _a; return (_a = state.appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetid]; });
    const result = widgetJson
        ? (React.createElement(AvatarCard, { "data-widgetid": widgetid, className: `widget-avatar-card ${className}`, showLabel: showLabel, showTooltip: showTooltip, labelGrowth: labelGrowth, avatar: avatar, label: widgetJson.label, icon: widgetJson.icon, autoFlip: (_b = (_a = widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.manifest) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.flipIcon, marker: markerEnabled ? closeOutlined : '', active: active, editDraggable: editDraggable, onMarkerClick: onMarkerClick, onClick: onClick }))
        : React.createElement(Loading, null);
    return result;
};
//# sourceMappingURL=widget-avatar-card.js.map