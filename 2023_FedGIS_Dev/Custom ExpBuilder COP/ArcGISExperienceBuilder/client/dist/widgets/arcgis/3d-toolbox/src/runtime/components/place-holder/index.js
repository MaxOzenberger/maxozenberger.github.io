/** @jsx jsx */
import { React, jsx, classNames } from 'jimu-core';
import { useTheme } from 'jimu-theme';
import { hooks, WidgetPlaceholder, Tooltip, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { ArrangementStyle, ArrangementDirection } from '../../../constraints';
import defaultMessages from '../../translations/default';
import { getStyle } from './style';
import WidgetIcon from '../../../../icon.svg';
export const PlaceHolder = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const theme = useTheme();
    const hint = translate('select3DMapHint');
    const isShowHintFlag = (props.arrangement.style === ArrangementStyle.List);
    const direction = (props.arrangement.direction === ArrangementDirection.Horizontal) ? 'bottom' : 'right';
    return (jsx(React.Fragment, null,
        jsx(Tooltip, { disableHoverListener: isShowHintFlag, disableTouchListener: isShowHintFlag, disableFocusListener: isShowHintFlag, placement: direction, showArrow: true, title: jsx("div", { className: "p-2", style: { background: 'var(--light-200)', border: '1px solid var(--light-800)' } }, hint), arrowStyle: {
                background: 'var(--light-200)',
                border: {
                    color: 'var(--light-800)',
                    width: '1px'
                }
            } },
            jsx("div", { className: classNames('h-100', { 'hide-msg': !isShowHintFlag }), css: getStyle(theme) },
                jsx(WidgetPlaceholder, { widgetId: props.widgetId, icon: WidgetIcon, title: hint, message: isShowHintFlag ? hint : null })))));
});
//# sourceMappingURL=index.js.map