/** @jsx jsx */
import { React, jsx, esri, classNames } from 'jimu-core';
import { hooks, Icon, DropdownItem, Dropdown, DropdownMenu, DropdownButton, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash';
import CurrentLocation from './use-current-location';
import { useTheme } from 'jimu-theme';
import { getStyle, dropdownStyle } from '../style/popper-style';
import { getResultPopperOffset } from '../utils/utils';
const { useRef } = React;
const Sanitizer = esri.Sanitizer;
const sanitizer = new Sanitizer();
const SuggestionList = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage);
    const { isRecentSearches, className, reference, searchSuggestion, isOpen, searchText, canUseOutoutDsLength, serviceList, isShowCurrentLocation, config, toggel, onRecordItemClick, clearSearches, setSuggestionFirstItem } = props;
    const theme = useTheme();
    const isHasSetFirstItem = useRef(false);
    const checkIsNoResult = () => {
        let totalSuggestionItem = [];
        searchSuggestion.forEach(layerSuggestion => {
            const suggestionItem = (layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.suggestionItem) || [];
            totalSuggestionItem = totalSuggestionItem.concat(suggestionItem);
        });
        return searchText && totalSuggestionItem.length === 0;
    };
    const handelSuggestionItemClick = (searchText, initResultServiceListOption) => {
        const { configId, isFromSuggestion, magicKey } = initResultServiceListOption || {};
        if (configId && (isFromSuggestion || magicKey)) {
            onRecordItemClick(searchText, initResultServiceListOption);
        }
        else {
            onRecordItemClick(searchText);
        }
    };
    const renderLayerSuggestionElement = () => {
        isHasSetFirstItem.current = null;
        return searchSuggestion === null || searchSuggestion === void 0 ? void 0 : searchSuggestion.map((layerSuggestion, index) => {
            var _a, _b, _c;
            const isShowLayerName = (searchSuggestion === null || searchSuggestion === void 0 ? void 0 : searchSuggestion.length) > 1 && ((_a = layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.suggestionItem) === null || _a === void 0 ? void 0 : _a.length) > 0;
            return (jsx("div", { key: `${layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.layer}-${index}`, role: 'group', "aria-label": layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.layer },
                isShowLayerName && jsx(DropdownItem, { className: 'source-label-con', disabled: true, title: layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.layer },
                    (layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.icon) && jsx(Icon, { className: 'mr-2', color: (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.primary, size: 16, icon: (_c = layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.icon) === null || _c === void 0 ? void 0 : _c.svg }), layerSuggestion === null || layerSuggestion === void 0 ? void 0 :
                    layerSuggestion.layer),
                renderSuggestionItemElement(layerSuggestion, checkIsShowPadding())));
        });
    };
    const checkIsShowPadding = () => {
        const sourceNumber = searchSuggestion === null || searchSuggestion === void 0 ? void 0 : searchSuggestion.length;
        if (sourceNumber < 2) {
            return false;
        }
        // The total number of icons
        let iconNumber = 0;
        //when only one source has suggestion, and the source item has an icon, padding should also be added
        let numberOfSourceWithSuggestionAndIcon = 0;
        searchSuggestion === null || searchSuggestion === void 0 ? void 0 : searchSuggestion.forEach(layerSuggestion => {
            var _a;
            const icon = layerSuggestion === null || layerSuggestion === void 0 ? void 0 : layerSuggestion.icon;
            if (icon) {
                iconNumber += 1;
            }
            if (((_a = layerSuggestion.suggestionItem) === null || _a === void 0 ? void 0 : _a.length) > 0 && icon) {
                numberOfSourceWithSuggestionAndIcon += 1;
            }
        });
        return numberOfSourceWithSuggestionAndIcon > 0 && iconNumber > 0;
    };
    const renderSuggestionItemElement = (suggestion, isShowPadding = false) => {
        const suggestionItem = suggestion === null || suggestion === void 0 ? void 0 : suggestion.suggestionItem;
        const icon = suggestion === null || suggestion === void 0 ? void 0 : suggestion.icon;
        return suggestionItem === null || suggestionItem === void 0 ? void 0 : suggestionItem.map((item, index) => {
            var _a;
            const suggestionHtml = sanitizer.sanitize(item.suggestionHtml);
            const initResultServiceListOption = {
                configId: item === null || item === void 0 ? void 0 : item.configId,
                isFromSuggestion: item === null || item === void 0 ? void 0 : item.isFromSuggestion,
                magicKey: item === null || item === void 0 ? void 0 : item.magicKey
            };
            return (jsx(DropdownItem, { className: classNames('d-flex align-items-center py-2', { 'item-p-l': isShowPadding }), key: `${suggestion === null || suggestion === void 0 ? void 0 : suggestion.layer}${index}`, title: item.suggestion, onClick: () => {
                    handelSuggestionItemClick(item.suggestion, initResultServiceListOption);
                }, ref: ref => { setFirstItemRef(index, ref); } },
                (icon && canUseOutoutDsLength === 1) && jsx(Icon, { className: 'mr-2', color: (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.primary, size: 16, icon: icon === null || icon === void 0 ? void 0 : icon.svg }),
                jsx("div", { className: 'flex-grow-1', dangerouslySetInnerHTML: { __html: suggestionHtml } })));
        });
    };
    const setFirstItemRef = (index, ref) => {
        if (index === 0 && !isHasSetFirstItem.current) {
            setSuggestionFirstItem(ref);
            isHasSetFirstItem.current = true;
        }
    };
    const DatasourceConfig = (config === null || config === void 0 ? void 0 : config.datasourceConfig) || [];
    return (jsx("div", null,
        jsx(Dropdown, { className: 'w-100', size: 'lg', isOpen: isOpen, toggle: toggel, css: dropdownStyle() },
            jsx(DropdownButton, { className: 'sr-only search-dropdown-button', style: { padding: 0 } }),
            jsx(DropdownMenu, { className: classNames('result-list-con', className), offset: getResultPopperOffset(DatasourceConfig.length > 1), trapFocus: false, autoFocus: false, css: getStyle(theme, reference), style: { maxHeight: 'auto' } },
                (!searchText && isShowCurrentLocation) && jsx(CurrentLocation, { serviceList: serviceList, isShowCurrentLocation: true, onLocationChange: onRecordItemClick }),
                checkIsNoResult() && jsx(DropdownItem, { className: 'text-center py-2', disabled: true, title: nls('noResult', { searchText: searchText }) }, nls('noResult', { searchText: searchText })),
                renderLayerSuggestionElement(),
                isRecentSearches && jsx(DropdownItem, { divider: true }),
                isRecentSearches && jsx(DropdownItem, { className: 'clear-recent-search-con', title: nls('clearRecentSearches'), onClick: clearSearches },
                    jsx(TrashOutlined, { className: 'mr-2' }),
                    nls('clearRecentSearches'))))));
};
export default SuggestionList;
//# sourceMappingURL=suggestion-list.js.map