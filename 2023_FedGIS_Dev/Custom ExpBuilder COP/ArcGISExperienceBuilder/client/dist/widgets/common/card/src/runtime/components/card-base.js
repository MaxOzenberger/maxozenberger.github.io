/** @jsx jsx */
import { React, css } from 'jimu-core';
export default class Card extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.formatMessage = (id, values) => {
            return this.props.formatMessage(id, values);
        };
        this.getStyle = (status) => {
            const { widgetId } = this.props;
            const isBackgroundTransparent = this.checkIsBackgroundTransparent(status);
            return css `
      &,
      .animation-list {
        overflow: hidden;
      }
      .card-link {
        cursor: pointer;
      }
      ${'&.card-' + widgetId} {
        padding: 0;
        border: 0;
        background-color: transparent;
        height: 100%;
        position: relative;
        .card-content {
          width: 100%;
          height: 100%;
          /* overflow: hidden; */
          & > div {
            width: 100%;
            height: 100%;
          }
        }
      }
      .edit-mask {
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 10;
      }
      .clear-background {
        background: transparent !important;
      }
      .card-link {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      .clear-background:focus {
        outline: none;
      }
      .surface-1 {
        border: none !important;
        background: ${isBackgroundTransparent && 'none !important'};
      }
      .jimu-link {
        text-align: left;
      }
      ${'&.card-' + widgetId}:hover {
      }
    `;
        };
    }
    checkIsBackgroundTransparent(status) {
        var _a, _b, _c;
        const { cardConfigs } = this.props;
        return ((_c = (_b = (_a = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs[status]) === null || _a === void 0 ? void 0 : _a.backgroundStyle) === null || _b === void 0 ? void 0 : _b.background) === null || _c === void 0 ? void 0 : _c.color) === 'rgba(0,0,0,0)';
    }
}
//# sourceMappingURL=card-base.js.map