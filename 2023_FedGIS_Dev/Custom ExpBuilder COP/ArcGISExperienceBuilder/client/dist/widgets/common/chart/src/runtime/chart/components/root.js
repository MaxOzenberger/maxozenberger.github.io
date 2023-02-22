import { React, classNames } from 'jimu-core';
import { styled } from 'jimu-theme';
import { Loading } from 'jimu-ui';
import { Placeholder } from './placeholder';
const Root = styled.div((props) => {
    return `
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: ${props.background} !important;
      .chart-toolbar {
        height: ${props.showTools ? '38px' : '0px'};
      }
      .chart-container {
        height: ${props.showTools ? 'calc(100% - 38px)' : '100%'} !important;
        > .web-chart {
          height: 100%
          width: 100%;
        }
      }
      .arcgis-charts-modal-content, .arcgis-charts-ampopup-content, .arcgis-charts-modal-curtain, .arcgis-charts-ampopup-curtain {
        z-index: auto;
      }
    `;
});
export const ChartRoot = (props) => {
    const { className, showPlaceholder, showLoading, background, tools, templateType, messageType, message, children } = props;
    return (React.createElement(Root, { showTools: !!tools, background: background, className: classNames('chart-root', className) },
        showPlaceholder && (React.createElement(Placeholder, { templateType: templateType, message: message, messageType: messageType, showMessage: !!message })),
        !showPlaceholder && React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'chart-toolbar' }, tools),
            React.createElement("div", { className: 'chart-container' },
                children,
                showLoading && React.createElement(Loading, { type: 'DONUT' })))));
};
//# sourceMappingURL=root.js.map