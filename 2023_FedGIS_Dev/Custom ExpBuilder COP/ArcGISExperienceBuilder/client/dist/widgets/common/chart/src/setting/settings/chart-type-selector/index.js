/** @jsx jsx */
import { React, css, jsx, polished } from 'jimu-core';
import { Button, hooks, defaultMessages as jimuiDefaultMessage, Icon } from 'jimu-ui';
import defaultMessages from '../../translations/default';
import { SidePopper } from 'jimu-ui/advanced/setting-components';
import Templates, { getMainTypeTranslation, getTemplateIcon } from './templates';
import { useTheme } from 'jimu-theme';
import completeChart from './utils/complete-chart';
const useStyle = () => {
    var _a, _b, _c, _d;
    const theme = useTheme();
    const dark100 = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette.dark[100];
    const dark400 = (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.palette.dark[400];
    const primary700 = (_c = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _c === void 0 ? void 0 : _c.palette.primary[700];
    const primary800 = (_d = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _d === void 0 ? void 0 : _d.palette.primary[800];
    return React.useMemo(() => css `
    button.btn-link {
      height: ${polished.rem(32)};
      line-height: ${polished.rem(32)};
      padding: 0;
      border: 1px dashed ${dark100};
      border-radius: ${polished.rem(2)};
      cursor: pointer;
      color: ${primary700};
      font-size: ${polished.rem(14)};
      text-decoration: none;
      font-weight: 500;
      &:hover{
        border-color: ${dark400};
        color: ${primary800};
      }
    }`, [dark100, dark400, primary700, primary800]);
};
const ChartTypeSelector = (props) => {
    const { templateId, webChart, useDataSources, onChange } = props;
    const style = useStyle();
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const [open, setOpen] = React.useState(false);
    const [templateIcon, templateLabel] = React.useMemo(() => {
        if (!templateId)
            return [];
        const icon = getTemplateIcon(webChart.series);
        const label = translate(getMainTypeTranslation(webChart.series));
        return [icon, label];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateId]);
    const ref = React.useRef(null);
    const handleChange = (template) => {
        const webChart = completeChart(template);
        onChange === null || onChange === void 0 ? void 0 : onChange(template.id, webChart);
        setOpen(false);
    };
    return (jsx(React.Fragment, null,
        jsx("div", { className: "chart-type-selector w-100", css: style, ref: ref },
            !templateId && jsx(Button, { className: 'w-100', type: 'link', onClick: () => setOpen(v => !v) }, translate('selectChart')),
            templateId && jsx(Button, { type: 'default', title: templateLabel, className: 'w-100 text-left pl-2 pr-2', onClick: () => setOpen(v => !v) },
                jsx(Icon, { icon: templateIcon }),
                templateLabel)),
        jsx(SidePopper, { isOpen: open, position: "right", toggle: () => setOpen(false), trigger: ref === null || ref === void 0 ? void 0 : ref.current, title: translate('chartType') },
            jsx(Templates, { className: 'px-3', useDataSources: useDataSources, templateId: templateId, onChange: handleChange }))));
};
export * from './templates/buildin-templates';
export default ChartTypeSelector;
//# sourceMappingURL=index.js.map