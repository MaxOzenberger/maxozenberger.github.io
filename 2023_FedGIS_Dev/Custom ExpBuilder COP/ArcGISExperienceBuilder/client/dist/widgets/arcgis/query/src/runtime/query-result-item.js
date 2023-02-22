/** @jsx jsx */
import { React, ReactRedux, jsx, css, MessageManager, DataRecordsSelectionChangeMessage, classNames } from 'jimu-core';
import FeatureInfo from './components/feature-info';
import { ListDirection } from '../config';
const style = css `
  overflow: auto;
  flex-flow: row;
  cursor: pointer;
  flex-shrink: 0;
  min-height: 2rem;
  &.selected {
    .feature-info-component {
      border-color: var(--primary-500);
      border-width: 2px;
    }
  }
`;
export const QueryResultItem = (props) => {
    const { widgetId, data, dataSource, popupTemplate, expandByDefault = false } = props;
    const selected = ReactRedux.useSelector((state) => { var _a, _b, _c; return (_c = (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[dataSource.id]) === null || _b === void 0 ? void 0 : _b.selectedIds) === null || _c === void 0 ? void 0 : _c.includes(data.getId()); });
    const isVerticalAlign = ReactRedux.useSelector((state) => {
        const widgetJson = state.appConfig.widgets[widgetId];
        return widgetJson.config.resultListDirection !== ListDirection.Horizontal;
    });
    const handleClickResultItem = React.useCallback(() => {
        var _a, _b;
        const dataItemRecordId = data.getId();
        const nextSelectedDataItems = ((_a = dataSource.getSelectedRecordIds()) !== null && _a !== void 0 ? _a : []).includes(dataItemRecordId) ? [] : [data];
        MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(widgetId, nextSelectedDataItems));
        (_b = dataSource.selectRecordsByIds) === null || _b === void 0 ? void 0 : _b.call(dataSource, nextSelectedDataItems.map((item) => item.getId()));
    }, [widgetId, data, dataSource]);
    return (jsx("div", { className: classNames('query-result-item', { selected }), onClick: handleClickResultItem, css: style, role: 'option', "aria-selected": selected },
        jsx(FeatureInfo, { graphic: data.feature, popupTemplate: popupTemplate, togglable: isVerticalAlign, expandByDefault: expandByDefault, dataSource: dataSource })));
};
//# sourceMappingURL=query-result-item.js.map