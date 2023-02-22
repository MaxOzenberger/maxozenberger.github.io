import { React, classNames } from 'jimu-core';
import { Tabs, Tab } from 'jimu-ui';
import BuildInTemplates, { isBuildInTemplate } from './buildin-templates';
import ExistingTemplates from './existing-templates';
const SHOW_EXISTING_TEMPLATE = false;
const ChartTemplates = (props) => {
    const { className, useDataSources, onChange } = props;
    // Compatible with the modification of scatter chart id
    const templateId = props.templateId === 'scatter-plot' ? 'scatter' : props.templateId;
    const [activeTab, setActiveTab] = React.useState(() => isBuildInTemplate(templateId) ? 'buildin' : 'existing');
    return (React.createElement("div", { className: classNames('chart-templates', className) },
        SHOW_EXISTING_TEMPLATE && React.createElement(Tabs, { fill: true, type: 'pills', value: activeTab, onChange: setActiveTab },
            React.createElement(Tab, { id: 'buildin', title: 'Template' },
                React.createElement(BuildInTemplates, { useDataSource: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0], templateId: templateId, onChange: onChange })),
            React.createElement(Tab, { id: 'existing', title: 'Existing' },
                React.createElement(ExistingTemplates, { useDataSource: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0], templateId: templateId, onChange: onChange }))),
        !SHOW_EXISTING_TEMPLATE && React.createElement(BuildInTemplates, { useDataSource: useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources[0], templateId: templateId, onChange: onChange })));
};
export { getMainTypeTranslation, getTemplateIcon } from './utils';
export default ChartTemplates;
//# sourceMappingURL=index.js.map