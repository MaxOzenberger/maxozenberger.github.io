import { React, ReactRedux, lodash, MessageManager, DataRecordsSelectionChangeMessage } from 'jimu-core';
import { SelectionSource } from 'jimu-ui/advanced/chart';
import { hooks } from 'jimu-ui';
const arrange = (num) => {
    const arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(i);
    }
    return arr;
};
/**
 * Get selection indexes by the selected id from data source.
 * @param selectedIds
 * @param seriesLength
 */
const getSelectionIndexes = (selectedIds, seriesLength = 1) => {
    const selectionIds = selectedIds.filter(id => id).map(id => +id);
    const indexes = (selectionIds === null || selectionIds === void 0 ? void 0 : selectionIds.length) ? selectionIds : [];
    const selectionIndexes = new Map();
    arrange(seriesLength).forEach((_, idx) => {
        selectionIndexes.set(idx, { indexesToSelect: indexes });
    });
    return selectionIndexes;
};
/**
 * Get all selected indexs from `SelectionIndexes` of chart component.
 * @param selectionIndexes
 */
const getAllSelectionIndexes = (selectionIndexes) => {
    let indexs = [];
    selectionIndexes === null || selectionIndexes === void 0 ? void 0 : selectionIndexes.forEach((serie) => {
        indexs = indexs.concat(serie.indexesToSelect);
    });
    return Array.from(new Set(indexs.sort()));
};
/**
 * Keep the selection of chart and output data source, publish message when selection changes.
 * @param widgetId
 * @param outputDataSource
 * @param dataItems
 * @param seriesLength
 */
const useSelection = (widgetId, outputDataSource, seriesLength) => {
    const preSelectedIdsRef = React.useRef();
    const handleSelectionChange = hooks.useEventCallback((e) => {
        var _a;
        const sourceRecords = outputDataSource === null || outputDataSource === void 0 ? void 0 : outputDataSource.getSourceRecords();
        if (!(sourceRecords === null || sourceRecords === void 0 ? void 0 : sourceRecords.length))
            return;
        const selectedIndexs = (_a = getAllSelectionIndexes(e.detail.selectionIndexes)) !== null && _a !== void 0 ? _a : [];
        const selectedIds = selectedIndexs.map(index => index + '');
        const selectionSource = e.detail.selectionSource;
        // Only trigger selection change message if selection source is from the user operation
        const selectionByUser = selectionSource === SelectionSource.SelectionByClickOrRange ||
            selectionSource === SelectionSource.ClearSelection;
        if (!selectionByUser)
            return;
        let selectedRecords = [];
        if (selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.length) {
            selectedRecords = sourceRecords.filter(record => {
                const id = record.getId();
                return selectedIds.includes(id);
            });
        }
        preSelectedIdsRef.current = selectedIds;
        //Publish records selection change message
        MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(widgetId, selectedRecords));
        outputDataSource.selectRecordsByIds(selectedIds);
    });
    const originalSelectedIds = ReactRedux.useSelector((state) => { var _a, _b; return (_b = (_a = state.dataSourcesInfo) === null || _a === void 0 ? void 0 : _a[outputDataSource === null || outputDataSource === void 0 ? void 0 : outputDataSource.id]) === null || _b === void 0 ? void 0 : _b.selectedIds; });
    const [selectionIndexes, setSelectionIndexes] = React.useState();
    React.useEffect(() => {
        if (!originalSelectedIds)
            return;
        const mutableSelectionIds = originalSelectedIds.asMutable();
        // if the selected ids is same as the current selected ids, just return.
        if (lodash.isDeepEqual(mutableSelectionIds, preSelectedIdsRef.current))
            return;
        preSelectedIdsRef.current = mutableSelectionIds;
        const selectionIndexes = getSelectionIndexes(mutableSelectionIds, seriesLength);
        setSelectionIndexes(selectionIndexes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalSelectedIds]);
    const selectionData = React.useMemo(() => ({ selectionIndexes }), [selectionIndexes]);
    return [selectionData, handleSelectionChange];
};
export default useSelection;
//# sourceMappingURL=use-selection.js.map