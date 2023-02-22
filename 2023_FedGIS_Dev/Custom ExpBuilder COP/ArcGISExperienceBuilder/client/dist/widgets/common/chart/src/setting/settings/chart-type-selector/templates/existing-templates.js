import { React, classNames, DataSourceManager } from 'jimu-core';
import { Card, Message } from '../../components';
import { getChartTitle, getTemplateThumbnail } from './utils';
import checkChartSpec from '../utils/check-chart-spec';
import normalizeChart from '../utils/normalize-chart';
import defaultMessages from '../../../translations/default';
import { styled } from 'jimu-theme';
import { hooks } from 'jimu-ui';
const Root = styled.div `
  height: 100%;
  .templates-cont {
    height: calc(100% - 47px);
    .templates {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 100%;
      grid-auto-rows: 60px;
      height: 100%;
    }
  }
`;
const ExistingTemplates = (props) => {
    const { className, useDataSource, templateId, onChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const dataSourceId = useDataSource === null || useDataSource === void 0 ? void 0 : useDataSource.dataSourceId;
    const [showMessage, setShowMessage] = React.useState(false);
    const charts = React.useMemo(() => {
        var _a;
        const dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId);
        return (_a = dataSource === null || dataSource === void 0 ? void 0 : dataSource.getCharts()) !== null && _a !== void 0 ? _a : [];
    }, [dataSourceId]);
    const handleChange = (template) => {
        const { valid } = checkChartSpec(template, dataSourceId);
        if (valid) {
            const webChart = normalizeChart(template);
            onChange === null || onChange === void 0 ? void 0 : onChange(webChart);
        }
        else {
            setShowMessage(true);
        }
    };
    return (React.createElement(Root, { className: classNames('existing-templates', className) },
        React.createElement("div", { className: 'my-3' }, translate('existingTemplateTip')),
        React.createElement("div", { className: 'templates-cont mw-100' }, !!charts.length && React.createElement("div", { className: 'templates mt-2' }, charts.map((template) => {
            const icon = getTemplateThumbnail(template.series);
            const title = getChartTitle(template);
            return (React.createElement(Card, { key: template.id, vertical: false, title: title, label: title, icon: icon, active: template.id === templateId, onClick: () => handleChange(template) }));
        }))),
        !charts.length && React.createElement("div", { className: 'mt-2' }, "$No charts here."),
        showMessage && React.createElement(Message, { type: 'error', text: translate('unsupportTemplateTip'), onClose: () => setShowMessage(false) })));
};
export default ExistingTemplates;
//# sourceMappingURL=existing-templates.js.map