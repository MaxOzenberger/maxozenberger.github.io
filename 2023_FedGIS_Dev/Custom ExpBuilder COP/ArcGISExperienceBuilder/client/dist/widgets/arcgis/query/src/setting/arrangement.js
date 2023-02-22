/** @jsx jsx */
import { jsx, css } from 'jimu-core';
import { hooks, Button, Icon, Switch, Tooltip, ButtonGroup } from 'jimu-ui';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { QueryArrangeType } from '../config';
import { widgetSettingDataMap } from './setting-config';
const { arrangementStyleMap } = widgetSettingDataMap;
const style = css `
  .icon-btn {
    padding: 0;
    &.active {
      outline: 2px solid var(--primary-600) !important;
    }
    img {
      background-color: var(--light-200);
    }
  }
`;
export function Arrangement(props) {
    const { arrangeType, arrangeWrap = false, onArrangeTypeChanged, onArrangeWrapChanged } = props;
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    return (jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('arrangementStyle'), title: getI18nMessage('arrangementStyle'), css: style },
        jsx(SettingRow, { flow: 'wrap' },
            jsx(ButtonGroup, { className: 'w-100 d-flex justify-content-between' }, Object.entries(arrangementStyleMap).map(([arrangementStyleKey, arrangementStyleValue]) => {
                return (jsx(Tooltip, { key: arrangementStyleKey, title: arrangementStyleValue.getTitle(getI18nMessage), placement: 'bottom' },
                    jsx(Button, { onClick: () => onArrangeTypeChanged(arrangementStyleKey), icon: true, size: 'sm', type: 'tertiary', active: arrangeType === arrangementStyleKey, "aria-pressed": arrangeType === arrangementStyleKey },
                        jsx(Icon, { width: 68, height: 68, icon: arrangementStyleValue.icon, autoFlip: true }))));
            }))),
        arrangeType === QueryArrangeType.Inline && (jsx(SettingRow, { label: getI18nMessage('wrapItems') },
            jsx(Switch, { "aria-label": getI18nMessage('wrapItems'), checked: arrangeWrap, onChange: (e) => onArrangeWrapChanged(e.target.checked) })))));
}
//# sourceMappingURL=arrangement.js.map