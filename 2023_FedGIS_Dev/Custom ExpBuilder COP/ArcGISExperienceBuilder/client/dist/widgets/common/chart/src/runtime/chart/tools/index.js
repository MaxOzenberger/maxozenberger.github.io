/** @jsx jsx */
import { React, jsx, css, classNames, getAppStore } from 'jimu-core';
import { DataActionDropDown, hooks } from 'jimu-ui';
import { useChartRuntimeState } from '../../state';
import { SelectionZoom } from './selection-zoom';
import { ActionModes } from 'jimu-ui/advanced/chart';
import { useSourceRecords } from '../components';
const style = css `
  .tool-dividing-line {
    height: 16px;
    width: 1px;
    background-color: var(--light-400);
  }
`;
const Tools = (props) => {
    var _a, _b, _c;
    const { type = 'barSeries', className, widgetId, tools, enableDataAction } = props;
    const translate = hooks.useTranslate();
    const widgetLabel = (_c = (_b = (_a = getAppStore().getState().appConfig.widgets) === null || _a === void 0 ? void 0 : _a[widgetId]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : 'Chart';
    const dataActionLabel = translate('outputStatistics', { name: widgetLabel });
    const { outputDataSource, chart } = useChartRuntimeState();
    const { records } = useSourceRecords(outputDataSource);
    const cursorEnable = tools === null || tools === void 0 ? void 0 : tools.cursorEnable;
    const handleRangeModeChange = (mode) => {
        if (mode === 'selection') {
            chart === null || chart === void 0 ? void 0 : chart.setActionMode(ActionModes.MultiSelectionWithCtrlKey);
        }
        else if (mode === 'zoom') {
            chart === null || chart === void 0 ? void 0 : chart.setActionMode(ActionModes.Zoom);
        }
    };
    const handleClearSelection = () => {
        chart === null || chart === void 0 ? void 0 : chart.clearSelection();
    };
    React.useEffect(() => {
        if (cursorEnable) {
            chart === null || chart === void 0 ? void 0 : chart.setActionMode(ActionModes.MultiSelectionWithCtrlKey);
        }
        else {
            chart === null || chart === void 0 ? void 0 : chart.setActionMode(ActionModes.None);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cursorEnable, chart]);
    return (jsx("div", { css: style, className: classNames('chart-tool-bar w-100 d-flex align-items-center justify-content-end px-2 pt-2', className) },
        cursorEnable && (jsx(SelectionZoom, { type: type, className: 'mr-1', onModeChange: handleRangeModeChange, onClearSelection: handleClearSelection })),
        enableDataAction && (jsx(React.Fragment, null,
            jsx("span", { className: 'tool-dividing-line mx-1' }),
            jsx(DataActionDropDown, { type: 'tertiary', widgetId: widgetId, dataSet: { dataSource: outputDataSource, records: records, name: dataActionLabel } })))));
};
export default Tools;
//# sourceMappingURL=index.js.map