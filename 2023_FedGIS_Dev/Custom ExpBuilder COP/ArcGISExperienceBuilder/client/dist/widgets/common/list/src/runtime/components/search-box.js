/** @jsx jsx */
import { React, css, jsx, polished, esri, AppMode } from 'jimu-core';
import { TextInput, Button, Popper } from 'jimu-ui';
import { CloseOutlined } from 'jimu-icons/outlined/editor/close';
import { SearchOutlined } from 'jimu-icons/outlined/editor/search';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
const Sanitizer = esri.Sanitizer;
const sanitizer = new Sanitizer();
export default class SearchBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = searchText => {
            this.setState({
                searchText: searchText,
                isShowSuggestion: (searchText === null || searchText === void 0 ? void 0 : searchText.length) > 2
            }, () => {
                const { onSearchTextChange } = this.props;
                if (onSearchTextChange) {
                    onSearchTextChange(searchText);
                }
            });
        };
        this.handleSubmit = (value, isEnter = false) => {
            const { onSubmit } = this.props;
            if (onSubmit) {
                onSubmit(value, isEnter);
            }
        };
        this.onKeyUp = evt => {
            if (!evt || !evt.target)
                return;
            if (evt.key === 'Enter') {
                this.setState({
                    isShowSuggestion: false
                });
                this.handleSubmit(evt.target.value, true);
            }
        };
        this.onSuggestionConfirm = suggestion => {
            this.setState({
                searchText: suggestion,
                isShowSuggestion: false
            }, () => {
                var _a;
                this.handleSubmit(suggestion);
                (_a = this.props) === null || _a === void 0 ? void 0 : _a.toggleSearchBoxVisible(true);
            });
        };
        this.handleClear = evt => {
            this.setState({
                searchText: ''
            });
            evt.stopPropagation();
        };
        this.getStyle = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const { theme } = this.props;
            return css `
      position: relative;
      .search-input {
        margin-bottom: -1px;
        padding-left: 3px;
        border: 0;
        // border-bottom-width: 1px;
        // border-bottom-style: solid;
        // border-color: ${theme.colors.primary};
        background: transparent;
        height: ${polished.rem(26)};
        min-width: 0;
        .input-wrapper {
          background: transparent;
          border: none;
          padding: 0;
          height: 100%;
        }
      }
      .search-input:focus {
        background: transparent;
      }
      .search-loading-con {
        @keyframes loading {
          0% {transform: rotate(0deg); };
          100% {transform: rotate(360deg)};
        }
        width: ${polished.rem(13)};
        height: ${polished.rem(13)};
        min-width: ${polished.rem(13)};
        border: 2px solid ${(_c = (_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.secondary) === null || _c === void 0 ? void 0 : _c[300]};
        border-radius: 50%;
        border-top: 2px solid ${(_f = (_e = (_d = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.primary) === null || _f === void 0 ? void 0 : _f[500]};
        box-sizing: border-box;
        animation:loading 2s infinite linear;
        margin-right: ${polished.rem(4)};
      }
      .clear-search, .search-back {
        cursor: pointer;
        padding: ${polished.rem(6)};
        background: none;
        border: none;
        color: ${(_j = (_h = (_g = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _g === void 0 ? void 0 : _g.palette) === null || _h === void 0 ? void 0 : _h.dark) === null || _j === void 0 ? void 0 : _j[800]}
      }
      .search-back {
        margin-left: ${polished.rem(-6)};
      }
      .clear-search:hover {
        background: none;
      }
    `;
        };
        this.getSuggestionListStyle = () => {
            const { suggestionWidth } = this.props;
            return css `
      & {
        max-height: ${polished.rem(300)};
        min-width: ${polished.rem(suggestionWidth)};
        overflow: auto;
      }
      button {
        display: block;
        width: 100%;
        text-align: left;
        border: none;
        border-radius: 0;
      }
      button:hover {
        border: none;
      }
    `;
        };
        this.clearSearchText = () => {
            const { searchText } = this.state;
            if (searchText) {
                this.handleChange('');
                this.setState({
                    isShowSuggestion: false
                });
            }
        };
        this.getTextInputSuffixElement = () => {
            const { theme, showLoading, formatMessage } = this.props;
            const { searchText } = this.state;
            return (jsx("div", { className: 'd-flex align-items-center' },
                showLoading && jsx("div", { className: 'search-loading-con' }),
                searchText && (jsx(Button, { color: 'tertiary', className: 'clear-search', icon: true, size: 'sm', onClick: this.clearSearchText, title: formatMessage('clearSearch') },
                    jsx(CloseOutlined, { size: 14, color: theme.colors.palette.dark[800] })))));
        };
        this.getTextInputPrefixElement = () => {
            const { theme } = this.props;
            return (jsx(Button, { type: 'tertiary', icon: true, size: 'sm', onClick: evt => this.handleSubmit(this.state.searchText) },
                jsx(SearchOutlined, { size: 16, color: theme.colors.palette.light[800] })));
        };
        this.state = {
            searchText: props.searchText || '',
            isShowSuggestion: false
        };
    }
    componentDidUpdate(preProps) {
        var _a;
        if (this.props.searchText !== preProps.searchText &&
            this.props.searchText !== this.state.searchText) {
            const { searchText } = this.props;
            this.setState({
                searchText: searchText
            });
        }
        if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.appMode) === AppMode.Design && this.state.isShowSuggestion) {
            this.setState({
                isShowSuggestion: false,
                searchText: ''
            });
        }
    }
    render() {
        const { placeholder, className, showClear, hideSearchIcon, inputRef, onFocus, onBlur, theme, searchSuggestion, formatMessage, isShowBackButton } = this.props;
        const { searchText, isShowSuggestion } = this.state;
        return (jsx("div", null,
            jsx("div", { css: this.getStyle(), className: `d-flex align-items-center ${className}` },
                isShowBackButton && (jsx(Button, { color: 'tertiary', className: 'search-back', icon: true, size: 'sm', onClick: evt => {
                        var _a;
                        (_a = this.props) === null || _a === void 0 ? void 0 : _a.toggleSearchBoxVisible(false);
                    }, title: formatMessage('topToolBack') },
                    jsx(ArrowLeftOutlined, { size: 20, color: theme.colors.palette.dark[800] }))),
                jsx(TextInput, { className: 'search-input flex-grow-1', ref: inputRef, placeholder: placeholder, onChange: e => this.handleChange(e.target.value), onBlur: onBlur, onFocus: onFocus, value: searchText || '', onKeyDown: e => this.onKeyUp(e), prefix: (!hideSearchIcon && !isShowBackButton) && this.getTextInputPrefixElement(), suffix: this.getTextInputSuffixElement() }),
                showClear && (jsx(Button, { color: 'tertiary', icon: true, size: 'sm', onClick: this.handleSubmit },
                    jsx(CloseOutlined, { size: 12, color: theme.colors.palette.dark[800] })))),
            jsx("div", { ref: ref => (this.reference = ref) },
                jsx(Popper, { css: this.getSuggestionListStyle(), placement: 'bottom-start', reference: this.reference, offset: [0, 8], open: isShowSuggestion, trapFocus: false, autoFocus: false, toggle: e => {
                        this.setState({ isShowSuggestion: !isShowSuggestion });
                    } }, searchSuggestion.map((suggestion, index) => {
                    const suggestionHtml = sanitizer.sanitize(suggestion.suggestionHtml);
                    return (jsx(Button, { key: index, type: 'secondary', size: 'sm', onClick: () => {
                            this.onSuggestionConfirm(suggestion.suggestion);
                        }, dangerouslySetInnerHTML: { __html: suggestionHtml } }));
                })))));
    }
}
//# sourceMappingURL=search-box.js.map