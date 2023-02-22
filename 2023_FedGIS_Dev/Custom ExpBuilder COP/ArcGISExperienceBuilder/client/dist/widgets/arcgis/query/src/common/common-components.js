/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Button, Modal, ModalBody, ModalFooter, PanelHeader } from 'jimu-ui';
import { withTheme } from 'jimu-theme';
const { useState } = React;
/**
 * A simple Functional Component storing some States that are commonly used
 */
export const StateHolder = (props) => {
    const { initState = {}, children } = props;
    const defaultStateMap = {
        visible: true,
        refContainer: null
    };
    const useStateMap = {
        visible: useState('visible' in initState ? initState.visible : defaultStateMap.visible),
        refContainer: useState('refContainer' in initState ? initState.refContainer : defaultStateMap.refContainer),
        customData: useState(Object.assign({}, initState.customData))
    };
    return jsx(React.Fragment, null, children(useStateMap));
};
/**
 * A dialog popup
 */
export const DialogPanel = withTheme((props) => {
    const { theme, panelVisible, setPanelVisible, getI18nMessage, isModal = true, title = getI18nMessage('queryMessage'), bodyContent = '', hasHeader = true, hasFooter = true } = props;
    const toggle = () => setPanelVisible(false);
    const getContent = () => jsx(React.Fragment, null,
        hasHeader &&
            jsx(PanelHeader, { className: 'py-2', title: title, onClose: toggle }),
        jsx(ModalBody, null, bodyContent),
        hasFooter &&
            jsx(ModalFooter, null,
                jsx(Button, { onClick: toggle }, getI18nMessage('ok'))));
    const generalClassName = 'ui-unit-dialog-panel';
    const renderModalContent = () => {
        return (jsx(Modal, { className: `${generalClassName}`, isOpen: panelVisible, toggle: toggle, backdrop: 'static' }, getContent()));
    };
    const renderNonModalContent = () => {
        const getStyle = () => css `
      &.ui-unit-dialog-panel.modal-dialog {
        margin: 0;
        width: 100%;
        .modal-content {
          background-color: ${theme.colors.palette.light[600]};
          color: ${theme.colors.black};
          font-size: .75rem;
          font-weight: 400;
          border: none;
          .panel-header {
            font-size: .8125rem;
            padding: .625rem;
          }
          .modal-body {
            padding: 0 .625rem .75rem;
            white-space: normal;
          }
        }
      }
    `;
        return (jsx("div", { className: `${generalClassName} modal-dialog ${panelVisible ? '' : 'collapse'}`, css: getStyle() },
            jsx("div", { className: 'modal-content' }, getContent())));
    };
    return isModal ? renderModalContent() : renderNonModalContent();
});
export var EntityStatusType;
(function (EntityStatusType) {
    EntityStatusType["None"] = "";
    EntityStatusType["Init"] = "init";
    EntityStatusType["Loading"] = "loading";
    EntityStatusType["Loaded"] = "loaded";
    EntityStatusType["Warning"] = "warning";
    EntityStatusType["Error"] = "error";
})(EntityStatusType || (EntityStatusType = {}));
/**
 * An animatable icon representing status
 */
export const StatusIndicator = withTheme((props) => {
    const { theme, className, title, statusType } = props;
    const getStyle = () => {
        var _a, _b, _c, _d, _e, _f;
        return css `
    &.ui-unit-status-indicator {
      display: flex;
      &.ui-unit-status-indicator_status-type-loading {
        &:before {
          @keyframes loading {
            0% {transform: rotate(0deg); };
            100% {transform: rotate(360deg)};
          }
          content: '';
          width: 1rem;
          height: 1rem;
          display: block;
          border: 1px solid ${(_c = (_b = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette) === null || _b === void 0 ? void 0 : _b.light) === null || _c === void 0 ? void 0 : _c[400]};
          border-radius: 50%;
          border-top: 1px solid ${(_f = (_e = (_d = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.primary) === null || _f === void 0 ? void 0 : _f[600]};
          box-sizing: border-box;
          animation: loading 2s infinite linear;
          margin-right: .25rem;
        }
      }
    }
  `;
    };
    return (statusType &&
        jsx("div", { className: `${className !== null && className !== void 0 ? className : ''} ui-unit-status-indicator ui-unit-status-indicator_status-type-${statusType}`, title: title, css: getStyle() }));
});
//# sourceMappingURL=common-components.js.map