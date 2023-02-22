/** @jsx jsx */
import { React, jsx, css, AppMode, polished, ReactRedux } from 'jimu-core';
import { Runtime } from './runtime/runtime';
import { MIN_WIDGET_WIDTH, MIN_WIDGET_HEIGHT } from '../common/consts';
import { styleUtils, hooks } from 'jimu-ui';
import { versionManager } from '../version-manager';
const useStyle = (vertical) => {
    return React.useMemo(() => {
        return css `
      overflow: hidden;
      white-space: nowrap;
      .controller-container {
        width: 100%;
        height: 100%;
        min-width: ${!vertical
            ? polished.rem(MIN_WIDGET_WIDTH)
            : polished.rem(MIN_WIDGET_HEIGHT)};
        min-height: ${vertical
            ? polished.rem(MIN_WIDGET_WIDTH)
            : polished.rem(MIN_WIDGET_HEIGHT)};
      }
    `;
    }, [vertical]);
};
const useAdvancedStyle = (variant, advanced) => {
    const regular = variant === null || variant === void 0 ? void 0 : variant.default;
    const active = variant === null || variant === void 0 ? void 0 : variant.active;
    const hover = variant === null || variant === void 0 ? void 0 : variant.hover;
    return React.useMemo(() => {
        if (!advanced)
            return css ``;
        return css `
      .avatar-card:not(.add-widget-btn) {
        ${regular &&
            css `
          > .avatar {
            > .avatar-button {
              background-color: ${regular.bg};
              border-color: ${regular.bg};
            }
          }
          > .avatar-label {
            color: ${regular.color};
            font-style: ${(regular === null || regular === void 0 ? void 0 : regular.italic) ? 'italic' : 'normal'};
            font-weight: ${(regular === null || regular === void 0 ? void 0 : regular.bold) ? 'bold' : 'normal'};
            text-decoration: ${styleUtils.toCSSTextUnderLine({
                underline: regular.underline,
                strike: regular.strike
            })};
          }
        `}
        ${hover &&
            css `
          &:hover {
            > .avatar {
              > .avatar-button {
                background-color: ${hover.bg};
                border-color: ${hover.bg};
              }
            }
            > .avatar-label {
              color: ${hover.color};
              font-style: ${(hover === null || hover === void 0 ? void 0 : hover.italic) ? 'italic' : 'normal'};
              font-weight: ${(hover === null || hover === void 0 ? void 0 : hover.bold) ? 'bold' : 'normal'};
              text-decoration: ${styleUtils.toCSSTextUnderLine({
                underline: hover.underline,
                strike: hover.strike
            })};
            }
          }
        `}
        ${active &&
            css `
          > .avatar {
            > .avatar-button {
              &:not(:disabled):not(.disabled):active,
              &:not(:disabled):not(.disabled).active,
              &[aria-expanded='true'] {
                background-color: ${active.bg};
                border-color: ${active.bg};
              }
            }
          }
          > .avatar-label {
            &:not(:disabled):not(.disabled):active,
            &:not(:disabled):not(.disabled).active {
              color: ${active.color};
              font-style: ${(active === null || active === void 0 ? void 0 : active.italic) ? 'italic' : 'normal'};
              font-weight: ${(active === null || active === void 0 ? void 0 : active.bold) ? 'bold' : 'normal'};
              text-decoration: ${styleUtils.toCSSTextUnderLine({
                underline: active.underline,
                strike: active.strike
            })};
            }
          }
        `}
      }
    `;
    }, [advanced, regular, active, hover]);
};
const ControllerWidget = (props) => {
    var _a, _b, _c, _d;
    const { builderSupportModules, id, config, onInitResizeHandler } = props;
    const onlyOpenOne = (_a = config.behavior) === null || _a === void 0 ? void 0 : _a.onlyOpenOne;
    const displayType = (_b = config.behavior) === null || _b === void 0 ? void 0 : _b.displayType;
    const vertical = (_c = config === null || config === void 0 ? void 0 : config.behavior) === null || _c === void 0 ? void 0 : _c.vertical;
    const advanced = config === null || config === void 0 ? void 0 : config.appearance.advanced;
    const variant = (_d = config === null || config === void 0 ? void 0 : config.appearance) === null || _d === void 0 ? void 0 : _d.card.variant;
    const isInBuilder = ReactRedux.useSelector((state) => state.appContext.isInBuilder);
    const appMode = ReactRedux.useSelector((state) => state.appRuntimeInfo.appMode);
    const browserSizeMode = ReactRedux.useSelector((state) => state.browserSizeMode);
    React.useEffect(() => {
        onInitResizeHandler === null || onInitResizeHandler === void 0 ? void 0 : onInitResizeHandler(null, null, () => {
            setVersion((v) => v + 1);
        });
    }, [onInitResizeHandler]);
    const isBuilder = isInBuilder && appMode !== AppMode.Run;
    const Builder = isBuilder && builderSupportModules.widgetModules.Builder;
    const [version, setVersion] = React.useState(0);
    hooks.useUpdateEffect(() => {
        setVersion((v) => v + 1);
    }, [onlyOpenOne, displayType, appMode, browserSizeMode]);
    const style = useStyle(vertical);
    const advanStyle = useAdvancedStyle(variant, advanced);
    return (jsx("div", { className: 'widget-controller jimu-widget shadow rw-controller', css: [style, advanStyle] },
        jsx("div", { className: 'controller-container' },
            !isBuilder && (jsx(Runtime, { id: id, version: version, config: config })),
            isBuilder && Builder && (jsx(Builder, { id: id, version: version, config: config })))));
};
ControllerWidget.versionManager = versionManager;
export default ControllerWidget;
//# sourceMappingURL=widget.js.map