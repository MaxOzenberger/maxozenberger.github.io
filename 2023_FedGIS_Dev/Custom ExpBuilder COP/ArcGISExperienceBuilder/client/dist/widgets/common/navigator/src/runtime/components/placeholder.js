import { React } from 'jimu-core';
import { WidgetPlaceholder, hooks } from 'jimu-ui';
import defaultMessages from '../translations/default';
const navigatorIcon = require('jimu-ui/lib/icons/navigator.svg');
export const Palceholder = (props) => {
    const { widgetId, show } = props;
    const translate = hooks.useTranslate(defaultMessages);
    return show
        ? React.createElement(WidgetPlaceholder, { icon: navigatorIcon, widgetId: widgetId, message: translate('widgetPlaceholder') })
        : null;
};
//# sourceMappingURL=placeholder.js.map