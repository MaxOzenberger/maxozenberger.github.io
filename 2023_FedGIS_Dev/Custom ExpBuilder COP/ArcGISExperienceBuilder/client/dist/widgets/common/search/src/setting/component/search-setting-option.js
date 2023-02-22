/** @jsx jsx */
import { React, css, jsx, LinkType, Immutable, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core';
import { SettingSection, SettingRow, SettingCollapse, LinkSelector, OpenTypes, SearchSuggestionSetting, SearchGeneralSetting } from 'jimu-ui/advanced/setting-components';
import { SearchResultView, MAX_RESULT } from '../../config';
import { hooks, TextInput, Checkbox, Switch, defaultMessages as jimuiDefaultMessage } from 'jimu-ui';
import defaultMessage from '../translations/default';
import { useTheme } from 'jimu-theme';
const SearchOptions = (props) => {
    const nls = hooks.useTranslate(defaultMessage, jimuiDefaultMessage, jimuCoreDefaultMessage);
    const appTheme = useTheme();
    const STYLE = css `
    .check-box-label {
      color: ${appTheme.colors.palette.dark[800]}
    }
    .search-setting-con {
      padding-left: 0;
      padding-right: 0;
    }
    .divider-line {
      padding-bottom: 0;
    }
    .checkbox-con .jimu-widget-setting--row-label{
      max-width: 100%;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  `;
    const { config, id, useDataSources, onSettingChange } = props;
    const { searchResultView, hint, resultMaxNumber, linkParam, isAutoSelectFirstResult } = config;
    const [openSearchSuggestion, setOpenSearchSuggestion] = React.useState(false);
    const [openSearchResult, setOpenSearchResult] = React.useState(false);
    const [newResultMaxNumber, setResultMaxNumber] = React.useState(resultMaxNumber);
    const [settingConfig, setSettingConfig] = React.useState(Immutable({}));
    React.useEffect(() => {
        initSettingConfig();
        // eslint-disable-next-line
    }, [config]);
    const initSettingConfig = () => {
        const newSettingConfig = {
            maxSuggestions: config === null || config === void 0 ? void 0 : config.maxSuggestions,
            isUseCurrentLoation: config === null || config === void 0 ? void 0 : config.isUseCurrentLoation,
            isShowRecentSearches: config === null || config === void 0 ? void 0 : config.isShowRecentSearches,
            recentSearchesMaxNumber: config === null || config === void 0 ? void 0 : config.recentSearchesMaxNumber
        };
        setSettingConfig(Immutable(newSettingConfig));
    };
    const onConfigChange = (key, value) => {
        onSettingChange({ id: id, config: config.setIn(key, value) });
    };
    const handleAutoSelectChange = (evt) => {
        onConfigChange(['isAutoSelectFirstResult'], !isAutoSelectFirstResult);
    };
    const handleResultMaxNumberAccept = value => {
        if (!value) {
            value = resultMaxNumber || MAX_RESULT;
            setResultMaxNumber(value);
        }
        checkNumber(value) && onConfigChange(['resultMaxNumber'], Number(value));
    };
    const handleResultMaxNumberChange = (e) => {
        const value = e.target.value;
        checkNumber(value) && setResultMaxNumber(value);
    };
    const checkNumber = (value) => {
        if ((value === null || value === void 0 ? void 0 : value.length) === 0)
            return true;
        return Number(value) && Number(value) > 0;
    };
    const onSettingLinkConfirm = (linkResult) => {
        if (!linkResult) {
            return;
        }
        onConfigChange(['linkParam'], linkResult);
    };
    const onResultViewChange = (isShowSearchResultView) => {
        const resultView = isShowSearchResultView ? SearchResultView.ResultPanel : SearchResultView.OtherWidgets;
        onConfigChange(['searchResultView'], resultView);
    };
    const getHiddenLinks = () => {
        return Immutable([LinkType.WebAddress, LinkType.PrintPreview]);
    };
    const onHintChange = (hint) => {
        onConfigChange(['hint'], hint);
    };
    const onSuggestionSettingChange = (settingConfig) => {
        if (!settingConfig)
            return false;
        const newConfig = config.merge(settingConfig);
        onSettingChange({ id: id, config: newConfig });
    };
    const renderSearchSuggestionSetting = () => {
        return (jsx("div", null,
            jsx(SettingSection, { className: 'search-setting-con' },
                jsx(SettingRow, { role: 'group', "aria-label": nls('searchSuggestion') },
                    jsx(SettingCollapse, { label: nls('searchSuggestion'), isOpen: openSearchSuggestion, onRequestOpen: () => setOpenSearchSuggestion(true), onRequestClose: () => setOpenSearchSuggestion(false), level: 1 },
                        jsx(SearchSuggestionSetting, { id: id, settingConfig: settingConfig, onSettingChange: onSuggestionSettingChange })))),
            openSearchSuggestion && jsx(SettingSection, { className: 'divider-line' })));
    };
    const renderSearchResultSetting = () => {
        return (jsx(SettingRow, { role: 'group', "aria-label": nls('searchResult') },
            jsx(SettingCollapse, { label: nls('searchResult'), isOpen: openSearchResult, onRequestOpen: () => setOpenSearchResult(true), onRequestClose: () => setOpenSearchResult(false), level: 1 },
                jsx(SettingRow, { label: nls('resultPanel'), className: 'mt-2' },
                    jsx(Switch, { title: nls('resultPanel'), checked: searchResultView === SearchResultView.ResultPanel, onChange: (evt) => { onResultViewChange(searchResultView === SearchResultView.OtherWidgets); } })),
                searchResultView === SearchResultView.ResultPanel && jsx(SettingRow, { flow: 'wrap', className: 'checkbox-con', label: nls('maximumResults') },
                    jsx(TextInput, { "aria-label": nls('maximumResults'), size: 'sm', value: newResultMaxNumber, onChange: handleResultMaxNumberChange, onAcceptValue: handleResultMaxNumberAccept, className: 'w-100' })),
                searchResultView === SearchResultView.ResultPanel && jsx(SettingRow, null,
                    jsx("div", { className: 'cursor-pointer', onClick: handleAutoSelectChange, "aria-label": nls('autoSelect') },
                        jsx(Checkbox, { checked: isAutoSelectFirstResult, title: nls('autoSelect'), className: 'mr-1' }),
                        jsx("span", { className: 'check-box-label' }, nls('autoSelect')))),
                searchResultView === SearchResultView.OtherWidgets && jsx(SettingRow, { className: 'd-block', flow: 'wrap', label: nls('redirectSearchResult') },
                    jsx(LinkSelector, { onSettingConfirm: onSettingLinkConfirm, linkParam: linkParam, useDataSources: useDataSources, widgetId: id, hiddenLinks: getHiddenLinks(), openTypes: Immutable([OpenTypes.CurrentWindow]) })))));
    };
    return (jsx(SettingSection, { title: nls('generalSearchOption'), css: STYLE },
        jsx(SearchGeneralSetting, { id: id, hint: hint, onSettingChange: onHintChange }),
        renderSearchSuggestionSetting(),
        renderSearchResultSetting()));
};
export default SearchOptions;
//# sourceMappingURL=search-setting-option.js.map