/** @jsx jsx */
import { jsx, DataSourceComponent } from 'jimu-core';
import { hooks, TextInput, Icon, Switch, Collapse, Button, TextArea } from 'jimu-ui';
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components';
import defaultMessages from './translations/default';
import { widgetSettingDataMap } from './setting-config';
import { DEFAULT_QUERY_ITEM } from '../default-query-item';
const { iconMap } = widgetSettingDataMap;
export function SpatialFilterSetting(props) {
    const { queryItem, handleStageChange, onPropertyChanged } = props;
    const currentItem = Object.assign({}, DEFAULT_QUERY_ITEM, queryItem);
    const getI18nMessage = hooks.useTranslate(defaultMessages);
    const enabled = currentItem.useSpatialFilter;
    const handleLabelChanged = (prop, value, defaultValue) => {
        if (value === defaultValue) {
            onPropertyChanged(prop, null);
        }
        else {
            onPropertyChanged(prop, value);
        }
    };
    const titleCompoent = (jsx("div", { className: 'd-flex' },
        jsx("div", null, getI18nMessage('spatialFilter')),
        jsx("div", { className: 'ml-auto' },
            jsx(Switch, { checked: enabled, onChange: (e) => onPropertyChanged('useSpatialFilter', e.target.checked) }))));
    return (jsx(DataSourceComponent, { useDataSource: currentItem.useDataSource }, (ds) => {
        var _a;
        // check if ds has geometryType
        if (ds.getGeometryType() == null) {
            return null;
        }
        return (jsx(SettingSection, { role: 'group', "aria-label": getI18nMessage('spatialFilter'), title: titleCompoent },
            jsx(Collapse, { isOpen: enabled },
                jsx(SettingRow, { flow: 'wrap', label: getI18nMessage('label') },
                    jsx(TextInput, { "aria-label": getI18nMessage('label'), className: 'w-100', size: 'sm', defaultValue: (_a = currentItem.spatialFilterLabel) !== null && _a !== void 0 ? _a : getI18nMessage('spatialFilter'), onAcceptValue: (value) => handleLabelChanged('spatialFilterLabel', value, getI18nMessage('spatialFilter')) })),
                jsx(SettingRow, { role: 'group', "aria-label": getI18nMessage('typesOfFilter'), flow: 'wrap', label: getI18nMessage('typesOfFilter') },
                    jsx("div", { className: 'setting-ui-unit-check-input-item w-100 d-flex align-items-center' },
                        jsx("label", { className: 'setting-ui-unit-check-input-label my-1' },
                            jsx("span", { id: 'queryItemDataMode' }, getI18nMessage('featureFromDs'))),
                        jsx(Button, { "aria-describedby": 'queryItemDataMode', className: 'ml-auto', size: 'sm', type: 'tertiary', icon: true, onClick: (e) => handleStageChange(2, e) },
                            jsx(Icon, { size: 16, icon: iconMap.arrowRight, autoFlip: true }))),
                    jsx("div", { className: 'setting-ui-unit-check-input-item w-100 d-flex align-items-center' },
                        jsx("label", { className: 'setting-ui-unit-check-input-label my-1' },
                            jsx("span", { id: 'queryItemMapMode' }, getI18nMessage('featureFromMap'))),
                        jsx(Button, { "aria-describedby": 'queryItemMapMode', className: 'ml-auto', size: 'sm', type: 'tertiary', icon: true, onClick: (e) => handleStageChange(1, e) },
                            jsx(Icon, { size: 16, icon: iconMap.arrowRight, autoFlip: true })))),
                jsx(SettingRow, { label: getI18nMessage('description'), flow: 'wrap' },
                    jsx(TextArea, { "aria-label": getI18nMessage('description'), height: 80, defaultValue: currentItem.spatialFilterDesc, placeholder: getI18nMessage('describeTheFilter'), onAcceptValue: (value) => onPropertyChanged('spatialFilterDesc', value) })))));
    }));
}
//# sourceMappingURL=spatial-filter.js.map