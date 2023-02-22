/** @jsx jsx */
import { css, jsx, polished, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { ArrangementStyle } from '../../config';
import { hooks, Icon, Button, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { useTheme } from 'jimu-theme';
const ArrangementStyleSetting = (props) => {
    const theme = useTheme();
    const STYLE = css `
    .active {
      .style-img {
        border: 2px solid ${theme.colors.primary};
      }
    }
    .style-img {
      border: 1px solid ${theme.colors.palette.light[500]}
    }
    & button {
      width: ${polished.rem(108)};
      height: ${polished.rem(80)};
      padding: 0;
    }
  `;
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage, jimuCoreDefaultMessage);
    const { config, id, onSettingChange } = props;
    const { arrangementStyle } = config;
    const onArrangementStyleChange = (style) => {
        onSettingChange({
            id: id,
            config: config.set('arrangementStyle', style)
        });
    };
    return (jsx(SettingSection, { title: nls('arrangementStyle') },
        jsx(SettingRow, null,
            jsx("div", { className: 'd-flex justify-content-between w-100', css: STYLE },
                jsx(Button, { type: 'tertiary', className: arrangementStyle === ArrangementStyle.Style1 ? 'active' : '', onClick: () => { onArrangementStyleChange(ArrangementStyle.Style1); } },
                    jsx(Icon, { className: 'style-img w-100 h-100', icon: require('../assets/style1.png') })),
                jsx(Button, { type: 'tertiary', className: arrangementStyle === ArrangementStyle.Style2 ? 'active' : '', onClick: () => { onArrangementStyleChange(ArrangementStyle.Style2); } },
                    jsx(Icon, { className: 'style-img w-100 h-100', icon: require('../assets/style2.png') }))))));
};
export default ArrangementStyleSetting;
//# sourceMappingURL=arrangement-style.js.map