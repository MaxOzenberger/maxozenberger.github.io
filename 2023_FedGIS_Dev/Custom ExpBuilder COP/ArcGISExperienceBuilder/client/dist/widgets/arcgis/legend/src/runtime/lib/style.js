import { css } from 'jimu-core';
import { styleUtils } from 'jimu-ui';
export function getStyle(theme, style) {
    var _a, _b, _c, _d, _e, _f, _g;
    const fillStyleCss = styleUtils.toCSSStyle({ background: style.background });
    delete fillStyleCss.backgroundColor;
    const fontColor = style.fontColor || ((_c = (_b = (_a = theme.arcgis.widgets.legend.variants) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.root) === null || _c === void 0 ? void 0 : _c.color);
    const root = ((_d = style.background) === null || _d === void 0 ? void 0 : _d.color) || theme.surfaces[1].bg;
    const cardRoot = theme.surfaces[1].bg;
    // const cardCarousel = theme.surfaces[1].bg;
    // const cardCaption = theme.surfaces[1].bg;
    return css `
    overflow: auto;
    .widget-legend {
      width: 100%;
      height: 100%;
      min-height: 32px;
      /*background-color: ${(_g = (_f = (_e = theme.arcgis.widgets.legend.variants) === null || _e === void 0 ? void 0 : _e.card) === null || _f === void 0 ? void 0 : _f.root) === null || _g === void 0 ? void 0 : _g.bg};*/
      background-color: ${root};
      position: relative;
      ${fillStyleCss}

      .esri-legend {
        background-color: transparent;
        color: ${fontColor};
        height: 100%;
      }

      .esri-legend.esri-widget.esri-widget--panel {
        .esri-legend__layer {
          overflow-x: hidden;
        }
      }

      .esri-legend--card {
        background-color: transparent;
        color: ${fontColor};
        height: 100%;
      }

      .esri-legend--card.esri-legend--stacked{
      /*
        position: absolute;
        height: 100%;
        width: 100%;
      */
        flex-direction: column;
        justify-content: space-between;
      }

      .esri-legend--card__section {
        width: 100%;
        height: unset;
        margin-bottom: 32px;
      }

      .esri-legend--card__carousel-indicator-container {
        order: 1;
        color: ${fontColor};
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
      }

      .esri-legend--card__service-caption-container {
        color: ${fontColor};
      }

      .esri-legend--card.esri-widget{
        background-color: ${cardRoot};
      }

      /* .esri-legend {
        background-color: ${theme.colors.palette.light[100]};
        color: ${theme.colors.black}
      }

      .esri-widget__heading {
        color: ${theme.colors.black};
      }

      .esri-legend--card.esri-widget{
        background-color: ${theme.colors.palette.light[300]};
        color: ${theme.colors.black}
      }

      .esri-legend--card__section {
        width: 100%;
        background-color: ${theme.colors.palette.light[100]};
        color: ${theme.colors.black}
      }

      .esri-legend--card__carousel-indicator-container {
        background-color: ${theme.colors.palette.light[300]};
      }

      .esri-legend--card__service {
        width: 100%;
      }

      .esri-legend--card__service-caption-container {
        background-color: ${theme.colors.palette.light[300]};
        color: ${theme.colors.black};
      } */

      /*
      .esri-legend--card__carousel-indicator {
        background-color: ${theme.colors.palette.dark[900]};
      }
      */
    }
  `;
}
//# sourceMappingURL=style.js.map