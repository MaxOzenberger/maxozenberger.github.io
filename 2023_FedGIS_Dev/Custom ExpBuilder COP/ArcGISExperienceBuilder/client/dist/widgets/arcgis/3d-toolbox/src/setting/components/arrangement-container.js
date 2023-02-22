/** @jsx jsx */
import { React, jsx, classNames } from 'jimu-core';
import { hooks, Label, Button, Icon, defaultMessages as jimuUIMessages } from 'jimu-ui';
import { SettingRow, SettingSection, DirectionSelector } from 'jimu-ui/advanced/setting-components';
import defaultMessages from '../translations/default';
import { ArrangementStyle, ArrangementDirection } from '../../constraints';
export const ArrangementContainer = React.memo((props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuUIMessages);
    const _onChange = props.onChange;
    const handleArrangementStyleChange = React.useCallback((arrangementStyle) => {
        _onChange(Object.assign(Object.assign({}, props.arrangement), { style: arrangementStyle }));
    }, [_onChange, props.arrangement]);
    const handleArrangementDirectionChange = React.useCallback((vertical) => {
        _onChange(Object.assign(Object.assign({}, props.arrangement), { direction: vertical ? ArrangementDirection.Vertical : ArrangementDirection.Horizontal }));
    }, [_onChange, props.arrangement]);
    const arrangementTips = translate('arrangementStyle');
    const a11yDescriptionId = props.widgetId + '-uimode-description';
    const a11yUIMode0Id = props.widgetId + '-uimode-0';
    const a11yUIMode1Id = props.widgetId + '-uimode-1';
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { title: arrangementTips },
            jsx(SettingRow, null,
                jsx("div", { className: 'ui-mode-card-chooser' },
                    jsx(Label, { className: 'd-flex flex-column ui-mode-card-wapper' },
                        jsx(Button, { icon: true, className: classNames('ui-mode-card', { active: (props.arrangement.style === ArrangementStyle.List) }), onClick: () => handleArrangementStyleChange(ArrangementStyle.List), "aria-labelledby": a11yUIMode0Id, "aria-describedby": a11yDescriptionId },
                            jsx(Icon, { width: 92, height: 56, icon: require('../assets/arrangements/style0.svg'), autoFlip: true })),
                        jsx("div", { id: a11yUIMode0Id, className: 'mx-1 text-break ui-mode-label' }, translate('listMode'))),
                    jsx("div", { className: 'ui-mode-card-separator' }),
                    jsx(Label, { className: 'd-flex flex-column ui-mode-card-wapper' },
                        jsx(Button, { icon: true, className: classNames('ui-mode-card', { active: (props.arrangement.style === ArrangementStyle.Icon) }), onClick: () => handleArrangementStyleChange(ArrangementStyle.Icon), "aria-labelledby": a11yUIMode1Id, "aria-describedby": a11yDescriptionId },
                            jsx(Icon, { width: 92, height: 56, icon: require('../assets/arrangements/style1.svg'), autoFlip: true })),
                        jsx("div", { id: a11yUIMode1Id, className: 'mx-1 text-break ui-mode-label' }, translate('iconMode')))))),
        (props.arrangement.style === ArrangementStyle.Icon) && jsx(SettingSection, null,
            jsx(SettingRow, { label: translate('direction') },
                jsx(DirectionSelector, { vertical: props.arrangement.direction === ArrangementDirection.Vertical, onChange: handleArrangementDirectionChange })))));
});
//# sourceMappingURL=arrangement-container.js.map