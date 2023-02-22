/** @jsx jsx */
import { React, css, AppMode, polished } from 'jimu-core';
export default class ListCard extends React.Component {
    constructor() {
        super(...arguments);
        this.getNewProviderData = () => {
            const { widgetId, datasourceId, index, record } = this.props;
            return {
                widgetId: widgetId,
                dataSourceId: datasourceId,
                recordIndex: index,
                record: record
            };
        };
        this.shouldComponentUpdateExcept = (nextProps, nextStats, exceptPropKeys, exceptStatKeys = []) => {
            let shouldUpdate = false;
            this.props &&
                Object.keys(this.props).some(key => {
                    if (exceptPropKeys.includes(key))
                        return false;
                    if (this.props[key] !== nextProps[key]) {
                        // console.log(`props has changed: ${key}`)
                        shouldUpdate = true;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            this.state &&
                Object.keys(this.state).some(key => {
                    if (exceptStatKeys.includes(key))
                        return false;
                    if (this.state[key] !== nextStats[key]) {
                        // console.log(`states has changed: ${key}`)
                        shouldUpdate = true;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            return shouldUpdate;
        };
        this.isProviderEqual = (providerData, oldProviderData) => {
            let isEqual = true;
            if (providerData) {
                Object.keys(providerData).some(key => {
                    if (!oldProviderData) {
                        isEqual = false;
                        return true;
                    }
                    const data = providerData[key];
                    const oldData = oldProviderData[key];
                    if (data !== oldData) {
                        isEqual = false;
                        return true;
                    }
                    return false;
                });
            }
            else if (oldProviderData) {
                return false;
            }
            return isEqual;
        };
        this.formatMessage = (id, values) => {
            return this.props.formatMessage(id, values);
        };
        this.getStyle = (status) => {
            const { widgetId, selectable, appMode, theme } = this.props;
            const isBackgroundTransparent = this.checkIsBackgroundTransparent(status);
            return css `
      ${'&.list-card-' + widgetId} {
        padding: 0;
        border: 0;
        background-color: transparent;
        &:focus {
          outline: ${polished.rem(2)} solid ${theme.colors.palette.primary[700]};
          outline-offset: ${polished.rem(2)};
        }
        .list-card-content {
          width: 100%;
          height: 100%;
        }
      }
      &.surface-1 {
        border: none !important;
        background: ${isBackgroundTransparent && 'none !important'};
      }
      .list-clear-background {
        background: transparent !important;
      }
      .list-link {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      .list-item-con {
        overflow: hidden;
      }
      ${'&.list-card-' + widgetId}:hover {
        ${(!window.jimuConfig.isInBuilder || appMode === AppMode.Run) &&
                selectable
                ? 'cursor: pointer;'
                : ''}
      }
      .card-editor-mask {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
      }
      .jimu-link {
        text-align: left;
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
//# sourceMappingURL=list-card-base.js.map