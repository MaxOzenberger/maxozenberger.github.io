import { React, css } from 'jimu-core';
export var ExpandType;
(function (ExpandType) {
    ExpandType[ExpandType["BtnRedirect"] = 0] = "BtnRedirect";
    ExpandType[ExpandType["ShowInPopup"] = 1] = "ShowInPopup";
})(ExpandType || (ExpandType = {}));
/* share items */
export var ShownMode;
(function (ShownMode) {
    ShownMode[ShownMode["Btn"] = 0] = "Btn";
    ShownMode[ShownMode["Content"] = 1] = "Content";
})(ShownMode || (ShownMode = {}));
export default class BaseItem extends React.PureComponent {
    constructor() {
        super(...arguments);
        // styles
        this.getCommonStyle = () => {
            var _a, _b, _c;
            const inputVars = (_b = (_a = this.props.theme.components) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.sizes.default;
            const borderColor = this.props.theme.colors.palette.light[400];
            return css `
      .separator-line {
        border-top: 1px solid ${borderColor};
        margin-bottom: 1rem;
      }

      .share-inputs-wrapper {
        border: 1px solid ${borderColor};
        border-radius: ${(_c = inputVars.borderRadius) !== null && _c !== void 0 ? _c : 0};

        .input-wrapper { /* for jimu-inputs */
          border: none;
        }

        .share-link-input {
          border-right: 1px solid ${borderColor};
        }
        .embed-copy-btn-wrapper {
          border-top: 1px solid ${borderColor};
        }
      }
    `;
        };
    }
    openInNewTab(url) {
        const win = window.open(url, '_blank');
        win.focus();
    }
    // Messages
    getAppTitle() {
        return this.props.getAppTitle();
    }
    getMsgBy() {
        return ' by ArcGIS Experience Builder';
    }
}
//# sourceMappingURL=base-item.js.map