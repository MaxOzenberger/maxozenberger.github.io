/** @jsx jsx */
import { React, jsx, useIntl } from 'jimu-core';
import { Button, Checkbox, Label } from 'jimu-ui';
import { FlyItemMode } from '../../config';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import nls from '../translations/default';
// resources
import { RoutePointOutlined } from 'jimu-icons/outlined/gis/route-point';
import { AlongPathOutlined } from 'jimu-icons/outlined/gis/along-path';
import { RouteOutlined } from 'jimu-icons/outlined/directional/route';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
const { useEffect } = React;
export const ItemMode = (props) => {
    const intl = useIntl();
    const { styleConfig, idx, flyModesUICollapseMap } = props;
    const isInUse = styleConfig.isInUse;
    const flyItemMode = styleConfig.name;
    const isUICollapse = flyModesUICollapseMap.getIn([String(idx)]);
    // collapse/unCollapse related to flyMode checkbox ,#6635
    useEffect(() => {
        let isUICollapse = true;
        if (!isInUse) {
            isUICollapse = true;
        }
        else {
            isUICollapse = false;
        }
        props.handleToggleFlyModesUICollapse(idx, isUICollapse);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInUse]);
    // innner funs
    const handleFlyModesChange = (event, idx) => {
        event.stopPropagation();
        props.handleFlyModesChange(!isInUse, idx);
    };
    const handleToggleFlyModesUICollapse = (isUICollapse, idx, event) => {
        event.stopPropagation();
        props.handleToggleFlyModesUICollapse(idx, !isUICollapse);
    };
    const getIcon = (mode) => {
        switch (mode) {
            case FlyItemMode.Rotate: {
                return jsx(RoutePointOutlined, { size: 'm' });
            }
            case FlyItemMode.Path: {
                return jsx(AlongPathOutlined, { size: 'm' });
            }
            case FlyItemMode.Route: {
                return jsx(RouteOutlined, { size: 'm' });
            }
            default: break;
        }
    };
    const getLabel = (mode) => {
        switch (mode) {
            case FlyItemMode.Rotate: {
                return intl.formatMessage({ id: 'flyStyleRotate', defaultMessage: nls.flyStyleRotate });
            }
            case FlyItemMode.Path: {
                return intl.formatMessage({ id: 'flyStylePath', defaultMessage: nls.flyStylePath });
            }
            case FlyItemMode.Route: {
                return intl.formatMessage({ id: 'flyStyleRecord', defaultMessage: nls.flyStyleRecord });
            }
            default: break;
        }
    };
    // renders
    const modeIcon = getIcon(flyItemMode);
    const label = getLabel(flyItemMode);
    const arrowIcon = (isUICollapse ? jsx(DownOutlined, { size: 's' }) : jsx(UpOutlined, { size: 's' }));
    return (jsx(SettingRow, { className: 'd-flex align-items-center justify-content-between' },
        jsx("div", { className: 'd-flex align-items-center', style: { cursor: 'pointer' }, onClick: evt => handleFlyModesChange(evt, idx) },
            jsx(Checkbox, { checked: isInUse }),
            jsx(Label, { style: { cursor: 'pointer' } },
                jsx("div", { className: 'm-2' }, modeIcon),
                label)),
        jsx(Button, { icon: true, disabled: !isInUse, style: { backgroundColor: 'transparent', border: 'none' }, onClick: evt => handleToggleFlyModesUICollapse(isUICollapse, idx, evt) }, arrowIcon)));
};
//# sourceMappingURL=item-mode.js.map