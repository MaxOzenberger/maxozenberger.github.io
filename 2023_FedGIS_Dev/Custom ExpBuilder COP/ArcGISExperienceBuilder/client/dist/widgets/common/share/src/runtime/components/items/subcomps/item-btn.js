/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Button, Icon, defaultMessages } from 'jimu-ui';
import { ItemsName, IconRadius, BtnIconSize, IconColorMode, IconSize, UiMode } from '../../../../config';
import { ShownMode } from '../base-item';
import { stopPropagation } from '../utils';
export class ItemBtn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getStyle = () => {
            return css `
      border: none;
      margin: 16px 0;
    `;
        };
        this.onClick = (evt) => {
            this.props.onClick(this.btnRef);
            stopPropagation(evt);
        };
        this.btnRef = React.createRef();
    }
    componentDidUpdate() {
        var _a;
        if (this.props.a11yFocusElement === this.props.name) {
            (_a = this.btnRef) === null || _a === void 0 ? void 0 : _a.current.focus();
        }
    }
    // btn style
    getBtnStyles() {
        const { isShowInModal, uiMode, config, shownMode } = this.props.attr;
        const { name } = this.props;
        const isPopupUIMode = (uiMode === UiMode.Popup);
        const hideLabel = isPopupUIMode ? true : config.inline.design.hideLabel;
        const btnSize = this.getBtnSize(config, isShowInModal /* isPopupUIMode, */);
        const btnColor = isPopupUIMode ? null : config.inline.design.btnColor;
        const iconColor = isPopupUIMode ? null : config.inline.design.iconColor;
        const btnRad = isPopupUIMode ? IconRadius.Rad50 : config.inline.design.btnRad;
        this.hideLabel = hideLabel;
        this.btnSize = btnSize;
        this.btnColor = btnColor;
        this.iconColor = iconColor;
        this.btnRad = btnRad;
        const showMode = shownMode || ShownMode.Btn;
        const btnStyle = this.getBtnBgStyle(this.btnColor, null, this.btnRad, this.btnSize);
        const btnShadow = ''; // this.getBtnShadow(),
        const iconStyle = this.getIconStyle(this.btnRad, this.hideLabel);
        const iconSize = this.getIconSize(this.btnSize);
        const labelInBtn = this.getLabel(name, this.hideLabel, this.btnRad);
        const labelOutOfBtn = this.getOutOfBtnLabel(name, this.hideLabel, this.btnRad);
        const iconImg = this.updateIconImgByColor(this.iconColor);
        return {
            shownMode: showMode,
            btnSize: this.btnSize,
            btnStyle: btnStyle,
            btnShadow: btnShadow,
            iconStyle: iconStyle,
            iconSize: iconSize,
            iconImg: iconImg,
            labelInBtn: labelInBtn,
            labelOutOfBtn: labelOutOfBtn
        };
    }
    // Keep this behavior in 8.3 to fix btnRad (from Beta2)
    fixRadForBeta2() {
        return IconRadius.Rad50;
    }
    getLabel(name, hideLabel, btnRad) {
        btnRad = this.fixRadForBeta2();
        if (hideLabel || IconRadius.Rad50 === btnRad) {
            return null;
        }
        else {
            return name;
        }
    }
    getOutOfBtnLabel(name, hideLabel, btnRad) {
        btnRad = this.fixRadForBeta2();
        if (!hideLabel && IconRadius.Rad50 === btnRad) {
            let _name = name;
            if (_name === ItemsName.Sharelink) {
                _name = 'link'; // fix i18n ui issue ,#5391
            }
            return _name;
        }
        else {
            return null;
        }
    }
    // getBtnPaddingBySize(size) {
    //   if (window._appState) {
    //     var sizeInTheme = window._appState.theme.components.button.sizes;
    //     return sizeInTheme[size].paddingX;
    //   } else {
    //     if (size === BtnIconSize.Small) {
    //       return '0.25rem';
    //     } else if (size === BtnIconSize.Medium) {
    //       return '0.25rem';
    //     } else if (size === BtnIconSize.Large) {
    //       return '0.5rem';
    //     }
    //   }
    // }
    getBtnBgStyle(bgColor, defaultBgColor, btnRad, size) {
        btnRad = this.fixRadForBeta2();
        let cssObj = { border: 'none', lineHeight: 1, fontSize: '1rem', padding: 0 /*, padding: '0.5rem', width: '100%' */ };
        // if (size === BtnIconSize.Small) {
        //   cssObj = Object.assign(cssObj, { padding: '0.25rem' });
        // } else if (size === BtnIconSize.Medium) {
        //   cssObj = Object.assign(cssObj, { padding: '0.5rem' });
        // } else if (size === BtnIconSize.Large) {
        //   cssObj = Object.assign(cssObj, { padding: '1rem' });
        // }
        // if (size === BtnIconSize.Small || size === BtnIconSize.Medium || size === BtnIconSize.Large) {
        //   cssObj = Object.assign(cssObj, { padding: this.getBtnPaddingBySize(size)});
        // }
        // if (bgColor) {
        //   cssObj = Object.assign(cssObj, { backgroundColor: bgColor });
        // } else if ('' === bgColor) {
        //   cssObj = Object.assign(cssObj, { backgroundColor: defaultBgColor });
        // }
        if (btnRad !== 'undefined') {
            cssObj = Object.assign(cssObj, { borderRadius: btnRad });
        }
        return cssObj;
    }
    // delete it since 8.3
    // private getBtnShadow(isShowInModal: boolean) {
    //   //return isShowInModal ? '' : 'shadow';
    //   return '';
    // }
    // //copy btn
    // getCopyBtnStyle() {
    //   return { color: 'none' };
    // }
    // Icon
    getIconStyle(btnRad, isHideLabel) {
        btnRad = this.fixRadForBeta2();
        let cssObj = {};
        if (btnRad === IconRadius.Rad50 || isHideLabel === true) {
            cssObj = Object.assign(cssObj, { margin: 0 });
        }
        return cssObj;
    }
    getIconSize(size) {
        let s = IconSize.Medium;
        if (size === BtnIconSize.Small) {
            s = IconSize.Small;
        }
        else if (size === BtnIconSize.Medium) {
            s = IconSize.Medium;
        }
        else if (size === BtnIconSize.Large) {
            s = IconSize.Large;
        }
        return s;
    }
    updateIconImgByColor(color) {
        let img;
        switch (color) {
            case IconColorMode.White: {
                img = this.props.iconImages.white;
                break;
            }
            case IconColorMode.Black: {
                img = this.props.iconImages.black;
                break;
            }
            default: { // IconColorMode.Default
                img = this.props.iconImages.default;
                break;
            }
        }
        return img;
    }
    // 1.uiMode == popup
    //  1.1 main btn, 1.2 btn in popup,
    // 2.uiMode == list
    //  2.1 btn list
    // 3.uiMode == slide
    //  2.1 btn list
    getBtnSize(config, isShowInModal /* isPopupUIMode, */) {
        let size;
        // btns in the popup
        if (isShowInModal) {
            size = BtnIconSize.Large; // 1.2 btn in popup
            return size;
        }
        else {
            size = config.inline.design.size; // 2.1 btn list
        }
        // btns outside popup
        /* if (isPopupUIMode) {
            if (config.popup.icon) {
              size = config.popup.icon.properties.size;//1.1 main btn size
            }
          } */
        return size;
    }
    getNlsLabel(name, intl) {
        if (!name || name.length < 1) {
            return name;
        }
        // name = name.toLowerCase(); //.replace(/( |^)[a-z]/g, (L) => L.toUpperCase()); //firstUpperCase
        return intl.formatMessage({ id: name, defaultMessage: defaultMessages[name] });
    }
    render() {
        var _a;
        const { intl, nls } = this.props;
        const { btnSize, btnStyle, btnShadow, iconStyle, iconSize, iconImg, labelInBtn, labelOutOfBtn } = this.getBtnStyles();
        const labelOutOfBtnContent = (labelOutOfBtn != null) ? jsx("div", { className: 'label-outof-btn text-truncate', title: nls }, this.getNlsLabel(labelOutOfBtn, intl)) : null;
        const labelInBtnContent = (labelInBtn != null) ? jsx("div", { className: 'label-in-btn', title: nls }, this.getNlsLabel(labelInBtn, intl)) : null;
        return (jsx("div", { className: 'd-flex align-items-center flex-column' },
            jsx(Button, { ref: this.btnRef, onClick: evt => this.onClick(evt), style: btnStyle, size: btnSize, className: btnShadow, icon: true, title: nls, "aria-label": nls, "aria-haspopup": (_a = this.props.a11yIsBtnHaspopup) !== null && _a !== void 0 ? _a : false },
                jsx(Icon, { icon: iconImg, currentColor: false, style: iconStyle, width: iconSize, height: iconSize }),
                " ",
                labelInBtnContent),
            labelOutOfBtnContent));
    }
}
//# sourceMappingURL=item-btn.js.map