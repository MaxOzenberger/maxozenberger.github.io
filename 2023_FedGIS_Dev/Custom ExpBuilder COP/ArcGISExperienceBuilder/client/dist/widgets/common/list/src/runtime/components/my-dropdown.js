/** @jsx jsx */
import { React, jsx, AppMode, css } from 'jimu-core';
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'jimu-ui';
export default class MyDropDown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onDropDownToggle = evt => {
            evt.stopPropagation();
            const { isDropDownOpen, onDropDownOpenChange } = this.props;
            if (isDropDownOpen !== undefined) {
                onDropDownOpenChange && onDropDownOpenChange(!isDropDownOpen);
            }
            else {
                const { isOpen } = this.state;
                this.setState({ isOpen: !isOpen });
            }
        };
        this.onItemClick = (evt, item) => {
            const { isDropDownOpen, onDropDownOpenChange } = this.props;
            if (isDropDownOpen !== undefined) {
                onDropDownOpenChange && onDropDownOpenChange(false);
            }
            else {
                this.setState({ isOpen: false });
            }
            item.event(evt, item);
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
        };
        this.onDropDownMouseClick = evt => {
            evt.stopPropagation();
            evt.nativeEvent.stopImmediatePropagation();
        };
        this.getStyle = () => {
            var _a, _b, _c, _d, _e, _f;
            const { theme } = this.props;
            return css `
      & button {
        padding: 0;
      }
      .list-toggle-button {
        background: ${(_c = (_b = (_a = theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.light) === null || _c === void 0 ? void 0 : _c[500]};
        border: none;
        &:hover, &[aria-expanded="true"] {
          background: ${(_f = (_e = (_d = theme.colors) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.light) === null || _f === void 0 ? void 0 : _f[800]};
        }
      }
    `;
        };
        this.state = {
            isOpen: false
        };
        const { withBuilderStyle } = props;
        this.MyDropdown = withBuilderStyle ? withBuilderStyle(Dropdown) : Dropdown;
        this.MyDropdownButton = withBuilderStyle
            ? withBuilderStyle(DropdownButton)
            : DropdownButton;
        this.MyDropdownMenu = withBuilderStyle
            ? withBuilderStyle(DropdownMenu)
            : DropdownMenu;
        this.MyDropdownItem = withBuilderStyle
            ? withBuilderStyle(DropdownItem)
            : DropdownItem;
    }
    render() {
        const { items, toggleContent, caret, toggleType, toggleArrow, menuContent, appMode, modifiers, toggleIsIcon, theme, isDropDownOpen, size, appendToBody, toggleTitle, direction, menuCss, className, showActive, activeLabel, fluid } = this.props;
        let { isOpen } = this.state;
        isOpen = isDropDownOpen === undefined ? isOpen : isDropDownOpen;
        const { MyDropdown, MyDropdownButton, MyDropdownMenu, MyDropdownItem } = this;
        return (jsx(MyDropdown, { size: size, toggle: this.onDropDownToggle, direction: direction, fluid: fluid, isOpen: isOpen && appMode !== AppMode.Design, className: `my-dropdown ${className}`, css: this.getStyle() },
            toggleContent && (jsx(MyDropdownButton, { icon: toggleIsIcon, title: toggleTitle, size: size, type: toggleType, caret: caret, className: 'list-toggle-button', arrow: toggleArrow }, toggleContent && toggleContent(theme))),
            jsx(MyDropdownMenu, { appendToBody: appendToBody, modifiers: modifiers, css: menuCss && menuCss(theme) }, menuContent
                ? menuContent(theme)
                : items &&
                    items.asMutable().map((item, i) => {
                        return (!item.hide && (jsx(MyDropdownItem, { key: i, className: 'no-user-select', title: item.label, active: showActive && item.label === activeLabel, onClick: evt => this.onItemClick(evt, item) }, item.label)));
                    }))));
    }
}
//# sourceMappingURL=my-dropdown.js.map