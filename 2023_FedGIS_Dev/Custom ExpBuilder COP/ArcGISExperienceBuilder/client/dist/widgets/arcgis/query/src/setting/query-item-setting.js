/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { QueryItemSettingMain } from './query-item-main-mode';
import { QueryItemSettingMapMode } from './query-item-map-mode';
import { QueryItemSettingDataMode } from './query-item-data-mode';
export function QueryItemSetting(props) {
    const { widgetId, index, queryItem, onQueryItemChanged } = props;
    const [viewStage, setViewStage] = React.useState(0);
    React.useEffect(() => {
        if (!(queryItem === null || queryItem === void 0 ? void 0 : queryItem.useDataSource)) {
            setViewStage(0);
        }
    }, [queryItem === null || queryItem === void 0 ? void 0 : queryItem.useDataSource]);
    const handleStageChange = (id) => {
        if (id >= 0) {
            setViewStage(id);
        }
    };
    return (jsx("div", { className: 'h-100' },
        jsx(QueryItemSettingMain, Object.assign({}, props, { visible: viewStage === 0, handleStageChange: handleStageChange })),
        queryItem && (jsx(QueryItemSettingMapMode, { index: index, queryItem: queryItem, visible: viewStage === 1, onQueryItemChanged: onQueryItemChanged, handleStageChange: handleStageChange })),
        queryItem && (jsx(QueryItemSettingDataMode, { index: index, widgetId: widgetId, queryItem: queryItem, visible: viewStage === 2, onQueryItemChanged: onQueryItemChanged, handleStageChange: handleStageChange }))));
}
//# sourceMappingURL=query-item-setting.js.map