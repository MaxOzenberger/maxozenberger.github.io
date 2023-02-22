import { css } from 'jimu-core';
export function getStyle(theme) {
    return css `
  .overflow-hidden {
      overflow: hidden
  }

  [calcite-hydrated-hidden] {
      visibility: hidden;
      pointer-events: none
  }

  arcgis-infographic{
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      /* 16:9 aspect ratio */
      padding-top: 56.25% !important;
      position: relative !important;
  }

  arcgis-infographic iframe {
    border: 0 !important;
    height: 100% !important;
    left: 0 !important;
    position: absolute !important;
    top: 0 !important;
    width: 100% !important;
  }`;
}
//# sourceMappingURL=style.js.map