import { css, polished } from 'jimu-core';
export const getStyle = (theme, reference) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return css `
    & {
      max-height: ${polished.rem(300)};
      width: ${polished.rem((_a = reference === null || reference === void 0 ? void 0 : reference.current) === null || _a === void 0 ? void 0 : _a.clientWidth)};
      overflow: auto;
      padding-top: 0;
      padding-bottom: 0;
      visibility: unset !important;
    }
    &.result-list-con .dropdown-item {
      text-overflow: ellipsis;
      white-space: pre-wrap;
    }
    &.result-list-con .dropdown-item:disabled, &.result-list-con .dropdown-item:disabled:hover {
      color: ${(_d = (_c = (_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.palette) === null || _c === void 0 ? void 0 : _c.secondary) === null || _d === void 0 ? void 0 : _d[800]};
      background-color: ${(_g = (_f = (_e = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _e === void 0 ? void 0 : _e.palette) === null || _f === void 0 ? void 0 : _f.light) === null || _g === void 0 ? void 0 : _g[200]};
    }
    &.result-list-con .dropdown-item:hover, &.result-list-con .dropdown-item:focus {
      color: ${(_h = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _h === void 0 ? void 0 : _h.black};
      background-color: ${(_l = (_k = (_j = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _j === void 0 ? void 0 : _j.palette) === null || _k === void 0 ? void 0 : _k.light) === null || _l === void 0 ? void 0 : _l[100]};
    }
    &.result-list-con .dropdown-divider {
      margin-left: 0;
      margin-right: 0;
    }
    &.result-list-con .dropdown-item.active {
      background: ${(_m = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _m === void 0 ? void 0 : _m.primary};
      color: ${(_o = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _o === void 0 ? void 0 : _o.white};
    }
    .show-result-button:active, &.result-list-con .show-result-button:focus, &.result-list-con .show-result-button:hover {
      background-color: ${(_p = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _p === void 0 ? void 0 : _p.white};
    }
    .dropdown-menu--inner {
      max-height: none;
    }
    .jimu-dropdown-item {
      min-height: ${polished.rem(32)};
    }
    .clear-recent-search-con {
      color: var(--primary) !important;
      height: ${polished.rem(40)};
      margin-top: ${polished.rem(-4)};
    }
    .dropdown-divider {
      min-height: 0;
    }
    .item-p-l {
      padding-left: ${polished.rem(42)} !important;
    }
    .source-label-con {
      color: var(--black) !important;
      font-weight: bold !important;
    }
  `;
};
export const dropdownStyle = () => {
    return css `
    .search-dropdown-button {
      position: absolute;
      top: 0;
      bottom: 0;
      height: auto;
      z-index: -1;
    }
    & {
      position: initial;
    }
  `;
};
//# sourceMappingURL=popper-style.js.map