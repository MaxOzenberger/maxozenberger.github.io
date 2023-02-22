/** @jsx jsx */
import { React, jsx, classNames, Immutable, i18n, MessageManager, DataRecordsSelectionChangeMessage } from 'jimu-core';
import { hooks, Icon, Dropdown, DropdownMenu, DropdownItem, DropdownButton } from 'jimu-ui';
import { SearchServiceType } from '../../config';
import defaultMessage from '../translations/default';
import { getDatasourceConfigItemByConfigId, getJsonLength, getDatasource, loadAllDsRecord, getResultPopperOffset } from '../utils/utils';
import { useTheme } from 'jimu-theme';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
import { getStyle, dropdownStyle } from '../style/popper-style';
const { useEffect, useRef } = React;
const ResultList = (props) => {
    const nls = hooks.useTranslate(defaultMessage);
    const { reference, searchText, id, config, serviceList, isOpentResultListDefault, setResultFirstItem, handleDsIdOfSelectedResultItemChange } = props;
    const { resultMaxNumber } = config;
    const selectedRecordKey = useRef([]);
    const isDataLoaded = useRef(false);
    const dropdownMenuRef = useRef(null);
    const isHasSetFirstItem = useRef(false);
    let firstRecord = {};
    const theme = useTheme();
    const [displayRecord, setDisplayRecord] = React.useState(Immutable({}));
    const [displayRecords, setDisplayRecords] = React.useState({});
    const [activeButtonKey, setActiveButtonKey] = React.useState(null);
    const [isShowResultList, setIsShowResultList] = React.useState(isOpentResultListDefault);
    const [isHasAutoSelectFirstRecord, setDsHasAutoSelectFirstRecord] = React.useState(false);
    const [version, setVersion] = React.useState(0);
    useEffect(() => {
        loadRecords();
        // eslint-disable-next-line
    }, [serviceList]);
    useEffect(() => {
        selectedRecordKey.current = [];
    }, [searchText]);
    /**
     * Load records by outputDatasource
    */
    const loadRecords = () => {
        isDataLoaded.current = false;
        const serviceRecords = loadAllDsRecord(serviceList === null || serviceList === void 0 ? void 0 : serviceList.asMutable({ deep: true }), resultMaxNumber, id);
        Promise.all([serviceRecords]).then(res => {
            isDataLoaded.current = true;
            let newDisplayRecord = displayRecord || Immutable({});
            let allResponse = [];
            res === null || res === void 0 ? void 0 : res.forEach(resItem => {
                allResponse = allResponse.concat(resItem);
            });
            const newDisplayRecords = {};
            allResponse.forEach(dsResult => {
                const { records, configId, dsId, isGeocodeRecords } = dsResult;
                newDisplayRecords[configId] = records;
                const disPlayData = getDisplayRecords(records, configId, dsId, isGeocodeRecords);
                newDisplayRecord = newDisplayRecord.setIn([configId], disPlayData);
            });
            setDisplayRecords(newDisplayRecords);
            setDisplayRecord(newDisplayRecord);
            setVersion(version + 1);
            autoSelectFirstRecord();
            onSelectedRecordChange();
        });
    };
    /**
     * Render result list
    */
    const renderResultList = () => {
        var _a, _b;
        const recordElementdata = [];
        isHasSetFirstItem.current = null;
        for (const configId in displayRecord) {
            const displayItem = (_a = displayRecord === null || displayRecord === void 0 ? void 0 : displayRecord.asMutable({ deep: true })) === null || _a === void 0 ? void 0 : _a[configId];
            const datasourceConfigItem = getDatasourceConfigItemByConfigId(config, configId);
            const label = datasourceConfigItem === null || datasourceConfigItem === void 0 ? void 0 : datasourceConfigItem.label;
            const icon = datasourceConfigItem === null || datasourceConfigItem === void 0 ? void 0 : datasourceConfigItem.icon;
            const currentOutputNumber = getJsonLength(serviceList);
            const list = (jsx("div", { key: `${configId}_${label}_con`, role: 'group', "aria-label": label }, displayItem.length > 0 && jsx("div", null,
                currentOutputNumber > 1 &&
                    jsx(DropdownItem, { className: 'source-label-con', disabled: true, key: `${configId}_${label}`, title: label },
                        icon && jsx(Icon, { className: 'mr-2', color: (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.primary, size: 16, icon: icon === null || icon === void 0 ? void 0 : icon.svg }),
                        label),
                renderResultItem(displayItem, checkIsShowPadding()))));
            recordElementdata.push(list);
        }
        return recordElementdata;
    };
    const checkIsShowPadding = () => {
        var _a;
        const currentOutputNumber = getJsonLength(serviceList);
        if (currentOutputNumber < 2) {
            return false;
        }
        // The total number of icons
        let iconNumber = 0;
        //when only one source has records, and the ds item has an icon, padding should also be added
        let numberOfSourceWithRecordsAndIcon = 0;
        for (const configId in displayRecord) {
            const datasourceConfigItem = getDatasourceConfigItemByConfigId(config, configId);
            const icon = datasourceConfigItem === null || datasourceConfigItem === void 0 ? void 0 : datasourceConfigItem.icon;
            if (icon) {
                iconNumber += 1;
            }
            if (((_a = displayRecord[configId]) === null || _a === void 0 ? void 0 : _a.length) > 0 && icon) {
                numberOfSourceWithRecordsAndIcon += 1;
            }
        }
        return numberOfSourceWithRecordsAndIcon > 0 && iconNumber > 0;
    };
    /**
     * Render result item
    */
    const renderResultItem = (displayData, isShowPadding = false) => {
        return displayData === null || displayData === void 0 ? void 0 : displayData.map((displayDataItem, index) => {
            var _a, _b;
            const { configId, value, recordId, outputDsId } = displayDataItem;
            const key = getItemKey(configId, recordId);
            const isSelected = activeButtonKey === key;
            const datasourceConfigItem = getDatasourceConfigItemByConfigId(config, configId);
            const icon = datasourceConfigItem === null || datasourceConfigItem === void 0 ? void 0 : datasourceConfigItem.icon;
            const iconColor = isSelected ? (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.white : (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.primary;
            const currentOutputNumber = getJsonLength(serviceList);
            return (jsx(DropdownItem, { className: classNames('d-flex align-items-center', { 'item-p-l': isShowPadding }), key: key, active: isSelected, title: value.join(', '), ref: ref => { setFirstItemRef(index, ref); }, onClick: () => {
                    onSelectRecord({
                        isActive: isSelected,
                        key: key,
                        recordId: recordId,
                        dsId: outputDsId,
                        configId: configId
                    });
                } },
                (icon && currentOutputNumber === 1) && jsx(Icon, { className: 'mr-2', color: iconColor, size: 16, icon: icon === null || icon === void 0 ? void 0 : icon.svg }),
                jsx("div", null, value.join(', '))));
        });
    };
    const setFirstItemRef = (index, ref) => {
        if (index === 0 && !isHasSetFirstItem.current) {
            setResultFirstItem(ref);
            isHasSetFirstItem.current = true;
        }
    };
    /**
     * Select record after ds selected records changed
    */
    const onSelectedRecordChange = () => {
        var _a;
        if (isNoResult())
            return;
        const newSelectedRecordsKey = [];
        for (const configId in serviceList) {
            const serviceItem = serviceList[configId];
            const isGeocodeService = (serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.searchServiceType) === SearchServiceType.GeocodeService;
            const dsId = isGeocodeService ? serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.outputDataSourceId : (_a = serviceItem === null || serviceItem === void 0 ? void 0 : serviceItem.useDataSource) === null || _a === void 0 ? void 0 : _a.dataSourceId;
            const key = getDsSelectRecordsKeyItemByDsId(dsId, configId);
            key && newSelectedRecordsKey.push(key);
        }
        const newSelectedRecordsKeyList = getNewSelectedRecordKey(newSelectedRecordsKey, selectedRecordKey === null || selectedRecordKey === void 0 ? void 0 : selectedRecordKey.current);
        selectedRecordKey.current = newSelectedRecordsKey;
        if (newSelectedRecordsKeyList && newSelectedRecordsKeyList[0]) {
            setActiveButtonKey(newSelectedRecordsKeyList[0]);
        }
        else {
            setActiveButtonKey(null);
        }
    };
    const getDsSelectRecordsKeyItemByDsId = (dsId, configId) => {
        var _a;
        const ds = getDatasource(dsId);
        const selectRecords = ds.getSelectedRecords();
        const selectedRecordId = (_a = selectRecords === null || selectRecords === void 0 ? void 0 : selectRecords[0]) === null || _a === void 0 ? void 0 : _a.getId();
        if (!selectRecords || !selectedRecordId) {
            return null;
        }
        const selectedRecordKey = getItemKey(configId, selectedRecordId);
        return selectedRecordKey;
    };
    /**
     * Get key of new selected records by newSelectedKey andoldSelectedKey
    */
    const getNewSelectedRecordKey = (newSelectedKey, oldSelectedKey) => {
        if ((newSelectedKey === null || newSelectedKey === void 0 ? void 0 : newSelectedKey.length) > (oldSelectedKey === null || oldSelectedKey === void 0 ? void 0 : oldSelectedKey.length)) {
            return newSelectedKey.concat(oldSelectedKey).filter(key => !newSelectedKey.includes(key) || !oldSelectedKey.includes(key)) || [];
        }
        else {
            return newSelectedKey || [];
        }
    };
    const onSelectRecord = (option) => {
        const { isActive, recordId, dsId, configId } = option;
        const ds = getDatasource(dsId);
        //Publish message action
        const records = !isActive ? getRecordsByRecordsId(configId, recordId) : [];
        MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(id, records));
        handleDsIdOfSelectedResultItemChange(recordId ? dsId : null);
        if (recordId) {
            !isActive ? ds.selectRecordsByIds([recordId]) : ds.selectRecordsByIds([]);
            !isActive && clearOtherDsSlectedRecords(configId);
        }
    };
    const clearOtherDsSlectedRecords = (currentSelectConfigId) => {
        var _a, _b;
        for (const configId in displayRecord) {
            if (currentSelectConfigId === configId) {
                continue;
            }
            else {
                const dsId = (_b = (_a = displayRecord[configId]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.outputDsId;
                const ds = getDatasource(dsId);
                ds && ds.selectRecordsByIds([]);
            }
        }
    };
    const getRecordsByRecordsId = (configId, recordId) => {
        const records = (displayRecords === null || displayRecords === void 0 ? void 0 : displayRecords[configId]) || [];
        const fieldRecord = records === null || records === void 0 ? void 0 : records.filter(record => (record === null || record === void 0 ? void 0 : record.getId()) === recordId);
        return fieldRecord || [];
    };
    /**
     * Get display record list by field name
    */
    const getDisplayRecords = (records, configId, dsId, isGeocodeRecords) => {
        var _a;
        const displayFields = ((_a = serviceList === null || serviceList === void 0 ? void 0 : serviceList[configId]) === null || _a === void 0 ? void 0 : _a.displayFields) || [];
        const displayRecordItem = [];
        const intl = i18n.getIntl();
        records === null || records === void 0 ? void 0 : records.forEach(record => {
            const valueData = [];
            displayFields.forEach(field => {
                const fieldValue = record.getFormattedFieldValue(field.jimuName, intl);
                const isAvailable = fieldValue || fieldValue === 0;
                isAvailable && valueData.push(fieldValue);
            });
            const displayRecord = {
                value: valueData,
                configId: configId,
                outputDsId: dsId,
                recordId: record === null || record === void 0 ? void 0 : record.getId()
            };
            displayRecordItem.push(displayRecord);
            initFirstRecord(displayRecord);
        });
        return displayRecordItem;
    };
    const initFirstRecord = (displayItem) => {
        if (!(firstRecord === null || firstRecord === void 0 ? void 0 : firstRecord.recordId) && displayItem.recordId) {
            firstRecord = displayItem;
        }
    };
    /**
     * Get key of record item element
    */
    const getItemKey = (configId, recordId) => {
        return `${configId}_${recordId}`;
    };
    /**
     * Auto select first result
    */
    const autoSelectFirstRecord = () => {
        if (!(config === null || config === void 0 ? void 0 : config.isAutoSelectFirstResult) || !(firstRecord === null || firstRecord === void 0 ? void 0 : firstRecord.recordId) || isHasAutoSelectFirstRecord)
            return;
        const { configId, recordId, outputDsId } = firstRecord;
        const firstRecordKey = getItemKey(configId, recordId);
        onSelectRecord({
            isActive: false,
            key: firstRecordKey,
            recordId: recordId,
            dsId: outputDsId,
            configId: configId
        });
        setDsHasAutoSelectFirstRecord(true);
    };
    const onShowResultButtonclick = () => {
        setIsShowResultList(!isShowResultList);
        setVersion(version + 1);
    };
    const isNoResult = () => {
        var _a;
        let recordLength = 0;
        for (const configId in displayRecord) {
            const length = ((_a = displayRecord === null || displayRecord === void 0 ? void 0 : displayRecord[configId]) === null || _a === void 0 ? void 0 : _a.length) || 0;
            recordLength += length;
        }
        return recordLength === 0 && isDataLoaded.current;
    };
    const toggleResultListPopper = (e) => {
        var _a;
        const target = e === null || e === void 0 ? void 0 : e.target;
        if ((_a = dropdownMenuRef === null || dropdownMenuRef === void 0 ? void 0 : dropdownMenuRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) {
            return false;
        }
        if (!isNoResult()) {
            setIsShowResultList(false);
        }
    };
    return (jsx("div", { role: 'group', "aria-label": nls('searchResults') },
        jsx(Dropdown, { className: 'w-100 dropdown-con', size: 'lg', isOpen: true, toggle: toggleResultListPopper, "aria-expanded": true, css: dropdownStyle() },
            jsx(DropdownButton, { className: 'sr-only search-dropdown-button', style: { padding: 0 } }),
            jsx(DropdownMenu, { version: version, className: 'result-list-con', offset: getResultPopperOffset(getJsonLength(config.datasourceConfig) > 1), trapFocus: false, autoFocus: false, css: getStyle(theme, reference), style: { maxHeight: 'auto' } },
                jsx("div", { ref: dropdownMenuRef },
                    !isNoResult() && jsx(DropdownItem, { className: 'd-flex align-items-center show-result-button', onClick: onShowResultButtonclick, title: nls('searchResults') },
                        jsx("div", { className: 'flex-grow-1 font-weight-bold' }, nls('searchResults')),
                        (!isShowResultList && !!searchText) ? jsx(DownOutlined, null) : jsx(UpOutlined, null)),
                    isShowResultList && jsx("div", null,
                        !isNoResult() && jsx(DropdownItem, { divider: true }),
                        isNoResult() && jsx(DropdownItem, { className: 'text-center', disabled: true, title: nls('noResult', { searchText: searchText }) }, nls('noResult', { searchText: searchText })),
                        !isNoResult() && renderResultList()))))));
};
export default ResultList;
//# sourceMappingURL=result-list.js.map