import { css } from 'jimu-core';
export function getStyle(theme, widgetConfig) {
    const root = theme.surfaces[1].bg;
    return css `
    overflow: auto;
    width: 100%;
    height: 100%;
    background-color: ${root};
    .widget-utility-trace {
      width: 100%;
      height: 100%;
      background-color: ${root};
    }
  `;
}
//# sourceMappingURL=style.js.map